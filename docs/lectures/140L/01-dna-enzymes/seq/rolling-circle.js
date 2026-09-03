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

const CY = 470;             // raised, to clear the caption band at 792/836
const HOME = 800;           // centred, before the strands are separated
const LEFT = 520, RIGHT = 1080;   // where the two strands settle
const R_T = 190;            // template strand (black, inner)
const R_N = 214;            // partner / new strand (blue, outer)
const MAXARC = 350;         // a lap, with a visible break at the junction
const CAP_Y = 792, SUB_Y = 836;   // the deck's caption band

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
/* ------------------------------------------------------------------ *
 * The displaced product strand.
 *
 * This is DNA, so it must not be drawn as a wave: the deck reserves the
 * wave for RNA (established in 06-rna-polymerases). The previous version
 * paid the strand out along a sum of three sine terms, which is exactly
 * an RNA squiggle — and, being a random walk under soft steering, it also
 * knotted, self-intersected and ran off all four edges of the frame.
 *
 * It is now deterministic and bounded: the strand leaves the circle at
 * the 5' end of its own arc, sweeps out on ONE cubic, then winds outward
 * in a smooth spiral around a fixed coil centre. Reads as "very long,
 * many copies", never crosses itself, and cannot leave the box because
 * the coil's outer radius is a constant you can check by eye.
 *
 *   C = { x, y, r0, r1, turns, a0, lead }
 *   pay in [0,1] — how much of the finished strand has been paid out.
 * ------------------------------------------------------------------ */
function product(cx, cy, theta, C, pay){
  if (pay <= 0.004) return { d:"", end:null };
  const p0  = pol(cx, cy, R_N, theta);
  const s0  = pol(C.x, C.y, C.r0, C.a0);
  const out = rad(theta);              // leaves the circle radially
  const tan = rad(C.a0 + 90);          // arrives along the spiral's tangent
  const c1 = { x: p0.x + C.lead*Math.cos(out), y: p0.y + C.lead*Math.sin(out) };
  const c2 = { x: s0.x - C.lead*Math.cos(tan), y: s0.y - C.lead*Math.sin(tan) };

  const pts = [];
  for (let i = 0; i <= 56; i++){
    const t = i/56, u = 1 - t;
    pts.push([ u*u*u*p0.x + 3*u*u*t*c1.x + 3*u*t*t*c2.x + t*t*t*s0.x,
               u*u*u*p0.y + 3*u*u*t*c1.y + 3*u*t*t*c2.y + t*t*t*s0.y ]);
  }
  const N = Math.max(48, Math.round(C.turns*120));
  for (let i = 1; i <= N; i++){
    const t = i/N;
    const p = pol(C.x, C.y, C.r0 + (C.r1 - C.r0)*t, C.a0 + C.turns*360*t);
    pts.push([p.x, p.y]);
  }

  /* cut the polyline at `pay` of its own arc length, so the strand pays
     out from the polymerase rather than fading in all at once */
  const seg = [0];
  let total = 0;
  for (let i = 1; i < pts.length; i++){
    total += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]);
    seg.push(total);
  }
  const want = total * Math.min(1, pay);
  let d = "M" + n2(pts[0][0]) + " " + n2(pts[0][1]), end = pts[0];
  for (let i = 1; i < pts.length; i++){
    if (seg[i] <= want){
      d += "L" + n2(pts[i][0]) + " " + n2(pts[i][1]); end = pts[i];
    } else {
      const f = (want - seg[i-1]) / (seg[i] - seg[i-1] || 1);
      end = [ pts[i-1][0] + (pts[i][0]-pts[i-1][0])*f,
              pts[i-1][1] + (pts[i][1]-pts[i-1][1])*f ];
      d += "L" + n2(end[0]) + " " + n2(end[1]);
      break;
    }
  }
  return { d: d, end: { x: end[0], y: end[1] } };
}

