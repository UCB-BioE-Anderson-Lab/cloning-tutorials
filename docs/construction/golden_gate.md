<script src="https://cdn.jsdelivr.net/npm/c6-sim@1.0.11/dist/c6-sim.min.js"></script>

# Golden Gate Assembly
 
 In previous tutorials, we built the **pET-INS** plasmid using both traditional restriction enzyme cloning and Gibson Assembly. In this tutorial, you'll use **Golden Gate Assembly** to build the same construct—while learning how this method enables precise, scar-controlled, multi-part DNA construction.
 
## What is Golden Gate Assembly?
 
![Diagram of Golden Gate Assembly showing a DNA fragment with BsaI recognition sites flanking the sequence. After digestion, the enzyme produces non-palindromic sticky ends which guide correct ligation orientation. Final product is a seamless joint between two DNA fragments.](../images/golden_gate_reaction.png)

Golden Gate Assembly is a method for joining DNA fragments using **Type IIs restriction enzymes** like **BsaI, BsmBI, BbsI,** and **SapI**. These enzymes cut a fixed number of bases away from their recognition sites, which allows the creation of custom 4 bp overhangs that control exactly where and how parts join together.

Golden Gate is powerful because it allows:

- Custom-designed sticky ends for precise, seamless (or intentionally scarred) ligation
- Single-pot digestion and ligation, increasing efficiency
- Automatic removal of restriction sites from the final product

These features make it ideal for modular cloning, where standardized parts and repeatable junctions are critical.

<!-- ### 🎥 Video Demo
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>

 *(This video walks through the concept and shows how to design junctions and oligos in ApE.)*

 --- -->
 
 The reaction is designed so that digestion and ligation happen together, recognition sites are eliminated, and sticky ends control the final sequence junctions.
 
 ⚠️ This means:
 
 - The recognition site **must not appear** in the final product, or it will be re-cleaved.
 - The method can be iterated using the same enzyme again and again, since the site is removed during assembly.
 
 ---
 
## Designing Golden Gate Oligos

Let’s now walk through a complete Golden Gate Assembly plan to make **pET-INS**, just like we did in the Gibson version.

### 🎥 Watch: Design of the Golden Gate Assembly plan

<iframe width="560" height="315" src="https://www.youtube.com/embed/IfOl59fghnA" frameborder="0" allowfullscreen></iframe>

---

## Step 1: Define Your Product

Start by constructing a model of the final pET-INS plasmid, just as you did with Gibson.

- Open the pET28a vector sequence and convert it to **UPPERCASE**.
- Open the insulin cDNA sequence and convert it to **lowercase**.
- Paste the INS cds into the intended insertion site as done in the basic cloning tutorial.

🔗 Downloads:

- [pET28a GenBank](../assets/pET28a.seq)
- [INS GenBank](../assets/INS_genome_context.seq)

---

## Step 2: Annotate Junctions and Annealing Regions

Once you’ve created a model of your final product, define these regions:

For each junction where two fragments will join:

### A. Choose the Sticky End

 - Choose **4 bp from the existing sequence at the junction** to serve as the sticky end. These should be non-palindromic (e.g., avoid `AATT`, `GATC`, etc.) to ensure correct orientation.
 - Create a feature annotation called `"sticky end"` over those 4 bases.
 - In the visualization below, these are highlighted in orange as “sticky end 1” and “sticky end 2”, corresponding to the two junctions in this construct.

### B. Mark the Forward Anneal Region
   Starting *at* the junction and extending downstream, choose 20–30 bp that follow standard primer design rules. Label this `forward anneal`.

### C. Mark the Reverse Anneal Region
   Identify 20–30 bp *upstream* (5′) of the junction. This sequence lies on the coding strand, not its reverse complement. Label it `reverse anneal`.

---


