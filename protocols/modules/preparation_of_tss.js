export const inputs = [
  { name: "volume_mL", type: "number", label: "TSS to make (mL)", default: 1000, step: 50 },
  { name: "mg_mM", type: "select", label: "Magnesium", options: ["30", "50"], default: "30" },
  { name: "route", type: "select", label: "Sterilisation",
    options: ["autoclave the parts separately", "filter the whole base"], default: "autoclave the parts separately" },
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

// THERE ARE TWO PUBLISHED ROUTES AND THIS MODULE USED TO KNOW ONLY ONE.
//
// It said "never autoclave TSS, filter sterilise only". The first half is right and the second
// half is not. What precipitates is the FINISHED solution — C. French's protocol is explicit:
// *"Do not autoclave the TSS after it has been made, as this causes precipitation"* — and the
// same page sterilises every component except the DMSO by autoclaving before they are mixed.
// 2011 iGEM Minnesota autoclaves PEG, MgCl2 and LB together as one base, pH'd first, and adds
// DMSO after. So the rule is about WHEN, not about the autoclave: nothing that has been brought
// together may go in one, and the parts may.
//
// The split route matters at a litre, where filtering 950 mL of 10 % PEG through 0.22 um is the
// slowest step in the prep by a wide margin. It also dissolves the PEG for free, which is
// otherwise the other slow step.
const ROUTE_FILTER = "filter the whole base";

export function factory(values) {
  const volume_mL = Number(values?.volume_mL ?? 1000);
  const mg_mM = String(values?.mg_mM ?? "30");
  const split = String(values?.route ?? "") !== ROUTE_FILTER;   // the split route is the default
  const resistant = !!(values?.dmso_resistant_filter);
  const L = volume_mL / 1000;
  const r1 = (x) => Math.round(x * 10) / 10;

  const peg_g   = r1(100 * L);                                   // 10% w/v
  const mgcl2_mL = r1(MG_PER_L[mg_mM] * L);
  const mgcl2_g  = r1(0.001 * MG_PER_L[mg_mM] * L * 203.30);     // hexahydrate
  const dmso_mL = r1(50 * L);                                    // 5% v/v

  // THE DMSO IS INSIDE THE FINAL VOLUME, NOT ON TOP OF IT. This module used to say "bring to
  // 1000 mL with LB" and then "add 50 mL DMSO", which makes 1050 mL and puts every component
  // 5 % under strength. Both source recipes make the volume up after the DMSO is counted:
  // OpenWetWare's 2.5 mL of DMSO is inside its 50 mL, and iGEM Minnesota brings the base to
  // 95 mL so that 5 mL of DMSO completes 100.
  const base_mL = r1(volume_mL - dmso_mL);

  // The split route's three parts, which must sum to the final volume.
  const lb2x_mL = r1(volume_mL / 2);                             // 2x LB -> 1x in the final
  const peg_mL  = r1(volume_mL - lb2x_mL - dmso_mL - mgcl2_mL);  // PEG and MgCl2 carrier
  const peg_pct = r1(100 * peg_g / peg_mL);                      // strength of part B as made up

  const dmsoStep = resistant
    ? `Add the **${dmso_mL} mL DMSO**, then filter sterilise through 0.22 µm.`
    : `Filter sterilise through 0.22 µm **first**, then add the **${dmso_mL} mL DMSO** to the sterile filtrate. DMSO destroys cellulose-nitrate membranes.`;

  const filterBody = `
| | |
|---|---|
| PEG 8000 | **${peg_g} g** |
| 1 M MgCl₂ | **${mgcl2_mL} mL** (or ${mgcl2_g} g MgCl₂·6H₂O) |
| DMSO | **${dmso_mL} mL** |
| LB | to **${base_mL} mL** |

1. Dissolve the PEG in roughly 0.7 volumes of LB. It is slow; gentle warming helps.
2. Add the MgCl₂.
3. **Adjust to pH 6.5.** The paper's TSS is deliberately acidic, and this is the last chance — after sterilising you cannot put a probe in it.
4. Bring to **${base_mL} mL** with LB. The DMSO completes the ${volume_mL} mL.
5. ${dmsoStep}
6. Store at 4 °C or −20 °C.
`;

  const splitBody = `
Four parts, each made up on its own. Nothing is mixed until everything is cool.

| part | make up | autoclave |
|---|---|---|
| **A** 2× LB | ${lb2x_mL} mL, pH to **6.5** before it goes in | yes |
| **B** PEG 8000 | **${peg_g} g**, water to **${peg_mL} mL** — about ${peg_pct} % w/v | yes |
| **C** 1 M MgCl₂ | **${mgcl2_mL} mL** (or ${mgcl2_g} g MgCl₂·6H₂O made to ${mgcl2_mL} mL) | yes |
| **D** DMSO | **${dmso_mL} mL** | **no** |

1. **pH part A to 6.5 before it is autoclaved.** Once everything is sterile you cannot put a probe in it.
2. Autoclave A, B and C **in separate bottles**. A standing 1 M MgCl₂ stock serves as C.
3. Let them reach room temperature. The PEG dissolves on the way, which is otherwise the slowest step in the prep.
4. Combine A, B and C in a sterile bottle, then add the **${dmso_mL} mL DMSO**. Total ${volume_mL} mL.
5. Check the pH of a **discarded aliquot** — never the bottle — and write down what it read.
6. Store at 4 °C or −20 °C.

**Do not autoclave it once it is mixed.** That is the step that precipitates, and it is the only
one this rule is about.

**Why the salt and the LB are autoclaved apart.** LB carries phosphate from the tryptone and yeast
extract, and phosphate with 30–50 mM Mg²⁺ at autoclave temperature is the precipitate you are
avoiding. They can meet once both are cool.
`;

  return {
    name: "Preparation of TSS",
    description: `${volume_mL} mL of Transformation and Storage Solution, ${mg_mM} mM Mg²⁺, ${split ? "autoclaved in parts" : "filter sterilised"}.`,
    derived: { volume_mL, peg_g, mgcl2_mL, dmso_mL, base_mL, mg_mM: Number(mg_mM) },
    template: `
**Make the parts separately and autoclave them apart.** It is faster than filtering, it dissolves
the PEG for you, and it is what the published protocols do. The one thing that must never go in an
autoclave is TSS that has already been mixed — that is the step that precipitates.
${split ? splitBody : filterBody}
**The LB ends up 1×** — 2× LB at half the final volume on the split route, or made up to volume
with LB on the filter route. Recipes that carry the PEG in water and top up with 1× LB land nearer
0.7×, which also works; the LB in TSS is there to keep the cells alive, not to grow them.

**Magnesium here is ${mg_mM} mM.** The source paper says 50 mM, the OpenWetWare recipe this lab's
cells have been made from works out at 30 mM, and published versions run 20–50. Write down which
you used; the choice is invisible in the bottle.

**PEG 3350 beats PEG 8000** in the original paper. Other sizes work with some loss of efficiency.
Autoclaving the PEG is published practice — C. French autoclaves a 40 % PEG 3350 stock — but if you
are chasing maximum efficiency, filter part B instead of autoclaving it.

Recipe: \`c6-solutions TSS\`. Used by the TSS competent cell prep at about 5 % of culture volume,
so ${volume_mL} mL serves roughly ${Math.round(volume_mL * 20 / 1000)} L of culture.
`
  };
}
