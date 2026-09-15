// taq_pcr.js
// Taq PCR — the short-product alternative to PrimeSTAR.
//
// JCA, 2026-09-10: *"For really short sequences, like <250 bp, I would recommend a Taq reaction
// instead of primestar… The recipe is different for taq too -- different enzyme and buffer, same
// dntps."* The recipe below is his, given 2026-09-10:
//
//     5 uL 10x Taq Buffer · 5 uL 2 mM in each dNTP · 1 uL 10 uM primer1 · 1 uL 10 uM primer2
//     1 uL template · 1 uL Taq Polymerase · up to 50 uL with ddH2O
//
// NOTE THE dNTPs ARE NOT THE PRIMESTAR ONES. "Same dNTPs" means the same *stock* is used, and it
// goes in at 5 µL of 2 mM each here against 4 µL of 2.5 mM each in the PrimeSTAR reaction. Two
// numbers differ and neither is the enzyme, which is exactly why swapping the polymerase without
// swapping the recipe produces a reaction that looks set up correctly.
//
// The programs are bare numbers — `45`, `55` — where PrimeSTAR's are `PG<kb>K<anneal>`. Taq is
// used here for products under 250 bp, so there is no extension-length digit to carry.

// Timing — see docs/protocols/TIMING.txt. Minutes.
export const timing = {
  ends_at: "starting the thermocycler program",
  work: [],
  wait: [
    // Short products by definition: a Taq run here is well under an hour.
    { label: "thermocycler, short product", min: 45, max: 90 }
  ],
  limits: [],
  unknown: ["hands-on setup time, for one reaction and for a master mix"]
};

export const inputs = [
  { name: "reactions", type: "number", label: "Number of PCRs (50 µL each)", default: 1, step: 1 },
  { name: "template_name", type: "text", label: "Template", default: "template_dna" },
  { name: "primer1_name", type: "text", label: "Primer 1 name", default: "forward_oligo" },
  { name: "primer2_name", type: "text", label: "Primer 2 name", default: "reverse_oligo" },
  { name: "label_prefix", type: "text", label: "Tube label prefix", default: "pcr" },
  { name: "use_mastermix", type: "boolean", label: "Use master mix?" },
  { name: "overage", type: "number", label: "Master mix overage (fraction)", default: 0.10, step: 0.05 }
];

const round1 = (x) => Math.round(x * 10) / 10;

export function factory(values = {}) {
  const n = Math.max(1, Number(values.reactions ?? 1));
  const template = String(values.template_name ?? "template_dna");
  const p1 = String(values.primer1_name ?? "forward_oligo");
  const p2 = String(values.primer2_name ?? "reverse_oligo");
  const labelPrefix = String(values.label_prefix ?? "pcr");
  const overage = Math.max(0, Number(values.overage ?? 0.10));
  const mmRaw = values.use_mastermix;
  const mmParsed = (mmRaw === true || mmRaw === "true" || mmRaw === "on");
  // Four or more, not more than four — JCA's ruling, 2026-09-10. Same as primestar_pcr.js.
  const useMastermix = (mmRaw === undefined ? (n >= 4) : mmParsed);

  // Per-reaction volumes (µL), 50 µL total. Water is "up to 50", i.e. whatever is left.
  const per = { buffer10x: 5, dNTP: 5, primer1: 1, primer2: 1, template: 1, enzyme: 1 };
  const named = per.buffer10x + per.dNTP + per.primer1 + per.primer2 + per.template + per.enzyme;
  per.water = 50 - named;                                   // 36 µL

  const perMix = 50 - per.template;                         // everything but the template
  const mixFactor = n * (1 + overage);
  const totals = {
    water: round1(per.water * mixFactor),
    buffer10x: round1(per.buffer10x * mixFactor),
    dNTP: round1(per.dNTP * mixFactor),
    primer1: round1(per.primer1 * mixFactor),
    primer2: round1(per.primer2 * mixFactor),
    enzyme: round1(per.enzyme * mixFactor),
    mixTotal: round1(perMix * mixFactor)
  };

  const labels = Array.from({ length: n }, (_, i) => `${labelPrefix}_${i + 1}`);
  const name = "Taq PCR";
  const description = `Set up ${n} × 50 µL Taq PCR${n > 1 ? "s" : ""} with ${p1}/${p2} on ${template}`;

  const templateStr = `
**Taq, not PrimeSTAR.** This reaction uses a different enzyme *and* a different buffer, and more
dNTP mix at a lower concentration. Do not set it up from memory of the PrimeSTAR sheet.

1. **Find oligo samples.** Locate the 10 µM stocks and the template DNA.
2. **Prepare oligo dilutions if needed.**
{dilution_of_oligonucleotides}
3. **Label the tubes first**, before any liquid goes in (**${labelPrefix}_1 … ${labelPrefix}_${n}**).

${useMastermix ? `
**Master Mix** *(for ${n} reactions; includes ${Math.round(overage * 100)}% overage)*
- **${totals.water} µL** ddH₂O
- **${totals.buffer10x} µL** 10× Taq Buffer
- **${totals.dNTP} µL** dNTP mix (2 mM each)
- **${totals.primer1} µL** ${p1} (10 µM)
- **${totals.primer2} µL** ${p2} (10 µM)
- **${totals.enzyme} µL** Taq polymerase

- Aliquot **${perMix} µL** of master mix into each labeled tube.
` : ``}

**Reaction** *(per 50 µL tube; add enzyme last; keep cold)*
${useMastermix ? `
- **${perMix} µL** Master mix
- **1 µL** ${template}
` : `
- **${per.water} µL** ddH₂O *(up to 50 µL)*
- **5 µL** 10× Taq Buffer
- **5 µL** dNTP mix (2 mM each)
- **1 µL** ${p1} (10 µM)
- **1 µL** ${p2} (10 µM)
- **1 µL** ${template}
- **1 µL** Taq polymerase
`}

1. **Cap the tube.**
2. **Invert and slam** on the bench to mix.
3. **Quick spin** in the PCR mini‑centrifuge.
4. **Run thermocycler program ${'`'}55${'`'}** — or ${'`'}45${'`'} if your oligos are degenerate.
`;

  return {
    name,
    description,
    includes: { required: [], optional: ["dilution_of_oligonucleotides"] },
    derived: {
      reactions: n,
      overage_fraction: overage,
      use_mastermix: useMastermix,
      per_reaction_uL: per,
      master_mix_totals_uL: totals,
      labels
    },
    template: templateStr
  };
}
