import { blk, steps, bullets, scaleTimeline } from "../lib.mjs";

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
        (() => {
          // Everything is placed at its real time, in minutes from switching the EchoTherm on.
          // COOL and WARM are nominal — see the note under the strip.
          const COOL = 15; // EchoTherm down to 4 °C
          const WARM = 24; // plates warm, dry and labelled
          const t0 = COOL; // cells cannot go down until the blocks are cold
          const thaw = t0 + d.cool_s / 60;
          const mix = thaw + d.cool_s / 60;
          const cold = mix + d.cold_min;
          const hot = cold + d.heat_s / 60;
          const back = hot + d.recover_min;

          const rescueEnd = back + d.rescue_h * 60;

          return scaleTimeline({
            total: rescueEnd + 2,
            alt:
              `Timeline. The EchoTherm goes on first and takes about ${COOL} minutes to reach ` +
              `${d.cold_C} °C; cells cannot be put down until it does. Plates warm, dry and are ` +
              `labelled in parallel, ready before plating. About ${Math.round(back - t0)} minutes ` +
              `of bench work follow, expanded below: thaw ${d.cool_s} s, add KCM and DNA, ` +
              `${d.cold_min} min at ${d.cold_C} °C, ${d.heat_s} s at ${d.hot_C} °C, ` +
              `${d.recover_min} min back at ${d.cold_C} °C. Then a ${d.rescue_h} hour rescue ` +
              `incubation, only if the selection is not Amp or Carb, and finally plating.`,
            prep: [
              {
                label: `EchoTherm → ${d.cold_C} °C / ${d.hot_C} °C`,
                from: 0,
                to: COOL,
                gate: COOL
              },
              { label: "plates: warm, dry, label", from: 0.5, to: WARM, gate: rescueEnd }
            ],
            waits: [
              {
                from: t0,
                to: back,
                label: `${Math.round(back - t0)} min`,
                sub: "bench work — below"
              },
              {
                from: back,
                to: rescueEnd,
                label: `${d.rescue_h} h`,
                sub: "rescue — only if not Amp/Carb",
                variable: true
              }
            ],
            events: [
              { at: t0, label: "cells", anchor: "start" },
              { at: rescueEnd, label: "plate → incubator", anchor: "end" }
            ],
            blowout: {
              from: t0 - 0.3,
              to: back + 0.3,
              waits: [
                { from: t0, to: thaw, label: `${d.cool_s} s`, sub: "thaw" },
                { from: mix, to: cold, label: `${d.cold_min} min`, sub: `${d.cold_C} °C` },
                { from: cold, to: hot, label: `${d.heat_s} s`, sub: "heat shock" },
                { from: hot, to: back, label: `${d.recover_min} min`, sub: `${d.cold_C} °C` }
              ],
              events: [
                { at: mix, label: "+KCM +DNA" },
                { at: cold, label: `→ ${d.hot_C} °C` },
                { at: hot, label: `→ ${d.cold_C} °C`, anchor: "end" }
              ]
            }
          });
        })()
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

          // The block holds are not repeated here — the timeline above states them exactly,
          // and that is the point of having it.
          "<b>Run the block sequence on the timeline above.</b>",

          `<b>If your selection is anything other than Amp/Carb, rescue first:</b> add <b>${d.rescue_uL} µL 2YT</b>, move to a 1.5 mL tube, and shake at ${d.incubation_temperature_C} °C for <b>${d.rescue_h} h</b>.`,

          `Plate everything. Incubate <b>inverted</b> at ${d.incubation_temperature_C} °C overnight, and <b>cancel the temperature programs</b>.`
        ])
      )
    ];
  }
};
