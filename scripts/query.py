import argparse
import json
import re
import sys
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEAMS = set("ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LA LAC LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WAS".split())
PLAYER_FIELDS = ("full_name", "position", "team", "status", "injury_status", "practice_participation", "gsis_id")
STAT_FIELDS = ("player_id", "player_display_name", "position", "season", "recent_team", "games", "week", "attempts", "passing_yards", "passing_tds", "passing_interceptions", "carries", "rushing_yards", "rushing_tds", "targets", "receptions", "receiving_yards", "receiving_tds", "fantasy_points", "fantasy_points_ppr")
GAME_FIELDS = ("game_id", "season", "week", "gameday", "gametime", "away_team", "home_team", "away_score", "home_score")
SOURCE_FIELDS = ("url", "observed_at", "status", "sha256", "upstream_last_modified", "records", "error", "note")
CAUTIONS = [
    "Public observations only; no projections, rankings, roster availability, or official injury confirmation.",
    "Fresh retrieval does not prove upstream facts are fresh. Recheck time-sensitive evidence before decisions.",
    "Missing or unmatched statistics are unknown, not zero. Current weekly rows and prior-season totals are separate samples.",
]


def timestamp(value):
    result = datetime.fromisoformat(value)
    if result.tzinfo is None:
        raise ValueError("Observation timestamp must include a timezone")
    return result.astimezone(timezone.utc)


def load_snapshot(path):
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(value, dict) or value.get("schema_version") not in {1, 2}:
            raise ValueError
        timestamp(value["observed_at"])
        for field, kind in (("players", dict), ("sources", dict), ("state", dict), ("current_stats", list), ("prior_stats", list), ("schedule", list)):
            if field in value and not isinstance(value[field], kind):
                raise ValueError
        records = [*value.get("players", {}).values(), *value.get("sources", {}).values(), *value.get("current_stats", []), *value.get("prior_stats", []), *value.get("schedule", [])]
        if any(not isinstance(record, dict) for record in records):
            raise ValueError
        if any(player.get(field) is not None and not isinstance(player[field], str) for player in value.get("players", {}).values() for field in PLAYER_FIELDS):
            raise ValueError
        return value
    except (OSError, UnicodeError, ValueError, KeyError, TypeError):
        raise ValueError("Could not read a supported public snapshot with a timezone-aware observation") from None


def source(snapshot, name):
    meta = snapshot.get("sources", {}).get(name, {})
    return {"name": name, **{key: meta[key] for key in SOURCE_FIELDS if key in meta}, "status": meta.get("status", "missing")}


def observation(snapshot, now=None):
    now = now or datetime.now(timezone.utc)
    age = (now - timestamp(snapshot["observed_at"])).total_seconds() / 86400
    state = snapshot.get("state", {})
    return {
        "observed_at": snapshot["observed_at"],
        "health": snapshot.get("health", "unknown"),
        "provider_season": state.get("season"),
        "provider_phase": state.get("season_type"),
        "provider_display_week": state.get("display_week"),
        "freshness": {"evaluated_at": now.isoformat(), "age_days": round(age, 3), "status": "future_dated" if age < -0.1 else "stale" if age > 8 else "within_8_day_window"},
        "season_source": source(snapshot, "sleeper_state"),
    }


def normalize_name(value):
    return " ".join(value.casefold().split())


def team_code(value):
    normalized = value.upper()
    normalized = "LA" if normalized == "LAR" else normalized
    if normalized not in TEAMS:
        raise argparse.ArgumentTypeError("Use a current NFL team abbreviation; LA and LAR both select the Rams")
    return normalized


def team_matches(raw, selected):
    return ("LA" if raw == "LAR" else raw) == selected


def bounded(value, maximum=25):
    try:
        result = int(value)
    except ValueError:
        raise argparse.ArgumentTypeError("Limit must be an integer") from None
    if not 1 <= result <= maximum:
        raise argparse.ArgumentTypeError(f"Limit must be between 1 and {maximum}")
    return result


def history_count(value):
    if value == "0":
        return 0
    return bounded(value, 8)


