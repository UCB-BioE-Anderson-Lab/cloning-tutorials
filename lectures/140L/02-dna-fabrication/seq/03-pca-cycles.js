/* ------------------------------------------------------------------ *
 * 03-pca-cycles.js : PCA, the reaction half.  Slide 20 of the source.
 *
 * Registers:  gs-pca-cycles   set up the tube, then round 1 denature /
 *                             anneal / extend, round 2 denature /
 *                             anneal / extend, the full-length product,
 *                             and the PCR and clone at the end
 *                                                            (9 steps)
 *
 * The slide before this one (seq/03-pca.js) is the design: the target
 * cut into four overlapping oligos plus two external ones, ordered.
 * This one is what happens once they are all in a tube together.  The
 * two used to animate the same reaction twice; now each has one job.
 *
 * FOUR STRANDS, ALL THE WAY DOWN.  The single thing this drawing is
 * built to show is that a strand is founded by ONE oligo and only ever
 * grows at its 3' end.  So the four assembly oligos are four objects
 * that persist from the first denaturation to the finished product:
 * they melt apart, find partners, get longer, melt apart again, find
 * different partners, and two of them run out to full length.  Nothing
 * is ever redrawn as a new molecule, which is why the eye can follow
 * one oligo through the whole reaction.  By the last frame each strand
 * of the product is one short solid oligo and a long blue tail.
 *
 * PAIRWISE, NOT ASSEMBLED.  Round 1 anneals oligo 1 to oligo 2 and
 * oligo 3 to oligo 4, and draws them as TWO separate molecules with a
 * clear gap between them.  It does not build the full-length structure.
 * That is the mechanism and it is the thing a static figure of this
 * reaction always gets wrong: oligos find partners two at a time, and
 * the full-length molecule does not exist until a later round.
 *
 * Round 2 melts those two pieces into four strands, and four strands
 * make exactly two cross-pairs, so both are drawn.  Only one of them
 * has a 3' end sitting on a template; the other pairs through the same
 * homology and has both of its 3' ends hanging over open air.  That is
 * the same argument seq/05-soeing.js makes nine slides later, drawn the
 * same way, on purpose.
 *
 * Colour, one meaning each:
 *   ink         ordered as an oligo
 *   dashed blue made by the polymerase in the tube
 *   vermillion  a homology region, drawn as base-pair ticks between two
 *               annealed strands.  On the design slide the same red
 *               recolours the strand itself; here it cannot, because
 *               half of every overlap is polymerase-made by then and
 *               recolouring would throw that away.  Red still means the
 *               shared sequence that does the work, either way.
 *
 * Half barb at every 3' end.  The two full heads are process arrows.
 *
 * The five bullets are the slide's own and are not touched.  A slide
 * driven by a sequence does not run its data-build steps (deck.js
 * returns early), so this file reveals them itself.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13", MUTED = "#767676";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

/* ---- the frame ------------------------------------------------------
   The bullets take the left column of a .cols.wide-right, so everything
   drawn here lives in x 720 to 1470 and y 250 to 815.  The target is
   2.8 oligo lengths, the same short synthon the design slide cut up. */
const XD0 = 720, XD1 = 1470, SPAN = 2.8;
const U = (XD1 - XD0)/SPAN;
const X = u => XD0 + u*U;

const SW = 3.4, BARB = 20, BW = 0.49, DASH = "9 8";

/* ---- the four assembly oligos, as ordered ----------------------------
   u5 is the 5' end, which never moves; ink is the stretch that was
   bought.  A strand's 3' end is worked out per frame from how far the
   two rounds of extension have run. */
const OLI = [
  { u5:0,   ink:[0,   1  ], fwd:true  },
  { u5:1.6, ink:[0.6, 1.6], fwd:false },
  { u5:1.2, ink:[1.2, 2.2], fwd:true  },
  { u5:2.8, ink:[1.8, 2.8], fwd:false }
];
/* 3' end of each, at (e1, e2) = (0,0), (1,0) and (1,1) */
function tip(k, e1, e2){
  if (k === 0) return 1.0 + 0.6*e1 + 1.2*e2;
  if (k === 1) return 0.6 - 0.6*e1;
  if (k === 2) return 2.2 + 0.6*e1;
  return           1.8 - 0.6*e1 - 1.2*e2;
}

