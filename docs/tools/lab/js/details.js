/**
 * details.js — render search results and item detail panel
 *
 * Detail layout per item:
 *   Item name + category badge
 *   For each location (one row per location):
 *     ┌─ role badge + breadcrumb ──────────────────────────────┐
 *     │ [zone img]  │  [storage_unit img]  │  [sublocation img] │
 *     ├────────────────────────────────────────────────────────┤
 *     │ notes / meta                                           │
 *     └────────────────────────────────────────────────────────┘
 * Multiple locations stack vertically → N locations = 3×N grid.
 */

import { on } from './bus.js';

// ── Category / role display maps ──────────────────────────────────────────────

const CATEGORY_LABELS = {
  enzyme:            'Enzyme',
  primer:            'Primer',
  buffer:            'Buffer',
  kit:               'Kit',
  equipment:         'Equipment',
  training:          'Training',
  biological:        'Biological',
  chemical:          'Chemical',
  labware:           'Labware',
  'bio-stock':       'Biological Stock',
  'consumable-backup': 'Consumable'
};

const CATEGORY_CSS = {
  enzyme:     'bio-stock',
  primer:     'bio-stock',
  buffer:     'bio-stock',
  biological: 'bio-stock',
  kit:        'bio-stock',
  equipment:  'equipment',
  training:   'training',
  chemical:   'training',
  labware:    'consumable-backup'
};

const ROLE_LABELS = {
  working:  'Working',
  backup:   'Backup',
  training: 'Training copy'
};

const IMG_CAPTIONS = ['Zone', 'Storage unit', 'Container'];

// ── DOM helpers ───────────────────────────────────────────────────────────────

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls)       e.className   = cls;
  if (text != null) e.textContent = text;
  return e;
}
function clear(node) { node.innerHTML = ''; }

// ── Image grid row (3 cells) ──────────────────────────────────────────────────

function renderImageGrid(loc, imgBase) {
  const grid = el('div', 'lab-image-grid');
  const paths = [loc.img_room, loc.img_container, loc.img_contents];

  paths.forEach((filename, i) => {
    const figure = el('figure', 'lab-figure');

    if (filename) {
      const anchor  = document.createElement('a');
      anchor.href   = imgBase + filename;
      anchor.target = '_blank';
      anchor.rel    = 'noopener';

      const img     = document.createElement('img');
      img.src       = imgBase + filename;
      img.alt       = IMG_CAPTIONS[i];
      img.loading   = 'lazy';
      img.className = 'lab-img';
      img.onerror   = () => {
        if (img.src.endsWith('.png')) {
          img.onerror = () => { img.style.display = 'none'; };
          img.src = img.src.slice(0, -4) + '.webp';
        } else {
          img.style.display = 'none';
        }
      };

      anchor.appendChild(img);
      figure.appendChild(anchor);
    }

    figure.appendChild(el('figcaption', 'lab-figcaption', IMG_CAPTIONS[i]));
    grid.appendChild(figure);
  });

  return grid;
}

// ── Per-location row ──────────────────────────────────────────────────────────

function renderLocationRow(loc, showRole, imgBase) {
  const row = el('div', 'lab-location-row');

  // Header: role badge + breadcrumb
  const header = el('div', 'lab-loc-header');
  if (showRole && loc.role) {
    const badge = el('span', 'lab-role-badge');
    badge.textContent  = ROLE_LABELS[loc.role] || loc.role;
    badge.dataset.role = loc.role;
    header.appendChild(badge);
  }
  const parts = [loc.zone, loc.storage_unit, loc.sublocation].filter(Boolean);
  header.appendChild(el('span', null, parts.join(' › ') || 'Location unspecified'));
  row.appendChild(header);

  // 3-column image grid
  row.appendChild(renderImageGrid(loc, imgBase));

  // Notes
  if (loc.notes) row.appendChild(el('div', 'lab-loc-notes', loc.notes));

  // Optional meta (label, CAS, hazard codes, etc.)
  const metaItems = [];
  if (loc.label)          metaItems.push({ k: 'Label',         v: loc.label });
  if (loc.cas)            metaItems.push({ k: 'CAS',           v: loc.cas });
  if (loc.formula)        metaItems.push({ k: 'Formula',       v: loc.formula });
  if (loc.physical_state) metaItems.push({ k: 'Physical state',v: loc.physical_state });
  if (loc.container_type) metaItems.push({ k: 'Container',     v: loc.container_type });
  if (loc.amount && loc.unit) metaItems.push({ k: 'Amount',    v: `${loc.amount} ${loc.unit}` });

  if (metaItems.length || loc.hazard_codes) {
    const meta = el('div', 'lab-loc-meta');
    if (metaItems.length) {
      const dl = el('dl', 'lab-dl');
      metaItems.forEach(({ k, v }) => {
        dl.appendChild(el('dt', null, k));
        dl.appendChild(el('dd', null, v));
      });
      meta.appendChild(dl);
    }
    if (loc.hazard_codes) {
      const wrap = el('div', 'lab-hazard-codes');
      loc.hazard_codes.split(',').map(c => c.trim()).filter(Boolean)
        .forEach(code => wrap.appendChild(el('span', 'lab-hazard-chip', code)));
      meta.appendChild(wrap);
    }
    row.appendChild(meta);
  }

  return row;
}

