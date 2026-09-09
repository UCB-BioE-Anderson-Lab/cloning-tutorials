/* ------------------------------------------------------------------ *
 * 05-invivo.js: in vivo recombination.  Source slide 42.
 *
 * The source slide is seven bullets, and the first four of them are a
 * workflow in order: design the oligos, make the cassettes, transform,
 * recombine.  This section has already set two workflows as flows,
 * seq/05-soeing.js and seq/05-gibson.js, and this slide sits between
 * them and the end of the section, so it is set as the third member of
 * that family rather than as a ninth list.  The four bullet strings are
 * the drawing's captions, word for word.  The three bullets that are not
 * steps stay bullets in the section file, under the drawing, and so does
 * the PNAS citation.
 *
 * Same frame as its two siblings, on purpose: one band across the width
 * that goes through the stages, a duplex drawn as two antiparallel
 * lines 58 px apart at this lecture's 5 px backbone weight, a half barb
 * laid back along its own strand at every 3' end, and the shared
 * terminal homology in vermillion wherever a strand still carries it.
 * The room has seen that red mean "the same sequence, on both" for four
 * slides running; it means it here too.
 *
 *   left cassette    190 .......... 740      shared 110 px = 630..740
 *   right cassette          860 .......... 1410     shared = 860..970
 *
 * and inside the cell the same scene at KMIN, 349 .......... 1251.
 *
 * Colour, one meaning each, and the same key seq/05-soeing.js uses:
 *   blue        the left cassette, both its strands
 *   ink         the right cassette, and the cell
 *   vermillion  the shared terminal homology
 * Two colours for the two cassettes is what makes the last beat read:
 * when they slide together, the product is visibly half of each.  The
 * cell is ink because it is context: the yeast was already there, and
 * nothing about this slide asks you to look at it.  There is no process
 * arrow on this slide, so no full arrowhead appears anywhere; every
 * head here is a 3' half barb.
 *
 * Geometry.  Writing OVW for the shared region, the join is one
 * symmetric slide: each cassette moves 115*k inward until the two red
 * stretches land on each other, leaving one duplex 434..1166 with the
 * red in the middle and only its two outer 3' barbs left.  The cell
 * shrinks the whole scene about x=800 by KMIN so the membrane clears
 * the DNA; the drawing therefore has to fit in the FREE frame, and the
 * in-cell frame comes free.
 *
 * The band lives in y 182..512.  Above it is the h1, which ends at 152;
 * below it are the three remaining bullets and the citation, which
 * .tail pins to the foot of the slide and which start at 584.  The
 * caption sits 22 px under the membrane, so it reads as the drawing's
 * own line and not as a fourth bullet.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const lerp = (a, b, t) => a + (b-a)*t;

/* ---- the free frame ------------------------------------------------- */
const L0 = 190, L1 = 740;            /* left cassette                     */
const R0 = 860, R1 = 1410;           /* right cassette                    */
const OVW = 110;                     /* the shared homology, on both ends */
const PRIMER = 150;                  /* an oligo, before it is extended   */

const YT = 293, YB = 351;            /* the two strands, centre 322       */
const SW = 5, BARB = 28, BW = 0.49;

/* ---- the in-cell frame ---------------------------------------------- */
const CX = 800;                      /* everything scales about here      */
const KMIN = 0.74;                   /* 190..1410 becomes 349..1251       */
const CELLRX = 560, CELLRY = 140, CELLCY = 322;   /* x 240..1360, y 182..462 */
const CAPY = 504;

/* ---- primitives ------------------------------------------------------ */
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
/* Half barb at a 3' tip, laid back along its own strand.  A 3' end takes
   a half barb; the full head is reserved for a process arrow, and this
   slide has none. */
function barbAt(xFrom, xTip, y, up){
  if (Math.abs(xTip-xFrom) < 1) return "";
  const back = xFrom > xTip ? 1 : -1;
  return "M"+n2(xTip + BARB*Math.cos(BW)*back)+" "+
             n2(y + BARB*Math.sin(BW)*(up ? -1 : 1))+"L"+n2(xTip)+" "+n2(y);
}
/* the part of [lo,hi] a strand spanning [a,b] still covers */
function clipSeg(a, b, lo, hi, y){
  const x1 = Math.max(lo, Math.min(a,b)), x2 = Math.min(hi, Math.max(a,b));
  return x2 - x1 < 1 ? "" : seg(x1, x2, y);
}

/* One strand.  x5 and x3 are its own 5' and 3' termini in FINAL slide
   coordinates, and ovL/ovR the shared region in the same coordinates, so
   the red and the barb land the right way round however the strand is
   drawn and wherever the scene has been shifted to.  barbOp fades the
   barb out when the end it marks stops being an end. */
function strand(x5, x3, y, col, up, ovL, ovR, barbOp){
  let g = stroke(seg(x5, x3, y), col);
  g += stroke(clipSeg(x5, x3, ovL, ovR, y), VERM);
  const tipRed = x3 >= ovL - 1 && x3 <= ovR + 1;
  const b = stroke(barbAt(x5, x3, y, up), tipRed ? VERM : col);
  g += barbOp >= 0.996 ? b : fade(barbOp, b);
  return g;
}

