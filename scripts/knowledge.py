import argparse
import ipaddress
import json
import re
import subprocess
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
QUESTION_STATES = {"open", "answered", "retired"}
HYPOTHESIS_STATES = {"open", "supported", "not_supported", "inconclusive", "retired"}
MUTABLE_FIELDS = {"status", "review_on", "reviews"}


def timestamp(value):
    parsed = datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        raise ValueError("Evidence timestamps require a timezone")
    return parsed


def public_urls(values):
    if not isinstance(values, list) or not values:
        raise ValueError("Cited evidence requires at least one public URL")
    for value in values:
        parsed = urlsplit(value)
        if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
            raise ValueError("Evidence URLs must be HTTPS without credentials")
        host = parsed.hostname.rstrip(".")
        try:
            address = ipaddress.ip_address(host)
        except ValueError:
            if "." not in host or host.endswith((".localhost", ".local", ".internal", ".test", ".invalid", ".example")):
                raise ValueError("Evidence URLs must not identify local or reserved hosts")
        else:
            if not address.is_global:
                raise ValueError("Evidence URLs must not identify private or reserved addresses")


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def validate_ledger(items, kind):
    if not isinstance(items, list):
        raise ValueError("A research ledger must be a list")
    seen = set()
    for item in items:
        if not isinstance(item, dict) or item.get("type") != kind:
            raise ValueError("Invalid research record type")
        prefix = "Q" if kind == "research_question" else "H"
        identifier = item.get("id", "")
        if not re.fullmatch(prefix + r"-20\d{2}-\d{3,}", identifier) or identifier in seen:
            raise ValueError("Invalid or duplicate research ID")
        seen.add(identifier)
        created = timestamp(item["created_at"])
        date.fromisoformat(item["review_on"])
        states = QUESTION_STATES if kind == "research_question" else HYPOTHESIS_STATES
        if item.get("status") not in states or not isinstance(item.get("reviews"), list):
            raise ValueError("Invalid research status or review list")
        if kind == "research_question":
            if not all(nonempty(item.get(key)) for key in ("question", "evidence_needed")):
                raise ValueError("Research questions need a question and evidence requirements")
        else:
            if timestamp(item["evidence_cutoff"]) > created:
                raise ValueError("Hypothesis evidence cutoff cannot follow creation")
            if not all(nonempty(item.get(key)) for key in ("claim", "measurement", "baseline", "confidence")):
                raise ValueError("Hypotheses need a claim, measurement, baseline and confidence")
            public_urls(item["public_sources"])
            scope = item.get("scope", {})
            if not isinstance(scope, dict) or not isinstance(scope.get("season"), int) or not 2000 <= scope["season"] <= 2099:
                raise ValueError("Hypotheses need an explicit NFL season")
            if not isinstance(scope.get("weeks"), list) or not scope["weeks"] or any(type(week) is not int or not 1 <= week <= 22 for week in scope["weeks"]):
                raise ValueError("Hypotheses need explicit outcome weeks")
            if not nonempty(scope.get("scoring_assumptions")) or not isinstance(item.get("invalidation_conditions"), list):
                raise ValueError("Hypotheses need scoring assumptions and invalidation conditions")
        last = created
        for review in item["reviews"]:
            if not isinstance(review, dict) or review.get("result") not in states or not nonempty(review.get("summary")):
                raise ValueError("Invalid research review")
            reviewed = timestamp(review["reviewed_at"])
            if reviewed < last:
                raise ValueError("Research reviews must be chronological and follow creation")
            last = reviewed
            public_urls(review["public_sources"])
        if item["reviews"]:
            if item["reviews"][-1]["result"] != item["status"]:
                raise ValueError("Research status must match the latest review")
        elif item["status"] != "open":
            raise ValueError("Closing a research record requires a cited review")


def validate_links(root):
    checked = 0
    for path in root.rglob("*.md"):
        if {".git", ".venv", "work"}.intersection(path.relative_to(root).parts):
            continue
        content = re.sub(r"(?ms)^```.*?^```[^\n]*", "", path.read_text())
        content = re.sub(r"`[^`\n]*`", "", content)
        links = re.findall(r"\[[^\]\n]*\]\((<[^>\n]+>|[^)\s]+)(?:\s+[^)]*)?\)", content)
        links += re.findall(r"(?m)^\[[^\]\n]+\]:\s*(<[^>\n]+>|\S+)", content)
        for link in links:
            parsed = urlsplit(link.strip("<>"))
            if parsed.scheme in {"https", "http", "mailto"}:
                continue
            if parsed.scheme:
                raise ValueError(f"Unsupported link scheme in {path.relative_to(root)}")
            if not parsed.path:
                continue
            target = (path.parent / unquote(parsed.path)).resolve()
            if not target.is_relative_to(root.resolve()) or not target.exists():
                raise ValueError(f"Broken or outside-repository link in {path.relative_to(root)}: {link}")
            checked += 1
    return checked


