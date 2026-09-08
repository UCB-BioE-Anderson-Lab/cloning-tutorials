// golden_gate_assembly.js
// One-pot cut-and-ligate assembly with a Type IIS enzyme and T4 DNA ligase.
//
// We run GG1, the program on our thermocycler: 25 × (37 °C 2 min → 16 °C 5 min), then
// 45 °C 10 min and 80 °C 10 min. Its parameters here come from the 2025 printed bench
// card, the only written record of it; worth confirming against the machine.
//
// NEB's own recommendation for their kit differs, and is noted in the template for the
// planning audience. It is deliberately NOT on the printed cheatsheet: at the bench the
// instruction is "run GG1" and nothing else.
//
// docs/wetlab/assembly.md describes a third program (extended 37 °C then 65 °C) that
// matches neither, and is wrong.

// The program loaded on our thermocycler. This is what we run.
const GG1 = {
  name: "GG1",
  cycles: 25,
  cut_min: 2,
  lig_min: 5,
  step45_min: 10,
  step80_min: 10
};

export const inputs = [
  { name: "reactions", type: "number", label: "Number of reactions", default: 1, step: 1 },
  { name: "fragments", type: "number", label: "DNA fragments per reaction", default: 1, step: 1 },
  { name: "enzyme", type: "text", label: "Type IIS enzyme", default: "BsaI" },
  { name: "label_prefix", type: "text", label: "Tube label prefix", default: "a" }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.reactions ?? 1));
  const frags = Math.max(1, Number(values?.fragments ?? 1));
  // The enzyme is not always BsaI — BsmBI, BbsI and others are used depending on which
  // Type IIS sites the fragments were designed with. Passing an empty string leaves it
  // unnamed, which is what the printed cheatsheet does: a static card that commits to one
  // enzyme will have someone pipette the wrong tube.
  const enzymeRaw = String(values?.enzyme ?? "BsaI").trim();
  const named = enzymeRaw !== "";
  const enzyme = named ? enzymeRaw : "Type IIS enzyme";
  const enzProse = named ? enzymeRaw : "the enzyme";
  const enzSite = named ? `${enzymeRaw} site` : "Type IIS site";
  const prefix = String(values?.label_prefix ?? "a");

  // 10 µL reaction. DNA takes 2 µL total, split evenly across the fragments;
  // water makes up the balance so the buffer stays at 1×.
  const per = { dna_total: 2, buffer10x: 1, enzyme: 0.5, ligase: 0.5 };
  const water = 10 - (per.dna_total + per.buffer10x + per.enzyme + per.ligase);
  const perFragment = round2(per.dna_total / frags);

  return {
    name: "Golden Gate Assembly",
    description: `Assemble ${frags} fragment${frags > 1 ? "s" : ""} in ${n} × 10 µL reaction${n > 1 ? "s" : ""} with ${named ? enzymeRaw : "a Type IIS enzyme"} and T4 ligase.`,
    includes: { required: [], optional: [] },
    derived: {
      reactions: n,
      fragments: frags,
      enzyme,
      enzyme_named: named,
      enzyme_prose: enzProse,
      enzyme_site: enzSite,
      total_uL: 10,
      water_uL: water,
      dna_total_uL: per.dna_total,
      dna_per_fragment_uL: perFragment,
      buffer_uL: per.buffer10x,
      enzyme_uL: per.enzyme,
      ligase_uL: per.ligase,
      program: GG1.name,
      cycles: GG1.cycles,
      cut_min: GG1.cut_min,
      lig_min: GG1.lig_min
    },
    template: `
**Reaction** *(10 µL; add in this order, enzymes last)*
- **${water} µL** ddH₂O
- **${per.buffer10x} µL** 10× T4 DNA ligase buffer
- **${per.dna_total} µL** DNA${frags > 1 ? ` — **${perFragment} µL of each** of the ${frags} fragments` : ``}
- **${per.enzyme} µL** ${named ? enzymeRaw : "**Type IIS enzyme — the one on your labsheet**"}
- **${per.ligase} µL** T4 DNA ligase

1. **Label the tube first**, before any liquid goes in. The **top label** is the number from
   your labsheet for this reaction (**${prefix}79**, and so on).
2. Add the reagents to the PCR tube, **enzymes last** — they denature in water or an
   incomplete mix.
3. Mix well and quick spin.
4. Put all the reactions from your section in **one thermocycler block**.

**Thermocycler program: \`${GG1.name}\`**
- Repeat **${GG1.cycles}×**: **37 °C ${GG1.cut_min} min** → **16 °C ${GG1.lig_min} min**
- **45 °C ${GG1.step45_min} min**
- **80 °C ${GG1.step80_min} min**
- **16 °C hold**

**Notes**
${named ? `` : `- **Which enzyme is not fixed.** BsaI, BsmBI and BbsI are all used here. It has to match the
  Type IIS sites designed into your fragments — take it from your labsheet or construction
  file, not from memory or from whichever tube is nearest.
`}- 37 °C is ${enzProse} cutting; 16 °C is T4 ligase sealing. Cycling between them drives the
  reaction toward the fully assembled product, which no longer contains a ${enzSite}.
- **NEB recommends a different program** for their Golden Gate kit (BsaI-HFv2, #E1601),
  selected by insert count:
  - **1 insert** — 37 °C 5 min (or 1 h for library prep) → 60 °C 5 min
  - **2–10 inserts** — (37 °C 1 min → 16 °C 1 min) × 30 → 60 °C 5 min
  - **11–20+ inserts** — (37 °C 5 min → 16 °C 5 min) × 30 → 60 °C 5 min

  The cycling in \`${GG1.name}\` is more generous than any of these, so assembly is not the
  concern. The difference is the tail: **80 °C inactivates ${enzProse}**, so destination plasmid
  that was never cut, or that religated, survives to transform. NEB's 60 °C leaves ${enzProse}
  cutting and destroys it, which is what holds their background down. Worth considering if
  background colonies become a problem.
- Ideally the DNAs are mixed **equimolar**. If your preps are consistent, do not bother normalizing.
- Miniprepped, gel-purified and Zymo-cleaned DNA all work.
- Buffer must end up at **1×**. Scale up or down around that.
`
  };
}

function round2(x) {
  return Math.round(Number(x) * 100) / 100;
}
