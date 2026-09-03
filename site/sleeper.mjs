const API = 'https://api.sleeper.app/v1/';
const NUMERIC_ID = /^[1-9]\d{0,29}$/;
const INPUT_ERROR = 'Enter a numeric league ID or a Sleeper league URL.';
const DATA_ERROR = 'Sleeper league data is unavailable or invalid. Check the league ID and try again.';

export function parseLeagueInput(text) {
  if (typeof text !== 'string') throw new Error(INPUT_ERROR);
  const value = text.trim();
  if (NUMERIC_ID.test(value)) return value;
  const match = /^https:\/\/(?:sleeper\.com|sleeper\.app)\/leagues\/([1-9]\d{0,29})(?:\/[a-z0-9_-]+)*\/?$/i.exec(value);
  if (!match) throw new Error(INPUT_ERROR);
  return match[1];
}

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const finite = value => typeof value === 'number' && Number.isFinite(value) ? value : null;
const integer = value => Number.isSafeInteger(value) && value >= 0 ? value : null;
const positive = value => integer(value) !== null && value > 0 ? value : null;
const providerId = value => typeof value === 'string' && NUMERIC_ID.test(value) ? value : null;
const rosterId = value => positive(typeof value === 'string' && NUMERIC_ID.test(value) ? Number(value) : value);
const playerId = value => typeof value === 'string' && /^(?:\d{1,30}|[A-Z]{2,3})$/.test(value) ? value : null;
const weekNumber = value => positive(value) !== null && value <= 18 ? value : null;
const invalid = () => { throw new Error(DATA_ERROR); };

function optionalObject(value) {
  if (value == null) return null;
  if (!isObject(value)) invalid();
  return value;
}

function list(value, normalize) {
  if (value == null) return null;
  if (!Array.isArray(value)) invalid();
  return value.map(normalize);
}

function points(settings, wholeKey, decimalKey) {
  const whole = finite(settings?.[wholeKey]);
  const decimal = integer(settings?.[decimalKey]);
  if (whole === null || !Number.isSafeInteger(whole) || decimal === null || decimal > 99) return null;
  const result = whole + decimal / 100;
  return Number.isFinite(result) ? result : null;
}

function normalizeLeague(raw, warn) {
  if (!isObject(raw) || raw.sport !== 'nfl') invalid();
  optionalObject(raw.settings);
  const scoring = optionalObject(raw.scoring_settings);
  const league = {
    season: typeof raw.season === 'string' && /^\d{4}$/.test(raw.season) ? raw.season : null,
    status: ['pre_draft', 'drafting', 'in_season', 'complete'].includes(raw.status) ? raw.status : null,
    totalRosters: positive(raw.total_rosters),
    scoringSettings: scoring === null ? null : Object.fromEntries(Object.entries(scoring)
      .filter(([key]) => /^[a-z][a-z0-9_]{0,63}$/.test(key))
      .map(([key, value]) => [key, finite(value)])),
    rosterPositions: list(raw.roster_positions, value => typeof value === 'string' && /^[A-Z][A-Z0-9_]{0,31}$/.test(value) ? value : null)
  };
  if (Object.values(league).some(value => value === null) || league.rosterPositions?.includes(null)
      || (league.scoringSettings && Object.values(league.scoringSettings).includes(null))) warn('Some league settings are unavailable.');
  return league;
}

function normalizeRosters(raw, warn) {
  if (!Array.isArray(raw)) invalid();
  const seen = new Set();
  return raw.map(row => {
    if (!isObject(row)) invalid();
    const id = rosterId(row.roster_id);
    if (id === null || seen.has(id)) invalid();
    seen.add(id);
    const settings = optionalObject(row.settings);
    const roster = {
      id, label: `Team ${id}`,
      wins: integer(settings?.wins), losses: integer(settings?.losses), ties: integer(settings?.ties),
      pointsFor: points(settings, 'fpts', 'fpts_decimal'),
      pointsAgainst: points(settings, 'fpts_against', 'fpts_against_decimal'),
      players: list(row.players, playerId), starters: list(row.starters, playerId), reserve: list(row.reserve, playerId)
    };
    if (Object.values(roster).some(value => value === null || (Array.isArray(value) && value.includes(null)))) warn('Some roster fields are unavailable.');
    return roster;
  });
}

