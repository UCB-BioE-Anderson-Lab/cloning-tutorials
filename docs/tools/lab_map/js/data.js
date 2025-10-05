// Robust loaders + TSV parser

async function loadText(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
  return await res.text();
}

async function loadJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
  const txt = (await res.text()) || '';
  const t = txt.trim();
  // Treat empty or HTML as "no data" rather than crashing
  if (!t || t.startsWith('<')) return null;
  try { return JSON.parse(t); } catch (e) { throw new Error(`Invalid JSON in ${url}: ${e.message}`); }
}

function parseConsumablesTSV(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n').filter(l => l.trim().length);
  if (!lines.length) return { map: {}, items: [] };
  const header = lines[0].split('\t').map(h => h.trim().toLowerCase());
  const idx = (name) => header.indexOf(name);
  const loc1I = idx('loc1') !== -1 ? idx('loc1') : idx('bench');
  const loc2I = idx('loc2') !== -1 ? idx('loc2') : idx('stack');
  const loc3I = idx('loc3') !== -1 ? idx('loc3') : idx('drawer');
  const itemI = idx('items') !== -1 ? idx('items') : idx('item');
  const targetI = idx('target');
  const threshI = idx('threshold');
  const protI = idx('protocol_path');
  const vendorI = idx('vendor_url') !== -1 ? idx('vendor_url') : idx('special_order');
  const campusSrcI = idx('campus_source');
  const campusUrlI = idx('campus_url');
  const prefI = idx('preferred_acquire');

  const map = {};
  const items = new Set();
  const get = (cols, i) => (i !== -1 ? (cols[i] || '').trim() : '');
  const num = (v) => (v === '' ? undefined : (parseFloat(v) || undefined));

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const loc1 = get(cols, loc1I);
    const loc2 = get(cols, loc2I);
    const loc3 = get(cols, loc3I);
    const item = get(cols, itemI);
    if (!loc1) continue;
    const key = `${loc1}:${loc2}:${loc3}`;
    const entry = map[key] || (map[key] = { items: [] });
    if (item) { entry.items.push(item); items.add(item); }
    entry.target = num(get(cols, targetI));
    entry.threshold = num(get(cols, threshI));
    entry.protocol_path = get(cols, protI) || undefined;
    entry.vendor_url = get(cols, vendorI) || undefined;
    entry.campus_source = get(cols, campusSrcI) || undefined;
    entry.campus_url = get(cols, campusUrlI) || undefined;
    entry.preferred_acquire = get(cols, prefI) || undefined;
  }
  return { map, items: Array.from(items).sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'})) };
}

export async function loadAll(paths) {
  const [room, benches, consRaw, equipment, trainings] = await Promise.all([
    loadJSON(paths.room).catch(() => null),
    loadJSON(paths.benches).catch(() => null),
    loadText(paths.consumables).catch(() => ''),
    loadJSON(paths.equipment).catch(() => []),
    loadJSON(paths.trainings).catch(() => [])
  ]);

  const consumables = consRaw ? parseConsumablesTSV(consRaw) : { map: {}, items: [] };
  const ITEM_TO_KEYS = {};
  for (const [key, entry] of Object.entries(consumables.map)) {
    for (const it of (entry.items || [])) {
      const low = it.toLowerCase();
      (ITEM_TO_KEYS[low] ||= []).push(key);
    }
  }
  return { room, benches, consumables, equipment: equipment || [], trainings: trainings || [], ITEM_TO_KEYS };
}
