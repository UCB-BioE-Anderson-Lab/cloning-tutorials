/* ------------------------------------------------------------------ *
 * 05-cassette.js — multiple site substitutions by SOEing.  Slide 30,
 * the one the source deck labels cassette mutagenesis and megaprimer
 * mutagenesis in the same breath.
 *
 * The source is a still: the target across the top with three red
 * crosses on it, and the four fragments staggered down the slide below
 * it.  What the still cannot show is the move that makes the design
 * work — the fragments are drawn at their true positions ON THE TARGET,
 * so bringing them all onto one line is the assembly.  Nothing is
 * rearranged; they just stop being on separate rows.  That is the whole
 * animation and it is the whole idea.
 *
 * Everything is measured off the target, which is the coordinate system
 * the room is being asked to think in:
 *
 *   target                   140 ................................ 1460
 *   homology + mutation      [358..508]  [544..694]  [1220..1370]
 *   fragment 1               140 ....... 508
 *   fragment 2                    358 ....... 694
 *   fragment 3                          544 ................. 1370
 *   fragment 4                                        1220 ..... 1460
 *
 * A red block is one 20 to 40 bp annealing region, and the mutation
 * rides in the middle of it — which is why adjacent fragments have to
 * share the whole block, cross and all.  Red is the shared sequence
 * here exactly as it is in 05-soeing.js and 05-gibson.js; the cross is
 * knocked out of it in white rather than being a fourth colour.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", VERM = "#ba3a13", AMBER = "#a99011", MUTED = "#767676";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const lerp = (a, b, t) => a + (b-a)*t;

/* ---- the frame ------------------------------------------------------ */
const TL = 140, TR = 1460;                 /* the target */
const BLK = [[358, 508], [544, 694], [1220, 1370]];
const Y_TARGET = 262;
const ROW = [392, 458, 524, 590];          /* the four fragments */
const Y_PDT = 712;
const FRAG = [                             /* [x0, x1, which blocks] */
  [TL,   508, [0]],
  [358,  694, [0, 1]],
  [544, 1370, [1, 2]],
  [1220, TR,  [2]]
];
const SW = 4.6, HALF = 11, BARB = 26, BW = 0.49;

/* ---- primitives ----------------------------------------------------- */
function fade(o, body){ return o <= 0.004 ? "" : '<g opacity="'+n2(o)+'">'+body+'</g>'; }
function txt(x, y, s, size, col, weight, anchor){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+(anchor||"middle")+
         '" font-family="inherit" font-size="'+size+'" font-weight="'+(weight||400)+
         '" fill="'+col+'">'+s+'</text>';
}
function stroke(d, col, w, dash){
  return d ? '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+(w||SW)+
             '" stroke-linecap="round"'+(dash ? ' stroke-dasharray="'+dash+'"' : '')+'/>' : "";
}
function seg(x1, x2, y){ return "M"+n2(x1)+" "+n2(y)+"L"+n2(x2)+" "+n2(y); }
function barbAt(xFrom, xTip, y, up){
  const back = xFrom > xTip ? 1 : -1;
  return "M"+n2(xTip + BARB*Math.cos(BW)*back)+" "+
             n2(y + BARB*Math.sin(BW)*(up ? -1 : 1))+"L"+n2(xTip)+" "+n2(y);
}
function downArrow(x, y0, y1){
  return '<path d="M'+n2(x)+' '+n2(y0)+'L'+n2(x)+' '+n2(y1)+'" fill="none" stroke="'+
         INK+'" stroke-width="'+SW+'" stroke-linecap="round"/>' +
         '<path d="M'+n2(x)+' '+n2(y1)+'L'+n2(x-12)+' '+n2(y1-23)+'L'+n2(x+12)+' '+
         n2(y1-23)+'Z" fill="'+INK+'"/>';
}

/* one duplex: two lines, with the shared blocks laid over both of them
   and the mutation knocked out of each block in white */
function bar(x0, x1, y, blocks){
  let g = stroke(seg(x0, x1, y - HALF), INK) + stroke(seg(x0, x1, y + HALF), INK);
  blocks.forEach(function(i){
    const b = BLK[i], lo = Math.max(x0, b[0]), hi = Math.min(x1, b[1]);
    if (hi - lo < 2) return;
    g += '<rect x="'+n2(lo)+'" y="'+n2(y - HALF - 4)+'" width="'+n2(hi-lo)+
         '" height="'+n2(HALF*2 + 8)+'" rx="4" fill="'+VERM+'"/>';
    const cx = (b[0]+b[1])/2;
    if (cx > lo + 8 && cx < hi - 8){
      g += stroke("M"+n2(cx-9)+" "+n2(y-9)+"L"+n2(cx+9)+" "+n2(y+9), "#ffffff", 4.4);
      g += stroke("M"+n2(cx+9)+" "+n2(y-9)+"L"+n2(cx-9)+" "+n2(y+9), "#ffffff", 4.4);
    }
  });
  return g;
}

