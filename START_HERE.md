# LLM reading order

1. Read [AGENTS.md](AGENTS.md) for boundaries and [SOURCES.md](SOURCES.md) for coverage.
2. Read [current evidence](context/CURRENT.md) and [latest research](research/LATEST.md). State both dates, not just today's date.
3. Use [the library index](docs/README.md) to choose the relevant [handbook chapter](docs/handbook/README.md), [decision framework](docs/decision-framework.md), [glossary](docs/glossary.md), and [durable learnings](docs/solutions/README.md).
4. Use the [offline query CLI](docs/querying-data.md) for bounded player/schedule/history evidence. Otherwise search [weekly observations](context/weekly/) or [data snapshots](data/snapshots/) only for the players, seasons, and claims the question requires. Do not ingest the entire archive by default.
5. Ask for missing scoring/roster rules and available options privately. Never save the answer into this public repo.

## Copy this into your LLM

> Use this repository as a public evidence library. Start with START_HERE.md and AGENTS.md, then check the collection and research timestamps. Explain fantasy terms briefly. Ask me privately for the scoring format, roster slots, and decision options you need. Separate sourced facts, interpretation, and unknowns. Cite paths and source dates. Recheck time-sensitive claims on the public web before advising. Do not assume missing data means zero, healthy, unavailable, or unrostered. Never write my roster, identity, strategy, or league details back into the repo.

A pasted GitHub URL does not guarantee an LLM can read a whole repository. Use a GitHub connector, clone the repository into the LLM's workspace, or attach the small set of files above. If it cannot browse, have it explicitly identify what needs a live check.

## Match the evidence to the task

| Question | Additional context |
| --- | --- |
| Draft preparation | Scoring/formats plus snake/auction chapters, current-season source guide, live ADP/projections |
| Waiver or lineup decision | Waiver/lineup chapters, a bounded player packet, current official reports |
| What changed? | Exact observation history plus dated research; distinguish provider-field changes from confirmed news |
| Is a strategy supported? | [Knowledge quality](docs/knowledge-quality.md), prior hypotheses and their complete review history |

Before weekly research, run `python3 scripts/knowledge.py` for due reviews. An answered research question is not a successful forecast. Empty statistical coverage and an unmatched player ID are unknowns, not negative judgments about a player.
