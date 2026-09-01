# Public observations

`latest.json` is the newest successful collector attempt; inspect its `health` and each source's status. `snapshots/` is append-only, keyed by UTC observation timestamp. It contains normalized public fields, not full raw provider responses. Every successful source has a SHA-256 of the fetched bytes; missing upstream modification times remain null.

Player map keys are Sleeper IDs. `gsis_id` may be null. Stats `player_id` values are nflverse/GSIS IDs; never join on name alone. Historical team fields refer to the statistical record. Catalog presence does not mean current eligibility or roster availability.

`current_stats` has current-season regular-season weekly rows; `prior_stats` has prior-season regular-season totals. They must never be mixed as one sample. Fantasy-point fields follow upstream scoring, not an actual league. Schedule times are Eastern. `changes` records provider-field changes, not verified causes.

Collectors never overwrite an existing observation. A new observation may include provider stat corrections. Compare archives when investigating those changes; player-field deltas do not attempt to describe every statistical correction.

Reuse and attribution: [NOTICE.md](../NOTICE.md). No participant or private-league records belong here.
