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
**Fill the plate**
1. **Check the cultures grew and are fluorescent** before you do anything else. A well that did
   not grow is not a weak promoter, it is a failed culture, and the two look identical once the
   numbers are in a spreadsheet. Leave out any culture that did not grow.
2. Using the **P200 multichannel**, transfer **${vol} µL** of each culture into a
   **black-walled, clear-bottom 96-well plate**. Black walls stop optical crosstalk between wells.
   A fully clear plate works, but reads worse.
   - Work in **columns of 8**, so each culture is drawn **${reps} times**.
   - Check every tip is seated, pipette up and down to resuspend, and check each tip filled with
     no air gaps before you dispense.
   - **Pipette accurately.** The signal is proportional to the volume in the well.

**Start the instrument** — in this order, from everything off
3. Turn on the **computer** (button in the corner) and let it boot. Ask a supervisor for the PIN.
4. Turn on the **${instrument}**: the toggle switch is **on the back**. The green light comes on.
5. Open **iControl** (the desktop icon) and let it **connect**: choose **Infinite 200 Pro** and
   click OK. Connecting always takes a while.
   - **If it will not connect, start again from everything off.** Close iControl (Task Manager →
     End Task if it hangs), switch off the instrument, shut down the computer, then repeat steps
     3–5 in order: computer, then instrument, then iControl.

**Set up the read**
6. Click **Default script**.
7. Select the **wells you filled**, and only those.
8. Add an **Absorbance** step: wavelength **600 nm**.
9. Add a **Fluorescence Intensity** step: excitation **483 nm**, emission **525 nm**, gain **40**.
   - Leave every other setting at its default.
   - A well that reads **OVER** is out of range: lower the gain. Weak numbers: raise it.
10. Open the tray (the button in iControl, or the button on the corner of the instrument) and seat
    the plate **in the slot**, **A1 at the top left**. Close it the same way.
    **Never push or pull the door by hand** — it is motorised, and forcing it breaks it.
11. Click **Start**.

**Save and shut down**
12. The results open in **Excel**, absorbance and fluorescence on separate sheets. If Excel asks
    you to sign in, try your CalNet credentials.
13. **File → Save As** to the desktop, with a name that says what the experiment is. Copy the file
    to a USB stick or email it to yourself.
14. **Take your plate out**, and close the tray.
15. Close Excel. Quit iControl: **yes** to disconnect, **no** to saving the script.
16. Shut down the computer, then switch off the instrument at the back.
17. Clean up: **bleach and rinse the plate.** Either go on to miniprep, or put the culture
    block in the fridge.
`
  };
}
