# Availability, injury reports, and fantasy eligibility

Reviewed 2026-09-01. This guide concerns public football participation, not medical diagnosis or recovery advice. Examples are fictional. For lineup timing and fallback arithmetic, use [lineup management](lineup-and-schedule-management.md); this chapter explains what the underlying reports can establish.

## Keep five separate questions separate

An injury icon cannot answer all of these:

| Question | Evidence to obtain | Safe conclusion |
| --- | --- | --- |
| Is the player on a roster or reserve list? | Dated official transaction and current team roster | The stated administrative status at that time |
| What happened in practice? | Official daily participation report, including its footnotes | The reported participation for that session |
| What is the game designation? | Official game-status report and later updates | The team's designation for that specific game |
| Is the player available on game day? | Official game-day inactive list plus any necessary activation transaction | Whether the player is unavailable for that game, not an expected workload |
| Can the player occupy a fantasy slot? | Current platform designation and actual league settings, checked privately | Fantasy eligibility under those rules |

A player can be on an NFL roster but inactive for a game. A player can practice while a reserve-list activation is still pending. A platform can show an older tag after an official report changes. These are different records, not necessarily contradictory claims about the same thing.

The repository supplies provider catalog flags, not a complete official-report or inactive-list feed. A missing flag means the normalized field is empty; it does not mean the player is healthy, active, or permitted in a particular fantasy slot. See [source coverage](../../SOURCES.md).

## Read the report's columns, date, and footnotes

Practice participation describes practice, not a percentage chance of playing:

| Practice label | Interpretation |
| --- | --- |
| DNP | Did not participate in that practice |
| Limited / LP | Took fewer than the player's normal practice repetitions |
| Full / FP | Took the player's normal practice repetitions |

