import { blk, p, steps, bullets, flag } from "../lib.mjs";

export default {
  slug: "zymo",
  title: "Zymo Cleanup",
  module: "zymo_cleanup",
  values: { reactions: 1 },

  build(d) {
    return [
      blk(
        "What this removes",
        bullets([
          "Polymerase, dNTPs, salts and most oligos from a PCR.",
          "Buffer and restriction enzymes from a digest.",
          "Left in place, polymerase fills in the sticky ends BsaI just made, and nothing ligates."
        ])
      ),

      blk(
        "Bind",
        steps([
          `Add <b>${d.adb_uL} µL ADB</b> (brown bottle) to the reaction. Mix.`,
          "Transfer to a <b>Zymo column</b> in a collection tube.",
          "Spin <b>15 s</b> at full speed. Discard the flow-through."
        ])
      ),

      blk(
        "Wash",
        steps([
          "Add <b>200 µL PE</b>. Spin <b>15 s</b>. Discard the flow-through.",
          "Add <b>200 µL PE</b> again. Spin <b>15 s</b>. Discard the flow-through.",
          "Spin <b>90 s</b> at full speed to dry the column."
        ]),
        p("<b>The dry spin is not optional.</b> PE is 70% ethanol; carryover inhibits the ligase.")
      ),

      blk(
        "Elute",
        steps([
          "Move the column to a fresh <b>1.5 mL tube</b>.",
          `Add <b>${d.elution_uL} µL EB</b> slowly to the <b>centre of the membrane</b>. Do not let it run down the walls.`,
          "Spin <b>45 s</b>. Discard the column — the DNA is in the tube."
        ])
      ),

      blk(
        "Notes",
        bullets([
          "<b>Know where your DNA is at every step.</b> The commonest failure here is discarding the wrong tube. Before each spin, say out loud which half you are keeping.",
          "EB, not water. Water absorbs CO₂, turns slightly acidic, and lowers recovery.",
          "Elution volume is set by your labsheet. The kit will go down to 6 µL if you need it concentrated."
        ]),
        flag(
          "Fragments under 250 bp.",
          `Bind with <b>1 part ADB + 3 parts isopropanol</b> instead of ADB alone. ` +
            `Without the isopropanol a short fragment washes straight through the column.`
        )
      )
    ];
  }
};
