import contextlib
import copy
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import build_site
import query
from test_query import fixture


def exported(snapshot, pid="1"):
    return next(player for player in build_site.build_payload(snapshot)["players"] if player["id"] == pid)


def complete_schedule():
    teams = sorted(query.TEAMS)
    return [{"game_id": f"2026_{week}_{away}_{home}", "season": "2026", "week": str(week), "away_team": away, "home_team": home} for week in range(1, 18) for away, home in zip(teams[::2], teams[1::2])]


class BuildSiteTests(unittest.TestCase):
    def test_prior_history_uses_exact_shared_id_and_keeps_historical_team(self):
        value = fixture()
        value["prior_stats"][0].update(fantasy_points_ppr=140.7, passing_yards=0, rushing_yards=750)
        result = build_site.build_payload(value)
        player = result["players"][0]
        self.assertEqual((result["schema_version"], result["season"], result["history_season"]), (1, "2026", "2025"))
        self.assertEqual(player["history_status"], "matched")
        self.assertEqual(player["history"]["ppr_per_game"], 10.05)
        self.assertEqual(player["history"]["carries"], 160)
        self.assertEqual((player["team"], player["history"]["team"]), ("BUF", "NYJ"))
        self.assertEqual(player["history"]["passing_yards"], 0)
        self.assertIsNone(player["history"]["targets"])

    def test_names_and_sleeper_ids_are_never_join_keys(self):
        for replacement in ("1", "00-9999999"):
            with self.subTest(replacement=replacement):
                value = fixture()
                value["prior_stats"][0]["player_id"] = replacement
                player = exported(value)
                self.assertIsNone(player["history"])
                self.assertEqual(player["history_status"], "no_matching_stats")

    def test_missing_invalid_and_duplicate_catalog_mapping_are_ineligible(self):
        for gsis_id, status in ((None, "missing_gsis_id"), ("1", "invalid_gsis_id"), ("00-0000002", "ambiguous_gsis_mapping")):
            with self.subTest(status=status):
                value = fixture()
                value["players"]["1"]["gsis_id"] = gsis_id
                player = exported(value)
                self.assertIsNone(player["history"])
                self.assertEqual(player["history_status"], status)

    def test_excluded_catalog_player_still_makes_shared_mapping_ambiguous(self):
        value = fixture()
        value["players"]["2"].update(gsis_id="00-0000001", full_name="", team=None, status="Inactive")
        self.assertEqual(exported(value)["history_status"], "ambiguous_gsis_mapping")

    def test_duplicate_prior_rows_are_not_added_or_arbitrarily_selected(self):
        value = fixture()
        duplicate = copy.deepcopy(value["prior_stats"][0])
        duplicate.update(recent_team="BUF", carries=1)
        value["prior_stats"].append(duplicate)
        player = exported(value)
        self.assertIsNone(player["history"])
        self.assertEqual(player["history_status"], "duplicate_prior_stats")

    def test_wrong_season_and_weekly_rows_are_not_historical_totals(self):
        for changes, status in (({"season": "2026"}, "wrong_season"), ({"season": "2024"}, "wrong_season"), ({"week": 1}, "not_season_total"), ({"week": 0}, "not_season_total")):
            with self.subTest(changes=changes):
                value = fixture()
                value["prior_stats"][0].update(changes)
                player = exported(value)
                self.assertIsNone(player["history"])
                self.assertEqual(player["history_status"], status)

    def test_current_stats_never_fill_missing_prior_history(self):
        value = fixture()
        value["prior_stats"] = []
        self.assertIsNone(exported(value)["history"])
        self.assertEqual(exported(value)["history_status"], "empty_dataset")
        del value["prior_stats"]
        self.assertEqual(exported(value)["history_status"], "missing_dataset")

    def test_zero_totals_are_distinct_from_missing_values_and_denominators(self):
        for ppr, games, expected in ((0, 14, 0.0), (None, 14, None), (140, None, None), (0, 0, None), (140, -1, None)):
            with self.subTest(ppr=ppr, games=games):
                value = fixture()
                value["prior_stats"][0].update(fantasy_points_ppr=ppr, games=games)
                history = exported(value)["history"]
                self.assertEqual(history["ppr"], ppr)
                self.assertEqual(history["games"], games)
                self.assertEqual(history["ppr_per_game"], expected)

    def test_unhealthy_or_missing_prior_source_cannot_export_retained_rows(self):
        for status in ("error", "not_yet_available", "missing"):
            with self.subTest(status=status):
                value = fixture()
                value["sources"]["nflverse_prior_stats"]["status"] = status
                player = exported(value)
                self.assertIsNone(player["history"])
                self.assertEqual(player["history_status"], "source_unavailable")
        value = fixture()
        del value["sources"]["nflverse_prior_stats"]
        self.assertEqual(exported(value)["history_status"], "source_unavailable")

    def test_unhealthy_catalog_does_not_publish_retained_players(self):
        value = fixture()
        value["sources"]["sleeper_players"]["status"] = "error"
        self.assertEqual(build_site.build_payload(value)["players"], [])

    def test_catalog_keeps_named_supported_positions_with_team_or_active_status(self):
        value = fixture()
        base = value["players"]["1"]
        value["players"] = {str(index): {**base, "position": position, "full_name": position, "gsis_id": None} for index, position in enumerate(("QB", "RB", "WR", "TE", "K", "DEF"))}
        value["players"].update({
            "active": {**base, "full_name": "Active unsigned", "team": None},
            "inactive": {**base, "full_name": "Inactive assigned", "status": "Inactive"},
            "excluded": {**base, "full_name": "Inactive unsigned", "team": None, "status": "Inactive"},
            "blank": {**base, "full_name": "  "},
            "defensive": {**base, "position": "LB"},
        })
        players = build_site.build_payload(value)["players"]
        self.assertEqual({player["id"] for player in players}, set(map(str, range(6))) | {"active", "inactive"})
        for player in players:
            if player["position"] in {"K", "DEF"}:
                self.assertIsNone(player["history"])
                self.assertEqual(player["history_status"], "unsupported_position")

    def test_byes_require_complete_schedule_and_accept_rams_alias(self):
        value = fixture()
        self.assertIsNone(exported(value)["bye"])
        value["schedule"] = complete_schedule()
        self.assertEqual(exported(value)["bye"], 18)
        self.assertEqual(exported(value, "2")["bye"], 18)
        value["players"]["1"]["team"] = None
        self.assertIsNone(exported(value)["bye"])
        value["players"]["1"]["team"] = "UNKNOWN"
        self.assertIsNone(exported(value)["bye"])

    def test_duplicate_wrong_season_repeated_week_and_failed_schedule_cannot_infer_bye(self):
        for defect in ("duplicate", "season", "week", "source", "missing"):
            with self.subTest(defect=defect):
                value = fixture()
                value["schedule"] = complete_schedule()
                if defect == "duplicate":
                    value["schedule"][-1] = value["schedule"][0]
                elif defect == "season":
                    value["schedule"][-1]["season"] = "2025"
                elif defect == "week":
                    value["schedule"][-1]["week"] = "1"
                elif defect == "source":
                    value["sources"]["nflverse_schedule"]["status"] = "error"
                else:
                    value["schedule"].pop()
                self.assertIsNone(exported(value)["bye"])

    def test_invalid_season_fails_without_inventing_history_season(self):
        for season in (None, "", "unresolved"):
            with self.subTest(season=season), self.assertRaises(ValueError):
                value = fixture()
                value["state"]["season"] = season
                build_site.build_payload(value)

    def test_public_projection_omits_extra_fields_and_has_stable_order(self):
        value = fixture()
        value["players"]["1"]["metadata"] = {"private": "excluded-player-detail"}
        value["prior_stats"][0]["unexpected_detail"] = "excluded-stat-detail"
        value["sources"]["sleeper_players"].update(error="excluded-error-detail", note="excluded-note-detail", owner_id="excluded-owner-detail")
        value["sources"]["private_source"] = {"url": "excluded-source-detail"}
        before = copy.deepcopy(value)
        result = build_site.build_payload(value)
        self.assertEqual(value, before)
        self.assertNotIn("excluded-", json.dumps(result))
        self.assertEqual(set(result["sources"]["sleeper_players"]), {"name", "url", "status", "observed_at", "sha256"})
        value["players"] = dict(reversed(list(value["players"].items())))
        self.assertEqual(result, build_site.build_payload(value))

    def test_build_copies_assets_is_repeatable_and_leaves_snapshot_unchanged(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            snapshot = root / "latest.json"
            snapshot.write_text(json.dumps(fixture()))
            before = snapshot.read_bytes()
            assets = root / "site"
            assets.mkdir()
            (assets / "index.html").write_text("<!doctype html><title>Public draft room</title>")
            (assets / "app.js").write_text("'use strict';")
            output = root / "_site"
            build_site.build_site(snapshot, output, assets)
            first = {path.relative_to(output): path.read_bytes() for path in output.rglob("*") if path.is_file()}
            build_site.build_site(snapshot, output, assets)
            second = {path.relative_to(output): path.read_bytes() for path in output.rglob("*") if path.is_file()}
            self.assertEqual(first, second)
            self.assertEqual(snapshot.read_bytes(), before)
            self.assertEqual((output / "app.js").read_bytes(), (assets / "app.js").read_bytes())
            self.assertEqual(json.loads((output / "data/players.json").read_text())["history_season"], "2025")

    def test_build_rejects_overlapping_output_and_missing_assets(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            snapshot = root / "latest.json"
            snapshot.write_text(json.dumps(fixture()))
            assets = root / "site"
            assets.mkdir()
            (assets / "index.html").write_text("<!doctype html>")
            for output in (root, assets, assets / "nested"):
                with self.subTest(output=output), self.assertRaises(ValueError):
                    build_site.build_site(snapshot, output, assets)
            with self.assertRaises(ValueError):
                build_site.build_site(snapshot, root / "_site", root / "missing-assets")

    def test_cli_invalid_snapshot_is_generic_and_does_not_create_output(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            snapshot = root / "latest.json"
            snapshot.write_text("excluded-invalid-snapshot-detail")
            output = root / "_site"
            error = io.StringIO()
            with contextlib.redirect_stderr(error):
                self.assertEqual(build_site.main(["--snapshot", str(snapshot), "--output", str(output)]), 2)
            self.assertNotIn("excluded-invalid", error.getvalue())
            self.assertNotIn(str(root), error.getvalue())
            self.assertFalse(output.exists())

    @unittest.skipUnless((build_site.ROOT / "site/index.html").is_file(), "Site assets are authored separately")
    def test_cli_smoke_with_repository_assets(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "_site"
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(build_site.main(["--output", str(output)]), 0)
            self.assertTrue((output / "index.html").is_file())
            self.assertRegex((output / "index.html").read_text(), r'app\.js\?v=[a-f0-9]{16}')
            self.assertRegex((output / "app.js").read_text(), r'\./scene\.js\?v=[a-f0-9]{16}')
            self.assertGreater(len(json.loads((output / "data/players.json").read_text())["players"]), 0)


if __name__ == "__main__":
    unittest.main()
