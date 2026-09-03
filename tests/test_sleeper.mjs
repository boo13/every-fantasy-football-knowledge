import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLeagueInput, loadLeagueSnapshot } from '../site/sleeper.mjs';

const leagueId = '900000000000000001';
const draftId = '900000000000000002';
const base = 'https://api.sleeper.app/v1/';
const roster = (id, settings = {}) => ({
  roster_id: id,
  settings: { wins: 1, losses: 1, ties: 0, fpts: 100, fpts_decimal: 25, fpts_against: 90, fpts_against_decimal: 75, ...settings },
  players: ['9001', '9002'], starters: ['9001'], reserve: []
});
const fixture = () => ({
  [`league/${leagueId}`]: {
    sport: 'nfl', season: '2026', status: 'in_season', total_rosters: 2,
    settings: { leg: 3 }, scoring_settings: { rec: 1, pass_td: 4 }, roster_positions: ['QB', 'RB', 'BN'], draft_id: draftId
  },
  [`league/${leagueId}/rosters`]: [roster(1), roster(2)],
  [`league/${leagueId}/matchups/3`]: [
    { roster_id: 1, matchup_id: 1, points: 23.45, custom_points: 0, players: ['9001'], starters: ['9001'] },
    { roster_id: 2, matchup_id: 1, points: 10, custom_points: null, players: ['9002'], starters: ['9002'] }
  ],
  [`draft/${draftId}`]: { draft_id: draftId, sport: 'nfl', season: '2026', type: 'snake', status: 'drafting', settings: { rounds: 2, teams: 2 }, slot_to_roster_id: { 1: 2, 2: 1 } },
  [`draft/${draftId}/picks`]: [{ pick_no: 1, round: 1, draft_slot: 1, roster_id: '2', player_id: '9001' }]
});

function mockFetch(data, calls = []) {
  return async (url, options) => {
    calls.push({ url, options });
    assert.equal(url.startsWith(base), true);
    const path = url.slice(base.length);
    assert.equal(Object.hasOwn(data, path), true, `Unexpected synthetic request: ${path}`);
    const value = data[path];
    if (value instanceof Error) throw value;
    return { ok: true, json: async () => structuredClone(value) };
  };
}

const load = (data = fixture(), options = {}) => loadLeagueSnapshot(leagueId, { fetchImpl: mockFetch(data), ...options });

test('parser accepts numeric strings and strict Sleeper league URLs without losing ID precision', () => {
  assert.equal(parseLeagueInput(`  ${leagueId}  `), leagueId);
  for (const host of ['sleeper.com', 'sleeper.app']) {
    for (const suffix of ['', '/', '/team', '/matchup/3']) assert.equal(parseLeagueInput(`https://${host}/leagues/${leagueId}${suffix}`), leagueId);
  }
});

test('parser rejects credentials, URL tricks, other hosts, query/hash, malformed input and numeric coercion', () => {
  const bad = [null, 9001, {}, '', '0', '-1', '1e6', '123.45', '123/4',
    `http://sleeper.com/leagues/${leagueId}`, `https://www.sleeper.com/leagues/${leagueId}`,
    `https://sleeper.com.evil.invalid/leagues/${leagueId}`, `https://evil.invalid/sleeper.com/leagues/${leagueId}`,
    ['https://name:secret', `sleeper.com/leagues/${leagueId}`].join('@'), `https://sleeper.com:443/leagues/${leagueId}`,
    `https://sleeper.com/leagues/${leagueId}?`, `https://sleeper.com/leagues/${leagueId}#`,
    `https://sleeper.com/leagues/${leagueId}?token=private`, `https://sleeper.com/leagues/${leagueId}#private`,
    `https://sleeper.com/leagues/${leagueId}/../1`, `https://sleeper.com/leagues/${leagueId}/%2e%2e/1`,
    `https://sleeper.com\\@evil.invalid/leagues/${leagueId}`, `https://sleeper.com/leagues/${leagueId}\n/1`,
    `https://sleeper.com/leagues/%39${leagueId}`, `//sleeper.com/leagues/${leagueId}`];
  for (const input of bad) assert.throws(() => parseLeagueInput(input), error => {
    assert.equal(error.message, 'Enter a numeric league ID or a Sleeper league URL.');
    return true;
  });
});

