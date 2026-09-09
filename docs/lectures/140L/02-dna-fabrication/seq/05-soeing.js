/* ------------------------------------------------------------------ *
 * 05-soeing.js — SOEing, splicing by overlap extension.  Source slide 29.
 *
 * The original is four stacked panels of coloured PowerPoint arrows —
 * two duplexes, then the same DNA denatured, then annealed, then
 * polymerised — with the stage named beside a white arrow between each
 * pair.  The speaker notes walk those stages in order, so here it is one
 * band that goes through them instead of four bands that sit there: the
 * strands separate, two of the four find each other, and the polymerase
 * runs.  That frees the whole width for a single set of molecules.
 *
 * The frame is deliberately the same one seq/05-gibson.js uses:
 *
 *   fragment A     220 .......... 880     shared homology = 720..880
 *   fragment B            720 .......... 1380
 *
 * They are the same design.  A Gibson junction and a SOEing junction are
 * both "put the same 20 to 40 bases on the end of both fragments"; only
 * the enzymes differ.  Drawing them on the same frame is the cheapest
 * way to say so.
 *
 * Colour, one meaning each:
 *   blue        fragment A, both its strands
 *   ink         fragment B, both its strands
 *   vermillion  the shared terminal homology, on whichever strand still
 *               carries it — the same red seq/05-gibson.js uses
 *   amber       DNA that was not in the tube at the start: what the
 *               polymerase adds, and the two external oligos it adds it
 *               from.  Amber is stroke here and never text; it measures
 *               3.1:1 on white, which passes for a 5px line and fails
 *               for a label.
 *
 * Every 3' end takes a half barb laid back along its own strand; every
 * 5' end is labelled.  That is the only way the annealing step reads:
 * what makes ONE of the four possible pairings productive is that it,
 * alone, puts a recessed 3' end on a template.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13",
      AMBER = "#a99011", MUTED = "#767676";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const lerp = (a, b, t) => a + (b-a)*t;

/* ---- the frame ------------------------------------------------------ */
const AL = 220, AR = 880;            /* fragment A */
const BL = 720, BR = 1380;           /* fragment B */
const OVL = 720, OVR = 880;          /* the shared homology */
const SEP = 100;                     /* half the separation, un-annealed */

const YT = 528, YB = 578;            /* the duplex */
const Y1 = 452, Y2 = 654;            /* where the strands go when melted */
const SW = 5, BARB = 28, BW = 0.49;

/* ---- primitives ----------------------------------------------------- */
function fade(o, body){ return o <= 0.004 ? "" : '<g opacity="'+n2(o)+'">'+body+'</g>'; }
function txt(x, y, s, size, col, weight, anchor){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+(anchor||"middle")+
         '" font-family="inherit" font-size="'+size+'" font-weight="'+(weight||400)+
         '" fill="'+col+'">'+s+'</text>';
}
function stroke(d, col, w){
  return d ? '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+(w||SW)+
             '" stroke-linecap="round" stroke-linejoin="round"/>' : "";
}
function seg(x1, x2, y){
  return Math.abs(x2-x1) < 1 ? "" : "M"+n2(x1)+" "+n2(y)+"L"+n2(x2)+" "+n2(y);
}
function barbAt(xFrom, xTip, y, up){
  if (Math.abs(xTip-xFrom) < 1) return "";
  const back = xFrom > xTip ? 1 : -1;
  return "M"+n2(xTip + BARB*Math.cos(BW)*back)+" "+
             n2(y + BARB*Math.sin(BW)*(up ? -1 : 1))+"L"+n2(xTip)+" "+n2(y);
}
function clipSeg(a, b, lo, hi, y){
  const x1 = Math.max(lo, Math.min(a,b)), x2 = Math.min(hi, Math.max(a,b));
  return x2 - x1 < 1 ? "" : seg(x1, x2, y);
}
function bracket(lo, hi, y){
  return stroke("M"+n2(lo)+" "+n2(y-16)+"V"+n2(y)+"H"+n2(hi)+"V"+n2(y-16), VERM, 3);
}