/* ---- the scene ------------------------------------------------------- *
 * show  the four fragments and the two outer oligos coming in
 * tie   the dashed ties that say which block is shared with which
 * join  0 fragments on their own rows, 1 all of them on the product line */
function scene(s){
  let g = txt(TL, 236, "target sequence", 28, MUTED, 400, "start");
  g += bar(TL, TR, Y_TARGET, [0, 1, 2]);

  if (s.show > 0.004){
    g += fade(s.show, downArrow(250, 294, 368) +
                      txt(276, 342, "four PCRs", 28, INK, 700, "start"));
    const ys = FRAG.map((f, i) => lerp(ROW[i], Y_PDT, s.join));
    /* the ties go first so the fragments sit on top of them */
    if (s.tie > 0.004 && s.join < 0.5){
      let t = "";
      [[0,1,0], [1,2,1], [2,3,2]].forEach(function(p){
        const b = BLK[p[2]];
        [b[0], b[1]].forEach(function(x){
          t += stroke("M"+n2(x)+" "+n2(ys[p[0]] + HALF + 4)+"L"+n2(x)+" "+
                      n2(ys[p[1]] - HALF - 4), VERM, 2.6, "7 7");
        });
      });
      g += fade(s.tie * (1 - s.join*2), t);
    }
    FRAG.forEach(function(f, i){
      g += fade(s.show, bar(f[0], f[1], ys[i], f[2]));
    });
    /* the two external oligos, the only primers the assembly PCR needs */
    g += fade(s.show,
      stroke(seg(TL, TL + 170, ys[0] - HALF - 26), AMBER) +
      stroke(barbAt(TL, TL + 170, ys[0] - HALF - 26, true), AMBER) +
      stroke(seg(TR, TR - 170, ys[3] + HALF + 26), AMBER) +
      stroke(barbAt(TR, TR - 170, ys[3] + HALF + 26, false), AMBER));
  }

  if (s.join > 0.004){
    g += fade(s.join, downArrow(170, 618, 690) +
                      txt(196, 666, "SOEing", 28, INK, 700, "start"));
  }
  if (s.cap) g += txt(800, 800, s.cap, 32, INK, 700);
  return g;
}

const KEYS = ["show", "tie", "join"];
const S = [
  { s:{show:0, tie:0, join:0},
    cap:"three changes to make, in three places",
    note:"One of the more popular uses of SOEing is for introducing multiple mutations into various sites of a gene. Suppose you wish to introduce 3 mutations, designated by red X&rsquo;s into a sequence.",
    desc:"The target sequence drawn as one long duplex across the top of the slide, with three short red blocks on it at scattered positions. Each block has a white cross through its middle: one of the three mutations to be introduced." },

  { s:{show:1, tie:0, join:0},
    cap:"one PCR per stretch, each carrying its mutation on the end",
    note:"First, you would identify regions 20-40 bp in length flanking the mutation to serve as the annealing region during assembly. You would then perform PCR to construct fragments of the full sequence that each contain this homology region on their ends along with the mutation.",
    desc:"Four fragments appear on staggered rows below the target, each drawn at the position it occupies on the target. The first runs from the left end to the first red block; the second from the first block to the second; the third from the second block to the third; the fourth from the third block to the right end. Two amber oligos sit at the outer ends, one above the first fragment and one below the last." },

  { s:{show:1, tie:1, join:0},
    cap:"every junction is a homology region with the mutation inside it",
    note:"But this procedure is robust up to at least 4 fragments.",
    desc:"Dashed red ties run between the fragments, joining each red block on one fragment to the identical block on the fragment below it. Each shared block is present in full on both neighbours, cross and all, so the mutation is carried by both of the fragments that meet there." },

  { s:{show:1, tie:0, join:1},
    cap:"one SOEing reaction installs all three",
    note:"Finally, these four fragments are recombined in a SOEing reaction to generate the desired product containing all three mutations.",
    desc:"The four fragments slide onto a single line. Because each was drawn at its true position on the target they meet exactly at the shared blocks, and the result is one full-length duplex carrying all three mutations, identical to the target above it except at the three crosses." }
];

window.Deck.sequence("cassette", function(slide){
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
    const t = { cap: S[i].cap };
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
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