/* ---- primitives ----------------------------------------------------- */
function fade(o, body){
  return (o <= 0.004 || !body) ? "" : '<g opacity="'+n2(o)+'">'+body+'</g>';
}
function stroke(d, col, w, dash){
  return d ? '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+(w||SW)+
             '" stroke-linecap="round"'+(dash ? ' stroke-dasharray="'+dash+'"' : '')+'/>' : "";
}
function txt(x, y, s, size, col, weight, anchor){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+(anchor||"middle")+
         '" font-family="inherit" font-size="'+size+'" font-weight="'+(weight||400)+
         '" fill="'+col+'">'+s+'</text>';
}
function seg(x1, x2, y){
  return Math.abs(x2-x1) < 0.8 ? "" : "M"+n2(x1)+" "+n2(y)+"L"+n2(x2)+" "+n2(y);
}
function useg(u1, u2, y){ return seg(X(u1), X(u2), y); }
/* the half barb, laid back along the strand: up for a line running
   right, down for one running left.  Kept off the dashed body, because
   a dashed barb is two floating ticks rather than an end mark. */
function barbAt(u5, u3, y){
  if (Math.abs(u3-u5) < 0.004) return "";
  const x3 = X(u3), th = Math.atan2(0, u5-u3);
  return "M"+n2(x3 + BARB*Math.cos(th + BW))+" "+n2(y + BARB*Math.sin(th + BW))+
         "L"+n2(x3)+" "+n2(y);
}

/* One strand: the bought part in solid ink, everything the polymerase
   added behind its 3' end in dashed blue, and a barb on the tip in
   whichever of the two made it. */
function strand(k, u3, y){
  const o = OLI[k];
  const iA = Math.max(o.ink[0], Math.min(o.ink[1], Math.min(u3, o.u5)));
  const iB = Math.min(o.ink[1], Math.max(o.ink[0], Math.max(u3, o.u5)));
  let g = stroke(useg(iA, iB, y), INK);
  const made = o.fwd ? [o.ink[1], u3] : [u3, o.ink[0]];
  const grew = Math.abs(made[1] - made[0]) > 0.01;
  if (grew) g += stroke(useg(made[0], made[1], y), BLUE, SW, DASH);
  g += stroke(barbAt(o.u5, u3, y), grew ? BLUE : INK);
  return g;
}

/* base-pair ticks across the stretch two annealed strands share */
function ticks(uA, uB, yTop, yBot){
  const x0 = X(Math.min(uA, uB)), x1 = X(Math.max(uA, uB));
  const n = Math.max(3, Math.round((x1 - x0)/22));
  let d = "";
  for (let i = 0; i <= n; i++){
    const x = x0 + (x1 - x0)*i/n;
    d += "M"+n2(x)+" "+n2(yTop+9)+"L"+n2(x)+" "+n2(yBot-9);
  }
  return stroke(d, VERM, 2.4);
}

/* ---- the tube, for the setup frame ---------------------------------- */
const REAG = ["ddH2O", "Buffer", "dNTPs", "Oligo mix (equimolar)",
              "Thermostable polymerase"];
const TCX = 1330;
/* six short lines of DNA sitting in the bottom of the tube: the pool */
const POOL = [[1292,452],[1314,472],[1288,492],[1310,512],[1294,532],[1302,552]];

