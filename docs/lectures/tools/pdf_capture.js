/* ------------------------------------------------------------------ *
 * pdf_capture.js -- one vector PDF page per animation step.
 *
 * The deck's argument lives in the clicks, so a PDF of the slides alone
 * would lose most of it: every step gets its own page instead.
 *
 * Two settings make a still frame honest. Reduced motion is emulated, so
 * the looping sequences render their end state rather than whatever
 * moment the capture happened to land on; CSS transitions are killed, so
 * every data-build group is at full opacity rather than mid-fade. Each
 * beat is then re-run through _seq.go(k, false), the sequences' own
 * unanimated path.
 *
 *   npm install puppeteer-core        (Chrome itself is the browser)
 *   mkdocs serve                      (the deck is driven live)
 *   node pdf_capture.js <outdir> [00-intro.html,...]
 * ------------------------------------------------------------------ */
/* installed into the working directory, not next to this file */
const puppeteer = require(require.resolve('puppeteer-core', {paths:[process.cwd(), __dirname]}));
const fs = require('fs');
const path = require('path');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://127.0.0.1:8000/cloning-tutorials/lectures/140L/01-dna-enzymes/';
const OUT = process.argv[2];
const ONLY = process.argv[3] ? process.argv[3].split(',') : null;

(async () => {
  fs.mkdirSync(OUT, {recursive:true});
  const browser = await puppeteer.launch({executablePath: CHROME, headless: true,
    args:['--hide-scrollbars','--font-render-hinting=none']});
  const page = await browser.newPage();
  await page.setViewport({width:1600, height:900});
  await page.emulateMediaType('screen');
  // Print wants settled frames, not tweens: reduced motion makes the looping
  // sequences render their end state, and killing CSS transitions makes every
  // data-build group snap to full opacity.
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion', value:'reduce'}]);

  // section list from lecture.js
  await page.goto(BASE+'00-intro.html', {waitUntil:'load', timeout:60000});
  const sections = await page.evaluate(() => window.LECTURE.sections.map(s => ({file:s.file, title:s.title})));
  const list = ONLY ? sections.filter(s => ONLY.includes(s.file)) : sections;

  const manifest = [];
  let n = 0;
  for (const sec of list){
    await page.goto(BASE+sec.file, {waitUntil:'load', timeout:60000});
    await new Promise(r => setTimeout(r, 500));
    await page.addStyleTag({content:'#bar,#help,#jump,#panel{display:none !important}'+
      '*,*::before,*::after{transition:none !important;animation:none !important}'});
    await page.evaluate(() => { window.__prev = null; window.__k = 0; });
    const total = await page.evaluate(() => window.Deck.length);
    for (let k = 0; k < total; k++){
      await page.evaluate(i => {
        window.Deck.goTo(i);
        const s = document.querySelector('#stage .slide.on');
        window.__k = (s === window.__prev) ? window.__k + 1 : 0;
        window.__prev = s;
        // re-run the beat unanimated so we capture its resting state
        if (s && s._seq) s._seq.go(window.__k, false);
      }, k);
      await new Promise(r => setTimeout(r, 260));      // let tweens settle
      const ch = await page.evaluate(() => window.Deck.channels());
      const file = path.join(OUT, String(n).padStart(3,'0')+'.pdf');
      await page.pdf({path:file, width:'1600px', height:'900px', printBackground:true,
                      margin:{top:0,right:0,bottom:0,left:0}, pageRanges:'1'});
      manifest.push({i:n, file_pdf:file, section:sec.title, file:sec.file, step:k+1, of:total,
                     note:ch.note||'', desc:ch.description||''});
      n++;
    }
    console.log(`  ${sec.file}  ${total} frames`);
  }
  fs.writeFileSync(path.join(OUT,'manifest.json'), JSON.stringify(manifest, null, 1));
  await browser.close();
  console.log('total frames:', n);
})();
