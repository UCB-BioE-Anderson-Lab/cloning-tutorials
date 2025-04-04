# Basic Cloning: Cloning *lacZ* into a pET Vector

## Overview
In this tutorial, you'll learn to design oligonucleotides and plan a traditional restriction/ligation cloning experiment. We'll walk through cloning the *lacZ* gene (β-galactosidase) from the *E. coli* genome into a pET expression vector for high-level expression.

---

## Context: Cloning for Lactose Breakdown
![Lactose breakdown by β-galactosidase](../images/lacZ_lactaid_diagram.png)
*Figure: β-galactosidase cleaves lactose into glucose and galactose, as used in products like Lactaid.*
Suppose you're engineering bacteria to help break down lactose in dairy products. The *lacZ* gene encodes β-galactosidase, which cleaves lactose into glucose and galactose. While *E. coli* naturally carries this gene, it’s only expressed at low levels under the lac operon. To produce it industrially, you’d want much higher expression.

We’ll use a T7-based expression system to overexpress *lacZ*, boosting output by orders of magnitude.

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
We'll clone *lacZ* directly from the *E. coli* genome. You can download the annotated GenBank region here:

- 📄 *lacZ* genome context: [Download GenBank](../assets/lacZ_genome_context.gb)
- 🔗 NCBI GenBank: [E. coli lacZ gene (U00096.3: 3654547–3657307)](https://www.ncbi.nlm.nih.gov/nuccore/U00096.3?report=genbank&from=3654547&to=3657307)

---

## Step 2: Choose a Vector
We'll use a pET vector with:
- T7 promoter
- LacI repression system
- Multiple cloning site (MCS)

- 📄 Starter pET plasmid: [Download GenBank](../assets/pET28a.gb)

[Insert figure: Annotated map of pET vector]

---

[todo:  '''add a section explaining this as a 'part' like system, where whatever you want to express in this plasmid is the 'part', and it should be flanked on the 5' end by an ndei or ncoi restriction site overlapping the start codon.  That allows you to position the ORF with the exact correct spacing to the rbs, and on the other end you pick one of these other polylinker restriction sites.'''
the reason for doing this is to seed the idea of 'parts' which we will revisit later in the context of biobricks, moclo, and tp.rc  ]

## Step 3: Design PCR Primers
Design primers with:
- A short 5′ tail (~4–6 nt) to avoid enzymes cleaving directly on ends of the dna
- A restriction site (NdeI at the start, XhoI at the end)
- 18–22 bp annealing region from the *lacZ* gene
**Tips for designing annealing regions:**
- Use 18–22 bases that exactly match your target sequence.
- Aim for 40–60% GC content.
- Avoid long runs of a single nucleotide (e.g., AAAA).
- Place a G or C at the 3' end for stronger binding ("GC clamp").
- Avoid sequences with strong secondary structures or internal complementarity.
  
### Example:
```
Forward primer (lacZ-F):
  aaaaCATATG[18–22 nt from start of lacZ coding sequence]

Reverse primer (lacZ-R):
  ttttCTCGAG[reverse complement of final 18–22 nt of lacZ ORF]
```

- CATATG = NdeI site (includes ATG start codon)
- CTCGAG = XhoI site (downstream of stop codon)

[Insert cartoon: visualizing primer structure]

---

## Step 4: Predict the PCR Product
Use a sequence editor to:
1. Locate the primer annealing regions in the *lacZ* genomic DNA.
2. Replace the native regions with your full oligo sequences.
3. Remove upstream/downstream context.
4. Save the predicted PCR product.

---

## Step 5: Construction File

Here is the complete construction file for the cloning experiment:

```
PCR     lacZ-F       lacZ-R     Ecoli_genome     pcr_lacZ
Digest  pcr_lacZ     NdeI,XhoI  1                pcr_dig
Digest  pet_vector   NdeI,XhoI  1                vec_dig
Ligate  pcr_dig      vec_dig                     pet_lacZ

oligo   lacZ-F       aaaaCATATG[18–22 bp]
oligo   lacZ-R       ttttCTCGAG[reverse complement of 18–22 bp]
dsdna   Ecoli_genome ...
plasmid pet_vector ...
```

---

## Step 6: Visualize the Final Product

- 📄 Final pET-lacZ plasmid: [Download GenBank](../assets/pET-lacZ.gb)

[Insert SeqViz plot of final annotated plasmid with features: T7 promoter, lacI, His-tag (if any), *lacZ*, terminator, etc.]

---

## Step 7: Validate

Check:

- The orientation of your ORF is left to right starting with ATG and ending in TAA
- The gene is in-frame with any tags.
- Restriction sites are unique and cut only once.
- The final plasmid sequence includes all expected features.

---

## Quiz

Design primers and a construction file to clone the *groEL* gene from *E. coli* into the same pET vector using NdeI and XhoI. Provide:
- Primer sequences
- Construction file steps
- 🔗 NCBI GenBank: [E. coli groEL gene (U00096.3: 281583–283185)](https://www.ncbi.nlm.nih.gov/nuccore/U00096.3?report=genbank&from=281583&to=283185)
