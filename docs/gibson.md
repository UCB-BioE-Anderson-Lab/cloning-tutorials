
# Gibson Assembly: Building pET-lacZ Without Restriction Enzymes

## Overview
In this tutorial, you will construct the same pET-lacZ plasmid as in the basic cloning tutorial—but using Gibson Assembly 
instead of restriction enzymes. This approach uses homology overlaps in PCR products to guide seamless assembly. We'll walk 
through how to design the overlapping sequences, build the model, design the oligos, and simulate the outcome.

---

## Context: Why Gibson?
Restriction enzymes limit the placement of junctions and are not always compatible with certain sequences. Gibson Assembly 
bypasses these limitations by using overlapping homology regions between DNA fragments to join them without scars. [todo: this is underselling the importance and utility of gibson.  the #1 benefit is the simmplicity, the #2 benefit is it can be applied anywhere, scarlessly. We should explain all that.]

We'll build pET-lacZ using two PCRs:
- PCR #1: amplifies *lacZ* from the *E. coli* genome
- PCR #2: amplifies the pET vector backbone
These products will have ~20–40 bp overlaps, allowing seamless joining via Gibson.

---

## Figure: Homology Overlaps in Gibson Assembly

![Gibson Assembly Schematic](images/gibson_homology_overlap.png)  
*Figure: Two DNA fragments with complementary homology regions (~20–40 bp) are joined by exonuclease chew-back, annealing, polymerization, and ligation.* [todo:  this figure should also illustrate lacZ and the backbone being joined together -- so explain both the specific example and the chemistry and the homology arms in one figure]

---

## Step 1: Define the Desired Product
Start by constructing a model of the final pET-lacZ plasmid in your editor.

1. Open the pET vector and convert it to all **lowercase**.
2. Open the *lacZ* genomic region and convert it to **UPPERCASE**.
3. Insert the *lacZ* sequence into the pET vector at the intended location.

This visually marks the junctions between insert and backbone.
[todo:  provide links again to lacZ and pET28a]
---

## Step 2: Annotate Homology Junctions
1. Highlight the 5' and 3' annealing regions on *lacZ* (the bases you want oligos to bind to).
2. From the adjacent vector sequence, select 20 bp on each side of those junctions.
3. Color these vector sequences.

These highlighted regions form the **homology arms**.
[todo:  include a seqviz window showing the annotated plasmid map and homology arms]
---

## Step 3: Design Oligos
Each fragment will be amplified using two oligos:
- One matches the gene (or vector) end and includes the homology to the other fragment.
- These overlaps appear as tails on the oligos.
[todo: that is unclear, explain this better.  use names for the components like forward_anneal ]

### Construction File Snippet
```
PCR     gib_lacZ_F    gib_lacZ_R    Ecoli_genome     gib_lacZ_pcr
PCR     gib_vec_F     gib_vec_R     pET28a           gib_vec_pcr
Gibson  gib_vec_pcr   gib_lacZ_pcr                   pet_lacZ_gibson
Transform pet_lacZ_gibson   Mach1 Amp     pET-lacZ

oligo   gib_lacZ_F    ?
oligo   gib_lacZ_R    ?
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
- Confirm that the final sequence matches the intended pET-lacZ plasmid.

---

## Figure: Annotated Final Plasmid

![Annotated pET-lacZ](images/pet_lacZ_seqviz.png)  
*Figure: Annotated final plasmid showing T7 promoter, lacI, lacZ, origin, and antibiotic resistance.*
[see previous todo, we need to introduce that visualization earlier since they design the product then the oligos and cf]

---

## Video Demo
Watch a demonstration of the full design process:
- Setting up lowercase/uppercase junctions
- Highlighting anneals and overlaps
- Designing forward/reverse oligos

🎥 [Watch the video](https://www.youtube.com/embed/STUB_URL_PLACEHOLDER)
[I think you want to put this link at the top so they can choose to watch that first.  If you put it at the end, they have to read the whole thing to know it exists.]

---

## Quiz

Repeat this process for the *groEL* gene:
- Clone *groEL* from *E. coli* genomic DNA into the same pET vector.
- Design overlaps and write the 4 oligos.
- Write a Gibson-format construction file for the assembly.

🔗 [NCBI: E. coli groEL (U00096.3: 281583–283185)](https://www.ncbi.nlm.nih.gov/nuccore/U00096.3?report=genbank&from=281583&to=283185)

---

*Note: This tutorial builds on concepts from PCR product prediction and sequence annotation covered previously. If unsure about oligo design or simulation steps, revisit those tutorials.*
