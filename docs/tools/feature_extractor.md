# GenBank/APE Feature Extractor

This tool allows you to drag and drop  `.seq`, `.gb`, `.gcc`, `.str`, `.genbank`, or `.ape` files and extract features (name, color, sequence) into the ApE-compatible TSV format.

---

<div class="container">
  <h2>Feature Extractor</h2>

  <!-- File Upload Section -->
  <section class="panel">
    <h3>Upload a File</h3>
    <div id="drop_zone" class="drop-zone">
      <strong>Drop your file here or click to upload</strong>
    </div>
    <input type="file" id="file_input" style="display:none;" accept=".seq,.gcc,.str,.gb,.genbank,.ape">
    <div id="file_info"></div>
  </section>

  <!-- Manual Feature Input -->
  <section class="panel">
    <h3>Add a Feature Manually</h3>
    <form id="feature_form">
      <div class="form-row">
        <label>Name:</label>
        <input type="text" id="feature_name" required>
      </div>
      <div class="form-row">
        <label>Sequence:</label>
        <textarea id="feature_seq" rows="3" required></textarea>
      </div>
      <div class="form-row">
        <label>Type:</label>
        <input type="text" id="feature_type" value="CDS" required>
      </div>
      <div class="form-row">
        <label>Color:</label>
        <input type="text" id="feature_color" value="blue" required>
      </div>
      <button type="button" onclick="addFeature()">Add Feature</button>
    </form>
  </section>

  <!-- Output Section -->
  <section class="panel">
    <h3>Collected Features</h3>
    <ul id="feature_list" class="feature-list"></ul>
    <button onclick="downloadFeatures()">Download Features</button>
  </section>
</div>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 20px;
}
.panel {
  background: #f8faff;
  border: 1px solid #cce0ff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}
.drop-zone {
  border: 2px dashed #3399ff;
  background-color: #e6f2ff;
  text-align: center;
  padding: 40px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}
.drop-zone:hover {
  border-color: #007acc;
}
.drop-zone.dragover {
  background-color: #cce6ff;
}
#file_info {
  margin-top: 10px;
  font-style: italic;
  color: #333;
}
.form-row {
  margin-bottom: 12px;
}
.form-row label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}
.form-row input,
.form-row textarea {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
}
button {
  background-color: #3399ff;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #007acc;
}

.feature-list {
  list-style: none;
  padding-left: 0;
  max-height: 300px;
  overflow-y: auto;
}
.feature-list li {
  background: #ffffff;
  border: 1px solid #ccc;
  padding: 6px 10px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.feature-list button {
  background-color: #ff4d4d;
  border: none;
  padding: 4px 8px;
  color: white;
  cursor: pointer;
}
.feature-list button:hover {
  background-color: #cc0000;
}
.feature-list li:hover {
  background-color: #ffecec;
  border-color: #ffaaaa;
}
</style>

<script>
let features = [];
let parsedCandidates = [];

document.addEventListener('DOMContentLoaded', function () {
  const dropZone = document.getElementById('drop_zone');
  const fileInput = document.getElementById('file_input');
  const fileInfo = document.getElementById('file_info');

  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    setTimeout(() => this.classList.remove('dragover'), 100);
  });

  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      parseGenbank(e.target.result);
      fileInfo.textContent = `Loaded file: ${file.name}`;
      fileInfo.setAttribute('aria-live', 'polite');
    };
    reader.readAsText(file);
  });

  dropZone.addEventListener('click', function() {
    fileInput.click();
  });

  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      parseGenbank(e.target.result);
      fileInfo.textContent = `Loaded file: ${file.name}`;
      fileInfo.setAttribute('aria-live', 'polite');
    };
    reader.readAsText(file);
  });
});

function parseGenbank(text) {
  const featureRegex = /\/label="([^"]+)"[\s\S]*?\s+(\d+)\.\.(\d+)/g;
  const seqRegex = /ORIGIN([\s\S]*)\/\//;
  const seqMatch = text.match(seqRegex);
  let sequence = "";
  if (seqMatch) {
    sequence = seqMatch[1].replace(/[^acgtACGT]/g, "");
  }

  let match;
  while ((match = featureRegex.exec(text)) !== null) {
    const name = match[1];
    const start = parseInt(match[2], 10) - 1;
    const end = parseInt(match[3], 10);
    const subseq = sequence.slice(start, end).toUpperCase();
    features.push({name, seq: subseq, type: "CDS", color: "blue"});
  }
  updateOutput();
  showFeatureList();
}

function addFeature() {
  const name = document.getElementById('feature_name').value;
  const seq = document.getElementById('feature_seq').value.toUpperCase();
  const type = document.getElementById('feature_type').value;
  const color = document.getElementById('feature_color').value;
  features.push({name, seq, type, color});
  updateOutput();
  showFeatureList();
}

function updateOutput() {
  const output = document.getElementById('output');
  if (output) {
    output.textContent = features.map(f =>
      f.name + "\t" + f.seq + "\t" + f.type + "\t" + f.color + "\t0\t0"
    ).join("\n");
  }
}

function showFeatureList() {
  const list = document.getElementById('feature_list');
  list.innerHTML = '';
  features.forEach((f, i) => {
    const li = document.createElement('li');
    li.textContent = `${f.name} (${f.seq.length} bp)`;

    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.style.display = 'none';
    btn.onclick = (e) => {
      e.stopPropagation();
      features.splice(i, 1);
      updateOutput();
      showFeatureList();
    };

    li.onclick = () => {
      // Hide all other delete buttons
      document.querySelectorAll('#feature_list button').forEach(b => b.style.display = 'none');
      // Show the clicked one
      btn.style.display = 'inline-block';
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

function downloadFeatures() {
  const blob = new Blob([features.map(f => 
    f.name + "\t" + f.seq + "\t" + f.type + "\t" + f.color + "\t0\t0"
  ).join("\n")], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "features.txt";
  a.click();
  URL.revokeObjectURL(url);
}
</script>