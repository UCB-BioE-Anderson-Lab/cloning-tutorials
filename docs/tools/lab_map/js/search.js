import { emit } from './bus.js';

/**
 * search.js — item search & suggestions (autocomplete + pulldown)
 *
 * Expects `data.consumables` from data.js to have the shape:
 *   {
 *     map: { "bench:stack:drawer": { items: ["Parafilm", ...] }, ... },
 *     items?: ["Parafilm", ...]
 *   }
 *
 * On INPUT we only update the datalist suggestions and do NOT render results/details.
 */
export function initSearch(data){
  const box = document.getElementById('search-box');
  const dl  = document.getElementById('item-list');

  // Always-visible logs
  console.log('[search:init] box?', !!box, 'dl?', !!dl);
  console.groupCollapsed('[lab_map][search] initSearch');
  if (!box || !dl) { console.warn('[search] missing input or datalist'); console.groupEnd(); return; }

  // 1) Normalize source data from consumables
  const map = (data?.consumables?.map) || {};
  console.log('[search:init] map keys:', Object.keys(map).length);

  const ITEM_TO_KEYS = new Map(); // itemLower -> [keys]
  const ITEM_SET = new Set();

  for (const [key, entry] of Object.entries(map)) {
    const items = Array.isArray(entry?.items) ? entry.items : [];
    for (const it of items) {
      const disp = String(it).trim();
      if (!disp) continue;
      ITEM_SET.add(disp);
      const low = disp.toLowerCase();
      const arr = ITEM_TO_KEYS.get(low) || [];
      arr.push(key);
      ITEM_TO_KEYS.set(low, arr);
    }
  }

  // Fallback: include any precomputed items provided by the loader
  (Array.isArray(data?.consumables?.items) ? data.consumables.items : []).forEach(d => ITEM_SET.add(String(d)));

  const ALL_ITEMS = Array.from(ITEM_SET).sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'}));

  // Populate the datalist for pulldown and browser autocomplete
  function populateDatalist(items) {
    dl.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const it of items) {
      const o = document.createElement('option'); o.value = it; frag.appendChild(o);
    }
    dl.appendChild(frag);
  }
  populateDatalist(ALL_ITEMS);
  console.log('[search:init] datalist options in DOM:', dl.querySelectorAll('option').length);

  // 2) Build n‑gram index over item strings
  const INDEX = new Map(); // token -> Set(keys)

  function tokenize(str){
    const w = String(str).toLowerCase().split(/[^a-z0-9µ]+/).filter(Boolean);
    const ng = new Set(w);
    for (let i=0;i<w.length-1;i++) ng.add(w[i]+' '+w[i+1]);
    for (let i=0;i<w.length-2;i++) ng.add(w[i]+' '+w[i+1]+' '+w[i+2]);
    return Array.from(ng);
  }

  for (const [key, entry] of Object.entries(map)) {
    const items = Array.isArray(entry?.items) ? entry.items : [];
    for (const it of items) {
      for (const tok of tokenize(it)) {
        let set = INDEX.get(tok);
        if (!set) { set = new Set(); INDEX.set(tok, set); }
        set.add(key);
      }
    }
  }
  console.log('[search:init] tokens in index:', INDEX.size);

  function search(q){
    const orig = String(q||'');
    const low = orig.toLowerCase().trim();
    if (!low) { console.debug('[search] empty query'); return { query: orig, keys: [] }; }

    // Exact item match -> all locations for that item
    if (ITEM_TO_KEYS.has(low)) {
      const keys = (ITEM_TO_KEYS.get(low) || []).slice(0, 200);
      console.debug('[search] exact match for', orig, 'keys:', keys.length);
      return { query: orig, keys };
    }

    // Token/substring match across the index
    const hits = new Set();
    for (const [tok, keys] of INDEX) {
      if (tok.includes(low)) {
        keys.forEach(k => hits.add(k));
        if (hits.size > 400) break; // cap
      }
    }
    console.debug('[search] partial match for', orig, 'hits:', hits.size);
    return { query: orig, keys: Array.from(hits).slice(0, 200) };
  }

  // 3) Wire input events — browser autocomplete + n‑gram
  box.addEventListener('input', () => {
    const query = box.value.trim();
    if (!query) {
      populateDatalist(ALL_ITEMS);
      return;
    }
    const low = query.toLowerCase();

    // Gather suggestions by matching tokens/substrings in ALL_ITEMS
    const suggestions = [];
    for (const item of ALL_ITEMS) {
      if (item.toLowerCase().includes(low)) {
        suggestions.push(item);
        if (suggestions.length >= 30) break;
      }
    }
    populateDatalist(suggestions);
  });

  box.addEventListener('change', () => {
    console.log('[search:change]', box.value);
    const v = box.value.trim();
    if (!v) { emit('search:results', { query:'', keys: [] }); return; }
    const low = v.toLowerCase();
    const keys = ITEM_TO_KEYS.get(low) || [];
    if (keys.length) {
      emit('search:results', { query: v, keys });
      window.dispatchEvent(new CustomEvent('lab:search-results', { detail: { query: v, keys } }));
    } else {
      const rr = search(v);
      emit('search:results', rr);
      window.dispatchEvent(new CustomEvent('lab:search-results', { detail: rr }));
    }
  });

  box.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      console.log('[search:escape-clear]');
      box.value = '';
      emit('search:results', { query: '', keys: [] });
      populateDatalist(ALL_ITEMS);
    }
  });

  box.addEventListener('focus', () => {
    const v = box.value.trim();
    const isExact = v && ITEM_TO_KEYS.has(v.toLowerCase());
    console.log('[search:focus] value=', v, 'isExact?', isExact);
    // If the current value is an exact selection, clear it so the datalist is not pre-filtered
    if (isExact) box.value = '';
    // Clear highlights and reset datalist options to the full set
    emit('search:results', { query: '', keys: [] });
    populateDatalist(ALL_ITEMS);
  });

  // Verify the input is linked to the datalist
  setTimeout(() => {
    const listId = box.getAttribute('list');
    const linked = listId && document.getElementById(listId);
    console.log('[search:post-init] input.list =', listId, 'linked?', !!linked);
  }, 0);

  // Expose debug handles
  window.__LAB_SEARCH_DEBUG__ = { ALL_ITEMS, ITEM_TO_KEYS, INDEX };
  window.__LAB_SEARCH_RESET__ = () => { box.value=''; populateDatalist(ALL_ITEMS); emit('search:results', { query:'', keys:[] }); };
  console.groupEnd();
}






