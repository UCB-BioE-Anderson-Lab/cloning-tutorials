// plate_reader_fluorescence.js
// Read fluorescence and OD600 from cultures in a 96-well plate.

export const inputs = [
  { name: "samples", type: "number", label: "Number of cultures", default: 24, step: 1 },
  { name: "technical_replicates", type: "number", label: "Technical replicates per culture", default: 2, step: 1 },
  { name: "transfer_uL", type: "number", label: "Volume transferred per well (µL)", default: 100, step: 10 },
  { name: "instrument", type: "text", label: "Plate reader", default: "Tecan M Nano" }
];

export function factory(values = {}) {
  const samples = Math.max(1, Number(values?.samples ?? 24));
  const reps = Math.max(1, Number(values?.technical_replicates ?? 2));
  const vol = Number(values?.transfer_uL ?? 100);
  const instrument = String(values?.instrument ?? "Tecan M Nano");
  const wells = samples * reps;
  const over = wells > 96
    ? `\n> ⚠️ **${wells} wells exceeds a 96-well plate.** Reduce replicates or split across two plates.\n`
    : "";

  return {
    name: "Plate Reader: Fluorescence and OD600",
    description: `Read ${samples} cultures in ${reps} technical replicates on the ${instrument}.`,
    includes: { required: [], optional: [] },
    derived: { samples, technical_replicates: reps, wells_read: wells },
    template: `
**Plan**
- ${samples} cultures × ${reps} technical replicates = **${wells} wells** of 96.
${over}
**Procedure**
1. **Check the cultures grew and are fluorescent** before you do anything else. A well that did
   not grow is not a weak promoter, it is a failed culture, and the two look identical once the
   numbers are in a spreadsheet.
2. Turn on the **${instrument}**.
3. Using the **P200 multichannel**, transfer **${vol} µL** of each culture into a
   **black-walled 96-well plate**. Black walls stop optical crosstalk between wells.
   - Work in **columns of 8**, so each culture is drawn **${reps} times**.
   - Budget about half a box of tips.
4. **Read fluorescence.** Settings:
   - Fluorescence Top · excitation **483 nm** · emission **525 nm** · both bandwidths **20 nm**
   - Gain **40** (manual) · **20** reads · high-sensitivity flash
   - Integration **40 µs** · lag **0 µs** · Z-position **11019 µm** · target **30 °C**
   - Plate definition **COS96ft**
5. **Also read OD600** — absorbance, 20 reads. Fluorescence without OD is uninterpretable,
   because a brighter well may simply hold more cells.
6. **Save the data to the memory stick.** The instrument computer is not on the internet.
7. Shut down the instrument and the computer. **Remove your plate first.**
8. Clean up: **bleach and rinse the plate.** Either go on to miniprep, or put the culture
   block in the fridge.
`
  };
}
