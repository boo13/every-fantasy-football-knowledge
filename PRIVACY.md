# Public-only boundary

This repository is shared public research. Its optional website league view is read-only and keeps connected data outside the repository.

## Allowed

Public NFL player names and professional team/position information; public injury/status flags; aggregate platform trends; schedules; game statistics; public news links; original, source-cited football analysis; clearly hypothetical examples.

## Never archive or publish

Personal or sensitive information about any participant or employee; company operations or internal information; private messages or documents; contact details; authentication material; real league identifiers, invitations, ownership mappings, private rosters, private waiver plans, or information pulled from work accounts. Public visibility elsewhere does not make participant data in scope.

The collector has fixed public endpoint URLs, never asks for a league ID, never authenticates to a fantasy platform, and projects player objects onto a small field allowlist. It discards source metadata, birth dates, social profiles, and prose injury notes. Raw responses are hashed, not archived wholesale.

## Optional, visit-only Sleeper connection

After a viewer explicitly pastes a league link or ID and connects, the website requests league settings, anonymous numbered rosters, matchups, and the current draft and picks directly from Sleeper. No password or token is requested. These responses are projected onto a small allowlist in memory. Names, ownership identifiers, avatars, biographies, metadata, and other unnecessary fields are discarded; the users endpoint is never requested. Team labels are generic roster numbers, not participant names.

The connection uses no server, analytics, telemetry, upload, URL query/hash state, local storage, session storage, or export feature. Disconnecting, navigating away, or reloading clears it. A connection must be entered again on the next visit. Live draft picks never overwrite the independent manual board's saved public player IDs. The weekly collector and research automations do not gain league access.

Sleeper's API is publicly accessible without authentication: knowing an ID may allow someone to retrieve league data elsewhere. Browser-only handling is not an access-control system or a promise that Sleeper keeps the league private. Scores and roster combinations can still reveal league information even with anonymous labels. Do not publish screenshots, browser traces, fixtures, error payloads, or other records of a real connected league. Use fictional fixtures for automated tests and visual proofs. The viewer and Sleeper necessarily see the requests; browser developer tools can also inspect them.

## Before any publication

1. Run tests and `python3 scripts/validate.py`.
2. Review `git diff` and `git diff --cached` for every file to be published.
3. Confirm every new claim came from public football sources, not private context.
4. Check commit authorship uses a GitHub noreply or bot address.
5. Stage only intended files. Never commit local scratch or private chat exports.

The validator detects selected token, email, local-path, private-workspace-link, and JSON-field patterns. It cannot identify every secret or infer whether ordinary prose is confidential. It is a safety check, not a privacy guarantee.

The research audit also rejects broken local links, unsupported record closures, and rewriting of preserved evidence/review history. These checks establish structure and continuity, not that prose is factually correct or safe to publish. Public-source claims still need editorial review.

If anything sensitive is discovered, stop further publishing and notify the repository owner privately. Do not open a public issue quoting it. Removing a file in a new commit does not remove it from Git history; credential rotation/history cleanup may need separate authorized action.