def git(root, *args):
    return subprocess.check_output(["git", "-C", str(root), *args], stderr=subprocess.PIPE)


def compare_ledger(previous, current):
    by_id = {item["id"]: item for item in current}
    for old in previous:
        new = by_id.get(old["id"])
        if new is None:
            raise ValueError("A historical research record was removed")
        old_fields = {key: value for key, value in old.items() if key not in MUTABLE_FIELDS}
        new_fields = {key: value for key, value in new.items() if key not in MUTABLE_FIELDS}
        if old_fields != new_fields:
            raise ValueError("Original research claim or evidence was rewritten; add a new record instead")
        if new["reviews"][:len(old["reviews"])] != old["reviews"]:
            raise ValueError("Research review history must be append-only")


def preserve_history(root, ref):
    if not re.fullmatch(r"(?:[0-9a-fA-F]{7,40}|HEAD(?:~\d+)?|origin/main)", ref):
        raise ValueError("Baseline must be a commit SHA, HEAD, HEAD~N or origin/main")
    commit = git(root, "rev-parse", "--verify", "--end-of-options", ref + "^{commit}").decode().strip()
    paths = git(root, "ls-tree", "-rz", "--name-only", commit, "--", "data/snapshots", "context/weekly", "research").decode().split("\0")
    checked = 0
    for relative in filter(None, paths):
        path = root / relative
        if relative in {"research/questions.json", "research/hypotheses.json"}:
            old = json.loads(git(root, "show", f"{commit}:{relative}"))
            if not path.exists():
                raise ValueError("A historical research ledger was removed")
            compare_ledger(old, json.loads(path.read_text()))
        elif relative.startswith(("data/snapshots/", "context/weekly/")):
            if not path.exists() or path.read_bytes() != git(root, "show", f"{commit}:{relative}"):
                raise ValueError(f"Immutable observation changed: {relative}")
        elif path.suffix == ".md" and re.match(r"\d{4}-\d{2}-\d{2}", path.name):
            if not path.exists() or not path.read_bytes().startswith(git(root, "show", f"{commit}:{relative}")):
                raise ValueError(f"Dated research was rewritten: {relative}; append a correction instead")
        checked += 1
    return checked


def report(root, today):
    output = {"as_of": today.isoformat(), "ledgers": {}, "due": []}
    for filename, kind in (("questions.json", "research_question"), ("hypotheses.json", "hypothesis")):
        path = root / "research" / filename
        items = json.loads(path.read_text()) if path.exists() else []
        validate_ledger(items, kind)
        counts = {}
        for item in items:
            counts[item["status"]] = counts.get(item["status"], 0) + 1
            if item["status"] == "open" and date.fromisoformat(item["review_on"]) <= today:
                output["due"].append({"id": item["id"], "review_on": item["review_on"], "type": kind})
        output["ledgers"][filename] = {"records": len(items), "status_counts": counts}
    output["note"] = "Question answers are not forecast wins; no predictive accuracy is inferred."
    return output


def main():
    parser = argparse.ArgumentParser(description="Audit research evidence and show due reviews without network access")
    parser.add_argument("--against", help="Check existing evidence/review history against a Git baseline")
    parser.add_argument("--ci", action="store_true", help="Read the GitHub event baseline for push/pull_request")
    parser.add_argument("--as-of", type=date.fromisoformat, default=datetime.now(timezone.utc).date())
    args = parser.parse_args()
    ref = args.against
    if args.ci:
        import os
        event_path = os.environ.get("GITHUB_EVENT_PATH")
        if not event_path:
            parser.error("--ci requires a GitHub event payload")
        event = json.loads(Path(event_path).read_text())
        ref = event.get("pull_request", {}).get("base", {}).get("sha") or event.get("before")
        if not isinstance(ref, str) or not re.fullmatch(r"[0-9a-fA-F]{40}", ref):
            parser.error("GitHub event has no valid push/PR baseline")
        if set(ref) == {"0"}:
            ref = None
    output = report(ROOT, args.as_of)
    output["local_links_checked"] = validate_links(ROOT)
    output["historical_paths_checked"] = preserve_history(ROOT, ref) if ref else None
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
