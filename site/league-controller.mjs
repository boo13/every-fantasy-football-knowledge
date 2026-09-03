import { loadLeagueSnapshot, parseLeagueInput } from './sleeper.mjs';

function retainEvidence(next, previous) {
  const result = { ...next, warnings: [...next.warnings], draftFetchedAt: next.fetchedAt, matchupsFetchedAt: next.fetchedAt };
  if (!previous || previous.league.season !== next.league.season) return result;
  if (next.sourceStatus.draft === 'unavailable' && next.draftId && next.draftId === previous.draftId && previous.draft) {
    result.draft = previous.draft;
    result.draftStale = true;
    result.draftFetchedAt = previous.draftFetchedAt;
    result.warnings.push(`Draft refresh failed; showing previous picks from ${previous.draftFetchedAt}.`);
  }
  if (next.sourceStatus.matchups === 'unavailable' && next.week === previous.week && previous.matchups) {
    result.matchups = previous.matchups;
    result.matchupsStale = true;
    result.matchupsFetchedAt = previous.matchupsFetchedAt;
    result.warnings.push(`Matchup refresh failed; showing previous scores from ${previous.matchupsFetchedAt}.`);
  }
  return result;
}

export function createLeagueController({
  onChange, loadSnapshot = loadLeagueSnapshot, parseInput = parseLeagueInput,
  documentRef = globalThis.document, schedule = setTimeout, cancel = clearTimeout,
}) {
  let leagueId = null, week, request = null, timer = null, generation = 0, failures = 0, destroyed = false;
  let state = { status: 'disconnected', snapshot: null, error: null, paused: false };
  const emit = () => onChange({ ...state, paused: Boolean(documentRef?.hidden) });
  function stop() {
    cancel(timer); timer = null;
    generation++;
    request?.abort(); request = null;
  }
  function queue() {
    if (!leagueId || destroyed || documentRef?.hidden) return;
    const base = state.snapshot?.draft?.status === 'drafting' || state.snapshot?.league.status === 'drafting' ? 15000 : 60000;
    timer = schedule(() => { timer = null; refresh(); }, Math.min(300000, base * 2 ** Math.min(failures, 5)));
  }
  async function refresh() {
    if (!leagueId || request || destroyed || documentRef?.hidden) return;
    cancel(timer); timer = null;
    const token = generation, controller = new AbortController();
    request = controller;
    state = { ...state, status: state.snapshot ? 'refreshing' : 'connecting', error: null }; emit();
    try {
      const next = await loadSnapshot(leagueId, { signal: controller.signal, week });
      if (token !== generation || controller.signal.aborted || destroyed) return;
      failures = Object.values(next.sourceStatus).includes('unavailable') ? failures + 1 : 0;
      state = { status: 'connected', snapshot: retainEvidence(next, state.snapshot), error: null }; emit();
    } catch {
      if (token !== generation || controller.signal.aborted || destroyed) return;
      failures++;
      state = { ...state, status: 'error', error: state.snapshot
        ? 'Sleeper could not be refreshed. Last successful data remains on screen; automatic retries will slow down.'
        : 'Could not load this NFL league. Check the link and try again. Sleeper may be temporarily unavailable.' }; emit();
    } finally {
      if (token === generation && request === controller) { request = null; queue(); }
    }
  }
  function connect(input) {
    if (destroyed) return;
    let parsed;
    try { parsed = parseInput(input); }
    catch {
      state = { ...state, status: 'error', error: 'Enter a numeric Sleeper league ID or its HTTPS league link, without query parameters.' }; emit(); return;
    }
    stop(); leagueId = parsed; week = undefined; failures = 0;
    state = { status: 'connecting', snapshot: null, error: null }; emit(); refresh();
  }
  function disconnect() {
    stop(); leagueId = null; week = undefined; failures = 0;
    state = { status: 'disconnected', snapshot: null, error: null }; emit();
  }
  function changeWeek(value) {
    if (!Number.isInteger(value) || value < 1 || value > 18 || !leagueId || destroyed) return;
    stop(); week = value; failures = 0; refresh();
  }
  function visibility() {
    if (documentRef.hidden) {
      stop();
      if (state.status === 'refreshing') state = { ...state, status: 'connected' };
      emit();
    } else { emit(); refresh(); }
  }
  documentRef?.addEventListener('visibilitychange', visibility);
  return { connect, disconnect, refresh, changeWeek, destroy() {
    disconnect(); destroyed = true; documentRef?.removeEventListener('visibilitychange', visibility);
  } };
}
