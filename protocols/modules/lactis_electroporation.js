// lactis_electroporation.js
// Electroporation of Lactococcus lactis — the published procedure, with its own numbers.
//
// **THIS IS ONE ORGANISM'S PROTOCOL AND NOT A GENERIC ONE.** An earlier version took cuvette gap,
// voltage, recovery medium and volumes as inputs and refused to compile without them. JCA,
// 2026-09-17: *"I think we want this a specific L. lactis electroporation protocol, not a generic
// electroporation one with settings we have to pass in. My main reason for that is the rescue
// volume, temps, voltage are all about a different organism, and not the same as e. coli."*
//
// He is right, and `heat_shock_transformation` is the precedent sitting next to this file: it is
// E. coli's procedure with E. coli's numbers in it, not a generic transformation with the heat
// shock temperature passed in. A number that is a property of the organism belongs with the
// organism. What stays parameterised is what genuinely varies per experiment — which plasmid,
// which selection, what the product is called.
//
// **AN ORGANISM IS NOT A LAB.** Nothing here is anybody's convention: the growth medium, the
// osmoprotectant, the field strength and the recovery buffer are the published method for this
// species. The lab-specific parts — which freezer the cells are in, which plates are stocked —
// arrive the way they always do, as inventory and conditions.
//
// ## Where the numbers come from
//
// Holo & Nes (1989), the standard method for this organism: grow with glycine and 0.5 M sucrose to
// weaken the wall chemically, wash into sucrose/glycerol, pulse at 10 kV/cm, and recover in a
// magnesium- and calcium-supplemented medium.
//
// Two independent write-ups in a real project record 40 µL cells, 1 µL DNA, 1 mL of recovery
// medium and 30 °C — and a recovery buffer of SGM17B + 20 mM MgCl2 + 2 mM CaCl2, which is that
// paper's recovery buffer to the salt. Neither recorded the voltage or the gap, which is why this
// file carries them rather than asking.
//
// ## 0.2 cm only
//
// JCA, 2026-09-17: *"Let's put the published procedure in there, with .2 cuvettes, and maybe one
// day we'll do an experiment to figure out how to use .1's. So, just talk about .2's."* 2.0 kV in a
// 0.2 cm gap is 10 kV/cm. The same field in a 0.1 cm cuvette is 1.0 kV, not the 1.75 kV that
// E. coli practice would suggest, and nobody here has run that experiment. So this says one thing.

// Timing — see docs/protocols/TIMING.txt. Minutes.
export const timing = {
  ends_at: "plates into the 30 °C incubator",
  prep: [
    { label: "overnight culture in SGM17B", min: 720, gates: "the day's growth" },
    { label: "cuvettes, water and sucrose/glycerol onto ice", min: 20, gates: "washing" },
    { label: "selective plates warming", min: 10, gates: "plating" }
  ],
  work: [
    { label: "grow from the dilution to OD600 0.2–0.3", min: 120, max: 240 },
    { label: "two cold washes and resuspension", min: 40, max: 60 },
    { label: "pulse, one cuvette at a time", min: 2, max: 3 }
  ],
  wait: [
    { label: "DNA and cells on ice before the pulse", min: 5, max: 5 },
    { label: "on ice after the pulse", min: 5, max: 5 },
    { label: "recovery at 30 °C", min: 60, max: 120 }
  ],
  limits: [
    {
      step: "into recovery medium after the pulse",
      min: 0,
      max: 1,
      why: "the pores reseal in about a minute and the cells are dying while they are open. Late "
         + "recovery is the commonest reason this gives no colonies, and it fails silently — the "
         + "plate is simply blank."
    },
    {
      step: "OD600 at harvest",
      min: 0.2,
      max: 0.3,
      why: "the wall is only weakened while the cells are dividing. Past 0.3 the glycine has "
         + "stopped being incorporated and efficiency falls away."
    }
  ],
  unknown: ["glycine concentration, which is tuned per strain", "plating time per plate"]
};

export const inputs = [
  { name: "plasmid", type: "text", label: "Plasmid", default: "plasmid_name" },
  { name: "host", type: "text", label: "L. lactis strain", default: "L. lactis" },
  { name: "antibiotics", type: "text", label: "Selection (comma-separated)", default: "" },
  { name: "product_name", type: "text", label: "Product name", default: "product_name" }
];

// The organism's numbers. Named here so the steps and the timing read the same values from one
// place, and so a reader can see the whole set without reading the prose.
export const CONDITIONS = {
  cuvette_cm: 0.2,
  volts: 2000,
  field_kV_per_cm: 10,
  time_constant_ms: 5,
  cells_uL: 40,
  dna_uL: 1,
  recovery_uL: 1000,
  harvest_od600: "0.2–0.3",
  grow_C: 30,
  recover_C: 30,
  recover_min: 60,
  recover_max_min: 120,
  plate_uL: [10, 100, 900]
};

