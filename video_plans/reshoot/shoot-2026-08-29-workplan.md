# Shoot Workplan — Control Strains, Plate Pouring, 2YT Broth

**Saturday 29 Aug 2026, 10:00 · B144 Stanley · print this and take it to lab**

Four videos come out of this shoot. They are filmed **interlaced**, not one after another,
because the same bench setup feeds more than one of them. Every clip below is slated with a
slug so the footage can be sorted afterwards.

| Code | Video | Lands on |
|---|---|---|
| `POUR` | Plate Pouring (supervisor) | `docs/trainings/plate_pouring.md` |
| `BROTH` | Making 2YT Broth | no page yet — see Gaps |
| `CTRL` | Control Strains (day 1 + day 2) | no page yet — see Gaps |
| `MW` | Microwave short | `docs/trainings/microwave.md` |

`MW` is harvested, not shot separately: one clip in PASS 4 serves it.

---

## 1. The numbers

Everything below is computed from the Protocol Builder's own arithmetic
(`pouring_petri_dishes` at **20 plates** → **2 × 250 mL bottles**, ~25 mL per plate).

### Media

| Bottle | Route | Protocol |
|---|---|---|
| LB agar #1 | **Fresh** — powder + DI, pressure cooker, 20 min high pressure | Protocol 1 |
| LB agar #2 | **Re-melted** — solidified bottle off the shelf, microwave | Protocol 1 |
| 2YT × 4 | Fresh, same cooker run as LB agar #1 | ⚠️ **no protocol exists** |

The small pressure cooker holds **five 250 mL bottles**. One slot is LB agar #1, so **four
are free for 2YT** — that is where the interlacing pays for itself. One cooker run, one
setup, two videos.

### 1000× antibiotic stocks

Straight out of `preparation_of_antibiotic_1000x_stock`. A 1000× stock in mg/mL is the same
number as the working concentration in µg/mL, so **carbenicillin 100 mg/mL → 100 µg/mL in the
plate**.

| Antibiotic | 1000× stock | µL solvent per mg | If you weighed 50 mg | Solvent | Light |
|---|---|---|---|---|---|
| Carbenicillin | **100 mg/mL** | 10 | 500 µL | water | — |
| Ampicillin | **100 mg/mL** | 10 | 500 µL | water | — |
| **Spectinomycin** | **100 mg/mL** | 10 | 500 µL | water | — |
| Kanamycin | **25 mg/mL** | 40 | **2000 µL** | water | protect |
| Chloramphenicol | **25 mg/mL** | 40 | **2000 µL** | water | protect |
| Tetracycline | **10 mg/mL** | 100 | **5000 µL** | ethanol | protect |
| Erythromycin | — | — | — | — | — |

The fourth column is arithmetic, not a target: you weigh what you scooped and compute from
that. Two things in the table need settling before they are said on camera — see Gaps 3 and 6.

### Splitting the agar

500 mL total → **four sterile vessels at 125 mL each**. The protocol requires one clean
vessel per antibiotic combination; 125 mL is exactly half a bottle, so the split is by eye
against the side graduations, which is what the protocol says to do.

| Vessel | Agar | 1000× stock added | Plates @ 25 mL |
|---|---|---|---|
| Carbenicillin | 125 mL | **125 µL** | 5 |
| Erythromycin | 125 mL | **125 µL** | 5 |
| Kanamycin | 125 mL | **125 µL** | 5 |
| Plain LB | 125 mL | none | 5 |
| | **500 mL** | | **20** |

**Pour order: carb → erythromycin → kan.** Plain LB whenever.

### Plate budget

| Plate | Matrix | Sterility | Transformation | Cells-only | No-rescue split | Used | Poured | Spare |
|---|---|---|---|---|---|---|---|---|
| Carb | 1 | 1 | 1 | 1 | — | 4 | 5 | 1 |
| Erythromycin | 1 | 1 | 1 | 1 | — | 4 | 5 | 1 |
| Kanamycin | 1 | 1 | 1 | 1 | **1** | 5 | 5 | **0** |
| Plain LB | 1 | 1 | — | — | — | 2 | 5 | 3 |
| | | | | | | **15** | **20** | **5** |

⚠️ **Kanamycin has no spare** because it carries the no-rescue split. If you want slack,
pour 6 kan and 4 plain LB — the spare LB plates cannot substitute for a kan plate.

**Spectinomycin is in the stock-prep clips but not in the plates.** As written it is prepared
on camera alongside carb, kan and erythromycin — which is where it teaches the most, since it
is arithmetically identical to carb and that contrast is the lesson. Giving it a *plate* arm as
well means a fourth control strain, a fourth transformation, and five conditions instead of
four: **3 bottles / 750 mL / 30 plates at 6 per condition.** That is one more cooker slot and
about twenty more minutes. Say the word and it is a small edit.

The **matrix** row is the 3×4 grid: each plate sectored in three, one control strain per
sector, so three strains × four conditions costs four plates instead of twelve.

---

## 2. Slates

Write the slug on paper in marker, hold it in frame for two seconds at the head of the clip,
**and say it out loud.** The spoken slate is what saves you when the paper is out of focus —
and it doubles as a caption boundary later.

Add the take number when you go again: `CTRL-05 T2`.

Pre-write or pre-print the slate cards before 10:00 — **Section 8** is the full set, in order,
and the HTML version prints them one to a page at a size that reads on camera. Writing 50 cards
on the day is the single easiest way to lose an hour.

---

## 3. Timetable

The shape of the day is set by one thing: **the pressure cooker is 20 minutes at pressure
plus a natural release**, and everything in PASS 2 and PASS 3 exists to fill that window.
Protocol 1 also notes the cooker will **hold ~55 °C for hours** once it is off — so it is
also the holding bath that keeps the agar pourable.

