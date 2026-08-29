// labsheets.js
// Builds printable labsheets for a group running a 140L experiment.
//
// A labsheet is a protocol plus identity plus a sample table. The protocol half is rendered
// by the Protocol Builder's renderer from the same unit-op modules the protocol view uses,
// so nothing here restates a procedure.
//
// The unit of planning is a GROUP, not a student. Each member brings their own experiment
// number and their own clones; the whole group shares one set of controls, because measuring
// the references twice in one run tells you nothing you didn't already know.

const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const state = {
  experiments: [],
  exp: null,
  catalogue: [],       // [{clone, date, canonical, usable, note}]
  byClone: new Map(),
  members: [],         // [{id, name, clones:[]}]
  source: '',
};

// ---------- small helpers ----------

async function waitForProtocols(timeoutMs = 10000) {
  const start = Date.now();
  while (!window.Protocols) {
    if (Date.now() - start > timeoutMs) throw new Error('Protocol renderer did not load.');
    await new Promise((r) => setTimeout(r, 40));
  }
  return window.Protocols;
}

// CSV with quoted fields — the live sheet has commas inside notes.
function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

function parseTSV(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim());
  const head = lines.shift().split('\t');
  return lines.map((l) => {
    const cells = l.split('\t'), o = {};
    head.forEach((h, i) => (o[h] = (cells[i] ?? '').trim()));
    return o;
  });
}

const yes = (v) => ['yes', 'y', 'true', 'canonical', 'usable'].includes(String(v).trim().toLowerCase());

// ---------- catalogue ----------
// Live from the submissions sheet when reachable, committed snapshot otherwise. The live
// sheet is the one people actually add to, so a stale snapshot would quietly hide new clones.

