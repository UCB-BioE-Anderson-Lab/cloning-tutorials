// zymo_cleanup.js
// Silica spin-column cleanup of a PCR or restriction digest (Zymo DNA Clean & Concentrator-5).
//
// Ordering matters here and is deliberate. The COLUMN is labelled first and the elution
// tubes are not labelled until step 9, immediately before they are used. Labelling both at
// the start puts an empty, labelled 1.5 mL tube on the bench during the ADB transfers, and
// it gets the ADB.

// Spin times, seconds. Named here because they were previously typed into three separate
// places — this template, the printed cheatsheet, and the timing block below.
const SPIN = { bind_s: 15, wash_s: 15, dry_s: 90, elute_s: 45 };

// Timing — see docs/protocols/TIMING.txt. Minutes.
export const timing = {
  ends_at: "eluting into the labelled tube",
  work: [
    // Quick spins with little gap between them; the handling is the time.
    { label: "handling between spins", min: 1, max: 2, each: "spin" }
  ],
  wait: [
    { label: "bind spin", min: SPIN.bind_s / 60, max: SPIN.bind_s / 60 },
    { label: "PE wash spin", min: SPIN.wash_s / 60, max: SPIN.wash_s / 60 },
    { label: "PE wash spin", min: SPIN.wash_s / 60, max: SPIN.wash_s / 60 },
    { label: "dry spin", min: SPIN.dry_s / 60, max: SPIN.dry_s / 60 },
    { label: "elution spin", min: SPIN.elute_s / 60, max: SPIN.elute_s / 60 }
  ],
  limits: [],
  unknown: []
};

export const inputs = [
  { name: "reactions", type: "number", label: "Number of reactions to clean", default: 1, step: 1 },
  { name: "sample_uL", type: "number", label: "Reaction volume to clean (µL)", default: 50, step: 5 },
  { name: "elution_uL", type: "number", label: "Elution volume (µL)", default: 25, step: 1 },
  { name: "adb_uL", type: "number", label: "ADB per reaction (µL)", default: 180, step: 10 },
  { name: "small_fragment", type: "boolean", label: "Fragment under 250 bp?" }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.reactions ?? 1));
  const sample = Number(values?.sample_uL ?? 50);
  const elution = Number(values?.elution_uL ?? 25);
  const adb = Number(values?.adb_uL ?? 180);
  const smallRaw = values?.small_fragment;
  const small = (smallRaw === true || smallRaw === "true" || smallRaw === "on");
  const pe = 200;

  return {
    name: "Zymo Cleanup",
    description: `Clean ${n} reaction${n > 1 ? "s" : ""} on a Zymo column, eluting in ${elution} µL.`,
    includes: { required: [], optional: [] },
    derived: {
      reactions: n,
      sample_uL: sample,
      elution_uL: elution,
      adb_uL: adb,
      pe_uL: pe,
      small_fragment: small,
      ...SPIN
    },
    template: `
**What this removes**
- Polymerase, dNTPs, salts and most oligos from a PCR.
- Buffer and restriction enzymes from a digest.

**Procedure**
1. **Side-label one Zymo column per sample** with an **ethanol-resistant pen** — *not* a Sharpie,
   which the washes take straight off. Put each column in a collection tube in a rack.
2. Pipette **${adb} µL ADB** into the column.
3. Transfer all **~${sample} µL** of the reaction into the ADB **in the column**, and pipette up
   and down to mix.
   - **Alternatively**, premix the ADB and the sample in an Eppendorf tube, vortex, spin, then
     transfer to the column. There are several ways to do this; what matters is that the
     solutions end up **well mixed and in the column**.
${small ? `   - **Fragment under 250 bp:** bind with **1 part ADB + 3 parts isopropanol** instead of ADB
     alone, or the fragment washes straight through.
` : ``}4. **Spin ${SPIN.bind_s} s** at full speed. Discard the flow-through.
5. Add **${pe} µL PE**. **Spin ${SPIN.wash_s} s.** Discard the flow-through.
6. Add **${pe} µL PE**. **Spin ${SPIN.wash_s} s.** Discard the flow-through.
7. **Spin ${SPIN.dry_s} s** at full speed to dry the column. PE is 70% ethanol and any carryover
   inhibits downstream enzymes.
8. **While the drying spin runs, clean up.** Check the bench for drips of salt or ADB
   solution. Use **70% ethanol** if you suspect any.
9. **Top- and side-label new 1.5 mL Eppendorf tubes**, one per column, as indicated on your
   labsheet.
10. Insert the **dry column** into its elution tube.
11. Add **${elution} µL EB** slowly to the **centre of the membrane**. Do not let it run down
    the walls.
12. **Spin ${SPIN.elute_s} s** to elute.
13. **Discard the column.** The DNA is in the tube.

**Notes**
- **Know where your DNA is at every step.** Before each spin, say which half you are keeping.
- EB is preferred over water: water absorbs CO₂, turns slightly acidic, and lowers recovery.
`
  };
}
