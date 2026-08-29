// picking_colonies_into_block.js
// Pick colonies from transformation plates into a deep-well block for overnight growth.

export const inputs = [
  { name: "samples", type: "number", label: "Number of plates to pick from", default: 6, step: 1 },
  { name: "colonies_per_sample", type: "number", label: "Colonies per plate", default: 4, step: 1 },
  { name: "block_wells", type: "number", label: "Wells in the block", default: 24, step: 24 },
  { name: "well_volume_mL", type: "number", label: "Medium per well (mL)", default: 4, step: 1 },
  { name: "antibiotic", type: "text", label: "Antibiotic in the medium", default: "carb" }
];

export function factory(values = {}) {
  const samples = Math.max(1, Number(values?.samples ?? 6));
  const per = Math.max(1, Number(values?.colonies_per_sample ?? 4));
  const wells = Math.max(1, Number(values?.block_wells ?? 24));
  const vol = Number(values?.well_volume_mL ?? 4);
  const ab = String(values?.antibiotic ?? "carb");

  const used = samples * per;
  const fits = used <= wells;
  const overflow = fits
    ? ""
    : `\n> ⚠️ **This does not fit.** ${samples} plates × ${per} colonies = **${used} wells**, and the
> block has **${wells}**. Reduce the number of plates or the colonies per plate, or use a
> second block.\n`;

  return {
    name: "Picking Colonies into a Block",
    description: `Pick ${per} colonies from each of ${samples} plates into a ${wells}-well block.`,
    includes: { required: [], optional: ["parafilm_sealing_plates"] },
    derived: { samples, colonies_per_sample: per, wells_used: used, block_wells: wells },
    template: `
**Plan**
- ${samples} plates × ${per} colonies = **${used} wells** of ${wells}.
${overflow}
**Procedure**
1. **Photograph the plates** under blue light transillumination and save the image. This is the
   only record of what the colonies looked like before you picked them.
2. Fill each well of the block with **${vol} mL 2YT + ${ab}**.
3. **Pick ${per} representative colonies from each plate.**
   - Touch a sterile toothpick to a single well-isolated colony and drop the toothpick into
     the well. It stays in.
   - **Pick in the order the samples are listed, left to right.** The block's layout has to
     match the data-entry layout or the results are silently scrambled.
4. Write the labels on an **airpore sheet** and cover the block with it.
5. Grow **overnight in the multitron**.
6. **Wrap the plates with parafilm** and store them **upside-down in the fridge**. You may need
   to go back to them.
`
  };
}