function tube(){
  let g = "";
  REAG.forEach(function(s, i){
    g += txt(730, 338 + i*44, s, 24, INK, 400, "start");
  });
  g += stroke("M1014 314h12v208h-12", MUTED, 3);
  g += '<path d="M1046 420 C 1130 352, 1236 336, 1300 374" fill="none" stroke="'+
         MUTED+'" stroke-width="4" marker-end="url(#gsPcacHead)"/>';
  g += '<rect x="'+(TCX-56)+'" y="384" width="112" height="24" rx="4" fill="none" ' +
         'stroke="'+INK+'" stroke-width="3.2"/>';
  g += stroke("M"+(TCX-50)+" 408V540L"+TCX+" 638L"+(TCX+50)+" 540V408", INK, 3.2);
  let d = "";
  POOL.forEach(p => { d += "M"+(p[0]-27)+" "+p[1]+"L"+(p[0]+27)+" "+p[1]; });
  g += stroke(d, INK, 3);
  g += txt(TCX, 690, "PCA reaction", 22, MUTED, 400);
  return g;
}

/* ---- the last frame: amplify off the ends, then clone --------------- */
function amplify(){
  const YF = 320, YT = 372, YB = 417, YR = 469;
  let g = "";
  /* the two external oligos, ordered, so solid ink */
  g += stroke(useg(0, 0.55, YF), INK) + stroke(barbAt(0, 0.55, YF), INK);
  g += stroke(useg(2.25, 2.8, YR), INK) + stroke(barbAt(2.8, 2.25, YR), INK);
  /* the assembly product they sit on */
  g += strand(0, 2.8, YT);
  g += strand(3, 0,   YB);
  g += '<path d="M1095 512V588" fill="none" stroke="'+MUTED+'" stroke-width="4" ' +
         'marker-end="url(#gsPcacHead)"/>';
  g += txt(1122, 542, "PCR with the external oligos", 22, MUTED, 400, "start");
  g += txt(1122, 570, "then clone into a vector", 22, MUTED, 400, "start");
  const cx = 1095, cy = 690, r = 68;
  g += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+INK+
         '" stroke-width="3.2"/>';
  g += '<path d="M1134 634.3A68 68 0 0 1 1134 745.7" fill="none" stroke="'+BLUE+
         '" stroke-width="7" stroke-linecap="round"/>';
  g += txt(1182, 698, "synthon", 22, MUTED, 400, "start");
  return g;
}

/* ---- the scene -------------------------------------------------------
   tube / mol / amp   which of the three groups is on
   y0..y3             where each of the four strands is sitting
   e1, e2             how far the two rounds of extension have run
   t1                 round 1 base pairing, oligo 1:2 and oligo 3:4
   t2                 round 2 base pairing, the two cross-pairs
   oth                the non-productive cross-pair, and the two strands
                      that make it, once the product is claimed
   mark               the bracket under the finished molecule           */
function scene(s){
  let g = "";
  if (s.tube > 0.004) g += fade(s.tube, tube());
  if (s.amp  > 0.004) g += fade(s.amp,  amplify());

  if (s.mol > 0.004){
    const ys = [s.y0, s.y1, s.y2, s.y3];
    const u3 = [0,1,2,3].map(k => tip(k, s.e1, s.e2));
    const rx = [0,1,2,3].map(function(k){
      const a = X(OLI[k].u5), b = X(u3[k]);
      return [Math.min(a,b), Math.max(a,b)];
    });
    /* Denaturation makes strands swap rows, and two of them have to pass
       one another to do it.  Whichever is on its way ducks as it crosses
       rather than merging into the line it is passing.  Settled frames
       are never within 34 px, so none of them is ever dimmed. */
    const dim = [1,1,1,1];
    for (let i = 0; i < 4; i++) for (let j = i+1; j < 4; j++){
      if (Math.min(rx[i][1], rx[j][1]) - Math.max(rx[i][0], rx[j][0]) < 40) continue;
      const dy = Math.abs(ys[i] - ys[j]);
      if (dy >= 34) continue;
      dim[j] = Math.min(dim[j], 0.32 + 0.68*clamp01((dy - 12)/22));
    }

    let m = "";
    /* round 1: oligo 1 on oligo 2, and oligo 3 on oligo 4 */
    if (s.t1 > 0.004)
      m += fade(s.t1, ticks(0.6, 1.0, ys[0], ys[1]) +
                      ticks(1.8, 2.2, ys[2], ys[3]));
    /* round 2: the productive cross-pair, and the other one */
    if (s.t2 > 0.004)
      m += fade(s.t2, ticks(1.2, 1.6, ys[0], ys[3])) +
           fade(s.t2*s.oth, ticks(1.2, 1.6, ys[2], ys[1]));

    m += fade(dim[0], strand(0, u3[0], ys[0]));
    m += fade(dim[3], strand(3, u3[3], ys[3]));
    m += fade(dim[1]*s.oth, strand(1, u3[1], ys[1]));
    m += fade(dim[2]*s.oth, strand(2, u3[2], ys[2]));

    m += fade(s.t2*s.oth,
          txt(XD0, 690, "neither 3&#8242; end has a template", 21, MUTED, 400, "start"));
    if (s.mark > 0.004)
      m += fade(s.mark,
            stroke("M"+X(0)+" 528v14H"+X(2.8)+"v-14", MUTED, 2.6) +
            txt((XD0+XD1)/2, 578, "the whole target, end to end", 21, MUTED, 400));
    g += fade(s.mol, m);
  }

  if (s.stage) g += txt(XD0, 272, s.stage, 26, INK, 700, "start");
  return g;
}

