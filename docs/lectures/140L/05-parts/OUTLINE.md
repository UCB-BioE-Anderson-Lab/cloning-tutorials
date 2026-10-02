# Parts — build plan

## State, for whoever picks this up

**The deck is built and audited.** 45 slides, 171 steps, six sections, sixteen
animated sequences. `mkdocs build --strict` passes; every section audits with
no clipping, no console errors, no entities surviving into either channel.
What remains is a read-through and the two open questions at the bottom of
this file.

It lives on branch `lectures/parts`, cut from `origin/main`, **not merged and
not deployed** — deliberately, the same way `lectures/chassis-housekeeping`
is held for next year. Merging to main publishes nothing on its own; the site
goes up by a manual `mkdocs gh-deploy`.

The source PowerPoint is not in this repo and never should be — see
AUTHORING.txt on why. It is:

    ~/Library/CloudStorage/Dropbox/Courses/140L/Stanley 2026/
        Lectures 2026 140L/2025_10_01-Parts.pptx

Read it with `markitdown` on a copy in a scratch directory.

To work on the deck you need `mkdocs serve` running on 127.0.0.1:8000. Then,
from `docs/lectures/tools/`:

    node check_section.js 05-parts 02-cds-parts.html /tmp/shots
    sh make_pdf.sh 05-parts

check_section writes a PNG per step and you have to actually look at them —
it reports clipping, ink outside the content box and console errors, and it
cannot see a figure that is drawing the wrong thing correctly. Both of the
real bugs found while building this deck were of that kind, and both are now
written up under TRAPS in AUTHORING.txt. **Read that section before editing a
sequence file.** One of them — the page-local `.slide svg .o` rule — had
every scene part in all six sections visible from its slide's first beat, for
the whole build, with a clean audit the entire time.

A note on the PNG filenames: they do not map one-to-one onto the step numbers
you would compute from the build attributes. Do not reason about which frame
is which from arithmetic; find the slide by its title in the frame, or search
the generated PDF's text.

---

Source: `2025_10_01-Parts.pptx`, 59 slides. Slides 54–59 are the weekly
all-hands (assignments, wetlab status, midterm) and are out, same precedent as
Chassis and Genome Editing. So the lecture is slides 1–53.

Written after the Chassis post-mortem, so the rules from that are applied from
the start rather than retrofitted:

- One clear point per slide.
- Every question goes **before** the material it motivates, not at the end of
  the section. Every question in the presented Chassis deck sat at the end of
  its section, and that is most of why it flatlined.
- Build for the slot. Chassis presented 132 steps and filled 80 minutes of 110.
  That is ~1.6 steps per minute. **Target for Parts: ~175 steps.**
- No catalogue frames. A list of ten antibiotic resistances is a table-row
  survey. Pick the ones the course actually uses and make each one a decision.

---

## What the source deck contains

| Source | Slides | What it is |
|---|---|---|
| Title | 1 | YouTube playlist link |
| What a part is | 2–6 | abstraction ladder, parts vs features, Formats, feature list |
| Central Dogma | 7–14 | **one figure built over eight slides**, one interaction per slide |
| CDS-based parts | 15–26 | functional classes, reporters, LacZ ×3, markers, TFs, LacI, Pbad |
| RNA-based parts | 27–32 | RBS, active RNAs, riboswitch/aptamer, short RNAs, terminators |
| DNA-based parts | 33–41 | promoters ×3, cis elements/origins, recombination sites, terminal repeats |
| Part families | 42–53 | combinatorial assembly, promoter libraries, TPcon, rbs.CDS, orthologs, codon variants |
| All-hands | 54–59 | cut |

Three of the source slides are already interactive prompts (22 alkaline
phosphatase localization, 37 inducible expression, 39 plasmid compatibility).
Those are the seeds for three of the six exercises below.

## What is already covered elsewhere, and must not be re-taught

This is the biggest single edit to the source's shape. Four of its topics are
whole sections of decks the students have already seen:

| Source slides | Already in |
|---|---|
| 3–4 Standard Parts, BioBrick/BglBrick/Golden Gate Formats | DNA Fabrication §4, §6, §8 — prefix/suffix, MoClo, TPcon6 architecture |
| 45–49 TPcon parts, insertion diagrams | DNA Fabrication §8 |
| 40 recombination sites, 41 terminal repeats | Genome Editing §1 att integrases, §4 moving loci |
| 21–22 alkaline phosphatase, not functional in cytoplasm | Chassis §6 localization, Sec and Tat |
| inducible promoters, arabinose and IPTG gating | Chassis §1 trace exercise, regulation column |