| Pass | Time | Location | What | Clips |
|---|---|---|---|---|
| 1 | 10:00–10:30 | Media bench | LB agar + 2YT, interlaced → cooker | `BROTH-01…02`, `POUR-01…04` |
| 2 | 10:30–11:00 | Balance | Antibiotic 1000× stocks | `POUR-05…10` |
| 3 | 11:00–11:15 | −80 freezer | The box; retrieve strains + miniprep | `CTRL-01…02` |
| 4 | 11:15–11:25 | Microwave | Re-melt LB agar #2 | `POUR-11` |
| 5 | 11:25–12:25 | Chemical hood | Dose and pour 20 plates | `POUR-12…22` |
| — | 12:25–13:00 | — | Plates solidify. Break. | — |
| 6 | 13:00–13:20 | Sterile bench | Streak the matrix; set sterility plates | `CTRL-03…07` |
| 7 | 13:20–13:50 | Transformation bench | 4 reactions, heat shock, split the rescue | `CTRL-08…13` |
| 8 | 14:50–15:10 | Sterile bench | Plate everything | `CTRL-14…16` |
| 9 | 15:10–15:25 | Media bench | Parafilm spares; 2YT out of the cooker | `POUR-23…24`, `BROTH-03` |
| 10 | Day 2 | Incubator | Read the plates | `CTRL-17…23` |
| — | 13:50–14:50 | — | Rescue shaking 1 h — film the control-DNA clip here if PASS 7 ran long | — |


⚠️ **PASS 10 has no session to live in.** Sunday is Zoom-only and the students are locked
out of B144. It is twenty minutes of plates on a bench and it needs somebody with weekend
access and a camera — not a meeting.

---

## 4. Clip list

"Feeds" is the column that matters: a clip with two entries is filmed once and cut into both
videos.

### PASS 1 — Media bench · LB agar + 2YT interlaced · Protocol 1

| Slug | Clip | Feeds |
|---|---|---|
| `BROTH-01` | What 2YT is and what it is for in this lab | BROTH |
| `POUR-01` | What LB agar is; why a plate is solid and a broth is not | POUR |
| `POUR-02` | Label bottle, funnel, **1 level tablespoon** LB agar powder | POUR |
| `BROTH-02` | Label bottles, funnel, 2YT powder — the recipe is the gap, see Gaps | BROTH |
| `POUR-03` | Fill to the neck line with house DI, remove funnel, cap, shake — **do the LB and the 2YT bottles in one take** | POUR + BROTH |
| `POUR-04` | ~½–1 in water in the tray, bottles upright, "Beef"/"Sterilize", 20 min high pressure, natural release. Say **"sterilize immediately"** and why | POUR + BROTH |

### PASS 2 — Balance · antibiotic stocks · Protocols 2–5

One clip per solution. They are near-identical takes, which is the point: filmed back to back, the only thing that changes is the multiplier, and that is the whole lesson.

| Slug | Clip | Feeds |
|---|---|---|
| `POUR-05` | What a 1000× stock is; the dosing rule — **X µL per X mL**; mg/mL in the tube equals µg/mL in the plate | POUR |
| `POUR-06` | Tare, scoop ~50 mg, record the mass, **× 10 → µL of water**, dissolve, 0.22 µm, label | POUR |
| `POUR-07` | Identical arithmetic to carb — **100 mg/mL, × 10.** Filmed straight after carb, the point makes itself | POUR |
| `POUR-08` | **25 mg/mL, × 40** — four times the solvent per milligram, so scoop about **25 mg**, not 50. Protect from light | POUR |
| `POUR-09` | **The solvent discussion** — solvent is a property of the drug, not a preference | POUR |
| `POUR-10` | Ampicillin degrades in hot agar; same `bla` gene, so carbenicillin stands in | POUR |

### PASS 3 — −80 freezer

| Slug | Clip | Feeds |
|---|---|---|
| `CTRL-01` | Supervisor-only, and *why* — this is the irreplaceable material in the room | CTRL |
| `CTRL-02` | Three glycerol stocks + the control miniprep; time-out-of-freezer discipline; don't thaw the box hunting a tube | CTRL |

### PASS 4 — Microwave · Protocol 1 (re-melt section)

| Slug | Clip | Feeds |
|---|---|---|
| `POUR-11` | **Loosen the lid a quarter turn**, 30–60 s bursts, rest between, stop at boiling. Superheating — what it is and why it bites when you pick the bottle up | POUR + MW |

### PASS 5 — Chemical hood · pouring · Protocol 1

Each solution gets its own clip here too, so any single antibiotic can be recut on its own later — for a QR short, or when one of these numbers changes and only that clip has to be reshot. **~25 mL per plate**, or watch for the volume to break surface tension and spread.

| Slug | Clip | Feeds |
|---|---|---|
| `POUR-12` | **The burner needs the only gas line in the lab.** Supervisor-only; Flame Sterilization is the prerequisite | POUR |
| `POUR-13` | The upward convection column, and what it is actually doing | POUR |
| `POUR-14` | Split into four sterile vessels, 125 mL each — **one clean vessel per combination**, and carryover is the reason | POUR |
| `POUR-15` | The wrist test for ~55 °C, and why it is the whole ballgame. **Swirl, don't shake** | POUR |
| `POUR-16` | **Carbenicillin:** 125 µL of 1000× into 125 mL, swirl, pour 5 plates | POUR |
| `POUR-17` | **Erythromycin:** 125 µL into 125 mL, swirl, pour 5 plates | POUR |
| `POUR-18` | **Kanamycin:** 125 µL into 125 mL, swirl, pour 5 plates | POUR |
| `POUR-19` | **No additive:** pour 5. The control plate — the one that proves the others select | POUR |
| `POUR-20` | Hold the burner by the base and pass the flame over the surface | POUR |
| `POUR-21` | **Red stripes = carb, green = kan.** Erythromycin has no convention in the protocol — **pick one on camera and say it** | POUR |
| `POUR-22` | Lids back on, set aside to solidify, burner off | POUR |

