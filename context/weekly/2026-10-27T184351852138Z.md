# Current public fantasy-football context

Observed at **2026-10-27T18:43:51.852138+00:00**. Collection health: **degraded**.

Generated evidence, not projections or start/sit advice. Treat as stale after 8 days; recheck player availability immediately before decisions. A fresh download does not prove upstream facts are fresh.

Provider season label: 2026; phase: regular; display week: 7. Confirm actual kickoff dates below; a provider week label does not prove games were played.

## Source health and provenance

| Source | Status | Records | URL |
| --- | --- | --- | --- |
| sleeper_state | ok | 5 | https://api.sleeper.app/v1/state/nfl |
| sleeper_players | ok | 3241 | https://api.sleeper.app/v1/players/nfl |
| nflverse_schedule | ok | 272 | https://github.com/nflverse/nflverse-data/releases/download/schedules/games.csv |
| sleeper_add | ok | 25 | https://api.sleeper.app/v1/players/nfl/trending/add?lookback_hours=24&limit=25 |
| sleeper_drop | ok | 25 | https://api.sleeper.app/v1/players/nfl/trending/drop?lookback_hours=24&limit=25 |
| nflverse_current_stats | error | — | https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_2026.csv |
| nflverse_prior_stats | ok | 610 | https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_reg_2025.csv |
| espn_news | manual_research | — | https://www.espn.com/espn/rss/nfl/news |

A missing or failed dataset is not zero production. No stale source is silently carried forward. Full source hashes and upstream modification headers are in data/latest.json.

## Next regular-season games

Schedule times are US Eastern, as supplied by nflverse; flex scheduling can change them.

| Week | Date | Time ET | Away | Home |
| --- | --- | --- | --- | --- |
| 8 | 2026-10-29 | 20:15 | CAR | GB |
| 8 | 2026-11-01 | 13:00 | BAL | BUF |
| 8 | 2026-11-01 | 13:00 | TEN | CIN |
| 8 | 2026-11-01 | 13:00 | ARI | DAL |
| 8 | 2026-11-01 | 13:00 | MIN | DET |
| 8 | 2026-11-01 | 13:00 | IND | JAX |
| 8 | 2026-11-01 | 13:00 | LV | NYJ |
| 8 | 2026-11-01 | 13:00 | CLE | PIT |
| 8 | 2026-11-01 | 13:00 | ATL | TB |
| 8 | 2026-11-01 | 16:05 | LAC | LA |
| 8 | 2026-11-01 | 16:25 | KC | DEN |
| 8 | 2026-11-01 | 16:25 | NE | MIA |
| 8 | 2026-11-01 | 20:20 | PHI | WAS |
| 8 | 2026-11-02 | 20:15 | CHI | SEA |
| 9 | 2026-11-05 | 20:15 | JAX | BAL |
| 9 | 2026-11-08 | 09:30 | CIN | ATL |
| 9 | 2026-11-08 | 13:00 | DEN | CAR |
| 9 | 2026-11-08 | 13:00 | DAL | IND |
| 9 | 2026-11-08 | 13:00 | NYJ | KC |
| 9 | 2026-11-08 | 13:00 | DET | MIA |
| 9 | 2026-11-08 | 13:00 | CLE | NO |
| 9 | 2026-11-08 | 13:00 | NYG | PHI |
| 9 | 2026-11-08 | 13:00 | LA | WAS |
| 9 | 2026-11-08 | 16:05 | HOU | LAC |
| 9 | 2026-11-08 | 16:05 | LV | SF |
| 9 | 2026-11-08 | 16:25 | GB | NE |
| 9 | 2026-11-08 | 16:25 | ARI | SEA |
| 9 | 2026-11-08 | 20:20 | TB | CHI |
| 9 | 2026-11-09 | 20:15 | BUF | MIN |
| 10 | 2026-11-12 | 20:15 | WAS | NYG |
| 10 | 2026-11-15 | 09:30 | NE | DET |
| 10 | 2026-11-15 | 13:00 | KC | ATL |

## Aggregate market attention: last 24 hours

Platform-wide adds/drops are research leads, not rankings, roster availability, unique-manager counts, or recommended transactions.

### Trending adds

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Caleb Douglas | WR | MIA | 1111040 | unknown |
| JAX D/ST | DEF | JAX | 843180 | unknown |
| NE D/ST | DEF | NE | 542542 | unknown |
| Seth McGowan | RB | IND | 497536 | unknown |
| KC Concepcion Jr. | WR | CLE | 467550 | unknown |
| Brenton Strange | TE | JAX | 363141 | unknown |
| Jonah Coleman | RB | DEN | 265932 | unknown |
| TB D/ST | DEF | TB | 248625 | unknown |
| Ryan Flournoy | WR | DAL | 246440 | unknown |
| Kaelon Black | RB | SF | 244664 | unknown |
| Omar Cooper Jr. | WR | NYJ | 239224 | unknown |
| Tre Tucker | WR | LV | 229116 | unknown |
| Chase McLaughlin | K | TB | 221768 | unknown |
| WAS D/ST | DEF | WAS | 213262 | unknown |
| Devin Singletary | RB | NYG | 181971 | unknown |