Each becomes **one callback slide** that names the thing and points back, not a
re-teach. That frees roughly ten slides of budget for the material the course
needs and the source rushes.

## What the course needs from this lecture

Checked against what the students are doing, not against the source's emphases.

- **This week in lab.** pP6 is them building a promoter library. BestP is them
  measuring it in RPU against J23101 = 1 RPU. So source slides 44–47 — promoter
  libraries, bins, OFF/LOW/MED/UBER — are not a closing curiosity. They are the
  conceptual basis of the experiment in their hands, and they arrive on slide 44
  of 53. They need to be load-bearing and they need room.
- **The capstone.** `planning/project_ispA.md` is an ortholog scan: pick *ispA*
  orthologs, express them in pLYC72, justify the picks biochemically. Source
  slides 50–51 are the worked precedent for exactly that — carnosine synthase,
  76% identity across the panel, real titer data. This is the most load-bearing
  slide in the source deck for this course and it is fourth from the end.
- **Downstream.** Combinatorial Methods is lecture 11, so library construction
  at depth can be deferred. Practices is lecture 7 and needs pathogenicity,
  which Chassis delivered.

## The one structural find

Source slide 48 says secondary structure between an RBS and a CDS is a major
determinant of expression, which is why the transcript is a better part than the
RBS and CDS separately. Source slide 52 says 154 synonymous GFP variants span
250-fold in expression. **These are the same result.** Kudla et al. 2009
(Science 324:255, PMID 19359587) is the source of the 250-fold number, and its
finding is that codon bias did *not* correlate with expression — mRNA folding
near the ribosome binding site explained more than half the variance.

The source deck has these four slides apart and never connects them, and it
labels the second one "codon variants", which points at the wrong cause. In the
rebuild they are one idea, stated once in §3 and paid off in §5.

## Errors in the source to fix at build time

- Slide 31 writes "RhyB". The gene is ***ryhB*** (NCBI GeneID 2847761), the
  Fur-regulated iron-responsive sRNA. Also it is trans-encoded and acts through
  Hfq; "native E. coli antisense RNA" is loose.
- Slide 52 "Codon variants" attributes the 250-fold range to codon choice. Per
  Kudla, the cause is mRNA folding near the RBS. Keep the number, fix the cause.
- Slide 53 "Codon scan families" cites the Wikipedia alanine-scanning page,
  which is a protein-mutagenesis scan, not a codon scan. Resolve before drawing.

---

## Section plan

Six sections. Counts are estimates to be reconciled against the rendered deck.

### `00-front-matter.html` — Introduction · 5 slides, ~26 steps

1. Title.
2. **Exercise, first thing.** Here is a 200 bp stretch of annotated sequence
   (source slide 3 already has the figure). How many parts is this? The answer
   is that the question is malformed until you say what you intend to reuse.
3. Part vs feature, landed properly. A feature is a stretch of DNA that does
   something. A part is a feature someone committed to reusing — it has a name,
   a number, and a tube in a freezer. The source circles this across slides 2–5
   without saying it.
4. The abstraction ladder, animated: protein → CDS → transcript → part with
   scars, one sequence growing at each beat (source slide 2).
5. Formats, one slide. A Format is a promise about the ends. Point back at
   Fabrication.

### `01-dogma.html` — The Central Dogma · 3 slides, ~22 steps

1. **The eight source slides become one animation.** DNA, RNA, protein,
   metabolites, then each interaction arrow appearing on its own beat with its
   own example: protein→metabolite, metabolite→RNA (riboswitch),
   metabolite→DNA (rare), protein→protein, protein→RNA, protein→DNA,
   RNA→DNA (rare). ~11 beats.
2. The classification falls out: a part acts on one of three levels. This is the
   spine of the rest of the lecture, and it is a direct pickup of the Chassis
   trace exercise, whose closing note already says *a part is a thing that lives
   on one of them*.
3. **Exercise.** Given four parts, which level does each act on? The trap is
   that two answers are defensible and the distinction matters: a transcription
   factor *is* protein and *acts* at the DNA level; a promoter *is* DNA and is
   read *by* a protein. Sorting by molecule and sorting by point of action give
   different answers, and the deck's own three-way split uses the first.

### `02-cds-parts.html` — CDS-Based Parts · 9 slides, ~36 steps

