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

### Oligo-Based Cloning from Genomic DNA

If you have access to a genomic or plasmid DNA source for your gene, you can use oligo-directed PCR to amplify your RC part directly. This is fast and inexpensive, and works well for shorter parts that do not contain internal type IIS restriction sites.

**CF Example** (PCR-based cloning with Golden Gate):
```txt
PCR oTpDXSf oTpDXSr CP033902 pcrTp
PCR GB5F GB5R pLYC72I back72
GoldenGate pcrTp back72 BsaI ggTp
Transform ggTp Mach1 Amp 37 pLYC76
```
With these oligos:
```txt
oligo oTpDXSf  ccataGGTCTCaTACTgtcatgctttcgatcagtgg
oligo oTpDXSr  cagttGGTCTCtAAGCcctataggcggccagctgtgc
oligo GB5F     ccataGGTCTCaGCTTTGATCGATTCAACCTCTGATCA
oligo GB5R     cagttGGTCTCtAGTACCTCTAAACACAACGACAACAG
```

⚠️ In this case, the *TpDXS* gene contains an internal BsaI site, so Golden Gate using the native sequence is not viable. You could remove the site using SOEing, but a cleaner solution is to use gene synthesis.

---

### Gibson Assembly from gBlocks

If your gene contains internal type IIS sites but is less than ~1.5 kb, a synthesized gBlock fragment can be used as input to Gibson assembly. This avoids issues with restriction sites and is faster than full clonal synthesis.

**CF Example** (gBlock with Gibson):
```txt
PCR YB5F YB5R pLYC72I yback72
Gibson gTpDXS yback72 ggTp
Transform ggTp Mach1 Amp 37 pLYC76
```
With these oligos:
```txt
oligo YB5F  gcacagctggccgcctataggGCTTTGATCGATTCAACCTCTGATCA
oligo YB5R  ccactgatcgaaagcatgacAGTACCTCTAAACACAACGACAACAG
```

⚠️ This approach is **not** suitable for *TpDXS*, which is over 1.5 kb and exceeds the length limit for standard gBlock synthesis. While the internal BsaI site could be removed, the part is too long for this route.

---

### Golden Gate Assembly from Gene Synthesis

If your gene is long, contains problematic restriction sites, or you want to future-proof it with clean, modular parts, clonal gene synthesis is the most robust option. Vendors deliver your sequence in a plasmid, which can be used directly in a Golden Gate reaction if the vector and backbone have compatible antibiotic markers. Note that if you want to do Gibson on this material, you will need to PCR it out to get a linear fragment without the rest of the plasmid backbone.

**CF Example** (Gene synthesis with Golden Gate):
```txt
PCR GB5F GB5R pLYC72I back72
GoldenGate pTpDXS back72 BsaI ggTp
Transform ggTp Mach1 Amp 37 pLYC76
```
With these oligos:
```txt
oligo GB5F ccataGGTCTCaGCTTTGATCGATTCAACCTCTGATCA
oligo GB5R cagttGGTCTCtAGTACCTCTAAACACAACGACAACAG
```

➡️ This is the approach we selected for *TpDXS* in this tutorial. Since it contains an internal BsaI site, gene synthesis allows us to remove the site and reuse the part in future Golden Gate builds.

---

### Fabrication Decision Tree

```
[Start]
   |
   |-- Is the DNA sequence available to you (e.g., genomic or plasmid)?
   |      |-- Yes
   |      |     |-- Does it contain internal BsaI/BsmBI sites?
   |      |           |-- Yes --> Use gene synthesis or gBlock
   |      |           |-- No  --> Use oligo-based PCR cloning
   |      |
   |      |-- No
   |           |-- Is the part short (<1.5 kb)?
   |                  |-- Yes --> Order gBlock
   |                  |-- No  --> Order gene synthesis
```

---

### Choosing Golden Gate vs. Gibson

Your fabrication strategy will influence which assembly chemistry is most appropriate, but the final decision also depends on how many parts you're combining and how reusable you want them to be.

#### **Use Golden Gate** when:

  - You're swapping or inserting a single cassette like a TP or RC part
  - You have compatible overhangs and modular templates
  - You want to reuse parts across builds

#### **Use Gibson** when:

  - You're assembling multiple parts in a single reaction (e.g., multiple cassettes)
  - You’re using gBlocks or PCR fragments with custom homology
  - You need flexibility in junction design

💡 Even if you're using Gibson now, always design parts to be Golden Gate–ready by removing internal BsaI/BsmBI sites. This keeps your options open for future modular optimization.

---

## 🗂️ Step 3: Finalizing Your Project Files

Once your strategy is selected, be sure to collect and organize the following in your `Maps/` folder:

- Annotated GenBank files for precursor and product plasmids  
- Sequence files used in the design (e.g., gBlocks, source genomes)  
- Construction Files for each plasmid  
- A consolidated oligo list (e.g., `lycopene33 - Oligos.txt`)

For the **Lycopene33** example:

- 2 Construction Files: `pLYC76` (synthesis) and `pLYC77` (PCR-based)
- 2 final plasmid maps
- 1 synthesized gene map (`pTpDXS.seq`)
- 1 genomic region map from *A. fischeri* (`CP160629.seq`)
- 4 oligos
