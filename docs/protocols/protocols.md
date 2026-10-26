# Protocol Builder

<style>
  /* Keep the control fields from overlapping on narrow or themed layouts */
  #controls { column-gap: 0.75rem; row-gap: 0.75rem; }
  #controls label { display: flex; flex-direction: column; }
  #controls label > input,
  #controls label > select { width: 100%; max-width: 100%; box-sizing: border-box; margin-top: 0.35rem; }
  /* Three-column layout on wider screens */
  @media (min-width: 640px) {
    #controls { grid-template-columns: minmax(260px,1fr) minmax(260px,1fr) auto !important; }
  }
  /* Two columns on very narrow screens */
  @media (max-width: 639px) {
    #controls { grid-template-columns: 1fr !important; }
  }

  .proto-combo { position: relative; }
  .proto-combo input { width: 100%; box-sizing: border-box; margin-top: 0.35rem; }
  #protocol_options {
    position: absolute; z-index: 60; left: 0; right: 0; top: 100%;
    margin: 0.15rem 0 0; padding: 0; list-style: none;
    max-height: 18rem; overflow-y: auto;
    border: 1px solid var(--md-default-fg-color--lighter, #ccc); border-radius: 4px;
    background: var(--md-default-bg-color, #fff); box-shadow: 0 4px 14px rgba(0,0,0,.14);
  }
  #protocol_options li { padding: 0.35rem 0.6rem; cursor: pointer; line-height: 1.25; }
  #protocol_options li[aria-selected="true"], #protocol_options li:hover {
    background: var(--md-accent-fg-color--transparent, #e3f2fd);
  }
  #protocol_options li .pid { display: block; opacity: 0.62; font-size: 0.82em; }
  #protocol_options li.proto-none { color: var(--md-default-fg-color--light, #777); cursor: default; }
  #protocol_options li.proto-none:hover { background: none; }
  .proto-vh { position: absolute !important; width: 1px; height: 1px; overflow: hidden;
              clip: rect(0 0 0 0); white-space: nowrap; }
  @media print { .proto-combo { display: none; } }
</style>
<style>
  .proto-card { border: 1px solid #ddd; border-radius: 6px; padding: 16px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
  .proto-card h1, .proto-card h2, .proto-card h3 { margin-top: 0.6rem; margin-bottom: 0.4rem; }
  .proto-card p { margin: 0.35rem 0; line-height: 1.35; }
  .proto-card ol { margin: 0.4rem 0 0.6rem 1.2rem; padding: 0; }
  .proto-card li { margin: 0.2rem 0 0.35rem 0; }
  /* Avoid awkward page breaks in lists/sections */
  @media print {
    @page { size: letter portrait; margin: 12mm; }
    html, body { background: #fff !important; }
    #protocol-videos { display: none; }
    .proto-card { border: none; box-shadow: none; max-width: none; }
    .proto-card { font-size: 12pt; line-height: 1.35; }
    .proto-card h1, .proto-card h2, .proto-card h3 { page-break-after: avoid; break-after: avoid; }
    .proto-card ol, .proto-card ul { page-break-inside: avoid; break-inside: avoid; }
    .proto-card li, .proto-card details { page-break-inside: avoid; break-inside: avoid; }
  }
</style>

<div id="controls" style="display:grid;gap:0.75rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));align-items:end;margin:1rem 0;">
  <label for="protocol_filter">Choose protocol
    <div class="proto-combo">
      <input id="protocol_filter" type="text" role="combobox" aria-expanded="false"
             aria-controls="protocol_options" aria-autocomplete="list" autocomplete="off"
             placeholder="Type to search — tss, miniprep, gel…">
      <ul id="protocol_options" role="listbox" aria-label="Protocols" hidden></ul>
    </div>
    <select id="protocol_select" class="proto-vh" tabindex="-1" aria-hidden="true"></select>
  </label>
</div>

<div id="dynamic-inputs" style="display:grid;gap:0.5rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));align-items:end;margin:0.5rem 0;"></div>

<div style="display:flex;gap:0.5rem;margin:0.5rem 0;">
  <button id="generate" disabled>Recalculate</button>
  <button id="clear" type="button">Clear</button>
</div>

<hr/>

<div id="proto-tools" style="display:none;gap:0.5rem;margin:0.5rem 0;align-items:center;flex-wrap:wrap;">
  <button id="copy-md">Copy Markdown</button>
  <button id="copy-html">Copy Rich Text</button>
  <button id="download-md">Download .md</button>
  <button id="copy-link">Copy Link</button>
  <button id="open-print">Open Print View</button>
  <button id="print-now">Print</button>
</div>
<!-- Videos for the chosen protocol, from assets/videos.json. Outside the card, so they stay
     out of the copied markdown and the print view. -->
<div id="protocol-videos"></div>
<div id="protocol-output-card" class="proto-card" aria-live="polite">
  <div id="protocol-output" style="white-space:pre-wrap;"></div>
</div>

<script type="module" src="../renderer.js"></script>
<script>
  function $(id){ return document.getElementById(id); }

  let lastProto = null; // { id, title, text, html }

  function notify(msg){
    try { console.log(msg); } catch {}
    const bar = document.createElement('div');
    bar.textContent = msg;
    bar.style.cssText = 'position:fixed;bottom:12px;left:12px;background:#222;color:#fff;padding:8px 10px;border-radius:6px;z-index:9999;opacity:0.95;font-size:12px';
    document.body.appendChild(bar);
    setTimeout(()=> bar.remove(), 1800);
  }
  async function safeClipboardWrite(text){
    try {
      if (navigator.clipboard && navigator.clipboard.writeText){
        await navigator.clipboard.writeText(text);
        notify('Copied to clipboard');
        return true;
      }
    } catch {}
    // Fallback via hidden textarea
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly','');
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    notify(ok ? 'Copied to clipboard' : 'Copy failed');
    return ok;
  }

  async function tryLoadIndex(){
    try {
      const res = await fetch("../index.json", { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  }

  function buildInputField(input){
    const wrap = document.createElement('label');
    wrap.textContent = input.label || input.name;

    let el;
    if (input.type === 'boolean') {
      el = document.createElement('input');
      el.type = 'checkbox';
      el.checked = !!input.default;
    } else if (input.type === 'number') {
      el = document.createElement('input');
      el.type = 'number';
      if (input.step) el.step = input.step;
      if (input.default !== undefined) el.value = input.default;
    } else if (input.type === 'select' && Array.isArray(input.options)) {
      el = document.createElement('select');
      for (const opt of input.options){
        const o = document.createElement('option');
        o.value = String(opt);
        o.textContent = String(opt);
        if (input.default !== undefined && String(opt) === String(input.default)) o.selected = true;
        el.appendChild(o);
      }
    } else {
      el = document.createElement('input');
      el.type = 'text';
      if (input.placeholder) el.placeholder = input.placeholder;
      if (input.default !== undefined) el.value = input.default;
    }

    el.id = `in_${input.name}`;
    wrap.appendChild(document.createElement('br'));
    wrap.appendChild(el);
    return wrap;
  }

  function readValues(inputs){
    const vals = {};
    for (const inp of inputs){
      const el = $(`in_${inp.name}`);
      if (!el) continue;
      if (inp.type === 'boolean') vals[inp.name] = !!el.checked;
      else if (inp.type === 'number') vals[inp.name] = parseFloat(el.value || inp.default || 0);
      else vals[inp.name] = el.value || inp.default || '';
    }
    return vals;
  }

  const dyn = $("dynamic-inputs");
  const select = $("protocol_select");
  let currentInputs = [];
  let currentProtocol = null;

  // THE SELECT IS STILL THE VALUE, the combobox is only a way of reaching it.
  //
  // Everything downstream — bootFromQuery, the share links, the change handler — reads
  // select.value, so replacing the element outright would have meant touching all of it. The
  // select stays in the DOM holding the answer and the combobox writes to it, which keeps the
  // ?id=… links working untouched.
  let comboItems = [];

  async function populateSelect(){
    select.innerHTML = '';
    const opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = '(select a protocol)';
    select.appendChild(opt0);

    const index = await tryLoadIndex();
    if (Array.isArray(index) && index.length){
      for (const item of index){
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = item.title ? `${item.title} — ${item.id}` : item.id;
        select.appendChild(opt);
      }
      comboItems = index.map(it => ({
        id: it.id,
        title: it.title || it.id,
        hay: `${it.title || ''} ${it.id} ${String(it.id).replace(/_/g, ' ')}`.toLowerCase()
      }));
    }
  }

  // ---- combobox ----------------------------------------------------------
  const filterEl = $("protocol_filter");
  const listEl = $("protocol_options");
  let shown = [];
  let active = -1;

  // EVERY WORD HAS TO MATCH, IN ANY ORDER. "tss prep" and "prep tss" both find Preparation of
  // TSS, and the id is searched with underscores turned to spaces so "comp cells" finds
  // tss_comp_cells. Substring rather than prefix, because people type the distinctive middle of
  // a name — "kcm", "zymo", "600" — far more often than its first word.
  function matches(q){
    const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!toks.length) return comboItems.slice();
    return comboItems.filter(it => toks.every(t => it.hay.includes(t)));
  }

  function closeList(){
    listEl.hidden = true;
    filterEl.setAttribute('aria-expanded', 'false');
    active = -1;
  }

  function renderList(q){
    shown = matches(q);
    listEl.innerHTML = '';
    if (!shown.length){
      const li = document.createElement('li');
      li.className = 'proto-none';
      li.textContent = `No protocol matches “${q}”`;
      listEl.appendChild(li);
    } else {
      shown.forEach((it, i) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.id = `proto_opt_${i}`;
        li.setAttribute('aria-selected', String(i === active));
        li.innerHTML = `${it.title.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}<span class="pid">${it.id}</span>`;
        li.addEventListener('mousedown', (e) => { e.preventDefault(); choose(i); });
        listEl.appendChild(li);
      });
    }
    listEl.hidden = false;
    filterEl.setAttribute('aria-expanded', 'true');
  }

  function highlight(i){
    active = i;
    [...listEl.children].forEach((li, k) => li.setAttribute('aria-selected', String(k === i)));
    const el = listEl.children[i];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    filterEl.setAttribute('aria-activedescendant', el ? el.id : '');
  }

  function choose(i){
    const it = shown[i];
    if (!it) return;
    filterEl.value = it.title;
    select.value = it.id;
    closeList();
    select.dispatchEvent(new Event('change'));
  }

  filterEl.addEventListener('input', () => renderList(filterEl.value));
  filterEl.addEventListener('focus', () => renderList(filterEl.value));
  filterEl.addEventListener('blur', () => setTimeout(closeList, 120));
  filterEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      e.preventDefault();
      if (listEl.hidden) { renderList(filterEl.value); }
      if (!shown.length) return;
      highlight(e.key === 'ArrowDown'
        ? (active + 1) % shown.length
        : (active <= 0 ? shown.length - 1 : active - 1));
    } else if (e.key === 'Enter'){
      // ENTER WITH ONE MATCH TAKES IT even if nothing is highlighted: having typed enough to
      // leave a single protocol standing, being made to press Down first is a keystroke that
      // tells you nothing.
      if (!listEl.hidden && (active >= 0 || shown.length === 1)){
        e.preventDefault();
        choose(active >= 0 ? active : 0);
      }
    } else if (e.key === 'Escape'){
      closeList();
    }
  });

  // renderer.js is a module, so it can load after this script runs; wait for it before using Protocols.
  function protocolsReady(){
    if (window.Protocols) return Promise.resolve();
    return new Promise(res => window.addEventListener('protocols-ready', res, { once: true }));
  }

  async function loadProtocolInputs(pid){
    if (!pid) return;
    await protocolsReady();
    try {
      currentInputs = await Protocols.loadInputs(pid);
      currentProtocol = pid;
      dyn.innerHTML = '';
      for (const inp of currentInputs){ dyn.appendChild(buildInputField(inp)); }
      $("generate").disabled = false;
    } catch (e){
      dyn.innerHTML = `<pre>${e.message || e}</pre>`;
      $("generate").disabled = true;
    }
  }

select.addEventListener('change', async ()=>{
    if (!select.value) return;
    await loadProtocolInputs(select.value);
    // Auto-generate with current/default values on selection
    $("generate").click();
  });

  $("generate").addEventListener('click', async ()=>{
    if (!currentProtocol) return;
    const vals = readValues(currentInputs);
    await protocolsReady();
    try {
      const proto = await Protocols.runProtocol(currentProtocol, vals);
      lastProto = { id: currentProtocol, title: proto.title || currentProtocol, text: proto.text || '', html: proto.html || '' };
      $("protocol-output").innerHTML = lastProto.html || '<pre>' + (lastProto.text || '') + '</pre>';
      $("proto-tools").style.display = 'flex';
      showVideos(currentProtocol, vals);
      const share = buildShareURL(vals, true);
      history.replaceState(null, '', share);
      notify('Recalculated. Tools unlocked.');
    } catch(e){
      $("protocol-output").textContent = String(e.message || e);
      $("proto-tools").style.display = 'none';
    }
  });

  async function showVideos(id, vals){
    const box = $("protocol-videos");
    box.replaceChildren();
    if (!window.LabVideos) return;
    const cards = (await LabVideos.forProtocol(id, vals)).map(LabVideos.render).filter(Boolean);
    box.replaceChildren(...cards);
  }

  $("clear").addEventListener('click', ()=>{
    $("protocol-videos").replaceChildren();
    $("protocol-output").innerHTML = '';
    $("proto-tools").style.display = 'none';
    lastProto = null;
  });

  async function copyMarkdown(){
    if (!lastProto) { notify('Nothing to copy yet'); return; }
    const title = '# ' + (lastProto.title || lastProto.id || 'Protocol');
    const md = lastProto.text ? `${title}\n\n${lastProto.text}` : title;
    await safeClipboardWrite(md);
  }
  async function copyHTML(){
    if (!lastProto) { notify('Nothing to copy yet'); return; }
    const html = lastProto.html || ('<pre>' + (lastProto.text || '') + '</pre>');
    try {
      if (navigator.clipboard && window.ClipboardItem){
        const item = new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }) });
        await navigator.clipboard.write([item]);
        notify('Rich text copied');
        return;
      }
    } catch {}
    // Fallback: select a temp contentEditable div
    const tmp = document.createElement('div');
    tmp.contentEditable = 'true';
    tmp.style.position = 'fixed'; tmp.style.left = '-9999px';
    tmp.innerHTML = html; document.body.appendChild(tmp);
    const range = document.createRange(); range.selectNodeContents(tmp);
    const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
    const ok = document.execCommand('copy');
    document.body.removeChild(tmp);
    notify(ok ? 'Rich text copied' : 'Copy failed');
  }
  function downloadMD(){
    if (!lastProto) { notify('Nothing to download'); return; }
    const name = (lastProto.title || lastProto.id || 'protocol').replace(/\s+/g,'_').toLowerCase() + '.md';
    const title = '# ' + (lastProto.title || lastProto.id || 'Protocol');
    const body = lastProto.text ? `${title}\n\n${lastProto.text}` : title;
    const blob = new Blob([body], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
    notify('Markdown downloaded');
  }
  // Helper to snapshot protocol output HTML, preserving <details> expanded/collapsed state
  function getProtocolHTMLForPrint(){
    const live = document.getElementById('protocol-output');
    if (!live || !live.firstChild){
      return lastProto && (lastProto.html || ('<pre>'+ (lastProto.text || '') + '</pre>')) || '';
    }
    // Clone the current DOM so we can normalize <details> state via attributes
    const clone = live.cloneNode(true);
    const liveDetails = live.querySelectorAll('details');
    const cloneDetails = clone.querySelectorAll('details');
    // Mirror state: if a details is currently open in the UI, ensure the attribute exists in the clone; otherwise remove it.
    for (let i = 0; i < cloneDetails.length; i++){
      const src = liveDetails[i];
      const dst = cloneDetails[i];
      if (!src || !dst) continue;
      if (src.open) dst.setAttribute('open',''); else dst.removeAttribute('open');
    }
    // Return inner HTML of the normalized clone container
    return clone.innerHTML;
  }
  function openPrintView(){
    if (!lastProto) { notify('Generate a protocol first'); return; }
    const title = lastProto.title || lastProto.id || 'Protocol';
    const inner = getProtocolHTMLForPrint();
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
      <style>
        body{margin:1rem;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif;background:#f7f7f8}
        .proto-card{max-width:800px;margin:0 auto;border:1px solid #ddd;border-radius:6px;padding:16px;background:#fff}
        .proto-card h1, .proto-card h2, .proto-card h3 { margin-top: 0.6rem; margin-bottom: 0.4rem; }
        .proto-card p { margin: 0.35rem 0; line-height: 1.35; }
        .proto-card ol { margin: 0.4rem 0 0.6rem 1.2rem; padding: 0; }
        .proto-card li { margin: 0.2rem 0 0.35rem 0; }
        @media print {
          @page { size: letter portrait; margin: 12mm; }
          body{background:#fff}
          .proto-card{border:none;box-shadow:none;margin:0;max-width:none}
          .proto-card h1, .proto-card h2, .proto-card h3 { page-break-after: avoid; break-after: avoid; }
          .proto-card ol, .proto-card ul { page-break-inside: avoid; break-inside: avoid; }
          .proto-card li, .proto-card details { page-break-inside: avoid; break-inside: avoid; }
        }
      </style>
    </head><body>
      <div class="proto-card proto-print-root">
        <h1>${title}</h1>
        ${inner}
      </div>
    </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=> URL.revokeObjectURL(url), 60000);
    notify('Opened print view');
  }
  function printNow(){
    if (!lastProto) { notify('Generate a protocol first'); return; }
    const title = lastProto.title || lastProto.id || 'Protocol';
    const inner = getProtocolHTMLForPrint();
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
      <style>
        @page { size: letter portrait; margin: 12mm; }
        body{margin:1rem;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif;background:#fff}
        .proto-card{max-width:800px;margin:0 auto;border:none;border-radius:0;padding:0;background:#fff;font-size:12pt;line-height:1.35}
        .proto-card h1, .proto-card h2, .proto-card h3 { margin-top: 0.6rem; margin-bottom: 0.4rem; page-break-after: avoid; break-after: avoid; }
        .proto-card p { margin: 0.35rem 0; }
        .proto-card ol { margin: 0.4rem 0 0.6rem 1.2rem; padding: 0; }
        .proto-card li, .proto-card details { page-break-inside: avoid; break-inside: avoid; }
      </style>
    </head><body>
      <div class="proto-card">
        <h1>${title}</h1>
        ${inner}
      </div>
      <script>
        // Respect current collapsed/expanded state (no auto-open)
        setTimeout(()=>{ try { window.print(); } catch {} }, 50);
      <\/script>
    </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=> URL.revokeObjectURL(url), 60000);
  }
  function buildShareURL(vals, autogen=true){
    if (!currentProtocol) return location.href;
    const q = new URLSearchParams();
    q.set('id', currentProtocol);
    if (autogen) q.set('autogen','1');
    (currentInputs || []).forEach(inp=>{
      const v = vals?.[inp.name];
      if (v !== undefined && v !== '') q.append(inp.name, String(v));
    });
    return `${location.origin}${location.pathname}?${q.toString()}`;
  }
  $("copy-link").addEventListener('click', async ()=>{
    if (!currentProtocol) { notify('Pick a protocol first'); return; }
    const vals = readValues(currentInputs);
    const url = buildShareURL(vals, true);
    const ok = await safeClipboardWrite(url);
    if (!ok) {
      // As a last resort, show the URL in a prompt
      window.prompt('Copy this URL:', url);
    }
  });

  $("copy-md").addEventListener('click', copyMarkdown);
  $("copy-html").addEventListener('click', copyHTML);
  $("download-md").addEventListener('click', downloadMD);
  $("open-print").addEventListener('click', openPrintView);
  $("print-now").addEventListener('click', printNow);

  async function bootFromQuery(){
    const q = new URLSearchParams(location.search);
    const id = q.get('id');
    if (!id) return;
    if ([...select.options].some(o => o.value === id)) select.value = id;
    const hit = comboItems.find(it => it.id === id);
    if (hit) filterEl.value = hit.title;
    await loadProtocolInputs(id);
    (currentInputs || []).forEach(inp=>{
      const el = document.getElementById(`in_${inp.name}`);
      if (!el) return;
      const vals = q.getAll(inp.name);
      if (!vals.length) return;
      if (inp.type === 'boolean'){
        const v = q.get(inp.name);
        el.checked = (v === 'true' || v === '1');
      } else {
        el.value = vals[vals.length - 1];
      }
    });
    const autogen = q.get('autogen');
    if (autogen === '1' || autogen === 'true') {
      $("generate").click();
    }
  }
  (async ()=>{ await populateSelect(); await bootFromQuery(); })();
</script>