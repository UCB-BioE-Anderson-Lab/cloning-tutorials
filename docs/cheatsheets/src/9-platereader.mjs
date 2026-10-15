import { blk, steps, bullets, flag } from "../lib.mjs";

export default {
  slug: "platereader",
  title: "Tecan M Nano: Fluorescence + OD600",
  module: "plate_reader_fluorescence",
  layout: "single",
  values: {},

  // The start-up order is the sheet's reason to exist. On the filmed run the reader would not
  // connect until everything was switched off and brought up computer → instrument → iControl.
  build(d) {
    return [
      blk(
        "Protocol",
        steps([
          `<b>Fill the plate.</b> P200 multichannel, <b>${d.transfer_uL} µL</b> per well into a <b>black-walled, clear-bottom 96-well plate</b>. Each culture <b>${d.technical_replicates}×</b>. Skip any culture that did not grow.` +
            bullets([
              "Tips all seated, pipette up and down to resuspend, no air gaps. <b>Volume sets the signal</b> — pipette accurately."
            ]),

          "<b>Start up, in this order, from everything off:</b> the <b>computer</b> (PIN from a supervisor), then the <b>instrument</b> (toggle <b>on the back</b>), then <b>iControl</b>.",

          "<b>Connect:</b> choose <b>Infinite 200 Pro</b>, OK. It always takes a while." +
            bullets([
              "<b>Will not connect?</b> End iControl (Task Manager if it hangs), switch everything off, and start again <b>in the same order</b>."
            ]),

          "<b>Default script.</b> Select only the <b>wells you filled</b>.",

          `Add <b>Absorbance</b>: <b>${d.abs_nm} nm</b>. Add <b>Fluorescence Intensity</b>: ex <b>${d.ex_nm} nm</b>, em <b>${d.em_nm} nm</b>, gain <b>${d.gain}</b>. <b>Leave everything else at its default.</b>`,

          "Open the tray (iControl or the corner button). Plate <b>in the slot</b>, <b>A1 top left</b>. Close the same way. <b>Never push or pull the door by hand.</b>",

          "<b>Start.</b> Results open in <b>Excel</b>, absorbance and fluorescence on separate sheets. <b>File → Save As</b> to the desktop with a real name, then USB stick or email.",

          "<b>Plate out first</b>, close the tray. Quit Excel; quit iControl — <b>yes</b> disconnect, <b>no</b> save script. Shut down the computer, <b>then</b> the instrument.",

          "Bleach and rinse the plate."
        ]),
        flag("Reads OVER?", "Out of range — lower the gain and read again. Numbers weak — raise it.")
      )
    ];
  }
};
