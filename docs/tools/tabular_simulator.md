<script src="https://unpkg.com/seqviz"></script>
<script src="https://cdn.jsdelivr.net/npm/c6-sim@1.0.11/dist/c6-sim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.css" />

<style>
/* Expand the page and suppress side navigation for full-width usage */
body, .md-content, .md-main__inner {
  max-width: 100% !important;
  width: 100% !important;
  margin: 0;
  padding: 0;
}
.md-sidebar, .md-header {
  display: none !important;
}
#simulator-container {
  display: flex;
  gap: 20px;
  padding: 10px 20px 0 20px;
  height: calc(100vh - 40px);
  box-sizing: border-box;
  margin-top: 0;
}
h1 {
  margin: 10px 20px 0 20px;
}
#left-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
}
#spreadsheet {
  height: 500px;
  overflow: auto;
  border: 1px solid #ccc;
}
#right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}
#sequence_input {
  flex: 0 0 300px;
  width: 100%;
  font-family: monospace;
}
#cf_output, #annotation_output {
  padding: 20px;
}
h3 {
  margin: 0 0 8px 0;
}
  .handsontable .htCore td,
  .handsontable .htCore th {
    white-space: nowrap !important;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 24px;
    line-height: 24px;
    padding: 2px 4px;
  }
</style>

# Tabular Simulator

---

<div id="simulator-container">
  <div id="left-panel">
    <h3>🧬 Edit Your Construction File</h3>
    <div id="spreadsheet"></div>
  </div>
  <div id="right-panel">
    <h3>🧫 Injected Sequences</h3>
    <div>
      <ul id="sequence_list" style="padding-left: 20px;"></ul>
      <input type="file" id="file_input" accept=".seq,.gcc,.ape,.gb,.gbk" style="margin-bottom:10px;" />
      <button id="clear_sequences">Clear All</button>
      <button id="annotate_btn">Simulate</button>
    </div>
  </div>
</div>

<div id="cf_output"></div>
<div id="annotation_output"></div>

<script>
window.addEventListener("load", function () {
  const container = document.getElementById("spreadsheet");
  const hot = new Handsontable(container, {
    data: Array.from({ length: 25 }, (_, i) =>
      i === 0 ? ["PCR", "P6libF", "P6libR", "pTP1", "P6", "", "", "", ""] : Array(20).fill("")
    ),
    rowHeaders: true,
    colHeaders: true,
    contextMenu: true,
    manualColumnResize: true,
    height: "100%",
    colWidths: 100,
    licenseKey: "non-commercial-and-evaluation"
  });

  document.getElementById("annotate_btn").addEventListener("click", function () {
    const cfData = hot.getData();
    const cfOutput = document.getElementById("cf_output");
    cfOutput.innerHTML = "";
    const annotationOutput = document.getElementById("annotation_output");
    annotationOutput.innerHTML = "";

    try {
      const cleanedCF = cfData.map(row => row.map(cell =>
        typeof cell === "string" ? cell.trim() : cell
      ));
      const cf = C6.parseCF(cleanedCF);
      const storedSequences = JSON.parse(localStorage.getItem("features") || "[]");
      const sequenceDict = Object.fromEntries(
        storedSequences
          .filter(s => s.name && s.seq)
          .map(s => {
            console.log(`Injecting ${s.name} with sequence (first 60bp):`, s.seq.slice(0, 60));
            if (typeof s.seq !== "string") {
              console.warn(`Expected string for ${s.name}, got`, typeof s.seq, s.seq);
            }
            const poly = C6.plasmid(s.seq);
            console.log(`Created polynucleotide for ${s.name}:`, poly);
            return [s.name, poly];
          })
      );
      // Debug logging for key mismatches between spreadsheet and injected sequences
      console.log("Sequence keys injected into simCF:", Object.keys(sequenceDict));
      console.log("Spreadsheet cell values:", cfData.flat().filter(x => typeof x === "string"));
      // Merge injected sequences into the cf.sequences field for simCF
      const fullSequences = { ...cf.sequences, ...sequenceDict };
      const results = C6.simCF({ steps: cf.steps, sequences: fullSequences });

      if (!Array.isArray(results) || results.length === 0) {
        cfOutput.innerHTML = "❌ No simulation output. Please check your CF.";
        return;
      }

      let outputHTML = "<p style='color:green; font-weight:bold;'>✅ Simulation successful!</p>";
      outputHTML += "<table style='width:100%; border-collapse:collapse;'><thead><tr><th>Name</th><th>Sequence</th></tr></thead><tbody>";
      results.forEach(row => {
        if (Array.isArray(row) && row.length >= 2) {
          const name = row[0];
          const seqObj = row[1];
          const seq = typeof seqObj === "string" ? seqObj : seqObj.sequence;
          outputHTML += `<tr><td style="padding:4px 8px;">${name}</td><td style="padding:4px 8px; font-family:monospace;">${seq}</td></tr>`;
        }
      });
      outputHTML += "</tbody></table>";
      cfOutput.innerHTML = outputHTML;

      let dnaInput;
      if (storedSequences.length > 0) {
        dnaInput = storedSequences[storedSequences.length - 1].seq;
      } else {
        dnaInput = results[results.length - 1][1].sequence;
      }

      try {
        const featureLibrary = storedSequences.map(f => ({
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

        annotationOutput.innerHTML = html + `<h3>Sequence Viewer</h3><div id="seqviz_viewer"></div>`;

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
        annotationOutput.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
      }
    } catch (err) {
      cfOutput.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
    }
  });

  function waitForSeqViz(cb) {
    if (typeof seqviz !== "undefined" && seqviz.Viewer) cb();
    else setTimeout(() => waitForSeqViz(cb), 50);
  }

  function refreshSequenceList() {
    const list = document.getElementById("sequence_list");
    list.innerHTML = "";
    const stored = JSON.parse(localStorage.getItem("features") || "[]");
    stored.forEach((s, i) => {
      const li = document.createElement("li");
      li.textContent = s.name || `(unnamed ${i + 1})`;
      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑";
      delBtn.style.marginLeft = "8px";
      delBtn.onclick = () => {
        stored.splice(i, 1);
        localStorage.setItem("features", JSON.stringify(stored));
        refreshSequenceList();
      };
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  // Extract polynucleotides from GenBank-formatted DNA
  function extractPolynucleotides(text) {
    const nameMatch = text.match(/LOCUS\s+(\S+)/);
    const name = nameMatch ? nameMatch[1] : "unnamed";
    const seqMatch = text.match(/ORIGIN([\s\S]*)\/\//);
    const seq = seqMatch ? seqMatch[1].replace(/[^acgtACGT]/g, "").toUpperCase() : "";
    return seq ? [{ name, seq }] : [];
  }
  document.getElementById("clear_sequences").onclick = () => {
    localStorage.removeItem("features");
    refreshSequenceList();
  };
  document.getElementById("file_input").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const text = ev.target.result;
      const newSeqs = extractPolynucleotides(text);
      const stored = JSON.parse(localStorage.getItem("features") || "[]");
      newSeqs.forEach(s => stored.push(s));
      localStorage.setItem("features", JSON.stringify(stored));
      refreshSequenceList();
    };
    reader.readAsText(file);
  });
  refreshSequenceList();
});
</script>