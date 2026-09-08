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

/**
 * A to-scale timeline, drawn as SVG.
 *
 * `total` is the length of the session in minutes and sets the scale — every bar and tick
 * is positioned by its real time, so the picture tells you honestly how long you are
 * standing there.
 *
 * `prep` lanes are the things that have to be started early and run concurrently. A lane
 * with `gate` draws a dependency tick where the thing it blocks can finally begin.
 *
 * `waits` are blocks under the main line, `events` are ticks above it.
 *
 * `blowout` names a time range that is too short to label at the session scale — the
 * transformation's 30 s and 90 s steps are under a millimetre wide next to a 10 minute
 * hold. That range is bracketed and redrawn below at its own scale, which keeps the whole
 * drawing to scale rather than quietly fudging the short steps wider.
 */
export function scaleTimeline(spec) {
  const W = 1000;
  const PAD = 8;
  // A tail is something so much longer than the session that including it to scale would
  // squash everything else to nothing — an overnight incubation against 30 minutes of
  // bench work. The axis stops, a break mark says so, and the tail is drawn after it.
  const TAIL = spec.tail ? 0.15 : 0;
  const inner = (W - PAD * 2) * (1 - TAIL);

  const laneH = 30;
  const lanesH = spec.prep.length * laneH;
  const mainY = lanesH + 44;
  // The bracket has to clear the main track's own labels (which run to mainY+49),
  // or the leader lines strike straight through them.
  const brack = mainY + 58;
  const blowTop = brack + 26;
  const blowY = blowTop + 34;
  const H = spec.blowout ? blowY + 60 : mainY + 56;

  const x = (t) => PAD + (t / spec.total) * inner;

  const hatch = `<pattern id="hx" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <rect width="7" height="7" fill="#fff"/><rect width="3.2" height="7" fill="currentColor"/></pattern>`;

  const out = [];
  // Dependency droplines are collected and drawn after every lane, so a line from an
  // upper lane is not buried under a lower lane's bar. Each gets a white casing so it
  // reads cleanly where it crosses one.
  const gates = [];

  // Prep lanes: hatched because "until it is ready" is not a fixed duration.
  spec.prep.forEach((p, i) => {
    const y = 6 + i * laneH;
    const x0 = x(p.from);
    const x1 = x(p.to);
    // A halo is not enough over a dense hatch, so the label sits on a solid plate.
    // Width is estimated from the character count; these labels are short and fixed.
    const lw = p.label.length * 7.9 + 12;
    out.push(
      `<rect x="${x0.toFixed(1)}" y="${y}" width="${(x1 - x0).toFixed(1)}" height="14" fill="url(#hx)" stroke="currentColor" stroke-width="1"/>`,
      `<rect x="${(x0 + 3).toFixed(1)}" y="${y + 0.8}" width="${lw.toFixed(1)}" height="12.4" fill="#fff"/>`,
      `<text x="${(x0 + 8).toFixed(1)}" y="${y + 11}" font-size="15.5" font-weight="700">${p.label}</text>`
    );
    // The dependency: a dropline to the point on the main track this unblocks. When the
    // thing finishes well before it is needed — plates are warm long before you plate —
    // a dotted run carries it along to that point, rather than the line appearing to
    // start in empty space.
    if (p.gate !== undefined) {
      const gx = x(p.gate);
      const carry = gx > x1 + 2 ? `M${x1.toFixed(1)} ${y + 7} H ${gx.toFixed(1)} ` : "";
      gates.push(
        `<path d="${carry}M${gx.toFixed(1)} ${y + 7} V ${mainY - 9}" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/>`,
        `<path d="M${(gx - 4).toFixed(1)} ${mainY - 9} L${gx.toFixed(1)} ${mainY - 2} L${(gx + 4).toFixed(1)} ${mainY - 9} Z" fill="currentColor"/>`
      );
    }
  });

  // Behind the lanes, so a line crossing a lower bar passes under it instead of
  // cutting a white gap through that bar's label.
  out.unshift(...gates);

  // Main track. It stops where the timed session ends; a tail, if any, is drawn past a break.
  const axisEnd = spec.tail ? PAD + inner : W - PAD;
  out.push(
    `<line x1="${PAD}" y1="${mainY}" x2="${axisEnd.toFixed(1)}" y2="${mainY}" stroke="currentColor" stroke-width="2"/>`
  );

  if (spec.tail) {
    const bx = axisEnd + 10;
    const tx0 = axisEnd + 26;
    out.push(
      // break mark: the axis is cut here, the tail is not to scale
      `<path d="M${bx} ${mainY - 9} l7 18 M${bx + 8} ${mainY - 9} l7 18" stroke="currentColor" stroke-width="1.6" fill="none"/>`,
      `<line x1="${tx0}" y1="${mainY}" x2="${W - PAD}" y2="${mainY}" stroke="currentColor" stroke-width="2"/>`,
      `<rect x="${tx0}" y="${mainY}" width="${(W - PAD - tx0).toFixed(1)}" height="13" fill="url(#hx)" stroke="currentColor" stroke-width="1"/>`,
      `<text x="${((tx0 + W - PAD) / 2).toFixed(1)}" y="${mainY + 32}" font-size="19" font-weight="700" text-anchor="middle">${spec.tail.label}</text>`,
      spec.tail.sub
        ? `<text x="${((tx0 + W - PAD) / 2).toFixed(1)}" y="${mainY + 49}" font-size="16" text-anchor="middle">${spec.tail.sub}</text>`
        : ""
    );
  }

  for (const w of spec.waits) {
    const x0 = x(w.from);
    const wd = Math.max(1.2, x(w.to) - x0);
    out.push(
      `<rect x="${x0.toFixed(1)}" y="${mainY}" width="${wd.toFixed(1)}" height="13" ${
        w.variable ? `fill="url(#hx)" stroke="currentColor" stroke-width="1"` : `fill="currentColor"`
      }/>`
    );
    if (w.label) {
      const cx = x0 + wd / 2;
      out.push(
        `<text x="${cx.toFixed(1)}" y="${mainY + 32}" font-size="19" font-weight="700" text-anchor="middle">${w.label}</text>`
      );
      if (w.sub) {
        out.push(
          `<text x="${cx.toFixed(1)}" y="${mainY + 49}" font-size="16" text-anchor="middle">${w.sub}</text>`
        );
      }
    }
  }

  // Event labels are nudged clear of the tick. A dependency dropline lands on the same x,
  // and a label anchored exactly there gets a dashed line and an arrowhead through it.
  for (const e of spec.events) {
    const ex = x(e.at);
    const anchor = e.anchor || "middle";
    const off = anchor === "start" ? 9 : anchor === "end" ? -9 : 0;
    out.push(
      `<line x1="${ex.toFixed(1)}" y1="${mainY - 7}" x2="${ex.toFixed(1)}" y2="${mainY}" stroke="currentColor" stroke-width="2"/>`,
      `<text x="${(ex + off).toFixed(1)}" y="${mainY - 12}" font-size="17" text-anchor="${anchor}">${e.label}</text>`
    );
  }

  // Blow-out: bracket the short range and redraw it at its own scale.
  if (spec.blowout) {
    const b = spec.blowout;
    const bx0 = x(b.from);
    const bx1 = x(b.to);
    const span = b.to - b.from;
    // The blow-out gets its own axis across the full width, at its own scale.
    const bInner = W - PAD * 2;
    const bx = (t) => PAD + ((t - b.from) / span) * bInner;

    // The callout reads as an inset: a grey wedge fanning out of the bracketed range
    // into a grey panel holding the expanded track.
    out.unshift(
      `<path d="M${bx0.toFixed(1)} ${brack} L${bx1.toFixed(1)} ${brack} L${W - PAD} ${blowTop} L${PAD} ${blowTop} Z" fill="#e9ecef"/>`,
      `<rect x="${PAD}" y="${blowTop}" width="${(W - PAD * 2).toFixed(1)}" height="${(H - 4 - blowTop).toFixed(1)}" fill="#e9ecef" rx="3"/>`
    );
    out.push(
      `<path d="M${bx0.toFixed(1)} ${brack - 7} L${bx0.toFixed(1)} ${brack} L${bx1.toFixed(1)} ${brack} L${bx1.toFixed(1)} ${brack - 7}" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
      `<line x1="${PAD}" y1="${blowY}" x2="${W - PAD}" y2="${blowY}" stroke="currentColor" stroke-width="2"/>`
    );

    for (const w of b.waits) {
      const x0 = bx(w.from);
      const wd = Math.max(1.2, bx(w.to) - x0);
      out.push(
        `<rect x="${x0.toFixed(1)}" y="${blowY}" width="${wd.toFixed(1)}" height="13" fill="currentColor"/>`
      );
      const cx = x0 + wd / 2;
      out.push(
        `<text x="${cx.toFixed(1)}" y="${blowY + 32}" font-size="19" font-weight="700" text-anchor="middle">${w.label}</text>`
      );
      if (w.sub) {
        out.push(
          `<text x="${cx.toFixed(1)}" y="${blowY + 49}" font-size="16" text-anchor="middle">${w.sub}</text>`
        );
      }
    }
    for (const e of b.events) {
      const ex = bx(e.at);
      out.push(
        `<line x1="${ex.toFixed(1)}" y1="${blowY - 7}" x2="${ex.toFixed(1)}" y2="${blowY}" stroke="currentColor" stroke-width="2"/>`,
        `<text x="${ex.toFixed(1)}" y="${blowY - 12}" font-size="17" text-anchor="${e.anchor || "middle"}">${e.label}</text>`
      );
    }
  }

  return `<div class="tl"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${spec.alt}">
<defs>${hatch}</defs>
${out.join("\n")}
</svg></div>`;
}

/**
 * A timeline strip: what you do above the line, what you wait for below it.
 *
 * Segments are `{ do: "label" }` for something you actively do, or
 * `{ wait: "label", t: "10 min", min: <minutes> }` for something you wait through.
 * Segment width comes from `min` on a log scale — a protocol here spans 30 s to
 * overnight, and on a linear scale everything before the incubation collapses to a
 * hairline. Log keeps the short steps legible while still reading as "this one is
 * much longer".
 *
 * `background` items are things running concurrently the whole time, shown as a band
 * above the strip. Pass `variable: true` on a segment whose duration is not fixed;
 * it renders with a ~ and a dashed edge.
 */
export function timeline(segments, opts = {}) {
  const weight = (s) => {
    if (!s.min) return 1;
    // log scale, floored so a 30 s step is still a visible slice
    return Math.max(1, Math.round(10 * Math.log10(1 + s.min * 6)) / 10 + 0.6);
  };

  const band = opts.background
    ? `<div class="tl-bg"><span class="tl-bg-k">meanwhile</span> ${opts.background}</div>`
    : "";

  const cells = segments
    .map((s) => {
      const isWait = !!s.wait;
      const cls = ["tl-seg", isWait ? "tl-w" : "tl-d", s.variable ? "tl-var" : ""]
        .filter(Boolean)
        .join(" ");
      const top = isWait ? "" : `<span class="tl-lab">${s.do}</span>`;
      const bot = isWait
        ? `<span class="tl-lab"><b>${s.t}</b>${s.wait === true ? "" : `<br>${s.wait}`}</span>`
        : "";
      return `<div class="${cls}" style="flex-grow:${weight(s)}">
  <div class="tl-top">${top}</div>
  <div class="tl-mid"><i></i></div>
  <div class="tl-bot">${bot}</div>
</div>`;
    })
    .join("");

  return `<div class="tl">${band}<div class="tl-track">${cells}</div></div>`;
}
