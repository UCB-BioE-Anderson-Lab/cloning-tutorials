// data.js — load and parse locations.tsv, group by name, build search index
//
// Image convention: images are named after location slugs, nested by hierarchy:
//   zone image:      {loc1}/{loc1}.png
//   equipment image: {loc1}/{loc2}/{loc2}.png
//   container image: {loc1}/{loc2}/{loc3}.png

const ALL_COLUMNS = [
  'name', 'category', 'role', 'synonyms',
  'zone', 'storage_unit', 'sublocation',
  'label', 'notes', 'training_link'
];

async function loadText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.text();
}

// Strip outer quotes and unescape "" → " (RFC 4180 quoting within TSV cells)
function unquote(cell) {
  const c = cell.trim();
  if (c.length >= 2 && c[0] === '"' && c[c.length - 1] === '"') {
    return c.slice(1, -1).replace(/""/g, '"');
  }
  return c;
}

function parseTSV(text) {
  const lines = text.split('\n').map(l => l.trimEnd());
  if (lines.length < 2) return [];

  const headers = lines[0].split('\t').map(h => unquote(h).toLowerCase());
  const colIndex = {};
  ALL_COLUMNS.forEach(col => {
    const idx = headers.indexOf(col);
    if (idx !== -1) colIndex[col] = idx;
  });

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = line.split('\t').map(unquote);
    const row = {};
    ALL_COLUMNS.forEach(col => {
      const idx = colIndex[col];
      row[col] = idx !== undefined ? (cells[idx] || '') : '';
    });
    if (!row.name) continue;

    // Auto-derive image paths from location slugs
    const l1 = row.zone, l2 = row.storage_unit, l3 = row.sublocation;
    row.img_room      = l1             ? `${l1}/${l1}.png`         : '';
    row.img_container = l1 && l2       ? `${l1}/${l2}/${l2}.png`   : '';
    row.img_contents  = l1 && l2 && l3 ? `${l1}/${l2}/${l3}.png`   : '';

    rows.push(row);
  }
  return rows;
}

// Group flat rows into items, each with a locations[] array.
// Rows sharing the same (lowercased) name belong to the same item.
function groupByName(rows) {
  const itemMap = new Map(); // lowerName -> item

  for (const row of rows) {
    const key = row.name.toLowerCase();

    if (!itemMap.has(key)) {
      itemMap.set(key, {
        name:        row.name,
        category:    row.category,
        synonymSet:  new Set(),
        locations:   []
      });
    }

    const item = itemMap.get(key);

    // Merge synonyms from every row (a Set deduplicates automatically)
    if (row.synonyms) {
      row.synonyms.split('|').map(s => s.trim()).filter(Boolean)
        .forEach(s => item.synonymSet.add(s.toLowerCase()));
    }

    // Each row contributes one location descriptor
    item.locations.push({
      role:          row.role,
      loc1:          row.zone,
      loc2:          row.storage_unit,
      loc3:          row.sublocation,
      img_room:      row.img_room,
      img_container: row.img_container,
      img_contents:  row.img_contents,
      label:         row.label,
      notes:         row.notes,
      training_link: row.training_link
    });
  }

  // Convert synonymSet -> synonymList array on each item
  for (const item of itemMap.values()) {
    item.synonymList = Array.from(item.synonymSet);
    delete item.synonymSet;
  }

  return itemMap;
}

function buildIndex(itemMap) {
  const nameIndex = new Map();
  const allTerms  = [];

  for (const [key, item] of itemMap) {
    nameIndex.set(key, item);
    allTerms.push({ term: key, item });

    for (const syn of item.synonymList) {
      allTerms.push({ term: syn, item });
    }
  }

  return { nameIndex, allTerms };
}

export async function loadItems(url) {
  const text    = await loadText(url);
  const rows    = parseTSV(text);
  const itemMap = groupByName(rows);
  const { nameIndex, allTerms } = buildIndex(itemMap);
  const items = Array.from(itemMap.values());
  return { items, nameIndex, allTerms };
}
