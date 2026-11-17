# Current public fantasy-football context

Observed at **2026-11-17T21:47:54.536641+00:00**. Collection health: **degraded**.

Generated evidence, not projections or start/sit advice. Treat as stale after 8 days; recheck player availability immediately before decisions. A fresh download does not prove upstream facts are fresh.

Provider season label: 2026; phase: regular; display week: 10. Confirm actual kickoff dates below; a provider week label does not prove games were played.

## Source health and provenance

| Source | Status | Records | URL |
| --- | --- | --- | --- |
| sleeper_state | ok | 5 | https://api.sleeper.app/v1/state/nfl |
| sleeper_players | ok | 3242 | https://api.sleeper.app/v1/players/nfl |
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
| 12 | 2026-11-29 | 13:00 | NO | CIN |
| 12 | 2026-11-29 | 13:00 | BAL | HOU |
| 12 | 2026-11-29 | 13:00 | NYG | IND |
| 12 | 2026-11-29 | 13:00 | NYJ | MIA |
| 12 | 2026-11-29 | 13:00 | ATL | MIN |
| 12 | 2026-11-29 | 13:00 | TEN | JAX |
| 12 | 2026-11-29 | 16:05 | NE | LAC |
| 12 | 2026-11-29 | 16:25 | WAS | ARI |
| 12 | 2026-11-29 | 16:25 | SEA | SF |
| 12 | 2026-11-29 | 20:20 | LV | CLE |
| 12 | 2026-11-30 | 20:15 | CAR | TB |
| 13 | 2026-12-03 | 20:15 | KC | LA |
| 13 | 2026-12-06 | 13:00 | DET | ATL |
| 13 | 2026-12-06 | 13:00 | JAX | CHI |

## Aggregate market attention: last 24 hours

Platform-wide adds/drops are research leads, not rankings, roster availability, unique-manager counts, or recommended transactions.

### Trending adds

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Michael Mayer | TE | LV | 1249263 | unknown |
| Xavier Hutchinson | WR | HOU | 1034173 | Questionable |
| Ryan Flournoy | WR | DAL | 643760 | unknown |
| Seth McGowan | RB | IND | 623256 | unknown |
| Mark Andrews | TE | BAL | 603729 | unknown |
| Pat Bryant | WR | DEN | 588256 | unknown |
| Jordyn Tyson | WR | NO | 557112 | unknown |
| DET D/ST | DEF | DET | 516411 | unknown |
| Bo Nix | QB | DEN | 278412 | unknown |
| Elic Ayomanor | WR | TEN | 277988 | unknown |
| Chase McLaughlin | K | TB | 272152 | unknown |
| Cairo Santos | K | CHI | 238238 | unknown |
| Jacory Croskey-Merritt | RB | WAS | 236025 | IR |
| Kaelon Black | RB | SF | 210868 | unknown |
| Caleb Douglas | WR | MIA | 188472 | unknown |

### Trending drops

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Corey Kiner | RB | NE | 589974 | unknown |
| Devin Singletary | RB | NYG | 473715 | unknown |
| Darren Waller | TE | CAR | 279639 | unknown |
| Tutu Atwell | WR | LAR | 267666 | unknown |
| Jason Myers | K | SEA | 254200 | unknown |
| Jordan Addison | WR | MIN | 241893 | Out |
| Konata Mumpfield | WR | LAR | 238905 | unknown |
| BAL D/ST | DEF | BAL | 238542 | unknown |
| Tyler Higbee | TE | LAR | 228555 | unknown |
| Omar Cooper Jr. | WR | NYJ | 227544 | Out |
| Demarcus Robinson | WR | SF | 209976 | unknown |
| Chris Rodriguez Jr. | RB | JAX | 204003 | unknown |
| Audric Estime | RB | NO | 201501 | unknown |
| Devaughn Vele | WR | NO | 196525 | unknown |
| NE D/ST | DEF | NE | 190708 | unknown |

