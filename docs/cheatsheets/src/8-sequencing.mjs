import { blk, p, steps, bullets, flag, num } from "../lib.mjs";

export default {
  slug: "sequencing",
  title: "Cycle Sequencing",
  module: "cycle_sequencing",
  values: {},

  build(d) {
    return [
      blk(
        "What you get",
        p(
          "One primer, so extension is <b>linear</b>, not exponential. The read starts " +
            "<b>20–50 bp downstream</b> of the primer and gives <b>400–1000 bp</b> of usable " +
            "sequence. Pick a primer <b>upstream</b> of what you want to see."
        ),
        p(`For pP6 that is <b>${d.primer}</b>.`)
      ),

      blk(
        `Use the ${d.chemistry} protocol`,
        p(
          `Not the standard chemistry. Standard chemistry <b>dies inside a hairpin</b> — a ` +
            `terminator, or any strong secondary structure, stops the read dead. This cost ` +
            `Tlib2 an entire sequencing run.`
        ),
        p(`Say <b>${d.chemistry}</b> on the submission form.`)
      ),

      blk(
        "Submit",
        steps([
          `Combine ${num(d.dna_uL, "µL")} miniprep DNA and ${num(d.primer_uL, "µL")} ${d.primer}, to ${num(d.total_uL, "µL")} total.`,
          "Label each tube with its clone ID.",
          `Specify the ${d.chemistry} protocol.`,
          "Submit. Results come back in <b>1–2 days</b>."
        ]),
        !d.submission_complete
          ? flag(
              "These volumes are not written down anywhere.",
              "Get them from your supervisor before you set the reactions up — then write " +
                "them on this card, so the next person does not have to ask."
            )
          : null
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
        p("You get a <code>.txt</code> of base calls (the <i>read</i>) and an <code>.ab1</code> trace. Open both in <b>ApE</b>; <code>ctrl-K</code> annotates features."),
        steps([
          "Is it <b>clean</b>? Length with no Ns: 100 bp poor, 800 good, 1000 great.",
          "Architecture <b>BseRI → promoter → BseRI</b>. Exactly <b>two</b> BseRI sites.",
          "<b>T4 terminator</b> present; promoter not duplicated, reversed or truncated.",
          "Align to <code>pP6.seq</code> — <b>Tools → Align with another sequence…</b> Look for 100% identity around the promoter.",
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
          "<b>canonical</b> = matches <code>pP6.seq</code> across the good-quality region. <b>usable</b> = contains the motif. Different questions; a clone can be one and not the other.",
          "Expect artifacts — the N-rich region throws up duplications, deletions and recombinations, and some reads come back as plain parent plasmid. Record them as artifacts and exclude them rather than forcing them in."
        ])
      )
    ];
  }
};
