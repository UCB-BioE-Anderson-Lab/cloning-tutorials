# Protocols

This page lets you run any protocol defined in the `modules/` folder.
Pick a protocol, answer its questions, then generate the expanded steps.

<div id="protocol-list"></div>

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
</style>
<style>
  .proto-card { border: 1px solid #ddd; border-radius: 6px; padding: 16px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
  @media print {
    body * { visibility: hidden !important; }
    .proto-print-root, .proto-print-root * { visibility: visible !important; }
    .proto-print-root { position: absolute; inset: 0; margin: 0; padding: 0; box-shadow: none; border: none; }
  }
</style>

<div id="controls" style="display:grid;gap:0.75rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));align-items:end;margin:1rem 0;">
  <label>Choose protocol
    <select id="protocol_select"></select>
  </label>
  <label>Or enter ID
    <input id="protocol_id" type="text" placeholder="e.g. tss_comp_cells" />
  </label>
  <div>
    <button id="load">Load</button>
  </div>
</div>

<div id="dynamic-inputs" style="display:grid;gap:0.5rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));align-items:end;margin:0.5rem 0;"></div>

<div style="display:flex;gap:0.5rem;margin:0.5rem 0;">
  <button id="generate" disabled>Generate</button>
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
<div id="protocol-output-card" class="proto-card" aria-live="polite">
  <div id="protocol-output" style="white-space:pre-wrap;"></div>
</div>

<script type="module" src="../renderer.js"></script>
<script>
  function $(id){ return document.getElementById(id); }

  let lastProto = null; // { id, title, text, html }

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
  const idInput = $("protocol_id");
  let currentInputs = [];
  let currentProtocol = null;

  async function populateSelect(){
    select.innerHTML = '';
    const opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = '(select or type an ID)';
    select.appendChild(opt0);

    const index = await tryLoadIndex();
    if (Array.isArray(index) && index.length){
      for (const item of index){
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = item.title ? `${item.title} — ${item.id}` : item.id;
        select.appendChild(opt);
      }
    }
  }

  async function renderProtocolList(){
    const listEl = document.getElementById("protocol-list");
    const index = await tryLoadIndex();
    if (!listEl) return;
    if (!Array.isArray(index) || !index.length){
      listEl.innerHTML = "";
      return;
    }
    const items = index.map(p => `<li><b>${p.title || p.id}</b> <code>${p.id}</code></li>`).join("");
    listEl.innerHTML = `<h3>Available Protocols</h3><ul>${items}</ul>`;
  }

  async function loadProtocolInputs(pid){
    if (!pid) return;
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

  $("load").addEventListener('click', async ()=>{
    const pid = (idInput.value || select.value).trim();
    await loadProtocolInputs(pid);
  });

  select.addEventListener('change', async ()=>{
    if (!select.value) return;
    idInput.value = select.value;
    await loadProtocolInputs(select.value);
  });

  idInput.addEventListener('keydown', async (e)=>{
    if (e.key === 'Enter'){
      const pid = (idInput.value || select.value).trim();
      if (pid) await loadProtocolInputs(pid);
    }
  });

  $("generate").addEventListener('click', async ()=>{
    if (!currentProtocol) return;
    const vals = readValues(currentInputs);
    try {
      const proto = await Protocols.runProtocol(currentProtocol, vals);
      lastProto = { id: currentProtocol, title: proto.title || currentProtocol, text: proto.text || '', html: proto.html || '' };
      $("protocol-output").innerHTML = lastProto.html || '<pre>' + (lastProto.text || '') + '</pre>';
      $("proto-tools").style.display = 'flex';
      const share = buildShareURL(vals, true);
      history.replaceState(null, '', share);
    } catch(e){
      $("protocol-output").textContent = String(e.message || e);
      $("proto-tools").style.display = 'none';
    }
  });

  $("clear").addEventListener('click', ()=>{
    $("protocol-output").innerHTML = '';
    $("proto-tools").style.display = 'none';
    lastProto = null;
  });

  async function copyMarkdown(){
    if (!lastProto) return;
    const title = '# ' + (lastProto.title || lastProto.id || 'Protocol');
    const md = lastProto.text ? `${title}\n\n${lastProto.text}` : title;
    await navigator.clipboard.writeText(md);
  }
  async function copyHTML(){
    if (!lastProto || !lastProto.html) return;
    if (navigator.clipboard && window.ClipboardItem){
      const data = new ClipboardItem({ 'text/html': new Blob([lastProto.html], { type: 'text/html' }) });
      await navigator.clipboard.write([data]);
    } else {
      const tmp = document.createElement('div');
      tmp.contentEditable = 'true';
      tmp.style.position = 'fixed'; tmp.style.left = '-9999px';
      tmp.innerHTML = lastProto.html;
      document.body.appendChild(tmp);
      const range = document.createRange(); range.selectNodeContents(tmp);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      document.execCommand('copy');
      document.body.removeChild(tmp);
    }
  }
  function downloadMD(){
    if (!lastProto) return;
    const name = (lastProto.title || lastProto.id || 'protocol').replace(/\s+/g,'_').toLowerCase() + '.md';
    const blob = new Blob([lastProto.text || ''], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  }
  function openPrintView(){
    if (!lastProto) return;
    const title = lastProto.title || lastProto.id || 'Protocol';
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
      <style>
        body{margin:1rem;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif;background:#f7f7f8}
        .proto-card{max-width:800px;margin:0 auto;border:1px solid #ddd;border-radius:6px;padding:16px;background:#fff}
        h1{margin-top:0}
        @media print { body{background:#fff} .proto-card{border:none;box-shadow:none;margin:0;max-width:none} }
      </style>
    </head><body>
      <div class="proto-card proto-print-root">
        <h1>${title}</h1>
        ${lastProto.html || '<pre>'+ (lastProto.text || '') + '</pre>'}
      </div>
    </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=> URL.revokeObjectURL(url), 60000);
  }
  function printNow(){
    if (!lastProto) return;
    const wrap = document.createElement('div');
    wrap.className = 'proto-card proto-print-root';
    wrap.innerHTML = lastProto.html || '<pre>'+ (lastProto.text || '') + '</pre>';
    document.body.appendChild(wrap);
    window.print();
    document.body.removeChild(wrap);
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
    if (!currentProtocol) return;
    const vals = readValues(currentInputs);
    const url = buildShareURL(vals, true);
    await navigator.clipboard.writeText(url);
  });

  async function bootFromQuery(){
    const q = new URLSearchParams(location.search);
    const id = q.get('id');
    if (!id) return;
    $("protocol_id").value = id;
    if ([...select.options].some(o => o.value === id)) select.value = id;
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
    if (q.get('autogen') === '1') $("generate").click();
  }
  (async ()=>{ await populateSelect(); await renderProtocolList(); await bootFromQuery(); })();
</script>