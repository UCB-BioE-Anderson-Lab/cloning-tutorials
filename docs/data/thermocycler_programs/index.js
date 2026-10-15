/**
 * Every thermocycler program the lab runs, by name.
 *
 * **This directory existed with one file in it and nothing imported it.** `PG4K55.js` was
 * written, and then eight months of labsheets named PG6K55 (13 times), PG8K55 (5), GIB2 (3)
 * and PG6K45 (2) — none of which were defined, and none of which anything checked. A
 * labsheet could name a program that did not exist and nothing noticed until a student stood
 * at a thermocycler that had no such setting. That is what this index and `validate` are for.
 */

import PG2K45 from './PG2K45.js';
import PG2K55 from './PG2K55.js';
import PG4K45 from './PG4K45.js';
import PG4K55 from './PG4K55.js';
import PG6K45 from './PG6K45.js';
import PG6K55 from './PG6K55.js';
import PG8K45 from './PG8K45.js';
import PG8K55 from './PG8K55.js';
import PGXL1 from './PGXL1.js';
import PGXL2 from './PGXL2.js';
import PGXL3 from './PGXL3.js';
import PGXL4 from './PGXL4.js';
import GG1 from './GG1.js';
import GIB2 from './GIB2.js';
import P45 from './45.js';
import P55 from './55.js';

export const PROGRAMS = {
  PG2K45, PG2K55, PG4K45, PG4K55, PG6K45, PG6K55, PG8K45, PG8K55,
  PGXL1, PGXL2, PGXL3, PGXL4,
  GG1, GIB2,
  // KEYED BY WHAT A LABSHEET WRITES, which for the two Taq programs is a bare
  // number. JCA 2026-10-15: "The programs are called just 55, not TAQ55." The JS
  // bindings are P45/P55 because an identifier cannot begin with a digit; the KEYS
  // are the real names, so a lookup for 'TAQ55' misses — which is right, nothing
  // is called that.
  '45': P45,
  '55': P55
};

/** A program by name, or undefined. Names are case-sensitive, as the labsheets write them. */
export function program(name) {
  return PROGRAMS[name];
}

/**
 * Total run time in seconds, or null when it cannot be known.
 *
 * NULL IS NOT ZERO. An incomplete program has no duration, and returning 0 would schedule a
 * three-hour PCR as instantaneous — the scheduler would then promise a student a slot that
 * cannot exist. A terminal hold (`time_s: 0`) runs until somebody opens the lid and is
 * deliberately not counted; it is the one zero that means zero.
 */
export function runtimeSeconds(name) {
  const p = program(name);
  if (!p || p.incomplete || !p.steps) return null;
  const sum = (steps) => {
    let t = 0;
    for (const s of steps) {
      if (s.kind === 'cycle') {
        const inner = sum(s.steps);
        if (inner === null) return null;
        t += inner * s.count;
      } else {
        if (s.time_s === null) return null;
        t += s.time_s;
      }
    }
    return t;
  };
  return sum(p.steps);
}

export default PROGRAMS;
