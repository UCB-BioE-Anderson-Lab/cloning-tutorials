import { blk, p, steps, bullets, flag } from "../lib.mjs";

export default {
  slug: "picking",
  title: "Picking Colonies",
  module: "picking_colonies_into_block",
  values: { samples: 6, colonies_per_sample: 4, block_wells: 24, blocks: 1 },

  build(d) {
    return [
      blk(
        "Before you touch a plate",
        p(
          "<b>Photograph the plates</b> under blue-light transillumination and save the image. " +
            "Once you have picked, this is the only record of what the colonies looked like."
        )
      ),

      blk(
        "Plan",
        p(
          `${d.samples} plates × ${d.colonies_per_sample} colonies = <b>${d.wells_used} wells</b>, ` +
            `across ${d.blocks} × ${d.block_wells}-well block${d.blocks > 1 ? "s" : ""}.`
        ),
        p(`Fill every well with <b>${d.well_volume_mL} mL 2YT + ${d.antibiotic}</b> first.`)
      ),

      blk(
        "Pick",
        steps([
          "Touch a sterile toothpick to a single well-isolated colony.",
          "Drop the toothpick into the well. It stays in.",
          `Repeat for ${d.colonies_per_sample} colonies from each plate.`,
          "Write the labels on an <b>airpore sheet</b> and cover the block with it.",
          "Grow overnight in the multitron."
        ])
      ),

      blk(
        "Order matters",
        p(
          "<b>Pick in the order the samples are listed, left to right.</b> The block's layout " +
            "has to match the data-entry layout. If it does not, nothing errors — the results " +
            "are just silently scrambled, and you find out weeks later."
        )
      ),

      blk(
        "Which colonies",
        bullets([
          "<b>Well-isolated only.</b> Never a small colony sitting beside a big one — that is a satellite, and it usually has no plasmid.",
          "A clone that reads at background <i>and</i> whose miniprep yields nothing was probably a satellite. Note it and exclude it.",
          "Write down why you picked each one (\"very green, slow growing\")."
        ]),
        flag(
          "Do not pick by brightness.",
          "If you choose the brightest and then correlate brightness against a prediction, " +
            "the argument is circular. Pick naively. This is the mistake that cost Tlib2 its main result."
        )
      ),

      blk(
        "Afterwards",
        steps([
          "Wrap the plates with parafilm.",
          "Store them <b>upside-down in the fridge</b> — you may need to go back to them.",
          "Upload the plate photo."
        ])
      )
    ];
  }
};
