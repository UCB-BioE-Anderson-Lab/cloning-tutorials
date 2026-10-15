// gibson_assembly.js
// One-pot isothermal assembly by homologous overlap: an exonuclease chews back the 5' ends,
// the single-stranded overhangs anneal, a polymerase fills the gaps and a ligase seals them.
//
// We run GIB2, the program on our thermocycler: 50 °C for 1 hour, then hold at 16 °C.
// Its parameters come from JCA, 2026-10-15, and were recorded NOWHERE before that date —
// which is why this module exists. Three SynThera labpackets (SLIP4-singles, SLIP4-8,
// SLIP5) had been issuing "GIB2" to students while carrying only the name, and on
// 2026-10-14 one of them stood at a bench and asked what it meant: "what is the gibson
// thermocycler setting you'd like us to use? Since there is no gibson setting in the
// thermocyclers."
//
// The vendor recommendation differs, and the difference is deliberate. NEB's and Takara's
// 2X master-mix protocols scale the hold by fragment count — 15 min for 2–3 fragments,
// 60 min for 4–6 — while Gibson's original 2009 one-step method was 60 min at 50 °C flat.
// We run the original length for every fragment count. Noted here for planning;
// deliberately NOT on the bench card, where the instruction is "run GIB2" and nothing else.
//
// That is the same division golden_gate_assembly.js draws for GG1, and for the same reason:
// a card that argues with itself is a card somebody improvises against.

import GIB2 from "../../data/thermocycler_programs/GIB2.js";
import { runtimeSeconds } from "../../data/thermocycler_programs/index.js";

// Timing — see protocols/TIMING.txt. Minutes.
export const timing = {
  ends_at: "putting the reactions in the thermocycler",
  work: [],
  wait: [
    // READ FROM THE PROGRAM, not retyped. GG1's 195 minutes were written out by hand in a
    // comment beside the number, which is how a program and its stated duration drift apart.
    { label: "GIB2 on the thermocycler", min: runtimeSeconds("GIB2") / 60,
      max: runtimeSeconds("GIB2") / 60 }
  ],
  limits: [],
  unknown: ["hands-on setup time"]
};

export const inputs = [
  { name: "reactions", type: "number", label: "Number of reactions", default: 1, step: 1 },
  { name: "fragments", type: "number", label: "DNA fragments per reaction", default: 2, step: 1 },
  { name: "label_prefix", type: "text", label: "Tube label prefix", default: "g" }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.reactions ?? 1));
  const frags = Math.max(1, Number(values?.fragments ?? 2));
  const prefix = String(values?.label_prefix ?? "g");

  // THE PREMIX IS HOW THE LAB ACTUALLY DOES IT, and the first version of this file got it
  // wrong. SLIP5's labpacket builds a 20 µL premix — 14 µL water plus 2 µL of each of
  // 17a/17b/17c — and then takes 5 µL of THAT into a 10 µL reaction with 5 µL of 2X GA
  // Master Mix. Modelling it as "add 2 µL of each fragment directly" put 6 µL of DNA into a
  // 5 µL half-volume at three fragments, which the over-volume check caught: the check was
  // right and the model was wrong.
  const total = 10;
  const masterMix = total / 2;          // 2X mix: its half of the volume is fixed
  const premixTotal = 20;
  const perFragment = 2;
  const premixWater = premixTotal - perFragment * frags;

  return {
    name: "Gibson Assembly",
    description: `Assemble ${frags} fragment${frags > 1 ? "s" : ""} in ${n} × ${total} µL reaction${n > 1 ? "s" : ""} with 2X GA Master Mix.`,
    includes: { required: [], optional: [] },
    derived: {
      reactions: n,
      fragments: frags,
      total_uL: total,
      master_mix_uL: masterMix,
      premix_total_uL: premixTotal,
      premix_water_uL: premixWater,
      premix_per_fragment_uL: perFragment,
      premix_into_reaction_uL: masterMix,
      // A FINDING, NOT A CLAMP. Past ten fragments at 2 µL each there is no room for water
      // in the premix and the recipe stops being the lab's recipe. Saying so lets a caller
      // concentrate the fragments or scale the premix, instead of silently shrinking
      // somebody's DNA to make the arithmetic close.
      premix_over_volume: premixWater < 0,
      program: GIB2.name,
      hold_c: GIB2.steps[0].temp_c,
      hold_min: GIB2.steps[0].time_s / 60
    },
    template: `
**Protocol**

1. For each reaction you set up, **top-label a PCR tube** with the name(s) indicated on the
   labsheet (**${prefix}17**, and so on).
2. Retrieve **water** (white **W** tubes) and **2X GA Master Mix** from the **enzyme
   freezer**. Thaw the master mix on ice.
3. Make the **premix** (${premixTotal} µL): **${premixWater} µL** water, then
   **${perFragment} µL of each of the ${frags} fragment${frags > 1 ? "s" : ""}**.
4. Set up the reaction: **${masterMix} µL** premix + **${masterMix} µL** 2X GA Master Mix.
5. **Never let enzymes warm up.** Take the enzyme cooler out of the freezer only while you
   are actively using it, and hold the tube by its top while dispensing.
6. Combine all the reactions from your session on one block and **run GIB2**:
   **${GIB2.steps[0].temp_c} °C for ${GIB2.steps[0].time_s / 60} minutes**, then hold at
   **${GIB2.steps[1].temp_c} °C**.
`.trim()
  };
}

export default factory;
