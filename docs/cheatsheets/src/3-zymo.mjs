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
          "For each cleanup, <b>top-label a 1.5 mL tube</b> with the name indicated on the labsheet. This is the tube you will elute into.",

          `Add <b>${d.adb_uL} µL ADB</b> (brown bottle) to the reaction and mix.` +
            bullets([
              "Fragments under <b>250 bp</b>: use <b>1 part ADB + 3 parts isopropanol</b> instead of ADB alone, or the fragment washes straight through."
            ]),

          "Transfer to a <b>Zymo column</b> in a collection tube. Spin <b>15 s</b> at full speed, discard the flow-through.",

          `Add <b>${d.pe_uL} µL PE</b>. Spin <b>15 s</b>, discard the flow-through.`,

          `Add <b>${d.pe_uL} µL PE</b> again. Spin <b>15 s</b>, discard the flow-through.`,

          "Spin <b>90 s</b> at full speed to <b>dry the column</b>. PE is 70% ethanol and any carryover inhibits the ligase.",

          `Move the column to your labelled tube. Add <b>${d.elution_uL} µL EB</b> slowly to the <b>centre of the membrane</b> — do not let it run down the walls.`,

          "Spin <b>45 s</b> to elute. Discard the column."
        ]),
        bullets([
          "<b>Know where your DNA is at every step.</b> Before each spin, say which half you are keeping."
        ])
      )
    ];
  }
};