export function factory(values = {}) {
  const plasmid = String(values.plasmid ?? "plasmid_name");
  const host = String(values.host ?? "L. lactis");
  const antibiotics = String(values.antibiotics ?? "").split(",").map(s => s.trim()).filter(Boolean);
  const product = String(values.product_name ?? "product_name");
  const c = CONDITIONS;

  const selection = antibiotics.length ? antibiotics.join(", ") : "the selection on your labsheet";
  const name = "Electroporation of L. lactis";
  const description = `Electroporate ${plasmid} into ${host} and plate on ${selection} at ${c.recover_C} °C`;

  const template = `

**What this is for**
- A **retransformation**: the plasmid is already sequence-verified, so this is moving known-good DNA
  into ${host} to assay it. **A few colonies is a result**, not a failure — you are not building a
  library.

**Why this is not the E. coli procedure**
- The wall is dealt with **chemically, before the pulse** — glycine in the growth medium and 0.5 M
  sucrose throughout — and the field is about **half** what *E. coli* gets. Everything below is this
  organism's, including the volumes and the temperatures.

**Plates and labeling**
- One plate per reaction carrying **${selection}**, plus your control plates. Warm them in the
  incubator first; this is slow, so start it before anything else.
- Label the **bottom**: date, your initials, **${host}**, **${plasmid}**, **${selection}**.
{pouring_petri_dishes}

**Day before**
1. Inoculate **SGM17B** — GM17 with **0.5 M sucrose** and **glycine** — and grow at
   **${c.grow_C} °C standing**, not shaking. This organism is a microaerophile and does not want to
   be aerated.
   - **The glycine is the point and its concentration is strain-dependent.** It is what leaves the
     wall thin enough to pulse through. Use the most the strain will still grow in; if growth is
     poor, that is the number to bring down.

**Making the cells**
2. Dilute the overnight into fresh SGM17B and grow to **OD600 ${c.harvest_od600}**.
   - **Do not overshoot.** The wall is only weakened while the cells are dividing.
3. Chill on ice, spin cold, and **wash twice** in ice-cold **0.5 M sucrose + 10 % glycerol**.
   - **Not water.** The wash is where the cells are most fragile, and sucrose/glycerol is holding
     them together as well as taking the salt out. Water takes the salt out and takes the cells
     with it.
4. Resuspend to about a hundredth of the culture volume and keep on ice. **${c.cells_uL} µL** is one
   reaction.

**Pulse**
5. Chill the **${c.cuvette_cm} cm cuvettes**. Add **${c.dna_uL} µL DNA** to **${c.cells_uL} µL
   cells**, mix by flicking, and leave on ice **5 min**.
6. Transfer to the cuvette and **tap it down** so the liquid sits in the bottom with no bubbles — a
   bubble is where the arc starts. **Dry the outside.**
7. Pulse at **${(c.volts / 1000).toFixed(1)} kV** in the **${c.cuvette_cm} cm** cuvette. That is
   **${c.field_kV_per_cm} kV/cm**.
   - **Write down the time constant.** It should be about **${c.time_constant_ms} ms**. It is the
     only evidence you have that the pulse was normal; a short one means salt is left in, and the
     next cuvette will arc too.
   - If it arcs, that sample is gone. Do not re-pulse it.
8. **Immediately** — within seconds — add **${c.recovery_uL} µL** of ice-cold recovery medium:
   **SGM17B + 20 mM MgCl₂ + 2 mM CaCl₂**. Pipette once and transfer to a tube.
   - **This is the step that goes wrong.** The pores reseal in about a minute and the cells are
     dying while they are open. Nothing about a blank plate afterwards will tell you this happened.

**Recovery and plating**
9. **5 min on ice**, then **${c.recover_min}–${c.recover_max_min} min at ${c.recover_C} °C**,
   standing. The resistance gene has to be expressed before **${selection}** means anything.
10. Plate **${c.plate_uL.join(", ")} µL** on **${selection}** agar and incubate at
    **${c.recover_C} °C** for **one to two days**.
    - **Three volumes because the efficiency is low and variable.** One plate will be readable and
      you do not know in advance which.
11. Read against your control plates before picking. → the controls on your labsheet.

`;

  return {
    name,
    description,
    includes: { required: [], optional: ["pouring_petri_dishes"] },
    derived: { plasmid, host, antibiotics, product_name: product, ...c },
    template
  };
}