def calendar_date(value):
    try:
        return date.fromisoformat(value).isoformat()
    except ValueError:
        raise argparse.ArgumentTypeError("Use an ISO date: YYYY-MM-DD") from None


def player_record(pid, player):
    return {"id_namespace": "sleeper", "sleeper_id": pid, **{field: player.get(field) for field in PLAYER_FIELDS}}


def selection(rows, limit):
    return {"total_matches": len(rows), "returned": min(len(rows), limit), "truncated": len(rows) > limit, "rows": rows[:limit]}


def find_players(snapshot, name, team=None, position=None):
    needle = normalize_name(name)
    if not needle:
        raise ValueError("A nonempty public player name is required")
    matches = []
    for pid, player in snapshot.get("players", {}).items():
        if needle not in normalize_name(player.get("full_name") or ""):
            continue
        if team and not team_matches(player.get("team"), team):
            continue
        if position and player.get("position") != position:
            continue
        matches.append(player_record(pid, player))
    return sorted(matches, key=lambda row: (normalize_name(row["full_name"]), row["sleeper_id"]))


def catalog_available(snapshot):
    return "players" in snapshot and source(snapshot, "sleeper_players")["status"] == "ok"


def search(snapshot, name, limit=5, team=None, position=None):
    rows = find_players(snapshot, name, team, position) if catalog_available(snapshot) else []
    return {"status": "unavailable" if not catalog_available(snapshot) else "ok" if rows else "no_matches", "source": source(snapshot, "sleeper_players"), **selection(rows, limit)}


def identity_mapping(snapshot, pid):
    gsis_id = snapshot["players"][pid].get("gsis_id")
    status = "eligible_for_exact_join"
    if not gsis_id:
        status = "missing_gsis_id"
    elif not isinstance(gsis_id, str) or not re.fullmatch(r"00-\d{7}", gsis_id):
        status = "invalid_gsis_id"
    elif sum(player.get("gsis_id") == gsis_id for player in snapshot["players"].values()) != 1:
        status = "ambiguous_gsis_mapping"
    return {"status": status, "sleeper_id": pid, "gsis_id": gsis_id, "method": "Exact Sleeper gsis_id to nflverse player_id equality; no name or Sleeper-ID fallback"}


def stat_evidence(snapshot, dataset, mapping, limit):
    current = dataset == "current_stats"
    provenance = source(snapshot, "nflverse_" + dataset)
    raw_season = str(snapshot.get("state", {}).get("season", ""))
    season = str(int(raw_season) - (0 if current else 1)) if re.fullmatch(r"20\d{2}", raw_season) else None
    result = {
        "id_namespace": "nflverse_gsis",
        "sample": "regular_season_weekly" if current else "regular_season_totals",
        "season": season,
        "source": provenance,
        "availability": "missing" if dataset not in snapshot else "unavailable" if provenance["status"] != "ok" else "available" if snapshot[dataset] else "empty",
        "match_status": "not_evaluated",
    }
    rows = []
    if result["availability"] == "available":
        if mapping["status"] != "eligible_for_exact_join":
            result["match_status"] = mapping["status"]
        elif season is None:
            result["match_status"] = "unknown_season"
        else:
            matched = [row for row in snapshot[dataset] if row.get("player_id") == mapping["gsis_id"]]
            rows = [row for row in matched if str(row.get("season")) == season]
            result["excluded_other_season_rows"] = len(matched) - len(rows)
            result["match_status"] = "matched" if rows else "no_matching_stats"
            rows.sort(key=lambda row: (float(row.get("week") or 0), str(row.get("recent_team") or "")), reverse=True)
    return {**result, **selection([{field: row.get(field) for field in STAT_FIELDS} for row in rows], limit)}


def player_evidence(snapshot, pid, limit):
    player = snapshot.get("players", {}).get(pid)
    if not catalog_available(snapshot):
        return {"status": "catalog_unavailable", "source": source(snapshot, "sleeper_players")}
    if player is None:
        return {"status": "player_absent", "sleeper_id": pid, "source": source(snapshot, "sleeper_players")}
    mapping = identity_mapping(snapshot, pid)
    return {
        "status": "ok",
        "player": player_record(pid, player),
        "source": source(snapshot, "sleeper_players"),
        "identity_mapping": mapping,
        "current_stats": stat_evidence(snapshot, "current_stats", mapping, limit),
        "prior_stats": stat_evidence(snapshot, "prior_stats", mapping, limit),
    }


