// build.mjs — render every bench cheatsheet from its protocol module.
//
//   node docs/cheatsheets/build.mjs           write the .html sheets and print them to PDF
//   node docs/cheatsheets/build.mjs --no-pdf  HTML only, skip the Chrome pass
//   node docs/cheatsheets/build.mjs --check   verify only; non-zero exit if stale
//
// The PDF is the deliverable students print. It is produced by headless Chrome from the
// same HTML the site serves, and every sheet is asserted to be exactly one Letter page —
// a sheet that grows to two pages fails the build rather than reaching the bench.
//
// Each sheet declares the module it comes from. The module's factory() runs, and the
// sheet is built from the `derived` values it returns. No volume, temperature or time
// is typed into a sheet file, so a change to a protocol changes the sheet the next time
// this runs, and --check turns silent drift into a failed build.

import { readdir, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "src");
const MODULES = join(HERE, "..", "protocols", "modules");

const CHECK = process.argv.includes("--check");
const NO_PDF = process.argv.includes("--no-pdf");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// THE QR CODE OPENS THE PROTOCOL BUILDER, NOT YOUTUBE. The builder page is the full protocol,
// adjustable, with the training video above it when one exists — so a sheet whose protocol has
// no video yet still links somewhere useful, and gains the video without being reprinted.
const BUILDER = "https://ucb-bioe-anderson-lab.github.io/cloning-tutorials/protocols/protocols/";

// segno, from the repo venv (requirements.txt). Its SVG is deterministic, so --check stays
// byte-exact.
const PYTHON = process.env.QR_PYTHON || join(HERE, "..", "..", "venv", "bin", "python");

/** An inline SVG QR code for the builder page of one protocol module. */
function qrSvg(moduleId) {
  const url = `${BUILDER}?id=${encodeURIComponent(moduleId)}&autogen=1`;
  return execFileSync(
    PYTHON,
    [
      "-c",
      "import segno,sys; print(segno.make(sys.argv[1], error='l').svg_inline(scale=1, border=0, omitsize=True), end='')",
      url
    ],
    { encoding: "utf8" }
  );
}

// The whole set as one file, for printing all of them in one go.
const ALL_PDF = "all-cheatsheets.pdf";

