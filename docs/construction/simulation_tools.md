# Simulation Tools

Now that you have learned how to simulate molecular biology steps by hand, let's look at how to automate these operations.

ApE provides graphical user interfaces for automating PCR, Golden Gate, and Gibson reactions under the **Tools** menu. It also supports digestion simulations via the **Enzymes / Enzyme Selector** menu. Benchling similarly provides visual tools to predict and simulate cloning steps like PCR and ligation.

You can also automate these workflows using **C6-Tools**, a simulation engine that interprets **Construction File (CF) shorthand** — a compact language for describing DNA assembly steps. C6-Tools is available as both a web-based tool (below) and as a library embedded in Google Sheets:

🔗 [Open C6-Tools in Google Sheets](https://docs.google.com/spreadsheets/d/1WATXfGTY0VgpDDVf2EDKTBbBRSOQa_rFcOwFp1GsBjU/edit?usp=sharing)

The Google Sheets version includes a library of DNA design functions that you can access directly from spreadsheet cells. These include methods for `PCR`, `Digest`, `Ligate`, `GoldenGate`, and `Gibson`, as well as functions for parsing and simulating CF scripts. Visit the linked page and follow the instructions to get started.


--- 

## Try it out

Below is a sample Construction File that defines a simple PCR. Click the button to copy the example and test it using the tool.

<pre id="cf_quiz_example" style="background:#f8f8f8; border:1px solid #ccc; padding:10px; border-radius:4px; overflow-x:auto; white-space:pre;">PCR          exFor2      exRev2      pTemp1       pcrpdt2

oligo        exFor2      ccataGAATTCCAGCGGATCGGATCGGCGAC
oligo        exRev2      cagatGGATCCCGGTTGTGCGGGCGGAACC
plasmid      pTemp1      CTGGTGACCCAGCGGATCGGATCGGCGACCCAAAGCGCCTGGTTCCGCCCGCACAACCGCGA</pre>
<button onclick="navigator.clipboard.writeText(document.getElementById('cf_quiz_example').innerText)" style="margin-top:5px;">Copy Example</button>

<form id="cf_quiz_form" style="background-color:#d8edfa; padding:20px; border:1px solid #ccc; border-radius:6px; margin-top:20px;">
  <p><strong>Paste your Construction File (CF) below</strong> and click <strong>Simulate</strong>. If it runs successfully, you’ll complete the quiz.</p>
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
      if (!window.C6 || typeof window.C6.parseCF !== "function") {
        throw new Error("C6 tools not loaded. Please ensure window.C6 is available.");
      }

      const steps = window.C6.parseCF(input);
      console.log(steps)

      const results = window.C6.simCF(steps);
      console.log(results)

      if (!Array.isArray(results) || results.length === 0) {
        resultP.innerHTML = "❌ No simulation steps returned. Please check your input.";
        return;
      }

      let outputHTML = "<p style='color:green; font-weight:bold;'>✅ Simulation successful!</p>";
      outputHTML += "<table style='width:100%; border-collapse:collapse;'><thead><tr><th style='border-bottom:1px solid #ccc; text-align:left;'>Name</th><th style='border-bottom:1px solid #ccc; text-align:left;'>Sequence</th></tr></thead><tbody>";

      results.forEach(row => {
        if (Array.isArray(row) && row.length >= 2) {
          const name = row[0];
          const seq = row[1];
          outputHTML += `<tr><td style="padding:4px 8px; border-bottom:1px solid #eee;">${name}</td><td style="padding:4px 8px; border-bottom:1px solid #eee; font-family:monospace;">${seq}</td></tr>`;
        }
      });

      outputHTML += "</tbody></table>";
      resultP.innerHTML = outputHTML;

      if (typeof window.progressManager !== "undefined") {
        window.progressManager.addCompletion("simulation_tools_q1", "correct");
      }
    } catch (err) {
      resultP.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
    }
  });
</script>
