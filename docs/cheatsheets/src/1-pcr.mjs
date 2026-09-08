import { blk, p, steps, bullets, rx, prog, flag } from "../lib.mjs";

export default {
  slug: "pcr",
  title: "PrimeSTAR PCR",
  module: "primestar_pcr",
  values: { reactions: 1, use_mastermix: false },

  build(d) {
    const r = d.per_reaction_uL;
    const total = r.water + r.buffer5x + r.dNTP + r.primer1 + r.primer2 + r.template + r.enzyme;

    return [
      blk(
        `Reaction — <span class="u">${total} µL</span>`,
        p("Pipette top to bottom. <b>Polymerase last</b> — it denatures in water or an incomplete mix."),
        rx(
          [
            [r.water, "ddH₂O"],
            [r.buffer5x, "5× PrimeSTAR GXL Buffer"],
            [r.dNTP, "dNTP mix (2.5 mM each)"],
            [r.primer1, "primer 1 (10 µM)"],
            [r.primer2, "primer 2 (10 µM)"],
            [r.template, "template"],
            [r.enzyme, "PrimeSTAR GXL polymerase"]
          ],
          { total, totalLabel: "µL total" }
        )
      ),

      blk(
        "Then",
        steps([
          "Cap the tube.",
          "<b>Slam it on the bench</b> to mix.",
          "Quick spin in the PCR mini-centrifuge to knock the liquid down.",
          "Run the program from your labsheet — it depends on insert length and annealing temperature."
        ])
      ),

      blk(
        "Good for",
        bullets([
          "Products <b>2–40 kb</b>. PrimeSTAR GXL is a high-fidelity long-range polymerase.",
          "Template at miniprep concentration, usually diluted 20×."
        ])
      ),

      blk(
        "If it fails",
        bullets([
          "<b>A faint band is not a failure</b>, especially amplifying from a pool.",
          "No product: check the template dilution first. Too much template inhibits.",
          "Smear or extra bands: raise the annealing temperature.",
          "Set up on ice and keep the polymerase in the cold block until the moment you add it."
        ]),
        flag(
          "Master mix.",
          `Above about 4 reactions, make one mix of everything except template — ` +
            `${total - r.template} µL per tube — and add template to each tube separately. ` +
            `Include ~10% overage; the protocol builder will do the arithmetic.`
        )
      )
    ];
  }
};
