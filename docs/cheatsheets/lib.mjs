// lib.mjs — helpers for authoring a cheatsheet.
//
// A sheet is a projection of a protocol module. Sheet files hold the terse bench
// phrasing; every number comes in through the module's `derived` object and is
// never retyped here. build.mjs --check enforces that.
//
// Strings passed to these helpers are authored HTML, so <b> and <code> are yours
// to use. Anything interpolated from a module goes through num() or txt().

export const V = (x, unit = "µL") => `${x} ${unit}`;

/** A number from a module, or a rule to write on if it was never measured. */
export function num(x, unit = "") {
  if (x === null || x === undefined || x === "") return `<span class="blank"></span>${unit ? " " + unit : ""}`;
  return unit ? `${x} ${unit}` : String(x);
}

export const txt = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A titled block. Blocks never split across a column or page break. */
export const blk = (heading, ...body) =>
  `<section class="blk"><h2>${heading}</h2>${body.filter(Boolean).join("")}</section>`;

export const p = (html) => `<p>${html}</p>`;

export const steps = (items) =>
  `<ol class="steps">${items.filter(Boolean).map((i) => `<li>${i}</li>`).join("")}</ol>`;

export const bullets = (items) =>
  `<ul class="bul">${items.filter(Boolean).map((i) => `<li>${i}</li>`).join("")}</ul>`;

/**
 * A reagent recipe. Rows are [volume, reagent]; pass { total } for a summed rule.
 * The volume column is monospace and right-aligned so the numbers stack.
 */
export function rx(rows, opts = {}) {
  const body = rows
    .filter(Boolean)
    .map(([v, name]) => `<tr><td class="v">${v}</td><td>${name}</td></tr>`)
    .join("");
  const total = opts.total
    ? `<tr class="tot"><td class="v">${opts.total}</td><td>${opts.totalLabel || "total"}</td></tr>`
    : "";
  return `<table class="rx">${body}${total}</table>`;
}

/** A thermocycler program or other stepped machine setting. */
export function prog(lines) {
  return `<div class="prog">${lines
    .filter(Boolean)
    .map((l) => (typeof l === "string" ? `<div>${l}</div>` : `<div class="rep">${l.rep}</div>`))
    .join("")}</div>`;
}

/** A caveat. Marked by a rule and a bold lead-in so it survives a mono printer. */
export const flag = (lead, rest) => `<p class="flag"><b>${lead}</b> ${rest}</p>`;
