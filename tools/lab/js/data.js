/**
 * data.js — unified lab data loader
 *
 * Loads all data sources in parallel and builds unified indexes for search
 * and map rendering:
 *
 *   room.json        → room geometry for SVG map
 *   benches.json     → bench surface equipment
 *   equipment.json   → major equipment markers
 *   trainings.json   → training/SOP references
 *   storage.json     → named storage units (backing definition)
 *   locations.tsv    → reagents/enzymes/equipment locations (zone/storage_unit/sublocation)
 *   consumables.tsv  → consumable stock at bench/storage locations
 *   chemicals.tsv    → chemical inventory (zone/storage_unit/sublocation + hazard info)
 */

// ── Utilities ────────────────────────────────────────────────────────────────

// Strip outer quotes and unescape "" → " (RFC 4180 quoting within TSV cells)
function unquote(cell) {
  const c = String(cell).trim();
  if (c.length >= 2 && c[0] === '"' && c[c.length - 1] === '"') {
    return c.slice(1, -1).replace(/""/g, '"');
  }
  return c;
}

async function loadText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.text();
}

async function loadJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  const txt = (await res.text()).trim();
  if (!txt || txt.startsWith('<')) return null;
  return JSON.parse(txt);
}

// ── Locations TSV parser ──────────────────────────────────────────────────────
// Schema: name, category, role, synonyms, zone, storage_unit, sublocation,
//         label, concentration, notes, training_link

const LOC_COLS = [
  'name', 'category', 'role', 'synonyms',
  'zone', 'storage_unit', 'sublocation',
  'label', 'notes', 'training_link'
];

function parseLocationsTSV(text) {
  const lines = text.split('\n').map(l => l.trimEnd());
  if (lines.length < 2) return [];
  const headers = lines[0].split('\t').map(h => unquote(h).toLowerCase());
  const ci = {};
  LOC_COLS.forEach(c => { const i = headers.indexOf(c); if (i !== -1) ci[c] = i; });

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cells = lines[i].split('\t').map(unquote);
    const get = c => (ci[c] !== undefined ? (cells[ci[c]] || '') : '');
    const row = {};
    LOC_COLS.forEach(c => row[c] = get(c));
    if (!row.name) continue;

    // Auto-derive image paths from location slugs
    const z = row.zone, su = row.storage_unit, sl = row.sublocation;
    row.img_room      = z           ? `${z}/${z}.png`               : '';
    row.img_container = z && su     ? `${z}/${su}/${su}.png`         : '';
    row.img_contents  = z && su && sl ? `${z}/${su}/${sl}.png`       : '';
    rows.push(row);
  }
  return rows;
}

// ── Chemicals TSV parser ──────────────────────────────────────────────────────
// Schema: name, cas, formula, physical_state, hazard_codes, size, amount, unit,
//         container_type, concentration, concentration_units,
//         zone, storage_unit, sublocation, synonyms, notes

const CHEM_COLS = [
  'name', 'cas', 'formula', 'physical_state', 'hazard_codes',
  'size', 'amount', 'unit', 'container_type',
  'concentration', 'concentration_units',
  'zone', 'storage_unit', 'sublocation',
  'synonyms', 'notes'
];

function parseChemicalsTSV(text) {
  const lines = text.split('\n').map(l => l.trimEnd());
  if (lines.length < 2) return [];
  const headers = lines[0].split('\t').map(h => unquote(h).toLowerCase());
  const ci = {};
  CHEM_COLS.forEach(c => { const i = headers.indexOf(c); if (i !== -1) ci[c] = i; });

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cells = lines[i].split('\t').map(unquote);
    const get = c => (ci[c] !== undefined ? (cells[ci[c]] || '') : '');
    const row = {};
    CHEM_COLS.forEach(c => row[c] = get(c));
    if (!row.name) continue;

    // Auto-derive image paths
    const z = row.zone, su = row.storage_unit, sl = row.sublocation;
    row.img_room      = z           ? `${z}/${z}.png`               : '';
    row.img_container = z && su     ? `${z}/${su}/${su}.png`         : '';
    row.img_contents  = z && su && sl ? `${z}/${su}/${sl}.png`       : '';

    // Merge CAS, formula, and pipe-separated synonyms into a single synonym list
    const syns = new Set();
    if (row.cas)     syns.add(row.cas.toLowerCase());
    if (row.formula) syns.add(row.formula.toLowerCase());
    if (row.synonyms) row.synonyms.split('|').map(s => s.trim().toLowerCase()).filter(Boolean).forEach(s => syns.add(s));
    row._synonymSet = syns;

    rows.push(row);
  }
  return rows;
}

