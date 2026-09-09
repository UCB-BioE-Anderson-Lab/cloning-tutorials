/* ------------------------------------------------------------------ *
 * check_section.js -- walk one section of a deck and audit every step.
 *
 * Written because reviewing a slide deck by reading its source does not
 * work: the defects that matter are all positional. This renders each
 * step the way the deck actually draws it and measures four things.
 *
 *   overflow     ink outside the content box (x 110-1490, y 86-830), which
 *                is .slide minus its 86px 110px 70px padding, measured
 *   fill         how much of that box the ink spans, as a bounding box.
 *                A crude proxy, but a slide under about 40 percent is
 *                nearly always a drawing that was laid out at the source
 *                deck's scale and never grown into 1600x900.
 *   channels     HTML entities or \uXXXX escapes surviving into the note
 *                and desc channels, which deck.js writes with textContent
 *   errors       page errors and failed requests (favicon.ico excepted)
 *
 * Frames settle before measurement: reduced motion is emulated, CSS
 * transitions are disabled, and each beat is re-run through
 * _seq.go(k, false). A mid-tween screenshot measures nothing.
 *
 *   npm install puppeteer-core       (Chrome is the browser)
 *   mkdocs serve
 *   node check_section.js <lecture-dir> <file.html> [outdir]
 *
 * e.g. node check_section.js 02-dna-fabrication 05-homology.html /tmp/shots
 * ------------------------------------------------------------------ */
const puppeteer = require(require.resolve('puppeteer-core', {paths:[process.cwd(), __dirname]}));
const fs = require('fs'), path = require('path');
const { PNG } = (() => { try { return require(require.resolve('pngjs', {paths:[process.cwd(), __dirname]})); }
                         catch (e) { return {}; } })();

const BASE = 'http://127.0.0.1:8000/cloning-tutorials/lectures/140L/';
const CB = {x0:110, y0:86, x1:1490, y1:830};
/* Two different questions, and an earlier version of this tool conflated them.
   The padding box is where FLOWED content belongs, and it drives the fill
   metric. But .slide is position:relative with overflow:hidden, and the house
   style deliberately parks furniture in the margin: .src pins a citation at
   bottom:34px, and the polymerase legend sits lower still. Both ship, both have
   been presented from. So margin ink is reported for information, and only ink
   at the very edge of the 1600x900 slide is called a defect, because that is
   the ink overflow:hidden is about to cut off. */
const EDGE = 3;
const [dir, file, outdir] = process.argv.slice(2);
if (!dir || !file){ console.error('usage: node check_section.js <lecture-dir> <file.html> [outdir]'); process.exit(2); }
const OUT = outdir || fs.mkdtempSync('/tmp/section-');

/* bounding box of everything that is not near-white, from the raw pixels.
   Measuring the DOM instead reports wrapper divs that span the whole slide,
   so every section scores 100 percent and the check tells you nothing. */
function inkBox(buf){
  const png = PNG.sync.read(buf);
  const {width:w, height:h, data} = png;
  const sx = w/1600, sy = h/900;
  let x0=1e9, y0=1e9, x1=-1e9, y1=-1e9, dark=0;
  for (let y=0; y<h; y++) for (let x=0; x<w; x++){
    const i=(y*w+x)<<2;
    if (data[i]>235 && data[i+1]>235 && data[i+2]>235) continue;
    dark++;
    if (x<x0)x0=x; if (x>x1)x1=x; if (y<y0)y0=y; if (y>y1)y1=y;
  }
  if (x1<0) return null;
  if (dark > 0.45*w*h) return 'GROUND';        /* a full-bleed divider */
  return [x0/sx, y0/sy, x1/sx, y1/sy].map(Math.round);
}

