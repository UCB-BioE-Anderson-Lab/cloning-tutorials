// analytical_gel.js
// Load and run an analytical agarose gel to confirm a PCR worked and the product is the right size.
//
// This is the RUNNING protocol. Casting the 500 mL slabs the gels are cut from is a
// separate procedure: see preparation_of_agarose_gels.
//
// Run conditions: 175 V, about 10 min. The time is an expectation, not a setting — you
// watch the blue front and stop when it is 2/3 to 3/4 down the gel. Nobody sets a timer
// and walks away.

export const inputs = [
  { name: "samples", type: "number", label: "Number of samples", default: 1, step: 1 },
  { name: "agarose_pct", type: "number", label: "Agarose (%)", default: 1, step: 0.1 },
  { name: "dye_uL", type: "number", label: "Loading dye per sample (µL)", default: 8, step: 1 },
  { name: "sample_uL", type: "number", label: "PCR product per sample (µL)", default: 3, step: 1 },
  { name: "load_uL", type: "number", label: "Volume loaded per well (µL)", default: 9, step: 1 },
  { name: "voltage_V", type: "number", label: "Run voltage (V)", default: 175, step: 5 },
  { name: "run_min", type: "number", label: "Approximate run time (min)", default: 10, step: 1 }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.samples ?? 1));
  const pct = Number(values?.agarose_pct ?? 1);
  const dye = Number(values?.dye_uL ?? 8);
  const sample = Number(values?.sample_uL ?? 3);
  const load = Number(values?.load_uL ?? 9);

  const voltage = blankable(values?.voltage_V) ?? 175;
  const runMin = blankable(values?.run_min) ?? 10;
  const lanes = n + 1; // every gel carries one marker lane

  const voltageStr = `**${voltage} V**`;
  const runStr = `**${runMin} min**`;

  return {
    name: "Analytical Gel",
    description: `Run ${n} sample${n > 1 ? "s" : ""} plus a marker on a ${pct}% analytical agarose gel.`,
    includes: { required: [], optional: [] },
    derived: {
      samples: n,
      lanes,
      agarose_pct: pct,
      dye_uL: dye,
      sample_uL: sample,
      load_uL: load,
      voltage_V: voltage,
      run_min: runMin
    },
    template: `
**Why**
This is an **analytical** gel: you are checking that a product formed and that it is the right
size. You are not purifying anything, and nothing is recovered from it.
Gels are **${pct}% agarose in 1× TAE**, cut from pre-made slabs in the fridge.

**Prepare the samples** *(${n} sample${n > 1 ? "s" : ""} + 1 marker = **${lanes} lanes**)*
1. For each sample, put **${dye} µL loading dye** (tube labelled *load*) in a fresh PCR tube.
2. Add **${sample} µL PCR product**, mix, and quick spin.
3. **Marker, one per section:** add **${dye} µL loading dye** to a tube of marker (yellow), mix, spin.

**Set up the rig**
4. Cut a slab with enough wells for every sample, the marker, and a few spare.
5. Put the gel in the rig and fill with **1× TAE** until it is just covered.
6. Brace the gel with the plastic wedge so it cannot float.
7. Write the sample order on a paper strip and line the tubes up to match it.

**Load**
8. With a **P20 set to ${load} µL**, load each well.
   - Set below the full volume on purpose: it avoids drawing an air gap that stops the well filling.
   - Do not puncture the bottom of a well. If you do, the sample runs straight out — use another lane.

**Run**
9. Lid and leads on: **run to red**. DNA is negative and moves to the red electrode, so it must
   start at the black end.
10. Run at ${voltageStr}. It takes **about ${runMin} min**, but **do not set a timer and walk
    away** — check it every minute or so and watch how the blue band is progressing. Stop when
    the front is **2/3–3/4 down the gel**.

**Image**
11. Move the gel to the imager and lay the label strip above it.
12. Photograph it **with your phone through the orange filter**.
13. Name the file by date and time (\`2022_05_23-10am.png\`) and upload it.

**Notes**
- Smaller fragments move faster.
- The loading dye does two jobs: glycerol weighs the sample down into the well, and the
  colour tracks how far the run has gone. It does not bind the DNA.
`
  };
}

// An empty, missing or non-numeric value means "not measured yet".
function blankable(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
