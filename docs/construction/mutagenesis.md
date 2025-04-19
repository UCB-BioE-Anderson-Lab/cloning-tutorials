# Site-Directed Mutagenesis

Site-directed mutagenesis refers to any cloning technique where you introduce a specific, localized change into a DNA sequence. These changes may include:

- Substituting a base or codon
- Inserting or deleting a small sequence (typically <30 bp)
- Replacing a defined region
- Creating a variant library at a defined site

In all cases, you're targeting a specific location within a plasmid and rewriting a short region while leaving the rest unchanged.

![Diagram showing patch editing of a plasmid region while keeping the rest constant](../images/site_mutagenesis_overview.png)

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

The **pTargetF** plasmid is commonly used to express **guide RNAs (gRNAs)** for CRISPR/Cas9-mediated gene knockouts. A gRNA consists of a constant scaffold region and a customizable 20 bp **protospacer** sequence at the 5′ end that determines DNA target specificity.

In this example, you'll modify the **protospacer** to retarget the guide to a new genomic location.

The pTargetF plasmid includes a **SpeI site** directly upstream of the protospacer, allowing us to use EIPCR to change this region. After PCR and SpeI digestion, the linear product is ligated to form the edited plasmid.

---

### Primer Design

Forward Primer  
            SpeI           protospacer        guide scaffold  
5′-ccataACTAGTacgctgcctgagtctctgtagttttagagctagaaatagcaag-3′

Reverse Primer  
            SpeI              J23119 promoter  
5′-ctcagACTAGTattatacctaggactgagctag-3′

---

### Construction File

```
PCR     ca4238    ca4239    pTargetF     ipcr
Digest  ipcr      SpeI      1            dig
Ligate  dig                          	   lig
Transform lig      Mach1 Spec 37        pTarg-cscR
```

---

### 📊 Graphic

![Diagram of inverse PCR used to modify the protospacer region in pTargetF](../images/pTargetF_EIPCR.png)

**Figure: Inverse PCR strategy for editing the protospacer in pTargetF.**  
The plasmid expresses a guide RNA driven by the J23119 promoter. The protospacer is located at the 5′ end of the gRNA and determines DNA target specificity. A SpeI restriction site upstream of the protospacer enables EIPCR: primers amplify the full vector and introduce the new protospacer, followed by SpeI digestion and re-ligation.

**Alt text:** Circular map of pTargetF with arrows showing inverse PCR across the guide RNA region, highlighting the SpeI site and protospacer edit.

---

## 2) Type IIs-based Mutagenesis

You can also use Golden Gate-style enzymes like **BsaI** or **BsmBI** to cut-and-religate the vector with edits—just like Golden Gate, but with one piece.

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

---

## Guidelines

This quiz builds on everything you’ve learned so far. As you design your T203NNK library:

- Use Golden Gate mutagenesis on `pcDNA3-EGFP`.
- Replace only the codon for T203 with `NNK`, preserving the reading frame.
- As you prepare your product sequence in ApE or Benchling, annotate the edited codon as `"T203NNK"` to keep track of your mutation site.
- Choose a nearby 4 bp junction, the annealing regions, and design 2 Golden Gate oligos.
- Your final construct name should be: `EGFP-T203X`.

Paste your Construction File below and click **Grade My Work**.

<textarea id="cfMutationInput" rows="10" style="width:100%; font-family:monospace;"></textarea>
<br>
<button onclick="gradeMutationCF()">Grade My Work</button>

<div id="cfMutationOutput" style="margin-top:20px;"></div>

