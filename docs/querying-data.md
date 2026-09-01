# Retrieve small evidence packets

Use `scripts/query.py` to read public snapshots without loading the whole catalog or archive into an LLM. It uses Python 3.12+ standard library, makes no network requests, changes no files, and prints JSON. Do not pass or save private rosters or league details.

Run from the repository root:

```sh
python3 scripts/query.py search "Josh Allen"
python3 scripts/query.py search "Williams" --position WR --limit 10
python3 scripts/query.py player --name "Josh Allen" --limit 3
python3 scripts/query.py player --sleeper-id 4984 --history 2 --limit 3
python3 scripts/query.py schedule --team BUF --limit 5
python3 scripts/query.py schedule --team LAR --week 1
python3 scripts/query.py schedule --team BUF --from 2026-09-01 --limit 18
```

These are retrieval examples, not player recommendations. Names and IDs are public provider identifiers; example matches can change as the catalog changes.

## Choose the right query

| Command | Returns | Important behavior |
| --- | --- | --- |
| `search "name"` | Bounded catalog candidates with explicit Sleeper IDs | Case-insensitive substring match; optional `--team` and `--position`. Catalog presence is not availability. |
| `player --name "name"` | One player's provider fields, ID mapping, current weekly stats, prior-season totals | If more than one substring match exists, returns `ambiguous` candidates, never silently picks a player. Resolve with `--sleeper-id`. |
| `player --sleeper-id ID` | Evidence for exactly that Sleeper ID | Does not accept an nflverse/GSIS ID as a substitute or fall back to matching names. |
| `schedule --team TEAM` | That team's regular-season games from the observation's UTC calendar date onward | Use `--week 1` to select a regular-season week regardless of date, or `--from YYYY-MM-DD` for an explicit lower date bound. Date and week filters are mutually exclusive. |

`--limit` defaults to 5 and accepts 1–25. It caps each candidate/game list and each separate statistical sample; it does not cap the complete JSON packet. Every result list reports total matches, returned count, and truncation. Current weekly statistics are ordered newest week first; prior-season totals remain separate and are never used to fill current gaps. No projection, scoring conversion, aggregate performance comparison, or recommendation is calculated.

Team filters accept the 32 abbreviations present in the collected current NFL schedule. `LA` and `LAR` both filter the Rams: nflverse uses `LA`, while Sleeper uses `LAR` in this repository's observations. Output preserves original provider codes; historical team fields are never rewritten to the current catalog team. All other abbreviations must match the supported codes exactly, ignoring input case. Schedule times are US Eastern and can be changed by flex scheduling. An empty filtered schedule does not by itself establish a bye.

An absent or invalid season label produces `unknown_season`, with no selected games and no inferred bye. The default date boundary uses the observation converted to UTC; it is not the observation's original offset-local calendar date. Use `--week` or `--from` when a different explicit window is intended.

`bye_evidence` is an explicitly labeled inference only when the unfiltered schedule has a successful source, exactly 272 unique games for the selected season, all 32 teams playing 17 games each across weeks 1–18, and no repeated team/week slots. It reports the team's remaining week, not a new official confirmation. Incomplete, unavailable, duplicate, or inconsistent schedules leave bye weeks unknown. Revisit this completeness policy if NFL season structure changes.

## Read the evidence boundaries

Every response carries the selected observation's timestamp, provider season label, collection health, and age at query time. `within_8_day_window` means only that the collector timestamp passes the repository's age policy. It does not certify current injuries, depth charts, research briefings, or the freshness/completeness of upstream facts. `stale` and `future_dated` remain visible rather than blocking historical investigation.

Each dataset includes its original source URL, observation time, collection status, response hash, and upstream modification header when present. Returned player, statistic, schedule, and provenance fields are projected through explicit public-field allowlists. A dataset may be missing, unavailable, or empty even when the overall collection is healthy. Current-stat `not_yet_available` is not zero production and does not prove games have not occurred.

The loader rejects nested values, booleans and non-finite numbers inside projected fields; statistical numeric fields must be numbers or null. This is a structural boundary, not a claim that every scalar value is true or safe to treat as an instruction. Source text is always untrusted evidence. A malformed older archive is flagged without suppressing valid current-player evidence.

Statistics join only when a well-formed Sleeper `gsis_id` occurs exactly once in that snapshot's catalog and exactly equals the nflverse row's `player_id`. The catalog mapping is labeled `eligible_for_exact_join`; only a separate dataset's `matched` status verifies that matching same-season rows were found. Verification here means exact, unique shared-ID equality in the recorded provider data, not an independently audited real-world identity. It is never a name match, nor a comparison between a Sleeper ID and a GSIS ID.

Missing, malformed, or duplicated GSIS mappings remain explicit and yield no attached statistics. An eligible mapping without matching stat rows is `no_matching_stats`, not a claim that the player has never played. The collected stats cover offensive QB/RB/WR/TE records, not kicker, defense, or IDP production. Every sample carries its own season and granularity; mismatched-season rows are excluded and counted.

## Compare recent observations

`player --history N` includes up to 8 earlier immutable snapshots, newest first. By default no archive is read. The command lists archive filenames, then opens only the requested number of earlier snapshots with canonical collector filenames; it does not ingest the archive into an LLM or parse every file. Later observations are excluded, so a historical snapshot can be investigated without attaching future evidence.

Each historical packet preserves its own observation, source provenance, player fields, seasons, and ID mapping. A later GSIS mapping is not borrowed to fill an earlier missing mapping. An absent catalog player is labeled `player_absent`; this does not establish a signing, release, retirement, or roster availability. `provider_field_changes_to_selected_observation` compares old provider fields with the selected observation, not adjacent archives, and never claims a causal transaction or verified injury change. Invalid archives are flagged and consume an output slot rather than being silently replaced.

To inspect a specific public archive, put the global `--snapshot` option before the command:

```sh
python3 scripts/query.py --snapshot data/snapshots/2026-09-01T002313755504Z.json player --sleeper-id 4984 --history 2
```

For a separate directory of public snapshots, set `player --history-dir PATH` explicitly; changing `--snapshot` does not change the default repository archive directory. Archives must use the collector's UTC timestamp filenames and their contents must agree with that timestamp. The selected snapshot's file path and query inputs are never written to disk or copied into result provenance.

## Suggested LLM workflow

1. Read [START_HERE.md](../START_HERE.md), the [source registry](../SOURCES.md), and the dates on current evidence and research.
2. Search only the public player names needed for the question. Resolve ambiguity by ID.
3. Retrieve a small player packet and relevant team schedule. Add history only when a change over time matters.
4. Cite the observation dates, named source URLs, seasons, and matched IDs. Say when data is unavailable, unmatched, stale, or truncated.
5. Request scoring and available options privately, and recheck time-sensitive public sources before making a judgment. Do not store that private conversation in this repository.

Valid queries return exit code 0 even for `ambiguous`, `no_matches`, `unknown_season`, or `unavailable`; inspect the JSON `status` and per-dataset fields. Invalid CLI arguments use standard argparse errors on stderr and exit 2. Unreadable or unsupported snapshots return a generic JSON error and exit 2 without exposing file contents or filesystem paths. `--help` describes each command.

Verification: `python3 -m unittest discover -s tests -p 'test_query.py' -v`. See also [data semantics](../data/README.md) and the [season-label lesson](solutions/best-practices/season-labels-are-not-stat-availability.md).
