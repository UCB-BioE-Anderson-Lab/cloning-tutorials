# 12. BestP on the Tecan

- **Page:** `docs/wetlab/bestp.md`
- **Proposed ID:** `pP6-2026-12-BestP-Tecan`
- **Status:** 🔴 **REMAKE** — one video: BestP performed on the Tecan
- **Prior version:** ❌ **none — the 2022 series ended at Sequence Analysis**
- **Runtime:** 6–7 min
- **Advance prep:** ⚠️ heavy — see below
- **Hosting:** the Tecan's Mandatory QR points here, so this needs to be reachable from the
  bench — **YouTube unlisted** rather than CalNet-gated Kaltura

## Scope: one video, not two

Earlier drafts split this into a BestP procedural video and a standalone Tecan equipment
short. **That split is cancelled** — per JCA this is a single video showing BestP being
performed on the Tecan. The instrument is taught by using it for real rather than in the
abstract, which is the better video anyway.

Consequence: since the equipment shorts (plan 13) are not being made, **this is the only
Tecan footage that will exist.** It therefore has to carry the instrument's own training
duty as well — see "Follow-up work" below.

## Why this is a priority shoot

Two reasons this ranks above the rest of the back catalogue:

1. **It has never been filmed.** The 2022 series stopped at video 9.
2. **The Tecan is a new instrument with no existing footage**, and its training page
   `docs/trainings/tecan_mnano.md` is a **single line — "Contact JCA for in person
   training"** — while the QR registry marks it **Mandatory** and its QR code is live on the
   machine. Anyone scanning it today hits a dead end.

That makes the Tecan segment the highest-value new footage in the entire series: it closes
a live dead-end QR on a mandatory-training instrument.

## Advance prep — the constraint

This video cannot be shot in one sitting from nothing:

- 7 plasmids transformed (4 pP6 clones + pJ12, pJ01, pJ19) and plated
- 4 colonies per plasmid picked into a **24-well block**, grown **overnight** in the
  multitron
- The Tecan available, with the reading settings known

Realistically this is a two-session shoot, or one session using a block someone else grew.
The plate-reader segment is the part that must be filmed live; the transformation and
picking segments can reference videos 8 and 9 rather than repeating them.

## Shots

1. **What changes here** (~45 s) — the series pivots from **building DNA to measuring it**.
   Until now "is it green?" was a yes/no; now we assign a number.

2. **Why RPU** (~60 s) — the conceptual core. Raw fluorescence is not comparable across
   instruments, media, or growth. So we express everything relative to a reference promoter,
   **J23101 = 1 RPU**. Show the three reference plasmids and say what each is for:
   - **pJ12** — J23112, very weak
   - **pJ01** — J23101, the standard reference
   - **pJ19** — J23119, very strong

   Say the thing that makes the comparison valid: **same backbone, same reporter**, so any
   difference in fluorescence comes from the promoter and nothing else.

3. **Transformation and picking** (~45 s) — brief. All 7 plasmids from a **single 100 µL
   competent cell aliquot**; 16 µL cells + KCM + 0.5 µL DNA each; carb selection; no rescue.
   Then 4 colonies per plasmid into the 24-well block, 4 mL 2YT+carb per well.

   **Pick left-to-right and say why** — the order has to match the data entry layout, and
   getting it wrong scrambles the spreadsheet silently. Show the airpore sheet going on.

4. **THE TECAN SEGMENT** (~2.5 min) — **the heart of this video.** Per JCA this is *one*
   video — BestP performed on the Tecan — not a BestP video plus a separate instrument
   short. So this segment carries the full weight of the Tecan's Mandatory training:
   - Where the instrument is (top4 bench) and what it does
   - Powering up and launching the software
   - **Transfer 100 µL from each culture into a black-walled Tecan plate** — say why
     black-walled: it stops optical crosstalk between wells
   - **Two technical replicates per sample.** Show the layout on the plate
   - Loading the plate — correct orientation, A1 position
   - Selecting **fluorescein settings** to read amilGFP, and reading **OD₆₀₀** as well
   - Running the read
   - **Saving data to the USB stick**
   - Care and shutdown: what to do with the plate, how to leave the instrument

   Anything JCA covers in the in-person training that is not on the page should be said here
   — this footage is going to become the page.

5. **Data entry** (~60 s, screen capture) — paste raw OD and fluorescence into the provided
   spreadsheet. Show it computing normalized fluorescence per OD unit, averaging technical
   and biological replicates, and producing RPU with error bars. Then report to the main
   BestP Results sheet.

6. **Reading the answer** (~45 s) — the example table on the page. `pJ01-C` at 1.00 by
   definition; a weak clone at 0.037; a strong one above 1.0. Say the goal out loud:
   **find pP6 clones that match or beat pJ19**, because those go forward into part families.

## Follow-up work this video creates

Because there is no separate equipment short, **this video is the Tecan's training
material.** Its QR code needs to reach it, and the page needs to be written from it.

**Write `docs/trainings/tecan_mnano.md` from this footage.** Transcribe the Tecan segment
into a real training page — access rules, procedure, care — so the Mandatory QR code lands
somewhere useful. Right now the video and the page can be produced from the same take, and
that is the efficient moment to do both.

## Watch out

- Don't film a real student's data with their name attached.
- Confirm the fluorescein settings and USB workflow on the day; this is exactly the detail
  that is undocumented and will otherwise be guessed at on camera.

## Quiz impact

None required — the existing quiz covers RPU, the calculation, backbone control, and
consistency.
