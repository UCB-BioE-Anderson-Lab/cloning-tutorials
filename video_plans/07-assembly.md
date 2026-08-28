# 7. Assembly (Golden Gate)

- **Page:** `docs/wetlab/assembly.md`
- **Proposed ID:** `pP6-2026-7-Assembly`
- **Prior version:** ⚠️ **pP6-2022-4-Assembly exists but is NOT embedded**
- **Runtime:** 3–4 min
- **Advance prep:** cleaned `z79` DNA; T4 ligase and BsaI from the cold block
- **Hosting:** Kaltura

## Status first

Video exists, placeholder sits commented out at `docs/wetlab/assembly.md:135`. Embed first.

## Why film this

Honestly: the bench work is four pipetting steps into one tube and could be a paragraph.
The value is almost entirely in the **concept shot** — that this is a plasmid being closed
back into a circle by ends it created itself during PCR. Weight the video accordingly:
more diagram, less pipetting.

## Shots

1. **What assembly means** (~30 s) — joining DNA molecules into one. Golden Gate uses a
   type IIS enzyme (BsaI here) to cut at defined positions and T4 ligase to join. One-pot,
   in a thermocycler.

2. **The special case** (~60 s) — the important idea, over `pP6_GG_scheme.png`. We have
   **one** fragment, not several. The PCR primers built BsaI sites into both ends; when BsaI
   cuts, the ends are **complementary to each other**, so the linear product closes into a
   circle. Input and output are the same plasmid in linear and circular form. Say "EIPCR"
   and say it means this.

   Worth adding out loud: the BsaI recognition site is **removed** by the cut, so the
   product cannot be re-cut. That is why the reaction can run cut-and-ligate cycles.

3. **Set up the reaction** (~90 s) — the page's order, enzymes last:

   | Volume | Reagent |
   |--------|---------|
   | 6 µL | ddH₂O (white rack) |
   | 1 µL | 10× T4 ligase buffer (red) |
   | 2 µL | `z79` — your cleaned PCR DNA |
   | 0.5 µL | T4 DNA ligase |
   | 0.5 µL | BsaI |

   **Say why enzymes go last:** adding them into pure water or an incomplete mix denatures
   them. 10 µL total, matching what a transformation needs.

   Show pipetting **0.5 µL** accurately — a callback to the Pipetting video and the hardest
   volume in the whole experiment. Show the liquid riding up the tip.

4. **Label and pool** (~20 s) — label `a79`. All reactions from a section go into a single
   thermocycler block together.

5. **The GG1 program** (~30 s) — on screen as text, not a menu:
   ```
   cycles of  37°C (BsaI cuts)  ↔  16°C (T4 ligase joins)
   then       extended 37°C
   then       65°C heat inactivation
   ```
   Say what each temperature is *for*. The alternation is the clever part of Golden Gate and
   it is invisible unless narrated.

6. **What's next** (~15 s) — `a79` is now circular pP6, ready to transform.

## Watch out

- Mixing after setup matters — quiz question 2 turns on it. Show the mix.
- Don't over-explain Gibson. The page mentions it for contrast; the experiment doesn't use it.

## Quiz impact

None required.
