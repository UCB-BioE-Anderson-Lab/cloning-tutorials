/**
 * 55
 *
 * A Taq PCR program. **The lab calls it "55" and nothing else** — JCA, 2026-10-15:
 * "The programs are called just 55, not TAQ55." The name is the annealing temperature,
 * which is the only thing that differs between the two.
 *
 * 25 x (96 C 15 s -> 55 C 15 s -> 72 C 30 s), then hold at 16 C.
 * Conditions from JCA, 2026-10-15.
 *
 * The 30 s extension puts this at roughly 1 kb of product; it is the short, routine
 * program, not a long-amplicon one. For those the lab uses PrimeSTAR GXL — see the PG*
 * and PGXL* programs beside this file.
 *
 * NAMED AS A BARE NUMBER, which JavaScript cannot use as an identifier, so the binding is
 * `P55` and the `name` field carries what the lab actually says. A labsheet writes "55".
 */

const P55 = {
  name: '55',
  polymerase: 'Taq',
  anneal_c: 55,
  source: 'JCA 2026-10-15',
  steps: [
    {
      kind: 'cycle',
      count: 25,
      steps: [
        { kind: 'hold', temp_c: 96, time_s: 15 },
        { kind: 'hold', temp_c: 55, time_s: 15 },
        { kind: 'hold', temp_c: 72, time_s: 30 }
      ]
    },
    { kind: 'hold', temp_c: 16, time_s: 0 }
  ]
};

export default P55;
