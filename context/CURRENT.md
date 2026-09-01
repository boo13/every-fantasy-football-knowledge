# Current public fantasy-football context

Observed at **2026-09-01T00:11:47.854195+00:00**. Collection health: **ok**.

Generated evidence, not projections or start/sit advice. Treat as stale after 8 days; recheck player availability immediately before decisions. A fresh download does not prove upstream facts are fresh.

Provider season label: 2026; phase: regular; display week: 1. Confirm actual kickoff dates below; a provider week label does not prove games were played.

## Source health and provenance

| Source | Status | Records | URL |
| --- | --- | --- | --- |
| sleeper_state | ok | 5 | https://api.sleeper.app/v1/state/nfl |
| sleeper_players | ok | 3239 | https://api.sleeper.app/v1/players/nfl |
| nflverse_schedule | ok | 272 | https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv |
| sleeper_add | ok | 25 | https://api.sleeper.app/v1/players/nfl/trending/add?lookback_hours=24&limit=25 |
| sleeper_drop | ok | 25 | https://api.sleeper.app/v1/players/nfl/trending/drop?lookback_hours=24&limit=25 |
| nflverse_current_stats | not_yet_available | — | https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_2026.csv |
| nflverse_prior_stats | ok | 610 | https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_reg_2025.csv |
| espn_news | ok | 12 | https://www.espn.com/espn/rss/nfl/news |

A missing or failed dataset is not zero production. No stale source is silently carried forward. Full source hashes and upstream modification headers are in data/latest.json.

## Next regular-season games

Schedule times are US Eastern, as supplied by nflverse; flex scheduling can change them.

| Week | Date | Time ET | Away | Home |
| --- | --- | --- | --- | --- |
| 1 | 2026-09-09 | 20:20 | NE | SEA |
| 1 | 2026-09-10 | 20:35 | SF | LA |
| 1 | 2026-09-13 | 13:00 | CHI | CAR |
| 1 | 2026-09-13 | 13:00 | TB | CIN |
| 1 | 2026-09-13 | 13:00 | NO | DET |
| 1 | 2026-09-13 | 13:00 | BUF | HOU |
| 1 | 2026-09-13 | 13:00 | BAL | IND |
| 1 | 2026-09-13 | 13:00 | CLE | JAX |
| 1 | 2026-09-13 | 13:00 | ATL | PIT |
| 1 | 2026-09-13 | 13:00 | NYJ | TEN |
| 1 | 2026-09-13 | 16:25 | ARI | LAC |
| 1 | 2026-09-13 | 16:25 | MIA | LV |
| 1 | 2026-09-13 | 16:25 | GB | MIN |
| 1 | 2026-09-13 | 16:25 | WAS | PHI |
| 1 | 2026-09-13 | 20:20 | DAL | NYG |
| 1 | 2026-09-14 | 20:15 | DEN | KC |
| 2 | 2026-09-17 | 20:15 | DET | BUF |
| 2 | 2026-09-20 | 13:00 | CAR | ATL |
| 2 | 2026-09-20 | 13:00 | NO | BAL |
| 2 | 2026-09-20 | 13:00 | MIN | CHI |
| 2 | 2026-09-20 | 13:00 | CIN | HOU |
| 2 | 2026-09-20 | 13:00 | PIT | NE |
| 2 | 2026-09-20 | 13:00 | GB | NYJ |
| 2 | 2026-09-20 | 13:00 | CLE | TB |
| 2 | 2026-09-20 | 13:00 | PHI | TEN |
| 2 | 2026-09-20 | 16:05 | JAX | DEN |
| 2 | 2026-09-20 | 16:05 | LV | LAC |
| 2 | 2026-09-20 | 16:25 | SEA | ARI |
| 2 | 2026-09-20 | 16:25 | WAS | DAL |
| 2 | 2026-09-20 | 16:25 | MIA | SF |
| 2 | 2026-09-20 | 20:20 | IND | KC |
| 2 | 2026-09-21 | 20:15 | NYG | LA |

## Aggregate market attention: last 24 hours

Platform-wide adds/drops are research leads, not rankings, roster availability, unique-manager counts, or recommended transactions.

### Trending adds

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Malik Davis | RB | DAL | 518148 | unknown |
| MarShawn Lloyd | RB | GB | 265815 | unknown |
| Jacob Saylors | RB | DET | 238345 | unknown |
| Zavion Thomas | WR | CHI | 132273 | unknown |
| Dohnte Meyers | WR | CIN | 125136 | unknown |
| Devaughn Vele | WR | NO | 116676 | unknown |
| Odell Beckham | WR | NYG | 82537 | unknown |
| Darren Waller | TE | CAR | 80100 | unknown |
| Tre Tucker | WR | LV | 75156 | unknown |
| Jalon Daniels | QB | TB | 63946 | unknown |
| unknown | DEF | JAX | 61848 | unknown |
| Justice Hill | RB | BAL | 59058 | unknown |
| Barion Brown | WR | NO | 55107 | unknown |
| Kyle McCord | QB | MIA | 45300 | unknown |
| Tyler Loop | K | BAL | 42672 | unknown |