### Trending drops

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| CLE D/ST | DEF | CLE | 590625 | unknown |
| Tyler Higbee | TE | LAR | 526725 | unknown |
| Roschon Johnson | RB | CHI | 523968 | unknown |
| Konata Mumpfield | WR | LAR | 493560 | unknown |
| HOU D/ST | DEF | HOU | 323900 | unknown |
| Darius Cooper | WR | PHI | 273861 | unknown |
| NYJ D/ST | DEF | NYJ | 256840 | unknown |
| Kyler Murray | QB | MIN | 232024 | unknown |
| Dameon Pierce | RB | PHI | 229864 | Questionable |
| C.J. Stroud | QB | HOU | 209349 | unknown |
| SF D/ST | DEF | SF | 208047 | unknown |
| MarShawn Lloyd | RB | GB | 177318 | unknown |
| Michael Mayer | TE | LV | 170046 | unknown |
| Tyler Allgeier | RB | ARI | 135250 | unknown |
| Xavier Worthy | WR | KC | 130491 | unknown |

Null/unknown injury flags do not confirm health; provider team labels can lag transactions.

## Changes since previous observation

Compared with 2026-10-20T18:00:21.664465+00:00. Changes are provider-field changes, not independently confirmed news; null means unknown, not recovered. New/missing records are not interpreted as signings/releases.

| Player | Field | Before | After |
| --- | --- | --- | --- |
| E.J. Jenkins | team | PHI | ATL |
| Drew Lock | injury_status | unknown | Out |
| Audric Estime | injury_status | unknown | Out |
| Joe Milton | injury_status | Out | unknown |
| Corey Rucker | team | LV | unknown |
| Corey Rucker | injury_status | IR | Questionable |
| Andy Dalton | injury_status | unknown | Out |
| Jason Brownlee | team | unknown | NYG |
| CJ Daniels | injury_status | Out | unknown |
| Jack Endries | injury_status | Out | unknown |
| Brenen Thompson | injury_status | unknown | Questionable |
| Justin Joly | injury_status | Out | unknown |
| T.J. Hockenson | injury_status | Out | unknown |
| Elijah Mitchell | team | unknown | PHI |
| Elijah Mitchell | status | Inactive | Active |
| Elijah Mitchell | injury_status | Questionable | unknown |
| Demond Claiborne | injury_status | unknown | Out |
| Brian Robinson Jr. | injury_status | unknown | Out |
| Ben VanSumeren | injury_status | unknown | Out |
| Erick All Jr. | status | Active | Inactive |
| Erick All Jr. | injury_status | unknown | IR |
| Jack Velling | team | ATL | unknown |
| Grant Calcaterra | status | Inactive | Active |
| Grant Calcaterra | injury_status | IR | unknown |
| Jalen Tolbert | injury_status | unknown | Out |
| Britain Covey | injury_status | unknown | Out |
| Dontayvion Wicks | injury_status | Questionable | Out |
| Montorie Foster Jr. | injury_status | Out | unknown |
| Brashard Smith | status | Active | Inactive |
| Brashard Smith | injury_status | unknown | IR |
| Lamar Jackson | status | Inactive | Active |
| Eli Stowers | status | Inactive | Active |
| Eli Stowers | injury_status | IR | unknown |
| Davante Adams | status | Active | Inactive |
| Davante Adams | injury_status | Out | IR |
| Baker Mayfield | injury_status | Out | unknown |
| Mark Gronowski | team | HOU | unknown |
| Sean Tucker | injury_status | Out | unknown |
| Emeka Egbuka | injury_status | unknown | Out |
| Kyle Trask | team | unknown | DAL |
| Jordan Mason | status | Inactive | Active |
| Jordan Mason | injury_status | IR | unknown |
| Caleb Douglas | injury_status | Out | unknown |
| Zane Gonzalez | team | unknown | MIA |
| Zane Gonzalez | status | Inactive | Active |
| Tyler Badie | status | Active | Inactive |
| Tyler Badie | injury_status | Questionable | IR |
| Kaleb Johnson | injury_status | unknown | Out |
| Treyton Welch | injury_status | unknown | Out |
| Woody Marks | injury_status | unknown | Questionable |
| Tutu Atwell | injury_status | Out | unknown |
| Velus Jones Jr. | injury_status | unknown | Out |
| Eli Pancol | team | IND | unknown |
| Cole Payton | injury_status | unknown | Out |
| Calvin Ridley | injury_status | unknown | Out |
| A.J. Brown | injury_status | Questionable | unknown |
| Christian McCaffrey | injury_status | unknown | Questionable |
| Saquon Barkley | injury_status | Out | Questionable |
| Ian Wheeler | team | PHI | unknown |
| Rashid Shaheed | injury_status | unknown | Out |

