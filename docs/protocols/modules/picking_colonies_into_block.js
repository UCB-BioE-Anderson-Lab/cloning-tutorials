// picking_colonies_into_block.js
// Pick colonies from transformation plates into a deep-well block for overnight growth.

// Timing — see docs/protocols/TIMING.txt. Minutes.
export const timing = {
  ends_at: "block or tubes into the shaking incubator",
  work: [
    { label: "photograph the plates", min: 5, max: 5 },
    { label: "fill a well", min: 1 / 6, each: "well" },
    { label: "pick a colony", min: 1 / 3, each: "colony" },
    { label: "cover with the airpore sheet", min: 2, max: 2 },
    { label: "into the incubator", min: 0.5, max: 0.5 }
  ],
  wait: [{ label: "overnight growth", min: 16 * 60, max: 36 * 60 }],
  limits: [
    {
      step: "growth",
      min: 16 * 60,
      max: 36 * 60,
      why: "refrigerate by 36 h — past that the cultures overgrow"
    }
  ],
  unknown: []
};

export const inputs = [
  { name: "samples", type: "number", label: "Number of plates to pick from", default: 6, step: 1 },
  { name: "colonies_per_sample", type: "number", label: "Colonies per plate", default: 4, step: 1 },
  { name: "block_wells", type: "number", label: "Wells per block", default: 24, step: 24 },
  { name: "blocks", type: "number", label: "Number of blocks", default: 1, step: 1 },
  { name: "well_volume_mL", type: "number", label: "Medium per well (mL)", default: 4, step: 1 },
  { name: "antibiotic", type: "text", label: "Antibiotic in the medium", default: "carb" }
];

// Cultures can go into individual labelled tubes or into a positional block; the two
// differ in whether pick order matters. Growth window from JCA, 2026-09-07.
const MAX_TUBES = 4;
const GROW_MIN_H = 16;
const GROW_MAX_H = 36;

export function factory(values = {}) {
  const samples = Math.max(1, Number(values?.samples ?? 6));
  const per = Math.max(1, Number(values?.colonies_per_sample ?? 4));
  const perBlock = Math.max(1, Number(values?.block_wells ?? 24));
  const blocks = Math.max(1, Number(values?.blocks ?? 1));
  const wells = perBlock * blocks;
  const vol = Number(values?.well_volume_mL ?? 4);
  // Not always carb — it follows the selection on the labsheet. An empty string leaves it
  // unnamed, which is what the printed cheatsheet passes: a static sheet that commits to
  // one antibiotic will have someone make up the wrong medium.
  const abRaw = String(values?.antibiotic ?? "carb").trim();
  const abNamed = abRaw !== "";
  const ab = abNamed ? abRaw : "antibiotic";

  const used = samples * per;
  const fits = used <= wells;
  const overflow = fits
    ? ""
    : `\n> ⚠️ **This does not fit.** ${samples} plates × ${per} colonies = **${used} wells**, and
> ${blocks} × ${perBlock}-well block${blocks > 1 ? "s" : ""} gives **${wells}**. Add a block, or
> pick fewer colonies.\n`;

  return {
    name: "Picking Colonies into a Block",
    description: `Pick ${per} colonies from each of ${samples} plates into ${blocks} × ${perBlock}-well block${blocks > 1 ? "s" : ""}.`,
    includes: { required: [], optional: ["parafilm_sealing_plates"] },
    derived: {
      samples,
      colonies_per_sample: per,
      wells_used: used,
      block_wells: perBlock,
      blocks,
      well_volume_mL: vol,
      antibiotic: ab,
      antibiotic_named: abNamed,
      max_tubes: MAX_TUBES,
      grow_min_h: GROW_MIN_H,
      grow_max_h: GROW_MAX_H,
      fits
    },
    template: `
**Plan**
- ${samples} plates × ${per} colonies = **${used} cultures**.
${overflow}
**Pick into tubes or a block**
- **Up to ${MAX_TUBES} cultures:** individual **snap-cap culture tubes**, one per clone.
  Each tube is **labelled with its own clone ID**, so the order you pick in does not matter.
- **More than that:** a **${perBlock}-well block**. Wells are identified by **position**, not
  by a label on the well, so the layout has to match the labsheet exactly.

**Procedure**
1. **Photograph the plates twice** — under **blue-light transillumination** and under
   **ambient light** — and save both. These are the only record of what the colonies looked
   like before you picked them.
2. **Label your vessels.** Tubes: write the clone ID on each (\`pP6-79A\`, and so on).
   Block: write the labels on the **airpore sheet**, not on the block.
3. Fill each tube or well with **${vol} mL 2YT + ${ab}**${abNamed ? `` : ` — the antibiotic named on your labsheet, which is not always carb`}.
4. **Pick ${per} colonies from each plate.** Touch a sterile toothpick to a single colony and
   drop the toothpick in. It stays there.
   - **Pick the ones that are easy to pick and look healthy:** well separated, round and
     smooth. Big and well isolated is usually best.
   - **Avoid contorted or smudgy colonies.** That appearance means water has seeped across
     the plate, or two colonies have grown into one.
   - **Which colonies to choose is set by the experiment** — brightest, smallest, largest,
     red, or deliberately naive. Your labsheet says which. There is no general rule.
   - **Into a block, fix the order before you start and write it down.** Wells are identified
     by **position**, not by anything written on the block, so if your record and the block
     disagree the results are silently scrambled — nothing errors. Use the grid on your
     labsheet if it has one; **if it does not, draw the grid yourself** and keep it with the
     block. Labelled tubes do not have this problem.
5. **Cover.** Tubes: their caps, loosely, so they can breathe. Block: the **airpore sheet**.
6. Grow in the **shaking incubator**, **${GROW_MIN_H}–${GROW_MAX_H} h**. Refrigerate by
   **${GROW_MAX_H} h** — past that the cultures overgrow.
7. **Wrap the plates with parafilm** and store them **upside-down in the fridge**. You may need
   to go back to them.
`
  };
}
