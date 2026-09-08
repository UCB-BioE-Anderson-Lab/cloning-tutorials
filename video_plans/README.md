# pP6 Wetlab Demo Video Series — Production Plan

One video per wetlab tutorial section, 1:1 with the nav in `mkdocs.yml`. Each plan file
says what the video covers, what has to be on screen, what has to be said, and — most
importantly — what has to be **prepared in advance** so the shot is possible at all.

These are production notes, not student content. This folder sits outside `docs/` on
purpose so mkdocs does not build it into the site.

## How this folder is organized

Plans are filed by what each one actually needs. Filenames keep their nav number, so the
number always tells you which page the video belongs to.

```
reshoot/      6 items that need a camera  ← the shoot list
reuse/        5 where the 2022 video stands; the work is embedding, not filming
backlog/      make later
not-planned/  deliberately not making; kept for the reasoning
```

- **`reshoot/`** — 01-safety, 05-gel, 08-transformation, 09-pick, 12-bestp-tecan,
  plate-pouring
- **`reuse/`** — 02-pipetting, 04-pcr, 06-cleanup, 07-assembly, 10-miniprep
- **`backlog/`** — 03-intro
- **`not-planned/`** — 11-sequencing, 13-equipment-training

`plate-pouring` is the one plan with no nav number: it is a **supervisor** procedure off
`docs/trainings/plate_pouring.md`, not a wetlab tutorial section, so it takes the
`B144-Equip-` naming from plan 13 rather than a `pP6-2026-n`. It is in `reshoot/` because
it is on the Saturday shoot list, not because a prior version exists.

Note that `reuse/` still carries real work: **Zymo, Assembly and Miniprep have finished
2022 videos that are not embedded on their pages.** That is a text-only task and the
cheapest win available.

---

## ⚠️ Saturday 29 Aug 2026 — read this before anything below

Everything below this section was written before the session had a shape. It now has one,
and it removes most of the shoot list. **The binding constraint is that there is no
biological material.**

> JCA, 28 Aug: *"Some of these, like pick we won't be able to do. We can pretend to do the
> tecan, but we won't have real cells... Colonies aren't something we can just throw
> together."*

Nothing that needs a colony, an overnight culture, or a grown 24-well block can be filmed
on Saturday — and the part that changed is that **there is no in-lab day immediately after
it.**

### Sunday is no longer in the lab

QB3's rules bar these students from B144 on weekends and after 9 pm. Sunday 30 Aug becomes
a **Zoom meeting for the facilitator-roles slideshow only**, and the **lab tour moves to the
FERB TA onboarding session** during the week. Two consequences:

