// dilution_of_oligonucleotides.js
// Resuspend lyophilized oligos to 100 µM and prepare 10 µM and 2.66 µM working stocks.

export const inputs = [];

export function factory() {
  return {
    name: "Dilution of Oligonucleotides",
    description: "Resuspend lyophilized or existing oligos to prepare standard 100 µM, 10 µM, and 2.66 µM stocks for molecular biology work.",
    includes: { required: [], optional: [] },
    template: `
**Resuspending Lyophilized Oligos (if new tubes)**
1. Find the **nmol** value printed on the tube.
2. Multiply that number by 10 to get the resuspension volume in µL for a **100 µM stock**.  
   For example, 25 nmol × 10 = 250 µL.
3. Briefly spin the tube to collect the powder at the bottom.
4. Add the calculated volume of **ddH₂O** (Millipore or molecular biology–grade).  
   *Qiagen EB or TE Buffer are acceptable. Do **not** use house distilled water.*
5. Cap and **vortex ~5 s**. Oligos dissolve immediately.

---

**Preparing 10 µM Working Stock (for PCR)**
- Choose a convenient total volume (e.g., 100 µL).  
- Mix **10 µL** of 100 µM stock + **90 µL** ddH₂O → **10 µM**.  
- Vortex to mix and label as \`10 µM {oligo_name}\`.

---

**Preparing 2.66 µM Working Stock (for Sequencing)**
- Used for UC Berkeley facility submissions (similar to 2.5–5 µM typical use).  
- Mix **2.66 µL** of 100 µM stock + **97.33 µL** ddH₂O → **2.66 µM**.  
- Vortex to mix and label as \`2.66 µM {oligo_name}\`.

---

**Notes**
- For existing 100 µM stocks, skip the resuspension step and prepare working stocks directly.
- Store all oligo stocks at **−20 °C**.
`
  };
}