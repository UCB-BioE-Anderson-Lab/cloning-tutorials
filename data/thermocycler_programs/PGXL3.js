/**
 * PGXL3
 *
 * A hybrid of PGXL1 and PGXL2: PGXL1's three-step cycling with PGXL2's 10 min extension.
 * Transcribed from Pimar issue #22 (PrimeStar1, JCA 2021-02-15).
 */

const PGXL3 = {
  name: 'PGXL3',
  polymerase: 'PrimeSTAR GXL',
  target_kb: 10,
  source: 'Pimar issue #22 — hybrid, tested on a ~9 kb IPCR',
  steps: [
    { kind: 'hold', temp_c: 98, time_s: 10 },
    {
      kind: 'cycle',
      count: 30,
      steps: [
        { kind: 'hold', temp_c: 98, time_s: 10 },
        { kind: 'hold', temp_c: 55, time_s: 15 },
        { kind: 'hold', temp_c: 68, time_s: 600 }
      ]
    },
    { kind: 'hold', temp_c: 16, time_s: 0 }
  ]
};

export default PGXL3;
