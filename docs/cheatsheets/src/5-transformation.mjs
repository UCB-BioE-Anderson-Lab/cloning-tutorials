import { blk, p, steps, bullets, prog, flag } from "../lib.mjs";

export default {
  slug: "transformation",
  title: "KCM Heat-Shock Transformation",
  module: "heat_shock_transformation",
  values: { antibiotics: "Carb" },

  build(d) {
    return [
      blk(
        "Blocks",
        prog([`block A — ${d.cold_C} °C`, `block B — ${d.hot_C} °C`]),
        p(
          `Turn on the <b>EchoTherm</b> and wait until both blocks are at temperature. ` +
            `Keep them there throughout.`
        ),
        p(
          "<i>Alternatives:</i> a thermocycler with two blocks, or a 42 °C heating block " +
            "and an ice bath."
        )
      ),

      blk(
        "Cells",
        steps([
          `Put a <b>${d.aliquot_uL} µL</b> competent cell aliquot on block A and thaw (~${d.cool_s} s).`,
          `Add <b>${d.kcm_uL} µL KCM</b> and pipette gently to mix. Keep it on block A.`
        ]),
        p(
          `${d.kcm_uL} µL into a ${d.aliquot_uL} µL aliquot is <b>1× KCM</b> from the 5× stock. ` +
            `One aliquot does about <b>${d.reactions_per_tube} reactions</b>.`
        )
      ),

      blk(
        "Transform",
        steps([
          "Put the DNA tube on block A and let it cool for 30 s.",
          `Add <b>${d.cells_uL} µL</b> of the cell/KCM mix to the DNA. Mix gently.`,
          `Hold at <b>${d.cold_C} °C for ${d.cold_min} min</b>.`,
          `Move to block B — <b>${d.hot_C} °C for ${d.heat_s} s</b>.`,
          `Back to block A — <b>${d.cold_C} °C for ${d.recover_min} min</b>.`
        ])
      ),

      blk(
        "How much DNA",
        bullets([
          `<b>${d.cells_uL} µL cells to ${d.dna_uL} µL DNA</b> is the standard. It assumes the DNA is about 20% of the total.`,
          "A large reaction (~20 µL): use 100 µL, or the whole tube of cells.",
          "Retransforming a miniprep: <b>0.5 µL</b> plasmid into 10 µL cells is plenty.",
          "Pure plasmid: dilute 10–20× in water first and use 1 µL of that.",
          "Less DNA is fine. Too much dilutes the salts and <b>drops the efficiency</b>."
        ])
      ),

      blk(
        "Plate",
        steps([
          `Plate everything on <b>${d.antibiotics.join(", ")}</b>. Incubate <b>inverted</b>, ${d.incubation_temperature_C} °C, overnight.`,
          "Cancel the temperature programs when you are done."
        ]),
        d.needs_rescue
          ? flag(
              "Rescue first.",
              `This selection is not Amp/Carb, so the resistance gene needs time to express. ` +
                `Add <b>${d.rescue_uL} µL 2YT</b>, move to a 1.5 mL tube, and shake at ` +
                `${d.incubation_temperature_C} °C for <b>${d.rescue_h} h</b> before plating.`
            )
          : flag(
              "No rescue needed.",
              "Amp/Bla selection uses the carbenicillin plates in the fridge, and plates directly."
            )
      ),

      blk(
        "Labelling",
        p("Warm plates to room temperature first — cold plates are hard to write on."),
        p(
          `On the <b>bottom</b>: date, your initials, strain <b>${d.host}</b>, ` +
            `plasmid <b>${d.plasmid}</b>, selection <b>${d.antibiotics.join(", ")}</b>.`
        ),
        p(
          "<i>Plating more than 100 µL:</i> leave the plate uncovered at the sterile bench " +
            "until the surface is no longer glossy, or the colonies bleed."
        )
      )
    ];
  }
};
