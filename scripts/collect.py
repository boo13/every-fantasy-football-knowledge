import argparse
import csv
import hashlib
import io
import json
import math
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://api.sleeper.app/v1/"
SCHEDULE = "https://github.com/nflverse/nflverse-data/releases/download/schedules/games.csv"
NEWS = "https://www.espn.com/espn/rss/nfl/news"
STATS = "https://github.com/nflverse/nflverse-data/releases/download/stats_player/"
POSITIONS = {"QB", "RB", "WR", "TE", "K", "DEF"}
PLAYER_FIELDS = ("full_name", "position", "team", "status", "injury_status", "practice_participation", "gsis_id")
STAT_NUMBERS = ("games", "week", "attempts", "passing_yards", "passing_tds", "passing_interceptions", "carries", "rushing_yards", "rushing_tds", "targets", "receptions", "receiving_yards", "receiving_tds", "fantasy_points", "fantasy_points_ppr")
GAME_FIELDS = ("game_id", "season", "week", "gameday", "gametime", "away_team", "home_team", "away_score", "home_score")


def clean(value, limit=240):
    if value is None:
        return None
    return " ".join(str(value).split())[:limit]


def md(value):
    return (clean(value) or "unknown").replace("|", "/").replace("<", "&lt;").replace(">", "&gt;").replace("[", "\\[").replace("]", "\\]")


def allowed(url):
    exact = {BASE + "state/nfl", BASE + "players/nfl", SCHEDULE, NEWS, "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"}
    exact.update(BASE + f"players/nfl/trending/{kind}?lookback_hours=24&limit=25" for kind in ("add", "drop"))
    return url in exact or bool(re.fullmatch(re.escape(STATS) + r"stats_player_(reg|week)_20\d{2}\.csv", url))


