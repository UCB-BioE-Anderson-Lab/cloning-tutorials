<script src="https://cdn.jsdelivr.net/npm/c6-sim@1.0.11/dist/c6-sim.min.js"></script>

# Gibson Assembly

## Why Gibson Assembly?

In the previous tutorial, you used restriction enzymes to insert the INS gene into a pET vector. This is a reliable method, but it has a key limitation: it depends on restriction sites being in the right places.

In synthetic biology, you often need to assemble multiple parts with precise control over sequence. This is where **Gibson Assembly** shines. It allows you to join DNA fragments without restriction sites—using only sequence overlaps.

---

## 🔬 How Gibson Assembly Works

![Schematic diagram of Gibson Assembly, showing the three-enzyme process used to assemble DNA fragments with overlapping ends.](../images/Gibson_Assembly_diagram.png)  
*Figure: Gibson Assembly joins DNA fragments with overlapping ends in a seamless, scarless way. An exonuclease chews back 5′ ends, exposing complementary overhangs. These anneal, and a polymerase fills in gaps. A ligase seals the nicks, yielding a continuous double-stranded product.*  
📷 Diagram credit: [SnapGene Gibson Guide](https://www.snapgene.com/guides/gibson-assembly)

**The enzyme mix includes three key components:**

1. **5′ Exonuclease**: Creates single-stranded 3′ overhangs by chewing back the 5′ ends.
2. **DNA Polymerase**: Fills in gaps after annealing.
3. **DNA Ligase**: Seals the nicks to produce a covalently closed DNA strand.

This method is scarless, seamless, and does not rely on restriction sites.

---

## Overview of This Tutorial

In this exercise, we'll recreate the **pET-INS** plasmid—but using Gibson Assembly instead of restriction enzymes.

You’ll use PCR to create two fragments:

- One containing the *INS* gene
- One containing the pET28a backbone

We'll design primers that add 20–30 bp overlaps, simulate the assembly, and validate the final construct.

---

## Step 1: Define Your Product

Start by constructing a model of the final pET-INS plasmid:

1. Open the pET28a vector sequence and convert it to **UPPERCASE**.
2. Open the insulin cDNA sequence and convert it to **lowercase**.
3. Paste the INS cds into the intended insertion site as done in the basic cloning tutorial.

This marks where the insert meets the vector, making it easier to plan overlaps.

🔗 Downloads:

- [pET28a GenBank](../assets/pET28a.seq)
- [INS GenBank](../assets/insulin_cdna.seq)

---

## Step 2: Design Oligos

After modeling your final plasmid with insert and vector joined, identify the junctions where fragments meet.

For each junction:

- Select ~20 bp from the end of one fragment
- Select ~20 bp from the start of the next fragment
- Concatenate these to form a 40 bp primer

Use this 40 bp sequence directly as the **forward oligo**.  
For the opposite junction, take the corresponding 40 bp and reverse complement it to create the **reverse oligo**.

When choosing the ~20, follow the same general approach for finding annealing sequences between 18 and 25 bp long, balanced base content, etc. as done previously in the Basic Cloning tutorial.

---

## Step 3: Simulate the Gibson Assembly

Start by simulating the assembly manually to understand what’s happening:

1. Predict the PCR products using your designed primers anneal as expected
2. Identify the overlapping sequences at the ends of each fragment.
3. For each overlap, delete one copy so the fragments can join seamlessly.
4. Join the trimmed fragments to form your final product.

Then try using simulation tools to automate the process:

- **ApE** and **Benchling** allow you to simulate Gibson assemblies graphically.
- You can also use the **C6 Tools** to simulate the full CF script:  
  🔗 [Use C6 simulation tools](../simulation_tools/)

These tools let you verify that your oligos will function as expected.

---

## 🎯 Try it yourself

In your quiz, you'll use the randomly selected gene from *Bacillus atrophaeus UCMB-5137* as done before in the Basic Cloning tutorial.  Also, you will again be cloning it into the NcoI and XhoI restriction sites generating the same product plasmid as before. However, this time, you will make that plasmid by Gibson assembly instead of traditional restriction enzymes.

<div id="geneInfo"></div>
<script>
function waitForProgressManager(callback) {
  if (window.progressManager && typeof window.progressManager.getAssignedGeneDetails === "function") {
    callback();
  } else {
    setTimeout(() => waitForProgressManager(callback), 50);
  }
}

waitForProgressManager(() => {
  const gene = window.progressManager.getAssignedGeneDetails();
  console.log(gene);

  const geneInfo = `
    <h3>Quiz Instructions</h3>
    <p>
      For your quiz, you will clone the CDS from the gene <strong>${gene.name}</strong> 
      (<code>${gene.locus_tag}</code>) from <em>Bacillus atrophaeus strain UCMB-5137</em> (<code>CP011802.1</code>).
    </p>
    <p>
      This gene is a <strong>coding DNA sequence (CDS)</strong> — an open reading frame (ORF) that starts
      with a start codon (<code>ATG</code>) and ends with a stop codon (<code>TAA</code>, <code>TAG</code>, or <code>TGA</code>).
    </p>
    <p>
      We are giving you just the CDS — no promoter, no terminator, no RBS. Use the entire sequence in your design.
    </p>
    <table>
      <tr><td><strong>Locus Tag:</strong></td><td>${gene.locus_tag}</td></tr>
      <tr><td><strong>Protein ID:</strong></td><td>${gene.protein_id}</td></tr>
      <tr><td><strong>Location:</strong></td><td>${gene.location}</td></tr>
      <tr><td><strong>Length:</strong></td><td>${gene.length} bp</td></tr>
    </table>
    <p>
      🔗 <a href="${gene.genbank_url}" target="_blank">View on NCBI</a>
    </p>
  `;

  const container = document.getElementById("geneInfo");
  if (container) container.innerHTML = geneInfo;
});
</script>

In this challenge, you’ll use Gibson Assembly to insert **your assigned gene** into the **pET28a** plasmid between the **NcoI** and **XhoI** restriction sites.

Just like in the pET-INS example:

### 1. **Start by modeling the final product**  

   - Start by recreating the pET28a + gene design you made in the basic cloning tutorial.
   - If you skipped that tutorial, no problem — follow the guidance here to recreate it:

     - Use the plasmid backbone from [pET28a sequence file](../assets/pET28a.seq).
     - Retrieve your assigned gene sequence using the "Quiz Instructions" box above.
     - Insert the **entire CDS** into the region between the NcoI (`CCATGG`) and XhoI (`CTCGAG`) sites.
     - The atg of your CDS should overlap the NcoI site as 'CCatgg'
     - Paste the CDS in **lowercase**, and keep the plasmid sequence in **UPPERCASE**.

### 2. **Identify each junction**  

  - For each junction:

    - Forward oligo = 20 bp before junction + 20 bp after junction  
    - Reverse oligo = reverse complement of forward oligo

### 3. **Build your Construction File (CF)**  

   - Your CF should include:
     - Two `PCR` steps
     - One `Gibson` step
     - One `Transform` step
     - Four `oligo` lines
   - You will name and assign components based on your own design choices

**Tip:** The sequences for your assigned gene (see name in the Quiz Instructions box above) and for `pET28a` are preloaded in the autograder—no need to define them in your CF.


---
### A Note on Naming and Templates

<script>
  waitForProgressManager(() => {
    const gene = window.progressManager.getAssignedGeneDetails();
    const tagNote = document.getElementById("templateNamingNote");
    if (tagNote) {
      tagNote.innerHTML = `In your CF, your PCR step should list the full <em>genome</em> as the template DNA — either use the <strong>NCBI accession number</strong> (e.g., <code>CP011802.1</code>) or the <strong>locus tag</strong> for your gene: <code>${gene.locus_tag}</code>.<p><p>The <code>pET28a</code> plasmid remains the template for your vector PCR.`;
    }
  });
</script>
<p id="templateNamingNote"></p>

When you're ready, paste your CF into the autograder below and simulate.

---

## Gibson Quiz

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

      // Use assigned gene details for injections
      const gene = window.progressManager.getAssignedGeneDetails();
      const cleanSeq = C6.cleanup(gene.sequence);
      const injections = `
dsDNA ${gene.locus_tag} ${cleanSeq}
dsDNA CP011802.1 ${cleanSeq}
dsDNA CP011802 ${cleanSeq}
plasmid pET28a AGATCTCGATCCCGCGAAATTAATACGACTCACTATAGGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACCATGGGCAGCAGCCATCATCATCATCATCACAGCAGCGGCCTGGTGCCGCGCGGCAGCCATATGGCTAGCATGACTGGTGGACAGCAAATGGGTCGCGGATCCGAATTCGAGCTCCGTCGACAAGCTTGCGGCCGCACTCGAGCACCACCACCACCACCACTGAGATCCGGCTGCTAACAAAGCCCGAAAGGAAGCTGAGTTGGCTGCTGCCACCGCTGAGCAATAACTAGCATAACCCCTTGGGGCCTCTAAACGGGTCTTGAGGGGTTTTTTGCTGAAAGGAGGAACTATATCCGGATTGGCGAATGGGACGCGCCCTGTAGCGGCGCATTAAGCGCGGCGGGTGTGGTGGTTACGCGCAGCGTGACCGCTACACTTGCCAGCGCCCTAGCGCCCGCTCCTTTCGCTTTCTTCCCTTCCTTTCTCGCCACGTTCGCCGGCTTTCCCCGTCAAGCTCTAAATCGGGGGCTCCCTTTAGGGTTCCGATTTAGTGCTTTACGGCACCTCGACCCCAAAAAACTTGATTAGGGTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGTTTTTCGCCCTTTGACGTTGGAGTCCACGTTCTTTAATAGTGGACTCTTGTTCCAAACTGGAACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTTTAACAAAATATTAACGTTTACAATTTCAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTATCCGCTCATGAATTAATTCTTAGAAAAACTCATCGAGCATCAAATGAAACTGCAATTTATTCATATCAGGATTATCAATACCATATTTTTGAAAAAGCCGTTTCTGTAATGAAGGAGAAAACTCACCGAGGCAGTTCCATAGGATGGCAAGATCCTGGTATCGGTCTGCGATTCCGACTCGTCCAACATCAATACAACCTATTAATTTCCCCTCGTCAAAAATAAGGTTATCAAGTGAGAAATCACCATGAGTGACGACTGAATCCGGTGAGAATGGCAAAAGTTTATGCATTTCTTTCCAGACTTGTTCAACAGGCCAGCCATTACGCTCGTCATCAAAATCACTCGCATCAACCAAACCGTTATTCATTCGTGATTGCGCCTGAGCGAGACGAAATACGCGATCGCTGTTAAAAGGACAATTACAAACAGGAATCGAATGCAACCGGCGCAGGAACACTGCCAGCGCATCAACAATATTTTCACCTGAATCAGGATATTCTTCTAATACCTGGAATGCTGTTTTCCCGGGGATCGCAGTGGTGAGTAACCATGCATCATCAGGAGTACGGATAAAATGCTTGATGGTCGGAAGAGGCATAAATTCCGTCAGCCAGTTTAGTCTGACCATCTCATCTGTAACATCATTGGCAACGCTACCTTTGCCATGTTTCAGAAACAACTCTGGCGCATCGGGCTTCCCATACAATCGATAGATTGTCGCACCTGATTGCCCGACATTATCGCGAGCCCATTTATACCCATATAAATCAGCATCCATGTTGGAATTTAATCGCGGCCTAGAGCAAGACGTTTCCCGTTGAATATGGCTCATAACACCCCTTGTATTACTGTTTATGTAAGCAGACAGTTTTATTGTTCATGACCAAAATCCCTTAACGTGAGTTTTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTCCTTCTAGTGTAGCCGTAGTTAGGCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGAGCGCCTGATGCGGTATTTTCTCCTTACGCATCTGTGCGGTATTTCACACCGCATATATGGTGCACTCTCAGTACAATCTGCTCTGATGCCGCATAGTTAAGCCAGTATACACTCCGCTATCGCTACGTGACTGGGTCATGGCTGCGCCCCGACACCCGCCAACACCCGCTGACGCGCCCTGACGGGCTTGTCTGCTCCCGGCATCCGCTTACAGACAAGCTGTGACCGTCTCCGGGAGCTGCATGTGTCAGAGGTTTTCACCGTCATCACCGAAACGCGCGAGGCAGCTGCGGTAAAGCTCATCAGCGTGGTCGTGAAGCGATTCACAGATGTCTGCCTGTTCATCCGCGTCCAGCTCGTTGAGTTTCTCCAGAAGCGTTAATGTCTGGCTTCTGATAAAGCGGGCCATGTTAAGGGCGGTTTTTTCCTGTTTGGTCACTGATGCCTCCGTGTAAGGGGGATTTCTGTTCATGGGGGTAATGATACCGATGAAACGAGAGAGGATGCTCACGATACGGGTTACTGATGATGAACATGCCCGGTTACTGGAACGTTGTGAGGGTAAACAACTGGCGGTATGGATGCGGCGGGACCAGAGAAAAATCACTCAGGGTCAATGCCAGCGCTTCGTTAATACAGATGTAGGTGTTCCACAGGGTAGCCAGCAGCATCCTGCGATGCAGATCCGGAACATAATGGTGCAGGGCGCTGACTTCCGCGTTTCCAGACTTTACGAAACACGGAAACCGAAGACCATTCATGTTGTTGCTCAGGTCGCAGACGTTTTGCAGCAGCAGTCGCTTCACGTTCGCTCGCGTATCGGTGATTCATTCTGCTAACCAGTAAGGCAACCCCGCCAGCCTAGCCGGGTCCTCAACGACAGGAGCACGATCATGCGCACCCGTGGGGCCGCCATGCCGGCGATAATGGCCTGCTTCTCGCCGAAACGTTTGGTGGCGGGACCAGTGACGAAGGCTTGAGCGAGGGCGTGCAAGATTCCGAATACCGCAAGCGACAGGCCGATCATCGTCGCGCTCCAGCGAAAGCGGTCCTCGCCGAAAATGACCCAGAGCGCTGCCGGCACCTGTCCTACGAGTTGCATGATAAAGAAGACAGTCATAAGTGCGGCGACGATAGTCATGCCCCGCGCCCACCGGAAGGAGCTGACTGGGTTGAAGGCTCTCAAGGGCATCGGTCGAGATCCCGGTGCCTAATGAGTGAGCTAACTTACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCCAGGGTGGTTTTTCTTTTCACCAGTGAGACGGGCAACAGCTGATTGCCCTTCACCGCCTGGCCCTGAGAGAGTTGCAGCAAGCGGTCCACGCTGGTTTGCCCCAGCAGGCGAAAATCCTGTTTGATGGTGGTTAACGGCGGGATATAACATGAGCTGTCTTCGGTATCGTCGTATCCCACTACCGAGATATCCGCACCAACGCGCAGCCCGGACTCGGTAATGGCGCGCATTGCGCCCAGCGCCATCTGATCGTTGGCAACCAGCATCGCAGTGGGAACGATGCCCTCATTCAGCATTTGCATGGTTTGTTGAAAACCGGACATGGCACTCCAGTCGCCTTCCCGTTCCGCTATCGGCTGAATTTGATTGCGAGTGAGATATTTATGCCAGCCAGCCAGACGCAGACGCGCCGAGACAGAACTTAATGGGCCCGCTAACAGCGCGATTTGCTGGTGACCCAATGCGACCAGATGCTCCACGCCCAGTCGCGTACCGTCTTCATGGGAGAAAATAATACTGTTGATGGGTGTCTGGTCAGAGACATCAAGAAATAACGCCGGAACATTAGTGCAGGCAGCTTCCACAGCAATGGCATCCTGGTCATCCAGCGGATAGTTAATGATCAGCCCACTGACGCGTTGCGCGAGAAGATTGTGCACCGCCGCTTTACAGGCTTCGACGCCGCTTCGTTCTACCATCGACACCACCACGCTGGCACCCAGTTGATCGGCGCGAGATTTAATCGCCGCGACAATTTGCGACGGCGCGTGCAGGGCCAGACTGGAGGTGGCAACGCCAATCAGCAACGACTGTTTGCCCGCCAGTTGTTGTGCCACGCGGTTGGGAATGTAATTCAGCTCCGCCATCGCCGCTTCCACTTTTTCCCGCGTTTTCGCAGAAACGTGGCTGGCCTGGTTCACCACGCGGGAAACGGTCTGATAAGAGACACCGGCATACTCTGCGACATCGTATAACGTTACTGGTTTCACATTCACCACCCTGAATTGACTCTCTTCCGGGCGCTATCATGCCATACCGCGAAAGGTTTTGCGCCATTCGATGGTGTCCGGGATCTCGACGCTCTCCCTTATGCGACTCCTGCATTAGGAAGCAGCCCAGTAGTAGGTTGAGGCCGTTGAGCACCGCCGCCGCAAGGAATGGTGCATGCAAGGAGATGGCGCCCAACAGTCCCCCGGCCACGGGGCCTGCCACCATACCCACGCCGAAACAAGCGCTCATGAGCCCGAAGTGGCGAGCCCGATCTTCCCCATCGGTGATGTCGGCGATATAGGCGCCAGCAACCGCACCTGTGGCGCCGGTGATGCCGGCCACGATGCGTCCGGCGTAGAGGATCG
`;

      const cf = C6.parseCF(input + injections);
      // Check for at least one gibson step in cf.steps
      const hasGibson = Array.isArray(cf.steps) && cf.steps.some(step => step.operation?.toLowerCase() === "gibson");
      console.log(cf)
      const results = C6.simCF(cf);

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

      const final = results[results.length - 1];
      const finalSeq = final[1]?.sequence || "";
      const seq = finalSeq.toUpperCase();
      const rc = s => s.split('').reverse().map(base => (
        { A: 'T', T: 'A', G: 'C', C: 'G', N: 'N', K: 'M', M: 'K', R: 'Y', Y: 'R', S: 'S', W: 'W' }[base] || base
      )).join('');

      const searchSpace = seq + seq + "x" + rc(seq) + rc(seq);

      // Dynamically determine required regions based on assigned gene and pET28a backbone
      // Extract pET28a backbone sequence from injections string
      const upperBackboneMatch = injections.match(/plasmid pET28a ([A-Z]+)/);
      const upperBackbone = upperBackboneMatch ? upperBackboneMatch[1] : "";
      const insertSeq = gene.sequence;
      // Find NcoI and XhoI sites for junctions
      const ncoIIdx = upperBackbone.indexOf("CCATGG");
      const xhoIIdx = upperBackbone.indexOf("CTCGAG");
      const fivePrimeJunction = 'CCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACC' + insertSeq.slice(0, 50);
      const threePrimeJunction = insertSeq.slice(-50) + 'CTCGAGCACCACCACCACCACCACTGAGATCCGGCTGCTAACAAAGCCCGAAAGG';
      const requiredRegions = [
        { sequence: insertSeq.toUpperCase(), label: `${gene.name} CDS` },
        { sequence: fivePrimeJunction.toUpperCase(), label: "5′ junction: vector–insert" },
        { sequence: threePrimeJunction.toUpperCase(), label: "3′ junction: insert–vector" },
      ];

      let feedback = [];
      let missing = [];

      requiredRegions.forEach(({ sequence, label }) => {
        if (!searchSpace.includes(sequence)) {
          missing.push(label);
        }
      });

      // Check for gibson step
      if (!hasGibson) {
        missing.push("a Gibson step in your Construction File");
      }

      if (missing.length === 0) {
        feedback.push("✅ Success! Your design contains all expected sequence features.");
        if (typeof window.progressManager !== "undefined") {
          window.progressManager.addCompletion("Gibson Cloning", "correct");
        }
      } else {
        feedback = missing.map(label => `❌ Missing: <code>${label}</code>`);
      }

      outputHTML += `<ul style="margin-top:1em;">${feedback.map(f => `<li>${f}</li>`).join("")}</ul>`;
      resultP.innerHTML = outputHTML;
    } catch (err) {
      resultP.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
    }
  });
</script>

---

## 🧪 Try and Break It

Once your plan works, experiment!

- Delete an overlap and see what happens.
- Remove a PCR step.
- Flip the insert direction.

Watch how the validation catches errors. This helps you understand how Gibson designs succeed—or fail.