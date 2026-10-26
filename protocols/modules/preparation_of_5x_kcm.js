export const inputs = [
  { name: "volume_mL", type: "number", label: "5× KCM to make (mL)", default: 100, step: 10 },
  { name: "hydrated", type: "boolean", label: "Using hydrated salts?", default: true }
];

// Per 100 mL at 5x: 0.5 M KCl, 0.15 M CaCl2, 0.25 M MgCl2.
const SALTS = [
  { name: "KCl",   M: 0.5,  hyd: ["KCl", 74.551],          anh: ["KCl", 74.551] },
  { name: "CaCl₂", M: 0.15, hyd: ["CaCl₂·2H₂O", 147.01],   anh: ["CaCl₂", 110.98] },
  { name: "MgCl₂", M: 0.25, hyd: ["MgCl₂·6H₂O", 203.30],   anh: ["MgCl₂", 95.21] }
];

export function factory(values) {
  const volume_mL = Number(values?.volume_mL ?? 100);
  const hydrated = values?.hydrated !== false;
  const L = volume_mL / 1000;

  const rows = SALTS.map((s) => {
    const [form, mw] = hydrated ? s.hyd : s.anh;
    const g = Math.round(s.M * L * mw * 100) / 100;
    return `| ${form} | **${g} g** | ${s.M} M |`;
  });

  return {
    name: "Preparation of 5× KCM",
    description: `${volume_mL} mL of 5× KCM — 0.5 M KCl, 0.15 M CaCl₂, 0.25 M MgCl₂.`,
    derived: { volume_mL, hydrated },
    template: `
| | | final, at 5× |
|---|---|---|
${rows.join("\n")}
| water | to **${volume_mL} mL** | |

1. Dissolve in roughly 0.8 volumes of water, then bring to ${volume_mL} mL.
2. Autoclave. **Unlike TSS, this one autoclaves fine** — there is no PEG or DMSO in it.
3. Store at 4 °C.

**${hydrated ? "These are the hydrated masses" : "These are the ANHYDROUS masses"}** — weighing the
${hydrated ? "hydrated" : "anhydrous"} figure out of the ${hydrated ? "anhydrous" : "hydrated"}
bottle gives the wrong molarity. Check the label.

**It goes in at 1×, and the dilution depends on the protocol.** The heat-shock transformation here
adds 25 µL of this stock to a 100 µL cell aliquot. The Berkeley page it comes from builds a 100 µL
reaction from 20 µL cells, 10 µL of 5×, 70 µL water and 1 µL DNA, and uses 15 µL into 150 µL for
ligation mixes and cotransformations. All are 1× final; what differs is how much cell suspension
is in the tube.

Recipe: \`c6-solutions "5x KCM"\`.
`
  };
}
