# Opportunity, advanced metrics, and uncertainty

Reviewed 2026-08-31. Definitions are sourced where provider-specific. Interpretation and decision procedures are analytical heuristics. Numerical examples are invented.

## Use a three-layer model

1. **Opportunity:** chances to produce, such as carries, targets, routes, and passing attempts.
2. **Outcome:** what happened on those chances, such as catches, yards, and touchdowns.
3. **Fantasy score:** the outcome multiplied by a particular league's scoring rules.

This separation helps formulate a forecast, but it does not prove opportunity is perfectly stable or efficiency is all luck. A role can change abruptly. Skills, teammates, opponent, coaching, and random events can affect outcomes.

## Metrics need a numerator, denominator, and scope

| Metric | Working definition | Important limitation |
| --- | --- | --- |
| Targets | Passes credited as directed toward a player | Not catches; provider handling of unusual plays matters |
| Touches | Carries plus receptions in ordinary offensive usage | Carries plus targets is a different quantity |
| Target share | Player targets / team targets in a defined sample | Team denominator and weeks must match |
| Snap share | Player offensive snaps / team offensive snaps | Does not reveal routes or touches |
| Route participation | Routes / stated eligible team passing plays | Providers may use dropbacks, pass plays, or filtered samples |
| Targets per route run | Targets / routes | Cannot calculate without route coverage |
| Yards per route run | Receiving yards / routes | Mixes opportunity and outcomes; small samples are fragile |
| aDOT | Target air yards / qualifying targets | Verify what counts as a target and treatment of missing air yards |
| Air-yard share | Player target air yards / team target air yards | Signed/near-zero denominators can produce unintuitive ratios |
| Red-zone opportunity | Usage within the opponent's 20, with play type stated | Inside-the-five attempts and end-zone targets are distinct subsets |

The original [nflfastR statistical implementation](https://github.com/nflverse/nflfastR/blob/master/R/calculate_stats.R) defines its target share and air-yard share and computes WOPR as `1.5 × target_share + 0.7 × air_yards_share`. WOPR is a weighted index, not a percentage, projected point total, or universal receiver rating. Use the [player-stat dictionary](https://nflreadr.nflverse.com/articles/dictionary_player_stats.html) for the release being analyzed; do not infer a field's meaning from its name alone.

The generic definitions above are a reading aid. Provider-specific definitions and filters win when they differ. Do not compare one site's “route participation” with another site's differently filtered number as if the names guarantee equivalence.

## Aggregate counts before dividing

Suppose a player has eight targets on 40 team targets in one game and four on ten in another. The weekly shares are 20% and 40%. Their unweighted average is 30%, but the combined share is `12 / 50 = 24%`.

Likewise, calculate a multiweek yards-per-route figure from total yards divided by total routes, not an unweighted mean of weekly ratios. Explain whether a per-game average excludes inactive games, partial games, byes, or weeks absent from the source. Absence from a dataset does not establish a zero.

Always state season, regular/postseason filter, weeks, games, and meaningful sample counts. Compare new-role games with old-role games explicitly rather than blending them into an unexplained “last four.” If teammate absences define the sample, disclose that selection and the small sample it creates.

## Expected does not mean guaranteed

**Expected fantasy points (xFP)** models assign value to opportunities using a particular model and scoring basis. The original [ffopportunity methodology](https://ffopportunity.ffverse.com/) describes predictions from an XGBoost model trained on public play-by-play. Its model version, training period, and coverage matter; “expected points” from two providers need not be the same statistic.

**NFL expected points added (EPA)** describes changes in modeled real-football scoring expectation, not fantasy points. **CPOE** compares pass completions with model expectations. These can add football context, but they do not directly answer who belongs in a fantasy lineup. Definitions: [nflfastR play-by-play fields](https://nflfastr.com/reference/fast_scraper.html).

**Pass rate over expected** also depends on a model and denominator. nflfastR's `pass_oe` is dropback percentage over expected, not simply pass attempts divided by total plays. [Original implementation documentation](https://nflfastr.com/reference/add_xpass.html).

If a player scored 22 when a model assigns 13 xFP to the opportunities, the difference is +9 under that model. It does not follow that the player “owes” nine points of underperformance next week. Reversion is a forecast hypothesis, not a compensating mechanism. Check role, skill, model fit, and whether the scoring systems match.

## What this repository does and does not contain

As reviewed, normalized offense includes carries, targets, receptions, passing/rushing/receiving yards and TDs, interceptions, and upstream fantasy totals. It does **not** include routes, snaps, air yards, WOPR, xFP, EPA, target share, red-zone usage, kicking production, or IDP production. See [data semantics](../../data/README.md) and [SOURCES.md](../../SOURCES.md) before relying on this list after a collector change.

A field existing upstream does not mean it is retained here. Do not reconstruct shares from a leaderboard: omitted players make the denominator incomplete. Even a larger table needs completeness, team, and sample checks before aggregation. Join providers only through verified shared identifiers, never names alone.

The [nflverse availability schedule](https://nflreadr.nflverse.com/articles/nflverse_data_schedule.html) says participation data from 2023 onward is published after the postseason, not during the season. It also describes separate update schedules and stat corrections. Do not promise live routes from that participation feed, treat a successful download as complete coverage, or mistake a refresh timestamp for newly played games.

## Forecast with scenarios rather than invented precision

| Scenario | Required public evidence | What to vary |
| --- | --- | --- |
| Established role continues | Current team/availability context and comparable usage | Volume and ordinary performance variation |
| Teammate misses the game | Official status plus evidence on replacement usage | Distribution of vacated work; do not assign it all to one player |
| Player is active but limited | Explicit public workload evidence, if available | Routes/carries, not only binary active/inactive status |
| Job or team changes | Transaction plus subsequent role evidence | Prior team's usage is historical, not the new baseline |

If probabilities are unsupported, present scenarios without percentages. A confidence label should describe evidence quality and sensitivity, not pretend to be a measured win rate. Differences smaller than the model's plausible error should not be dressed up as exact rankings.

For a public learning record, save the evidence cutoff and hypothesis before the outcome, compare against a simple baseline, review comparable cases, and record confounders. A touchdown on one target can reward a poor role forecast; zero touchdowns can obscure a correct workload forecast. Keep both parts of the review. See [the learning index](../solutions/README.md).
