/* ------------------------------------------------------------------ *
 * 01-att.js — what an att site is, twice over.
 *
 *   attmech    the big picture: attB x attP -> attL + attR, why the
 *              reaction is one way, and Xis running it back
 *   attcore    the same reaction at base level, on the real phi80
 *              sequences, so the direct repeat at the middle of it is
 *              visible as letters
 *
 * WHY THERE ARE TWO PICTURES OF ONE REACTION.  JCA, on presenting this:
 * "there is a direct repeat at the core of this system, it just has this
 * extra large sequence that is encoded as part of the specificity."  You
 * cannot see that in the bar-level drawing, because at bar level attB
 * and attP are two different-coloured bars.  It is only at base level
 * that they are visibly the SAME seventeen letters wearing different
 * arms.  So: bars for the reaction, letters for the reason.
 *
 * WHY attmech IS A SECOND COPY.  The bar-level drawing is lifted from
 * 01-dna-enzymes/seq/recombinase.js ("integrase"), deliberately and with
 * its geometry unchanged -- the room has seen this picture, and it should
 * be the same picture.  The NARRATION is not the same and cannot be.
 * That deck frames the slide on serine integrases (BxbI, phiC31): one
 * protein, no host factors, forty-base sites.  This lecture is about
 * phi80, lambda and HK022, which are tyrosine integrases: they need IHF,
 * and attP is a couple of hundred bases, which is the whole point of the
 * slide that follows this one.  Sharing the file would mean sharing the
 * notes, and the notes would be wrong here.  If the geometry is changed,
 * change it in both.
 *
 * This file uses its own primitives rather than seq/parts.js.  parts.js
 * builds a scene once and moves opacities; both sequences here TWEEN
 * geometry (a circle unrolling into a chromosome, a flank sliding to the
 * other molecule), so they redraw per frame instead.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13",
      AMBER = "#a99011", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
function smooth(v, a, b){ const t = clamp01((v-a)/(b-a)); return t*t*(3-2*t); }

/* ------------------------------------------------------------------ *
 * The bent-DNA primitive, from recombinase.js.
 *
 * curve(L, bend, k, ax, ay) returns pt(s, off): s is arc position 0..L,
 * off is perpendicular offset.  The midpoint always sits on (ax, ay) and
 * bend = 1 closes the ends onto each other, so a circle unrolling into a
 * chromosome is one tween of one number.
 * ------------------------------------------------------------------ */
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
function strand(pt, s0, s1, col){
  return '<path d="'+poly(samples(pt, s0, s1, 0))+'" fill="none" stroke="'+(col||INK)+
         '" stroke-width="4.6" stroke-linecap="round"/>';
}
function arrowShape(pt, s0, s1, w, dir){
  const head = Math.min(54, (s1-s0)*0.45);
  const sh  = dir >= 0 ? s1 - head : s0 + head;
  const tip = dir >= 0 ? s1 : s0;
  const tl  = dir >= 0 ? s0 : s1;
  return poly(samples(pt, tl, sh, w)
              .concat([pt(sh, w*1.9), pt(tip, 0), pt(sh, -w*1.9)])
              .concat(samples(pt, sh, tl, -w)), true);
}
function arrowOpen(pt, s0, s1, w, dir, col){
  return '<path d="'+arrowShape(pt,s0,s1,w,dir)+'" fill="#fff" stroke="'+(col||INK)+
         '" stroke-width="3.2" stroke-linejoin="round"/>';
}
/* an att half-site: a filled bar carrying its own letter, so the hybrid
   composition of attL and attR is readable without relying on colour */
function halfSite(pt, s0, s1, w, col, letter){
  const d = poly(samples(pt, s0, s1, w).concat(samples(pt, s1, s0, -w)), true);
  const c = pt((s0+s1)/2, 0);
  return '<path d="'+d+'" fill="'+col+'"/>' +
         '<text x="'+n2(c[0])+'" y="'+n2(c[1]+10)+'" text-anchor="middle" font-size="27" ' +
           'font-weight="700" fill="#fff">'+letter+'</text>';
}
function label(x, y, s, size, col, anchor, weight){
  return '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+(anchor||"middle")+
         '" font-size="'+(size||26)+'" font-weight="'+(weight||400)+'" fill="'+(col||MUTED)+'">'+s+'</text>';
}
function fade(o, body){
  return o <= 0.004 ? "" : '<g opacity="'+n2(o)+'">'+body+'</g>';
}

