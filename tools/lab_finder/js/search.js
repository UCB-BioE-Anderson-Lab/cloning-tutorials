// search.js — search input, autocomplete, result dispatch

const EVENT_RESULTS = 'finder:results';
const EVENT_SELECT  = 'finder:select';

// Simple event bus (no dependency on lab_map's bus.js)
const listeners = new Map();
export const bus = {
  on(evt, fn)  { if (!listeners.has(evt)) listeners.set(evt, new Set()); listeners.get(evt).add(fn); },
  emit(evt, payload) { (listeners.get(evt) || []).forEach(fn => fn(payload)); }
};

function matchItems(query, allTerms) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // Deduplicate by item identity
  const seen = new Set();
  const results = [];

  for (const { term, item } of allTerms) {
    if (term.includes(q) && !seen.has(item)) {
      seen.add(item);
      results.push(item);
    }
  }
  return results;
}

function populateDatalist(datalist, allTerms) {
  datalist.innerHTML = '';
  const seen = new Set();
  for (const { term } of allTerms) {
    if (!seen.has(term)) {
      seen.add(term);
      const opt = document.createElement('option');
      opt.value = term;
      datalist.appendChild(opt);
    }
  }
}

function updateSuggestions(query, allTerms, datalist) {
  const q = query.toLowerCase().trim();
  datalist.innerHTML = '';
  if (!q) return;

  const seen = new Set();
  let count = 0;
  for (const { term } of allTerms) {
    if (term.includes(q) && !seen.has(term)) {
      seen.add(term);
      const opt = document.createElement('option');
      opt.value = term;
      datalist.appendChild(opt);
      if (++count >= 50) break;
    }
  }
}

export function initSearch(data) {
  const { allTerms } = data;

  const input    = document.getElementById('finder-search');
  const datalist = document.getElementById('finder-list');
  if (!input || !datalist) return;

  // Seed datalist on load
  populateDatalist(datalist, allTerms);

  function runSearch() {
    const q = input.value.trim();
    if (!q) {
      bus.emit(EVENT_RESULTS, []);
      return;
    }
    const results = matchItems(q, allTerms);
    if (results.length === 1) {
      bus.emit(EVENT_SELECT, results[0]);
    } else {
      bus.emit(EVENT_RESULTS, results);
    }
  }

  // Debounce: update results as user types, no Enter needed
  let debounceTimer = null;
  input.addEventListener('input', () => {
    updateSuggestions(input.value, allTerms, datalist);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 120);
  });

  // Also fire immediately on datalist selection (change fires on option pick)
  input.addEventListener('change', runSearch);

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      input.value = '';
      bus.emit(EVENT_RESULTS, []);
      populateDatalist(datalist, allTerms);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(debounceTimer);
      runSearch();
    }
  });
}
