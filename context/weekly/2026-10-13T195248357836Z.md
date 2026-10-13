# Current public fantasy-football context

Observed at **2026-10-13T19:52:48.357836+00:00**. Collection health: **degraded**.

Generated evidence, not projections or start/sit advice. Treat as stale after 8 days; recheck player availability immediately before decisions. A fresh download does not prove upstream facts are fresh.

Provider season label: 2026; phase: regular; display week: 5. Confirm actual kickoff dates below; a provider week label does not prove games were played.

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
| 6 | 2026-10-15 | 20:15 | SEA | DEN |
| 6 | 2026-10-18 | 09:30 | HOU | JAX |
| 6 | 2026-10-18 | 13:00 | CHI | ATL |
| 6 | 2026-10-18 | 13:00 | BAL | CLE |
| 6 | 2026-10-18 | 13:00 | TEN | IND |
| 6 | 2026-10-18 | 13:00 | NYJ | NE |
| 6 | 2026-10-18 | 13:00 | NO | NYG |
| 6 | 2026-10-18 | 13:00 | CAR | PHI |
| 6 | 2026-10-18 | 13:00 | PIT | TB |
| 6 | 2026-10-18 | 16:05 | ARI | LA |
| 6 | 2026-10-18 | 16:25 | LAC | KC |
| 6 | 2026-10-18 | 16:25 | BUF | LV |
| 6 | 2026-10-18 | 20:20 | DAL | GB |
| 6 | 2026-10-19 | 20:15 | WAS | SF |
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

## Aggregate market attention: last 24 hours

Platform-wide adds/drops are research leads, not rankings, roster availability, unique-manager counts, or recommended transactions.

### Trending adds

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Dameon Pierce | RB | PHI | 1727720 | unknown |
| MarShawn Lloyd | RB | GB | 1394361 | unknown |
| Brenton Strange | TE | JAX | 804033 | unknown |
| NE D/ST | DEF | NE | 745668 | unknown |
| Darius Cooper | WR | PHI | 603610 | unknown |
| Tyler Higbee | TE | LAR | 410436 | unknown |
| Tyler Loop | K | BAL | 409182 | unknown |
| Kimani Vidal | RB | LAC | 382165 | unknown |
| IND D/ST | DEF | IND | 311820 | unknown |
| SF D/ST | DEF | SF | 297720 | unknown |
| Nick Folk | K | ATL | 249480 | unknown |
| Kendrick Bourne | WR | ARI | 246066 | unknown |
| Efton Chism | WR | NE | 223356 | unknown |
| Germie Bernard | WR | PIT | 203079 | unknown |
| Aaron Rodgers | QB | PIT | 193104 | unknown |

### Trending drops

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Roman Wilson | WR | PIT | 768267 | Out |
| Dohnte Meyers | WR | CIN | 575703 | unknown |
| Kenyon Sadiq | TE | NYJ | 457209 | Out |
| Jake Bates | K | DET | 363464 | unknown |
| Will Shipley | RB | PHI | 335514 | Out |
| Keon Coleman | WR | BUF | 276507 | unknown |
| JAX D/ST | DEF | JAX | 266376 | unknown |
| CLE D/ST | DEF | CLE | 240107 | unknown |
| Keaton Mitchell | RB | LAC | 239580 | unknown |
| LV D/ST | DEF | LV | 218460 | unknown |
| Tre' Harris | WR | LAC | 210072 | Questionable |
| Michael Mayer | TE | LV | 201744 | unknown |
| Mike Gesicki | TE | CIN | 190324 | unknown |
| Kirk Cousins | QB | LV | 185888 | unknown |
| KC Concepcion | WR | CLE | 180666 | Out |

Null/unknown injury flags do not confirm health; provider team labels can lag transactions.

## Changes since previous observation

Compared with 2026-10-06T18:55:34.971311+00:00. Changes are provider-field changes, not independently confirmed news; null means unknown, not recovered. New/missing records are not interpreted as signings/releases.

| Player | Field | Before | After |
| --- | --- | --- | --- |
| CeeDee Lamb | injury_status | unknown | Questionable |
| Dante Pettis | team | SF | unknown |
| Dante Pettis | injury_status | unknown | Questionable |
| Pierre Strong | injury_status | Questionable | unknown |
| Drew Lock | injury_status | unknown | Questionable |
| Audric Estime | team | MIN | CLE |
| Robert Henry | injury_status | unknown | Out |
| Rachaad White | injury_status | Out | unknown |
| Andy Dalton | team | PHI | unknown |
| Chris Brooks | status | Active | Inactive |
| Chris Brooks | injury_status | Questionable | IR |
| Quez Watkins | team | unknown | IND |
| Kenny Fletcher | team | IND | unknown |
| Chris Moore | injury_status | Out | unknown |
| Jack Endries | injury_status | unknown | Out |
| Ko Kieft | injury_status | Out | unknown |
| Jaxon Smith-Njigba | injury_status | unknown | Questionable |
| Jacardia Wright | injury_status | unknown | Out |
| Eli Raridon | injury_status | Questionable | unknown |
| T.J. Hockenson | injury_status | unknown | Out |
| TreVeyon Henderson | injury_status | unknown | Out |
| Elijah Sarratt | injury_status | unknown | Out |
| Ladd McConkey | injury_status | Out | Questionable |
| Braxton Berrios | injury_status | Out | IR |
| Ja'Marr Chase | injury_status | Out | unknown |
| Tee Higgins | injury_status | Questionable | unknown |
| Jamari Thrash | team | unknown | LV |
| Jamari Thrash | status | Inactive | Active |
| Cameron Ross | team | unknown | DEN |
| Jalen Nailor | injury_status | Questionable | Out |
| Lamar Jackson | injury_status | Questionable | Out |
| Deebo Samuel | injury_status | unknown | Out |
| Mark Gronowski | team | unknown | HOU |
| Kenyon Sadiq | injury_status | unknown | Out |
| Tre' Harris | injury_status | unknown | Questionable |
| Dontae Fleming | team | unknown | NYG |
| Dontae Fleming | status | Inactive | Active |
| Luke McCaffrey | injury_status | Out | unknown |
| Dontae McMillan | team | unknown | SEA |
| Roman Wilson | injury_status | unknown | Out |
| Jake Haener | injury_status | unknown | Out |
| Hunter Long | status | Active | Inactive |
| Hunter Long | injury_status | Questionable | IR |
| Bryce Oliver | team | unknown | HOU |
| Tim Patrick | status | Inactive | Active |
| Tim Patrick | injury_status | IR | unknown |
| Cole Payton | injury_status | Out | unknown |
| Will Shipley | injury_status | unknown | Out |
| Jaylin Lane | status | Active | Inactive |
| Jaylin Lane | injury_status | Out | IR |
| Roman Hemby | injury_status | unknown | Out |
| DJ Moore | injury_status | Questionable | Out |
| Dallas Goedert | injury_status | Out | unknown |
| Ollie Gordon | injury_status | unknown | Questionable |
| Tyler Conklin | injury_status | Out | unknown |
| James Proche | team | unknown | CLE |
| Michael Penix | injury_status | unknown | Questionable |
| Jam Miller | team | unknown | ATL |
| Jeremiyah Love | injury_status | Questionable | unknown |
| Devin Neal | team | MIN | WAS |

152 field changes total; complete list in data/latest.json. No causal explanation is inferred.

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
