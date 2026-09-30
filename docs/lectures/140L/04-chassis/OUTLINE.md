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

### 1 · The method — 4 slides

The existing trace exercise, which is the thing to keep. Regulation is now
drawn on it (each unit carries what gates it), which was the missing piece.

| slide | the one point |
|---|---|
| What happens, and in what order? | the grid: every DNA, its RNA, its protein, its gate |
| *(worked through the conditions)* | a promoter fires or does not, and you can tell which |
| Polar mutations | the grid does not show everything — neighbours matter |
| The habit, named | what is on · what does it make · what does that do |

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

| section | slides | ends in an exercise |
|---|---:|---|
| 0 where we left off | 2 | — |
| 1 the method | 4 | it *is* the exercise |
| 2 the chassis already running | 3 | — |
| 3 genotypes | 5 | dapA |
| 4 our strain | 3 | blue-white |
| 5 localization | 5 | assay prediction |
| 6 pathogenicity | 4 | is this safe |
| | **26** | **5 exercises** |

Against 50 slides and 132 frames now. Fewer slides, more clicks per slide,
and five places where the room has to commit to an answer.

## Open question

The grid is currently hard-wired to the CRISPR system. Five exercises in the
same format argues for generalising it into a component that takes a row
list and a condition list. Worth doing after the second exercise is built by
hand, not before — the regulation column was not obviously missing until the
format had been presented once.
