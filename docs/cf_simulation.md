# Construction File Simulation

In this tutorial, you'll learn how to simulate the steps of a cloning experiment using **Construction File (CF) shorthand** and the **C6-Tools** system. You just learned how to manually predict the output of a PCR reaction. Now we’ll show you how to automate that — and much more.

---

## What is C6-Tools?

C6-Tools is a simulation engine for parsing and executing construction files — a shorthand way of describing DNA assembly workflows. These tools are also integrated in Google Sheets:

🔗 [Open C6-Tools in Google Sheets](https://docs.google.com/spreadsheets/d/1WATXfGTY0VgpDDVf2EDKTBbBRSOQa_rFcOwFp1GsBjU/edit?usp=sharing)

Here, you're using a browser-based version of the same engine. You can come back to this page anytime to test a CF script.

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
