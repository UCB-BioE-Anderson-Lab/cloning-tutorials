# Choosing a Fabrication Strategy

Once you've finalized your RC part design (e.g., RBS.CDS), it's time to decide how you'll turn that design into actual DNA. This section walks you through the decision process for choosing a fabrication strategy and explains how to encode that strategy in a Construction File (CF).

---

## 🧬 Step 1: Organize Your Source Sequences

Before starting oligo design, ensure your GenBank files are saved and annotated. These should live in the `Maps/` folder of your GitHub repo.

For the Lycopene33 example, we’ll focus on an RC part derived from the dxs ortholog of:

**Trueperella pyogenes** strain TP1  
GenBank: CP033902.1  
Coordinates: 656655–658523  
[NCBI Link](https://www.ncbi.nlm.nih.gov/nuccore/CP033902.1?report=genbank&from=656555&to=658623)

You’ve already discussed this sequence, selected a suitable RBS, and formatted it as a standardized RC part following TP.RC conventions. A visual reminder of the completed part is shown below:

![RC part graphic](../examples/lycopene33/RC_TpDxs_structure.png)

The corresponding DNA sequence files is included in the **[example Maps](https://github.com/UCB-BioE-Anderson-Lab/cloning-tutorials/tree/main/examples/lycopene/Experiments/lycopene33/Maps)** folder for reference.

- **CP033902.seq:** The raw sequence of the region of the Trueperella genome containing the dxs CDS and flanking sequences
- **gTpDXS.seq:** A GBlock encoding an RC (rbs.cds) part encoding the Trueperella sequence with restriction sites removed
- **pTpDXS.seq:** A clonal gene synthesis plasmid encoding the restriction site-free part

---

## 🧭 Step 2: Choose a Fabrication Strategy

There are three main fabrication routes based on the type of DNA product you'll use:

### 📌 Summary Table

| Strategy              | DNA Input        | When to Use                                   |
|----------------------|------------------|-----------------------------------------------|
| **Gene Synthesis**   | Clonal plasmid   | Long, complex sequences or many internal sites |
| **gBlocks**          | dsDNA fragment   | Mid-sized parts, fast delivery, no template    |
| **Oligo-Based PCR**  | Short oligos     | You have a template and want to modify or amplify a region |

---

### 🧰 Decision Tree

```
[Start]
   |
   |-- Do you have source DNA?
   |        |-- Yes
   |        |     |-- Does the sequence contain internal BsaI/BsmBI sites?
   |        |           |-- Yes --> Consider gBlock or gene synthesis
   |        |           |-- No  --> Use PCR or oligo-based cloning
   |        |
   |        |-- No
   |             |-- Is the part short (<1.5 kb)?
   |                     |-- Yes --> Order as gBlock
   |                     |-- No  --> Order full gene synthesis
```

---

## 🧫 Gene Synthesis (Clonal)

- Vendors typically deliver your insert in a clonal plasmid with an ampR/pUC origin, though a panel of other vectors may be available.
- If doing Golden Gate, you can directly assemble using the provided plasmid, but be sure to use a recipient backbone with a **different antibiotic marker** (e.g., kanamycin or chloramphenicol if the insert plasmid is ampicillin-resistant).
- You can also PCR out the insert and use it in Gibson or Golden Gate.
- Best suited for large parts or sequences with multiple internal restriction sites.
- Turnaround time is typically **2+ weeks**.

💡 If your synthesis request is rejected, use the IDT or Twist **codon optimization tools** to automatically adjust your CDS to fit synthesis constraints.

**CF Example** (gene synthesis with Golden Gate):
```txt
PCR GB5F GB5R pLYC72I backbone
GoldenGate pTpDXS backbone BsaI gg
Transform gg Mach1 Amp 37 pLYC76I
```
With these oligo sequences:
```txt
oligo GB5F ccataGGTCTCaGCTTTGATCGATTCAACCTCTGATCA
oligo GB5R cagttGGTCTCtAGTACCTCTAAACACAACGACAACAG
```

Where `pTpDXS` is the plasmid obtained by gene synthesis.

---

## 🧬 gBlocks (dsDNA Fragments)

- High-fidelity, non-clonal double-stranded DNA fragments ordered directly from synthesis providers.
- Ideal for medium-length constructs (e.g., <1.5 kb) and faster turnaround than full gene synthesis.
- Can be assembled directly using Gibson or Golden Gate.
- Not suitable as PCR templates (not clonal, risk of errors or contamination).

💡 The dxs ortholog from *T. pyogenes* contains an internal BsaI site, making it a good candidate for synthesis as a gBlock followed by Gibson Assembly.

**CF Example** (gBlock with Gibson):
```txt
PCR YB5F YB5R pLYC72I backbone
Gibson gTpDXS backbone gg
Transform gg Mach1 Amp 37 pLYC76I
```
With these oligo sequences:
```txt
oligo YB5F  gcacagctggccgcctataggGCTTTGATCGATTCAACCTCTGATCA
oligo YB5R  ccactgatcgaaagcatgacAGTACCTCTAAACACAACGACAACAG
```
Where `gTpDXS` is the synthesized dsDNA fragment encoding the RC part with appropriate overlaps. It is available in the Maps folder.

---

## 🧪 Oligo-Based Cloning

- Uses primers and a DNA template (e.g., genomic or plasmid).
- Best for shorter regions or point mutations.
- Covered in earlier tutorials—see Construction Files for format.

**CF Example** (gene synthesis with Golden Gate):
```txt
PCR oTpDXSf oTpDXSr CP033902 pcrpdt
PCR GB5F GB5R pLYC72I backbone
GoldenGate pcrpdt backbone BsaI gg
Transform gg Mach1 Amp 37 pLYC76I
```
With these oligo sequences:
```txt
oligo oTpDXSf  ccataGGTCTCaTACTgtcatgctttcgatcagtgg
oligo oTpDXSr  cagttGGTCTCtAAGCcctataggcggccagctgtgc
oligo GB5F ccataGGTCTCaGCTTTGATCGATTCAACCTCTGATCA
oligo GB5R cagttGGTCTCtAGTACCTCTAAACACAACGACAACAG
```

In practice, our TpDXS gene has an internal BsaI site, so this particular construction file will not work.  We could use SOEing to take the site out during cloning.  However, following our decision tree, we should go with the clonal gene synthesis.  This is thus what is presented in the example folder.  The same process was also applied to the *Aliivibrio fischeri* (GenBank: CP160629.1) which lacks the BsaI site and satisfies the criteria for being cloned from genomic DNA.  Thus 2 plasmids are designed in this experiment:

- **pLYC76I:** The *Trueperella* variant of *dxs* in pLYC72I
- **pLYC76J:** The *Aliivibrio* variant of *dxs* in pLYC72I
---


## 📁 Construction Files Reference

Construction Files use a standardized shorthand format. For more info, see:

**[cf_shorthand_specification.md](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0294469)**

The examples folder contains real CFs for the dxs ortholog scan in:

**[cloning-tutorials/examples/](https://github.com/UCB-BioE-Anderson-Lab/cloning-tutorials/tree/main/examples/lycopene/Experiments/)**

Use those as templates for your own.

---

## 🧠 Recap

- Use this guide to decide whether to synthesize, order a gBlock, or design oligos.
- Always encode your plan in a Construction File.
- Use the dxs ortholog examples as models.

Coming up next: PCR primer/linker diagrams and a quiz to help reinforce strategy selection.