### PASS 6 — Sterile bench · streaking

| Slug | Clip | Feeds |
|---|---|---|
| `CTRL-03` | Why the lab keeps them, and what they are for | CTRL |
| `CTRL-04` | Take material off a glycerol stock **without thawing it** | CTRL |
| `CTRL-05` | Sector each plate in three; all three strains onto LB / carb / erythromycin / kan | CTRL |
| `CTRL-06` | Label the four uninoculated plates and set them aside | CTRL |
| `CTRL-07` | Invert into the incubator | CTRL |

### PASS 7 — Transformation bench · Protocols 6, 7, 8

| Slug | Clip | Feeds |
|---|---|---|
| `CTRL-08` | The miniprep: **PCR positive control** (my primers or my reaction?) vs **transformation positive control** (my DNA or my cells?) | CTRL |
| `CTRL-09` | Short — references the transformation video rather than repeating it | CTRL |
| `CTRL-10` | Three control plasmids **plus a no-DNA cells-only control** | CTRL |
| `CTRL-11` | 10 min at 4 °C → **90 s at 42 °C** → 1 min at 4 °C | CTRL |
| `CTRL-12` | Pull half the kan reaction and plate it **now**, no outgrowth | CTRL |
| `CTRL-13` | **200 µL 2YT, 37 °C, 1 h** — and why the carb reaction skips it | CTRL |

### PASS 8 — Sterile bench · plating

| Slug | Clip | Feeds |
|---|---|---|
| `CTRL-14` | Each transformation on its matching antibiotic; glass beads, shake side to side | CTRL |
| `CTRL-15` | The no-DNA control onto each of the three antibiotics | CTRL |
| `CTRL-16` | Invert into the incubator | CTRL |

### PASS 9 — Storage · Protocol 9

| Slug | Clip | Feeds |
|---|---|---|
| `POUR-23` | Wrap the spare plates; inverted in the fridge; stable **1–2 weeks** | POUR |
| `POUR-24` | **Do not parafilm anything being incubated** — cells need airflow | POUR |
| `BROTH-03` | Cooling, labelling, and where it is stored | BROTH |

### PASS 10 — Day 2 · reading the plates

| Slug | Clip | Feeds |
|---|---|---|
| `CTRL-17` | Four plates side by side. **The diagonal grew and nothing else did** | CTRL |
| `CTRL-18` | A different failure from the matrix: contamination in the agar, the bottle, or the hood | CTRL |
| `CTRL-19` | **The no-rescue kan plate against the rescued one.** The rescue stops being a claim | CTRL |
| `CTRL-20` | Proves the cells are naive and the plate selects | CTRL |
| `CTRL-21` | Isolation, single colonies, morphology, contamination | CTRL |
| `CTRL-22` | Dead stock, agar too hot, wrong dose — which to suspect | CTRL |
| `CTRL-23` | Date, who poured, result | CTRL |


Say the split out loud on day 2, because it is what makes the grid legible:
**LB and the sterility plates test the plates. The matrix and the cells-only plates test the biology.**

---

## 5. Captioning — what to do on the day

Captions get added afterwards, but three of these are free now and impossible to retrofit.

**1. Narrate self-descriptively. This is the big one.** WCAG asks for an *audio description*
track when the picture carries information the audio does not (1.2.5, Level AA) — and a pair
of hands doing a procedure is exactly that. But the requirement **falls away entirely if the
narration already says everything the picture shows.** So: say the noun and say the number.
"Add 125 microliters of the 1000× carbenicillin stock," never "add this." One habit, and it
removes a whole deliverable from the back end.

**2. Nothing important on screen only.** A number that appears as a burn-in but is never
spoken is invisible to a screen reader and absent from the captions. If you say it, you don't
need the burn-in; if you burn it in, you still have to say it.

**3. Audio quality decides the captioning bill.** Both YouTube and Kaltura auto-caption and
you correct from there, so the correction time is set by how clean the audio is. The hood and
the microwave are the two loud locations — get the mic close to the speaker, and for PASS 4
and PASS 5 consider narrating the explanation separately from the noisy action.

**4. Hand the captioner the protocols.** The narration is largely the protocol text, so
Section 6 of this document is most of the transcript, pre-spelled. Send it with the footage.

**5. Speech recognition will mangle these every time.** Correct them once, globally:

> carbenicillin · erythromycin · kanamycin · ampicillin · chloramphenicol · spectinomycin ·
> tetracycline · EchoTherm · Mach1 · KCM · 2YT · LB agar · Pyrex · parafilm · petri ·
> microlitre/µL · OD600 · glycerol stock · miniprep · plasmid · aliquot · inoculate ·
> streak · satellite colony · sterile bench · chemical hood · Bunsen burner · 1000× stock ·
> 0.22 µm · bla · amilGFP

**6. One speaker at a time**, and if somebody off camera asks a question, **repeat it before
answering** — otherwise the caption carries an unattributed voice.

**7. Ten seconds of room tone per location.** Costs nothing, saves the audio cleanup.

**8. Day 2 especially.** "Which sector grew" is a purely visual judgement. Say which sector,
by name, every time.

---

## 6. Protocols

Verbatim from the Protocol Builder. Nothing here is paraphrased.