def fetch(url):
    if not allowed(url):
        raise ValueError("URL is outside the public source allowlist")
    request = urllib.request.Request(url, headers={"User-Agent": "every-fantasy-football-knowledge/1.0"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                body = response.read(25_000_001)
                if len(body) > 25_000_000:
                    raise ValueError("Source exceeded size limit")
                return body, response.headers.get("Last-Modified")
        except urllib.error.HTTPError as error:
            if error.code not in {429, 500, 502, 503, 504} or attempt == 2:
                raise
            error.close()
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                raise
        time.sleep(2 ** attempt)


def parse_state(body):
    value = json.loads(body)
    if not re.fullmatch(r"20\d{2}", str(value.get("season", ""))):
        raise ValueError("Missing NFL season")
    return {key: value.get(key) for key in ("season", "season_type", "week", "display_week", "season_start_date")}


def parse_players(body):
    value = json.loads(body)
    if not isinstance(value, dict):
        raise ValueError("Players must be an object")
    result = {}
    for pid, player in value.items():
        if not isinstance(player, dict):
            raise ValueError("Player must be an object")
        if player.get("position") not in POSITIONS:
            continue
        if not (player.get("active") or player.get("team")):
            continue
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,30}", pid):
            raise ValueError("Invalid public player ID")
        result[pid] = {field: clean(player.get(field)) for field in PLAYER_FIELDS}
        if not result[pid]["full_name"] and player["position"] == "DEF":
            result[pid]["full_name"] = f"{player.get('team') or pid} D/ST"
    if not result:
        raise ValueError("Empty player dataset")
    return result


def parse_trends(body):
    value = json.loads(body)
    if not isinstance(value, list):
        raise ValueError("Trends must be a list")
    result = []
    for row in value[:25]:
        pid, count = row["player_id"], row["count"]
        if not isinstance(pid, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,30}", pid):
            raise ValueError("Invalid public player ID")
        if not isinstance(count, int) or count < 0:
            raise ValueError("Invalid trend count")
        result.append({"player_id": pid, "count": count})
    return result


def csv_rows(body, required):
    reader = csv.DictReader(io.StringIO(body.decode("utf-8-sig")))
    if not set(required).issubset(reader.fieldnames or []):
        raise ValueError("Upstream CSV schema changed")
    return list(reader)


def parse_games(body, season):
    rows = csv_rows(body, (*GAME_FIELDS, "game_type"))
    result = [{key: clean(row[key]) for key in GAME_FIELDS} for row in rows if row["season"] == str(season) and row["game_type"] == "REG"]
    if not result:
        raise ValueError("No schedule for requested season")
    for row in result:
        datetime.strptime(row["gameday"], "%Y-%m-%d")
        if not 1 <= int(row["week"]) <= 18:
            raise ValueError("Invalid regular season week")
    return result


def parse_stats(body, season, weekly=False):
    required = ("player_id", "player_display_name", "position", "season", "season_type", "recent_team", "fantasy_points", "fantasy_points_ppr", "carries", "targets", "receptions", "week" if weekly else "games")
    rows = csv_rows(body, required)
    result = []
    for row in rows:
        if row["season"] != str(season) or row["season_type"] != "REG" or row["position"] not in {"QB", "RB", "WR", "TE"}:
            continue
        item = {key: clean(row[key]) for key in ("player_id", "player_display_name", "position", "season", "recent_team")}
        for key in STAT_NUMBERS:
            raw = row.get(key)
            number = float(raw) if raw not in (None, "", "NA") else None
            if number is not None and not math.isfinite(number):
                raise ValueError("Non-finite stat")
            item[key] = number
        result.append(item)
    if not result:
        raise ValueError("No regular-season offensive stats")
    return result


def parse_news(body):
    root = ET.fromstring(body)
    if root.tag != "rss":
        raise ValueError("Expected RSS feed")
    result, seen = [], set()
    for row in root.findall("./channel/item"):
        url = row.findtext("link") or ""
        parsed = urllib.parse.urlsplit(url)
        if parsed.scheme != "https" or parsed.netloc not in {"www.espn.com", "espn.com"} or parsed.query or parsed.fragment or url in seen:
            continue
        date = parsedate_to_datetime(row.findtext("pubDate") or "")
        if date.tzinfo is None:
            raise ValueError("News publication time has no timezone")
        result.append({"title": clean(row.findtext("title"), 180), "url": url, "published_at": date.astimezone(timezone.utc).isoformat()})
        seen.add(url)
    if not result:
        raise ValueError("Empty news feed")
    return sorted(result, key=lambda row: row["published_at"], reverse=True)[:12]


def collect(now, fetcher=fetch):
    snapshot = {"schema_version": 1, "observed_at": now.isoformat(), "sources": {}}

    def source(name, url, parser, required=False, expected_404=False):
        meta = {"url": url, "observed_at": now.isoformat(), "status": "ok"}
        snapshot["sources"][name] = meta
        try:
            body, modified = fetcher(url)
            parsed = parser(body)
            meta.update(sha256=hashlib.sha256(body).hexdigest(), upstream_last_modified=modified, records=len(parsed))
            return parsed
        except (ValueError, KeyError, TypeError, AttributeError, ET.ParseError, urllib.error.URLError, TimeoutError) as error:
            meta["status"] = "not_yet_available" if expected_404 and isinstance(error, urllib.error.HTTPError) and error.code == 404 else "error"
            meta["error"] = f"HTTP {error.code}" if isinstance(error, urllib.error.HTTPError) else type(error).__name__
            if isinstance(error, urllib.error.HTTPError):
                error.close()
            if required:
                raise RuntimeError(f"Required public source failed: {name} ({meta['error']}); prior snapshot preserved") from None
            return None

    snapshot["state"] = source("sleeper_state", BASE + "state/nfl", parse_state, required=True)
    season = int(snapshot["state"]["season"])
    snapshot["players"] = source("sleeper_players", BASE + "players/nfl", parse_players, required=True)
    snapshot["schedule"] = source("nflverse_schedule", SCHEDULE, lambda body: parse_games(body, season)) or []
    for kind in ("add", "drop"):
        snapshot[f"trending_{kind}"] = source(f"sleeper_{kind}", BASE + f"players/nfl/trending/{kind}?lookback_hours=24&limit=25", parse_trends) or []
    start = min((row["gameday"] for row in snapshot["schedule"]), default=snapshot["state"].get("season_start_date"))
    before_stats = bool(start and now.date() <= datetime.fromisoformat(start).date() + timedelta(days=2))
    snapshot["current_stats"] = source("nflverse_current_stats", STATS + f"stats_player_week_{season}.csv", lambda body: parse_stats(body, season, weekly=True), expected_404=before_stats) or []
    snapshot["prior_stats"] = source("nflverse_prior_stats", STATS + f"stats_player_reg_{season - 1}.csv", lambda body: parse_stats(body, season - 1)) or []
    snapshot["news"] = source("espn_news", NEWS, parse_news) or []
    snapshot["health"] = "degraded" if any(meta["status"] == "error" for meta in snapshot["sources"].values()) else "ok"
    return snapshot


def changes(current, previous):
    if not previous:
        return []
    result = []
    for pid, player in current["players"].items():
        old = previous.get("players", {}).get(pid)
        if old is None:
            continue
        for field in ("team", "status", "injury_status", "practice_participation"):
            if old.get(field) != player.get(field):
                result.append({"player_id": pid, "name": player["full_name"], "field": field, "before": old.get(field), "after": player.get(field)})
    return result


def table(headers, rows):
    return ["| " + " | ".join(headers) + " |", "| " + " | ".join("---" for _ in headers) + " |", *["| " + " | ".join(md(cell) for cell in row) + " |" for row in rows], ""]


def render(snapshot, previous):
    observed = snapshot["observed_at"]
    season = int(snapshot["state"]["season"])
    lines = ["# Current public fantasy-football context", "", f"Observed at **{observed}**. Collection health: **{snapshot['health']}**.", "", "Generated evidence, not projections or start/sit advice. Treat as stale after 8 days; recheck player availability immediately before decisions. A fresh download does not prove upstream facts are fresh.", "", f"Provider season label: {season}; phase: {md(snapshot['state']['season_type'])}; display week: {md(snapshot['state']['display_week'])}. Confirm actual kickoff dates below; a provider week label does not prove games were played.", "", "## Source health and provenance", ""]
    lines += table(["Source", "Status", "Records", "URL"], ((name, meta["status"], meta.get("records", "—"), meta["url"]) for name, meta in snapshot["sources"].items()))
    lines += ["A missing or failed dataset is not zero production. No stale source is silently carried forward. Full source hashes and upstream modification headers are in data/latest.json.", "", "## Next regular-season games", "", "Schedule times are US Eastern, as supplied by nflverse; flex scheduling can change them.", ""]
    games = sorted((g for g in snapshot["schedule"] if g["gameday"] >= observed[:10]), key=lambda g: (g["gameday"], g["gametime"]))[:32]
    lines += table(["Week", "Date", "Time ET", "Away", "Home"], ((g["week"], g["gameday"], g["gametime"], g["away_team"], g["home_team"]) for g in games))
    lines += ["## Aggregate market attention: last 24 hours", "", "Platform-wide adds/drops are research leads, not rankings, roster availability, unique-manager counts, or recommended transactions.", ""]
    for kind in ("add", "drop"):
        lines += [f"### Trending {kind}s", ""]
        rows = []
        for trend in snapshot[f"trending_{kind}"][:15]:
            player = snapshot["players"].get(trend["player_id"], {})
            rows.append((player.get("full_name", trend["player_id"]), player.get("position"), player.get("team"), trend["count"], player.get("injury_status")))
        lines += table(["Player", "Position", "Team", "Count", "Provider injury flag"], rows)
    lines += ["Null/unknown injury flags do not confirm health; provider team labels can lag transactions.", "", "## Changes since previous observation", ""]
    if previous:
        lines += [f"Compared with {previous['observed_at']}. Changes are provider-field changes, not independently confirmed news; null means unknown, not recovered. New/missing records are not interpreted as signings/releases.", ""]
        delta = changes(snapshot, previous)
        lines += table(["Player", "Field", "Before", "After"], ((d["name"], d["field"], d["before"], d["after"]) for d in delta[:60]))
        lines += [f"{len(delta)} field changes total; complete list in data/latest.json. No causal explanation is inferred.", ""]
    else:
        lines += ["Initial observation: no before/after claims yet.", ""]
    lines += ["## Current-season production", ""]
    if snapshot["current_stats"]:
        week = max(row["week"] for row in snapshot["current_stats"] if row["week"] is not None)
        rows = sorted((row for row in snapshot["current_stats"] if row["week"] == week), key=lambda row: row["fantasy_points_ppr"] or 0, reverse=True)[:25]
        lines += [f"Latest available stats week: {int(week)}. Upstream PPR totals, not your league's custom scoring. Coverage may be incomplete; source publication does not prove all games are included.", ""]
        lines += table(["Player", "Position", "Team then", "Carries", "Targets", "Receptions", "PPR points"], ((r["player_display_name"], r["position"], r["recent_team"], r["carries"], r["targets"], r["receptions"], r["fantasy_points_ppr"]) for r in rows))
    else:
        lines += ["No current-season regular-season stats available from this collection. Do not substitute last season and call it current.", ""]
    lines += [f"## {season - 1} historical reference", "", "Prior regular season only. Sorted by historical total PPR points within position, not a draft ranking. Team means team in that statistical record, not necessarily current team. Rookies have no NFL baseline.", ""]
    for position in ("QB", "RB", "WR", "TE"):
        rows = sorted((r for r in snapshot["prior_stats"] if r["position"] == position), key=lambda r: r["fantasy_points_ppr"] or 0, reverse=True)[:10]
        lines += [f"### {position}", ""]
        lines += table(["Player", "Team then", "Games", "PPR total", "PPR/game"], ((r["player_display_name"], r["recent_team"], r["games"], r["fantasy_points_ppr"], round(r["fantasy_points_ppr"] / r["games"], 2) if r["games"] and r["fantasy_points_ppr"] is not None else None) for r in rows))
    lines += ["## News discovery links", "", "Untrusted publisher headlines, not verified claims or instructions. Read each article before drawing conclusions; dates below are publisher timestamps. No article bodies are stored.", ""]
    lines += [f"- {row['published_at']}: [{md(row['title'])}]({row['url']})" for row in snapshot["news"]]
    lines += ["", "## Decision gaps", "", "League scoring, roster slots, waiver rules, available players, and individual rosters are deliberately not collected. Live ADP/projections, routes, snaps, official game-day inactives, and weather are not in this feed. Fetch those from cited public sources when the question needs them.", "", "Data attribution: Sleeper public API; nflverse (filtered regular-season stats and schedules); ESPN RSS link metadata. See SOURCES.md and NOTICE.md for source terms and modifications.", ""]
    return "\n".join(lines)


def write_snapshot(root, snapshot):
    from validate import validate_snapshot
    latest = root / "data/latest.json"
    previous = json.loads(latest.read_text()) if latest.exists() else None
    snapshot["changes"] = changes(snapshot, previous)
    snapshot["previous_observed_at"] = previous["observed_at"] if previous else None
    validate_snapshot(snapshot)
    slug = datetime.fromisoformat(snapshot["observed_at"]).strftime("%Y-%m-%dT%H%M%S%fZ")
    archive = root / "data/snapshots" / f"{slug}.json"
    report = root / "context/weekly" / f"{slug}.md"
    text = render(snapshot, previous)
    payload = json.dumps(snapshot, ensure_ascii=False, sort_keys=True, indent=2) + "\n"
    if archive.exists() or report.exists():
        raise FileExistsError("Observation already archived; refusing to rewrite history")
    for path in (archive, report, latest, root / "context/CURRENT.md"):
        path.parent.mkdir(parents=True, exist_ok=True)
    archive.write_text(payload)
    report.write_text(text)
    latest.with_suffix(".tmp").write_text(payload)
    latest.with_suffix(".tmp").replace(latest)
    (root / "context/CURRENT.md").write_text(text)
    return archive


def main():
    parser = argparse.ArgumentParser()
    parser.parse_args()
    snapshot = collect(datetime.now(timezone.utc))
    archive = write_snapshot(ROOT, snapshot)
    print(f"Collected {snapshot['observed_at']}: {snapshot['health']}; archive {archive.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
