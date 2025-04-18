<script src="https://unpkg.com/seqviz"></script>
<script src="../js/progress_manager.js"></script>
# Basic Cloning: Overexpression of Human Insulin

## Overview

In this tutorial, you'll learn to design oligonucleotides and plan a traditional restriction/ligation cloning experiment. We'll walk through cloning the human insulin cDNA into a pET expression vector for high-level expression in *E. coli*. This process mimics a landmark achievement in biotechnology: the recombinant production of human insulin, which today powers a multi-billion-dollar global industry.

Insulin was the first therapeutic protein produced using recombinant DNA technology, replacing animal-derived sources and transforming diabetes care. In this example, you’ll see how tools like PCR, restriction enzymes, and plasmid vectors can be used to enable scalable, microbial production of life-saving medicines.

---

## Context: Recombinant Insulin Production

![Evolution of insulin production: from cow pancreas to recombinant E. coli](../images/insulin_evolution.png)  
*Figure: Before 1982, insulin was extracted from thousands of pig or cow pancreases, yielding limited supply and often triggering immune reactions. Recombinant DNA technology enabled the production of human insulin in *E. coli*, launching a biotechnology revolution. Today, recombinant insulin is a multi-billion-dollar industry and one of the earliest and most successful applications of genetic engineering.*

In this exercise, we’ll simulate how to clone the human insulin CDS from **cDNA**, which is DNA that has been synthesized *in vitro* by reacting mRNA (purified from human cells) with reverse transcriptase. We'll insert it into a pET expression plasmid to produce insulin recombinantly.

---

## The T7 System

![T7 expression system](../images/t7_expression_diagram.png)  
*Figure: T7 system architecture in BL21(λDE3). IPTG induction lifts LacI repression, allowing expression of both T7 RNA Polymerase (genomically encoded) and the insulin (INS) gene on a pET plasmid under the control of the T7 promoter.*

The **T7 expression system** is a two-level inducible design used for powerful, tightly regulated expression of recombinant proteins in *E. coli* BL21(λDE3).

Here's how it works:

- The BL21(λDE3) genome contains a copy of the **T7 RNA polymerase (T7 RNAP)** gene under control of the **lac promoter** (*Plac*).
- The **pET expression plasmid** carries your gene of interest (e.g., **INS**) downstream of a **T7 promoter** (*PT7*), as well as a **lacI** gene that represses both promoters via **LacO** operator sites.

### Role of IPTG:

In the absence of IPTG:
- The **LacI repressor** binds to LacO sites, preventing transcription from both *Plac* and *PT7*.
- This keeps both **T7 RNAP** and the **target gene** (INS) silent.

Upon IPTG addition:
- IPTG binds to LacI, causing it to dissociate from the DNA.
- **T7 RNAP** is transcribed and translated.
- T7 RNAP then binds to *PT7* on the plasmid and drives high-level expression of the insulin gene.

This modular setup ensures **tight control** (low background, high on-demand expression), which is ideal for producing proteins that may be toxic or burden the host.

---


### 🎥 Watch: Designing and Planning the pET-INS Cloning

Here’s a short video walking through the cloning plan and design of oligos using Ape:

<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>

---


## Step 1: Choose a Template

We'll use a GenBank record for human insulin cDNA:

