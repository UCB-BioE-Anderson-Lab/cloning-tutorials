import { blk, p, steps, bullets, rx, flag } from "../lib.mjs";

export default {
  slug: "gel",
  title: "Analytical Gel",
  module: "analytical_gel",
  values: { samples: 1 },

  build(d) {
    return [
      blk(
        "What this is for",
        p(
          `Checking that a PCR produced a product and that it is the right size. ` +
            `You are <b>not purifying</b> — nothing is recovered from this gel.`
        ),
        p(`Slabs are <b>${d.agarose_pct}% agarose in 1× TAE</b>, cut from the pre-made gels in the fridge.`)
      ),

      blk(
        "Prepare each sample",
        rx([
          [d.dye_uL, "loading dye (tube marked <i>load</i>)"],
          [d.sample_uL, "PCR product"]
        ]),
        p("Mix, quick spin."),
        p(
          `<b>Marker, one per section:</b> ${d.dye_uL} µL loading dye into a tube of ` +
            `marker (yellow), mix, spin.`
        )
      ),

      blk(
        "Set up and load",
        steps([
          "Cut a slab with enough wells for every sample, the marker, and a few spare.",
          "Put it in the rig. Fill with <b>1× TAE</b> until it is just covered.",
          "Brace the gel with the plastic wedge so it cannot float.",
          "Write the sample order on a paper strip; line the tubes up to match.",
          `Load <b>${d.load_uL} µL</b> per well with a P20.`
        ])
      ),

      blk(
        "Run",
        p("<b>Run to red.</b> DNA is negative and moves to the red electrode, so load at the black end."),
        p(`Run at <b>${d.voltage_V} V</b>. It takes about <b>${d.run_min} min</b>.`),
        flag(
          "Do not set a timer and walk away.",
          "Check the gel <b>every minute or so</b> and watch how the blue band is progressing. " +
            "Stop it when the front is <b>2/3–3/4 down the gel</b> — that is the endpoint, not the clock."
        )
      ),

      blk(
        "Image",
        steps([
          "Move the gel to the imager and lay the label strip above it.",
          "Photograph it <b>with your phone through the orange filter</b>.",
          "Name the file by date and time, then upload it."
        ])
      ),

      blk(
        "Reading it",
        bullets([
          "Smaller fragments move faster.",
          "A <b>library</b> gives a smear, not a sharp band — its members differ in length.",
          "Loading dye does two jobs: glycerol sinks the sample into the well, and the colour tracks the run. It does not bind DNA.",
          `Load below the full volume on purpose — ${d.load_uL} µL of ${d.dye_uL + d.sample_uL} µL — so you do not draw an air gap.`,
          "Do not puncture a well. The sample runs out the bottom; use another lane."
        ])
      )
    ];
  }
};
