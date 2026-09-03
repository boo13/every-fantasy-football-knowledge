async (page) => {
  if (await page.locator('.ll-content').isVisible() || Number(await page.locator('#pd-drafted-count').innerText()) !== 0) {
    throw new Error('Run league checks in a fresh disposable browser with no connection or manual picks.');
  }
  const checks = [], errors = [], requests = [];
  const check = (name, okay) => checks.push({ name, okay: Boolean(okay) });
  page.on('pageerror', error => errors.push(error.message));
  const catalog = await page.evaluate(async () => (await (await fetch('./data/players.json')).json()).players);
  const playerIds = catalog.filter(player => player.team).slice(0, 3).map(player => player.id);
  const leagueId = '111111111111111111', draftId = '222222222222222222';
  let status = 'pre_draft', picks = [], failCore = false, failDraft = false, phase = 0, delayCore = false;
  const roster = id => ({ roster_id: id, owner_id: 'excluded-owner', players: phase ? [playerIds[0]] : [], taxi: phase ? [playerIds[0]] : [], starters: ['0'], reserve: [], settings: {
    wins: phase ? id === 2 ? 3 : 2 : 0, losses: phase ? id === 2 ? 0 : 1 : 0, ties: phase ? 1 : 0,
    fpts: phase ? 120 : 0, fpts_decimal: phase ? 34 : 0, fpts_against: 0, fpts_against_decimal: 0,
  } });
  await page.route('https://api.sleeper.app/**', async route => {
    const path = route.request().url().split('/v1/')[1]; requests.push(path);
    let body;
    if (path === `league/${leagueId}`) {
      if (delayCore) await page.waitForTimeout(200);
      if (failCore) { await route.fulfill({ status: 503, body: 'excluded-server-detail' }); return; }
      body = { sport: 'nfl', season: '2026', status, total_rosters: 12, draft_id: draftId,
        name: 'excluded-private-name', metadata: { secret: 'excluded-private-metadata' },
        settings: { leg: 1 }, scoring_settings: { rec: 0.5, pass_td: 4, rush_td: 6, rec_td: 6 }, roster_positions: ['QB', 'RB', 'WR', 'TE', 'FLEX', 'BN'] };
    } else if (path === `league/${leagueId}/rosters`) body = Array.from({ length: 12 }, (_, index) => roster(index + 1));
    else if (path.startsWith(`league/${leagueId}/matchups/`)) body = phase ? [
      { roster_id: 1, matchup_id: 1, points: 15.55, custom_points: 0, players: [], starters: [] },
      { roster_id: 2, matchup_id: 1, points: 0, custom_points: null, players: [], starters: [] },
    ] : [];
    else if (path === `draft/${draftId}`) body = { draft_id: draftId, sport: 'nfl', season: '2026', status: status === 'in_season' ? 'complete' : status, type: 'snake', settings: { rounds: 16, teams: 12 }, slot_to_roster_id: { 1: 1, 2: 2 } };
    else if (path === `draft/${draftId}/picks`) {
      if (failDraft) { await route.fulfill({ status: 503, body: 'excluded-private-error' }); return; }
      body = picks;
    }
    if (body === undefined) { await route.abort(); return; }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body), headers: { 'access-control-allow-origin': '*' } });
  });
  const root = page.locator('#pixel-draft-room');
  const league = page.locator('#pd-league');
  const refresh = async () => {
    await league.getByRole('button', { name: 'Refresh', exact: true }).click();
    await league.getByRole('button', { name: 'Refresh', exact: true }).waitFor({ state: 'visible' });
    await page.waitForFunction(() => !document.querySelector('.ll-session-controls button').disabled);
  };
  await page.locator('#pd-draft').click();
  const saved = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  await league.locator('input').fill(`https://sleeper.com/leagues/${leagueId}/predraft`);
  await league.getByRole('button', { name: 'CONNECT LEAGUE →' }).click();
  await league.locator('.ll-content').waitFor({ state: 'visible' });
  check('pre-draft league renders twelve anonymous teams', await league.locator('.ll-standings tbody tr').count() === 12);
  check('pre-draft has no invented leader', (await league.locator('.ll-standings tbody tr td:first-child').allTextContents()).every(value => value === '—'));
  check('live session hides manual mutation controls', await page.locator('#pd-draft').isHidden() && await page.locator('#pd-undo').isHidden());
  check('connect clears entered ID', await league.locator('input').inputValue() === '');
  check('private provider fields are not rendered', !(await league.textContent()).includes('excluded-'));
  check('connection neither stores ID nor overwrites manual picks', await page.evaluate(() => JSON.stringify({ ...localStorage })) === saved && await page.evaluate(() => sessionStorage.length) === 0);
  check('only approved read endpoints requested', requests.length === 5 && requests.every(path => !/users|user\/|chat|avatar|transactions/.test(path)));
  await league.getByRole('tab', { name: 'Rosters' }).click();
  check('empty starter sentinel is an empty slot', (await league.locator('.ll-roster-table').innerText()).includes('Empty slot'));
  await league.getByRole('tab', { name: 'Draft', exact: false }).click();
  check('empty draft explains absence instead of demo picks', (await league.locator('[role=tabpanel]:visible').innerText()).includes('No picks recorded'));
  status = 'drafting';
  picks = [{ pick_no: 1, round: 1, draft_slot: 1, roster_id: 1, player_id: playerIds[0], picked_by: 'excluded-owner' }];
  await refresh();
  check('new Sleeper pick reaches board', await page.locator('#pd-drafted-count').innerText() === '01');
  const frames = [];
  for (let index = 0; index < 5; index++) { frames.push(await page.locator('.pd-player-layer').getAttribute('data-scene')); await page.waitForTimeout(170); }
  check('new pick triggers authored celebration and passed-over reaction', frames.some(value => value.includes('picked')) && frames.some(value => value.includes('annoyed')));
  await page.waitForTimeout(2300);
  check('reaction settles', await page.locator('.pd-player-layer').getAttribute('data-frame') === '0');
  picks.push({ pick_no: 2, round: 1, draft_slot: 2, roster_id: 2, player_id: '99999999999999' });
  await refresh();
  check('unmatched draft pick never replays another player celebration', await page.locator('.pd-player-layer').getAttribute('data-frame') === '0' && await page.locator('.pd-celebrating').count() === 0 && await page.locator('#pd-drafted-count').innerText() === '02');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  picks.push({ pick_no: 3, round: 1, draft_slot: 3, roster_id: 3, player_id: playerIds[1] });
  await refresh();
  check('live reactions respect reduced motion', await root.getAttribute('data-motion') === 'off' && await page.locator('.pd-player-layer').getAttribute('data-frame') === '0');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  failDraft = true; await refresh();
  check('failed draft refresh retains known picks with warning', await page.locator('#pd-drafted-count').innerText() === '03' && (await league.locator('.ll-warnings').innerText()).includes('previous picks'));
  failDraft = false; status = 'in_season'; phase = 1; await refresh();
  await league.getByRole('tab', { name: 'League table' }).click();
  check('standings use real record order and decimal totals', (await league.locator('.ll-standings tbody tr').first().innerText()).includes('Team 2') && (await league.locator('.ll-standings tbody tr').first().innerText()).includes('120.34'));
  await league.getByRole('tab', { name: 'Rosters' }).click();
  check('unavailable taxi assignment is not inferred as bench', (await league.locator('.ll-roster-table').innerText()).includes('Other rostered') && !(await league.locator('.ll-roster-table').innerText()).includes('Bench'));
  await league.getByRole('tab', { name: 'Matchups' }).click();
  check('commissioner zero overrides nonzero reported points', (await league.locator('.ll-match .ll-led').allTextContents()).every(value => value === '0.00') && (await league.locator('.ll-match-note').innerText()).includes('override'));
  await league.getByLabel('Matchup week').focus();
  delayCore = true;
  await league.getByRole('button', { name: 'Refresh', exact: true }).evaluate(node => node.click());
  check('background refresh preserves active week control', await league.getByLabel('Matchup week').evaluate(node => !node.disabled && document.activeElement === node));
  await page.waitForFunction(() => !document.querySelector('.ll-session-controls button').disabled);
  delayCore = false;
  const focused = await league.getByLabel('Matchup week').evaluate(node => { node.dataset.focusSentinel = 'yes'; return true; });
  await league.getByLabel('Matchup week').selectOption('3');
  await page.waitForFunction(() => !document.querySelector('.ll-session-controls button').disabled);
  check('week selection fetches chosen week and preserves its control', requests.includes(`league/${leagueId}/matchups/3`) && await league.getByLabel('Matchup week').getAttribute('data-focus-sentinel') === 'yes' && focused);
  failCore = true; await refresh();
  check('total failure preserves evidence and exposes safe error', await league.locator('.ll-match').count() === 1 && (await league.locator('.ll-error').innerText()).includes('Last successful') && !(await league.textContent()).includes('excluded-'));
  failCore = false; await refresh();
  for (const width of [1280, 768, 620, 390, 320]) {
    await page.setViewportSize({ width, height: 1200 });
    for (const label of ['League table', 'Matchups', 'Rosters', 'Draft']) {
      await league.getByRole('tab', { name: label }).click();
      await page.waitForTimeout(120);
      check(`${label} page fits ${width}px`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
  }
  await league.getByRole('button', { name: 'Disconnect', exact: true }).click();
  check('disconnect restores the manual board', await page.locator('#pd-drafted-count').innerText() === '01' && await page.locator('#pd-draft').isVisible());
  check('disconnect clears hidden league DOM', await league.locator('.ll-content tbody tr').count() === 0 && await league.locator('.ll-match').count() === 0 && await league.locator('.ll-scoring > div').count() === 0);
  check('live picks never entered storage', await page.evaluate(() => JSON.stringify({ ...localStorage })) === saved);
  check('no connection state in page URL', !page.url().includes(leagueId));
  await page.reload(); await page.locator('#pixel-draft-room[data-ready=true]').waitFor();
  check('reload does not reconnect', await league.locator('.ll-connect').isVisible() && await league.locator('input').inputValue() === '');
  check('no uncaught application errors', errors.length === 0);
  const result = { passed: checks.filter(value => value.okay).length, total: checks.length, failures: checks.filter(value => !value.okay), errors };
  if (result.failures.length) throw new Error(JSON.stringify(result));
  return result;
}