### Protocol 1 — Pouring Standard Petri Dishes — 20 plates

`pouring_petri_dishes`, **plates_needed = 20**. Both agar routes are included: the fresh pressure-cooker prep for bottle #1 and the microwave re-melt for bottle #2.

> Verbatim Protocol Builder output.

> **Supervisor-only.** Plate pouring requires a Bunsen burner and must be done in the
> **chemical hood** (the only gas line). Do not perform this procedure unless you are a
> supervisor who has completed **Flame Sterilization** training.

**Plan volumes**
- **Prepare:** **2 × 250 mL bottles** of LB agar (≈10 plates per bottle at ~25 mL/plate) for **20 plates**.

**Prepare LB agar (choose one)**
**Materials**
- LB Agar powder (media bench; tablespoon scoop inside)
- 250 mL Pyrex media bottles with caps
- Large funnel
- House DI water (sink across from the media bench; DI line)
- Pressure cooker (small or large) or microwave with liquid cycle
- Heat-protective gloves

**Procedure**
1. Label each 250 mL bottle with “LB Agar”, date, and initials.
2. Place a large funnel in each bottle. Add **1 level tablespoon** LB Agar powder per bottle.
3. Fill each bottle with **house DI water** to the line by the neck. Remove the funnel.
4. Cap and **shake to dislodge powder from the bottom**. Full dispersion not required; avoid powder stuck on the glass.
5. **Sterilize immediately.** Hydrated LB Agar is not sterile and will support growth if it sits.

**Pressure cooker (preferred)**

6. Put bottles upright on the cooker tray with **~1/2–1 inch water** in the tray (bottle bases in contact with water).
7. Small cooker: **“Beef”** setting. Large cooker: **“Sterilize”** setting.
8. Run **20 min at high pressure**. Allow pressure to release naturally; open the lid.
9. With heat gloves, tighten caps if needed and remove bottles. While still hot, **swirl or invert** to fully disperse and clear the bottom.

**Microwave (liquid cycle, alternate)**
- Use a **microwave liquid cycle** suitable for 250 mL bottles.
- Remove with heat gloves and **swirl while hot** to fully disperse.

**Cooling and use**
10. For pouring plates, cool to **~55 °C**. Practical check: if you can comfortably grasp the bottle without pain, it’s usually **55–65 °C**.
11. You may use a **55 °C water bath** if available (not typically set up in B144).
12. If not using immediately, **let bottles cool completely**. Leftover plain LB Agar may be kept by the sterile bench for small pours.

**Notes**
- Small pressure cooker holds **up to five 250 mL bottles**; large cooker fits **500 mL bottles** or additional 250 mL bottles.
- After a run, cookers continue to heat modestly until you **turn them off**.
- If set up in advance, the cooker can **hold ~55 °C** for hours until you remove your agar; this is also the target temperature for pouring plates.

**Procedure**
1. Loosen the bottle’s lid by about a quarter turn.
2. Heat in short 30–60 second bursts, resting between intervals, until melted.
3. Monitor closely as it nears melting and stop heating once boiling begins.
4. Allow to cool to **~55 °C** before adding antibiotics and pouring plates.

**Procedure**
1. Loosen the bottle’s lid by about a quarter turn.
2. Heat in short 30–60 second bursts, resting between intervals, until melted.
3. Monitor closely as it nears melting and stop heating once boiling begins.
4. Allow to cool to **~55 °C** before adding antibiotics and pouring plates.

**Sterile containers for mixing**
- If making fresh agar: also sterilize several **100 mL or 250 mL** empty bottles for measuring out media. Use **one clean bottle per antibiotic/additive combination**.  
- Alternatively, use **50 mL conicals**, taking a **fresh** one for each combination.

**Add antibiotics/additives at ~55 °C**
- Once agar cools to **~55 °C**, add antibiotics or other additives.  
- **Dosing rule:** all antibiotics are **1000×** stocks → add **X µL** per **X mL** of agar.  
  *Example:* Pouring **5 plates × 25 mL = 125 mL** total agar → add **125 µL** of antibiotic.
- For each combination, pour the required volume into a warm sterile bottle or conical. Use side graduations as a **crude volumetric**; close enough for routine plate pours.  
- **Mix by swirling (not vigorous shaking)** to avoid bubbles.

**Set up the sterile area — chemical hood**
- Work in the **chemical hood**. This procedure requires a Bunsen burner, and the hood has
  the **only gas line** in the lab, so pouring cannot be done at the sterile bench.
- Place stacks of petri dishes in the hood.  
- Light the **Bunsen burner** with a striker; gas can be fully open.  
- *Why a flame?* The hot column of air above the flame creates **upward convection** that reduces dust and airborne microbes settling into your open plates.

**Pouring**
1. For each stack (single antibiotic/additive combination), **remove lids** and keep them nearby upside-down.  
2. **Pour ~25 mL** per plate (about **3/16 inch** thick). You can also watch for the moment the added volume **breaks surface tension and spreads** to fill the plate—this is a practical visual cue for the right amount.  
3. If bubbles form, hold the burner by the base and briefly **pass the flame** over the surface to pop them.  
4. **Replace lids** and set plates aside to **solidify**. Turn off the flame when finished.

**Marking conventions (common codes)**
- **Carbenicillin/Ampicillin:** red stripes on side; “A”, “Amp”, or “Carb” on plate bottom  
- **Kanamycin:** green stripes; “K” or “Kan”  
- **Chloramphenicol:** blue stripes; “C” or “CAM”  
- **Spectinomycin:** black stripes; “Sp” or “Spec”  
- **Tetracycline:** yellow stripes; “T” or “Tet”  
- **Arabinose:** “Ara”  
- **IPTG:** “IPTG”  
- **X‑Gal:** “X” or “XGal”

