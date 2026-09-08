import { blk, p, rx } from "../lib.mjs";

export default {
  slug: "goldengate",
  title: "Golden Gate Assembly",
  module: "golden_gate_assembly",
  // No enzyme name. It is BsaI for pP6 and BsmBI for the Tlib libraries, and a printed
  // sheet that commits to one will have someone pipette the wrong tube.
  values: { reactions: 1, fragments: 2, enzyme: "" },

  build(d) {
    const each = d.dna_per_fragment_uL;

    return [
      blk(
        `Reaction — <span class="u">${d.total_uL} µL</span>`,
        p(
          "<b>Label the tube first</b>, before any liquid goes in. The <b>top label</b> is the " +
            "number from your labsheet."
        ),
        rx(
          [
            [d.water_uL, "ddH₂O (white rack)"],
            [d.buffer_uL, "10× T4 DNA ligase buffer (red)"],
            [each, `each DNA fragment (${d.fragments} of them, ${d.dna_total_uL} µL total)`],
            [d.ligase_uL, "T4 DNA ligase"],
            [d.enzyme_uL, "<b>Type IIS enzyme — from your labsheet</b>"]
          ],
          { total: d.total_uL, totalLabel: "µL total" }
        ),
        p("Top to bottom. <b>Enzymes last.</b> Mix well, quick spin.")
      ),

      blk(
        "Enzyme",
        p(
          "<b>Not always BsaI.</b> It must match the sites designed into your fragments. " +
            "Take it from your labsheet, not the nearest tube."
        )
      ),

      blk(
        "Run",
        p(`All reactions from your section in <b>one block</b>. Run <b>${d.program}</b>.`),
        p(`Carry the whole ${d.total_uL} µL into the transformation. <b>Do not split it.</b>`)
      )
    ];
  }
};
