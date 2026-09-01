# Repository automation

`check.yml` runs offline unit tests and privacy/provenance validation on pushes and pull requests, with read-only repository permissions and no persisted checkout credential.

`weekly.yml` runs Tuesday at 13:17 UTC or by manual dispatch. It uses only public sources, runs tests, validates output, and commits only generated evidence paths. Its short-lived GitHub token has `contents: write`; no personal token, fantasy login or LLM API key is required. Scheduled runs are serialized. Actions are pinned to commit hashes.

Required-source failure leaves the last successful snapshot untouched. Optional-source failure produces an explicit degraded report; after publishing that report the final health check fails the run. Inspect the Actions logs and `context/CURRENT.md` rather than assuming a green collection means every football fact is current.

Pause by disabling the weekly workflow. The separate Codex research schedule must be paused in Codex. GitHub bot pushes using GITHUB_TOKEN do not generally trigger another push workflow, so tests and validation also run inside the weekly job.
