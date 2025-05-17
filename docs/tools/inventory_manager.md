# Inventory Manager Tool

This tool lets you upload inventory files in TSV or CSV format and search for stored samples based on metadata such as construct, label, and concentration.

<label><b>Upload Inventory Folder:</b></label><br/>
<input type="file" id="folderUpload" webkitdirectory multiple /><br/><br/>

<label><b>Or Upload Individual Files:</b></label><br/>
<input type="file" id="fileUpload" multiple accept=".txt,.tsv,.csv" /><br/><br/>
<br/>
<div id="searchForm"></div>
<br/>
<button onclick="searchInventory()">Search</button>
<button onclick="clearInventory()">Clear</button>
<div id="results"></div>

<script>
let inventory = {};  // box_name: { well_label: sample_data }
let constructIndex = {};  // construct_value: [{box, well}]

const fieldOntology = new Set([
  "construct", "culture", "concentration", "label", "side-label", "clone", "type", "note", "composition"
]);

function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("constructIndex", JSON.stringify(constructIndex));
}

function loadInventory() {
  inventory = JSON.parse(localStorage.getItem("inventory") || "{}");
  constructIndex = JSON.parse(localStorage.getItem("constructIndex") || "{}");
}

function clearInventory() {
  localStorage.removeItem("inventory");
  localStorage.removeItem("constructIndex");
  inventory = {};
  constructIndex = {};
  document.getElementById("results").innerHTML = "Inventory cleared.";
}

function displaySearchForm() {
  const fields = ["construct", "culture", "concentration", "label", "side-label", "clone", "type", "note", "composition"];
  const html = fields.map(field =>
    `<label>${field} <input type="text" id="search-${field}" /></label>`
  ).join("<br/>");
  document.getElementById("searchForm").innerHTML = html;
}

