# Public ADP and projections: a source audit

Research date: **2026-08-31 US Eastern**. Sources checked through **2026-09-01T01:03:50Z**. This is a dated methodology audit, not a ranking table. Recheck the displayed season, format, and update date whenever using a source.

Related question: **Q-2026-001** in [the research ledger](../../research/questions.json). Related reading: [decision framework](../decision-framework.md), [source registry](../../SOURCES.md), and [preseason briefing](../../research/2026/2026-08-31-preseason-draft-brief.md).

## Three different inputs

| Input | Answers | Does not answer |
| --- | --- | --- |
| Average draft position (ADP) | Where players were selected in a defined set of drafts | Who will score most; who is available in a particular draft; the probability a player survives to a later pick |
| Statistical projection | An analyst/model's forecast of future production over a defined horizon | What a player will actually score; whether its assumptions match a particular league |
| Expert ranking | An analyst's preferred ordering under stated assumptions | The number of expected points; observed draft prices |

Keep all three separately labeled. A player being ranked 40th is not an ADP of 40, and neither number means 40 projected points.

## What was actually accessible

| Source | Verified product and population | Date and sample visible in this audit | Appropriate use and remaining limits |
| --- | --- | --- | --- |
| [Fantasy Football Calculator PPR ADP](https://fantasyfootballcalculator.com/adp/ppr) | 2026, 12-team PPR, all positions; its own mock-draft population | **8,161 mock drafts, August 24–31, 2026** | Public market reference. It is not measured behavior from every fantasy platform or from a private league. A sample window is not an exact refresh timestamp. |
| [Fantasy Football Calculator non-PPR ADP](https://fantasyfootballcalculator.com/adp) | 2026, 12-team non-PPR, all positions | **1,884 mock drafts, August 24–31, 2026** | A separate format/sample, not interchangeable with the PPR table. Do not assume all formats have equal sample sizes. |
| [ESPN: Mike Clay's 2026 NFL Projection Guide](https://g.espncdn.com/s/ffldraftkit/26/NFLDK2026_CS_ClayProjections2026.pdf) | One named analyst's team/player statistical projections; PDF introduction identifies the upcoming regular season, Weeks 1–18 | PDF itself says **updated August 31, 2026**; draft sample size is not applicable | Publicly readable forecast. Introduction describes a 17-game baseline and warns that injuries are not fully represented by that baseline. The audited introduction does not supply a complete fantasy-scoring formula: use underlying stat categories only after matching the scoring rules. |
| [FantasyPros season QB projections](https://www.fantasypros.com/nfl/projections/qb.php?week=draft) | 2026 season consensus statistical projections; ordinary public HTML exposes passing/rushing categories | **Consensus updated August 31, 2026** in HTML; contributor list and availability treatment were not verified | A second forecast reference, not an audited independent ensemble. Other positions require separate checks. Its scoring link needs attention; see below. |
| [FantasyPros PPR ADP](https://www.fantasypros.com/nfl/adp/ppr-overall.php) | 2026 PPR composite; public source selector lists ESPN, CBS Sports, RTSports, Fantrax, and Sleeper | Each selector entry displays **8/30**; the page supplies the 2026 context but no year in those short labels | Platform cross-check. Constituent draft counts, sample windows, and roster assumptions were not verified. Five listed sources are not five independent projections. |

The Fantasy Football Calculator [methodology](https://help.fantasyfootballcalculator.com/article/34-average-draft-position-adp-data) says computer selections are excluded before averaging. Its help-page revision is **July 17, 2018**, distinct from the 2026 sample dates above. That methodological statement does not establish that the human participants represent a particular league's behavior.

ESPN's projection guide also distinguishes its football unit grades from fantasy rankings. Do not treat a team's unit grade, projected win total, or projected strength of schedule as a player fantasy-point forecast. Its published availability assumption must remain attached to any derived estimate. [Projection guide, introduction](https://g.espncdn.com/s/ffldraftkit/26/NFLDK2026_CS_ClayProjections2026.pdf).

**A scoring-label trap:** the FantasyPros projection footer links “Standard Scoring” to a [settings page](https://www.fantasypros.com/scoring-settings/) that describes its defaults as **half-PPR**, including 0.5 per reception, four-point passing touchdowns, and minus one per thrown interception. Do not interpret the word “standard” alone as non-PPR. Verify the actual coefficients for the selected table; no numerical player projection was imported here.

**Retrieval-method difference:** the research browser's extracted FantasyPros text initially omitted the update and source-selection details. A later ordinary HTTP HTML read exposed them. This is a parsing-coverage limitation, not evidence that the site has no metadata. Conversely, an HTTP 200 or a year in a title alone does not verify that usable data were extracted.

## Programmatic access is a separate question

Fantasy Football Calculator documents a [JSON REST API](https://help.fantasyfootballcalculator.com/article/42-adp-rest-api) with format, team-count, year, and position parameters. The provider says updates occur once daily, permits personal/commercial use, and requests attribution. The documentation was last updated July 17, 2018.

One request to the documented 2026, 12-team PPR endpoint returned **HTTP 403** during this audit. Direct HTTP link checks also returned 403 for the two ADP pages and two help pages, although their content was available through the research browser. No numerical API snapshot was stored, no authentication or anti-bot restriction was bypassed, and no automatic collector was added. Browser-accessible evidence and scripted access failures can both be true. A future integration needs a successful response, a schema check, reuse-term review, and a small regression fixture before being called operational.

Do not replace a failed API response with scraped rankings while retaining a successful API label. Do not continuously retry a daily-updated feed. An API being documented does not guarantee access from a particular runner.

## Metadata required before comparing sources

Record these fields beside any manually captured value or short original synthesis. Unknown fields remain explicitly unknown.

| Field | Why it matters |
| --- | --- |
| Provider, original URL, observed time in UTC | Identifies what was inspected and when |
| Displayed publication/update date and sample start/end | Distinguishes fresh retrieval from fresh facts |
| NFL season and forecast horizon | Prevents season/week/rest-of-season comparisons |
| Scoring: reception points, passing TDs, interceptions, bonuses, TE premium | Converts the same football statistics into different fantasy values |
| Starting-QB count, roster slots, league size | Determines replacement level and positional scarcity |
| Redraft, keeper, dynasty, best ball, or managed lineup | Separates distinct decision problems |
| Actual drafts, mock drafts, or expert opinion | Identifies what the numbers measure |
| Draft count, date window, platform, filters | Describes selection bias and coverage |
| Projection author(s), aggregation method, availability assumption | Makes forecast disagreement interpretable |
| Observed value, units, and provider player ID when available | Prevents ADP/rank/points and identity confusion |
| Missing metadata and access failures | Stops an LLM filling the gaps with confidence |

These are required questions, not claims that every public site exposes every field. League settings belong in the participant's private session, not in this repository.

## How to use two sources without manufacturing precision

1. **Choose the decision first.** A season-long draft needs season-long production and draft cost. A Week 1 lineup needs the Week 1 matchup, expected usage, and availability instead.
2. **Match the format.** Do not compare 12-team 1-QB redraft prices with superflex, dynasty, or best-ball prices without explaining the mismatch. If a source's QB count or roster specification is missing, say so.
3. **Match the time.** An August 24–31 aggregate can include selections made before an August 30 transaction. Preserve the window rather than labeling every row an August 31 reaction.
4. **Recalculate only from sufficient inputs.** A custom score can be calculated from projected stat categories if all relevant categories and rules are present. A custom score cannot be recovered reliably from one unexplained fantasy-point total.
5. **Treat availability separately.** Do not apply a second injury discount to a forecast that already discounts games played. If its treatment is unknown, show that ambiguity instead of guessing.
6. **Compare assumptions, not just outputs.** If analysts disagree, ask whether the difference is playing time, targets, touchdown rate, availability, or scoring. A consensus is not independent corroboration when sources reuse the same underlying forecast.
7. **Report a decision range.** A rounded ADP describes the center of a sample, not a guarantee. Without a pick distribution, do not invent a percentage chance that a player lasts another round.

## A reusable private-session prompt

> Audit these public ADP/projection sources before using them. Identify source, season, scoring, team count, roster/QB assumptions, draft type, sample size/window, projection horizon, and displayed update time. Mark unavailable fields. Ask privately for my league settings. Explain which comparisons are valid and which are not. Recheck current official availability. Cite original URLs, do not reproduce proprietary ranking tables, and do not save my settings or roster in this repository.

## Next review

Repeat at the next weekly research run, or immediately when using these sources for a draft. Check whether the API access failure persists through a permitted documented path, whether FantasyPros exposes contributor/availability details, and whether the ESPN projection guide states a full scoring formula. The question is answered as a source audit; these operational and metadata limitations are not treated as resolved.
