/* ------------------------------------------------------------------ *
 * rolling-circle.js — two sequences.
 *
 *   rcr    Rolling circle replication   (6 clicks)
 *   rcamp  Rolling circle amplification (6 clicks)
 *
 * Nothing ever moves backwards: the template slides left once, during
 * the strand-separation click, and stays there.  The displaced strand
 * always leaves the circle AT the polymerase, so the half barb and the
 * tail are one continuous molecule.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const CY = 540;
const HOME = 800;           // centred, before the strands are separated
const LEFT = 560, RIGHT = 1040;   // where the two strands settle
const R_T = 190;            // template strand (black, inner)
const R_N = 214;            // partner / new strand (slate, outer)
const MAXARC = 350;         // a lap, with a visible break at the junction

const INK = "#111111", SLATE = "#004373", RED = "#ba3a13";
const SVGNS = "http://www.w3.org/2000/svg";
const rad = d => d*Math.PI/180;
const pol = (cx,cy,r,a) => ({ x: cx + r*Math.cos(rad(a)), y: cy + r*Math.sin(rad(a)) });
const n2 = v => Math.round(v*10)/10;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;

function arcPath(cx,cy,r,a0,a1){
  const p0 = pol(cx,cy,r,a0), p1 = pol(cx,cy,r,a1), sweep = a1 - a0;
  return "M"+n2(p0.x)+" "+n2(p0.y)+"A"+n2(r)+" "+n2(r)+" 0 "+(sweep>180?1:0)+" 1 "+n2(p1.x)+" "+n2(p1.y);
}
/* half barb at a 3' end travelling clockwise round the circle */
function barb(cx,cy,r,a){
  const p = pol(cx,cy,r,a), t = rad(a + 90), L = 26, W = 0.50;
  return "M"+n2(p.x - L*Math.cos(t+W))+" "+n2(p.y - L*Math.sin(t+W))+"L"+n2(p.x)+" "+n2(p.y);
}
/* Displaced single strand, paid out at the polymerase and snaking away. */
/* blend heading h toward `target` by weight w, the short way round */
function blend(h, target, w){
  return Math.atan2((1-w)*Math.sin(h) + w*Math.sin(target),
                    (1-w)*Math.cos(h) + w*Math.cos(target));
}
const norm = a => Math.atan2(Math.sin(a), Math.cos(a));

/* The displaced single strand: paid out at the polymerase, then left to
   wander.  `bias` is the heading it settles toward (null = straight out
   from where it left).  `maxR` reels it back in so it coils instead of
   flying off. */
function tail(cx, cy, theta, len, phase, bias, maxR){
  if (len < 3) return { d:"", end:null };
  const p0 = pol(cx, cy, R_N, theta);
  let x = p0.x, y = p0.y;
  const h0 = norm(rad(theta));
  const settle = (bias == null) ? h0 : bias;
  const ds = 5, pts = [[x,y]];
  for (let u = 0; u < len; u += ds){
    const d = Math.min(ds, len - u), t = Math.min(1, u/330);
    let h = h0 + norm(settle - h0)*t
          + t*(1.02*Math.sin(u*0.0150 + phase)
             + 0.44*Math.sin(u*0.0088 + phase*1.7 + 1.3)
             + 0.20*Math.sin(u*0.0291 + phase*0.6 + 4.1));

    const dx = x - cx, dy = y - cy, dist = Math.hypot(dx, dy);
    // never wander back across the template
    if (dist < R_N + 12)
      h = blend(h, Math.atan2(dy, dx), 1 - dist/(R_N + 12));
    // reel a long strand back in TANGENTIALLY, so it coils round the
    // circle instead of hairpinning straight back on itself
    if (maxR && dist > maxR)
      h = blend(h, Math.atan2(dy, dx) + 2.0, Math.min(0.45, (dist - maxR)/220));
    // and keep it on the canvas, clear of the heading
    const ox = x < 150 ? (150 - x)/70 : (x > 1450 ? (x - 1450)/70 : 0);
    const oy = y < 330 ? (330 - y)/70 : (y > 850 ? (y - 850)/70 : 0);
    if (ox > 0 || oy > 0){
      const tx = x < 150 ? 1 : (x > 1450 ? -1 : 0);
      const ty = y < 330 ? 1 : (y > 850 ? -1 : 0);
      h = blend(h, Math.atan2(ty, tx), Math.min(0.85, Math.max(ox, oy)));
    }

    x += d*Math.cos(h); y += d*Math.sin(h);
    pts.push([x,y]);
  }
  return { d:"M" + pts.map(p => n2(p[0])+" "+n2(p[1])).join("L"), end:{ x:x, y:y } };
}

