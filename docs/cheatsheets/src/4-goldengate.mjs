import { blk, p, steps, bullets, rx, prog, flag } from "../lib.mjs";

export default {
  slug: "goldengate",
  title: "Golden Gate Assembly",
  module: "golden_gate_assembly",
  values: { reactions: 1, fragments: 2 },

  build(d) {
    const each = d.dna_per_fragment_uL;

    return [
      blk(
        `Reaction — <span class="u">${d.total_uL} µL</span>`,
        p("Pipette top to bottom. <b>Enzymes last.</b>"),
        rx(
          [
            [d.water_uL, "ddH₂O (white rack)"],
            [d.buffer_uL, "10× T4 DNA ligase buffer (red)"],
            [each, `each DNA fragment (${d.fragments} of them, ${d.dna_total_uL} µL total)`],
            [d.ligase_uL, "T4 DNA ligase"],
            [d.enzyme_uL, d.enzyme]
          ],
          { total: d.total_uL, totalLabel: "µL total" }
        ),
        p(
          `<b>${d.total_uL} µL is deliberate</b> — it is exactly what the transformation takes. ` +
            `Carry the whole reaction forward; do not split it.`
        )
      ),

      blk(
        "Then",
        steps([
          "Mix well and quick spin.",
          "Label the tube with your assigned code.",
          "Put every reaction from your section in <b>one thermocycler block</b>.",
          `Run <b>${d.program}</b>.`
        ])
      ),

      blk(
        `Program ${d.program}`,
        prog([
          { rep: `repeat ${d.cycles}×:` },
          "&nbsp;&nbsp;37 °C — 2 min",
          "&nbsp;&nbsp;16 °C — 5 min",
          "45 °C — 10 min",
          "80 °C — 10 min",
          "16 °C — hold"
        ]),
        p(
          `37 °C is ${d.enzyme} cutting, 16 °C is T4 ligase sealing. Cycling drives the mixture ` +
            `toward the assembled product, which no longer has a ${d.enzyme} site to cut.`
        )
      ),

      blk(
        "Notes",
        bullets([
          "<b>The ligase buffer supplies the ATP.</b> It is the component most often forgotten, and without it nothing ligates.",
          `${d.cycles} cycles is the default. Fewer (we often use 15) is faster but less efficient.`,
          "Mix the DNAs equimolar if you can. If your preps are consistent, do not bother normalising.",
          "Miniprepped, gel-purified and Zymo-cleaned DNA all work.",
          "Scaling up or down is fine as long as the buffer ends at <b>1×</b> and the DNA is not so concentrated that it inhibits the ligase."
        ]),
        flag("Alternative.", "A straight 2 h incubation at 37 °C also works, and is popular.")
      )
    ];
  }
};
