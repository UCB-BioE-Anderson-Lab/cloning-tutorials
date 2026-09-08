// zymo_cleanup.js
// Silica spin-column cleanup of a PCR or restriction digest (Zymo DNA Clean & Concentrator-5).
// Matches docs/wetlab/cleanup.md.

export const inputs = [
  { name: "reactions", type: "number", label: "Number of reactions to clean", default: 1, step: 1 },
  { name: "elution_uL", type: "number", label: "Elution volume (µL)", default: 25, step: 1 },
  { name: "adb_uL", type: "number", label: "ADB per reaction (µL)", default: 180, step: 10 },
  { name: "small_fragment", type: "boolean", label: "Fragment under 250 bp?" }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.reactions ?? 1));
  const elution = Number(values?.elution_uL ?? 25);
  const adb = Number(values?.adb_uL ?? 180);
  const smallRaw = values?.small_fragment;
  const small = (smallRaw === true || smallRaw === "true" || smallRaw === "on");

  return {
    name: "Zymo Cleanup",
    description: `Clean ${n} reaction${n > 1 ? "s" : ""} on a Zymo column, eluting in ${elution} µL.`,
    includes: { required: [], optional: [] },
    derived: { reactions: n, elution_uL: elution, adb_uL: adb, small_fragment: small },
    template: `
**What this removes**
- Polymerase, dNTPs, salts and most oligos from a PCR.
- Buffer and restriction enzymes from a digest.

**Reagents**
- **ADB** binding buffer (brown bottle) · **PE** wash (70% ethanol) · **EB** elution buffer
${small ? `
> **Fragment under 250 bp.** Bind with **1 part ADB + 3 parts isopropanol** instead of ADB alone,
> or the small fragment will wash straight through the column.
` : ``}
**Procedure**
1. Add **${adb} µL ADB** to each reaction and mix.
2. Transfer to a **Zymo column** in a collection tube.
3. Spin **15 s** at full speed, discard the flowthrough.
4. Add **200 µL PE**. Spin **15 s**, discard the flowthrough.
5. Add **200 µL PE** again. Spin **15 s**, discard the flowthrough.
6. Spin **90 s** at full speed to dry the column. PE is 70% ethanol and carryover
   will ruin every downstream reaction.
7. Move the column to a fresh **1.5 mL tube**.
8. Add **${elution} µL EB** slowly to the **centre of the membrane**. Do not let it run down the walls.
9. Spin **45 s** to elute. Discard the column.

**Notes**
- **Know where your DNA is at every step.** The commonest failure is discarding the wrong tube.
- EB is preferred over water: water absorbs CO₂, turns slightly acidic, and lowers recovery.
`
  };
}
