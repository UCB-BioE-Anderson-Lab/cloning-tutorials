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
- Warm plates in the incubator to **room temperature**; cold plates are difficult to write on.
- Label the **bottom** of each plate with:
  - **Date** (YYYY‑MM‑DD) and your name/initials
  - **Strain:** ${host}
  - **Plasmid:** ${plasmid}
  - **Selection:** ${antibiotics.join(", ")}

**Protocol**
1. Retrieve ligation reactions or plasmid DNA and bring to the transformation bench.
2. Set the Echotherm blocks to **4 °C** (A) and **42 °C** (B). Alternatively, use a thermocycler with two blocks set to these temperatures.
3. Place competent cell aliquots on block A (4 °C). One tube is sufficient for three reactions.
4. Thaw cells (~30 s). Add **25 µL KCM** to each aliquot and pipette gently to mix.
5. Place the DNA tube (ligation mix or diluted plasmid) on block A.
6. Let tubes cool for **30 s** on block A.
7. Add **40 µL** competent cells to each DNA tube while on block A (**for a 10 µL DNA sample**). If DNA was not already in the tube, add it now. Mix gently.
   - These numbers assume the DNA volume is ~20% of the total mixture.
   - Using smaller DNA volumes is fine, but adding too much DNA will dilute salts and reduce transformation efficiency.
   - For large DNA reactions (~20 µL), use **100 µL** or the **entire tube** of competent cells.
   - For simple retransformation from a miniprep, **0.5 µL** of plasmid DNA in **10 µL** of cells is sufficient.
8. Incubate at **4 °C for 10 min**.
9. Transfer tubes to block B (**42 °C**) for **90 s**.
10. Return tubes to block A (**4 °C**) for **1 min**.
${needsRescue ? `
11. **Rescue step:** add **200 µL 2YT**, transfer to a 1.5 mL tube, and shake at **${tempC} °C** for **1 h**. This step allows time for the resistance gene to express before plating on the chosen antibiotic.
12. Plate all liquid on **${antibiotics.join(", ") }** selective agar plates. Incubate **inverted** at **${tempC} °C** overnight.
   - **Drying the plates (optional):** Leave the plate **uncovered near the flame** until the liquid is fully absorbed and the surface is **no longer glossy**. This prevents colony bleeding or running, especially when plating >100 µL.
13. Cancel temperature devices when finished.
` : `
11. Plate the transformation mix directly on **carbenicillin** selective agar plates. Incubate **inverted** at **${tempC} °C** overnight.
12. Cancel temperature devices when finished.
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
      needs_rescue: needsRescue
    },
    template
  };
}