// ── Item detail view ──────────────────────────────────────────────────────────

function showItemDetail(item, imgBase) {
  const resultsPanel = document.getElementById('lab-results-panel');
  const detailPanel  = document.getElementById('lab-detail-panel');
  if (!detailPanel) return;

  if (resultsPanel) resultsPanel.hidden = true;
  detailPanel.hidden = false;
  clear(detailPanel);

  // Header
  const header = el('div', 'lab-item-header');
  header.appendChild(el('span', 'lab-item-name', item.name));
  const badge = el('span', 'lab-category-badge');
  badge.textContent      = CATEGORY_LABELS[item.category] || item.category || '';
  badge.dataset.category = CATEGORY_CSS[item.category]    || item.category || '';
  if (badge.textContent) header.appendChild(badge);
  detailPanel.appendChild(header);

  // Location rows (one per location — stacks vertically)
  const locs = el('div', 'lab-locations');
  const showRole = item.locations.length > 1;
  item.locations.forEach(loc => locs.appendChild(renderLocationRow(loc, showRole, imgBase)));
  detailPanel.appendChild(locs);
}

// ── Consumable detail view ────────────────────────────────────────────────────

function showConsumableDetail(key, entry) {
  const resultsPanel = document.getElementById('lab-results-panel');
  const detailPanel  = document.getElementById('lab-detail-panel');
  if (!detailPanel) return;

  if (resultsPanel) resultsPanel.hidden = true;
  detailPanel.hidden = false;
  clear(detailPanel);

  const header = el('div', 'lab-item-header');
  header.appendChild(el('span', 'lab-item-name', (entry.items || []).join(', ') || key));
  const badge = el('span', 'lab-category-badge');
  badge.textContent      = 'Consumable';
  badge.dataset.category = 'consumable-backup';
  header.appendChild(badge);
  detailPanel.appendChild(header);

  const [zone, su, sl] = key.split(':');
  const crumb = [zone, su, sl].filter(Boolean).join(' › ');
  if (crumb) detailPanel.appendChild(el('p', 'lab-result-crumb', crumb));

  const metaItems = [];
  if (entry.target    != null) metaItems.push({ k: 'Target stock',   v: String(entry.target) });
  if (entry.threshold != null) metaItems.push({ k: 'Reorder when ≤', v: String(entry.threshold) });

  if (metaItems.length) {
    const dl = el('dl', 'lab-dl');
    metaItems.forEach(({ k, v }) => { dl.appendChild(el('dt', null, k)); dl.appendChild(el('dd', null, v)); });
    detailPanel.appendChild(dl);
  }

  const links = [];
  if (entry.vendor_url)    links.push({ label: 'Vendor',                           href: entry.vendor_url });
  if (entry.campus_url)    links.push({ label: entry.campus_source || 'Campus',    href: entry.campus_url });
  if (entry.protocol_path) links.push({ label: 'Protocol',                         href: entry.protocol_path });
  if (links.length) {
    const wrap = el('div', 'lab-acq-links');
    links.forEach(({ label, href }) => {
      const a = document.createElement('a');
      a.href = href; a.target = '_blank'; a.rel = 'noopener';
      a.className = 'lab-acq-link'; a.textContent = label;
      wrap.appendChild(a);
    });
    detailPanel.appendChild(wrap);
  }
}

// ── Zone click detail ─────────────────────────────────────────────────────────

