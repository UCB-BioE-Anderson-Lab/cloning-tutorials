# Gibson Assembly

## Context: Why Gibson?
In the last tutorial, you made pET-INS—the insulin production plasmid—using traditional restriction enzyme cloning. This remains a tried-and-true fabrication method, especially with overexpression vector systems like pET28a, where unique restriction sites (like NcoI and XhoI) are conveniently placed to allow insertion of a gene of interest.

However, the major limitation of this approach is that it depends on the presence of restriction sites in exactly the right locations. In many synthetic biology applications, where multiple genes or parts must be assembled, it becomes difficult to find or engineer unique sites everywhere you need them. These challenges have driven the development of more flexible DNA assembly methods.

One of the most widely used is Gibson Assembly.

In this tutorial, you’ll use Gibson Assembly to build the same pET-INS plasmid from the basic cloning tutorial. But this time, we’ll use PCR to generate two overlapping fragments:
- One containing the *INS* gene
- One with the pET28a backbone

Then you’ll join them using Gibson’s exonuclease-polymerase-ligase mix.

---

## Video Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>
This video covers:
- How to mark insert vs. backbone
- How to define homology overlaps
- Designing and annotating oligos
- Constructing the CF and simulating the Gibson step

---

## Figure: Homology Overlaps and pET-INS Assembly

![Gibson Assembly Schematic](../images/gibson_INS_assembly.png)  
*Figure: Top: pET vector and INS gene have ~30 bp overlapping ends introduced via oligos. Bottom: These overlaps guide Gibson Assembly by exonuclease chew-back, strand annealing, and ligation. Final product is seamless and scarless.*

---

## Step 1: Define the Desired Product
Start by constructing a model of the final pET-INS plasmid in your editor.

1. Open the pET vector and convert it to all **lowercase**.
2. Open the *INS* genomic region and convert it to **UPPERCASE**.
3. Insert the *INS* sequence into the pET vector at the intended location.

This visually marks the junctions between insert and backbone.
🔗 Download sequences: [pET28a GenBank](../assets/pET28a.gb) | [E. coli INS GenBank](../assets/INS_genome_context.gb)

---

## Step 2: Annotate Homology Junctions
1. Highlight the 5' and 3' annealing regions on *INS* (the bases you want oligos to bind to).
2. From the adjacent vector sequence, select 20 bp on each side of those junctions.
3. Color these vector sequences.

These highlighted regions form the **homology arms**.
📷 View: [pET-INS annotated plasmid](../images/workinprogress.png)  
*The homology arms are highlighted to guide primer design.*

---

## Step 3: Design Oligos
Each fragment will be amplified using two oligos:
- One matches the gene (or vector) end and includes the homology to the other fragment.
- These overlaps appear as 5' tails on the oligos.

Each oligo has two parts:
- **Annealing region**: The part that binds the template DNA (~20–25 bp)
- **Overlap tail**: The part that provides homology to the *other* fragment (~20–30 bp)

For example:
- `gib_INS_F`: overlap = last 25 bp of pET28a, anneal = first 25 bp of *INS*
- `gib_vec_R`: overlap = last 25 bp of *INS*, anneal = reverse complement of pET28a flank

Use these pieces to design each full oligo.

### Construction File Snippet
```
PCR     gib_INS_F     gib_INS_R     Ecoli_genome     gib_INS_pcr
PCR     gib_vec_F     gib_vec_R     pET28a           gib_vec_pcr
Gibson  gib_vec_pcr   gib_INS_pcr                   pet_INS_gibson
Transform pet_INS_gibson   Mach1 Amp     pET-INS

oligo   gib_INS_F     ?
oligo   gib_INS_R     ?
oligo   gib_vec_F     ?
oligo   gib_vec_R     ?
plasmid pet_vector    ...
dsdna   Ecoli_genome  ...
```

There are 4 oligos and 2 templates. Replace `?` with final sequences once overlaps are chosen.

---

## Step 4: Simulate the Design
Use tools (ApE, Benchling) or manual simulation:

- Predict each PCR product by replacing annealing regions with full oligos.
- Simulate the Gibson by trimming overlaps and joining.
- Confirm that the final sequence matches the intended pET-INS plasmid.

---

## How to Simulate a Gibson Assembly

To simulate the Gibson step manually:

1. **Start with your two PCR products**. These contain the sequences produced from oligos with tails.
2. **Align the overlaps**: Look at the 5' and 3' ends. They should share an exact 20–40 bp sequence with the other.
3. **Trim the overlap from one side**: Delete one copy of the overlap so it doesn’t appear twice.
4. **Join the trimmed fragments**: The remaining sequence becomes your final assembled product.

You can do this in any sequence editor:
- Paste both PCR product sequences into a file
- Highlight the overlap
- Delete one copy
- Verify the result matches your intended plasmid

If using a simulation tool like ApE, you can copy-paste and inspect the resulting construct.

---

## Quiz
=== do the golden gate one on mRFP instead?????  That way can also add in "and you can make junctions wherever you want with this"

Repeat this process for the *groEL* gene:
- Clone *groEL* from *E. coli* genomic DNA into the same pET vector.
- Design overlaps and write the 4 oligos.
- Write a Gibson-format construction file for the assembly.

🔗 [NCBI: E. coli groEL (U00096.3: 281583–283185)](https://www.ncbi.nlm.nih.gov/nuccore/U00096.3?report=genbank&from=281583&to=283185)

---

*Note: This tutorial builds on concepts from PCR product prediction and sequence annotation covered previously. If unsure about oligo design or simulation steps, revisit those tutorials.*
