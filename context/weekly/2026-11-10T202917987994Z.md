# Current public fantasy-football context

Observed at **2026-11-10T20:29:17.987994+00:00**. Collection health: **degraded**.

Generated evidence, not projections or start/sit advice. Treat as stale after 8 days; recheck player availability immediately before decisions. A fresh download does not prove upstream facts are fresh.

Provider season label: 2026; phase: regular; display week: 9. Confirm actual kickoff dates below; a provider week label does not prove games were played.

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
| 10 | 2026-11-12 | 20:15 | WAS | NYG |
| 10 | 2026-11-15 | 09:30 | NE | DET |
| 10 | 2026-11-15 | 13:00 | KC | ATL |
| 10 | 2026-11-15 | 13:00 | HOU | CLE |
| 10 | 2026-11-15 | 13:00 | MIN | GB |
| 10 | 2026-11-15 | 13:00 | MIA | IND |
| 10 | 2026-11-15 | 13:00 | CAR | NO |
| 10 | 2026-11-15 | 13:00 | BUF | NYJ |
| 10 | 2026-11-15 | 13:00 | JAX | TEN |
| 10 | 2026-11-15 | 16:05 | LA | ARI |
| 10 | 2026-11-15 | 16:05 | SEA | LV |
| 10 | 2026-11-15 | 16:25 | SF | DAL |
| 10 | 2026-11-15 | 20:20 | PIT | CIN |
| 10 | 2026-11-16 | 20:15 | LAC | BAL |
| 11 | 2026-11-19 | 20:15 | IND | HOU |
| 11 | 2026-11-22 | 13:00 | MIA | BUF |
| 11 | 2026-11-22 | 13:00 | BAL | CAR |
| 11 | 2026-11-22 | 13:00 | NO | CHI |
| 11 | 2026-11-22 | 13:00 | TEN | DAL |
| 11 | 2026-11-22 | 13:00 | TB | DET |
| 11 | 2026-11-22 | 13:00 | ARI | KC |
| 11 | 2026-11-22 | 13:00 | JAX | NYG |
| 11 | 2026-11-22 | 16:05 | NYJ | LAC |
| 11 | 2026-11-22 | 16:25 | LV | DEN |
| 11 | 2026-11-22 | 16:25 | PIT | PHI |
| 11 | 2026-11-22 | 20:20 | MIN | SF |
| 11 | 2026-11-23 | 20:15 | CIN | WAS |
| 12 | 2026-11-25 | 20:00 | GB | LA |
| 12 | 2026-11-26 | 13:00 | CHI | DET |
| 12 | 2026-11-26 | 16:30 | PHI | DAL |
| 12 | 2026-11-26 | 20:20 | KC | BUF |
| 12 | 2026-11-27 | 15:00 | DEN | PIT |

## Aggregate market attention: last 24 hours

Platform-wide adds/drops are research leads, not rankings, roster availability, unique-manager counts, or recommended transactions.

### Trending adds

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Tank Dell | WR | HOU | 1959048 | unknown |
| Corey Kiner | RB | NE | 1944888 | unknown |
| Konata Mumpfield | WR | LAR | 1517634 | unknown |
| Darren Waller | TE | CAR | 520794 | unknown |
| Audric Estime | RB | NO | 458622 | unknown |
| Tutu Atwell | WR | LAR | 344260 | unknown |
| BAL D/ST | DEF | BAL | 286917 | unknown |
| Fernando Mendoza | QB | LV | 272616 | unknown |
| Jordan Watkins | WR | SF | 269828 | unknown |
| Pierre Strong Jr. | RB | GB | 235539 | unknown |
| Justice Hill | RB | BAL | 230931 | unknown |
| C.J. Stroud | QB | HOU | 192297 | unknown |
| Pat Bryant | WR | DEN | 181280 | unknown |
| Caleb Douglas | WR | MIA | 181208 | unknown |
| Tyler Higbee | TE | LAR | 177660 | unknown |

