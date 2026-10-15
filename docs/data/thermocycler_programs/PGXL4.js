/**
 * PGXL4
 *
 * Two annealing cycles to establish the product, then 28 two-step cycles. The one that
 * worked: Pimar issue #22, JCA on the comparison gel — "Looked amazing!" — and the
 * follow-up 2-fragment Golden Gate assembled cleanly from the GXL4 product.
 *
 * Transcribed from Pimar issue #22 (PrimeStar1, JCA 2021-02-15).
 */

const PGXL4 = {
  name: 'PGXL4',
  polymerase: 'PrimeSTAR GXL',
  target_kb: 10,
  source: 'Pimar issue #22 — the program the comparison selected',
  steps: [
    { kind: 'hold', temp_c: 98, time_s: 10 },
    {
      kind: 'cycle',
      count: 2,
      steps: [
        { kind: 'hold', temp_c: 98, time_s: 10 },
        { kind: 'hold', temp_c: 55, time_s: 15 },
        { kind: 'hold', temp_c: 68, time_s: 600 }
      ]
    },
    {
      kind: 'cycle',
      count: 28,
      steps: [
        { kind: 'hold', temp_c: 98, time_s: 10 },
        { kind: 'hold', temp_c: 68, time_s: 600 }
      ]
    },
    { kind: 'hold', temp_c: 16, time_s: 0 }
  ]
};

export default PGXL4;
