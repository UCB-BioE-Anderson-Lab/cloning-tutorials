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
*Figure: T7 system architecture in BL21(DE3) with a pET plasmid driving target gene expression.*

T7 expression vectors use a powerful phage promoter (T7) that is only recognized by T7 RNA polymerase. In strains like BL21(DE3), the gene for T7 RNA polymerase is integrated into the genome under control of the lac promoter.

When IPTG is added:

- T7 polymerase is expressed.
- It recognizes the T7 promoter on your plasmid.
- This drives massive transcription of your gene.

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
*Figure: pET-28a(+) vector map showing the T7 promoter and the multiple cloning site (MCS). In this tutorial, we’ll insert the insulin cDNA between the **NcoI** and **XhoI** restriction sites for expression under the T7 promoter. Image adapted from [GenScript](https://www.genscript.com/gsfiles/vector-map/bacteria/pET-28a.pdf).*

---

## Step 3: Design PCR Primers

Design primers with:

- A short 5′ tail (~4–6 nt)  
- A restriction site (NcoI at start, XhoI at end)  
- 18–22 bp annealing region from insulin cDNA

**Primer Structure Example:**
```
Forward primer (ins-F):
  aaaaCATATG[18–22 nt from start of insulin ORF]

Reverse primer (ins-R):
  ttttCTCGAG[reverse complement of final 18–22 nt of insulin ORF]
```

- CCATGG = NcoI site (includes ATG)
- CTCGAG = XhoI site (downstream of stop codon)

---

## Step 4: Predict the PCR Product

Use your sequence editor or notes to:

1. Find annealing regions in the insulin cDNA.
2. Replace them with the full primers.
3. Trim any unnecessary flanking sequence.
4. Save your predicted PCR product.

---

## Step 5: Construction File

Here's a complete construction file representing this cloning plan:

```
PCR     ins-F       ins-R       insulin_cDNA     pcr_ins
Digest  pcr_ins     NcoI,XhoI   1                pcr_dig
Digest  pET28a      NcoI,XhoI   1                vec_dig
Ligate  pcr_dig     vec_dig                      pET-INS

oligo   ins-F       ccataCCATGG[18–22 bp]
oligo   ins-R       cagatCTCGAG[reverse complement of 18–22 bp]
dsdna   insulin_cDNA ...
plasmid pET28a ...
```

---

## Step 6: Visualize the Final Product

- 📄 Final pET-insulin plasmid: [Download GenBank](../assets/pET-insulin.gb)

[Insert SeqViz plot with features: T7 promoter, lacI, His-tag (if any), insulin, terminator, etc.]

---

## Step 7: Validate

- ORF is left-to-right and starts with ATG  
- ORF is in-frame with tags (if any)  
- No internal NdeI or XhoI sites in insert  
- Final construct includes all expected features

---

## Quiz

Design primers and a construction file to clone the **human growth hormone (hGH)** cDNA into the same pET vector using NdeI and XhoI.

- Primer sequences  
- Construction file  
- 🔗 [NCBI: NM_000515.4](https://www.ncbi.nlm.nih.gov/nuccore/NM_000515.4)
