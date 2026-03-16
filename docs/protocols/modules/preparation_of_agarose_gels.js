

// preparation_of_agarose_gels.js
// Terminal leaf module: no inputs or logic. Static protocol text in the style of other modules.

export const inputs = [];

export function factory() {
  return {
    name: "Preparation of Large Agarose Gels",
    description:
      "Prepare and cast large agarose gels in 1× TAE using the large gel rig.",
    includes: { required: [], optional: [] },
    template: `
**Materials**
- Agarose (regular kind, not low melt)
- 500 mL bottle with cap
- 1× TAE (bottle by the electrophoresis bench)
- Microwave
- Warm glove
- Large gel rig and casting holder/tray (drawer under the electrophoresis bench)
- Combs
- Gel cutting ceramic knife
- Gel box
- House DI water

**Procedure**
1. Weigh **5.5 g agarose** into a **500 mL bottle**.
2. Fill the bottle about **2/3 full** with **1× TAE** from the bottle by the electrophoresis bench.
3. Cap and shake well.
4. Loosen the cap, then microwave for about **2 min** to warm.
5. Cap and shake again.
6. Loosen the cap and microwave again until the solution **boils**.
7. Using the warm glove, remove the bottle from the microwave and allow it to cool until it **stops boiling**.

**Set up the gel rig**
8. While the agarose cools, get the **gel rig** from the drawer under the electrophoresis bench.
9. Add a comb to **every other slot**, with the comb on the **negative electrode side** of the holder.

**Pour the gel**
10. Fill the bottle to the **500 mL line** with cool **1× TAE**.
11. Cap and swirl to mix.
12. Pour the solution into the gel rig. **Do not worry about bubbles**; they will usually pop on their own.
13. Let the gel sit for about **30 min** until fully solid. You may also put it in the **fridge** to speed setting.

**Finish and transfer**
14. Pour enough **1× TAE** on the surface to cover the gel.
15. Gently and slowly pull the combs **straight up** to remove them.
16. Using the **gel cutting ceramic knife**, cut the gels just above the combs to separate them horizontally.
17. Cut off the small **notch** from the side of the gel.
18. Get the **gel box** out of the fridge.
19. Pour the excess **TAE** off the gel into the gel box.
20. Remove the gel rig from the casting holder/tray.
21. The gels should slide off into the gel box.
22. Put the gel box back in the **fridge**.
23. Rinse the combs and gel rig with **DI water**, let them dry, then return them to the drawer.

**Notes**
- Use **regular agarose**, not low-melt agarose.
- Always **loosen the cap before microwaving**.
- Remove combs **slowly and straight up** to avoid tearing the wells.
`
  };
}