- 📄 Insulin cDNA: [Download GenBank](../assets/insulin_cds.gb)  
- 🔗 [NCBI: BC005255.1](https://www.ncbi.nlm.nih.gov/nuccore/BC005255.1)

---

## Step 2: Choose a Vector

We'll use a pET vector with:

- T7 promoter  
- LacI repression system  
- Multiple cloning site (MCS)

- 📄 Starter pET plasmid: [Download GenBank](../assets/pET28a.gb)

![Annotated map of pET-28a(+) vector highlighting T7 promoter, NcoI and XhoI sites](../images/pet28a_cloning_map.png)  
*Figure: pET-28a(+) vector map showing the T7 promoter and the multiple cloning site (MCS). In this tutorial, we’ll insert the insulin CDS between the **NcoI** and **XhoI** restriction sites for expression under the T7 promoter. Image adapted from [GenScript](https://www.genscript.com/gsfiles/vector-map/bacteria/pET-28a.pdf).*

---

## Step 3: Design PCR Primers

---

## Visualizing the Cloning Workflow

Before we look at the construction file, let's walk through what's actually happening in this cloning strategy.

The diagram below illustrates how we use PCR, restriction digestion, and ligation to move the insulin coding sequence (INS) into the pET-28a(+) expression plasmid.

![Diagram showing PCR of insulin cDNA, restriction digestion with NcoI and XhoI, and ligation of the PCR product into pET-28a(+) to create pET-INS](../images/pET-INS_NcoI_construction.png)
*Figure: Cartoon schematic of the pET-INS construction. Each component in the image matches a step in the construction file you'll write next: PCR of the insulin gene, digestion with NcoI/XhoI, and ligation into the pET-28a(+) vector.*

### 🎥 Watch: Walkthrough of the Cloning Plan + Oligo Design in APE

In this short video, we sketch the cloning steps and then walk through how to design the oligos using Ape:

<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" title="Drawing out pET-INS cloning and designing oligos in Ape" frameborder="0" allowfullscreen></iframe>

---

Design primers with:

- A short 5′ tail (5 random bases)  
- A restriction site (NcoI at start, XhoI at end)  
- 18–22 bp annealing region from insulin cDNA

**Primer Structure Example:**
```
Forward primer (ins-F):

  [5' tail] - CCATGG - [18–22 nt from start of insulin ORF]

Reverse primer (ins-R):

  [5' tail] - CTCGAG - [reverse complement of final 18–22 nt of insulin ORF]
```

- CCATGG = NcoI site (includes ATG start codon)
- CTCGAG = XhoI site (downstream of stop codon)

---

## Step 4: Construction File

Here's a complete construction file representing this cloning plan:

```
PCR     ins-F       ins-R       insulin_cDNA     pcr_ins
Digest  pcr_ins     NcoI,XhoI   1                pcr_dig
Digest  pET28a      NcoI,XhoI   1                vec_dig
Ligate  pcr_dig     vec_dig                      pET-INS

oligo   ins-F       ccataCCATGGccctgtggatgcgcctcctg
oligo   ins-R       cagatCTCGAGctagttgcagtagttctccag
```

## Step 5: Simulate the Product

Use your sequence editor or simulation tools (as demonstrated in the earlier video) to predict the outcome of each step in your construction file. For each stage—PCR, digestion, and ligation—verify the resulting sequence.

Pay special attention to the final ligated product:
- Confirm the insert is placed between the NcoI and XhoI sites.
- Ensure the reading frame is preserved.
- Check that the final sequence starts with ATG and ends appropriately.

Once verified, save the final predicted sequence for downstream use or visualization.

---

## Step 6: Visualize the Final Product

- 📄 Final pET-insulin plasmid: [Download GenBank](../assets/pET-INS.seq)

**Product Visualization:**

<div id="viewer1"></div>
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
        name: "pET-INS",
        seq: "AGATCTCGATCCCGCGAAATTAATACGACTCACTATAGGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACCATGGccctgtggatgcgcctcctgcccctgctggcgctgctggccctctggggacctgacccagccgcagcctttgtgaaccaacacctgtgcggctcacacctggtggaagctctctacctagtgtgcggggaacgaggcttcttctacacacccaagacccgccgggaggcagaggacctgcaggtggggcaggtggagctgggcgggggccctggtgcaggcagcctgcagcccttggccctggaggggtccctgcagaagcgtggcattgtggaacaatgctgtaccagcatctgctccctctaccagctggagaactactgcaactagCTCGAGCACCACCACCACCACCACTGAGATCCGGCTGCTAACAAAGCCCGAAAGGAAGCTGAGTTGGCTGCTGCCACCGCTGAGCAATAACTAGCATAACCCCTTGGGGCCTCTAAACGGGTCTTGAGGGGTTTTTTGCTGAAAGGAGGAACTATATCCGGATTGGCGAATGGGACGCGCCCTGTAGCGGCGCATTAAGCGCGGCGGGTGTGGTGGTTACGCGCAGCGTGACCGCTACACTTGCCAGCGCCCTAGCGCCCGCTCCTTTCGCTTTCTTCCCTTCCTTTCTCGCCACGTTCGCCGGCTTTCCCCGTCAAGCTCTAAATCGGGGGCTCCCTTTAGGGTTCCGATTTAGTGCTTTACGGCACCTCGACCCCAAAAAACTTGATTAGGGTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGTTTTTCGCCCTTTGACGTTGGAGTCCACGTTCTTTAATAGTGGACTCTTGTTCCAAACTGGAACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTTTAACAAAATATTAACGTTTACAATTTCAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTATCCGCTCATGAATTAATTCTTAGAAAAACTCATCGAGCATCAAATGAAACTGCAATTTATTCATATCAGGATTATCAATACCATATTTTTGAAAAAGCCGTTTCTGTAATGAAGGAGAAAACTCACCGAGGCAGTTCCATAGGATGGCAAGATCCTGGTATCGGTCTGCGATTCCGACTCGTCCAACATCAATACAACCTATTAATTTCCCCTCGTCAAAAATAAGGTTATCAAGTGAGAAATCACCATGAGTGACGACTGAATCCGGTGAGAATGGCAAAAGTTTATGCATTTCTTTCCAGACTTGTTCAACAGGCCAGCCATTACGCTCGTCATCAAAATCACTCGCATCAACCAAACCGTTATTCATTCGTGATTGCGCCTGAGCGAGACGAAATACGCGATCGCTGTTAAAAGGACAATTACAAACAGGAATCGAATGCAACCGGCGCAGGAACACTGCCAGCGCATCAACAATATTTTCACCTGAATCAGGATATTCTTCTAATACCTGGAATGCTGTTTTCCCGGGGATCGCAGTGGTGAGTAACCATGCATCATCAGGAGTACGGATAAAATGCTTGATGGTCGGAAGAGGCATAAATTCCGTCAGCCAGTTTAGTCTGACCATCTCATCTGTAACATCATTGGCAACGCTACCTTTGCCATGTTTCAGAAACAACTCTGGCGCATCGGGCTTCCCATACAATCGATAGATTGTCGCACCTGATTGCCCGACATTATCGCGAGCCCATTTATACCCATATAAATCAGCATCCATGTTGGAATTTAATCGCGGCCTAGAGCAAGACGTTTCCCGTTGAATATGGCTCATAACACCCCTTGTATTACTGTTTATGTAAGCAGACAGTTTTATTGTTCATGACCAAAATCCCTTAACGTGAGTTTTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTCCTTCTAGTGTAGCCGTAGTTAGGCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGAGCGCCTGATGCGGTATTTTCTCCTTACGCATCTGTGCGGTATTTCACACCGCATATATGGTGCACTCTCAGTACAATCTGCTCTGATGCCGCATAGTTAAGCCAGTATACACTCCGCTATCGCTACGTGACTGGGTCATGGCTGCGCCCCGACACCCGCCAACACCCGCTGACGCGCCCTGACGGGCTTGTCTGCTCCCGGCATCCGCTTACAGACAAGCTGTGACCGTCTCCGGGAGCTGCATGTGTCAGAGGTTTTCACCGTCATCACCGAAACGCGCGAGGCAGCTGCGGTAAAGCTCATCAGCGTGGTCGTGAAGCGATTCACAGATGTCTGCCTGTTCATCCGCGTCCAGCTCGTTGAGTTTCTCCAGAAGCGTTAATGTCTGGCTTCTGATAAAGCGGGCCATGTTAAGGGCGGTTTTTTCCTGTTTGGTCACTGATGCCTCCGTGTAAGGGGGATTTCTGTTCATGGGGGTAATGATACCGATGAAACGAGAGAGGATGCTCACGATACGGGTTACTGATGATGAACATGCCCGGTTACTGGAACGTTGTGAGGGTAAACAACTGGCGGTATGGATGCGGCGGGACCAGAGAAAAATCACTCAGGGTCAATGCCAGCGCTTCGTTAATACAGATGTAGGTGTTCCACAGGGTAGCCAGCAGCATCCTGCGATGCAGATCCGGAACATAATGGTGCAGGGCGCTGACTTCCGCGTTTCCAGACTTTACGAAACACGGAAACCGAAGACCATTCATGTTGTTGCTCAGGTCGCAGACGTTTTGCAGCAGCAGTCGCTTCACGTTCGCTCGCGTATCGGTGATTCATTCTGCTAACCAGTAAGGCAACCCCGCCAGCCTAGCCGGGTCCTCAACGACAGGAGCACGATCATGCGCACCCGTGGGGCCGCCATGCCGGCGATAATGGCCTGCTTCTCGCCGAAACGTTTGGTGGCGGGACCAGTGACGAAGGCTTGAGCGAGGGCGTGCAAGATTCCGAATACCGCAAGCGACAGGCCGATCATCGTCGCGCTCCAGCGAAAGCGGTCCTCGCCGAAAATGACCCAGAGCGCTGCCGGCACCTGTCCTACGAGTTGCATGATAAAGAAGACAGTCATAAGTGCGGCGACGATAGTCATGCCCCGCGCCCACCGGAAGGAGCTGACTGGGTTGAAGGCTCTCAAGGGCATCGGTCGAGATCCCGGTGCCTAATGAGTGAGCTAACTTACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCCAGGGTGGTTTTTCTTTTCACCAGTGAGACGGGCAACAGCTGATTGCCCTTCACCGCCTGGCCCTGAGAGAGTTGCAGCAAGCGGTCCACGCTGGTTTGCCCCAGCAGGCGAAAATCCTGTTTGATGGTGGTTAACGGCGGGATATAACATGAGCTGTCTTCGGTATCGTCGTATCCCACTACCGAGATATCCGCACCAACGCGCAGCCCGGACTCGGTAATGGCGCGCATTGCGCCCAGCGCCATCTGATCGTTGGCAACCAGCATCGCAGTGGGAACGATGCCCTCATTCAGCATTTGCATGGTTTGTTGAAAACCGGACATGGCACTCCAGTCGCCTTCCCGTTCCGCTATCGGCTGAATTTGATTGCGAGTGAGATATTTATGCCAGCCAGCCAGACGCAGACGCGCCGAGACAGAACTTAATGGGCCCGCTAACAGCGCGATTTGCTGGTGACCCAATGCGACCAGATGCTCCACGCCCAGTCGCGTACCGTCTTCATGGGAGAAAATAATACTGTTGATGGGTGTCTGGTCAGAGACATCAAGAAATAACGCCGGAACATTAGTGCAGGCAGCTTCCACAGCAATGGCATCCTGGTCATCCAGCGGATAGTTAATGATCAGCCCACTGACGCGTTGCGCGAGAAGATTGTGCACCGCCGCTTTACAGGCTTCGACGCCGCTTCGTTCTACCATCGACACCACCACGCTGGCACCCAGTTGATCGGCGCGAGATTTAATCGCCGCGACAATTTGCGACGGCGCGTGCAGGGCCAGACTGGAGGTGGCAACGCCAATCAGCAACGACTGTTTGCCCGCCAGTTGTTGTGCCACGCGGTTGGGAATGTAATTCAGCTCCGCCATCGCCGCTTCCACTTTTTCCCGCGTTTTCGCAGAAACGTGGCTGGCCTGGTTCACCACGCGGGAAACGGTCTGATAAGAGACACCGGCATACTCTGCGACATCGTATAACGTTACTGGTTTCACATTCACCACCCTGAATTGACTCTCTTCCGGGCGCTATCATGCCATACCGCGAAAGGTTTTGCGCCATTCGATGGTGTCCGGGATCTCGACGCTCTCCCTTATGCGACTCCTGCATTAGGAAGCAGCCCAGTAGTAGGTTGAGGCCGTTGAGCACCGCCGCCGCAAGGAATGGTGCATGCAAGGAGATGGCGCCCAACAGTCCCCCGGCCACGGGGCCTGCCACCATACCCACGCCGAAACAAGCGCTCATGAGCCCGAAGTGGCGAGCCCGATCTTCCCCATCGGTGATGTCGGCGATATAGGCGCCAGCAACCGCACCTGTGGCGCCGGTGATGCCGGCCACGATGCGTCCGGCGTAGAGGATCG",
        annotations: [
          { name: "T7 Promoter", start: 20, end: 40, color: "RosyBrown", direction: 1 },
          { name: "NcoI", start: 105, end: 111, color: "#ff40ff", direction: -1 },
          { name: "INS (insulin CDS)", start: 107, end: 440, color: "#e9cf24", direction: 1 },
          { name: "XhoI", start: 440, end: 446, color: "#ff40ff", direction: 1 },
          { name: "6xHis", start: 446, end: 464, color: "#cc99b2", direction: 1 },
          { name: "T7 terminator", start: 530, end: 578, color: "#bbbbbb", direction: -1 },
          { name: "lacI", start: 4117, end: 5200, color: "#993366", direction: -1 },
          { name: "kanR", start: 1162, end: 1978, color: "#ccffcc", direction: -1 },
          { name: "pMB1 ori", start: 2256, end: 2628, color: "grey", direction: -1 }
        ],
        translations: [{ start: 107, end: 440, direction: 1, name: "Insulin", color: "#e9cf24" }],
        viewer: "both",
        showComplement: true,
        showIndex: true,
        showAnnotations: true,
        showPrimers: false,
        showLabels: true,
        circular: true,
        zoom: { linear: 80 },
        style: { height: "400px", width: "100%" }
      })
      .render();
  });
