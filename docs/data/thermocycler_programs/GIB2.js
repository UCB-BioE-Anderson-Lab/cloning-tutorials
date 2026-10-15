/**
 * GIB2
 *
 * The lab's Gibson program: one hour isothermal at 50 C, then hold at 16 C.
 *
 * Conditions from JCA, 2026-10-15. Recorded here because they were recorded NOWHERE before:
 * three SynThera labpackets (SLIP4-singles, SLIP4-8, SLIP5) named GIB2 for their Gibson
 * steps and carried only the name, and on 2026-10-14 a student asked which setting to use
 * "since there is no gibson setting in the thermocyclers".
 *
 * One hour is the long form. Takara/NEB's 2X master mix protocols shorten it to 15 min for
 * 2-3 fragments; Gibson's 2009 original was 60 min at 50 C. The lab runs the original
 * length for every fragment count, which is a choice and not the vendor default —
 * protocols/modules/gibson_assembly.js is where that comparison is written down, the way
 * golden_gate_assembly.js does it for GG1.
 */

const GIB2 = {
  name: 'GIB2',
  source: 'JCA 2026-10-15',
  steps: [
    { kind: 'hold', temp_c: 50, time_s: 3600 },
    { kind: 'hold', temp_c: 16, time_s: 0 }
  ]
};

export default GIB2;