The separate game-status labels are **Out**: will not play; **Doubtful**: unlikely to play; **Questionable**: uncertain to play. They are not numerical probability forecasts. An official January 3, 2026 game report defines these terms and marks some walk-through participation as estimated. That document is a terminology example from the **2025 season**, not present-day player news. [Buccaneers–Panthers official report](https://static.clubs.nfl.com/image/upload/buccaneers/s0yo223fnyok35mwmh5b).

Read the reason and the footnote alongside the label. An estimated walk-through report is not an observation of a full-speed practice. A rest notation and an injury notation should not be silently collapsed. Conversely, a full-practice entry does not prove an unrestricted game role. Do not convert “LP → FP” into a fixed points bonus or infer a diagnosis from a sequence of labels.

The absence of a game designation is not the same as the absence of every possible risk. First establish that the report is complete and applies to the correct game. Later transactions, updated reports, inactives, and in-game events can still change the decision.

## Reporting days follow the game, not a universal Friday rule

The NFL's 2026 calendar specifies these regular-season reporting days. Reports are due at 4 p.m. New York time or, where applicable, after practice; changes after the game-status report require updates. [2026 NFL important dates](https://operations.nfl.com/calendar-events/nfl-important-dates).

| Game day | Practice-report days | Game-status report |
| --- | --- | --- |
| Monday | Thursday, Friday, Saturday | Saturday |
| Wednesday | Sunday, Monday, Tuesday | Tuesday |
| Thursday | Monday, Tuesday, Wednesday | Wednesday |
| Friday | Tuesday, Wednesday, Thursday | Thursday |
| Saturday | Tuesday, Wednesday, Thursday | Thursday |
| Sunday | Wednesday, Thursday, Friday | Friday |

Use the actual scheduled game and timezone. Do not carry this table into a future season without checking its policy. A Tuesday collection can precede almost all meaningful reports for a Sunday game.

The NFL exchanges game-day administration reports, including inactive lists, at its meeting 90 minutes before kickoff. That is a useful research checkpoint, not a promise that a fantasy app or public page updates at exactly that second. Verify the actual official list and any subsequent news. [NFL game and stadium preparation](https://operations.nfl.com/game-operations-logistics/preparation-safety/game-and-stadium-prep).

## Reserve status is not a return date

NFL injured reserve, physically unable to perform (PUP), and other reserve designations are administrative categories with their own procedures. Do not substitute one label's restrictions for another. Active/PUP and Reserve/PUP are also different labels; record the exact transaction.

The 2026 calendar permits certain return designations at final roster reduction and describes later reserve-return procedures. Therefore, “placed on IR before Week 1” is not sufficient evidence of either a season-ending absence or a particular comeback date. Identify the exact list, transaction date, designation, and applicable season's procedure. [2026 NFL personnel dates](https://operations.nfl.com/calendar-events/nfl-important-dates).

Use a return checklist rather than a countdown generated from an injury name:

1. Confirm the official reserve transaction and whether return is permitted under the applicable rule.
2. Identify the minimum administrative absence, if established by a current source, and count it using that rule's units. Games, calendar weeks, and practice-window days are not interchangeable.
3. Verify any permission to resume practice and the start of that window.
4. Look for the actual activation transaction; practicing or being designated to return is not the same event.
5. Recheck game status and inactives, then evaluate the likely role separately.

An earliest permitted return is a lower bound, not a forecast. Even an official statement that a player is expected back is an expectation attributed to its speaker, not proof that every step has occurred. Do not calculate a recovery timetable, prescribe treatment, or infer private medical details.

## Fantasy IR is a platform rule

Sleeper documents configurable IR eligibility categories and warns that an ineligible player remaining in IR can restrict roster edits or additions. Its support page is dated February 2022 and contains season-specific text, so it is a guide to the distinction—not a source for every 2026 setting. Check the live league configuration and current platform behavior privately. [Sleeper IR documentation](https://support.sleeper.com/en/articles/1983643-how-does-injured-reserve-ir-work).

Do not tell someone that “Out always means IR-eligible,” that every injured player can be reserved, or that an NFL activation automatically frees a fantasy slot. Also avoid suggesting a drop as the only remedy without inspecting the available legal roster moves. This public repository should explain the mechanism, never store the actual roster or transaction plan.

## Worked example: one player, several truthful records

Suppose these fictional observations concern a Sunday game:

| Time | Observation | What has actually changed? |
| --- | --- | --- |
| Tuesday | Catalog has no injury flag | Only the provider field is known |
| Wednesday | Team lists DNP | A practice fact; Sunday availability remains unresolved |
| Thursday | Team lists limited participation | A different practice observation, not a quantified recovery rate |
| Friday | Team lists full participation and Questionable | Practice participation and game uncertainty coexist |
| Sunday, before kickoff | Official game-day evidence confirms availability | The unavailable scenario is narrowed; workload is still a forecast |
| After game | Player records a limited role | A realized outcome, not something the earlier active status guaranteed |

The correct Friday summary is not “healthy now.” It is: “Full practice was reported Friday; the game designation remains Questionable. Sunday availability and the eventual role are unresolved.” If the app still shows Wednesday's flag, keep both timestamps and prioritize the official report for the football fact. Do not silently overwrite the Tuesday archive.

This example deliberately assigns no chance of playing. If no credible, applicable probability model exists, use conditional scenarios and an eligible fallback instead. The [lineup chapter](lineup-and-schedule-management.md) shows how fallback availability changes the decision.

## Reusable public research packet

Record only the fields needed for the football question:

- Player's public professional identity and the exact game, season, date, and timezone.
- Source URL, publisher, publication/update time if shown, retrieval time, and report type.
- Exact participation or roster label, with estimated-report or non-injury footnotes preserved.
- What is confirmed, what is an attributed expectation, and what remains unknown.
- The next observable event: next report, activation, inactive list, or actual usage.
- A link to any earlier public claim being updated; preserve its original wording and evidence cutoff.

Before giving an answer, check whether a source is merely quoting another source, whether the headline is older than the article update, and whether a current-looking page contains an older season's report. Avoid collecting biographical, family, off-field, or speculative medical details. Use only the minimum public availability information relevant to football participation.

**LLM stopping rule:** if current official availability cannot be checked, state that limitation and the last verified report. Do not label a weekly snapshot “live,” imply an injury absence from missing data, or claim a lineup was changed.
