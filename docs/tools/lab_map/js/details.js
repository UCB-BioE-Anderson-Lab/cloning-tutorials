import { on } from './bus.js';

let DATA = null;

function el(id) { return document.getElementById(id); }
function clear(node){ if (!node) return; node.innerHTML = ''; }
function text(tag, content){ const n=document.createElement(tag); n.textContent=content; return n; }
function link(href, label){ const a=document.createElement('a'); a.href=href; a.target = href.startsWith('#') ? '' : '_blank'; a.rel = href.startsWith('#') ? '' : 'noopener noreferrer'; a.textContent=label; return a; }

function chip(textContent){
  const s = document.createElement('span');
  s.className = 'loc-chip';
  s.textContent = textContent;
  return s;
}
function parseLocFromKey(key){
  // key format: benchSlug:side:drawerId
  const [, side, drawer] = String(key).split(':');
  const sideLabel = side ? side.replace(/_/g,' ') : '';
  const drawerLabel = drawer || '';
  return [sideLabel, drawerLabel].filter(Boolean).join(' ');
}

function renderStockRow(dl, entry){
  const parts=[];
  if (typeof entry.target !== 'undefined') parts.push(`target ${entry.target}`);
  if (typeof entry.threshold !== 'undefined') parts.push(`threshold ${entry.threshold}`);
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

function isUrl(v){ return typeof v === 'string' && /^(https?:\/\/|#)/.test(v); }
function prettyKey(k){
  return String(k)
    .replace(/_/g, ' ')
    .replace(/\b([a-z])/g, (m,c)=>c.toUpperCase());
}
function renderAllConsumableFields(dl, entry){
  // Render explicit known fields first, then fall back to any remaining non-empty fields.
  const row = (k,v)=>{ const dt=text('dt', k); const dd=document.createElement('dd'); if (isUrl(v)) { dd.appendChild(link(v, k.toLowerCase())); } else { dd.textContent = String(v); } dl.appendChild(dt); dl.appendChild(dd); };

  // Known fields from TSV
  if (Array.isArray(entry.items) && entry.items.length) { const dt=text('dt','Items'); const dd=text('dd', entry.items.join(', ')); dl.appendChild(dt); dl.appendChild(dd); }
  const locs = [entry.loc1, entry.loc2, entry.loc3].filter(Boolean);
  if (locs.length) { const dt=text('dt','Location'); const dd=text('dd', locs.join(' · ')); dl.appendChild(dt); dl.appendChild(dd); }
  if (typeof entry.target !== 'undefined') row('Target', entry.target);
  if (typeof entry.threshold !== 'undefined') row('Threshold', entry.threshold);
  if (entry.preferred_acquire) row('Preferred', entry.preferred_acquire);
  if (entry.protocol_path) { const dt=text('dt','Protocol'); const dd=document.createElement('dd'); dd.appendChild(link(entry.protocol_path,'protocol')); dl.appendChild(dt); dl.appendChild(dd); }
  if (entry.campus_url) { const dt=text('dt','Campus'); const dd=document.createElement('dd'); dd.appendChild(link(entry.campus_url, entry.campus_source ? `campus: ${entry.campus_source}` : 'campus')); dl.appendChild(dt); dl.appendChild(dd); }
  if (entry.vendor_url) { const dt=text('dt','Vendor'); const dd=document.createElement('dd'); dd.appendChild(link(entry.vendor_url,'vendor')); dl.appendChild(dt); dl.appendChild(dd); }

  // Generic fall-through: render any other string/number fields not already shown.
  const shown = new Set(['items','loc1','loc2','loc3','target','threshold','preferred_acquire','protocol_path','campus_url','campus_source','vendor_url']);
  Object.entries(entry).forEach(([k,v]) => {
    if (v==null || v==='' || shown.has(k)) return;
    if (Array.isArray(v) && !v.length) return;
    const label = prettyKey(k);
    const dt = text('dt', label);
    const dd = document.createElement('dd');
    if (Array.isArray(v)) { dd.textContent = v.join(', '); }
    else if (isUrl(v)) { dd.appendChild(link(v, label.toLowerCase())); }
    else { dd.textContent = String(v); }
    dl.appendChild(dt); dl.appendChild(dd);
  });
}

function renderSingleConsumable(key, entry, title){
  const panel = el('details-panel'); if (!panel) return; clear(panel);
  const header = document.createElement('div');
  header.className = 'detail-head';
  const h3 = text('h3', title || (entry.items ? entry.items.join(', ') : 'Selection'));
  h3.className = 'title-sm';
  header.appendChild(h3);
  header.appendChild(chip(parseLocFromKey(key)));
  panel.appendChild(header);

  const dl = document.createElement('dl');
  renderAllConsumableFields(dl, entry);
  panel.appendChild(dl);
}

function renderEquipmentDetails(equip){
  const details = el('details-panel'); if (!details) return; clear(details);

  // Title
  details.appendChild(text('h3', equip.name || equip.id || 'Equipment'));

  // Definition list
  const dl = document.createElement('dl');
  const row = (k,v) => { const dt=text('dt',k); const dd=text('dd',v); dl.appendChild(dt); dl.appendChild(dd); };

  if (equip.zone) row('Zone', equip.zone);
  if (equip.type) row('Type', equip.type);
  if (equip.note) row('Note', equip.note);

  // Resolve trainings (IDs -> objects) from global DATA
  const trainings = (equip.trainings||[]).map(tid => (DATA?.trainings||[]).find(t => t.id === tid)).filter(Boolean);
  if (trainings.length){
    const dt = text('dt','Trainings');
    const dd = document.createElement('dd');
    trainings.forEach((t,i) => { if (i) dd.appendChild(text('span',' · ')); dd.appendChild(link(t.path, t.title)); });
    dl.appendChild(dt); dl.appendChild(dd);
  }

  details.appendChild(dl);
}

function renderZoneDetails(slug){
  const details = el('details-panel'); if (!details) return; clear(details);
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
      if (entry.preferred_acquire){ const dtp=text('dt','Preferred'); const ddp=text('dd', entry.preferred_acquire); dl.appendChild(dtp); dl.appendChild(ddp); }
    });
    details.appendChild(dl);
  }
}

