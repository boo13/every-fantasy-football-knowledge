# Auction drafting: budgets, alternatives, and price discipline

Reviewed 2026-08-31. This chapter concerns fictional draft credits, not real-money wagering or financial advice. The valuation method is a heuristic; all budgets and prices below are invented.

## The mechanics

In a nomination-and-bidding draft, managers compete for each nominated player using a configured draft budget. Sleeper awards the player to the highest bidder when the timer expires and permits commissioner-set budgets. Other platforms may use different timer and nomination rules. [Auction documentation](https://support.sleeper.com/en/articles/4056268-do-you-support-auction-drafts).

A draft budget and in-season FAAB are distinct resources unless the league explicitly links them. “Auction” also does not imply players retain salaries in future seasons; that requires separate keeper or contract rules.

## Establish the constraints

Privately confirm the starting budget, roster size, minimum bid, bidding increments, position requirements, existing keepers, and whether the platform reserves credits for unfilled slots. Normalize external values by both budget **and** player pool; merely doubling prices from a 100-credit list can still be wrong if the roster settings differ.

With remaining budget `B`, open slots `S`, and minimum price `m`, a roster-completion constraint gives:

`maximum affordable single bid = B − m × (S − 1)`

Example: 47 credits, six empty slots, and a one-credit minimum allow at most 42 on one player while preserving five minimum bids. A platform may impose further constraints, so this is a planning ceiling, not a promise that the interface will accept the bid. Affordable also does not mean worthwhile.

## Build a valuation baseline

One transparent heuristic is to reserve the minimum cost of every drafted player, then distribute the remaining budget in proportion to positive [value above replacement](scoring-and-formats.md). This is a starting model, not a law of auction prices.

Hypothetical league-wide illustration:

- Ten teams have 200 credits and 15 slots each: 2,000 credits and 150 roster spots.
- At a one-credit minimum, reserve 150 credits; 1,850 remain for above-minimum value.
- Suppose the chosen drafted player pool contains 1,850 total units of positive marginal value. The model allocates one credit per value unit above the minimum.
- A player assigned 40 units has a baseline of `1 + 40 = 41` credits.

This conserves the total budget **only for that modeled player pool**. Changing replacement levels, including more bench players, or leaving budgets unspent changes the result. Projected value is uncertain, and actual demand can concentrate spending unevenly across positions.

## Adapt to the room without losing the constraint

Before bidding, write down a target, a maximum acceptable price, and a viable alternate roster. Revisit them when the player pool changes, not merely because a timer is about to expire.

| Situation | Conditional response | Failure mode |
| --- | --- | --- |
| Top players cost more than the baseline | Compare alternate tiers and remaining spending power | Treating every inflated sale as a command to match it |
| Earlier bargains leave many credits unspent | Re-estimate competition for remaining scarce players | Keeping outdated prices while everyone has excess budget |
| Few affordable starters remain at a needed position | Reconsider the marginal cost of missing the tier | Waiting for a bargain that no longer exists |
| Several equivalent options remain | Bid selectively and keep an alternate | Assuming all alternatives will stay cheap |
| Budget is near the minimum per open slot | Prioritize completing a legal roster | Bidding the entire balance on one final favorite |

Keeper auctions need a separate recalculation. If valuable players are retained cheaply, both players and credits leave the market, but not in equal proportions. Compare **remaining spendable credits above slot minimums** with **remaining modeled surplus value**. Do not apply a guessed universal “keeper inflation percentage.”

## Stars-and-depth versus balanced spending

A concentrated build buys a few expensive starters and accepts low-cost depth. A balanced build spreads spending across more plausible contributors. Evaluate them under the actual starting slots, free-agent replacement options, and whether the format allows weekly transactions. Neither construction is inherently correct.

A nomination is information gathering as well as player selection. Nominating a player one is willing to roster avoids being trapped with an unwanted winning bid. Do not assume rival managers will bid merely because a player is famous, and do not inflate bids without accepting the possibility of winning.

## What an LLM should produce

Provide a clearly labeled baseline range, maximum affordable bid, a provisional walk-away price, and the alternative roster if bidding goes beyond it. Explain which assumptions drive the range. Keep fictional credit units distinct from dollars, and never submit bids or persist a manager's budget in this public library.

After the draft, switch to [waiver-budget decisions](waivers-and-faab.md); draft prices are sunk acquisition costs, not proof of a player's remaining value.
