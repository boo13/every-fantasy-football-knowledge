let instance = 0;
const el = (tag, className = '', text = '') => {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
};
const text = (node, value) => { if (node.textContent !== String(value)) node.textContent = value; };
const number = (value, decimals = 0) => typeof value === 'number' && Number.isFinite(value)
  ? value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '—';
const team = id => Number.isInteger(id) && id > 0 ? `Team ${id}` : 'Team —';
const stateLabel = value => ({ pre_draft: 'Pre-draft', drafting: 'Draft in progress', in_season: 'In season', complete: 'Complete', paused: 'Paused' })[value] || 'Status unavailable';
const button = (label, className = 'll-button') => { const node = el('button', className, label); node.type = 'button'; return node; };

function reconciler(parent, create, paint) {
  const entries = new Map();
  return (rows, keyOf) => {
    const retained = new Set();
    rows.forEach((row, index) => {
      const key = keyOf(row, index);
      let entry = entries.get(key);
      if (!entry) { entry = create(row); entries.set(key, entry); }
      paint(entry, row, index);
      if (parent.children[index] !== entry.node) parent.insertBefore(entry.node, parent.children[index] || null);
      retained.add(key);
    });
    for (const [key, entry] of entries) if (!retained.has(key)) { entry.node.remove(); entries.delete(key); }
  };
}