<script>
window.gradeMutationCF = function () {
  const input = document.getElementById("cfMutationInput").value.trim();
  const outputDiv = document.getElementById("cfMutationOutput");
  outputDiv.innerHTML = "";

  try {
    const steps = parseCF(input);
    const results = simCF(steps);
    const finalProduct = results[results.length - 1];
    const seq = finalProduct.sequence.toUpperCase();

    function rc(s) {
      return s.split('').reverse().map(base => {
        return { A: 'T', T: 'A', G: 'C', C: 'G', N: 'N', K: 'M', M: 'K', R: 'Y', Y: 'R', S: 'S', W: 'W' }[base] || base;
      }).join('');
    }

    const searchSpace = seq + seq + "x" + rc(seq) + rc(seq);

    // Targets
    const requiredStrings = [
      "TAATACGACTCACTATAGGGAGACCCAAGCTTGGTACCGAGCTCGGATCCACTAGTAACGGCCGCCAGTGTGCTGGAATTCTGCAGATATCCATCACACTGGCGGCCGCTCGAGATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAGCTGGACGGCGACGTAAACGGCCACAAGTTCAGCGTGTCCGGCGAGGGCGAGGGCGATGCCACCTACGGCAAGCTGACCCTGAAGTTCATCTGCACCACCGGCAAGCTGCCCGTGCCCTGGCCCACCCTCGTGACCACCCTGACCTACGGCGTGCAGTGCTTCAGCCGCTACCCCGACCACATGAAGCAGCACGACTTCTTCAAGTCCGCCATGCCCGAAGGCTACGTCCAGGAGCGCACCATCTTCTTCAAGGACGACGGCAACTACAAGACCCGCGCCGAGGTGAAGTTCGAGGGCGACACCCTGGTGAACCGCATCGAGCTGAAGGGCATCGACTTCAAGGAGGACGGCAACATCCTGGGGCACAAGCTGGAGTACAACTACAACAGCCACAACGTCTATATCATGGCCGACAAGCAGAAGAACGGCATCAAGGTGAACTTCAAGATCCGCCACAACATCGAGGACGGCAGCGTGCAGCTCGCCGACCACTACCAGCAGAACACCCCCATCGGCGACGGCCCCGTGCTGCTGCCCGACAACCACTACCTGAGCNNKCAGTCCGCCCTGAGCAAAGACCCCAACGAGAAGCGCGATCACATGGTCCTGCTGGAGTTCGTGACCGCCGCCGGGATCACTCTCGGCATGGACGAGCTGTACAAGTAATCTAGAGGGCCCTATTCTATAGTGTCACCTAAATGCTAGAGCTCGCTGATCAGCCTCGACTGTGCCTTCTAGTTGCCAGCCATCTGTTGTTTGCCCCTCCCCCGTGCCTTCCTTGACCCTGGAAGGTGCCACTCCCACTGTCCTTTCCTAATAAAATGAGGAAATTGCATCGCATTGTCTGAGTAGGTGTCATTCTATTCTGGGGGGTGGGGTGGGGCA", // full NNK ORF with flanking context
      "CATTGACGTCAATAATGACGTATGTTCCCATAGTAA", // CMV enhancer
      "ACAGCAAGGGGGAGGATTGGGAAGACAATA",       // bGH poly(A)
      "GTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGT", // f1 ori
      "GGATCTCCTGTCATCTCACCTTGCTCCTGC",       // kanR
      "GGTATCTCAGTTCGGTGTAGG",               // ori
      "TCCGGTTCCCAACGATCAAGGCGAGTTACA"        // ampR
    ];

    let feedback = [];
    let missing = [];

    requiredStrings.forEach(s => {
      if (!searchSpace.includes(s)) {
        missing.push(s);
      }
    });

    if (missing.length === 0) {
      feedback.push("✅ Success! All expected elements were found in the simulated product.");
      progressManager.addCompletion("EGFP T203 Saturation Mutagenesis", "correct");
    } else {
      feedback.push(`❌ The following expected elements were missing from your construct:`);
      feedback = feedback.concat(missing.map(m => `<code>${m}</code>`));
    }

    outputDiv.innerHTML = `<ul>${feedback.map(f => `<li>${f}</li>`).join("")}</ul>`;
  } catch (err) {
    outputDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
};
</script>