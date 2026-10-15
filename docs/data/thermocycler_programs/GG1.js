/**
 * GG1
 *
 * The Golden Gate program loaded on the lab's thermocyclers.
 *
 * MOVED HERE from src/labplanner/protocols/modules/golden_gate_assembly.js, which held it
 * as a bare {cycles, cut_min, lig_min, step45_min, step80_min} object. That file carries a
 * comment recording that `docs/wetlab/assembly.md` describes a THIRD version of this
 * program — extended 37 C then 65 C — "that matches neither, and is wrong". One program,
 * three homes, two of them disagreeing. This is the home.
 */

const GG1 = {
  name: 'GG1',
  enzyme_class: 'Type IIS',
  source: 'protocols/modules/golden_gate_assembly.js, 2026',
  steps: [
    {
      kind: 'cycle',
      count: 25,
      steps: [
        { kind: 'hold', temp_c: 37, time_s: 120 },
        { kind: 'hold', temp_c: 16, time_s: 300 }
      ]
    },
    { kind: 'hold', temp_c: 45, time_s: 600 },
    { kind: 'hold', temp_c: 80, time_s: 600 },
    { kind: 'hold', temp_c: 16, time_s: 0 }
  ]
};

export default GG1;
