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
          // Minutes from switching the EchoTherm on. Durations from JCA, 2026-09-07.
          const COOL = 2; // EchoTherm to 4 °C — fast
          const WARM = 10; // plates warm and dry enough to write on
          const SETUP = 10; // hands-on: thaw, KCM, distribute cells to DNA. Varies with
          // sample count and experience; the most variable thing here.
          const t0 = COOL; // cells cannot go down until the cold block is cold
          const mix = t0 + SETUP;
          const cold = mix + d.cold_min;
          const hot = cold + d.heat_s / 60;
          const back = hot + d.recover_min;

          return scaleTimeline({
            // The axis ends at the cold block. What happens next is a fork, not a
            // continuation — most runs plate straight away.
            total: back + 0.6,
            alt:
              `Timeline, about ${Math.round(back)} minutes end to end. The EchoTherm goes on ` +
              `first and reaches ${d.cold_C} °C in about ${COOL} minutes; cells cannot go down ` +
              `until it does. Plates warm in the incubator for about ${WARM} minutes in ` +
              `parallel. Then roughly ${SETUP} minutes of hands-on setup, followed by the block ` +
              `sequence expanded below: ${d.cold_min} min at ${d.cold_C} °C, ${d.heat_s} s at ` +
              `${d.hot_C} °C, ${d.recover_min} min back at ${d.cold_C} °C. Amp or Carb plates ` +
              `straight away; any other selection needs a ${d.rescue_min_min} minute to ` +
              `${d.rescue_max_min / 60} hour rescue first.`,
            prep: [
              {
                label: `EchoTherm → cold ${d.cold_C} °C / warm ${d.hot_C} °C`,
                from: 0,
                to: COOL,
                gate: COOL
              },
              { label: "plates: warm, dry, label", from: 0.5, to: WARM, gate: back }
            ],
            waits: [
              { from: t0, to: mix, label: `~${SETUP} min`, sub: "set up — hands on", work: true },
              {
                from: mix,
                to: back,
                label: `${Math.round(back - mix)} min`,
                sub: "on the blocks — below"
              }
            ],
            events: [{ at: t0, label: "cells", anchor: "start" }],
            fork: {
              usual: { label: "plate → incubator", note: "Amp / Carb — usual" },
              other: {
                note: "any other selection",
                label: `+ ${d.rescue_min_min} min – ${d.rescue_max_min / 60} h rescue, then plate`
              }
            },
            blowout: {
              from: mix - 0.25,
              to: back + 0.25,
              waits: [
                { from: mix, to: cold, label: `${d.cold_min} min`, sub: `${d.cold_C} °C` },
                { from: cold, to: hot, label: `${d.heat_s} s`, sub: "heat shock" },
                { from: hot, to: back, label: `${d.recover_min} min`, sub: `${d.cold_C} °C` }
              ],
              events: [
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
          "<b>Plates in the incubator first</b> — they are the slow thing. Check they carry the " +
            "antibiotic(s) on your labsheet. Cold plates carry condensation and " +
            "<b>you cannot write on a wet plate</b>.",

          `Turn on the <b>EchoTherm</b>: <b>cold block ${d.cold_C} °C</b>, <b>warm block ${d.hot_C} °C</b>. Leave both there throughout.`,

          "Once warm and dry, <b>label plate bottoms</b>: date, initials, strain, plasmid, selection.",

          `Put a <b>${d.aliquot_uL} µL</b> cell aliquot and the DNA tube on the <b>cold block</b>. Thaw ~${d.cool_s} s, add <b>${d.kcm_uL} µL KCM</b> to the cells, pipette gently. One aliquot does <b>${d.reactions_per_tube} reactions</b>.`,

          `Add <b>${d.cells_uL} µL</b> of the cell/KCM mix to the DNA. Mix gently.` +
            bullets([
              `Assumes DNA is ~20% of the total; <b>too much dilutes the salts</b>. Retransforming a miniprep: <b>0.5 µL</b> into 10 µL cells.`
            ]),

          // The block holds are not repeated here — the timeline above states them exactly,
          // and that is the point of having it.
          "<b>Run the block sequence on the timeline above.</b>",

          `<b>Rescue only if not Amp/Carb:</b> ${d.rescue_uL} µL 2YT, 1.5 mL tube, shake ${d.incubation_temperature_C} °C <b>${d.rescue_min_min} min – ${d.rescue_max_min / 60} h</b>. <b>Not less, not more.</b>`,

          `Plate everything, spreading with <b>beads</b>. Incubate <b>inverted</b> at ${d.incubation_temperature_C} °C overnight, and <b>cancel the temperature programs</b>.`
        ])
      )
    ];
  }
};