/* One bold caption plus one muted annotation, in the deck's caption band. */
function captionMarkup(){
  return '<text data-r="cap" x="800" y="' + CAP_Y + '" text-anchor="middle" ' +
           'font-family="inherit" font-weight="700" font-size="31" fill="' + INK + '"></text>' +
         '<text data-r="sub" x="800" y="' + SUB_Y + '" text-anchor="middle" ' +
           'font-family="inherit" font-size="26" fill="#767676"></text>';
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
/* The coil the product winds into. Outer radius 215 about (1150,490)
   means the whole strand lives inside x 935-1365, y 275-705. */
const RCR_COIL = { x:1150, y:490, r0:60, r1:215, turns:1.85, a0:200, lead:150 };

/* Five clicks, not six. Denaturing the circle used to get a click of its
   own, and the two separated rings it produced were thrown away on the
   very next one; denaturing and priming are now the same click, because
   they are one idea — getting a 3' end onto a single-stranded template. */
const RCR_KEYS = ["tx","px","partner","prog","pay","five","lab"];
const RCR = [
  { s:{ tx:HOME, px:HOME, partner:1, prog:0, pay:0, five:0, lab:1 },
    cap:"a closed circular duplex",
    sub:"two strands, drawn as two rings",
    note:"Rolling circle replication. The template is a closed circular DNA — two strands, drawn here as two rings, the black one the strand we are going to copy.",
    desc:"A circular double-stranded DNA at the centre of the slide, drawn as two concentric rings, each labelled: the black inner ring is the template, the blue outer ring is the strand paired with it." },
  { s:{ tx:LEFT, px:RIGHT, partner:0, prog:34, pay:0, five:0, lab:0 }, snap:["prog"],
    cap:"denature it, then prime it",
    sub:"an oligo gives the polymerase a 3′ end to start from",
    note:"Denature the DNA to separate the strands, and anneal an oligonucleotide to the one you want to copy. That oligo is the point: it gives the polymerase a 3' end to initiate on, and a polymerase cannot start without one.",
    desc:"The partner strand has moved away to the right and gone. A short blue oligo has annealed near the top of the remaining template circle, its 3' end carrying a half barb pointing clockwise." },
  { s:{ tx:LEFT, px:RIGHT, partner:0, prog:MAXARC, pay:0, five:0, lab:0 },
    cap:"one lap, and it is back where it started",
    sub:"the 3′ end has caught up with the oligo's own 5′ end",
    note:"The polymerase runs all the way around the circle until it reaches its own 5' end. On a linear template this is where synthesis would stop. On a circle it is where the interesting part starts.",
    desc:"The new strand has been extended clockwise all the way round the template and its 3' barb has arrived back at its own 5' end, with a small break between them." },
  { s:{ tx:LEFT, px:RIGHT, partner:0, prog:375, pay:0.13, five:1, lab:0 },
    cap:"phi29 displaces its own 5′ end and carries on",
    sub:"no exonuclease, so nothing is destroyed — it is peeled off instead",
    note:"Because phi29 displaces rather than stops or degrades, it lifts that 5' end off the template and keeps going. An enzyme with a 5' to 3' exonuclease would have eaten the strand instead, and you would go round for ever without ever making a second copy.",
    desc:"The polymerase has passed its own 5' end, marked in red, and lifted it off the template. A short displaced strand now leads away from the circle." },
  { s:{ tx:LEFT, px:RIGHT, partner:0, prog:420, pay:1, five:1, lab:0 },
    cap:"round and round: copy after copy on one strand",
    sub:"a concatemer — many tandem copies of the circle, still one molecule",
    note:"It just keeps going round, paying out a long single strand that carries copy after copy of the circle head to tail. One template, one primer, one enzyme, one temperature, and the product grows without bound.",
    desc:"The displaced strand has been paid out into a long smooth coil filling the right of the slide, its free 5' end marked in red. It is a concatemer: many tandem copies of the circle on a single molecule." }
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
    '</g>' +
    /* Name the two rings on the opening frame: without this the reader is
       shown two concentric circles and left to guess which is which. */
    '<g data-r="lab" opacity="0" font-family="inherit" font-size="26" fill="#767676">' +
      '<path d="M' + n2(HOME + R_T*Math.cos(rad(28))) + ' ' + n2(CY + R_T*Math.sin(rad(28))) +
        'L1104 ' + (CY + 132) + '" fill="none" stroke="#767676" stroke-width="2.2"/>' +
      '<text x="1116" y="' + (CY + 141) + '">template</text>' +
      '<path d="M' + n2(HOME + R_N*Math.cos(rad(-28))) + ' ' + n2(CY + R_N*Math.sin(rad(-28))) +
        'L1104 ' + (CY - 142) + '" fill="none" stroke="#767676" stroke-width="2.2"/>' +
      '<text x="1116" y="' + (CY - 133) + '">its partner strand</text>' +
    '</g>' + captionMarkup());

  function paint(s){
    r.tmpl.setAttribute("cx", n2(s.tx));
    r.partner.setAttribute("cx", n2(s.px));
    r.partner.setAttribute("opacity", n2(s.partner));
    r.lab.setAttribute("opacity", n2(s.lab));

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
    const t = product(s.tx, CY, a0t, RCR_COIL, s.pay);
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
      r.cap.textContent = RCR[i].cap || "";
      r.sub.textContent = RCR[i].sub || "";
      // the oligo appears; it does not grow. (This used to pass the snap
      // ARRAY where tweener wanted an options object, so it never fired.)
      run(cur, to, animated, { snap: RCR[i].snap });
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
/* The scene stops at 730 so the caption band at 792/836 is free. It used to
   run to 858, which left the reagent list stranded at y=893, 7px off the
   bottom edge of the slide. */
const SCENE_TOP = 158, SCENE_BOT = 730;
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
  '<g data-r="mix" opacity="0" font-family="inherit" font-size="28" ' +
    'fill="' + SLATE + '" text-anchor="middle">' +
    '<text x="800" y="' + SUB_Y + '">+ phi29 &#183; + random hexamers &#183; + dNTPs</text>' +
  '</g>';

/* Three primed sites, not six. Six products at 1500px of random walk each
   was an unreadable tangle that left the frame on all four sides; three is
   still "several", still shows the circle primed at more than one place at
   once, and each product can be given a coil that visibly stays in the box.
   The start angles are deliberately unequal \u2014 these are RANDOM hexamers.
   With HEX_SPAN 95 and a final prog of 430 the three arcs land at
   [205,300], [340,75] and [80,175], so no two of them ever touch. */
const N_HEX = 3;
const HEX = [-130, 5, 105];
const HEX_SPAN = 95;
const RCA_COIL = [
  { x:320,  y:430, r0:52, r1:150, turns:1.7, a0:20,  lead:105 },
  { x:1300, y:370, r0:52, r1:130, turns:1.7, a0:200, lead:105 },
  { x:1230, y:660, r0:44, r1:110, turns:1.7, a0:190, lead:100 }
];

/* Four clicks, not six. The title-only opening frame was a full click over
   an empty white field, and "the strands are separated," was one sentence
   split across two clicks \u2014 it is now the front half of the click that
   shows what the separation was FOR. */
const RCA_KEYS = ["scene","hero","pTube","pSample","mix","mol","prog","pay"];
const RCA = [
  /* One click, but it arrives with a flourish: the swabbing panel enters
     alone and enlarged, settles into place, and the two inset panels fade
     in behind it a beat later. */
  { s:{scene:1,hero:0,pTube:1,pSample:1,mix:0,mol:0,prog:0,pay:0},
    enter:{scene:1,hero:1,pTube:0,pSample:0},
    delay:{pTube:0.40, pSample:0.55},
    dur:1150,
    cap:"you have almost no DNA",
    sub:"a swab, a single colony, a trace \u2014 too little to work with directly",
    note:"Rolling circle amplification is the technique built on that behaviour. The usual reason to reach for it is that you have almost no DNA \u2014 a forensic swab, a single colony, a trace sample. Swab the stain, drop the swab in a tube, and that is your sample.",
    desc:"A line drawing of a forensic technician in coveralls and a mask, crouching to swab a small stain beside an evidence marker numbered one. Two inset panels at the right show the swab being placed into a microfuge tube, and that tube yielding a DNA sample." },

  { s:{scene:1,hero:0,pTube:1,pSample:1,mix:1,mol:0,prog:0,pay:0},
    cap:"set it up like a PCR \u2014 but it runs at one temperature",
    note:"You set the reaction up much like a PCR \u2014 the dilute sample, phi29, random hexamers and dNTPs in one tube \u2014 except that there is no thermal cycling. It is isothermal, so it needs no machine, and it will run overnight on the bench.",
    desc:"The reaction components are listed beneath the scene: phi29, random hexamers and dNTPs." },

  { s:{scene:0,hero:0,pTube:1,pSample:1,mix:0,mol:1,prog:34,pay:0}, snap:["prog"],
    cap:"random hexamers prime the circle in several places at once",
    sub:"no designed primer needed \u2014 they anneal wherever they match",
    note:"Now follow one molecule. The strands are separated, and because the hexamers are random, several of them anneal all round the circle at once. You did not have to know the sequence to do this, which is the point: you cannot design a primer for a sample you have not sequenced yet.",
    desc:"The view switches to a single molecule: one circular single-stranded template with three short random oligos annealed at uneven intervals around it, each drawn as a visible arc against the circle with a half barb at its 3' end pointing clockwise." },

  { s:{scene:0,hero:0,pTube:1,pSample:1,mix:0,mol:1,prog:430,pay:1},
    cap:"each one displaces the strand in front of it",
    sub:"one circle, many concatemers \u2014 that is the amplification",
    note:"Every one of them polymerises right round the circle and displaces the strand in front of it, so a single molecule throws off several long products at once, each of them copy after copy of the original. In practice those displaced strands get primed in their turn, and the yield goes up faster than any single rolling circle would give you.",
    desc:"All three have polymerised round the circle and are displacing each other, throwing off three long single strands that wind into smooth coils at the left, the upper right and the lower right of the slide. Each is a concatemer of tandem copies." }
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
    '</g>' + captionMarkup());

  function paint(s){
    r.scene.setAttribute("opacity", n2(s.scene));
    if (r.gScene)  r.gScene.setAttribute("transform", heroTransform(s.hero));
    if (r.gTube)   r.gTube.setAttribute("opacity", n2(s.pTube));
    if (r.gSample) r.gSample.setAttribute("opacity", n2(s.pSample));
    r.mix  .setAttribute("opacity", n2(s.mix));
    r.mol  .setAttribute("opacity", n2(s.mol));
    for (let i = 0; i < N_HEX; i++){
      if (s.prog < 0.5){
        r["r"+i].setAttribute("d",""); r["b"+i].setAttribute("d",""); r["t"+i].setAttribute("d","");
        continue;
      }
      const span = Math.min(s.prog, HEX_SPAN);
      const a1 = HEX[i] + s.prog, a0 = a1 - span;
      // A hexamer is an ARC against the circle, not a floating chevron: at
      // the old 13 degrees the strand body was shorter than its own barb.
      r["r"+i].setAttribute("d", arcPath(HOME, CY, R_N, a0, a1));
      r["b"+i].setAttribute("d", barb(HOME, CY, R_N, a1));   // 3' end, on the circle
      // the strand ahead is displaced from ITS OWN 5' end, so each loose
      // strand leaves the circle at a0 — the 5' end of its own arc
      r["t"+i].setAttribute("d", product(HOME, CY, a0, RCA_COIL[i], s.pay).d);
    }
  }

  const run = tweener(RCA_KEYS, paint);
  /* -1, not 0: the scene's entrance flourish now lives on the FIRST step
     (the title-only frame it used to follow has been cut), so it has to be
     allowed to play when you arrive on the slide. */
  let cur = Object.assign({}, RCA[0].s), at = -1;
  paint(cur);
  return {
    steps: RCA.map(x => ({ note:x.note, desc:x.desc })),
    go: function(i, animated){
      const st = RCA[i], to = st.s;
      r.cap.textContent = st.cap || "";
      r.sub.textContent = st.sub || "";
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