---

### Protocol 2 — Carbenicillin 1000× stock

`preparation_of_antibiotic_1000x_stock`, **carbenicillin**, 50 mg.

> Verbatim Protocol Builder output.

1. Label a sterile 1.5 mL microcentrifuge tube.
2. Place the empty tube on an analytical balance and tare to 0.000 g.
3. Scoop approximately 50 mg of antibiotic powder into the tube; record the actual mass (mg).
4. Compute the volume of solvent to add for a 100 mg/mL stock: for carbenicillin, use 10 µL per mg. For 50 mg → add 500 µL (0.50 mL) of molecular biology grade water.
5. Cap the tube and mix until fully dissolved (vortex briefly; avoid aerosols).
6. If a sterile stock is required, sterile‑filter (0.22 µm) into a sterile, labeled tube using a membrane compatible with the solvent.
7. Aliquot as needed and label with antibiotic, concentration, date, and your initials.
8. Store according to lab SOP for this antibiotic (commonly −20 °C or 4 °C).

### Protocol 3 — Spectinomycin 1000× stock

`preparation_of_antibiotic_1000x_stock`, **spectinomycin**, 50 mg. Same 100 mg/mL group as carbenicillin and ampicillin.

> Verbatim Protocol Builder output.

1. Label a sterile 1.5 mL microcentrifuge tube.
2. Place the empty tube on an analytical balance and tare to 0.000 g.
3. Scoop approximately 50 mg of antibiotic powder into the tube; record the actual mass (mg).
4. Compute the volume of solvent to add for a 100 mg/mL stock: for spectinomycin, use 10 µL per mg. For 50 mg → add 500 µL (0.50 mL) of molecular biology grade water.
5. Cap the tube and mix until fully dissolved (vortex briefly; avoid aerosols).
6. If a sterile stock is required, sterile‑filter (0.22 µm) into a sterile, labeled tube using a membrane compatible with the solvent.
7. Aliquot as needed and label with antibiotic, concentration, date, and your initials.
8. Store according to lab SOP for this antibiotic (commonly −20 °C or 4 °C).

### Protocol 4 — Kanamycin 1000× stock

`preparation_of_antibiotic_1000x_stock`, **kanamycin**, rendered at the module's 50 mg default. On the day you compute from the mass the balance actually reads — see Gap 5.

> Verbatim Protocol Builder output.

1. Label a sterile 1.5 mL microcentrifuge tube.
2. Place the empty tube on an analytical balance and tare to 0.000 g.
3. Scoop approximately 50 mg of antibiotic powder into the tube; record the actual mass (mg).
4. Compute the volume of solvent to add for a 25 mg/mL stock: for kanamycin, use 40 µL per mg. For 50 mg → add 2000 µL (2.00 mL) of molecular biology grade water.
5. Cap the tube and mix until fully dissolved (vortex briefly; avoid aerosols).
6. If a sterile stock is required, sterile‑filter (0.22 µm) into a sterile, labeled tube using a membrane compatible with the solvent.
7. Protect from light (use amber tube/wrap in foil).
8. Aliquot as needed and label with antibiotic, concentration, date, and your initials.
9. Store according to lab SOP for this antibiotic (commonly −20 °C or 4 °C).

### Protocol 5 — Erythromycin 1000× stock

`preparation_of_antibiotic_1000x_stock`, **erythromycin**, 50 mg. ⚠️ **This is what the builder actually returns** — the module has no erythromycin entry, so it falls through to the default branch and emits placeholders. See Gaps.

> Verbatim Protocol Builder output.

1. Label a sterile 1.5 mL microcentrifuge tube.
2. Place the empty tube on an analytical balance and tare to 0.000 g.
3. Scoop approximately 50 mg of antibiotic powder into the tube; record the actual mass (mg).
4. Compute the volume of solvent to add for a desired concentration stock: for erythromycin, use [set factor] µL per mg. For 50 mg → add V = (mg weighed) × (µL per mg) of molecular biology grade water.
5. If preparing erythromycin, Verify appropriate solvent and concentration for this antibiotic.
6. Cap the tube and mix until fully dissolved (vortex briefly; avoid aerosols).
7. If a sterile stock is required, sterile‑filter (0.22 µm) into a sterile, labeled tube using a membrane compatible with the solvent.
8. Aliquot as needed and label with antibiotic, concentration, date, and your initials.
9. Store according to lab SOP for this antibiotic (commonly −20 °C or 4 °C).

---

### Protocol 6 — Heat-shock transformation — carbenicillin control

`heat_shock_transformation`, antibiotics = **Carb**. Note the builder returns the **no-rescue** branch here, by its own rule. See Gaps.

> Verbatim Protocol Builder output.

**Equilibrate heating and cooling blocks**
- Turn on the Echotherm. Set block A to **4 °C** and block B to **42 °C**. Wait until both blocks are at temperature.
- **Alternative:** use a thermocycler with two blocks set to **4 °C** and **42 °C**.
- **Alternative:** use a **42 °C** heating block and an **ice bath** for **4 °C**.
- Keep the blocks at temperature throughout the procedure.

**Plates and labeling**
- You will need **at least 1 petri dish** per transformation containing the required antibiotic(s) or additive(s).
- If selecting with an **Amp/Bla** marker, use the **carbenicillin** plates stocked in the fridge.
- For any other selection, prepare plates:

  > *[Protocol Builder inlines the full "Pouring Standard Petri Dishes" protocol here.
  > It is identical to **Protocol 1** above and has been removed to avoid printing it
  > three times. The plates are already poured in PASS 5.]*

