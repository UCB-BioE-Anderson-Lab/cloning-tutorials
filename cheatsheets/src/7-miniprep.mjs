import { blk, steps, bullets } from "../lib.mjs";

export default {
  slug: "miniprep",
  title: "Qiagen Miniprep",
  module: "qiagen_miniprep",
  layout: "single",
  values: {},

  build(d) {
    return [
      blk(
        "Protocol",
        steps([
          "For each clone, <b>top-label a 1.5 mL tube</b> with the clone ID from the labsheet. This is the tube you will elute into.",

          `<b>Pellet ${d.culture_mL} mL</b> of saturated culture. Spin ${d.pellet_min} min, pour off the supernatant — <b>bleach it</b> before it goes down the drain.`,

          `<b>Resuspend</b> in <b>${d.p1_uL} µL P1</b>. No clumps. The RNase A must already be in the P1.`,

          `<b>Lyse</b> with <b>${d.p2_uL} µL P2</b>. Mix gently — <b>do not vortex</b>. It goes clear and viscous.`,

          `<b>Neutralise</b> with <b>${d.n3_uL} µL N3</b>. Invert thoroughly. A white precipitate forms.`,

          `<b>Spin ${d.clear_min} min</b> at max speed to pellet the debris.`,

          `Transfer the <b>supernatant</b> to a blue QIAprep column. Spin <b>${d.bind_s} s</b>.`,

          `Add <b>${d.pb_uL} µL PB</b>, spin. Add <b>${d.pe_uL} µL PE</b>, spin.`,

          `Discard the flow-through and <b>spin ${d.dry_s} s to dry</b>. PE is 70% ethanol and carryover ruins everything downstream.`,

          `Move the column to your labelled tube. Add <b>${d.elution_uL} µL EB</b> to the <b>centre of the membrane</b> and spin <b>${d.elute_s} s</b>.`
        ]),
        bullets([
          "Label <b>the top and the side</b> of each tube — a tube marked only on the lid goes anonymous the moment someone puts the lids down.",
          "<b>A clone that yields no DNA was probably a satellite colony.</b> Note it and exclude it."
        ])
      )
    ];
  }
};
