// large_petri_dishes.js
// Pouring and spreading large (150 mm) petri dishes.
// Minimal inputs: number of plates, to compute 250 mL agar bottles (5 plates per bottle @ ~50 mL/plate).

export const inputs = [
  { name: "plates_needed", type: "number", label: "Number of 150 mm plates to pour", default: 10, step: 5 }
];

export function factory(values = {}) {
  const plates = Math.max(1, Number(values.plates_needed ?? 10));
  const bottles = Math.ceil(plates / 5); // 1 bottle (~250 mL) ≈ 5 large plates @ ~50 mL each

  return {
    name: "Pouring and Spreading Large Petri Dishes (150 mm)",
    description: "Plan volumes, prepare LB agar (fresh or re-melt), add antibiotics/additives, pour 150 mm plates (~50 mL each), and spread cultures evenly.",
    includes: { required: [], optional: ["preparation_of_lb_agar", "remelting_lb_agar"] },
    derived: { plates_needed: plates, agar_bottles_250mL: bottles },
    template: `
**Plan volumes**
- **Prepare:** **${bottles} × 250 mL bottles** of LB agar (≈5 plates per bottle at ~50 mL/plate) for **${plates} large plates**.

**Prepare LB agar (choose one)**
{preparation_of_lb_agar}
{remelting_lb_agar}

**Sterile containers for mixing**
- If making fresh agar: also sterilize several **100 mL or 250 mL** empty bottles for measuring out media. Use **one clean bottle per antibiotic/additive combination**.  
- Alternatively, use **50 mL conicals**, taking a **fresh** one for each combination.

**Add antibiotics/additives at ~55 °C**
- Once agar cools to **~55 °C**, add antibiotics or other additives.  
- **Dosing rule:** all antibiotics are **1000×** stocks → add **X µL** per **X mL** of agar.  
  *Example:* Pouring **5 large plates × 50 mL = 250 mL** total agar → add **250 µL** of antibiotic.
- For each combination, pour the required volume into a warm sterile bottle or conical. Use side graduations as a **crude volumetric**; close enough for routine plate pours.  
- **Mix by swirling (not vigorous shaking)** to avoid bubbles.

**Set up the sterile area**
- Place stacks of **150 mm** petri dishes on the **sterile bench**.  
- Light the **Bunsen burner** with a striker; gas can be fully open.  
- *Why a flame?* The hot column of air above the flame creates **upward convection** that reduces dust and airborne microbes settling into your open plates.

**Pouring large plates**
1. For each stack (single antibiotic/additive combination), **remove lids** and keep them nearby upside-down.  
2. **Pour ~50 mL** per plate. You can also watch for the moment the added volume **breaks surface tension and spreads** to fill the plate.  
3. If bubbles form, hold the burner by the base and briefly **pass the flame** over the surface to pop them.  
4. **Replace lids** and set plates aside to **solidify**.

**Spreading on large plates**
- Start with **freshly poured** plates cooled to room temp or **refrigerated/wrapped** plates that have been warmed to **room temperature (or slightly warmer)**. You can place plates in an incubator briefly to equilibrate.  
- Target spread volume: **200–500 µL** per plate; up to **1 mL** is possible.  
  - If you have less than ~200 µL, **add LB or water** to reach ~200 µL so it spreads evenly.  
- Label the **bottom** of the plate, then dispense the sample in the **center**.  
- Use a **sterile spreader/wand** to spread as evenly as possible. If available, use a **plate spinner** for uniform coverage.  
- With the **lid still off**, leave the plate **near the flame** for several minutes until the liquid is **absorbed** and the surface is **no longer shiny**.  
- Then **put the lid on, invert**, and place in the **incubator**.  
  - Skipping the drying step risks **seepage and colony smearing**, which can bias library selections. Drying and inverting should yield **discrete colonies**.

**Marking conventions (common codes)**
- **Carbenicillin/Ampicillin:** red stripes on side; “A”, “Amp”, or “Carb” on plate bottom  
- **Kanamycin:** green stripes; “K” or “Kan”  
- **Chloramphenicol:** blue stripes; “C” or “CAM”  
- **Spectinomycin:** black stripes; “Sp” or “Spec”  
- **Tetracycline:** yellow stripes; “T” or “Tet”  
- **Arabinose:** “Ara”  
- **IPTG:** “IPTG”  
- **X‑Gal:** “X” or “XGal”
`
  };
}