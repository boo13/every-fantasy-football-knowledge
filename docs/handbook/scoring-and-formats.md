# Scoring, formats, and replacement value

Reviewed 2026-08-31. Platform facts are cited; strategy implications are analytical heuristics. All examples are fictional, not default rules.

## Separate four different choices

Scoring converts football statistics into points. Roster rules determine which players can contribute. Draft rules allocate players. Retention rules determine whether a decision lasts beyond this season. Saying only “PPR league” answers none of the other three questions.

Ask privately for this minimum rules card:

| Input | Why the answer changes |
| --- | --- |
| Passing/rushing/receiving points, turnovers, bonuses | A generic fantasy-points column may use different weights |
| Reception points and position premiums | Catch-heavy and touchdown-dependent profiles can trade places |
| League size, starters, FLEX eligibility | Determines how many players compete for starting spots |
| Bench/IR size and position limits | Changes replacement options and the cost of holding backups |
| One QB, two QB, or superflex | Changes which positions can fill valuable slots |
| Managed lineup or best ball | Changes whether the manager must choose weekly scorers |
| Head-to-head, total points, extra median matchup | Changes the competition objective |
| Redraft, keeper, or dynasty | Changes the time horizon and retention value |

Sleeper's official configuration documentation shows that scoring can include yardage, first downs, position-specific reception bonuses, kicking, defense, and individual defensive players. Treat these as configurable categories, not universal defaults. [Scoring options](https://support.sleeper.com/en/articles/3998131-what-scoring-options-are-available).

## Calculate first, rank second

For a simplified offensive scoring system:

`points = pass_yards × pass_yard_value + pass_TD × pass_TD_value + rush_yards × rush_yard_value + rush_TD × rush_TD_value + receptions × reception_value + receiving_yards × receiving_yard_value + receiving_TD × receiving_TD_value − applicable_penalties + applicable_bonuses`

This is a worksheet, not a complete engine: return scores, fumbles, conversions, distance tiers, and overlapping bonuses need explicit rules. Missing categories are not automatically zero.

Assume 0.1 points per rushing/receiving yard, six per rushing/receiving touchdown, and no other events:

| Fictional stat line | Non-PPR | Half-PPR | PPR |
| --- | ---: | ---: | ---: |
| Player A: 8 catches, 70 receiving yards, no TD | 7 | 11 | 15 |
| Player B: 80 rushing yards, 1 rushing TD, no catches | 14 | 14 | 14 |

The ranking flips even though neither player's football performance changes. Do not describe PPR as automatically making every receiver better than every running back; the effect depends on catches and the alternatives.

For a tight end with five catches, 50 yards, and no TD, ordinary one-point PPR yields 10. Adding a 0.5-per-catch TE bonus yields 12.5. Sleeper documents that its position reception bonuses add to standard reception points and use primary position, not the fantasy slot. Other platforms require their own check. [Reception bonuses](https://support.sleeper.com/en/articles/3652730-how-are-reception-bonuses-calculated).

## More points does not necessarily mean more draft value

**Heuristic:** compare a player with the realistic alternative for the same role, not with a different position's raw total.

`marginal lineup value = projected contribution − projected contribution from the realistic alternative`

Suppose a QB projects for 21 points per week and the available replacement for 18: the gap is 3. A TE projects for 14 and the replacement for 8: the gap is 6. The QB has more points, but the TE creates the larger hypothetical improvement. In a superflex league where the QB replacement projects for 11, the QB gap becomes 10. These assumed numbers illustrate why format changes matter; they are not current positional forecasts.

Replacement level is not always “the player ranked one place below all required starters.” Bench hoarding, flex use, injuries, and actual availability matter. Estimate it from plausible options, state the method, and test another baseline before treating a narrow edge as meaningful.

## Conditional format implications

| If this is true | Reconsider | Do not conclude |
| --- | --- | --- |
| Passing TDs rise from 4 to 6 | Recalculate passing production and the alternatives | Every pocket passer now beats every rushing QB |
| More QB-eligible slots | QB scarcity and bye/injury cover | Exactly two QBs must be the first two picks |
| Three WR slots or extra flex slots | Depth and the replacement pool | A universal WR-only opening |
| TE premium | TE catches and flex eligibility | Every TE receives the same added value |
| Return-yard or IDP scoring | Additional roles and stat coverage | Offensive rankings include those points |
| Very shallow benches | Cost of developmental holds | Injured or backup players never deserve a spot |

In best ball, a system chooses the highest-scoring eligible lineup from the roster after performances occur. Sleeper's documentation also makes transaction availability configurable; “best ball” alone does not establish whether waivers exist. [Best Ball rules](https://support.sleeper.com/en/articles/4100708-do-you-offer-best-ball). Inference: volatile contributors may be useful without guessing their spike week, but empty positions and uncovered byes still constrain the eligible lineup.

## LLM output contract

State which settings were supplied, which are missing, the scoring used for any calculation, and whether the result is weekly, season-long, or rest-of-season. If rankings or ADP use another format, label them unsuitable or explicitly translate the underlying projections. Never silently rename a provider's PPR total “your points.”

Next: [snake draft](snake-drafting.md), [auction draft](auction-drafting.md), or [position evaluation](position-evaluation.md).
