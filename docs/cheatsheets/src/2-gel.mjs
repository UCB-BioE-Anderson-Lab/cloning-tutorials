import { blk, steps, bullets, rx } from "../lib.mjs";

export default {
  slug: "gel",
  title: "Analytical Gel",
  module: "analytical_gel",
  layout: "single",
  values: { samples: 1 },

  build(d) {
    return [
      blk(
        "Protocol",
        steps([
          "For each sample, <b>top-label a PCR tube</b> with the name indicated on the labsheet.",

          "Set up each sample, in order:" +
            rx([
              [d.dye_uL, "loading dye (tube marked <i>load</i>)"],
              [d.sample_uL, "PCR product"]
            ]) +
            bullets([
              `<b>Marker, one per section:</b> ${d.dye_uL} µL loading dye into a tube of marker (yellow).`
            ]),

          "<b>Mix, quick spin.</b>",

          `Cut a <b>${d.agarose_pct}% gel slab</b> with enough wells for all samples, the marker, and a few spare.`,

          "Place it in the rig, fill with <b>1× TAE</b> to just cover it, and brace it with the plastic wedge.",

          `Load <b>${d.load_uL} µL</b> per well with a P20, in labsheet order.`,

          "Lid and leads on: <b>run to red</b> — load at the black end.",

          `Run at <b>${d.voltage_V} V</b> for about <b>${d.run_min} min</b>. <b>Do not set a timer and walk away</b> — check every minute or so and stop when the blue front is <b>2/3–3/4 down the gel</b>.`,

          "Image it on the imager <b>through the orange filter</b>, with a label strip above the gel. Name the file by date and time, and upload it."
        ])
      )
    ];
  }
};
