# Every — Large Language League

The public draft-room page uses the repository's recorded evidence. No fantasy login, analytics, league endpoint, or live draft connection is involved. Original pixel-art animations respond to selecting a player or marking a pick; there are no reaction-demo controls.

## Build and check

From the repository root, run `just site` (or `python3 scripts/build_site.py`). This copies the static assets and generates `_site/data/players.json` from `data/latest.json`. `_site/` is generated and ignored by Git. Use Python 3.12+; Node 22 is needed only for the client-state tests. Run `just check` for Python, JavaScript state, privacy, and evidence checks. Serve `_site/` using a static host; opening the HTML directly as a local file will not support module/data requests.

For the optional rendered-layout regression, open the built or deployed site with Playwright CLI, then run `playwright-cli -s=YOUR_SESSION run-code --filename tests/browser_geometry.cjs --raw` from the repository root. It checks all eight field positions at five viewport widths, including nameplate/HUD collisions; it only selects players and does not mark any picks.

The builder accepts `--snapshot PATH --output PATH`. Data is generated once per build, not fetched from Sleeper by every visitor. There is no new collection schedule. The existing weekly collection remains the source of updates.

## What the numbers mean

- Catalog names, team assignments, and status flags come from the documented public Sleeper API. Assigned team does not establish a player's roster role or availability in any league. Provider flags are not official injury reports.
- The history column uses the prior regular season relative to the provider's season. It is not ADP, a projection, or a draft recommendation. The displayed PPR metric does not set a league's scoring rules.
- nflverse statistics join only through a unique, valid shared GSIS identifier. Missing mappings, duplicate totals, wrong seasons, and failed sources remain explicit gaps. Zero is displayed only when present in the source. PPR/game divides the recorded total by games played.
- Bye weeks are inferred only from a complete, unique, 272-game regular-season schedule. An unmatched team or incomplete schedule yields no bye value.
- Source dates, health, and links appear on the page. A collection older than eight days is labeled stale. This threshold is an operational warning, not a guarantee that younger evidence is suitable for a draft decision.
- Automatic ADP/projection coverage is deliberately absent until a reusable source is verified. See the coverage audit in the knowledge library.

## Private local picks

Mark picked, return to board, and undo affect only the browser. Local storage contains a version number and ordered public Sleeper identifiers, in a season-scoped key. No manager names, league details, or ownership assignments are requested. Nothing is uploaded. Tabs in the same browser stay in sync through storage events; other browsers and devices do not. If storage is blocked, the page clearly reports that picks last only for the current visit. There is no shared real-time draft room or recovery after clearing browser data.

## Original artwork

`assets/sprites.json` contains 32 original, agent-assisted, hand-authored 32 × 48 palette-token frames: eight resting poses and four frames for each of three moods from two viewpoints. These original sprite drawings are provided under the repository's MIT license. They are not extracted from Madden or licensed NFL art. Uniforms and avatars are illustrative, not player portraits; no jersey numbers or demographic attributes are inferred from public player names. The field uses perspective-scaled raster rendering with smoothing disabled.

Selection triggers a short confident gesture. A recorded pick triggers a celebration and a brief passed-over gesture from another sprite. Motion is finite, can be disabled, and respects the operating system's reduced-motion setting. Static poses retain the same information. Reactions are decorative and do not represent real player emotions or predictions.

## Publishing

The `Publish draft room` GitHub Actions workflow builds and validates only the public site artifact, then deploys it to GitHub Pages. It runs on main-branch pushes, manual dispatch, and completion of the existing weekly workflow. The completion trigger is necessary because commits made using the weekly workflow's GitHub token do not trigger another push workflow. A failed weekly run can still publish the latest validated snapshot with its honest source-health warning; it never creates replacement evidence. Deployments serialize instead of canceling each other. No secret or private repository file belongs in this artifact.

Disable the Pages workflow to stop website publishing; disable the weekly workflow separately to stop collection. The site does not alter the separately configured Codex research follow-up.
