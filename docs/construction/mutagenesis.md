<script src="https://unpkg.com/seqviz"></script>
# Site-Directed Mutagenesis

Site-directed mutagenesis refers to any cloning technique where you introduce a specific, localized change into a DNA sequence. These changes may include:

- Substituting a base or codon
- Inserting or deleting a small sequence (typically <30 bp)
- Replacing a defined region
- Creating a variant library at a defined site

In all cases, you're targeting a specific location within a plasmid and rewriting a short region while leaving the rest unchanged.

![Zoomed schematic of the pTargetF plasmid showing a site-directed edit in the gRNA region: the cadA-targeting protospacer (orange) is swapped for a cscR-targeting protospacer (pink), adjacent to a constant tracrRNA scaffold (green), under control of the P_con promoter and flanked by a SpeI site.](../images/pTargetF_protospacer_mutagenesis.png)

**Figure:** Site-directed mutagenesis of the pTargetF plasmid to retarget the gRNA. The original cadA-targeting protospacer (orange) is replaced with a new cscR-targeting protospacer (pink), using a SpeI-flanked region upstream of the gRNA scaffold (green tracrRNA).

##  🎥 Video Demo
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>
---

## Overview of Mutagenesis Strategies

Most mutagenesis methods resemble the PCR-based cloning techniques you've already seen. The general pattern is:

1. PCR the entire plasmid using primers that encode your intended mutations.
2. Re-close the product using ligation or Gibson-like mechanisms.
3. Transform and screen for correct clones.

Conceptually, it's like the limiting case of assembly: just one fragment, but edited.

---

## 1) EIPCR (Enzymatic Inverse PCR)

EIPCR is analogous to the NcoI/XhoI method you used in [basic cloning](../cloning/basic_cloning.md), except it uses a **single restriction site** flanking the mutation site to reclose the plasmid.

This method is ideal when the mutation you want to introduce is close to a unique restriction site. You perform a full-vector PCR using primers that flank the site and introduce the desired edits. After PCR, you digest the product with the enzyme and ligate the linear fragment to restore circularity.

---


### Example: Retargeting the protospacer in pTargetF


In the Basic Cloning tutorial, you cloned the Cas9 gene from *Streptococcus pyogenes* into an expression vector. Cas9 is the "scissors" protein that creates double-strand breaks at specific locations in DNA, but it requires a guide RNA (gRNA) to find its target. The gRNA consists of two parts: a customizable 20 bp protospacer sequence that matches the genomic target, and a constant scaffold that helps recruit Cas9. Together, the Cas9 protein and the gRNA form a complex that scans DNA, binds to sequences matching the protospacer, and cuts them if an adjacent "NGG" protospacer-adjacent motif (PAM) is present.

To design a new protospacer, you need to identify a 20 bp sequence in your target gene that is directly upstream of an NGG motif—the PAM site required by Cas9. In practice, you scan for "GG" on the 3′ end of the desired target, then take the 20 bp sequence immediately upstream. For example, if "GG" starts at position 101, the protospacer would be positions 80 to 99. You can think of this computationally as finding the index of "GG" and extracting the −21 to −1 substring. Any sequence that satisfies this rule can be targeted for cleavage by Cas9. To create a new gRNA, simply replace the 20 bp protospacer sequence in pTargetF and coexpress with Cas9.

The **pTargetF** plasmid expresses guide RNAs (gRNAs) for CRISPR/Cas9, combining a customizable 20 bp **protospacer** (which determines target specificity) with a constant scaffold region. To retarget Cas9 to a new genomic site, you simply replace the protospacer. Conveniently, pTargetF includes a **SpeI site** upstream of the protospacer, allowing efficient editing via EIPCR: PCR amplify the plasmid with primers encoding the new protospacer, digest with SpeI, and re-ligate to form the edited plasmid.

---

## Primer Design and Strategy

The first step is to model your edited sequence. We want to replace the original cadA-targeting protospacer in pTargetF with a new protospacer targeting the *cscR* gene.

Below is a portion of the *cscR* sequence with all potential PAM sites (NGG) highlighted. Any 20 bp sequence immediately upstream of a GG can serve as a candidate protospacer. Specialized software tools can help you pick optimal guides based on efficiency and off-target predictions, and in many cases, validated guides are available in public databases.