<div id="goldengateViewer" style="margin-top:1em;"></div>
<script src="https://unpkg.com/seqviz"></script>
<script>
  function waitForSeqViz(callback) {
    if (typeof seqviz !== "undefined" && seqviz.Viewer) {
      callback();
    } else {
      setTimeout(() => waitForSeqViz(callback), 50);
    }
  }

  waitForSeqViz(() => {
    seqviz
      .Viewer("goldengateViewer", {
        name: "pET-INS",
        seq: "AGATCTCGATCCCGCGAAATTAATACGACTCACTATAGGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACCatggccctgtggatgcgcctcctgcccctgctggcgctgctggccctctggggacctgacccagccgcagcctttgtgaaccaacacctgtgcggctcacacctggtggaagctctctacctagtgtgcggggaacgaggcttcttctacacacccaagacccgccgggaggcagaggacctgcaggtggggcaggtggagctgggcgggggccctggtgcaggcagcctgcagcccttggccctggaggggtccctgcagaagcgtggcattgtggaacaatgctgtaccagcatctgctccctctaccagctggagaactactgcaactagCTCGAGCACCACCACCACCACCACTGAGATCCGGCTGCTAACAAAGCCCGAAAGGAAGCTGAGTTGGCTGCTGCCACCGCTGAGCAATAACTAGCATAACCCCTTGGGGCCTCTAAACGGGTCTTGAGGGGTTTTTTGCTGAAAGGAGGAACTATATCCGGATTGGCGAATGGGACGCGCCCTGTAGCGGCGCATTAAGCGCGGCGGGTGTGGTGGTTACGCGCAGCGTGACCGCTACACTTGCCAGCGCCCTAGCGCCCGCTCCTTTCGCTTTCTTCCCTTCCTTTCTCGCCACGTTCGCCGGCTTTCCCCGTCAAGCTCTAAATCGGGGGCTCCCTTTAGGGTTCCGATTTAGTGCTTTACGGCACCTCGACCCCAAAAAACTTGATTAGGGTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGTTTTTCGCCCTTTGACGTTGGAGTCCACGTTCTTTAATAGTGGACTCTTGTTCCAAACTGGAACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTTTAACAAAATATTAACGTTTACAATTTCAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTATCCGCTCATGAATTAATTCTTAGAAAAACTCATCGAGCATCAAATGAAACTGCAATTTATTCATATCAGGATTATCAATACCATATTTTTGAAAAAGCCGTTTCTGTAATGAAGGAGAAAACTCACCGAGGCAGTTCCATAGGATGGCAAGATCCTGGTATCGGTCTGCGATTCCGACTCGTCCAACATCAATACAACCTATTAATTTCCCCTCGTCAAAAATAAGGTTATCAAGTGAGAAATCACCATGAGTGACGACTGAATCCGGTGAGAATGGCAAAAGTTTATGCATTTCTTTCCAGACTTGTTCAACAGGCCAGCCATTACGCTCGTCATCAAAATCACTCGCATCAACCAAACCGTTATTCATTCGTGATTGCGCCTGAGCGAGACGAAATACGCGATCGCTGTTAAAAGGACAATTACAAACAGGAATCGAATGCAACCGGCGCAGGAACACTGCCAGCGCATCAACAATATTTTCACCTGAATCAGGATATTCTTCTAATACCTGGAATGCTGTTTTCCCGGGGATCGCAGTGGTGAGTAACCATGCATCATCAGGAGTACGGATAAAATGCTTGATGGTCGGAAGAGGCATAAATTCCGTCAGCCAGTTTAGTCTGACCATCTCATCTGTAACATCATTGGCAACGCTACCTTTGCCATGTTTCAGAAACAACTCTGGCGCATCGGGCTTCCCATACAATCGATAGATTGTCGCACCTGATTGCCCGACATTATCGCGAGCCCATTTATACCCATATAAATCAGCATCCATGTTGGAATTTAATCGCGGCCTAGAGCAAGACGTTTCCCGTTGAATATGGCTCATAACACCCCTTGTATTACTGTTTATGTAAGCAGACAGTTTTATTGTTCATGACCAAAATCCCTTAACGTGAGTTTTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTCCTTCTAGTGTAGCCGTAGTTAGGCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGAGCGCCTGATGCGGTATTTTCTCCTTACGCATCTGTGCGGTATTTCACACCGCATATATGGTGCACTCTCAGTACAATCTGCTCTGATGCCGCATAGTTAAGCCAGTATACACTCCGCTATCGCTACGTGACTGGGTCATGGCTGCGCCCCGACACCCGCCAACACCCGCTGACGCGCCCTGACGGGCTTGTCTGCTCCCGGCATCCGCTTACAGACAAGCTGTGACCGTCTCCGGGAGCTGCATGTGTCAGAGGTTTTCACCGTCATCACCGAAACGCGCGAGGCAGCTGCGGTAAAGCTCATCAGCGTGGTCGTGAAGCGATTCACAGATGTCTGCCTGTTCATCCGCGTCCAGCTCGTTGAGTTTCTCCAGAAGCGTTAATGTCTGGCTTCTGATAAAGCGGGCCATGTTAAGGGCGGTTTTTTCCTGTTTGGTCACTGATGCCTCCGTGTAAGGGGGATTTCTGTTCATGGGGGTAATGATACCGATGAAACGAGAGAGGATGCTCACGATACGGGTTACTGATGATGAACATGCCCGGTTACTGGAACGTTGTGAGGGTAAACAACTGGCGGTATGGATGCGGCGGGACCAGAGAAAAATCACTCAGGGTCAATGCCAGCGCTTCGTTAATACAGATGTAGGTGTTCCACAGGGTAGCCAGCAGCATCCTGCGATGCAGATCCGGAACATAATGGTGCAGGGCGCTGACTTCCGCGTTTCCAGACTTTACGAAACACGGAAACCGAAGACCATTCATGTTGTTGCTCAGGTCGCAGACGTTTTGCAGCAGCAGTCGCTTCACGTTCGCTCGCGTATCGGTGATTCATTCTGCTAACCAGTAAGGCAACCCCGCCAGCCTAGCCGGGTCCTCAACGACAGGAGCACGATCATGCGCACCCGTGGGGCCGCCATGCCGGCGATAATGGCCTGCTTCTCGCCGAAACGTTTGGTGGCGGGACCAGTGACGAAGGCTTGAGCGAGGGCGTGCAAGATTCCGAATACCGCAAGCGACAGGCCGATCATCGTCGCGCTCCAGCGAAAGCGGTCCTCGCCGAAAATGACCCAGAGCGCTGCCGGCACCTGTCCTACGAGTTGCATGATAAAGAAGACAGTCATAAGTGCGGCGACGATAGTCATGCCCCGCGCCCACCGGAAGGAGCTGACTGGGTTGAAGGCTCTCAAGGGCATCGGTCGAGATCCCGGTGCCTAATGAGTGAGCTAACTTACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCCAGGGTGGTTTTTCTTTTCACCAGTGAGACGGGCAACAGCTGATTGCCCTTCACCGCCTGGCCCTGAGAGAGTTGCAGCAAGCGGTCCACGCTGGTTTGCCCCAGCAGGCGAAAATCCTGTTTGATGGTGGTTAACGGCGGGATATAACATGAGCTGTCTTCGGTATCGTCGTATCCCACTACCGAGATATCCGCACCAACGCGCAGCCCGGACTCGGTAATGGCGCGCATTGCGCCCAGCGCCATCTGATCGTTGGCAACCAGCATCGCAGTGGGAACGATGCCCTCATTCAGCATTTGCATGGTTTGTTGAAAACCGGACATGGCACTCCAGTCGCCTTCCCGTTCCGCTATCGGCTGAATTTGATTGCGAGTGAGATATTTATGCCAGCCAGCCAGACGCAGACGCGCCGAGACAGAACTTAATGGGCCCGCTAACAGCGCGATTTGCTGGTGACCCAATGCGACCAGATGCTCCACGCCCAGTCGCGTACCGTCTTCATGGGAGAAAATAATACTGTTGATGGGTGTCTGGTCAGAGACATCAAGAAATAACGCCGGAACATTAGTGCAGGCAGCTTCCACAGCAATGGCATCCTGGTCATCCAGCGGATAGTTAATGATCAGCCCACTGACGCGTTGCGCGAGAAGATTGTGCACCGCCGCTTTACAGGCTTCGACGCCGCTTCGTTCTACCATCGACACCACCACGCTGGCACCCAGTTGATCGGCGCGAGATTTAATCGCCGCGACAATTTGCGACGGCGCGTGCAGGGCCAGACTGGAGGTGGCAACGCCAATCAGCAACGACTGTTTGCCCGCCAGTTGTTGTGCCACGCGGTTGGGAATGTAATTCAGCTCCGCCATCGCCGCTTCCACTTTTTCCCGCGTTTTCGCAGAAACGTGGCTGGCCTGGTTCACCACGCGGGAAACGGTCTGATAAGAGACACCGGCATACTCTGCGACATCGTATAACGTTACTGGTTTCACATTCACCACCCTGAATTGACTCTCTTCCGGGCGCTATCATGCCATACCGCGAAAGGTTTTGCGCCATTCGATGGTGTCCGGGATCTCGACGCTCTCCCTTATGCGACTCCTGCATTAGGAAGCAGCCCAGTAGTAGGTTGAGGCCGTTGAGCACCGCCGCCGCAAGGAATGGTGCATGCAAGGAGATGGCGCCCAACAGTCCCCCGGCCACGGGGCCTGCCACCATACCCACGCCGAAACAAGCGCTCATGAGCCCGAAGTGGCGAGCCCGATCTTCCCCATCGGTGATGTCGGCGATATAGGCGCCAGCAACCGCACCTGTGGCGCCGGTGATGCCGGCCACGATGCGTCCGGCGTAGAGGATCG",
        annotations: [
          { name: "Vector", start: 446, end: 5566, color: "#d5d5d5", direction: 1 },
          { name: "Vector", start: 0, end: 105, color: "#d5d5d5", direction: 1 },
          { name: "KanR", start: 1162, end: 1978, color: "#ccffcc", direction: -1 },
          { name: "ColE1 origin", start: 2023, end: 2706, color: "gray", direction: 1 },
          { name: "T7 Promoter", start: 20, end: 40, color: "RosyBrown", direction: 1 },
          { name: "INS (insulin CDS)", start: 107, end: 440, color: "#e9cf24", direction: 1 },
          { name: "XhoI", start: 440, end: 446, color: "#ff40ff", direction: 1 },
          { name: "NcoI", start: 105, end: 111, color: "#ff40ff", direction: 1 },
        ],
        primers: [
          { name: "Forward Anneal (INS)", start: 107, end: 127, color: "#f7acf7", direction: 1 },
          { name: "sticky end 1", start: 107, end: 111, color: "#ff9200", direction: 1 },
          { name: "Reverse Anneal (INS)", start: 419, end: 439, color: "#f7acf7", direction: 1 },
          { name: "Forward Anneal (pET28a)", start: 440, end: 460, color: "#196a24", direction: 1 },
          { name: "sticky end 2", start: 440, end: 444, color: "#ff9200", direction: 1 },
          { name: "Reverse Anneal (pET28a)", start: 87, end: 107, color: "#196a24", direction: 1 },
        ],
        translations: [],
        viewer: "linear",
        showComplement: true,
        showIndex: true,
        style: { height: "420px", width: "100%" }
      })
      .render();
  });
