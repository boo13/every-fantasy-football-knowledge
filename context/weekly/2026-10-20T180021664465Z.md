# Current public fantasy-football context

Observed at **2026-10-20T18:00:21.664465+00:00**. Collection health: **degraded**.

Generated evidence, not projections or start/sit advice. Treat as stale after 8 days; recheck player availability immediately before decisions. A fresh download does not prove upstream facts are fresh.

Provider season label: 2026; phase: regular; display week: 6. Confirm actual kickoff dates below; a provider week label does not prove games were played.

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
| 7 | 2026-10-22 | 20:15 | NE | CHI |
| 7 | 2026-10-25 | 09:30 | PIT | NO |
| 7 | 2026-10-25 | 13:00 | SF | ATL |
| 7 | 2026-10-25 | 13:00 | CIN | BAL |
| 7 | 2026-10-25 | 13:00 | TB | CAR |
| 7 | 2026-10-25 | 13:00 | NYG | HOU |
| 7 | 2026-10-25 | 13:00 | IND | MIN |
| 7 | 2026-10-25 | 13:00 | MIA | NYJ |
| 7 | 2026-10-25 | 13:00 | CLE | TEN |
| 7 | 2026-10-25 | 16:05 | DEN | ARI |
| 7 | 2026-10-25 | 16:25 | GB | DET |
| 7 | 2026-10-25 | 16:25 | LA | LV |
| 7 | 2026-10-25 | 20:20 | KC | SEA |
| 7 | 2026-10-26 | 20:15 | DAL | PHI |
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

## Aggregate market attention: last 24 hours

Platform-wide adds/drops are research leads, not rankings, roster availability, unique-manager counts, or recommended transactions.

### Trending adds

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Omar Cooper | WR | NYJ | 3141064 | unknown |
| CLE D/ST | DEF | CLE | 1236914 | unknown |
| Konata Mumpfield | WR | LAR | 818685 | unknown |
| Kyler Murray | QB | MIN | 637600 | unknown |
| Tank Dell | WR | HOU | 569368 | IR |
| C.J. Stroud | QB | HOU | 523376 | unknown |
| Michael Mayer | TE | LV | 475542 | unknown |
| Roschon Johnson | RB | CHI | 361280 | unknown |
| Chase McLaughlin | K | TB | 354176 | unknown |
| Terrance Ferguson | TE | LAR | 347920 | IR |
| Tre Tucker | WR | LV | 344280 | unknown |
| MIN D/ST | DEF | MIN | 315230 | unknown |
| Tyrone Tracy | RB | NYG | 309216 | unknown |
| Kyle Pitts | TE | ATL | 306068 | unknown |
| Jake Bates | K | DET | 298728 | unknown |

### Trending drops

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| MarShawn Lloyd | RB | GB | 765333 | unknown |
| JAX D/ST | DEF | JAX | 459090 | unknown |
| Keaton Mitchell | RB | LAC | 407025 | unknown |
| Jalen Hurts | QB | PHI | 400116 | IR |
| NE D/ST | DEF | NE | 388773 | unknown |
| Tyler Higbee | TE | LAR | 381141 | unknown |
| Terry McLaurin | WR | WAS | 361350 | Out |
| Romeo Doubs | WR | NE | 353000 | IR |
| Darius Cooper | WR | PHI | 332906 | unknown |
| Emanuel Wilson | RB | SEA | 328293 | unknown |
| IND D/ST | DEF | IND | 314463 | unknown |
| Jacory Croskey-Merritt | RB | WAS | 291474 | IR |
| Nick Folk | K | ATL | 272142 | unknown |
| Najee Harris | RB | unknown | 269600 | unknown |
| Darren Waller | TE | CAR | 253674 | unknown |

Null/unknown injury flags do not confirm health; provider team labels can lag transactions.

## Changes since previous observation

Compared with 2026-10-13T19:52:48.357836+00:00. Changes are provider-field changes, not independently confirmed news; null means unknown, not recovered. New/missing records are not interpreted as signings/releases.

| Player | Field | Before | After |
| --- | --- | --- | --- |
| CeeDee Lamb | injury_status | Questionable | unknown |
| Ameer Abdullah | injury_status | unknown | Questionable |
| Drew Lock | injury_status | Questionable | unknown |
| Joe Milton | team | DAL | PHI |
| Joe Milton | injury_status | unknown | Out |
| Andy Dalton | team | unknown | ATL |
| Jaxon Smith-Njigba | injury_status | Questionable | unknown |
| Jaylen Waddle | injury_status | unknown | Questionable |
| Brenen Thompson | injury_status | Out | unknown |
| TreVeyon Henderson | injury_status | Out | unknown |
| Devin Singletary | injury_status | Out | unknown |
| Jalen Hurts | status | Active | Inactive |
| Jalen Hurts | injury_status | unknown | IR |
| Ladd McConkey | injury_status | Questionable | Out |
| Jake Browning | team | unknown | LAC |
| Cooper Rush | team | ATL | unknown |
| Cooper Rush | injury_status | Out | unknown |
| Will Mallory | status | Inactive | Active |
| Will Mallory | injury_status | IR | unknown |
| Jalen Nailor | injury_status | Out | unknown |
| Case Keenum | injury_status | unknown | Out |
| Dontayvion Wicks | injury_status | unknown | Questionable |
| Lamar Jackson | status | Active | Inactive |
| Jake Moody | team | unknown | BAL |
| Jeremy McNichols | status | Inactive | Active |
| Jeremy McNichols | injury_status | IR | unknown |
| Davante Adams | injury_status | unknown | Out |
| Tyler Warren | injury_status | unknown | Out |
| Kenyon Sadiq | injury_status | Out | unknown |
| Sean Tucker | injury_status | unknown | Out |
| Michael Carter | injury_status | Out | unknown |
| Tre' Harris | injury_status | Questionable | Out |
| Rico Dowdle | injury_status | Out | unknown |
| Dontae McMillan | team | SEA | unknown |
| Roman Wilson | status | Active | Inactive |
| Roman Wilson | injury_status | Out | IR |
| Theo Johnson | injury_status | unknown | Out |
| Zane Gonzalez | injury_status | Questionable | unknown |
| Tyler Badie | injury_status | unknown | Questionable |
| Mike Evans | injury_status | unknown | Out |
| Tutu Atwell | injury_status | unknown | Out |
| Savion Williams | status | Inactive | Active |
| Savion Williams | injury_status | IR | unknown |
| Irvin Charles | status | Inactive | Active |
| Irvin Charles | injury_status | IR | unknown |
| Jerome Ford | team | unknown | ARI |
| DeAndre Carter | team | unknown | DET |
| Will Shipley | status | Active | Inactive |
| Will Shipley | injury_status | Out | IR |
| A.J. Brown | status | Inactive | Active |
| A.J. Brown | injury_status | IR | Questionable |
| Mike Williams | injury_status | DNR | unknown |
| Ian Wheeler | team | unknown | PHI |
| Roman Hemby | injury_status | Out | unknown |
| Jacory Croskey-Merritt | status | Active | Inactive |
| Jacory Croskey-Merritt | injury_status | unknown | IR |
| Xavier Guillory | team | BAL | unknown |
| KaVontae Turpin | injury_status | unknown | Out |
| James Proche | team | CLE | unknown |
| Rashee Rice | injury_status | Questionable | Out |

135 field changes total; complete list in data/latest.json. No causal explanation is inferred.

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
