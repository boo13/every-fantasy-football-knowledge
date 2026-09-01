# Keeping the knowledge trustworthy as it grows

More stored text is useful only if readers can distinguish evidence, uncertainty, and correction. This repository separates four things:

| Artifact | What it means | What it does not mean |
| --- | --- | --- |
| Observation | Selected public provider fields captured at a known time | All source facts were updated at that time |
| Research question | Something worth investigating with a defined evidence requirement | A prediction that can be scored as a win |
| Hypothesis | A measurable expectation, recorded before the outcome, under explicit assumptions | A guaranteed outcome or an established strategy |
| Durable lesson | A reusable conclusion with supporting evidence and stated limitations | An eternal rule immune to new evidence |

## Start each cycle with what needs review

```sh
python3 scripts/knowledge.py
python3 scripts/knowledge.py --as-of 2026-09-15
```

This offline report lists due open records and status counts. Counts are bookkeeping, not evidence of predictive skill. The hypothesis ledger begins empty intentionally: the initial research questions were not forecasts.

## A useful research review

Append a review to the relevant stable ID in `research/questions.json`, using the shape in `templates/question-review.json`. Keep the original question, creation timestamp, and evidence requirement unchanged. Each review has a timezone-aware `reviewed_at`, a `result`, a concise `summary`, and original `public_sources` URLs. Set the record's status to the latest review's result and update its next review date as needed.

An answered question needs evidence answering the actual question. A link alone is not support. Explain source limitations, contradictory facts, and what remains unresolved. If a question was poorly framed, retire it with an explanation and create a new ID instead of changing its original meaning.

## A testable hypothesis

Use `templates/hypothesis.json` as a shape, not as a ready-to-submit record. Put actual records in `research/hypotheses.json`. Specify season, outcome weeks, scoring assumptions, evidence cutoff, claim, baseline, measurement source, confidence, invalidation conditions, and review date before games occur.

Possible outcomes are `supported`, `not_supported`, `inconclusive`, or `retired`; `open` means no terminal review yet. “Supported” means the measured outcome supported that particular expectation, not that a general strategy has been validated. Record confounders and failed expectations just as carefully as successful ones.

The checks enforce timestamps and structure, but cannot prove that a purported pre-game prediction was genuinely made without hindsight. Public Git history helps establish when it was recorded. Evidence URLs must use HTTPS without credentials and cannot name recognized local/reserved hosts or non-global IP addresses. This is an offline syntax/address check, not proof of public access or permission to reuse content. Nor can checks certify that a cited source supports the prose; that needs review.

## Preserve the evidence, add corrections

```sh
python3 scripts/knowledge.py --against HEAD
```

Compare pending edits against the current commit before publishing. CI uses the push/PR baseline. It rejects changes to existing observation snapshots and generated weekly reports, removal or rewriting of original ledger claims, and changes to prior review entries. Existing dated research Markdown must remain an exact prefix: append a dated correction rather than editing old prose. Current indexes, current-context pointers, and evergreen guides can evolve normally.

Use a new hypothesis ID for a changed claim. Use a new dated note to supersede an old conclusion. Link both directions where feasible without rewriting the old note. Never hide mistakes by deleting records or selecting only favorable outcomes.

## Evidence-quality checklist

- The source is public professional-football information, not private participant or company context.
- The citation supports this exact claim, at this time, rather than merely mentioning the player.
- Independent corroboration is genuinely independent, not articles repeating the same report.
- Facts, provider fields, projections, opinions, and hypotheses are labeled separately.
- Statistical units, sample window, season, denominator, and scoring assumptions match the comparison.
- Missing data, incomplete games, injury uncertainty, and source age remain visible.
- The lesson says when it applies, what would invalidate it, and when to review it.

`validate.py` checks ledgers and local Markdown targets as well as privacy/provenance. It does not fetch external URLs or validate local heading anchors. A passing check is necessary, not sufficient, for trustworthy research.