<div id="viewer1" style="height:200px;"></div>
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
      .Viewer("viewer1", {
        name: "cscR region",
        seq: "atgatgacagtctcccgggtgatgcataatgcagaatctgtgcgtcctgcaacgcgtgaccgcgtattgcaggcaatccagaccctgaattatgttcctgatctttccgcccgtaagatgcgcgctcaaggacgtaagccgtcgactctcgccgtgctggcgcaggacacggctaccactcctttctctgttgatattctgcttgccattgagcaaaccgccagcgagttcggctggaatagttttttaatcaatattttttctgaagatgacgctgcccgcgcggcacgtcagctgcttgcccaccgtccggatggcattatctatactacaatggggctgcgacatatcacgctgcctgagtctctgtatggtgaaaatattgtattggcgaactgtgtggcggatgacccagcgttacccagttatatccctgatgattacactgcacaatatgaatcaacacagcatttgctcgcggcgggctatcgtcaaccgttatgcttctggctaccggaaagtgcgttggcaacagggtatcgtcggcagggatttgagcaggcctggcgtgatgctggacgagatctggctgaggtgaaacaatttcacatggcaacaggtgatgatcactacaccgatctcgcaagtttactcaatgcccacttcaaaccgggcaaaccagattttgatgttctgatatgtggtaacgatcgcgcagcctttgtggcttatcaggttcttctggcgaagggggtacgaatcccgcaggatgtcgccgtaatgggctttgataatctggttggcgtcgggcatctgtttttaccgccgctgaccacaattcagcttccacatgacattatcgggcgggaagctgcattgcatattattgaaggtcgtgaagggggaagagtgacgcggatcccttgcccgctgttgatccgttgttccacctga", 
        annotations: [
          { name: "Chosen Protospacer", start: 50, end: 70, color: "magenta", direction: 1 },
          { name: "PAM (NGG)", start: 70, end: 73, color: "orange", direction: 1 },
        ],
        viewer: "linear",
        showComplement: false,
        showIndex: true,
        showAnnotations: true,
        showLabels: true,
        zoom: { linear: 40 },
        style: { height: "100px", width: "100%" }
      })
      .render();
  });
</script>

Once you select your new protospacer, you replace the original cadA-targeting protospacer in pTargetF.

Below, we show the pTargetF gRNA region **before** and **after** editing:

### Original (targeting cadA)

<div id="viewer2" style="height:100px;"></div>

### Our Goal (targeting cscR)

<div id="viewer3" style="height:100px; margin-top:20px;"></div>

