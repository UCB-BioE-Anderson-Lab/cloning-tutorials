// cycle_sequencing.js
// Submit a miniprepped plasmid for Sanger (cycle) sequencing and check the read that comes back.
//
// Sources: docs/wetlab/sequencing.md for the analysis, and the Tlib3 labsheets
// (Pimar, experiments/TPcon6/Tlib3/bin/09_write_labsheets.py, 2026-09-02) for the
// primer and the dGTP chemistry.
//
// STILL MISSING — needs JCA. The submission mix itself is recorded nowhere: DNA amount,
// primer volume, total volume, the facility and its tube-labelling convention. Those
// inputs default to blank and render as rules to write on. Fill in the defaults once
// they are confirmed and every sheet picks them up on the next build.

export const inputs = [
  { name: "samples", type: "number", label: "Number of reads", default: 8, step: 1 },
  { name: "primer", type: "text", label: "Sequencing primer", default: "G00101" },
  { name: "chemistry", type: "text", label: "Chemistry", default: "dGTP" },
  { name: "dna_uL", type: "number", label: "DNA per reaction (µL)", default: "" },
  { name: "primer_uL", type: "number", label: "Primer per reaction (µL)", default: "" },
  { name: "total_uL", type: "number", label: "Total volume submitted (µL)", default: "" },
  { name: "facility", type: "text", label: "Sequencing facility", default: "" }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.samples ?? 8));
  const primer = String(values?.primer ?? "G00101");
  const chemistry = String(values?.chemistry ?? "dGTP");
  const dna = blankable(values?.dna_uL);
  const primerVol = blankable(values?.primer_uL);
  const total = blankable(values?.total_uL);
  const facility = String(values?.facility ?? "").trim();

  const complete = dna !== null && primerVol !== null && total !== null;
  const amt = (v) => (v === null ? "____ µL" : `**${v} µL**`);

  return {
    name: "Cycle Sequencing",
    description: `Submit ${n} read${n > 1 ? "s" : ""} with primer ${primer} on ${chemistry} chemistry.`,
    includes: { required: [], optional: [] },
    derived: {
      samples: n,
      primer,
      chemistry,
      dna_uL: dna,
      primer_uL: primerVol,
      total_uL: total,
      facility: facility || null,
      submission_complete: complete
    },
    template: `
**What you get**
One primer, so extension is **linear**, not exponential. The read starts about **20–50 bp
downstream** of the primer and gives **400–1000 bp** of usable sequence. Choose a primer
**upstream** of the region you care about. For pP6 that is **${primer}**.

**Use the ${chemistry} protocol**
Not the standard chemistry. Standard chemistry **dies inside a hairpin** — a terminator or
any strong secondary structure stops the read dead. This cost Tlib2 an entire sequencing run.

**Set up ${n} read${n > 1 ? "s" : ""}**
1. Per reaction, combine ${amt(dna)} miniprepped plasmid and ${amt(primerVol)} ${primer},
   to ${amt(total)} total.
2. Label each tube with its clone ID (\`79A\`, and so on)${facility ? ` in the format ${facility} requires` : ``}.
3. Specify the **${chemistry} protocol** on the submission form.
4. Submit${facility ? ` to **${facility}**` : ``}. Results come back in **1–2 days**.
${!complete ? `
> **The submission recipe is not filled in.** Volumes, DNA concentration and the facility's
> labelling convention are not recorded anywhere in the course materials. Get them from your
> supervisor before setting these up, and write them down so the next person has them.
` : ``}
**Sequence everything you picked**
Include the clones that look boring. The ones in the **middle of the range** are the
informative ones — Tlib2 sequenced only its brightest and left its main question unanswered
for three years.

**Check the read**
You get a \`.txt\` of base calls (the *read*) and an \`.ab1\` chromatogram (the *trace*).
Open both in **ApE** or Benchling; \`ctrl-K\` in ApE annotates known features.

5. Is the read **clean**? How long is the stretch with no Ns — 100 bp is poor,
   800 bp good, 1000 bp great.
6. Look for the architecture **BseRI → variable promoter → BseRI**. Exactly **two** BseRI sites.
7. Check the **T4 terminator** is there, and that the promoter is not duplicated,
   reversed or truncated.
8. Align to \`pP6.seq\` (**Tools → Align with another sequence…**). Look for 100% identity
   around the promoter.
9. Search the read for the target motif. If it is there and the read is clean, the clone
   is **usable**:
   \`\`\`
   GAGGAGTCCTGGGTTCNNNNTTGACANNNNNNNNNNNNNNNNNTATAATNNNNNNANNNNGTTAGTATTTCTCCTC
   \`\`\`
10. Record each clone: **exp**, **clone_id**, **student_name**, **read_name**,
    **date_sequenced**, **canonical**, **usable**, **cassette**, **notes**.

**Notes**
- **canonical** means it matches \`pP6.seq\` across the good-quality region. **usable** means
  it contains the motif above. Different questions — a clone can be one and not the other.
- Expect artifacts. The N-rich promoter region throws up duplications, deletions and
  recombinations, and some reads come back as plain parent plasmid. If a read matches no
  designed member, record it as an artifact and exclude it rather than forcing it in.
`
  };
}

function blankable(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
