/* ------------------------------------------------------------------ *
 * 03-pca.js : PCA, the design half.  Slide 19 of the source deck.
 *
 * Registers:  gs-pca   the gene -> break it into overlapping oligos ->
 *                      add the two external oligos -> order all six
 *                                                            (4 steps)
 *
 * This is the first of two PCA slides and it never runs a reaction.
 * Everything here happens at a desk: you take the sequence you want,
 * you decide where to cut it, you notice you need two more oligos than
 * you thought, and you paste the lot into an order form.  The slide
 * after it is the tube.  Splitting them that way is what lets each
 * drawing be one thing; the two used to animate the same reaction
 * twice.
 *
 * The frame is 03-lca.js's frame, to the pixel where it can be: same
 * x 320 to 1380, same 3.4 stroke, same 24 px half barb, same bold
 * caption at y 690 with its grey second line at 740.  LCA is five
 * slides earlier and is the same job done with a ligase, so the two
 * drawings should be recognisably one drawing done two ways.  What
 * differs is the cut: LCA tiles BOTH strands completely and every
 * junction is a nick, and PCA alternates the strands and leaves a gap
 * opposite every junction.  Those gaps are the whole reason a
 * polymerase is in the tube on the next slide, so they are drawn
 * honestly here rather than tidied away.
 *
 * FOUR assembly oligos, not eight.  The storyboard puts the full-length
 * product two cycles after the reaction starts, and 4 -> 2 -> 1 is the
 * only pool that gets there: eight would need a third round the
 * storyboard does not have.  So the target is 2.8 oligo lengths long,
 * which is a short synthon, and the arithmetic on the slide is true.
 *
 * Colour, one meaning each:
 *   ink         ordered as an oligo.  Everything on this slide is ink,
 *               because nothing here has been in a tube yet
 *   vermillion  a homology region: the stretch two oligos share, which
 *               is what makes them find each other.  The same red
 *               seq/05-soeing.js and seq/05-gibson.js use
 *   muted       labels
 *
 * Half barb at every 3' end, never an arrowhead.  The one full head on
 * the slide is the process arrow into the supplier, which is not DNA.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", VERM = "#ba3a13", MUTED = "#767676";

const n2 = v => Math.round(v*10)/10;
const lerp = (a, b, t) => a + (b-a)*t;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

/* ---- the frame, borrowed from 03-lca.js ----------------------------- */
const XA = 320, XB = 1380;           /* the target, end to end          */
const SPAN = 2.8;                    /* how long it is, in oligos       */
const U = (XB - XA)/SPAN;
const X = u => XA + u*U;

const OT = 440, OB = 500;            /* the annealed duplex             */
const EF = 356, ER = 584;            /* the two external oligos         */
const SW = 3.4, BARB = 24, BW = 0.49;

/* ---- the order form ------------------------------------------------- */
const LX = 300, LEN = 300;           /* left edge, and px per oligo      */
const LY = [286, 352, 418, 484, 550, 616];
const BOXL = 900, BOXR = 1330, BOXT = 371, BOXB = 531;

/* ---- the design ------------------------------------------------------
   Forward and reverse in turn, each overlapping its neighbour by 0.4 of
   an oligo.  u5 is where the strand's 5' end sits on the target; u3c is
   its 3' end before and after the cut, because at step 0 the two halves
   of a strand still meet and only separate as the target is broken up.
   Both top oligos give ground at their RIGHT end and both bottom ones at
   their LEFT, which is to say every gap that opens is on the 3' side of
   an oligo: exactly the ground a polymerase can make up later. */
const OL = [
  { a:0,    b:1,    fwd:true,  u5:0,    u3c:[1.2,  1.0], y:OT },
  { a:0.6,  b:1.6,  fwd:false, u5:1.6,  u3c:[0,    0.6], y:OB },
  { a:1.2,  b:2.2,  fwd:true,  u5:1.2,  u3c:[2.8,  2.2], y:OT },
  { a:1.8,  b:2.8,  fwd:false, u5:2.8,  u3c:[1.6,  1.8], y:OB },
  { a:0,    b:0.55, fwd:true,  u5:0,    u3c:[0.55, 0.55], y:EF, ext:true },
  { a:2.25, b:2.8,  fwd:false, u5:2.8,  u3c:[2.25, 2.25], y:ER, ext:true }
];
/* the three stretches two oligos share */
const HOM = [[0.6, 1.0], [1.2, 1.6], [1.8, 2.2]];
/* o1 and o4 end mid-molecule, so their barbs only exist once it is cut */
const INNER = [true, false, false, true, false, false];

