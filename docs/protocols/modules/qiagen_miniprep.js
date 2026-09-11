// qiagen_miniprep.js
// Alkaline lysis + silica spin column plasmid prep. Matches docs/wetlab/miniprep.md.

// Spin times. Seconds unless the name says min. Named here so the template, the printed
// cheatsheet and the timing block below cannot disagree.
const SPIN = { pellet_min: 1, clear_min: 5, bind_s: 15, wash_s: 15, dry_s: 90, elute_s: 45 };

// Timing — see docs/protocols/TIMING.txt. Minutes.
export const timing = {
  ends_at: "eluting into the labelled tube",
  work: [
    // Same shape as the Zymo: quick spins separated by a couple of minutes of work.
    { label: "handling between spins", min: 2, max: 2, each: "spin" }
  ],
  wait: [
    { label: "clearing spin", min: SPIN.clear_min, max: SPIN.clear_min },
    { label: "column bind spin", min: SPIN.bind_s / 60, max: SPIN.bind_s / 60 },
    { label: "PB spin", min: SPIN.wash_s / 60, max: SPIN.wash_s / 60 },
    { label: "PE spin", min: SPIN.wash_s / 60, max: SPIN.wash_s / 60 },
    { label: "dry spin", min: SPIN.dry_s / 60, max: SPIN.dry_s / 60 },
    { label: "elution spin", min: SPIN.elute_s / 60, max: SPIN.elute_s / 60 }
  ],
  limits: [
    {
      step: "P2 lysis, before adding N3",
      min: 0.5,
      max: 5,
      why: "under 30 s lysis is incomplete; past 5 min the alkali starts nicking the plasmid"
    }
  ],
  unknown: []
};

export const inputs = [
  { name: "culture_mL", type: "number", label: "Culture volume to pellet (mL)", default: 4, step: 1 },
  { name: "elution_uL", type: "number", label: "Elution volume (µL)", default: 50, step: 5 }
];

export function factory(values = {}) {
  const culture = Number(values?.culture_mL ?? 4);
  const elution = Number(values?.elution_uL ?? 50);

  // Buffer volumes, named so the printed cheatsheet reads them from here rather than
  // carrying its own copy.
  // p2_min_s / p2_max_s is a hard window, not a target: the lysis has to go to
  // completion but must not run on. Qiagen's handbook caps it at 5 min.
  const q = {
    p1_uL: 250,
    p2_uL: 250,
    n3_uL: 350,
    pb_uL: 500,
    pe_uL: 750,
    p2_min_s: 30,
    p2_max_min: 5
  };

  return {
    name: "Qiagen Miniprep",
    description: "Purify plasmid DNA from a saturated culture by alkaline lysis and spin column.",
    includes: { required: [], optional: [] },
    derived: { culture_mL: culture, elution_uL: elution, ...q, ...SPIN },
    template: `
**Reagents**
- **P1** (with RNase A added) · **P2** (NaOH/SDS) · **N3** (acidic, guanidinium)
- **PB** (protein and endotoxin removal) · **PE** (70% ethanol) · **EB** (elution)

**Alkaline lysis**
1. **Pellet** ${culture} mL of saturated culture in a microcentrifuge tube.
2. **Resuspend** in **${q.p1_uL} µL P1**. The RNase A must already be in the P1.
3. **Lyse** with **${q.p2_uL} µL P2** and mix gently — **do not vortex**.
   - **At least ${q.p2_min_s} s, no more than ${q.p2_max_min} min before you add N3.** Too short and lysis is incomplete; past ${q.p2_max_min} min the alkali starts nicking the plasmid.
4. **Neutralize** with **${q.n3_uL} µL N3**. Invert to mix thoroughly.
5. **Spin 5 min** at max speed to pellet the debris.

**Column binding and wash**
6. Transfer the supernatant to a **blue QIAprep column** and spin **15 s**.
7. Add **500 µL PB**, spin.
8. Add **750 µL PE**, spin.
9. Discard the flowthrough and **spin again 90 s to dry**. PE is 70% ethanol and
   carryover will ruin downstream reactions.

**Elution**
10. Move the column to a fresh 1.5 mL tube. Add **${elution} µL EB** (or water, pH 7–8.5)
    to the centre of the membrane.
11. Spin **45 s** to elute.

**Labelling**
- Label **both the top and the side** of each tube with the clone ID.
`
  };
}