Null/unknown injury flags do not confirm health; provider team labels can lag transactions.

## Changes since previous observation

Compared with 2026-11-10T20:29:17.987994+00:00. Changes are provider-field changes, not independently confirmed news; null means unknown, not recovered. New/missing records are not interpreted as signings/releases.

| Player | Field | Before | After |
| --- | --- | --- | --- |
| Oronde Gadsden | injury_status | unknown | Questionable |
| Mo Alie-Cox | status | Active | Inactive |
| Mo Alie-Cox | injury_status | Questionable | IR |
| Pierre Strong Jr. | injury_status | unknown | Out |
| Drew Lock | injury_status | Questionable | unknown |
| Charlie Jones | team | NYG | unknown |
| Charlie Jones | injury_status | Questionable | unknown |
| Jason Brownlee | team | unknown | TEN |
| Chris Brooks | status | Inactive | Active |
| Chris Brooks | injury_status | IR | unknown |
| Kenny Fletcher Jr. | team | unknown | GB |
| Gary Jennings | team | LAC | unknown |
| Brandin Cooks | injury_status | unknown | Out |
| T.J. Hockenson | injury_status | unknown | Out |
| TreVeyon Henderson | status | Active | Inactive |
| TreVeyon Henderson | injury_status | Out | IR |
| Geno Smith | injury_status | unknown | Out |
| Ladd McConkey | injury_status | Questionable | Out |
| Michael Wilson | status | Active | Inactive |
| Michael Wilson | injury_status | Out | IR |
| Cooper Rush | team | unknown | TB |
| John FitzPatrick | team | CLE | KC |
| Patrick Mahomes | injury_status | Questionable | unknown |
| Jalen Tolbert | injury_status | Out | unknown |
| Justin Herbert | injury_status | Questionable | unknown |
| Jamari Thrash | team | unknown | TEN |
| Pharaoh Brown | injury_status | Out | unknown |
| Jacob Saylors | injury_status | Out | unknown |
| Joey Aguilar | injury_status | unknown | Out |
| Deebo Samuel Sr. | injury_status | Out | unknown |
| Baker Mayfield | injury_status | unknown | Questionable |
| Michael Carter | team | TEN | unknown |
| Jermar Jefferson | team | ARI | unknown |
| George Pickens | injury_status | Out | unknown |
| Treylon Burks | injury_status | Out | unknown |
| Garrett Wilson | injury_status | Out | unknown |
| Chris Bell | injury_status | unknown | Out |
| Zane Gonzalez | team | MIA | unknown |
| Treyton Welch | team | unknown | NO |
| Woody Marks | injury_status | unknown | Out |
| Tyreek Hill | injury_status | Questionable | unknown |
| Hunter Long | status | Inactive | Active |
| Hunter Long | injury_status | IR | unknown |
| Puka Nacua | injury_status | Questionable | IR |
| George Holani | injury_status | unknown | Out |
| Antonio Gibson | injury_status | Questionable | unknown |
| Barika Kpeenu | team | TB | unknown |
| J.J. McCarthy | injury_status | Questionable | unknown |
| Rashid Shaheed | injury_status | Out | unknown |
| Olamide Zaccheaus | injury_status | Questionable | unknown |
| Jonathan Mingo | injury_status | Questionable | Out |
| KaVontae Turpin | injury_status | Out | unknown |
| Max Brosmer | injury_status | unknown | Out |
| Shane Buechele | injury_status | unknown | Out |
| Tyler Goodson | status | Active | Inactive |
| Tyler Goodson | injury_status | Out | IR |
| Drake London | injury_status | unknown | Questionable |
| Marquise Brown | team | PHI | unknown |
| Xavier Worthy | injury_status | Out | unknown |
| Aidan O'Connell | injury_status | Out | unknown |

149 field changes total; complete list in data/latest.json. No causal explanation is inferred.

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
