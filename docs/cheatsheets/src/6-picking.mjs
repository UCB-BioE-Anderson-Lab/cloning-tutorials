import { blk, steps, bullets } from "../lib.mjs";

export default {
  slug: "picking",
  title: "Picking Colonies",
  module: "picking_colonies_into_block",
  layout: "single",
  values: { samples: 6, colonies_per_sample: 4, block_wells: 24, blocks: 1 },

  build(d) {
    return [
      blk(
        "Protocol",
        steps([
          "<b>Photograph the plates</b> under blue-light transillumination and save the image. Once you have picked, this is the only record of what the colonies looked like.",

          `Fill each well of the block with <b>${d.well_volume_mL} mL 2YT + ${d.antibiotic}</b>.`,

          `Pick <b>${d.colonies_per_sample} colonies from each plate</b>: touch a sterile toothpick to a single colony and drop the toothpick into the well. It stays in.` +
            bullets([
              "<b>Pick in labsheet order, left to right.</b> The block layout has to match the data-entry layout — if it does not, nothing errors, the results are just silently scrambled.",
              "<b>Well-isolated colonies only.</b> Never a small one beside a big one; that is a satellite and usually has no plasmid.",
              "<b>Do not pick by brightness.</b> Choosing the brightest and then correlating against a prediction is circular."
            ]),

          "Write the labels on an <b>airpore sheet</b> and cover the block with it.",

          "Grow <b>overnight in the multitron</b>.",

          "<b>Parafilm the plates</b> and store them <b>upside-down in the fridge</b> — you may need to go back to them."
        ]),
        bullets([
          `${d.samples} plates × ${d.colonies_per_sample} colonies = <b>${d.wells_used} wells</b> of ${d.block_wells}.`,
          "Note why you picked each one (“very green, slow growing”)."
        ])
      )
    ];
  }
};
