// details.js — render item detail panel and search result list

import { bus } from './search.js';

const CATEGORY_LABELS = {
  'enzyme':            'Enzyme',
  'primer':            'Primer',
  'buffer':            'Buffer',
  'kit':               'Kit',
  'equipment':         'Equipment',
  'training':          'Training',
  'biological':        'Biological',
  'chemical':          'Chemical',
  'labware':           'Labware',
  // legacy values kept for compatibility
  'bio-stock':         'Biological Stock',
  'consumable-backup': 'Consumable'
};

// Maps new category slugs to existing CSS variable color pairs
// (avoids adding new CSS custom properties for each category)
const CATEGORY_CSS = {
  'enzyme':     'bio-stock',
  'primer':     'bio-stock',
  'buffer':     'bio-stock',
  'biological': 'bio-stock',
  'kit':        'bio-stock',
  'equipment':  'equipment',
  'training':   'training',
  'chemical':   'training',
  'labware':    'consumable-backup'
};

const ROLE_LABELS = {
  'working':  'Working copy',
  'backup':   'Backup',
  'training': 'Training copy'
};

const IMAGE_CAPTIONS = {
  img_room:      'Zone',
  img_container: 'Equipment',
  img_contents:  'Container'
};

// ── DOM helpers ──────────────────────────────────────────────────────────────

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function clear(node) { node.innerHTML = ''; }

// ── Per-location renderers ───────────────────────────────────────────────────

function renderBreadcrumb(loc) {
  const parts = [loc.loc1, loc.loc2, loc.loc3].filter(Boolean);
  return parts.join(' › ');
}

function renderImageStrip(loc, imgBase) {
  const strip = el('div', 'finder-image-strip');
  const levels = ['img_room', 'img_container', 'img_contents'];

  for (const key of levels) {
    const filename = loc[key];
    if (!filename) continue;

    const figure  = el('figure', 'finder-figure');
    const anchor  = document.createElement('a');
    anchor.href   = imgBase + filename;
    anchor.target = '_blank';
    anchor.rel    = 'noopener';

    const img     = document.createElement('img');
    img.src       = imgBase + filename;
    img.alt       = IMAGE_CAPTIONS[key];
    img.loading   = 'lazy';
    img.className = 'finder-img';
    img.onerror   = () => {
      // Try .webp fallback before giving up
      if (img.src.endsWith('.png')) {
        img.onerror = () => { figure.style.display = 'none'; };
        img.src = img.src.slice(0, -4) + '.webp';
      } else {
        figure.style.display = 'none';
      }
    };

    anchor.appendChild(img);
    figure.appendChild(anchor);
    figure.appendChild(el('figcaption', 'finder-figcaption', IMAGE_CAPTIONS[key]));
    strip.appendChild(figure);
  }

  return strip;
}

function renderMeta(loc) {
  const meta = el('div', 'finder-item-meta');

  const details = [];
  if (loc.label) details.push({ k: 'Physical label', v: loc.label });

  if (details.length) {
    const dl = document.createElement('dl');
    dl.className = 'finder-dl';
    for (const { k, v } of details) {
      dl.appendChild(el('dt', null, k));
      dl.appendChild(el('dd', null, v));
    }
    meta.appendChild(dl);
  }

  if (loc.notes) meta.appendChild(el('p', 'finder-notes', loc.notes));

  return meta;
}

function renderLocationBlock(loc, showRole, imgBase) {
  const block = el('div', 'finder-location-block');

  // Role badge — only shown when item has multiple locations
  if (showRole && loc.role) {
    const roleLabel = ROLE_LABELS[loc.role] || loc.role;
    const badge = el('span', 'finder-role-badge');
    badge.textContent      = roleLabel;
    badge.dataset.role     = loc.role;
    block.appendChild(badge);
  }

  block.appendChild(el('div', 'finder-breadcrumb', renderBreadcrumb(loc)));
  block.appendChild(renderImageStrip(loc, imgBase));
  block.appendChild(renderMeta(loc));

  return block;
}

// ── Panel renderers ──────────────────────────────────────────────────────────

function showDetailPanel(item, data) {
  const resultsPanel = document.getElementById('finder-results-panel');
  const detailPanel  = document.getElementById('finder-detail-panel');
  if (!detailPanel) return;

  if (resultsPanel) resultsPanel.hidden = true;
  detailPanel.hidden = false;

  const nameEl   = detailPanel.querySelector('.finder-item-name');
  const badgeEl  = detailPanel.querySelector('.finder-category-badge');
  const locsEl   = detailPanel.querySelector('.finder-locations');

  if (nameEl)  nameEl.textContent = item.name;

  if (badgeEl) {
    badgeEl.textContent       = CATEGORY_LABELS[item.category] || item.category;
    // Map to an existing CSS color slot if needed
    badgeEl.dataset.category  = CATEGORY_CSS[item.category] || item.category;
  }

  if (locsEl) {
    clear(locsEl);
    const showRole = item.locations.length > 1;
    for (const loc of item.locations) {
      locsEl.appendChild(renderLocationBlock(loc, showRole, data.imgBase));
    }
  }
}

function showResultsList(items, data) {
  const resultsPanel = document.getElementById('finder-results-panel');
  const detailPanel  = document.getElementById('finder-detail-panel');
  if (!resultsPanel) return;

  detailPanel.hidden = true;

  if (!items || items.length === 0) {
    resultsPanel.hidden = true;
    return;
  }

  clear(resultsPanel);
  resultsPanel.hidden = false;

  const heading = el('p', 'finder-results-heading',
    items.length + ' result' + (items.length !== 1 ? 's' : ''));
  resultsPanel.appendChild(heading);

  for (const item of items) {
    const row = el('div', 'finder-result-row');
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', 'Select ' + item.name);

    const badge = el('span', 'finder-category-badge finder-badge-sm');
    badge.textContent      = CATEGORY_LABELS[item.category] || item.category;
    badge.dataset.category = CATEGORY_CSS[item.category] || item.category;

    const name  = el('span', 'finder-result-name', item.name);

    // Show first location breadcrumb + hint if more locations exist
    const firstLoc  = item.locations[0];
    const crumbText = renderBreadcrumb(firstLoc) +
      (item.locations.length > 1 ? ` (+${item.locations.length - 1} more)` : '');
    const crumb = el('span', 'finder-result-crumb', crumbText);

    const left = el('div', 'finder-result-left');
    left.appendChild(name);
    left.appendChild(crumb);

    row.appendChild(badge);
    row.appendChild(left);

    const select = () => showDetailPanel(item, data);
    row.addEventListener('click', select);
    row.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
    });

    resultsPanel.appendChild(row);
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────

export function initDetails(data) {
  bus.on('finder:results', items => showResultsList(items, data));
  bus.on('finder:select',  item  => showDetailPanel(item, data));
}
