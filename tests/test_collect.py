import csv
import io
import json
import sys
import tempfile
import unittest
import urllib.error
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import collect
import validate

NOW = datetime(2026, 8, 31, 14, tzinfo=timezone.utc)


def csv_bytes(row):
    stream = io.StringIO()
    writer = csv.DictWriter(stream, fieldnames=list(row))
    writer.writeheader()
    writer.writerow(row)
    return stream.getvalue().encode()


def fixture(url):
    if url == collect.BASE + "state/nfl":
        body = json.dumps({"season": "2026", "season_type": "regular", "week": 1, "display_week": 1, "season_start_date": "2026-09-09"}).encode()
    elif url == collect.BASE + "players/nfl":
        body = json.dumps({"1": {"full_name": "Example Player", "position": "RB", "active": True, "team": "BUF", "injury_status": None, "metadata": {"private": "never stored"}, "birth_date": "never stored"}}).encode()
    elif "trending/" in url:
        body = b'[{"player_id":"1","count":42}]'
    elif url == collect.SCHEDULE:
        row = dict.fromkeys(collect.GAME_FIELDS, "")
        row.update(game_id="2026_01_BUF_NYJ", season="2026", game_type="REG", week="1", gameday="2026-09-09", gametime="20:20", away_team="BUF", home_team="NYJ")
        body = csv_bytes(row)
    elif "week_2026" in url:
        raise urllib.error.HTTPError(url, 404, "missing", {}, None)
    elif "reg_2025" in url:
        row = dict.fromkeys(collect.STAT_NUMBERS, "0")
        row.update(player_id="gsis-1", player_display_name="Example Player", position="RB", season="2025", season_type="REG", recent_team="BUF", games="10", fantasy_points="100", fantasy_points_ppr="120")
        body = csv_bytes(row)
    elif url == collect.NEWS:
        body = b'<rss><channel><item><title>Example public sports report</title><link>https://www.espn.com/nfl/story/123</link><pubDate>Mon, 31 Aug 2026 10:00:00 GMT</pubDate><description>not copied</description></item></channel></rss>'
    else:
        raise AssertionError(url)
    return body, None