/* ---- primitives ----------------------------------------------------- */
function fade(o, body){
  return (o <= 0.004 || !body) ? "" : '<g opacity="'+n2(o)+'">'+body+'</g>';
}
function stroke(d, col, w){
  return d ? '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+(w||SW)+
             '" stroke-linecap="round"/>' : "";
}
function txt(x, y, s, size, col, weight, anchor){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+(anchor||"middle")+
         '" font-family="inherit" font-size="'+size+'" font-weight="'+(weight||400)+
         '" fill="'+col+'">'+s+'</text>';
}
function seg(x1, x2, y){
  return Math.abs(x2-x1) < 0.8 ? "" : "M"+n2(x1)+" "+n2(y)+"L"+n2(x2)+" "+n2(y);
}
/* 03-lca.js's barb, angle and all: laid back along the strand, up for a
   line running right and down for one running left */
function barbAt(x5, x3, y){
  if (Math.abs(x3-x5) < 0.8) return "";
  const th = Math.atan2(0, x5-x3);
  return "M"+n2(x3 + BARB*Math.cos(th + BW))+" "+n2(y + BARB*Math.sin(th + BW))+
         "L"+n2(x3)+" "+n2(y);
}

/* One oligo.  It is given its own 5' and 3' ends BOTH in target units
   (u5, u3) and in screen x (x5, x3), so the same call draws it lying on
   the target and lying in a list, and the red lands in the right place
   either way: the homology is written in target units and mapped through
   whatever the two ends currently are. */
function oligo(u5, u3, x5, x3, y, red, barbOp){
  const map = u => x5 + (u - u5)/(u3 - u5)*(x3 - x5);
  const lo = Math.min(u5, u3), hi = Math.max(u5, u3);
  let g = stroke(seg(x5, x3, y), INK);
  if (red > 0.004){
    let d = "";
    HOM.forEach(function(h){
      const a = Math.max(lo, h[0]), b = Math.min(hi, h[1]);
      if (b - a > 0.004) d += seg(map(a), map(b), y);
    });
    g += fade(red, stroke(d, VERM));
  }
  g += fade(barbOp, stroke(barbAt(x5, x3, y), INK));
  return g;
}

/* ---- the scene -------------------------------------------------------
   cut   0 one whole molecule,   1 broken into four overlapping oligos
   olig  0                       1 the two external oligos are on
   list  0 lying on the target,  1 six lines on an order form.  It runs
         in two halves: to 0.55 every oligo travels to its row and takes
         its list length, and after that the two reverse oligos and the
         reverse external turn over to be written 5' to 3' like the
         rest.  The turn is a crossfade rather than a rotation because a
         300 px line rotating through vertical crosses three rows. */
