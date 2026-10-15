/**
 * PGXL1
 *
 * PrimeSTAR GXL, Takara's default program for targets under 10 kb.
 * Transcribed from Pimar issue #22 (PrimeStar1, JCA 2021-02-15), which records the
 * four programs tested when the lab adopted this polymerase for long backbone PCRs.
 */

const PGXL1 = {
  name: 'PGXL1',
  polymerase: 'PrimeSTAR GXL',
  target_kb: 10,
  source: 'Pimar issue #22 — Takara default, <10 kb',
  steps: [
    { kind: 'hold', temp_c: 98, time_s: 10 },
    {
      kind: 'cycle',
      count: 30,
      steps: [
        { kind: 'hold', temp_c: 98, time_s: 10 },
        { kind: 'hold', temp_c: 55, time_s: 15 },
        { kind: 'hold', temp_c: 68, time_s: 360 }
      ]
    },
    { kind: 'hold', temp_c: 16, time_s: 0 }
  ]
};

export default PGXL1;