</script>

---

## Step 7: Validate

- ORF is left-to-right and starts with ATG  
- ORF is in-frame with tags (if any)  
- No internal NdeI or XhoI sites in insert  
- Final construct includes all expected features

---
## Try it yourself

For your quiz, you will clone the **Cas9 gene** from *Streptococcus pyogenes*.  

Cas9 is an essential tool in modern genetic engineering. It’s an RNA-guided DNA endonuclease that, when paired with a specific guide RNA (gRNA), can cut double-stranded DNA at targeted sites. This system forms the core of CRISPR-Cas9 genome editing—a revolutionary method that allows researchers to precisely modify genomes across almost any organism. Cas9 itself is the protein "scissors" of this toolkit.

In this activity, you'll clone the Cas9 gene from its native **genomic DNA**, not from a cDNA template. This means we need to extract the correct region from the organism’s genome. We've already found the genome for *Streptococcus pyogenes* and identified the coordinates for the **Cas9 coding sequence**.

You’ll design primers and identify the PCR step needed to insert Cas9 into the **pET-28a(+) expression vector** using the **NcoI** and **XhoI** restriction sites—just as you did in the insulin example. The rest of the construction file will be auto-filled for you once you provide the correct primers and PCR parameters.

Use the Cas9 sequence from *S. pyogenes*, located at coordinates **796769–800875** on GenBank record **CP151446.1**:  
🔗 [NCBI: CP151446.1](https://www.ncbi.nlm.nih.gov/nucleotide/CP151446.1?report=genbank&log$=nuclalign&blast_rank=1&RID=ZE7Y60E5013&from=796769&to=800875)

---

<h3>Cas9 Cloning Quiz</h3>
<p>Design primers to amplify Cas9 from genomic DNA and clone it into pET-28a using NcoI and XhoI.</p>

<form id="quizForm">
  <label><strong>Forward Primer:</strong></label><br>
  Name: <input type="text" id="fwdName" value="cas9-F">
  Sequence: <input type="text" id="fwdPrimer" size="60"><br><br>

  <label><strong>Reverse Primer:</strong></label><br>
  Name: <input type="text" id="revName" value="cas9-R">
  Sequence: <input type="text" id="revPrimer" size="60"><br><br>

  <label><strong>PCR Product Name:</strong></label><br>
  <input type="text" id="pcrProduct" value="pcr_cas9"><br><br>

  <input type="button" value="Check & Generate Construction File" onclick="runQuiz()">
</form>

<div id="feedback" style="margin-top: 1em; font-weight: bold;"></div>

<h4>Construction File:</h4>
<textarea id="cfTextArea" rows="8" style="width: 100%;" readonly></textarea><br>
<button id="copyBtn" onclick="copyCF()">Copy to Clipboard</button>

<script>
function runQuiz() {
  const fwdSeq = document.getElementById("fwdPrimer").value.trim().replace(/[\s0-9]/g, '');
  const revSeq = document.getElementById("revPrimer").value.trim().replace(/[\s0-9]/g, '');
  const fwdName = document.getElementById("fwdName").value.trim();
  const revName = document.getElementById("revName").value.trim();
  const product = document.getElementById("pcrProduct").value.trim();
  const template = "cas9_genomic";
  const upperFwd = fwdSeq.toUpperCase();
  const upperRev = revSeq.toUpperCase();

  let feedback = "";
  let pass = true;

  // Validate restriction site presence and spacing
  if (upperFwd.indexOf("CCATGG") < 5) {
    feedback += "⚠️ Forward primer must have at least 5 bases before NcoI (CCATGG)<br>";
    pass = false;
  }
  if (upperRev.indexOf("CTCGAG") < 5) {
    feedback += "⚠️ Reverse primer must have at least 5 bases before XhoI (CTCGAG)<br>";
    pass = false;
  }

  // Validate annealing regions
  const fwdTarget = "ATGGATAAGAAATACTCAATAGGCTTAG";
  const revTarget = "TCAGTCACCTCCTAGCTGACTCAAATCAATGC";

  const fMatch = upperFwd.match(new RegExp(`(${fwdTarget})$`)) || fwdTarget.includes(upperFwd.slice(-18));
  const rMatch = upperRev.match(new RegExp(`(${revTarget})$`)) || revTarget.includes(upperRev.slice(-18));

  if (!fMatch) {
    feedback += "⚠️ 3′ end of forward primer doesn't match expected target sequence<br>";
    pass = false;
  }
  if (!rMatch) {
    feedback += "⚠️ 3′ end of reverse primer doesn't match expected target sequence<br>";
    pass = false;
  }

  const pad = (str, len) => str + ' '.repeat(len - str.length);

  // Construction steps — aligned based on column widths
  const stepRows = [
    ["PCR", fwdName, revName, template, product],
    ["Digest", product, "NcoI,XhoI", "1", "pcr_dig"],
    ["Digest", "pET28a", "NcoI,XhoI", "1", "vec_dig"],
    ["Ligate", "pcr_dig", "vec_dig", "", "pET-Cas9"]
  ];

  // Oligos — align just name column (sequence left free-form)
  const oligoRows = [
    ["oligo", fwdName, fwdSeq],
    ["oligo", revName, revSeq]
  ];

  // Calculate column widths for steps
  const stepColWidths = [];
  stepRows.forEach(row => {
    row.forEach((cell, i) => {
      stepColWidths[i] = Math.max(stepColWidths[i] || 0, cell.length);
    });
  });

  // Format steps
  const formattedSteps = stepRows.map(row =>
    row.map((cell, i) => pad(cell, stepColWidths[i])).join("  ")
  ).join("\n");

  // Format oligos
  const oligoNameWidth = Math.max(fwdName.length, revName.length);
  const formattedOligos = oligoRows.map(row =>
    pad("oligo", 6) + pad(row[1], oligoNameWidth) + "  " + row[2]
  ).join("\n");

  // Combine both
  const formatted = `${formattedSteps}\n\n${formattedOligos}`;
  document.getElementById("cfTextArea").value = formatted;
  if (pass) {
    document.getElementById("feedback").innerHTML = "✅ Primers look valid!";
    progressManager.addCompletion("Cas9 Cloning", "correct");
  } else {
    document.getElementById("feedback").innerHTML = feedback;
  }
}

function copyCF() {
  const textarea = document.getElementById("cfTextArea");
  textarea.select();
  document.execCommand("copy");
  const btn = document.getElementById("copyBtn");
  const original = btn.innerText;
  btn.innerText = "✅ Copied!";
  btn.disabled = true;
  setTimeout(() => {
    btn.innerText = original;
    btn.disabled = false;
  }, 2000);
}
</script>