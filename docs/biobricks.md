
# BioBricks and Standardized Assembly

## Overview
This tutorial introduces the concept of standardized cloning strategies using BioBricks. You'll learn how defined formats enable automated design and predictable assembly of genetic parts such as promoters, RBSs, CDSs, and terminators.

---

## Standardized Cloning

In earlier tutorials, you cloned *lacZ* into a pET vector using:
- Restriction enzyme cloning
- Gibson Assembly
- Golden Gate Assembly

Each had its own oligo design and simulation strategy. But what if you could design a **single strategy** to work across all your ORFs?

---

## NdeI/XhoI Standard: A Template for Expression

Here's the pET construction file format:

```
PCR     oligoF     oligoR     orf_template     pcr_pdt
Digest  pcr_pdt    NdeI,XhoI  1                pcr_dig
Digest  pet28a     NdeI,XhoI  1                vec_dig
Ligate  pcr_dig    vec_dig                      pet_orf
```

Design rule: ORF must begin with ATG inside an NdeI site and end before a XhoI site. No internal NdeI/XhoI allowed.

---

## Abstraction via Algorithm

This allows cloning to be automated:

```python
def design_oligos(orf):
    for_anneal = findbestanneal(orf, fiveprime=True)
    rev_anneal = findbestanneal(orf, threeprime=True)
    rev_anneal_rc = revcomp(rev_anneal)
    oligoF = "ccataCATATG" + for_anneal
    oligoR = "cagatCTCGAG" + rev_anneal_rc
    return construction_file(oligoF, oligoR)
```

This kind of deterministic function lets you abstract fabrication and create repeatable procedures for generating expression plasmids.

We can now refer to a "pET_vector expression of *lacZ*" and it implies specific oligos and a cloning plan without spelling them out.

---

## Standardized Assembly

BioBricks take this idea further by allowing modular **part-level** assembly—promoter + RBS + CDS + terminator—in a repeatable and composable way.

---

## Introduction to BioBricks

### What is BioBricks?

BioBricks is a programming language for Synthetic Biology. In this context, we're working with model organisms like *E. coli* or yeast and modifying them by adding well-defined DNA sequences.

BioBricks defines **basic parts** (promoters, RBSs, CDSs, terminators) flanked by restriction sites in a standard format. These are composable, like words in a language.

Basic parts → Composite parts → Systems → Ecosystems.

[Learn more at the Registry](http://parts.mit.edu/registry/index.php/Help:Contents)

---

### Why Use BioBricks?

1. **Standardized Assembly**: Methods can be automated and made robust.
2. **Shared Resource**: Parts are defined rigorously and reused.
3. **Quantitative Design**: Enables standardized testing and documentation.

Compare this:

![Generic Feature Map](images/plasmid_generic_map.png)

vs.

Using BioBrick IDs like `J23997` gives a specific, defined sequence and design.

---

## Standard Assembly Format

Original format:
```
EcoRI - XbaI - [Part] - SpeI - PstI
```

XbaI and SpeI make compatible sticky ends. Their ligation destroys both sites, creating an ACTAGA scar.

![Standard Assembly Schematic](images/biobrick_std_assembly.png)

---

## BglBricks: Another Standard

```
EcoRI - BglII - [Part] - BamHI - XhoI
```

- Scar: GGATCT → Gly-Ser linker (translational fusions)
- Efficient enzymes
- No methylation interference

Visual:  
```
GAATTCatgAGATCT-part-GGATCCtaaCTCGAG
```

To clone a part into EcoRI/BamHI sites, add BglII (AGATCT) and ATG spacer to your oligos.

---

## General Workflow

1. Clone individual basic parts into plasmids.
2. Use standard assembly (restriction/ligation or Golden Gate) to join them into composite parts.

---

## Modern Alternatives: MoClo

Pairwise assembly (like BioBricks) is slow in practice. MoClo uses:

- BsaI instead of SpeI/XbaI
- Standard 4 bp overhangs (grammar)
- High-throughput assembly of many parts

MoClo preserves BioBrick ideas of abstraction while supporting efficient one-pot cloning.

---

*This tutorial emphasizes the importance of using standards in molecular cloning for automation, predictability, and shareability.*
