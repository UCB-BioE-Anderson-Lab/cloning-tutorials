<input id="lab-search" type="search" placeholder="Search consumables…" style="margin-bottom:0.5rem;padding:0.25rem 0.5rem;width:100%;max-width:300px;" />
<div id="lab-suggest" class="lab-suggest" hidden></div>
<div id="lab-results" class="lab-results" hidden></div>
<div id="lab-map" class="lab-map" data-info-src="../../assets/data/benches.json" data-consumables-src="../../assets/data/consumables.tsv"></div>
<div id="lab-info" class="lab-info" hidden></div>

<style>
  /* keep it simple; SVG will paint inline */
  .lab-map svg { width: 100%; height: auto; display: block; background:#fff; }
  /* interactive styles */
  .lab-map .bench-rect { cursor: pointer; transition: opacity .12s ease-in-out; }
  .lab-map .bench-rect:hover,
  .lab-map .bench-rect:focus { opacity: 0.8; outline: none; }
  .lab-map .bench-rect.active { opacity: 0.65; }
  .lab-map .highlight { stroke: #e63946 !important; stroke-width: 3 !important; fill: #ffe6e6 !important; }
  .lab-info { margin-top: 0.75rem; padding: 0.75rem 1rem; border: 1px solid #cfd8e3; border-radius: 6px; background:#fafbff; font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
  .lab-info h3 { margin: 0 0 .25rem 0; font-size: 16px; }
  .lab-info dl { margin: .25rem 0 0 0; display: grid; grid-template-columns: auto 1fr; gap: 4px 10px; }
  .lab-info dt { color: #556; font-weight: 600; }
  .lab-info[hidden] { display: none; }

  /* search suggestions and results */
  .lab-suggest { position: relative; max-width: 300px; }
  .lab-suggest[hidden] { display: none; }
  .lab-suggest .list { position: absolute; z-index: 3; left: 0; right: 0; border: 1px solid #cfd8e3; background: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(16,24,40,.08); overflow: hidden; }
  .lab-suggest .item { padding: 6px 10px; cursor: pointer; }
  .lab-suggest .item:hover, .lab-suggest .item.active { background: #f1f5ff; }

  .lab-results { margin: 0.5rem 0 0.75rem; padding: 0.5rem 0.75rem; border: 1px solid #cfd8e3; border-radius: 6px; background:#fff; }
  .lab-results[hidden] { display: none; }
  .lab-results h4 { margin: 0 0 .25rem; font-size: 14px; }
  .lab-results .hit { font-size: 13px; padding: 2px 0; }

  /* drawer overlays within a bench */
  .bench-group .stack-rect { fill: #ffffff; fill-opacity: .55; stroke: #637ea6; stroke-width: 0.8; vector-effect: non-scaling-stroke; }
  .bench-group .drawer-rect { fill: #ffffff; fill-opacity: .85; stroke: #8aa1be; stroke-width: 0.6; vector-effect: non-scaling-stroke; }
  .bench-group .drawer-rect:hover { fill-opacity: 1; }
</style>
<script>
/**
 * Lab Map renderer with basic interactivity.
 * - Pure DOM/SVG
 * - No external dependencies
 * - Loads bench metadata from a JSON file referenced by data-info-src on #lab-map
 */
(async () => {
  // ──────────────────────────────────────────────────────────────
  // 0) Elements & metadata loading
  // ──────────────────────────────────────────────────────────────
  const host = document.getElementById('lab-map');
  const panel = document.getElementById('lab-info');
  const suggestBox = document.getElementById('lab-suggest');
  const resultsBox = document.getElementById('lab-results');
  const infoSrc = host.getAttribute('data-info-src') || 'benches.json';
  const consumablesSrc = host.getAttribute('data-consumables-src') || 'consumables.json';

  /**
   * Expected JSON shape (example):
   * {
   *   "left-upper": { "name": "Upper Left Bench", "owner": "Team A", "notes": "PCR prep", "equipment": ["Thermocycler" ] },
   *   "bay1-left-0": { "name": "Bay 1 L0", "owner": "Team B" }
   * }
   */
  let BENCH_INFO = {};
  let CONSUMABLES = {};
  let CONS = CONSUMABLES; // alias for quick lookups (updated after fetch)
  try {
    const res = await fetch(infoSrc, { cache: 'no-store' });
    if (res.ok) BENCH_INFO = await res.json();
    try {
      const cres = await fetch(consumablesSrc, { cache: 'no-store' });
      if (cres.ok) {
        const ct = (cres.headers.get('content-type') || '').toLowerCase();
        if (consumablesSrc.endsWith('.tsv') || ct.includes('text/tab-separated-values') || ct.includes('text/plain')) {
          const text = await cres.text();
          CONSUMABLES = parseConsumablesTSV(text);
        } else {
          CONSUMABLES = await cres.json();
        }
        CONS = CONSUMABLES;
      }
    } catch (e) {
      // proceed without consumables if not available
    }
  } catch (e) {
    // If the JSON is missing or invalid, proceed with empty metadata.
  }

  function parseConsumablesTSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (!lines.length) return {};
    const header = lines[0].split('\t').map(h => h.trim().toLowerCase());
    const benchIdx = header.indexOf('bench');
    const stackIdx = header.indexOf('stack');
    const drawerIdx = header.indexOf('drawer');
    const itemsIdx = header.indexOf('items');
    const map = {};
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split('\t');
      const bench = (cols[benchIdx] || '').trim();
      const stack = (cols[stackIdx] || '').trim();
      const drawer = (cols[drawerIdx] || '').trim();
      const itemsRaw = (cols[itemsIdx] || '').trim();
      if (!bench || !stack || !drawer) continue;
      const key = `${bench}:${stack}:${drawer}`;
      const items = itemsRaw ? itemsRaw.split(/[;,]/).map(s => s.trim()).filter(Boolean) : [];
      map[key] = { items };
    }
    return map;
  }

  // ──────────────────────────────────────────────────────────────
  // Build n-gram index of consumables
  // ──────────────────────────────────────────────────────────────
  let INDEX = {};
  buildIndex();

  function buildIndex() {
    INDEX = {};
    for (const [key, entry] of Object.entries(CONSUMABLES)) {
      if (!entry.items) continue;
      entry.items.forEach(item => {
        const tokens = tokenize(item);
        tokens.forEach(tok => {
          if (!INDEX[tok]) INDEX[tok] = [];
          INDEX[tok].push(key);
        });
      });
    }
  }

  function tokenize(str) {
    const words = str.toLowerCase().split(/[^a-z0-9µ]+/).filter(Boolean);
    const ngrams = new Set(words);
    for (let i=0; i<words.length-1; i++) ngrams.add(words[i]+' '+words[i+1]);
    for (let i=0; i<words.length-2; i++) ngrams.add(words[i]+' '+words[i+1]+' '+words[i+2]);
    return Array.from(ngrams);
  }

  // ──────────────────────────────────────────────────────────────
  // 1) Standards (meters)
  // ──────────────────────────────────────────────────────────────
  const BENCH_DEPTH = 0.75;   // Bench thickness (front-to-back)
  const BENCH_WIDTH = 1.50;   // One bench segment length (left-to-right)
  const HALLWAY     = 1.00;   // Walkway width
  const CUBBY_DEPTH = 0.50;   // Bottom-wall cubbies (low storage)

  // ──────────────────────────────────────────────────────────────
  // 2) Room dimensions (top-left origin)
  // ──────────────────────────────────────────────────────────────
  const ROOM_H = BENCH_DEPTH + HALLWAY + 3 * BENCH_WIDTH + HALLWAY + CUBBY_DEPTH;
  const ROOM_W =
      BENCH_DEPTH + HALLWAY +
      2 * BENCH_DEPTH + 2 * HALLWAY +
      2 * BENCH_DEPTH + 2 * HALLWAY +
      2 * BENCH_DEPTH + HALLWAY +
      BENCH_DEPTH;

  // ──────────────────────────────────────────────────────────────
  // 3) SVG helpers
  // ──────────────────────────────────────────────────────────────
  const svg  = createEl('svg', {
    viewBox: `0 0 ${ROOM_W} ${ROOM_H}`,
    role: 'img',
    'aria-label': 'Lab floor plan'
  });
  host.appendChild(svg);

  function createEl(tag, attrs = {}, children = []) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    for (const c of children) e.appendChild(c);
    return e;
  }

  function drawRect(x, y, w, h, { fill = '#eee', stroke = '#000', sw = 1.2, cls = '', slug = '' } = {}) {
    const rect = createEl('rect', {
      x, y, width: w, height: h,
      fill, stroke, 'stroke-width': sw, 'vector-effect': 'non-scaling-stroke'
    });
    if (cls) rect.setAttribute('class', cls);
    if (slug) rect.dataset.slug = slug;
    svg.appendChild(rect);
    return rect;
  }

  function outlineRoom() {
    drawRect(0, 0, ROOM_W, ROOM_H, { fill: 'none', stroke: '#000', sw: 2 });
  }

  // ──────────────────────────────────────────────────────────────
  // 4) Compute benches
  // ──────────────────────────────────────────────────────────────
  function computeBenches() {
    const benches = [];

    // Left perimeter benches (orientation left)
    benches.push({ slug: 'left-upper', type: 'bench', orientation: 'left', x: 0, y: 0, w: BENCH_DEPTH, d: BENCH_WIDTH + BENCH_DEPTH });
    benches.push({ slug: 'left-lower', type: 'bench', orientation: 'left', x: 0, y: ROOM_H - 2 * BENCH_WIDTH, w: BENCH_DEPTH, d: BENCH_WIDTH });

    // Top benches (orientation top)
    const topY = 0;
    benches.push({ slug: 'top-corner-extension', type: 'bench', orientation: 'top', x: BENCH_DEPTH, y: topY, w: BENCH_WIDTH + BENCH_DEPTH, d: BENCH_DEPTH });
    benches.push({ slug: 'top-sink-80', type: 'bench', orientation: 'top', x: BENCH_DEPTH + BENCH_WIDTH + BENCH_DEPTH + HALLWAY, y: topY, w: BENCH_WIDTH, d: BENCH_DEPTH });
    benches.push({ slug: 'top-4c', type: 'bench', orientation: 'top', x: BENCH_DEPTH + BENCH_WIDTH + BENCH_DEPTH + HALLWAY + 2 * BENCH_WIDTH, y: topY, w: BENCH_WIDTH, d: BENCH_DEPTH });
    benches.push({ slug: 'top-imaging-area', type: 'bench', orientation: 'top', x: ROOM_W - (1.5 * BENCH_WIDTH), y: topY, w: 1.5 * BENCH_WIDTH, d: BENCH_DEPTH });

    // Right perimeter benches
    const rightX = ROOM_W - BENCH_DEPTH;
    benches.push({ slug: 'right-lower', type: 'bench', orientation: 'right', x: rightX, y: ROOM_H - 1.5 * BENCH_WIDTH, w: BENCH_DEPTH, d: 1.5 * BENCH_WIDTH });
    benches.push({ slug: 'right-upper', type: 'cubby', orientation: 'right', x: rightX, y: ROOM_H - 3 * BENCH_WIDTH, w: BENCH_DEPTH, d: 1.5 * BENCH_WIDTH });

    // Bays (islands)
    const BAY_W = 2 * BENCH_DEPTH;
    const BAY_H = 3 * BENCH_WIDTH;
    const BAY_SPACING = 2 * HALLWAY;
    const BAY_Y = BENCH_DEPTH + HALLWAY;
    const BAY1_X = BENCH_DEPTH + HALLWAY;

    for (let i = 0; i < 3; i++) {
      const baseX = BAY1_X + i * (BAY_W + BAY_SPACING);
      for (let j = 0; j < 3; j++) {
        const segmentY = BAY_Y + j * BENCH_WIDTH;
        benches.push({ slug: `bay${i+1}-left-${j}`,  type: 'bench', orientation: 'left',  x: baseX,              y: segmentY, w: BENCH_DEPTH, d: BENCH_WIDTH });
        benches.push({ slug: `bay${i+1}-right-${j}`, type: 'bench', orientation: 'right', x: baseX + BENCH_DEPTH, y: segmentY, w: BENCH_DEPTH, d: BENCH_WIDTH });
      }
    }

    // Bottom cubbies (between doors)
    const cubbyX = BAY1_X + BAY_W;
    const cubbyW = (BAY1_X + 2 * (BAY_W + BAY_SPACING)) - cubbyX;
    benches.push({ slug: 'bottom-cubbies', type: 'cubby', orientation: 'bottom', x: cubbyX, y: ROOM_H - CUBBY_DEPTH, w: cubbyW, d: CUBBY_DEPTH });

    return benches;
  }


  // ──────────────────────────────────────────────────────────────
  // 5) Render & interactivity
  // ──────────────────────────────────────────────────────────────
  const benches = computeBenches();
  const rectsBySlug = new Map();

  benches.forEach(b => {
    let fill = '#eee';
    let stroke = '#000';
    let sw = 1.2;
    if (b.type === 'bench') { fill = '#f7f8ff'; stroke = '#5e7ea6'; }
    else if (b.type === 'cubby') { fill = '#ededed'; stroke = '#5e7ea6'; if (b.slug === 'bottom-cubbies') stroke = '#aaa'; }

    const name = (BENCH_INFO[b.slug] && (BENCH_INFO[b.slug].name || BENCH_INFO[b.slug].label)) || b.slug;
    const g = createEl('g', { class: 'bench-group', 'data-slug': b.slug });
    svg.appendChild(g);
    const rect = createEl('rect', {
      x: b.x, y: b.y, width: b.w, height: b.d,
      fill, stroke, 'stroke-width': sw, 'vector-effect': 'non-scaling-stroke'
    });
    rect.setAttribute('class', 'bench-rect ' + b.type);
    rect.dataset.slug = b.slug;
    g.appendChild(rect);

    rect.setAttribute('role', 'button');
    rect.setAttribute('tabindex', '0');
    rect.setAttribute('aria-label', name);
    rect.appendChild(createEl('title', {}, [ document.createTextNode(name) ]));

    rect.addEventListener('mouseenter', () => selectBench(b.slug));
    rect.addEventListener('focus',     () => selectBench(b.slug));
    rect.addEventListener('click',     () => selectBench(b.slug));
    rect.addEventListener('keydown',   (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectBench(b.slug); } });


    rectsBySlug.set(b.slug, rect);
  });

  outlineRoom();

  const searchEl = document.getElementById('lab-search');
  searchEl.addEventListener('input', () => {
    const q = searchEl.value.toLowerCase().trim();
    if (!q) { clearHighlights(); hideSuggest(); resultsBox.hidden = true; return; }
    // exact n-gram hits
    const exact = INDEX[q] || [];
    // partial matches over tokens and items
    const partial = findPartial(q, 8);
    showSuggest(q, [...new Set([...exact, ...partial.keys])].slice(0, 8));
    highlightHits(exact.length ? exact : partial.keys.map(k => k));
  });

  function findPartial(q, limit=8) {
    const keys = []; const display = [];
    // scan items for substring matches
    for (const [key, entry] of Object.entries(CONSUMABLES)) {
      for (const item of (entry.items||[])) {
        if (item.toLowerCase().includes(q)) { keys.push(key); display.push({ key, item }); break; }
      }
      if (keys.length >= limit) break;
    }
    return { keys, display };
  }

  function showSuggest(query, keys) {
    suggestBox.innerHTML = '';
    if (!keys.length) { hideSuggest(); return; }
    const list = document.createElement('div'); list.className = 'list';
    // header
    const hdr = document.createElement('div'); hdr.className = 'item'; hdr.style.fontWeight = '600'; hdr.textContent = 'Results for: ' + query; list.appendChild(hdr);
    keys.forEach(k => {
      const [benchSlug, pos, drawerId] = k.split(':');
      const item = document.createElement('div'); item.className = 'item';
      const label = (CONS[ k ] && CONS[ k ].items && CONS[ k ].items[0]) ? CONS[k].items[0] : `${benchSlug} • ${pos}:${drawerId}`;
      item.textContent = label;
      item.addEventListener('mousedown', (e) => { e.preventDefault(); applySelection(k); });
      list.appendChild(item);
    });
    suggestBox.appendChild(list);
    suggestBox.hidden = false;
  }
  function hideSuggest() { suggestBox.hidden = true; suggestBox.innerHTML=''; }

  function applySelection(key) {
    hideSuggest();
    const [benchSlug] = key.split(':');
    selectBench(benchSlug);
    clearHighlights();
    const rect = rectsBySlug.get(benchSlug); if (rect) rect.classList.add('highlight');
    // results panel summary
    resultsBox.hidden = false; resultsBox.innerHTML = '';
    const h = document.createElement('h4'); h.textContent = 'Selection'; resultsBox.appendChild(h);
    const p = document.createElement('div'); p.className='hit'; p.textContent = key; resultsBox.appendChild(p);
  }

  function highlightHits(keys) {
    clearHighlights();
    if (!keys.length) return;
    keys.forEach(k => {
      const [benchSlug] = k.split(':');
      const rect = rectsBySlug.get(benchSlug);
      if (rect) rect.classList.add('highlight');
      selectBench(benchSlug);
    });
  }

  function clearHighlights() {
    rectsBySlug.forEach(r => r.classList.remove('highlight'));
  }

  function drawerKey(benchSlug, stackPos, drawerId) {
    return `${benchSlug}:${stackPos}:${drawerId}`;
  }

  // Human-facing numbering helpers
  function parseSegmentIndex(slug) {
    const m = /-(\d+)$/.exec(slug);
    return m ? parseInt(m[1], 10) : null;
  }
  function humanSegmentLabel(slug) {
    const idx = parseSegmentIndex(slug);
    return idx == null ? null : (idx + 1); // 1-based for UI
  }

  window.LAB_BENCHES = Object.fromEntries(benches.map(b => [b.slug, b]));

  function formatEquipment(eq) {
    if (!eq) return '';
    if (Array.isArray(eq)) {
      return eq.map(e => typeof e === 'string'
        ? e
        : `${e.name}${e.type ? ` (${e.type})` : ''}`
      ).join(', ');
    }
    return String(eq);
  }

  function showDrawerInfo(benchSlug, stack, j, dMeta) {
    // augment panel with focused drawer info and consumables
    const key = drawerKey(benchSlug, stack.pos || '', dMeta.id || `drawer${j+1}`);
    const entry = CONSUMABLES && CONSUMABLES[key];
    // Ensure bench panel is showing
    selectBench(benchSlug);
    // Append drawer details at the end of the panel
    const dl = panel.querySelector('dl');
    const add = (dt, dd) => { const dte = document.createElement('dt'); dte.textContent = dt; dl.appendChild(dte); const dde = document.createElement('dd'); dde.textContent = dd; dl.appendChild(dde); };
    add('Focused drawer', `${(stack.pos||'')}:drawer ${j+1}${dMeta.id ? ` [${dMeta.id}]` : ''}`);
    if (dMeta.label) add('Label', dMeta.label);
    if (entry && Array.isArray(entry.items) && entry.items.length) add('Items', entry.items.join(', '));
  }

  function selectBench(slug) {
    // visual state
    for (const r of rectsBySlug.values()) r.classList.remove('active');
    const active = rectsBySlug.get(slug);
    if (active) active.classList.add('active');

    // data
    const geo = window.LAB_BENCHES[slug];
    const meta = BENCH_INFO[slug] || {};

    // panel render
    panel.innerHTML = '';
    const title = document.createElement('h3');
    title.textContent = meta.name || meta.label || slug;
    const dl = document.createElement('dl');

    function addRow(dt, dd) {
      const dte = document.createElement('dt'); dte.textContent = dt; dl.appendChild(dte);
      const dde = document.createElement('dd'); dde.textContent = dd; dl.appendChild(dde);
    }

    addRow('Slug', slug);
    addRow('Type', geo.type);
    addRow('Orientation', geo.orientation);
    const segHuman = humanSegmentLabel(slug);
    if (segHuman != null) addRow('Segment', `Segment ${segHuman}`);
    addRow('Size (w×d, m)', `${round(geo.w)} × ${round(geo.d)}`);
    if (meta.owner) addRow('Owner', meta.owner);
    if (meta.equipment) addRow('Equipment', formatEquipment(meta.equipment));
    // Cabinet stack details
    if (Array.isArray(meta.stacks) && meta.stacks.length) {
      meta.stacks.forEach((stack, i) => {
        const pos = stack.pos || `slot-${i+1}`; // human-facing, 1-based fallback
        const kind = stack.kind || '';
        const width = stack.width || '';
        const drawers = stack.drawers ? stack.drawers.length : 0;
        addRow(`Stack ${i+1} (${pos})`, `kind: ${kind}, width: ${width}${drawers ? `, drawers: ${drawers}` : ''}`);
        if (stack.drawers && stack.drawers.length) {
          stack.drawers.forEach((dr, j) => {
            const drawerLabel = dr.label || `drawer ${j+1}`; // human-facing 1-based
            addRow(`\u00A0\u00A0Drawer ${j+1}`, `${drawerLabel}${dr.id ? ` [${dr.id}]` : ''}`);
            const posKey = stack.pos || String(i);
            const key = drawerKey(slug, posKey, dr.id || `drawer${j+1}`);
            const entry = CONSUMABLES && CONSUMABLES[key];
            if (entry && Array.isArray(entry.items) && entry.items.length) {
              addRow(`\u00A0\u00A0\u00A0Items`, entry.items.join(', '));
            }
          });
        }
      });
    }
    if (meta.notes) addRow('Notes', meta.notes);

    panel.appendChild(title);
    panel.appendChild(dl);
    panel.hidden = false;
  }

  function round(n) { return Math.round(n * 100) / 100; }
})();
</script>