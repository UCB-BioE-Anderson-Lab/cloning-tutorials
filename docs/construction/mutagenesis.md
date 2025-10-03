<script src="https://unpkg.com/seqviz"></script>
<script src="https://cdn.jsdelivr.net/npm/c6-sim@1.0.11/dist/c6-sim.min.js"></script>
# Site-Directed Mutagenesis

Site-directed mutagenesis refers to any cloning technique where you introduce a specific, localized change into a DNA sequence. These changes may include:

- Substituting a base or codon
- Inserting or deleting a small sequence (typically <30 bp)
- Replacing a defined region
- Creating a variant library at a defined site

In all cases, you're targeting a specific location within a plasmid and rewriting a short region while leaving the rest unchanged.

![Zoomed schematic of the pTargetF plasmid showing a site-directed edit in the gRNA region: the cadA-targeting protospacer (orange) is swapped for a cscR-targeting protospacer (pink), adjacent to a constant tracrRNA scaffold (green), under control of the P_con promoter and flanked by a SpeI site.](../images/pTargetF_protospacer_mutagenesis.png)

**Figure:** Site-directed mutagenesis of the pTargetF plasmid to retarget the gRNA. The original cadA-targeting protospacer (orange) is replaced with a new cscR-targeting protospacer (pink), using a SpeI-flanked region upstream of the gRNA scaffold (green tracrRNA).
<!-- 
##  🎥 Video Demo
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>
--- -->

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

### Primer Design and Strategy

The first step is to model your edited sequence. We want to replace the original cadA-targeting protospacer in pTargetF with a new protospacer targeting the *cscR* gene.

Below is a portion of the *cscR* sequence with all potential PAM sites (NGG) highlighted. Any 20 bp sequence immediately upstream of a GG can serve as a candidate protospacer. Specialized software tools can help you pick optimal guides based on efficiency and off-target predictions, and in many cases, validated guides are available in public databases.

<div id="viewer1" style="height:100px;"></div>
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

Below, we show the pTargetF sequence before and after the change.  We also select forward and reverse anneal sequences flanking the site of modification.

### Original (targeting cadA)

<div id="viewer2" style="height:100px;"></div>

### With cscR replaced

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

Now that we’ve modeled the edited region, we can design primers to build it. The **forward primer** includes everything from the SpeI site through the end of the forward annealing region. The **reverse primer** is the reverse complement of the sequence from the start of the reverse anneal to the end of the SpeI site. Add a 5′ tail of 5 arbitrary bases to both primers to improve enzyme activity and allow for efficient restriction digestion.

```
Forward Primer (ol_protoF)  
        SpeI  Protospacer         Forward Anneal  
5’-ccataACTAGTaacgcgtgaccgcgtattgcGTTTTAGAGCTAGAAATAGCAAG -3’

Reverse Primer (ol_protoR)  
        SpeI  Reverse Anneal (rc)  
5’-ctcagACTAGTattatacctaggactgagctag-3’
```

Finally, we can write up our construction file.  As always, simulate your construction file to make sure it works before ordering oligos.

<pre id="cf_quiz_example" style="background:#f8f8f8; border:1px solid #ccc; padding:10px; border-radius:4px; overflow-x:auto; white-space:pre;">
PCR       ol_protoF       ol_protoR       pTargetF      ipcr
Digest    ipcr                            SpeI          speDig
Ligate    speDig                                        pTarget-cscR
</pre>
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

---

## 2) QuickChange Mutagenesis Using pET-INS

### Example: C96S Mutation in Insulin

Cysteine 96 in human insulin helps form disulfide bonds critical for protein folding. Mutating this residue to serine (C96S) can stabilize recombinant insulin analogs by reducing misfolding or aggregation. In this example, we’ll use **QuickChange mutagenesis** to introduce the **C96S mutation** in the pET-INS plasmid.

![Cartoon diagram of QuickChange mutagenesis: primers anneal to the plasmid, mutated strands are extended, resulting in a nicked circular product that is repaired after transformation.](../images/quickchange_cartoon.png)

