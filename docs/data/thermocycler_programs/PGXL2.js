/**
 * PGXL2
 *
 * PrimeSTAR GXL, Takara's default program for targets over 10 kb. Two-step: no separate
 * annealing hold, extension doubles as anneal at 68 C.
 * Transcribed from Pimar issue #22 (PrimeStar1, JCA 2021-02-15).
 */

const PGXL2 = {
  name: 'PGXL2',
  polymerase: 'PrimeSTAR GXL',
  target_kb: 10,
  source: 'Pimar issue #22 — Takara default, 10 kb+',
  steps: [
    { kind: 'hold', temp_c: 98, time_s: 10 },
    {
      kind: 'cycle',
      count: 30,
      steps: [
        { kind: 'hold', temp_c: 98, time_s: 10 },
        { kind: 'hold', temp_c: 68, time_s: 600 }
      ]
    },
    { kind: 'hold', temp_c: 16, time_s: 0 }
  ]
};

export default PGXL2;
