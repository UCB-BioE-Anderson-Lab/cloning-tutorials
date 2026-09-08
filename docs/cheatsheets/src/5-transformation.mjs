import { blk, steps, bullets } from "../lib.mjs";

export default {
  slug: "transformation",
  title: "KCM Heat-Shock Transformation",
  module: "heat_shock_transformation",
  layout: "single",
  // Rescue is left as a conditional on the sheet rather than resolved for one antibiotic,
  // so the values here only supply the numbers.
  values: {},

  build(d) {
    return [
      blk(
        "Protocol",
        steps([
          "<b>Get your plates warming first — it is slow.</b> Check they carry the antibiotic(s) on " +
            "your labsheet, then put them in the <b>incubator</b>. Cold plates carry condensation and " +
            "<b>you cannot write on a wet plate</b>.",

          `Turn on the <b>EchoTherm</b>: <b>block A ${d.cold_C} °C</b>, <b>block B ${d.hot_C} °C</b>. Wait until both are at temperature and leave them there.`,

          "Once warm and dry, <b>label the bottom</b> of each plate: date, initials, strain, plasmid, selection.",

          `Put a <b>${d.aliquot_uL} µL</b> cell aliquot on block A, thaw ~${d.cool_s} s, add <b>${d.kcm_uL} µL KCM</b>, pipette gently. One aliquot does <b>${d.reactions_per_tube} reactions</b>.`,

          `Put the DNA tube on block A and let it cool <b>${d.cool_s} s</b>.`,

          `Add <b>${d.cells_uL} µL</b> of the cell/KCM mix to the DNA. Mix gently.` +
            bullets([
              `<b>${d.cells_uL} µL to ${d.dna_uL} µL DNA</b> assumes DNA is ~20% of the total. Too much DNA dilutes the salts and <b>drops the efficiency</b>.`,
              "Large reaction (~20 µL): the whole tube of cells. Retransforming a miniprep: <b>0.5 µL</b> plasmid into 10 µL cells."
            ]),

          `Hold on block A: <b>${d.cold_C} °C for ${d.cold_min} min</b>.`,

          `Move to block B: <b>${d.hot_C} °C for ${d.heat_s} s</b>.`,

          `Back to block A: <b>${d.cold_C} °C for ${d.recover_min} min</b>.`,

          `<b>If your selection is anything other than Amp/Carb, rescue first:</b> add <b>${d.rescue_uL} µL 2YT</b>, move to a 1.5 mL tube, and shake at ${d.incubation_temperature_C} °C for <b>${d.rescue_h} h</b>. Amp/Carb plates directly.`,

          `Plate everything. Incubate <b>inverted</b> at ${d.incubation_temperature_C} °C overnight, and <b>cancel the temperature programs</b>.`
        ])
      )
    ];
  }
};
