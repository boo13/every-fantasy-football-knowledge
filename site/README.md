# Every — Large Language League

The public draft-room page uses the repository's recorded evidence. An optional read-only Sleeper connection adds league screens without storing league data in the repository. No fantasy login, analytics, or server is involved. Original pixel-art animations respond to selections and new draft picks; there are no reaction-demo controls.

## Connect Sleeper

Paste your Sleeper league link or numeric ID into **Connect Sleeper**. The connection lasts for this visit only. It is not placed in the page URL or either browser-storage API; reload or disconnect to clear it. Nothing is sent to GitHub or a backend. The public default has no configured league. See [PRIVACY.md](../PRIVACY.md) for the full boundary and why a publicly accessible API is not an access-control system.

- **League table:** actual W/L/T and points for/against with generic Team N aliases. Display order uses winning percentage (ties count half) then points for; it is not official playoff seeding or a reproduction of all Sleeper tiebreakers. Before games, no leader is invented.
- **Matchups:** choose weeks 1–18. Scores come from the selected league, including commissioner overrides. Missing data stays unavailable, never a fabricated zero or final result.
- **Rosters:** numbered teams, starters, reserves, and other rostered players, with exact public-player-ID lookups. Taxi assignments are not collected, so unassigned players are not automatically called bench players. Missing catalog players remain explicitly unmatched.
- **Draft:** the league's current draft and recorded picks. Newly observed picks trigger the existing celebration and passed-over sprites; loading old picks does not replay the draft. Initial and subsequent empty responses do not simulate activity.

Refreshes run after the preceding request finishes: normally every 15 seconds while drafting and 60 seconds otherwise, with backoff to five minutes on failures. Hidden tabs pause and cancel requests; returning starts a fresh request. Manual refresh is available. This is polling, not guaranteed instantaneous delivery. Disconnect and replaced connections invalidate in-flight responses. Failed refreshes preserve last-good evidence with visible warnings; optional draft/matchup failures retain it only for the same draft/week.

No users, profile pictures, manager names, team names, chats, transactions, or ownership mappings are requested for display. The full NFL player catalog is not fetched per viewer. League rules are shown separately from the public historical PPR reference. A player absent from fetched draft picks is not necessarily available in the league: keepers, trades, current rosters, and missing coverage can differ. Make lineup, trade, and draft changes in Sleeper itself.

## Build and check

From the repository root, run `just site` (or `python3 scripts/build_site.py`). This copies the static assets and generates `_site/data/players.json` from `data/latest.json`. `_site/` is generated and ignored by Git. Use Python 3.12+; Node 22 is needed only for the client-state tests. Run `just check` for Python, JavaScript state, privacy, and evidence checks. Serve `_site/` using a static host; opening the HTML directly as a local file will not support module/data requests.

For the optional rendered-layout regression, open the built or deployed site with Playwright CLI, then run `playwright-cli -s=YOUR_SESSION run-code --filename tests/browser_geometry.cjs --raw` from the repository root. It checks all eight field positions at five viewport widths, including nameplate/HUD collisions; it only selects players and does not mark any picks.

For the full browser suite, use `just browser-checks YOUR_SESSION` in a **fresh disposable browser** already showing the built or deployed page, with no connection or saved manual picks. The league regression intercepts API requests using explicitly fictional fixtures, checks live-pick animation, failures, privacy, and five screen widths, and leaves one synthetic local pick in that disposable profile. Never run it in a participant's active browser session. Build output versions asset URLs so a deployment does not mix cached old JavaScript with new league screens.

The builder accepts `--snapshot PATH --output PATH`. Public catalog data is generated once per build, not fetched from Sleeper by every visitor. There is no new collection schedule. The existing weekly collection remains the source of public evidence updates; visit-only league polling is separate.

## What the numbers mean

- Catalog names, team assignments, and status flags come from the documented public Sleeper API. Assigned team does not establish a player's roster role or availability in any league. Provider flags are not official injury reports.
- The history column uses the prior regular season relative to the provider's season. It is not ADP, a projection, or a draft recommendation. The displayed PPR metric does not set a league's scoring rules.
- nflverse statistics join only through a unique, valid shared GSIS identifier. Missing mappings, duplicate totals, wrong seasons, and failed sources remain explicit gaps. Zero is displayed only when present in the source. PPR/game divides the recorded total by games played.
- Bye weeks are inferred only from a complete, unique, 272-game regular-season schedule. An unmatched team or incomplete schedule yields no bye value.
- Source dates, health, and links appear on the page. A collection older than eight days is labeled stale. This threshold is an operational warning, not a guarantee that younger evidence is suitable for a draft decision.
- Automatic ADP/projection coverage is deliberately absent until a reusable source is verified. See the coverage audit in the knowledge library.

## Private local picks

When disconnected, mark picked, return to board, and undo affect only the browser. Local storage contains a version number and ordered public Sleeper player identifiers, in a season-scoped key. Nothing is uploaded. Tabs in the same browser stay in sync through storage events; other browsers and devices do not. If storage is blocked, the page clearly reports that picks last only for the current visit. Connecting hides manual controls and shows fetched draft picks instead; disconnect restores the saved manual board untouched. There is no recovery after clearing browser data.

## Original artwork

`assets/sprites.json` contains 32 original, agent-assisted, hand-authored 32 × 48 palette-token frames: eight resting poses and four frames for each of three moods from two viewpoints. These original sprite drawings are provided under the repository's MIT license. They are not extracted from Madden or licensed NFL art. Uniforms and avatars are illustrative, not player portraits; no jersey numbers or demographic attributes are inferred from public player names. The field uses perspective-scaled raster rendering with smoothing disabled.

Selection triggers a short confident gesture. A recorded pick triggers a celebration and a brief passed-over gesture from another sprite. Motion is finite, can be disabled, and respects the operating system's reduced-motion setting. Static poses retain the same information. Reactions are decorative and do not represent real player emotions or predictions.

## Publishing

The `Publish draft room` GitHub Actions workflow builds and validates only the public site artifact, then deploys it to GitHub Pages. It runs on main-branch pushes, manual dispatch, and completion of the existing weekly workflow. The completion trigger is necessary because commits made using the weekly workflow's GitHub token do not trigger another push workflow. A failed weekly run can still publish the latest validated snapshot with its honest source-health warning; it never creates replacement evidence. Deployments serialize instead of canceling each other. No secret or private repository file belongs in this artifact.

Disable the Pages workflow to stop website publishing; disable the weekly workflow separately to stop collection. The site does not alter the separately configured Codex research follow-up.
