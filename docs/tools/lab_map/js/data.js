// DEBUG logging is intentionally simple console.log so it's always visible

async function loadText(url) {
  console.log('[data] loadText url =', url);
  const res = await fetch(url, { cache: 'no-store' });
  console.log('[data] loadText ok?', res.ok, 'status =', res.status);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
  const t = await res.text();
  console.log('[data] loadText length =', t ? t.length : 0);
  return t;
}

async function loadJSON(url) {
  console.log('[data] loadJSON url =', url);
  const res = await fetch(url, { cache: 'no-store' });
  console.log('[data] loadJSON ok?', res.ok, 'status =', res.status);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
  const txt = (await res.text()) || '';
  const t = txt.trim();
  console.log('[data] loadJSON text length =', t.length);
  if (!t || t.startsWith('<')) { console.log('[data] loadJSON empty or HTML, returning null'); return null; }
  try { return JSON.parse(t); } catch (e) { console.log('[data] loadJSON parse error =', e.message); throw new Error(`Invalid JSON in ${url}: ${e.message}`); }
}

function parseConsumablesTSV(text) {
  console.log('[data] TSV raw length =', (text ? String(text).length : 0));
  const lines = String(text || '').replace(/\r/g, '').split('\n').filter(l => l.trim().length);
  console.log('[data] TSV line count =', lines.length);
  if (lines[0]) console.log('[data] TSV header =', lines[0]);
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

  console.log('[data] TSV idx bench,stack,drawer,items,target,threshold,vendor =', loc1I, loc2I, loc3I, itemI, targetI, threshI, vendorI);

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
  console.log('[data] TSV parsed keys =', Object.keys(map).length, 'unique items =', items.size);
  return { map, items: Array.from(items).sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'})) };
}

export async function loadAll(paths) {
  console.log('[data] loadAll paths =', paths);
  const [room, benches, consRaw, equipment, trainings] = await Promise.all([
    loadJSON(paths.room).catch((e) => { console.log('[data] room load error =', e?.message); return null; }),
    loadJSON(paths.benches).catch((e) => { console.log('[data] benches load error =', e?.message); return null; }),
    loadText(paths.consumables).catch((e) => { console.log('[data] consumables load error =', e?.message); return ''; }),
    loadJSON(paths.equipment).catch((e) => { console.log('[data] equipment load error =', e?.message); return []; }),
    loadJSON(paths.trainings).catch((e) => { console.log('[data] trainings load error =', e?.message); return []; })
  ]);

  console.log('[data] consRaw present?', !!consRaw, 'length =', consRaw ? consRaw.length : 0);
  const consumables = consRaw ? parseConsumablesTSV(consRaw) : { map: {}, items: [] };
  console.log('[data] consumables.map keys =', Object.keys(consumables.map || {}).length, 'items =', (consumables.items || []).length);

  const ITEM_TO_KEYS = {};
  for (const [key, entry] of Object.entries(consumables.map || {})) {
    for (const it of (entry.items || [])) {
      const low = it.toLowerCase();
      (ITEM_TO_KEYS[low] ||= []).push(key);
    }
  }
  console.log('[data] ITEM_TO_KEYS unique items =', Object.keys(ITEM_TO_KEYS).length);

  const result = { room, benches, consumables, equipment: equipment || [], trainings: trainings || [], ITEM_TO_KEYS };
  console.log('[data] loadAll result summary: room?', !!room, 'benches?', !!benches, 'equipment count =', (result.equipment||[]).length, 'trainings count =', (result.trainings||[]).length);
  return result;
}
