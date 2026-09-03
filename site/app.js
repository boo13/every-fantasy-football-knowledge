import { createScene } from './scene.js';
import { filterPlayers, restorePicks } from './board-state.mjs';
import { createLeagueView } from './league-view.mjs';
import { createLeagueController } from './league-controller.mjs';
import { createIntro } from './intro.mjs';

const root = document.getElementById('pixel-draft-room');
const q = selector => root.querySelector(selector);
const number = (value, decimals = 1) => typeof value === 'number' && Number.isFinite(value)
  ? value.toLocaleString('en-US', { maximumFractionDigits: decimals }) : '—';
const announce = text => { q('#pd-announcement').textContent = text; };

async function loadJSON(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error('Published asset unavailable');
  return response.json();
}

async function start() {
  const introCaptions = { stadium: 'Welcome to the stadium', crowd: 'The crowd is ready', bench: 'On the sideline', referee: 'Ready for the snap', snap: 'Under center', wipe: 'Back to the stadium' };
  const intro = createIntro(q('#pd-intro-canvas'), { onSceneChange: name => { q('#pd-intro-caption').textContent = introCaptions[name] || 'Game day'; } });
  const [data, art] = await Promise.all([loadJSON('./data/players.json'), loadJSON('./assets/sprites.json')]);
  if (data.schema_version !== 1 || !Array.isArray(data.players) || !data.players.length) throw new Error('Player catalog unavailable');
  const players = data.players, byId = new Map(players.map(p => [p.id, p]));
  const allowed = new Set(byId.keys()), storageKey = `large-language-league:picks:${data.season}`;
  let storage, picks = [], storageWorks = true;
  try { storage = window.localStorage; picks = restorePicks(storage.getItem(storageKey), allowed); }
  catch { storageWorks = false; }
  let selected = null, page = 0, rows = [], actors = [], timer, interval, currentMood = 'confident', boardHovered = null, boardFocused = null;
  let leagueState = { status: 'disconnected', snapshot: null };
  const inLeague = () => Boolean(leagueState.snapshot || leagueState.status === 'connecting');
  const boardPicks = () => inLeague()
    ? (leagueState.snapshot?.draft?.picks || []).map(pick => pick.playerId).filter(Boolean) : picks;
  const pageSize = 12;
  const motion = q('#pd-motion'), reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = createScene(root, art, { actors: () => actors, selected: () => selected });
  const moods = {
    confident: { bubble: 'CALL MY\nNAME.', title: 'In the spotlight', subtitle: 'Check the evidence. Make your call.' },
    picked: { bubble: 'LET’S\nGOOO!', title: 'Off the board!', subtitle: 'Marked picked on this browser.' }
  };

  function localStatus() {
    q('#pd-local-status').textContent = inLeague()
      ? 'Read-only Sleeper session. Draft picks stay in memory; your manual board is untouched.' : storageWorks
      ? 'Picks saved on this browser only. No live league connection.'
      : 'Browser storage unavailable. Picks last only for this visit.';
  }
  function save() {
    try {
      if (!storage) throw new Error('No storage');
      storage.setItem(storageKey, JSON.stringify({ version: 1, picks }));
      storageWorks = true;
    } catch { storageWorks = false; }
    localStatus();
  }
  function filters() {
    return { search: q('#pd-search').value, position: q('#pd-position').value, scope: q('#pd-scope').value,
      sort: q('#pd-sort').value, rostered: q('#pd-rostered').checked };
  }
  function assignActors() {
    const pickedIds = new Set(boardPicks());
    const visible = rows.slice(page * pageSize, (page + 1) * pageSize).filter(p => !pickedIds.has(p.id) || p.id === selected).slice(0, 8);
    if (byId.has(selected) && !visible.some(p => p.id === selected)) visible.splice(2, visible.length >= 8 ? 1 : 0, byId.get(selected));
    const previous = new Map(actors.map(p => [p.id, p.slot]));
    const used = new Set(visible.map(p => previous.get(p.id)).filter(Boolean));
    const slots = ['C', 'A', 'B', 'D', 'E', 'F', 'G', 'H'];
    const skins = ['#bc8054', '#80543c', '#d8a378'];
    actors = visible.map(p => {
      const slot = previous.get(p.id) || slots.find(value => !used.has(value));
      used.add(slot);
      return { ...p, slot, skin: skins[slots.indexOf(slot) % 3] };
    });
  }
  function stopAnimation() {
    clearTimeout(timer); clearInterval(interval);
    q('.pd-stadium').classList.remove('pd-celebrating');
  }
  function react(mood, play = true) {
    stopAnimation(); currentMood = mood;
    const details = moods[mood];
    let subtitle = details.subtitle;
    let mode = mood === 'picked' ? 'PICK RECORDED LOCALLY' : 'LOCAL BOARD';
    if (inLeague()) {
      if (mood === 'picked') subtitle = 'Selected in the fetched Sleeper draft.';
      const stale = leagueState.snapshot?.draftStale || leagueState.status === 'error';
      mode = stale ? 'SLEEPER · STALE' : 'SLEEPER · READ ONLY';
    }
    q('#pd-bubble').textContent = details.bubble;
    q('#pd-mood-title').textContent = selected ? details.title : 'No matching players';
    q('#pd-mood-subtitle').textContent = selected ? subtitle : 'Try another search or board filter.';
    q('#pd-scene-mode').textContent = mode;
    q('.pd-stadium').dataset.sceneMode = mood === 'picked' ? 'picked' : 'browsing';
    scene.react(mood, play && mood === 'picked' ? actors.find(p => p.id !== selected)?.id : null);
    if (play && selected && root.dataset.motion === 'on') {
      if (mood === 'picked') q('.pd-stadium').classList.add('pd-celebrating');
      let frame = 1; scene.draw(frame);
      interval = setInterval(() => { frame++; if (frame >= 8) { clearInterval(interval); frame = 0; } scene.draw(frame); }, 180);
      timer = setTimeout(() => { stopAnimation(); scene.react(mood); }, 2000);
    }
  }
  function renderSelection() {
    const p = byId.get(selected), picked = boardPicks().includes(selected);
    q('#pd-draft').disabled = !p || inLeague();
    q('#pd-draft').hidden = inLeague();
    q('#pd-draft').dataset.drafted = String(picked);
    q('#pd-draft').textContent = picked ? 'Return to board ↶' : 'Mark picked →';
    q('#pd-draft').setAttribute('aria-label', p ? `${picked ? 'Return to board:' : 'Mark picked:'} ${p.name}` : 'No player selected');
    let pickedStatus = inLeague() ? 'NO FETCHED PICK' : 'UNMARKED';
    if (picked) pickedStatus = 'PICKED';
    q('#pd-picked-status').textContent = p ? pickedStatus : 'NO SELECTION';
    q('#pd-player-title').textContent = p?.name || 'No player selected';
    q('#pd-player-meta').textContent = p ? `${p.position} · ${p.team || 'No assigned team'} · Sleeper ID ${p.id}` : 'Adjust the filters to find a player.';
    q('#pd-nameplate').textContent = p ? `${p.position} · ${p.name}` : '';
    q('.pd-actor').hidden = !p; q('#pd-bubble').hidden = !p;
    q('#pd-points').textContent = number(p?.history?.ppr);
    q('#pd-per-game').textContent = number(p?.history?.ppr_per_game);
    q('#pd-bye').textContent = number(p?.bye, 0);
    q('#pd-provider-status').textContent = p ? `${p.status || 'Not supplied'} · Injury flag: ${p.injury_status || 'Not supplied'} · Practice: ${p.practice_participation || 'Not supplied'}` : '—';
    const usage = q('#pd-usage'); usage.replaceChildren();
    if (p?.history) {
      const metrics = [['Games', 'games'], ['Pass yards', 'passing_yards'], ['Pass TD', 'passing_tds'], ['Carries', 'carries'], ['Rush yards', 'rushing_yards'], ['Rush TD', 'rushing_tds'], ['Targets', 'targets'], ['Receptions', 'receptions'], ['Rec. yards', 'receiving_yards'], ['Rec. TD', 'receiving_tds']];
      for (const [label, key] of metrics) {
        if (p.position !== 'QB' && key.startsWith('passing')) continue;
        const dt = document.createElement('dt'), dd = document.createElement('dd');
        dt.textContent = label; dd.textContent = number(p.history[key], 0); usage.append(dt, dd);
      }
    }
    q('#pd-history-note').textContent = p?.history
      ? `${data.history_season} regular season · historical team: ${p.history.team || 'not supplied'}. Exact GSIS match. PPR/game = total PPR ÷ games played.`
      : p ? `No verified ${data.history_season} total in this snapshot (${p.history_status.replaceAll('_', ' ')}). That is not a zero-point season.` : '';
    q('#pd-drafted-count').textContent = inLeague() && !leagueState.snapshot?.draft ? '—' : String(inLeague() ? leagueState.snapshot.draft.picks.length : picks.length).padStart(2, '0');
    q('#pd-undo').disabled = !picks.length || inLeague();
    q('#pd-undo').hidden = inLeague();
    root.querySelectorAll('#pd-board tr[data-player]').forEach(row => {
      row.classList.toggle('pd-row-selected', row.dataset.player === selected);
      row.querySelector('button').setAttribute('aria-pressed', String(row.dataset.player === selected));
    });
    assignActors(); scene.draw();
  }
  function renderBoard() {
    boardHovered = null;
    boardFocused = null;
    scene.hover(null);
    const displayedPicks = boardPicks();
    const syncBoardHover = () => scene.hover(boardFocused || boardHovered);
    rows = filterPlayers(players, new Set(displayedPicks), filters());
    page = Math.max(0, Math.min(page, Math.ceil(rows.length / pageSize) - 1));
    const body = q('#pd-board'); body.replaceChildren();
    for (const p of rows.slice(page * pageSize, (page + 1) * pageSize)) {
      const row = document.createElement('tr'); row.dataset.player = p.id;
      row.classList.toggle('pd-row-drafted', displayedPicks.includes(p.id));
      const cell = document.createElement('td'), button = document.createElement('button');
      button.type = 'button'; button.className = 'pd-player-btn';
      button.setAttribute('aria-label', `Select ${p.name}, ${p.position}, ${p.team || 'no assigned team'}${displayedPicks.includes(p.id) ? ', marked picked' : ''}`);
      const label = document.createElement('span'), detail = document.createElement('small');
      label.textContent = p.name; detail.textContent = `${p.position} · ${p.team || '—'}${p.injury_status ? ' · ' + p.injury_status : ''}${displayedPicks.includes(p.id) ? ' · PICKED' : ''}`;
      button.append(label, detail); cell.append(button); row.append(cell);
      for (const value of [p.history?.games, p.history?.ppr, p.bye]) { const td = document.createElement('td'); td.textContent = number(value); row.append(td); }
      row.addEventListener('click', () => { selected = p.id; renderSelection(); react(boardPicks().includes(p.id) ? 'picked' : 'confident', !boardPicks().includes(p.id)); announce(`${p.name} selected.`); });
      row.addEventListener('pointerenter', () => { boardHovered = p.id; syncBoardHover(); });
      row.addEventListener('pointerleave', () => { if (boardHovered === p.id) boardHovered = null; syncBoardHover(); });
      button.addEventListener('focus', () => { boardFocused = p.id; syncBoardHover(); });
      button.addEventListener('blur', () => { if (boardFocused === p.id) boardFocused = null; syncBoardHover(); });
      body.append(row);
    }
    if (!rows.length) { const row = document.createElement('tr'), cell = document.createElement('td'); cell.colSpan = 4; cell.className = 'pd-empty'; cell.textContent = 'No matches. Try another search, position, or board filter.'; row.append(cell); body.append(row); }
    q('#pd-result-count').textContent = `${rows.length.toLocaleString()} matching players`;
    q('#pd-page').textContent = `${rows.length ? page * pageSize + 1 : 0}–${Math.min((page + 1) * pageSize, rows.length)} of ${rows.length}`;
    q('#pd-prev').disabled = page === 0; q('#pd-next').disabled = (page + 1) * pageSize >= rows.length;
  }
  function refilter() {
    page = 0; renderBoard();
    if (!rows.some(p => p.id === selected)) selected = rows[0]?.id || null;
    renderSelection(); react(boardPicks().includes(selected) ? 'picked' : 'confident', false);
  }
  q('#pd-search').addEventListener('input', refilter);
  for (const selector of ['#pd-position', '#pd-scope', '#pd-sort', '#pd-rostered']) q(selector).addEventListener('change', refilter);
  for (const [selector, delta] of [['#pd-prev', -1], ['#pd-next', 1]]) q(selector).addEventListener('click', () => {
    page += delta; renderBoard(); selected = rows[page * pageSize]?.id || null; renderSelection(); react(boardPicks().includes(selected) ? 'picked' : 'confident', false); announce(q('#pd-page').textContent + ' players.');
  });
  q('#pd-draft').addEventListener('click', () => {
    if (!selected || inLeague()) return;
    const removing = picks.includes(selected);
    picks = removing ? picks.filter(id => id !== selected) : [...picks, selected];
    save(); renderBoard(); renderSelection(); react(removing ? 'confident' : 'picked');
    announce(`${byId.get(selected).name} ${removing ? 'returned to board' : 'marked picked'}. ${picks.length} local picks.`);
  });
  q('#pd-undo').addEventListener('click', () => {
    if (!picks.length || inLeague()) return;
    selected = picks.pop(); save(); renderBoard(); renderSelection(); react('confident'); announce(`${byId.get(selected).name} returned to board.`);
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      picks = restorePicks(event.newValue, allowed);
      if (!inLeague()) { renderBoard(); renderSelection(); react(picks.includes(selected) ? 'picked' : 'confident', false); announce('Local picks updated from another tab.'); }
    }
  });
  function syncMotion() {
    motion.disabled = reduced.matches;
    if (reduced.matches) motion.checked = false;
    root.dataset.motion = motion.checked ? 'on' : 'off';
    scene.setMotion(motion.checked);
    intro.setMotion(motion.checked);
    if (!motion.checked) { stopAnimation(); scene.react(currentMood); }
  }
  motion.addEventListener('change', syncMotion); reduced.addEventListener('change', syncMotion);
  for (let i = 0; i < 24; i++) { const bit = document.createElement('i'); bit.style.setProperty('--x', `${9 + (i * 37) % 85}%`); bit.style.setProperty('--delay', `${(i % 6) * .08}s`); bit.style.setProperty('--drift', `${(i % 2 ? 1 : -1) * (8 + i % 5 * 4)}px`); q('.pd-confetti').append(bit); }
  q('#pd-catalog-count').textContent = players.length.toLocaleString();
  q('#pd-history-year').textContent = data.history_season;
  q('#pd-points-label').textContent = `${data.history_season} PPR points`;
  q('#pd-bye-label').textContent = `${data.season} bye week`;
  q('#pd-history-heading').textContent = `${data.history_season} REGULAR SEASON`;
  const ageDays = (Date.now() - Date.parse(data.observed_at)) / 86400000;
  const stale = !Number.isFinite(ageDays) || ageDays > 8 || ageDays < -.1;
  q('#pd-data-status').textContent = stale ? 'STALE SNAPSHOT · RECHECK SOURCES' : data.health === 'ok' ? 'PUBLIC DATA · NOT LIVE' : 'DEGRADED SNAPSHOT · CHECK COVERAGE';
  q('#pd-observed').textContent = `Collected ${new Date(data.observed_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} · scheduled weekly`;
  const names = { sleeper_players: 'Player catalog', nflverse_prior_stats: `${data.history_season} statistics`, nflverse_current_stats: `${data.season} statistics`, nflverse_schedule: `${data.season} schedule` };
  for (const [key, label] of Object.entries(names)) {
    const source = data.sources[key], li = document.createElement('li'), link = document.createElement('a');
    link.textContent = label;
    try { const url = new URL(source?.url); if (url.protocol === 'https:' && ['api.sleeper.app', 'github.com'].includes(url.hostname)) link.href = url.href; } catch { /* Missing provenance stays visible without a link. */ }
    li.append(link, document.createTextNode(` · ${(source?.status || 'unavailable').replaceAll('_', ' ')}`)); q('#pd-sources').append(li);
  }
  localStatus(); syncMotion(); refilter();
  const tableGuide = q('#pd-table-guide').textContent;
  const leagueView = createLeagueView({ root: q('#pd-league'), sessionRoot: q('#pd-session'), players,
    onConnect: input => league.connect(input), onDisconnect: () => league.disconnect(),
    onRefresh: () => league.refresh(), onWeekChange: week => league.changeWeek(Number(week)),
    onHoverPlayer: id => scene.hover(id),
    onSelectPlayer: id => {
      if (!byId.has(id)) return;
      selected = id; renderSelection(); react(boardPicks().includes(id) ? 'picked' : 'confident', false);
      announce(`${byId.get(id).name} selected in the player dossier.`);
    },
  });
  const league = createLeagueController({ onChange: state => {
    const previous = leagueState, wasConnected = inLeague(), oldPicks = boardPicks();
    leagueState = state; leagueView.update(state);
    root.dataset.league = inLeague() ? 'connected' : 'disconnected';
    const changed = wasConnected !== inLeague() || oldPicks.join(',') !== boardPicks().join(',');
    const nextDraft = state.snapshot?.draft, previousDraft = previous.snapshot?.draft;
    const previousPicks = new Set(previousDraft?.picks.map(pick => `${pick.pickNo}:${pick.playerId}`));
    const newPick = nextDraft && previousDraft && nextDraft.id === previousDraft.id && !state.snapshot.draftStale
      ? nextDraft.picks.filter(pick => !previousPicks.has(`${pick.pickNo}:${pick.playerId}`)).at(-1) : null;
    const newCatalogPick = newPick && byId.has(newPick.playerId);
    if (newCatalogPick) selected = newPick.playerId;
    q('#pd-picks-label').textContent = inLeague() ? 'Sleeper draft picks' : 'Marked picked';
    q('#pd-picks-origin').textContent = inLeague() ? 'read-only session' : 'on this browser';
    q('#pd-scope option[value="unmarked"]').textContent = inLeague() ? 'No fetched pick' : 'Unmarked';
    q('#pd-table-guide').textContent = inLeague()
      ? 'Picked means present in the fetched draft, not current roster or waiver availability. Keepers, trades and missing picks may differ. Historical PPR is not your league scoring or a forecast.' : tableGuide;
    localStatus();
    if (changed) renderBoard();
    renderSelection(); react(boardPicks().includes(selected) ? 'picked' : 'confident', Boolean(newCatalogPick));
    if (newCatalogPick) announce(`${byId.get(newPick.playerId).name} was picked in Sleeper.`);
  } });
  leagueView.update(leagueState);
  window.addEventListener('pagehide', event => {
    league.disconnect(); stopAnimation(); scene.setMotion(false); intro.setMotion(false);
    if (!event.persisted) { scene.destroy(); intro.destroy(); }
  });
  window.addEventListener('pageshow', event => { if (event.persisted) syncMotion(); });
  root.setAttribute('aria-busy', 'false'); root.dataset.ready = 'true';
}

start().catch(() => {
  root.setAttribute('aria-busy', 'false'); root.dataset.ready = 'error';
  q('#pd-data-status').textContent = 'DATA UNAVAILABLE';
  q('#pd-observed').textContent = 'The published files could not be loaded. Reload to retry, or use the knowledge repository below.';
  q('#pd-player-title').textContent = 'Unable to load player evidence';
  q('.pd-actor').hidden = true; q('#pd-bubble').hidden = true;
  announce('Player evidence unavailable. No fictional data has been substituted.');
});