/** Print one sheet to PDF and return its page count. */
function toPdf(htmlPath, pdfPath) {
  const args = [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    // Google Fonts have to arrive before layout is measured, or the sheet is
    // paginated against a fallback face and the page count is meaningless.
    "--virtual-time-budget=8000",
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`
  ];
  // HEADLESS CHROME SOMETIMES NEVER EXITS. Seen 2026-10-08 on two different sheets in a row,
  // each a run that otherwise takes seconds; with no timeout the build sat for 17 minutes.
  // A print that finishes takes well under the limit, so a timeout is a hang, and one retry
  // has cleared it.
  for (let attempt = 1; ; attempt++) {
    try {
      execFileSync(CHROME, args, { stdio: "ignore", timeout: 60_000, killSignal: "SIGKILL" });
      break;
    } catch (e) {
      if (attempt >= 3) throw new Error(`Chrome did not print ${pdfPath} after ${attempt} tries`);
      console.log(`  (Chrome hung on ${pdfPath.split("/").pop()}; retrying)`);
    }
  }
  const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
  return Number(/^Pages:\s+(\d+)$/m.exec(info)?.[1] ?? 0);
}

// A fixed build date keeps rebuilds byte-identical when nothing has actually changed,
// so `git status` stays honest. Bump it when the sheets are reissued for a term.
const ISSUED = "2026-10-08";

function page(sheet, bodyHtml, moduleId) {
  // "single" is one wide column at a larger type size, for a short procedure that should
  // fill the page. Anything else is the two-column dense layout.
  const single = sheet.layout === "single";
  const wrap = single ? "rows single" : "cols";
  return `<title>${sheet.title} — BioE 140L</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans+Condensed:wght@400;600;700&display=swap">
<link rel="stylesheet" href="sheet.css">

<div class="sheet">
<header class="top">
  <h1>${sheet.title}</h1>
  <div class="qr">
    <div class="qr-text"><span class="slug">${sheet.slug}</span><span class="qr-cap">scan for the<br>full protocol</span></div>
    ${qrSvg(moduleId)}
  </div>
</header>

<div class="${wrap}">
${bodyHtml}
</div>

<footer class="foot">
  <span>BioE 140L · UC Berkeley · issued ${ISSUED}</span>
  <span class="src">protocols/modules/${moduleId}.js</span>
</footer>
</div>
`;
}

const files = (await readdir(SRC)).filter((f) => f.endsWith(".mjs")).sort();

let stale = 0;
let built = 0;
let overlong = 0;
const summary = [];
const made = [];

for (const file of files) {
  const sheet = (await import(join(SRC, file))).default;
  const mod = await import(join(MODULES, `${sheet.module}.js`));

  if (typeof mod.factory !== "function") {
    throw new Error(`${sheet.module}.js exports no factory()`);
  }
  const obj = mod.factory(sheet.values ?? {});
  const derived = obj.derived ?? {};

  const body = sheet.build(derived, obj).filter(Boolean).join("\n");
  const html = page(sheet, body, sheet.module);
  const out = join(HERE, `${sheet.slug}.html`);

  let previous = null;
  try {
    previous = await readFile(out, "utf8");
  } catch {
    /* not built yet */
  }

  if (previous === html) {
    summary.push(`  ok      ${sheet.slug}.html`);
  } else if (CHECK) {
    stale++;
    summary.push(`  STALE   ${sheet.slug}.html  (${previous === null ? "never built" : "differs from " + sheet.module + ".js"})`);
  } else {
    await writeFile(out, html, "utf8");
    built++;
    summary.push(`  written ${sheet.slug}.html  <- ${sheet.module}.js`);
  }

  made.push({ sheet, out });
}

console.log(summary.join("\n"));

if (CHECK && stale) {
  console.error(
    `\n${stale} sheet${stale > 1 ? "s are" : " is"} out of date with its protocol module.\n` +
      `Run: node docs/cheatsheets/build.mjs`
  );
  process.exit(1);
}

if (!CHECK && !NO_PDF) {
  console.log("\nprinting to PDF:");
  for (const { sheet, out } of made) {
    const pdf = join(HERE, `${sheet.slug}.pdf`);
    const pages = toPdf(out, pdf);
    const ok = pages === 1;
    if (!ok) overlong++;
    console.log(`  ${ok ? "1 page " : "**" + pages + " PAGES**"}  ${sheet.slug}.pdf`);
  }
  if (overlong) {
    console.error(
      `\n${overlong} sheet${overlong > 1 ? "s do" : " does"} not fit on one Letter page. ` +
        `Cut content or tighten docs/cheatsheets/sheet.css.`
    );
    process.exit(1);
  }

  // One file with all of them, in experiment order, for printing the whole set at once.
  // Page count must equal the sheet count — if it does not, a sheet grew silently.
  const bundle = join(HERE, ALL_PDF);
  execFileSync("pdfunite", [...made.map((m) => join(HERE, `${m.sheet.slug}.pdf`)), bundle], {
    stdio: "ignore"
  });
  const pages = Number(
    /^Pages:\s+(\d+)$/m.exec(execFileSync("pdfinfo", [bundle], { encoding: "utf8" }))?.[1] ?? 0
  );
  if (pages !== made.length) {
    console.error(`\n${ALL_PDF} has ${pages} pages, expected ${made.length}.`);
    process.exit(1);
  }
  console.log(`\n  ${pages} pages  ${ALL_PDF}  <- all sheets, in order`);
}

console.log(`\n${files.length} sheets · ${built} written · ${CHECK ? "check passed" : "done"}`);
