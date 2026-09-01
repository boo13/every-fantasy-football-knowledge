# Source registry

Registry reviewed: 2026-08-31. Each collection records its own observed timestamp, status, raw-response SHA-256, and any upstream Last-Modified header. The header may be missing or describe publication rather than the underlying event.

| Source | Collected | Authority and limitations |
| --- | --- | --- |
| [Sleeper API](https://docs.sleeper.com/) | NFL season state; filtered QB/RB/WR/TE/K/DEF catalog; 24-hour aggregate trending adds/drops | Documented, unauthenticated, read-only API for noncommercial use. No user/league/roster/draft endpoints. Catalog records may be stale; provider status is not official game availability. Trending is attention, not value. |
| [nflverse schedules](https://github.com/nflverse/nflverse-data/releases/tag/schedules) | Requested season's regular-season games, dates, times, teams and scores | Public structured secondary source; confirm flexed kickoffs and official schedule. Times are Eastern. Bootstrap observation used the underlying [nfldata file](https://github.com/nflverse/nfldata/blob/master/data/games.csv); future collection uses the release. |
| [nflverse player stats](https://github.com/nflverse/nflverse-data/releases/tag/stats_player) | Current regular-season weekly offense; prior regular-season offense totals | Source-defined standard and PPR fantasy points plus usage/counting stats, not custom-league scoring. Current rows may lag games or include corrections; no IDP/kicker production is collected. |
| [ESPN NFL RSS](https://www.espn.com/espn/rss/nfl/news) | At most 12 deduplicated headline/link/publication-time records | Discovery only. No article bodies, paywall bypass, or claim verification. Open articles and follow original team reports before making decisions. |

## Research sources, not automatically ingested

- [NFL news](https://www.nfl.com/news/) and [official team directory](https://www.nfl.com/teams/): use original team announcements, practice reports, game-status reports and inactive lists. Prefer the specific article/report URL in research citations.
- [NFL schedule](https://www.nfl.com/schedules/): confirm actual kickoff and bye timing.
- [NFL fantasy](https://www.nfl.com/fantasy-football/): dated analysis. Treat analyst judgment as opinion, not official confirmation of a player's role.
- [nflverse data availability](https://nflreadr.nflverse.com/): follow availability/update documentation and data dictionaries; do not assume a historical endpoint still publishes this season.
- [Sleeper scoring options](https://support.sleeper.com/en/articles/3998131-what-scoring-options-are-available): examples of configurable scoring, never a substitute for the actual league settings.

## Evidence hierarchy

Use official reports for availability and transactions; provider datasets for recorded statistics; multiple independent, dated analyses for forecasts. Two articles repeating one report are one underlying source. Where sources conflict, preserve the conflict and say which fact needs confirmation.

## Freshness and gaps

Weekly collection is not live monitoring. `--fresh` flags a snapshot older than eight days. An injury or depth-chart claim can become obsolete within hours even while that check passes. Always recheck before draft/waiver/lineup decisions.

Not supplied: live expert consensus projections/ADP, snap/route/red-zone opportunity data, official inactives, current weather, league-specific availability, or accurate custom scoring. Do not invent them. Collect public evidence for a question as needed and cite it; keep unavailable inputs explicit.

See [NOTICE.md](NOTICE.md) for attribution and reuse boundaries.
