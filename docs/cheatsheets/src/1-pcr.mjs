import { blk, p, steps, rx } from "../lib.mjs";

export default {
  slug: "pcr",
  title: "PrimeSTAR PCR",
  module: "primestar_pcr",
  layout: "single",
  values: { reactions: 1, use_mastermix: false },

  build(d) {
    const r = d.per_reaction_uL;
    const total = r.water + r.buffer5x + r.dNTP + r.primer1 + r.primer2 + r.template + r.enzyme;
    const mmPerTube = total - r.template;
    const overagePct = Math.round(d.overage_fraction * 100);

    return [
      blk(
        "Protocol",
        steps([
          "For each reaction you set up, <b>top-label a PCR tube</b> with the name(s) indicated on the labsheet.",

          "Retrieve your <b>oligos</b> (10 µM) and <b>template</b> from the freezer and thaw them at room temperature.",

          "Set up the reaction, in order:" +
            rx(
              [
                [r.water, "ddH₂O"],
                [r.buffer5x, "5× PrimeSTAR GXL buffer"],
                [r.dNTP, "dNTP mix (2.5 mM each)"],
                [r.primer1, "primer 1 (10 µM)"],
                [r.primer2, "primer 2 (10 µM)"],
                [r.template, "template"],
                [r.enzyme, "PrimeSTAR GXL polymerase"]
              ],
              { total, totalLabel: "µL total" }
            ),

          `Retrieve the <b>enzyme cooler</b>, and add <b>${r.enzyme} µL polymerase</b> to each sample, last.`,

          "<b>Cap</b>, <b>slam on the bench</b> to mix, <b>quick spin</b>.",

          "Run the program from your labsheet — it depends on insert length and annealing temperature."
        ])
      ),

      blk(
        `Master mix — ${d.mastermix_from} or more reactions`,
        p(
          `Scale <b>everything except the template</b> by the number of reactions, plus ` +
            `<b>${overagePct}%</b> so you do not run short on the last tube.`
        ),
        p(
          `Each tube is then <b>${mmPerTube} µL master mix + ${r.template} µL template</b>, ` +
            `and the template is the only thing you pipette per-tube.`
        )
      )
    ];
  }
};
