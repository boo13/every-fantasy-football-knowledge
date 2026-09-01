---
title: "Validate collection health against source evidence"
date: "2026-09-01"
category: "best-practices"
module: "Public football evidence"
problem_type: "logic_error"
component: "api_layer"
severity: "medium"
symptoms:
  - "A contradictory snapshot could claim healthy collection while a source reported failure"
  - "An unavailable source could retain rows without the validator rejecting the contradiction"
root_cause: "missing_validation"
resolution_type: "code_fix"
tags: ["source-health", "validation", "missing-data", "provenance"]
---

# Validate collection health against source evidence

## Problem

The collector constructed consistent source and overall health fields, but the validator did not independently enforce their relationship. A modified snapshot could keep an overall healthy label while an optional source reported failure. That made the health check less reliable precisely when an input was inconsistent.

## Symptoms

The regression test builds a valid synthetic observation, changes the news source to an error, empties its rows, and leaves overall health unchanged. Before the fix, snapshot validation accepted it. A second case attaches prior-season statistical rows to an unavailable current-stat source; source status and data disagree even though each exists separately.

These are controlled test cases, not evidence that a published observation contained either defect. Existing archives are preserved.

## Solution

The fix in [snapshot validation](../../../scripts/validate.py) checks the relationship between source outcomes and datasets:

- Every expected source has its associated dataset with the correct top-level object/list shape.
- Required state and player sources must have successful status.
- A source that is not successful cannot carry dataset rows.
- Overall health must be degraded if any source has error status, and otherwise healthy under the collector's defined policy.

The code's actual labels are `error`, `degraded` and `ok`. Explicit expected absence and manual research are not errors; they still represent coverage gaps. The validator rejects contradictions rather than silently relabeling data or carrying older values forward.

[Collector regression tests](../../../tests/test_collect.py) cover hidden source failures, required-source failure and rows attached to an unavailable source. A consistently degraded observation remains structurally valid so it can disclose a real outage; the operational `--healthy` check then rejects its health.

## Why This Works

An overall status is a derived claim. Validating only that the claim has an allowed spelling does not prove it agrees with the underlying source outcomes. Checking both the summary and the source-to-dataset relationship keeps missing evidence from being disguised as successful current data.

This is a data-integrity check, not a guarantee that successful responses are accurate, complete or newly updated. Public-source review, game-coverage checks and separate research timestamps remain necessary.

## Prevention

When adding a source or changing its absence policy, test both valid outcomes and contradictory combinations. Include successful, expected-absent, failed, required-source-failed and carried-data cases as applicable. Keep operational health distinct from historical validity: a preserved degraded archive is still valuable evidence of what was available then.

Review this lesson if the source inventory, required-source policy or overall health rules change. Do not relax the invariant simply to make a failing run appear green.

## Related

- [Season labels do not establish statistical availability](season-labels-are-not-stat-availability.md).
- [Preserve original evidence and reviews](../architecture-patterns/preserve-evidence-and-review-history.md).
- [Source registry and coverage limitations](../../../SOURCES.md).

Captured with Compound Engineering `ce-compound`, non-interactive lightweight mode, from the repository's tested source-health regression. No session-history or private-context research was used.
