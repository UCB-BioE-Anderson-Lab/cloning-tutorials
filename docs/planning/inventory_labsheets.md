# Inventory and LabSheets

At this stage, you’ve designed your oligos, written construction files, and confirmed the molecular biology is theoretically sound. With the experimental design finalized, it’s time to order materials and plan lab work. This includes selecting protocols, identifying required samples, and specifying where to find them.

You will generate two key documents:

- **Inventory**: Tracks all DNA samples and reagents used or created in the project.

- **LabSheet**: A lab-ready checklist detailing the experimental workflow.

### Sample Identity and Granularity

While construct names like `pLYC2` refer to a designed DNA sequence, the inventory tracks physical samples—things in tubes. If you pick multiple clones, perform retransformation, or prepare fresh minipreps, it's essential to use names that distinguish each version.

A few naming examples:
- `pLYC2` — refers to the theoretical DNA design.
- `pLYC2 clone A` — a specific isolate from a transformation plate.
- `pLYC2 clone A 2°` — a separate (secondary) prep or colony from the same clone lineage.

In simple cases (e.g., only one clone, one miniprep), just using the construct name may be fine. But as soon as there are multiple samples that could plausibly differ, your naming must be specific enough to distinguish them. Inventory records must include all details needed to unambiguously identify each tube.

Similarly, when documenting results (e.g., sequencing, assay data), always indicate which specific sample was used—not just the construct name. The more complexity in your project, the more critical this becomes.

Examples of the completed ones for lycopene33 are available:

