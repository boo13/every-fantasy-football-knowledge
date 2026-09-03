import test from 'node:test';
import assert from 'node:assert/strict';
import { createLeagueController } from '../site/league-controller.mjs';

const snapshot = (changes = {}) => ({
  league: { season: '2026', status: 'drafting' }, rosters: [], standings: [], week: 1,
  draftId: 'fixture-draft', draft: { id: 'fixture-draft', status: 'drafting', picks: [{ playerId: '1' }] },
  matchups: [], sourceStatus: { draft: 'ok', matchups: 'ok' }, warnings: [],
  fetchedAt: '2026-09-01T12:00:00Z', ...changes,
});
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function harness(loadSnapshot) {
  const listeners = new Map(), timers = new Map(), states = [];
  let serial = 0;
  const documentRef = { hidden: false, addEventListener: (k, fn) => listeners.set(k, fn), removeEventListener: k => listeners.delete(k) };
  const controller = createLeagueController({
    loadSnapshot, parseInput: value => { if (!value) throw new Error('private detail'); return value; },
    onChange: state => states.push(state), documentRef,
    schedule: (fn, delay) => { timers.set(++serial, { fn, delay }); return serial; },
    cancel: id => timers.delete(id),
  });
  return { controller, states, timers, documentRef, hide(value) { documentRef.hidden = value; listeners.get('visibilitychange')(); } };
}

test('polls after completion without overlap and disconnect drops all connection state', async () => {
  let resolve, calls = 0, signal;
  const h = harness((id, options) => { calls++; signal = options.signal; return new Promise(done => { resolve = done; }); });
  h.controller.connect('synthetic');
  h.controller.refresh();
  assert.equal(calls, 1);
  assert.equal(h.timers.size, 0);
  resolve(snapshot()); await flush();
  assert.equal(h.states.at(-1).status, 'connected');
  assert.equal([...h.timers.values()][0].delay, 15000);
  h.controller.disconnect();
  assert.equal(h.states.at(-1).snapshot, null);
  assert.equal(h.states.at(-1).status, 'disconnected');
  assert.equal(h.timers.size, 0);
  assert.ok(!JSON.stringify(h.states).includes('synthetic'));
  assert.equal(signal.aborted, false);
});

test('late results cannot resurrect a disconnected or replaced league', async () => {
  const requests = [];
  const h = harness((id, { signal }) => new Promise(resolve => requests.push({ id, signal, resolve })));
  h.controller.connect('old'); h.controller.connect('new');
  assert.equal(requests[0].signal.aborted, true);
  requests[1].resolve(snapshot({ week: 2 })); await flush();
  requests[0].resolve(snapshot({ week: 9 })); await flush();
  assert.equal(h.states.at(-1).snapshot.week, 2);
  h.controller.refresh(); h.controller.disconnect();
  requests[2].resolve(snapshot()); await flush();
  assert.equal(h.states.at(-1).status, 'disconnected');
});

test('hidden tabs cancel work and resume with one fresh request', async () => {
  const requests = [];
  const h = harness((id, { signal }) => new Promise(resolve => requests.push({ signal, resolve })));
  h.controller.connect('synthetic'); h.hide(true);
  assert.equal(requests[0].signal.aborted, true);
  assert.equal(h.states.at(-1).paused, true);
  requests[0].resolve(snapshot()); await flush();
  assert.equal(h.states.at(-1).snapshot, null);
  h.hide(false); requests[1].resolve(snapshot()); await flush();
  assert.equal(h.states.at(-1).paused, false);
  assert.equal(h.timers.size, 1);
  h.controller.destroy();
  assert.equal(h.timers.size, 0);
});

test('errors retain evidence, redact provider errors, and back off', async () => {
  let fail = false;
  const h = harness(async () => { if (fail) throw new Error('sensitive response'); return snapshot(); });
  h.controller.connect('synthetic'); await flush(); fail = true;
  h.controller.refresh(); await flush();
  assert.equal(h.states.at(-1).status, 'error');
  assert.equal(h.states.at(-1).snapshot.draft.picks.length, 1);
  assert.ok(!JSON.stringify(h.states).includes('sensitive response'));
  assert.equal([...h.timers.values()][0].delay, 30000);
  h.controller.refresh(); await flush();
  assert.equal([...h.timers.values()][0].delay, 60000);
});

test('optional failures retain same-draft and same-week evidence with stale warnings', async () => {
  let value = snapshot();
  const h = harness(async () => value);
  h.controller.connect('synthetic'); await flush();
  value = snapshot({ draft: null, matchups: null, sourceStatus: { draft: 'unavailable', matchups: 'unavailable' }, fetchedAt: '2026-09-01T12:01:00Z' });
  h.controller.refresh(); await flush();
  const retained = h.states.at(-1).snapshot;
  assert.equal(retained.draft.picks.length, 1);
  assert.equal(retained.draftStale, true);
  assert.equal(retained.draftFetchedAt, '2026-09-01T12:00:00Z');
  assert.ok(retained.warnings.some(warning => warning.includes('previous')));
  value = { ...value, draftId: 'different-draft', week: 2 };
  h.controller.changeWeek(2); await flush();
  assert.equal(h.states.at(-1).snapshot.draft, null);
  assert.equal(h.states.at(-1).snapshot.matchups, null);
});

test('week changes cancel the old request and reject invalid weeks', async () => {
  const requests = [];
  const h = harness((id, options) => new Promise(resolve => requests.push({ ...options, resolve })));
  h.controller.connect('synthetic'); h.controller.changeWeek(3);
  assert.equal(requests[0].signal.aborted, true);
  assert.equal(requests[1].week, 3);
  for (const week of [0, 19, NaN, 1.5]) h.controller.changeWeek(week);
  assert.equal(requests.length, 2);
  requests[1].resolve(snapshot({ week: 3 })); await flush();
  assert.equal(h.states.at(-1).snapshot.week, 3);
});

test('invalid connection input does not fetch or leak validation details', () => {
  let calls = 0;
  const h = harness(async () => { calls++; return snapshot(); });
  h.controller.connect('');
  assert.equal(calls, 0);
  assert.equal(h.states.at(-1).status, 'error');
  assert.ok(!JSON.stringify(h.states).includes('private detail'));
});