test('GET requests stay on fixed endpoints without credentials, cache, redirects or referrer', async () => {
  const calls = [];
  const snapshot = await load(fixture(), { fetchImpl: mockFetch(fixture(), calls) });
  assert.deepEqual(calls.map(call => call.url.slice(base.length)).sort(), [
    `league/${leagueId}`, `league/${leagueId}/rosters`, `league/${leagueId}/matchups/3`, `draft/${draftId}`, `draft/${draftId}/picks`
  ].sort());
  for (const { options } of calls) {
    assert.equal(options.method, 'GET');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.referrerPolicy, 'no-referrer');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.redirect, 'error');
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.body, undefined);
  }
  assert.equal(snapshot.draftId, draftId);
  assert.deepEqual(snapshot.sourceStatus, { draft: 'ok', matchups: 'ok' });
  assert.equal(new Date(snapshot.fetchedAt).toISOString(), snapshot.fetchedAt);
});

test('normalization only exposes allowed fields, generic labels, and string provider IDs', async () => {
  const data = fixture();
  data[`league/${leagueId}`].metadata = { name: 'PRIVATE_SENTINEL' };
  data[`league/${leagueId}`].name = 'PRIVATE_SENTINEL';
  data[`league/${leagueId}/rosters`][0].owner_id = 'PRIVATE_SENTINEL';
  data[`league/${leagueId}/rosters`][0].metadata = { team_name: 'PRIVATE_SENTINEL' };
  data[`draft/${draftId}`].draft_order = { PRIVATE_SENTINEL: 1 };
  data[`draft/${draftId}/picks`][0].picked_by = 'PRIVATE_SENTINEL';
  data[`draft/${draftId}/picks`][0].metadata = { name: 'PRIVATE_SENTINEL' };
  const snapshot = await load(data);
  assert.equal(JSON.stringify(snapshot).includes('PRIVATE_SENTINEL'), false);
  assert.equal(JSON.stringify(snapshot.league).includes(leagueId), false);
  assert.deepEqual(Object.keys(snapshot.league).sort(), ['season', 'status', 'totalRosters', 'scoringSettings', 'rosterPositions'].sort());
  assert.equal(snapshot.rosters[0].label, 'Team 1');
  assert.equal(snapshot.rosters[0].id, 1);
  assert.deepEqual(snapshot.rosters[0].players, ['9001', '9002']);
  assert.deepEqual(snapshot.draft.picks[0], { pickNo: 1, round: 1, draftSlot: 1, rosterId: 2, playerId: '9001' });
  assert.deepEqual(snapshot.draft.slots, { 1: 2, 2: 1 });
});

test('records combine hundredths, preserve zero, and never substitute missing stats', async () => {
  const data = fixture();
  data[`league/${leagueId}/rosters`] = [roster(1, { fpts: 0, fpts_decimal: 0 }), roster(2, { wins: null, ties: undefined, fpts_decimal: undefined, fpts_against: undefined })];
  const snapshot = await load(data);
  assert.equal(snapshot.rosters[0].pointsFor, 0);
  assert.equal(snapshot.rosters[0].pointsAgainst, 90.75);
  assert.equal(snapshot.rosters[1].wins, null);
  assert.equal(snapshot.rosters[1].ties, null);
  assert.equal(snapshot.rosters[1].pointsFor, null);
  assert.equal(snapshot.rosters[1].pointsAgainst, null);
  assert.equal(snapshot.standings.find(row => row.id === 2).rank, null);
});

test('standings use win percentage with half-win ties, then points, shared ranks, and deterministic display', async () => {
  const data = fixture();
  data[`league/${leagueId}/rosters`] = [
    roster(6, { wins: 2, losses: 0, fpts: 1 }),
    roster(4, { wins: 2, losses: 2, fpts: 200 }),
    roster(2, { wins: 1, losses: 1, fpts: 200 }),
    roster(3, { wins: 0, losses: 0, ties: 2, fpts: 150 }),
    roster(1, { wins: 0, losses: 0, fpts: 999 }),
    roster(5, { wins: 2, losses: 6, fpts: 900 })
  ];
  const snapshot = await load(data);
  assert.deepEqual(snapshot.standings.map(row => [row.id, row.rank]), [[6, 1], [2, 2], [4, 2], [3, 4], [5, 5], [1, null]]);
  assert.deepEqual(snapshot.rosters.map(row => row.id), [6, 4, 2, 3, 1, 5]);
});

test('pre-draft, drafting, and unknown-status standings do not invent competitive ranks', async () => {
  for (const status of ['pre_draft', 'drafting', null]) {
    const data = fixture();
    data[`league/${leagueId}`].status = status;
    const snapshot = await load(data);
    assert.deepEqual(snapshot.standings.map(row => row.rank), [null, null]);
  }
});