async function loadCatalogue(exp) {
  // The live sheet holds recent submissions only; the committed snapshot carries the older
  // clones that predate the form. Neither alone is the catalogue — the union is.
  const parts = [];
  let live = 0;

  try {
    const rows = parseTSV(await (await fetch('../' + exp.catalogue)).text());
    parts.push(...rows.map((r) => ({
      clone: r.clone, date: r.date,
      canonical: yes(r.sequenced), usable: yes(r.usable), note: '',
    })));
  } catch (_) { /* snapshot missing is survivable if the live sheet answers */ }

  if (exp.catalogue_url) {
    try {
      const res = await fetch(exp.catalogue_url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const rows = parseCSV(await res.text());
      const head = rows.shift().map((h) => h.trim().toLowerCase());
      const col = (frag) => head.findIndex((h) => h.includes(frag));
      const ci = col('clone_id'), di = col('date_sequenced'),
            ki = col('canonical'), ui = col('usable'), ni = col('note');
      for (const r of rows) {
        const clone = (r[ci] || '').trim();
        if (!clone) continue;
        live++;
        parts.push({
          clone, date: (r[di] || '').trim(),
          canonical: yes(r[ki]), usable: yes(r[ui]), note: (r[ni] || '').trim(),
        });
      }
    } catch (_) { /* offline, or the sheet stopped being readable */ }
  }

  state.source = live
    ? `${live} live submissions merged with the local snapshot`
    : 'local snapshot only — the live sheet was unreachable';
  return dedupe(parts);
}

function dedupe(list) {
  const seen = new Map();
  for (const c of list) seen.set(c.clone, c);   // later wins: live overrides snapshot
  return [...seen.values()].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

// A clone worth suggesting: sequence confirmed and usable, most recent first.
function isRecommended(c) { return c.canonical && c.usable; }

// ---------- boot ----------

async function boot() {
  try {
    state.experiments = await (await fetch('../experiments.json')).json();
  } catch (err) {
    return fail('Could not load experiments.json — ' + err.message);
  }
  $('ls-experiment').innerHTML = state.experiments
    .map((e) => `<option value="${e.id}">${esc(e.title)}</option>`).join('');
  $('ls-experiment').addEventListener('change', (e) => selectExperiment(e.target.value));
  await selectExperiment(state.experiments[0].id);
}

function fail(msg) {
  $('ls-error').textContent = msg;
  $('ls-error').hidden = false;
}

async function selectExperiment(id) {
  state.exp = state.experiments.find((e) => e.id === id);
  const exp = state.exp;
  $('ls-howto').innerHTML = exp.howto || '';

  state.catalogue = await loadCatalogue(exp);
  state.byClone = new Map(state.catalogue.map((c) => [c.clone.toUpperCase(), c]));

  const rec = state.catalogue.filter(isRecommended);
  $('ls-catalogue-note').innerHTML =
    `<b>${state.catalogue.length}</b> clones on file, <b>${rec.length}</b> with a confirmed,
     usable read. Source: ${esc(state.source)}.`;

  // datalist drives the autocomplete on every member's clone box
  $('ls-clone-list').innerHTML = state.catalogue
    .map((c) => `<option value="${esc(c.clone)}">${esc(c.date)}${
      isRecommended(c) ? '' : ' · unconfirmed'}</option>`).join('');

  // controls: all on by default; the copy tells them to switch off what they skip
  $('ls-refs').innerHTML = exp.references.map((r) => `<label class="ls-check">
      <input type="checkbox" value="${r.label}" checked ${r.required ? 'data-required="1"' : ''}>
      <span><b>${esc(r.label)}</b> — ${esc(r.note)}${r.required ? ' <em>(required)</em>' : ''}</span>
    </label>`).join('');
  $('ls-refs').addEventListener('change', recalc);

  restore();
  if (!state.members.length) addMember(true);
  renderMembers();
}

// ---------- members ----------

function addMember(prefill = false) {
  const m = { id: '', name: '', clones: [] };
  if (prefill) {
    try {
      m.name = localStorage.getItem('quizUserName') || '';
      if (!m.name) {
        const email = localStorage.getItem('quizUserEmail') || '';
        if (email) m.name = email.split('@')[0];
      }
    } catch (_) {}
  }
  state.members.push(m);
}

function renderMembers() {
  const exp = state.exp;
  $('ls-members').innerHTML = state.members.map((m, i) => `
    <div class="ls-member" data-i="${i}">
      <div class="ls-member-head">
        <input class="ls-m-id"   type="text" placeholder="number" value="${esc(m.id)}"
               inputmode="numeric" aria-label="Experiment number">
        <input class="ls-m-name" type="text" placeholder="name" value="${esc(m.name)}"
               aria-label="Name">
        <button class="ls-m-del" type="button" title="Remove"${
          state.members.length === 1 ? ' disabled' : ''}>remove</button>
      </div>
      <div class="ls-chips">${m.clones.map((c) => {
        const rec = state.byClone.get(c.toUpperCase());
        const warn = rec && !isRecommended(rec) ? ' ls-chip-warn' : '';
        const unknown = !rec ? ' ls-chip-unknown' : '';
        return `<span class="ls-chip${warn}${unknown}" data-clone="${esc(c)}">${esc(c)}<button
                 type="button" aria-label="Remove ${esc(c)}">×</button></span>`;
      }).join('')}</div>
      <input class="ls-m-clone" type="text" list="ls-clone-list" autocomplete="off"
             placeholder="type a clone and press Enter — e.g. 45C">
    </div>`).join('');

  $('ls-members').querySelectorAll('.ls-member').forEach((el) => {
    const i = Number(el.dataset.i);
    el.querySelector('.ls-m-id').addEventListener('input', (e) => {
      state.members[i].id = e.target.value.trim(); recalc();
    });
    el.querySelector('.ls-m-name').addEventListener('input', (e) => {
      state.members[i].name = e.target.value; recalc();
    });
    el.querySelector('.ls-m-del').addEventListener('click', () => {
      state.members.splice(i, 1); renderMembers(); recalc();
    });
    const box = el.querySelector('.ls-m-clone');
    const commit = () => {
      const v = box.value.trim();
      if (!v) return;
      // one box accepts a whole list, pasted or typed
      v.split(/[\s,;]+/).filter(Boolean).forEach((c) => {
        if (!state.members[i].clones.includes(c)) state.members[i].clones.push(c);
      });
      box.value = '';
      renderMembers(); recalc();
      const again = $('ls-members').querySelector(`.ls-member[data-i="${i}"] .ls-m-clone`);
      if (again) again.focus();
    };
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); }
    });
    box.addEventListener('change', commit);   // fires when a datalist option is picked
    el.querySelectorAll('.ls-chip button').forEach((b) => {
      b.addEventListener('click', () => {
        const c = b.parentElement.dataset.clone;
        state.members[i].clones = state.members[i].clones.filter((x) => x !== c);
        renderMembers(); recalc();
      });
    });
  });
  recalc();
}