(async () => {
  fs.mkdirSync(OUT, {recursive:true});
  const browser = await puppeteer.launch({executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless:true, args:['--hide-scrollbars']});
  const page = await browser.newPage();
  await page.setViewport({width:1600, height:900});
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion', value:'reduce'}]);

  const errs = [];
  page.on('pageerror', e => errs.push('page error: ' + e));
  page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('/favicon.ico'))
                               errs.push(r.status() + ' ' + r.url()); });

  await page.goto(BASE + dir + '/' + file, {waitUntil:'load', timeout:60000});
  await new Promise(r => setTimeout(r, 600));
  await page.addStyleTag({content:
    '#bar,#help,#jump,#panel{display:none !important}' +
    '*,*::before,*::after{transition:none !important;animation:none !important}'});

  const total = await page.evaluate(() => window.Deck.length);
  await page.evaluate(() => { window.__prev = null; window.__k = 0; });

  const bad = [], margin = [], fills = [], chan = [];
  for (let k = 0; k < total; k++){
    /* A section page navigates to the next file when the deck runs past its
       last step, which destroys the execution context mid-loop.  Report the
       step it happened on rather than dying with a stack trace. */
    try {
    await page.evaluate(i => {
      window.Deck.goTo(i);
      const s = document.querySelector('#stage .slide.on');
      window.__k = (s === window.__prev) ? window.__k + 1 : 0;
      window.__prev = s;
      if (s && s._seq) s._seq.go(window.__k, false);
    }, k);
    await new Promise(r => setTimeout(r, 260));

    const ch = await page.evaluate(() => window.Deck.channels());
    const junk = [ch.note, ch.description].filter(t => t && /&[a-z]+;|&#\d+;|\\u[0-9a-fA-F]{4}/.test(t));
    if (junk.length) chan.push({step:k, sample:junk[0].match(/.{0,30}(&[a-z]+;|&#\d+;|\\u....).{0,20}/)[0]});

    const shot = path.join(OUT, String(k).padStart(3,'0') + '.png');
    const buf = await page.screenshot({path:shot});
    if (!PNG) continue;
    const b = inkBox(buf);
    if (!b || b === 'GROUND') continue;
    if (b[0] <= EDGE || b[1] <= EDGE || b[2] >= 1600-EDGE || b[3] >= 900-EDGE) bad.push({step:k, box:b});
    else if (b[0] < CB.x0-2 || b[1] < CB.y0-2 || b[2] > CB.x1+2 || b[3] > CB.y1+2) margin.push(k);
    const w = Math.min(b[2],CB.x1) - Math.max(b[0],CB.x0);
    const h = Math.min(b[3],CB.y1) - Math.max(b[1],CB.y0);
    fills.push({step:k, fill: Math.max(0,w)*Math.max(0,h) / ((CB.x1-CB.x0)*(CB.y1-CB.y0))});
    } catch (e) {
      console.error('  stopped at step ' + k + ': ' + e.message.split('\n')[0]);
      break;
    }
  }
  await browser.close();

  const sorted = fills.map(f => f.fill).sort((a,b) => a-b);
  const median = sorted.length ? sorted[sorted.length >> 1] : 0;
  const thin = fills.filter(f => f.fill < 0.40).map(f => f.step);

  console.log('\n' + dir + '/' + file);
  console.log('  steps            ' + total);
  console.log('  frames           ' + OUT);
  if (!PNG) console.log('  fill/overflow    SKIPPED (npm install pngjs)');
  else {
    console.log('  median fill      ' + (median*100).toFixed(0) + '%  of the content box');
    console.log('  thin steps       ' + (thin.length ? thin.join(', ') + '   (under 40%, look at these)' : 'none'));
    console.log('  clipped          ' + (bad.length ? JSON.stringify(bad) : 'none'));
    console.log('  ink in margin    ' + (margin.length ? margin.join(', ') + '   (fine if deliberate: .src, legends)' : 'none'));
  }
  console.log('  channel junk     ' + (chan.length ? JSON.stringify(chan) : 'none'));
  console.log('  console          ' + (errs.length ? errs.slice(0,5).join('; ') : 'clean'));
  process.exit(bad.length || chan.length || errs.length ? 1 : 0);
})();
