export const inputs = [
  { name: "volume_mL", type: "number", label: "TSS to make (mL)", default: 1000, step: 50 },
  { name: "mg_mM", type: "select", label: "Magnesium", options: ["30", "50"], default: "30" },
  { name: "dmso_resistant_filter", type: "boolean", label: "Is the filter DMSO-resistant?", default: false }
];

// THE MAGNESIUM IS A FORK IN THE LITERATURE, NOT A TYPO.
//
// Chung, Niemela & Miller's abstract says 50 mM Mg2+. The OpenWetWare recipe the lab's cells have
// actually been made from works out at 30 mM — 1.5 mL of 1 M into 50 mL. Other published versions
// use anything from 20 to 50, and some split it between the chloride and the sulfate. Neither
// number is wrong and nothing here can decide between them, so the module takes it as an input,
// defaults to the one the bench has been using, and makes the choice appear in the written
// protocol. A module that silently picked one would hide the fork from the person at the bench.
const MG_PER_L = { 30: 30, 50: 50 };   // mL of 1 M MgCl2 per litre == mM, conveniently

export function factory(values) {
  const volume_mL = Number(values?.volume_mL ?? 1000);
  const mg_mM = String(values?.mg_mM ?? "30");
  const resistant = !!(values?.dmso_resistant_filter);
  const L = volume_mL / 1000;

  const peg_g   = Math.round(100 * L * 10) / 10;        // 10% w/v
  const mgcl2_mL = Math.round(MG_PER_L[mg_mM] * L * 10) / 10;
  const mgcl2_g  = Math.round(0.001 * MG_PER_L[mg_mM] * L * 203.30 * 10) / 10;  // hexahydrate
  const dmso_mL = Math.round(50 * L * 10) / 10;          // 5% v/v

  // THE DMSO STEP IS WHERE THIS GETS RUINED, so it decides the step order rather than being a
  // parenthesis. Filter it through cellulose nitrate and the filter goes; autoclave the whole
  // thing and it precipitates. Both failures look like a bad batch of cells a week later.
  const dmsoStep = resistant
    ? `Add the **${dmso_mL} mL DMSO**, then filter sterilise through 0.22 µm.`
    : `Filter sterilise through 0.22 µm **first**, then add the **${dmso_mL} mL DMSO** to the sterile filtrate. DMSO destroys cellulose-nitrate membranes.`;

  return {
    name: "Preparation of TSS",
    description: `${volume_mL} mL of Transformation and Storage Solution, ${mg_mM} mM Mg²⁺.`,
    derived: { volume_mL, peg_g, mgcl2_mL, dmso_mL, mg_mM: Number(mg_mM) },
    template: `
**Never autoclave TSS — it precipitates.** Filter sterilise only, and set the pH *before* you do.

| | |
|---|---|
| PEG 8000 | **${peg_g} g** |
| 1 M MgCl₂ | **${mgcl2_mL} mL** (or ${mgcl2_g} g MgCl₂·6H₂O) |
| DMSO | **${dmso_mL} mL** |
| LB | to **${volume_mL} mL** |

1. Dissolve the PEG in roughly 0.7 volumes of LB. It is slow; gentle warming helps.
2. Add the MgCl₂.
3. **Adjust to pH 6.5.** The paper's TSS is deliberately acidic, and this is the last chance —
   after sterilising you cannot put a probe in it.
4. Bring to ${volume_mL} mL with LB.
5. ${dmsoStep}
6. Store at 4 °C or −20 °C.

**Magnesium here is ${mg_mM} mM.** The source paper says 50 mM, the OpenWetWare recipe this lab's
cells have been made from works out at 30 mM, and published versions run 20–50. Write down which
you used; the choice is invisible in the bottle.

**PEG 3350 beats PEG 8000** in the original paper. Other sizes work with some loss of efficiency.

Recipe: \`c6-solutions TSS\`. Used by the TSS competent cell prep at about 5 % of culture volume,
so ${volume_mL} mL serves roughly ${Math.round(volume_mL * 20 / 1000)} L of culture.
`
  };
}
