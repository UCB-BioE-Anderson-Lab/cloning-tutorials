const puppeteer = require(require.resolve('puppeteer-core',{paths:[__dirname]}));
(async () => {
  const b = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--hide-scrollbars']});
  const p = await b.newPage();
  await p.setViewport({width:1600,height:900});
  await p.goto('http://127.0.0.1:8000/cloning-tutorials/lectures/140L/03-genome-editing/08-sequencing.html',{waitUntil:'load'});
  await new Promise(r=>setTimeout(r,700));
  await p.evaluate(()=>{ window.Deck.goTo(2);
    document.querySelector('#stage .slide.on')._seq.go(1,false); });
  await new Promise(r=>setTimeout(r,500));
  // the polymerase blob is the only path with fill-opacity .08
  const xs = [];
  const read = () => p.evaluate(()=>{
    const s = document.querySelector('#stage .slide.on');
    const n = [...s.querySelectorAll('path')].find(e=>e.getAttribute('fill-opacity')==='.08');
    if (!n) return null;
    const m = n.getAttribute('d').match(/^M([-\d.]+)/);
    return m ? +m[1] : null;
  });
  xs.push(['settled', await read()]);
  await p.evaluate(()=>document.querySelector('#stage .slide.on')._seq.go(2,true));
  for (let i=0;i<5;i++){ await new Promise(r=>setTimeout(r,260)); xs.push([260*(i+1), await read()]); }
  console.log(JSON.stringify(xs));
  await b.close();
})();
