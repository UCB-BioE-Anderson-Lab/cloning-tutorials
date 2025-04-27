# GenBank/APE Feature Extractor

This tool allows you to drag and drop `.gb`, `.genbank`, or `.ape` files and extract features (name, color, sequence) into a simple format.

---

<div id="drop_zone_container" style="position: relative;">
<style>
#drop_zone_container #drop_zone {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  padding: 40px;
  border: 2px dashed #3399ff;
  margin-bottom: 20px;
  text-align: center;
  height: 60vh;
  cursor: pointer;
  background-color: #e6f2ff;
  transition: background-color 0.3s;
}
#drop_zone_container #drop_zone.dragover {
  background-color: #cce6ff;
}
</style>

<div id="drop_zone">
  <strong>Drop your .gb/.genbank/.ape file here or click to upload</strong>
</div>
<input type="file" id="file_input" style="display:none;" accept=".gb,.genbank,.ape">

<div id="content_wrapper" style="position: relative; z-index: 2;">
  <form id="feature_form">
    <h3>Add Feature Manually</h3>
    Name: <input type="text" id="feature_name" required> 
    Sequence: <textarea id="feature_seq" rows="3" required></textarea> 
    Type: <input type="text" id="feature_type" value="CDS" required> 
    Color: <input type="text" id="feature_color" value="blue" required> 
    <button type="button" onclick="addFeature()">Add Feature</button>
  </form>

  <h3>Collected Features:</h3>
  <pre id="output"></pre>

  <button onclick="downloadFeatures()">Download Features</button>
</div>
</div>

<script>
let features = [];

document.getElementById('drop_zone').addEventListener('dragover', function(e) {
  e.preventDefault();
  this.classList.add('dragover');
});

document.getElementById('drop_zone').addEventListener('dragleave', function(e) {
  e.preventDefault();
  this.classList.remove('dragover');
});

document.getElementById('drop_zone').addEventListener('drop', function(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    parseGenbank(e.target.result);
  };
  reader.readAsText(file);
});

document.getElementById('drop_zone').addEventListener('click', function() {
  document.getElementById('file_input').click();
});

document.getElementById('file_input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    parseGenbank(e.target.result);
  };
  reader.readAsText(file);
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
}

function addFeature() {
  const name = document.getElementById('feature_name').value;
  const seq = document.getElementById('feature_seq').value.toUpperCase();
  const type = document.getElementById('feature_type').value;
  const color = document.getElementById('feature_color').value;
  features.push({name, seq, type, color});
  updateOutput();
}

function updateOutput() {
  document.getElementById('output').textContent = features.map(f => 
    f.name + "\t" + f.seq + "\t" + f.type + "\t" + f.color + "\t0\t0"
  ).join("\n");
}

function downloadFeatures() {
  const blob = new Blob([document.getElementById('output').textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "features.txt";
  a.click();
  URL.revokeObjectURL(url);
}
</script>