<script>
  waitForSeqViz(() => {
    seqviz
      .Viewer("viewer2", {
        name: "Original pTargetF (cadA protospacer)",
        seq: "ttgacagctagctcagtcctaggtataatACTAGTcatcgccgcagcggtttcaggttttagagctagaaatagcaagttaaaataaggctagtccgttatcaacttgaaaaagtggcaccgagtcggtgctttttttgaattctctagagtcgacctgcagaagcttagatctattaccctgttatccctactcgagttcatgtgcagctccataagcaaaaggggatgataagtttatcaccaccgactatttgcaacagtgccgttgatcgtgctatgatcgactgatgtcatcagcggtggagtgcaatgtcatgagggaagcggtgatcgccgaagtatcgactcaactatcagaggtagttggcgtcatcgagcgccatctcgaaccgacgttgctggccgtacatttgtacggctccgcagtggatggcggcctgaagccacacagtgatattgatttgctggttacggtgaccgtaaggcttgatgaaacaacgcggcgagctttgatcaacgaccttttggaaacttcggcttcccctggagagagcgagattctccgcgctgtagaagtcaccattgttgtgcacgacgacatcattccgtggcgttatccagctaagcgcgaactgcaatttggagaatggcagcgcaatgacattcttgcaggtatcttcgagccagccacgatcgacattgatctggctatcttgctgacaaaagcaagagaacatagcgttgccttggtaggtccagcggcggaggaactctttgatccggttcctgaacaggatctatttgaggcgctaaatgaaaccttaacgctatggaactcgccgcccgactgggctggcgatgagcgaaatgtagtgcttacgttgtcccgcatttggtacagcgcagtaaccggcaaaatcgcgccgaaggatgtcgctgccgactgggcaatggagcgcctgccggcccagtatcagcccgtcatacttgaagctagacaggcttatcttggacaagaagaagatcgcttggcctcgcgcgcagatcagttggaagaatttgtccactacgtgaaaggcgagatcaccaaggtagtcggcaaataagatgccgctcgccagtcgattggctgagctcataagttcctattccgaagttccgcgaacgcgtaaaggatctaggtgaagatcctttttgataatctcatgaccaaaatcccttaacgtgagttttcgttccactgagcgtcagaccccgtagaaaagatcaaaggatcttcttgagatcctttttttctgcgcgtaatctgctgcttgcaaacaaaaaaaccaccgctaccagcggtggtttgtttgccggatcaagagctaccaactctttttccgaaggtaactggcttcagcagagcgcagataccaaatactgtccttctagtgtagccgtagttaggccaccacttcaagaactctgtagcaccgcctacatacctcgctctgctaatcctgttaccagtggctgctgccagtggcgataagtcgtgtcttaccgggttggactcaagacgatagttaccggataaggcgcagcggtcgggctgaacggggggttcgtgcacacagcccagcttggagcgaacgacctacaccgaactgagatacctacagcgtgagctatgagaaagcgccacgcttcccgaagggagaaaggcggacaggtatccggtaagcggcagggtcggaacaggagagcgcacgagggagcttccagggggaaacgcctggtatctttatagtcctgtcgggtttcgccacctctgacttgagcgtcgatttttgtgatgctcgtcaggggggcggagcctatggaaaaacgccagcaacgcggcctttttacggttcctggccttttgctggccttttgctcacatgttctttcctgcgttatcccctgattctgtggataaccgtattaccgcctttgagtgagctgataccgctcgccgcagccgaacgaccgagcgcagcgagtcagtgagcgaggaagcggaagagcgcctgatgcggtattttctccttacgcatctgtgcggtatttcacaccgcatatgctggatcc",
        annotations: [
          { name: "Pcon J23119", start: 0, end: 29, color: "#ff9200", direction: 1 },
          { name: "SpeI", start: 29, end: 35, color: "#41e0fe", direction: 1 },
          { name: "cadA protospacer (crRNA)", start: 35, end: 55, color: "#fedb68", direction: 1 },
          { name: "trcrRNA (scaffold)", start: 55, end: 131, color: "#31ff1a", direction: 1 },
          { name: "SmR", start: 316, end: 1108, color: "#3d8be4", direction: 1 },
          { name: "ori", start: 1281, end: 1870, color: "#999999", direction: 1 }
        ],
        viewer: "linear",
        showComplement: false,
        showIndex: true,
        showAnnotations: true,
        showLabels: true,
        zoom: { linear: 40 },
        style: { height: "80px", width: "100%" }
      })
      .render();

    seqviz
      .Viewer("viewer3", {
        name: "Edited pTargetF (cscR protospacer)",
        seq: "ttgacagctagctcagtcctaggtataatACTAGTaacgcgtgaccgcgtattgcgttttagagctagaaatagcaagttaaaataaggctagtccgttatcaacttgaaaaagtggcaccgagtcggtgctttttttgaattctctagagtcgacctgcagaagcttagatctattaccctgttatccctactcgagttcatgtgcagctccataagcaaaaggggatgataagtttatcaccaccgactatttgcaacagtgccgttgatcgtgctatgatcgactgatgtcatcagcggtggagtgcaatgtcatgagggaagcggtgatcgccgaagtatcgactcaactatcagaggtagttggcgtcatcgagcgccatctcgaaccgacgttgctggccgtacatttgtacggctccgcagtggatggcggcctgaagccacacagtgatattgatttgctggttacggtgaccgtaaggcttgatgaaacaacgcggcgagctttgatcaacgaccttttggaaacttcggcttcccctggagagagcgagattctccgcgctgtagaagtcaccattgttgtgcacgacgacatcattccgtggcgttatccagctaagcgcgaactgcaatttggagaatggcagcgcaatgacattcttgcaggtatcttcgagccagccacgatcgacattgatctggctatcttgctgacaaaagcaagagaacatagcgttgccttggtaggtccagcggcggaggaactctttgatccggttcctgaacaggatctatttgaggcgctaaatgaaaccttaacgctatggaactcgccgcccgactgggctggcgatgagcgaaatgtagtgcttacgttgtcccgcatttggtacagcgcagtaaccggcaaaatcgcgccgaaggatgtcgctgccgactgggcaatggagcgcctgccggcccagtatcagcccgtcatacttgaagctagacaggcttatcttggacaagaagaagatcgcttggcctcgcgcgcagatcagttggaagaatttgtccactacgtgaaaggcgagatcaccaaggtagtcggcaaataagatgccgctcgccagtcgattggctgagctcataagttcctattccgaagttccgcgaacgcgtaaaggatctaggtgaagatcctttttgataatctcatgaccaaaatcccttaacgtgagttttcgttccactgagcgtcagaccccgtagaaaagatcaaaggatcttcttgagatcctttttttctgcgcgtaatctgctgcttgcaaacaaaaaaaccaccgctaccagcggtggtttgtttgccggatcaagagctaccaactctttttccgaaggtaactggcttcagcagagcgcagataccaaatactgtccttctagtgtagccgtagttaggccaccacttcaagaactctgtagcaccgcctacatacctcgctctgctaatcctgttaccagtggctgctgccagtggcgataagtcgtgtcttaccgggttggactcaagacgatagttaccggataaggcgcagcggtcgggctgaacggggggttcgtgcacacagcccagcttggagcgaacgacctacaccgaactgagatacctacagcgtgagctatgagaaagcgccacgcttcccgaagggagaaaggcggacaggtatccggtaagcggcagggtcggaacaggagagcgcacgagggagcttccagggggaaacgcctggtatctttatagtcctgtcgggtttcgccacctctgacttgagcgtcgatttttgtgatgctcgtcaggggggcggagcctatggaaaaacgccagcaacgcggcctttttacggttcctggccttttgctggccttttgctcacatgttctttcctgcgttatcccctgattctgtggataaccgtattaccgcctttgagtgagctgataccgctcgccgcagccgaacgaccgagcgcagcgagtcagtgagcgaggaagcggaagagcgcctgatgcggtattttctccttacgcatctgtgcggtatttcacaccgcatatgctggatcc",
        annotations: [
          { name: "Pcon J23119", start: 0, end: 29, color: "#ff9200", direction: 1 },
          { name: "SpeI", start: 29, end: 35, color: "#41e0fe", direction: 1 },
          { name: "cscR protospacer (crRNA)", start: 35, end: 55, color: "magenta", direction: 1 },
          { name: "trcrRNA (scaffold)", start: 55, end: 131, color: "#31ff1a", direction: 1 },
          { name: "SmR", start: 316, end: 1108, color: "#3d8be4", direction: 1 },
          { name: "ori", start: 1281, end: 1870, color: "#999999", direction: 1 }
        ],
        primers: [
          { name: "Forward Anneal", start: 55, end: 78, color: "Silver", direction: 1 },
          { name: "Reverse Anneal", start: 7, end: 29, color: "Silver", direction: 1 }
        ],
        viewer: "linear",
        showComplement: false,
        showIndex: true,
        showAnnotations: true,
        showPrimers: true,
        showLabels: true,
        zoom: { linear: 40 },
        style: { height: "100px", width: "100%" }
      })
      .render();
  });
