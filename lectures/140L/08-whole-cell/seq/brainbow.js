/* ------------------------------------------------------------------ *
 * brainbow.js — how a Brainbow 3.1 cassette picks a colour.
 *
 *   brainbow   the cassette as built, then Cre excising each of the
 *              three lox pairs in turn, then the three products side
 *              by side                                     (4 clicks)
 *
 * The construct is Brainbow 3.1 as drawn in Cai et al., Nat Methods
 * 2013, Fig. 1c (PMID 23817127):
 *
 *   Thy1  P 2 N  ØNFPnls pA  P mO2f pA  2 EGFPf pA  N mK2f pA
 *
 * P, 2 and N are loxP, lox2272 and loxN.  Cre recombines a site only
 * with another of the same kind, and all six point the same way, so
 * every outcome is an EXCISION, never an inversion (inversion was
 * Brainbow 2).  The first pair Cre uses deletes one of the other two
 * pairs' partners, so each copy of the cassette is fixed after one
 * event.
 *
 * The drawing primitives (curve, arrowFill, arrowOpen, the excision
 * geometry) are lifted from 01-dna-enzymes/seq/recombinase.js, so a
 * lox site, a gene and an excised circle look the same here as in the
 * enzymes lecture where Cre is introduced.  The expressed protein is
 * filled vermillion, the attention colour, rather than in its own
 * emission colour: the palette has no green, and the caption names
 * the colour.  The real colours arrive on the next slide, in the data.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
function smooth(v, a, b){ const t = clamp01((v-a)/(b-a)); return t*t*(3-2*t); }

/* ---- primitives, as in recombinase.js ----------------------------- */
function curve(L, bend, k, ax, ay){
  const R = L / (Math.max(bend, 0.0006) * 2 * Math.PI), Rk = R * k;
  return function(s, off){
    const phi = (s - L/2)/R;
    return [ ax + (Rk + off)*Math.sin(phi),
             ay + Rk - (Rk + off)*Math.cos(phi) ];
  };
}
function samples(pt, s0, s1, off, step){
  const N = Math.max(1, Math.ceil(Math.abs(s1-s0)/(step || 9))), out = [];
  for (let i = 0; i <= N; i++) out.push(pt(s0 + (s1-s0)*i/N, off));
  return out;
}
function poly(pts, close){
  let d = "";
  for (let i = 0; i < pts.length; i++) d += (i?"L":"M") + n2(pts[i][0]) + " " + n2(pts[i][1]);
  return d + (close ? "Z" : "");
}
function strand(pt, s0, s1){
  return '<path d="'+poly(samples(pt, s0, s1, 0))+'" fill="none" stroke="'+INK+
         '" stroke-width="4.6" stroke-linecap="round"/>';
}
function arrowShape(pt, s0, s1, w){
  const head = Math.min(44, (s1-s0)*0.42), sh = s1 - head;
  return poly(samples(pt, s0, sh, w)
              .concat([pt(sh, w*1.7), pt(s1, 0), pt(sh, -w*1.7)])
              .concat(samples(pt, sh, s0, -w)), true);
}
function label(x, y, s, size, col, anchor, weight){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+(anchor||"middle")+
         '" font-size="'+(size||26)+'" font-weight="'+(weight||400)+'" fill="'+(col||MUTED)+'">'+s+'</text>';
}
function fade(o, body){
  return o <= 0.004 ? "" : '<g opacity="'+n2(o)+'">'+body+'</g>';
}

/* ---- the cassette ---------------------------------------------------
   One molecule, arc positions s along it; x = X0 + s when flat.      */
const X0 = 110, Y0 = 400, L = 1380, LOXW = 17, GENEW = 25;
const LOX = [                     /* kind, s0, s1 */
  ["P",  60, 110], ["2", 118, 168], ["N", 176, 226],
  ["P", 486, 536], ["2", 782, 832], ["N",1078,1128] ];
const GENES = [                   /* name, s0, s1, fluorescent */
  ["&#216;NFP", 250, 440, false], ["mOrange2", 556, 736, true],
  ["EGFP",      852,1032, true],  ["mKate2",  1148,1328, true] ];
const PA = [462, 758, 1054, 1350];
/* a pair is cut at the END of its first site and the END of its second,
   so the left piece keeps one site and the circle carries the other */
const PAIRS = { P:[110, 536], "2":[168, 832], N:[226, 1128] };
const MADE  = { P:1, "2":2, N:3 };          /* index into GENES */
const COLOUR = { P:"orange", "2":"green", N:"red" };

