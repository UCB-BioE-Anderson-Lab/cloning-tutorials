<script src="https://unpkg.com/seqviz"></script>
<script src="https://cdn.jsdelivr.net/npm/c6-sim@1.0.11/dist/c6-sim.min.js"></script>

# Simulation Tools

Several tools can automate molecular cloning workflows. ApE and Benchling offer graphical interfaces for simulating steps like PCR, Golden Gate, Gibson, and digestion reactions. Alternatively, C6-Tools provides a scripting-based approach using Construction File (CF) shorthand, and is available both as a web tool and as a Google Sheets plugin:

🔗 [Open C6-Tools in Google Sheets](https://docs.google.com/spreadsheets/d/1WATXfGTY0VgpDDVf2EDKTBbBRSOQa_rFcOwFp1GsBjU/edit?usp=sharing)

The Google Sheets version includes a library of DNA design functions that you can access directly from spreadsheet cells. These include methods for `PCR`, `Digest`, `Ligate`, `GoldenGate`, and `Gibson`, as well as functions for parsing and simulating CF scripts. Visit the linked page and follow the instructions to get started.


--- 


## Understanding CF Syntax

The Construction File (CF) format is a streamlined way to describe molecular cloning procedures using a structured table-like syntax. Each line specifies either:

- An **operation** to perform (e.g., `PCR`)
- A **sequence element** involved in the operation (e.g., an `oligo` or `plasmid`)

Each line begins with a **keyword** (like `PCR`, `oligo`, or `plasmid`) followed by a set of fields separated by either tabs or multiple spaces. These fields define the names and sequences needed for simulation.

### PCR Line Breakdown

For example, the line:

```
PCR          exFor2      exRev2      pTemp1       pcrpdt2
```

...defines a **PCR** reaction using:

- a forward primer called `exFor2`
- a reverse primer called `exRev2`
- a circular DNA template called `pTemp1`
- a product that will be named `pcrpdt2`

### Naming Rules

Each name (or "identifier") you use for DNA sequences—like primers, templates, or products—needs to follow specific rules:

- You can use: letters, numbers, dashes (`-`), underscores (`_`), dots (`.`), plus signs (`+`), and backticks (<code>`</code>)
- Do not use: commas, spaces, quotes, parentheses, or other special symbols—they can cause errors during simulation
- Names are case-sensitive: `pTemp1` and `ptemp1` would be treated as different sequences

You will learn other operation types like `Digest` and `GoldenGate` later in the tutorial, and this tool below can simulate those too.  For now, focus on reading and writing PCR-related lines.

## Try it out

Now it’s your turn to explore how CF syntax works in practice. The example below defines a PCR reaction using two primers and a circular DNA template. Try copying and pasting it into the form to simulate the result. Then, try breaking things on purpose—like deleting the last 10 bases of a primer or giving two sequences the same name—to see how the tool catches design errors and helps you debug. This is a quick way to test your understanding before moving on to more complex operations.

<pre id="cf_quiz_example" style="background:#f8f8f8; border:1px solid #ccc; padding:10px; border-radius:4px; overflow-x:auto; white-space:pre;">PCR          exFor2      exRev2      pTemp1       pcrpdt2

oligo        exFor2      ccataGAATTCCAGCGGATCGGATCGGCGAC
oligo        exRev2      cagatGGATCCCGGTTGTGCGGGCGGAACC
plasmid      pTemp1      CTGGTGACCCAGCGGATCGGATCGGCGACCCAAAGCGCCTGGTTCCGCCCGCACAACCGCGA</pre>
<button onclick="navigator.clipboard.writeText(document.getElementById('cf_quiz_example').innerText)" style="margin-top:5px;">Copy Example</button>


<form id="cf_quiz_form" style="background-color:#d8edfa; padding:20px; border:1px solid #ccc; border-radius:6px; margin-top:20px;">
  <p><strong>Paste your Construction File (CF) below</strong> and click <strong>Simulate</strong>. You’ll see the resulting sequences, and if your design is valid, it will complete the quiz.</p>
  <textarea id="cf_quiz_input" rows="10" style="width:100%; font-family:monospace;"></textarea>
  <br>
  <button type="button" id="cf_quiz_btn" style="margin-top:10px;">Simulate</button>
  <p id="cf_quiz_result" style="margin-top: 10px; font-weight:bold;"></p>
</form>

<script>
  document.getElementById("cf_quiz_btn").addEventListener("click", function () {
    const input = document.getElementById("cf_quiz_input").value.trim();
    const resultP = document.getElementById("cf_quiz_result");
    resultP.innerHTML = "";

    try {
      if (!C6 || typeof C6.parseCF !== "function") {
        throw new Error("C6 tools not loaded. Please ensure C6 is available.");
      }

      // Inject sequences for simulation as Polynucleotide objects
      const injections = "";

      const cf = C6.parseCF(input + injections);
      // Check for at least one gibson step in cf.steps
      const hasGibson = Array.isArray(cf.steps) && cf.steps.some(step => step.operation?.toLowerCase() === "gibson");
      console.log(cf)
      const results = C6.simCF(cf);

      if (typeof window.progressManager !== "undefined") {
        window.progressManager.addCompletion("simulation_tools_q1", "correct");
      }

      // Format and display output products table
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

      if (!Array.isArray(results) || results.length === 0) {
        resultP.innerHTML = "❌ No simulation steps returned. Please check your input.";
        return;
      }

      resultP.innerHTML = outputHTML;
    } catch (err) {
      resultP.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
    }
  });
</script>

The C6 simulation algorithm inputs both the construction file and an (optional) list of sequences with their names. The algorithm will include both the sequences embedded in the CF as well as those in the separate list. In these tutorials, we have injected the plasmids named in the various examples into this list.  For other sequences, you will need to put them in the CF.


## DNA Autoannotation and Simulation

The tutorials can also autoannotate your sequence, detect transcriptional units, and predict which proteins are potentially expressed or will not be expressed.  This can be helpful for detecting design errors.  This capability is only displayed on this page.

<form id="autoannotation_form" style="background-color:#f0f8ff; padding:20px; border:1px solid #ccc; border-radius:6px; margin-top:20px;">
  <p><strong>Paste a DNA sequence below</strong> and click <strong>Annotate and Simulate</strong>.</p>
  <textarea id="dna_input" rows="10" style="width:100%; font-family:monospace;"></textarea>
  <br>
  <button type="button" id="annotate_btn" style="margin-top:10px;">Annotate and Simulate</button>
  <div id="annotation_output" style="margin-top: 20px;"></div>
</form>

<script>
window.addEventListener("load", function() {
  let features = [];
  let dnaInput = "";
  document.getElementById("annotate_btn").addEventListener("click", function () {
    dnaInput = document.getElementById("dna_input").value.trim();
    const outputDiv = document.getElementById("annotation_output");
    outputDiv.innerHTML = "";

    try {
      if (!C6 || typeof C6.annotateSequence !== "function") {
        throw new Error("C6 tools not loaded. Please ensure C6 is available.");
      }

      features = C6.annotateSequence(dnaInput);
      const tus = C6.inferTranscriptionalUnits(features);
      const expressed = C6.inferExpressedProteins(tus);
      const nonExpressed = C6.findNonExpressedCDS(features, expressed);

      let html = "<h3>Detected Features</h3><ul>";
      features.forEach(f => {
        html += `<li>${f.label} (${f.type}) at ${f.start}-${f.end}</li>`;
      });
      html += "</ul>";

      html += "<h3>Detected Transcriptional Units</h3>";
      html += "<table style='width:100%; border-collapse:collapse;'><thead><tr>";
      html += "<th>Promoter</th><th>Start</th><th>End</th><th>Terminator</th><th>Features</th>";
      html += "</tr></thead><tbody>";

      tus.forEach((tu) => {
        const featuresList = tu.features.map(f => `${f.label} (${f.type})`).join(", ");
        html += `<tr>
          <td style="padding:4px 8px;">${tu.promoter ? tu.promoter.label : "(none)"}</td>
          <td style="padding:4px 8px;">${tu.start}</td>
          <td style="padding:4px 8px;">${tu.end}</td>
          <td style="padding:4px 8px;">${tu.terminator ? tu.terminator.label : "(none)"}</td>
          <td style="padding:4px 8px;">${featuresList}</td>
        </tr>`;
      });

      html += "</tbody></table>";

      html += "<h3>Expressed Proteins</h3><ul>";
      expressed.forEach(p => {
        html += `<li>${p.label}</li>`;
      });
      html += "</ul>";

      html += "<h3>Non-Expressed CDS</h3><ul>";
      nonExpressed.forEach(p => {
        html += `<li>${p.label}</li>`;
      });
      html += "</ul>";

      outputDiv.innerHTML = html;

      outputDiv.innerHTML += `
        <h3>Sequence Visualization</h3>
        <div id="seqviz_viewer" style="margin-top:1em;"></div>
      `;

    } catch (err) {
      outputDiv.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
      return;
    }

    waitForSeqViz(() => {
      const annotations = [];
      const primers = [];

      features.forEach(f => {
        const cleanType = f.type.toLowerCase();
        const featureData = {
          name: f.label,
          start: f.start,
          end: f.end,
          color: f.color || "gray",
          direction: f.strand || 1
        };

        if (["promoter", "terminator", "rbs", "operator", "enhancer", "silencer", "riboswitch", "insulator", "polyA_signal", "kozak"].includes(cleanType)) {
          annotations.push(featureData);
        } else if (["primer_bind", "oligo"].includes(cleanType)) {
          primers.push(featureData);
        } else {
          annotations.push(featureData);
        }
      });

      seqviz
        .Viewer("seqviz_viewer", {
          name: "Annotated Sequence",
          seq: dnaInput,
          annotations: annotations,
          primers: primers,
          translations: [],
          viewer: "linear",
          showComplement: true,
          showIndex: true,
          style: { height: "420px", width: "100%" }
        })
        .render();
    });
  });

  function waitForSeqViz(callback) {
    if (typeof seqviz !== "undefined" && seqviz.Viewer) {
      callback();
    } else {
      setTimeout(() => waitForSeqViz(callback), 50);
    }
  }
});
</script>