// ──────────────────────────────────────────────────────────────
// Search results → highlight benches + show locations in details
// Listens to DOM CustomEvent so we don't depend on bus in this file
// ──────────────────────────────────────────────────────────────
// Search results → highlight benches + show locations in details
// Listens to DOM CustomEvent so we don't depend on bus in this file
(function(){
  const infoEl = document.getElementById('details-panel') || document.getElementById('lab-info') || document.getElementById('details');

  function benchSlugFromKey(k){ return String(k||'').split(':')[0]; }

  function clearHighlights(){
    document.querySelectorAll('.bench-rect.highlight').forEach(el => el.classList.remove('highlight'));
  }

  function highlightBenches(keys){
    const slugs = Array.from(new Set((keys||[]).map(benchSlugFromKey)));
    slugs.forEach(slug => {
      const el = document.querySelector(`.bench-rect[data-slug="${slug}"]`);
      if (el) el.classList.add('highlight');
    });
  }

  function renderResultsPanel(query, keys){
    if (!infoEl) return;
    infoEl.innerHTML = '';
    const h = document.createElement('h3'); h.textContent = query ? query : 'Selection'; infoEl.appendChild(h);
    if (!keys || !keys.length) { const p=document.createElement('p'); p.textContent='No matches'; infoEl.appendChild(p); return; }
    const ul = document.createElement('ul'); ul.style.margin='0'; ul.style.padding='0 0 0 16px';
    keys.slice(0, 50).forEach(k => { const li=document.createElement('li'); li.textContent = k; ul.appendChild(li); });
    infoEl.appendChild(ul);
  }

  window.addEventListener('lab:search-results', (e) => {
    const { query, keys } = e.detail || {};
    clearHighlights();
    if (keys && keys.length) highlightBenches(keys);
    renderResultsPanel(query, keys);
  });
})();
