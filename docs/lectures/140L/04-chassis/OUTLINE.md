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

## Time budget — this is the real constraint

The slot is **1:50**. It ran **1:20**. Thirty minutes of a hundred and ten
went unused, which is 27% of the lecture.

That reframes everything above. 132 steps in 80 minutes is about 36 seconds
a step, and the first draft of this outline cut to ~85 steps — which would
have run around 55 minutes and made the problem **worse**. Shorter is the
wrong direction. The deck is not too long; it is too thin per minute.

So the rule for the rebuild is: **cut almost nothing, and add time in the
form of work the room does.**

| | slides | steps | ~minutes |
|---|---:|---:|---:|
| original PowerPoint | 77 | ~84 | — |
| what was presented | 50 | 132 | **80** |
| first draft of this outline | 31 | ~85 | ~55 &nbsp;*(wrong)* |
| **the plan** | ~46 | ~115 | **~105** |

### Where the thirty minutes comes from

Not from more slides. From three exercises where the room commits to an
answer before being told, each long enough to be real work rather than a
rhetorical pause.

| exercise | section | what it covers | est. |
|---|---|---|---:|
| **Blue-white** | §1 | run the loop on a circuit: repression, induction, two products acting together, a plate colour | 12 min |
| **dapA into WM3064** | §3 | genotypes and media together — predict LB, LB+DAP, minimal | 10 min |
| **Is this strain safe?** | §6 | given a genotype and a plasmid, what would you check — and the handoff to practices | 12 min |

That is 34 minutes of engaged time. Against ~10 minutes of genuinely dead
material removed, the deck lands near 105 of the 110.

### What still gets cut

Only what nothing downstream needs, and only about ten minutes of it:

- the tree of life as its own slide (fold the one useful line into chasses)
- the minimal-genome survey (the housekeeping point is made better by the
  source's own framing: ~3000 genes, ~3 Mb, nearly identical across the
  Enterobacteria)
- prototrophy as a formal definition (keep the layered-genome figure, which
  §6 depends on; drop the definitional apparatus around it)

**Tat, the secretion systems, the strain pedigree and the Celebrities slide
all stay.** They are the slack. If an exercise runs short, they absorb it.

### The other fix, which costs nothing

Every question in the presented deck sits at the *end* of its section.
Pathogenicity has two good ones, arriving after seven slides of catalogue.
Moving each section's question to the front — pose it, let them fail at it,
then teach into it — changes engagement without changing the step count at
all. "Boring" was never a length problem; a catalogue is boring at any
length.

## Open question

The grid is currently hard-wired to the CRISPR system. Five exercises in the
same format argues for generalising it into a component that takes a row
list and a condition list. Worth doing after the second exercise is built by
hand, not before — the regulation column was not obviously missing until the
format had been presented once.

---

## First draft — built

All five exercises are in, on `lectures/chassis-housekeeping`. 171 steps
against the 132 that were presented, which is the direction the timing
needed.

| § | exercise | step | what it catches |
|---|---|---:|---|
| 1 | the loop, taught slowly on pCas | 5 | — |
| 1 | **IPTG added early** | 21 | silent failure: colonies grow, nothing is edited |
| 3 | **dapA plasmid into WM3064** | 14 | reading one token of a genotype and stopping |
| 4 | **which plates go blue** | 19 | forgotten inducer looks like perfect clones |
| 5 | **where does it show up** | 20 | a Sec signal addresses one membrane, not two |
| 6 | **would you work with this** | 2 | pathogenicity is not a species property |

Every one of them ends on the same shape: the wrong answer is not an
error, it is a plausible result that looks like success. That was not
planned, it fell out of picking real failure modes, and it is probably
the thing to say out loud when the method is named in section 1.

### Not done

- **§2 (E. coli)** untouched — 19 steps of pedigree, neighbours and
  pathotypes, still with no question in it. Named as slack in the time
  budget; it is the first place to look if the lecture runs long.
- **Dynamics** still not built. The constitutive-expression beat of the
  loop slide remains the natural home for a rate equation and a curve to
  steady state.
- The **question-first reordering** was applied to §6 only. §3, §4 and §5
  now have exercises, but their older questions still sit at the end of
  the section.
