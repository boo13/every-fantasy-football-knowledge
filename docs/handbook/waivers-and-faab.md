# Waivers, FAAB, and the value of a bench spot

Reviewed 2026-08-31. Rules below are platform examples. Acquisition priorities and budget methods are analytical heuristics; all numerical examples are fictional waiver credits, not real money.

## Understand the allocation system

Waivers hold available players until claims are processed. Free agency permits additions under the league's applicable rules. Public add/drop popularity cannot tell whether a player is available in a particular league.

| System | Basic mechanism | Strategic question |
| --- | --- | --- |
| Rolling priority | A successful claim moves the manager down the priority order | Is this improvement worth using the current priority? |
| Reverse standings | Priority resets according to standings | What alternatives are likely accessible under this week's order? |
| FAAB | Managers bid from a limited acquisition budget | What improvement justifies the bid and remaining-budget cost? |

These describe [Sleeper's supported waiver types](https://support.sleeper.com/en/articles/1876041-what-types-of-waivers-do-you-support), not every platform's implementation. Timing, ties, dropped-player waits, daily waivers, and zero-credit bids still need verification. Sleeper documents blind FAAB bids, highest-bid allocation, configurable minimums, and rolling-priority ties. [FAAB mechanics](https://support.sleeper.com/en/articles/1876040-how-does-faab-bidding-work).

## Research why a player became interesting

Use the [position guide](position-evaluation.md) and [metric definitions](opportunity-and-uncertainty.md) to answer:

1. What changed: an official transaction, teammate availability, sustained usage, or just a large point total?
2. What is the likely role if that change persists?
3. How many relevant games might that role last?
4. How does the candidate compare with an actual available alternative under the scoring rules?
5. What player, roster flexibility, claim priority, or budget must be surrendered?

Do not automatically transfer an unavailable starter's entire workload to the listed backup. Do not describe a speculative stash as an immediate starter. A high trending-add count is evidence of attention, not evidence the market is correct.

## Classify the acquisition before pricing it

| Candidate type | Evidence that would support it | Question before spending |
| --- | --- | --- |
| Immediate starter upgrade | Current role plus format-matched comparison | Is the gain large enough over the real alternative? |
| Temporary injury replacement | Official absence and credible replacement-role evidence | Will the player be useful after the absence ends? |
| Role-growth candidate | Repeated comparable usage, not just one score | What would show that the role failed to persist? |
| Contingent backup | A plausible expanded role if circumstances change | Is that option better than another use of the bench slot? |
| Bye-week/lineup cover | Known schedule need and eligible unplayed option | Can a lower-cost alternative meet the same need? |

These categories organize uncertainty; they are not a universal priority order. A needed starter this week can be more useful than long-run upside that never enters a lineup.

## Price the improvement, not the headline

Suppose 60 credits remain. A proposed bid of 12 is 20% of the remaining budget. The relevant comparison is not “12 sounds small,” but what future flexibility those credits would buy. State the denominator whenever giving a percentage.

A simple first pass is:

`plausible useful weeks × projected weekly improvement over the alternative`

If a replacement is expected to improve the starting lineup by four points for three weeks, that is 12 hypothetical marginal points. It does not imply a 12-credit bid: the value of a credit depends on scarcity, competition, remaining games, minimum bids, and other needs. Redo the calculation for a one-week role and a six-week role rather than hiding the duration uncertainty.

No fixed percentage table can determine the correct bid for every league. Give a conditional range only when the settings and alternatives are known. If bid-distribution evidence is absent, do not invent the chance that a particular amount will win.

## Claims are a set of instructions, not just a ranked list

Before the deadline, inspect all pending claims, drop dependencies, total possible spending, position limits, and roster/IR legality. Determine whether the goal is **one of several substitutes** or **several separate additions**.

Hypothetical Sleeper-style fallback chain:

| Preference | Claim | Intended effect |
| --- | --- | --- |
| First | Add A, drop X | Preferred replacement |
| Second | Add B, drop X | Alternative only if X is still rostered |

For Sleeper FAAB, bid amounts determine processing order; manual reordering applies among equal bids. To make A the intended primary, its bid must be at least as high as B's, with equal bids ordered accordingly. Merely labeling A “first” does not make it process before a higher bid on B. Confirm the pending order in the platform. [FAAB mechanics, editing and reordering](https://support.sleeper.com/en/articles/1876040-how-does-faab-bidding-work).

Sleeper's documentation says a later claim is invalid if its specified drop already occurred, even when a roster spot is open. Insufficient budget or space can also invalidate claims. This mechanism must be checked on the actual platform; do not assume all systems treat dependencies alike. [Invalid waiver claims](https://support.sleeper.com/en/articles/3978623-why-was-my-waiver-claim-invalid).

## Evaluate drops independently of purchase price

Draft cost is sunk. Assess future expected use, role uncertainty, coverage needs, and reacquisition risk. A bench player need not be starting now to have value, but every hold displaces another option. An injured player should not be dropped merely because a fantasy IR tag has temporarily changed; first inspect the applicable rules and roster alternatives.

After processing, confirm the actual result and available budget; an entered bid is not a completed acquisition. Before using a newly added player, check [lineup eligibility and kickoff timing](lineup-and-schedule-management.md).

## LLM output contract

Separate immediate-start options, short-term cover, and speculative holds. Explain each recommendation's evidence, useful horizon, drop cost, and invalidation trigger. Use real roster/FAAB inputs only in private conversation. Public compounding records should track football-role hypotheses and outcomes, not managers' claims or competitors' bidding behavior.
