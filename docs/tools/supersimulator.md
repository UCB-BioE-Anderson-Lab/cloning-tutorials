<script src="https://unpkg.com/seqviz"></script>
<script src="https://cdn.jsdelivr.net/npm/c6-sim@1.0.11/dist/c6-sim.min.js"></script>

# SuperSimulator

Warning!  This is an experimental tool and may give erroneous results!

This tool lets you simulate a molecular biology construction file (CF), view the result, and auto-annotate the final product.

---

## Step 1: Paste Your Construction File

<textarea id="cf_input" rows="10" style="width:100%; font-family:monospace;"></textarea>
<button type="button" id="simulate_btn" style="margin-top:10px;">Simulate CF</button>
<p id="cf_output" style="margin-top: 10px; font-weight:bold;"></p>

---

## Step 2: Auto-Annotate Output

<textarea id="seq_input" rows="10" style="width:100%; font-family:monospace;"></textarea>
<button type="button" id="annotate_btn" style="margin-top:10px;">Annotate and Simulate</button>
<div id="annotation_output" style="margin-top: 20px;"></div>

<script>
window.addEventListener("load", function() {
  document.getElementById("simulate_btn").addEventListener("click", function () {
    const cfText = document.getElementById("cf_input").value.trim();
    const resultP = document.getElementById("cf_output");
    resultP.innerHTML = "";

    try {
      const cf = C6.parseCF(cfText);
      const results = C6.simCF(cf);

      if (!Array.isArray(results) || results.length === 0) {
        resultP.innerHTML = "❌ No simulation output. Please check your CF.";
        return;
      }

      let outputHTML = "<p style='color:green; font-weight:bold;'>✅ Simulation successful!</p>";
      outputHTML += "<table style='width:100%; border-collapse:collapse;'><thead><tr><th style='border-bottom:1px solid #ccc; text-align:left;'>Name</th><th style='border-bottom:1px solid #ccc; text-align:left;'>Sequence</th></tr></thead><tbody>";
      results.forEach(row => {
        if (Array.isArray(row) && row.length >= 2) {
          const name = row[0];
          const seq = row[1].sequence;
          outputHTML += `<tr><td style="padding:4px 8px; border-bottom:1px solid #eee;">${name}</td><td style="padding:4px 8px; border-bottom:1px solid #eee; font-family:monospace;">${seq}</td></tr>`;
        }
      });
      outputHTML += "</tbody></table>";
      resultP.innerHTML = outputHTML;

      const lastSeq = results[results.length - 1][1].sequence;
      document.getElementById("seq_input").value = lastSeq;

    } catch (err) {
      resultP.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
    }
  });

  document.getElementById("annotate_btn").addEventListener("click", function () {
    const dnaInput = document.getElementById("seq_input").value.trim();
    const outputDiv = document.getElementById("annotation_output");
    outputDiv.innerHTML = "";

    try {
      const rawFeatures = JSON.parse(localStorage.getItem("features") || "[]");
      const featureLibrary = rawFeatures.map(f => ({
        Name: f.name,
        Sequence: f.seq,
        Type: f.type || "misc_feature",
        Color: f.color || "gray"
      }));
      const features = C6.annotateSequence(dnaInput, featureLibrary);
      const tus = C6.inferTranscriptionalUnits(features);
      const expressed = C6.inferExpressedProteins(tus);
      const nonExpressed = C6.findNonExpressedCDS(features, expressed);

      let html = "<h3>Detected Features</h3><ul>";
      features.forEach(f => {
        html += `<li>${f.label} (${f.type}) at ${f.start}-${f.end}</li>`;
      });
      html += "</ul>";

      html += "<h3>Transcriptional Units</h3><table><tr><th>Promoter</th><th>Start</th><th>End</th><th>Terminator</th><th>Features</th></tr>";
      tus.forEach(tu => {
        const feats = tu.features.map(f => `${f.label} (${f.type})`).join(", ");
        html += `<tr><td>${tu.promoter?.label || "(none)"}</td><td>${tu.start}</td><td>${tu.end}</td><td>${tu.terminator?.label || "(none)"}</td><td>${feats}</td></tr>`;
      });
      html += "</table>";

      html += "<h3>Expressed Proteins</h3><ul>";
      expressed.forEach(p => html += `<li>${p.label}</li>`);
      html += "</ul><h3>Non-Expressed CDS</h3><ul>";
      nonExpressed.forEach(p => html += `<li>${p.label}</li>`);
      html += "</ul>";

      outputDiv.innerHTML = html + `<h3>Sequence Viewer</h3><div id="seqviz_viewer"></div>`;

      waitForSeqViz(() => {
        const annotations = features.map(f => ({
          name: f.label,
          start: f.start,
          end: f.end,
          color: f.color || "gray",
          direction: f.strand || 1
        }));

        seqviz
          .Viewer("seqviz_viewer", {
            name: "Simulated Product",
            seq: dnaInput,
            annotations: annotations,
            primers: [],
            viewer: "linear",
            showComplement: true,
            showIndex: true,
            style: { height: "420px", width: "100%" }
          })
          .render();
      });

    } catch (err) {
      outputDiv.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
    }
  });

  function waitForSeqViz(cb) {
    if (typeof seqviz !== "undefined" && seqviz.Viewer) cb();
    else setTimeout(() => waitForSeqViz(cb), 50);
  }
});
</script>