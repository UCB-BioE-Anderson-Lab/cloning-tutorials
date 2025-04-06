# Simulation Tools

Now that you have learned how to simulate molecular biology steps by hand, let's look at how to automate these operations.

ApE provides graphical user interfaces for automating PCR, Golden Gate, and Gibson reactions under the **Tools** menu. It also supports digestion simulations via the **Enzymes / Enzyme Selector** menu. Benchling similarly provides visual tools to predict and simulate cloning steps like PCR and ligation.

You can also automate these experiments directly using **C6-Tools**, a simulation engine that interprets **Construction File (CF) shorthand** — a compact language for describing DNA assembly workflows. C6-Tools is available both below and embedded within Google Sheets:

🔗 [Open C6-Tools in Google Sheets](https://docs.google.com/spreadsheets/d/1WATXfGTY0VgpDDVf2EDKTBbBRSOQa_rFcOwFp1GsBjU/edit?usp=sharing)

The Google Sheets version includes a library of DNA design functions that you can access directly from spreadsheet cells. These include methods for `PCR`, `Digest`, `Ligate`, `GoldenGate`, and `Gibson`, as well as functions for parsing and simulating CF scripts. Visit the linked page and follow the instructions to get started.

--- 

## What is C6-Tools?

C6-Tools is a simulation engine for parsing and executing CF shorthand workflows. The same engine powers both the simulator below and the Google Sheets version you saw earlier. You can use this page anytime to test out your own CF scripts.

---

## Example: Simulating a PCR Step

Input the CF snippet below, then click **Simulate** to run it.

```
PCR          exFor2      exRev2      pTemp1       pcrpdt2

oligo        exFor2      ccataGAATTCCAGCGGATCGGATCGGCGAC
oligo        exRev2      cagatGGATCCCTGGTTCCGCCCGCACAACCG
plasmid      pTemp1      CTGGTGACCCAGCGGATCGGATCGGCGACCCAAAGCGCCTGGTTCCGCCCGCACAACCGCGA
```

<textarea id="cfInput" rows="6" style="width:100%; font-family:monospace;"></textarea>
<br>
<button onclick="simulateCF()">Simulate</button>

<div id="cfOutput" style="margin-top:20px;"></div>

<script>
// import { parseCF, simCF } from "js/C6-Main.js";
window.simulateCF = function simulateCF() {
    const input = document.getElementById("cfInput").value.trim();
    const outputDiv = document.getElementById("cfOutput");
    outputDiv.innerHTML = "";

    try {
        const steps = parseCF(input);
        const results = simCF(steps);

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        const header = table.insertRow();
        ["Step", "Operation", "Product", "Sequence"].forEach(text => {
            const th = document.createElement("th");
            th.innerText = text;
            th.style.borderBottom = "2px solid black";
            th.style.textAlign = "left";
            th.style.padding = "6px";
            header.appendChild(th);
        });

        results.forEach((step, i) => {
            const row = table.insertRow();
            [i + 1, step.operation, step.product, step.sequence].forEach(text => {
                const cell = row.insertCell();
                cell.innerText = text;
                cell.style.borderTop = "1px solid #ccc";
                cell.style.padding = "6px";
                cell.style.wordBreak = "break-word";
            });
        });

        outputDiv.appendChild(table);
    } catch (err) {
        outputDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
};
</script>

---

## Try Your Own Construction File

Paste your own CF script below and simulate full cloning workflows. Your CF can include multiple steps, such as PCR, digests, and ligations.

<textarea id="cfCustomInput" rows="10" style="width:100%; font-family:monospace;"></textarea>
<br>
<button onclick="simulateCustomCF()">Simulate</button>

<div id="cfCustomOutput" style="margin-top:20px;"></div>

<script>
window.simulateCustomCF = function simulateCustomCF() {
    const input = document.getElementById("cfCustomInput").value.trim();
    const outputDiv = document.getElementById("cfCustomOutput");
    outputDiv.innerHTML = "";

    try {
        const steps = parseCF(input);
        const results = simCF(steps);

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        const header = table.insertRow();
        ["Step", "Operation", "Product", "Sequence"].forEach(text => {
            const th = document.createElement("th");
            th.innerText = text;
            th.style.borderBottom = "2px solid black";
            th.style.textAlign = "left";
            th.style.padding = "6px";
            header.appendChild(th);
        });

        results.forEach((step, i) => {
            const row = table.insertRow();
            [i + 1, step.operation, step.product, step.sequence].forEach(text => {
                const cell = row.insertCell();
                cell.innerText = text;
                cell.style.borderTop = "1px solid #ccc";
                cell.style.padding = "6px";
                cell.style.wordBreak = "break-word";
            });
        });

        outputDiv.appendChild(table);
    } catch (err) {
        outputDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
};
</script>

---

## What’s Next

In the next tutorial, we’ll dive deeper into the **Construction File Shorthand** language and teach you how to write multi-step workflows from scratch. For now, keep experimenting with the simulator above!
