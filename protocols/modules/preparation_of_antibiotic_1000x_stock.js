export const inputs = [
  { name: "antibiotic", type: "select", label: "Antibiotic", options: ["ampicillin", "carbenicillin", "spectinomycin", "kanamycin", "chloramphenicol", "erythromycin", "tetracycline", "none"], default: "ampicillin" },
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
  if (["erm", "ery", "eryth", "erythromycin"].includes(a)) return "erythromycin";
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
    case "erythromycin":
      return { target_mg_per_mL: 100, factor_uL_per_mg: 10, solvent: "ethanol", notes: "It is slow, so be patient. In hot agar it clouds briefly and clears on swirling.", light_protect: false };
    case "tetracycline":
      return { target_mg_per_mL: 10, factor_uL_per_mg: 100, solvent: "ethanol", notes: "Warm gently to help dissolution; do not overheat.", light_protect: true };
    case "none":
      return { target_mg_per_mL: null, factor_uL_per_mg: null, solvent: "N/A", notes: "No antibiotic preparation required.", light_protect: false };
    default:
      return { target_mg_per_mL: null, factor_uL_per_mg: null, solvent: "molecular biology grade water", notes: "Verify appropriate solvent and concentration for this antibiotic.", light_protect: false };
  }
}

// WHICH ANTIBIOTICS NEED SAYING, asked of the module that already knows.
//
// `paramsForAntibiotic` above is the only place in the toolkit that holds what makes each one
// awkward, and that is the fact a planner needs when deciding whether making one deserves its own
// session. Ampicillin and carbenicillin dissolve in water with no note against them; erythromycin
// and tetracycline do not, and every one of their failure modes reads as a botched prep to
// somebody who was not told.
//
// JCA, 2026-09-12: *"we should inject into this the protocol for making erythromycin stock, as
// that has been a recent historical pitfall for this group."* The pitfall is chemistry, so the
// chemistry is what the test asks about.
export function whyItNeedsSaying(name){
  const cfg = paramsForAntibiotic(normalizeAntibiotic(name));
  if (!cfg) return null;
  const solvent = String(cfg.solvent || "");
  // IN THE ORDER THAT MATTERS, and only one of them. A note saying three things is a note a person
  // skims; the solvent is the step people actually get wrong. JCA, 2026-09-12, on a botched
  // erythromycin prep: *"The error they made was trying to do it in water."*
  if (solvent && solvent !== "molecular biology grade water" && solvent !== "N/A") {
    return `it does not dissolve in water — the solvent is ${solvent}`;
  }
  if (String(cfg.notes || "").trim()) return String(cfg.notes).trim().replace(/\.$/, "");
  if (cfg.light_protect) return "it has to be protected from light";
  return null;
}

/** Does making this one need saying? -> boolean. The reason is `whyItNeedsSaying`. */
export function needsSaying(name){
  return whyItNeedsSaying(name) !== null;
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
  const volStr = volume_uL !== null ? `${volume_uL} µL${volume_mL_str}` : `[set factor] µL`;
  const factorStr = cfg.factor_uL_per_mg ?? "[set factor]";

  // THE SOLVENT GOES FIRST, IN ONE LINE, BECAUSE THAT IS THE STEP PEOPLE GET WRONG.
  //
  // JCA, 2026-09-12, on a recent erythromycin prep: *"The error they made was trying to do it in
  // water. Emphasize the solvent, but KISS."* It was step 4 of nine and a parenthesis in step 5,
  // which is not where somebody reading a protocol at a bench looks. A stock made in water looks
  // like a stock and selects for nothing.
  const notWater = cfg.solvent !== "molecular biology grade water";
  const headline = notWater
    ? `**Solvent: ${cfg.solvent.toUpperCase()} — not water.** It will not dissolve in water.`
    : `**Solvent: ${cfg.solvent}.**`;

  const steps = [
    "Label a sterile 1.5 mL microcentrifuge tube.",
    "Place the empty tube on an analytical balance and tare to 0.000 g.",
    "Scoop approximately 50 mg of antibiotic powder into the tube; record the actual mass (mg).",
    `Compute the volume of solvent for a ${concStr} stock by **multiplying the mass you recorded by ${factorStr}** — that is, **volume (µL) = mass (mg) × ${factorStr}**. Add that volume of ${cfg.solvent}. (Worked example: ${weighed_mg} mg × ${factorStr} = ${volStr}. Use your own recorded mass, not this number.)`,
    // ONE DISSOLVING STEP, NOT TWO. The per-antibiotic note said "vortex until it clears" and the
    // generic line below it said "vortex briefly" — contradictory advice two lines apart, and for
    // erythromycin the brief one is wrong.
    `Cap the tube and vortex until fully dissolved; avoid aerosols.${cfg.notes ? " " + cfg.notes : ""}`,
    "If a sterile stock is required, sterile‑filter (0.22 µm) into a sterile, labeled tube using a membrane compatible with the solvent.",
    cfg.light_protect ? "Protect from light (use amber tube/wrap in foil)." : null,
    "Aliquot as needed and label with antibiotic, concentration, date, and your initials.",
    "Store according to lab SOP for this antibiotic (commonly −20 °C or 4 °C)."
  ].filter(Boolean);

  return {
    name: `Preparation of ${antibiotic} 1000× stock`,
    description: `${concStr} in ${cfg.solvent}.`,
    template: [headline, ""].concat(steps.map((s, i) => `${i+1}. ${s}`)).join("\n")
  };
}