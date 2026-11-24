# Current public fantasy-football context

Observed at **2026-11-24T23:03:09.600565+00:00**. Collection health: **degraded**.

Generated evidence, not projections or start/sit advice. Treat as stale after 8 days; recheck player availability immediately before decisions. A fresh download does not prove upstream facts are fresh.

Provider season label: 2026; phase: regular; display week: 11. Confirm actual kickoff dates below; a provider week label does not prove games were played.

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
| 13 | 2026-12-06 | 13:00 | CIN | CLE |
| 13 | 2026-12-06 | 13:00 | GB | NO |
| 13 | 2026-12-06 | 13:00 | SF | NYG |
| 13 | 2026-12-06 | 13:00 | LAC | TB |
| 13 | 2026-12-06 | 13:00 | WAS | TEN |
| 13 | 2026-12-06 | 16:05 | PHI | ARI |
| 13 | 2026-12-06 | 16:05 | MIA | DEN |
| 13 | 2026-12-06 | 16:25 | CAR | MIN |
| 13 | 2026-12-06 | 16:25 | BUF | NE |
| 13 | 2026-12-06 | 20:20 | HOU | PIT |
| 13 | 2026-12-07 | 20:15 | DAL | SEA |
| 14 | 2026-12-10 | 20:15 | MIN | NE |
| 14 | 2026-12-13 | 13:00 | TB | BAL |

## Aggregate market attention: last 24 hours

Platform-wide adds/drops are research leads, not rankings, roster availability, unique-manager counts, or recommended transactions.

### Trending adds

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Chris Rodriguez Jr. | RB | JAX | 1063440 | unknown |
| WAS D/ST | DEF | WAS | 715561 | unknown |
| Justice Hill | RB | BAL | 419229 | unknown |
| NYG D/ST | DEF | NYG | 412012 | unknown |
| Jacory Croskey-Merritt | RB | WAS | 392004 | unknown |
| Chimere Dike | WR | TEN | 287253 | unknown |
| CLE D/ST | DEF | CLE | 251552 | unknown |
| Tyler Higbee | TE | LAR | 233073 | unknown |
| Konata Mumpfield | WR | LAR | 216423 | unknown |
| Fernando Mendoza | QB | LV | 213296 | unknown |
| Ted Hurst III | WR | TB | 205212 | unknown |
| Jack Bech | WR | LV | 191702 | unknown |
| Deshaun Watson | QB | CLE | 188400 | unknown |
| Tai Felton | WR | MIN | 161538 | unknown |
| Samaje Perine | RB | CIN | 155276 | unknown |

### Trending drops

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Michael Mayer | TE | LV | 535230 | unknown |
| DET D/ST | DEF | DET | 464031 | unknown |
| Seth McGowan | RB | IND | 396144 | Out |
| Mark Andrews | TE | BAL | 291060 | unknown |
| Terrance Ferguson | TE | LAR | 200072 | IR |
| Xavier Hutchinson | WR | HOU | 182392 | unknown |
| Pat Bryant | WR | DEN | 180696 | unknown |
| Elic Ayomanor | WR | TEN | 175392 | unknown |
| Adonai Mitchell | WR | NYJ | 161480 | unknown |
| Courtland Sutton | WR | DEN | 150705 | unknown |
| Ryan Flournoy | WR | DAL | 144456 | unknown |
| Tank Dell | WR | HOU | 140864 | unknown |
| Puka Nacua | WR | LAR | 123172 | IR |
| Bo Nix | QB | DEN | 103494 | unknown |
| Rachaad White | RB | WAS | 98820 | unknown |

Null/unknown injury flags do not confirm health; provider team labels can lag transactions.

## Changes since previous observation

Compared with 2026-11-17T21:47:54.536641+00:00. Changes are provider-field changes, not independently confirmed news; null means unknown, not recovered. New/missing records are not interpreted as signings/releases.

| Player | Field | Before | After |
| --- | --- | --- | --- |
| Kayshon Boutte | injury_status | unknown | Questionable |
| Adam Randall | status | Inactive | Active |
| Adam Randall | injury_status | IR | Out |
| Oronde Gadsden | injury_status | Questionable | unknown |
| Pierre Strong Jr. | injury_status | Out | unknown |
| Audric Estime | injury_status | unknown | Out |
| Noah Gray | injury_status | unknown | Questionable |
| Robert Henry Jr. | injury_status | unknown | Out |
| Jauan Jennings | injury_status | Out | unknown |
| Charlie Jones | team | unknown | NYG |
| Jaylen Waddle | injury_status | Out | unknown |
| Brandin Cooks | team | SF | unknown |
| Brandin Cooks | injury_status | Out | unknown |
| Daniel Jones | team | IND | unknown |
| T.J. Hockenson | injury_status | Out | unknown |
| Miller Moss | team | CHI | unknown |
| Geno Smith | injury_status | Out | unknown |
| Ladd McConkey | injury_status | Out | unknown |
| Ben VanSumeren | status | Active | Inactive |
| Ben VanSumeren | injury_status | Out | IR |
| Demarcus Robinson | injury_status | unknown | Out |
| Isaiah Williams | injury_status | unknown | Out |
| Brady Boyd | team | unknown | MIA |
| Justin Herbert | injury_status | unknown | Questionable |
| Sam LaPorta | injury_status | unknown | Questionable |
| Britain Covey | injury_status | Out | unknown |
| Luther Burden III | injury_status | Questionable | unknown |
| Dontayvion Wicks | status | Active | Inactive |
| Dontayvion Wicks | injury_status | Out | IR |
| Joey Aguilar | injury_status | Out | unknown |
| Baker Mayfield | injury_status | Questionable | unknown |
| Michael Carter | team | unknown | TEN |
| Carson Beck | injury_status | unknown | Out |
| Ronnie Bell | team | unknown | ARI |
| Gregory Desrosiers Jr. | injury_status | unknown | Out |
| Roman Wilson | status | Inactive | Active |
| Roman Wilson | injury_status | IR | unknown |
| Keaton Mitchell | injury_status | unknown | Questionable |
| Chris Bell | injury_status | Out | Questionable |
| Tyreek Hill | injury_status | unknown | Questionable |
| Easton Stick | injury_status | unknown | Out |
| Mike Evans | injury_status | Out | unknown |
| Seth McGowan | injury_status | unknown | Out |
| Tim Patrick | injury_status | Out | unknown |
| Cole Payton | injury_status | unknown | Out |
| Derrick Henry | injury_status | unknown | Questionable |
| Will Shipley | status | Inactive | Active |
| Will Shipley | injury_status | IR | Questionable |
| Saquon Barkley | injury_status | unknown | Questionable |
| Ian Wheeler | team | unknown | LAC |
| George Holani | injury_status | Out | IR |
| Sean McKeon | team | unknown | IND |
| Sean McKeon | status | Inactive | Active |
| Sean McKeon | injury_status | Questionable | unknown |
| Kedon Slovis | team | BAL | unknown |
| Kedon Slovis | injury_status | Out | unknown |
| Jacory Croskey-Merritt | status | Inactive | Active |
| Jacory Croskey-Merritt | injury_status | IR | unknown |
| Isaiah Hodgins | team | PIT | unknown |
| CJ Donaldson | injury_status | Out | unknown |

120 field changes total; complete list in data/latest.json. No causal explanation is inferred.

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
