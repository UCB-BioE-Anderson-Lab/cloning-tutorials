// primestar_pcr.js
// Minimal, computed protocol with inputs for number of reactions and names.

export const inputs = [
  { name: "reactions", type: "number", label: "Number of PCRs (50 µL each)", default: 1, step: 1 },
  { name: "template_name", type: "text", label: "Template", default: "template_dna" },
  { name: "primer1_name", type: "text", label: "Primer 1 name", default: "forward_oligo" },
  { name: "primer2_name", type: "text", label: "Primer 2 name", default: "reverse_oligo" },
  { name: "label_prefix", type: "text", label: "Tube label prefix", default: "pcr" },
  { name: "use_mastermix", type: "boolean", label: "Use master mix?" },
  { name: "overage", type: "number", label: "Master mix overage (fraction)", default: 0.10, step: 0.05 }
];

export function factory(values = {}) {
  const n = Math.max(1, Number(values.reactions ?? 1));
  const template = String(values.template_name ?? "template_dna");
  const p1 = String(values.primer1_name ?? "forward_oligo");
  const p2 = String(values.primer2_name ?? "reverse_oligo");
  const labelPrefix = String(values.label_prefix ?? "pcr");
  const overage = Math.max(0, Number(values.overage ?? 0.10));
  const mmRaw = values.use_mastermix;
  const mmParsed = (mmRaw === true || mmRaw === "true" || mmRaw === "on");
  const useMastermix = (mmRaw === undefined ? (n > 4) : mmParsed);

  // Per-reaction volumes (µL), 50 µL total
  const per = {
    water: 32,
    buffer5x: 10,
    dNTP: 4,
    primer1: 1,
    primer2: 1,
    template: 1,
    enzyme: 1
  };
  const perMix = per.water + per.buffer5x + per.dNTP + per.primer1 + per.primer2 + per.enzyme; // 49 µL master mix per reaction (includes enzyme)
  const mixFactor = n * (1 + overage);

  // Totals for master mix (exclude template only; enzyme included when using master mix)
  const totals = {
    water: round1(per.water * mixFactor),
    buffer5x: round1(per.buffer5x * mixFactor),
    dNTP: round1(per.dNTP * mixFactor),
    primer1: round1(per.primer1 * mixFactor),
    primer2: round1(per.primer2 * mixFactor),
    enzyme: round1(per.enzyme * mixFactor),
    mixTotal: round1(perMix * mixFactor)
  };

  // Labels
  const labels = Array.from({ length: n }, (_, i) => `${labelPrefix}_${i + 1}`);
  const labelRange = labels.length <= 10 ? labels.join(", ") : `${labels[0]} … ${labels[labels.length - 1]}`;

  const name = "PrimeSTAR GXL PCR";
  const description = `Set up ${n} × 50 µL PCR${n > 1 ? "s" : ""} with ${p1}/${p2} on ${template}`;

  const templateStr = `
1. **Find oligo samples.** For now, locate tubes manually (ideally 10 µM stocks) and the template DNA (miniprep‑level concentration).
2. **Prepare oligo dilutions if needed.**
{dilution_of_oligonucleotides}

${useMastermix ? `
**Master Mix** *(for ${n} reactions; includes ${Math.round(overage*100)}% overage)*
- **${totals.water} µL** ddH₂O
- **${totals.buffer5x} µL** 5× PrimeSTAR GXL Buffer
- **${totals.dNTP} µL** dNTP mix (2.5 mM each)
- **${totals.primer1} µL** ${p1} (10 µM)
- **${totals.primer2} µL** ${p2} (10 µM)
- **${totals.enzyme} µL** PrimeSTAR GXL polymerase

- Aliquot **49 µL** of master mix into each labeled tube (**${labelPrefix}_1 … ${labelPrefix}_${n}**).

` : ``}

**Reaction** *(per ${50} µL tube; add enzyme last; keep cold)*
${useMastermix ? `
- **49 µL** Master mix
- **1 µL** ${template}
` : `
- **32 µL** ddH₂O
- **10 µL** 5× PrimeSTAR GXL Buffer
- **4 µL** dNTP mix (2.5 mM each)
- **1 µL** ${p1} (10 µM)
- **1 µL** ${p2} (10 µM)
- **1 µL** ${template}
- **1 µL** PrimeSTAR GXL polymerase
`}

1. **Cap the tube.**
2. **Invert and slam** on the bench to mix.
3. **Quick spin** in the PCR mini‑centrifuge.
4. **Run thermocycler program** according to your insert length and desired annealing temperature.
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

function round1(x) {
  return Math.round(Number(x) * 10) / 10; // one decimal place
}