async function handleInventoryUpload(event) {
  inventory = {};
  constructIndex = {};
  const files = Array.from(event.target.files);

  const summary = {
    parsedBoxes: [],
    skippedBoxes: [],
    skippedBoxReasons: {},
    wellCounts: {},
    skippedWells: []
  };

  let firstDataBlockLines = [];
  let headerCols = [];

  for (const file of files) {
    if (!/\.(txt|tsv|csv)$/i.test(file.name)) {
      continue;
    }

    const text = await file.text();

    // Split text into blocks separated by '>>'
    const rawBlocks = text.split('>>').map(b => b.trim()).filter(b => b.length > 0);

    // Parse box-wide fields from block[0] lines starting with '>'
    const boxWideFields = {};
    const boxWideLines = rawBlocks[0]
      .split(/[\r\n]+/)
      .flatMap(line => line.split('\r'))
      .map(line => line.trim())
      .filter(line => line.startsWith('>'));
    
    for (const line of boxWideLines) {
      const parts = line.slice(1).split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim().toLowerCase();
        const value = parts.slice(1).join(':').trim();
        boxWideFields[key] = value;
      }
    }


    // Remaining blocks after box-wide fields block
    const dataBlocks = rawBlocks.slice(1);
    if (dataBlocks.length === 0) {
      summary.skippedBoxes.push(file.name);
      summary.skippedBoxReasons[file.name] = "no data blocks found";
      continue;
    }

    // Determine number of columns by splitting first line of first data block
    firstDataBlockLines = dataBlocks[0].split(/[\r\n]+/).filter(line => line.trim() !== '');
    if (firstDataBlockLines.length < 2) {
      summary.skippedBoxes.push(file.name);
      summary.skippedBoxReasons[file.name] = "insufficient data in first block";
      continue;
    }
    headerCols = firstDataBlockLines[0].trim().split('\t');
    const numCols = headerCols.length - 1; // subtract 1 because first token is field name
    const numRows = firstDataBlockLines.length - 1;

    // Initialize well_array: 2D array of objects or null
    const well_array = Array.from({ length: numRows }, () => Array(numCols).fill(null).map(() => ({})));

    // For each data block, parse field and fill well_array
    for (const blockText of dataBlocks) {
      const lines = blockText.split(/[\r\n]+/).filter(line => line.trim() !== '');
      if (lines.length < 2) continue;
      // First line is header: field name + column labels
      const headerTokens = lines[0].trim().split('\t');
      const fieldName = headerTokens[0].toLowerCase();
      // Subsequent lines: row label + values
      for (let r = 1; r < lines.length; r++) {
        const tokens = lines[r].trim().split('\t');
        if (tokens.length < 1) continue;
        for (let c = 0; c < numCols; c++) {
          const val = tokens[c + 1] !== undefined ? tokens[c + 1] : "";
          well_array[r - 1][c][fieldName] = val;
        }
      }
    }

    // Remove wells without 'construct' field or empty construct
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const sample = well_array[r][c];
        if (!sample.construct || sample.construct.trim() === "") {
          well_array[r][c] = null;
          summary.skippedWells.push(`${file.name} ${firstDataBlockLines[r + 1].split('\t')[0]}${headerCols[c + 1]} (no construct field)`);
        }
      }
    }

    // Flatten well_array and assign well positions
    const wellData = {};
    let added = 0;
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const sample = well_array[r][c];
        if (!sample) continue;
        const rowLabel = firstDataBlockLines[r + 1].split('\t')[0];
        const colLabel = headerCols[c + 1];
        const well = `${rowLabel}${colLabel}`;
        wellData[well] = sample;
        const construct = sample.construct.toLowerCase();
        if (!constructIndex[construct]) constructIndex[construct] = [];
        constructIndex[construct].push({ box: file.name.split('.')[0], well });
        added++;
      }
    }

    if (added > 0) {
      inventory[file.name.split('.')[0]] = wellData;
      summary.parsedBoxes.push(file.name.split('.')[0]);
      summary.wellCounts[file.name.split('.')[0]] = added;
    } else {
      summary.skippedBoxes.push(file.name.split('.')[0]);
      summary.skippedBoxReasons[file.name.split('.')[0]] = "no usable sample data found";
    }
  }

  saveInventory();

  const boxReport = `
    <h3>Inventory Load Summary</h3>
    <p><strong>Parsed Boxes:</strong> ${summary.parsedBoxes.length}</p>
    <ul>${summary.parsedBoxes.map(b => `<li>${b} (${summary.wellCounts[b]} wells)</li>`).join('')}</ul>
    <p><strong>Skipped Boxes:</strong> ${summary.skippedBoxes.length}</p>
    <ul>${summary.skippedBoxes.map(b => `<li>${b} – ${summary.skippedBoxReasons[b]}</li>`).join('')}</ul>
    <p><strong>Skipped Wells:</strong> ${summary.skippedWells.length}</p>
    <ul>${summary.skippedWells.slice(0, 10).map(w => `<li>${w}</li>`).join('')}${summary.skippedWells.length > 10 ? '<li>...</li>' : ''}</ul>
  `;

  document.getElementById("results").innerHTML = boxReport;
}

function searchInventory() {
  loadInventory();
  const results = [];
  const query = {};
  for (const field of fieldOntology) {
    const val = document.getElementById(`search-${field}`)?.value.trim();
    if (val) query[field] = val.toLowerCase();
  }

  if (!query.construct) {
    document.getElementById("results").innerHTML = "Please enter a construct name to search.";
    return;
  }

  const matches = constructIndex[query.construct] || [];
  for (const { box, well } of matches) {
    const sample = inventory[box]?.[well];
    if (!sample) continue;
    const match = Object.entries(query).every(([field, val]) =>
      (sample[field] || "").toLowerCase().includes(val)
    );
    if (match) {
      results.push({ box, well, ...sample });
    }
  }

  if (results.length === 0) {
    document.getElementById("results").innerHTML = "No matches found.";
    return;
  }

  const headers = ["box", "well", ...Array.from(fieldOntology)];
  const table = `
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${results.map(row =>
          `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
        ).join('')}
      </tbody>
    </table>
  `;
  document.getElementById("results").innerHTML = table;
}

loadInventory();
displaySearchForm();

document.getElementById("folderUpload").addEventListener("change", handleInventoryUpload);
document.getElementById("fileUpload").addEventListener("change", handleInventoryUpload);
</script>

## Instructions

1. Click **Choose Folder** to upload `.csv` or `.tsv` files that describe inventory boxes.
2. Each file should contain grids labeled with headers such as `>construct`, `>label`, `>concentration`, and others.
3. Data is organized into a 2D plate format (e.g. rows A–J and numbered columns).
4. After loading, use the form to search for samples by construct and any other fields.
5. Search results will show matching samples, including their box and well positions.

> This tool runs in your browser and works offline. Inventory data is stored locally and can be cleared with the **Clear** button.