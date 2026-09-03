import test from 'node:test';
import assert from 'node:assert/strict';
import { restorePicks, filterPlayers } from '../site/board-state.mjs';

const players = [
  { id: '1', name: 'Alpha Runner', team: 'BUF', position: 'RB', history: { ppr: 0, ppr_per_game: 0 } },
  { id: '2', name: 'Beta Receiver', team: 'NYJ', position: 'WR', history: null },
  { id: '3', name: 'Gamma Passer', team: null, position: 'QB', history: { ppr: 80, ppr_per_game: 20 } },
  { id: '4', name: 'Delta Runner', team: 'BUF', position: 'RB', history: { ppr: 100, ppr_per_game: 10 } }
];
const filters = { search: '', position: '', scope: 'all', rostered: false, sort: 'ppr' };
const ids = rows => rows.map(p => p.id);

test('local picks are versioned, allowlisted, unique identifiers only', () => {
  const allowed = new Set(['1', '2']);
  assert.deepEqual(restorePicks(JSON.stringify({ version: 1, picks: ['2', '1', '2', 'unknown', 1, null, {}] }), allowed), ['2', '1']);
  for (const raw of ['bad json', 'null', '{}', '{"version":2,"picks":["1"]}', '{"version":1,"picks":{}}']) assert.deepEqual(restorePicks(raw, allowed), []);
});

test('unknown history sorts after real zero without mutating the catalog', () => {
  assert.deepEqual(ids(filterPlayers(players, new Set(), filters)), ['4', '3', '1', '2']);
  assert.deepEqual(ids(players), ['1', '2', '3', '4']);
  assert.deepEqual(ids(filterPlayers(players, new Set(), { ...filters, sort: 'per_game' })), ['3', '4', '1', '2']);
});

test('local picked state never asserts league availability', () => {
  const picks = new Set(['4']);
  assert.deepEqual(ids(filterPlayers(players, picks, { ...filters, scope: 'picked' })), ['4']);
  assert.deepEqual(ids(filterPlayers(players, picks, { ...filters, scope: 'unmarked', rostered: true })), ['1', '2']);
});

test('search, position, assigned-team and alphabetic filters compose', () => {
  assert.deepEqual(ids(filterPlayers(players, new Set(), { ...filters, search: '  buf ', position: 'RB', sort: 'name', rostered: true })), ['1', '4']);
  assert.deepEqual(filterPlayers(players, new Set(), { ...filters, search: 'nobody' }), []);
});