function promoter(x, y){
  return '<path d="M'+n2(x)+' '+n2(y)+'V'+n2(y-44)+'H'+n2(x+34)+'" fill="none" stroke="'+INK+
         '" stroke-width="3.6" stroke-linejoin="round"/>' +
         '<path d="M'+n2(x+24)+' '+n2(y-54)+'L'+n2(x+38)+' '+n2(y-44)+'L'+n2(x+24)+' '+n2(y-34)+
         '" fill="none" stroke="'+INK+'" stroke-width="3.6" stroke-linejoin="round"/>' +
         label(x+4, y+54, "Thy1", 27, INK, "middle", 700);
}

/* Draw the cassette with pair `k` (or none) excised to fraction t.
   lit: 0..1, how far the newly expressed gene has filled in.
   withCircle: false drops the excised circle (the summary rows). */
function cassette(k, t, lit, y, withCircle){
  let g = "";
  const cut = k ? PAIRS[k] : [L, L], a = cut[0], b = cut[1], len = b - a;
  const pL = curve(a, 0, 1, X0 + a/2, y);
  /* Every excised circle is DRAWN at radius 115, whatever its length:
     the loxP circle (426 long) would crumple its own gene arrow at true
     size and the loxN one (902) would run into the caption.  k scales
     the drawing only, as in recombinase.js, and is 1 while flat. */
  const kC = 1 + t*(115/(len/(2*Math.PI)) - 1);
  const pM = len > 0 ? curve(len, t, kC, X0 + a + len/2, y + 80*t) : null;
  const pR = curve(L - b, 0, 1, X0 + b + (L-b)/2 - len*t, y);
  /* which piece an element at [s0,s1] rides on, and its local s */
  function at(s0, s1){
    if (s1 <= a) return [pL, 0];
    if (s0 >= b) return [pR, b];
    return withCircle ? [pM, a] : null;
  }

  g += strand(pL, 0, a);
  if (pM && withCircle) g += strand(pM, 0, len);
  if (L - b > 0) g += strand(pR, 0, L - b);

  PA.forEach(function(s){
    const p = at(s, s); if (!p) return;
    const q0 = p[0](s - p[1], -12), q1 = p[0](s - p[1], 12), c = p[0](s - p[1], 34);
    g += '<path d="M'+n2(q0[0])+' '+n2(q0[1])+'L'+n2(q1[0])+' '+n2(q1[1])+'" stroke="'+INK+'" stroke-width="3"/>' +
         label(c[0], c[1] + 8, "pA", 23, INK);
  });
  LOX.forEach(function(x){
    const p = at(x[1], x[2]); if (!p) return;
    const s0 = x[1] - p[1], s1 = x[2] - p[1], c = p[0]((s0+s1)/2 - 6, 0);
    g += '<path d="'+arrowShape(p[0], s0, s1, LOXW)+'" fill="'+BLUE+'"/>' +
         label(c[0], c[1] + 9, x[0], 25, "#fff", "middle", 700);
  });
  GENES.forEach(function(x, i){
    const p = at(x[1], x[2]); if (!p) return;
    const s0 = x[1] - p[1], s1 = x[2] - p[1], c = p[0]((s0+s1)/2 - 8, 0);
    const on = k && MADE[k] === i ? lit : 0;
    const d = arrowShape(p[0], s0, s1, GENEW);
    g += '<path d="'+d+'" fill="#fff" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/>';
    if (on > 0.004) g += '<path d="'+d+'" fill="'+VERM+'" opacity="'+n2(on)+'"/>';
    /* the label turns white as the fill comes in, so it never sits
       ink-on-vermillion or white-on-white */
    const col = on > 0.5 ? "#fff" : INK;
    g += label(c[0], c[1] + 9, x[0], 25, col, "middle", 700);
  });
  g += promoter(X0 + 18, y);
  return g;
}

function makeSvg(){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML = '<g data-r="dyn"></g>' +
    '<text data-r="cap" x="800" y="232" text-anchor="middle" font-weight="700" font-size="31" fill="'+INK+'"></text>' +
    '<text data-r="sub" x="800" y="812" text-anchor="middle" font-size="26" fill="'+MUTED+'"></text>';
  return svg;
}

