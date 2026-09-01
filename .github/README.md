# Every Fantasy Football Knowledge

A public, shared research library for fantasy-football players and their LLMs. Beginner-friendly, source-cited, and designed to grow more useful each week. Same evidence for everyone; no private league, personal, or company information.

[![Checks](https://github.com/boo13/every-fantasy-football-knowledge/actions/workflows/check.yml/badge.svg)](https://github.com/boo13/every-fantasy-football-knowledge/actions/workflows/check.yml)
[![Weekly collection](https://github.com/boo13/every-fantasy-football-knowledge/actions/workflows/weekly.yml/badge.svg)](https://github.com/boo13/every-fantasy-football-knowledge/actions/workflows/weekly.yml)

## Start here

| Need | Read |
| --- | --- |
| Point your LLM at the repo | [START_HERE.md](../START_HERE.md) |
| Learn football and fantasy | [Beginner guide](../docs/football-and-fantasy.md) and [glossary](../docs/glossary.md) |
| Check current evidence | [Current collected context](../context/CURRENT.md) and [latest research](../research/LATEST.md) |
| Research draft, waiver, trade, or lineup decisions | [Decision framework](../docs/decision-framework.md) and [copyable prompts](../prompts/README.md) |
| See what has been learned | [Durable lessons](../docs/solutions/README.md) and [open questions](../research/questions.json) |
| Understand the system or run it yourself | [Full guide](../README.md), [sources](../SOURCES.md), and [weekly runbook](../docs/weekly-runbook.md) |

## Weekly updates

- **Tuesday 13:17 UTC:** GitHub Actions collects public player status, aggregate trends, schedules, and statistics. Dated snapshots and before/after context are committed automatically.
- **Tuesday 11 a.m. US Eastern:** a separately configured Codex follow-up researches public news, reviews prior questions, writes a cited briefing, and uses Compound Engineering to capture and refresh durable lessons. This part requires the owner's Codex environment; it is not installed by cloning the repo.

News is researched separately because ESPN's feed returns an empty response from the hosted runner. Data reports disclose that gap. Read both the collection and research timestamps. No live ADP/projections or private league availability is implied; recheck official player availability before decisions.

Evidence snapshots are preserved. Briefings separate facts from inference. Lessons retain their scope and limitations, and corrections remain visible. No forecasting track record is claimed from the initial seed.

## Give this to your LLM

> Read START_HERE.md and AGENTS.md, check source dates, and use this repo as public football evidence. Ask privately for the league rules and decision options you need. Explain unfamiliar terms, distinguish facts from inference, cite sources, and recheck time-sensitive news. Never write personal rosters, identities, league details, or strategy back into this public repo.

## Safety and automation

Only public professional-football information belongs here. [Privacy rules](../PRIVACY.md) prohibit personal/company information and private league records. The name is not a claim of company sponsorship. [Attribution and reuse](../NOTICE.md) preserve upstream terms.

The [check workflow](workflows/check.yml) runs tests and privacy/provenance validation with read-only permissions. The [weekly workflow](workflows/weekly.yml) uses a short-lived GitHub token with `contents: write`, pinned actions, and no fantasy login or LLM API key. It stages only generated evidence paths. Required-source failures preserve the old snapshot; optional-source errors produce an explicitly degraded report and a failing health check.

Pause collection by disabling the weekly workflow. Pause research separately in Codex. GitHub schedules can be delayed or disabled after inactivity. Read the [full guide](../README.md) for local commands, caveats and contribution instructions.
