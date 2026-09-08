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
          "Run the program below."
        ])
      ),

      blk(
        `Program — ${d.program_label}`,
        prog(
          d.cycles > 0
            ? [
                { rep: `repeat ${d.cycles}×:` },
                `&nbsp;&nbsp;37 °C — ${d.cut_min} min`,
                `&nbsp;&nbsp;16 °C — ${d.lig_min} min`,
                "60 °C — 5 min",
                "4 °C — hold"
              ]
            : [`37 °C — ${d.hold_label}`, "60 °C — 5 min", "4 °C — hold"]
        ),
        p("NEB's recommended protocol for the Golden Gate Assembly Kit (#E1601)."),
        p(
          `37 °C is ${d.enzyme} cutting, 16 °C is T4 ligase sealing. Cycling drives the mixture ` +
            `toward the assembled product, which no longer has a ${d.enzyme} site to cut.`
        )
      ),

      blk(
        "By insert count (NEB)",
        bullets([
          "<b>1 insert</b> — 37 °C 5 min (or 1 h for library prep) → 60 °C 5 min",
          "<b>2–10 inserts</b> — (37 °C 1 min → 16 °C 1 min) × 30 → 60 °C 5 min",
          "<b>11–20+ inserts</b> — (37 °C 5 min → 16 °C 5 min) × 30 → 60 °C 5 min"
        ])
      ),

      blk(
        "Notes",
        bullets([
          "<b>The closing 60 °C is not an inactivation step.</b> It favours cutting <b>without</b> ligation, so destination plasmid that was never cut, or that religated, gets linearised. That is what keeps background colonies down. Do not skip it.",
          "<b>The ligase buffer supplies the ATP.</b> It is the component most often forgotten, and without it nothing ligates.",
          "Mix the DNAs equimolar if you can. If your preps are consistent, do not bother normalising.",
          "Miniprepped, gel-purified and Zymo-cleaned DNA all work.",
          "Scaling up or down is fine as long as the buffer ends at <b>1×</b> and the DNA is not so concentrated that it inhibits the ligase."
        ]),
        flag(
          "<code>GG1</code> is the same idea, different numbers.",
          "25 × (37 °C 2 min → 16 °C 5 min), then 45 °C 10 min and 80 °C 10 min. The cycling " +
            `is fine. The ending differs: <b>80 °C kills ${d.enzyme}</b>, so vector that was ` +
            "never cut or that religated survives to transform. Expect more background."
        )
      )
    ];
  }
};
