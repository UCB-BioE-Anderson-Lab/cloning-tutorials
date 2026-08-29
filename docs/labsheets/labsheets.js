// labsheets.js
// Builds printable labsheets for a 140L experiment.
//
// A labsheet is a protocol plus identity plus a sample table. The protocol half is
// rendered by the Protocol Builder's own renderer, from the same unit-op modules the
// protocol view uses, so the two cannot drift apart. Nothing here restates a procedure.

const $ = (id) => document.getElementById(id);

const state = {
  experiments: [],
  exp: null,
  clones: [],
  built: null,
};

// ---------- loading ----------

async function waitForProtocols(timeoutMs = 10000) {
  const start = Date.now();
  while (!window.Protocols) {
    if (Date.now() - start > timeoutMs) throw new Error('Protocol renderer did not load.');
    await new Promise((r) => setTimeout(r, 40));
  }
  return window.Protocols;
}

function parseTSV(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim());
  const head = lines.shift().split('\t');
  return lines.map((l) => {
    const cells = l.split('\t');
    const row = {};
    head.forEach((h, i) => (row[h] = (cells[i] ?? '').trim()));
    return row;
  });
}

async function boot() {
  try {
    state.experiments = await (await fetch('../experiments.json')).json();
  } catch (err) {
    $('ls-error').textContent = 'Could not load experiments.json — ' + err.message;
    $('ls-error').hidden = false;
    return;
  }

  const sel = $('ls-experiment');
  sel.innerHTML = state.experiments
    .map((e) => `<option value="${e.id}">${e.title}</option>`)
    .join('');
  sel.addEventListener('change', () => selectExperiment(sel.value));

  await selectExperiment(state.experiments[0].id);
  applyURL();
}

async function selectExperiment(id) {
  state.exp = state.experiments.find((e) => e.id === id);
  const exp = state.exp;
  $('ls-subtitle').textContent = exp.subtitle || '';

  try {
    state.clones = parseTSV(await (await fetch('../' + exp.catalogue)).text());
  } catch (err) {
    state.clones = [];
    $('ls-error').textContent = 'Could not load the clone catalogue — ' + err.message;
    $('ls-error').hidden = false;
  }

  // reference checkboxes
  $('ls-refs').innerHTML = exp.references
    .map(
      (r) => `<label class="ls-check">
        <input type="checkbox" value="${r.label}" ${r.default ? 'checked' : ''}
               ${r.required ? 'data-required="1"' : ''}>
        <span><b>${r.label}</b> — ${r.note}${r.required ? ' <em>(required)</em>' : ''}</span>
      </label>`
    )
    .join('');
  $('ls-refs').addEventListener('change', onSelectionChange);

  // clone picker
  renderCloneList('');
  $('ls-clone-search').addEventListener('input', (e) => renderCloneList(e.target.value));
  onSelectionChange();
}

function renderCloneList(filter) {
  const f = filter.trim().toLowerCase();
  const chosen = new Set(selectedClones());
  const rows = state.clones.filter(
    (c) => !f || c.clone.toLowerCase().includes(f) || c.date.includes(f)
  );
  $('ls-clone-count').textContent =
    `${rows.length} of ${state.clones.length} clones` + (f ? ` matching “${filter}”` : '');
  $('ls-clones').innerHTML = rows
    .map(
      (c) => `<label class="ls-check ls-clone">
        <input type="checkbox" value="${c.clone}" ${chosen.has(c.clone) ? 'checked' : ''}>
        <span><b>${c.clone}</b>
          <small>${c.date}${c.sequenced === 'yes' ? '' : ' · unverified read'}</small></span>
      </label>`
    )
    .join('');
  $('ls-clones').addEventListener('change', onSelectionChange);
}

// ---------- selection maths ----------

const selectedRefs = () =>
  [...document.querySelectorAll('#ls-refs input:checked')].map((i) => i.value);
const selectedClones = () =>
  [...document.querySelectorAll('#ls-clones input:checked')].map((i) => i.value);

function currentSelection() {
  const exp = state.exp;
  const refs = exp.references.filter((r) => selectedRefs().includes(r.label));
  const clones = selectedClones();
  const samples = [
    ...refs.map((r) => ({ label: r.label, construct: r.construct, location: r.location })),
    ...clones.map((c) => ({
      label: c,
      construct: exp.clone_prefix + c,
      location: exp.clone_location,
    })),
  ];
  const wells = samples.length * exp.colonies_per_sample;
  return { refs, clones, samples, wells };
}