</script>

</pre>

## Step 3: Design Oligos

Design the **junction + annealing region** for each oligo first. These are the 3′ ends that will bind to your template.

### A. Forward Oligo

- From the forward strand of your product, copy the 4 bp sticky end **plus ~20 bp downstream** (i.e., to the right).
- This is your **junction + anneal** region.

### B. Reverse Oligo

- From the reverse strand of your product, copy the 4 bp sticky end **plus ~20 bp upstream** (i.e., to the left).
- Reverse complement this sequence. This is your **junction + anneal** region for the reverse oligo.

### C. Add the Golden Gate Prefix

Add the following prefix to both the forward and reverse oligos:

```
ccataGGTCTCa
```

This includes:

- `ccata` = arbitrary 5' tail
- `GGTCTC` = BsaI recognition site
- `a` = one-base arbitrary spacer before the sticky end

**Final orientation of Golden Gate oligos (both forward and reverse):**

<pre>
5' tail - BsaI - spacer - sticky end - annealing region - 3'
</pre>

<blockquote>
  ⚠️ <strong>Important:</strong> For the <strong>reverse oligo</strong>, only the junction + annealing region is reverse complemented. The prefix remains in forward orientation.
</blockquote>

<blockquote>
  🧬 <strong>5′ tail design tip:</strong> <a href="https://www.neb.com/en-us/tools-and-resources/usage-guidelines/cleavage-close-to-the-end-of-dna-fragments">NEB data</a> shows BsaI cuts efficiently with as little as 1 bp upstream of its site. While <strong>5 bp is a safe general rule</strong>, it's often more than necessary.