**Warm and label**
- Warm plates in the incubator to **room temperature**; cold plates are difficult to write on.
- Label the **bottom** of each plate with:
  - **Date** (YYYY‑MM‑DD) and your name/initials
  - **Strain:** mach1
  - **Plasmid:** carb control plasmid
  - **Selection:** carb

**Protocol**
1. Retrieve ligation reactions or plasmid DNA and bring to the transformation bench.
2. Set the Echotherm blocks to **4 °C** (A) and **42 °C** (B). Alternatively, use a thermocycler with two blocks set to these temperatures.
3. Place competent cell aliquots on block A (4 °C). One tube is sufficient for three reactions.
4. Thaw cells (~30 s). Add **25 µL KCM** to each aliquot and pipette gently to mix.
5. Place the DNA tube (ligation mix or diluted plasmid) on block A.
6. Let tubes cool for **30 s** on block A.
7. Add **40 µL** competent cells to each DNA tube while on block A (**for a 10 µL DNA sample**). If DNA was not already in the tube, add it now. Mix gently.
   - These numbers assume the DNA volume is ~20% of the total mixture.
   - Using smaller DNA volumes is fine, but adding too much DNA will dilute salts and reduce transformation efficiency.
   - For large DNA reactions (~20 µL), use **100 µL** or the **entire tube** of competent cells.
   - For simple retransformation from a miniprep, **0.5 µL** of plasmid DNA in **10 µL** of cells is sufficient.
8. Incubate at **4 °C for 10 min**.
9. Transfer tubes to block B (**42 °C**) for **90 s**.
10. Return tubes to block A (**4 °C**) for **1 min**.

11. Plate the transformation mix directly on **carbenicillin** selective agar plates. Incubate **inverted** at **37 °C** overnight.
12. Cancel temperature devices when finished.

### Protocol 7 — Heat-shock transformation — kanamycin control

`heat_shock_transformation`, antibiotics = **Kan**. Rescue branch.

> Verbatim Protocol Builder output.

**Equilibrate heating and cooling blocks**
- Turn on the Echotherm. Set block A to **4 °C** and block B to **42 °C**. Wait until both blocks are at temperature.
- **Alternative:** use a thermocycler with two blocks set to **4 °C** and **42 °C**.
- **Alternative:** use a **42 °C** heating block and an **ice bath** for **4 °C**.
- Keep the blocks at temperature throughout the procedure.

**Plates and labeling**
- You will need **at least 1 petri dish** per transformation containing the required antibiotic(s) or additive(s).
- If selecting with an **Amp/Bla** marker, use the **carbenicillin** plates stocked in the fridge.
- For any other selection, prepare plates:

  > *[Protocol Builder inlines the full "Pouring Standard Petri Dishes" protocol here.
  > It is identical to **Protocol 1** above and has been removed to avoid printing it
  > three times. The plates are already poured in PASS 5.]*

**Warm and label**
- Warm plates in the incubator to **room temperature**; cold plates are difficult to write on.
- Label the **bottom** of each plate with:
  - **Date** (YYYY‑MM‑DD) and your name/initials
  - **Strain:** mach1
  - **Plasmid:** kan control plasmid
  - **Selection:** kan

**Protocol**
1. Retrieve ligation reactions or plasmid DNA and bring to the transformation bench.
2. Set the Echotherm blocks to **4 °C** (A) and **42 °C** (B). Alternatively, use a thermocycler with two blocks set to these temperatures.
3. Place competent cell aliquots on block A (4 °C). One tube is sufficient for three reactions.
4. Thaw cells (~30 s). Add **25 µL KCM** to each aliquot and pipette gently to mix.
5. Place the DNA tube (ligation mix or diluted plasmid) on block A.
6. Let tubes cool for **30 s** on block A.
7. Add **40 µL** competent cells to each DNA tube while on block A (**for a 10 µL DNA sample**). If DNA was not already in the tube, add it now. Mix gently.
   - These numbers assume the DNA volume is ~20% of the total mixture.
   - Using smaller DNA volumes is fine, but adding too much DNA will dilute salts and reduce transformation efficiency.
   - For large DNA reactions (~20 µL), use **100 µL** or the **entire tube** of competent cells.
   - For simple retransformation from a miniprep, **0.5 µL** of plasmid DNA in **10 µL** of cells is sufficient.
8. Incubate at **4 °C for 10 min**.
9. Transfer tubes to block B (**42 °C**) for **90 s**.
10. Return tubes to block A (**4 °C**) for **1 min**.

11. **Rescue step:** add **200 µL 2YT**, transfer to a 1.5 mL tube, and shake at **37 °C** for **1 h**. This step allows time for the resistance gene to express before plating on the chosen antibiotic.
12. Plate all liquid on **kan** selective agar plates. Incubate **inverted** at **37 °C** overnight.
   - **Drying the plates (optional):** Leave the plate **uncovered at the sterile bench** until the liquid is fully absorbed and the surface is **no longer glossy**. This prevents colony bleeding or running, especially when plating >100 µL.
13. Cancel temperature devices when finished.

### Protocol 8 — Heat-shock transformation — erythromycin control

`heat_shock_transformation`, antibiotics = **Erm**. Rescue branch.

> Verbatim Protocol Builder output.

**Equilibrate heating and cooling blocks**
- Turn on the Echotherm. Set block A to **4 °C** and block B to **42 °C**. Wait until both blocks are at temperature.
- **Alternative:** use a thermocycler with two blocks set to **4 °C** and **42 °C**.
- **Alternative:** use a **42 °C** heating block and an **ice bath** for **4 °C**.
- Keep the blocks at temperature throughout the procedure.

