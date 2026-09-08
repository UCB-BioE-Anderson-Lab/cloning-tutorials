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

/** Print one sheet to PDF and return its page count. */
function toPdf(htmlPath, pdfPath) {
  execFileSync(
    CHROME,
    [
      "--headless",
      "--disable-gpu",
      "--no-pdf-header-footer",
      // Google Fonts have to arrive before layout is measured, or the sheet is
      // paginated against a fallback face and the page count is meaningless.
      "--virtual-time-budget=8000",
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`
    ],
    { stdio: "ignore" }
  );
  const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
  return Number(/^Pages:\s+(\d+)$/m.exec(info)?.[1] ?? 0);
}

// A fixed build date keeps rebuilds byte-identical when nothing has actually changed,
// so `git status` stays honest. Bump it when the sheets are reissued for a term.
const ISSUED = "2026-09-07";

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
  <span class="slug">${sheet.slug}</span>
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
}

console.log(`\n${files.length} sheets · ${built} written · ${CHECK ? "check passed" : "done"}`);
