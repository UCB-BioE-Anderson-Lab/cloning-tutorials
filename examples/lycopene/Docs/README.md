# lycopene33

This experiment evaluates two *dxs* orthologs in the lycopene-producing plasmid pLYC72, the top-performing construct from lycopene32. The *dxs* gene encodes 1-deoxy-D-xylulose-5-phosphate synthase, a key branch-point enzyme in the MEP pathway for isoprenoid biosynthesis.

Two orthologs had been selected:

- *Trueperella pyogenes* (GenBank: CP033902.1)
- *Aliivibrio fischeri* (GenBank: CP160629.1)

These orthologs were selected to represent phylogenetically distant sequences. The *T. pyogenes dxs* gene contains an internal BsaI site, which prevents direct cloning via Golden Gate. To address this, a codon-modified version was synthesized using the `removeSites` function in C6-Tools and delivered in a clonal plasmid. In contrast, the *A. fischeri dxs* gene lacks internal restriction sites and was amplified directly from genomic DNA.

Both genes were inserted into the pLYC72 backbone in place of the native *E. coli dxs* to generate new lycopene pathway constructs.

## Constructs

- **pLYC76** — codon-modified *T. pyogenes dxs*, inserted via gene synthesis
- **pLYC77** — *A. fischeri dxs*, inserted via PCR

Both constructs were assembled using Golden Gate and transformed into *E. coli* Mach1. Resulting strains are tested for function based on colony pigmentation and may be further analyzed by acetone extraction and spectrophotometry.