**Plates and labeling**
- You will need **at least 1 petri dish** per transformation containing the required antibiotic(s) or additive(s).
- If selecting with an **Amp/Bla** marker, use the **carbenicillin** plates stocked in the fridge.
- For any other selection, prepare plates:

  > *[Protocol Builder inlines the full "Pouring Standard Petri Dishes" protocol here.
  > It is identical to **Protocol 1** above and has been removed to avoid printing it
  > three times. The plates are already poured in PASS 5.]*

**Warm and label**
- Warm plates in the incubator to **room temperature**; cold plates are difficult to write on.
- Label the **bottom** of each plate with:
  - **Date** (YYYY‑MM‑DD) and your name/initials
  - **Strain:** mach1
  - **Plasmid:** erm control plasmid
  - **Selection:** erm

**Protocol**
1. Retrieve ligation reactions or plasmid DNA and bring to the transformation bench.
2. Set the Echotherm blocks to **4 °C** (A) and **42 °C** (B). Alternatively, use a thermocycler with two blocks set to these temperatures.
3. Place competent cell aliquots on block A (4 °C). One tube is sufficient for three reactions.
4. Thaw cells (~30 s). Add **25 µL KCM** to each aliquot and pipette gently to mix.
5. Place the DNA tube (ligation mix or diluted plasmid) on block A.
6. Let tubes cool for **30 s** on block A.
7. Add **40 µL** competent cells to each DNA tube while on block A (**for a 10 µL DNA sample**). If DNA was not already in the tube, add it now. Mix gently.
   - These numbers assume the DNA volume is ~20% of the total mixture.
   - Using smaller DNA volumes is fine, but adding too much DNA will dilute salts and reduce transformation efficiency.
   - For large DNA reactions (~20 µL), use **100 µL** or the **entire tube** of competent cells.
   - For simple retransformation from a miniprep, **0.5 µL** of plasmid DNA in **10 µL** of cells is sufficient.
8. Incubate at **4 °C for 10 min**.
9. Transfer tubes to block B (**42 °C**) for **90 s**.
10. Return tubes to block A (**4 °C**) for **1 min**.

11. **Rescue step:** add **200 µL 2YT**, transfer to a 1.5 mL tube, and shake at **37 °C** for **1 h**. This step allows time for the resistance gene to express before plating on the chosen antibiotic.
12. Plate all liquid on **erm** selective agar plates. Incubate **inverted** at **37 °C** overnight.
   - **Drying the plates (optional):** Leave the plate **uncovered at the sterile bench** until the liquid is fully absorbed and the surface is **no longer glossy**. This prevents colony bleeding or running, especially when plating >100 µL.
13. Cancel temperature devices when finished.

---

### Protocol 9 — Sealing Petri Dishes with Parafilm

> Verbatim Protocol Builder output.

**Protocol**

1. **Prepare the Parafilm.**
   - Unroll the Parafilm and cut a **1-inch-wide strip horizontally** from the roll.  
     ⚠️ *Important:* cut **along the long edge of the roll**, so you create a long, narrow strip — not a short square piece.

2. **Position and start the wrap.**
   - Hold one end of the Parafilm strip against the **side of the Petri dish lid**.
   - Stretch the Parafilm gently until it starts to adhere.

3. **Wrap around the plate.**
   - While holding tension, **spin the plate** slowly so that the Parafilm wraps evenly around the seam.
   - Keep a slight stretch so the film seals smoothly without tearing.

4. **Finish and seal.**
   - When the strip overlaps the starting point, **pull it off the roll** and press the end down firmly to seal it to itself.

5. **Inspect.**
   - Ensure the seal is smooth and continuous around the plate. This prevents the plate from drying out, helps the lid stay in place if dropped, and keeps condensation and contents contained.

6. **Storage.**
   - Store the sealed plates **inverted in the refrigerator**. They remain stable for about **1–2 weeks**.
   - ⚠️ *Do not Parafilm plates that will be incubated* — cells need airflow to grow properly.

---

## 8. Slate cards

Every slug, in the order it is filmed. The **printable big-letter cards are in the HTML
version** — one per page, so they read on camera. Pre-write or pre-print them before 10:00:
there are 50, and writing them on the day is the easiest hour to lose.