function mount(slide, markup){
  const svg = document.createElementNS(SVGNS,"svg");
  svg.setAttribute("viewBox","0 0 1600 900");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  svg.innerHTML = markup;
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  return r;
}
function tweener(keys, paint){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, raf = null;
  return function(from, to, animated, opt){
    opt = opt || {};
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    if (animated === false || reduce.matches){ paint(Object.assign({}, to)); return; }
    const base = Object.assign({}, from);
    // snap: jump a key to its target so the thing simply IS there
    if (opt.snap)  opt.snap.forEach(k => base[k] = to[k]);
    // enter: force a key to start somewhere specific, so one click can
    // carry a flourish rather than needing a build step of its own
    if (opt.enter) Object.keys(opt.enter).forEach(k => base[k] = opt.enter[k]);
    const delay = opt.delay || {};
    const t0 = performance.now(), dur = opt.dur || 820;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1,(now-t0)/dur), s = {};
      keys.forEach(function(k){
        const d = delay[k] || 0;
        const tk = d ? Math.min(1, Math.max(0, (t - d) / (1 - d))) : t;
        s[k] = base[k] + (to[k]-base[k]) * ease(tk);
      });
      paint(s);
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
    void cur;
  };
}

/* ============================================ rolling circle replication */
const RCR_KEYS = ["tx","px","partner","prog","tailLen","five"];
const RCR = [
  { s:{ tx:HOME, px:HOME, partner:1, prog:0, tailLen:0, five:0 },
    note:"Rolling circle replication. The template is a closed circular DNA — two strands, drawn here as two rings.",
    desc:"A circular double-stranded DNA at the centre of the slide, drawn as two concentric rings: the black template and the slate strand paired with it." },
  { s:{ tx:LEFT, px:RIGHT, partner:1, prog:0, tailLen:0, five:0 },
    note:"First the DNA is denatured to separate the strands.",
    desc:"One click pulls the two strands apart: the black template circle moves to the left, its slate partner to the right." },
  { s:{ tx:LEFT, px:RIGHT, partner:0, prog:30, tailLen:0, five:0 }, snap:["prog"],
    note:"An oligonucleotide anneals to the template, and that gives the polymerase a 3' end to initiate on.",
    desc:"The partner strand is gone. A short slate oligo has annealed at the top of the template circle, its 3' end carrying a half barb pointing clockwise." },
  { s:{ tx:LEFT, px:RIGHT, partner:0, prog:MAXARC, tailLen:0, five:0 },
    note:"The polymerase runs all the way around the circle until it reaches its own 5' end.",
    desc:"The new strand has been extended clockwise all the way round the template and has arrived back at its own 5' end." },
  { s:{ tx:LEFT, px:RIGHT, partner:0, prog:375, tailLen:150, five:1 },
    note:"Because phi29 displaces rather than stops or degrades, it lifts that 5' end off the template and keeps going.",
    desc:"The polymerase has passed its own 5' end, marked in red, and lifted it off the template. A short displaced tail trails from the polymerase." },
  { s:{ tx:LEFT, px:RIGHT, partner:0, prog:420, tailLen:1150, five:1 },
    note:"It just keeps going round, paying out a long single strand that carries copy after copy of the circle.",
    desc:"The polymerase has kept going and a long single-stranded tail — many tandem copies of the circle — now snakes out across the right of the slide." }
];

