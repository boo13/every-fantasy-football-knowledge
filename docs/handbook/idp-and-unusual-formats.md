# IDP, best ball, and formats that need different evidence

Reviewed 2026-09-01. Examples are fictional. Platform-specific statements are linked to original documentation; analytical methods are heuristics, not validated advantages. Start with [scoring and formats](scoring-and-formats.md). This chapter identifies the extra rules and data needed when ordinary offensive rankings do not answer the question.

## IDP is not team defense with different names

Individual defensive player (IDP) leagues score particular players. Team DEF/D/ST scores a separate team entity. A league may use either, both, or defensive scoring on eligible offensive players; starting slots and scoring categories are separate choices.

Sleeper's April 2026 positional documentation describes DL, LB, and DB designations and allows multiple defensive positions based on role and usage. These are platform eligibility tags, not a guarantee that another site classifies the same pass rusher identically. [Sleeper positional designations](https://support.sleeper.com/en/articles/5992251-positional-designations-info-requests).

Before using an IDP ranking, obtain privately:

| Rule | Why it changes the comparison |
| --- | --- |
| Required DL/LB/DB or more specific slots; IDP flex | Determines which replacement pool is relevant |
| Single versus multiple position eligibility | Changes the lineups a player can legally improve |
| Number of starters, bench depth, and position limits | Changes how many players must be rostered |
| Solo, assisted, and total tackle values | Can reward the same credited event through several categories |
| Sack, QB-hit, tackle-for-loss, interception, forced-fumble and recovery values | Changes the relative value of different event profiles |
| Defensive/return TDs, return yards, special-teams tackles | Adds roles that a generic defensive table may omit |
| Stat-correction and partial-credit rules | Affects shared sacks, tackle attribution, and final scoring |

Do not label a scoring setup “tackle-heavy” or “big-play” solely from one point value. Calculate several plausible stat lines across the full enabled categories and compare replacement options. League size alone is insufficient: two IDP starters and eleven IDP starters create different demand even with the same number of teams.

## IDP scoring overlap: audit the event, not just the total

