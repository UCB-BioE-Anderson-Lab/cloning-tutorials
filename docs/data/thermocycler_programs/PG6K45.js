/**
 * PG6K45
 *
 * PrimeSTAR GXL standard PCR program
 * Target size: ~6 kb
 * Annealing temperature: 45 C
 * Extension time: 1 min/kb
 *
 * Reference: Takara PrimeSTAR GXL manual (Standard Protocol, <=10 kb)
 *
 * GENERATED, not transcribed: every member of this family is two numbers — target size
 * and annealing temperature — and the rest follows. Writing eight of these by hand is how
 * one of them ends up with a 55 where it should have a 45.
 */

const PG6K45 = {
  name: 'PG6K45',
  polymerase: 'PrimeSTAR GXL',
  target_kb: 6,
  steps: [
    { kind: 'hold', temp_c: 98, time_s: 10 },
    {
      kind: 'cycle',
      count: 30,
      steps: [
        { kind: 'hold', temp_c: 98, time_s: 10 },
        { kind: 'hold', temp_c: 45, time_s: 15 },
        { kind: 'hold', temp_c: 68, time_s: 360 }
      ]
    },
    { kind: 'hold', temp_c: 16, time_s: 0 }
  ]
};

export default PG6K45;