function recordRate(roster) {
  if ([roster.wins, roster.losses, roster.ties].includes(null)) return null;
  const games = roster.wins + roster.losses + roster.ties;
  return Number.isSafeInteger(games) && games > 0 ? (roster.wins + roster.ties / 2) / games : null;
}

function standings(rosters, status) {
  const active = status === 'in_season' || status === 'complete';
  const compareKnown = (a, b) => a === null ? (b === null ? 0 : 1) : b === null ? -1 : b - a;
  const rows = rosters.map(roster => ({ ...roster, rank: null })).sort((a, b) => {
    if (!active) return a.id - b.id;
    return compareKnown(recordRate(a), recordRate(b)) || compareKnown(a.pointsFor, b.pointsFor) || a.id - b.id;
  });
  let previous = null;
  rows.forEach((row, index) => {
    const rate = recordRate(row);
    if (!active || rate === null || row.pointsFor === null) return;
    row.rank = previous && recordRate(previous) === rate && previous.pointsFor === row.pointsFor ? previous.rank : index + 1;
    previous = row;
  });
  return rows;
}

function normalizeMatchups(raw, warn) {
  if (!Array.isArray(raw)) invalid();
  const groups = [], byId = new Map(), seen = new Set();
  for (const row of raw) {
    if (!isObject(row)) invalid();
    const id = rosterId(row.roster_id);
    if (id === null || seen.has(id)) invalid();
    seen.add(id);
    const matchId = providerId(row.matchup_id) ?? (positive(row.matchup_id) === null ? null : String(row.matchup_id));
    const team = {
      rosterId: id, points: finite(row.points), customPoints: finite(row.custom_points),
      starters: list(row.starters, playerId), players: list(row.players, playerId)
    };
    if (team.points === null || team.starters === null || team.players === null) warn('Some weekly matchup fields are unavailable.');
    if (matchId === null) {
      groups.push({ id: null, teams: [team] });
    } else {
      if (!byId.has(matchId)) {
        const group = { id: matchId, teams: [] };
        groups.push(group);
        byId.set(matchId, group);
      }
      byId.get(matchId).teams.push(team);
    }
  }
  return groups;
}

function normalizeDraft(raw, picks, id, season, warn) {
  if (!isObject(raw) || raw.sport !== 'nfl' || !Array.isArray(picks)) invalid();
  if (raw.draft_id != null && raw.draft_id !== id) invalid();
  if (season !== null && raw.season != null && raw.season !== season) invalid();
  const settings = optionalObject(raw.settings);
  const mapping = optionalObject(raw.slot_to_roster_id);
  const slots = Object.fromEntries(Object.entries(mapping ?? {}).flatMap(([slot, roster]) => {
    const draftSlot = rosterId(slot), owner = rosterId(roster);
    return draftSlot === null || owner === null ? [] : [[draftSlot, owner]];
  }));
  const seen = new Set();
  const rows = picks.map(row => {
    if (!isObject(row)) invalid();
    const pickNo = positive(row.pick_no);
    if (pickNo !== null && seen.has(pickNo)) invalid();
    if (pickNo !== null) seen.add(pickNo);
    return { pickNo, round: positive(row.round), draftSlot: positive(row.draft_slot), rosterId: rosterId(row.roster_id), playerId: playerId(row.player_id) };
  }).sort((a, b) => (a.pickNo ?? Infinity) - (b.pickNo ?? Infinity));
  const draft = {
    id, type: ['snake', 'linear', 'auction'].includes(raw.type) ? raw.type : null,
    status: ['pre_draft', 'drafting', 'paused', 'complete'].includes(raw.status) ? raw.status : null,
    rounds: positive(settings?.rounds), teams: positive(settings?.teams), slots, picks: rows
  };
  if (Object.values(draft).some(value => value === null) || rows.some(row => Object.values(row).includes(null))) warn('Some current draft fields are unavailable.');
  return draft;
}