const KEYS = ["tube","mol","amp","y0","y1","y2","y3","e1","e2","t1","t2","oth","mark"];

/* Rows, per frame, for oligos 1 to 4.  Round 2 puts oligo 4 second from
   the top the moment the pieces melt, so that when it pairs with oligo 1
   it has already arrived and nothing has to cross the whole column. */
function st(o){
  return Object.assign({ tube:0, mol:1, amp:0, e1:0, e2:0,
                         t1:0, t2:0, oth:1, mark:0 }, o);
}
const S = [
{ s: st({ tube:1, mol:0, y0:330, y1:430, y2:530, y3:630 }),
  stage:"Set up the PCA reaction",
  bullets:[0,1],
  note:"The other common way of assembling oligonuceotides into gene-length DNAs is polymerase chain assembly, or PCA.  Like with LCA, the target sequence is synthesized as a pool of shorter oligonucoetide sequences that can assemble into the full length sequence in a one-pot reaction.  The difference is that 1) the assembly reaction involves a thermostable polymerase rather than a ligase, and 2) there can be gaps in the sequence that will be filled in by the polymerase during assembly.",
  desc:"The first two lines appear beside a drawing of the reaction being set up. Five reagents are listed and bracketed together, and an arrow carries them into a PCR tube: water, buffer, dNTPs, an equimolar oligo mix, and a thermostable polymerase. The oligos are drawn as short lines lying in the bottom of the tube. There is no template in the list, because the oligos are the template." },

{ s: st({ y0:330, y1:430, y2:530, y3:630 }),
  stage:"Round 1: denature",
  bullets:[2],
  note:"Typically PCA is done in two stages.  First, the equimolar mix of oligos is reacted with a polymerase under PCR-like conditions.",
  desc:"The program starts. The four assembly oligos are drawn as four separate single strands well apart from one another, each at the place on the target it belongs to, each with a half barb at its 3-prime end. Two run left to right and two run right to left." },

{ s: st({ y0:350, y1:400, y2:560, y3:610, t1:1 }),
  stage:"Round 1: anneal",
  bullets:[],
  note:"",
  desc:"The oligos find partners two at a time. Oligo 1 anneals to oligo 2 and oligo 3 anneals to oligo 4, giving two separate staggered duplexes with a wide gap between them: the full-length molecule has not been built and cannot be, this round. Vermillion base-pair ticks mark the short stretch each pair actually shares. Every 3-prime end sits recessed, with the other strand of its own pair running on ahead of it as template." },

{ s: st({ y0:350, y1:400, y2:560, y3:610, t1:1, e1:1 }),
  stage:"Round 1: extend",
  bullets:[],
  note:"",
  desc:"The polymerase runs each recessed 3-prime end out along the strand it is annealed to. The new DNA appears as a dashed blue continuation of each oligo, and the two pairs become two blunt double-stranded pieces, each about half again as long as an oligo. The solid ink in each strand is still exactly the oligo that was ordered." },

{ s: st({ y0:310, y1:640, y2:545, y3:400, e1:1 }),
  stage:"Round 2: denature",
  bullets:[],
  note:"",
  desc:"Both pieces melt. The same four strands are single again and spread apart, but each is longer than it was: a short solid oligo followed by a dashed blue run that the polymerase added in the first round." },

{ s: st({ y0:340, y1:630, y2:580, y3:390, e1:1, t2:1 }),
  stage:"Round 2: anneal",
  bullets:[],
  note:"",
  desc:"Four strands make exactly two cross-pairs, and both are drawn. In the upper one, the strand founded by oligo 1 lies across the strand founded by oligo 4; they overlap in the middle through the vermillion homology and both 3-prime ends sit recessed on template. In the lower one, the strands founded by oligos 3 and 2 pair through exactly the same homology, but their 3-prime ends finish at the outside corners with nothing underneath them." },

{ s: st({ y0:340, y1:630, y2:580, y3:390, e1:1, e2:1, t2:1 }),
  stage:"Round 2: extend",
  bullets:[],
  note:"",
  desc:"The polymerase runs both recessed 3-prime ends of the upper pair out to the far end of their template, and the dashed blue in each strand doubles. That pair is now one full-length double-stranded molecule spanning the whole target. The lower pair is untouched and exactly the length it was, because neither of its 3-prime ends had anywhere to go." },

{ s: st({ y0:430, y1:630, y2:580, y3:480, e1:1, e2:1, oth:0, mark:1 }),
  stage:"Full-length product",
  bullets:[],
  note:"",
  desc:"The full-length product on its own, bracketed underneath as the whole target end to end. Each of its two strands is one short solid oligo followed by a long dashed blue run, so almost all of the molecule is DNA that was made in the tube rather than bought." },

{ s: st({ mol:0, amp:1, y0:430, y1:630, y2:580, y3:480, e1:1, e2:1, oth:0 }),
  stage:"Amplify, then clone",
  bullets:[3,4],
  note:"Second, the material for the first reaction is used as the template for a conventional PCR reaction involving two external primers.  Regardless of whether the double-stranded DNA is assembled using LCA, PCA, or a mixture of the two, the full length product is typically cloned into a vector, introduced into cells, and individual clones are sequence confirmed.",
  desc:"The last two lines appear. The two external oligos are drawn in solid ink against the two ends of the full-length product, one above the left end and one below the right, and they are all a conventional PCR needs. An arrow leads down, labelled PCR with the external oligos and then clone into a vector, to a plasmid circle carrying the assembled insert, marked synthon." }
];

window.Deck.sequence("gs-pca-cycles", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const li = Array.from(slide.querySelectorAll("li[data-build]"));

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML =
    '<defs><marker id="gsPcacHead" viewBox="0 0 10 10" refX="9" refY="5" ' +
      'markerWidth="6" markerHeight="6" orient="auto">' +
      '<path d="M0 0 L10 5 L0 10 Z" fill="'+MUTED+'"/></marker></defs>' +
    '<g data-r="dyn"></g>';
  slide.appendChild(svg);
  const dyn = svg.querySelector('[data-r="dyn"]');

  /* how many bullets are on the slide by step i */
  const UPTO = S.map(function(_, i){
    let n = -1;
    for (let k = 0; k <= i; k++) S[k].bullets.forEach(b => { if (b > n) n = b; });
    return n;
  });

  let cur = null, raf = null;
  function paint(i, v){
    const t = { stage: S[i].stage };
    KEYS.forEach(function(k){
      t[k] = (k.charAt(0) === "y") ? v[k] : clamp01(v[k]);
    });
    dyn.innerHTML = scene(t);
  }
  function go(i, animated){
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    li.forEach((el, k) => el.classList.toggle("in", k <= UPTO[i]));
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
