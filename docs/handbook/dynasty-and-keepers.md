# Dynasty and keeper leagues: change the time horizon

Reviewed 2026-08-31. Format definitions are sourced. Valuation frameworks are analytical heuristics; examples are fictional and do not specify any real league.

## Retention rules come before rankings

Redraft resets rosters, keeper formats retain a configured subset, and dynasty retains an ongoing roster. Implementations can include cutdowns or other restrictions. [Sleeper league formats](https://support.sleeper.com/en/articles/3537396-league-types-formats).

| Question to establish privately | Why it matters |
| --- | --- |
| How many players can be retained? | Two keepers create a different market from a full retained roster |
| Is retention free, a lost draft pick, or a salary charge? | Changes the opportunity cost of keeping a player |
| Do costs escalate or rights expire? | A bargain this year may not persist |
| Are acquired/undrafted players eligible, and at what cost? | Affects waiver and trade value |
| What picks are tradable and how is draft order determined? | Future picks have different rights and uncertainty |
| How large are active, bench, IR, and taxi rosters? | Determines how long development can be accommodated |
| Is the next draft rookies only or a broader pool? | Changes the value of every pick |
| Are there contracts, salary caps, or cut penalties? | Adds obligations not implied by the word “dynasty” |

Do not assume any of these from a platform's default, a prior season, or a league label.

## Keeper value is value minus a specific forgone option

In a pick-cost league, compare keeping a player with keeping the pick and selecting from the actual remaining draft pool. An eighth-round keeper is not necessarily valuable just because that sounds cheap; the player's expected contribution still matters.

Hypothetical same-horizon, same-unit comparison:

| Candidate | Projected marginal value | Value of forgone pick | Net before other constraints |
| --- | ---: | ---: | ---: |
| A costs an early pick | 80 | 65 | 15 |
| B costs a later pick | 55 | 20 | 35 |

B offers the larger modeled surplus even though A is the stronger player. But if few elite starters return to the pool, the forgone-pick estimate may be wrong. Recalculate with kept players removed, enforce the keeper limit, and inspect which complete roster can actually be drafted.

Sleeper supports assigning keeper costs to draftboard slots; it does not decide what the league's retention cost should be. [Keeper cost documentation](https://support.sleeper.com/en/articles/2219811-how-do-i-set-the-round-cost-for-keepers).

In auction keepers, retained prices remove budget while retained players remove supply. Re-estimate prices from the remaining pool; see [auction inflation](auction-drafting.md). Do not reuse an unadjusted redraft price list.

## Dynasty combines current contribution and uncertain future options

A useful conceptual model is:

`value = current useful contribution + uncertain future contribution + future flexibility − roster/retention costs`

This is not a numerical formula until each term has a defensible definition. Future seasons deserve explicit scenarios for role, health, job competition, and league continuity. Do not present universal age cliffs or career-length probabilities without a suitable empirical source and uncertainty.

| Public player situation | Evidence to seek | Avoid |
| --- | --- | --- |
| Productive veteran | Current role and realistic remaining usefulness | Assuming every older player is about to collapse |
| Young player with limited work | Draft investment, development evidence, role path | Treating youth alone as inevitable improvement |
| Rookie | NFL selection, landing spot, competition, current role | Equating college totals with projected NFL totals |
| Backup QB in superflex | Contract/team context and credible path to starts | Pricing a hypothetical starting job as secured |
| Returning injured player | Official availability and observed workload | Medical recovery forecasts from generic labels |

NFL draft investment is evidence that a team spent resources, not a guarantee of fantasy opportunity. Contracts and coaching comments also require context; they do not assign a fixed number of touches.

## Picks are distributions of possible outcomes

A future selection has a year, round, eventual slot, eligible player pool, and opportunity cost. Until the slot is known, evaluate early/middle/late scenarios rather than calling it “the next elite rookie.” A pick can preserve flexibility, but it can also yield a noncontributor or take time to become usable.

An early first-round pick and two later picks are not automatically equivalent. The exchange depends on the available tiers and roster capacity. Multiple developmental players can create cutdown pressure; combining them into a single stronger starter can have value that a player-sum model misses.

A present-focused roster may reasonably prioritize useful points sooner, while a longer-horizon roster values future options more. Those are private decision inputs, not labels to infer about a real manager from standings or identity. Always follow the league's competitive-lineup and draft-order rules; do not recommend collusion or prohibited manipulation.

## Taxi squads and offseason work

Taxi squads can hold eligible developing players outside ordinary roster slots. Sleeper makes eligibility and deadlines configurable and states that, after the taxi deadline, a promoted player cannot simply be returned to taxi. [Taxi rules](https://support.sleeper.com/en/articles/3640482-how-do-taxi-squads-work). Check before promoting someone for a brief need.

Offseason NFL events can change roles without any fantasy points being scored. Review transactions, coaching changes, the draft, and training-camp participation, but label news separately from observed regular-season usage. A rookie with no NFL stats has missing NFL history, not demonstrated zero ability.

## LLM output contract

Separate present-season contribution, retention surplus, developmental uncertainty, and pick/roster flexibility. State the private horizon and costs supplied by the requester; never carry a keeper or dynasty recommendation into a redraft answer silently. Use [trade evaluation](trade-evaluation.md) for complete before/after effects and [the source registry](../../SOURCES.md) for coverage gaps. No private keepers, pick ownership, salaries, or roster plans belong in this repository.