def recent_history(snapshot, pid, directory, count, limit, now=None):
    if count == 0:
        return {"requested": 0, "status": "not_requested", "rows": []}
    if not directory.is_dir():
        return {"requested": count, "status": "archive_directory_missing", "rows": []}
    candidates, ignored = [], 0
    selected_time = timestamp(snapshot["observed_at"])
    for path in directory.glob("*.json"):
        try:
            if not re.fullmatch(r"20\d{2}-\d{2}-\d{2}T\d{12}Z", path.stem):
                raise ValueError
            archived_time = datetime.strptime(path.stem, "%Y-%m-%dT%H%M%S%fZ").replace(tzinfo=timezone.utc)
        except ValueError:
            ignored += 1
            continue
        if archived_time < selected_time:
            candidates.append((archived_time, path))
    rows = []
    for archived_time, path in sorted(candidates, reverse=True)[:count]:
        try:
            older = load_snapshot(path)
            if timestamp(older["observed_at"]) != archived_time:
                raise ValueError("Archive timestamp does not match filename")
            evidence = player_evidence(older, pid, limit)
            changes = []
            if evidence["status"] == "ok":
                old_player = older["players"][pid]
                player = snapshot["players"][pid]
                changes = [{"field": field, "before": old_player.get(field), "after": player.get(field)} for field in PLAYER_FIELDS if old_player.get(field) != player.get(field)]
            rows.append({"archive": path.name, "observation": observation(older, now), "evidence": evidence, "provider_field_changes_to_selected_observation": changes})
        except ValueError:
            rows.append({"archive": path.name, "status": "invalid_archive", "note": "Archive unreadable or timestamp mismatch; no evidence used"})
    return {"requested": count, "status": "ok" if rows else "no_earlier_observations", "available_earlier_archives": len(candidates), "ignored_noncanonical_filenames": ignored, "returned": len(rows), "truncated": len(candidates) > count, "rows": rows}


def player_query(snapshot, sleeper_id=None, name=None, limit=5, history=0, history_dir=None, now=None):
    if not catalog_available(snapshot):
        return {"status": "unavailable", "source": source(snapshot, "sleeper_players")}
    if sleeper_id is not None:
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,30}", sleeper_id):
            raise ValueError("Invalid public Sleeper ID")
        pid = sleeper_id if sleeper_id in snapshot["players"] else None
    else:
        matches = find_players(snapshot, name or "")
        if len(matches) > 1:
            return {"status": "ambiguous", "note": "Choose an explicit Sleeper ID; no player evidence has been selected", "source": source(snapshot, "sleeper_players"), "candidates": selection(matches, limit)}
        pid = matches[0]["sleeper_id"] if matches else None
    if pid is None:
        return {"status": "no_matches", "source": source(snapshot, "sleeper_players"), "note": "Catalog absence does not establish roster or real-world availability"}
    return {**player_evidence(snapshot, pid, limit), "history": recent_history(snapshot, pid, history_dir or ROOT / "data/snapshots", history, limit, now)}


def bye_evidence(snapshot, team):
    result = {"status": "unknown_incomplete_schedule", "weeks": None, "basis": "Requires a successful source, 272 unique same-season games, all 32 teams with 17 games each, and no repeated team/week slots in weeks 1-18"}
    rows = snapshot.get("schedule", [])
    season = str(snapshot.get("state", {}).get("season", ""))
    if source(snapshot, "nflverse_schedule")["status"] != "ok" or len(rows) != 272:
        return result
    if len({row.get("game_id") for row in rows}) != 272 or any(not row.get("game_id") for row in rows):
        return result
    weeks = {code: set() for code in TEAMS}
    for row in rows:
        if str(row.get("season")) != season or not re.fullmatch(r"(?:[1-9]|1[0-8])", str(row.get("week"))):
            return result
        week = int(row["week"])
        teams = ["LA" if row.get(field) == "LAR" else row.get(field) for field in ("away_team", "home_team")]
        if teams[0] == teams[1] or any(code not in TEAMS or week in weeks[code] for code in teams):
            return result
        for code in teams:
            weeks[code].add(week)
    if any(len(played) != 17 for played in weeks.values()):
        return result
    return {**result, "status": "inferred_from_complete_schedule", "weeks": sorted(set(range(1, 19)) - weeks[team])}


