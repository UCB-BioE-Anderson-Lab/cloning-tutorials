# Equipment and Procedure Training

This section provides training for specific equipment and specialized laboratory procedures **not covered in the general Wetlab tutorials**.

QR codes posted around the lab link directly to the relevant training modules here.

---

<div id="qr-content"></div>

<style>
  .qr-section { margin: 18px 0 28px; }
  .qr-section h2 { margin-bottom: 8px; }
  .qr-note { color:#555; font-size:0.95em; margin: 6px 0 14px; }
  .qr-list { margin-left: 0; padding-left: 0; list-style: none; }
  .qr-list li { margin: 8px 0; }
  .qr-title { font-weight: 600; }
  .qr-desc { color:#333; }
  .qr-link { margin-left: 6px; }
  .pill { display:inline-block; font-size:0.82em; padding:2px 6px; border:1px solid #ddd; border-radius:10px; margin-left:6px; }
</style>

<script>
// ------- Config -------
const CSV_PATH = '../../assets/qr_registry.csv';

// Map CSV categories to page sections and headings
const SECTION_ORDER = [
  { key: 'Lab Safety',         heading: 'Lab Safety' },
  { key: 'Supervisor-Only',    heading: 'Supervisor-Only Equipment (Certification Required)' },
  { key: 'Mandatory',          heading: 'Mandatory Training Before Use' },
  { key: 'Training available', heading: 'Training available' }
];

// ------- Minimal CSV parser (handles quotes, commas, newlines) -------
function parseCSV(text) {
  const rows = [];
  let row = [], cur = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (c === ',' && !inQuotes) {
      row.push(cur); cur = '';
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (cur !== '' || row.length) { row.push(cur); rows.push(row); row = []; cur = ''; }
      // consume paired \r\n
      if (c === '\r' && text[i + 1] === '\n') i++;
    } else {
      cur += c;
    }
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

// ------- Render helpers -------
function isYoutube(url) {
  try { return new URL(url).hostname.includes('youtube.com') || new URL(url).hostname.includes('youtu.be'); }
  catch { return false; }
}

function renderSection(container, heading, items) {
  const sec = document.createElement('section');
  sec.className = 'qr-section';

  const h2 = document.createElement('h2');
  h2.textContent = heading;
  sec.appendChild(h2);

  const ul = document.createElement('ul');
  ul.className = 'qr-list';

  items.forEach(it => {
    const li = document.createElement('li');

    const title = document.createElement('span');
    title.className = 'qr-title';
    title.textContent = it.title;

    const sep = document.createTextNode(' — '); // hyphen to avoid em dash

    const desc = document.createElement('span');
    desc.className = 'qr-desc';
    desc.textContent = it.description || '';

    li.appendChild(title);
    li.appendChild(sep);
    li.appendChild(desc);

    if (it.link && it.link.trim()) {
      const a = document.createElement('a');
      a.href = it.link.trim();
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'qr-link';
      a.textContent = isYoutube(it.link) ? '[Video]' : '[Start Training]';
      li.appendChild(document.createTextNode('  '));
      li.appendChild(a);

      if (isYoutube(it.link)) {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = 'video';
        li.appendChild(pill);
      }
    } else {
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = 'coming soon';
      li.appendChild(document.createTextNode('  '));
      li.appendChild(pill);
    }

    ul.appendChild(li);
  });

  sec.appendChild(ul);
  container.appendChild(sec);
}

// ------- Main -------
(async function main() {
  const mount = document.getElementById('qr-content');

  let raw;
  try {
    const res = await fetch(CSV_PATH, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch CSV');
    raw = await res.text();
  } catch (e) {
    mount.innerHTML = '⚠️ Could not load <code>qr_registry.csv</code>.';
    return;
  }

  // Expect 6 columns per row: slug, title, link, category, status, description
  const rows = parseCSV(raw)
    .map(r => (r.length >= 6 ? r.slice(0, 6) : r.concat(Array(6 - r.length).fill(''))))
    .map(([slug, title, link, category, status, description]) => ({
      slug: (slug || '').trim(),
      title: (title || '').trim(),
      link: (link || '').trim(),
      category: (category || '').trim(),
      status: (status || '').trim().toLowerCase(),
      description: (description || '').trim()
    }))
    // Filter out header-like rows if someone accidentally left a header line
    .filter(r => r.slug && r.slug !== 'slug')
    // Respect status column
    .filter(r => r.status !== 'hidden');

  // Group by configured sections and render in fixed order
  for (const sec of SECTION_ORDER) {
    const items = rows.filter(r => r.category === sec.key);
    if (items.length) renderSection(mount, sec.heading, items);
  }

  // If any remaining categories exist that are not in SECTION_ORDER, render them at the end
  const known = new Set(SECTION_ORDER.map(s => s.key));
  const otherCats = Array.from(new Set(rows.map(r => r.category))).filter(c => !known.has(c));
  for (const cat of otherCats) {
    const items = rows.filter(r => r.category === cat);
    renderSection(mount, cat, items);
  }
})();
</script>