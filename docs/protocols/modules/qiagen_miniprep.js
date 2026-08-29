// qiagen_miniprep.js
// Alkaline lysis + silica spin column plasmid prep. Matches docs/wetlab/miniprep.md.

export const inputs = [
  { name: "culture_mL", type: "number", label: "Culture volume to pellet (mL)", default: 4, step: 1 },
  { name: "elution_uL", type: "number", label: "Elution volume (µL)", default: 50, step: 5 }
];

export function factory(values = {}) {
  const culture = Number(values?.culture_mL ?? 4);
  const elution = Number(values?.elution_uL ?? 50);

  return {
    name: "Qiagen Miniprep",
    description: "Purify plasmid DNA from a saturated culture by alkaline lysis and spin column.",
    includes: { required: [], optional: [] },
    derived: { culture_mL: culture, elution_uL: elution },
    template: `
**Reagents**
- **P1** (with RNase A added) · **P2** (NaOH/SDS) · **N3** (acidic, guanidinium)
- **PB** (protein and endotoxin removal) · **PE** (70% ethanol) · **EB** (elution)

**Alkaline lysis**
1. **Pellet** ${culture} mL of saturated culture in a microcentrifuge tube.
2. **Resuspend** in **250 µL P1**. The RNase A must already be in the P1.
3. **Lyse** with **250 µL P2** and mix gently — **do not vortex**.
4. **Neutralize** with **350 µL N3**. Invert to mix thoroughly.
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