/* One strand.  x5 and x3 are its own 5' and 3' termini, already carrying
   whatever x offset its fragment has, and ovL/ovR are the shared region
   in the same offset coordinates — so the barb, the red and the 5' label
   all land the right way round however the strand is drawn. */
function strand(x5, x3, y, col, up, ovL, ovR){
  let g = stroke(seg(x5, x3, y), col);
  g += stroke(clipSeg(x5, x3, ovL, ovR, y), VERM);
  g += stroke(barbAt(x5, x3, y, up), (x3 >= ovL && x3 <= ovR) ? VERM : col);
  g += txt(x5 + (x5 < x3 ? -8 : 8), up ? y - 24 : y + 42,
           "5&#8242;", 26, MUTED, 700);
  return g;
}

/* ---- the scene ------------------------------------------------------- *
 * melt   0 duplexes,      1 four separate strands
 * pair   0                1 the productive two are back together, and
 *                           the fragments have converged horizontally
 * ext    0                1 the polymerase has run both ways
 * olig   0                1 the two external oligos are on
 * mark   the homology brackets, step 1 only                            */
function scene(s){
  const dA = -SEP*lerp(1, 0, s.pair), dB = SEP*lerp(1, 0, s.pair);
  const open = s.melt*(1 - s.pair);          /* the productive pair only */

  /* how far the polymerase has run */
  const at3 = lerp(AR, BR, s.ext);           /* A-top   3' runs right */
  const bt3 = lerp(BL, AL, s.ext);           /* B-bottom 3' runs left  */

  let g = "";

  /* the two strands that do not go on to make the product.  They anneal
     too, but that pairing leaves a 3' end hanging off each side with no
     template under it, so nothing can extend and it comes apart again. */
  const dead = (1 - 0.78*s.pair) * (1 - s.ext);
  g += fade(dead,
        strand(AR - SEP, AL - SEP, lerp(YB, Y2, s.melt), BLUE, false,
               OVL - SEP, OVR - SEP) +
        strand(BL + SEP, BR + SEP, lerp(YT, Y1, s.melt), INK, true,
               OVL + SEP, OVR + SEP));

  /* the productive pair: A's top strand and B's bottom strand */
  const yA = lerp(YT, Y1, open), yB = lerp(YB, Y2, open);
  g += stroke(seg(AL + dA, at3 + dA, yA), BLUE);
  g += stroke(seg(BR + dB, bt3 + dB, yB), INK);
  if (s.ext > 0.004){
    g += stroke(seg(AR + dA, at3 + dA, yA), AMBER);
    g += stroke(seg(BL + dB, bt3 + dB, yB), AMBER);
  }
  g += stroke(clipSeg(AL + dA, at3 + dA, OVL + dA, OVR + dA, yA), VERM);
  g += stroke(clipSeg(BR + dB, bt3 + dB, OVL + dB, OVR + dB, yB), VERM);
  g += stroke(barbAt(AL + dA, at3 + dA, yA, true),  s.ext > 0.02 ? AMBER : VERM);
  g += stroke(barbAt(BR + dB, bt3 + dB, yB, false), s.ext > 0.02 ? AMBER : VERM);
  g += txt(AL + dA - 8, yA - 24, "5&#8242;", 26, MUTED, 700);
  g += txt(BR + dB + 8, yB + 42, "5&#8242;", 26, MUTED, 700);

  /* the two external oligos, which is all the second PCR needs */
  if (s.olig > 0.004){
    g += fade(s.olig,
      stroke(seg(AL, AL + 180, yA - 36), AMBER, 4.6) +
      stroke(barbAt(AL, AL + 180, yA - 36, true), AMBER, 4.6) +
      stroke(seg(BR, BR - 180, yB + 36), AMBER, 4.6) +
      stroke(barbAt(BR, BR - 180, yB + 36, false), AMBER, 4.6));
  }

  if (s.mark > 0.004){
    g += fade(s.mark,
      bracket(OVL - SEP, OVR - SEP, YB + 58) +
      bracket(OVL + SEP, OVR + SEP, YB + 58) +
      txt(800, YB + 104, "20 to 40 bp of exact homology, on both", 30, VERM, 700));
  }
  if (s.stage) g += txt(130, 300, s.stage, 40, VERM, 700, "start");
  if (s.cap)   g += txt(800, 786, s.cap, 32, INK, 700);
  return g;
}