// ---------- the arithmetic ----------

const selectedRefs = () =>
  [...document.querySelectorAll('#ls-refs input:checked')].map((i) => i.value);

function plan() {
  const exp = state.exp;
  const refs = exp.references.filter((r) => selectedRefs().includes(r.label));
  const groupId = state.members.find((m) => m.id)?.id || '';

  const samples = [];
  for (const r of refs) {
    samples.push({ sample: `${groupId}-${r.label}`, label: r.label,
                   construct: r.construct, location: r.location, who: 'group' });
  }
  for (const m of state.members) {
    for (const c of m.clones) {
      samples.push({ sample: `${m.id}-${c}`, label: c,
                     construct: exp.clone_prefix + c, location: exp.clone_location,
                     who: m.name || m.id });
    }
  }

  const per = exp.colonies_per_sample;
  const wells = samples.length * per;
  const blocks = Math.max(1, Math.ceil(wells / exp.block_wells));
  const readWells = wells * exp.technical_replicates;
  const readPlates = Math.max(1, Math.ceil(readWells / 96));
  return { refs, samples, wells, blocks, readWells, readPlates, groupId };
}

function recalc() {
  const exp = state.exp;
  const p = plan();
  const problems = [];

  const missing = exp.references.filter((r) => r.required && !selectedRefs().includes(r.label));
  if (missing.length) {
    problems.push(`<b>${missing.map((r) => r.label).join(', ')}</b> is the reference RPU is
      defined against — without it nothing can be normalised.`);
  }
  if (!state.members.some((m) => m.id)) problems.push('At least one experiment number is needed.');
  if (!p.samples.length) problems.push('No samples yet — add some clones.');

  const unknown = p.samples.filter(
    (s) => s.who !== 'group' && !state.byClone.has(s.label.toUpperCase()));
  const unconfirmed = p.samples.filter((s) => {
    const rec = state.byClone.get(s.label.toUpperCase());
    return s.who !== 'group' && rec && !isRecommended(rec);
  });

  const notes = [];
  if (unknown.length) notes.push(`Not in the catalogue: <b>${
    unknown.map((s) => esc(s.label)).join(', ')}</b>. Fine if it is new — check the spelling.`);
  if (unconfirmed.length) notes.push(`Sequence not confirmed: <b>${
    unconfirmed.map((s) => esc(s.label)).join(', ')}</b>. Measurable, but you will not know
    what promoter you measured.`);

  $('ls-tally').innerHTML = `
    <span><b>${p.samples.length}</b> samples</span>
    <span><b>${p.samples.length}</b> plates</span>
    <span><b>${p.wells}</b> wells in <b>${p.blocks}</b> block${p.blocks > 1 ? 's' : ''}</span>
    <span><b>${p.readWells}</b> read wells${p.readPlates > 1 ? ` · ${p.readPlates} plates` : ''}</span>`;

  $('ls-warn').innerHTML = problems.join('<br>');
  $('ls-warn').hidden = !problems.length;
  $('ls-note').innerHTML = notes.join('<br>');
  $('ls-note').hidden = !notes.length;
  $('ls-build').disabled = problems.length > 0;
  save();
}

// ---------- build ----------

function table(caption, headers, rows) {
  return `<table class="ls-table"><caption>${esc(caption)}</caption>
    <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}
    </tbody></table>`;
}

