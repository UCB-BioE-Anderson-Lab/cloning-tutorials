import { blk, p, steps, bullets, rx, prog } from "../lib.mjs";

export default {
  slug: "goldengate",
  title: "Golden Gate Assembly",
  module: "golden_gate_assembly",
  layout: "single",
  // No enzyme name. It is BsaI for pP6 and BsmBI for the Tlib libraries, and a printed
  // sheet that commits to one will have someone pipette the wrong tube.
  values: { reactions: 1, fragments: 2, enzyme: "" },

  build(d) {
    const recipe = rx(
      [
        [d.water_uL, "water"],
        [d.buffer_uL, "10× T4 DNA ligase buffer"],
        [d.dna_total_uL, "DNA"],
        [d.ligase_uL, "T4 DNA ligase"],
        [d.enzyme_uL, "restriction enzyme"]
      ],
      { total: d.total_uL, totalLabel: "µL total" }
    );

    return [
      blk(
        "Protocol",
        steps([
          "For each reaction you set up, <b>top-label a PCR tube</b> with the name(s) indicated on the labsheet.",

          "Retrieve <b>water</b> (white <b>W</b> tubes) and <b>T4 ligase buffer</b> aliquots " +
            "(<b>red</b> tubes) from the <b>enzyme freezer</b> and thaw them at room temperature.",

          "Set up the reaction, in order:" +
            recipe +
            bullets([
              `If you have <b>more than ${d.premix_above} fragments</b> to join, premix <b>equal volumes of each DNA</b> in a tube, then use <b>${d.dna_total_uL} µL of that mix</b> for the reaction.`,
              `Be sure you are using the <b>right one</b> of ${d.enzyme_options.join(", ")}, as indicated in your <b>construction file and labsheets</b>.`
            ]),

          `Retrieve the <b>enzyme cooler</b>, and add <b>${d.ligase_uL} µL each</b> of the ligase and the restriction enzyme to each sample.`,

          "<b>Cap, mix, spin.</b>",

          `Run the <b>${d.program}</b> program on the thermocycler.`
        ])
      )
    ];
  }
};
