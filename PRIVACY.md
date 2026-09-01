# Public-only boundary

This repository is shared research, not a league-management system.

## Allowed

Public NFL player names and professional team/position information; public injury/status flags; aggregate platform trends; schedules; game statistics; public news links; original, source-cited football analysis; clearly hypothetical examples.

## Never collect or publish

Personal or sensitive information about any participant or employee; company operations or internal information; private messages or documents; contact details; authentication material; real league identifiers, invitations, ownership mappings, private rosters, private waiver plans, or information pulled from work accounts. Public visibility elsewhere does not make participant data in scope.

The collector has fixed public endpoint URLs, never asks for a league ID, never authenticates to a fantasy platform, and projects player objects onto a small field allowlist. It discards source metadata, birth dates, social profiles, and prose injury notes. Raw responses are hashed, not archived wholesale.

## Before any publication

1. Run tests and `python3 scripts/validate.py`.
2. Review `git diff` and `git diff --cached` for every file to be published.
3. Confirm every new claim came from public football sources, not private context.
4. Check commit authorship uses a GitHub noreply or bot address.
5. Stage only intended files. Never commit local scratch or private chat exports.

The validator detects selected token, email, local-path, private-workspace-link, and JSON-field patterns. It cannot identify every secret or infer whether ordinary prose is confidential. It is a safety check, not a privacy guarantee.

The research audit also rejects broken local links, unsupported record closures, and rewriting of preserved evidence/review history. These checks establish structure and continuity, not that prose is factually correct or safe to publish. Public-source claims still need editorial review.

If anything sensitive is discovered, stop further publishing and notify the repository owner privately. Do not open a public issue quoting it. Removing a file in a new commit does not remove it from Git history; credential rotation/history cleanup may need separate authorized action.