</script>

---


## 2) Type IIs-based Mutagenesis

You can also use Golden Gate-style enzymes like **BsaI** or **BsmBI** to cut-and-religate the vector with edits—just like Golden Gate but with one piece.

This allows you to:

- Precisely replace a segment flanked by Type IIs sites
- Insert small cassettes
- Introduce point mutations

📘 **Example: Introduce a silent mutation in the INS coding region using BsaI**

- Walk through junction selection
- Show oligo design and expected product
- Include a CF and simulation preview

📘 **Example: Functional mutation of INS (C7S)**

Let's introduce a biologically meaningful mutation into insulin by replacing **Cysteine at position 7** (Cys7) with **Serine (Ser)**. This mimics a mutation that could affect disulfide bond formation and protein stability.

### Steps:
1. Open the `pET-INS.gb` file and find the codon for Cys7 in the translation.
2. Substitute the codon for a Ser codon using the [codon table](https://cdn.kastatic.org/ka-perseus-images/f5de6355003ee322782b26404ef0733a1d1a61b0.png).
3. Mark the edited codon with a feature like `"C7S"`.
4. Choose a nearby 4 bp sticky end and mark it with a `"sticky"` feature.
5. Follow standard Golden Gate oligo design:
   - Extract sticky + 20 bp downstream for the forward oligo.
   - Extract 20 bp upstream + sticky for the reverse oligo (then reverse complement).
   - Add `ccataGGTCTCa` prefix to both.
6. Simulate to confirm the product, and name the final construct `pET-INS-C7S`.

🔧 Tools:
- [Codon Finder Tool](https://www.bioinformatics.org/sms2/codon_usage.html)

---

## 3) QuikChange (Annealed Mutagenic Primers)

QuikChange uses overlapping oligos (like Gibson) but doesn't require enzymes. The forward and reverse primers both carry the mutation and anneal to the same location. You amplify the full plasmid and let the cell repair nicks.

### Notes:

- Works best with high-fidelity polymerases
- Can be finicky due to primer dimerization
- No external enzyme steps needed

📘 **Example: Introduce an alanine scan into a loop region**

- Show one mutation case with primer design and PCR product

---

## 4) Saturation Mutagenesis

When you began the wetlab portion of the pP6 experiment, you used Golden Gate-style site-directed mutagenesis not to create a single edited clone, but an entire **library** of variants. This approach is called **saturation mutagenesis**.

Instead of targeting one mutation, saturation mutagenesis introduces **degenerate bases**—for example, `"N"` represents a mix of all four nucleotides (A, T, C, G). There are other codes like:

- `"K"` = G or T
- `"S"` = G or C
- `"W"` = A or T  

These are called **IUPAC degeneracy codes**.

Designing these oligos follows the same workflow as any Golden Gate mutagenesis:

- Build a model of the final product with degenerate bases included.
- Define junctions and annealing regions.
- Simulate and confirm construct logic.

⚠️ However, a few **special rules apply** for degenerate libraries:

- **Do not place degeneracy at the 3′ end** of your oligos (the annealing region). This can prevent proper PCR priming.
- **Avoid degeneracy at the sticky ends** or within the junctions of Golden Gate primers. They must be precise for the assembly to work.
- It's best to **place degenerate bases a few nucleotides away from the junction** to reduce any context-dependent ligation bias.

---

### Example: pP6 Library Oligos

Here are the final oligos used for the pP6 linker library:

```
P6LibR2   CCAAAggtctcgTTATANNNNNNNNNNNNNNNNNTGTCAANNNNGAACCCAGGACTCCTCGAAGTC
P6LibF2   CAGTAggtctcgATAATNNNNNNANNNNGTTAGTATTTCTCCTCGTCTAC
```

These primers:

- Introduce degeneracy to encode a 4-amino-acid linker between domains
- Conform to Golden Gate primer rules (prefix, BsaI, sticky, anneal)
- Place degeneracy well away from the junctions for optimal ligation efficiency

You can simulate this library in C6-Tools to visualize possible sequence outcomes and confirm primer performance.

## Mutagenesis Quiz: Build a T203X EGFP Variant Library

In this quiz, you'll introduce a rational point mutation into a fluorescent protein gene to change its properties in a visible and meaningful way.

### Background

We're using **pcDNA3-EGFP**, a mammalian expression plasmid that produces **Enhanced Green Fluorescent Protein (EGFP)**. This plasmid is commonly used for visualizing gene expression or localization in mammalian cells. 

The plasmid contains:

 - A **CMV promoter** for expression in mammalian cells.
 - An **Ampicillin resistance gene** and **ColE1 origin** for propagation in *E. coli*.
 - The **EGFP gene**, which encodes a protein that fluoresces green when expressed and excited with blue light.

In the lab, you'd build the plasmid in *E. coli*, purify plasmid DNA, and then **transfect it into mammalian cells**, where the protein is expressed and fluoresces.

---

### Goal

A previous screen of a **site-saturation mutagenesis library** at position **T203** found that the **T203Y mutation** (Emerald GFP) produced brighter and red-shifted fluorescence. But this mutation was discovered **by making a degenerate library** where all possible codons were tested.

In this quiz, you will build the same library — not just a single mutant — using **Golden Gate mutagenesis**. You'll introduce an **NNK codon** at position 203 of EGFP to allow all 20 amino acids (and one stop) to be sampled.

This integrates everything you've learned:
 - Proper **frame-aware oligo design**
 - Use of **degenerate bases**
 - Careful **Golden Gate oligo junction placement**

---

### Tools

 - 🧬 [Genetic code table](https://cdn.kastatic.org/ka-perseus-images/f5de6355003ee322782b26404ef0733a1d1a61b0.png)
 - 📦 Benchling and ApE will **translate sequences** automatically — but you must start from the **ATG of the ORF**, not the start of the plasmid.

### Task

Use site-directed mutagenesis via **Golden Gate assembly** to mutate **Threonine 203 to NNK** in EGFP, generating a codon-randomized library at that site.

You will:

 - Locate T203 in the EGFP ORF
 - Replace its codon with `NNK`
 - Design and annotate the product
 - Simulate the construct and output a valid Construction File

### Files

- You can find the plasmid here: [Addgene #13031: pcDNA3-EGFP](https://www.addgene.org/13031/)
- Click the **"View all sequences"** link on the Addgene plasmid page.
- Then click the **GenBank** download link.
- Open the downloaded `.gbk` file in **ApE** or **Benchling** to view the plasmid map and annotations.
- A copy of the plasmid map is also available in the tutorial’s `assets` folder as: `addgene-plasmid-13031-sequence-305137.gbk`.

⚠️ Important: The plasmid contains an internal BsaI site, which would interfere with assembly. To avoid this conflict, use BsmBI instead (recognition site: 5′–CGTCTC(N1/N5)–3′).

---

## Guidelines

This quiz builds on everything you’ve learned so far. As you design your T203NNK library:

- Use Golden Gate mutagenesis with BsmBI on `pcDNA3-EGFP`.
- Replace only the codon for T203 with `NNK`, preserving the reading frame.
- As you prepare your product sequence in ApE or Benchling, annotate the edited codon as `"T203NNK"` to keep track of your mutation site.
- Choose a nearby 4 bp junction, the annealing regions, and design 2 Golden Gate oligos.
- Your final construct name should be: `EGFP-T203X`.

## Mutagenesis Quiz: T203X EGFP Variant Library

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
      if (!window.C6 || typeof window.C6.parseCF !== "function") {
        throw new Error("C6 tools not loaded. Please ensure window.C6 is available.");
      }

      const cf = window.C6.parseCF(input);
      // Inject sequences for simulation
      cf.sequences = cf.sequences || {};
      cf.sequences["pcDNA3-EGFP"] = "gacattgattattgactagttattaatagtaatcaattacggggtcattagttcatagcccatatatggagttccgcgttacataacttacggtaaatggcccgcctggctgaccgcccaacgacccccgcccattgacgtcaataatgacgtatgttcccatagtaacgccaatagggactttccattgacgtcaatgggtggagtatttacggtaaactgcccacttggcagtacatcaagtgtatcatatgccaagtacgccccctattgacgtcaatgacggtaaatggcccgcctggcattatgcccagtacatgaccttatgggactttcctacttggcagtacatctacgtattagtcatcgctattaccatggtgatgcggttttggcagtacatcaatgggcgtggatagcggtttgactcacggggatttccaagtctccaccccattgacgtcaatgggagtttgttttggcaccaaaatcaacgggactttccaaaatgtcgtaacaactccgccccattgacgcaaatgggcggtaggcgtgtacggtgggaggtctatataagcagagctctctggctaactagagaacccactgcttactggcttatcgaaattaatacgactcactatagggagacccaagcttggtaccgagctcggatccactagtaacggccgccagtgtgctggaattctgcagatatccatcacactggcggccgctcgagatggtgagcaagggcgaggagctgttcaccggggtggtgcccatcctggtcgagctggacggcgacgtaaacggccacaagttcagcgtgtccggcgagggcgagggcgatgccacctacggcaagctgaccctgaagttcatctgcaccaccggcaagctgcccgtgccctggcccaccctcgtgaccaccctgacctacggcgtgcagtgcttcagccgctaccccgaccacatgaagcagcacgacttcttcaagtccgccatgcccgaaggctacgtccaggagcgcaccatcttcttcaaggacgacggcaactacaagacccgcgccgaggtgaagttcgagggcgacaccctggtgaaccgcatcgagctgaagggcatcgacttcaaggaggacggcaacatcctggggcacaagctggagtacaactacaacagccacaacgtctatatcatggccgacaagcagaagaacggcatcaaggtgaacttcaagatccgccacaacatcgaggacggcagcgtgcagctcgccgaccactaccagcagaacacccccatcggcgacggccccgtgctgctgcccgacaaccactacctgagcacccagtccgccctgagcaaagaccccaacgagaagcgcgatcacatggtcctgctggagttcgtgaccgccgccgggatcactctcggcatggacgagctgtacaagtaatctagagggccctattctatagtgtcacctaaatgctagagctcgctgatcagcctcgactgtgccttctagttgccagccatctgttgtttgcccctcccccgtgccttccttgaccctggaaggtgccactcccactgtcctttcctaataaaatgaggaaattgcatcgcattgtctgagtaggtgtcattctattctggggggtggggtggggcaggacagcaagggggaggattgggaagacaatagcaggcatgctggggatgcggtgggctctatggcttctgaggcggaaagaaccagctggggctctagggggtatccccacgcgccctgtagcggcgcattaagcgcggcgggtgtggtggttacgcgcagcgtgaccgctacacttgccagcgccctagcgcccgctcctttcgctttcttcccttcctttctcgccacgttcgccggctttccccgtcaagctctaaatcgggggctccctttagggttccgatttagtgctttacggcacctcgaccccaaaaaacttgattagggtgatggttcacgtagtgggccatcgccctgatagacggtttttcgccctttgacgttggagtccacgttctttaatagtggactcttgttccaaactggaacaacactcaaccctatctcggtctattcttttgatttataagggattttgccgatttcggcctattggttaaaaaatgagctgatttaacaaaaatttaacgcgaattaattctgtggaatgtgtgtcagttagggtgtggaaagtccccaggctccccagcaggcagaagtatgcaaagcatgcatctcaattagtcagcaaccaggtgtggaaagtccccaggctccccagcaggcagaagtatgcaaagcatgcatctcaattagtcagcaaccatagtcccgcccctaactccgcccatcccgcccctaactccgcccagttccgcccattctccgccccatggctgactaattttttttatttatgcagaggccgaggccgcctctgcctctgagctattccagaagtagtgaggaggcttttttggaggcctaggcttttgcaaaaagctcccgggagcttgtatatccattttcggatctgatcaagagacaggatgaggatcgtttcgcatgattgaacaagatggattgcacgcaggttctccggccgcttgggtggagaggctattcggctatgactgggcacaacagacaatcggctgctctgatgccgccgtgttccggctgtcagcgcaggggcgcccggttctttttgtcaagaccgacctgtccggtgccctgaatgaactgcaggacgaggcagcgcggctatcgtggctggccacgacgggcgttccttgcgcagctgtgctcgacgttgtcactgaagcgggaagggactggctgctattgggcgaagtgccggggcaggatctcctgtcatctcaccttgctcctgccgagaaagtatccatcatggctgatgcaatgcggcggctgcatacgcttgatccggctacctgcccattcgaccaccaagcgaaacatcgcatcgagcgagcacgtactcggatggaagccggtcttgtcgatcaggatgatctggacgaagagcatcaggggctcgcgccagccgaactgttcgccaggctcaaggcgcgcatgcccgacggcgaggatctcgtcgtgacccatggcgatgcctgcttgccgaatatcatggtggaaaatggccgcttttctggattcatcgactgtggccggctgggtgtggcggaccgctatcaggacatagcgttggctacccgtgatattgctgaagagcttggcggcgaatgggctgaccgcttcctcgtgctttacggtatcgccgctcccgattcgcagcgcatcgccttctatcgccttcttgacgagttcttctgagcgggactctggggttcgaaatgaccgaccaagcgacgcccaacctgccatcacgagatttcgattccaccgccgccttctatgaaaggttgggcttcggaatcgttttccgggacgccggctggatgatcctccagcgcggggatctcatgctggagttcttcgcccaccccaacttgtttattgcagcttataatggttacaaataaagcaatagcatcacaaatttcacaaataaagcatttttttcactgcattctagttgtggtttgtccaaactcatcaatgtatcttatcatgtctgtataccgtcgacctctagctagagcttggcgtaatcatggtcatagctgtttcctgtgtgaaattgttatccgctcacaattccacacaacatacgagccggaagcataaagtgtaaagcctggggtgcctaatgagtgagctaactcacattaattgcgttgcgctcactgcccgctttccagtcgggaaacctgtcgtgccagctgcattaatgaatcggccaacgcgcggggagaggcggtttgcgtattgggcgctcttccgcttcctcgctcactgactcgctgcgctcggtcgttcggctgcggcgagcggtatcagctcactcaaaggcggtaatacggttatccacagaatcaggggataacgcaggaaagaacatgtgagcaaaaggccagcaaaaggccaggaaccgtaaaaaggccgcgttgctggcgtttttccataggctccgcccccctgacgagcatcacaaaaatcgacgctcaagtcagaggtggcgaaacccgacaggactataaagataccaggcgtttccccctggaagctccctcgtgcgctctcctgttccgaccctgccgcttaccggatacctgtccgcctttctcccttcgggaagcgtggcgctttctcatagctcacgctgtaggtatctcagttcggtgtaggtcgttcgctccaagctgggctgtgtgcacgaaccccccgttcagcccgaccgctgcgccttatccggtaactatcgtcttgagtccaacccggtaagacacgacttatcgccactggcagcagccactggtaacaggattagcagagcgaggtatgtaggcggtgctacagagttcttgaagtggtggcctaactacggctacactagaagaacagtatttggtatctgcgctctgctgaagccagttaccttcggaaaaagagttggtagctcttgatccggcaaacaaaccaccgctggtagcggtggtttttttgtttgcaagcagcagattacgcgcagaaaaaaaggatctcaagaagatcctttgatcttttctacggggtctgacgctcagtggaacgaaaactcacgttaagggattttggtcatgagattatcaaaaaggatcttcacctagatccttttaaattaaaaatgaagttttaaatcaatctaaagtatatatgagtaaacttggtctgacagttaccaatgcttaatcagtgaggcacctatctcagcgatctgtctatttcgttcatccatagttgcctgactccccgtcgtgtagataactacgatacgggagggcttaccatctggccccagtgctgcaatgataccgcgagacccacgctcaccggctccagatttatcagcaataaaccagccagccggaagggccgagcgcagaagtggtcctgcaactttatccgcctccatccagtctattaattgttgccgggaagctagagtaagtagttcgccagttaatagtttgcgcaacgttgttgccattgctacaggcatcgtggtgtcacgctcgtcgtttggtatggcttcattcagctccggttcccaacgatcaaggcgagttacatgatcccccatgttgtgcaaaaaagcggttagctccttcggtcctccgatcgttgtcagaagtaagttggccgcagtgttatcactcatggttatggcagcactgcataattctcttactgtcatgccatccgtaagatgcttttctgtgactggtgagtactcaaccaagtcattctgagaatagtgtatgcggcgaccgagttgctcttgcccggcgtcaatacgggataataccgcgccacatagcagaactttaaaagtgctcatcattggaaaacgttcttcggggcgaaaactctcaaggatcttaccgctgttgagatccagttcgatgtaacccactcgtgcacccaactgatcttcagcatcttttactttcaccagcgtttctgggtgagcaaaaacaggaaggcaaaatgccgcaaaaaagggaataagggcgacacggaaatgttgaatactcatactcttcctttttcaatattattgaagcatttatcagggttattgtctcatgagcggatacatatttgaatgtatttagaaaaataaacaaataggggttccgcgcacatttccccgaaaagtgccacctgacgtcgacggatcgggagatctcccgatcccctatggtgcactctcagtacaatctgctctgatgccgcatagttaagccagtatctgctccctgcttgtgtgttggaggtcgctgagtagtgcgcgagcaaaatttaagctacaacaaggcaaggcttgaccgacaattgcatgaagaatctgcttagggttaggcgttttgcgctgcttcgcgatgtacgggccagatatacgcgtt";
      cf.sequences["addgene-plasmid-13031-sequence-305137"] = cf.sequences["pcDNA3-EGFP"];

      const results = window.C6.simCF(cf);
      console.log(results);

      // Format and display output products table
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

      if (!Array.isArray(results) || results.length === 0) {
        resultP.innerHTML = "❌ No simulation steps returned. Please check your input.";
        return;
      }

      const final = results[results.length - 1];
      const finalSeq = final.sequence || final[1] || "";
      const seq = finalSeq.toUpperCase();
      const rc = s => s.split('').reverse().map(base => (
        { A: 'T', T: 'A', G: 'C', C: 'G', N: 'N', K: 'M', M: 'K', R: 'Y', Y: 'R', S: 'S', W: 'W' }[base] || base
      )).join('');

      const searchSpace = seq + seq + "x" + rc(seq) + rc(seq);

      const requiredRegions = [
        { sequence: "atggtgagcaagggcgaggagctgttcaccggggtggtgcccatcctggtcgagctggacggcgacgtaaacggccacaagttcagcgtgtccggcgagggcgagggcgatgccacctacggcaagctgaccctgaagttcatctgcaccaccggcaagctgcccgtgccctggcccaccctcgtgaccaccctgacctacggcgtgcagtgcttcagccgctaccccgaccacatgaagcagcacgacttcttcaagtccgccatgcccgaaggctacgtccaggagcgcaccatcttcttcaaggacgacggcaactacaagacccgcgccgaggtgaagttcgagggcgacaccctggtgaaccgcatcgagctgaagggcatcgacttcaaggaggacggcaacatcctggggcacaagctggagtacaactacaacagccacaacgtctatatcatggccgacaagcagaagaacggcatcaaggtgaacttcaagatccgccacaacatcgaggacggcagcgtgcagctcgccgaccactaccagcagaacacccccatcggcgacggccccgtgctgctgcccgacaaccactacctgagcNNKcagtccgccctgagcaaagaccccaacgagaagcgcgatcacatggtcctgctggagttcgtgaccgccgccgggatcactctcggcatggacgagctgtacaagtaa", label: "GFP with NNK at 203" },
        { sequence: "cactggcggccgctcgagatggtgagcaagggcg", label: "5′ junction: vector–insert" },
        { sequence: "tgtacaagtaatctagagggccctattctatagtg", label: "3′ junction: insert–vector" },
        { sequence: "atgattgaacaagatggattgcacgcaggttctccggccgcttgggtggagaggctattcggctatgactgggcacaacagacaatcggctgctctgatgccgccgtgttccggctgtcagcgcaggggcgcccggttctttttgtcaagaccgacctgtccggtgccctgaatgaactgcaggacgaggcagcgcggctatcgtggctggccacgacgggcgttccttgcgcagctgtgctcgacgttgtcactgaagcgggaagggactggctgctattgggcgaagtgccggggcaggatctcctgtcatctcaccttgctcctgccgagaaagtatccatcatggctgatgcaatgcggcggctgcatacgcttgatccggctacctgcccattcgaccaccaagcgaaacatcgcatcgagcgagcacgtactcggatggaagccggtcttgtcgatcaggatgatctggacgaagagcatcaggggctcgcgccagccgaactgttcgccaggctcaaggcgcgcatgcccgacggcgaggatctcgtcgtgacccatggcgatgcctgcttgccgaatatcatggtggaaaatggccgcttttctggattcatcgactgtggccggctgggtgtggcggaccgctatcaggacatagcgttggctacccgtgatattgctgaagagcttggcggcgaatgggctgaccgcttcctcgtgctttacggtatcgccgctcccgattcgcagcgcatcgccttctatcgccttcttgacgagttcttctga", label: "kanR open reading frame" },
        { sequence: "tttccataggctccgcccccctgacgagcatcacaaaaatcgacgctcaagtcagaggtggcgaaacccgacaggactataaagataccaggcgtttccccctggaagctccctcgtgcgctctcctgttccgaccctgccgcttaccggatacctgtccgcctttctcccttcgggaagcgtggcgctttctcatagctcacgctgtaggtatctcagttcggtgtaggtcgttcgctccaagctgggctgtgtgcacgaaccccccgttcagcccgaccgctgcgccttatccggtaactatcgtcttgagtccaacccggtaagacacgacttatcgccactggcagcagccactggtaacaggattagcagagcgaggtatgtaggcggtgctacagagttcttgaagtggtggcctaactacggctacactagaagaacagtatttggtatctgcgctctgctgaagccagttaccttcggaaaaagagttggtagctcttgatccggcaaacaaaccaccgctggtagcggtggtttttttgtttgcaagcagcagattacgcgcagaaaaaaaggatctcaa", label: "ColE1 origin of replication" }
      ];

      let feedback = [];
      let missing = [];

      requiredRegions.forEach(({ sequence, label, mustNotExist }) => {
        const found = searchSpace.includes(sequence.toUpperCase());
        if ((mustNotExist && found) || (!mustNotExist && !found)) {
          missing.push(label);
        }
      });

      if (missing.length === 0) {
        feedback.push("✅ Success! Your design meets all criteria.");
        if (typeof window.progressManager !== "undefined") {
          window.progressManager.addCompletion("Mutagenesis", "correct");
        }
      } else {
        feedback = missing.map(label => `❌ Missing or incorrect: <code>${label}</code>`);
      }

      outputHTML += `<ul style="margin-top:1em;">${feedback.map(f => `<li>${f}</li>`).join("")}</ul>`;
      resultP.innerHTML = outputHTML;
    } catch (err) {
      resultP.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
    }
    
  });
</script>