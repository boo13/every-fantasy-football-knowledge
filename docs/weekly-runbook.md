# Weekly collection and compounding runbook

## Division of responsibility

GitHub Actions runs the deterministic collector every Tuesday at 13:17 UTC. A separately configured Codex follow-up runs Tuesday at 11 a.m. America/New_York for research and knowledge maintenance. GitHub collection needs no LLM. The local research follow-up needs an online Codex environment, public web access, the installed Compound Engineering plugin, and authenticated GitHub access. These schedules are not guarantees of exact execution time.

Read [AGENTS.md](../AGENTS.md) and [PRIVACY.md](../PRIVACY.md) first. Only public football material and files in this repository may inform published output. No company connectors, other repositories, user memories, or session-history mining. This privacy boundary also applies inside plugin workflows.

## 1. Establish a safe starting state

- Work only in a clean checkout of the expected repository. Verify the remote and branch. If there are unrelated changes, stop and report; do not reset, stash, or overwrite them.
- Fetch and fast-forward `main`. Never force-push or amend published history.
- Read `data/latest.json`, `context/CURRENT.md`, `research/LATEST.md`, open questions, and relevant existing learnings. Check dates and source health before reasoning.
- Check the latest weekly Actions run. If it failed or the snapshot is more than eight days old, investigate the public source failure. Do not claim current context. A manual rerun is appropriate after recovery, but do not repeatedly fetch the full Sleeper catalog within one day.

## 2. Review the previous cycle first

For every due open question or hypothesis, identify what new public evidence answers it. Record the outcome, source dates, uncertainty, and any confounders in the new research note. If evidence is still missing, keep it open and explain why. Never invent a completed outcome or treat absence as confirmation.

`research/questions.json` tracks open/answered/retired questions with stable IDs. Add append-only review records inside each question; preserve the original question and evidence cutoff. A prediction needs the extra fields in `templates/hypothesis.json` before its outcome, not afterward. Ordinary research questions are not predictions and must not be counted as forecast successes.

## 3. Research material changes

Use the snapshot delta and aggregate trends to prioritize, not to decide conclusions. Check original team reports for consequential injuries/transactions; find dated, format-relevant public analysis when forecasts are needed. Read linked stories before using a headline. Cite actual article/report URLs, not just a homepage.

Research priorities vary by season:

| Phase | Prioritize |
| --- | --- |
| Offseason | Rule changes, coaching/roster changes, draft and free-agency context |
| Pre-draft | Confirmed roles and injuries, rookies, current format-matched ADP/projections |
| Regular season | Workload changes, availability, waiver research, bye coverage, schedule |
| Fantasy playoffs | Availability, replacement options, late-season role changes |
| Postseason | Review outcomes, identify model/process mistakes, retire stale seasonal claims |

The provider's phase label may advance before kickoff. Use actual schedule and source evidence.

## 4. Write the dated briefing

Create `research/YYYY-MM-DD.md` using [the template](../templates/weekly-brief.md). If a same-day briefing already exists, append a dated correction/update section or use a distinct timestamp filename; never erase the prior analysis. Include:

- Evidence cutoff, source health, and a link to the exact observation used.
- Confirmed facts separately from interpretation and open questions.
- Public, league-neutral implications for draft/waiver/start-sit research.
- Reviews of prior questions and hypotheses, including contradictions.
- Clear missing inputs and freshness limitations.

Update `research/LATEST.md` as a compact pointer and append a row to `research/README.md`. A collector run does not count as completed research. Avoid duplicate narratives when nothing meaningful changed; a concise no-material-change report with source coverage is valid.

## 5. Compound and refresh with the plugin

Use the installed **Compound Engineering** plugin, not an imagined news-ingestion service. Its compounding skill captures established learning; it does not magically generate verified football predictions.

- Run `ce-compound mode:non-interactive depth:lightweight` for **one** newly established lesson at a time. This explicitly avoids cross-session research and subagents; public-only isolation takes priority. For football guidance, use knowledge-track metadata and clearly distinguish analytical heuristics from lessons supported by observed outcomes. If nothing is established, record that no lesson was added.
- Put durable lessons under `docs/solutions/`, using the declared `docs_root`. Include the evidence, applicability, limitations, and a review trigger. Do not turn a one-week hot streak into a permanent rule.
- Run `ce-compound-refresh mode:non-interactive` scoped to the affected learnings. Check each against current evidence, update what is supported, and mark uncertainty/staleness when not. No personal session discovery. Do not delete records without explicit approval; use a dated supersession note and Git history.
- Maintain `CONCEPTS.md` for project evidence vocabulary and `docs/glossary.md` for football terminology. Keep the learning index discoverable.
- If the plugin is unavailable, follow the evidence/correction workflow manually and say so in the research note; do not claim a plugin run occurred.

## 6. Validate, review, publish

Run:

```sh
python3 -m unittest discover -s tests -v
python3 scripts/validate.py
python3 scripts/validate.py --fresh --healthy
git diff --check
git diff
```

Review prose for personal/company information as well as credentials; automated checks are not enough. Use a GitHub noreply/bot identity. Stage only intended public research, evidence, and documentation changes. Commit one logical update, push normally, and confirm the remote commit plus CI result. Do not change source URLs, application code, permissions, or schedules during a routine research run without review.

If publication conflicts, credentials fail, or a safety check fails, preserve the work locally and report the specific blocker. Do not bypass checks. If a source is degraded, the collector can publish an explicitly degraded report, then makes the Actions run fail so the problem is visible. Research may discuss the limitation but must not present absent data as fresh evidence.

## Maintenance

Quarterly: review source terms, endpoints, data coverage, action versions, tests and archive size. Annual: verify the new season and handle preseason/current-stat absence explicitly. Public GitHub schedules can be disabled after inactivity; inspect the Actions page if updates stop. Branch protection that blocks bot pushes requires changing the collection workflow to a reviewed-PR model.

This repo does not manage an actual fantasy team, place bids, execute trades, or send league messages.