- The pairing in [Shooting order](#shooting-order) — shoot 8 Saturday, incubate overnight,
  shoot 9 Sunday off the same plate — **is dead as written.** The plate survives; the
  Sunday shoot does not. See "Prep that unlocks a later shoot" below.
- **Video 1 splits across two days.** Part A (the walking tour) belongs at the FERB TA
  session, where the room is being walked anyway. Part B (the rules, static, at a bench) is
  shootable Saturday. Splitting the *shoot* does not split the *video* — it is still one
  cut.

### Enzo's Saturday agenda, sorted into footage and not-footage

| Agenda item | Footage? |
|---|---|
| Tecan training with JCA | ✅ **Yes — instrument operation only**, dummy plate. Plan 12. |
| Pouring plates | ✅ **Yes** — new plan, `reshoot/plate-pouring.md`. Supervisor procedure. |
| Making gels | ✅ **Partly** — casting and loading. Plan 5. |
| Transformation (glass beads) | ✅ **Yes** — technique only; nothing has to grow. Plan 8. |
| Growing control strains | ⛔ **Prep, not footage** — and the thing that unlocks `pick`. See below. |
| New inventory system walkthrough | ⛔ **Agenda item.** Onboarding for the people in the room. No plan file. If it ever wants a video it belongs with `docs/tools/inventory_manager.md`, not in the pP6 wetlab series. |
| JCA approving the Troubleshooting and Procedure docs | ⛔ **Agenda item.** A review, not a shoot. |

### Shootable Saturday

1. **`01-safety` Part B — the rules.** Advance prep is "none, shootable cold," so it is the
   safe first item and it protects the day against everything else slipping. Part A waits
   for the FERB session.
2. **`08-transformation` — the whole video.** Technique only; **nothing has to grow.** Needs
   a frozen TSS aliquot, DNA, carb plates, sterile glass beads, and the EchoTherm at
   temperature. The plates it produces are the day's most valuable byproduct — see below.
3. **Plate pouring** — new, from Enzo. Needs agar poured that morning. Note it is filmed at
   the **chemical hood**, not the sterile bench (the burner needs the only gas line in the
   lab), and it carries a **supervisor-only** banner. Film it as a supervisor procedure with
   supervisor hands.
4. **`05-gel` — casting and loading.** Both work with a ladder alone. See the plan for what
   a real PCR product would add and how to get one on the day.
5. **`12` — the Tecan segment only**, on a dummy plate. Instrument operation is
   sample-independent; BestP is not. See plan 12.

### Not shootable Saturday

- **`09-pick`.** Needs a plate of overnight green colonies. Picking a faked dot teaches the
  wrong thing — the skill in this video is *judging* isolation, size, satellites and
  brightness, and there is nothing to judge on a plate that was staged. No plate, no shoot.
- **`12-bestp-tecan` as a whole.** The BestP half wants 7 plasmids transformed, 4 colonies
  each into a 24-well block, grown overnight. The sample *is* the content there.

### Prep that unlocks a later shoot

Saturday cannot film `pick` or BestP, but it can **start** them, and that is worth more than
another take of anything else:

- **The transformation filmed for video 8 produces real plates.** If the DNA transformed on
  camera is an **archived pP6 assembly or library prep** rather than an arbitrary control
  plasmid, those plates come up as a genuine range of green intensities — which is exactly
  what `09-pick` needs and cannot fake. ⚠️ **Check whether such a stock exists before
  Saturday.** If it does, transform *that*; the shoot costs nothing extra.
- Somebody has to pull the plates from the incubator Sunday and refrigerate them, and the
  students cannot be in the building. **This needs JCA's own access, not theirs.**
- Parafilmed and inverted at 4 °C, plates hold for several days, but **satellites keep
  growing and green dims.** The nearer the FERB session is to Saturday, the better the plate.
- **Growing control strains** (Enzo's item) is the same category: prep, not footage. It is
  also the input to a BestP block. A block must be inoculated the **evening before**
  whichever session films the Tecan read — again, an access question, not a filming one.

### Open — do not settle these on the day

- **Hosting.** See [Hosting](#hosting--recommendation-needs-your-call); the plans currently
  disagree with each other and with the recommendation. Needs JCA.
- **When `pick` and BestP get shot.** Their material must be started the day before
  whichever session films them, and the next in-lab day is the **FERB TA session, whose date
  is not set.** Everything above about plate age depends on that date.

---

## What already exists (read this before planning a reshoot)

`docs/wetlab/intro.md` lists a complete 2022 series in the bCourses Media Gallery:

| # | Title | Embedded? | Verdict |
|---|-------|-----------|---------|
| 1 | pP6-2022-1-PCR | ✅ `pcr.md` | **Reuse** — confirmed fine |
| 2 | pP6-2022-2-Gel | ✅ `gel.md` | ❌ **Reshoot** — rigs/supply/fridge changed |
| 3 | pP6-2022-3-Zymo | ❌ commented out | **Reuse** — embed it |
| 4 | pP6-2022-4-Assembly | ❌ commented out | **Reuse** — embed it |
| 5 | pP6-2022-5-Transformation | ❌ commented out | ❌ **Reshoot — superseded** |
| 6 | pP6-2022-6-Pick | ❌ commented out | ❌ **Reshoot** — JCA's call |
| 7 | pP6-2022-7-Miniprep | ❌ commented out | **Reuse** — embed it |
| 8 | pP6-2022-8-Sequencing | ❌ commented out | **Reuse** — embed it |
| 9 | pP6-2022-9-Sequence Analysis | ❌ no slot on any page | **Reuse** — needs a slot |

**Seven of the nine already-shot videos are not embedded.** Every one of those pages ends
in a commented-out `<iframe>` with a placeholder YouTube ID.

**Six of the nine are reusable** — PCR, Zymo, Assembly, Miniprep, Sequencing, and Sequence
Analysis. Five of those six just need their placeholder uncommented and the real embed
dropped in: a text-only change, no filming. Do that first; it is the cheapest coverage in
this whole plan.

⚠️ **Gel is a live liability.** The 2022 version is embedded and on the site right now,
showing gel rigs, a power supply, and a storage fridge the lab no longer has. Students are
being shown the wrong equipment today, which makes it the most urgent of the reshoots even
though the page technically "has a video."

**Three of the nine are dead:** Gel, Transformation, and Pick all need reshooting.

## Status — JCA's call, this is the shoot list

| # | Section | Status |
|---|---------|--------|
| 1 | **Safety + lab tour** | 🔴 **REMAKE** — Donner footage unusable |
| 2 | Pipetting | ⚪ Leave as is |
| 3 | Intro | 🟡 Make later |
| 4 | PCR | ⚪ Leave as is |
| 5 | **Gel** | 🟠 **REMAKE — instrument changes** (new rigs, new power supply, new gel fridge) |
| 6 | Zymo Cleanup | ⚪ Leave as is |
| 7 | Assembly | ⚪ Leave as is |
| 8 | **Transformation** | 🔴 **REMAKE** — EchoTherm, no flames |
| 9 | **Colony Picking** | 🔴 **REMAKE** |
| 10 | Miniprep | ⚪ Leave as is |
| 11 | Sequencing | ⚫ Not making — may already exist |
| 12 | **BestP + Tecan** | 🔴 **REMAKE — one video, BestP done on the Tecan** |
| 13 | Equipment shorts | ⚫ Not making (Tecan is covered by video 12) |

**Five to shoot: 1, 5, 8, 9, 12.** Everything else is reuse, later, or dropped.

Note that 12 is now a **single** video — BestP performed on the Tecan — rather than a BestP
video plus a separate Tecan equipment short. That also means the Tecan's Mandatory QR gets
its content from video 12, and `docs/trainings/tecan_mnano.md` should be written from that
footage.

### The triage rule this implies

For each remaining 2022 video, ask: **does the shot establish location, or only procedure?**

- **Tight on hands, tubes, columns, and benchtop** → room-agnostic → **reuse**. Zymo,
  Assembly, Miniprep and the ApE analysis screen capture are all in this category. A
  silica column looks the same in any building.
- **Shows the room, walks between stations, or points at where something is kept** →
  **reshoot, or re-cut to drop the establishing shots.** Watch for incidental Donner
  giveaways: door signage, bench layout, freezer banks, window views, room numbers.
- **Shows retired equipment or a changed method** → **reshoot.** Transformation is the
  known case; check Gel for the rig and Pick for the blue-light setup.

Screening the seven unembedded videos against this rule is a sit-down-and-watch task, not a
filming task, and it should happen before any camera comes out — it determines the shoot list.

## Naming

Follow the established convention: `pP6-<year>-<n>-<Name>`, numbered by wetlab section.
A 2026 series would be `pP6-2026-1-Safety` … `pP6-2026-13-Equipment`. Keeping the number
aligned to the nav position means a video's name tells you which page it belongs on.

Note the 2022 series numbered from PCR=1. The nav numbers PCR=4. **Recommend numbering by
nav position going forward** and accepting the one-time discontinuity, since the nav
number is the thing students actually see.

---

## Hosting — recommendation, needs your call

The repo already uses two patterns:

- **Kaltura + bCourses** (`kaf.berkeley.edu` iframe) — the pP6 PCR and Gel videos.
  `docs/wetlab/pcr.md` carries an access note: restricted to BioE 140L and iGEM via CalNet.
- **YouTube** (`youtube.com/embed`) — your own design walkthroughs in
  `docs/construction/mutagenesis.md` and `docs/planning/sequence_analysis.md`, plus the
  three safety QR codes in `docs/assets/qr_registry.csv`, which already point at public
  YouTube videos.

Recommendation: **split by audience, not by convenience.**

- **Course procedural videos (4–12)** → Kaltura, matching PCR and Gel. Cohort content,
  CalNet gate is appropriate, nothing enters the repo.
- **Safety (1), Pipetting (2), and all equipment shorts (13)** → YouTube unlisted. These
  are reached by **scanning a QR code off a machine or a wall sign**. A CalNet login
  prompt in front of someone who needs the eye wash is the wrong failure mode, and the
  QR registry's existing safety entries are already public YouTube links.

**Do not commit video files to the repo.** GitHub Pages has a 1 GB site limit and a soft
100 MB per-file cap; the largest tracked file today is a 24 MB `.ai`. A few minutes of
1080p would dominate every clone of the repo.

### ⚠️ Still open, and the plans currently contradict each other

This is a decision for JCA, not one to make on a shoot day. Three things are unresolved:

1. **Safety (1) is the sharp case.** The recommendation above sends it to YouTube unlisted
   because it is reached by QR off wall signage. But it is also the page a prospective
   student, a visiting instructor, or an EH&S reviewer is most likely to open cold — and a
   **CalNet gate makes safety content unreachable to a visitor**, which is arguably wrong
   for safety specifically, whatever is right for the rest of the series. The wetlab
   precedent points the other way: `gel.md` and `pcr.md` are the **only two live embeds in
   `docs/wetlab/`** and both are Kaltura.
2. **Plan 12 breaks the "4–12 → Kaltura" rule** and says YouTube, because the Tecan's
   Mandatory QR has to reach it from the bench. That is a good reason, but it means the
   rule as written is already wrong — the real rule is "anything a QR points at must be
   ungated," and that cuts across the 4–12 range rather than stopping at it.
3. **Plate pouring** inherits the same question: it is supervisor content reached from a
   training page, not cohort content reached from bCourses.

Until this is settled, the `Hosting:` line in each plan is a **proposal, not a decision.**

---

## Hard production constraint: most of these need pre-staged material

This applies **only to the videos that actually need reshooting** — most of the back
catalogue is a watch-and-embed job. But for anything that does go in front of a camera,
material has to exist first, and some of it takes overnight growth:

| Video | Needs, and when it must be started |
|-------|-----------------------------------|
| Gel (5) | A finished PCR product. Run a PCR beforehand or use a stock tube. |
| Zymo (6) | A PCR product to clean up. |
| Assembly (7) | Cleaned `z` DNA. |
| Transformation (8) | Assembled DNA + a thawed competent cell aliquot. |
| Pick (9) | **A plate with green colonies — transformed and grown overnight.** |
| Miniprep (10) | **A saturated 4 mL culture — inoculated the night before.** |
| Sequencing (11) | A returned `.seq`/`.ab1` file. Use an archived one. |
| BestP (12) | A 24-well block grown overnight + the Tecan. |

You can cheat honestly: film each step with **stand-in material that looks right** and say
so nowhere on camera, since the procedure — not the provenance of the tube — is what is
being taught. But the plate of green colonies for Pick and the overnight culture for
Miniprep have to physically exist. Those are the two that need something started the day
before filming.

**Safety (1), Pipetting (2), and the equipment shorts (13) need none of this.** They can be
shot cold with nothing prepared — which, combined with Safety having no reusable Donner-era
ancestor, makes them the obvious content for a first session.

The two that do need prep are the two that must be reshot anyway: **Transformation (8)**
needs a competent cell aliquot, and **BestP/Tecan (12)** needs an overnight 24-well block.

---

## Shooting order

> ⚠️ **Superseded for Saturday 29 Aug by
> [the session section above](#-saturday-29-aug-2026--read-this-before-anything-below).**
> What follows is the general ordering logic and stays correct for any session that *does*
> have biological material. The Saturday-specific version — and in particular the fact that
> the overnight pairing at the bottom of this section no longer has a Sunday to land in —
> is up there.

Five videos need a camera. Two can be shot cold; three need biology started beforehand.

**No advance prep — shoot these first:**

1. **Safety + lab tour (1)** — the biggest gap and the top priority. Donner footage is
   unusable and nothing replaces it. Needs the room quiet. Longest single item.
2. **Gel (5)** — chemistry unchanged, but new rigs, a new power supply and a new gel fridge
   are all in frame. ⚠️ **Re-confirm the 175 V / ~10 min setting against the new supply
   before rolling**, and update `docs/wetlab/gel.md` if it changed.

**Needs material started the day before:**

3. **Transformation (8)** — a competent cell aliquot and the EchoTherm at temperature.
   Glass beads only; no flames on camera.
4. **Colony Picking (9)** — ⚠️ **a plate of green colonies, transformed and grown
   overnight.** There is no substitute, and no plate means no shoot. Plate more than one.
5. **BestP on the Tecan (12)** — an overnight 24-well block. The heaviest prep of the five,
   and realistically its own session.

**Pairing that saves a day:** the transformation filmed for video 8 can be the transformation
that produces video 9's plate. Shoot 8, incubate overnight, shoot 9 the next day off the
same plate. ⚠️ **This is the pairing Sunday's change breaks** — the plate still gets made
Saturday, but the shoot that would consume it has moved to the FERB TA session, days rather
than hours later. See the Saturday section for what that costs.

Everything in `reuse/` is a watch-and-embed task, not a filming task.

---

## Issues found in the written curriculum while planning

Scope note: this series covers the **wetlab** tutorials. Findings in `docs/construction/`
and in the equipment training pages are out of scope and are not tracked here.

### Resolved — already fixed in `docs/`

1. ✅ **`transformation.md` directed students to flame-sterilized metal spreaders.** That is
   a supervisor-only technique students do not perform. The section has been rewritten to a
   single glass-bead method, with sterility coming from a 70% ethanol wipe-down and a note
   that flames have no place at the sterile bench. **The video must be reshot to match** —
   see plan 8.

2. ✅ **The full plating procedure was missing.** `transformation.md` had four terse bullets
   with the steps in the wrong order (cells before beads). It now documents the real
   procedure: sterile bench → 70% ethanol wipe-down → label → ~10 beads → 50–200 µL cells →
   **cap and shake side to side, never swirl** → pour beads through a funnel for reuse →
   invert into the incubator.

3. ✅ **`pcr.md` called EIPCR "Error-prone Inverse PCR".** It is **Enzymatic** Inverse PCR —
   the randomness comes from degenerate primers, not polymerase error. Fixed.
   `intro.md` and `assembly.md` were already correct.

**On flames generally:** they still exist in the lab, but are **supervisor-only and not
done at the sterile benches**. `docs/wetlab/safety.md` can keep Bunsen burners in its
hazard list and the safety quiz needs no edit — JCA still discusses burners and may use one
alongside a student. What changed is that the tutorials no longer *direct* students to a
technique they will not perform. These pages are written for students without EH&S
training, possibly freshmen, so they teach the lower-safety-bar method that is actually
theirs to do.

4. ✅ **The protocol builder still had flames in the student path.**
   `docs/protocols/modules/` is the machine-readable twin of the wetlab pages, and two
   modules contradicted the corrected `transformation.md`:
   - `heat_shock_transformation.js` — the transformation protocol itself — told students to
     dry plates "uncovered **near the flame**". Now reads "uncovered **at the sterile bench**".
   - `growing_bacteria_with_flasks.js` — opened with "At a sterile bench **with a flame**",
     directly contradicting the new no-flames-at-the-sterile-bench rule. Flame removed.

   Both were pure deletions; no technique was invented to replace them.

### Open — needs a decision

5. ✅ **The plate-pouring protocols named the wrong room.** `pouring_petri_dishes.js` and
   `large_petri_dishes.js` both said to set up "on the **sterile bench**" and then light a
   Bunsen burner there. The burner requires gas, and the **chemical hood has the only gas
   line in the lab** — so pouring physically cannot happen at the sterile bench. Both
   modules now direct the user to the chemical hood and say why.

   Both also gained a **Supervisor-only** banner at the top of the generated protocol,
   naming the burner, the hood, and the Flame Sterilization prerequisite. Previously that
   gate existed only on `docs/trainings/plate_pouring.md`, so a protocol reached directly by
   URL — or pulled in as an include — carried no warning at all. Since
   `heat_shock_transformation.js` declares `optional: ["pouring_petri_dishes"]`, the student
   transformation protocol could pull plate pouring in silently; the banner now travels with
   it. Whether to drop that include entirely is still a judgement call, but it is no longer
   unlabelled.

6. ⚠️ **`docs/trainings/tecan_mnano.md` is one line** — "Contact JCA for in person training" —
   while the QR registry marks it Mandatory and the QR on the machine is live. No written
   procedure exists to shoot from, so this video defines the page rather than following it.
   See plan 12.
