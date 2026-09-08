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
          "<b>Photograph the plates twice</b> — <b>blue-light transillumination</b> and <b>ambient " +
            "light</b>. Save both; once you have picked, these are the only record.",

          `<b>Tubes or a block.</b> Up to <b>${d.max_tubes} cultures</b>: snap-cap tubes, each ` +
            `labelled with its clone ID. More than that: a <b>${d.block_wells}-well block</b>, ` +
            `labels on the <b>airpore sheet</b> — the wells are identified by position.`,

          `Fill each tube or well with <b>${d.well_volume_mL} mL 2YT + ${d.antibiotic}</b> — the one on your labsheet. <b>It is not always carb.</b>`,

          `Pick <b>${d.colonies_per_sample} colonies from each plate</b>: touch a sterile toothpick to a single colony and drop it in. It stays there.` +
            bullets([
              "<b>Pick ones that are easy to pick and look healthy</b> — well separated, round and smooth. Big and well isolated is usually best. Contorted or smudgy means water seepage, or two colonies grown into one.",
              "<b>Which colonies to choose is set by the experiment</b> — brightest, smallest, largest, red, or deliberately naive. <b>Your labsheet says which.</b>",
              "<b>Into a block, fix the order before you start and write it down.</b> Wells go by position, so if your record and the block disagree the results are silently scrambled — nothing errors. Use your labsheet grid if it has one; <b>if not, draw one yourself</b> and keep it with the block. Tubes do not have this problem."
            ]),

          `<b>Cover</b> — tubes: caps on loosely so they breathe; block: the airpore sheet — and grow in the <b>shaking incubator</b>, <b>${d.grow_min_h}–${d.grow_max_h} h</b>. Fridge by <b>${d.grow_max_h} h</b> or they overgrow.`,

          "<b>Parafilm the plates</b>, store them <b>upside-down in the fridge</b> — you may need them again."
        ])
      )
    ];
  }
};
