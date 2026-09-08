// cycle_sequencing.js
// Submit a miniprepped plasmid for Sanger (cycle) sequencing and check the read that comes back.
//
// Submission is always 13 µL total in a 1.5 mL tube. Our sequencing oligos are standardised
// to 2.66 µM so that 3 µL is one reaction's worth of primer; the other 10 µL is DNA plus
// water, and how much of it is DNA depends on the plasmid's copy number.

export const inputs = [
  { name: "samples", type: "number", label: "Number of reads", default: 8, step: 1 },
  { name: "primer", type: "text", label: "Sequencing primer", default: "G00101" },
  { name: "chemistry", type: "text", label: "Chemistry", default: "dGTP" },
  { name: "copy_number", type: "text", label: "Copy number (medium / high / low)", default: "medium" }
];

// 13 µL total: 3 µL primer + 10 µL of DNA and water.
const TOTAL_UL = 13;
const PRIMER_UL = 3;
const PRIMER_UM = 2.66;
const DNA_PLUS_WATER_UL = TOTAL_UL - PRIMER_UL;

const COPY = {
  medium: {
    dna_uL: 10,
    label: "medium copy",
    examples: "pBR322, pAC plasmids — and **pP6**"
  },
  high: {
    dna_uL: 4,
    label: "high copy",
    examples: "pUC plasmids"
  },
  low: {
    dna_uL: null, // do not sequence the plasmid directly
    label: "low copy",
    examples: "pSC101, BACs"
  }
};

export function factory(values = {}) {
  const n = Math.max(1, Number(values?.samples ?? 8));
  const primer = String(values?.primer ?? "G00101");
  const chemistry = String(values?.chemistry ?? "dGTP");

  const key = String(values?.copy_number ?? "medium").trim().toLowerCase();
  const copy = COPY[key] ?? COPY.medium;
  const dna = copy.dna_uL;
  const water = dna === null ? null : DNA_PLUS_WATER_UL - dna;
  const needsPcr = dna === null;

  return {
    name: "Cycle Sequencing",
    description: `Submit ${n} read${n > 1 ? "s" : ""} with primer ${primer} on ${chemistry} chemistry.`,
    includes: { required: [], optional: [] },
    derived: {
      samples: n,
      primer,
      chemistry,
      total_uL: TOTAL_UL,
      primer_uL: PRIMER_UL,
      primer_uM: PRIMER_UM,
      dna_uL: dna,
      water_uL: water,
      copy_number: key in COPY ? key : "medium",
      copy_label: copy.label,
      needs_pcr: needsPcr
    },
    template: `
**What you get**
One primer, so extension is **linear**, not exponential. The read starts about **20–50 bp
downstream** of the primer and gives **400–1000 bp** of usable sequence. Choose a primer
**upstream** of the region you care about. For pP6 that is **${primer}**.

**Use the ${chemistry} protocol**
Not the standard chemistry. Standard chemistry **dies inside a hairpin** — a terminator, or
any strong secondary structure, stops the read dead. This cost Tlib2 an entire sequencing run.

**Submission — ${TOTAL_UL} µL total, in a 1.5 mL tube**
${needsPcr ? `
> **${copy.label} (${copy.examples}): do not sequence the plasmid directly.**
> There is not enough template. **PCR the region first**, clean up the product, and submit
> the PCR product in place of the miniprep.
` : `
- **${PRIMER_UL} µL** ${primer} — our sequencing oligos are standardised to **${PRIMER_UM} µM**,
  so ${PRIMER_UL} µL is exactly one reaction's worth
- **${dna} µL** miniprep DNA *(${copy.label}: ${copy.examples})*
${water > 0 ? `- **${water} µL** water\n` : ``}
That is **${TOTAL_UL} µL**. The primer is always ${PRIMER_UL} µL; the remaining
${DNA_PLUS_WATER_UL} µL is DNA and water.
`}
**How much DNA depends on copy number**
- **Medium copy** — pBR322, pAC plasmids, and **pP6**: **10 µL** of miniprep.
- **High copy** — pUC plasmids: about **4 µL** of miniprep, made up to ${DNA_PLUS_WATER_UL} µL with water.
- **Low copy** — pSC101, BACs: **PCR first** and sequence the PCR product.

**Tubes and labelling**
- **1.5 mL tubes. Not PCR tubes.**
- Label the **top** of the tube.
- The label must be **the exact name you put on the submission form** — not an abbreviation,
  and not a name that only makes sense to you. The facility matches tube to form by that string.

**Sequence everything you picked**
Including the clones that look boring. The ones in the **middle of the range** are the
informative ones — Tlib2 sequenced only its brightest and left its main question unanswered
for three years. Results come back in **1–2 days**.

**Check the read**
You get a \`.txt\` of base calls (the *read*) and an \`.ab1\` chromatogram (the *trace*).
Open both in **ApE** or Benchling; \`ctrl-K\` in ApE annotates known features.

1. Is the read **clean**? How long is the stretch with no Ns — 100 bp is poor,
   800 bp good, 1000 bp great.
2. Look for the architecture **BseRI → variable promoter → BseRI**. Exactly **two** BseRI sites.
3. Check the **T4 terminator** is there, and that the promoter is not duplicated,
   reversed or truncated.
4. Align to \`pP6.seq\` (**Tools → Align with another sequence…**). Look for 100% identity
   around the promoter.
5. Search the read for the target motif. If it is there and the read is clean, the clone
   is **usable**:
   \`\`\`
   GAGGAGTCCTGGGTTCNNNNTTGACANNNNNNNNNNNNNNNNNTATAATNNNNNNANNNNGTTAGTATTTCTCCTC
   \`\`\`
6. Record each clone: **exp**, **clone_id**, **student_name**, **read_name**,
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
