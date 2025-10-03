export const inputs = [
  { name: "antibiotic", type: "select", label: "Antibiotic", options: ["ampicillin", "carbenicillin", "spectinomycin", "kanamycin", "chloramphenicol", "tetracycline", "none"], default: "ampicillin" },
  { name: "weighed_mg", type: "number", label: "Powder weighed (mg)", default: 50, step: 1 }
];

function normalizeAntibiotic(s){
  const a = String(s || "").trim().toLowerCase();
  if (a === "none") return "none";
  if (["amp", "ampicillin"].includes(a)) return "ampicillin";
  if (["carb", "carben", "carbenicillin"].includes(a)) return "carbenicillin";
  if (["spec", "spectinomycin"].includes(a)) return "spectinomycin";
  if (["kan", "kana", "kanamycin"].includes(a)) return "kanamycin";
  if (["cam", "chlor", "chloramphenicol"].includes(a)) return "chloramphenicol";
  if (["tet", "tetracycline"].includes(a)) return "tetracycline";
  return a;
}

function paramsForAntibiotic(ab){
  // Returns { target_mg_per_mL, factor_uL_per_mg, solvent, notes, light_protect }
  switch (ab){
    case "ampicillin":
    case "carbenicillin":
    case "spectinomycin":
      return { target_mg_per_mL: 100, factor_uL_per_mg: 10, solvent: "molecular biology grade water", notes: "", light_protect: false };
    case "kanamycin":
    case "chloramphenicol":
      return { target_mg_per_mL: 25, factor_uL_per_mg: 40, solvent: "molecular biology grade water", notes: "", light_protect: true };
    case "tetracycline":
      return { target_mg_per_mL: 10, factor_uL_per_mg: 100, solvent: "ethanol", notes: "Warm gently to help dissolution; do not overheat.", light_protect: true };
    case "none":
      return { target_mg_per_mL: null, factor_uL_per_mg: null, solvent: "N/A", notes: "No antibiotic preparation required.", light_protect: false };
    default:
      return { target_mg_per_mL: null, factor_uL_per_mg: null, solvent: "molecular biology grade water", notes: "Verify appropriate solvent and concentration for this antibiotic.", light_protect: false };
  }
}

export function factory(values){
  const antibioticRaw = values?.antibiotic;
  const weighed_mg = Number(values?.weighed_mg ?? 50);
  const antibiotic = normalizeAntibiotic(antibioticRaw);
  const cfg = paramsForAntibiotic(antibiotic);

  if (antibiotic === "none") {
    return {
      name: "Preparation of Antibiotic 1000× Stock",
      description: "No antibiotic preparation required.",
      template: "No antibiotic preparation required for this run."
    };
  }

  let volume_uL = null;
  if (typeof cfg.factor_uL_per_mg === "number") {
    volume_uL = Math.round(weighed_mg * cfg.factor_uL_per_mg);
  }
  const volume_mL_str = volume_uL !== null ? ` (${(volume_uL/1000).toFixed(2)} mL)` : "";

  const concStr = cfg.target_mg_per_mL ? `${cfg.target_mg_per_mL} mg/mL` : `desired concentration`;
  const volStr = volume_uL !== null ? `${volume_uL} µL${volume_mL_str}` : `V = (mg weighed) × (µL per mg)`;

  const steps = [
    "Label a sterile 1.5 mL microcentrifuge tube.",
    "Place the empty tube on an analytical balance and tare to 0.000 g.",
    "Scoop approximately 50 mg of antibiotic powder into the tube; record the actual mass (mg).",
    `Compute the volume of solvent to add for a ${concStr} stock: for ${antibiotic || "this antibiotic"}, use ${cfg.factor_uL_per_mg ?? "[set factor]"} µL per mg. For ${weighed_mg} mg → add ${volStr} of ${cfg.solvent}.`,
    cfg.notes ? `If preparing ${antibiotic}, ${cfg.notes}` : null,
    "Cap the tube and mix until fully dissolved (vortex briefly; avoid aerosols).",
    "If a sterile stock is required, sterile‑filter (0.22 µm) into a sterile, labeled tube using a membrane compatible with the solvent.",
    cfg.light_protect ? "Protect from light (use amber tube/wrap in foil)." : null,
    "Aliquot as needed and label with antibiotic, concentration, date, and your initials.",
    "Store according to lab SOP for this antibiotic (commonly −20 °C or 4 °C)."
  ].filter(Boolean);

  return {
    name: "Preparation of Antibiotic 1000× Stock",
    description: "Prepare concentrated antibiotic stock solution with mass‑based solvent calculation.",
    template: steps.map((s, i) => `${i+1}. ${s}`).join("\n")
  };
}