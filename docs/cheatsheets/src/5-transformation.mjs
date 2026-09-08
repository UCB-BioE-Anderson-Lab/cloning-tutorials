import { blk, steps, bullets, timeline } from "../lib.mjs";

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
        "Timing",
        timeline(
          [
            { do: "cells" },
            { wait: "thaw", t: `${d.cool_s} s`, min: d.cool_s / 60 },
            { do: "+KCM<br>+DNA" },
            { wait: true, t: `${d.cold_min} min`, min: d.cold_min },
            { do: "→ B" },
            { wait: "heat shock", t: `${d.heat_s} s`, min: d.heat_s / 60 },
            { do: "→ A" },
            { wait: true, t: `${d.recover_min} min`, min: d.recover_min },
            { do: "plate" },
            { wait: "37 °C", t: "overnight", min: 16 * 60, variable: true }
          ],
          {
            background:
              "plates warming in the incubator · EchoTherm equilibrating — <b>start both first</b>"
          }
        )
      ),

      blk(
        "Protocol",
        steps([
          "<b>Start the slow things first.</b> Get your plates — check the antibiotic(s) on your " +
            "labsheet — and warm them in the <b>incubator</b>. Cold plates carry condensation and " +
            "<b>you cannot write on them</b>.",

          `Turn on the <b>EchoTherm</b>: <b>block A ${d.cold_C} °C</b>, <b>block B ${d.hot_C} °C</b>. Leave both at temperature throughout.`,

          "Once warm and dry, <b>label the bottom</b> of each plate: date, initials, strain, plasmid, selection.",

          `Put a <b>${d.aliquot_uL} µL</b> cell aliquot and the DNA tube on block A. Thaw ~${d.cool_s} s, add <b>${d.kcm_uL} µL KCM</b> to the cells, pipette gently. One aliquot does <b>${d.reactions_per_tube} reactions</b>.`,

          `Add <b>${d.cells_uL} µL</b> of the cell/KCM mix to the DNA. Mix gently.` +
            bullets([
              `Assumes DNA is ~20% of the total; <b>too much dilutes the salts</b>. Large reaction: the whole tube of cells. Retransforming a miniprep: <b>0.5 µL</b> into 10 µL cells.`
            ]),

          // The three block holds are not repeated here — the timeline above states them
          // exactly, and that is the point of having it.
          `Run the block sequence on the timeline above: <b>A ${d.cold_C} °C</b> → <b>B ${d.hot_C} °C</b> → <b>A ${d.cold_C} °C</b>.`,

          `<b>If your selection is anything other than Amp/Carb, rescue first:</b> add <b>${d.rescue_uL} µL 2YT</b>, move to a 1.5 mL tube, and shake at ${d.incubation_temperature_C} °C for <b>${d.rescue_h} h</b>.`,

          `Plate everything. Incubate <b>inverted</b> at ${d.incubation_temperature_C} °C overnight, and <b>cancel the temperature programs</b>.`
        ])
      )
    ];
  }
};
