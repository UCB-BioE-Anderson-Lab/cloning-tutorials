# Feature Manager

This tool manages your locally stored features extracted from GenBank/APE files or added manually. All features are stored in your browser's localStorage.

----

<div class="container">
  <section class="panel">
    <h3>Saved Features</h3>
    <ul id="feature_list" class="feature-list"></ul>
    <button onclick="clearFeatures()">Delete All Features</button>
    <button onclick="downloadFeatures()">Download Features</button>
    <input type="file" id="upload_file" accept=".tsv,.txt" />
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
.feature-list {
  list-style: none;
  padding-left: 0;
  max-height: 400px;
  overflow-y: auto;
}
.feature-list li {
  background: #ffffff;
  border: 1px solid #ccc;
  padding: 6px 8px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
}
.feature-color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  margin: 0 4px;
}
.feature-left {
  display: grid;
  grid-template-columns: 120px 80px 24px 24px 1fr;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.feature-seq {
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}
.delete-btn {
  background-color: #ff4d4d;
  border: none;
  padding: 4px 8px;
  color: white;
  cursor: pointer;
  margin-top: 5px;
  align-self: flex-start;
  display: none;
}
.feature-list li:hover .delete-btn {
  display: inline-block;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function () {
  const features = JSON.parse(localStorage.getItem('features') || '[]');
  const list = document.getElementById('feature_list');

  function formatSequence(seq) {
    if (seq.length < 30) return seq;
    return seq.slice(0, 15) + '...' + seq.slice(seq.length - 15);
  }

  function showFeatureList() {
    list.innerHTML = '';
    features.forEach((f, i) => {
      const li = document.createElement('li');

      const left = document.createElement('div');
      left.className = 'feature-left';

      const name = document.createElement('span');
      name.textContent = f.name;

      const type = document.createElement('span');
      type.textContent = f.type || 'CDS';

      const colorDot = document.createElement('span');
      colorDot.className = 'feature-color';
      colorDot.style.backgroundColor = f.color || 'blue';

      const revDot = document.createElement('span');
      revDot.className = 'feature-color';
      revDot.style.backgroundColor = f.revColor || f.color || 'blue';

      const preview = document.createElement('span');
      preview.className = 'feature-seq';
      preview.textContent = formatSequence(f.seq || '');

      left.appendChild(name);
      left.appendChild(type);
      left.appendChild(colorDot);
      left.appendChild(revDot);
      left.appendChild(preview);

      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.className = 'delete-btn';
      del.onclick = (e) => {
        e.stopPropagation();
        features.splice(i, 1);
        localStorage.setItem('features', JSON.stringify(features));
        showFeatureList();
      };

      li.appendChild(left);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  window.clearFeatures = function () {
    localStorage.removeItem('features');
    showFeatureList();
  };

  window.downloadFeatures = function () {
    const data = features.map(f =>
      `${f.name}\t${f.seq}\t${f.type || 'CDS'}\t${f.color || 'blue'}\t0\t0`
    ).join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'features.tsv';
    a.click();
    URL.revokeObjectURL(url);
  };

  showFeatureList();

  // File upload for importing features from .tsv/.txt
  document.getElementById('upload_file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const lines = e.target.result.trim().split('\n');
      lines.forEach(line => {
        const parts = line.split('\t');
        if (parts.length >= 6) {
          const [name, seq, type, color, revColor] = parts;
          features.push({ name, seq, type, color, revColor });
        }
      });
      localStorage.setItem('features', JSON.stringify(features));
      showFeatureList();
    };
    reader.readAsText(file);
  });
});
</script>