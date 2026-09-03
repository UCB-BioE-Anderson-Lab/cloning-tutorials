

// preparation_of_1x_tae.js
// Terminal leaf module: no inputs or logic. Static protocol text in the style of other modules.

export const inputs = [];

export function factory() {
  return {
    name: "Preparation of 1× TAE Buffer",
    description:
      "Dilute 50× TAE stock into a gallon jug of house distilled water for gel casting and electrophoresis.",
    includes: { required: [], optional: [] },
    template: `
**Materials**
- 50× TAE stock
- 1 gallon jug of house distilled water
- Graduated cylinder (100 mL)

**Procedure**
1. Start with a **1 gallon jug** of **house distilled water**.
2. Measure **80 mL of 50× TAE** in the graduated cylinder and add it to the jug.
3. Cap the jug and **invert several times** to mix.
4. Label the jug **1× TAE** with the date and your initials.
5. Keep the jug by the **electrophoresis bench**; this is the 1× TAE used for pouring gels and for running buffer.

**Notes**
- One gallon is about **3.8 L**, so 80 mL of 50× gives **approximately 1×**. This is well within tolerance for electrophoresis.
- **Do not reuse the 80 mL figure for a smaller bottle.** The dilution scales with the final volume: a **500 mL** bottle needs **10 mL** of 50× TAE, not 80 mL.
`
  };
}
