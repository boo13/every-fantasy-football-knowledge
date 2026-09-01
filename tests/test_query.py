import contextlib
import copy
import io
import json
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import query

NOW = datetime(2026, 10, 1, 12, tzinfo=timezone.utc)


def fixture():
    sources = {name: {"status": "ok", "observed_at": NOW.isoformat(), "url": "https://api.sleeper.app/v1/players/nfl" if name == "sleeper_players" else "https://github.com/nflverse/nflverse-data", "sha256": "a" * 64} for name in ("sleeper_players", "sleeper_state", "nflverse_schedule", "nflverse_current_stats", "nflverse_prior_stats")}
    player = {"full_name": "Sample Runner", "position": "RB", "team": "BUF", "status": "Active", "injury_status": None, "practice_participation": None, "gsis_id": "00-0000001"}
    return {
        "schema_version": 2,
        "observed_at": NOW.isoformat(),
        "health": "ok",
        "sources": sources,
        "state": {"season": "2026", "season_type": "regular", "display_week": 4},
        "players": {"1": player, "2": {**player, "full_name": "Sample Runner Jr", "gsis_id": "00-0000002", "team": "LAR"}},
        "current_stats": [{"player_id": "00-0000001", "player_display_name": "Sample Runner", "season": "2026", "recent_team": "BUF", "week": week, "carries": 10 + week} for week in (1, 2, 3)],
        "prior_stats": [{"player_id": "00-0000001", "player_display_name": "Sample Runner", "season": "2025", "recent_team": "NYJ", "games": 14, "week": None, "carries": 160}],
        "schedule": [{"game_id": "2026_04_LA_BUF", "season": "2026", "week": "4", "gameday": "2026-10-04", "gametime": "13:00", "away_team": "LA", "home_team": "BUF"}],
    }


def archive(directory, snapshot):
    path = directory / (query.timestamp(snapshot["observed_at"]).strftime("%Y-%m-%dT%H%M%S%fZ") + ".json")
    path.write_text(json.dumps(snapshot))
    return path