function scene(s){
  const p1 = clamp01(s.list/0.55), p2 = clamp01((s.list - 0.55)/0.45);
  let g = "";

  OL.forEach(function(o, k){
    const alpha = o.ext ? Math.max(s.olig, p1) : 1;
    if (alpha <= 0.004) return;

    const u3 = lerp(o.u3c[0], o.u3c[1], s.cut);
    const ax5 = X(o.u5), ax3 = X(u3);
    const len = (o.b - o.a)*LEN;
    const rx5 = o.fwd ? LX : LX + len, rx3 = o.fwd ? LX + len : LX;

    const x5 = lerp(ax5, rx5, p1), x3 = lerp(ax3, rx3, p1);
    const y  = lerp(o.y, LY[k], p1);
    const bop = INNER[k] ? clamp01(s.cut*5) : 1;

    if (o.fwd){
      g += fade(alpha, oligo(o.u5, u3, x5, x3, y, s.cut, bop));
    } else {
      g += fade(alpha*(1 - p2), oligo(o.u5, u3, x5, x3, y, s.cut, bop));
      g += fade(alpha*p2, oligo(o.u5, u3, LX, LX + len, LY[k], s.cut, bop));
    }
  });

  /* what it is, while it is still lying on the target */
  g += fade(1 - clamp01(s.list*2.4),
        txt(XA, 300, "Target sequence", 24, MUTED, 400, "start"));
  g += fade(s.olig*(1 - clamp01(s.list*2.4)),
        txt(X(0.55) + 22, EF + 8, "external oligos", 24, MUTED, 400, "start"));

  /* the order form: every oligo written 5' to 3', and a plain box to
     send it to.  The box is deliberately generic and the vendor is a
     word inside it, so a change of supplier is a change of one string. */
  if (p2 > 0.004){
    let lab = "";
    OL.forEach(function(o, k){
      const len = (o.b - o.a)*LEN;
      lab += txt(LX - 16, LY[k] + 8, "5&#8242;", 22, MUTED, 700, "end");
      lab += txt(LX + len + 20, LY[k] + 8, "3&#8242;", 22, MUTED, 700, "start");
    });
    lab += '<path d="M700 451H852" fill="none" stroke="'+MUTED+'" stroke-width="4" ' +
             'marker-end="url(#gsPcaHead)"/>' +
           txt(776, 429, "order", 22, MUTED, 400);
    lab += '<rect x="'+BOXL+'" y="'+BOXT+'" width="'+(BOXR-BOXL)+'" height="'+(BOXB-BOXT)+
             '" rx="12" fill="none" stroke="'+MUTED+'" stroke-width="3"/>' +
           txt((BOXL+BOXR)/2, 452, "Oligo supplier", 30, INK, 700) +
           txt((BOXL+BOXR)/2, 496, "IDT", 24, MUTED, 400);
    g += fade(p2, lab);
  }

  if (s.label) g += txt(800, 690, s.label, 30, INK, 700);
  if (s.sub)   g += txt(800, 740, s.sub, 26, MUTED, 400);
  return g;
}

const KEYS = ["cut", "olig", "list"];
const S = [
{ s:{cut:0, olig:0, list:0},
  label:"Start with the gene you want to synthesize",
  sub:"one double-stranded target, and nothing yet about how to build it",
  desc:"One double-stranded DNA running the width of the slide, labelled target sequence. The top strand runs left to right with a half barb at its right-hand 3-prime end and the bottom strand runs the other way, barbed at the left. This is the whole gene and it is the only thing on the slide." },

{ s:{cut:1, olig:0, list:0},
  label:"Break it into overlapping oligos",
  sub:"still in register, and the vermillion is what every pair shares",
  desc:"The same duplex, now divided into four oligos and still annealed in register: two on the top strand and two on the bottom, laid alternately so that no break on one strand faces a break on the other. Each oligo has given ground at its own 3-prime end, so a short single-stranded gap now sits opposite every junction. The three stretches where a top oligo and a bottom oligo overlap are drawn in vermillion: those homology regions are what will make each pair find the other." },

{ s:{cut:1, olig:1, list:0},
  label:"You also need two external oligos",
  sub:"one at each end of the target, for the PCR that comes after",
  desc:"Two more oligos appear at the positions they anneal to: a short forward one above the left end of the top strand, and a short reverse one below the right end of the bottom strand. Both are set well clear of the duplex so they read as separate molecules, and both are drawn in the same solid ink, because they are ordered like everything else." },

{ s:{cut:1, olig:1, list:1},
  label:"Order all six",
  sub:"each one written 5&#8242; to 3&#8242;, which is what goes on the order form",
  desc:"The annealed picture comes apart. All six oligos leave the target and stack up as a list of six separate single strands, each turned so it reads 5-prime to 3-prime from left to right and each labelled at both ends. They keep their vermillion, so you can still see which of them shares sequence with which. An arrow labelled order leads from the list to a plain box: an oligo supplier, named IDT." }
];

window.Deck.sequence("gs-pca", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML =
    '<defs><marker id="gsPcaHead" viewBox="0 0 10 10" refX="9" refY="5" ' +
      'markerWidth="6" markerHeight="6" orient="auto">' +
      '<path d="M0 0 L10 5 L0 10 Z" fill="'+MUTED+'"/></marker></defs>' +
    '<g data-r="dyn"></g>';
  slide.appendChild(svg);
  const dyn = svg.querySelector('[data-r="dyn"]');

  let cur = null, raf = null;
  function paint(i, v){
    const t = { label:S[i].label, sub:S[i].sub };
    KEYS.forEach(k => t[k] = clamp01(v[k]));
    dyn.innerHTML = scene(t);
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
  /* Source slide 19 carries no speaker notes at all, so every step here
     has an empty one.  Nothing is invented to fill them. */
  return { steps: S.map(x => ({ note:"", desc:x.desc })), go: go };
});

})();
