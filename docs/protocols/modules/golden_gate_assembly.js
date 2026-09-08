// golden_gate_assembly.js
// One-pot cut-and-ligate assembly with a Type IIS enzyme and T4 DNA ligase.
//
// The thermocycler program below is the one on the printed bench card and is the
// program actually loaded as main/GG1. docs/wetlab/assembly.md currently describes a
// different ending (extended 37 °C then 65 °C) and is wrong; this module is canonical.

export const inputs = [
  { name: "reactions", type: "number", label: "Number of reactions", default: 1, step: 1 },
  { name: "fragments", type: "number", label: "DNA fragments per reaction", default: 1, step: 1 },
  { name: "enzyme", type: "text", label: "Type IIS enzyme", default: "BsaI" },
  { name: "cycles", type: "number", label: "Cut/ligate cycles", default: 25, step: 5 },
  { name: "label_prefix", type: "text", label: "Tube label prefix", default: "a" }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.reactions ?? 1));
  const frags = Math.max(1, Number(values?.fragments ?? 1));
  const enzyme = String(values?.enzyme ?? "BsaI");
  const cycles = Math.max(1, Math.round(Number(values?.cycles ?? 25)));
  const prefix = String(values?.label_prefix ?? "a");

  // 10 µL reaction. DNA takes 2 µL total, split evenly across the fragments;
  // water makes up the balance so the buffer stays at 1×.
  const per = { dna_total: 2, buffer10x: 1, enzyme: 0.5, ligase: 0.5 };
  const water = 10 - (per.dna_total + per.buffer10x + per.enzyme + per.ligase);
  const perFragment = round2(per.dna_total / frags);

  return {
    name: "Golden Gate Assembly",
    description: `Assemble ${frags} fragment${frags > 1 ? "s" : ""} in ${n} × 10 µL reaction${n > 1 ? "s" : ""} with ${enzyme} and T4 ligase.`,
    includes: { required: [], optional: [] },
    derived: {
      reactions: n,
      fragments: frags,
      enzyme,
      cycles,
      total_uL: 10,
      water_uL: water,
      dna_total_uL: per.dna_total,
      dna_per_fragment_uL: perFragment,
      buffer_uL: per.buffer10x,
      enzyme_uL: per.enzyme,
      ligase_uL: per.ligase,
      program: "main/GG1"
    },
    template: `
**Reaction** *(10 µL; add in this order, enzymes last)*
- **${water} µL** ddH₂O
- **${per.buffer10x} µL** 10× T4 DNA ligase buffer
- **${per.dna_total} µL** DNA${frags > 1 ? ` — **${perFragment} µL of each** of the ${frags} fragments` : ``}
- **${per.enzyme} µL** ${enzyme}
- **${per.ligase} µL** T4 DNA ligase

1. Add the reagents to a PCR tube, **enzymes last** — they denature in water or an incomplete mix.
2. Mix well and quick spin.
3. Label each tube with your assigned code (**${prefix}79**, and so on).
4. Put all the reactions from your section in **one thermocycler block**.

**Thermocycler program ${"`main/GG1`"}**
- Repeat **${cycles}×**: **37 °C 2 min** → **16 °C 5 min**
- **45 °C 10 min**
- **80 °C 10 min**
- **16 °C hold**

**Notes**
- 37 °C is ${enzyme} cutting; 16 °C is T4 ligase sealing. Cycling between them drives the
  reaction toward the fully assembled product, which no longer contains a ${enzyme} site.
- ${cycles} cycles is the default. Fewer (we often use 15) is faster but less efficient.
- Ideally the DNAs are mixed **equimolar**. If your preps are consistent, do not bother normalizing.
- Miniprepped, gel-purified and Zymo-cleaned DNA all work.
- Buffer must end up at **1×**. Scale up or down around that.
- **Alternative:** a straight **2 h incubation at 37 °C** also works and is popular.
`
  };
}

function round2(x) {
  return Math.round(Number(x) * 100) / 100;
}