1. **Exercise first** (from source 37). You want *E. coli* that fluoresce red
   only in salicylate. What do you build? The wrong answer that looks like
   success: constitutive RFP, grown in salicylate — red cells, in salicylate,
   responding to nothing.
2. What makes a protein a reporter: you can read it out cheaply.
3. Fluorescent proteins — and this is what BestP measures.
4. LacZ, animated: X-gal cleaved to the blue precipitate. Callback to the
   Chassis blue/white exercise. Source spends three static slides here.
5. Alkaline phosphatase — callback to Chassis §6, one slide.
6. Selectable markers reframed from a list of ten to **three mechanisms**:
   survive a poison (bla, kan); die unless you lost it (ccdB, barnase); die on a
   substrate you add (sacB/sucrose, upp/5-FU). Then the design question — which
   one do you need, and when.
7. Transcription factors: LacI represses, CAP activates, **AraC does both**.
   That last is the one non-obvious idea in the source's TF slides.
8. Pbad worked through (source 26).
9. Section close.

### `03-rna-parts.html` — RNA-Based Parts · 7 slides, ~30 steps

1. **Exercise first.** An RBS that gave strong expression in one construct gives
   nothing in the next. The clone sequence-verifies. Why? Plausible-looking
   success: correct sequence, confirmed clone, dead cells.
2. The RBS and 16S pairing, animated — Shine-Dalgarno.
3. The payoff: **an RBS is not really a part**, because its strength depends on
   what follows it. Kudla's 250-fold. This is where the structural find lands.
4. Therefore the transcript is the better object — sets up rbs.CDS in §5.
5. Terminators: efficiency, Rho-dependent and -independent, same context
   dependence.
6. Active RNAs, selectively: riboswitch and aptamer (already on the §1 diagram
   as the metabolite→RNA arrow), *ryhB*, and the suppressor tRNA, which is the
   one that recodes a stop and is a genuinely different mechanism.
7. Section close.

### `04-dna-parts.html` — DNA-Based Parts · 7 slides, ~30 steps

1. **Exercise first** (from source 39). Two pBca9145 plasmids in one cell,
   irreproducible expression. Why? Plausible-looking success: you get colonies,
   you get expression, it just will not repeat.
2. Origins and incompatibility: colE1, p15A, F, R6K.
3. The promoter: −35, −10, sigma factor, animated.
4. A complex promoter — the lac promoter with its operators (source 35).
5. Kinds of promoter, organised by *what decides* rather than by name:
   constitutive, ligand-inducible, needs-its-own-polymerase (T7),
   environmental (iron, O₂, stationary phase).
6. Recombination sites and terminal repeats — one callback slide to Genome
   Editing. Tn5 mosaic end CTGTCTCTTATACACATCT.
7. Section close.

### `05-part-families.html` — Part Families · 9 slides, ~38 steps

The section the course needs most, given the most room.

Its place in the deck is fixed by what it depends on, not by what is topical.
A promoter library is meaningless until §4 has said what a promoter is, and
rbs.CDS only pays off once §3 has established that an RBS's strength depends on
what follows it. So §5 cannot move earlier without breaking two dependencies,
and the fact that pP6 is on the bench this week is not a reason to try. The
course revisits promoter libraries repeatedly; this deck's job is only to say
what a family *is*, once, in the one place the parts vocabulary is complete.

Inside the section, the order is by distance from what they already have.

1. **Exercise first, on their own data.** You measured four pP6 clones against
   J23101. What did you actually produce? Not four numbers — a family: a set of
   parts identical except in one slot, each with a measured value. The section's
   whole idea, derived from something they did rather than presented.
2. The promoter library made explicit — J23101 defined as 1 RPU, the Anderson
   library, the bins from OFF to UBER. **This is pP6 and BestP.** Say so.
3. Why families in general: combinatorial design, hold everything constant but
   one slot. Generalised from the case, not stated ahead of it.
4. TPcon architecture as a family: swap the promoter, hold terminator and CDS.
   Callback to Fabrication §8 for the assembly, not a re-teach.
5. rbs.CDS as a composite part — the §3 payoff cashed: two parts per gene
   instead of three, and nature already picked a working pair.
6. **Second exercise, at its point of use.** An ortholog panel comes back with
   one hit and six duds. Is the enzyme the problem? Trap: identical protein,
   different codons, 250-fold range — a dud may be a badly expressed good enzyme.
   The plausible-but-wrong conclusion is that the ortholog does not work. This
   sat at the top of the section in the first draft, five slides from the
   orthologs it motivates, which is the same mistake as putting it at the end.