window.Deck.sequence("rcr", function(slide){
  const r = mount(slide,
    '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle data-r="partner" cy="'+CY+'" r="'+R_N+'" stroke="'+SLATE+'" stroke-width="2.8"/>' +
      '<circle data-r="tmpl"    cy="'+CY+'" r="'+R_T+'" stroke="'+INK+'"   stroke-width="2.8"/>' +
      '<path data-r="tail" stroke="'+SLATE+'" stroke-width="2.8"/>' +
      '<path data-r="ring" stroke="'+SLATE+'" stroke-width="2.8"/>' +
      '<path data-r="tip"  stroke="'+SLATE+'" stroke-width="2.8"/>' +
      '<g data-r="five" opacity="0"><circle data-r="dot" r="5.5" fill="'+RED+'" stroke="none"/>' +
      '<text data-r="lbl" fill="'+RED+'" font-family="inherit" font-weight="700" font-size="26">5&#8242;</text></g>' +
    '</g>');

  function paint(s){
    r.tmpl.setAttribute("cx", n2(s.tx));
    r.partner.setAttribute("cx", n2(s.px));
    r.partner.setAttribute("opacity", n2(s.partner));

    if (s.prog < 0.5){ r.ring.setAttribute("d",""); r.tip.setAttribute("d",""); }
    else {
      // Past one lap the ring is fully covered: the second-lap strand behind
      // the polymerase, the first-lap strand still annealed ahead of it.
      const a1 = -90 + s.prog, a0 = a1 - Math.min(s.prog, MAXARC);
      r.ring.setAttribute("d", arcPath(s.tx, CY, R_N, a0, a1));
      r.tip .setAttribute("d", barb(s.tx, CY, R_N, a1));   // 3' end, ON the circle
    }
    // One continuous molecule: free 5' end out in solution, down to the
    // circle at a0, a full turn clockwise, 3' barb at a1. The tail therefore
    // leaves from the arc's 5' END — a strand cannot branch from its middle.
    const a0t = -90 + s.prog - Math.min(s.prog, MAXARC);
    const t = tail(s.tx, CY, a0t, s.tailLen, 0.35, -0.22, null);
    r.tail.setAttribute("d", t.d);
    if (s.five > 0.01 && t.end){
      r.five.setAttribute("opacity", n2(s.five));
      r.dot.setAttribute("cx", n2(t.end.x)); r.dot.setAttribute("cy", n2(t.end.y));
      r.lbl.setAttribute("x", n2(t.end.x + 18)); r.lbl.setAttribute("y", n2(t.end.y + 34));
    } else r.five.setAttribute("opacity","0");
  }

  const run = tweener(RCR_KEYS, paint);
  let cur = Object.assign({}, RCR[0].s);
  paint(cur);
  return {
    steps: RCR.map(x => ({ note:x.note, desc:x.desc })),
    go: function(i, animated){
      const to = RCR[i].s;
      run(cur, to, animated, RCR[i].snap);   // the oligo appears; it does not grow
      cur = Object.assign({}, to);
    }
  };
});

/* ========================================== rolling circle amplification */
/* A fingerprint is a LOOP: ridges enter from one side, sweep around a
   core and exit the same side, with a delta where they diverge. Concentric
   ovals read as a snail, which is what the first attempt looked like. */
/* The sampling scene is AI-generated line art traced to Beziers by
   lineart-trace, split into its three panels in art-crimescene.js.
   The swabbing panel enters alone and enlarged, then settles into the
   full composition as the two inset panels join it. */
const ART_BBOX = { x:90, y:20, w:1429, h:974 };
const SCENE_TOP = 168, SCENE_BOT = 858;
const SCENE_SCALE = (SCENE_BOT - SCENE_TOP) / ART_BBOX.h;
const SCENE_X = (1600 - ART_BBOX.w * SCENE_SCALE) / 2;
const HERO_ZOOM = 1.14;   // scene panel is 801 of the 974-tall frame;
                          // more than ~1.21 and it runs off the top

