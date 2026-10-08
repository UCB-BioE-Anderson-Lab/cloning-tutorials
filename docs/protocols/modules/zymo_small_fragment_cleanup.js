// zymo_small_fragment_cleanup.js
// Zymo column cleanup of a SMALL PCR product (under ~300 bp), binding in ADB + isopropanol.
//
// A small fragment does not bind the silica in ADB alone and washes straight through. The
// isopropanol is what holds it on. Everything after the bind is the ordinary Zymo cleanup,
// worded the same way as zymo_cleanup.js on purpose.
//
// The volumes are fixed for one 50 µL PCR: 100 µL ADB (2×) into 300 µL isopropanol (6×),
// i.e. 1 part ADB to 3 parts isopropanol. They are not scaled from an input, because no
// other sample volume has been specified.

// Spin times, seconds. Same as zymo_cleanup.js.
const SPIN = { bind_s: 15, wash_s: 15, dry_s: 90, elute_s: 45 };

// Timing — see docs/protocols/TIMING.txt. Minutes.
export const timing = {
  ends_at: "eluting into the labelled tube",
  work: [
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
  unknown: ["ADB + isopropanol premix: pipetting, vortex and quick spin"]
};

export const inputs = [
  { name: "reactions", type: "number", label: "Number of reactions to clean", default: 1, step: 1 },
  { name: "elution_uL", type: "number", label: "Elution volume (µL)", default: 25, step: 1 }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.reactions ?? 1));
  const elution = Number(values?.elution_uL ?? 25);
  const q = {
    sample_uL: 50,
    adb_uL: 100,
    isopropanol_uL: 300,
    max_bp: 300,
    pe_uL: 200
  };

  return {
    name: "Zymo Small Fragment Cleanup",
    description: `Clean ${n} small-fragment PCR${n > 1 ? "s" : ""} on a Zymo column, eluting in ${elution} µL.`,
    includes: { required: [], optional: [] },
    derived: {
      reactions: n,
      elution_uL: elution,
      ...q,
      ...SPIN
    },
    template: `
**When to use this**
- Only for a **small fragment** — a PCR product **under ~${q.max_bp} bp**. Anything larger uses the
  ordinary Zymo cleanup.
- In ADB alone a small fragment does not stick to the column and goes out with the flow-through.
  The isopropanol is what holds it on.

**Procedure**
1. **Side-label one Zymo column per sample** with an **ethanol-resistant pen** — *not* a Sharpie,
   which the washes take straight off. Put each column in a collection tube in a rack.
2. Pipette **${q.isopropanol_uL} µL isopropanol** into a new **1.5 mL tube**, one per sample.
   - There should be a small bottle of isopropanol at the bench. If not, **ask your supervisor**
     to pour you some from the chemical cabinet.
3. Add **${q.adb_uL} µL ADB** to your **${q.sample_uL} µL PCR reaction** and pipette up and down to mix.
4. Transfer the PCR + ADB mix into the **isopropanol tube**.
5. **Vortex briefly**, then **quick spin**.
6. Transfer all of it (~${q.sample_uL + q.adb_uL + q.isopropanol_uL} µL) to the **column**.
7. **Spin ${SPIN.bind_s} s** at full speed. Discard the flow-through.
8. Add **${q.pe_uL} µL PE**. **Spin ${SPIN.wash_s} s.** Discard the flow-through.
9. Add **${q.pe_uL} µL PE**. **Spin ${SPIN.wash_s} s.** Discard the flow-through.
10. **Spin ${SPIN.dry_s} s** at full speed to dry the column. PE is 70% ethanol and any carryover
    inhibits downstream enzymes.
11. **While the drying spin runs, clean up.** Check the bench for drips of salt or ADB
    solution. Use **70% ethanol** if you suspect any.
12. **Top- and side-label new 1.5 mL Eppendorf tubes**, one per column, as indicated on your
    labsheet.
13. Insert the **dry column** into its elution tube.
14. Add **${elution} µL EB** (or **ddH₂O**) slowly to the **centre of the membrane**. Do not let it
    run down the walls.
15. **Spin ${SPIN.elute_s} s** to elute.
16. **Discard the column.** The DNA is in the tube.

**Notes**
- **Know where your DNA is at every step.** Before each spin, say which half you are keeping.
- EB is preferred over water: water absorbs CO₂, turns slightly acidic, and lowers recovery.
`
  };
}
