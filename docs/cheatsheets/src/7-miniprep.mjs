import { blk, p, steps, bullets } from "../lib.mjs";

export default {
  slug: "miniprep",
  title: "Qiagen Miniprep",
  module: "qiagen_miniprep",
  values: {},

  build(d) {
    return [
      blk(
        "Buffers",
        bullets([
          "<b>P1</b> — Tris/EDTA, with RNase A already added",
          "<b>P2</b> — NaOH/SDS, the lysis buffer",
          "<b>N3</b> — acidic guanidinium, neutralises and precipitates",
          "<b>PB</b> — removes protein and endotoxin",
          "<b>PE</b> — 70% ethanol, removes salt",
          "<b>EB</b> — elution"
        ])
      ),

      blk(
        "Alkaline lysis",
        steps([
          `<b>Pellet</b> ${d.culture_mL} mL of saturated culture. Spin 1 min, pour off the supernatant.`,
          `<b>Resuspend</b> in <b>${d.p1_uL} µL P1</b>. No clumps.`,
          `<b>Lyse</b> with <b>${d.p2_uL} µL P2</b>. Mix gently — <b>do not vortex</b>. It goes clear and viscous.`,
          `<b>Neutralise</b> with <b>${d.n3_uL} µL N3</b>. Invert thoroughly. A white precipitate forms.`,
          "<b>Spin 5 min</b> at max speed to pellet the debris."
        ])
      ),

      blk(
        "Bind and wash",
        steps([
          "Transfer the <b>supernatant</b> to a blue QIAprep column. Spin <b>15 s</b>.",
          `Add <b>${d.pb_uL} µL PB</b>. Spin. <i>Protein gone.</i>`,
          `Add <b>${d.pe_uL} µL PE</b>. Spin. <i>Salt gone.</i>`,
          "Discard the flow-through and <b>spin 90 s to dry</b>."
        ]),
        p("<b>The dry spin matters.</b> PE is 70% ethanol and carryover ruins everything downstream.")
      ),

      blk(
        "Elute",
        steps([
          "Move the column to a fresh 1.5 mL tube.",
          `Add <b>${d.elution_uL} µL EB</b> (or pH 7–8.5 water) to the <b>centre of the membrane</b>.`,
          "Spin <b>45 s</b>."
        ])
      ),

      blk(
        "Labelling",
        p("Label <b>the top and the side</b> of every tube with the clone ID."),
        p(
          "A tube marked only on the lid becomes anonymous the moment someone opens a box " +
            "and puts the lids down."
        )
      ),

      blk(
        "Notes",
        bullets([
          "Bleach the discarded culture supernatant before it goes down the drain.",
          "<b>A clone that yields no DNA was probably a satellite colony</b> with no plasmid. Note it and exclude it rather than forcing it into the analysis.",
          "Know which half you are keeping before every spin."
        ])
      )
    ];
  }
};