function renderConsumableMeta(dd, entry){
  // stock
  const stock = [];
  if (typeof entry.target !== 'undefined') stock.push(`target ${entry.target}`);
  if (typeof entry.threshold !== 'undefined') stock.push(`threshold ${entry.threshold}`);
  if (stock.length){
    if (dd.firstChild) dd.appendChild(text('span',' — '));
    dd.appendChild(text('span', stock.join(', ')));
  }
  // preferred acquire
  if (entry.preferred_acquire){
    dd.appendChild(text('span',' · '));
    dd.appendChild(text('span', `preferred: ${entry.preferred_acquire}`));
  }
  // links
  const links = [];
  if (entry.protocol_path) links.push(link(entry.protocol_path,'protocol'));
  if (entry.campus_url) links.push(link(entry.campus_url, entry.campus_source ? `campus: ${entry.campus_source}` : 'campus'));
  if (entry.vendor_url) links.push(link(entry.vendor_url,'vendor'));
  if (links.length){
    dd.appendChild(text('span',' · '));
    links.forEach((a,i)=>{ if(i) dd.appendChild(text('span',' · ')); dd.appendChild(a); });
  }
}

function renderSearchResults(res){
  const panel = el('details-panel'); if (!panel) return; clear(panel);
  const title = text('h3', res?.query ? res.query : 'Selection'); panel.appendChild(title);

  const keys = (res?.keys || []);
  if (!keys.length){ panel.appendChild(text('p','No matches')); return; }

  if (keys.length === 1) {
    const key = keys[0];
    const entry = DATA?.consumables?.map?.[key] || {};
    renderSingleConsumable(key, entry, res?.query);
    return;
  }

  const list = document.createElement('div');
  list.className = 'results-list';

  keys.forEach(k => {
    const entry = DATA?.consumables?.map?.[k] || {};
    const row = document.createElement('div');
    row.className = 'result-row';
    row.addEventListener('click', () => {
      renderSingleConsumable(k, entry, (entry.items && entry.items.join(', ')) || res?.query || 'Selection');
    });

    // left column: compact location chip
    const left = document.createElement('div');
    left.className = 'result-left';
    left.appendChild(chip(parseLocFromKey(k)));
    row.appendChild(left);

    // right column: items + meta
    const right = document.createElement('div');
    right.className = 'result-right';

    if (Array.isArray(entry.items) && entry.items.length){
      const itemsEl = document.createElement('div');
      itemsEl.className = 'items';
      itemsEl.textContent = entry.items.join(', ');
      right.appendChild(itemsEl);
    }

    // metadata: stock, preferred, links
    const meta = document.createElement('div');
    meta.className = 'meta';
    renderConsumableMeta(meta, entry);
    // Show any additional URL-like fields generically
    Object.entries(entry).forEach(([kk,vv]) => {
      if (!vv || typeof vv !== 'string') return;
      if (/^(protocol_path|campus_url|vendor_url)$/i.test(kk)) return;
      if (/^(https?:\/\/|#)/.test(vv)) {
        meta.appendChild(text('span',' · '));
        meta.appendChild(link(vv, kk.replace(/_/g,' ').toLowerCase()));
      }
    });
    right.appendChild(meta);

    const locs = [entry.loc1, entry.loc2, entry.loc3].filter(Boolean);
    if (locs.length) {
      const locPath = document.createElement('div');
      locPath.className = 'loc-path';
      locPath.textContent = locs.join(' · ');
      right.appendChild(locPath);
    }

    row.appendChild(right);
    list.appendChild(row);
  });

  panel.appendChild(list);
}

export function initDetails(data){
  DATA = data; window.LAB_DATA = data;
  on('select:zone', slug => renderZoneDetails(slug));
  on('search:results', res => renderSearchResults(res));
  on('select:equipment', equip => renderEquipmentDetails(equip));
}