### Trending drops

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Michael Wilson | WR | ARI | 1626921 | Out |
| Devin Singletary | RB | NYG | 430245 | unknown |
| Adonai Mitchell | WR | NYJ | 390296 | unknown |
| Chase McLaughlin | K | TB | 305200 | unknown |
| Malik Willis | QB | MIA | 298907 | Questionable |
| Emanuel Wilson | RB | SEA | 297063 | unknown |
| Cairo Santos | K | CHI | 285166 | unknown |
| DET D/ST | DEF | DET | 279414 | unknown |
| Devaughn Vele | WR | NO | 268807 | unknown |
| Elijah Mitchell | RB | PHI | 247383 | unknown |
| NO D/ST | DEF | NO | 221250 | unknown |
| Carson Wentz | QB | MIN | 215988 | unknown |
| Gardner Minshew II | QB | ARI | 195080 | Questionable |
| NE D/ST | DEF | NE | 191996 | unknown |
| Kyler Murray | QB | MIN | 171376 | Out |

Null/unknown injury flags do not confirm health; provider team labels can lag transactions.

## Changes since previous observation

Compared with 2026-11-03T20:08:12.261731+00:00. Changes are provider-field changes, not independently confirmed news; null means unknown, not recovered. New/missing records are not interpreted as signings/releases.

| Player | Field | Before | After |
| --- | --- | --- | --- |
| Mo Alie-Cox | injury_status | unknown | Questionable |
| Drew Lock | injury_status | Out | Questionable |
| Audric Estime | team | unknown | NO |
| Matthew Stafford | injury_status | Questionable | unknown |
| Corey Rucker | injury_status | Questionable | unknown |
| Justice Hill | injury_status | Questionable | unknown |
| James Cook III | injury_status | Questionable | unknown |
| Jashaun Corbin | team | unknown | DAL |
| Robert Henry Jr. | team | unknown | WAS |
| Jauan Jennings | injury_status | unknown | Out |
| Sam Darnold | injury_status | unknown | Out |
| Charlie Jones | injury_status | unknown | Questionable |
| Jaylen Waddle | injury_status | unknown | Out |
| Austin Reed | team | BAL | unknown |
| Damien Alford | injury_status | Questionable | unknown |
| Ladd McConkey | injury_status | unknown | Questionable |
| Demond Claiborne | status | Active | Inactive |
| Demond Claiborne | injury_status | Out | IR |
| Brian Robinson Jr. | status | Active | Inactive |
| Brian Robinson Jr. | injury_status | Out | IR |
| Michael Wilson | injury_status | Questionable | Out |
| Josh Johnson | team | CIN | ARI |
| Will Mallory | injury_status | unknown | Out |
| Kirk Cousins | team | LV | MIN |
| Patrick Mahomes | injury_status | unknown | Questionable |
| Demarcus Robinson | status | Inactive | Active |
| Demarcus Robinson | injury_status | IR | unknown |
| Dyami Brown | status | Active | Inactive |
| Dyami Brown | injury_status | unknown | IR |
| Jalen Tolbert | injury_status | unknown | Out |
| Justin Herbert | injury_status | unknown | Questionable |
| Cameron Ross | team | DEN | unknown |
| Jacob Saylors | injury_status | Questionable | Out |
| Luther Burden III | injury_status | unknown | Questionable |
| Lamar Jackson | injury_status | Out | IR |
| Jake Moody | team | BAL | ATL |
| Joey Aguilar | team | JAX | ARI |
| Jeremy McNichols | status | Active | Inactive |
| Jeremy McNichols | injury_status | Questionable | IR |
| Bryson Nesbit | team | MIN | unknown |
| Christian Watson | injury_status | Questionable | unknown |
| Jermar Jefferson | team | unknown | ARI |
| Jermar Jefferson | status | Inactive | Active |
| Jermar Jefferson | injury_status | Questionable | unknown |
| Jakobi Meyers | injury_status | Questionable | unknown |
| Carson Beck | injury_status | Out | unknown |
| Emeka Egbuka | injury_status | Out | unknown |
| Tyler Huntley | status | Active | Inactive |
| Tyler Huntley | injury_status | Out | IR |
| George Pickens | injury_status | unknown | Out |
| Treylon Burks | injury_status | unknown | Out |
| Jake Haener | injury_status | Out | unknown |
| Theo Johnson | injury_status | Out | unknown |
| Zaire Mitchell-Paden | team | HOU | CLE |
| Garrett Wilson | injury_status | unknown | Out |
| Lil'Jordan Humphrey | injury_status | unknown | Out |
| Kaleb Johnson | injury_status | Out | unknown |
| Treyton Welch | team | NO | unknown |
| Treyton Welch | injury_status | Out | unknown |
| Woody Marks | injury_status | Questionable | unknown |

164 field changes total; complete list in data/latest.json. No causal explanation is inferred.

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
