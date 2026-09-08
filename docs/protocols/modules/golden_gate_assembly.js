// golden_gate_assembly.js
// One-pot cut-and-ligate assembly with a Type IIS enzyme and T4 DNA ligase.
//
// We run GG1, the program on our thermocycler: 25 × (37 °C 2 min → 16 °C 5 min), then
// 45 °C 10 min and 80 °C 10 min. Its parameters here come from the 2025 printed bench
// card, the only written record of it; worth confirming against the machine.
//
// NEB's own recommendation for their kit (BsaI-HFv2, #E1601) differs — by insert count,
// (37 °C 1 min → 16 °C 1 min) × 30 then 60 °C 5 min for 2–10 inserts. Their closing 60 °C
// keeps the enzyme cutting rather than killing it, which digests uncut and religated vector
// and holds background down. Noted here for planning; deliberately NOT on the bench card,
// where the instruction is "run GG1" and nothing else.
//
// docs/wetlab/assembly.md describes a third program (extended 37 °C then 65 °C) that
// matches neither, and is wrong.

// The program loaded on our thermocycler.
const GG1 = {
  name: "GG1",
  cycles: 25,
  cut_min: 2,
  lig_min: 5,
  step45_min: 10,
  step80_min: 10
};

// The Type IIS enzymes in use here. Which one is set by the construction file, not by
// the protocol — a card that names just one will have someone pipette the wrong tube.
const ENZYMES = ["BsaI", "BsmBI", "BseRI", "AarI", "SapI", "BbsI"];

// Timing — see docs/protocols/TIMING.txt. Minutes.
export const timing = {
  ends_at: "putting the reactions in the thermocycler",
  work: [],
  wait: [
    // GG1: 25 x (37 C 2 min + 16 C 5 min) = 175, then 45 C 10 and 80 C 10.
    { label: "GG1 on the thermocycler", min: 195, max: 195 }
  ],
  limits: [],
  unknown: ["hands-on setup time"]
};

export const inputs = [
  { name: "reactions", type: "number", label: "Number of reactions", default: 1, step: 1 },
  { name: "fragments", type: "number", label: "DNA fragments per reaction", default: 2, step: 1 },
  { name: "enzyme", type: "text", label: "Type IIS enzyme", default: "BsaI" },
  { name: "label_prefix", type: "text", label: "Tube label prefix", default: "a" }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.reactions ?? 1));
  const frags = Math.max(1, Number(values?.fragments ?? 2));
  // Passing an empty string leaves the enzyme unnamed, which is what the printed
  // cheatsheet does.
  const enzymeRaw = String(values?.enzyme ?? "BsaI").trim();
  const named = enzymeRaw !== "";
  const enzyme = named ? enzymeRaw : "Type IIS enzyme";
  const prefix = String(values?.label_prefix ?? "a");

  // 10 µL reaction. DNA is 2 µL total however many fragments there are; water makes up
  // the balance so the buffer stays at 1×.
  const per = { dna_total: 2, buffer10x: 1, enzyme: 0.5, ligase: 0.5 };
  const water = 10 - (per.dna_total + per.buffer10x + per.enzyme + per.ligase);
  const premix = frags > 2;

  return {
    name: "Golden Gate Assembly",
    description: `Assemble ${frags} fragment${frags > 1 ? "s" : ""} in ${n} × 10 µL reaction${n > 1 ? "s" : ""} with ${named ? enzymeRaw : "a Type IIS enzyme"} and T4 ligase.`,
    includes: { required: [], optional: [] },
    derived: {
      reactions: n,
      fragments: frags,
      enzyme,
      enzyme_named: named,
      enzyme_options: ENZYMES,
      needs_premix: premix,
      total_uL: 10,
      water_uL: water,
      dna_total_uL: per.dna_total,
      buffer_uL: per.buffer10x,
      enzyme_uL: per.enzyme,
      ligase_uL: per.ligase,
      program: GG1.name,
      cycles: GG1.cycles,
      cut_min: GG1.cut_min,
      lig_min: GG1.lig_min
    },
    template: `
**Protocol**

1. For each reaction you set up, **top-label a PCR tube** with the name(s) indicated on the
   labsheet (**${prefix}79**, and so on).
2. Retrieve **water** (white **W** tubes) and **T4 ligase buffer** aliquots (**red** tubes)
   from the **enzyme freezer** and **thaw them at room temperature**.
3. Set up the reaction, in order:
   - **${water} µL** water
   - **${per.buffer10x} µL** 10× T4 DNA ligase buffer
   - **${per.dna_total} µL** DNA
   - **${per.ligase} µL** T4 DNA ligase
   - **${per.enzyme} µL** ${named ? enzymeRaw : "restriction enzyme"}
   - **${10} µL** total

   - If you have **more than 2 fragments** to join, premix **equal volumes of each DNA** in a
     tube, then use **${per.dna_total} µL of that mix** for the reaction.
   - Be sure you are using the **right one** of ${ENZYMES.join(", ")}, as indicated in your
     **construction file and labsheets**.
4. Retrieve the **enzyme cooler**, and add **${per.ligase} µL each of the ligase and the
   restriction enzyme** to each sample.
5. **Cap, mix, spin.**
6. Run the **${GG1.name}** program on the thermocycler.

**Program \`${GG1.name}\`**
- Repeat **${GG1.cycles}×**: **37 °C ${GG1.cut_min} min** → **16 °C ${GG1.lig_min} min**
- **45 °C ${GG1.step45_min} min**
- **80 °C ${GG1.step80_min} min**
- **16 °C hold**

**Notes**
- Carry the whole **10 µL** into the transformation. Do not split it.
- Ideally the DNAs are mixed **equimolar**. If your preps are consistent, do not bother normalizing.
- Miniprepped, gel-purified and Zymo-cleaned DNA all work.
- Buffer must end up at **1×**. Scale up or down around that.
`
  };
}