</blockquote>

Do the same for each junction.  Realistically, you can do this PCR-based variant of Golden Gate for up to 4 fragments.  You can also do golden gate with clonal plasmid DNA.  With the higher quality DNA and the restriciton sites being further from the ends, plasmid-based golden gate is much more efficient for multi-fragment assembly than the PCR variant.
 
Here is an example solution:

<pre id="cf_quiz_example" style="background:#f8f8f8; border:1px solid #ccc; padding:10px; border-radius:4px; overflow-x:auto; white-space:pre;">PCR         insF2       insR2       insulin_cdna      ins_pcr
PCR         vecF2       vecR2       pET28a           vec_pcr
GoldenGate  vec_pcr     ins_pcr     BsaI             pET-INS

oligo       insF2       ccataGGTCTCaatggccctgtggatgcgcctc
oligo       insR2       cagatGGTCTCaCGAGctagttgcagtagttctccag
oligo       vecF2       ccataGGTCTCaCTCGAGCACCACCACCACCAC
oligo       vecR2       cagatGGTCTCaccatGGTATATCTCCTTCTTAAAG</pre>
<button id="copyCFBtn" style="margin-top:5px;">Copy Example</button>
<script>
  document.getElementById("copyCFBtn").addEventListener("click", function () {
    const btn = this;
    const content = document.getElementById("cf_quiz_example").innerText;
    navigator.clipboard.writeText(content).then(() => {
      const originalText = btn.innerText;
      btn.innerText = "✅ Copied!";
      btn.disabled = true;
      setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
      }, 2000);
    });
  });
