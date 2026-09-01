---
title: "Separate season labels from statistic availability"
date: "2026-08-31"
category: "best-practices"
module: "Public football evidence"
problem_type: "best_practice"
component: "api_layer"
severity: "high"
applies_when:
  - "Interpreting fantasy data around a season transition"
  - "A provider labels a season active before statistics exist"
tags: ["season-rollover", "missing-data", "provenance"]
---

# Separate season labels from statistic availability

## Context

The initial public observation returned a Sleeper season label of 2026, regular phase, and display week 1, while the schedule's first regular-season game was September 9 and the requested 2026 weekly-stat release returned HTTP 404. The 2025 regular-season statistics were available. See the [dated briefing](../../../research/2026-08-31.md) and its exact archived evidence link.

This is an established data-handling lesson, not a prediction about player performance.

## Guidance

Treat provider season state, schedule timing, and actual statistical coverage as separate evidence. Label every statistical sample with its season; never silently substitute prior-season results for missing current-season production.

In the collector, an HTTP 404 for current weekly stats is considered expected only through two calendar days after the first scheduled regular-season game. Other optional-source failures are marked errors and make collection health degraded. Required state/player failures stop collection before replacing the latest snapshot. These mechanics are implemented in `scripts/collect.py` under `collect` and tested in `tests/test_collect.py`.

An expected absence means the file was not available. It does not prove that no game was played, and the two-day tolerance is an operational policy, not an upstream publication guarantee. Successful download likewise does not prove complete game coverage.

## Why This Matters

An LLM given a current-season label alongside unlabeled old statistics may produce confident but temporally invalid advice. Source status and season-specific fields preserve the boundary between current evidence, historical context, and unknowns.

## When to Apply

Apply around preseason, week one, season rollovers, and provider outages. Revisit the policy if the publication cadence or season-state semantics change. Compare source coverage with actual completed games before claiming complete weekly production.

## Examples

Safe: “The provider labels this week 1; current regular-season stats are unavailable in this observation. The separate 2025 table is historical.”

Unsafe: “The season is active, so these 2025 totals show who is producing now.”

Verification: offline tests cover pre-kickoff 404, post-kickoff missing stats becoming degraded, required-source preservation, and rollover of both requested stat seasons. The initial live collection confirmed the actual provider/schedule/stat mismatch described above.

## Related

- [Source registry](../../../SOURCES.md)
- [Weekly runbook](../../weekly-runbook.md)
- [Data semantics](../../../data/README.md)
