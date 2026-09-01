# Collector and validator

`collect.py` fetches fixed public sources, filters allowed fields, records source health/hash/time, compares player fields, and writes a new snapshot plus current/weekly Markdown. Standard library only. It has no access to private fantasy leagues and reads no credentials. It does not publish.

`validate.py` checks selected privacy patterns, JSON privacy keys, source provenance, player-field projection, and the existence of an exact archived copy of the latest snapshot. `--fresh` requires a current snapshot within eight days; `--healthy` rejects degraded source health. Historical CI intentionally omits freshness checks.

Runtime source failures are never converted to fabricated data. Missing current stats are expected only for an HTTP 404 through two calendar days after the first scheduled regular-season game; other failures are marked errors. Downloads have bounded time/size and retries for transient failures. Do not repeatedly download the full player catalog on the same day.

Tests are offline with synthetic public-football fixtures. Run `python3 -m unittest discover -s tests -v`. After changing ingestion or rendering, also run one deliberate live collection and inspect its outputs.

`diagnose_news.py` fetches only the public ESPN feed and reports content type/encoding, byte count, hash and XML parse location. On malformed XML it prints at most a short public-response excerpt. The weekly job invokes it after a failure for runner-specific diagnosis; it never reads credentials or private data.
