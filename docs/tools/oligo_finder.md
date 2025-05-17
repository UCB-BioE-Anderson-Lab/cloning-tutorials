# Oligo Finder Tool

This tool allows you to upload a directory of oligonucleotide files and enter a DNA sequence to identify matching oligos that will anneal to the template.

<input type="file" id="oligoFolder" webkitdirectory multiple />
<br/><br/>
<textarea id="templateInput" placeholder="Enter template DNA sequence here..." rows="4" cols="60"></textarea>
<br/><br/>
<button onclick="analyzeOligos()">Analyze</button>
<button onclick="clearOligos()">Clear</button>
<div id="results"></div>

<script>
  const nameSeqRegex = /^[a-zA-Z0-9_.-]+$/;
  const dnaSeqRegex = /^[ATCGNRYMKSWHBVDN]{16,100}$/i;

  let oligoDict = {};
  let index3pDict = {};

  function saveToLocalStorage() {
    localStorage.setItem('oligoDict', JSON.stringify(oligoDict));
    localStorage.setItem('index3pDict', JSON.stringify(index3pDict));
  }

  function loadFromLocalStorage() {
    oligoDict = JSON.parse(localStorage.getItem('oligoDict') || '{}');
    index3pDict = JSON.parse(localStorage.getItem('index3pDict') || '{}');
  }

  function clearOligos() {
    localStorage.removeItem('oligoDict');
    localStorage.removeItem('index3pDict');
    oligoDict = {};
    index3pDict = {};
    displayOligoCount();
  }
  function displayOligoCount() {
    const count = Object.keys(oligoDict).length;
    document.getElementById('results').innerHTML = `✔️ Loaded ${count} oligos.`;
  }

  document.getElementById('oligoFolder').addEventListener('change', async (event) => {
    oligoDict = {};
    index3pDict = {};
    const files = Array.from(event.target.files);
    for (const file of files) {
      if (!file.name.endsWith('.txt') && !file.name.endsWith('.tsv')) continue;
      const text = await file.text();
      const lines = text.split(/\r?\n/);
      for (const line of lines) {
        const [name, seq] = line.split('\t');
        if (!name || !seq) continue;
        const cleanName = name.trim();
        const cleanSeq = seq.trim().toUpperCase();
        if (!nameSeqRegex.test(cleanName)) continue;
        if (!dnaSeqRegex.test(cleanSeq)) continue;
        oligoDict[cleanName] = cleanSeq;
        const suffix = cleanSeq.slice(-6);
        if (!index3pDict[suffix]) index3pDict[suffix] = [];
        index3pDict[suffix].push(cleanName);
      }
    }
    saveToLocalStorage();
    displayOligoCount();
  });

  function analyzeOligos() {
    loadFromLocalStorage();
    const template = document.getElementById('templateInput').value.toUpperCase();
    const exactHits = [];
    const partialHits = [];
    const seenNames = new Set();

    for (let i = 12; i <= template.length - 6; i++) {
      const fragment = template.slice(i, i + 6);
      const candidates = index3pDict[fragment] || [];
      for (const name of candidates) {
        if (seenNames.has(name)) continue;
        const oligo = oligoDict[name];
        if (!oligo) continue;
        const oligoTail = oligo.slice(-16);
        const matchStart = template.indexOf(oligoTail);
        if (matchStart !== -1) {
          const pos3prime = matchStart + oligoTail.length - 1;
          seenNames.add(name);
          if (template.includes(oligo)) {
            exactHits.push([name, oligo, pos3prime]);
          } else {
            partialHits.push([name, oligo, pos3prime]);
          }
        }
      }
    }

    function renderTable(title, data) {
      if (data.length === 0) return '';
      return `
        <h3>${title}</h3>
        <table border="1" cellpadding="6" cellspacing="0">
          <thead>
            <tr>
              <th>Oligo Name</th>
              <th>Sequence</th>
              <th>3′ End Position</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(([n, s, p]) => `<tr><td>${n}</td><td>${s}</td><td>${p}</td></tr>`).join('')}
          </tbody>
        </table>
      `;
    }

    const output =
      renderTable("Exact Matches (Full Sequence)", exactHits) +
      renderTable("Partial Matches (16 bp 3′ Annealing)", partialHits) +
      `<p><em>The “3′ End Position” indicates where the last base of the oligo aligns on the template sequence.</em></p>`;

    document.getElementById('results').innerHTML = output || 'No matches found.';
  }

  // Load oligos if they exist
  loadFromLocalStorage();
  displayOligoCount();
</script>


## Instructions

1. Click **Choose Folder** to upload `.txt` or `.tsv` files containing your oligo list.
   - You may select a single file, a folder containing files, or a folder with nested folders containing files.
2. Each file should contain lines with `name<TAB>sequence`, where:
   - `name` includes only letters, numbers, underscores, dashes, or dots.
   - `sequence` includes valid IUPAC DNA codes (A, T, C, G, N, R, Y, etc.).
3. Enter a target DNA sequence in the text box.
4. Click **Analyze** to find oligos with 3′ matches that anneal to your sequence.
5. Use **Clear** to reset the stored oligo data.

   - ⚠️ This tool only checks for forward strand matches. To check for reverse strand annealing, input the reverse complement of your target sequence.

> This tool runs entirely in your browser and works offline. No data is sent over the internet.  
> Extracted oligo data is saved in your browser's storage and will persist across sessions unless you clear it using the **Clear** button.  
> ⚠️ This tool only searches for oligos that anneal to the forward strand. To check the reverse strand, input the reverse complement of your target sequence.