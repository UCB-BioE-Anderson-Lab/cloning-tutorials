import { blk, p, steps, bullets, rx, flag } from "../lib.mjs";

export default {
  slug: "sequencing",
  title: "Cycle Sequencing",
  module: "cycle_sequencing",
  values: { copy_number: "medium" },

  build(d) {
    return [
      blk(
        `Submission — <span class="u">${d.total_uL} µL</span> in a 1.5 mL tube`,
        rx(
          [
            [d.primer_uL, `${d.primer} sequencing oligo (${d.primer_uM} µM)`],
            [d.dna_uL, "miniprep DNA"],
            d.water_uL > 0 ? [d.water_uL, "water"] : null
          ],
          { total: d.total_uL, totalLabel: "µL total" }
        ),
        p(
          `Our sequencing oligos are standardised to <b>${d.primer_uM} µM</b>, so ` +
            `<b>${d.primer_uL} µL is exactly one reaction's worth</b>. The other ` +
            `${d.total_uL - d.primer_uL} µL is DNA and water.`
        )
      ),

      blk(
        "Tubes and labels",
        bullets([
          "<b>1.5 mL tubes. Not PCR tubes.</b>",
          "Label the <b>top</b> of the tube.",
          "The label is <b>the exact name you put on the submission form</b> — not an abbreviation, not a name that only makes sense to you. The facility matches tube to form by that string."
        ])
      ),

      blk(
        "How much DNA — by copy number",
        bullets([
          "<b>Medium copy</b> — pBR322, pAC, and <b>pP6</b>: <b>10 µL</b> miniprep.",
          "<b>High copy</b> — pUC plasmids: about <b>4 µL</b> miniprep, made up to 10 µL with water.",
          "<b>Low copy</b> — pSC101, BACs: <b>PCR the region first</b> and sequence the PCR product."
        ])
      ),

      blk(
        `Use the ${d.chemistry} protocol`,
        p(
          `Not the standard chemistry. Standard chemistry <b>dies inside a hairpin</b> — a ` +
            `terminator, or any strong secondary structure, stops the read dead. This cost ` +
            `Tlib2 an entire sequencing run.`
        ),
        p(`Say <b>${d.chemistry}</b> on the submission form. Results come back in <b>1–2 days</b>.`)
      ),

      blk(
        "What you get",
        p(
          "One primer, so extension is <b>linear</b>, not exponential. The read starts " +
            "<b>20–50 bp downstream</b> of the primer and gives <b>400–1000 bp</b> of usable " +
            `sequence. Pick a primer <b>upstream</b> of what you want to see — for pP6, <b>${d.primer}</b>.`
        )
      ),

      blk(
        "Sequence everything you picked",
        p(
          "Including the boring-looking ones. The clones in the <b>middle of the range</b> " +
            "are the informative ones. Tlib2 sequenced only its brightest and left its main " +
            "question unanswered for three years."
        )
      ),

      blk(
        "Check the read",
        p(
          "A <code>.txt</code> of base calls (the <i>read</i>) and an <code>.ab1</code> trace. " +
            "Open both in <b>ApE</b>; <code>ctrl-K</code> annotates features."
        ),
        steps([
          "Is it <b>clean</b>? Length with no Ns: 100 bp poor, 800 good, 1000 great.",
          "Architecture <b>BseRI → promoter → BseRI</b>. Exactly <b>two</b> BseRI sites.",
          "<b>T4 terminator</b> present; promoter not duplicated, reversed or truncated.",
          "Align to <code>pP6.seq</code> — <b>Tools → Align with another sequence…</b>",
          "Search for the motif below. Clean read + motif present = <b>usable</b>."
        ]),
        p(
          '<code class="seq">GAGGAGTCCTGGGTTCNNNNTTGACANNNNNNNNNNNNNNNNNTATAATNNNNNNANNNNGTTAGTATTTCTCCTC</code>'
        )
      ),

      blk(
        "Record",
        p(
          "<b>exp</b> · <b>clone_id</b> · <b>student_name</b> · <b>read_name</b> · " +
            "<b>date_sequenced</b> · <b>canonical</b> · <b>usable</b> · <b>cassette</b> · <b>notes</b>"
        ),
        bullets([
          "<b>canonical</b> = matches <code>pP6.seq</code> across the good-quality region. <b>usable</b> = contains the motif. Different questions.",
          "Expect artifacts — duplications, deletions, recombinations, and some plain parent plasmid. Record them as artifacts and exclude them."
        ])
      )
    ];
  }
};