/* ---- the scene ------------------------------------------------------- *
 * ext   0 four oligos,        1 two full-length PCR cassettes
 * cell  0 in a tube,          1 inside a cell, and scaled to fit it
 * join  0 two molecules,      1 one, the two red stretches coincident   */
function scene(s){
  const k  = 1 - (1-KMIN)*s.cell;
  const X  = x => CX + (x - CX)*k;
  const dj = 115 * k * s.join;        /* what each cassette slides inward */

  let g = "";

  if (s.cell > 0.004){
    g += fade(s.cell, '<ellipse cx="'+CX+'" cy="'+CELLCY+'" rx="'+CELLRX+
              '" ry="'+CELLRY+'" fill="none" stroke="'+INK+
              '" stroke-width="'+SW+'"/>');
  }

  /* strand termini.  Each oligo is extended from its own 3' end to the
     far end of its template, which is the whole of what the first PCR
     does and is the same move seq/05-soeing.js polymerises with. */
  const lt5 = X(L0) + dj, lt3 = X(lerp(L0 + PRIMER, L1, s.ext)) + dj;
  const lb5 = X(L1) + dj, lb3 = X(lerp(L1 - PRIMER, L0, s.ext)) + dj;
  const rt5 = X(R0) - dj, rt3 = X(lerp(R0 + PRIMER, R1, s.ext)) - dj;
  const rb5 = X(R1) - dj, rb3 = X(lerp(R1 - PRIMER, R0, s.ext)) - dj;

  const lovL = X(L1 - OVW) + dj, lovR = X(L1) + dj;
  const rovL = X(R0) - dj,       rovR = X(R0 + OVW) - dj;

  /* The two INNER 3' ends stop being ends when the cassettes recombine;
     the two outer ones are the product's own ends and stay. */
  const inner = 1 - s.join;

  g += strand(lt5, lt3, YT, BLUE, true,  lovL, lovR, inner);
  g += strand(lb5, lb3, YB, BLUE, false, lovL, lovR, 1);
  g += strand(rt5, rt3, YT, INK,  true,  rovL, rovR, 1);
  g += strand(rb5, rb3, YB, INK,  false, rovL, rovR, inner);

  if (s.cap) g += txt(CX, CAPY, s.cap, 28, INK, 700);
  return g;
}

const KEYS = ["ext", "cell", "join"];
const S = [
  { s:{ext:0, cell:0, join:0},
    cap:"Design oligos just like SOEing / Gibson with 40bp or more homology",
    note:"Dan Gibson, of Gibson reaction fame, has also extensively developed yeast-based in vivo recombination.",
    desc:"Four oligos, drawn as short lines with a half barb at each 3-prime end, two of them blue and two black, sitting where the two cassettes will be. The two that face each other across the middle carry a red segment at their 5-prime ends: that is the forty or more bases both cassettes will end up sharing, and it is on the oligo because that is where you put it." },

  { s:{ext:1, cell:0, join:0},
    cap:"Make the individual PCR cassettes",
    note:"The design of the fragments for the assembly reaction is no different than with the other methods employing 40 bp or more homology between fragments, and the fragments are constructed from parallel PCR reactions.",
    desc:"Each oligo has run out to the far end of its template, so the four short lines are now two full double-stranded cassettes with a gap between them, the left one blue and the right one black. The red shared sequence is now on both strands at the right-hand end of the left cassette and at the left-hand end of the right one." },

  { s:{ext:1, cell:1, join:0},
    cap:"Transform them into yeast (preferred) or <tspan font-style=\"italic\">B. subtilus</tspan> or <tspan font-style=\"italic\">E. coli</tspan> containing the lambda red genes",
    note:"The mix of fragments is then introduced into yeast, B. subtilis, or lambda-red-expressing E. coli wherein they undergo homologous recombination.",
    desc:"A large oval has closed around both cassettes, which have shrunk to fit inside it. That oval is the cell. Nothing about the DNA has changed: the same two molecules, with the same red ends and the same gap between them, are now in a cell rather than in a tube." },

  { s:{ext:1, cell:1, join:1},
    cap:"Recombination <tspan font-style=\"italic\">in vivo</tspan> results in assembly",
    note:"Yeast homologous recombination is currently claimed to be the most robust homology-based assembly method. It’s main drawback is that it employs cells which slow the process down somewhat. To use Yeast, you must wait for yeast to grow which takes longer than E. coli.",
    desc:"Inside the cell the two cassettes have slid together until their red stretches lie on top of each other, and the two inner 3-prime barbs have gone because those positions are no longer ends. What is left is one continuous double-stranded molecule with the shared sequence in the middle of it, blue on the left half and black on the right, and a 3-prime barb at each of its two outer ends." }
];

window.Deck.sequence("invivo", function(slide){
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
    KEYS.forEach(key => t[key] = clamp01(v[key]));
    dyn.innerHTML = scene(Object.assign({ cap:S[i].cap }, t));
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
      KEYS.forEach(key => v[key] = from[key] + (to[key] - from[key])*e);
      paint(i, v); cur = v;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