test('weekly matchup grouping retains explicit commissioner zero and separates unpaired teams', async () => {
  const data = fixture();
  data[`league/${leagueId}/matchups/3`].push({ roster_id: 3, matchup_id: null, points: null }, { roster_id: 4, matchup_id: null, points: 0 });
  const snapshot = await load(data);
  assert.equal(snapshot.matchups[0].id, '1');
  assert.equal(snapshot.matchups[0].teams.length, 2);
  assert.equal(snapshot.matchups[0].teams[0].customPoints, 0);
  assert.equal(snapshot.matchups[0].teams[0].points, 23.45);
  assert.deepEqual(snapshot.matchups.slice(1).map(match => [match.id, match.teams.length]), [[null, 1], [null, 1]]);
  assert.equal(snapshot.matchups[1].teams[0].points, null);
  assert.equal(snapshot.matchups[1].teams[0].players, null);
});

test('string matchup identifiers retain precision without numeric coercion', async () => {
  const data = fixture();
  data[`league/${leagueId}/matchups/3`].forEach(row => { row.matchup_id = '900000000000000003'; });
  const snapshot = await load(data);
  assert.equal(snapshot.matchups[0].id, '900000000000000003');
  assert.equal(snapshot.matchups[0].teams.length, 2);
});

test('week is explicitly selected or comes from league leg, never outside regular-season bounds', async () => {
  const data = fixture();
  data[`league/${leagueId}/matchups/18`] = [];
  assert.equal((await load(data, { week: 18 })).week, 18);
  for (const leg of [null, 0, 19, '3', Infinity]) {
    data[`league/${leagueId}`].settings.leg = leg;
    data[`league/${leagueId}/matchups/1`] = [];
    assert.equal((await load(data)).week, 1);
  }
  for (const week of [0, 19, -1, 1.2, '3', null, NaN]) await assert.rejects(load(data, { week }), /Choose a week from 1 to 18/);
});

test('draft preserves sparse picks and unknown attribution without snake-order inference', async () => {
  const data = fixture();
  data[`draft/${draftId}`].slot_to_roster_id = { 1: 2 };
  data[`draft/${draftId}/picks`] = [
    { pick_no: 4, round: 2, draft_slot: 2, player_id: null },
    { pick_no: 1, player_id: '9001' },
    { pick_no: 7, round: null, draft_slot: null, roster_id: null, player_id: '9003' }
  ];
  const snapshot = await load(data);
  assert.deepEqual(snapshot.draft.picks, [
    { pickNo: 1, round: null, draftSlot: null, rosterId: null, playerId: '9001' },
    { pickNo: 4, round: 2, draftSlot: 2, rosterId: null, playerId: null },
    { pickNo: 7, round: null, draftSlot: null, rosterId: null, playerId: '9003' }
  ]);
  assert.deepEqual(snapshot.draft.slots, { 1: 2 });
});

test('draft uses only the current draft reference and distinguishes missing configuration from failure', async () => {
  for (const value of [null, undefined]) {
    const data = fixture();
    data[`league/${leagueId}`].draft_id = value;
    const calls = [];
    const snapshot = await load(data, { fetchImpl: mockFetch(data, calls) });
    assert.equal(snapshot.draft, null);
    assert.equal(snapshot.draftId, null);
    assert.equal(snapshot.sourceStatus.draft, 'not_configured');
    assert.equal(calls.some(call => call.url.includes('/draft')), false);
  }
  const data = fixture();
  data[`league/${leagueId}`].draft_id = 'https://evil.invalid/private';
  const snapshot = await load(data);
  assert.equal(snapshot.draft, null);
  assert.equal(snapshot.sourceStatus.draft, 'unavailable');
  assert.ok(snapshot.warnings.includes('Current draft data is unavailable.'));
});

test('optional failures stay null with source status while core records survive', async () => {
  for (const bad of [null, {}, new Error('private secret URL')]) {
    const data = fixture();
    data[`league/${leagueId}/matchups/3`] = bad;
    data[`draft/${draftId}/picks`] = bad;
    const snapshot = await load(data);
    assert.equal(snapshot.rosters.length, 2);
    assert.equal(snapshot.matchups, null);
    assert.equal(snapshot.draft, null);
    assert.equal(snapshot.draftId, draftId);
    assert.deepEqual(snapshot.sourceStatus, { draft: 'unavailable', matchups: 'unavailable' });
    assert.deepEqual(snapshot.warnings.sort(), ['Current draft data is unavailable.', 'Weekly matchup data is unavailable.'].sort());
    assert.equal(JSON.stringify(snapshot).includes('private'), false);
  }
});

