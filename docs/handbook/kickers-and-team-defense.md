# Kickers and team defense: scoring before streaming

Reviewed 2026-09-01. Platform rules are sourced; evaluation methods are conditional heuristics, not tested ranking models. Every numerical example is fictional. This repository has K and DEF catalog entries but **does not collect kicking production or a dedicated team-defense production dataset**. The offensive leaderboards cannot supply a kicker or D/ST ranking.

## A scoring card is essential here

Two leagues can award different totals for the same kick or defensive play. Obtain the rules privately before comparing options:

| Kicker setting | D/ST setting |
| --- | --- |
| Flat field-goal award or distance bands | Sacks, interceptions, fumble recoveries, safeties |
| Points per made field-goal yard; any floor or bonus | Touchdowns, blocked kicks, return scores and return yards |
| Extra-point makes and misses | Points-allowed and yards-allowed bands |
| Miss penalties, including distance-specific penalties | Whether special-teams events are included |
| Whether awards stack | Whether rare-event categories stack |

Sleeper exposes made/missed field goals, distance ranges, field-goal yardage and PAT settings; its documentation counts blocked field goals and PATs as misses for the kicker. Treat this as a Sleeper rule, not a universal convention. [Sleeper scoring options](https://support.sleeper.com/en/articles/3998131-what-scoring-options-are-available).

Yahoo documents that field-goal yardage can add to distance-band awards, with fractional-point settings affecting the calculation. Enabling yardage is therefore not necessarily a replacement for the band's points. Verify a simple sample kick before trusting a recalculated table. [Yahoo scoring categories and plays FAQ](https://help.yahoo.com/kb/fantasy-football/sln6527.html).

## Worked kicker calculation

Suppose a kicker makes field goals from 32, 45, and 52 yards, makes two PATs, and misses one field goal. Assume no other scoring:

| Hypothetical rules | Calculation | Points |
| --- | --- | ---: |
| Made FG: 3 below 40 yards, 4 at 40–49, 5 at 50+; PAT +1; missed FG −1 | `3 + 4 + 5 + 2 − 1` | 13 |
| Each made FG: `max(3, 0.1 × distance)`; same PAT and miss rules | `3.2 + 4.5 + 5.2 + 2 − 1` | 13.9 |

The second row is a teaching formula, not a claim that every platform offers that exact configuration. Under either rule, a 52-yard make is a recorded scoring event; it does not establish how many such attempts the kicker will receive next week. Distinguish attempts, makes, and credited fantasy points.

## Kicker research: job, opportunities, execution, conditions

Use four separate columns rather than a single “good offense” label:

| Column | Public evidence to seek | Common unsupported shortcut |
| --- | --- | --- |
| Job | Current roster, official transaction, game availability, who handled FG/PAT attempts | Assuming a familiar name still has the job, or equating kickoffs with FG duties |
| Opportunities | Team drives and outcomes, field-goal/PAT attempts by game, relevant coaching decisions | Treating all scoring drives as field-goal attempts |
| Execution | Makes and attempts with distances and sample size | Treating 100% on three attempts as established certainty |
| Conditions | Exact venue, roof status, hourly forecast near game time | Using a city-wide daily forecast or inventing a universal wind penalty |

These are research questions, not a fitted forecast. Touchdowns, field goals, failed fourth downs, turnovers, punts, and two-point choices produce different kicking opportunities. A team projected to score more real points does not mathematically guarantee more fantasy points for its kicker.

For U.S. venues, the National Weather Service provides location-specific hourly forecasts with wind and other weather variables. Save the forecast's issue time, valid hours, location, units, and uncertainty; then confirm whether the playing surface will be exposed. A forecast is not a measurement of the wind at the uprights. [NWS hourly-forecast guide](https://www.weather.gov/media/ict/handouts/Online_Overview.pdf). For international games, use the relevant official national weather service rather than assuming U.S. coverage.

Compare recent role evidence with a broader, distance-aware sample when available. If a quantified weather or accuracy adjustment comes from a model, identify its method and validation; otherwise describe a conditional concern without fabricating a points deduction.

## A D/ST score is not the final scoreboard

The fantasy defense is a scoring entity covering the categories the league enables. It is not simply the NFL team's wins, total opponent points, or all players' defensive statistics added together.

On Sleeper, a pick-six surrendered by the offense does not count against defensive points allowed, but the opponent's extra point or two-point conversion does. Its documentation also includes specified special-teams scores in points allowed. Consequently, the opponent's final score alone cannot reconstruct the DEF total. [Sleeper points-allowed rules](https://support.sleeper.com/en/articles/4126495-how-are-points-allowed-calculated).

Sleeper's yards-allowed explanation uses net rushing plus net passing yards, including the effect of sack yardage on net passing, and describes configurable treatment of return yardage. Passing yards displayed for a quarterback are not automatically the same as a defense's net passing yards allowed. [Sleeper yards-allowed rules](https://support.sleeper.com/en/articles/4126427-how-are-yards-allowed-calculated).

Individual special-teams scoring and team special-teams scoring are separate settings. A returner's fantasy points and the DEF award need their own rules check; do not assume enabling one enables the other. [Sleeper special-teams scoring](https://support.sleeper.com/en/articles/3278982-special-teams-scoring-options).

### Worked points-allowed check

Suppose an opponent finishes with 24 points: six came from returning an offensive interception, one from the following PAT, and 17 from other events that count toward points allowed. Under the cited Sleeper treatment, defensive points allowed is `24 − 6 = 18`, not 24 and not 17.

Now assume the fantasy rules award +1 for 14–20 points allowed and 0 for 21–27. That category contributes +1. If the defense also records three sacks worth +1 each and an interception worth +2, its subtotal is `1 + 3 + 2 = 6`. All other categories are set to zero in this example. Reconstruct the actual event list before blaming a platform for a discrepancy.

## D/ST research separates opportunity from conversion

Useful questions include:

- Who is expected to play quarterback for the opponent, and what is officially known about the offensive line and the defense's own personnel?
- What evidence supports the forecast of opponent dropbacks, rushing plays, and total possessions?
- Are pressure, sack, interception, and fumble statistics being confused? Use the provider's definitions and matching games.
- Did a recent point total come from ordinary opportunities or from a small number of scoring returns?
- Does a season-to-date “points allowed to defenses” rank mix very different opposing defenses and game situations?

An opponent having more dropbacks would create more opportunities for pass-related events, but it would not determine how often those become sacks or interceptions. A projected lead is a game-state hypothesis, not a guaranteed stream of opponent passing plays. A touchdown return already recorded is not evidence that another is owed.

Avoid claiming that “bad weather always helps D/ST.” Conditions can affect both teams, play selection, possessions, and the categories being scored. Without a validated model, describe the possible paths and uncertainty instead of applying a blanket adjustment.

## Streaming is a sequence of constrained choices

Streaming means rotating the slot among available options. It is viable only if eligible alternatives can actually be acquired before their locks; the public repository cannot see that availability. Use [waiver mechanics](waivers-and-faab.md) and [lineup deadlines](lineup-and-schedule-management.md) alongside this process:

1. Establish the scoring, required slots, transaction limits, waiver timing, and realistic alternatives privately.
2. Compare same-format forecasts with current job/personnel and game evidence. Label unavailable inputs rather than inventing them.
3. Check the next one or two games and byes, without treating distant matchup forecasts as fixed.
4. Include the bench slot, waiver credits, claim priority, and chance of missing a later acquisition as separate costs. Do not convert credits into fantasy points without a stated model.
5. Set the public news or scheduling change that would reverse the preference, and a legal fallback.

For a fictional two-week choice, suppose holding DEF A projects for 6 and 7 points. DEF B projects for 8 this week; an available-next-week DEF C would project for 7. “B then C” gives 15 only if C can be acquired. If the fallback next week projects for 3, the sequence has possible totals of 15 or 11, while holding A totals 13 under the same assumptions. With acquisition probability `q`, the simplified sequence expectation is `11 + 4q`, exceeding 13 only when `q > 0.5`.

That threshold is arithmetic, not an estimate of claim success or a complete decision rule. Acquisition uncertainty, forecast error, transaction resources, and the value of another bench use may dominate a small apparent edge. Do not recommend repeatedly dropping and reclaiming a player as though other managers cannot acquire them.

## Minimum packet and review after the game

For each public research candidate, retain the game and cutoff, confirmed role/personnel facts, source links, scoring assumptions, observed attempts/events, conditional forecast, missing inputs, and next review event. Keep private availability and acquisition decisions outside the repo.

Afterward, compare the forecast components with the game: Were the anticipated kicking opportunities present? Were defensive pass opportunities present? Which score came from a return, a scoring-band boundary, or a correction? Distinguish a useful role forecast from a fortunate final score. Preserve the original forecast and append the review; one successful streaming week does not establish a durable strategy.

If the needed gamebooks or kicking/defensive dataset cannot be verified, the honest output is a conditional checklist and a coverage gap—not a current top-ten list made from offensive statistics.
