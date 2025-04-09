# pP6 Intro: Finding Strong Promoters in E. coli

## Goal of the Experiment

Your objective is to create and test a library of synthetic promoters to discover variants with high transcriptional strength. Each variant in the library will contain the strong consensus σ⁷⁰ promoter motifs (TTGACA at -35, TATAAT at -10) but will differ in the flanking sequences. These differences may influence promoter strength in surprising ways.

## Background: Transcription in *E. coli*

![Diagram of transcription in E. coli, showing promoter, -35 and -10 boxes, +1 transcription start site, CDS, terminator, and resulting mRNA with RBS.](../images/pp6_transcription.png)
*Figure: Transcription in E. coli. RNA polymerase binds the promoter at the -35 and -10 sites, initiates at +1, and transcribes a coding sequence (CDS) into mRNA with an RBS. The transcript ends at a terminator sequence.*

When RNA polymerase binds to a promoter in *E. coli*, it begins transcription at the +1 position, synthesizing an mRNA strand. This mRNA includes a ribosome binding site (RBS) and a coding sequence (CDS). The -10 and -35 sequences upstream of the +1 site strongly influence transcription strength.

## σ⁷⁰ Consensus Promoters

Most constitutive *E. coli* promoters are recognized by σ⁷⁰, which binds to the following consensus sequences:

- **-35 box**: `TTGACA`  
- **-10 box**: `TATAAT`

Promoters that match this consensus sequence closely are very strong. In this course, we’ll refer to exact matches as **consensus promoters** (formerly called “UBER promoters”).

![Diagram showing core RNA polymerase and sigma factor binding a consensus promoter, highlighting the -35 and -10 regions.](../images/consensus_promoter.png)
*Figure: σ⁷⁰ consensus promoter. The sigma factor of RNA polymerase recognizes the -35 (TTGACA) and -10 (TATAAT) boxes and initiates transcription at the +1 site. This image shows the promoter region unwound and engaged by polymerase.*

## The J23100 Promoter Family

An earlier study generated the J23100 promoter family by introducing mutations into the -35 and -10 boxes while keeping flanking sequences constant. This yielded ~20 variants with known relative strengths. But because the flanking sequence is constant, these promoters are repeated and prone to recombination.

![J23100 promoter variants showing fluorescence output, promoter sequences, and measured RFP levels for each variant.](../images/j23100_library.png)
*Figure: The J23100 promoter family. Variants were created by mutating the -35 and -10 regions while keeping flanking sequences constant. Fluorescence and sequence alignment show relative expression strengths.*

## The pP6 Library Design

To discover new strong promoters, we reverse the J23100 experiment:

- Fix the -35 and -10 consensus motifs.
- Randomize the surrounding sequence using degenerate oligos.

```
ttgacaNNNNNNNNNNNNNNNNNtataatNNNNNN
```

We also add 4 random bases upstream and downstream, yielding 31 degenerate positions in total.

## Construction File

We use a "construction file" to formally describe how DNA parts are assembled. Each line represents a biochemical reaction step using standardized syntax.

The pP6 promoter library is built using a two-step process involving PCR and Golden Gate assembly.

We begin by amplifying the entire plasmid using a protocol called EIPCR (Exponential Inverse PCR), where each primer includes a constant 3′ annealing region and a 5′ overhang containing degenerate bases that introduce variability into the promoter region:

**Primers:**
```
>P6libF2
CAGTAggtctcgATAATNNNNNNANNNNGTTAGTATTTCTCCTCGTCTAC

>P6libR2
CCAAAggtctcgTTATANNNNNNNNNNNNNNNNNTGTCAANNNNGAACCCAGGACTCCTCGAAGTC
```

**Construction File Format (copy-paste compatible):**

```
# PCR reaction
# step      primer1     primer2     template     product
PCR         P6libF2     P6libR2     pJ12         P6

# Golden Gate assembly
# step          dna         enzyme     product
GoldenGate      P6          BsaI       pP6
```

Each resulting pP6 plasmid contains a unique, randomized promoter upstream of an amilGFP reporter gene.

## Expected Outcome

The product of the reaction is a circular plasmid with a unique randomized promoter upstream of an amilGFP reporter.

Each colony on your transformation plate represents a unique promoter. When exposed to blue light, colonies fluoresce with varying intensity depending on promoter strength.

![Fluorescent E. coli colonies on a pP6 transformation plate. Colonies show a range of green intensities under blue light, indicating different promoter strengths. A zoomed-in view shows a bright green colony surrounded by weaker, possibly satellite colonies.](../images/pp6_colony_plate.png)  
*Figure: A pP6 transformation plate under blue light, showing colonies that express varying levels of GFP due to different promoter strengths. Right: A zoomed-in view shows a strong green colony amid satellite colonies with weaker or no fluorescence.*


## Picking Colonies and Sequencing

You’ll select the brightest colonies (most green) for follow-up:

1. Grow in liquid culture
2. Miniprep DNA
3. Submit for Sanger sequencing
4. Analyze the sequence to identify the promoter

Note: Smaller, slow-growing colonies might encode the strongest promoters. Don’t skip them!

## Getting Started

1. Download the pP6 lab sheets and sequences:  
   [Google Drive - pP6 Materials](https://drive.google.com/drive/folders/16-0ek2biyB-hI1RY2xgW6p4fe32FbAJh)

2. Make a copy of this spreadsheet:  
   [pP6 LabSheet Workbook](https://docs.google.com/spreadsheets/d/1updHzk3CJ2_L7eO-Abg0cpHQleU7c8b0lbF9QmNzFWA/edit?usp=sharing)

3. Fill in your name and ID, and print the lab worksheets.  You may also use your phone, tablet, or notebook.  You may also write out your own versikon.

4. Read the tutorial and Watch the demo videos before each lab activity.

## Demo Videos (on bCourses)

- pP6-2022-1-PCR  
- pP6-2022-2-Gel  
- pP6-2022-3-Zymo  
- pP6-2022-4-Assembly  
- pP6-2022-5-Transformation  
- pP6-2022-6-Pick  
- pP6-2022-7-Miniprep  
- pP6-2022-8-Sequencing  
- pP6-2022-9-Sequence Analysis

## Next

When you're ready, proceed to the [Pipetting tutorial](pipetting.md) to learn how to use a micropipette correctly before starting wetlab work.