test('successful empty optional results are evidence distinct from failed requests', async () => {
  const data = fixture();
  data[`league/${leagueId}/matchups/3`] = [];
  data[`draft/${draftId}/picks`] = [];
  const snapshot = await load(data);
  assert.deepEqual(snapshot.matchups, []);
  assert.deepEqual(snapshot.draft.picks, []);
  assert.deepEqual(snapshot.sourceStatus, { draft: 'ok', matchups: 'ok' });
});

test('malformed essential responses fail with safe errors instead of partial fake snapshots', async () => {
  for (const bad of [null, [], {}, { sport: 'nba' }, { sport: 'nfl', scoring_settings: [] }, { sport: 'nfl', roster_positions: {} }]) {
    const data = fixture();
    data[`league/${leagueId}`] = bad;
    await assert.rejects(load(data), /Sleeper league data is unavailable or invalid/);
  }
  for (const bad of [null, {}, [null], [{ roster_id: null }], [roster(1), roster(1)]]) {
    const data = fixture();
    data[`league/${leagueId}/rosters`] = bad;
    await assert.rejects(load(data), /Sleeper league data is unavailable or invalid/);
  }
});

test('nonfinite values and missing lists remain gaps without leaking provider metadata', async () => {
  const data = fixture();
  data[`league/${leagueId}`].scoring_settings = { rec: NaN, pass_td: Infinity, rush_td: 6 };
  data[`league/${leagueId}/rosters`][0] = { roster_id: 1, settings: { wins: Infinity, losses: -1, ties: '0', fpts: 1, fpts_decimal: 100 }, players: null, starters: ['9001', null, {}, 9002], reserve: undefined };
  const snapshot = await load(data);
  assert.deepEqual(snapshot.league.scoringSettings, { rec: null, pass_td: null, rush_td: 6 });
  assert.equal(snapshot.rosters[0].wins, null);
  assert.equal(snapshot.rosters[0].losses, null);
  assert.equal(snapshot.rosters[0].ties, null);
  assert.equal(snapshot.rosters[0].pointsFor, null);
  assert.equal(snapshot.rosters[0].players, null);
  assert.deepEqual(snapshot.rosters[0].starters, ['9001', null, null, null]);
  assert.equal(snapshot.rosters[0].reserve, null);
});

test('network, HTTP and JSON failures never expose raw server errors or league URLs', async () => {
  const implementations = [
    async () => { throw new Error(`private ${base}league/${leagueId}`); },
    async () => ({ ok: false, status: 404, json: async () => ({ error: 'private' }) }),
    async () => ({ ok: true, json: async () => { throw new Error('private'); } })
  ];
  for (const fetchImpl of implementations) await assert.rejects(loadLeagueSnapshot(leagueId, { fetchImpl }), error => {
    assert.equal(error.message, 'Sleeper league data is unavailable or invalid. Check the league ID and try again.');
    assert.equal(error.message.includes(leagueId), false);
    assert.equal(error.cause, undefined);
    return true;
  });
});

test('caller abort cancels every request and does not expose caller-supplied reasons', async () => {
  const controller = new AbortController();
  const signals = [];
  const pending = loadLeagueSnapshot(leagueId, { signal: controller.signal, fetchImpl: async (_url, { signal }) => {
    signals.push(signal);
    return new Promise(() => {});
  } });
  controller.abort(new Error('PRIVATE_SENTINEL'));
  await assert.rejects(pending, error => error.name === 'AbortError' && error.message === 'Sleeper connection cancelled.');
  assert.ok(signals.length > 0);
  assert.equal(signals.every(signal => signal.aborted), true);
  await assert.rejects(loadLeagueSnapshot(leagueId, { signal: controller.signal, fetchImpl: () => assert.fail('No request after abort') }), { name: 'AbortError' });
});

test('timeout ends a stalled request with a safe error', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const pending = loadLeagueSnapshot(leagueId, { fetchImpl: async () => new Promise(() => {}) });
  t.mock.timers.tick(10000);
  await assert.rejects(pending, error => error.message === 'Sleeper request timed out. Try again.');
});

test('optional request timeout degrades only that section after core records load', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const fetchFixture = mockFetch(fixture());
  const pending = loadLeagueSnapshot(leagueId, { fetchImpl: async (url, options) => {
    if (url.includes('/matchups/')) return new Promise(() => {});
    return fetchFixture(url, options);
  } });
  await new Promise(resolve => setImmediate(resolve));
  t.mock.timers.tick(10000);
  const snapshot = await pending;
  assert.equal(snapshot.rosters.length, 2);
  assert.equal(snapshot.matchups, null);
  assert.equal(snapshot.sourceStatus.matchups, 'unavailable');
  assert.equal(snapshot.sourceStatus.draft, 'ok');
  assert.deepEqual(snapshot.warnings, ['Weekly matchup data is unavailable.']);
});