**[Inventory](https://github.com/UCB-BioE-Anderson-Lab/cloning-tutorials/tree/main/examples/lycopene/Inventory/Minus20/)**
**[LabSheets](https://github.com/UCB-BioE-Anderson-Lab/cloning-tutorials/tree/main/examples/lycopene/Experiments/lycopene33)**

---

To illustrate, consider the construction plans for the lycopene33 project:

```tsv
PCR         GB5F     GB5R     pLYC72    back72
GoldenGate  pTpDXS   back72   BsaI       ggTp
Transform   ggTp     Mach1    Amp        37     pLYC76
```

```tsv
PCR         oAfDXSf  oAfDXSr  CP160629   pcrAf
PCR         GB5F     GB5R     pLYC72    back72
GoldenGate  pcrAf    back72   BsaI       ggAf
Transform   ggAf     Mach1    Amp        37     pLYC77
```
In a construction file (CF), the final item on each line (e.g., `ggTp`, `ggAf`, `pLYC76`, etc.) represents an **output**—a DNA product that does not yet exist but will be generated during the experiment. Conversely, inputs include materials like primers, template plasmids, gene synthesis fragments, and genomic DNA (e.g., `GB5F`, `pLYC72`, `CP160629`, `oAfDXSf`). These are either already in your inventory or will be shortly after ordering.

Let’s focus on the inputs. Some are carryovers from previous experiments and are already cataloged. Their locations can be found in the project folder’s inventory files:

- `pLYC72`: Prototype plasmid → **Box33 / B2**
- `CP160629`: Genomic DNA from *Aliivibrio fischeri* → **Box33 / B1**

This notation means: Row B (second row, starting from A), Column 2 (counting from 1) in a box labeled `Box33`.

```tsv
>>construct    1           2           3     4     5     6
A
B              CP160629    pLYC72
C
D
```

The remaining inputs—four oligos and one gene synthesis—will arrive lyophilized in labeled screw-cap tubes. Though they’re not yet in the inventory, we’ll assign them storage positions in advance. While there’s no strict rule for box arrangement, grouping similar items (e.g., oligos in Row A) makes retrieval easier:

- `GB5F` → **Box33 / A1**
- `GB5R` → **Box33 / A2**
- `oAfDXSf` → **Box33 / A3**
- `oAfDXSr` → **Box33 / A4**
- `pTpDXS` → **Box33 / B3**

```tsv
>>construct    1           2           3           4           5     6
A              GB5F        GB5R        oAfDXSf     oAfDXSr
B              CP160629    pLYC72     pTpDXS
C
D
```

Note: The `>>construct` label reflects the name used in construction files. Each construct name maps to a specific DNA sequence but doesn't include metadata like concentration, purity, or tube labeling. To find usable materials, match the name under `construct` with your file, then check label and concentration details to choose the best sample.

Now that the stage is set, let’s plan the actual lab work. Construction files (CFs) are organized in chronological order, where later steps often depend on earlier ones. In both CFs, the first operation is a PCR, so our first lab session will begin with setting up those reactions.

Reviewing both CFs, we extract all PCR steps:

```tsv
PCR  GB5F     GB5R     pLYC72   back72
PCR  oAfDXSf  oAfDXSr  CP160629  pcrAf
PCR  GB5F     GB5R     pLYC72   back72
```

The first and third steps are identical—no need to repeat the reaction. A single PCR yields far more material than needed, so we only need to run two PCRs:

```tsv
PCR  GB5F     GB5R     pLYC72   back72
PCR  oAfDXSf  oAfDXSr  CP160629  pcrAf
```

These PCRs are independent and can be run in parallel. We’ll document this in a single **PCR LabSheet** for our first lab session.

The PCR LabSheet will guide you through this workflow:

1. Fetch all required materials.

2. Resuspend and dilute DNA samples as needed.

3. Prepare PCR reactions with: water, buffer, dNTPs, primer1, primer2, template, and polymerase.

4. Run the appropriate thermocycler program.

5. Return all materials to their proper storage.

The LabSheet will be structured accordingly in the following sections:

- **Sources**

- **Dilutions**

- **Reactions**

- **Program**

- **Destinations**

## Sources

Before setting up PCRs, collect all required DNA materials. Some items may already be in the inventory, while others will arrive lyophilized and need to be resuspended and labeled. Stock oligos are resuspended to 100 µM; PCR dilutions are typically 10 µM. Use existing dilutions if available; otherwise, make new ones from stock. For plasmids, use either a miniprep or a dilution (if prior dilution exists and is effective). Be sure to specify the clone being used when applicable. If there are multiple clones, retransforms, or separate preps, include that information (e.g., clone A, clone A 2°) so the sample can be uniquely identified.

```tsv
label       side-label             construct      clone   concentration   location
GB5F        GB5F                   GB5F                   lyophilized     –
GB5R        GB5R                   GB5R                   lyophilized     –
oAfDXSf     oAfDXSf                oAfDXSf                lyophilized     –
oAfDXSr     oAfDXSr                oAfDXSr                lyophilized     –
pTpDXS      pTpDXS                 pTpDXS                 lyophilized     –
pLYC72     pLYC72-A              pLYC72        A       miniprep        Box33/B2
Af gen.     Aliivibrio fischeri    CP160629               miniprep        Box33/B1
```

## Dilutions

Dilution is required for any oligos without existing 10 µM tubes. Resuspend each oligo stock using the nmol value written on the tube (add 10 µL per nmol). Dilute to working concentration as needed.

```tsv
label           side-label         construct      concentration
GB5F            GB5F               GB5F           100 µM
GB5R            GB5R               GB5R           100 µM
oAfDXSf         oAfDXSf            oAfDXSf        100 µM
oAfDXSr         oAfDXSr            oAfDXSr        100 µM
10uM GB5F       10uM GB5F          GB5F           10 µM
10uM GB5R       10uM GB5R          GB5R           10 µM
10uM oAfDXSf    10uM oAfDXSf       oAfDXSf        10 µM
10uM oAfDXSr    10uM oAfDXSr       oAfDXSr        10 µM
pTpDXS          pTpDXS             pTpDXS         miniprep
```

## Reactions

Each PCR to be performed is defined in the table below. Use label names that fit on the PCR tube caps—short, unique, and easy to recognize.

```tsv
label   primer1         primer2         template        product
b72     10uM GB5F       10uM GB5R       pLYC72         back72
Af      10uM oAfDXSf    10uM oAfDXSr    Af gen.         pcrAf
```

## Program

Not all PCRs use the same thermocycler program. When creating a LabSheet, we define the **first attempt** program for each PCR based on the expected product size. Actual success may vary, and adjustments like annealing temperature tweaks can be made in follow-up experiments and documented in the experimental issue.

At the planning stage, the main variable to consider is **product length**. Using C6-Tools, we calculate:

### PCR Product Sizes

| Product   | Size (bp) |
|-----------|-----------|
| pcrAF     | 1,989     |
| back72    | 14,055    |

These products differ significantly in size, so we refer to the PrimeStar GXL cycling program chart to select the appropriate thermocycler settings.

### PrimeStar GXL Decision Chart

| Program   | Size Range   |
|-----------|--------------|
| PG2K55    | Up to 2 kb   |
| PG4K55    | 2–4 kb       |
| PG6K55    | 4–6 kb       |
| PG8K55    | 6–8 kb       |
| PGXL4     | >8 kb        |

PrimeStar GXL is our standard polymerase for cloning due to its high fidelity and ability to amplify long templates (up to ~30 kb). Other polymerases (e.g., Phusion) can be used, but would require selecting a compatible protocol and explicitly writing that into the LabSheet and thermocycler software.

### Assigned Programs

```tsv
protocol: PrimeStar

label   program
Af      PG2K55
B72     PGXL4
```
## Destinations

Some samples go back into inventory; others can be discarded. Any tubes listed in the **Sources** section are returned to their original storage, so they don’t need to be listed again. Reaction tubes (e.g., PCR, digestion, ligation, transformation) are temporary and get discarded—these do not need destination entries.

Oligo stocks (100 µM) should always be saved and listed in destinations. Diluted oligos (10 µM) can be discarded unless you plan to reuse them—it's easy to remake them from the 100 µM stock. Later in the experiment, you’ll generate cleaned-up PCR products (e.g., via Zymo cleanup); these should be saved until the project is complete, for troubleshooting. You’ll also generate minipreps; you won’t know how many in advance, but all minipreps that contribute to sequencing should be saved.

For the lycopene33 project, we’ll discard the 10 µM dilutions. The new inventory destinations are:

```tsv
label       location    side-label   construct   concentration
GB5F        Box33/A1    GB5F         GB5F        100 µM
GB5R        Box33/A2    GB5R         GB5R        100 µM
oAfDXSf     Box33/A3    oAfDXSf      oAfDXSf     100 µM
oAfDXSr     Box33/A4    oAfDXSr      oAfDXSr     100 µM
pTpDXS      Box33/B3    pTpDXS       pTpDXS      miniprep
```

Now we can finalize the LabSheet and add it to the project folder. There’s no fixed format or file type required, but spreadsheets tend to be the most practical. I often include extra notes or protocol guidance depending on the audience—for example, the pP6 labsheets included extensive documentation. When making sheets for myself, I typically just include the tables, as I already know what to do. Don’t forget to update your Box33 inventory file.

## Gel and Zymo Labsheets

PCR is just the beginning. After running a PCR, I usually follow up with a gel to assess success. If the results look good, I proceed with a Zymo cleanup. These steps are **not** dictated by the construction file—other options exist. Gels are purely analytical and can be replaced by dye-binding assays or other quantification methods. Similarly, alternative DNA purification methods exist besides Zymo columns.

Our next labsheets will document gel runs and Zymo cleanups. These are straightforward:

- Each PCR product gets one row in the gel sheet and one in the Zymo sheet.

- On the gel sheet, list the expected DNA sizes.

```tsv
reaction    size    product
Af          1989    pcrAf
B72         14055   back72
```

For the Zymo sheet, you’ll record each cleaned-up product and assign a tube label and inventory destination. These go into 1.5 mL tubes, with both a top and side label.

```tsv
reaction    label   side_label     elution_volume  construct   destination
Af          zAf     zAF pcrAf      25 uL           pcrAF       Box33/C1
b72         zB72    zB72 back72    25 uL           back72      Box33/C2
```

## Assembly Labsheets

Assembly labsheets (Gibson or Golden Gate) include:

- **Sources**
- **Reactions**
- **Program**

Sources consist of cleaned-up PCR products (Zymo samples) and any Gblocks or synthetic plasmids that go directly into the assembly.

For lycopene33, we plan two Golden Gate reactions that can be performed in parallel:

```tsv
GoldenGate  pTpDXS   back72   BsaI   ggTp
GoldenGate  pcrAf    back72   BsaI   ggAf
```

Sources for these assemblies:

```tsv
label     side-label      construct   clone   concentration   location
zAf       zAF pcrAf       pcrAF       -       zymo            Box33/C1
zB72      zB72 back72     back72      -       zymo            Box33/C2
pTpDXS    pTpDXS          pTpDXS      -       miniprep        Box33/B3
```

Golden Gate reactions use the `main/GG1` thermocycler program:

```tsv
program: main/GG1
```

## Transformation, Picking, Miniprepping, and Sequencing Labsheets

These next steps happen on a **per-sample** basis. For lycopene33, we have 2 assembly reactions, so we’ll:

- Transform each assembly.

- Pick 4 colonies from each.

- Miniprep all resulting colonies.

Sequencing plans are context-dependent. If the modified plasmid region is under 800 bp, a single Sanger read may cover the entire region. To prepare, identify existing oligos that can sequence through your region of interest. You may need to order new primers if none exist.

In the TP.RC system, each part is flanked by unique linker sequences, which provide good priming sites for sequencing. Sequencing read quality typically becomes reliable ~50 bp downstream of the primer’s 3′ end—plan primer locations accordingly.

You may need multiple reads to cover the entire region. Consider:

- **Function matters**: If your construct is functionally confirmed, you may tolerate silent mutations.

- **Read efficiency**: A partial but perfect read may be enough for confidence.

- **Cost**: If more than 3 reads are required, it may be cheaper to sequence the full plasmid instead of using multiple cycle sequencing reactions.

## Assay Labsheets

Until now, we’ve focused only on labsheets for the fabrication phase. Eventually, you’ll also perform **assays** to determine whether your DNA constructs are functional. Assay design is highly experiment-specific.

For lycopene, visual inspection (e.g., colony redness) can be informative. You might also run an acetone extraction and measure color intensity using a spectrophotometer. There’s no standard format for an assay labsheet, but it should clearly outline the protocol steps, including:

- Required materials and equipment

- Measurement procedure

- Data to be recorded

Be sure to include **positive and negative controls**:

- For optimization, wild-type (unmodified) cells make a good negative control.

- A prototype plasmid (e.g., pLYC72) serves as a strong positive control.

These controls help you compare your new designs directly against known standards.

Also consider **replicates**:

- **Technical replicates**: Repeat the measurement from the same culture to estimate measurement error (e.g., split one culture into multiple wells).

- **Biological replicates**: Pick multiple clones from a transformation plate. These may differ due to mutation or background plasmid, so expect variability.

Standard deviation from technical replicates reflects measurement noise. However, if biological replicates yield similar results, that provides strong support for a consistent and intended phenotype.

---

By now, you’ve planned your experimental workflow from design through fabrication and into functional testing. Your inventory and labsheets are not just planning tools—they are your lab notebook. As experiments unfold, update them directly with any deviations. Six months from now, when questions arise, this is where you’ll look to recall exactly what was done, which samples were used, and how things were carried out. Keep them clear, complete, and current to ensure your work remains reproducible and understandable well into the future.