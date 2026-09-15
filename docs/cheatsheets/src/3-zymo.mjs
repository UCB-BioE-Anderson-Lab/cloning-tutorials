import { blk, steps, bullets } from "../lib.mjs";

export default {
  slug: "zymo",
  title: "Zymo Cleanup",
  module: "zymo_cleanup",
  layout: "single",
  values: { reactions: 1 },

  build(d) {
    return [
      blk(
        "Protocol",
        steps([
          "<b>Side-label one Zymo column per sample</b> with an <b>ethanol-resistant pen</b> — <b>not a Sharpie</b>. Put each column in a collection tube in a rack.",

          `Pipette <b>${d.adb_uL} µL ADB</b> into the column.`,

          `Transfer all <b>~${d.sample_uL} µL</b> of the reaction into the ADB <b>in the column</b>, and pipette up and down to mix.` +
            bullets([
              "<b>Alternatively</b>, premix ADB and sample in an Eppendorf tube, vortex, spin, then transfer to the column. Several ways work — what matters is that it ends up <b>well mixed and in the column</b>."
            ]),

          `<b>Spin ${d.bind_s} s</b> at full speed. Discard the flow-through.`,

          `Add <b>${d.pe_uL} µL PE</b>. <b>Spin ${d.wash_s} s.</b> Discard the flow-through.`,

          `Add <b>${d.pe_uL} µL PE</b>. <b>Spin ${d.wash_s} s.</b> Discard the flow-through.`,

          `<b>Spin ${d.dry_s} s</b> to dry the column. PE is 70% ethanol and carryover inhibits downstream enzymes.`,

          "<b>While the drying spin runs, clean up.</b> Check the bench for drips of salt or ADB. Use <b>70% ethanol</b> if you suspect any.",

          "<b>Top- and side-label new 1.5 mL Eppendorf tubes</b>, one per column, as indicated on your labsheet.",

          "Insert the <b>dry column</b> into its elution tube.",

          `Add <b>${d.elution_uL} µL EB</b> slowly to the <b>centre of the membrane</b>. Do not let it run down the walls.`,

          `<b>Spin ${d.elute_s} s</b> to elute.`,

          "<b>Discard the column.</b> The DNA is in the tube."
        ])
      )
    ];
  }
};