</script>

## Step 4: Simulate It
 
You can simulate the PCR steps of the construction file as you've done previously with your sequence editor or an automation tool.  ApE and Benchling both have visual tools to simulate the Golden Gate step as well.  C6 can also simulate your entire construction file, and you can try it out in the box below.

> 💡 Tip: If you’re unsure about orientation after simulating, remember there are only two possibilities—it’s either the sequence you expect or its reverse complement.

---

## 🎯 Try it yourself

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
  const container = document.getElementById("geneInfo");
  const geneInfo = `
    <h3>Quiz Instructions</h3>
    <p>
      For your quiz, you will clone the CDS from the gene <strong>${gene.name}</strong>
      (<code>${gene.locus_tag}</code>) from <em>Bacillus atrophaeus UCMB-5137</em>.
    </p>
    <p>
      This gene is a <strong>coding DNA sequence (CDS)</strong>, which means it directly encodes a protein.
      It's an <strong>open reading frame (ORF)</strong>: a continuous stretch of codons that starts with a
      <code>start codon</code> like <code>ATG</code> and ends with a <code>stop codon</code> like <code>TAA</code>,
      <code>TAG</code>, or <code>TGA</code>.
    </p>
    <p>
      We're giving you only the CDS—not the full gene. That means no promoter, no ribosome binding site (RBS),
      no terminator, and no replication origin—just the exact stretch of DNA used to encode the protein.
      You need to include this entire sequence in your designs.
    </p>
    <table style="border-collapse: collapse; margin-bottom: 1em;">
      <tr><td style="padding: 4px 8px; font-weight: bold;">Locus Tag:</td><td style="padding: 4px 8px;">${gene.locus_tag}</td></tr>
      <tr><td style="padding: 4px 8px; font-weight: bold;">Protein ID:</td><td style="padding: 4px 8px;">${gene.protein_id}</td></tr>
      <tr><td style="padding: 4px 8px; font-weight: bold;">Location:</td><td style="padding: 4px 8px;">${gene.location}</td></tr>
      <tr><td style="padding: 4px 8px; font-weight: bold;">Length:</td><td style="padding: 4px 8px;">${gene.length} bp</td></tr>
    </table>
    <p>
      🔗 <strong><a href="${gene.genbank_url}" target="_blank">View CDS on NCBI</a></strong>
    </p>
    <p>
      The link above takes you to the region of the full genome containing this CDS. You will use the
      <strong>exact</strong> ORF sequence shown in that view for your cloning task.
    </p>
    <p>
      Copy and paste the DNA sequence portion of the page into ApE or Benchling and it will clear the spaces and numbers.
      You can also download the file by clicking <strong>Send to: &gt; File &gt; Genbank</strong>. That file can be opened
      in your sequence editor and will retain any annotations.
    </p>
    <p>
      Your goal is to clone this ORF into the pET28a vector using Golden Gate Assembly. Design primers and junctions accordingly.
    </p>
  `;
  if (container) container.innerHTML = geneInfo;
});
</script>

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

---

## Golden Gate Quiz

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
      const hasGibson = Array.isArray(cf.steps) && cf.steps.some(step => step.operation?.toLowerCase() === "goldengate");
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
      let msg = err.message;
      const enzymeErrorPattern = /Enzyme (.+?) not found/i;
      const match = msg.match(enzymeErrorPattern);
      if (match) {
        const enzymeName = match[1];
        const commonMisspellings = ["Bsa1", "Bsa|", "Bsa!", "Bsal", "BsaL", "bsai"];
        const intended = "BsaI";
        if (commonMisspellings.map(s => s.toLowerCase()).includes(enzymeName.toLowerCase())) {
          msg += `<br>💡 Did you mean <code>${intended}</code>? The simulator is case sensitive and expects <code>${intended}</code>.`;
        }
      }
      resultP.innerHTML = `<span style="color:red;">❌ Error: ${msg}</span>`;
    }
  });
</script>

