# 4. Polymerase Chain Reaction

- **Page:** `docs/wetlab/pcr.md`
- **Proposed ID:** `pP6-2026-4-PCR`
- **Prior version:** ✅ **pP6-2022-1-PCR — already embedded, and confirmed fine by JCA**
- **Runtime:** 4–5 min
- **Advance prep:** Training1 box tubes; a lab sheet filled out to the point of setup
- **Hosting:** Kaltura, matching the existing embed

## Status: DONE — do not film

JCA has confirmed the 2022 PCR video is still good, and it is already embedded on the page.
**This section needs nothing.**

The shot list below is retained only as a coverage reference — useful if the procedure
changes later, or as a template for how the other bench videos are structured.

## Shots

1. **Fetch the sources** (~45 s) — go to the enzyme freezer, open the **pink `Training1`
   box**, pull the three tubes: primer F (`Training1/A*`), primer R (`B*`), template pJ12
   diluted 20× (`C*`). Say the tube numbers get written on the lab sheet. This shot exists
   because "where do I get the DNA" is the question the page answers in a table that
   students skim past.

2. **Read the lab sheet** (~45 s) — on camera, over the actual sheet. Show the three blocks:
   Sources, PCR Samples, Reaction Setup. Show writing the assigned number (e.g. `79`) on the
   **PCR tube cap**.

3. **Set up the reaction** (~2 min) — the core shot. Pipette in the page's exact order,
   naming each volume as it goes in:

   | | Volume | Reagent |
   |-|--------|---------|
   |1| 32 µL | ddH₂O (white rack) |
   |2| 10 µL | 5× PrimeSTAR GXL Buffer (green cap) |
   |3| 4 µL | dNTP mixture (yellow cap) |
   |4| 1 µL | 10 µM primer 1 |
   |5| 1 µL | 10 µM primer 2 |
   |6| 1 µL | pJ12 template |
   |7| 1 µL | **PrimeSTAR GXL polymerase — from the cold block, added last** |

   **Say why the enzyme is last and why it comes off a cold block.** That is the reasoning
   the page states in the Assembly section but not here, and it is the single most
   transferable idea in the shot.

4. **Mix and spin** (~20 s) — slam the tube on the bench, quick spin. Same motion taught in
   Pipetting; call back to it explicitly.

5. **Load the thermocycler and run PG4K45** (~45 s) — show selecting the existing program.
   **Say clearly: do not add or edit programs on the thermocycler.** Put the cycle
   parameters on screen as text rather than filming a menu:

   ```
   98°C 2 min
   30× ( 98°C 10 s → 55°C 15 s → 68°C 4 min )
   68°C 5 min
   ```

6. **What you made** (~30 s) — a ~3583 bp linear product with BsaI sites at both ends,
   which the Assembly step will close into a circle. One sentence pointing forward.

## Watch out

- The primers are degenerate — every product is different. Worth one line: "no two students
  in this room will make the same molecule."
- The page calls EIPCR both "Enzymatic Inverse PCR" (intro.md) and "Error-prone Inverse PCR"
  (pcr.md). **These are not the same thing and the method here is the enzymatic one** — the
  randomness comes from degenerate primers, not from polymerase error. Say "enzymatic" on
  camera and fix `pcr.md` to match.

## Quiz impact

None required.