function sceneMarkup(){
  const A = window.ART;
  if (!A || !A.scene) return '<g data-r="scene" opacity="0"></g>';
  const tx = SCENE_X - ART_BBOX.x * SCENE_SCALE;
  const ty = SCENE_TOP - ART_BBOX.y * SCENE_SCALE;
  return '<g data-r="scene" opacity="0" transform="translate(' + n2(tx) + ' ' +
           n2(ty) + ') scale(' + SCENE_SCALE.toFixed(4) + ')">' +
           '<g data-r="gScene" fill="none" stroke="#111111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'  + A.scene  + '</g>' +
           '<g data-r="gTube" opacity="0" fill="none" stroke="#111111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + A.tube + '</g>' +
           '<g data-r="gSample" opacity="0" fill="none" stroke="#111111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + A.sample + '</g>' +
         '</g>';
}

/* Scale the swabbing panel about its own centre and slide that centre to
   the middle of the finished composition. hero=1 is the solo shot, hero=0
   is its place in the final layout — at which point this is the identity. */
function heroTransform(hero){
  const A = window.ART;
  if (!A || !A.box) return "";
  const b = A.box.scene;
  const cx = (b[0]+b[2])/2, cy = (b[1]+b[3])/2;
  const dx = ART_BBOX.x + ART_BBOX.w/2, dy = ART_BBOX.y + ART_BBOX.h/2;
  const k  = 1 + (HERO_ZOOM - 1) * hero;
  const tx = cx + (dx - cx) * hero, ty = cy + (dy - cy) * hero;
  return "translate(" + n2(tx) + " " + n2(ty) + ") scale(" + k.toFixed(4) +
         ") translate(" + n2(-cx) + " " + n2(-cy) + ")";
}

const REAGENTS =
  '<g data-r="mix" opacity="0" font-family="inherit" font-size="30" ' +
    'fill="' + SLATE + '" text-anchor="middle">' +
    '<text x="800" y="893">+ phi29 &#183; + random hexamers &#183; + dNTPs</text>' +
  '</g>';

const N_HEX = 6;
const RCA_KEYS = ["scene","hero","pTube","pSample","mix","mol","prog","tailLen"];
const RCA = [
  { s:{scene:0,hero:0,pTube:1,pSample:1,mix:0,mol:0,prog:0,tailLen:0},
    note:"Rolling circle amplification is the technique built on that behaviour: you anneal random hexamers to a very dilute sample and let phi29 run.",
    desc:"Title slide: Application \u2014 forensic analysis with rolling circle amplification." },

  /* One click, but it arrives with a flourish: the swabbing panel enters
     alone and enlarged, settles into place, and the two inset panels fade
     in behind it a beat later. */
  { s:{scene:1,hero:0,pTube:1,pSample:1,mix:0,mol:0,prog:0,tailLen:0},
    enter:{scene:1,hero:1,pTube:0,pSample:0},
    delay:{pTube:0.40, pSample:0.55},
    dur:1150,
    note:"The usual reason to reach for it is that you have almost no DNA \u2014 a forensic swab, a single colony, a trace sample. Swab the stain, drop the swab in a tube, and that is your sample.",
    desc:"A line drawing of a forensic technician in coveralls and a mask, crouching to swab a small stain beside an evidence marker numbered one. Two inset panels at the right show the swab being placed into a microfuge tube, and that tube yielding a DNA sample." },

  { s:{scene:1,hero:0,pTube:1,pSample:1,mix:1,mol:0,prog:0,tailLen:0},
    note:"You set the reaction up much like a PCR \u2014 the dilute sample, phi29, random hexamers and dNTPs in one tube \u2014 except that it runs at one temperature.",
    desc:"The reaction components are listed beneath the scene: phi29, random hexamers and dNTPs." },
  { s:{scene:0,hero:0,pTube:1,pSample:1,mix:0,mol:1,prog:0,tailLen:0},
    note:"The strands are separated,",
    desc:"The view switches to a single molecule: one circular single-stranded template at the centre of the slide." },
  { s:{scene:0,hero:0,pTube:1,pSample:1,mix:0,mol:1,prog:13,tailLen:0}, snap:["prog"],
    note:"and because the hexamers are random, several of them anneal all round the circle at once.",
    desc:"Six short random hexamers have annealed at intervals around the circle, each with a half barb at its 3' end pointing clockwise." },
  { s:{scene:0,hero:0,pTube:1,pSample:1,mix:0,mol:1,prog:430,tailLen:1500},
    note:"Every one of them polymerises and displaces the strand in front of it, so a single circle throws off a whole tangle of product. That is the amplification.",
    desc:"All six have polymerised right round the circle and are displacing each other, throwing off six long single strands that tangle into a mess of DNA spaghetti." }
];

