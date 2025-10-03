export const inputs = [
  { name: "antibiotic", type: "select", label: "Antibiotic to use", options: ["ampicillin", "carbenicillin", "kanamycin", "chloramphenicol", "spectinomycin", "tetracycline", "none"], default: "ampicillin" }
];

function normalizeAntibiotic(s){
  const a = String(s || "").trim().toLowerCase();
  if (["amp", "ampicillin"].includes(a)) return "ampicillin";
  if (["carb", "carben", "carbenicillin"].includes(a)) return "carbenicillin";
  if (["spec", "spectinomycin"].includes(a)) return "spectinomycin";
  if (["kan", "kana", "kanamycin"].includes(a)) return "kanamycin";
  if (["cam", "chlor", "chloramphenicol"].includes(a)) return "chloramphenicol";
  if (["tet", "tetracycline"].includes(a)) return "tetracycline";
  if (["none", "no", "-"] .includes(a)) return "";
  return a || "";
}

function roundUpStarter(vol){
  // Round up to a sensible prep size with some excess
  const choices = [5, 10, 25, 50, 100, 200];
  for (const c of choices){ if (vol <= c) return c; }
  return 200; // cap
}

function pickVessel(starter){
  if (starter <= 10) return "15 mL conical tube";
  if (starter <= 50) return "50 mL conical tube";
  return "250 mL baffled flask";
}

export function factory(values) {
  // Try to use a parent‑derived starter if provided; otherwise compute from final culture volume
  const finalVol = Number(values?.volume_in_mL ?? values?.culture_volume ?? values?.volume_mL ?? 100);
  const computedMin = finalVol / 40; // ~1:40 inoculation target
  const bounded = Math.min(200, Math.max(5, computedMin));
  const starter_mL = roundUpStarter(bounded);
  const vessel = pickVessel(starter_mL);

  const antibiotic = normalizeAntibiotic(values?.antibiotic);
  let antibioticInstruction;
  switch (antibiotic) {
    case "ampicillin":
    case "carbenicillin":
    case "kanamycin":
    case "chloramphenicol":
    case "spectinomycin":
    case "tetracycline":
      antibioticInstruction = `Add 5 µL of 1000x ${antibiotic} stock.`;
      break;
    case "":
      antibioticInstruction = "No antibiotic required for this starter culture.";
      break;
    default:
      antibioticInstruction = `Add the appropriate amount of ${antibiotic} per your lab’s SOP.`;
  }

  return {
    name: "Preparation of Starter Culture",
    description: "Prepare an overnight starter at an appropriate scale for the target culture (defaults: ≥1/40 of final volume, min 5 mL, cap 200 mL).",
    includes: ["preparation_of_antibiotic_1000x_stock"],
    derived: { starter_volume_mL: starter_mL },
    template: `
1. In a sterile ${vessel}, add ${starter_mL} mL 2YT medium.
2. ${antibioticInstruction}
3. Inoculate with glycerol stock or a single colony.
4. Grow overnight at 37 °C with shaking.
`
  };
}
