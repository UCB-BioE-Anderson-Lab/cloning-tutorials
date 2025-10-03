export const inputs = [
  { name: "volume_in_mL", type: "number", label: "Culture volume (mL)", default: 100, step: 10 },
  { name: "has_flask", type: "boolean", label: "Do you already have a sterile flask?", default: false },
  { name: "target_OD", type: "text", label: "Target OD600 for harvest", default: "0.4–0.6" },
  { name: "tss_ratio", type: "number", label: "TSS resuspension volume as fraction of culture (e.g., 0.05 = 5%)", default: 0.05, step: 0.05 }
];

export function factory(values) {
  const volume = Number(values?.volume_in_mL ?? 100);
  const hasFlask = !!(values?.has_flask);
  const targetOD = values?.target_OD ?? "0.4–0.6";
  const tssRatio = Number(values?.tss_ratio ?? 0.05);

  // Calculations
  const starter_raw = Math.round(volume / 40);
  const starter_mL = Math.min(200, Math.max(5, starter_raw)); // enforce 5 mL min, 200 mL max
  const tss_mL = Math.round(volume * tssRatio * 10) / 10; // 0.1 mL resolution
  const tss_pct = Math.round(tssRatio * 100);

  return {
    name: "TSS Competent Cell Prep",
    training_required: ["minus_80", "allegra_15R"],
    description: "Prepare chemically competent E. coli by the TSS method (heat‑shock transformation).",
    includes: {
      required: [
        ...(hasFlask ? [] : ["preparation_of_sterile_flask"]),
        "preparation_of_starter_culture"
      ],
      optional: [
        "growing_bacteria_with_flasks"
      ]
    },
    // Keep includes on their own lines so renderer inserts full sections (with headings) cleanly.
    derived: { starter_volume_mL: starter_mL, culture_volume: volume },
    template: `
${hasFlask ? "" : "{preparation_of_sterile_flask}"}
{preparation_of_starter_culture}
{growing_bacteria_with_flasks}
1. In a sterile, baffled flask, add 2YT medium to ${volume} mL total. Then inoculate with ${starter_mL} mL of starter culture.
2. Shake ~4 h at 37 °C from the 1:40 inoculation; this typically yields mid‑log under standard conditions. If available, verify OD600 ≈ ${targetOD} and harvest.
3. Prepare a large ice bath; ensure the flask can be shaken with liquid below the waterline.
4. Rapidly chill the culture by swirling the flask in the ice bath for 1–2 min.
5. Wipe any water from the outside of the flask to avoid contamination when pouring.
6. Transfer the culture to pre‑chilled centrifuge tubes by carefully pouring.
7. Centrifuge at 4 °C, 4,000–6,000 × g for 5 min to pellet the cells.
8. Discard the supernatant into a designated waste beaker; return tubes to ice. (Bleach the waste beaker per SOP before sink disposal.)
9. Resuspend the pellet in ice‑cold TSS to a final volume of ${tss_mL} mL (≈ ${tss_pct}% of culture volume). Mix gently (avoid vigorous pipetting) to fully resuspend; keep on ice.
10. Transfer the suspension to a pre‑chilled 50 mL conical tube. (Bleach and rinse the centrifuge tubes later.)
11. Make 100 µL aliquots in pre‑chilled PCR tubes on a cold block (e.g., Echotherm).
12. Store in the −80 °C freezer (lower shelf). Label the container with strain, date, and initials. Training is required for −80 °C and the centrifuge.
`
  };
}
