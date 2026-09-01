---
title: "Preserve evidence and review history separately from current conclusions"
date: "2026-08-31"
category: "architecture-patterns"
module: "Research quality"
problem_type: "architecture_pattern"
component: "data_model"
severity: "high"
applies_when:
  - "Maintaining cumulative public football research across repeated updates"
  - "Reviewing questions or hypotheses after new evidence arrives"
tags: ["evidence-history", "research-ledger", "hindsight", "validation"]
---

# Preserve evidence and review history separately from current conclusions

## Context

A growing evidence library needs both current conclusions and a record of what was known earlier. A mutable latest report alone cannot distinguish a genuine prediction from a conclusion rewritten after an outcome. A solved research question also does not establish predictive skill.

The initial repository described these boundaries in prose. The expanded system implements explicit question/hypothesis ledgers and Git-baseline preservation checks, with offline regression tests.

## Guidance

Keep four kinds of state distinct: observations, research questions, hypotheses, and reviews. The original question or forecast remains unchanged; reviews append evidence and update the current status. A changed claim gets a new stable ID.

`scripts/knowledge.py` validates record types, timestamps, evidence URLs and status/review consistency. Its `compare_ledger` preserves every original field except status, next review date and the append-only review list. Its `preserve_history` compares existing observation files byte-for-byte with a Git baseline and permits only appended text in existing dated research notes.

Use the audit before publishing pending changes:

```sh
python3 scripts/knowledge.py --against HEAD
```

The CI check uses the event's push/PR baseline; the weekly workflow also runs a history audit around publication. Current indexes and evergreen guides remain editable. A new source observation can show corrected upstream statistics without modifying the old observation.

## Why This Matters

Keeping favorable outcomes while erasing failed expectations creates a misleading track record. Preserving source history, original claims and subsequent reviews makes corrections inspectable. Separating questions from forecasts prevents source discovery or documentation work from being counted as prediction wins.

## When to Apply

Apply during every research update and source-correction review. Revisit the audit if directory layout, ledger fields, or CI checkout/baseline behavior changes. The checks protect the repository workflow, not against a maintainer deliberately removing the checks or rewriting Git history.

## Examples

Valid: append a dated review that says a role expectation was unsupported, cites new evidence, and explains a confounder. Keep the original claim intact.

Invalid: alter the original expected role to match the result, delete the earlier review, or mark a question answered without a cited review.

Verification: `tests/test_knowledge.py` exercises closure evidence, chronological reviews, claim preservation, appended reviews, modified observations, dated-note corrections, local-link handling, and source/publication boundary checks. These tests do not establish that a citation supports a claim, that a forecast was truly recorded before the real-world outcome, or that a strategy works. Editorial source review and publication history remain necessary.

## Related

- [Knowledge-quality guide](../../knowledge-quality.md)
- [Weekly runbook](../../weekly-runbook.md)
- [Project concepts](../../../CONCEPTS.md)
