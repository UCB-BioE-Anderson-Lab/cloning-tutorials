

// pouring_petri_dishes.js
// Standard pouring of regular (90–100 mm) petri dishes.
// Minimal inputs: only the number of plates, to compute the number of 250 mL agar bottles (10 plates per bottle).

export const inputs = [
  { name: "plates_needed", type: "number", label: "Number of plates to pour", default: 20, step: 10 }
];

export function factory(values = {}) {
  const plates = Math.max(1, Number(values.plates_needed ?? 20));
  const bottles = Math.ceil(plates / 10); // 1 bottle (~250 mL) ≈ 10 plates @ ~25 mL each

  return {
    name: "Pouring Standard Petri Dishes",
    description: "Plan volumes, prepare LB agar (fresh or re-melt), add antibiotics/additives, and pour 90–100 mm plates.",
    includes: { required: [], optional: ["preparation_of_lb_agar", "remelting_lb_agar"] },
    derived: { plates_needed: plates, agar_bottles_250mL: bottles },
    // Keep include tokens on their own lines for full-section rendering.
    template: `
**Plan volumes**
- **Prepare:** **${bottles} × 250 mL bottles** of LB agar (≈10 plates per bottle at ~25 mL/plate) for **${plates} plates**.

**Prepare LB agar (choose one)**
{preparation_of_lb_agar}
{remelting_lb_agar}

**Sterile containers for mixing**
- If making fresh agar: also sterilize several **100 mL or 250 mL** empty bottles for measuring out media. Use **one clean bottle per antibiotic/additive combination**.  
- Alternatively, use **50 mL conicals**, taking a **fresh** one for each combination.

**Add antibiotics/additives at ~55 °C**
- Once agar cools to **~55 °C**, add antibiotics or other additives.  
- **Dosing rule:** all antibiotics are **1000×** stocks → add **X µL** per **X mL** of agar.  
  *Example:* Pouring **5 plates × 25 mL = 125 mL** total agar → add **125 µL** of antibiotic.
- For each combination, pour the required volume into a warm sterile bottle or conical. Use side graduations as a **crude volumetric**; close enough for routine plate pours.  
- **Mix by swirling (not vigorous shaking)** to avoid bubbles.

**Set up the sterile area**
- Place stacks of petri dishes on the **sterile bench**.  
- Light the **Bunsen burner** with a striker; gas can be fully open.  
- *Why a flame?* The hot column of air above the flame creates **upward convection** that reduces dust and airborne microbes settling into your open plates.

**Pouring**
1. For each stack (single antibiotic/additive combination), **remove lids** and keep them nearby upside-down.  
2. **Pour ~25 mL** per plate (about **3/16 inch** thick). You can also watch for the moment the added volume **breaks surface tension and spreads** to fill the plate—this is a practical visual cue for the right amount.  
3. If bubbles form, hold the burner by the base and briefly **pass the flame** over the surface to pop them.  
4. **Replace lids** and set plates aside to **solidify**. Turn off the flame when finished.

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