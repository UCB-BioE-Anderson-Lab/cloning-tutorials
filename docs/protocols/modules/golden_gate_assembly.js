// golden_gate_assembly.js
// One-pot cut-and-ligate assembly with a Type IIS enzyme and T4 DNA ligase.
//
// The thermocycler program follows NEB's official recommendation for the NEBridge Golden
// Gate Assembly Kit (BsaI-HFv2, NEB #E1601), whose manual gives the program as a function
// of insert count:
//
//   1 insert       37 °C 5 min (cloning) or 37 °C 1 h (library prep)  → 60 °C 5 min
//   2–10 inserts   (37 °C 1 min → 16 °C 1 min) × 30                   → 60 °C 5 min
//   11–20+ inserts (37 °C 5 min → 16 °C 5 min) × 30                   → 60 °C 5 min
//
// The closing 60 °C favours Type IIS cutting without ligation, so any uncut or religated
// destination plasmid is linearised and the transformation background drops.
//
// This differs from the program historically loaded on our thermocycler as main/GG1
// (25 × 37/16, then 45 °C 10 min and 80 °C 10 min). See the note in the template.
// docs/wetlab/assembly.md describes a third ending (extended 37 °C then 65 °C) and is
// wrong on every count.

export const inputs = [
  { name: "reactions", type: "number", label: "Number of reactions", default: 1, step: 1 },
  { name: "fragments", type: "number", label: "DNA fragments per reaction", default: 1, step: 1 },
  { name: "enzyme", type: "text", label: "Type IIS enzyme", default: "BsaI" },
  { name: "library_prep", type: "boolean", label: "Library prep? (single insert, long digest)" },
  { name: "label_prefix", type: "text", label: "Tube label prefix", default: "a" }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.reactions ?? 1));
  const frags = Math.max(1, Number(values?.fragments ?? 1));
  const enzyme = String(values?.enzyme ?? "BsaI");
  const prefix = String(values?.label_prefix ?? "a");
  const libRaw = values?.library_prep;
  const libraryPrep = (libRaw === true || libRaw === "true" || libRaw === "on");

  // NEB's program table, selected by insert count.
  const prog = selectProgram(frags, libraryPrep);

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
      library_prep: libraryPrep,
      total_uL: 10,
      water_uL: water,
      dna_total_uL: per.dna_total,
      dna_per_fragment_uL: perFragment,
      buffer_uL: per.buffer10x,
      enzyme_uL: per.enzyme,
      ligase_uL: per.ligase,
      ...prog
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

**Thermocycler program** *(NEB, for ${prog.program_label})*
${prog.cycles > 0 ? `- Repeat **${prog.cycles}×**: **37 °C ${prog.cut_min} min** → **16 °C ${prog.lig_min} min**
` : `- **37 °C ${prog.hold_label}**
`}- **60 °C 5 min**
- **4 °C hold**

**Notes**
- 37 °C is ${enzyme} cutting; 16 °C is T4 ligase sealing. Cycling between them drives the
  reaction toward the fully assembled product, which no longer contains a ${enzyme} site.
- The closing **60 °C** is not an inactivation step. It favours ${enzyme} cutting **without**
  ligation, so any destination plasmid that was never cut, or that religated, gets linearised.
  That is what keeps the background colonies down. Do not skip it.
- **Check what your thermocycler's stored program actually does.** Our \`main/GG1\` predates
  this and ends differently (45 °C 10 min, then 80 °C 10 min). Either reprogram it to match
  the above, or set the program by hand.
- Ideally the DNAs are mixed **equimolar**. If your preps are consistent, do not bother normalizing.
- Miniprepped, gel-purified and Zymo-cleaned DNA all work.
- Buffer must end up at **1×**. Scale up or down around that.
`
  };
}

/**
 * NEB's suggested assembly protocol, from the NEBridge Golden Gate Assembly Kit
 * (BsaI-HFv2, NEB #E1601) manual. Selected by number of inserts.
 */
function selectProgram(fragments, libraryPrep) {
  if (fragments <= 1) {
    return {
      cycles: 0,
      cut_min: libraryPrep ? 60 : 5,
      lig_min: 0,
      hold_label: libraryPrep ? "1 h" : "5 min",
      program_label: libraryPrep ? "1 insert, library prep" : "1 insert, cloning"
    };
  }
  if (fragments <= 10) {
    return {
      cycles: 30,
      cut_min: 1,
      lig_min: 1,
      hold_label: null,
      program_label: `${fragments} inserts`
    };
  }
  return {
    cycles: 30,
    cut_min: 5,
    lig_min: 5,
    hold_label: null,
    program_label: `${fragments} inserts`
  };
}

function round2(x) {
  return Math.round(Number(x) * 100) / 100;
}
