# Chassis — rebuild outline

Working document for next year's version. Not the deck; the plan for it.

## What this is reacting to

The lecture ran short and engagement sagged. From the debrief:

- the **two interactive slides at the front worked** — the room reasoning
  through what happens when DNA enters a cell
- the chassis explanation **went off the rails**
- genotypes felt **heavy**, pathogenicity was **boring**
- the housekeeping-genome material was **missing** (I deleted it by
  accident; it is restored on this branch)

Required content, from JCA: pathogenicity and virulence factors (prep for
the practices lecture), genotypes, media, localization.

## The organising idea

The thing that worked is not a slide, it is a **method**: list every DNA in
the cell, what each is read into, what that makes, what gates it, and
therefore what the cell can do. DNA → RNA → protein → phenotype, against a
row of conditions.

So the method becomes the spine. The lecture is not six topics about the
host; it is one analytical habit, exercised on five systems that get
progressively harder. Each exercise is chosen so that working it *is* the
coverage of a required topic.

Two rules for the rebuild:

1. **One point per slide.** If a slide needs "and also", it is two slides.
2. **Every section ends in a prediction the room makes before the answer.**
   The questions currently all sit at the end of their section, after the
   catalogue. They should come first, or at worst second.

## Sections

### 0 · Where we left off — 2 slides

| slide | the one point |
|---|---|
| The construction file, and what it does not say | a CF builds DNA; it stops at the cell door |
| Then, to the cells | getting it installed is its own procedure, with its own steps |

### 1 · The method — 9 slides

Not a grid handed over, but the reasoning walked. The DNA is in the cell and
it is *just DNA*; nothing happens until something reads it. That is the first
move and it is the one worth slowing down on, because everything else falls
out of iterating it.

| slide | the one point |
|---|---|
| The DNA is in. Now what? | the question, asked before any answer |
| It is just DNA | nothing happens until something transcribes it |
| So what fires with no input? | everything constitutive — that is round one |
| What round one makes | the RNAs and proteins that now exist |
| What those products do | and what that changes about the cell |
| **The loop** | on → makes → does → changes → *now* what is on? |
| Worked example: the CRISPR system | the loop run against the conditions |
| Polar mutations | what the method does not show you |
| **Group exercise: blue-white** | they run the loop themselves |

The loop is the deliverable. Say it once, name it, then run it twice — once
from the front, once by them.

**Group exercise — blue-white screening.** Chosen over dapA for this slot
because it is a real *circuit* rather than a single gene: lacZΔM15 on the
chromosome, lacZα on the plasmid, lacI repressing, IPTG relieving it, X-gal
as the readout. Running the loop on it forces every move — what is
constitutive, what is repressed, what the inducer changes, what two gene
products do *together*, and what colour the plate goes. It also covers
Mach1's genotype, so section 4 no longer needs an exercise of its own.

**Optional extension — dynamics.** The loop is qualitative: a unit is on or
off, a product is present or not. Putting rate equations on the
constitutive-expression slide and plotting concentration rising to steady
state would make it quantitative, and it is the natural place for it: one
promoter, one product, one curve. Worth doing only if the qualitative
version is landing, because it changes what the exercise tests. My
suggestion is to build the qualitative loop first, present it once, and add
the plots the year after if the room is ahead of it.

### 2 · The chassis is what is already running — 3 slides

This is where housekeeping goes, and it is the baseline every later exercise
assumes. Cannibalise source slides 10 and 12.

| slide | the one point |
|---|---|
| ~3000 genes, ~3 Mb | every bacterium is mostly the same bacterium |
| Nearly identical across the Enterobacteria | so the difference between strains is *not* here |
| What the other 1.6 Mb is for | the accessory genome is where strains differ |

Cut from the current version: the minimal-genome survey, prototrophy as a
definition, the tree of life, popular chasses, the car metaphor beyond one
slide. They are interesting and nothing downstream needs them.

### 3 · Genotypes — 5 slides, ending in the exercise

| slide | the one point |
|---|---|
| A genotype is a list of differences | differences from MG1655, not a description |
| The DNA-handling mutations | recA, endA, hsd — why every cloning strain has them |
| The metabolic mutations | invisible on LB, which is the trap |
| Rich vs minimal | what the medium hands over decides what you can see |
| **Exercise: dapA** | *add a dapA plasmid to WM3064 — what grows where?* |

The exercise carries genotypes **and** media, and predicts three plates:
LB, LB+DAP, minimal. Grid: chromosome ΔdapA / plasmid dapA → transcript →
DapA → cell wall → growth.

### 4 · Our strain — 3 slides, ending in the exercise

| slide | the one point |
|---|---|
| Mach1 is not K-12 | different parent, different inheritance |
| Its genotype, read | the same tokens, on the strain they actually use |
| **Exercise: blue-white** | *what colour, and why, on X-gal — and when does it fail?* |

lacZα complementation is an assay prediction, so it belongs here as an
exercise rather than as two slides of mechanism.

### 5 · Localization — 5 slides, ending in the exercise

| slide | the one point |
|---|---|
| Five places a protein can be | and they are not equally easy |
| The signal peptide | an address on the front, 18–30 residues |
| Sec, as a process | the animation; one click per event |
| Where it ends up decides your assay | periplasm vs medium vs cytoplasm |
| **Exercise: predict the assay** | *given this construct, what does each fraction contain?* |

Cut or demote: Tat, the three secretion systems, outer-membrane targeting,
SignalP. Keep Tat only if there is time — it is a good story and nothing
needs it.

### 6 · Pathogenicity — 4 slides, ending in the exercise

The point of this section is the practices lecture: why the strain on the
bench is safe, and what would make one that is not.

| slide | the one point |
|---|---|
| Core vs accessory, again | virulence is never on the core chassis |
| What a virulence factor does | one example drawn properly — type I pili |
| The five categories | named once, against what the host does |
| **Exercise: is this safe?** | *given a genotype and a plasmid, what would you need to check?* |

That last exercise is the bridge into practices, and it is the reason the
section exists. The current version is a catalogue with its questions at the
end; this is a question with a catalogue behind it.

## Count

Slides are the wrong unit — the animated deck packs many clicks into one
slide. Steps are the honest measure of how long it runs.

| version | slides | steps |
|---|---:|---:|
| original PowerPoint | 77 | ~84 |
| what was presented | 50 | **132** |
| this outline | 31 | ~85 |

Two things fall out of that. The rebuild I did **added 57% more steps than
the PowerPoint** while cutting slides by a third — more clicks, each
carrying less. And it still ran short, which means step count was never the
constraint.

So this outline lands back at roughly the original's step count, but spends
it differently: five points where the room has to commit to an answer before
being told, including one full group exercise. Those consume wall-clock time
that does not show up as frames, which is exactly the time the presented
version was not using.

| section | slides | ends in an exercise |
|---|---:|---|
| 0 where we left off | 2 | — |
| 1 the method | 9 | blue-white, as a group |
| 2 the chassis already running | 3 | — |
| 3 genotypes | 5 | dapA |
| 4 our strain | 3 | — (covered in §1) |
| 5 localization | 5 | assay prediction |
| 6 pathogenicity | 4 | is this safe |
| | **31** | **4 exercises + 1 group** |

## Open question

The grid is currently hard-wired to the CRISPR system. Five exercises in the
same format argues for generalising it into a component that takes a row
list and a condition list. Worth doing after the second exercise is built by
hand, not before — the regulation column was not obviously missing until the
format had been presented once.
