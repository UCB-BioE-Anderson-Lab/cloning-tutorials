// preparation_of_2yt_broth.js
// 2YT (2xYT) liquid medium in 250 mL Pyrex bottles. Mirrors preparation_of_lb_agar,
// which is the same bench, bottles, funnel and cooker — 2YT simply has no agar in it.

export const inputs = [
  { name: "bottles", type: "number", label: "Number of 250 mL bottles", default: 4, step: 1 },
  { name: "recipe_source", type: "select", label: "Made from",
    options: ["premixed 2YT powder", "individual components"], default: "premixed 2YT powder" }
];

export function factory(values = {}) {
  const bottles = Math.max(1, Math.round(Number(values?.bottles ?? 4)));
  const source = String(values?.recipe_source ?? "premixed 2YT powder");
  const total_mL = bottles * 250;
  const total_L = total_mL / 1000;

  // 2xYT is defined as 16 g/L tryptone, 10 g/L yeast extract, 5 g/L NaCl.
  const g = (perL) => {
    const v = perL * total_L;
    return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, "").replace(/\.$/, "");
  };

  const fromComponents = source === "individual components";

  const weighOut = fromComponents
    ? `2. Weigh into the bottles, for **${bottles} × 250 mL = ${total_mL} mL (${total_L} L)** total:
   - **Tryptone — ${g(16)} g** (16 g/L)
   - **Yeast extract — ${g(10)} g** (10 g/L)
   - **NaCl — ${g(5)} g** (5 g/L)
   Split evenly between the bottles, or make the full volume in one larger vessel and divide it
   after mixing.`
    : `2. Place a large funnel in each bottle and add **premixed 2YT powder** per bottle.
   ⚠️ **Confirm the scoop against the tub's own label before the first bottle** — 2YT powder is
   more concentrated than LB and the LB tablespoon is **not** the right measure for it. If no
   premixed 2YT is on the media bench, switch this protocol to *individual components*.`;

  return {
    name: "Preparation of 2YT Broth (250 mL bottles)",
    description: `Make ${bottles} × 250 mL 2YT liquid medium and sterilize (pressure cooker preferred).`,
    includes: { required: [], optional: [] },
    derived: { bottles, total_mL_2yt: total_mL },
    template: `
**Materials**
- ${fromComponents ? "Tryptone, yeast extract and NaCl (media bench)" : "2YT powder (media bench)"}
- **${bottles} × 250 mL** Pyrex media bottles with caps
- Large funnel${fromComponents ? "; weigh boats and a balance" : ""}
- House DI water (sink across from the media bench; DI line)
- Pressure cooker (small or large)
- Heat-protective gloves

**Procedure**
1. Label each bottle with "2YT", date, and initials.
${weighOut}
3. Fill each bottle with **house DI water** to the line by the neck. Remove the funnel.
4. Cap and **shake to dissolve**. 2YT has no agar in it, so unlike LB agar it should go fully
   into solution at room temperature — a bottle that stays cloudy with undissolved solids has
   been mismeasured.
5. **Sterilize immediately.** Hydrated medium is not sterile and will support growth if it sits.

**Pressure cooker**

6. Put bottles upright on the cooker tray with **~1/2–1 inch water** in the tray (bottle bases
   in contact with water).
7. Small cooker: **"Beef"** setting. Large cooker: **"Sterilize"** setting.
8. Run **20 min at high pressure**. Allow pressure to release naturally; open the lid.
9. With heat gloves, tighten caps if needed and remove bottles.

**Cooling and use**
10. **Let bottles cool to room temperature before adding antibiotic.** All antibiotics are
    **1000×** stocks → add **X µL** per **X mL** of broth.
11. Store at room temperature on the media shelf. Discard any bottle that has gone cloudy.

**Notes**
- The small pressure cooker holds **up to five 250 mL bottles** total — count any LB agar
  bottles going in on the same run.
- 2YT is the growth medium for starter cultures, competent cell prep, transformation rescue,
  and picking colonies into blocks. It is a **broth**: there is no agar and nothing to re-melt.
`
  };
}
