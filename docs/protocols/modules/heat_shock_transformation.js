// heat_shock_transformation.js
// KCM heat-shock transformation (E. coli), parameterized for plasmid, host, antibiotics, incubation temp, and product name.

export const inputs = [
  { name: "plasmid", type: "text", label: "Plasmid", default: "plasmid_name" },
  { name: "host", type: "text", label: "Host strain", default: "Mach1" },
  { name: "antibiotics", type: "text", label: "Antibiotics (comma-separated)", default: "Amp" },
  { name: "temperature_C", type: "number", label: "Incubation temperature (°C)", default: 37, step: 1 },
  { name: "product_name", type: "text", label: "Product name", default: "product_name" }
];

export function factory(values = {}) {
  const plasmid = String(values.plasmid ?? "plasmid_name");
  const host = String(values.host ?? "Mach1");
  const antibioticsRaw = String(values.antibiotics ?? "Amp");
  const antibiotics = antibioticsRaw.split(",").map(s => s.trim()).filter(Boolean);
  const tempC = Math.round(Number(values.temperature_C ?? 37));
  const product = String(values.product_name ?? "product_name");

  // Rescue is needed for selections other than carbenicillin (our standard replacement for ampicillin).
  const hasAmp = antibiotics.some(a => /^carb(en(icillin)?)?$/i.test(a) || /^amp(i(cillin)?)?$/i.test(a));
  const needsRescue = !hasAmp;

  // Bench quantities. Named here so the template and the printed cheatsheet read the same
  // numbers from one place; 25 µL KCM into a 100 µL aliquot is 1× from the 5× stock.
  const q = {
    aliquot_uL: 100,     // one competent cell aliquot
    kcm_uL: 25,          // KCM added to that aliquot
    reactions_per_tube: 3,
    cells_uL: 40,        // cell/KCM mix per reaction, for a 10 µL DNA sample
    dna_uL: 10,
    cold_C: 4,
    hot_C: 42,
    cool_s: 30,
    cold_min: 10,
    heat_s: 90,
    recover_min: 1,
    rescue_uL: 200,
    rescue_h: 1
  };

  const name = "KCM Heat-Shock Transformation";
  const description = `Transform ${plasmid} into ${host} and plate on ${antibiotics.join(", ")} at ${tempC} °C`;

  const template = `

**Equilibrate heating and cooling blocks**
- Turn on the Echotherm. Set block A to **4 °C** and block B to **42 °C**. Wait until both blocks are at temperature.
- **Alternative:** use a thermocycler with two blocks set to **4 °C** and **42 °C**.
- **Alternative:** use a **42 °C** heating block and an **ice bath** for **4 °C**.
- Keep the blocks at temperature throughout the procedure.

**Plates and labeling**
- You will need **at least 1 petri dish** per transformation containing the required antibiotic(s) or additive(s).
- If selecting with an **Amp/Bla** marker, use the **carbenicillin** plates stocked in the fridge.
- For any other selection, prepare plates:
{pouring_petri_dishes}

**Warm and label**
- **Do this first — it is slow.** Warm the plates in the **incubator** to room temperature.
  Plates out of the fridge carry **condensation**, and you cannot write on a wet plate.
- Label the **bottom** of each plate with:
  - **Date** (YYYY‑MM‑DD) and your name/initials
  - **Strain:** ${host}
  - **Plasmid:** ${plasmid}
  - **Selection:** ${antibiotics.join(", ")}

**Protocol**
1. **Get your plates first and start them warming.** Check they carry the antibiotic(s) named
   on your labsheet, then put them in the incubator. This is the slow step, so start it before
   anything else.
2. Retrieve ligation reactions or plasmid DNA and bring to the transformation bench.
3. Set the Echotherm blocks to **4 °C** (A) and **42 °C** (B). Alternatively, use a thermocycler with two blocks set to these temperatures.
4. Place competent cell aliquots on block A (4 °C). One tube is sufficient for three reactions.
5. Thaw cells (~${q.cool_s} s). Add **${q.kcm_uL} µL KCM** to each aliquot and pipette gently to mix.
6. Place the DNA tube (ligation mix or diluted plasmid) on block A.
7. Let tubes cool for **${q.cool_s} s** on block A.
8. Add **${q.cells_uL} µL** competent cells to each DNA tube while on block A (**for a ${q.dna_uL} µL DNA sample**). If DNA was not already in the tube, add it now. Mix gently.
   - These numbers assume the DNA volume is ~20% of the total mixture.
   - Using smaller DNA volumes is fine, but adding too much DNA will dilute salts and reduce transformation efficiency.
   - For large DNA reactions (~20 µL), use **100 µL** or the **entire tube** of competent cells.
   - For simple retransformation from a miniprep, **0.5 µL** of plasmid DNA in **10 µL** of cells is sufficient.
9. Incubate at **${q.cold_C} °C for ${q.cold_min} min**.
10. Transfer tubes to block B (**${q.hot_C} °C**) for **${q.heat_s} s**.
11. Return tubes to block A (**${q.cold_C} °C**) for **${q.recover_min} min**.
${needsRescue ? `
12. **Rescue step:** add **${q.rescue_uL} µL 2YT**, transfer to a 1.5 mL tube, and shake at **${tempC} °C** for **${q.rescue_h} h**. This step allows time for the resistance gene to express before plating on the chosen antibiotic.
13. Plate all liquid on **${antibiotics.join(", ") }** selective agar plates. Incubate **inverted** at **${tempC} °C** overnight.
   - **Drying the plates (optional):** Leave the plate **uncovered at the sterile bench** until the liquid is fully absorbed and the surface is **no longer glossy**. This prevents colony bleeding or running, especially when plating >100 µL.
14. Cancel temperature devices when finished.
` : `
12. Plate the transformation mix directly on **carbenicillin** selective agar plates. Incubate **inverted** at **${tempC} °C** overnight.
13. Cancel temperature devices when finished.
`}

`;

  return {
    name,
    description,
    includes: { required: [], optional: ["pouring_petri_dishes"] },
    derived: {
      plasmid,
      host,
      antibiotics,
      incubation_temperature_C: tempC,
      product_name: product,
      needs_rescue: needsRescue,
      ...q
    },
    template
  };
}