function onSelectionChange() {
  const exp = state.exp;
  const { samples, wells, clones } = currentSelection();
  const msgs = [];
  let blocked = false;

  if (wells > exp.block_wells) {
    msgs.push(
      `<b>Will not fit.</b> ${samples.length} samples × ${exp.colonies_per_sample} colonies =
       <b>${wells} wells</b>, and the block holds <b>${exp.block_wells}</b>.
       Drop ${Math.ceil((wells - exp.block_wells) / exp.colonies_per_sample)} sample(s).`
    );
    blocked = true;
  }
  if (clones.length < exp.min_clones) {
    msgs.push(`Pick at least <b>${exp.min_clones}</b> clones — ${clones.length} chosen.`);
    blocked = true;
  }
  if (clones.length > exp.max_clones) {
    msgs.push(`At most <b>${exp.max_clones}</b> clones — ${clones.length} chosen.`);
    blocked = true;
  }
  const missingRequired = exp.references.filter(
    (r) => r.required && !selectedRefs().includes(r.label)
  );
  if (missingRequired.length) {
    msgs.push(
      `<b>${missingRequired.map((r) => r.label).join(', ')}</b> is required — RPU is defined
       relative to it, so without it nothing can be normalised.`
    );
    blocked = true;
  }

  $('ls-tally').innerHTML =
    `<b>${samples.length}</b> samples · <b>${wells}</b> of ${exp.block_wells} block wells ·
     <b>${wells * exp.technical_replicates}</b> of 96 read wells`;
  $('ls-warn').innerHTML = msgs.join('<br>');
  $('ls-warn').hidden = msgs.length === 0;
  $('ls-build').disabled = blocked;
}

// ---------- building ----------

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function table(caption, headers, rows) {
  return `<table class="ls-table"><caption>${esc(caption)}</caption>
    <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows
      .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
      .join('')}</tbody></table>`;
}

async function build() {
  const exp = state.exp;
  const expId = $('ls-id').value.trim();
  const name = $('ls-name').value.trim();
  if (!expId) { $('ls-id').focus(); return; }

  const { samples, wells } = currentSelection();
  const Protocols = await waitForProtocols();

  const labelled = samples.map((s) => ({ ...s, sample: `${expId}-${s.label}` }));
  const out = [];

  for (const sheet of exp.sheets) {
    const values = Object.assign(
      {
        host: exp.host,
        temperature_C: exp.incubate_C,
        antibiotic: exp.antibiotic,
        samples: sheet.module === 'plate_reader_fluorescence' ? wells : samples.length,
        colonies_per_sample: exp.colonies_per_sample,
        block_wells: exp.block_wells,
        technical_replicates: exp.technical_replicates,
        instrument: exp.instrument,
      },
      sheet.values || {}
    );

    let body = '';
    try {
      const rendered = await Protocols.runProtocol(sheet.module, values);
      body = rendered.html;
    } catch (err) {
      body = `<p class="ls-err">Could not render <code>${esc(sheet.module)}</code> — ${esc(err.message)}</p>`;
    }

    const tables = [];
    if ((sheet.tables || []).includes('source')) {
      tables.push(
        table('Source — fetch these before you start', ['label', 'construct', 'location'],
          labelled.map((s) => [s.label, s.construct, s.location]))
      );
    }
    if ((sheet.tables || []).includes('samples')) {
      tables.push(
        table('Samples', ['label', 'dna', 'strain', 'antibiotic', 'incubate'],
          labelled.map((s) => [s.sample, s.label, exp.host, exp.antibiotic, exp.incubate_C + ' °C']))
      );
    }

    const notes = (sheet.notes || []).length
      ? `<div class="ls-notes"><h4>Notes</h4><ul>${sheet.notes
          .map((n) => `<li>${n.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')}</li>`)
          .join('')}</ul></div>`
      : '';

    out.push(`<section class="labsheet">
      <header class="ls-head">
        <div class="ls-head-l">
          <div class="ls-exp">${esc(exp.title)}</div>
          <h2>${esc(sheet.name)} <span class="ls-num">(${esc(expId)})</span></h2>
        </div>
        <div class="ls-head-r">
          <div>${esc(name || '')}</div>
          <div class="ls-sign">sign: ____________________________ date: ____________</div>
        </div>
      </header>
      ${tables.join('')}
      <div class="ls-proto">${body}</div>
      ${notes}
    </section>`);
  }

  $('ls-output').innerHTML = out.join('');
  $('ls-tools').hidden = false;
  state.built = { expId, name };
  pushURL(expId, name);
  $('ls-output').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- URL state: the labsheet's address is its record ----------

function pushURL(expId, name) {
  const p = new URLSearchParams({
    exp: state.exp.id,
    id: expId,
    name,
    refs: selectedRefs().join(','),
    clones: selectedClones().join(','),
  });
  history.replaceState(null, '', location.pathname + '?' + p.toString());
}

function applyURL() {
  const p = new URLSearchParams(location.search);
  if (!p.get('id')) return;
  $('ls-id').value = p.get('id') || '';
  $('ls-name').value = p.get('name') || '';
  const refs = (p.get('refs') || '').split(',').filter(Boolean);
  const clones = (p.get('clones') || '').split(',').filter(Boolean);
  document.querySelectorAll('#ls-refs input').forEach((i) => (i.checked = refs.includes(i.value)));
  if (clones.length) {
    renderCloneList('');
    document
      .querySelectorAll('#ls-clones input')
      .forEach((i) => (i.checked = clones.includes(i.value)));
  }
  onSelectionChange();
  if (!$('ls-build').disabled) build();
}

// ---------- wiring ----------

document.addEventListener('DOMContentLoaded', () => {
  $('ls-build').addEventListener('click', build);
  $('ls-print').addEventListener('click', () => window.print());
  $('ls-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $('ls-copy').textContent = 'Link copied';
      setTimeout(() => ($('ls-copy').textContent = 'Copy link'), 1600);
    } catch {
      /* clipboard blocked; the URL bar already holds it */
    }
  });
  boot();
});
