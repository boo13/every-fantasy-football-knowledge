# Current public fantasy-football context

Observed at **2026-11-03T20:08:12.261731+00:00**. Collection health: **degraded**.

Generated evidence, not projections or start/sit advice. Treat as stale after 8 days; recheck player availability immediately before decisions. A fresh download does not prove upstream facts are fresh.

Provider season label: 2026; phase: regular; display week: 8. Confirm actual kickoff dates below; a provider week label does not prove games were played.

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

## Aggregate market attention: last 24 hours

Platform-wide adds/drops are research leads, not rankings, roster availability, unique-manager counts, or recommended transactions.

### Trending adds

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Adonai Mitchell | WR | NYJ | 1313192 | unknown |
| Tyler Allgeier | RB | ARI | 1015095 | unknown |
| Gardner Minshew II | QB | ARI | 826648 | unknown |
| Emmett Johnson | RB | KC | 580617 | unknown |
| Devin Singletary | RB | NYG | 550206 | unknown |
| HOU D/ST | DEF | HOU | 436820 | unknown |
| DET D/ST | DEF | DET | 368280 | unknown |
| Tyler Bass | K | BUF | 279975 | unknown |
| Mike Gesicki | TE | CIN | 240912 | unknown |
| Malik Willis | QB | MIA | 223363 | unknown |
| Ryan Flournoy | WR | DAL | 221072 | unknown |
| Malik Washington | WR | MIA | 220200 | unknown |
| Treylon Burks | WR | WAS | 176295 | unknown |
| SF D/ST | DEF | SF | 167346 | unknown |
| Cairo Santos | K | CHI | 164773 | unknown |

### Trending drops

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Emanuel Wilson | RB | SEA | 900135 | unknown |
| WAS D/ST | DEF | WAS | 464611 | unknown |
| NE D/ST | DEF | NE | 339220 | unknown |
| Tyler Loop | K | BAL | 287388 | Questionable |
| Lamar Jackson | QB | BAL | 287296 | Out |
| Keon Coleman | WR | BUF | 220950 | unknown |
| Omar Cooper Jr. | WR | NYJ | 210968 | unknown |
| Kendrick Bourne | WR | ARI | 205953 | Out |
| Tyler Higbee | TE | LAR | 194976 | unknown |
| Konata Mumpfield | WR | LAR | 159354 | unknown |
| CLE D/ST | DEF | CLE | 154665 | unknown |
| Mark Andrews | TE | BAL | 149805 | unknown |
| Chris Boswell | K | PIT | 148720 | unknown |
| Elijah Mitchell | RB | PHI | 143694 | unknown |
| Dameon Pierce | RB | PHI | 134704 | IR |

Null/unknown injury flags do not confirm health; provider team labels can lag transactions.

## Changes since previous observation

Compared with 2026-10-27T18:43:51.852138+00:00. Changes are provider-field changes, not independently confirmed news; null means unknown, not recovered. New/missing records are not interpreted as signings/releases.

| Player | Field | Before | After |
| --- | --- | --- | --- |
| Ameer Abdullah | injury_status | Questionable | unknown |
| Audric Estime | team | CLE | unknown |
| Audric Estime | injury_status | Out | unknown |
| Matthew Stafford | injury_status | unknown | Questionable |
| Justice Hill | injury_status | unknown | Questionable |
| James Cook III | injury_status | unknown | Questionable |
| Robert Henry Jr. | team | SEA | unknown |
| Robert Henry Jr. | injury_status | Out | unknown |
| Jason Brownlee | team | NYG | unknown |
| Jaylen Waddle | injury_status | Questionable | unknown |
| Brenen Thompson | injury_status | Questionable | Out |
| Justin Joly | injury_status | unknown | Out |
| Austin Reed | team | unknown | BAL |
| TreVeyon Henderson | injury_status | unknown | Out |
| Ladd McConkey | injury_status | Out | unknown |
| Michael Wilson | injury_status | unknown | Questionable |
| KhaDarel Hodge | team | unknown | SF |
| KhaDarel Hodge | injury_status | Questionable | unknown |
| Athan Kaliakmanis | injury_status | unknown | Out |
| Jake Ferguson | injury_status | unknown | Out |
| Jalen Tolbert | injury_status | Out | unknown |
| Malik Turner | team | SF | unknown |
| Jamari Thrash | team | LV | unknown |
| Pharaoh Brown | injury_status | unknown | Out |
| Jacob Saylors | injury_status | unknown | Questionable |
| Lamar Jackson | status | Active | Inactive |
| Jeremy McNichols | injury_status | unknown | Questionable |
| Bryson Nesbit | team | unknown | MIN |
| Bryson Nesbit | status | Inactive | Active |
| Bryson Nesbit | injury_status | Questionable | unknown |
| Tyler Warren | injury_status | Out | unknown |
| Christian Watson | injury_status | unknown | Questionable |
| Tre' Harris | injury_status | Out | unknown |
| Jakobi Meyers | injury_status | unknown | Questionable |
| Gregory Desrosiers | team | LAC | NYG |
| Tyler Huntley | injury_status | unknown | Out |
| Tyreek Hill | injury_status | unknown | Questionable |
| RJ Harvey | status | Active | Inactive |
| RJ Harvey | injury_status | unknown | IR |
| Tim Patrick | injury_status | unknown | Out |
| Eli Pancol | team | unknown | DEN |
| Cole Payton | injury_status | Out | unknown |
| Evan Hull | injury_status | unknown | Out |
| Calvin Ridley | injury_status | Out | unknown |
| A.J. Brown | injury_status | unknown | Out |
| Saquon Barkley | injury_status | Questionable | unknown |
| Jadarian Price | status | Inactive | Active |
| Jadarian Price | injury_status | IR | unknown |
| Kedon Slovis | team | GB | BAL |
| Hunter Henry | injury_status | unknown | Out |
| Barika Kpeenu | team | unknown | TB |
| Olamide Zaccheaus | injury_status | Out | unknown |
| Chris Rodriguez Jr. | injury_status | unknown | Questionable |
| DJ Moore | injury_status | Out | Questionable |
| Ben Sims | team | unknown | SEA |
| Ben Sims | status | Inactive | Active |
| Ben Sims | injury_status | Questionable | unknown |
| Tyrone Tracy Jr. | status | Active | Inactive |
| Tyrone Tracy Jr. | injury_status | Out | IR |
| Rashee Rice | injury_status | Out | unknown |

136 field changes total; complete list in data/latest.json. No causal explanation is inferred.

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