function makeSvg(inner, capY, subY){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.setAttribute("font-family", "Helvetica Neue,Arial,Helvetica,sans-serif");
  svg.innerHTML = inner +
    '<text data-r="cap" x="800" y="'+(capY||232)+'" text-anchor="middle" ' +
      'font-weight="700" font-size="31" fill="'+INK+'"></text>' +
    '<text data-r="sub" x="800" y="'+(subY||852)+'" text-anchor="middle" ' +
      'font-size="26" fill="'+MUTED+'"></text>';
  return svg;
}

/* Shared tween driver: `S` is an array of {s:{...}, cap, sub, note, desc}. */
function driver(r, keys, paint, S){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, raf = null;
  function go(i, animated){
    const f = S[Math.max(0, Math.min(S.length - 1, i | 0))];
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.cap.textContent = f.cap;
    r.sub.textContent = f.sub;
    if (!cur || animated === false || reduce.matches){
      cur = Object.assign({}, f.s); paint(cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 900;
    raf = requestAnimationFrame(function step(now){
      const t = Math.min(1, (now-t0)/dur), e = ease(t), s = {};
      keys.forEach(k => s[k] = from[k] + (f.s[k]-from[k])*e);
      paint(s); cur = s;
      raf = t < 1 ? requestAnimationFrame(step) : null;
    });
  }
  go(0, false);
  /* one note and one desc per beat: without these deck.js falls back to
     the slide's single <template>, and presenter view shows the same
     sentence for every click while the picture changes */
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
}

/* ================================================================== *
 * 1.  attmech — attB x attP -> attL + attR, and why that is one way
 * ================================================================== */

const CY = 330, SITEW = 20, GENEW = 21;

function mechScene(t){
  let g = "";

  /* chromosome, cut at the middle of attB; the flanks part to make room */
  const pL = curve(380, 0, 1, 610 - 260*t, CY);
  g += strand(pL, 0, 380) + halfSite(pL, 320, 380, SITEW, BLUE, "B");
  const pR = curve(380, 0, 1, 990 + 260*t, CY);
  g += strand(pR, 0, 380) + halfSite(pR, 0, 60, SITEW, BLUE, "B&#8242;");

  /* donor: a circle that opens at attP and unrolls into the chromosome */
  const pD = curve(520, 1 - t, 1.6 - 0.6*t, 800, 477.6 - 147.6*t);
  g += strand(pD, 0, 520);
  g += halfSite(pD, 0, 60, SITEW, VERM, "P&#8242;");
  g += halfSite(pD, 460, 520, SITEW, VERM, "P");
  g += arrowOpen(pD, 170, 350, GENEW, 1, INK);

  const before = 1 - smooth(t, 0.08, 0.45), after = smooth(t, 0.65, 1);
  const anchor = pD(260, 0);
  g += label(anchor[0], anchor[1] - 48 + 104*t, "payload", 26, INK);
  g += fade(before, label(800, CY + 62, "attB", 27, BLUE, "middle", 700) +
                    label(420, CY - 40, "landing pad in the genome", 24, MUTED, "start") +
                    label(800, 616, "donor plasmid", 24, MUTED) +
                    label(800, 792, "attP", 27, VERM, "middle", 700));
  g += fade(after, label(540, CY + 62, "attL", 27, INK, "middle", 700) +
                   label(1060, CY + 62, "attR", 27, INK, "middle", 700));
  return g;
}

function upArrow(x, y0, y1, col){    /* y0 low, y1 high */
  return '<g fill="none" stroke="'+col+'" stroke-width="3.4" stroke-linecap="round" ' +
           'stroke-linejoin="round"><path d="M'+x+' '+y0+'V'+y1+'"/>' +
           '<path d="M'+(x-11)+' '+(y1+16)+'L'+x+' '+y1+'L'+(x+11)+' '+(y1+16)+'"/></g>';
}
function downArrow(x, y0, y1, col){  /* y0 high, y1 low */
  return '<g fill="none" stroke="'+col+'" stroke-width="3.4" stroke-linecap="round" ' +
           'stroke-linejoin="round"><path d="M'+x+' '+y0+'V'+y1+'"/>' +
           '<path d="M'+(x-11)+' '+(y1-16)+'L'+x+' '+y1+'L'+(x+11)+' '+(y1-16)+'"/></g>';
}

/* `t` is the geometry: the summary has to be gone before the re-formed
   plasmid comes back to the middle and sits on it. */
function reaction(fwd, rev, unlock, t){
  const o = smooth(fwd, 0.5, 1) * smooth(t, 0.3, 0.72);
  if (o <= 0.004) return "";
  let g = label(800, 528, "attB &#160;+&#160; attP", 38, INK, "middle", 700) +
          label(800, 666, "attL &#160;+&#160; attR", 38, INK, "middle", 700) +
          downArrow(726, 552, 634, BLUE) +
          label(704, 600, "integrase", 24, BLUE, "end") +
          label(800, 736, "attL = B&#183;P&#8242; and attR = P&#183;B&#8242;. Neither one is attB, neither one is attP", 26, MUTED);

  const ro = smooth(rev, 0.25, 1), u = smooth(unlock, 0.12, 0.75);
  g += fade(ro * (1 - u),
        upArrow(874, 634, 552, VERM) +
        '<g stroke="'+VERM+'" stroke-width="4.2" stroke-linecap="round">' +
          '<path d="M860 580L888 608"/><path d="M888 580L860 608"/></g>' +
        label(902, 600, "integrase alone: no reaction", 24, VERM, "start"));
  g += fade(ro * u,
        upArrow(874, 634, 552, BLUE) +
        label(902, 600, "integrase + Xis", 24, BLUE, "start"));
  return fade(o, g);
}

window.Deck.sequence("attmech", function(slide){
  const svg = makeSvg('<g data-r="dyn"></g>');
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const KEYS = ["t","fwd","rev","unlock"];
  function paint(s){
    r.dyn.innerHTML = mechScene(clamp01(s.t)) +
                      reaction(clamp01(s.fwd), clamp01(s.rev), clamp01(s.unlock), clamp01(s.t));
  }

  const S = [
    { s:{t:0,fwd:0,rev:0,unlock:0},
      cap:"attB sits in the genome, attP on a circle you bring in",
      sub:"one integrase, two sites, and nothing else has to be true of the strain",
      note:"This is the reaction the whole section is built on, and it is the one we drew in the enzymes lecture. A phage integrase recombines a site that is already in the bacterial chromosome, attB, with a site carried on the phage, attP. Here attB is a landing pad E. coli has had all along, and attP is on a plasmid you built. No homology arms, no double-strand break, no repair template. Two short sites and one enzyme.",
      desc:"A horizontal chromosome line carrying a blue bar split into two halves lettered B and B prime, labelled attB. Below it, separated by a clear gap, a circular donor plasmid carrying an outlined payload arrow and a red bar lettered P and P prime, labelled attP." },

    { s:{t:1,fwd:1,rev:0,unlock:0},
      cap:"one crossover, and the whole circle is in the chromosome",
      sub:"each junction is half of one parent site and half of the other",
      note:"One crossover, and the entire circle is in the chromosome. Every base of it: the payload, the marker, the origin, the backbone. That is worth saying out loud, because it is the thing that separates this from every other method in this lecture. Now look at what the junctions are made of. attB was B and B prime, attP was P and P prime, and the crossover happens in the middle of each. So the left junction is B joined to P prime, which we call attL, and the right junction is P joined to B prime, which is attR. Neither product is attB and neither is attP.",
      desc:"The circle has opened at attP and unrolled into the chromosome. The payload now sits in the line, flanked on the left by a bar reading B then P prime, labelled attL, and on the right by a bar reading P then B prime, labelled attR. Below, a reaction summary reads attB plus attP, arrow down, attL plus attR." },

    { s:{t:1,fwd:1,rev:1,unlock:0},
      cap:"the products are not substrates",
      sub:"the integrase alone cannot pair attL with attR, so the reaction has nowhere to go",
      note:"And this is why it stays put. The integrase can only build a working complex out of one attB and one attP. Hand it an attL and an attR and the complex does not assemble, so the reaction stops. Compare Cre from the enzymes lecture: loxP times loxP gives loxP and loxP, the product is still a substrate, and it never stops. Consuming the sites is what makes an integration stable. You put it in once and it stays in, even while the integrase is still being made.",
      desc:"A red upward arrow has appeared beside the blue downward one in the reaction summary, struck through with a red cross and labelled: integrase alone, no reaction." },

    { s:{t:1,fwd:1,rev:1,unlock:1},
      cap:"add Xis, and the reverse is allowed",
      sub:"a recombination directionality factor — Xis in λ and φ80, gp47 in Bxb1",
      note:"The reverse is not impossible, it is just switched off, and what switches it on is a second small protein. In lambda and phi80 that protein is Xis. The general name is a recombination directionality factor, and what it does is remodel the complex so that attL and attR become the productive pair instead of a dead end. Nothing has moved yet. All that has changed is that the reaction which had nowhere to go now has somewhere to go.",
      desc:"The red cross over the reverse arrow clears. The arrow turns blue and is labelled integrase plus Xis. Nothing else on the slide has moved." },

    { s:{t:0,fwd:1,rev:1,unlock:1},
      cap:"and the same enzyme takes it back out",
      sub:"attL × attR → attB + attP, and the plasmid is a circle again",
      note:"So run it. Integrase plus Xis pairs attL with attR, cuts, exchanges and reseals, and the DNA leaves as a circle. Watch the labels come back on their own: the chromosome has attB again, the circle has attP again, because those genuinely are the products. Nothing here is a second mechanism, it is the same reaction driven the other way. That is the E and the R in CRIM, excision and retrieval: you can go and get your insert back out of the genome as a plasmid. And it is Gateway cloning exactly, if you have met it. BP clonase runs attB times attP forward, LR clonase is the same integrase plus its directionality factor running attL times attR back.",
      desc:"The reaction summary clears as the payload rolls back out of the chromosome into a circle below it, the chromosome closing up carrying attB again and the circle carrying attP again." }
  ];
  return driver(r, KEYS, paint, S);
});

/* ================================================================== *
 * 2.  attcore — the same reaction, in letters
 *
 * The sequences are real and they are the ones in the example files: the
 * seventeen-base phi80 recombination core, read off the genomic attB and
 * the CRIM attP with ten bases of context on each side.  The point of
 * the slide is that the middle seventeen are character for character the
 * same in both, and everything else is not.
 *
 * Geometry: attB is the top row and attP the bottom row, aligned on the
 * core.  Recombination is drawn as the RIGHT FLANKS TRADING ROWS, which
 * is what the crossover does and which leaves the core sitting still in
 * the middle of both products.  So the top row becomes attL and the
 * bottom becomes attR without either of them moving.
 *
 * The size difference gets its own picture rather than a sentence.  A
 * couple of hundred bases of phage arm cannot be set in letters beside a
 * seventeen-base core, and saying "about 240 bp" leaves the room doing
 * arithmetic.  Drawn to scale, attB is a stub barely wider than the core
 * and attP is a bar most of the way across the slide -- which is the
 * whole of JCA's point about where the specificity lives.
 * ================================================================== */

const CORE = "atttaagaaagtgttct";
const B_L  = "cagtgaaacc",  B_R = "gaatagagat";   /* genome, MG1655 */
const P_L  = "ccaaatgaca",  P_R = "aatttattag";   /* CRIM plasmid   */

const PITCH = 24, NCH = B_L.length + CORE.length + B_R.length;
const SX = 800 - (NCH*PITCH)/2;              /* left edge of the block */
const CH = i => SX + PITCH*i + PITCH/2;      /* centre of character i  */
const C0 = B_L.length, C1 = C0 + CORE.length;  /* core spans [C0, C1)  */
const CORE_X0 = SX + C0*PITCH, CORE_X1 = SX + C1*PITCH;
const MID = (CORE_X0 + CORE_X1)/2;
const LX0 = SX - 96, LX1 = SX + NCH*PITCH + 96;  /* the DNA line       */

const RY = [330, 470];                        /* the two molecule rows */
const DY = RY[1] - RY[0];

/* One molecule: its DNA line, its name, its letters.  `swapX` is 0..1,
   how far this row's RIGHT flank has travelled to the other row.  It
   arcs rather than sliding through the core, so the two flanks visibly
   pass each other instead of occupying the same letters. */
function molecule(y, name, left, right, col, swapX, nameCol){
  let g = '<path d="M'+n2(LX0)+' '+(y+18)+'H'+n2(LX1)+'" stroke="'+col+
            '" stroke-width="3.5" stroke-linecap="round" opacity="0.5"/>';
  g += label(LX0 - 16, y + 10, name, 30, nameCol || col, "end", 700);
  g += '<rect x="'+n2(CORE_X0)+'" y="'+(y-30)+'" width="'+n2(CORE_X1-CORE_X0)+
         '" height="42" rx="5" fill="'+AMBER+'" fill-opacity="0.17"/>';
  g += '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ' +
         'font-size="31" font-weight="600" text-anchor="middle">';
  for (let i = 0; i < left.length; i++)
    g += '<text x="'+n2(CH(i))+'" y="'+y+'" fill="'+col+'">'+left[i]+'</text>';
  for (let i = 0; i < CORE.length; i++)
    g += '<text x="'+n2(CH(C0+i))+'" y="'+y+'" fill="'+INK+'">'+CORE[i]+'</text>';
  const dy = DY * (y === RY[0] ? 1 : -1) * swapX;
  const lift = -70 * Math.sin(Math.PI * swapX) * (y === RY[0] ? 1 : -1);
  for (let i = 0; i < right.length; i++)
    g += '<text x="'+n2(CH(C1+i))+'" y="'+n2(y + dy + lift)+'" fill="'+col+'">'+right[i]+'</text>';
  return g + '</g>';
}

/* the two sites drawn against each other at one scale: 240 bp of attP
   across 860 px, and everything else measured off that */
const SCALE = 860/240, IY = [648, 716];
function toScale(){
  const core = 17*SCALE, attB = 21*SCALE, attP = 240*SCALE;
  function bar(y, w, col, txt){
    return '<rect x="'+n2(800-w/2)+'" y="'+(y-13)+'" width="'+n2(w)+'" height="26" rx="4" ' +
             'fill="'+col+'" fill-opacity="0.16" stroke="'+col+'" stroke-width="2"/>' +
           '<rect x="'+n2(800-core/2)+'" y="'+(y-13)+'" width="'+n2(core)+'" height="26" rx="4" ' +
             'fill="'+AMBER+'" fill-opacity="0.55" stroke="'+AMBER+'" stroke-width="2"/>' +
           label(800 - attP/2 - 24, y + 9, txt, 25, col, "end", 700);
  }
  return bar(IY[0], attB, BLUE, "attB &#160;&#8776;21 bp") +
         bar(IY[1], attP, VERM, "attP &#160;&#8776;240 bp") +
         label(800 - core/2 - (attP-core)/4, IY[1] + 7, "Int + IHF sites", 20, VERM) +
         label(800 + core/2 + (attP-core)/4, IY[1] + 7, "Int + IHF sites", 20, VERM) +
         label(800, IY[1] + 56, "drawn to scale &#183; the amber block is the core they share", 23, MUTED);
}

/* Where the two junctions end up, at bar level.  The letters above show
   that the core survives; this shows WHERE the two copies of it are in
   the finished molecule, which is the thing the worked example a few
   slides later asks the room to write down. */
function product(){
  const Y = 676, X0 = 210, X1 = 1390, CW = 30;
  const c1 = 540, c2 = 1030;
  /* the line stops at each junction and picks up after the other: inside
     the insert the box IS the molecule, and a rule drawn straight through
     it strikes out the label sitting there */
  return '<path d="M'+X0+' '+Y+'H'+c1+'M'+(c2+CW)+' '+Y+'H'+X1+'" stroke="'+INK+
           '" stroke-width="3.5" stroke-linecap="round"/>' +
         '<rect x="'+(c1+CW)+'" y="'+(Y-19)+'" width="'+(c2-c1-CW)+'" height="38" rx="5" ' +
           'fill="'+BLUE+'" fill-opacity="0.10" stroke="'+BLUE+'" stroke-width="2"/>' +
         label((c1+c2+CW)/2, Y + 9, "everything that was on the circle", 23, BLUE) +
         '<rect x="'+c1+'" y="'+(Y-19)+'" width="'+CW+'" height="38" rx="4" fill="'+AMBER+
           '" fill-opacity="0.55" stroke="'+AMBER+'" stroke-width="2"/>' +
         '<rect x="'+c2+'" y="'+(Y-19)+'" width="'+CW+'" height="38" rx="4" fill="'+AMBER+
           '" fill-opacity="0.55" stroke="'+AMBER+'" stroke-width="2"/>' +
         label(c1 + CW/2, Y + 58, "attL", 26, INK, "middle", 700) +
         label(c2 + CW/2, Y + 58, "attR", 26, INK, "middle", 700) +
         label(X0 + 8, Y - 32, "genome", 23, MUTED, "start") +
         label(X1 - 8, Y - 32, "genome", 23, MUTED, "end") +
         label(800, Y + 106, "the core is now at both ends of the insert, both times reading the same way",
               24, AMBER, "middle", 700);
}

function coreScene(s){
  const show2 = clamp01(s.two), ins = clamp01(s.inset),
        tie = clamp01(s.tie), x = clamp01(s.x), sw = clamp01(s.swap);
  let g = "";
  const swapped = sw > 0.5;

  /* the bracket over the core, while the core is still the subject */
  g += fade(1 - smooth(sw, 0.1, 0.5),
        '<path d="M'+n2(CORE_X0)+' '+(RY[0]-46)+'V'+(RY[0]-59)+'H'+n2(CORE_X1)+
          'V'+(RY[0]-46)+'" fill="none" stroke="'+AMBER+
          '" stroke-width="2.6" stroke-linejoin="round"/>' +
        label(MID, RY[0] - 74, "17 bp recombination core", 24, AMBER, "middle", 700));

  g += molecule(RY[0], swapped ? "attL" : "attB", B_L, B_R, BLUE, sw, swapped ? INK : BLUE);
  g += fade(show2, molecule(RY[1], swapped ? "attR" : "attP", P_L, P_R, VERM, sw, swapped ? INK : VERM));

  g += fade(ins, toScale());
  g += fade(smooth(sw, 0.45, 1), product());

  /* the tie: the same seventeen letters, twice, pointing the same way */
  g += fade(tie,
        '<g fill="none" stroke="'+AMBER+'" stroke-width="2.6" stroke-dasharray="6 7">' +
          '<path d="M'+n2(CORE_X0)+' '+(RY[0]+22)+'V'+(RY[1]-42)+'"/>' +
          '<path d="M'+n2(CORE_X1)+' '+(RY[0]+22)+'V'+(RY[1]-42)+'"/></g>' +
        label(MID, RY[0] + 82, "identical, and both left to right", 24, AMBER, "middle", 700));

  /* the crossover itself, inside the core */
  g += fade(x,
        '<g stroke="'+INK+'" stroke-width="4" stroke-linecap="round">' +
          '<path d="M'+n2(MID-46)+' '+(RY[0]+26)+'L'+n2(MID+46)+' '+(RY[1]-46)+'"/>' +
          '<path d="M'+n2(MID+46)+' '+(RY[0]+26)+'L'+n2(MID-46)+' '+(RY[1]-46)+'"/></g>');
  return g;
}

window.Deck.sequence("attcore", function(slide){
  const svg = makeSvg('<g data-r="dyn"></g>', 214, 806);
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const KEYS = ["two","inset","tie","x","swap"];
  function paint(s){ r.dyn.innerHTML = coreScene(s); }

  const S = [
    { s:{two:0,inset:0,tie:0,x:0,swap:0},
      cap:"attB, in the genome of a strain nobody engineered",
      sub:"seventeen bases, and they were already there",
      note:"Here is the site itself, in letters, read straight out of the E. coli genome file. The seventeen bases on the amber band are the recombination core for phi80. That is the whole of attB. It is not a cassette anybody put there, it is a sequence MG1655 has always had, which is why the strain on your bench is ready for this experiment without any preparation at all.",
      desc:"A blue line representing the E. coli genome, carrying a row of sequence in monospace letters. The middle seventeen letters, atttaagaaagtgttct, sit on a tinted amber band, bracketed above and labelled the seventeen base pair recombination core." },

    { s:{two:1,inset:0,tie:0,x:0,swap:0},
      cap:"attP, on the plasmid you built",
      sub:"read off the CRIM file, aligned on its core",
      note:"And here is attP, from the CRIM plasmid, lined up underneath on its own core. Look at the ends of the two rows and then at the middles. The ends have nothing in common, they are a phage sequence and a chromosome sequence. The middles are character for character the same seventeen letters.",
      desc:"A second row appears below the first, on a red line: the attP sequence from the CRIM plasmid, aligned so that its own amber core band sits directly under the first one. The flanking letters of the two rows are entirely different." },

    { s:{two:1,inset:1,tie:0,x:0,swap:0},
      cap:"but the two sites are nothing like the same size",
      sub:"attB stops at the core \u00b7 attP buries it in a couple of hundred bases of arm",
      note:"Now the asymmetry, which is the thing that is easy to miss, and it is worth drawing to scale. attB is essentially the core and nothing else, about twenty bases all in. attP is the same core in the middle of a couple of hundred bases of phage arm — about two hundred and forty in lambda, and phi80 is built the same way. Those arms are not padding. They carry the extra binding sites for the integrase and for the host protein IHF, and folding all of that into one complex is what makes the reaction specific to this phage and what makes it go one way. All of the specificity lives in the parts that are not shared.",
      desc:"Below the sequences, the two sites drawn to scale against each other: attB about twenty-one base pairs, a stub barely wider than the shared core, and attP about two hundred and forty base pairs, a bar most of the way across the slide with the same small amber core in its middle and long arms either side." },

    { s:{two:1,inset:1,tie:1,x:0,swap:0},
      cap:"strip the arms and what is left is a direct repeat",
      sub:"two copies of one sequence, same orientation, on two molecules",
      note:"So take the arms away and ask what the chemistry is actually looking at. Two copies of one seventeen base sequence, in the same orientation, on two different molecules. That is a direct repeat, and recombining a direct repeat is exactly what Flp does to a pair of FRT sites, which we will get to in a few slides. The mechanism in the middle is ordinary. What phage integration adds is a large specificity sequence bolted onto one side of it, and that is what buys you a site only phi80 will touch and a reaction that will not run backwards on its own.",
      desc:"Dashed amber lines join the left and right edges of the two core bands, with a label between the rows reading: identical, and both left to right." },

    { s:{two:1,inset:0,tie:0,x:1,swap:0},
      cap:"the exchange happens inside those seventeen bases",
      sub:"which is why the core comes through the reaction intact",
      note:"The crossover falls inside the core, not outside it. That matters for what you are about to write down, because it means the seventeen bases are not destroyed by the reaction. They are cut and rejoined to a different partner, and they come out whole on both sides.",
      desc:"The scale comparison clears and a cross is drawn between the two rows, inside the core bands." },

    { s:{two:1,inset:0,tie:0,x:0,swap:1},
      cap:"the flanks trade partners; the core does not move",
      sub:"attL = genome \u00b7 core \u00b7 phage    \u2014    attR = phage \u00b7 core \u00b7 genome",
      note:"And there is the product. Nothing moved except the right-hand flanks, which changed rows. The top molecule is now genomic sequence, then the core, then phage sequence, and that is attL. The bottom is phage, core, genomic, and that is attR. Both still carry the same seventeen bases in the middle. So when you go to write the integrated file, the rule falls straight out of this picture: the core appears twice in the product, once at each end of everything that went in, in the same orientation both times. That is the whole recipe, and we are going to use it on the real files in a few minutes.",
      desc:"The right-hand flanks of the two rows arc across and swap places. The top row is now blue letters, the amber core, then red letters, relabelled attL. The bottom row is red letters, the core, then blue letters, relabelled attR. The core bands have not moved." }
  ];
  return driver(r, KEYS, paint, S);
});
})();