// ── Consumables TSV parser ────────────────────────────────────────────────────
// Schema: zone, storage_unit, sublocation, items, target, threshold,
//         protocol_path, vendor_url, campus_source, campus_url, preferred_acquire

function parseConsumablesTSV(text) {
  const lines = text.split('\n').map(l => l.trimEnd()).filter(l => l.trim());
  if (!lines.length) return { map: {}, items: [] };
  const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
  const idx = n => headers.indexOf(n);

  // Accept both old and new column names for compatibility
  const zoneI   = idx('zone')         !== -1 ? idx('zone')         : idx('loc1');
  const suI     = idx('storage_unit') !== -1 ? idx('storage_unit') : idx('loc2');
  const slI     = idx('sublocation')  !== -1 ? idx('sublocation')  : idx('loc3');
  const itemI   = idx('items');
  const targetI = idx('target');
  const threshI = idx('threshold');
  const protI   = idx('protocol_path');
  const vendorI = idx('vendor_url');
  const campusSrcI = idx('campus_source');
  const campusUrlI = idx('campus_url');
  const prefI   = idx('preferred_acquire');

  const map = {};
  const items = new Set();
  const get = (cols, i) => (i !== -1 ? (cols[i] || '').trim() : '');
  const num = v => (v === '' ? undefined : (parseFloat(v) || undefined));

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const zone = get(cols, zoneI);
    const su   = get(cols, suI);
    const sl   = get(cols, slI);
    const item = get(cols, itemI);
    if (!zone) continue;
    const key = `${zone}:${su}:${sl}`;
    const entry = map[key] || (map[key] = { zone, storage_unit: su, sublocation: sl, items: [] });
    if (item) { entry.items.push(item); items.add(item); }
    entry.target          = num(get(cols, targetI));
    entry.threshold       = num(get(cols, threshI));
    entry.protocol_path   = get(cols, protI)   || undefined;
    entry.vendor_url      = get(cols, vendorI) || undefined;
    entry.campus_source   = get(cols, campusSrcI) || undefined;
    entry.campus_url      = get(cols, campusUrlI) || undefined;
    entry.preferred_acquire = get(cols, prefI) || undefined;
  }

  return { map, items: Array.from(items).sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'})) };
}

// ── groupByName — shared by locations + chemicals ────────────────────────────

function groupByName(rows, categoryDefault) {
  const itemMap = new Map();

  for (const row of rows) {
    const key = row.name.toLowerCase();
    if (!itemMap.has(key)) {
      itemMap.set(key, {
        name:       row.name,
        category:   row.category || categoryDefault || '',
        synonymSet: new Set(),
        locations:  []
      });
    }
    const item = itemMap.get(key);

    // Collect synonyms
    const syns = row._synonymSet || new Set();
    if (row.synonyms && !row._synonymSet) {
      row.synonyms.split('|').map(s=>s.trim().toLowerCase()).filter(Boolean).forEach(s=>syns.add(s));
    }
    syns.forEach(s => item.synonymSet.add(s));

    // Build location object
    const loc = {
      role:          row.role          || '',
      zone:          row.zone          || '',
      storage_unit:  row.storage_unit  || '',
      sublocation:   row.sublocation   || '',
      img_room:      row.img_room      || '',
      img_container: row.img_container || '',
      img_contents:  row.img_contents  || '',
      label:         row.label         || '',
      concentration: row.concentration || '',
      notes:         row.notes         || ''
    };

    // Chemical-specific fields
    if (row.hazard_codes)        loc.hazard_codes        = row.hazard_codes;
    if (row.cas)                 loc.cas                 = row.cas;
    if (row.formula)             loc.formula             = row.formula;
    if (row.physical_state)      loc.physical_state      = row.physical_state;
    if (row.container_type)      loc.container_type      = row.container_type;
    if (row.amount)              loc.amount              = row.amount;
    if (row.unit)                loc.unit                = row.unit;
    if (row.concentration_units) loc.concentration_units = row.concentration_units;

    item.locations.push(loc);
  }

  for (const item of itemMap.values()) {
    item.synonymList = Array.from(item.synonymSet);
    delete item.synonymSet;
  }

  return itemMap;
}