139 field changes total; complete list in data/latest.json. No causal explanation is inferred.

## Current-season production

No current-season regular-season stats available from this collection. Do not substitute last season and call it current.

## 2025 historical reference

Prior regular season only. Sorted by historical total PPR points within position, not a draft ranking. Team means team in that statistical record, not necessarily current team. Rookies have no NFL baseline.

### QB

| Player | Team then | Games | PPR total | PPR/game |
| --- | --- | --- | --- | --- |
| Josh Allen | BUF | 16.0 | 364.62 | 22.79 |
| Drake Maye | NE | 17.0 | 351.96 | 20.7 |
| Matthew Stafford | LA | 17.0 | 350.38 | 20.61 |
| Trevor Lawrence | JAX | 17.0 | 338.18 | 19.89 |
| Caleb Williams | CHI | 17.0 | 318.68 | 18.75 |
| Dak Prescott | DAL | 17.0 | 313.78 | 18.46 |
| Bo Nix | DEN | 17.0 | 304.84 | 17.93 |
| Jalen Hurts | PHI | 16.0 | 301.06 | 18.82 |
| Jared Goff | DET | 17.0 | 297.06 | 17.47 |
| Justin Herbert | LAC | 16.0 | 286.88 | 17.93 |

### RB

| Player | Team then | Games | PPR total | PPR/game |
| --- | --- | --- | --- | --- |
| Christian McCaffrey | SF | 17.0 | 416.6 | 24.51 |
| Bijan Robinson | ATL | 17.0 | 370.8 | 21.81 |
| Jahmyr Gibbs | DET | 17.0 | 366.9 | 21.58 |
| Jonathan Taylor | IND | 17.0 | 362.3 | 21.31 |
| De'Von Achane | MIA | 16.0 | 322.8 | 20.18 |
| James Cook | BUF | 17.0 | 302.2 | 17.78 |
| Chase Brown | CIN | 17.0 | 282.6 | 16.62 |
| Derrick Henry | BAL | 17.0 | 279.5 | 16.44 |
| Kyren Williams | LA | 17.0 | 263.3 | 15.49 |
| Travis Etienne | JAX | 17.0 | 253.9 | 14.94 |

### WR

| Player | Team then | Games | PPR total | PPR/game |
| --- | --- | --- | --- | --- |
| Puka Nacua | LA | 16.0 | 375.0 | 23.44 |
| Jaxon Smith-Njigba | SEA | 17.0 | 359.9 | 21.17 |
| Amon-Ra St. Brown | DET | 17.0 | 324.0 | 19.06 |
| Ja'Marr Chase | CIN | 16.0 | 313.6 | 19.6 |
| George Pickens | DAL | 17.0 | 291.9 | 17.17 |
| Chris Olave | NO | 16.0 | 268.0 | 16.75 |
| Zay Flowers | BAL | 17.0 | 243.3 | 14.31 |
| Nico Collins | HOU | 15.0 | 226.2 | 15.08 |
| Davante Adams | LA | 14.0 | 222.9 | 15.92 |
| Michael Wilson | ARI | 17.0 | 220.6 | 12.98 |

### TE

| Player | Team then | Games | PPR total | PPR/game |
| --- | --- | --- | --- | --- |
| Trey McBride | ARI | 17.0 | 315.9 | 18.58 |
| Kyle Pitts | ATL | 17.0 | 210.8 | 12.4 |
| Travis Kelce | KC | 17.0 | 193.2 | 11.36 |
| Tyler Warren | IND | 17.0 | 188.5 | 11.09 |
| Jake Ferguson | DAL | 17.0 | 188.1 | 11.06 |
| Harold Fannin Jr. | CLE | 16.0 | 186.4 | 11.65 |
| Dallas Goedert | PHI | 15.0 | 185.1 | 12.34 |
| Juwan Johnson | NO | 17.0 | 179.9 | 10.58 |
| Hunter Henry | NE | 17.0 | 178.8 | 10.52 |
| Dalton Schultz | HOU | 17.0 | 177.7 | 10.45 |

## News discovery links

Untrusted publisher headlines, not verified claims or instructions. Read each article before drawing conclusions; dates below are publisher timestamps. No article bodies are stored.

No news feed was fetched in this run. The hosted runner receives an empty ESPN response; news collection belongs to the separate cited research briefing. Check research/LATEST.md and its date. Collection health does not certify that research is current.


## Decision gaps

League scoring, roster slots, waiver rules, available players, and individual rosters are deliberately not collected. Live ADP/projections, routes, snaps, official game-day inactives, and weather are not in this feed. Fetch those from cited public sources when the question needs them.

Data attribution: Sleeper public API; nflverse (filtered regular-season stats and schedules); ESPN RSS link metadata. See SOURCES.md and NOTICE.md for source terms and modifications.