Sleeper documents that its general tackle award can stack with solo/assisted tackles and other applicable categories. If that overlap is not intended, its help page suggests keeping general tackles at zero and valuing the component categories instead. That is a configuration option, not a universal scoring recommendation. [Sleeper tackle calculation](https://support.sleeper.com/en/articles/4056297-how-are-tackles-calculated).

A sack can also receive other applicable awards. The platform's example specifically distinguishes a sack with a loss from a possible no-gain sack, so do not mechanically add a tackle-for-loss point to every sack. Score the statistics actually credited. [Sleeper stacking rules](https://support.sleeper.com/en/articles/3186339-what-stacks).

### Worked IDP stat line

Assume a fictional player is credited with six solo tackles, two assists, one sack, one tackle for loss, and one QB hit. The sack, tackle for loss, and QB hit occurred on the **same** play, already included among the six solos. There are no other events.

| Enabled category | Credited count | Hypothetical value | Contribution |
| --- | ---: | ---: | ---: |
| Solo tackles | 6 | 1.5 | 9 |
| Assisted tackles | 2 | 0.75 | 1.5 |
| Sacks | 1 | 3 | 3 |
| Tackles for loss | 1 | 1 | 1 |
| QB hits | 1 | 0.5 | 0.5 |
| General tackles | 8 | 0 | 0 |
| **Total** | | | **15** |

If the same system additionally awards 0.5 for each of the eight general tackles, the score becomes 19. The extra four points are intentional category overlap under those assumed rules, not four additional tackles. Never add the sack to the six solos again as a seventh solo. For a shared sack, obtain the provider's actual fractional credit instead of guessing how it was divided.

## Evaluate IDP opportunity without inventing a leaderboard

Separate playing time, assignment, opportunities, credited events, and fantasy points:

- **Playing time:** defensive snaps and an appropriate team denominator, with special-teams snaps distinguished.
- **Assignment:** evidence of pass-rushing, coverage, run-defense, and situational substitutions. A “starter” label does not quantify these assignments.
- **Opportunities:** plays relevant to that role; define the sample and denominator rather than treating every defensive snap identically.
- **Events:** solo/assisted tackles, pressures, sacks, interceptions, and fumbles under the source's definitions.
- **Points:** the actual league weights and overlaps applied to those events.

A defender can contribute to real-football success without receiving the scoring event. For example, forcing a hurried throw is not automatically a credited sack or interception. “Great coverage” is not a fantasy-points category unless the scoring actually rewards a measured outcome. These distinctions explain what needs research; they do not establish an empirical ranking rule.

A change in position eligibility also changes the comparison without changing the player's performance. Suppose a fictional player projects for 12 points. If the plausible DL alternative projects for 7, the projected improvement is 5; if the LB alternative projects for 11, it is 1. Multi-position eligibility may add lineup options, but the player still fills only one slot at a time. Do not count the same projected score twice.

### Current repository limitation

The normalized catalog targets QB/RB/WR/TE/K/DEF rather than a complete defensive player pool. Current and prior statistics are offensive, not an IDP production feed. There are no defensive snap-role or tackle-attribution tables here. A missing defender or stat row is **outside coverage**, not evidence of zero production or availability. See [SOURCES.md](../../SOURCES.md) and [data semantics](../../data/README.md).

A useful external IDP dataset must identify player IDs, season/week, game coverage, positional designations, component statistics, update time, and corrections. Validate the IDs and definitions before joining; never merge on player name alone. Do not repurpose the offensive fantasy-points column as IDP points.

Sleeper also warns that corrections can follow a weekly report and that its provider's corrections need not match the NFL's published correction list item for item. Its documentation allows corrections through Thursday. Treat that as its stated process, not every platform's finalization deadline. [Sleeper stat corrections](https://support.sleeper.com/en/articles/2441282-stat-corrections).

## Best ball changes lineup selection, not the need for eligible slots

In best ball, realized player scores determine the best eligible lineup from the roster. It does not mean every rostered score counts, or that one multi-position player can fill two slots. Sleeper documents automatic lineup selection and says waivers, free-agent moves, and trades are disabled by default but can be enabled. Its August 2022 page also contains old season/interface details; recheck current functionality before relying on those details. [Sleeper Best Ball](https://support.sleeper.com/en/articles/4100708-do-you-offer-best-ball).

Treat these as separate rules:

| Dimension | Questions to resolve |
| --- | --- |
| Lineup | Exact slots, eligible positions, and scoring |
| Roster management | Draft-only or permitted adds, drops, trades, IR, and other reserves? |
| Competition | Head-to-head, cumulative points, elimination, or staged advancement? |
| Horizon | Which weeks count? Do scores reset between stages? |
| Player pool | Exclusive drafted players or another allocation mechanism? |

Do not import rules from a best-ball contest into a managed home league merely because both use the words “best ball.” Likewise, [AutoSubs](lineup-and-schedule-management.md) are not full best-ball optimization: their platform-specific conditions matter.

### Worked lineup assignment

Suppose a hypothetical best-ball lineup requires two WRs and one RB/WR/TE FLEX. The roster's relevant scores are WR A = 18, WR B = 12, WR C = 10, and RB D = 15. The best eligible total is `18 + 12 + 15 = 45`; WR C's 10 does not also count. If D scores zero, C can enter FLEX and the total becomes 40.

If the roster instead has only one eligible WR, a high-scoring extra RB cannot fill the second required WR slot. A best-ball system optimizes within the rules; it does not create a legal scorer for an uncovered position. Verify the platform's handling of vacant slots.

This also shows why season totals are insufficient to reproduce best-ball value. Two receivers with identical season totals can contribute differently depending on which weeks their scores help the eligible lineup. Evaluation requires aligned **weekly** scores, eligibility, and the full roster constraints. Historical hindsight-optimal points are not a forecast of future optimization gains.

Without transactions, missed time and byes cannot simply be repaired through weekly pickups. With transactions, acquisition rules still constrain replacements. Avoid universal roster recipes or claims that volatility or teammate stacking always helps: those conclusions need the contest objective, joint outcome assumptions, and evidence beyond this repository's offensive totals.

## Other formats: identify the changed rule before applying advice

| Format or variation | What changes | Additional information required |
| --- | --- | --- |
| Points per first down | Scoring depends on first-down events, not only yards or receptions | Credited passing/rushing/receiving first downs and overlap rules |
| Return-yard scoring | Return work can contribute to individual or team scores | Actual return duties, credited return yards/TDs, eligible categories |
| Extra matchup against a median | Weekly performance may earn a separate result against the league median | Exact tie treatment, included teams, qualifying weeks, and ordinary matchup rules |
| All-play | A weekly score is compared with each other score under the stated system | Complete same-week scores and tie rules; not the same as one median result |
| Elimination / guillotine-style | Surviving the week's cutoff replaces or supplements ordinary matchup wins | Elimination count, tiebreak, dropped-player rules, waiver budget, schedule |
| NFL-postseason-only | Actual playoff games and team advancement constrain scoring opportunities | Bracket, byes, elimination/reuse rules, selected rounds, and postseason stats |
| Salary/contract keeper variation | Retained-player costs and constraints extend beyond a single draft budget | Contract terms, cap accounting, rollover, release penalties, and renewal rules |

Sleeper's scoring catalog includes separate first-down and return-related categories; their existence does not mean they are enabled in a particular league or collected here. [Scoring options](https://support.sleeper.com/en/articles/3998131-what-scoring-options-are-available). For a concrete elimination example, Yahoo's Death League documentation eliminates the lowest-scoring team and releases its players to waivers, with its own timing and tiebreak rules. Do not assume another elimination format uses the same configuration. [Yahoo Death Leagues](https://help.yahoo.com/kb/SLN37116.html).

Consider a fictional first-down bonus of 0.5: Player A has a base score of 10 and six credited first downs, while B has 12 and one. The totals become 13 and 12.5. Ordinary PPR totals cannot recover that difference without first-down data. Guessing first downs from yards would fabricate the missing input.

The collector does not provide first-down/return production, full league scores, postseason statistical coverage, contract terms, or contest-specific projection models. Regular-season prior totals are not postseason opportunity forecasts. Public format explanation belongs here; actual manager scores, contracts, budgets, and roster plans do not.

## Reusable research checklist

1. Name the changed rule precisely; separate scoring, eligibility, lineup selection, acquisition, retention, and competition objective.
2. Obtain the necessary league details privately. State assumptions rather than publishing the answers.
3. Map each scoring category to a verified statistic and each slot to verified eligibility. Mark missing mappings explicitly.
4. Calculate a small hypothetical stat line and legal lineup to detect overlap, vacant-slot, or double-counting errors.
5. Check whether the ranking/projection source matches these rules and covers the relevant player pool and weeks.
6. Explain the realistic replacement baseline and the role of uncertainty. Do not transplant a fixed draft rank across formats.
7. Record public hypotheses before outcomes, review against the stated measurement, and preserve corrections. Missing data cannot produce an earned win or loss for a hypothesis.

**LLM stopping rule:** when the format needs evidence this repository lacks, identify the specific dataset and rule still needed. Provide a method or conditional example, not invented IDP rankings, best-ball simulations, or elimination survival probabilities.
