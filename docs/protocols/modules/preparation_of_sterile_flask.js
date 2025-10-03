export const inputs = [
  { name: "volume_mL", type: "number", label: "Target culture volume (mL)", default: 100, step: 1 }
];

export function factory(values) {
  const vol = Number(values?.volume_mL ?? values?.volume_in_mL ?? 100);

  // Recommend flask size based on ~1/2 fill rule
  const sizes = [125, 250, 500, 1000, 2000, 4000]; // common Erlenmeyer sizes (mL)
  const needed = vol * 2; // flask capacity ≥ 2× culture volume
  const chosen = sizes.find(s => s >= needed) || Math.ceil(needed / 250) * 250;
  const flaskSize = `${chosen} mL`;

  return {
    name: "Preparation of Sterile Culture Flask",
    description: "Prepare a sterile baffled flask of appropriate size for aerated culture growth (fill ≤ ~50% of flask capacity).",
    template: `
1. Select a clean, baffled Erlenmeyer flask (recommended size: ${flaskSize} for ${vol} mL culture; ~50% fill; fill ≤ 1/2 flask volume).
2. Wash and rinse the flask thoroughly if dirty. Inspect for chips or cracks.
3. Loosen the filtered screw cap if present; otherwise, cover the opening with foil.
4. Sterilize the flask in a pressure cooker at high pressure for 20 minutes.
5. Allow the flask to cool before use, keeping it covered throughout.
`
  };
}