window.Deck.sequence("rcamp", function(slide){
  let rings = "", tails = "", tips = "";
  for (let i = 0; i < N_HEX; i++){
    tails += '<path data-r="t'+i+'" stroke="'+SLATE+'" stroke-width="2.6"/>';
    rings += '<path data-r="r'+i+'" stroke="'+SLATE+'" stroke-width="2.8"/>';
    tips  += '<path data-r="b'+i+'" stroke="'+SLATE+'" stroke-width="2.8"/>';
  }
  const r = mount(slide,
    sceneMarkup() + REAGENTS +
    '<g data-r="mol" opacity="0" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="'+HOME+'" cy="'+CY+'" r="'+R_T+'" stroke="'+INK+'" stroke-width="2.8"/>' +
      tails + rings + tips +
    '</g>');

  function paint(s){
    r.scene.setAttribute("opacity", n2(s.scene));
    if (r.gScene)  r.gScene.setAttribute("transform", heroTransform(s.hero));
    if (r.gTube)   r.gTube.setAttribute("opacity", n2(s.pTube));
    if (r.gSample) r.gSample.setAttribute("opacity", n2(s.pSample));
    r.mix  .setAttribute("opacity", n2(s.mix));
    r.mol  .setAttribute("opacity", n2(s.mol));
    for (let i = 0; i < N_HEX; i++){
      const start = -90 + i*(360/N_HEX);
      const span  = Math.min(s.prog, MAXARC/N_HEX - 6);
      if (s.prog < 0.5){
        r["r"+i].setAttribute("d",""); r["b"+i].setAttribute("d",""); r["t"+i].setAttribute("d","");
        continue;
      }
      const a1 = start + s.prog, a0 = a1 - span;
      r["r"+i].setAttribute("d", arcPath(HOME, CY, R_N, a0, a1));
      r["b"+i].setAttribute("d", barb(HOME, CY, R_N, a1));   // 3' end, on the circle
      // the strand ahead is displaced from ITS OWN 5' end, so each loose
      // strand leaves the circle at a0 — the 5' end of its own arc
      const t = tail(HOME, CY, a0, s.tailLen * (0.75 + 0.25*Math.sin(i*2.1)),
                     0.4 + i*1.05, null, 255);
      r["t"+i].setAttribute("d", t.d);
    }
  }

  const run = tweener(RCA_KEYS, paint);
  let cur = Object.assign({}, RCA[0].s), at = 0;
  paint(cur);
  return {
    steps: RCA.map(x => ({ note:x.note, desc:x.desc })),
    go: function(i, animated){
      const st = RCA[i], to = st.s;
      // the flourish plays when you arrive going forward, not when you
      // step back onto the slide
      const opt = { snap: st.snap, delay: st.delay, dur: st.dur };
      if (st.enter && i > at) opt.enter = st.enter;
      at = i;
      run(cur, to, animated, opt);
      cur = Object.assign({}, to);
    }
  };
});
})();