function showZoneDetail(slug, data) {
  const resultsPanel = document.getElementById('lab-results-panel');
  const detailPanel  = document.getElementById('lab-detail-panel');
  if (!detailPanel) return;

  if (resultsPanel) resultsPanel.hidden = true;
  detailPanel.hidden = false;
  clear(detailPanel);

  const wrap = el('div', 'lab-zone-detail');

  const zone = (data.room?.zones || []).find(z => z.slug === slug);
  wrap.appendChild(el('p', 'lab-zone-title',
    zone?.label || slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())));

  const units = (data.storageJSON?.storage_units || []).filter(u => u.zone === slug);
  if (units.length) {
    wrap.appendChild(el('div', 'lab-section-heading', 'Storage'));
    const ul = el('ul', 'lab-zone-list');
    units.forEach(u => {
      const li = el('li', null, u.name);
      if (u.access && u.access !== 'student') li.appendChild(el('span', 'lab-access-badge', u.access));
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
  }

  const equip = (data.equipment || []).filter(e => e.zone === slug);
  if (equip.length) {
    wrap.appendChild(el('div', 'lab-section-heading', 'Equipment'));
    const ul = el('ul', 'lab-zone-list');
    equip.forEach(e => ul.appendChild(el('li', null, e.name || e.id)));
    wrap.appendChild(ul);
  }

  detailPanel.appendChild(wrap);
}

// ── Results list ──────────────────────────────────────────────────────────────

function showResultsList(result, data) {
  const resultsPanel = document.getElementById('lab-results-panel');
  const detailPanel  = document.getElementById('lab-detail-panel');
  if (!resultsPanel) return;

  if (!result.query) {
    resultsPanel.hidden = true;
    if (detailPanel) detailPanel.hidden = true;
    return;
  }

  const items          = result.items          || [];
  const consumableKeys = result.consumableKeys  || [];

  // Single located item, no consumables → go straight to detail
  if (items.length === 1 && consumableKeys.length === 0) {
    showItemDetail(items[0], data.imgBase);
    return;
  }

  if (items.length === 0 && consumableKeys.length === 0) {
    resultsPanel.hidden = true;
    if (detailPanel) detailPanel.hidden = true;
    return;
  }

  if (detailPanel) detailPanel.hidden = true;
  clear(resultsPanel);
  resultsPanel.hidden = false;

  const total = items.length + consumableKeys.length;
  resultsPanel.appendChild(el('p', 'lab-results-heading',
    total + ' result' + (total !== 1 ? 's' : '')));

  for (const item of items) {
    const row   = el('div', 'lab-result-row');
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');

    const badge = el('span', 'lab-category-badge lab-badge-sm');
    badge.textContent      = CATEGORY_LABELS[item.category] || item.category || '';
    badge.dataset.category = CATEGORY_CSS[item.category]    || item.category || '';

    const left  = el('div', 'lab-result-left');
    left.appendChild(el('span', 'lab-result-name', item.name));
    const firstLoc = item.locations[0];
    const crumb = [firstLoc.zone, firstLoc.storage_unit, firstLoc.sublocation].filter(Boolean).join(' › ')
      + (item.locations.length > 1 ? ` (+${item.locations.length - 1} more)` : '');
    left.appendChild(el('span', 'lab-result-crumb', crumb));

    row.appendChild(badge);
    row.appendChild(left);

    const select = () => showItemDetail(item, data.imgBase);
    row.addEventListener('click', select);
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
    resultsPanel.appendChild(row);
  }

  const consMap = data.consumables?.map || {};
  for (const key of consumableKeys.slice(0, 20)) {
    const entry = consMap[key];
    if (!entry?.items?.length) continue;

    const row = el('div', 'lab-result-row');
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');

    const badge = el('span', 'lab-category-badge lab-badge-sm');
    badge.textContent      = 'Consumable';
    badge.dataset.category = 'consumable-backup';

    const left = el('div', 'lab-result-left');
    left.appendChild(el('span', 'lab-result-name', entry.items.join(', ')));
    left.appendChild(el('span', 'lab-result-crumb', key.split(':').filter(Boolean).join(' › ')));

    row.appendChild(badge);
    row.appendChild(left);

    const select = () => showConsumableDetail(key, entry);
    row.addEventListener('click', select);
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
    resultsPanel.appendChild(row);
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initDetails(data) {
  // Track whether a search result is currently displayed.
  // Zone clicks on the map should not override an active search result —
  // the user clicked a highlighted zone, not "navigate away from this item".
  let hasActiveResult = false;

  on('lab:results', result => {
    hasActiveResult = !!(result.query && (result.items?.length || result.consumableKeys?.length));
    showResultsList(result, data);
  });

  on('select:zone', slug => {
    // If user is viewing search results, ignore zone taps — the map is
    // just showing WHERE the item is, not an invitation to navigate away.
    if (hasActiveResult) return;
    showZoneDetail(slug, data);
  });

  on('select:equipment', e => {
    if (hasActiveResult) return;
    if (e.zone) showZoneDetail(e.zone, data);
  });
}
