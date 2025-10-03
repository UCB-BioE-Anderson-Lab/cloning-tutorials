export const inputs = [
  { name: "temperature", type: "number", label: "Growth temperature (°C)", default: 37 },
  { name: "rpm", type: "number", label: "Shaking speed (rpm)", default: 220 },
  { name: "target_OD", type: "text", label: "Target OD600 for harvest", default: "0.4–0.6" },
  { name: "culture_volume", type: "number", label: "Culture volume (mL)" }
];

export function factory(values) {
  const temperature = Number(values?.temperature ?? 37);
  const rpm = Number(values?.rpm ?? 220);
  const target_OD = String(values?.target_OD ?? "0.4–0.6");
  // Prefer a parent‑provided culture volume, otherwise use explicit input, otherwise 100 mL
  const culture_volume = Number(
    values?.culture_volume ?? values?.volume_in_mL ?? values?.volume_mL ?? 100
  );

  return {
    name: "Growing Bacteria with Flasks",
    description: "Grow bacterial cultures in baffled flasks with shaking for proper aeration.",
    template: `
1. At a sterile bench with a flame, use sterile technique to dispense ${culture_volume} mL 2YT into a sterile baffled flask (or measure from a sterile graduated bottle).
2. Add the calculated volume of antibiotic (per the starter‑culture instructions or lab SOP).
3. Inoculate by pipetting in the starter culture.
4. Cover with sterile foil or a breathable filter cap to allow air exchange.
5. Place the flask securely in a shaker bracket so it cannot walk.
6. Incubate at ${temperature} °C, ${rpm} rpm.
`
  };
}
