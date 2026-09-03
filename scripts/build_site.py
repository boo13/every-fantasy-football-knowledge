import argparse
import json
import shutil
import sys
from pathlib import Path

import query

ROOT = Path(__file__).resolve().parents[1]
POSITIONS = {"QB", "RB", "WR", "TE", "K", "DEF"}
SOURCE_NAMES = ("sleeper_state", "sleeper_players", "nflverse_schedule", "nflverse_current_stats", "nflverse_prior_stats")
SOURCE_FIELDS = ("name", "url", "status", "observed_at", "sha256")
HISTORY_FIELDS = ("games", "passing_yards", "passing_tds", "rushing_yards", "rushing_tds", "carries", "targets", "receptions", "receiving_yards", "receiving_tds")


def player_history(snapshot, pid):
    if snapshot["players"][pid].get("position") not in {"QB", "RB", "WR", "TE"}:
        return None, "unsupported_position"
    mapping = query.identity_mapping(snapshot, pid)
    evidence = query.stat_evidence(snapshot, "prior_stats", mapping, limit=2)
    if evidence["availability"] != "available":
        status = {"missing": "missing_dataset", "unavailable": "source_unavailable", "empty": "empty_dataset"}
        return None, status[evidence["availability"]]
    if evidence["match_status"] != "matched":
        status = "wrong_season" if evidence.get("excluded_other_season_rows") else evidence["match_status"]
        return None, status
    if evidence["total_matches"] != 1:
        return None, "duplicate_prior_stats"
    row = evidence["rows"][0]
    if row["week"] is not None:
        return None, "not_season_total"
    ppr, games = row["fantasy_points_ppr"], row["games"]
    return {
        **{field: row[field] for field in HISTORY_FIELDS},
        "ppr": ppr,
        "ppr_per_game": round(ppr / games, 2) if ppr is not None and games is not None and games > 0 else None,
        "team": row["recent_team"],
    }, "matched"


def build_payload(snapshot):
    season = query.season_label(snapshot)
    if season is None:
        raise ValueError("A valid provider season is required")
    byes = {}
    players = []
    catalog = snapshot.get("players", {}) if query.catalog_available(snapshot) else {}
    for pid, player in catalog.items():
        name = player.get("full_name") or ""
        team = player.get("team")
        if not name.strip() or player.get("position") not in POSITIONS or not ((team or "").strip() or player.get("status") == "Active"):
            continue
        code = "LA" if team == "LAR" else team
        if code in query.TEAMS and code not in byes:
            evidence = query.bye_evidence(snapshot, code)
            byes[code] = evidence["weeks"][0] if evidence["status"] == "inferred_from_complete_schedule" else None
        history, history_status = player_history(snapshot, pid)
        players.append({
            "id": pid,
            "name": name,
            **{field: player.get(field) for field in ("position", "team", "status", "injury_status", "practice_participation")},
            "bye": byes.get(code),
            "history": history,
            "history_status": history_status,
        })
    players.sort(key=lambda player: (query.normalize_name(player["name"]), player["id"]))
    return {
        "schema_version": 1,
        "observed_at": snapshot["observed_at"],
        "season": season,
        "history_season": str(int(season) - 1),
        "health": snapshot.get("health", "unknown"),
        "sources": {name: {field: query.source(snapshot, name).get(field) for field in SOURCE_FIELDS} for name in SOURCE_NAMES},
        "players": players,
    }


def build_site(snapshot_path=ROOT / "data/latest.json", output=ROOT / "_site", site_dir=ROOT / "site"):
    snapshot_path, output, site_dir = Path(snapshot_path).resolve(), Path(output).resolve(), Path(site_dir).resolve()
    if output == site_dir or output in site_dir.parents or site_dir in output.parents or snapshot_path.is_relative_to(output):
        raise ValueError("Build output must not overlap the source assets or snapshot")
    if not (site_dir / "index.html").is_file() or any(path.is_symlink() for path in site_dir.rglob("*")):
        raise ValueError("Site assets must include index.html and cannot contain symlinks")
    payload = build_payload(query.load_snapshot(snapshot_path))
    serialized = json.dumps(payload, ensure_ascii=False, sort_keys=True, indent=2, allow_nan=False) + "\n"
    shutil.copytree(site_dir, output, dirs_exist_ok=True)
    data_dir = output / "data"
    data_dir.mkdir(exist_ok=True)
    (data_dir / "players.json").write_text(serialized, encoding="utf-8")
    return payload


def main(argv=None):
    parser = argparse.ArgumentParser(description="Build the public, offline draft-room site from a recorded snapshot.")
    parser.add_argument("--snapshot", type=Path, default=ROOT / "data/latest.json")
    parser.add_argument("--output", type=Path, default=ROOT / "_site")
    args = parser.parse_args(argv)
    try:
        payload = build_site(args.snapshot, args.output)
    except (OSError, ValueError, TypeError, KeyError):
        print("Could not build public draft-room assets; check the snapshot and source assets.", file=sys.stderr)
        return 2
    print(f"Built public draft room: {len(payload['players'])} catalog players; {payload['history_season']} historical reference.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
