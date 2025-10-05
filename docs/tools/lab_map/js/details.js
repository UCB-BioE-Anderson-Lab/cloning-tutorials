

import { on } from './bus.js';

let DATA = null;

function el(id) { return document.getElementById(id); }
function clear(node){ if (!node) return; node.innerHTML = ''; }
function text(tag, content){ const n=document.createElement(tag); n.textContent=content; return n; }
function link(href, label){ const a=document.createElement('a'); a.href=href; a.target = href.startsWith('#') ? '' : '_blank'; a.rel = href.startsWith('#') ? '' : 'noopener noreferrer'; a.textContent=label; return a; }

function renderStockRow(dl, entry){
  const parts=[];
  if (typeof entry.target !== 'undefined') parts.push(`target: ${entry.target}`);
  if (typeof entry.threshold !== 'undefined') parts.push(`threshold: ${entry.threshold}`);
  if (parts.length){
    const dt = text('dt','Stock'); const dd = text('dd', parts.join(', ')); dl.appendChild(dt); dl.appendChild(dd);
  }
}

function renderAcquireRow(dl, entry){
  const links=[];
  if (entry.protocol_path) links.push(link(entry.protocol_path,'protocol'));
  if (entry.campus_url) {
    const a = link(entry.campus_url, entry.campus_source ? `campus: ${entry.campus_source}` : 'campus'); links.push(a);
  }
  if (entry.vendor_url) links.push(link(entry.vendor_url,'vendor'));
  if (links.length){
    const dt = text('dt','Get'); const dd = document.createElement('dd');
    links.forEach((a,i)=>{ if(i){ dd.appendChild(text('span',' ')); } dd.appendChild(a); });
    dl.appendChild(dt); dl.appendChild(dd);
  }
}

function renderZoneDetails(slug){
  const details = el('details'); if (!details) return; clear(details);
  details.appendChild(text('h3', slug));

  // Equipment in zone
  const eq = (DATA?.equipment || []).filter(e => e.zone === slug);
  if (eq.length){
    details.appendChild(text('h4', 'Equipment'));
    const ul = document.createElement('ul');
    eq.forEach(e => {
      const li = document.createElement('li');
      li.textContent = e.name;
      // trainings (ids -> titles)
      const trainings = (e.trainings||[]).map(tid => (DATA.trainings||[]).find(t=>t.id===tid)).filter(Boolean);
      if (trainings.length){
        const span = document.createElement('span'); span.textContent = ' — ';
        li.appendChild(span);
        trainings.forEach((t,i)=>{
          if (i) li.appendChild(text('span', ' · '));
          li.appendChild(link(t.path, t.title));
        });
      }
      ul.appendChild(li);
    });
    details.appendChild(ul);
  }

  // Items in zone
  const keys = Object.keys(DATA?.consumables?.map || {}).filter(k => k.startsWith(slug + ':'));
  if (keys.length){
    details.appendChild(text('h4','Items'));
    const dl = document.createElement('dl');
    keys.forEach(k => {
      const entry = DATA.consumables.map[k] || {};
      const pos = k.split(':').slice(1).join(':') || '(root)';
      const dt = text('dt', pos); const dd = text('dd', (entry.items||[]).join(', '));
      dl.appendChild(dt); dl.appendChild(dd);
      renderStockRow(dl, entry);
      renderAcquireRow(dl, entry);
    });
    details.appendChild(dl);
  }
}

function renderSearchResults(res){
  const tray = el('results-tray'); if (!tray) return; tray.hidden = false; clear(tray);
  tray.appendChild(text('h4', `Search results for: ${res.query}`));
  (res.keys || []).forEach(k => {
    const entry = DATA?.consumables?.map?.[k] || {};
    const row = document.createElement('div');
    const base = text('span', k);
    row.appendChild(base);
    const stock=[];
    if (typeof entry.target !== 'undefined') stock.push(`target ${entry.target}`);
    if (typeof entry.threshold !== 'undefined') stock.push(`threshold ${entry.threshold}`);
    if (stock.length){ const sep=text('span',' — ' + stock.join(', ')); row.appendChild(sep); }
    if (entry.protocol_path){ const s=text('span',' '); row.appendChild(s); row.appendChild(link(entry.protocol_path,'protocol')); }
    if (entry.campus_url){ const s=text('span',' · '); row.appendChild(s); row.appendChild(link(entry.campus_url, entry.campus_source ? `campus: ${entry.campus_source}` : 'campus')); }
    if (entry.vendor_url){ const s=text('span',' · '); row.appendChild(s); row.appendChild(link(entry.vendor_url,'vendor')); }
    tray.appendChild(row);
  });
}

export function initDetails(data){
  DATA = data;
  on('select:zone', slug => renderZoneDetails(slug));
  on('search:results', res => renderSearchResults(res));
}