| # | Slug | Slate reads | Pass |
|---|---|---|---|
| 1 | `BROTH-01` | What 2YT is | 1 |
| 2 | `POUR-01` | What LB agar is | 1 |
| 3 | `POUR-02` | Agar powder in | 1 |
| 4 | `BROTH-02` | 2YT powder in | 1 |
| 5 | `POUR-03` | Fill + cap + shake | 1 |
| 6 | `POUR-04` | Load the cooker | 1 |
| 7 | `POUR-05` | The 1000× rule | 2 |
| 8 | `POUR-06` | Carbenicillin | 2 |
| 9 | `POUR-07` | Spectinomycin | 2 |
| 10 | `POUR-08` | Kanamycin | 2 |
| 11 | `POUR-09` | Erythromycin | 2 |
| 12 | `POUR-10` | Carb vs amp | 2 |
| 13 | `CTRL-01` | The −80 box | 3 |
| 14 | `CTRL-02` | Retrieve stocks | 3 |
| 15 | `POUR-11` | Re-melt agar | 4 |
| 16 | `POUR-12` | Hood, not bench | 5 |
| 17 | `POUR-13` | Why a flame | 5 |
| 18 | `POUR-14` | Four vessels | 5 |
| 19 | `POUR-15` | 55 °C + swirl | 5 |
| 20 | `POUR-16` | Pour carb | 5 |
| 21 | `POUR-17` | Pour erythromycin | 5 |
| 22 | `POUR-18` | Pour kanamycin | 5 |
| 23 | `POUR-19` | Pour plain LB | 5 |
| 24 | `POUR-20` | Bubbles | 5 |
| 25 | `POUR-21` | Marking codes | 5 |
| 26 | `POUR-22` | Lids + set | 5 |
| 27 | `CTRL-03` | What a control strain is | 6 |
| 28 | `CTRL-04` | Scrape a stock | 6 |
| 29 | `CTRL-05` | Streak the matrix | 6 |
| 30 | `CTRL-06` | Sterility plates | 6 |
| 31 | `CTRL-07` | Into 37 °C | 6 |
| 32 | `CTRL-08` | Control DNA | 7 |
| 33 | `CTRL-09` | EchoTherm 4/42 | 7 |
| 34 | `CTRL-10` | Four reactions | 7 |
| 35 | `CTRL-11` | Heat shock | 7 |
| 36 | `CTRL-12` | Split the rescue | 7 |
| 37 | `CTRL-13` | Rescue | 7 |
| 38 | `CTRL-14` | Plate the three | 8 |
| 39 | `CTRL-15` | Plate cells-only | 8 |
| 40 | `CTRL-16` | Into 37 °C | 8 |
| 41 | `POUR-23` | Parafilm spares | 9 |
| 42 | `POUR-24` | Never in the incubator | 9 |
| 43 | `BROTH-03` | 2YT out | 9 |
| 44 | `CTRL-17` | The matrix | 10 |
| 45 | `CTRL-18` | Sterility plates | 10 |
| 46 | `CTRL-19` | Rescue vs no rescue | 10 |
| 47 | `CTRL-20` | Cells-only | 10 |
| 48 | `CTRL-21` | The streaks | 10 |
| 49 | `CTRL-22` | When it fails | 10 |
| 50 | `CTRL-23` | Record the batch | 10 |

---

## 7. Gaps — where the protocols run out

You asked to follow the protocols exactly. In five places there is no protocol to follow, and
they are all worth knowing before 10:00 rather than at the bench.

**1. There is no 2YT protocol.** Four modules *consume* 2YT — `preparation_of_starter_culture`,
`growing_bacteria_with_flasks`, `heat_shock_transformation`, `tss_comp_cells` — and **none
prepares it.** The Protocol Builder cannot produce the text for the video you are about to
shoot. The bench flow is the same shape as LB agar (Protocol 1), so PASS 1 films fine, **but
the recipe numbers have to come from you on the day.** This is the Tecan pattern again: the
footage defines the page rather than following it. Write the module from the take.

**2. There is no streaking protocol.** PASS 6 has no module behind it either. Same treatment.

**3. Erythromycin is not in the antibiotic module.** Protocol 5 above is the real output and it
says `[set factor]`, `desired concentration`, and defaults the solvent to **water** — which is
wrong for erythromycin. Two numbers fix it permanently: the working concentration for *E. coli*
in this lab, and the solvent. Until then `POUR-08` is the clip where you say them out loud.

**4. Erythromycin has no plate marking convention.** Protocol 1 lists stripe colours for carb,
kan, CAM, spec and tet. Nothing for erythromycin. Pick one in `POUR-18` and it becomes the
convention.

**5. Step 3 suggests the same ~50 mg for every antibiotic.** The procedure itself is
mass-driven and correct: tare the tube, scoop some powder, **record the actual mass**, then
compute the solvent from that. So the 2000 µL that Protocol 4 prints is an illustration of the
module's 50 mg default, not an instruction — in practice you scoop an amount that suits the
tube and the arithmetic follows.

What is worth tightening is that **step 3 names ~50 mg regardless of which antibiotic you
picked**, and 50 mg only suits the 100 mg/mL group. Working to about 1.2 mL in a 1.5 mL tube:

| Group | µL per mg | Sensible scoop |
|---|---|---|
| Carb / amp / spec — 100 mg/mL | 10 | ~50 mg (up to ~120) |
| Kan / CAM — 25 mg/mL | 40 | **~25 mg** (up to ~30) |
| Tetracycline — 10 mg/mL | 100 | **~10 mg** (up to ~12) |

Nothing breaks either way; the person weighing simply needs to know before they scoop.

**6. Is kanamycin 25 or 50 µg/mL in this lab?** The module says **25 mg/mL** for the 1000×
stock, so 25 µg/mL in the plate. 50 µg/mL is the more common published figure for *E. coli*,
and you were unsure which this lab uses. If the bench actually runs 50, the module is wrong and
the video will teach the wrong number — this is worth checking against a real plate recipe
before Saturday rather than after.

**8. The antibiotic protocol is effectively unlisted.**
`preparation_of_antibiotic_1000x_stock` is **not in `docs/protocols/index.json`**, so it never
appears in the Protocol Builder's dropdown. The only way to reach it is to select *"Preparation
of a starter culture"*, which includes it — an unlikely place to look when you are pouring
plates. Worse, `docs/trainings/plate_pouring.md` tells supervisors that the pouring link "also
includes protocols for … preparing antibiotics," and it does not: `pouring_petri_dishes`
includes only `preparation_of_lb_agar` and `remelting_lb_agar`. Adding the module to the index,
or to the pouring protocol's optional includes, would fix both at once.

**7. The carb transformation has no rescue — the protocol says so, you said otherwise.** The
module decides this itself: `needsRescue = !hasAmp`, so carbenicillin takes the direct-plating
branch and only kan and erythromycin get the outgrowth. Your sequence said "all 3 with a
rescue." As printed, Protocol 6 plates directly. Either is defensible — a rescue does no harm
— but the video and the builder should not disagree in front of students, so decide which one
is right and change the other.

---

*Generated against the Protocol Builder modules in `docs/protocols/modules/` as of
28 Aug 2026. Re-render if a module changes.*