Image adapted from [Agilent Technologies](https://www.agilent.com/en/product/mutagenesis-cloning/mutagenesis-kits/site-directed-mutagenesis-kits/quikchange-233116).

### Strategy

QuickChange uses **two overlapping primers** to introduce a mutation into a plasmid:

- The **mutation sits in the middle** of each primer.
- The flanking regions must perfectly match the template DNA.
- After high-fidelity PCR, the full plasmid is synthesized but with nicks.
- **DpnI** is used to digest the methylated parental (template) DNA.
- The nicked product is repaired inside *E. coli* after transformation.

Conceptually, this is like a **Gibson assembly with one fragment**, except ligation occurs **in vivo**.

### Mutation Design

1. Open `pET-INS.seq` and locate amino acid **96** in the INS coding sequence.
2. Confirm it encodes **Cysteine** (TGC or TGT).
3. Replace with a **Serine codon**, like AGC.
4. Annotate the codon as `"C96S"`.

### Primer Design

Choose ~20 bp of perfectly matched sequence flanking the mutation site for both directions. The **mutation is centered** in the oligos.

<div id="viewer_INS" style="height:500px;"></div>
<script>
  waitForSeqViz(() => {
    seqviz
      .Viewer("viewer_INS", {
        name: "pET-INS C96S region",
        seq: "AGATCTCGATCCCGCGAAATTAATACGACTCACTATAGGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACCATGGccctgtggatgcgcctcctgcccctgctggcgctgctggccctctggggacctgacccagccgcagcctttgtgaaccaacacctgtgcggctcacacctggtggaagctctctacctagtgtgcggggaacgaggcttcttctacacacccaagacccgccgggaggcagaggacctgcaggtggggcaggtggagctgggcgggggccctggtgcaggcagcctgcagcccttggccctggaggggtccctgcagaagcgtggcattgtggaacaatgctgtaccagcatctgctccctctaccagctggagaactactgcaactagCTCGAGCACCACCACCACCACCACTGAGATCCGGCTGCTAACAAAGCCCGAAAGGAAGCTGAGTTGGCTGCTGCCACCGCTGAGCAATAACTAGCATAACCCCTTGGGGCCTCTAAACGGGTCTTGAGGGGTTTTTTGCTGAAAGGAGGAACTATATCCGGATTGGCGAATGGGACGCGCCCTGTAGCGGCGCATTAAGCGCGGCGGGTGTGGTGGTTACGCGCAGCGTGACCGCTACACTTGCCAGCGCCCTAGCGCCCGCTCCTTTCGCTTTCTTCCCTTCCTTTCTCGCCACGTTCGCCGGCTTTCCCCGTCAAGCTCTAAATCGGGGGCTCCCTTTAGGGTTCCGATTTAGTGCTTTACGGCACCTCGACCCCAAAAAACTTGATTAGGGTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGTTTTTCGCCCTTTGACGTTGGAGTCCACGTTCTTTAATAGTGGACTCTTGTTCCAAACTGGAACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTTTAACAAAATATTAACGTTTACAATTTCAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTATCCGCTCATGAATTAATTCTTAGAAAAACTCATCGAGCATCAAATGAAACTGCAATTTATTCATATCAGGATTATCAATACCATATTTTTGAAAAAGCCGTTTCTGTAATGAAGGAGAAAACTCACCGAGGCAGTTCCATAGGATGGCAAGATCCTGGTATCGGTCTGCGATTCCGACTCGTCCAACATCAATACAACCTATTAATTTCCCCTCGTCAAAAATAAGGTTATCAAGTGAGAAATCACCATGAGTGACGACTGAATCCGGTGAGAATGGCAAAAGTTTATGCATTTCTTTCCAGACTTGTTCAACAGGCCAGCCATTACGCTCGTCATCAAAATCACTCGCATCAACCAAACCGTTATTCATTCGTGATTGCGCCTGAGCGAGACGAAATACGCGATCGCTGTTAAAAGGACAATTACAAACAGGAATCGAATGCAACCGGCGCAGGAACACTGCCAGCGCATCAACAATATTTTCACCTGAATCAGGATATTCTTCTAATACCTGGAATGCTGTTTTCCCGGGGATCGCAGTGGTGAGTAACCATGCATCATCAGGAGTACGGATAAAATGCTTGATGGTCGGAAGAGGCATAAATTCCGTCAGCCAGTTTAGTCTGACCATCTCATCTGTAACATCATTGGCAACGCTACCTTTGCCATGTTTCAGAAACAACTCTGGCGCATCGGGCTTCCCATACAATCGATAGATTGTCGCACCTGATTGCCCGACATTATCGCGAGCCCATTTATACCCATATAAATCAGCATCCATGTTGGAATTTAATCGCGGCCTAGAGCAAGACGTTTCCCGTTGAATATGGCTCATAACACCCCTTGTATTACTGTTTATGTAAGCAGACAGTTTTATTGTTCATGACCAAAATCCCTTAACGTGAGTTTTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTCCTTCTAGTGTAGCCGTAGTTAGGCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGAGCGCCTGATGCGGTATTTTCTCCTTACGCATCTGTGCGGTATTTCACACCGCATATATGGTGCACTCTCAGTACAATCTGCTCTGATGCCGCATAGTTAAGCCAGTATACACTCCGCTATCGCTACGTGACTGGGTCATGGCTGCGCCCCGACACCCGCCAACACCCGCTGACGCGCCCTGACGGGCTTGTCTGCTCCCGGCATCCGCTTACAGACAAGCTGTGACCGTCTCCGGGAGCTGCATGTGTCAGAGGTTTTCACCGTCATCACCGAAACGCGCGAGGCAGCTGCGGTAAAGCTCATCAGCGTGGTCGTGAAGCGATTCACAGATGTCTGCCTGTTCATCCGCGTCCAGCTCGTTGAGTTTCTCCAGAAGCGTTAATGTCTGGCTTCTGATAAAGCGGGCCATGTTAAGGGCGGTTTTTTCCTGTTTGGTCACTGATGCCTCCGTGTAAGGGGGATTTCTGTTCATGGGGGTAATGATACCGATGAAACGAGAGAGGATGCTCACGATACGGGTTACTGATGATGAACATGCCCGGTTACTGGAACGTTGTGAGGGTAAACAACTGGCGGTATGGATGCGGCGGGACCAGAGAAAAATCACTCAGGGTCAATGCCAGCGCTTCGTTAATACAGATGTAGGTGTTCCACAGGGTAGCCAGCAGCATCCTGCGATGCAGATCCGGAACATAATGGTGCAGGGCGCTGACTTCCGCGTTTCCAGACTTTACGAAACACGGAAACCGAAGACCATTCATGTTGTTGCTCAGGTCGCAGACGTTTTGCAGCAGCAGTCGCTTCACGTTCGCTCGCGTATCGGTGATTCATTCTGCTAACCAGTAAGGCAACCCCGCCAGCCTAGCCGGGTCCTCAACGACAGGAGCACGATCATGCGCACCCGTGGGGCCGCCATGCCGGCGATAATGGCCTGCTTCTCGCCGAAACGTTTGGTGGCGGGACCAGTGACGAAGGCTTGAGCGAGGGCGTGCAAGATTCCGAATACCGCAAGCGACAGGCCGATCATCGTCGCGCTCCAGCGAAAGCGGTCCTCGCCGAAAATGACCCAGAGCGCTGCCGGCACCTGTCCTACGAGTTGCATGATAAAGAAGACAGTCATAAGTGCGGCGACGATAGTCATGCCCCGCGCCCACCGGAAGGAGCTGACTGGGTTGAAGGCTCTCAAGGGCATCGGTCGAGATCCCGGTGCCTAATGAGTGAGCTAACTTACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCCAGGGTGGTTTTTCTTTTCACCAGTGAGACGGGCAACAGCTGATTGCCCTTCACCGCCTGGCCCTGAGAGAGTTGCAGCAAGCGGTCCACGCTGGTTTGCCCCAGCAGGCGAAAATCCTGTTTGATGGTGGTTAACGGCGGGATATAACATGAGCTGTCTTCGGTATCGTCGTATCCCACTACCGAGATATCCGCACCAACGCGCAGCCCGGACTCGGTAATGGCGCGCATTGCGCCCAGCGCCATCTGATCGTTGGCAACCAGCATCGCAGTGGGAACGATGCCCTCATTCAGCATTTGCATGGTTTGTTGAAAACCGGACATGGCACTCCAGTCGCCTTCCCGTTCCGCTATCGGCTGAATTTGATTGCGAGTGAGATATTTATGCCAGCCAGCCAGACGCAGACGCGCCGAGACAGAACTTAATGGGCCCGCTAACAGCGCGATTTGCTGGTGACCCAATGCGACCAGATGCTCCACGCCCAGTCGCGTACCGTCTTCATGGGAGAAAATAATACTGTTGATGGGTGTCTGGTCAGAGACATCAAGAAATAACGCCGGAACATTAGTGCAGGCAGCTTCCACAGCAATGGCATCCTGGTCATCCAGCGGATAGTTAATGATCAGCCCACTGACGCGTTGCGCGAGAAGATTGTGCACCGCCGCTTTACAGGCTTCGACGCCGCTTCGTTCTACCATCGACACCACCACGCTGGCACCCAGTTGATCGGCGCGAGATTTAATCGCCGCGACAATTTGCGACGGCGCGTGCAGGGCCAGACTGGAGGTGGCAACGCCAATCAGCAACGACTGTTTGCCCGCCAGTTGTTGTGCCACGCGGTTGGGAATGTAATTCAGCTCCGCCATCGCCGCTTCCACTTTTTCCCGCGTTTTCGCAGAAACGTGGCTGGCCTGGTTCACCACGCGGGAAACGGTCTGATAAGAGACACCGGCATACTCTGCGACATCGTATAACGTTACTGGTTTCACATTCACCACCCTGAATTGACTCTCTTCCGGGCGCTATCATGCCATACCGCGAAAGGTTTTGCGCCATTCGATGGTGTCCGGGATCTCGACGCTCTCCCTTATGCGACTCCTGCATTAGGAAGCAGCCCAGTAGTAGGTTGAGGCCGTTGAGCACCGCCGCCGCAAGGAATGGTGCATGCAAGGAGATGGCGCCCAACAGTCCCCCGGCCACGGGGCCTGCCACCATACCCACGCCGAAACAAGCGCTCATGAGCCCGAAGTGGCGAGCCCGATCTTCCCCATCGGTGATGTCGGCGATATAGGCGCCAGCAACCGCACCTGTGGCGCCGGTGATGCCGGCCACGATGCGTCCGGCGTAGAGGATCG",
        annotations: [
            { name: "T7 Promoter", start: 20, end: 40, color: "RosyBrown", direction: 1 },
            { name: "INS (insulin CDS)", start: 107, end: 440, color: "#e9cf24", direction: 1 },
            { name: "KanR", start: 1162, end: 1978, color: "#ccffcc", direction: -1 },
            { name: "ColE1 origin", start: 2023, end: 2706, color: "gray", direction: 1 },
            { name: "lacI", start: 4117, end: 5200, color: "#993366", direction: -1 }
        ],
        primers: [
            { name: "Forward Anneal", start: 392, end: 413, color: "cyan", direction: 1 },
            { name: "Reverse Anneal", start: 367, end: 389, color: "cyan", direction: 1 },
            { name: "C96", start: 389, end: 392, color: "red", direction: 1 },

        ],
        viewer: "linear",
        showComplement: false,
        showIndex: true,
        showAnnotations: true,
        showLabels: true,
        zoom: { linear: 40 },
        style: { height: "500px", width: "100%" }
      })
      .render();
  });
</script>

### Oligos

```
Forward Primer (ol_C96S_F)
          [anneal]  [MUTATED CODON]  [anneal]
5’-gaagcgtggcattgtggaacaaAGTtgtaccagcatctgctccctc-3’

Reverse Primer (ol_C96S_R)
Reverse complement of forward primer
5’-gagggagcagatgctggtacaACTttgttccacaatgccacgcttc-3’
```

### Final Notes

- Perform **DpnI digestion** after PCR to eliminate the template plasmid.
- No ligase is required — the cell repairs the nicks.
- Very fast and easy to perform
- Ideal for single codon changes, but less robust than EIPCR for large insertions.

---

## 3) Saturation Mutagenesis

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
- **Avoid degeneracy at sticky ends**. Keep the 4 bp sticky sequence constant, and also fix at least one adjacent base. Allowing diversity in this region can cause biased assembly.
- It's best to **place degenerate bases a few nucleotides away from the junction** to reduce any context-dependent ligation bias.

---

### pP6 Promoter Library — Design Walkthrough

> **What this is**: A promoter **library** built by iPCR/Golden Gate. We conserve the core promoter elements and randomize the surrounding bases to sample promoter strength and context.

**Template**: **pJ12** (J23112 promoter → amilGFP). This vector already includes **BseRI** Golden Gate sites so the edited part can be mobilized later.

#### Design goals
- **Conserve** the **–35**, **–10**, and **+1** elements.
- **Randomize** all bases **between –35 to –10** and **–10 to +1**.
- Add **4 N’s** on the **left and right** flanks of the promoter segment to increase diversity.


#### Step-by-step

You can download the pJ12 sequence here: [pJ12.seq](../assets/pJ12.seq).

1. **Open the template**  
   • Start from pJ12, which carries the J23112 promoter.  
   • Change the –35 and –10 elements to their consensus sequences: **TTGACA** (–35) and **TATAAT** (–10).  
   • This ensures every variant in the library begins with promoter elements expected to be strong.

2. **Replace intra-promoter regions with N’s**  
   • Randomize all bases between –35 to –10 and –10 to +1 by substituting with N characters of equal length.  
   • Change the 4 bp flanking both sides of the promoter segment to N.

3. **Choose the sticky end**  
   • Pick a 4‑bp junction close to the randomized region, usually just to the left of it, leaving a base or two of separation.  
   • The sticky end should be in a conserved region so that all variants will produce the same overhang and close efficiently.  
   • For pP6, because we are introducing many changes, the assembly works better if the library is split in half. To do that, the junction is placed in the middle of the promoter.  
   • The –10 box (TATAAT) is conserved across all variants, so we chose the sticky end within that region for this case.

4. **Pick primer annealing regions (~20 bp)**  
   • 5′ primer: just left of the randomized block.  
   • 3′ primer: just right of the randomized block.  
   • Follow design rules: balanced GC, avoid repeats, end in GC.  
   • Mark both annealing regions with a feature.

5. **Design the oligos**  
   • From each annealing region, extend through to the sticky end.  
   • Forward oligo = sequence as-is.  
   • Reverse oligo = reverse complement of its region.  
   • Add required 5′ elements (tail, BsaI site, random base) as shown in the primer structure table below.

   Primer structure (5′→3′) typically follows this pattern:

   | Segment          | Example    | Purpose                                                 |
   |------------------|------------|---------------------------------------------------------|
   | 5′ tail          | 5 bases    | Padding to improve restriction enzyme efficiency        |
   | Restriction site | GGTCTC     | Recognition site for BsaI                               |
   | One base padding | 1 bp       | Intentional extra base before the sticky; sets cut gap  |
   | Sticky end       | 4 bp       | Conserved overhang used for re‑closing                  |
   | Buffer sequence  | 1–2 bp     | Fixed bases after the sticky end; prevents N’s from sitting directly next to the overhang |
   | Randomized block | N…         | Diversified bases between conserved elements            |
   | Anneal region    | ~20 bp     | Primer‑binding site (non‑randomized)                    |


<ol start="6">
  <li><strong>Write the construction file and simulate it to validate</strong>
    <pre style="background:#f8f8f8; border:1px solid #ccc; padding:10px; border-radius:4px; overflow-x:auto; white-space:pre;">
PCR P6LibF2 P6LibR2 pJ12 P6
GoldenGate P6 BsaI gg
Transform gg Mach1 Carb 37 pP6
    </pre>
  </li>
</ol>

#### Video demo
<iframe width="560" height="315" src="https://www.youtube.com/embed/rKphfCPLM6c" title="pP6 promoter library design walkthrough" frameborder="0" allowfullscreen></iframe>
[Watch on YouTube](https://youtu.be/rKphfCPLM6c)

## Mutagenesis Quiz: Build a T204X EGFP Variant Library

In this quiz, you will design and simulate a saturation mutagenesis library at position 204 in EGFP. At this position, a threonine (ACC) has previously been shown—when mutated—to alter fluorescence properties. Here you’ll replace it with NNK to explore all possibilities.

### Background

We're using **pcDNA3-EGFP**, a mammalian expression plasmid that produces **Enhanced Green Fluorescent Protein (EGFP)**. This plasmid is commonly used for visualizing gene expression or localization in mammalian cells. 

The plasmid contains:

 - A **CMV promoter** for expression in mammalian cells.
 - An **Ampicillin resistance gene** and **ColE1 origin** for propagation in *E. coli*.
 - The **EGFP gene**, which encodes a protein that fluoresces green when expressed and excited with blue light.

In the lab, you'd build the plasmid in *E. coli*, purify plasmid DNA, and then **transfect it into mammalian cells**, where the protein is expressed and fluoresces.

---

### Goal

In this quiz, you will design and simulate a site-saturation mutagenesis library at position T204 of EGFP. At this site the wild-type codon encodes threonine (ACC). By replacing it with an NNK codon you will create a library that samples all 20 amino acids (and one stop), enabling discovery of variants with altered fluorescence.

---

### Tools

 - 🧬 [Genetic code table](https://cdn.kastatic.org/ka-perseus-images/f5de6355003ee322782b26404ef0733a1d1a61b0.png)
 - 📦 Benchling and ApE will **translate sequences** automatically — but you must start from the **ATG of the ORF**, not the start of the plasmid.

### Task

1. **Find the codon to modify**  
   • Protein numbering starts at 1, so codon index = 3 × (position − 1).  
   • For T204: 3 × 203 = 609, so codon 204 spans bases 609–611 of the ORF.  
   • In EGFP, the threonine of interest is at codon 204 (bases 609–611), which is the ACC you should target.  
   • Confirm you have the correct codon by checking that it is ACC (threonine).

2. **Replace it with NNK**  
   • Edit ACC (at codon 204, bases 609–611) → NNK. If your editor does not accept K, temporarily use NNN.

3. **Choose the 4‑bp sticky junction**  
   • Pick 4 bp just to the left of the NNK (codon 204) site.  
   • Leave 1–2 fixed bases as a buffer between the junction and the NNK.  
   • Mark this 4‑bp feature.

4. **Choose annealing regions (~20 bp)**  
   • On each side of the edited site (codon 204), select non‑randomized regions for primers.  
   • Follow standard rules (balanced GC, end with GC, avoid repeats).  
   • Mark both features.

5. **Design the oligos**  
   • Forward oligo: [tail] + [BsaI site GGTCTC] + [one‑base padding] + [sticky end] + [buffer] + [NNK] + [anneal].  
   • Reverse oligo: reverse complement of its region with the same 5′ additions.  
   • Use the Golden Gate oligo pattern from the earlier tutorial as your guide.

6. **Correct NNN if used**  
   • If you used NNN, change the last base to K to finalize NNK.

7. **Write the Construction File (CF) and simulate**  

### Files

- You can find the plasmid here: [Addgene #13031: pcDNA3-EGFP](https://www.addgene.org/13031/)
- Click the **"View all sequences"** link on the Addgene plasmid page.
- Then click the **GenBank** download link.
- Open the downloaded `.gbk` file in **ApE** or **Benchling** to view the plasmid map and annotations.
- A copy of the plasmid map is also available in the tutorial’s `assets` folder as: `addgene-plasmid-13031-sequence-305137.gbk`.

⚠️ Important: The plasmid contains an internal BsaI site, which would interfere with assembly. To avoid this conflict, use BsmBI instead (recognition site: 5′–CGTCTC(N1/N5)–3′).

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
      const injections = `
      plasmid pcDNA3-EGFP gacattgattattgactagttattaatagtaatcaattacggggtcattagttcatagcccatatatggagttccgcgttacataacttacggtaaatggcccgcctggctgaccgcccaacgacccccgcccattgacgtcaataatgacgtatgttcccatagtaacgccaatagggactttccattgacgtcaatgggtggagtatttacggtaaactgcccacttggcagtacatcaagtgtatcatatgccaagtacgccccctattgacgtcaatgacggtaaatggcccgcctggcattatgcccagtacatgaccttatgggactttcctacttggcagtacatctacgtattagtcatcgctattaccatggtgatgcggttttggcagtacatcaatgggcgtggatagcggtttgactcacggggatttccaagtctccaccccattgacgtcaatgggagtttgttttggcaccaaaatcaacgggactttccaaaatgtcgtaacaactccgccccattgacgcaaatgggcggtaggcgtgtacggtgggaggtctatataagcagagctctctggctaactagagaacccactgcttactggcttatcgaaattaatacgactcactatagggagacccaagcttggtaccgagctcggatccactagtaacggccgccagtgtgctggaattctgcagatatccatcacactggcggccgctcgagatggtgagcaagggcgaggagctgttcaccggggtggtgcccatcctggtcgagctggacggcgacgtaaacggccacaagttcagcgtgtccggcgagggcgagggcgatgccacctacggcaagctgaccctgaagttcatctgcaccaccggcaagctgcccgtgccctggcccaccctcgtgaccaccctgacctacggcgtgcagtgcttcagccgctaccccgaccacatgaagcagcacgacttcttcaagtccgccatgcccgaaggctacgtccaggagcgcaccatcttcttcaaggacgacggcaactacaagacccgcgccgaggtgaagttcgagggcgacaccctggtgaaccgcatcgagctgaagggcatcgacttcaaggaggacggcaacatcctggggcacaagctggagtacaactacaacagccacaacgtctatatcatggccgacaagcagaagaacggcatcaaggtgaacttcaagatccgccacaacatcgaggacggcagcgtgcagctcgccgaccactaccagcagaacacccccatcggcgacggccccgtgctgctgcccgacaaccactacctgagcacccagtccgccctgagcaaagaccccaacgagaagcgcgatcacatggtcctgctggagttcgtgaccgccgccgggatcactctcggcatggacgagctgtacaagtaatctagagggccctattctatagtgtcacctaaatgctagagctcgctgatcagcctcgactgtgccttctagttgccagccatctgttgtttgcccctcccccgtgccttccttgaccctggaaggtgccactcccactgtcctttcctaataaaatgaggaaattgcatcgcattgtctgagtaggtgtcattctattctggggggtggggtggggcaggacagcaagggggaggattgggaagacaatagcaggcatgctggggatgcggtgggctctatggcttctgaggcggaaagaaccagctggggctctagggggtatccccacgcgccctgtagcggcgcattaagcgcggcgggtgtggtggttacgcgcagcgtgaccgctacacttgccagcgccctagcgcccgctcctttcgctttcttcccttcctttctcgccacgttcgccggctttccccgtcaagctctaaatcgggggctccctttagggttccgatttagtgctttacggcacctcgaccccaaaaaacttgattagggtgatggttcacgtagtgggccatcgccctgatagacggtttttcgccctttgacgttggagtccacgttctttaatagtggactcttgttccaaactggaacaacactcaaccctatctcggtctattcttttgatttataagggattttgccgatttcggcctattggttaaaaaatgagctgatttaacaaaaatttaacgcgaattaattctgtggaatgtgtgtcagttagggtgtggaaagtccccaggctccccagcaggcagaagtatgcaaagcatgcatctcaattagtcagcaaccaggtgtggaaagtccccaggctccccagcaggcagaagtatgcaaagcatgcatctcaattagtcagcaaccatagtcccgcccctaactccgcccatcccgcccctaactccgcccagttccgcccattctccgccccatggctgactaattttttttatttatgcagaggccgaggccgcctctgcctctgagctattccagaagtagtgaggaggcttttttggaggcctaggcttttgcaaaaagctcccgggagcttgtatatccattttcggatctgatcaagagacaggatgaggatcgtttcgcatgattgaacaagatggattgcacgcaggttctccggccgcttgggtggagaggctattcggctatgactgggcacaacagacaatcggctgctctgatgccgccgtgttccggctgtcagcgcaggggcgcccggttctttttgtcaagaccgacctgtccggtgccctgaatgaactgcaggacgaggcagcgcggctatcgtggctggccacgacgggcgttccttgcgcagctgtgctcgacgttgtcactgaagcgggaagggactggctgctattgggcgaagtgccggggcaggatctcctgtcatctcaccttgctcctgccgagaaagtatccatcatggctgatgcaatgcggcggctgcatacgcttgatccggctacctgcccattcgaccaccaagcgaaacatcgcatcgagcgagcacgtactcggatggaagccggtcttgtcgatcaggatgatctggacgaagagcatcaggggctcgcgccagccgaactgttcgccaggctcaaggcgcgcatgcccgacggcgaggatctcgtcgtgacccatggcgatgcctgcttgccgaatatcatggtggaaaatggccgcttttctggattcatcgactgtggccggctgggtgtggcggaccgctatcaggacatagcgttggctacccgtgatattgctgaagagcttggcggcgaatgggctgaccgcttcctcgtgctttacggtatcgccgctcccgattcgcagcgcatcgccttctatcgccttcttgacgagttcttctgagcgggactctggggttcgaaatgaccgaccaagcgacgcccaacctgccatcacgagatttcgattccaccgccgccttctatgaaaggttgggcttcggaatcgttttccgggacgccggctggatgatcctccagcgcggggatctcatgctggagttcttcgcccaccccaacttgtttattgcagcttataatggttacaaataaagcaatagcatcacaaatttcacaaataaagcatttttttcactgcattctagttgtggtttgtccaaactcatcaatgtatcttatcatgtctgtataccgtcgacctctagctagagcttggcgtaatcatggtcatagctgtttcctgtgtgaaattgttatccgctcacaattccacacaacatacgagccggaagcataaagtgtaaagcctggggtgcctaatgagtgagctaactcacattaattgcgttgcgctcactgcccgctttccagtcgggaaacctgtcgtgccagctgcattaatgaatcggccaacgcgcggggagaggcggtttgcgtattgggcgctcttccgcttcctcgctcactgactcgctgcgctcggtcgttcggctgcggcgagcggtatcagctcactcaaaggcggtaatacggttatccacagaatcaggggataacgcaggaaagaacatgtgagcaaaaggccagcaaaaggccaggaaccgtaaaaaggccgcgttgctggcgtttttccataggctccgcccccctgacgagcatcacaaaaatcgacgctcaagtcagaggtggcgaaacccgacaggactataaagataccaggcgtttccccctggaagctccctcgtgcgctctcctgttccgaccctgccgcttaccggatacctgtccgcctttctcccttcgggaagcgtggcgctttctcatagctcacgctgtaggtatctcagttcggtgtaggtcgttcgctccaagctgggctgtgtgcacgaaccccccgttcagcccgaccgctgcgccttatccggtaactatcgtcttgagtccaacccggtaagacacgacttatcgccactggcagcagccactggtaacaggattagcagagcgaggtatgtaggcggtgctacagagttcttgaagtggtggcctaactacggctacactagaagaacagtatttggtatctgcgctctgctgaagccagttaccttcggaaaaagagttggtagctcttgatccggcaaacaaaccaccgctggtagcggtggtttttttgtttgcaagcagcagattacgcgcagaaaaaaaggatctcaagaagatcctttgatcttttctacggggtctgacgctcagtggaacgaaaactcacgttaagggattttggtcatgagattatcaaaaaggatcttcacctagatccttttaaattaaaaatgaagttttaaatcaatctaaagtatatatgagtaaacttggtctgacagttaccaatgcttaatcagtgaggcacctatctcagcgatctgtctatttcgttcatccatagttgcctgactccccgtcgtgtagataactacgatacgggagggcttaccatctggccccagtgctgcaatgataccgcgagacccacgctcaccggctccagatttatcagcaataaaccagccagccggaagggccgagcgcagaagtggtcctgcaactttatccgcctccatccagtctattaattgttgccgggaagctagagtaagtagttcgccagttaatagtttgcgcaacgttgttgccattgctacaggcatcgtggtgtcacgctcgtcgtttggtatggcttcattcagctccggttcccaacgatcaaggcgagttacatgatcccccatgttgtgcaaaaaagcggttagctccttcggtcctccgatcgttgtcagaagtaagttggccgcagtgttatcactcatggttatggcagcactgcataattctcttactgtcatgccatccgtaagatgcttttctgtgactggtgagtactcaaccaagtcattctgagaatagtgtatgcggcgaccgagttgctcttgcccggcgtcaatacgggataataccgcgccacatagcagaactttaaaagtgctcatcattggaaaacgttcttcggggcgaaaactctcaaggatcttaccgctgttgagatccagttcgatgtaacccactcgtgcacccaactgatcttcagcatcttttactttcaccagcgtttctgggtgagcaaaaacaggaaggcaaaatgccgcaaaaaagggaataagggcgacacggaaatgttgaatactcatactcttcctttttcaatattattgaagcatttatcagggttattgtctcatgagcggatacatatttgaatgtatttagaaaaataaacaaataggggttccgcgcacatttccccgaaaagtgccacctgacgtcgacggatcgggagatctcccgatcccctatggtgcactctcagtacaatctgctctgatgccgcatagttaagccagtatctgctccctgcttgtgtgttggaggtcgctgagtagtgcgcgagcaaaatttaagctacaacaaggcaaggcttgaccgacaattgcatgaagaatctgcttagggttaggcgttttgcgctgcttcgcgatgtacgggccagatatacgcgtt
      plasmid addgene-plasmid-13031-sequence-305137 gacattgattattgactagttattaatagtaatcaattacggggtcattagttcatagcccatatatggagttccgcgttacataacttacggtaaatggcccgcctggctgaccgcccaacgacccccgcccattgacgtcaataatgacgtatgttcccatagtaacgccaatagggactttccattgacgtcaatgggtggagtatttacggtaaactgcccacttggcagtacatcaagtgtatcatatgccaagtacgccccctattgacgtcaatgacggtaaatggcccgcctggcattatgcccagtacatgaccttatgggactttcctacttggcagtacatctacgtattagtcatcgctattaccatggtgatgcggttttggcagtacatcaatgggcgtggatagcggtttgactcacggggatttccaagtctccaccccattgacgtcaatgggagtttgttttggcaccaaaatcaacgggactttccaaaatgtcgtaacaactccgccccattgacgcaaatgggcggtaggcgtgtacggtgggaggtctatataagcagagctctctggctaactagagaacccactgcttactggcttatcgaaattaatacgactcactatagggagacccaagcttggtaccgagctcggatccactagtaacggccgccagtgtgctggaattctgcagatatccatcacactggcggccgctcgagatggtgagcaagggcgaggagctgttcaccggggtggtgcccatcctggtcgagctggacggcgacgtaaacggccacaagttcagcgtgtccggcgagggcgagggcgatgccacctacggcaagctgaccctgaagttcatctgcaccaccggcaagctgcccgtgccctggcccaccctcgtgaccaccctgacctacggcgtgcagtgcttcagccgctaccccgaccacatgaagcagcacgacttcttcaagtccgccatgcccgaaggctacgtccaggagcgcaccatcttcttcaaggacgacggcaactacaagacccgcgccgaggtgaagttcgagggcgacaccctggtgaaccgcatcgagctgaagggcatcgacttcaaggaggacggcaacatcctggggcacaagctggagtacaactacaacagccacaacgtctatatcatggccgacaagcagaagaacggcatcaaggtgaacttcaagatccgccacaacatcgaggacggcagcgtgcagctcgccgaccactaccagcagaacacccccatcggcgacggccccgtgctgctgcccgacaaccactacctgagcacccagtccgccctgagcaaagaccccaacgagaagcgcgatcacatggtcctgctggagttcgtgaccgccgccgggatcactctcggcatggacgagctgtacaagtaatctagagggccctattctatagtgtcacctaaatgctagagctcgctgatcagcctcgactgtgccttctagttgccagccatctgttgtttgcccctcccccgtgccttccttgaccctggaaggtgccactcccactgtcctttcctaataaaatgaggaaattgcatcgcattgtctgagtaggtgtcattctattctggggggtggggtggggcaggacagcaagggggaggattgggaagacaatagcaggcatgctggggatgcggtgggctctatggcttctgaggcggaaagaaccagctggggctctagggggtatccccacgcgccctgtagcggcgcattaagcgcggcgggtgtggtggttacgcgcagcgtgaccgctacacttgccagcgccctagcgcccgctcctttcgctttcttcccttcctttctcgccacgttcgccggctttccccgtcaagctctaaatcgggggctccctttagggttccgatttagtgctttacggcacctcgaccccaaaaaacttgattagggtgatggttcacgtagtgggccatcgccctgatagacggtttttcgccctttgacgttggagtccacgttctttaatagtggactcttgttccaaactggaacaacactcaaccctatctcggtctattcttttgatttataagggattttgccgatttcggcctattggttaaaaaatgagctgatttaacaaaaatttaacgcgaattaattctgtggaatgtgtgtcagttagggtgtggaaagtccccaggctccccagcaggcagaagtatgcaaagcatgcatctcaattagtcagcaaccaggtgtggaaagtccccaggctccccagcaggcagaagtatgcaaagcatgcatctcaattagtcagcaaccatagtcccgcccctaactccgcccatcccgcccctaactccgcccagttccgcccattctccgccccatggctgactaattttttttatttatgcagaggccgaggccgcctctgcctctgagctattccagaagtagtgaggaggcttttttggaggcctaggcttttgcaaaaagctcccgggagcttgtatatccattttcggatctgatcaagagacaggatgaggatcgtttcgcatgattgaacaagatggattgcacgcaggttctccggccgcttgggtggagaggctattcggctatgactgggcacaacagacaatcggctgctctgatgccgccgtgttccggctgtcagcgcaggggcgcccggttctttttgtcaagaccgacctgtccggtgccctgaatgaactgcaggacgaggcagcgcggctatcgtggctggccacgacgggcgttccttgcgcagctgtgctcgacgttgtcactgaagcgggaagggactggctgctattgggcgaagtgccggggcaggatctcctgtcatctcaccttgctcctgccgagaaagtatccatcatggctgatgcaatgcggcggctgcatacgcttgatccggctacctgcccattcgaccaccaagcgaaacatcgcatcgagcgagcacgtactcggatggaagccggtcttgtcgatcaggatgatctggacgaagagcatcaggggctcgcgccagccgaactgttcgccaggctcaaggcgcgcatgcccgacggcgaggatctcgtcgtgacccatggcgatgcctgcttgccgaatatcatggtggaaaatggccgcttttctggattcatcgactgtggccggctgggtgtggcggaccgctatcaggacatagcgttggctacccgtgatattgctgaagagcttggcggcgaatgggctgaccgcttcctcgtgctttacggtatcgccgctcccgattcgcagcgcatcgccttctatcgccttcttgacgagttcttctgagcgggactctggggttcgaaatgaccgaccaagcgacgcccaacctgccatcacgagatttcgattccaccgccgccttctatgaaaggttgggcttcggaatcgttttccgggacgccggctggatgatcctccagcgcggggatctcatgctggagttcttcgcccaccccaacttgtttattgcagcttataatggttacaaataaagcaatagcatcacaaatttcacaaataaagcatttttttcactgcattctagttgtggtttgtccaaactcatcaatgtatcttatcatgtctgtataccgtcgacctctagctagagcttggcgtaatcatggtcatagctgtttcctgtgtgaaattgttatccgctcacaattccacacaacatacgagccggaagcataaagtgtaaagcctggggtgcctaatgagtgagctaactcacattaattgcgttgcgctcactgcccgctttccagtcgggaaacctgtcgtgccagctgcattaatgaatcggccaacgcgcggggagaggcggtttgcgtattgggcgctcttccgcttcctcgctcactgactcgctgcgctcggtcgttcggctgcggcgagcggtatcagctcactcaaaggcggtaatacggttatccacagaatcaggggataacgcaggaaagaacatgtgagcaaaaggccagcaaaaggccaggaaccgtaaaaaggccgcgttgctggcgtttttccataggctccgcccccctgacgagcatcacaaaaatcgacgctcaagtcagaggtggcgaaacccgacaggactataaagataccaggcgtttccccctggaagctccctcgtgcgctctcctgttccgaccctgccgcttaccggatacctgtccgcctttctcccttcgggaagcgtggcgctttctcatagctcacgctgtaggtatctcagttcggtgtaggtcgttcgctccaagctgggctgtgtgcacgaaccccccgttcagcccgaccgctgcgccttatccggtaactatcgtcttgagtccaacccggtaagacacgacttatcgccactggcagcagccactggtaacaggattagcagagcgaggtatgtaggcggtgctacagagttcttgaagtggtggcctaactacggctacactagaagaacagtatttggtatctgcgctctgctgaagccagttaccttcggaaaaagagttggtagctcttgatccggcaaacaaaccaccgctggtagcggtggtttttttgtttgcaagcagcagattacgcgcagaaaaaaaggatctcaagaagatcctttgatcttttctacggggtctgacgctcagtggaacgaaaactcacgttaagggattttggtcatgagattatcaaaaaggatcttcacctagatccttttaaattaaaaatgaagttttaaatcaatctaaagtatatatgagtaaacttggtctgacagttaccaatgcttaatcagtgaggcacctatctcagcgatctgtctatttcgttcatccatagttgcctgactccccgtcgtgtagataactacgatacgggagggcttaccatctggccccagtgctgcaatgataccgcgagacccacgctcaccggctccagatttatcagcaataaaccagccagccggaagggccgagcgcagaagtggtcctgcaactttatccgcctccatccagtctattaattgttgccgggaagctagagtaagtagttcgccagttaatagtttgcgcaacgttgttgccattgctacaggcatcgtggtgtcacgctcgtcgtttggtatggcttcattcagctccggttcccaacgatcaaggcgagttacatgatcccccatgttgtgcaaaaaagcggttagctccttcggtcctccgatcgttgtcagaagtaagttggccgcagtgttatcactcatggttatggcagcactgcataattctcttactgtcatgccatccgtaagatgcttttctgtgactggtgagtactcaaccaagtcattctgagaatagtgtatgcggcgaccgagttgctcttgcccggcgtcaatacgggataataccgcgccacatagcagaactttaaaagtgctcatcattggaaaacgttcttcggggcgaaaactctcaaggatcttaccgctgttgagatccagttcgatgtaacccactcgtgcacccaactgatcttcagcatcttttactttcaccagcgtttctgggtgagcaaaaacaggaaggcaaaatgccgcaaaaaagggaataagggcgacacggaaatgttgaatactcatactcttcctttttcaatattattgaagcatttatcagggttattgtctcatgagcggatacatatttgaatgtatttagaaaaataaacaaataggggttccgcgcacatttccccgaaaagtgccacctgacgtcgacggatcgggagatctcccgatcccctatggtgcactctcagtacaatctgctctgatgccgcatagttaagccagtatctgctccctgcttgtgtgttggaggtcgctgagtagtgcgcgagcaaaatttaagctacaacaaggcaaggcttgaccgacaattgcatgaagaatctgcttagggttaggcgttttgcgctgcttcgcgatgtacgggccagatatacgcgtt
      plasmid pET-INS  AGGATAACATGGCCATCATCAAGGAGTTCATGCGCTTCAAGGTGCACATGGAGGGCTCCGTGAACGGCCACGAGTTCGAGATCGAGGGCGAGGGCGAGGGCCGCCCCTACGAGGGCACCCAGACCGCCAAGCTGAAGGTGACCAAGGGTGGCCCCCTGCCCTTCGCCTGGGACATCCTGTCCCCTCAGTTCATGTACGGCTCCAAGGCCTACGTGAAGCACCCCGCCGACATCCCCGACTACTTGAAGCTGTCCTTCCCCGAGGGCTTCAAGTGGGAGCGCGTGATGAACTTCGAGGACGGCGGCGTGGTGACCGTGACCCAGGACTCCTCCTTGCAGGACGGCGAGTTCATCTACAAGGTGAAGCTGCGCGGCACCAACTTCCCCTCCGACGGCCCCGTAATGCAGAAGAAGACCATGGGCTGGGAGGCCTCCTCCGAGCGGATGTACCCCGAGGACGGCGCCCTGAAGGGCGAGATCAAGCAGAGGCTGAAGCTGAAGGACGGCGGCCACTACGACGCTGAGGTCAAGACCACCTACAAGGCCAAGAAGCCCGTGCAGCTGCCCGGCGCCTACAACGTCAACATCAAGTTGGACATCACCTCCCACAACGAGGACTACACCATCGTGGAACAGTACGAACGCGCCGAGGGCCGCCACTCCACCGGCGGCATGGACGAGCTGTACAAGTAACTCGAGCACCACCACCACCACCACTGAGATCCGGCTGCTAACAAAGCCCGAAAGGAAGCTGAGTTGGCTGCTGCCACCGCTGAGCAATAACTAGCATAACCCCTTGGGGCCTCTAAACGGGTCTTGAGGGGTTTTTTGCTGAAAGGAGGAACTATATCCGGATTGGCGAATGGGACGCGCCCTGTAGCGGCGCATTAAGCGCGGCGGGTGTGGTGGTTACGCGCAGCGTGACCGCTACACTTGCCAGCGCCCTAGCGCCCGCTCCTTTCGCTTTCTTCCCTTCCTTTCTCGCCACGTTCGCCGGCTTTCCCCGTCAAGCTCTAAATCGGGGGCTCCCTTTAGGGTTCCGATTTAGTGCTTTACGGCACCTCGACCCCAAAAAACTTGATTAGGGTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGTTTTTCGCCCTTTGACGTTGGAGTCCACGTTCTTTAATAGTGGACTCTTGTTCCAAACTGGAACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTTTAACAAAATATTAACGTTTACAATTTCAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTATCCGCTCATGAATTAATTCTTAGAAAAACTCATCGAGCATCAAATGAAACTGCAATTTATTCATATCAGGATTATCAATACCATATTTTTGAAAAAGCCGTTTCTGTAATGAAGGAGAAAACTCACCGAGGCAGTTCCATAGGATGGCAAGATCCTGGTATCGGTCTGCGATTCCGACTCGTCCAACATCAATACAACCTATTAATTTCCCCTCGTCAAAAATAAGGTTATCAAGTGAGAAATCACCATGAGTGACGACTGAATCCGGTGAGAATGGCAAAAGTTTATGCATTTCTTTCCAGACTTGTTCAACAGGCCAGCCATTACGCTCGTCATCAAAATCACTCGCATCAACCAAACCGTTATTCATTCGTGATTGCGCCTGAGCGAGACGAAATACGCGATCGCTGTTAAAAGGACAATTACAAACAGGAATCGAATGCAACCGGCGCAGGAACACTGCCAGCGCATCAACAATATTTTCACCTGAATCAGGATATTCTTCTAATACCTGGAATGCTGTTTTCCCGGGGATCGCAGTGGTGAGTAACCATGCATCATCAGGAGTACGGATAAAATGCTTGATGGTCGGAAGAGGCATAAATTCCGTCAGCCAGTTTAGTCTGACCATCTCATCTGTAACATCATTGGCAACGCTACCTTTGCCATGTTTCAGAAACAACTCTGGCGCATCGGGCTTCCCATACAATCGATAGATTGTCGCACCTGATTGCCCGACATTATCGCGAGCCCATTTATACCCATATAAATCAGCATCCATGTTGGAATTTAATCGCGGCCTAGAGCAAGACGTTTCCCGTTGAATATGGCTCATAACACCCCTTGTATTACTGTTTATGTAAGCAGACAGTTTTATTGTTCATGACCAAAATCCCTTAACGTGAGTTTTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTCCTTCTAGTGTAGCCGTAGTTAGGCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGAGCGCCTGATGCGGTATTTTCTCCTTACGCATCTGTGCGGTATTTCACACCGCATATATGGTGCACTCTCAGTACAATCTGCTCTGATGCCGCATAGTTAAGCCAGTATACACTCCGCTATCGCTACGTGACTGGGTCATGGCTGCGCCCCGACACCCGCCAACACCCGCTGACGCGCCCTGACGGGCTTGTCTGCTCCCGGCATCCGCTTACAGACAAGCTGTGACCGTCTCCGGGAGCTGCATGTGTCAGAGGTTTTCACCGTCATCACCGAAACGCGCGAGGCAGCTGCGGTAAAGCTCATCAGCGTGGTCGTGAAGCGATTCACAGATGTCTGCCTGTTCATCCGCGTCCAGCTCGTTGAGTTTCTCCAGAAGCGTTAATGTCTGGCTTCTGATAAAGCGGGCCATGTTAAGGGCGGTTTTTTCCTGTTTGGTCACTGATGCCTCCGTGTAAGGGGGATTTCTGTTCATGGGGGTAATGATACCGATGAAACGAGAGAGGATGCTCACGATACGGGTTACTGATGATGAACATGCCCGGTTACTGGAACGTTGTGAGGGTAAACAACTGGCGGTATGGATGCGGCGGGACCAGAGAAAAATCACTCAGGGTCAATGCCAGCGCTTCGTTAATACAGATGTAGGTGTTCCACAGGGTAGCCAGCAGCATCCTGCGATGCAGATCCGGAACATAATGGTGCAGGGCGCTGACTTCCGCGTTTCCAGACTTTACGAAACACGGAAACCGAAGACCATTCATGTTGTTGCTCAGGTCGCAGACGTTTTGCAGCAGCAGTCGCTTCACGTTCGCTCGCGTATCGGTGATTCATTCTGCTAACCAGTAAGGCAACCCCGCCAGCCTAGCCGGGTCCTCAACGACAGGAGCACGATCATGCGCACCCGTGGGGCCGCCATGCCGGCGATAATGGCCTGCTTCTCGCCGAAACGTTTGGTGGCGGGACCAGTGACGAAGGCTTGAGCGAGGGCGTGCAAGATTCCGAATACCGCAAGCGACAGGCCGATCATCGTCGCGCTCCAGCGAAAGCGGTCCTCGCCGAAAATGACCCAGAGCGCTGCCGGCACCTGTCCTACGAGTTGCATGATAAAGAAGACAGTCATAAGTGCGGCGACGATAGTCATGCCCCGCGCCCACCGGAAGGAGCTGACTGGGTTGAAGGCTCTCAAGGGCATCGGTCGAGATCCCGGTGCCTAATGAGTGAGCTAACTTACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCCAGGGTGGTTTTTCTTTTCACCAGTGAGACGGGCAACAGCTGATTGCCCTTCACCGCCTGGCCCTGAGAGAGTTGCAGCAAGCGGTCCACGCTGGTTTGCCCCAGCAGGCGAAAATCCTGTTTGATGGTGGTTAACGGCGGGATATAACATGAGCTGTCTTCGGTATCGTCGTATCCCACTACCGAGATATCCGCACCAACGCGCAGCCCGGACTCGGTAATGGCGCGCATTGCGCCCAGCGCCATCTGATCGTTGGCAACCAGCATCGCAGTGGGAACGATGCCCTCATTCAGCATTTGCATGGTTTGTTGAAAACCGGACATGGCACTCCAGTCGCCTTCCCGTTCCGCTATCGGCTGAATTTGATTGCGAGTGAGATATTTATGCCAGCCAGCCAGACGCAGACGCGCCGAGACAGAACTTAATGGGCCCGCTAACAGCGCGATTTGCTGGTGACCCAATGCGACCAGATGCTCCACGCCCAGTCGCGTACCGTCTTCATGGGAGAAAATAATACTGTTGATGGGTGTCTGGTCAGAGACATCAAGAAATAACGCCGGAACATTAGTGCAGGCAGCTTCCACAGCAATGGCATCCTGGTCATCCAGCGGATAGTTAATGATCAGCCCACTGACGCGTTGCGCGAGAAGATTGTGCACCGCCGCTTTACAGGCTTCGACGCCGCTTCGTTCTACCATCGACACCACCACGCTGGCACCCAGTTGATCGGCGCGAGATTTAATCGCCGCGACAATTTGCGACGGCGCGTGCAGGGCCAGACTGGAGGTGGCAACGCCAATCAGCAACGACTGTTTGCCCGCCAGTTGTTGTGCCACGCGGTTGGGAATGTAATTCAGCTCCGCCATCGCCGCTTCCACTTTTTCCCGCGTTTTCGCAGAAACGTGGCTGGCCTGGTTCACCACGCGGGAAACGGTCTGATAAGAGACACCGGCATACTCTGCGACATCGTATAACGTTACTGGTTTCACATTCACCACCCTGAATTGACTCTCTTCCGGGCGCTATCATGCCATACCGCGAAAGGTTTTGCGCCATTCGATGGTGTCCGGGATCTCGACGCTCTCCCTTATGCGACTCCTGCATTAGGAAGCAGCCCAGTAGTAGGTTGAGGCCGTTGAGCACCGCCGCCGCAAGGAATGGTGCATGCAAGGAGATGGCGCCCAACAGTCCCCCGGCCACGGGGCCTGCCACCATACCCACGCCGAAACAAGCGCTCATGAGCCCGAAGTGGCGAGCCCGATCTTCCCCATCGGTGATGTCGGCGATATAGGCGCCAGCAACCGCACCTGTGGCGCCGGTGATGCCGGCCACGATGCGTCCGGCGTAGAGGATCGAGATCTCGATCCCGCGAAATTAATACGACTCACTATAGGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACCATGGTGAGCAAGGGCGAGG
      plasmid insulin_cdna agccctccaggacaggctgcatcagaagaggccatcaagcagatcactgtccttctgccatggccctgtggatgcgcctcctgcccctgctggcgctgctggccctctggggacctgacccagccgcagcctttgtgaaccaacacctgtgcggctcacacctggtggaagctctctacctagtgtgcggggaacgaggcttcttctacacacccaagacccgccgggaggcagaggacctgcaggtggggcaggtggagctgggcgggggccctggtgcaggcagcctgcagcccttggccctggaggggtccctgcagaagcgtggcattgtggaacaatgctgtaccagcatctgctccctctaccagctggagaactactgcaactagacgcagcccgcaggcagccccccacccgccgcctcctgcaccgagagagatggaataaagcccttgaaccaacaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      plasmid pET28a AGATCTCGATCCCGCGAAATTAATACGACTCACTATAGGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACCATGGGCAGCAGCCATCATCATCATCATCACAGCAGCGGCCTGGTGCCGCGCGGCAGCCATATGGCTAGCATGACTGGTGGACAGCAAATGGGTCGCGGATCCGAATTCGAGCTCCGTCGACAAGCTTGCGGCCGCACTCGAGCACCACCACCACCACCACTGAGATCCGGCTGCTAACAAAGCCCGAAAGGAAGCTGAGTTGGCTGCTGCCACCGCTGAGCAATAACTAGCATAACCCCTTGGGGCCTCTAAACGGGTCTTGAGGGGTTTTTTGCTGAAAGGAGGAACTATATCCGGATTGGCGAATGGGACGCGCCCTGTAGCGGCGCATTAAGCGCGGCGGGTGTGGTGGTTACGCGCAGCGTGACCGCTACACTTGCCAGCGCCCTAGCGCCCGCTCCTTTCGCTTTCTTCCCTTCCTTTCTCGCCACGTTCGCCGGCTTTCCCCGTCAAGCTCTAAATCGGGGGCTCCCTTTAGGGTTCCGATTTAGTGCTTTACGGCACCTCGACCCCAAAAAACTTGATTAGGGTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGTTTTTCGCCCTTTGACGTTGGAGTCCACGTTCTTTAATAGTGGACTCTTGTTCCAAACTGGAACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTTTAACAAAATATTAACGTTTACAATTTCAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTATCCGCTCATGAATTAATTCTTAGAAAAACTCATCGAGCATCAAATGAAACTGCAATTTATTCATATCAGGATTATCAATACCATATTTTTGAAAAAGCCGTTTCTGTAATGAAGGAGAAAACTCACCGAGGCAGTTCCATAGGATGGCAAGATCCTGGTATCGGTCTGCGATTCCGACTCGTCCAACATCAATACAACCTATTAATTTCCCCTCGTCAAAAATAAGGTTATCAAGTGAGAAATCACCATGAGTGACGACTGAATCCGGTGAGAATGGCAAAAGTTTATGCATTTCTTTCCAGACTTGTTCAACAGGCCAGCCATTACGCTCGTCATCAAAATCACTCGCATCAACCAAACCGTTATTCATTCGTGATTGCGCCTGAGCGAGACGAAATACGCGATCGCTGTTAAAAGGACAATTACAAACAGGAATCGAATGCAACCGGCGCAGGAACACTGCCAGCGCATCAACAATATTTTCACCTGAATCAGGATATTCTTCTAATACCTGGAATGCTGTTTTCCCGGGGATCGCAGTGGTGAGTAACCATGCATCATCAGGAGTACGGATAAAATGCTTGATGGTCGGAAGAGGCATAAATTCCGTCAGCCAGTTTAGTCTGACCATCTCATCTGTAACATCATTGGCAACGCTACCTTTGCCATGTTTCAGAAACAACTCTGGCGCATCGGGCTTCCCATACAATCGATAGATTGTCGCACCTGATTGCCCGACATTATCGCGAGCCCATTTATACCCATATAAATCAGCATCCATGTTGGAATTTAATCGCGGCCTAGAGCAAGACGTTTCCCGTTGAATATGGCTCATAACACCCCTTGTATTACTGTTTATGTAAGCAGACAGTTTTATTGTTCATGACCAAAATCCCTTAACGTGAGTTTTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTCCTTCTAGTGTAGCCGTAGTTAGGCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGAGCGCCTGATGCGGTATTTTCTCCTTACGCATCTGTGCGGTATTTCACACCGCATATATGGTGCACTCTCAGTACAATCTGCTCTGATGCCGCATAGTTAAGCCAGTATACACTCCGCTATCGCTACGTGACTGGGTCATGGCTGCGCCCCGACACCCGCCAACACCCGCTGACGCGCCCTGACGGGCTTGTCTGCTCCCGGCATCCGCTTACAGACAAGCTGTGACCGTCTCCGGGAGCTGCATGTGTCAGAGGTTTTCACCGTCATCACCGAAACGCGCGAGGCAGCTGCGGTAAAGCTCATCAGCGTGGTCGTGAAGCGATTCACAGATGTCTGCCTGTTCATCCGCGTCCAGCTCGTTGAGTTTCTCCAGAAGCGTTAATGTCTGGCTTCTGATAAAGCGGGCCATGTTAAGGGCGGTTTTTTCCTGTTTGGTCACTGATGCCTCCGTGTAAGGGGGATTTCTGTTCATGGGGGTAATGATACCGATGAAACGAGAGAGGATGCTCACGATACGGGTTACTGATGATGAACATGCCCGGTTACTGGAACGTTGTGAGGGTAAACAACTGGCGGTATGGATGCGGCGGGACCAGAGAAAAATCACTCAGGGTCAATGCCAGCGCTTCGTTAATACAGATGTAGGTGTTCCACAGGGTAGCCAGCAGCATCCTGCGATGCAGATCCGGAACATAATGGTGCAGGGCGCTGACTTCCGCGTTTCCAGACTTTACGAAACACGGAAACCGAAGACCATTCATGTTGTTGCTCAGGTCGCAGACGTTTTGCAGCAGCAGTCGCTTCACGTTCGCTCGCGTATCGGTGATTCATTCTGCTAACCAGTAAGGCAACCCCGCCAGCCTAGCCGGGTCCTCAACGACAGGAGCACGATCATGCGCACCCGTGGGGCCGCCATGCCGGCGATAATGGCCTGCTTCTCGCCGAAACGTTTGGTGGCGGGACCAGTGACGAAGGCTTGAGCGAGGGCGTGCAAGATTCCGAATACCGCAAGCGACAGGCCGATCATCGTCGCGCTCCAGCGAAAGCGGTCCTCGCCGAAAATGACCCAGAGCGCTGCCGGCACCTGTCCTACGAGTTGCATGATAAAGAAGACAGTCATAAGTGCGGCGACGATAGTCATGCCCCGCGCCCACCGGAAGGAGCTGACTGGGTTGAAGGCTCTCAAGGGCATCGGTCGAGATCCCGGTGCCTAATGAGTGAGCTAACTTACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCCAGGGTGGTTTTTCTTTTCACCAGTGAGACGGGCAACAGCTGATTGCCCTTCACCGCCTGGCCCTGAGAGAGTTGCAGCAAGCGGTCCACGCTGGTTTGCCCCAGCAGGCGAAAATCCTGTTTGATGGTGGTTAACGGCGGGATATAACATGAGCTGTCTTCGGTATCGTCGTATCCCACTACCGAGATATCCGCACCAACGCGCAGCCCGGACTCGGTAATGGCGCGCATTGCGCCCAGCGCCATCTGATCGTTGGCAACCAGCATCGCAGTGGGAACGATGCCCTCATTCAGCATTTGCATGGTTTGTTGAAAACCGGACATGGCACTCCAGTCGCCTTCCCGTTCCGCTATCGGCTGAATTTGATTGCGAGTGAGATATTTATGCCAGCCAGCCAGACGCAGACGCGCCGAGACAGAACTTAATGGGCCCGCTAACAGCGCGATTTGCTGGTGACCCAATGCGACCAGATGCTCCACGCCCAGTCGCGTACCGTCTTCATGGGAGAAAATAATACTGTTGATGGGTGTCTGGTCAGAGACATCAAGAAATAACGCCGGAACATTAGTGCAGGCAGCTTCCACAGCAATGGCATCCTGGTCATCCAGCGGATAGTTAATGATCAGCCCACTGACGCGTTGCGCGAGAAGATTGTGCACCGCCGCTTTACAGGCTTCGACGCCGCTTCGTTCTACCATCGACACCACCACGCTGGCACCCAGTTGATCGGCGCGAGATTTAATCGCCGCGACAATTTGCGACGGCGCGTGCAGGGCCAGACTGGAGGTGGCAACGCCAATCAGCAACGACTGTTTGCCCGCCAGTTGTTGTGCCACGCGGTTGGGAATGTAATTCAGCTCCGCCATCGCCGCTTCCACTTTTTCCCGCGTTTTCGCAGAAACGTGGCTGGCCTGGTTCACCACGCGGGAAACGGTCTGATAAGAGACACCGGCATACTCTGCGACATCGTATAACGTTACTGGTTTCACATTCACCACCCTGAATTGACTCTCTTCCGGGCGCTATCATGCCATACCGCGAAAGGTTTTGCGCCATTCGATGGTGTCCGGGATCTCGACGCTCTCCCTTATGCGACTCCTGCATTAGGAAGCAGCCCAGTAGTAGGTTGAGGCCGTTGAGCACCGCCGCCGCAAGGAATGGTGCATGCAAGGAGATGGCGCCCAACAGTCCCCCGGCCACGGGGCCTGCCACCATACCCACGCCGAAACAAGCGCTCATGAGCCCGAAGTGGCGAGCCCGATCTTCCCCATCGGTGATGTCGGCGATATAGGCGCCAGCAACCGCACCTGTGGCGCCGGTGATGCCGGCCACGATGCGTCCGGCGTAGAGGATCG
      `;

      const cf = C6.parseCF(input + injections);
      // Check for at least one Golden Gate step in cf.steps
      const hasGoldenGate = Array.isArray(cf.steps) && cf.steps.some(step => step.operation?.toLowerCase() === "goldengate");
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

      
      const requiredRegions = [
        { sequence: "ATGGTGAGCAAGGGCGAGGAGCTGTTCACCGGGGTGGTGCCCATCCTGGTCGAGCTGGACGGCGACGTAAACGGCCACAAGTTCAGCGTGTCCGGCGAGGGCGAGGGCGATGCCACCTACGGCAAGCTGACCCTGAAGTTCATCTGCACCACCGGCAAGCTGCCCGTGCCCTGGCCCACCCTCGTGACCACCCTGACCTACGGCGTGCAGTGCTTCAGCCGCTACCCCGACCACATGAAGCAGCACGACTTCTTCAAGTCCGCCATGCCCGAAGGCTACGTCCAGGAGCGCACCATCTTCTTCAAGGACGACGGCAACTACAAGACCCGCGCCGAGGTGAAGTTCGAGGGCGACACCCTGGTGAACCGCATCGAGCTGAAGGGCATCGACTTCAAGGAGGACGGCAACATCCTGGGGCACAAGCTGGAGTACAACTACAACAGCCACAACGTCTATATCATGGCCGACAAGCAGAAGAACGGCATCAAGGTGAACTTCAAGATCCGCCACAACATCGAGGACGGCAGCGTGCAGCTCGCCGACCACTACCAGCAGAACACCCCCATCGGCGACGGCCCCGTGCTGCTGCCCGACAACCACTACCTGAGCNNKCAGTCCGCCCTGAGCAAAGACCCCAACGAGAAGCGCGATCACATGGTCCTGCTGGAGTTCGTGACCGCCGCCGGGATCACTCTCGGCATGGACGAGCTGTACAAGTAA", label: "GFP with NNK at 204" },
        { sequence: "CACTGGCGGCCGCTCGAGATGGTGAGCAAGGGCG", label: "5′ junction: vector–insert" },
        { sequence: "TGTACAAGTAATCTAGAGGGCCCTATTCTATAGTG", label: "3′ junction: insert–vector" },
        { sequence: "ATGATTGAACAAGATGGATTGCACGCAGGTTCTCCGGCCGCTTGGGTGGAGAGGCTATTCGGCTATGACTGGGCACAACAGACAATCGGCTGCTCTGATGCCGCCGTGTTCCGGCTGTCAGCGCAGGGGCGCCCGGTTCTTTTTGTCAAGACCGACCTGTCCGGTGCCCTGAATGAACTGCAGGACGAGGCAGCGCGGCTATCGTGGCTGGCCACGACGGGCGTTCCTTGCGCAGCTGTGCTCGACGTTGTCACTGAAGCGGGAAGGGACTGGCTGCTATTGGGCGAAGTGCCGGGGCAGGATCTCCTGTCATCTCACCTTGCTCCTGCCGAGAAAGTATCCATCATGGCTGATGCAATGCGGCGGCTGCATACGCTTGATCCGGCTACCTGCCCATTCGACCACCAAGCGAAACATCGCATCGAGCGAGCACGTACTCGGATGGAAGCCGGTCTTGTCGATCAGGATGATCTGGACGAAGAGCATCAGGGGCTCGCGCCAGCCGAACTGTTCGCCAGGCTCAAGGCGCGCATGCCCGACGGCGAGGATCTCGTCGTGACCCATGGCGATGCCTGCTTGCCGAATATCATGGTGGAAAATGGCCGCTTTTCTGGATTCATCGACTGTGGCCGGCTGGGTGTGGCGGACCGCTATCAGGACATAGCGTTGGCTACCCGTGATATTGCTGAAGAGCTTGGCGGCGAATGGGCTGACCGCTTCCTCGTGCTTTACGGTATCGCCGCTCCCGATTCGCAGCGCATCGCCTTCTATCGCCTTCTTGACGAGTTCTTCTGA", label: "kanR open reading frame" },
        { sequence: "TTTCCATAGGCTCCGCCCCCCTGACGAGCATCACAAAAATCGACGCTCAAGTCAGAGGTGGCGAAACCCGACAGGACTATAAAGATACCAGGCGTTTCCCCCTGGAAGCTCCCTCGTGCGCTCTCCTGTTCCGACCCTGCCGCTTACCGGATACCTGTCCGCCTTTCTCCCTTCGGGAAGCGTGGCGCTTTCTCATAGCTCACGCTGTAGGTATCTCAGTTCGGTGTAGGTCGTTCGCTCCAAGCTGGGCTGTGTGCACGAACCCCCCGTTCAGCCCGACCGCTGCGCCTTATCCGGTAACTATCGTCTTGAGTCCAACCCGGTAAGACACGACTTATCGCCACTGGCAGCAGCCACTGGTAACAGGATTAGCAGAGCGAGGTATGTAGGCGGTGCTACAGAGTTCTTGAAGTGGTGGCCTAACTACGGCTACACTAGAAGAACAGTATTTGGTATCTGCGCTCTGCTGAAGCCAGTTACCTTCGGAAAAAGAGTTGGTAGCTCTTGATCCGGCAAACAAACCACCGCTGGTAGCGGTGGTTTTTTTGTTTGCAAGCAGCAGATTACGCGCAGAAAAAAAGGATCTCAA", label: "ColE1 origin of replication" }
      ];

      let feedback = [];
      let missing = [];

      requiredRegions.forEach(({ sequence, label }) => {
        if (!searchSpace.includes(sequence)) {
          missing.push(label);
        }
      });

      // Check for Golden Gate step
      if (!hasGoldenGate) {
        missing.push("a Golden Gate step in your Construction File");
      }

      if (missing.length === 0) {
        feedback.push("✅ Success! Your design contains all expected sequence features.");
        if (typeof window.progressManager !== "undefined") {
          window.progressManager.addCompletion("Mutagenesis", "correct");
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
