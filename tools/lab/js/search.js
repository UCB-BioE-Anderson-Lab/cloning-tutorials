/**
 * search.js — unified search for the Lab tool
 *
 * Combines:
 *  - Substring match on item names/synonyms from locations.tsv + chemicals.tsv
 *  - N-gram token match on consumable names from consumables.tsv
 *
 * Emits on the bus:
 *  - 'lab:results'  { items, consumableKeys, query }
 *
 * On clear (empty query) emits:
 *  - 'lab:results'  { items: [], consumableKeys: [], query: '' }
 */

import { emit } from './bus.js';

export function initSearch(data) {
  const box = document.getElementById('lab-search');
  const dl  = document.getElementById('lab-list');
  if (!box) return;

  // Populate autocomplete datalist
  function populateDatalist(terms) {
    if (!dl) return;
    dl.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const t of terms.slice(0, 200)) {
      const o = document.createElement('option');
      o.value = t;
      frag.appendChild(o);
    }
    dl.appendChild(frag);
  }
  populateDatalist(data.autocompleteList || []);

  // ── Core search function ──────────────────────────────────────────────────

  function runSearch(query) {
    const q = String(query || '').trim();
    if (!q) return { items: [], consumableKeys: [], query: '' };

    const low = q.toLowerCase();

    // 1) Finder-style: substring match on allTerms → grouped item objects
    const itemHits = new Map(); // item.name.lower → item
    for (const { term, item } of (data.allTerms || [])) {
      if (term.includes(low)) {
        itemHits.set(item.name.toLowerCase(), item);
      }
    }

    // 2) N-gram match on consumable index → location keys
    const consHits = new Set();
    const ITEM_TO_KEYS = data.ITEM_TO_KEYS || new Map();
    const INDEX        = data.INDEX        || new Map();

    // Exact consumable name match
    if (ITEM_TO_KEYS.has(low)) {
      (ITEM_TO_KEYS.get(low) || []).forEach(k => consHits.add(k));
    }
    // Partial token match
    for (const [tok, keys] of INDEX) {
      if (tok.includes(low)) {
        keys.forEach(k => consHits.add(k));
        if (consHits.size > 400) break;
      }
    }

    return {
      items:         Array.from(itemHits.values()),
      consumableKeys: Array.from(consHits),
      query:         q
    };
  }

  // ── Autocomplete suggestions ──────────────────────────────────────────────

  box.addEventListener('input', () => {
    const v = box.value.trim();
    if (!v) {
      populateDatalist(data.autocompleteList || []);
      return;
    }
    const low = v.toLowerCase();
    const suggestions = (data.autocompleteList || []).filter(t => t.toLowerCase().includes(low)).slice(0, 50);
    populateDatalist(suggestions);
  });

  // ── Trigger search on value selection (change) or Enter ──────────────────

  function fire() {
    const v = box.value.trim();
    if (!v) {
      emit('lab:results', { items: [], consumableKeys: [], query: '' });
      populateDatalist(data.autocompleteList || []);
      return;
    }
    const result = runSearch(v);
    emit('lab:results', result);
  }

  box.addEventListener('change', fire);
  box.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); fire(); }
    if (e.key === 'Escape') {
      box.value = '';
      emit('lab:results', { items: [], consumableKeys: [], query: '' });
      populateDatalist(data.autocompleteList || []);
    }
  });

  // Clear on focus to allow fresh search
  box.addEventListener('focus', () => {
    emit('lab:results', { items: [], consumableKeys: [], query: '' });
    populateDatalist(data.autocompleteList || []);
  });
}