export function createLeagueView({ root, sessionRoot = root, players, onConnect, onDisconnect, onRefresh, onWeekChange, onSelectPlayer, onHoverPlayer }) {
  const prefix = `ll-session-${++instance}`, catalog = new Map(players.map(player => [String(player.id), player]));
  const abort = new AbortController(), playerIds = new WeakMap(), listen = (node, event, callback) => node.addEventListener(event, callback, { signal: abort.signal });
  let current = { status: 'disconnected', snapshot: null }, selectedRoster = null, activeTab = 0, connectedBefore = false;
  let hoveredPlayer = null, focusedPlayer = null, hoverId = null, connectFromGate = false;
  function syncHover() {
    const id = playerIds.get(focusedPlayer || hoveredPlayer), next = catalog.has(id) ? id : null;
    if (next !== hoverId) { hoverId = next; onHoverPlayer?.(next); }
  }
  function clearHover() { hoveredPlayer = null; focusedPlayer = null; syncHover(); }
  root.classList.add('ll-room'); root.setAttribute('aria-labelledby', `${prefix}-title`);
  const title = el('h2', 'pd-sr', 'League room');
  title.id = `${prefix}-title`;
  const session = el('div', 'll-session');
  const signal = el('p', 'll-signal', 'Not connected'); signal.setAttribute('role', 'status'); signal.setAttribute('aria-live', 'polite');
  const gate = el('div', 'll-gate'), welcome = el('div', 'll-welcome');
  welcome.append(el('h3', '', 'CONNECT SLEEPER'), el('p', '', 'Bring your league table, matchups, rosters and draft picks onto the board.'));
  const form = el('form', 'll-connect'), label = el('label', '', 'Sleeper league URL or ID'), input = el('input');
  input.type = 'text'; input.id = `${prefix}-input`; input.autocomplete = 'off'; input.spellcheck = false; input.maxLength = 300;
  input.placeholder = 'Paste a Sleeper league link or ID'; input.required = true; label.htmlFor = input.id;
  const connect = button('CONNECT LEAGUE →', 'll-button ll-primary'); connect.type = 'submit';
  const privacy = el('p', 'll-fine', 'Private session: fetched directly from Sleeper, kept in memory, and cleared when you disconnect or close this page. Generic team labels only. No manager names or account access.');
  privacy.id = `${prefix}-privacy`; input.setAttribute('aria-describedby', privacy.id);
  form.append(label, input, connect, privacy); gate.append(welcome, form);
  const controls = el('div', 'll-session-controls'), sessionInfo = el('div', 'll-session-info'), fetched = el('p'), activity = el('p', 'll-fine');
  sessionInfo.append(fetched, activity);
  const refresh = button('Refresh'), disconnect = button('Disconnect'); controls.append(sessionInfo, refresh, disconnect);
  const error = el('p', 'll-error'); error.id = `${prefix}-error`; error.setAttribute('role', 'alert'); error.hidden = true;
  const content = el('div', 'll-content'), ribbon = el('div', 'll-ribbon'), metrics = [];
  for (const labelText of ['Season', 'Teams', 'Viewing week', 'Draft picks']) {
    const metric = el('div', 'll-metric'), value = el('strong', 'll-led', '—');
    metric.append(el('span', 'll-kicker', labelText), value); ribbon.append(metric); metrics.push(value);
  }
  const tabs = el('div', 'll-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'League views');
  const panels = [], tabButtons = [];
  ['League table', 'Matchups', 'Rosters', 'Draft'].forEach((name, index) => {
    const tab = button('', 'll-tab'), panel = el('section', 'll-panel');
    tab.append(el('span', 'll-tab-number', `0${index + 1}`), el('span', '', name));
    tab.id = `${prefix}-tab-${index}`; panel.id = `${prefix}-panel-${index}`;
    tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', tab.id); panel.tabIndex = 0;
    listen(tab, 'click', () => selectTab(index));
    listen(tab, 'keydown', event => {
      const next = { ArrowRight: (index + 1) % 4, ArrowLeft: (index + 3) % 4, Home: 0, End: 3 }[event.key];
      if (next !== undefined) { event.preventDefault(); selectTab(next); tabButtons[next].focus(); }
    });
    tabs.append(tab); tabButtons.push(tab); panels.push(panel);
  });
  function selectTab(index) {
    clearHover();
    activeTab = index;
    tabButtons.forEach((tab, position) => { tab.setAttribute('aria-selected', String(position === activeTab)); tab.tabIndex = position === activeTab ? 0 : -1; panels[position].hidden = position !== activeTab; });
  }
  function playerCell(cell, id) {
    if (!cell.playerButton) {
      const control = button('', 'll-player'), name = el('span'), meta = el('small'); control.append(name, meta);
      listen(control, 'pointerenter', () => { hoveredPlayer = control; syncHover(); });
      listen(control, 'pointerleave', () => { if (hoveredPlayer === control) hoveredPlayer = null; syncHover(); });
      listen(control, 'focus', () => { focusedPlayer = control; syncHover(); });
      listen(control, 'blur', () => { if (focusedPlayer === control) focusedPlayer = null; syncHover(); });
      cell.replaceChildren(control); cell.playerButton = control; cell.playerName = name; cell.playerMeta = meta;
    }
    cell.playerId = id == null ? '' : String(id);
    playerIds.set(cell.playerButton, cell.playerId);
    const player = catalog.get(cell.playerId), empty = cell.playerId === '0', unavailable = id == null;
    text(cell.playerName, player?.name || (empty ? 'Empty slot' : unavailable ? 'Player unavailable' : `Player ID ${cell.playerId.slice(0, 80)}`));
    text(cell.playerMeta, player ? `${player.position || '—'} · ${player.team || 'No NFL team supplied'}` : empty ? 'No player assigned' : unavailable ? 'Sleeper did not supply a player ID' : 'Not in the public catalog');
    cell.playerButton.disabled = !player;
  }
  function makeTable(headers, className, emptyText) {
    const shell = el('div', 'll-table-shell'), scroll = el('div', 'll-table-scroll'), table = el('table', className), caption = el('caption'), head = el('thead'), row = el('tr'), body = el('tbody'), empty = el('p', 'll-empty', emptyText);
    scroll.tabIndex = 0; scroll.setAttribute('role', 'region'); scroll.setAttribute('aria-label', `${headers.join(', ')} table; scroll horizontally if needed`);
    headers.forEach(name => { const cell = el('th', '', name); cell.scope = 'col'; row.append(cell); });
    head.append(row); table.append(caption, head, body); scroll.append(table); shell.append(scroll, empty);
    const reconcile = reconciler(body, () => {
      const node = el('tr'), cells = headers.map(() => el('td')); node.append(...cells); return { node, cells };
    }, (entry, values) => values.cells.forEach((value, index) => {
      const cell = entry.cells[index];
      if (value && typeof value === 'object') playerCell(cell, value.player);
      else { text(cell, value); cell.className = index > 1 ? 'll-numeric' : ''; }
    }));
    return { node: shell, caption, update(rows, description, message = emptyText) { text(caption, description); text(empty, message); scroll.hidden = !rows.length; empty.hidden = !!rows.length; reconcile(rows, rowData => rowData.key); } };
  }
  const tableHead = el('div', 'll-panel-head'), tableNote = el('p', 'll-fine');
  tableHead.append(el('h3', '', 'THE LEAGUE TABLE'), el('span', 'll-stamp', 'RECORD ORDER'));
  const standingsTable = makeTable(['Order', 'Team', 'W–L–T', 'Points for', 'Points against'], 'll-standings', 'No standings were supplied by Sleeper.');
  panels[0].append(tableHead, tableNote, standingsTable.node);
  const matchupHead = el('div', 'll-panel-head'), weekLabel = el('label', 'll-select-label', 'Week'), week = el('select');
  week.setAttribute('aria-label', 'Matchup week');
  for (let value = 1; value <= 18; value++) { const option = el('option', '', `Week ${value}`); option.value = String(value); week.append(option); }
  weekLabel.append(week); matchupHead.append(el('h3', '', 'HEAD TO HEAD'), weekLabel);
  const matchupNote = el('p', 'll-fine'), matchList = el('div', 'll-matches'), matchEmpty = el('p', 'll-empty');
  panels[1].append(matchupHead, matchupNote, matchList, matchEmpty);
  const patchMatches = reconciler(matchList, () => {
    const node = el('article', 'll-match'), heading = el('h4', 'll-kicker'), teams = el('div'), note = el('p', 'll-match-note');
    node.append(heading, teams, note);
    const patchTeams = reconciler(teams, () => {
      const node = el('div', 'll-match-team'), name = el('span'), score = el('strong', 'll-led'); node.append(name, score); return { node, name, score };
    }, (entry, row) => { text(entry.name, team(row.rosterId)); text(entry.score, number(row.customPoints ?? row.points, 2)); });
    return { node, heading, note, patchTeams };
  }, (entry, match, index) => {
    text(entry.heading, match.teams.length === 1 ? 'UNPAIRED TEAM' : `MATCHUP ${String(index + 1).padStart(2, '0')}`);
    entry.patchTeams(match.teams, (row, position) => `${row.rosterId}-${position}`);
    text(entry.note, match.teams.some(row => row.customPoints != null) ? 'Includes a commissioner score override.' : 'Reported points · not a final-result indicator');
  });
  const rosterHead = el('div', 'll-panel-head'), rosterLabel = el('label', 'll-select-label', 'Team'), rosterSelect = el('select');
  rosterSelect.setAttribute('aria-label', 'Roster team'); rosterLabel.append(rosterSelect); rosterHead.append(el('h3', '', 'THE LOCKER ROOM'), rosterLabel);
  const rosterNote = el('p', 'll-fine'), rosterTable = makeTable(['Assignment', 'Player / NFL team'], 'll-roster-table', 'No players rostered. Picks will appear here when Sleeper records them.');
  panels[2].append(rosterHead, rosterNote, rosterTable.node, el('p', 'll-fine ll-source-note', 'Player names and NFL teams come from the public catalog by exact Sleeper ID. Catalog details may lag.'));
  const patchRosterOptions = reconciler(rosterSelect, () => ({ node: el('option') }), (entry, roster) => { entry.node.value = String(roster.id); text(entry.node, team(roster.id)); });
  const draftHead = el('div', 'll-panel-head'), draftState = el('span', 'll-stamp'); draftHead.append(el('h3', '', 'ON THE CLOCK'), draftState);
  const draftNote = el('p', 'll-fine'), draftBody = el('div', 'll-draft-body'), draftProgress = el('div', 'll-draft-progress'), progressLabel = el('p'), progress = el('progress');
  progress.setAttribute('aria-label', 'Recorded draft picks'); draftProgress.append(progressLabel, progress);
  const draftColumns = el('div', 'll-draft-columns'), slotsTable = makeTable(['Slot', 'Team'], 'll-slot-table', 'Draft slots have not been supplied.'), picksTable = makeTable(['Pick', 'Round', 'Team', 'Player / NFL team'], 'll-picks-table', 'No picks recorded. The draft board is waiting for the first selection.');
  draftColumns.append(slotsTable.node, picksTable.node); draftBody.append(draftProgress, draftColumns); panels[3].append(draftHead, draftNote, draftBody);
  const rules = el('details', 'll-rules'), rulesSummary = el('summary', '', 'LEAGUE RULES / ACTUAL SETTINGS'), rulesInner = el('div', 'll-rules-inner'), scoringSummary = el('p'), slotsSummary = el('p'), scoringGrid = el('dl', 'll-scoring');
  rulesInner.append(scoringSummary, slotsSummary, scoringGrid); rules.append(rulesSummary, rulesInner);
  const patchScoring = reconciler(scoringGrid, () => { const node = el('div'), term = el('dt'), value = el('dd'); node.append(term, value); return { node, term, value }; }, (entry, [key, value]) => { text(entry.term, key); text(entry.value, number(value, 2)); });
  const warnings = el('ul', 'll-warnings');
  const patchWarnings = reconciler(warnings, () => ({ node: el('li') }), (entry, value) => text(entry.node, value));
  content.append(ribbon, tabs, warnings, ...panels, rules);
  root.append(title, gate, error, content);
  session.append(signal, controls); sessionRoot.append(session);
  listen(form, 'submit', event => { event.preventDefault(); if (input.value.trim()) onConnect(input.value.trim()); });
  listen(refresh, 'click', () => onRefresh()); listen(disconnect, 'click', () => { input.value = ''; clearHover(); onDisconnect(); if (!current.snapshot) input.focus(); });
  listen(root, 'click', event => { const id = playerIds.get(event.target.closest('button.ll-player')); if (catalog.has(id)) onSelectPlayer?.(id); });
  listen(week, 'change', () => onWeekChange(Number(week.value)));
  listen(rosterSelect, 'change', () => { clearHover(); selectedRoster = Number(rosterSelect.value); renderRoster(); });
  function renderRoster() {
    const snapshot = current.snapshot, roster = snapshot?.rosters.find(value => value.id === selectedRoster), rows = [];
    const starters = roster?.starters, reserve = roster?.reserve, all = roster?.players;
    const positions = (snapshot?.league.rosterPositions ?? []).filter(position => !['BN', 'IR', 'TAXI'].includes(position));
    if (Array.isArray(starters)) starters.forEach((id, index) => rows.push({ key: `starter-${index}`, cells: [`Starter · ${positions[index] || 'slot'}`, { player: id }] }));
    if (Array.isArray(reserve)) reserve.forEach((id, index) => rows.push({ key: `reserve-${index}`, cells: ['Reserve', { player: id }] }));
    const assigned = new Set([...(starters ?? []), ...(reserve ?? [])].map(String));
    if (Array.isArray(all)) all.filter(id => !assigned.has(String(id))).forEach((id, index) => rows.push({ key: `bench-${index}`, cells: [starters == null || reserve == null ? 'Role unavailable' : 'Other rostered', { player: id }] }));
    const gaps = [[all, 'Full roster'], [starters, 'Starters'], [reserve, 'Reserve list']].filter(([value]) => value == null).map(([, labelText]) => `${labelText} unavailable.`);
    text(rosterNote, roster ? `${team(roster.id)} · ${all == null ? 'Player count unavailable' : `${all.length} players listed`}${gaps.length ? ` · ${gaps.join(' ')}` : ''}` : 'No roster information supplied.');
    rosterTable.update(rows, roster ? `${team(roster.id)} assignments` : 'Roster assignments', all == null ? 'Roster data is unavailable. No empty roster has been assumed.' : rows.length ? '' : 'No players rostered. Picks will appear here when Sleeper records them.');
  }
  function renderSnapshot(snapshot) {
    const { league, rosters, standings, matchups, draft } = snapshot;
    [league.season || '—', number(league.totalRosters), number(snapshot.week), draft ? number(draft.picks.length) : '—'].forEach((value, index) => text(metrics[index], value));
    const played = standings.some(roster => [roster.wins, roster.losses, roster.ties].some(value => value > 0));
    const recordsKnown = standings.length > 0 && standings.every(roster => [roster.wins, roster.losses, roster.ties].every(value => typeof value === 'number' && Number.isFinite(value)));
    text(tableNote, `${stateLabel(league.status)} · ${played ? 'Sorted by recorded results.' : recordsKnown ? 'No games recorded. Teams are unranked until results arrive.' : 'Results unavailable. No rankings have been assumed.'} Not official playoff seeds.`);
    standingsTable.update(standings.map(roster => ({ key: roster.id, cells: [played ? number(roster.rank) : '—', team(roster.id), `${number(roster.wins)}–${number(roster.losses)}–${number(roster.ties)}`, number(roster.pointsFor, 2), number(roster.pointsAgainst, 2)] })), 'Record order, not official playoff seeds. PF and PA are reported season points.');
    text(matchupNote, `Fetched week ${number(snapshot.week)} · Scores can lag or be corrected. A zero does not establish that a game has started.`);
    patchMatches(matchups ?? [], (match, index) => `${match.id ?? 'unpaired'}-${index}`);
    matchEmpty.hidden = !!matchups?.length;
    text(matchEmpty, matchups == null ? 'Matchup data is unavailable. No scores have been assumed.' : 'No matchups supplied for this week. The schedule may not be set yet.');
    patchRosterOptions(rosters, roster => roster.id);
    if (!rosters.some(roster => roster.id === selectedRoster)) selectedRoster = rosters[0]?.id ?? null;
    rosterSelect.value = selectedRoster == null ? '' : String(selectedRoster); rosterSelect.disabled = !rosters.length; renderRoster();
    draftBody.hidden = !draft;
    text(draftState, draft ? stateLabel(draft.status) : 'UNAVAILABLE');
    text(draftNote, draft ? `${draft.type ? `${draft.type.replaceAll('_', ' ')} · ` : ''}${number(draft.rounds)} rounds · ${number(draft.teams)} teams. Recorded selections only, not a projected draft.` : 'Draft information is unavailable. No picks or order have been assumed.');
    if (draft) {
      const total = draft.rounds > 0 && draft.teams > 0 ? draft.rounds * draft.teams : null;
      text(progressLabel, `${number(draft.picks.length)}${total ? ` / ${number(total)}` : ''} PICKS RECORDED`);
      progress.hidden = !total; progress.max = total || 1; progress.value = Math.min(draft.picks.length, total || 1);
      slotsTable.update(Object.entries(draft.slots ?? {}).sort(([a], [b]) => Number(a) - Number(b)).map(([slot, rosterId]) => ({ key: slot, cells: [slot, team(rosterId)] })), 'Draft slots');
      picksTable.update([...draft.picks].sort((a, b) => (b.pickNo ?? -1) - (a.pickNo ?? -1)).slice(0, 20).map((pick, index) => ({ key: pick.pickNo ?? `unavailable-${index}`, cells: [number(pick.pickNo), number(pick.round), team(pick.rosterId), { player: pick.playerId }] })), 'The 20 most recent recorded picks');
    }
    const settings = Object.entries(league.scoringSettings ?? {}).sort(([a], [b]) => a.localeCompare(b));
    const scoringLabels = [['rec', 'Reception'], ['pass_td', 'Pass TD'], ['rush_td', 'Rush TD'], ['rec_td', 'Receiving TD']];
    text(scoringSummary, settings.length ? scoringLabels.map(([key, name]) => `${name}: ${number(league.scoringSettings[key], 2)}`).join(' · ') : 'Scoring settings unavailable. No scoring format has been assumed.');
    const slotCounts = new Map(); (league.rosterPositions ?? []).forEach(position => slotCounts.set(position, (slotCounts.get(position) || 0) + 1));
    text(slotsSummary, slotCounts.size ? `Roster slots: ${[...slotCounts].map(([position, count]) => `${position} × ${count}`).join(' · ')}` : 'Roster slots unavailable.');
    patchScoring(settings, ([key]) => key);
    patchWarnings(snapshot.warnings ?? [], (_, index) => index); warnings.hidden = !snapshot.warnings?.length;
  }
  function update(state) {
    const previousStatus = current.status;
    current = state;
    const connected = !!state.snapshot, busy = state.status === 'connecting' || state.status === 'refreshing';
    const activeElement = document.activeElement;
    if (state.status === 'connecting' && previousStatus !== 'connecting') connectFromGate = gate.contains(activeElement);
    const enterLeague = connected && !connectedBefore && (gate.contains(activeElement)
      || connectFromGate && activeElement === document.body);
    const returnToConnect = !connected && !busy && (content.contains(document.activeElement) || controls.contains(document.activeElement));
    gate.hidden = connected; content.hidden = !connected; controls.hidden = !connected && !busy && state.status !== 'error';
    input.disabled = busy; connect.disabled = busy; refresh.disabled = busy; refresh.hidden = !connected;
    text(connect, busy ? 'CONNECTING…' : 'CONNECT LEAGUE →'); text(disconnect, connected ? 'Disconnect' : 'Cancel');
    text(signal, connected ? state.status === 'error' ? 'Connection interrupted' : 'Connected · private session' : state.status === 'connecting' ? 'Connecting…' : 'Not connected');
    signal.dataset.connected = String(connected && state.status !== 'error');
    text(error, state.error || ''); error.hidden = !state.error;
    input.setAttribute('aria-invalid', String(!!state.error && !connected));
    input.setAttribute('aria-describedby', `${privacy.id}${state.error && !connected ? ` ${error.id}` : ''}`);
    if (connected && !connectedBefore || state.status === 'disconnected' && previousStatus !== 'disconnected') input.value = '';
    if (!connected && connectedBefore) {
      metrics.forEach(value => text(value, '—')); standingsTable.update([], ''); patchMatches([], () => ''); patchRosterOptions([], () => '');
      selectedRoster = null; rosterTable.update([], ''); slotsTable.update([], ''); picksTable.update([], ''); patchScoring([], () => ''); patchWarnings([], () => '');
      [tableNote, matchupNote, rosterNote, draftNote, draftState, progressLabel, scoringSummary, slotsSummary].forEach(node => text(node, '')); progress.max = 1; progress.value = 0; week.value = '1'; rosterSelect.value = ''; rules.open = false;
    }
    connectedBefore = connected;
    if (!connected && !busy) connectFromGate = false;
    if (!connected) {
      clearHover();
      text(fetched, busy ? 'Establishing a read-only connection…' : 'No league data loaded. Retry or disconnect.'); text(activity, 'No league information is saved.');
      if (returnToConnect) input.focus();
      return;
    }
    const date = new Date(state.snapshot.fetchedAt);
    text(fetched, Number.isFinite(date.getTime()) ? `Fetched ${date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' })}` : 'Fetch time unavailable');
    text(activity, state.status === 'refreshing' ? 'Refreshing… showing the last fetched data.' : state.paused ? 'Automatic refresh paused while this tab is hidden.' : state.status === 'error' ? 'Showing the last fetched data. Refresh to retry.' : 'Session only · source updates may lag.');
    week.disabled = false;
    if (!busy && Number.isInteger(state.snapshot.week) && state.snapshot.week >= 1 && state.snapshot.week <= 18) week.value = String(state.snapshot.week);
    renderSnapshot(state.snapshot);
    if (hoveredPlayer && !root.contains(hoveredPlayer)) hoveredPlayer = null;
    if (focusedPlayer && document.activeElement !== focusedPlayer) focusedPlayer = null;
    syncHover();
    if (enterLeague) tabButtons[activeTab].focus();
    connectFromGate = false;
  }
  selectTab(0); update(current);
  return { update, destroy() { clearHover(); update({ status: 'disconnected', snapshot: null }); abort.abort(); session.remove(); root.replaceChildren(); root.classList.remove('ll-room'); root.removeAttribute('aria-labelledby'); } };
}
