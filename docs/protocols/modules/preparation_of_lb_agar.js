

// preparation_of_lb_agar.js
// Terminal leaf module: no inputs or logic. Static protocol text in the style of other modules.

export const inputs = [];

export function factory() {
  return {
    name: "Preparation of LB Agar (250 mL bottles)",
    description:
      "Make LB Agar from powder in 250 mL Pyrex bottles and sterilize (pressure cooker preferred).",
    includes: { required: [], optional: ["remelting_lb_agar"] },
    template: `
**Materials**
- LB Agar powder (media bench; tablespoon scoop inside)
- 250 mL Pyrex media bottles with caps
- Large funnel
- House DI water (sink across from the media bench; DI line)
- Pressure cooker (small or large) or microwave with liquid cycle
- Heat-protective gloves

**Procedure**
1. Label each 250 mL bottle with “LB Agar”, date, and initials.
2. Place a large funnel in each bottle. Add **1 level tablespoon** LB Agar powder per bottle.
3. Fill each bottle with **house DI water** to the line by the neck. Remove the funnel.
4. Cap and **shake to dislodge powder from the bottom**. Full dispersion not required; avoid powder stuck on the glass.
5. **Sterilize immediately.** Hydrated LB Agar is not sterile and will support growth if it sits.

**Pressure cooker (preferred)**

6. Put bottles upright on the cooker tray with **~1/2–1 inch water** in the tray (bottle bases in contact with water).
7. Small cooker: **“Beef”** setting. Large cooker: **“Sterilize”** setting.
8. Run **20 min at high pressure**. Allow pressure to release naturally; open the lid.
9. With heat gloves, tighten caps if needed and remove bottles. While still hot, **swirl or invert** to fully disperse and clear the bottom.

**Microwave (liquid cycle, alternate)**
- Use a **microwave liquid cycle** suitable for 250 mL bottles.
- Remove with heat gloves and **swirl while hot** to fully disperse.

**Cooling and use**
10. For pouring plates, cool to **~55 °C**. Practical check: if you can comfortably grasp the bottle without pain, it’s usually **55–65 °C**.
11. You may use a **55 °C water bath** if available (not typically set up in B144).
12. If not using immediately, **let bottles cool completely**. Leftover plain LB Agar may be kept by the sterile bench for small pours.

**Notes**
- Small pressure cooker holds **up to five 250 mL bottles**; large cooker fits **500 mL bottles** or additional 250 mL bottles.
- After a run, cookers continue to heat modestly until you **turn them off**.
- If set up in advance, the cooker can **hold ~55 °C** for hours until you remove your agar; this is also the target temperature for pouring plates.

{remelting_lb_agar}
`
  };
}