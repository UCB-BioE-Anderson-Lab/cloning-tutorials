// preparation_of_gel_loading_dye.js
// How the three tubes behind an analytical gel get made: BLUE JUICE (keeps), the 10% DNA dye
// (keeps), and LOAD, the mix of the two that the gel protocol actually uses (does not keep).
//
// Source: JCA, 2026-10-28, by email. The stain is Biotium GelGreen, the 10,000x concentrate in
// WATER (biotium.com/product/gelgreen-nucleic-acid-gel-stain), and the 10% dye is diluted in
// water, not DMSO (JCA, 2026-10-28: "It's the gelgreen in water. The answer is water. We aren't
// using dmso."). The first version of this module guessed SYBR Safe in DMSO from the chemicals
// list; that was wrong.
//
// The LOAD figures (100 µL + 1 µL, fresh within 2 days) are the same ones analytical_gel uses.

const DILUENT = "water";

const LOAD = { blue_juice_uL: 100, dye_uL: 1, fresh_days: 2 };

export const inputs = [
  { name: "volume_mL", type: "number", label: "Blue juice to make (mL)", default: 50, step: 5 }
];

export function factory(values) {
  const volume_mL = Number(values?.volume_mL ?? 50);
  const f = volume_mL / 50;
  const round = (x) => Math.round(x * 100) / 100;
  const glycerol_mL = round(5 * f);
  const glycerol_g = round(6.3 * f);
  const tae_mL = round(1 * f);
  const bbxc_uL = round(100 * f);

  return {
    name: "Preparation of Blue Juice, DNA Dye and LOAD",
    description: `${volume_mL} mL of blue juice gel loading buffer, the 10% DNA dye, and LOAD made from the two.`,
    includes: { required: [], optional: [] },
    derived: { volume_mL, glycerol_mL, tae_mL, bbxc_uL, diluent: DILUENT },
    template: `
**What these are**
- **Blue juice** is the loading buffer: 1× TAE, 10% glycerol, and the bromophenol blue / xylene
  cyanol dye mix. The glycerol sinks the sample into the well; the blue dyes show how far the gel has run.
- **10% DNA dye** is the commercial gel stain (**Biotium GelGreen**, 10,000× in water) diluted one in ten in water.
- **LOAD** is blue juice with the DNA dye in it. It is what the analytical gel protocol uses, and
  it is the only one of the three that goes off.

**1. Blue juice** *(${volume_mL} mL — keeps at room temperature)*

| | | final |
|---|---|---|
| glycerol (100%) | **${glycerol_mL} mL** (weigh **${glycerol_g} g**) | 10% |
| 50× TAE | **${tae_mL} mL** | 1× |
| bb/xc dye mix | **${bbxc_uL} µL** | |
| water | to **${volume_mL} mL** | |

1. Weigh the glycerol into a 50 mL conical. It is too viscous to pipette accurately; weighing is faster.
2. Add the 50× TAE and the bb/xc dye mix.
3. Bring to ${volume_mL} mL with water, cap, and invert until no glycerol streaks remain.
4. Label **BLUE JUICE** with the date and your initials.

**2. 10% DNA dye** *(100 µL — keeps; store dark)*

5. In a brown or foil-wrapped Eppendorf tube, add **90 µL ${DILUENT}**.
6. Add **10 µL GelGreen** (10,000× in water). Mix and quick spin.
7. Label **10% DNA DYE** with the date. Store in the dark at room temperature.

**3. LOAD** *(make as needed — use within ${LOAD.fresh_days} days)*

8. In an Eppendorf tube, mix **${LOAD.blue_juice_uL} µL blue juice + ${LOAD.dye_uL} µL 10% DNA dye**.
9. Label **LOAD** with the date.

**Notes**
- **LOAD does not keep.** The lab remakes it within ${LOAD.fresh_days} days, and a stale LOAD gives a gel with no bands — which looks exactly like a failed PCR. If in
  doubt, remake it; it is two pipetting steps.
- Blue juice and the 10% dye are made separately for exactly that reason: both keep, so they can be
  made in bulk, and only the 101 µL of LOAD is ever thrown away.
- GelGreen is the **in-water** format, not the in-DMSO one Biotium also sells; dilute it in water.
- GelGreen is far less hazardous than ethidium bromide, but it binds DNA. Wear gloves. It images on
  the blue-light box.

Recipe: \`c6-solutions "blue juice"\`.
`
  };
}
