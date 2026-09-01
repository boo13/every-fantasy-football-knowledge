# What the numbers can answer

Reviewed 2026-09-01 against the [collector](../scripts/collect.py). This is a map of this repository's normalized data, not a promise that every field is populated in every observation. Read source health and the actual sample first. The [upstream dictionary](https://nflreadr.nflverse.com/articles/dictionary_player_stats.html) describes a much larger dataset than the subset retained here.

## Identify the record before doing arithmetic

| Field or location | Meaning in this repository | Necessary check |
| --- | --- | --- |
| `observed_at` | When a capture was made | Not the time every underlying fact changed |
| `sources` | Per-source status, URL and available provenance | An overall successful run does not supply missing source coverage |
| `players` map key | Sleeper player identifier | Not an nflverse player ID |
| `players[ID].gsis_id` | Potential shared identity key | Require a valid, unambiguous mapping; do not fall back to a name |
| Stat `player_id` | nflverse/GSIS identifier | Match within the correct namespace |
| Stat `season` | NFL season associated with the record | Not necessarily the current calendar year |
| `current_stats` | Selected season's regular-season weekly offense | Not a full season projection or necessarily a complete week |
| `prior_stats` | Previous season's regular-season offense totals | Not this season's results |
| `recent_team` | Team label retained from the statistical source | Do not substitute the catalog's current team for historical affiliation |
| `week` / `games` | Source week or season-total game count, where supplied | Neither proves every game was played at full workload |

The query tool preserves these distinctions and returns small packets. Start with [the query guide](querying-data.md); use an explicit Sleeper ID when names are ambiguous.

## Offensive fields retained

Numeric values can be floats or null. An event count printed as `4.0` is still a count; the decimal formatting does not make it a projection.

| Fields | Units and use | Does not supply |
| --- | --- | --- |
| `attempts`, `passing_yards` | Pass attempts and passing yards | Completions, dropbacks, sacks, or designed-rush splits |
| `passing_tds`, `passing_interceptions` | Passing touchdown and interception counts | Pick-six penalties or individual-play details |
| `carries`, `rushing_yards`, `rushing_tds` | Rushing attempts, yards and touchdowns | Goal-line share, designed attempts versus scrambles |
| `targets`, `receptions` | Target and catch counts | Routes, snap counts, team denominator |
| `receiving_yards`, `receiving_tds` | Receiving yards and touchdown counts | Air yards, yards after catch, end-zone targets |
| `fantasy_points`, `fantasy_points_ppr` | Provider-scored fantasy totals | Your league's custom score or a future forecast |

The original [nflreadr field definitions](https://raw.githubusercontent.com/nflverse/nflreadr/main/data-raw/dictionary_player_stats.json) distinguish passing attempts, carries, targets and receptions. Its rushing definition includes scrambles and kneel-downs, so total QB carries are not a designed-rush count. Provider totals should not be relabeled as a different scoring system without checking its full rules.

## Safe calculations and common dead ends

All examples below are invented arithmetic, not player evaluations or measured predictions.

**Touches:** 12 carries plus 4 receptions is 16 touches. If there were 6 targets, `12 + 6 = 18` is carries plus targets, not touches. Keep the label with the calculation.

**Catch rate:** 18 receptions on 30 targets is 60% in that sample. This alone does not describe target difficulty, pass accuracy, future opportunity, or talent. Null targets cannot be replaced with zero; a zero-target denominator has no defined catch rate.

**Points per game:** 180 recorded points over 15 source-counted games is 12 points per counted game. It is not automatically 12 points per scheduled week, per start, per healthy appearance, or per fantasy-playoff week. Obtain the appropriate denominator before changing the label.

**Combined sample:** a runner with 40 yards on 5 carries and 60 on 15 has 100 yards on 20 carries: 5 yards per carry. Averaging the two game rates, 8 and 4, produces 6 and answers a different question. Aggregate matching counts before dividing.

**Target share:** a player's 8 targets divided by a top-five leaderboard's 25 targets is not team target share. Omitted teammates make that denominator incomplete. The CLI's bounded results are deliberately incomplete and must not be used to construct team totals.

**Role change:** a current team label changing from one team to another is a provider observation. It does not establish the signing date, starting job, projected touches, or reason for a move. Verify the actual transaction and subsequent role evidence separately.

## A partial scoring calculation is not a final score

Suppose a fictional QB records 250 passing yards, 2 passing TDs, 1 interception and 20 rushing yards. Under explicitly hypothetical weights of 0.04 per passing yard, 4 per passing TD, −2 per interception and 0.1 per rushing yard, those categories yield:

`250 × 0.04 + 2 × 4 − 1 × 2 + 20 × 0.1 = 18`

Call this **18 points from the stated categories**. It is a complete score only if every other applicable event is confirmed absent or unscored. The collector does not retain fumbles, two-point conversions, first downs, return production, play-distance bonuses or the full kicking/defensive record. Those omissions can matter: [Sleeper's configurable categories](https://support.sleeper.com/en/articles/3998131-what-scoring-options-are-available) show why “PPR” is not a complete scoring specification.

Likewise, season-total yards cannot reconstruct per-game yardage bonuses. Two seasons with equal yardage can cross a weekly threshold a different number of times. Weekly totals still cannot reconstruct distance-of-play bonuses without individual-play evidence.

## Four different meanings of missing

| Observation | Safe statement | Unsafe shortcut |
| --- | --- | --- |
| Source status is `not_yet_available` | Expected source absence under collector policy | Every player has scored zero |
| Source status is `error` | That source failed in this capture | Reuse an older value while calling it current |
| Player has no verified shared ID | Cross-provider statistics are unmatched | Guess by similar spelling |
| A particular stat is null | The field was not supplied as a usable number | Treat null as zero or as proof of no opportunity |

A successful dataset with no matching player row is a fifth research situation: the player is not represented in that selected dataset. It is not proof of inactivity, poor play, retirement, or waiver availability.

## Corrections and timing

nflverse describes player statistics as following its play-by-play update cycle and recommends a later refresh to pick up corrections. A Tuesday observation can therefore change in a subsequent archive even when the games have not changed. [Upstream availability and correction guidance](https://nflreadr.nflverse.com/articles/nflverse_data_schedule.html).

Keep both the original and revised observations. Cite the snapshot used for a forecast, then explain any corrected outcome separately. The automated `changes` list concerns selected player catalog fields; its silence does not prove that statistical values were unchanged.

Before publishing a derived number, state the player ID, season, weeks, sample count, units, denominator, scoring assumptions, source status and observation timestamp. If any is unavailable, narrow the conclusion instead of filling the gap by intuition. See [opportunity and uncertainty](handbook/opportunity-and-uncertainty.md) for more advanced metrics.
