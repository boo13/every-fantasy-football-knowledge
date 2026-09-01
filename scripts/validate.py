import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRIVATE_KEYS = {"owner_id", "user_id", "league_id", "roster_id", "username", "email", "phone", "birth_date", "metadata", "injury_notes", "address"}
PATTERNS = {
    "credential": re.compile(r"(?:gh[pousr]_)[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{24,}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----"),
    "personal filesystem path": re.compile(r"/(?:Users|home)/[A-Za-z0-9_.-]+/"),
    "private workspace link": re.compile(r"https?://[^\s/]*(?:slack\.com|notion\.so|linear\.app|docs\.google\.com)/", re.I),
    "email": re.compile(r"\b[A-Za-z0-9_.+-]+@(?!users\.noreply\.github\.com\b)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"),
}


def check_text(text):
    for label, pattern in PATTERNS.items():
        if pattern.search(text):
            raise ValueError(f"Possible {label}; inspect locally, do not print the matched value")


def check_keys(value):
    if isinstance(value, dict):
        if PRIVATE_KEYS.intersection(value):
            raise ValueError("Disallowed personal/league field in JSON")
        for child in value.values():
            check_keys(child)
    elif isinstance(value, list):
        for child in value:
            check_keys(child)


def validate_snapshot(value):
    from collect import PLAYER_FIELDS, allowed
    if value.get("schema_version") not in {1, 2} or not value.get("players"):
        raise ValueError("Invalid or empty snapshot")
    if value.get("health") not in {"ok", "degraded"}:
        raise ValueError("Invalid collection health")
    observed = datetime.fromisoformat(value["observed_at"])
    if observed.tzinfo is None:
        raise ValueError("Observation must include a timezone")
    if set(value["sources"]) != {"sleeper_state", "sleeper_players", "nflverse_schedule", "sleeper_add", "sleeper_drop", "nflverse_current_stats", "nflverse_prior_stats", "espn_news"}:
        raise ValueError("Missing or unexpected source")
    for name, meta in value["sources"].items():
        if not allowed(meta["url"]) or meta["observed_at"] != value["observed_at"]:
            raise ValueError("Invalid provenance")
        if meta["status"] not in {"ok", "error", "not_yet_available", "manual_research"}:
            raise ValueError("Invalid source status")
        if meta["status"] == "manual_research" and (name != "espn_news" or value["schema_version"] < 2 or value.get("news")):
            raise ValueError("Invalid manual-research coverage")
        if meta["status"] == "not_yet_available" and name != "nflverse_current_stats":
            raise ValueError("Unexpected missing source")
        if meta["status"] == "ok" and not re.fullmatch(r"[a-f0-9]{64}", meta.get("sha256", "")):
            raise ValueError("Successful sources need a content hash")
    for player in value["players"].values():
        if set(player) != set(PLAYER_FIELDS):
            raise ValueError("Unexpected player field")
    check_keys(value)
    check_text(json.dumps(value))


def validate_repo(root=ROOT):
    files = [p for p in root.rglob("*") if p.is_file() and not {".git", ".uv-cache", "__pycache__", ".venv"}.intersection(p.relative_to(root).parts)]
    for path in files:
        if path.name.startswith(".env") or path.suffix in {".pem", ".key"}:
            raise ValueError("Forbidden sensitive file type")
        try:
            content = path.read_text()
        except UnicodeDecodeError:
            raise ValueError(f"Unexpected binary file: {path.relative_to(root)}") from None
        check_text(content)
        if path.suffix == ".json":
            value = json.loads(content)
            check_keys(value)
            if path.parent.name == "snapshots" or path.name == "latest.json":
                validate_snapshot(value)
    latest = root / "data/latest.json"
    if latest.exists():
        value = json.loads(latest.read_text())
        age = (datetime.now(timezone.utc) - datetime.fromisoformat(value["observed_at"])).total_seconds() / 86400
        if "--fresh" in sys.argv and (age < -0.1 or age > 8):
            raise ValueError("Latest snapshot is stale or future-dated")
        if "--healthy" in sys.argv and value["health"] != "ok":
            raise ValueError("Collection is degraded; inspect source health")
        if not any(p.read_bytes() == latest.read_bytes() for p in (root / "data/snapshots").glob("*.json")):
            raise ValueError("Latest snapshot has no matching immutable archive")
    elif "--fresh" in sys.argv:
        raise ValueError("No current snapshot")
    print(f"Validated {len(files)} text files and snapshot provenance; automated checks do not replace human privacy review.")


if __name__ == "__main__":
    validate_repo()