### Trending drops

| Player | Position | Team | Count | Provider injury flag |
| --- | --- | --- | --- | --- |
| Jaydon Blue | RB | unknown | 175576 | unknown |
| Jam Miller | RB | unknown | 63315 | Questionable |
| Justin Joly | TE | unknown | 60990 | unknown |
| Michael Trigg | TE | DAL | 42876 | unknown |
| Oronde Gadsden | TE | LAC | 41730 | unknown |
| Alvin Kamara | RB | NO | 40896 | Questionable |
| Isiah Pacheco | RB | DET | 40288 | Questionable |
| Josh Jacobs | RB | GB | 37305 | NA |
| Brenton Strange | TE | JAX | 37260 | unknown |
| Kenyon Sadiq | TE | NYJ | 36909 | Questionable |
| Robert Henry | RB | unknown | 36414 | unknown |
| Emanuel Wilson | RB | SEA | 34938 | Questionable |
| Tyreek Hill | WR | unknown | 34696 | Questionable |
| Cyrus Allen | WR | KC | 31704 | unknown |
| Jordyn Tyson | WR | NO | 29672 | IR |

Null/unknown injury flags do not confirm health; provider team labels can lag transactions.

## Changes since previous observation

Initial observation: no before/after claims yet.

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

- 2026-08-31T23:54:14+00:00: [Steelers won't negotiate with CB Porter in-season](https://www.espn.com/nfl/story/_/id/49785992/steelers-negotiate-cb-joey-porter-jr-season)
- 2026-08-31T23:54:14+00:00: [Broncos OLB Cooper pleads not guilty to charges](https://www.espn.com/nfl/story/_/id/49786038/broncos-cooper-pleads-not-guilty-domestic-violence-charges)
- 2026-08-31T23:54:14+00:00: [Nabers feeling 'good' but mum on playing Week 1](https://www.espn.com/nfl/story/_/id/49787690/giants-wr-nabers-feeling-good-mum-playing-week-1)
- 2026-08-31T23:54:14+00:00: [Cowboys cut Milton, name Howell backup QB](https://www.espn.com/nfl/story/_/id/49786242/cowboys-waive-joe-milton-iii-name-sam-howell-backup-qb)
- 2026-08-31T23:54:14+00:00: [Jets tab rookie Klubnik instead of veteran as QB2](https://www.espn.com/nfl/story/_/id/49786366/rookie-cade-klubnik-jets-qb2-entering-season-aaron-glenn-says)
- 2026-08-31T23:54:14+00:00: [Minter backs K Loop as Ravens add competition](https://www.espn.com/nfl/story/_/id/49787595/minter-backs-loop-ravens-add-kicker-competition-moody)
- 2026-08-31T23:54:14+00:00: [Newly acquired Jones to vie for Cowboys' RT job](https://www.espn.com/nfl/story/_/id/49785579/schottenheimer-jones-steele-compete-cowboys-rt-job)
- 2026-08-31T23:54:14+00:00: [Donald signs 1-year deal, rejoins 'complete' Rams](https://www.espn.com/nfl/story/_/id/49775423/sources-aaron-donald-unretires-reaches-20m-deal-rams)
- 2026-08-31T23:54:14+00:00: [🏈 Predicting 2026 fantasy 'league winners'](https://www.espn.com/fantasy/football/story/_/id/49734412/2026-fantasy-football-breakout-stars-league-winners-michael-florio)
- 2026-08-31T20:40:11+00:00: [Teams, athletes poke fun at Daejon Love, man who posed as 49ers player, on social media](https://www.espn.com/nfl/story/_/id/49779308/san-francisco-49ers-sports-teams-poke-fun-daejon-love-federal-charges)
- 2026-08-31T19:47:54+00:00: [Myles Garrett 'changing the culture' of Rams, even from the sideline](https://www.espn.com/nfl/story/_/id/49734085/myyles-garrett-los-angeles-rams-defense-changing-culture)
- 2026-08-31T19:47:53+00:00: [What does Aaron Donald's return mean for Garrett and the Rams' defense](https://www.espn.com/nfl/story/_/id/49600130/aaron-donald-return-los-angeles-rams-faq)

## Decision gaps

League scoring, roster slots, waiver rules, available players, and individual rosters are deliberately not collected. Live ADP/projections, routes, snaps, official game-day inactives, and weather are not in this feed. Fetch those from cited public sources when the question needs them.

Data attribution: Sleeper public API; nflverse (filtered regular-season stats and schedules); ESPN RSS link metadata. See SOURCES.md and NOTICE.md for source terms and modifications.
