# Lineups, schedules, and availability

Reviewed 2026-08-31. Verify live NFL reports and the actual platform before acting. Decision procedures and examples are analytical heuristics, not personalized recommendations.

## A forecast matters only if the player can enter the lineup

Privately establish starting slots, position eligibility, the weekly scoring period, player lock times, acquisition cutoffs, IR restrictions, and any automatic-substitution setting. There is no universal Sunday deadline: build the calendar from the actual games involved.

For example, Yahoo's football documentation says early-game players lock at their scheduled start and describes different consequences for starters, bench players, and trades. Other platforms can differ. [Early-game rules](https://help.yahoo.com/kb/fantasy-football/week-games-affect-fantasy-football-league-sln6869.html).

Use an explicit timezone. The NFL can change game times; verify the live schedule before relying on an old calendar. [NFL scheduling procedures](https://www.nfl.com/legal/flexible-scheduling-procedures).

## Do not confuse four availability questions

| Question | Appropriate evidence | What it does not prove |
| --- | --- | --- |
| Is the player on an NFL roster? | Official transaction/team roster | Being active for a particular game |
| Did the player practice? | Dated practice participation report | A guaranteed workload or game clearance |
| What is the game designation? | Official game-status report and subsequent updates | A precise probability or expected snap count |
| Is the player active for this game? | Official inactive list/current team confirmation | A full workload or freedom from in-game setback |

The NFL's [2026 important-dates guidance](https://operations.nfl.com/calendar-events/nfl-important-dates) distinguishes practice reports from game-status reports and calls for updates when a condition changes. Practice reporting days depend on game day; a fixed “Friday is always final” rule is unsafe.

Provider catalog flags are secondary evidence and may lag. “Questionable” is not an instruction to start or bench; “active” is not a projection of full snaps. Do not diagnose recovery or invent return-to-play odds from an injury label. Restrict analysis to public participation and availability information.

## Build a sequence of checks

1. **Before waivers:** identify byes, known absences, and late-game risk; obtain an eligible fallback if needed.
2. **Before the first relevant kickoff:** verify early starters and place players to preserve legal later substitutions.
3. **As official reports arrive:** revisit conditional forecasts and check whether alternatives have already locked.
4. **Before each relevant lock:** confirm eligibility and the saved lineup, not only the draft recommendation.
5. **After the games:** review role forecasts and note pending stat corrections without rewriting the original decision rationale.

The exact times come from the schedule and league rules, not this checklist. International, holiday, Saturday, or other unusual games make assumed weekly routines unreliable.

## Preserve flexibility when the rules permit it

Suppose the lineup has a WR slot and an RB/WR/TE FLEX. A healthy Thursday WR is definitely starting; a questionable Monday WR is the other planned starter. If both slots are unlocked, putting the Thursday player in WR and the Monday player in FLEX can preserve the option to use a Monday RB or TE if the later receiver is inactive.

If the Thursday WR instead locks in FLEX, the later vacancy may accept only a WR. This is a slot-allocation example, not a claim that the Monday player should start. Position eligibility, auto-sub links, and already-locked players may prevent the rearrangement. Never attempt to move an already-locked player under a rule that forbids it.

## Late news creates a decision tree

Assume a late player would project for 16 **if active with the assumed role**, an early alternative projects for 11, and a later fallback for 8. Ignoring other uncertainty, waiting has value `16p + 8(1 − p)`, where `p` is the probability of the first scenario. That exceeds 11 only when `p > 0.375`.

If no fallback exists, the simplified expression becomes `16p`, requiring `p > 0.6875`. These probabilities are teaching variables, not medical estimates. Real decisions need uncertainty about the role even when active, the fallback's availability, and scoring distributions. If `p` cannot be supported, explain the scenarios instead of pretending to know it.

## Automatic substitutes and IR are not assumptions

Sleeper's optional AutoSubs can replace an inactive starter with a designated eligible substitute. Its documentation says both linked players lock when either game begins, with an additional configurable game-time restriction. Do not assume automatic cover exists, covers an in-game injury, or allows arbitrary late changes. [AutoSubs mechanics](https://support.sleeper.com/en/articles/9731991-how-does-player-autosubs-work).

Fantasy IR is also configurable. A status changing can affect whether a roster permits further transactions; an NFL injury designation and a fantasy IR slot are not the same mechanism. [Sleeper IR rules](https://support.sleeper.com/en/articles/1983643-how-does-injured-reserve-ir-work). That support article contains historical season-specific text, so use its general eligibility concepts and recheck the actual current setting rather than treating old dates as present rules.

## Matchups and risk are secondary to valid evidence

**Heuristic:** start with role, scoring, and availability, then consider opponent and conditions. A defense's fantasy points allowed can reflect previous opponents, game situations, and a small sample; it is not a direct measure of how today's player will perform.

“Need upside” is meaningful only relative to a matchup objective and a plausible distribution. Do not treat a lower projection or an exciting highlight as evidence of higher ceiling. Under total-points scoring, blindly sacrificing expected points for volatility is especially hard to justify. Under head-to-head, compare scenarios but do not invent a win-probability model.

An LLM should give the present preference, fallback, unresolved report, latest safe decision time, and conditions that reverse the advice. It should never imply it has saved or verified a lineup unless it actually did so with authorization.
