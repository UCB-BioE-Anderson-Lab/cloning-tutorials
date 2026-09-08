import { blk, steps, bullets } from "../lib.mjs";

export default {
  slug: "picking",
  title: "Picking Colonies",
  module: "picking_colonies_into_block",
  layout: "single",
  // No antibiotic name. It follows the selection on the labsheet, and a printed sheet
  // that commits to carb will have someone make up the wrong medium.
  values: { samples: 6, colonies_per_sample: 4, block_wells: 24, blocks: 1, antibiotic: "" },

  build(d) {
    return [
      blk(
        "Protocol",
        steps([
          "<b>Photograph the plates twice</b> — under <b>blue-light transillumination</b> and " +
            "under <b>ambient light</b>. Save both. Once you have picked, these are the only " +
            "record of what the colonies looked like.",

          `<b>Tubes or a block.</b> Up to <b>${d.max_tubes} cultures</b>: individual snap-cap ` +
            `culture tubes. More than that: a <b>${d.block_wells}-well block</b>.`,

          "<b>Label.</b> Tubes: the clone ID on each tube. Block: the labels go on the " +
            "<b>airpore sheet</b>, not the block — the wells are identified by position.",

          `Fill each tube or well with <b>${d.well_volume_mL} mL 2YT + ${d.antibiotic}</b> — the one on your labsheet. <b>It is not always carb.</b>`,

          `Pick <b>${d.colonies_per_sample} colonies from each plate</b>: touch a sterile toothpick to a single colony and drop it in. It stays there.` +
            bullets([
              "<b>Into a block, pick in labsheet order, left to right.</b> The layout has to match the data-entry layout — if it does not, nothing errors, the results are just silently scrambled. Into labelled tubes it does not matter; the label travels with the culture.",
              "<b>Well-isolated colonies only.</b> Never a small one beside a big one; that is a satellite and usually has no plasmid.",
              "<b>Do not pick by brightness.</b> Choosing the brightest and then correlating against a prediction is circular."
            ]),

          "<b>Cover.</b> Tubes: caps on loosely, so they can breathe. Block: the airpore sheet.",

          `Grow in the <b>shaking incubator</b>, <b>${d.grow_min_h}–${d.grow_max_h} h</b>. Into the fridge by <b>${d.grow_max_h} h</b> — past that they overgrow.`,

          "<b>Parafilm the plates</b> and store them <b>upside-down in the fridge</b> — you may need to go back to them."
        ]),
        bullets([`Note why you picked each one (“very green, slow growing”).`])
      )
    ];
  }
};
