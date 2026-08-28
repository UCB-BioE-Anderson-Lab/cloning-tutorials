# 6. Zymo Cleanup

- **Page:** `docs/wetlab/cleanup.md`
- **Proposed ID:** `pP6-2026-6-Zymo`
- **Prior version:** ⚠️ **pP6-2022-3-Zymo exists in the Media Gallery but is NOT embedded**
- **Runtime:** 4–5 min
- **Advance prep:** a PCR product to clean; Zymo kit; microfuge
- **Hosting:** Kaltura

## Status first

**A video already exists and the page has a commented-out placeholder where it belongs.**
Embedding `pP6-2022-3-Zymo` at `docs/wetlab/cleanup.md:250` is a text-only change. Do that
before considering a reshoot.

## Why film this

Every step is a spin, and every spin looks identical on camera. The thing that actually
goes wrong is **losing track of which tube holds the DNA** — the page warns about it twice.
A video can show the flow-through being discarded correctly three times and then show
someone discarding the wrong thing. That is the whole reason this video exists.

## Shots

1. **Why clean up** (~30 s) — PCR leaves dNTPs, active polymerase, buffers and salts.
   Polymerase in particular will **fill in the sticky ends BsaI is about to make**,
   killing the Golden Gate. Cause and effect, one sentence.

2. **How it works** (~45 s) — over `zymo_cleanup_steps.png`. DNA binds silica in
   chaotropic salt (guanidinium thiocyanate in ADB), which also denatures the polymerase.
   Bind → wash → dry → elute.

3. **Where is my DNA?** (~30 s) — the framing shot for the whole video. Hold up a column
   and a collection tube and say which one holds the DNA at each stage. Then repeat that
   phrase at each step below.

4. **The procedure** (~2 min) — the page's exact numbers, spoken:
   - 180 µL **ADB** (brown bottle) into the PCR reaction
   - Transfer to the **Zymo column**
   - Spin full speed **15 s**, discard flow-through *(DNA is on the column)*
   - 200 µL **PE**, spin **15 s**, discard
   - 200 µL **PE again**, spin **15 s**, discard
   - Spin **90 s** dry, discard *(residual ethanol is the enemy — say so)*
   - Column into a **clean 1.5 mL tube**; add **25 µL EB directly to the centre of the
     matrix**, not down the walls
   - Spin **45 s** *(DNA is now in the tube, the column is trash)*

   **Hold the elution shot.** Tip touching the centre of the white membrane, liquid soaking
   in. Then show the wrong way — liquid down the side wall — and say it costs yield.

5. **The mistake** (~30 s) — deliberately discard the tube containing eluted DNA, catch it,
   and say it out loud. This is the single most common failure and no amount of bold text
   on the page prevents it.

6. **Label and log** (~30 s) — the lab sheet says tube `z79`, side label `P6 z79`, 25 µL
   elution, destination `zymos1/___`. Show writing both labels and recording the box
   position.

7. **Optional: why EB over water** (~20 s) — EB is a dilute Tris buffer; pure water absorbs
   CO₂, turns slightly acidic, and recovery drops.

## Watch out

- Two PE washes, not one. Easy to lose count on camera; count them aloud.
- The 90 s dry spin is the step people skip. Say what carried-over ethanol does downstream.
- The page's note about small fragments (<250 bp, 1 part ADB + 3 parts isopropanol) is out
  of scope for pP6 at 3583 bp. Skip it on camera.

## Quiz impact

None required.