export async function loadLeagueSnapshot(leagueId, { signal, week, fetchImpl = globalThis.fetch } = {}) {
  const id = parseLeagueInput(leagueId);
  if (week !== undefined && weekNumber(week) === null) throw new Error('Choose a week from 1 to 18.');
  if (typeof fetchImpl !== 'function') throw new Error(DATA_ERROR);
  const abortedError = () => {
    const error = new Error('Sleeper connection cancelled.');
    error.name = 'AbortError';
    return error;
  };
  if (signal?.aborted) throw abortedError();
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  let rejectAbort;
  const aborted = new Promise((_, reject) => { rejectAbort = () => reject(abortedError()); });
  controller.signal.addEventListener('abort', rejectAbort, { once: true });
  const request = async path => {
    if (controller.signal.aborted) throw abortedError();
    const requestController = new AbortController();
    const cancelRequest = () => requestController.abort();
    controller.signal.addEventListener('abort', cancelRequest, { once: true });
    let timedOut = false;
    const interruptedError = () => {
      if (!timedOut) return abortedError();
      const error = new Error('Sleeper request timed out. Try again.');
      error.name = 'TimeoutError';
      return error;
    };
    const timer = setTimeout(() => { timedOut = true; requestController.abort(); }, 10000);
    let rejectRequest;
    const interrupted = new Promise((_, reject) => { rejectRequest = () => reject(interruptedError()); });
    requestController.signal.addEventListener('abort', rejectRequest, { once: true });
    try {
      return await Promise.race([(async () => {
        const response = await fetchImpl(`${API}${path}`, {
          method: 'GET', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', redirect: 'error', signal: requestController.signal
        });
        if (response?.ok !== true || typeof response.json !== 'function') invalid();
        return await response.json();
      })(), interrupted]);
    } catch {
      if (requestController.signal.aborted) throw interruptedError();
      throw new Error(DATA_ERROR);
    } finally {
      clearTimeout(timer);
      controller.signal.removeEventListener('abort', cancelRequest);
      requestController.signal.removeEventListener('abort', rejectRequest);
      requestController.abort();
    }
  };
  const readSnapshot = async () => {
    const warnings = [], warn = message => { if (!warnings.includes(message)) warnings.push(message); };
    const [rawLeague, rawRosters] = await Promise.all([request(`league/${id}`), request(`league/${id}/rosters`)]);
    const league = normalizeLeague(rawLeague, warn), rosters = normalizeRosters(rawRosters, warn);
    const selectedWeek = week ?? weekNumber(rawLeague.settings?.leg) ?? 1;
    const draftId = providerId(rawLeague.draft_id);
    const sourceStatus = { draft: rawLeague.draft_id == null ? 'not_configured' : 'unavailable', matchups: 'unavailable' };
    const optional = async (name, read, message) => {
      try {
        const result = await read();
        sourceStatus[name] = 'ok';
        return result;
      } catch {
        if (controller.signal.aborted) throw abortedError();
        warn(message);
        return null;
      }
    };
    if (draftId === null && rawLeague.draft_id != null) warn('Current draft data is unavailable.');
    const [matchups, draft] = await Promise.all([
      optional('matchups', async () => normalizeMatchups(await request(`league/${id}/matchups/${selectedWeek}`), warn), 'Weekly matchup data is unavailable.'),
      draftId === null ? null : optional('draft', async () => {
        const [rawDraft, rawPicks] = await Promise.all([request(`draft/${draftId}`), request(`draft/${draftId}/picks`)]);
        return normalizeDraft(rawDraft, rawPicks, draftId, league.season, warn);
      }, 'Current draft data is unavailable.')
    ]);
    return { league, rosters, standings: standings(rosters, league.status), week: selectedWeek, matchups, draft, draftId, sourceStatus, fetchedAt: new Date().toISOString(), warnings };
  };
  try {
    return await Promise.race([readSnapshot(), aborted]);
  } finally {
    signal?.removeEventListener('abort', cancel);
    controller.signal.removeEventListener('abort', rejectAbort);
    controller.abort();
  }
}
