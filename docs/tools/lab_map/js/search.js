
import { emit } from './bus.js';
export function initSearch(data){
  const box = document.getElementById('search-box');
  const dl = document.getElementById('item-list');
  dl.innerHTML='';
  (data.consumables.items || []).forEach(it => {
    const o = document.createElement('option'); o.value = it; dl.appendChild(o);
  });
  const INDEX = new Map();
  function tokenize(str){
    const w = str.toLowerCase().split(/[^a-z0-9µ]+/).filter(Boolean);
    const ng = new Set(w);
    for(let i=0;i<w.length-1;i++) ng.add(w[i]+' '+w[i+1]);
    for(let i=0;i<w.length-2;i++) ng.add(w[i]+' '+w[i+1]+' '+w[i+2]);
    return Array.from(ng);
  }
  for (const [key, entry] of Object.entries(data.consumables.map)) {
    for (const it of (entry.items||[])) {
      tokenize(it).forEach(tok => {
        const arr = INDEX.get(tok) || []; arr.push(key); INDEX.set(tok, arr);
      });
    }
  }
  function search(q){
    const low = q.toLowerCase().trim();
    if (!low) return { query:q, keys: [] };
    const exact = INDEX.get(low) || [];
    const parts = [];
    for (const [tok, keys] of INDEX) {
      if (tok.includes(low)) { parts.push(...keys); if (parts.length > 200) break; }
    }
    const uniq = Array.from(new Set([...exact, ...parts]));
    return { query:q, keys: uniq.slice(0, 100) };
  }
  box.addEventListener('input', () => {
    const v = box.value.trim();
    if (!v) return;
    const r = search(v);
    emit('search:results', r);
  });
  box.addEventListener('change', () => {
    const v = box.value.trim().toLowerCase();
    const keys = data.ITEM_TO_KEYS[v] || [];
    if (keys.length) emit('search:results', { query: box.value, keys });
  });
}
