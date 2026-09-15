// check_numbers.mjs — find numbers typed into cheatsheet prose instead of read from the module.
//
//   node docs/cheatsheets/check_numbers.mjs
//
// This exists because `build.mjs --check` cannot catch this class of bug. --check compares
// rendered output against the sources, so a number hardcoded in a sheet is perfectly
// self-consistent; it only catches values that actually flow from the module. The PCR sheet
// said "5 or more reactions" for days after the rule became ">= 4", and --check passed the
// whole time.
//
// It is a triage aid, not a gate: it reports every numeric literal and leaves the judgement
// to you. Expect false positives — a "3" in "2/3-3/4 down the gel" will match any module
// value that happens to be 3.
//
// Two findings, different severity:
//   DUPLICATED — the literal also exists in the module's `derived`. This is the "5 or more
//                reactions" bug: change the module and the sheet silently disagrees.
//   SHEET-ONLY — the literal is nowhere in `derived`. The sheet is the only place that
//                number lives, so it cannot drift against the module, but it also is not
//                covered by the single-source rule and the protocol builder never sees it.

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "src");
const MODULES = join(HERE, "..", "protocols", "modules");

/** Every number reachable in a derived object, flattened. */
function numbersIn(v, out = new Set()) {
  if (typeof v === "number" && Number.isFinite(v)) out.add(v);
  else if (Array.isArray(v)) v.forEach((x) => numbersIn(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => numbersIn(x, out));
  return out;
}

/**
 * Authored string content with `${...}` spans removed — what is left is text a human typed,
 * so any number in it was typed rather than interpolated.
 */
function authoredText(src) {
  const chunks = [];
  // template literals and quoted strings
  const re = /`([^`\\]|\\.)*`|"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g;
  for (const m of src.matchAll(re)) {
    let s = m[0].slice(1, -1);
    // drop interpolations — those are bindings, which is the thing we want
    s = s.replace(/\$\{[^}]*\}/g, " ⟦binding⟧ ");
    chunks.push(s);
  }
  return chunks.join("\n");
}

const files = (await readdir(SRC)).filter((f) => f.endsWith(".mjs")).sort();
let dup = 0;
let only = 0;

for (const f of files) {
  const src = await readFile(join(SRC, f), "utf8");
  const slug = /slug:\s*"([^"]+)"/.exec(src)?.[1] ?? f;
  const modId = /module:\s*"([^"]+)"/.exec(src)?.[1];
  const values = /values:\s*(\{[^}]*\})/s.exec(src)?.[1] ?? "{}";

  const mod = await import(join(MODULES, `${modId}.js`));
  // eslint-disable-next-line no-eval
  const derived = mod.factory(eval(`(${values})`)).derived ?? {};
  const known = numbersIn(derived);

  const text = authoredText(src);
  const hits = [];
  // numbers in authored text, skipping HTML/entity noise
  for (const m of text.matchAll(/(?<![\w#&;.-])(\d+(?:\.\d+)?)(?![\w;])/g)) {
    const n = Number(m[1]);
    const line = text.slice(0, m.index).split("\n").length;
    const ctx = text.split("\n")[line - 1].trim().slice(0, 95);
    hits.push({ n, ctx });
  }

  const dupes = hits.filter((h) => known.has(h.n));
  const singles = hits.filter((h) => !known.has(h.n));

  if (dupes.length || singles.length) {
    console.log(`\n=== ${slug}  (${modId})`);
    for (const h of dupes) {
      dup++;
      console.log(`  DUPLICATED  ${h.n}   ${h.ctx}`);
    }
    for (const h of singles) {
      only++;
      console.log(`  sheet-only  ${h.n}   ${h.ctx}`);
    }
  }
}

console.log(`\n${dup} duplicated (in derived AND typed), ${only} sheet-only.`);