7. Ortholog families: carnosine synthase. Real data — 76% identity across the
   panel, and the *Alligator mississippiensis* ortholog at ~87× over the negative
   control while the rest sat near background.
8. **This is your capstone.** *ispA* in pLYC72, and what "justify your picks"
   means given the slide above.
9. Codon and scanning families, with the cause stated correctly. Closes the deck
   on the same fact §3 opened with.

§4 gets a one-line forward pointer where the kinds of promoter are laid out, and
nothing more — a library is not a kind of promoter, it is a set of them, and
that distinction is worth keeping clean.

---

## Totals

**Built: 45 slides, 171 steps**, against a 110-minute slot. Compare Chassis:
source 62 slides → rebuilt to 46 slides / 175 steps.

| Section | Slides | Steps |
|---|---|---|
| 0 Introduction | 5 | 18 |
| 1 The Central Dogma | 3 | 17 |
| 2 CDS-Based Parts | 10 | 35 |
| 3 RNA-Based Parts | 8 | 26 |
| 4 DNA-Based Parts | 8 | 31 |
| 5 Part Families | 11 | 44 |

Sixteen animated sequences. Every section audits clean: no clipping, no
console errors, no entities surviving into either channel, median fill 80–94%
of the content box.

## Source coverage

Every one of source slides 1–53 has a home. 54–59 are the all-hands and are
out, the same precedent as Chassis and Genome Editing.

| Source | Where it went |
|---|---|
| 1 | §0 title |
| 2 Part Abstractions | §0 the ladder — and the protein is named, which the source never does: it is chloramphenicol acetyltransferase, UniProt P62577 |
| 3 Parts vs Features | §0 the opening question |
| 4 Formats · 5 Features · 6 kinds | §0 two definitions, one Formats slide |
| 7–14 Central Dogma | §1, one animated slide, nine beats |
| 15 divider · 16 functional classes | §2 divider, folded into "what makes a reporter" |
| 17 fluorescent | §2 amplification — the colours cannot be drawn in this palette, and were never the point |
| 18–20 LacZ | §2 the X-gal reaction |
| 21, 22 phosphatase | §2 one callback to Chassis §6 |
| 23 markers | §2 three mechanisms |
| 24 transcription factors | §2 global versus local |
| **25 Lac repressor** | **§4, with slide 35 — the last source slide to find a home** |
| 26 P*bad* | §2 the light-switch model |
| 27 divider · 28 RBS | §3 divider, the 16S pairing |
| 29, 30, 31 active RNAs | §3 one slide (*ryhB* corrected) |
| 32 terminators | §3 the intrinsic terminator, animated |
| 33 divider · 34, 36 promoters | §4 divider, J23101 decomposed, four kinds by what decides |
| 35 complex promoters | §4, with slide 25 |
| 37 inducible | §2 the opening exercise |
| 38 cis elements | §4 three kinds of origin |
| 39 compatibility | §4 the opening exercise |
| 40, 41 sites and repeats | §4 one callback to Genome Editing |
| 42, 43 families | §5 divider, the combinatorial argument |
| 44, 45 libraries and bins | §5 coverage |
| 46 (chart) | not recoverable from the source file |
| 47, 49 insertion | §5 the slot, drawn |
| 48 rbs.CDS | §3 the conclusion, §5 the arithmetic |
| 50, 51 orthologs | §5 the real panel, numbers unchanged |
| 52 codon variants | §3 Kudla, cause corrected |
| 53 codon scan | §5 five ways — and the source's alanine-scanning citation is still unresolved |

**Seven exercises, at least one per section, every one question-first.** They also all land on
the same shape the Chassis exercises found, which is worth keeping deliberately:
*the wrong answer is not an error, it is a plausible result that looks like
success.* Red cells that respond to nothing. A verified clone that is dead. An
expression level that will not reproduce. A good enzyme scored as a dud.

§5 carries two of them — one to open the section on their own BestP data, one
immediately before the orthologs — so seven in all.

## Open

- Source slide 53's codon-scan citation needs resolving before that slide is
  drawn.
- §5 has two exercises where every other section has one. Rendered, it reads
  as the right weighting for the section the course leans on hardest, but it
  is the first thing to cut if the deck runs long.
- Source slide 46 is an unsupported chart object in the .pptx and its data
  could not be read out. If it matters, it needs the original.
