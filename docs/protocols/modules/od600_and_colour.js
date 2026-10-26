// od600_and_colour.js
// Reading a block of cultures for GROWTH and for VISIBLE COLOUR — OD600 on the plate reader, and
// a photograph of the block and of the pellets against a fixed reference.
//
// WHY THIS IS NOT `plate_reader_fluorescence`. That module reads a fluorescent reporter, and
// most pigments are not one. A carotenoid, a chromoprotein or a pigmented pathway product is
// read by absorbance and by eye, and an assay sheet that named the fluorescence protocol for one
// of those would print an excitation and emission wavelength for a thing that does not fluoresce.
// Before this module existed, such sheets carried their conditions and NO PROCEDURE at all,
// because naming the wrong protocol was correctly judged worse than naming none.
//
// COLOUR IS A MEASUREMENT HERE, NOT AN IMPRESSION, and the fixed reference is what makes it one.
// "Redder than last time" is not comparable across a week, a camera or a person; "redder than
// tube 4 of the reference strip, photographed in the same frame" is. The reference goes IN the
// photograph rather than beside the bench, because a reference nobody can see in the image
// cannot be checked afterwards by anyone who was not there.
//
// THE PELLET IS PHOTOGRAPHED AS WELL AS THE BLOCK, and they answer different questions. The
// block says what a culture looks like at the density it reached; the pellet divides that by the
// cells, which is the difference between "more product" and "more cells". A dense pale culture
// and a thin vivid one can look identical in a block and never in a pellet.

export const inputs = [
  // NAMES MATCHED TO `plate_reader_fluorescence`, which is the sibling the planner already feeds.
  // It passes `samples` and `technical_replicates`; a module declaring `wells` and `replicates`
  // instead was handed both, declared neither, and silently rendered 24 x 2 defaults over
  // whatever the experiment actually asked for.
  { name: "samples", type: "number", label: "Number of cultures", default: 24, step: 1 },
  { name: "technical_replicates", type: "number", label: "Technical replicates per culture", default: 2, step: 1 },
  { name: "transfer_uL", type: "number", label: "Volume transferred to the read plate (µL)", default: 200, step: 10 },
  { name: "reference", type: "text", label: "What the colour is scored against", default: "" },
  { name: "pellet", type: "select", label: "Photograph pellets too", options: ["yes", "no"], default: "yes" }
];

export function factory(values = {}) {
  const wells = Math.max(1, Math.round(Number(values?.samples ?? 24)));
  const reps = Math.max(1, Math.round(Number(values?.technical_replicates ?? 2)));
  const vol = Math.max(1, Math.round(Number(values?.transfer_uL ?? 200)));
  const pellet = String(values?.pellet ?? "yes") !== "no";
  const reference = String(values?.reference ?? "").trim();
  const readWells = wells * reps;

  // A REFERENCE NOBODY NAMED IS A BLANK ON THE PAGE, not a default invented here. What a colour
  // is scored against is a fact about the experiment — a dilution strip, a previous best clone, a
  // printed card — and a module that guessed would be inventing the scale the result is read on.
  const refLine = reference
    ? `**${reference}**`
    : `**STILL TO DECIDE — nothing was named.** Put the reference in the frame and write here what it was.`;

  return {
    name: "Plate Reader: OD600 and colour",
    description: `Read ${wells} culture(s) for OD600 in ${reps} technical replicate(s), and photograph the block${pellet ? " and pellets" : ""} for colour.`,
    includes: { required: [], optional: [] },
    derived: { samples: wells, technical_replicates: reps, read_wells: readWells, transfer_uL: vol },
    template: `
**Materials**
- The culture block, straight from the incubator
- A clear flat-bottom **96-well plate** for the read
- Multichannel pipette and tips
- The colour reference: ${refLine}
- Camera or phone, and a fixed light source

**OD600**
1. **Photograph the block first, before you disturb it.** Once wells are mixed and sampled the
   settled appearance is gone, and it is often the clearest difference between cultures.
2. Resuspend each well by pipetting — cultures settle, and an unmixed well reads low and reads
   differently depending on how deep the tip went.
3. Transfer **${vol} µL** from each culture into the read plate, **${reps}** well(s) per culture
   — **${readWells}** read wells in total.
4. Include at least one well of **sterile medium alone** as the blank, from the same batch the
   cultures were grown in. A blank from a different batch is not a blank.
5. Read **OD600**. Record the plate layout with the data; a reading whose well cannot be mapped
   back to a culture is not a result.

**Colour**
6. Photograph the block **in the same frame as the reference**, under the same light each time.
   Score each culture against the reference rather than against the other cultures.
${pellet ? `7. **Pellet and photograph again.** Spin the remaining culture, pour off the supernatant and
   photograph the pellets in the same frame as the reference. The pellet is colour per cell; the
   block is colour per volume, and they differ whenever growth differs.
8. Keep both images with the OD600 data. Note the light source and the camera.` : `7. Keep the image with the OD600 data. Note the light source and the camera.`}

**What ruins this read**
- **Evaporation.** A block that lost volume reads high for density and strong for colour, and
  both are artefacts. Note any well that is visibly down on the others before you sample it.
- **Scoring colour against neighbours instead of the reference.** It makes a plate internally
  consistent and incomparable with every other plate, including the one you ran last week.
- **A blank from a different medium batch**, which quietly shifts every OD on the plate.
`
  };
}
