# Evaluate positions by the way they earn points

Reviewed 2026-08-31. Position terminology follows [NFL football terms](https://operations.nfl.com/rules-officiating/nfl-football-basics/football-terms). Evaluation questions below are analytical heuristics, not repository-tested prediction rules. Hypothetical examples assume stated scoring only.

## Start with role, then translate it into points

| Position | Football role | Evidence to seek for fantasy evaluation |
| --- | --- | --- |
| QB | Directs the offense; passes and may run | Starting job, dropbacks, designed runs/scrambles, touchdown opportunities |
| RB | Rushes, receives, and blocks | Carries, routes, targets, short-yardage work, passing-down use |
| WR | Runs receiving routes and blocks | Route participation, targets, target depth, competition |
| TE | Combines receiving and blocking | Routes versus blocking snaps, targets, red-zone role |
| K | Attempts field goals and extra points | Job security, attempt opportunity, distance scoring, current conditions |
| D/ST | Team defense and special teams | Scoring rules, opponent, sacks/turnovers, availability of unit members |
| IDP | Individual defensive players | Position eligibility, snap role, tackle/pass-rush opportunities, scoring overlap |

FLEX and superflex are lineup slots, not real-football positions. Platform eligibility determines who can occupy them. A player can be excellent for an NFL team because of blocking or coverage without receiving many fantasy points.

## Quarterbacks

Separate passing opportunity, passing efficiency, rushing opportunity, and job security. Rushing can add points through a different scoring path, but the size of that advantage is a calculation, not a blanket rule.

Assume 0.04 points per passing yard, four per passing TD, 0.1 per rushing yard, six per rushing TD, and no turnovers:

| Fictional QB | Passing | Rushing | Total |
| --- | --- | --- | ---: |
| A | 250 yards, 2 TD: 18 points | 10 yards: 1 point | 19 |
| B | 200 yards, 1 TD: 12 points | 50 yards, 1 TD: 11 points | 23 |

With six-point passing TDs, those totals become 23 and 25. Neither stat line is a forecast. Recalculate under actual turnover, sack, completion, and first-down rules before drawing conclusions.

In one-QB leagues, compare against accessible starting-QB alternatives. In superflex/two-QB, check how many usable NFL starters remain available. A backup with no immediate starting role and a starter with unstable employment present different kinds of uncertainty.

## Running backs

Break usage into early-down carries, passing-game work, short-yardage work, and any role contingent on a teammate's absence. Total snaps can hide blocking assignments; 15 carries plus four targets are not the same as 19 touches because targets can be incomplete.

Questions worth answering before a ranking:

- Did workload grow in competitive game situations or only after the result was effectively decided?
- Was another back absent, limited, newly acquired, or returning?
- Which player was used near the goal line and in obvious passing situations?
- Is the forecast one week of replacement work, a committee, or a sustained lead role?

Do not assume all vacated touches transfer to one backup. A team could split them or change its play selection. A “handcuff” can provide contingent upside, but owning both players also consumes a bench spot; evaluate the alternative use of that spot.

## Receivers and tight ends

For WRs, distinguish being on the field from running routes, and running routes from earning targets. For TEs, high offensive snap counts can reflect blocking rather than receiving involvement. Check actual participation data where available; the collector currently does not supply routes.

A fictional WR catches one of two targets for 70 yards and a touchdown. At one-point PPR and 0.1 per yard, that is 14 points. Another catches six of nine targets for 55 yards without a TD: 11.5. The first had the better recorded fantasy result. The second had more observed targets. Neither fact alone proves the next week's outcome; investigate whether each role will repeat.

Use target depth to describe the opportunities, not to declare a universally superior receiver. Compare TEs against realistic TE replacements and potential flex alternatives under any premium. A receiving bonus helps only when receptions occur.

## Kickers and team defenses: do not overstate coverage

The collector includes catalog entries but does not supply kicker production or a dedicated D/ST forecasting dataset. An LLM should not manufacture a current kicker/DST ranking from the offensive leaderboards.

**Kicker heuristics:** confirm the player has the job, inspect the upcoming opponent and venue, and obtain current conditions if outdoor weather is material. Offensive strength alone is incomplete: a touchdown creates a different kicking opportunity from a stalled drive. Do not impose a precise wind threshold or points adjustment without a cited, validated model.

**D/ST heuristics:** examine the opponent's quarterback/offensive line availability and likely pass opportunities, alongside the defense's own personnel. Distinguish sacks from defensive touchdowns and avoid projecting a recent return touchdown as recurring production. What counts as points or yards allowed depends on the platform; read its rule before interpreting an odd score.

Sleeper provides configurable kicking distance, team-defense, special-teams, and individual-defense categories. A default ranking cannot safely cover all of them. [Scoring options](https://support.sleeper.com/en/articles/3998131-what-scoring-options-are-available).

## IDP is a separate research problem

Confirm whether slots require defensive line, linebackers, defensive backs, or other designations. Then inspect snap role and the exact scoring for tackles, assists, sacks, interceptions, and return events. A football pass rusher's value may differ if classified at another fantasy position.

Scoring categories can overlap: Sleeper documents that some sack/tackle-related categories stack. Do not add a sack value to other awards without verifying which categories the play receives. [Stacking rules](https://support.sleeper.com/en/articles/3186339-what-stacks).

No IDP production is collected by the current normalized pipeline. A missing defensive row is missing coverage, not a zero-point season. Use a verified defensive dataset and format-matched projection method before issuing player-level recommendations.

## Evidence table for an LLM answer

| Evidence state | Appropriate conclusion |
| --- | --- |
| Role and scoring are known; current availability is checked | Compare against eligible alternatives, with forecast uncertainty |
| Points are known but routes/snaps are missing | Describe recorded production; keep the role explanation provisional |
| Strong official availability evidence, unclear workload | “Can play” does not establish expected volume |
| Only reputation or a trending-add count | Identify a research candidate, not a start recommendation |
| K/DST/IDP production absent | State the coverage gap and request or research the necessary evidence |

Next: [metrics and uncertainty](opportunity-and-uncertainty.md), [lineup decisions](lineup-and-schedule-management.md), and [waivers](waivers-and-faab.md).
