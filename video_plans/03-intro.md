# 3. pP6 Experiment Introduction

- **Page:** `docs/wetlab/intro.md`
- **Proposed ID:** `pP6-2026-3-Intro`
- **Prior version:** none
- **Runtime:** 4–5 min
- **Advance prep:** none — but this is **not a bench video**
- **Hosting:** either; content is conceptual, not safety-critical

## Why this one is different

Every other video in this series is a bench demo. This section is concept: transcription,
the J23100 family, why new promoter libraries are needed, the library design, and the
construction file. There is nothing to film with hands.

**Recommendation: screen capture plus talking head, not bench footage.** Trying to stage
this in the lab would produce a video of someone standing next to a bench explaining
sigma factors, which is worse than a screen recording and burns floor time on Saturday.

The 2022 series skipped this section, which is evidence it was never felt to be missing.
The part that genuinely benefits from video is the last third — the practical setup.

## Structure

### Part A — Concept (~2.5 min, screen capture over the page's own figures)

The page already has the right images. Narrate over them rather than rebuilding anything:

1. `pp6_transcription.png` — RNA polymerase binds −35 and −10, starts at +1, makes mRNA
   with an RBS and CDS, ends at a terminator.
2. `j23100_library.png` — the existing family, a spectrum of strengths from mutating
   J23119.
3. **Why build new ones** — the family shares a nearly identical backbone, so members
   recombine when used together and interfere with PCR-based edits. This is the actual
   motivation for the whole experiment and is worth saying slowly.
4. `consensus_promoter.png` — the design: **fix the −35 and −10 motifs, randomize
   everything else**, plus 4 random bases upstream and downstream, giving 31 degenerate
   positions.
5. The construction file — read the two lines aloud and say what each does:
   `PCR P6libF2 P6libR2 pJ12 P6`, then `GoldenGate P6 BsaI pP6`.
6. `pp6_colony_plate.png` — the payoff. One colony, one unique promoter, brightness
   reports strength. Note that **small slow-growing colonies may hold the strongest
   promoters** — a real result students routinely discard.

### Part B — Practical setup (~2 min, screen capture)

This is the part that most needs a video, because it is fiddly and every student does it
once:

7. Open the Google Drive pP6 materials folder on screen.
8. **Make a copy** of the LabSheet Workbook — show the copy step, since working in the
   shared original is a predictable mistake.
9. Fill in name and ID; show where.
10. Print the worksheets, or explain the phone/tablet/notebook alternative.
11. Show where the demo videos live and that each tutorial has a quiz to pass first.

## Watch out

- The page's "All Demo Videos" list names the 2022 series. **If videos get reshot or
  renumbered, that list goes stale.** Update it in the same commit as any embed change.
- Do not re-teach transcription from scratch. The page assumes a molecular biology
  background; match that level or the video becomes ten minutes long.

## Quiz impact

None. The existing quiz covers promoter engineering concepts already on the page.
