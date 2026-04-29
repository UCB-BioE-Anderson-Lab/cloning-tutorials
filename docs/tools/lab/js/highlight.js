/**
 * highlight.js — SVG zone highlight / dim logic
 *
 * Responds to bus events and applies CSS classes + aria-selected to zone rects.
 * Does NOT use color alone: highlighted zones also get a data-highlighted
 * attribute so CSS can add stroke and pattern, satisfying WCAG 1.4.1.
 */

import { on } from './bus.js';

function getRects() {
  const root = document.getElementById('map-root');
  return root?.__rects ?? new Map();
}

function clearAll() {
  getRects().forEach(el => {
    el.classList.remove('highlighted', 'dimmed', 'active');
    el.setAttribute('aria-selected', 'false');
    el.removeAttribute('data-highlighted');
  });
}

function highlightSlugs(slugs) {
  const set = new Set(slugs || []);
  getRects().forEach((el, slug) => {
    el.classList.remove('highlighted', 'dimmed');
    el.setAttribute('aria-selected', 'false');
    el.removeAttribute('data-highlighted');
    if (set.size === 0) return;
    if (set.has(slug)) {
      el.classList.add('highlighted');
      el.setAttribute('aria-selected', 'true');
      el.setAttribute('data-highlighted', '');
    } else {
      el.classList.add('dimmed');
    }
  });
}

function focusSlug(slug) {
  getRects().forEach(el => { el.classList.remove('active'); });
  const rect = getRects().get(slug);
  if (rect) {
    rect.classList.add('active');
    rect.setAttribute('aria-selected', 'true');
  }
}

// ── Bus wiring ────────────────────────────────────────────────────────────────

on('ready', () => clearAll());

on('select:zone', slug => {
  focusSlug(slug);
  highlightSlugs([slug]);
});

on('lab:results', ({ items, consumableKeys, query }) => {
  if (!query) { clearAll(); return; }

  const slugs = new Set();
  for (const item of (items || []))
    for (const loc of (item.locations || []))
      if (loc.zone) slugs.add(loc.zone);
  for (const key of (consumableKeys || []))
    { const z = key.split(':')[0]; if (z) slugs.add(z); }

  highlightSlugs(Array.from(slugs));
});

on('highlight:keys', keys => {
  highlightSlugs((keys || []).map(k => k.split(':')[0]).filter(Boolean));
});

on('clear:highlight', () => clearAll());