window.Deck.sequence("brainbow", function(slide){
  const svg = makeSvg();
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const KEYS = ["o0","oP","tP","o2","t2","oN","tN","oS"];
  /* o* keys are scene opacities, t* keys are how far that scene's
     excision has run.  In a click the opacities move in the first third
     and the excision in the last two thirds, so each outcome reads as
     "a fresh copy, then Cre" rather than one picture dissolving into
     another mid-cut.  See the tween in go(). */
  function paint(s){
    let g = fade(s.o0, cassette(null, 0, 0, Y0, true));
    [["P","oP","tP"],["2","o2","t2"],["N","oN","tN"]].forEach(function(q){
      const t = s[q[2]];
      g += fade(s[q[1]], cassette(q[0], t, smooth(t, 0.8, 1), Y0, true));
    });
    if (s.oS > 0.004){
      let rows = "";
      ["P","2","N"].forEach(function(k, i){
        const y = 330 + i*170;
        rows += cassette(k, 1, 1, y, false) +
                label(1210, y + 9, "&#8594;  " + COLOUR[k], 30, INK, "start", 700);
      });
      g += fade(s.oS, rows);
    }
    r.dyn.innerHTML = g;
  }

  const S = [
    { s:{o0:1,oP:0,tP:0,o2:0,t2:0,oN:0,tN:0,oS:0},
      cap:"one promoter, three pairs of lox sites, three fluorescent proteins",
      sub:"as built, the promoter reads into a non-fluorescent protein, so the neuron is dark",
      note:"So how do you get a hundred colours out of three proteins? This is the construct, Brainbow 3.1. A Thy1 promoter, which is on in neurons. Then three different lox sites in a row: loxP, lox2272 and loxN. Cre will only recombine a site with another site of the same kind, so these three never react with each other. Then a protein that does not fluoresce, with a stop after it. Then the three fluorescent proteins, mOrange2, EGFP and mKate2, each one sitting just after the second copy of one of the lox sites. As built, the promoter reads into the dark protein and stops, so before Cre the neuron makes no colour at all.",
      desc:"A cassette drawn on a DNA line: a promoter labelled Thy1; three lox sites in a row marked P, 2 and N; a non-fluorescent gene, ØNFP, then a polyA stop; then a P site, mOrange2 and pA; a 2 site, EGFP and pA; and an N site, mKate2 and pA. Every lox arrow points right." },

    { s:{o0:0,oP:1,tP:1,o2:0,t2:0,oN:0,tN:0,oS:0},
      cap:"Cre pairs the two loxP sites  →  mOrange2",
      sub:"one lox2272 and one loxN are left with no partner, so this copy can never change again",
      note:"Now add Cre. Say it happens to pair the two loxP sites. Everything between them, the dark protein and its stop, is cut out as a circle, and now the promoter reads straight into mOrange2. Look at what is left behind: one lox2272 and one loxN, and neither has a partner anymore. So this copy is locked. That is excision, the same reaction as cutting out a floxed stop cassette. Nothing flips.",
      desc:"The segment between the two P sites, carrying ØNFP and its stop, curls off the line into a closed circle below. The line closes up so that Thy1 now sits right before mOrange2, which fills in vermillion. One 2 site and one N site remain, each now alone." },

    { s:{o0:0,oP:0,tP:1,o2:1,t2:1,oN:0,tN:0,oS:0},
      cap:"or the two lox2272 sites  →  EGFP",
      sub:"a longer piece leaves, taking mOrange2 with it",
      note:"In a different copy, Cre might pair the two lox2272 sites instead. Now a longer piece comes out, and it takes the mOrange2 gene with it. The promoter reads into EGFP.",
      desc:"A fresh copy of the cassette. This time the segment between the two 2 sites curls off as a larger circle, carrying ØNFP, the P site and mOrange2. Thy1 now sits before EGFP, which fills in vermillion." },

    { s:{o0:0,oP:0,tP:1,o2:0,t2:1,oN:1,tN:1,oS:0},
      cap:"or the two loxN sites  →  mKate2",
      sub:"which pair Cre uses is chance",
      note:"Or it pairs the loxN sites, the biggest deletion of the three, and that copy makes mKate2. Which pair gets used in any one copy is down to chance.",
      desc:"A fresh copy again. The segment between the two N sites curls off as the largest circle, carrying everything up to mKate2. Thy1 now sits before mKate2, which fills in vermillion." },

    { s:{o0:0,oP:0,tP:1,o2:0,t2:1,oN:0,tN:1,oS:1},
      cap:"three possible products from one cassette",
      sub:"each neuron carries several copies, each copy chooses on its own, and the mix sets the hue",
      note:"So one copy gives you one of three colours. The trick is that each neuron carries several copies of the cassette, and every copy makes its own choice. Two orange and one red is a different hue from one of each. It is the ratio of the three proteins that gives each neuron its own colour, and that is what you are about to see.",
      desc:"The three possible products stacked in rows, each with Thy1 directly before one filled gene: mOrange2, labelled orange; EGFP, labelled green; and mKate2, labelled red." }
  ];

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, raf = null;
  function go(i, animated){
    const to = S[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.cap.textContent = S[i].cap;
    r.sub.textContent = S[i].sub;
    if (!cur || animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 1800;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now-t0)/dur), s = {};
      const eO = smooth(t, 0, 0.35), eT = ease(clamp01((t - 0.35)/0.65));
      KEYS.forEach(k => s[k] = from[k] + (to[k]-from[k])*(k[0] === "o" ? eO : eT));
      paint(s); cur = s;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
