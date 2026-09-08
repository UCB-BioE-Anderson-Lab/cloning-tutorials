import { blk, steps, bullets, rx } from "../lib.mjs";

export default {
  slug: "sequencing",
  title: "Cycle Sequencing",
  module: "cycle_sequencing",
  layout: "single",
  values: { copy_number: "medium" },

  build(d) {
    return [
      blk(
        "Protocol",
        steps([
          "For each read, <b>top-label a 1.5 mL tube</b> with <b>the exact name you put on the submission form</b>. " +
            "<b>Not PCR tubes.</b> Not an abbreviation, and not a name that only makes sense to you — the facility matches tube to form by that string.",

          "Set up each reaction:" +
            rx(
              [
                [d.primer_uL, `${d.primer} sequencing oligo (${d.primer_uM} µM)`],
                [d.dna_uL, "miniprep DNA"],
                d.water_uL > 0 ? [d.water_uL, "water"] : null
              ],
              { total: d.total_uL, totalLabel: "µL total" }
            ) +
            bullets([
              `Our sequencing oligos are standardised to <b>${d.primer_uM} µM</b>, so <b>${d.primer_uL} µL is exactly one reaction's worth</b>.`,
              "<b>Medium copy</b> — pBR322, pAC, and <b>pP6</b>: <b>10 µL</b> miniprep.",
              "<b>High copy</b> — pUC: <b>4 µL</b> miniprep + 6 µL water.",
              "<b>Low copy</b> — pSC101, BACs: <b>PCR the region first</b> and sequence the product."
            ]),

          `Specify the <b>${d.chemistry} protocol</b> on the submission form. Standard chemistry <b>dies inside a hairpin</b> and will lose the read.`,

          "Submit. Results come back in <b>1–2 days</b>."
        ])
      ),

      blk(
        "Notes",
        bullets([
          "Pick a primer <b>upstream</b> of what you want to see — the read starts <b>20–50 bp downstream</b> and gives <b>400–1000 bp</b>.",
          "<b>Sequence everything you picked</b>, including the boring ones. The middle of the range is the informative part."
        ])
      )
    ];
  }
};
