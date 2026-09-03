export function restorePicks(raw, allowed) {
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || !Array.isArray(value.picks)) return [];
    return [...new Set(value.picks.filter(id => typeof id === 'string' && allowed.has(id)))];
  } catch { return []; }
}

export function filterPlayers(players, picks, filters) {
  const search = filters.search.trim().toLocaleLowerCase();
  const rows = players.filter(p =>
    (!filters.position || p.position === filters.position) &&
    (!filters.rostered || p.team) &&
    (filters.scope === 'all' || picks.has(p.id) === (filters.scope === 'picked')) &&
    (!search || `${p.name} ${p.team || ''}`.toLocaleLowerCase().includes(search))
  );
  return rows.sort((a, b) => {
    const metric = filters.sort === 'per_game' ? 'ppr_per_game' : 'ppr';
    if (filters.sort !== 'name') {
      const av = a.history?.[metric], bv = b.history?.[metric];
      if (av == null && bv != null) return 1;
      if (av != null && bv == null) return -1;
      if (av != null && bv != null && av !== bv) return bv - av;
    }
    return a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
  });
}
