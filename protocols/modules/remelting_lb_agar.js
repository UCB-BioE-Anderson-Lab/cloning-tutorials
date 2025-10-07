

// remelting_lb_agar.js
// Terminal leaf module: no inputs, static text

export const inputs = [];

export function factory() {
  return {
    name: "Re-melting Solidified LB Agar",
    description:
      "Re-melt previously solidified LB Agar bottles using short heat intervals and controlled cooling.",
    template: `
**Procedure**
1. Loosen the bottle’s lid by about a quarter turn.
2. Heat in short 30–60 second bursts, resting between intervals, until melted.
3. Monitor closely as it nears melting and stop heating once boiling begins.
4. Allow to cool to **~55 °C** before adding antibiotics and pouring plates.
`
  };
}