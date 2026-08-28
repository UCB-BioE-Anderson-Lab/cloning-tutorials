# 11. Cycle Sequencing

- **Page:** `docs/wetlab/sequencing.md`
- **Proposed ID:** `pP6-2026-11-Sequencing`
- **Prior versions:** ⚠️ **pP6-2022-8-Sequencing AND pP6-2022-9-Sequence Analysis both
  exist; neither is embedded.** Note there are two videos and only one page.
- **Runtime:** two parts, ~3 min + ~6 min
- **Advance prep:** an archived `.seq` and `.ab1` pair; ApE with the feature database
  installed; `pP6.seq`
- **Hosting:** Kaltura

## Status and structure

The 2022 series split this into **two** videos — submission and analysis — while the site
has one page with one commented-out video slot. That split was the right instinct: the two
halves have nothing in common. One is a bench task, the other is an hour at a computer.

**Recommendation:** keep two videos and give the page two embed slots, or embed the
analysis video on this page and the submission clip inline earlier in the section. Do not
merge them into one nine-minute video.

Both 2022 recordings are strong reuse candidates — sequencing chemistry and ApE have not
changed, and the analysis video is screen capture with no room in shot at all. **The
analysis video is the single safest reuse in the whole series.** Check that the Drive
folder links and the submission form still resolve.

## Part A — Submission (~3 min)

1. **What cycle sequencing is** (~45 s) — over `JCA_CycleSequencing1.gif`. One primer, so
   amplification is **linear, not exponential**. Chain-terminating ddNTPs, each
   fluorescently labelled, then capillary electrophoresis.

2. **Why not sequence the whole plasmid** (~30 s) — full-plasmid is ~$15 and returns
   everything; a single read is ~$3.50 and we only care about the variable region between
   two sites. Show the cost table.

3. **Choosing a primer** (~30 s) — the read starts **20–50 bp downstream** of the primer, so
   the primer must sit upstream of the region of interest. For pP6 we use **G00101**.

4. **Submitting** (~45 s) — how samples are physically submitted and labelled, and that
   results come back in 1–2 days as a `.txt` base-call file and an `.ab1` trace.

## Part B — Analysis (~6 min, screen capture)

This is the higher-value half and it is entirely screen recording.

5. **Download your result** (~30 s) — search the assigned number (e.g. `79`) in the shared
   Drive folder. Show a real folder and a real search.

6. **Look for the architecture** (~60 s) — the core check:
   `BseRI → variable promoter region → BseRI`. If intact, it is a candidate hit. If not,
   it is probably not usable but may still be interesting — say that reads from an N-rich
   region genuinely do come back with duplications, deletions, and recombinations.

7. **ApE feature check** (~2 min) — open the `.seq` and `pP6.seq`. Hit **Ctrl-K** to light
   up features. Verify on screen, using the feature list at the top:
   - Exactly **two** BseRI sites
   - The consensus promoter pattern between them
   - The **T4 terminator**
   - Correct order, each appearing once

8. **Align to the model** (~90 s) — Tools → *Align with another sequence…* → `pP6.seq`.
   Look for 100% identity around the promoter region. Show what a clean alignment looks
   like, and — if an example exists — what a mutated or recombined one looks like. The
   contrast is the lesson.

9. **Judging read quality** (~45 s) — show the chromatogram. Clean vs. noisy, and the
   length of high-quality sequence: ~100 bp is poor, ~800 bp is good, ~1000 bp is great.
   Show real traces at more than one quality level if any are available.

10. **Search the motif** (~30 s) — find this in the read:
    ```
    GAGGAGTCCTGGGTTCNNNNTTGACANNNNNNNNNNNNNNNNNTATAATNNNNNNANNNNGTTAGTATTTCTCCTC
    ```
    Found and clean → mark the clone **usable**.

11. **Fill out the form** (~60 s) — walk the fields on screen: `exp`, `clone_id`,
    `student_name`, `read_name`, `date_sequenced`, `canonical`, `usable`, `cassette`,
    `Notes`. Say what distinguishes **canonical** from **usable**, because students
    routinely conflate them.

12. **Close out** (~45 s) — with a supervisor: discard cleanup DNA and used plates, discard
    bad-read clones, clean and bleach the culture block, confirm uploads, **move hits to the
    TPcon6B box**. The experiment is complete when hits are logged and uploaded.

## Watch out

- Every Drive link and form link in this page dates from the 2022 run. **Verify each one
  resolves before filming a screen capture of it**, and re-verify before embedding a reused
  2022 video that shows the same links.
- Don't show a real student's name on screen when filling out the form.

## Quiz impact

None required.