def schedule_query(snapshot, team, limit=5, week=None, from_date=None):
    team = team_code(team)
    provenance = source(snapshot, "nflverse_schedule")
    available = "schedule" in snapshot and provenance["status"] == "ok"
    start = None if week is not None else from_date or snapshot["observed_at"][:10]
    season = str(snapshot.get("state", {}).get("season", ""))
    rows = []
    if available:
        rows = [row for row in snapshot["schedule"] if str(row.get("season")) == season and any(team_matches(row.get(field), team) for field in ("away_team", "home_team"))]
        rows = [row for row in rows if str(row.get("week")) == str(week)] if week is not None else [row for row in rows if row.get("gameday", "") >= start]
        rows.sort(key=lambda row: (row.get("gameday", ""), row.get("gametime", ""), row.get("game_id", "")))
        rows = [{field: row.get(field) for field in GAME_FIELDS} for row in rows]
    return {"status": "unavailable" if not available else "ok" if rows else "no_matches", "team_filter": team, "season": season or None, "week_filter": week, "from_date": start, "time_zone": "America/New_York", "source": provenance, "bye_evidence": bye_evidence(snapshot, team), "note": "Raw provider team codes are preserved. A no-match result is not itself bye evidence; any full-season bye inference is separately labeled and schedules can change.", **selection(rows, limit)}


def main(argv=None):
    parser = argparse.ArgumentParser(description="Read-only, bounded public evidence retrieval; JSON to stdout. No network or saved queries.")
    parser.add_argument("--snapshot", type=Path, default=ROOT / "data/latest.json")
    sub = parser.add_subparsers(dest="command", required=True)
    find = sub.add_parser("search", help="Case-insensitive substring search of the public player catalog")
    find.add_argument("name")
    find.add_argument("--team", type=team_code)
    find.add_argument("--position", choices=("QB", "RB", "WR", "TE", "K", "DEF"))
    player = sub.add_parser("player", help="Select one public player and separate current/prior statistics")
    identity = player.add_mutually_exclusive_group(required=True)
    identity.add_argument("--name")
    identity.add_argument("--sleeper-id")
    player.add_argument("--history", type=history_count, default=0, help="Earlier archived observations to read, 0-8")
    player.add_argument("--history-dir", type=Path, default=ROOT / "data/snapshots")
    schedule = sub.add_parser("schedule", help="Regular-season games for one team")
    schedule.add_argument("--team", required=True, type=team_code)
    dates = schedule.add_mutually_exclusive_group()
    dates.add_argument("--week", type=lambda value: bounded(value, 18))
    dates.add_argument("--from", dest="from_date", type=calendar_date)
    for command in (find, player, schedule):
        command.add_argument("--limit", type=bounded, default=5, help="Maximum rows per result/sample, 1-25; default 5")
    args = parser.parse_args(argv)
    try:
        snapshot = load_snapshot(args.snapshot)
        now = datetime.now(timezone.utc)
        if args.command == "search":
            result = search(snapshot, args.name, args.limit, args.team, args.position)
        elif args.command == "player":
            result = player_query(snapshot, args.sleeper_id, args.name, args.limit, args.history, args.history_dir, now)
        else:
            result = schedule_query(snapshot, args.team, args.limit, args.week, args.from_date)
        output = {"query_schema_version": 1, "command": args.command, "observation": observation(snapshot, now), "cautions": CAUTIONS, **result}
        print(json.dumps(output, ensure_ascii=False, indent=2, allow_nan=False))
        return 0
    except (ValueError, TypeError, KeyError):
        print(json.dumps({"status": "invalid_snapshot_or_query", "message": "Could not read the requested public evidence; check the snapshot schema, inputs, and repository validation"}))
        return 2


if __name__ == "__main__":
    sys.exit(main())