const KEYS = ["melt", "pair", "ext", "olig", "mark"];
const S = [
  { s:{melt:0, pair:0, ext:0, olig:0, mark:1},
    stage:"", cap:"two PCR products, made separately",
    note:"The most basic of these techniques is SOEing. In SOEing, there are two rounds of PCR. The first step is a conventional PCR to generate double-stranded linear products. For the second step to work, the linear products generated in the first step must share homology to one another on their termini. In the example shown, we have two such fragments. Typically the fragments share 20 to 40 bp of exact homology to one another on their ends.",
    desc:"Two separate double-stranded DNA molecules, one blue and one black, drawn as pairs of antiparallel lines with a half barb at each 3-prime end and each 5-prime end labelled. The right-hand end of the blue molecule and the left-hand end of the black one are drawn in red and bracketed underneath: the same twenty to forty bases are present in both." },

  { s:{melt:1, pair:0, ext:0, olig:0, mark:0},
    stage:"Denaturation", cap:"four single strands in one tube",
    note:"In the second step, several of these linear products are combined with two external oligonucleotides, and the fragments assemble into a full length product through PCR. During the assembly reaction, first the DNAs are denatured resulting in single stranded products.",
    desc:"Both duplexes have come apart. The four strands are now single, the two former top strands on an upper line and the two former bottom strands on a lower one, each still carrying its own 3-prime barb and 5-prime label, and the red shared sequence still marking one end of each." },

  { s:{melt:1, pair:1, ext:0, olig:0, mark:0},
    stage:"Annealing", cap:"only this pairing leaves a recessed 3&#8242; end on a template",
    note:"Though there are multiple ways these strands can reanneal to one another, only a few of these configurations results in a duplex with a recessed 3 prime end. One of these duplexes results from annealing of strands of the two template PCR products.",
    desc:"The top strand of the blue molecule and the bottom strand of the black one have come together through the red shared sequence, forming one long duplex whose two strands each stop short in the middle: each has a barbed 3-prime end sitting on the other strand as a template. The remaining two strands are shown faded above and below, because their pairing would leave both 3-prime ends hanging off the outside with nothing to copy." },

  { s:{melt:1, pair:1, ext:1, olig:0, mark:0},
    stage:"Polymerization", cap:"one full-length product, both strands complete",
    note:"The polymerase can extend that duplex to the full length double-stranded product.",
    desc:"New DNA in amber runs out from each recessed 3-prime end to the far end of its template. Both strands are now continuous and the molecule is one full-length duplex spanning the whole of both original fragments, with the red shared sequence buried in the middle of it." },

  { s:{melt:1, pair:1, ext:1, olig:1, mark:0},
    stage:"Amplification", cap:"and now two outer oligos amplify it, exponentially",
    note:"This full-length product can then undergo exponential amplification with the two supplied oligos. In this example, there are only two template fragments being joined together.",
    desc:"Two short amber oligos appear, one above the left end of the full-length product and one below its right end, each with a half barb at its 3-prime end pointing inward. These are the only two primers the second PCR needs, and from here the full-length molecule amplifies like any other template." }
];

window.Deck.sequence("soeing", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML = '<g data-r="dyn"></g>';
  slide.appendChild(svg);
  const dyn = svg.querySelector('[data-r="dyn"]');

  let cur = null, raf = null;
  function paint(i, v){
    const t = {};
    KEYS.forEach(k => t[k] = clamp01(v[k]));
    dyn.innerHTML = scene(Object.assign({ stage:S[i].stage, cap:S[i].cap }, t));
  }
  function go(i, animated){
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    const to = S[i].s;
    if (!cur || animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(i, cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 900;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0)/dur), e = ease(t), v = {};
      KEYS.forEach(k => v[k] = from[k] + (to[k] - from[k])*e);
      paint(i, v); cur = v;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
