# Choosing a Fabrication Strategy

Once you've finalized your RC part design (e.g., RBS.CDS), it's time to decide how you'll turn that design into actual DNA. This section walks you through the decision process for choosing a fabrication strategy and explains how to encode that strategy in a Construction File (CF).

---

## 🧬 Step 1: Organize Your Source Sequences

Before starting oligo design, ensure your GenBank files are saved and annotated. These should live in the `Maps/` folder of your GitHub repo.

For the Lycopene33 example, we’ll focus on an RC part derived from the dxs ortholog of:

*Trueperella pyogenes* strain TP1  
GenBank: CP033902.1  
Coordinates: 656655–658523  
[NCBI Link](https://www.ncbi.nlm.nih.gov/nuccore/CP033902.1?report=genbank&from=656555&to=658623)

You’ve already discussed this sequence, selected a suitable RBS, and formatted it as a standardized RC part following TP.RC conventions. A visual reminder of the completed part is shown below:

  <h2>TpDXS RC Part</h2>
  <div id="viewer"></div>
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
        .Viewer("viewer", {
            "name": "TpDXS",
            "seq": "ccataGGTCTCaTACTgtcatgctttcgatcagtggtaatctatgcgtagttaaaaggagaaccggtgattcttgattcgataaatggccccgaggacctcgcatcactcaaggttaaggacctcgagcagctggcggaagaaatccgccgcttcctcgtcgtcaacgtggcaaagacgggcgggcacctagggccaaacctgggcgttgtggagctgagcattgcgttacatcgcgtgtttgattcgccccgcgacacgctgatttgggacaccggccaccaagcctatgttcacaagattctcaccggccgcaaagactttgcgcgcctgcgtcaagagggtgggctttcaggctacccctcgcgcgcggagtcggagcatgacgtcgtggagaactcacacgcctcaactgccctgtcgtgggccgatggtatcgcccgcggactgcagctttctggcaaagatagctcggtggtcgccatcattggcgacggcgcgatgactggcggcatggcctgggaggcgctgaacaacatagctgaggatccagatcgcccgctggttatcgtcctcaatgacaatggccgctcgtacgcgcctaccgtgggcgggatcgtgcgtcgctttgacccggtgcgcaaactcgacgcgatgcgagtcaaccgggactacgagaacttcctcgaatggggaaagcgtaccctgcaaggctctggagtaccgggaaaactcacgtatgacacgttgcgcggcatcaagaaaggcatgaaggagattttcttcgacgccggaatcttcgactcgctggggctgaagtacatcggccccgttgacggccacgatatcaagagcctcgaagaggccttgacgatggcgcgcgattacggtggtcccgtcgtcgtgcatgcgattacagaaaaaggacgcgggttcaagccagccgaggagaacaaagctgaccgcttccacgcggtaggtaagatccacccagagaccgggcttccgatcgagccctcgcggttcggatggacatctatttttgccgaggaaatactgaagatcgcgcgcaacgatgcctcgattgtgggggtgacggcggcgatgttgcaaccggttgggctctccctactgcgggaagagtttcctaagcgcgtgatcgatgtcggcatcgccgagcagcacgcggtcacaatggctgcgggtctggcaaaagcgggttttcatccagtcattgcactgtatgcgaccttcctcaaccgtggctttgaccagctcctcatggatgtcgcgctccataacgcgcctgtgacgatctgtctcgatcgggccggggtgacgggcgacgacggcccctcgcacaacggcatgtgggatctgtcaatggcagcgatgatccccaacctgcgtgtagccgttccgcgcgacgagcagcgcatgcgcgagcttctcagccaagctacgcaggttcaatcgcctaccctcgtgcgttacccgaaaggctcagtgccttacgagatcccggctctccgttcgattggccagctcgacgtcctctttgagcgtgtggtcgagggggagcccccgatcgttcttgtggccgtcggccccatggcacacgccgtgattgaggcggcgcagggactcaacagttcgctcgtggcggtcgacccacgatgggtgctcccaatttccgaccagcttgttgacctggccgccacctcggcaggcgttgtggtactcgaagacggcctcgctactgggggcgtaggtgacgcgctgcgctctgccttggcaaggtccggatcgtatgtgcctgtcaagagcctcggcattgacaagagatttctccagcacgccacgcgcggggcgattcttcatcgccaagcgatggacgccgacgccgtacacaccgcggtctgccagctgcgcggctagagcacagctggccgcctataggGCTTaGAGACCaactg",
            "annotations": [
                { "name": "5' linker", "start": 16, "end": 36, "color": "cyan", "direction": 1 },
                { "name": "native RBS", "start": 36, "end": 65, "color": "#92ffa4", "direction": 1 },
                { "name": "dxs CDS", "start": 65, "end": 1937, "color": "#e9d024", "direction": 1 },
                { "name": "3' linker", "start": 1938, "end": 1959, "color": "cyan", "direction": 1 },
                { "name": "BsaI", "start": 5, "end": 16, "color": "#c9cc9d", "direction": 1 },
                { "name": "BsaI (internal)", "start": 987, "end": 998, "color": "#c9cc9d", "direction": -1 },
                { "name": "BsaI", "start": 1959, "end": 1970, "color": "#c9cc9d", "direction": -1 },
            ],
          translations: [],
          viewer: "linear",
          showComplement: false,
          showIndex: true,
          style: { height: "400px", width: "100%" }
        })
        .render();
    });
  </script>

The corresponding DNA sequence files is included in the **[example Maps](https://github.com/UCB-BioE-Anderson-Lab/cloning-tutorials/tree/main/examples/lycopene/Experiments/lycopene33/Maps)** folder for reference.

- **CP033902.seq:** The raw sequence of the region of the *Trueperella* genome containing the dxs CDS and flanking sequences
- **gTpDXS.seq:** A GBlock encoding an RC (rbs.cds) part encoding the *Trueperella* sequence with restriction sites removed
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

In practice, the *TpDXS* gene contains an internal BsaI site, which disqualifies it from direct Golden Gate cloning using the native genomic sequence. While it could be repaired using SOEing, the decision tree points us toward clonal gene synthesis as the preferred strategy. This is the method used in the example files.

In contrast, the *Aliivibrio fischeri* ortholog (GenBank: CP160629.1) lacks internal BsaI/BsmBI sites and meets the criteria for PCR-based cloning from genomic DNA.

As a result, two constructs were designed in this experiment:

- **pLYC76I:** The *Trueperella pyogenes* variant of *dxs* cloned into pLYC72I via gene synthesis
- **pLYC76J:** The *Aliivibrio fischeri* variant of *dxs* cloned into pLYC72I via PCR

Once you select a fabrication strategy for each construct, you must write corresponding Construction Files and place them in your `Construction/` folder. Reference example CFs in:

**[cloning-tutorials/examples/](https://github.com/UCB-BioE-Anderson-Lab/cloning-tutorials/tree/main/examples/lycopene/Experiments/lycopene33/)**

Any oligos required for your strategy should be collected into a single file, in our example named:
```
lycopene33 - Oligos.txt
```

Finally, include annotated GenBank files for all precursor and product plasmids, as well as any sequences that contributed to your design. These should be placed in your `Maps/` folder.

For the Lycopene33 experiment, this results in:

- 2 Construction Files (pLYC76I and pLYC76J)

- 2 product GenBank files (one for each construct)

- 1 gene synthesized plasmid

- 4 oligos
