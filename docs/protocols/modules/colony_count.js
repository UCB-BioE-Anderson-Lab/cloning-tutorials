// colony_count.js
// Serial dilution and plating to COUNT cells — on one medium to count what is alive, or on a
// selective and a non-selective medium as a pair to measure what fraction still carries a
// plasmid.
//
// THE PAIR IS THE POINT when it is used for retention. A culture that has lost its plasmid stops
// making whatever the plasmid made, and from the outside that is indistinguishable from a culture
// whose product is poisoning it: both go pale, both grow oddly. Counting on selective over
// non-selective separates them, and nothing else in a plate reader's output can.
//
// COUNT A PLATE IN RANGE OR COUNT NOTHING. Below about 30 colonies the count is dominated by
// sampling noise; above about 300 they merge and the count is systematically low in a direction
// nobody notices. A dilution series exists so that one plate in it lands in between — the answer
// comes from that plate, not from averaging a crowded one with an empty one.

const LOW = 30;
const HIGH = 300;

export const inputs = [
  { name: "cultures", type: "number", label: "Cultures to plate", default: 1, step: 1 },
  { name: "plates", type: "text", label: "Media to plate on, comma separated", default: "LB" },
  { name: "dilutions", type: "number", label: "Ten-fold dilution steps", default: 6, step: 1 },
  { name: "spot_uL", type: "number", label: "Volume plated per spot (µL)", default: 10, step: 1 },
  { name: "mode", type: "select", label: "What is being measured",
    options: ["viable count", "plasmid retention"], default: "viable count" }
];

export function factory(values = {}) {
  const cultures = Math.max(1, Math.round(Number(values?.cultures ?? 1)));
  const media = String(values?.plates ?? "LB").split(",").map((s) => s.trim()).filter(Boolean);
  const steps = Math.max(1, Math.round(Number(values?.dilutions ?? 6)));
  const spot = Math.max(1, Math.round(Number(values?.spot_uL ?? 10)));
  const retention = String(values?.mode ?? "") === "plasmid retention";

  // RETENTION NEEDS TWO MEDIA AND THE SHEET SAYS SO RATHER THAN ASSUMING ONE. Told to measure
  // retention against a single medium, the honest page is one that states the contradiction; a
  // module that silently added "+ antibiotic" would be choosing the selection for somebody.
  const mismatch = retention && media.length < 2;
  const plates = cultures * media.length;

  return {
    name: "Colony Count by Serial Dilution",
    description: retention
      ? `Plate ${cultures} culture(s) on ${media.join(" and ")} to measure what fraction still carries the plasmid.`
      : `Plate ${cultures} culture(s) on ${media.join(", ")} and count viable cells.`,
    includes: { required: [], optional: [] },
    derived: { cultures, media, dilutions: steps, plates, spot_uL: spot, retention },
    template: `
**Materials**
- ${plates} plate(s): **${media.join("**, **")}**${cultures > 1 ? `, ${media.length} per culture` : ""}
- Sterile diluent (PBS or the medium itself, without antibiotic), 900 µL per dilution step
- Microcentrifuge tubes, ${steps} per culture
${mismatch ? `
⚠️ **This sheet says retention but names only one medium (${media[0]}).** Retention is a RATIO of
a selective count over a non-selective one, so one medium cannot produce it. Either plate the
matching selective or non-selective partner, or record this as a viable count and say so.
` : ""}
**Procedure**
1. **Mix each culture thoroughly** before the first transfer. Settled cells make the whole
   series wrong by a constant factor, and nothing downstream reveals it.
2. **Serial ten-fold dilutions**, ${steps} steps: 100 µL of culture into 900 µL of diluent,
   vortex, then 100 µL of that into the next 900 µL. **A fresh tip every step** — carryover on a
   reused tip shows up as a dilution series that stops diluting.
3. Plate **${spot} µL** of each dilution onto **each** medium: ${media.join(", ")}. Spotting the
   series on one plate is fine; so is spreading a whole plate per dilution, which counts better
   at low density.
4. Dry, invert, and incubate until colonies are countable — overnight for E. coli at 37 °C.
   ${retention ? "**Give the selective plates the same time as the non-selective ones.** Counting them earlier biases the ratio down." : ""}
5. **Count the plate with between ${LOW} and ${HIGH} colonies.** Not the crowded one, not the
   nearly empty one, and do not average across dilutions. Record which dilution you counted —
   a count without its dilution factor is not a number.
6. cfu/mL = colonies ÷ (${spot} µL ÷ 1000) ÷ dilution factor.
${retention ? `
**Retention**
7. Retention = (count on ${media[1] ?? "the selective medium"}) ÷ (count on ${media[0]}), from
   plates **at the same dilution**, both in the countable range. Report it as a percentage.
8. **Read it before you interpret anything else about that culture.** A low retention means the
   population lost the plasmid, so any phenotype you measured was measured on a mixture — the
   result is about selection, not about the construct.` : ""}

**What ruins this count**
- **Counting out of range.** Under ${LOW} is noise; over ${HIGH} undercounts because colonies
  merge, and it undercounts silently.
- **A reused tip between dilution steps**, which flattens the series.
- **Letting plates dry unevenly**, so spots spread different distances and colonies touch.
`
  };
}