class QueryTests(unittest.TestCase):
    def test_search_is_bounded_and_can_filter_team_alias(self):
        value = fixture()
        result = query.search(value, "  SAMPLE   runner ", limit=1)
        self.assertEqual(result["total_matches"], 2)
        self.assertTrue(result["truncated"])
        self.assertEqual(query.search(value, "Sample", team="LA")["rows"][0]["team"], "LAR")
        self.assertEqual(query.search(value, "Sample", position="QB")["status"], "no_matches")

    def test_ambiguous_name_never_selects_first_result_even_when_exact(self):
        result = query.player_query(fixture(), name="Sample Runner", limit=1)
        self.assertEqual(result["status"], "ambiguous")
        self.assertEqual(result["candidates"]["total_matches"], 2)
        self.assertNotIn("player", result)

    def test_zero_matches_is_not_roster_availability(self):
        self.assertEqual(query.search(fixture(), "Nobody")["status"], "no_matches")
        result = query.player_query(fixture(), sleeper_id="999")
        self.assertEqual(result["status"], "no_matches")
        self.assertIn("does not establish", result["note"])

    def test_stats_join_only_shared_gsis_and_keep_seasons_and_teams_separate(self):
        result = query.player_query(fixture(), sleeper_id="1", limit=2)
        self.assertEqual(result["player"]["id_namespace"], "sleeper")
        self.assertEqual(result["current_stats"]["id_namespace"], "nflverse_gsis")
        self.assertEqual(result["current_stats"]["season"], "2026")
        self.assertEqual([row["week"] for row in result["current_stats"]["rows"]], [3, 2])
        self.assertTrue(result["current_stats"]["truncated"])
        self.assertEqual(result["prior_stats"]["season"], "2025")
        self.assertEqual(result["prior_stats"]["rows"][0]["recent_team"], "NYJ")
        self.assertEqual(result["player"]["team"], "BUF")
        self.assertEqual(result["prior_stats"]["source"]["sha256"], "a" * 64)

    def test_sleeper_id_and_names_never_used_as_stat_join_keys(self):
        value = fixture()
        value["prior_stats"][0]["player_id"] = "1"
        result = query.player_query(value, sleeper_id="1")
        self.assertEqual(result["prior_stats"]["match_status"], "no_matching_stats")
        self.assertEqual(result["prior_stats"]["rows"], [])

    def test_missing_gsis_is_explicit_despite_matching_name(self):
        value = fixture()
        value["players"]["1"]["gsis_id"] = None
        result = query.player_query(value, sleeper_id="1")
        self.assertEqual(result["identity_mapping"]["status"], "missing_gsis_id")
        self.assertEqual(result["prior_stats"]["match_status"], "missing_gsis_id")
        self.assertEqual(result["prior_stats"]["rows"], [])

    def test_duplicate_and_invalid_gsis_mapping_is_not_joined(self):
        value = fixture()
        value["players"]["2"]["gsis_id"] = "00-0000001"
        self.assertEqual(query.player_query(value, sleeper_id="1")["prior_stats"]["match_status"], "ambiguous_gsis_mapping")
        value["players"]["1"]["gsis_id"] = "1"
        self.assertEqual(query.player_query(value, sleeper_id="1")["identity_mapping"]["status"], "invalid_gsis_id")

    def test_missing_dataset_and_expected_absence_remain_explicit(self):
        value = fixture()
        del value["prior_stats"]
        value["current_stats"] = []
        value["sources"]["nflverse_current_stats"]["status"] = "not_yet_available"
        result = query.player_query(value, sleeper_id="1")
        self.assertEqual(result["prior_stats"]["availability"], "missing")
        self.assertEqual(result["current_stats"]["availability"], "unavailable")
        self.assertEqual(result["current_stats"]["source"]["status"], "not_yet_available")
        self.assertEqual(result["current_stats"]["rows"], [])

    def test_out_of_season_rows_are_not_substituted(self):
        value = fixture()
        value["current_stats"] = copy.deepcopy(value["prior_stats"])
        result = query.player_query(value, sleeper_id="1")
        self.assertEqual(result["current_stats"]["rows"], [])
        self.assertEqual(result["current_stats"]["excluded_other_season_rows"], 1)

    def test_unknown_season_cannot_select_games_or_infer_byes(self):
        value = fixture()
        teams = sorted(query.TEAMS)
        for season in (None, "", "unresolved"):
            with self.subTest(season=season):
                value["state"]["season"] = season
                value["schedule"] = [{"game_id": f"{week}_{away}_{home}", "season": season, "week": str(week), "gameday": "2026-10-04", "gametime": "13:00", "away_team": away, "home_team": home} for week in range(1, 18) for away, home in zip(teams[::2], teams[1::2])]
                result = query.schedule_query(value, "BUF")
                self.assertEqual(result["status"], "unknown_season")
                self.assertIsNone(result["season"])
                self.assertEqual(result["rows"], [])
                self.assertEqual(result["bye_evidence"]["status"], "unknown_incomplete_schedule")

    def test_schedule_default_date_uses_observation_utc_date(self):
        value = fixture()
        value["observed_at"] = "2026-10-04T23:30:00-04:00"
        result = query.schedule_query(value, "BUF")
        self.assertEqual(result["from_date"], "2026-10-05")
        self.assertEqual(result["rows"], [])

    def test_team_validation_alias_and_week_filter(self):
        self.assertEqual(query.team_code("lar"), "LA")
        with self.assertRaises(query.argparse.ArgumentTypeError):
            query.team_code("XYZ")
        result = query.schedule_query(fixture(), "LAR", week=4)
        self.assertEqual(result["rows"][0]["away_team"], "LA")
        self.assertIsNone(result["from_date"])
        self.assertEqual(query.schedule_query(fixture(), "BUF", from_date="2026-11-01")["status"], "no_matches")

    def test_missing_catalog_or_schedule_is_not_zero_matches(self):
        value = fixture()
        del value["players"]
        del value["schedule"]
        self.assertEqual(query.search(value, "Sample")["status"], "unavailable")
        self.assertEqual(query.player_query(value, sleeper_id="1")["status"], "unavailable")
        self.assertEqual(query.schedule_query(value, "BUF")["status"], "unavailable")

    def test_bye_requires_complete_unique_full_season_not_empty_week(self):
        value = fixture()
        result = query.schedule_query(value, "BUF", week=5)
        self.assertEqual(result["status"], "no_matches")
        self.assertEqual(result["bye_evidence"]["status"], "unknown_incomplete_schedule")
        teams = sorted(query.TEAMS)
        value["schedule"] = [{"game_id": f"2026_{week}_{away}_{home}", "season": "2026", "week": str(week), "gameday": "2026-10-04", "gametime": "13:00", "away_team": away, "home_team": home} for week in range(1, 18) for away, home in zip(teams[::2], teams[1::2])]
        result = query.schedule_query(value, "BUF", week=18)
        self.assertEqual(result["bye_evidence"]["status"], "inferred_from_complete_schedule")
        self.assertEqual(result["bye_evidence"]["weeks"], [18])
        value["schedule"][-1] = value["schedule"][0]
        self.assertEqual(query.schedule_query(value, "BUF")["bye_evidence"]["status"], "unknown_incomplete_schedule")

    def test_bye_rejects_repeated_team_week_even_with_unique_game_ids(self):
        value = fixture()
        teams = sorted(query.TEAMS)
        value["schedule"] = [{"game_id": f"2026_{week}_{away}_{home}", "season": "2026", "week": "1", "gameday": "2026-10-04", "gametime": "13:00", "away_team": away, "home_team": home} for week in range(1, 18) for away, home in zip(teams[::2], teams[1::2])]
        self.assertEqual(query.schedule_query(value, "BUF")["bye_evidence"]["status"], "unknown_incomplete_schedule")

    def test_history_is_recent_bounded_and_keeps_provider_changes_and_absence(self):
        value = fixture()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            older = copy.deepcopy(value)
            older["observed_at"] = (NOW - timedelta(days=7)).isoformat()
            older["players"]["1"]["team"] = "NYJ"
            archive(root, older)
            absent = copy.deepcopy(value)
            absent["observed_at"] = (NOW - timedelta(days=14)).isoformat()
            del absent["players"]["1"]
            archive(root, absent)
            archive(root, value)
            later = copy.deepcopy(value)
            later["observed_at"] = (NOW + timedelta(days=1)).isoformat()
            archive(root, later)
            result = query.player_query(value, sleeper_id="1", history=2, history_dir=root, now=NOW)
            rows = result["history"]["rows"]
            self.assertEqual(len(rows), 2)
            self.assertEqual(rows[0]["provider_field_changes_to_selected_observation"], [{"field": "team", "before": "NYJ", "after": "BUF"}])
            self.assertEqual(rows[1]["evidence"]["status"], "player_absent")
            self.assertEqual(query.recent_history(value, "1", root, 1, 5)["available_earlier_archives"], 2)
            self.assertTrue(query.recent_history(value, "1", root, 1, 5)["truncated"])

    def test_history_does_not_borrow_current_mapping_for_old_snapshot(self):
        value = fixture()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            older = copy.deepcopy(value)
            older["observed_at"] = (NOW - timedelta(days=7)).isoformat()
            older["players"]["1"]["gsis_id"] = None
            archive(root, older)
            result = query.recent_history(value, "1", root, 1, 5)
            self.assertEqual(result["rows"][0]["evidence"]["prior_stats"]["match_status"], "missing_gsis_id")

    def test_history_timestamp_mismatch_is_visible_and_not_used(self):
        value = fixture()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / ((NOW - timedelta(days=1)).strftime("%Y-%m-%dT%H%M%S%fZ") + ".json")
            path.write_text(json.dumps(value))
            result = query.recent_history(value, "1", root, 1, 5)
            self.assertEqual(result["rows"][0]["status"], "invalid_archive")
            self.assertNotIn("evidence", result["rows"][0])

    def test_malformed_history_is_flagged_without_losing_current_evidence(self):
        value = fixture()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            older = copy.deepcopy(value)
            older["observed_at"] = (NOW - timedelta(days=7)).isoformat()
            older["current_stats"][0]["week"] = {"bad": "week"}
            archive(root, older)
            result = query.player_query(value, sleeper_id="1", history=1, history_dir=root)
            self.assertEqual(result["current_stats"]["match_status"], "matched")
            self.assertEqual(result["history"]["rows"][0]["status"], "invalid_archive")
            self.assertNotIn("evidence", result["history"]["rows"][0])

    def test_freshness_distinguishes_collection_age_and_future_dates(self):
        value = fixture()
        self.assertEqual(query.observation(value, NOW)["freshness"]["status"], "within_8_day_window")
        self.assertEqual(query.observation(value, NOW + timedelta(days=9))["freshness"]["status"], "stale")
        self.assertEqual(query.observation(value, NOW - timedelta(days=1))["freshness"]["status"], "future_dated")

    def test_cli_is_json_read_only_and_errors_do_not_expose_file_contents(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "latest.json"
            path.write_text(json.dumps(fixture()))
            before = path.read_bytes()
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                code = query.main(["--snapshot", str(path), "player", "--sleeper-id", "1", "--limit", "1"])
            self.assertEqual(code, 0)
            self.assertEqual(json.loads(output.getvalue())["current_stats"]["returned"], 1)
            self.assertEqual(path.read_bytes(), before)
            self.assertEqual(list(Path(directory).iterdir()), [path])
            path.write_text("not snapshot JSON")
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                self.assertEqual(query.main(["--snapshot", str(path), "search", "Sample"]), 2)
            self.assertNotIn(str(path), output.getvalue())
            self.assertNotIn("not snapshot JSON", output.getvalue())

    def test_cli_rejects_unbounded_requests_and_conflicting_time_filters(self):
        for arguments in (["search", "Sample", "--limit", "100"], ["player", "--sleeper-id", "1", "--history", "9"], ["schedule", "--team", "BUF", "--week", "4", "--from", "2026-10-01"]):
            with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as error:
                query.main(arguments)
            self.assertEqual(error.exception.code, 2)

    def test_malformed_nested_snapshot_is_rejected_without_traceback(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "latest.json"
            for field, replacement in (("sources", {"sleeper_players": None}), ("players", {"1": []}), ("current_stats", [None])):
                value = fixture()
                value[field] = replacement
                path.write_text(json.dumps(value))
                output = io.StringIO()
                with contextlib.redirect_stdout(output):
                    code = query.main(["--snapshot", str(path), "player", "--sleeper-id", "1"])
                self.assertEqual(code, 2)
                self.assertEqual(json.loads(output.getvalue())["status"], "invalid_snapshot_or_query")

    def test_unexpected_record_fields_are_not_echoed(self):
        value = fixture()
        value["current_stats"][0]["unexpected_detail"] = "not collected evidence"
        value["prior_stats"][0]["unexpected_detail"] = "not collected evidence"
        value["schedule"][0]["unexpected_detail"] = "not collected evidence"
        self.assertNotIn("unexpected_detail", json.dumps(query.player_query(value, sleeper_id="1")))
        self.assertNotIn("unexpected_detail", json.dumps(query.schedule_query(value, "BUF")))

    def test_cli_rejects_malformed_projected_values_without_echoing_them(self):
        cases = (("current_stats", 0, "fantasy_points", {"detail": "untrusted-value"}),
                 ("current_stats", 0, "week", True),
                 ("prior_stats", 0, "carries", float("inf")),
                 ("schedule", 0, "home_score", ["untrusted-value"]),
                 ("sources", "sleeper_players", "note", {"detail": "untrusted-value"}),
                 ("state", None, "season_type", {"detail": "untrusted-value"}))
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "latest.json"
            for dataset, row, field, malformed in cases:
                with self.subTest(dataset=dataset, field=field):
                    value = fixture()
                    target = value[dataset] if row is None else value[dataset][row]
                    target[field] = malformed
                    path.write_text(json.dumps(value))
                    output = io.StringIO()
                    with contextlib.redirect_stdout(output):
                        code = query.main(["--snapshot", str(path), "player", "--sleeper-id", "1"])
                    self.assertEqual(code, 2)
                    self.assertEqual(json.loads(output.getvalue())["status"], "invalid_snapshot_or_query")
                    self.assertNotIn("untrusted-value", output.getvalue())


if __name__ == "__main__":
    unittest.main()
