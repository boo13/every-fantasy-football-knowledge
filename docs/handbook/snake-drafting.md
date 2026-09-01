# Snake drafting: make a sequence of decisions

Reviewed 2026-08-31. The drafting framework is a heuristic, not a tested winning system. Examples are hypothetical.

## The mechanics

In a traditional snake draft, selection order reverses each round: the final selection in one round is followed by the first selection in the next. Linear and other arrangements differ, so confirm the actual board. [Sleeper draft types](https://support.sleeper.com/en/articles/9701062-what-draft-types-are-supported).

For eight teams and draft position 3, a traditional snake gives overall picks 3, 14, 19, and 30 in the first four rounds. A long wait between selections makes “who will remain?” part of the decision. Do not use this formula if picks have been traded or the draft uses a reversal variant.

## Prepare a flexible board

1. Establish [scoring, eligible positions, and replacement value](scoring-and-formats.md).
2. Obtain dated projections and ADP matched to the platform and format. Record whether ADP comes from mocks, completed drafts, redraft, or dynasty. The collector does not supply live ADP or consensus forecasts.
3. Group similar projected values into tiers. A tier acknowledges uncertainty; it is not proof that every member is interchangeable.
4. Identify role uncertainty, unavailable players, bye conflicts, and fallback options.
5. Practice at the relevant draft position with the same settings, including the platform's queue and autopick behavior.

ADP estimates draft-market behavior in a sample. It does not estimate points, prove a bargain, or guarantee a player survives until a later selection. An old sample may precede a material injury or transaction.

## At each pick, compare paths

Use at least two sequences: candidate now plus plausible next selection, versus the alternative now plus its likely next selection. Reassess the board after every pick rather than obeying a preset positional sequence.

Hypothetical equal-horizon marginal values:

| Path | Pick now | Plausible next pick | Total marginal value |
| --- | ---: | ---: | ---: |
| A | RB A: 75 | WR B: 48 | 123 |
| B | WR A: 82 | RB B: 30 | 112 |

Although WR A is the best single value, Path A is better under these assumptions. If another RB in the same tier is likely to remain, Path B may become preferable. The exercise is sensitive to projections and availability assumptions; it is not an invitation to invent a precise survival probability.

For each recommendation, ask: what is the next-best available option, how much of the edge is robust, and what happens if the anticipated later player is gone?

## Roster construction as conditional choices

| Board or roster condition | Reasonable response | Risk to inspect |
| --- | --- | --- |
| Several comparable players remain at one position | Consider the position with the steeper next-pick drop | Mistaking a personal tier for market consensus |
| A position run starts | Recalculate remaining supply and alternative value | Chasing a run after the good values are gone |
| Strong starters, few bench slots | Consider role-changing upside or essential coverage | Holding a speculative player with no plausible starting path |
| Thin free-agent QB pool in superflex | Price backup QB access explicitly | Paying any price solely from scarcity anxiety |
| Large projected gaps at K/DST under custom scoring | Evaluate those gaps, not conventional draft-round slogans | Assuming standard-scoring heuristics still apply |
| Multiple uncertain starters | Consider a more secure-role alternative | Calling a projection a guaranteed floor |

“Zero RB,” “hero RB,” and “robust RB” are shorthand for different allocations of early draft resources. None removes the need to compare prices, available players, and roster rules. A roster should not reject an obvious value merely to preserve a named strategy.

## Avoid common draft traps

- **Last year's leaderboard:** points already scored are not future points. Check role, team, health, and sample changes.
- **Name recognition:** real-football reputation and fantasy eligibility are different inputs.
- **Filling every starter before the bench:** this can miss value, but endlessly delaying a required position also has a cost.
- **Drafting trade bait without a market:** a player on the bench does not earn hypothetical trade value automatically.
- **Treating correlation as free value:** a QB and receiver from the same team can share outcomes; that changes risk, not necessarily expected points.
- **Over-optimizing distant matchups:** an early forecast of defensive strength or a playoff role can change substantially.

## End the draft with an executable roster

Check required positions, opening-week availability, byes, allowed IR moves, and whether backups can actually cover the relevant absences. Do not assume a bench player's points will replace an inactive starter automatically. Review [lineup management](lineup-and-schedule-management.md).

An LLM draft answer should name a primary selection, at least one fallback, the decision's scoring basis, the positional tradeoff, and a news or board condition that reverses the choice. Keep the live draft board and personal queue outside this repository.
