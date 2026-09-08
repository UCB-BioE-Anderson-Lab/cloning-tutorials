import { blk, steps, bullets, prog } from "../lib.mjs";

export default {
  slug: "transformation",
  title: "KCM Heat-Shock Transformation",
  module: "heat_shock_transformation",
  layout: "single",
  values: { antibiotics: "Carb" },

  build(d) {
    const sel = d.antibiotics.join(", ");

    return [
      blk(
        "Protocol",
        steps([
          `Turn on the <b>EchoTherm</b>: <b>block A ${d.cold_C} °C</b>, <b>block B ${d.hot_C} °C</b>. Wait until both are at temperature and leave them there.`,

          `Warm <b>${sel}</b> plates to room temperature and <b>label the bottom</b>: date, your initials, strain, plasmid, selection. Cold plates are hard to write on.`,

          `Put a <b>${d.aliquot_uL} µL</b> competent cell aliquot on block A and thaw (~${d.cool_s} s). Add <b>${d.kcm_uL} µL KCM</b> and pipette gently to mix. One aliquot does about <b>${d.reactions_per_tube} reactions</b>.`,

          `Put the DNA tube on block A and let it cool <b>${d.cool_s} s</b>.`,

          `Add <b>${d.cells_uL} µL</b> of the cell/KCM mix to the DNA. Mix gently.` +
            bullets([
              `${d.cells_uL} µL to <b>${d.dna_uL} µL DNA</b> is the standard — it assumes the DNA is about 20% of the total.`,
              "A large reaction (~20 µL): use 100 µL, or the whole tube of cells.",
              "Retransforming a miniprep: <b>0.5 µL</b> plasmid into 10 µL cells.",
              "Too much DNA dilutes the salts and <b>drops the efficiency</b>."
            ]),

          `Hold on block A: <b>${d.cold_C} °C for ${d.cold_min} min</b>.`,

          `Move to block B: <b>${d.hot_C} °C for ${d.heat_s} s</b>.`,

          `Back to block A: <b>${d.cold_C} °C for ${d.recover_min} min</b>.`,

          d.needs_rescue
            ? `<b>Rescue:</b> add <b>${d.rescue_uL} µL 2YT</b>, move to a 1.5 mL tube, and shake at ${d.incubation_temperature_C} °C for <b>${d.rescue_h} h</b>. Needed for any selection other than Amp/Carb.`
            : `Plate everything on <b>${sel}</b>. Incubate <b>inverted</b> at ${d.incubation_temperature_C} °C overnight. <b>No rescue needed</b> for Amp/Carb.`,

          "Cancel the temperature programs when you are done."
        ])
      )
    ];
  }
};