class CollectorTests(unittest.TestCase):
    def test_collect_has_provenance_and_only_public_fields(self):
        value = collect.collect(NOW, fixture)
        validate.validate_snapshot(value)
        self.assertEqual(value["health"], "ok")
        self.assertEqual(value["sources"]["nflverse_current_stats"]["status"], "not_yet_available")
        self.assertNotIn("metadata", value["players"]["1"])
        self.assertNotIn("not copied", json.dumps(value))

    def test_post_kickoff_missing_stats_is_degraded(self):
        value = collect.collect(NOW + timedelta(days=20), fixture)
        self.assertEqual(value["health"], "degraded")
        self.assertEqual(value["sources"]["nflverse_current_stats"]["status"], "error")

    def test_required_source_failure_preserves_existing_files(self):
        def broken(url):
            if url.endswith("players/nfl"):
                return b'{}', None
            return fixture(url)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            value = collect.collect(NOW, fixture)
            collect.write_snapshot(root, value)
            before = (root / "data/latest.json").read_bytes()
            with self.assertRaises(RuntimeError):
                collect.write_snapshot(root, collect.collect(NOW + timedelta(days=7), broken))
            self.assertEqual((root / "data/latest.json").read_bytes(), before)

    def test_optional_failure_visible_without_old_data(self):
        def broken(url):
            if url == collect.NEWS:
                raise urllib.error.URLError("network unavailable")
            return fixture(url)
        value = collect.collect(NOW, broken)
        self.assertEqual(value["news"], [])
        self.assertEqual(value["health"], "degraded")
        self.assertIn("espn_news | error", collect.render(value, None))

    def test_snapshots_immutable_and_changes_preserved(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            first = collect.collect(NOW, fixture)
            archive = collect.write_snapshot(root, first)
            before = archive.read_bytes()
            second = collect.collect(NOW + timedelta(days=7), fixture)
            second["players"]["1"]["injury_status"] = "Questionable"
            collect.write_snapshot(root, second)
            self.assertEqual(archive.read_bytes(), before)
            self.assertEqual(second["changes"][0]["after"], "Questionable")
            with self.assertRaises(FileExistsError):
                collect.write_snapshot(root, second)
            validate.validate_repo(root)

    def test_null_change_is_not_called_recovery(self):
        old = collect.collect(NOW, fixture)
        old["players"]["1"]["injury_status"] = "Questionable"
        new = collect.collect(NOW + timedelta(days=1), fixture)
        self.assertIsNone(collect.changes(new, old)[0]["after"])
        self.assertIn("null means unknown, not recovered", collect.render(new, old))

    def test_no_name_join_between_provider_ids(self):
        value = collect.collect(NOW, fixture)
        self.assertEqual(value["prior_stats"][0]["player_id"], "gsis-1")
        self.assertIn("1", value["players"])

    def test_defense_has_readable_name_when_source_name_is_null(self):
        value = collect.parse_players(b'{"BUF":{"position":"DEF","team":"BUF","full_name":null}}')
        self.assertEqual(value["BUF"]["full_name"], "BUF D/ST")

    def test_season_rollover_changes_both_stat_years(self):
        seen = []
        def next_season(url):
            seen.append(url)
            old_url = url.replace("2027", "2026").replace("reg_2026", "reg_2025")
            body, modified = fixture(old_url)
            if url.endswith("state/nfl") or url == collect.SCHEDULE:
                body = body.replace(b"2026", b"2027")
            elif "reg_2026" in url:
                body = body.replace(b"2025", b"2026")
            return body, modified
        value = collect.collect(datetime(2027, 8, 31, tzinfo=timezone.utc), next_season)
        self.assertEqual(value["state"]["season"], "2027")
        self.assertEqual(value["prior_stats"][0]["season"], "2026")
        self.assertTrue(any("week_2027" in url for url in seen))

    def test_available_weekly_stats_render_as_current_not_prior(self):
        def in_season(url):
            if "week_2026" in url:
                body, modified = fixture(collect.STATS + "stats_player_reg_2025.csv")
                rows = list(csv.DictReader(io.StringIO(body.decode())))
                rows[0].update(season="2026", week="2", fantasy_points_ppr="18")
                return csv_bytes(rows[0]), modified
            return fixture(url)
        value = collect.collect(NOW + timedelta(days=21), in_season)
        report = collect.render(value, None)
        self.assertEqual(value["sources"]["nflverse_current_stats"]["status"], "ok")
        self.assertIn("Latest available stats week: 2", report)
        self.assertEqual(value["prior_stats"][0]["season"], "2025")

    def test_allowlist_rejects_private_and_arbitrary_endpoints(self):
        for url in (collect.BASE + "league/123", collect.BASE + "user/123", "https://example.com", collect.NEWS + "?token=x"):
            self.assertFalse(collect.allowed(url))
            with self.assertRaises(ValueError):
                collect.fetch(url)

    def test_schema_drift_and_empty_data_rejected(self):
        with self.assertRaises(ValueError):
            collect.parse_stats(b"foo,bar\n1,2\n", 2025)
        with self.assertRaises(ValueError):
            collect.parse_players(b"[]")
        with self.assertRaises(ValueError):
            collect.parse_trends(b'[{"player_id":"1","count":-3}]')

    def test_news_only_allowed_links(self):
        body = b'<rss><channel><item><title>Bad link</title><link>https://example.com</link><pubDate>Mon, 31 Aug 2026 10:00:00 GMT</pubDate></item></channel></rss>'
        with self.assertRaises(ValueError):
            collect.parse_news(body)

    def test_validator_rejects_sensitive_fields_and_secrets(self):
        value = collect.collect(NOW, fixture)
        value["players"]["1"]["user_id"] = "not-allowed"
        with self.assertRaises(ValueError):
            validate.validate_snapshot(value)
        for sample in ("ghp_" + "x" * 36, "/" + "Users/example/secret", "person" + "@" + "example.com"):
            with self.assertRaises(ValueError):
                validate.check_text(sample)

    def test_missing_provenance_rejected(self):
        value = collect.collect(NOW, fixture)
        value["sources"]["sleeper_players"].pop("sha256")
        with self.assertRaises(ValueError):
            validate.validate_snapshot(value)


if __name__ == "__main__":
    unittest.main()