async function build() {
  const exp = state.exp;
  const p = plan();
  const Protocols = await waitForProtocols();
  const who = state.members.filter((m) => m.id)
    .map((m) => (m.name ? `${m.name} (${m.id})` : m.id)).join(' · ');

  const out = [];
  for (const sheet of exp.sheets) {
    const values = Object.assign({
      host: exp.host,
      temperature_C: exp.incubate_C,
      antibiotic: exp.antibiotic,
      samples: sheet.module === 'plate_reader_fluorescence' ? p.wells : p.samples.length,
      colonies_per_sample: exp.colonies_per_sample,
      block_wells: exp.block_wells,
      blocks: p.blocks,
      technical_replicates: exp.technical_replicates,
      instrument: exp.instrument,
    }, sheet.values || {});

    let body;
    try {
      body = (await Protocols.runProtocol(sheet.module, values)).html;
    } catch (err) {
      body = `<p class="ls-err">Could not render <code>${esc(sheet.module)}</code> — ${esc(err.message)}</p>`;
    }

    const tables = [];
    if ((sheet.tables || []).includes('source')) {
      tables.push(table('Source — fetch these before you start',
        ['label', 'construct', 'location'],
        p.samples.map((s) => [s.label, s.construct, s.location])));
    }
    if ((sheet.tables || []).includes('samples')) {
      tables.push(table('Samples',
        ['label', 'dna', 'strain', 'antibiotic', 'incubate', 'whose'],
        p.samples.map((s) => [s.sample, s.label, exp.host, exp.antibiotic,
                              exp.incubate_C + ' °C', s.who])));
    }

    const notes = (sheet.notes || []).length
      ? `<div class="ls-notes"><h4>Notes</h4><ul>${sheet.notes
          .map((n) => `<li>${n.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')}</li>`).join('')}</ul></div>`
      : '';

    out.push(`<section class="labsheet">
      <header class="ls-head">
        <div><div class="ls-exp">${esc(exp.title)}</div>
          <h2>${esc(sheet.name)}</h2></div>
        <div class="ls-head-r"><div>${esc(who)}</div>
          <div class="ls-sign">sign: ____________________________ date: ____________</div></div>
      </header>
      ${tables.join('')}
      <div class="ls-proto">${body}</div>
      ${notes}
    </section>`);
  }

  $('ls-output').innerHTML = out.join('');
  $('ls-tools').hidden = false;
  save();
  $('ls-output').scrollIntoView({ block: 'start' });
}

// ---------- persistence: the group survives a reload, and the URL is the record ----------

function save() {
  const payload = { exp: state.exp?.id, refs: selectedRefs(), members: state.members };
  try { localStorage.setItem('labsheetGroup', JSON.stringify(payload)); } catch (_) {}
  const p = new URLSearchParams({ exp: payload.exp || '', refs: payload.refs.join(','),
    group: state.members.filter((m) => m.id)
      .map((m) => [m.id, m.name, m.clones.join('+')].join('~')).join('|') });
  history.replaceState(null, '', location.pathname + '?' + p.toString());
}

function restore() {
  const q = new URLSearchParams(location.search);
  const fromURL = q.get('group');
  if (fromURL) {
    state.members = fromURL.split('|').filter(Boolean).map((chunk) => {
      const [id, name, clones] = chunk.split('~');
      return { id: id || '', name: name || '', clones: (clones || '').split('+').filter(Boolean) };
    });
    const refs = (q.get('refs') || '').split(',').filter(Boolean);
    if (refs.length) {
      document.querySelectorAll('#ls-refs input')
        .forEach((i) => (i.checked = refs.includes(i.value)));
    }
    return;
  }
  try {
    const saved = JSON.parse(localStorage.getItem('labsheetGroup') || 'null');
    if (saved && saved.exp === state.exp.id && Array.isArray(saved.members)) {
      state.members = saved.members;
      if (Array.isArray(saved.refs) && saved.refs.length) {
        document.querySelectorAll('#ls-refs input')
          .forEach((i) => (i.checked = saved.refs.includes(i.value)));
      }
    }
  } catch (_) {}
}

// ---------- wiring ----------

document.addEventListener('DOMContentLoaded', () => {
  $('ls-add-member').addEventListener('click', () => { addMember(); renderMembers(); });
  $('ls-build').addEventListener('click', build);
  $('ls-print').addEventListener('click', () => window.print());
  $('ls-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $('ls-copy').textContent = 'Link copied';
      setTimeout(() => ($('ls-copy').textContent = 'Copy link'), 1600);
    } catch (_) {}
  });
  boot();
});