// ── Search index ──────────────────────────────────────────────────────────────

function buildSearchIndex(itemMap) {
  const allTerms = [];
  for (const [key, item] of itemMap) {
    allTerms.push({ term: key, item });
    for (const syn of item.synonymList) {
      allTerms.push({ term: syn, item });
    }
  }
  return allTerms;
}

// ── N-gram index for consumables ──────────────────────────────────────────────

function buildConsumablesIndex(consumables) {
  const ITEM_TO_KEYS = new Map();
  const INDEX = new Map();

  function tokenize(str) {
    const w = String(str).toLowerCase().split(/[^a-z0-9µ]+/).filter(Boolean);
    const ng = new Set(w);
    for (let i=0;i<w.length-1;i++) ng.add(w[i]+' '+w[i+1]);
    for (let i=0;i<w.length-2;i++) ng.add(w[i]+' '+w[i+1]+' '+w[i+2]);
    return Array.from(ng);
  }

  for (const [key, entry] of Object.entries(consumables.map || {})) {
    for (const it of (entry.items || [])) {
      const low = it.toLowerCase();
      const arr = ITEM_TO_KEYS.get(low) || [];
      arr.push(key);
      ITEM_TO_KEYS.set(low, arr);

      for (const tok of tokenize(it)) {
        let set = INDEX.get(tok);
        if (!set) { set = new Set(); INDEX.set(tok, set); }
        set.add(key);
      }
    }
  }

  return { ITEM_TO_KEYS, INDEX };
}

// ── Storage lookup (zone from storage_unit slug) ──────────────────────────────

function buildStorageIndex(storageJSON) {
  const index = new Map(); // slug → storage_unit object
  for (const unit of (storageJSON?.storage_units || [])) {
    index.set(unit.slug, unit);
  }
  return index;
}

// ── Main loader ───────────────────────────────────────────────────────────────

export async function loadAll(paths) {
  const [
    room, benches, equipment, trainings, storageJSON,
    locText, chemText, consText
  ] = await Promise.all([
    loadJSON(paths.room).catch(()     => null),
    loadJSON(paths.benches).catch(()  => null),
    loadJSON(paths.equipment).catch(()=> []),
    loadJSON(paths.trainings).catch(()=> []),
    loadJSON(paths.storage).catch(()  => null),
    loadText(paths.locations).catch(()=> ''),
    loadText(paths.chemicals).catch(()=> ''),
    loadText(paths.consumables).catch(()=> '')
  ]);

  // Parse sources
  const locRows  = locText  ? parseLocationsTSV(locText)  : [];
  const chemRows = chemText ? parseChemicalsTSV(chemText) : [];
  const consumables = consText ? parseConsumablesTSV(consText) : { map:{}, items:[] };

  // Group items by name (locations + chemicals merged)
  const locMap  = groupByName(locRows,  '');
  const chemMap = groupByName(chemRows, 'chemical');

  // Merge into single itemMap (locations take precedence if same name)
  const itemMap = new Map([...chemMap, ...locMap]);

  // Build indexes
  const allTerms        = buildSearchIndex(itemMap);
  const storageIndex    = buildStorageIndex(storageJSON);
  const { ITEM_TO_KEYS, INDEX } = buildConsumablesIndex(consumables);

  // Autocomplete: item names + synonyms + CAS numbers + consumable items
  const autocompleteSet = new Set();
  for (const item of itemMap.values()) {
    autocompleteSet.add(item.name);
    item.synonymList.forEach(s => autocompleteSet.add(s));
  }
  consumables.items.forEach(s => autocompleteSet.add(s));
  const autocompleteList = Array.from(autocompleteSet)
    .sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'}));

  return {
    room,
    benches,
    equipment: equipment || [],
    trainings: trainings || [],
    storageJSON,
    storageIndex,
    consumables,
    itemMap,
    allTerms,
    ITEM_TO_KEYS,
    INDEX,
    autocompleteList,
    imgBase: paths.imgBase || ''
  };
}
