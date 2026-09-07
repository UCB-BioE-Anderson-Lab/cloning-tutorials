/* ------------------------------------------------------------------ *
 * recombinase.js — two sequences.
 *
 *   loxorient   Cre/lox: the site, and why its ARROW decides the
 *               outcome — excision or inversion            (5 clicks)
 *   integrase   Serine integrase: attB x attP -> attL + attR, and why
 *               consuming the sites makes it one way       (4 clicks)
 *
 * Both scenes are built from ONE primitive: a piece of DNA of arc
 * length L, bent by `bend` (0 = straight, 1 = closed circle).  Because
 * the mapping is continuous in `bend`, a linear segment curling into an
 * excised circle — and a donor circle unrolling into a chromosome — are
 * the same tween run in opposite directions.  That is on purpose: it is
 * literally the same chemistry.
 *
 * Conventions honoured here:
 *   - separate molecules are drawn with a visible gap
 *   - a lox site is a filled arrow because its direction is the point;
 *     an att half-site is a filled bar carrying its own letter (B, B',
 *     P, P') so the hybrid composition of attL and attR is readable
 *     without relying on colour (WCAG 1.4.1)
 *   - nothing branches out of the middle of a strand
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
function smooth(v, a, b){ const t = clamp01((v-a)/(b-a)); return t*t*(3-2*t); }

/* ------------------------------------------------------------------ *
 * The primitive.
 *
 * curve(L, bend, k, ax, ay) returns pt(s, off):
 *   s    arc position, 0..L, increasing left-to-right when flat
 *   off  perpendicular offset; positive is above the flat line, and
 *        outward from the centre once the piece is bent
 * The MIDPOINT s = L/2 always sits exactly on the anchor (ax, ay), and
 * bend = 1 closes the two ends onto each other.  k scales the drawn
 * radius only, so a circle can be made legible without lying about
 * which arcs are long and which are short.
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
/* the DNA itself */
function strand(pt, s0, s1, col){
  return '<path d="'+poly(samples(pt, s0, s1, 0))+'" fill="none" stroke="'+(col||INK)+
         '" stroke-width="4.6" stroke-linecap="round"/>';
}
/* a directional site or gene lying ON the DNA */
function arrowShape(pt, s0, s1, w, dir){
  const head = Math.min(54, (s1-s0)*0.45);
  const sh  = dir >= 0 ? s1 - head : s0 + head;
  const tip = dir >= 0 ? s1 : s0;
  const tl  = dir >= 0 ? s0 : s1;
  return poly(samples(pt, tl, sh, w)
              .concat([pt(sh, w*1.9), pt(tip, 0), pt(sh, -w*1.9)])
              .concat(samples(pt, sh, tl, -w)), true);
}
function arrowFill(pt, s0, s1, w, dir, col){
  return '<path d="'+arrowShape(pt,s0,s1,w,dir)+'" fill="'+col+'"/>';
}
function arrowOpen(pt, s0, s1, w, dir, col){
  return '<path d="'+arrowShape(pt,s0,s1,w,dir)+'" fill="#fff" stroke="'+(col||INK)+
         '" stroke-width="3.2" stroke-linejoin="round"/>';
}
/* an att half-site: a filled bar with its own letter written on it */
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

function makeSvg(inner){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  svg.innerHTML = inner +
    '<text data-r="cap" x="800" y="232" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="31" fill="'+INK+'"></text>' +
    '<text data-r="sub" x="800" y="852" text-anchor="middle" font-family="inherit" ' +
      'font-size="26" fill="'+MUTED+'"></text>';
  return svg;
}

/* Shared tween driver: `S` is an array of {s:{...}, cap, sub, note, desc}. */
function driver(r, keys, paint, S){
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
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 900;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now-t0)/dur), e = ease(t), s = {};
      keys.forEach(k => s[k] = from[k] + (to[k]-from[k])*e);
      paint(s); cur = s;
      raf = t < 1 ? requestAnimationFrame(f) : null;
    });
  }
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
}

/* ================================================================== *
 * 1.  loxorient — the lox site, and what its arrow decides
 * ================================================================== */

/* ---- step 1: the site itself, at the letters level ---------------- */
const LOX_T = "ATAACTTCGTATA" + "ATGTATGC" + "TATACGAAGTTAT";
const LOX_B = "TATTGAAGCATAT" + "TACATACG" + "ATATGCTTCAATA";
const PITCH = 22, X0 = 800 - (34*PITCH)/2;          /* left edge of the block */
const CH = i => X0 + PITCH*i + PITCH/2;             /* centre of character i  */

function anatomy(){
  let g = "";

  /* the two arms, drawn head to head: each reads the same 13 bases on
     its own strand, which is what "inverted repeat" means */
  /* Brackets, not arrows.  A full arrowhead in this deck means the 3' end of
     a strand, and these sat one line above a letter-level sequence in the same
     ink and weight — so a reader could not tell a site marker from a DNA end.
     The span goes in a muted bracket; the direction, which is the actual
     information here, goes in the label, where a text arrow cannot be mistaken
     for a terminus. */
  const armL0 = X0 + 4, armL1 = CH(12) + PITCH/2 - 4;
  const armR0 = CH(21) - PITCH/2 + 4, armR1 = X0 + 34*PITCH - 4;
  g += '<g fill="none" stroke="'+VERM+'" stroke-width="2.4" stroke-linejoin="round">' +
         '<path d="M'+n2(armL0)+' 366v12H'+n2(armL1)+'v-12"/>' +
         '<path d="M'+n2(armR0)+' 366v12H'+n2(armR1)+'v-12"/>' +
       '</g>';
  g += label((armL0+armL1)/2, 352, "13 bp arm &#8594;", 21, VERM) +
       label((armR0+armR1)/2, 352, "&#8592; 13 bp arm", 21, VERM);

  /* the sequence */
  g += '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="34" ' +
         'font-weight="600" text-anchor="middle">';
  for (let i = 0; i < 34; i++){
    /* Red is what the enzyme requires, as everywhere else in this deck,
       so it belongs on the ARMS: those are the thirteen bases Cre reads,
       and changing them stops it binding. The spacer is a different kind
       of requirement -- its identity is free, which is exactly why lox
       variants like lox2272 exist and work, but it must MATCH its
       partner, and its asymmetry is what gives the site direction. That
       is a thing to follow rather than a thing required, so it is blue,
       and it is the blue that becomes the arrow at the bottom. */
    const col = (i >= 13 && i < 21) ? BLUE : VERM;
    g += '<text x="'+n2(CH(i))+'" y="444" fill="'+col+'">'+LOX_T[i]+'</text>' +
         '<text x="'+n2(CH(i))+'" y="492" fill="'+col+'">'+LOX_B[i]+'</text>';
  }
  g += '</g>';
  g += label(X0-30, 444, "5&#8242;", 24, MUTED, "end") + label(X0+34*PITCH+30, 444, "3&#8242;", 24, MUTED, "start") +
       label(X0-30, 492, "3&#8242;", 24, MUTED, "end") + label(X0+34*PITCH+30, 492, "5&#8242;", 24, MUTED, "start");

  /* the spacer, bracketed */
  const sx0 = X0 + 13*PITCH, sx1 = X0 + 21*PITCH;
  g += '<path d="M'+n2(sx0)+' 522V542H'+n2(sx1)+'V522" fill="none" stroke="'+BLUE+
         '" stroke-width="3.2" stroke-linejoin="round"/>';
  g += label(800, 590, "8 bp spacer", 27, BLUE);
  g += label(800, 626, "not a palindrome &#8212; so the site has a direction", 24, MUTED);

  /* and the level-3 icon it collapses to */
  const pt = curve(34*PITCH, 0, 1, 800, 712);
  g += arrowFill(pt, 0, 34*PITCH, 17, 1, BLUE);
  g += label(800, 776, "from here on, just this arrow", 26, MUTED);
  return g;
}

/* ---- the molecule, shared by both orientations -------------------- */
const Y0 = 440;
/* one 1300-long molecule, x 150..1450 when flat:
      s   0..250  left flank        250..390  loxP A
        430..810  gene              850..990  loxP B
        990..1300 right flank                                   */
const LOXW = 17, GENEW = 21;

function directScene(t){
  let g = "";
  const eT = t;
  /* left fragment: flank + loxP A.  Never moves — the eye tracks it. */
  const pL = curve(390, 0, 1, 345, Y0);
  g += strand(pL, 0, 390) + arrowFill(pL, 250, 390, LOXW, 1, BLUE);

  /* right fragment: slides left to close the gap as the middle leaves */
  const pR = curve(310, 0, 1, 1295 - 600*eT, Y0);
  g += strand(pR, 0, 310);

  /* the middle: gene + loxP B, curling into a covalently closed circle */
  const pM = curve(600, eT, 1 + 0.30*eT, 840 + 300*eT, Y0 + 38*eT);
  g += strand(pM, 0, 600);
  g += arrowOpen(pM, 40, 420, GENEW, 1, INK);
  g += arrowFill(pM, 460, 600, LOXW, 1, BLUE);

  /* labels */
  const goneL = 1 - smooth(eT, 0.05, 0.35), inC = smooth(eT, 0.62, 1);
  g += label(470, Y0 + 60, "loxP", 26, BLUE);
  g += fade(goneL, label(770, Y0 + 60, "gene", 26, INK) + label(1070, Y0 + 60, "loxP", 26, BLUE));
  g += fade(inC, label(1140, 606, "excised circle", 26, INK) +
                 label(1140, 640, "gene + one loxP", 24, MUTED) +
                 label(430, Y0 - 54, "one loxP stays behind", 26, MUTED));
  return g;
}

function invScene(t){
  let g = "";
  /* Synapsis is the reaction, not a preamble to it. The two sites have
     to be brought face to face before anything is cut, and because these
     two point AT each other, the only way to do that is to loop the DNA
     between them out. The old version mirrored the segment in place,
     which drew the answer and hid the reason -- and it also made
     inversion look like a different kind of event from excision, when
     the two are the same event on differently pointed sites.

     So: the middle bends up until its two ends, which carry the sites,
     touch; the strands are exchanged at the top of the bend; and it
     comes back down reversed. b = sin(pi t) closes the loop at the
     halfway point and opens it again, and the arrow flips exactly there,
     where the two ends coincide and the flip has nowhere to show. */
  const LM = 460;
  const b    = Math.max(Math.sin(Math.PI*t), 0.0006);
  const R    = LM/(b*2*Math.PI);
  const half = R*Math.sin(Math.PI*b);          /* half the gap between ends */
  const rise = R*(1 - Math.cos(Math.PI*b));    /* how far the ends sit below */
  const dir  = t < 0.5 ? 1 : -1;               /* the exchange itself        */
  const lx = 770 - half, rx = 770 + half;

  /* the flanks slide in to meet the closing loop, each keeping its site */
  const pL = curve(390, 0, 1, lx - 195, Y0);
  g += strand(pL, 0, 390) + arrowFill(pL, 250, 390, LOXW, 1, BLUE);
  const pR = curve(450, 0, 1, rx + 225, Y0);
  g += strand(pR, 0, 450) + arrowFill(pR, 0, 140, LOXW, -1, BLUE);

  const pM = curve(LM, b, 1, 770, Y0 - rise);
  g += strand(pM, 0, LM) + arrowOpen(pM, 40, 420, GENEW, dir, INK);

  const top = pM(LM/2, 46);
  g += label(lx - 70, Y0 + 60, "loxP", 26, BLUE) +
       label(rx + 70, Y0 + 60, "loxP", 26, BLUE) +
       label(top[0], top[1], "gene", 26, INK);
  g += fade(smooth(t, 0.22, 0.44) * (1 - smooth(t, 0.68, 0.84)),
            label(770, Y0 + 126, "the two sites have to meet, so the DNA between them loops out", 25, MUTED));
  g += fade(smooth(t, 0.86, 1),
            label(800, Y0 + 126, "both sites survive &#8212; so Cre can do it again", 26, MUTED));
  return g;
}


window.Deck.sequence("loxorient", function(slide){
  const svg = makeSvg('<g data-r="anat" opacity="0">'+anatomy()+'</g><g data-r="dyn"></g>');
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const KEYS = ["anat","direct","dirT","inv","invT"];
  function paint(s){
    r.anat.setAttribute("opacity", n2(s.anat));
    r.dyn.innerHTML = fade(s.direct, directScene(clamp01(s.dirT))) +
                      fade(s.inv,    invScene(clamp01(s.invT)));
  }

  const S = [
    { s:{anat:1,direct:0,dirT:0,inv:0,invT:0},
      cap:"the site: loxP",
      sub:"",
      note:"This is the last enzyme class in the lecture and it is the one that does the most with a single protein. Everything up to now cuts, copies or joins one junction at a time, and you have to hand it the ends. A recombinase finds two sites, breaks and rejoins all four strands, and reseals — no ligase, no polymerase, no ATP, and no free DNA end is ever let go, because the broken bond is held as a covalent protein-DNA link the whole time. That is the reason it can run on a chromosome inside a living cell. Now the site. loxP is thirty-four base pairs: two thirteen-base-pair arms that are inverted repeats of each other, with an eight-base-pair spacer between them. One Cre monomer binds each arm, so two Cre per site and four across the reaction. Look at the spacer: A-T-G-T-A-T-G-C one way, G-C-A-T-A-C-A-T the other. It is not a palindrome, so the site is not the same read from the left as from the right, and that asymmetry is the entire source of the arrow. From here on the arrow is all we draw, and it is all that matters.",
      desc:"The loxP sequence written out as two strands of letters. The two thirteen base pair arms are marked with thin arrows pointing inward toward each other; the eight base pair spacer between them is coloured red and bracketed. Below, the whole thirty-four base pair site is redrawn as a single filled blue arrow pointing right." },

    { s:{anat:0,direct:1,dirT:0,inv:0,invT:0},
      cap:"two loxP sites, pointing the same way",
      sub:"Cre pairs the two sites, cuts and reseals all four strands",
      note:"Now put two of those sites into one molecule, both pointing the same way, with a gene between them. Cre binds all four arms, brings the two sites face to face — that pairing step is called synapsis and it is the committed step — and then exchanges the strands. Watch what the geometry forces.",
      desc:"A single horizontal DNA line. Two filled blue loxP arrows, both pointing right, flank an outlined arrow labelled gene." },

    { s:{anat:0,direct:1,dirT:1,inv:0,invT:0},
      cap:"same orientation → excision",
      sub:"the DNA between the sites leaves as a closed circle; one loxP rides with it, one stays behind",
      note:"Same orientation gives excision. The segment between the sites comes out as a covalently closed circle. Notice the bookkeeping: each product keeps one complete loxP, because each new site is built from one arm of each parent site and the arms are identical. In practice this is a one-way trip, and not because the chemistry is one way. The circle usually carries no origin of replication, so it is diluted out as the cells divide, and putting it back is a two-molecule reaction that gets slower as the circle gets rarer. That is exactly why floxing works as a deletion. Keep an eye on that leftover site, though: it is a perfectly good loxP, and if you run Cre again later for some other purpose it will be used.",
      desc:"The middle of the DNA has curled out into a closed circle carrying the gene and one loxP arrow, sitting clear of the rest. The two flanks have joined into a shorter line with a single loxP arrow at the join." },

    { s:{anat:0,direct:0,dirT:1,inv:1,invT:0},
      cap:"now flip the right-hand site",
      sub:"nothing else has changed. What is the product?",
      note:"The only thing I have changed is which way the second site points. Same enzyme, same thirty-four base pairs, same gene, same spacing. Before I show you: the two sites still have to be brought face to face, and that constraint is what decides it. Take a moment and work out what has to happen.",
      desc:"The same DNA line with the same gene, but the right-hand loxP arrow now points left instead of right." },

    { s:{anat:0,direct:0,dirT:1,inv:1,invT:1},
      cap:"opposite orientation → inversion",
      sub:"the segment flips; both loxP sites survive, still pointing opposite ways",
      note:"Opposite orientation gives inversion. The segment between the sites is flipped end for end — the gene now points the other way — and both loxP sites are still there, still in opposite orientation. Which means the product is still a perfectly good substrate, so Cre just keeps flipping it, and an unmanaged population lands near fifty-fifty. Excision is effectively one way; inversion is not. If you were planning to use an inversion as a memory element, that is the reason it will not latch on its own. And the practical warning: the difference between deleting your gene and merely reversing it is which way you pointed a thirty-four base pair site when you ordered the DNA. Get it wrong and the construct fails silently.",
      desc:"The segment between the two loxP sites has flipped: the gene arrow now points left. Both loxP arrows are unchanged and still point in opposite directions." }
  ];
  return driver(r, KEYS, paint, S);
});

/* ================================================================== *
 * 2.  integrase — attB x attP -> attL + attR, and why that is one way
 * ================================================================== */

const CY = 330;                 /* the chromosome */
const SITEW = 20;               /* half-height of an att bar */

function integScene(t){
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

  /* labels */
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
   plasmid comes back to the middle and sits on it, and tying its opacity
   to t rather than to a key of its own means it clears itself exactly as
   the reverse reaction runs. */
function reaction(fwd, rev, unlock, t){
  const o = smooth(fwd, 0.5, 1) * smooth(t, 0.3, 0.72);
  if (o <= 0.004) return "";
  let g = label(800, 528, "attB &#160;+&#160; attP", 38, INK, "middle", 700) +
          label(800, 666, "attL &#160;+&#160; attR", 38, INK, "middle", 700) +
          downArrow(726, 552, 634, BLUE) +
          label(704, 600, "integrase", 24, BLUE, "end") +
          label(800, 736, "attL = B&#183;P&#8242; and attR = P&#183;B&#8242; &#8212; neither one is attB, neither one is attP", 26, MUTED);

  const ro = smooth(rev, 0.25, 1);
  const u = smooth(unlock, 0.12, 0.75);
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

window.Deck.sequence("integrase", function(slide){
  const svg = makeSvg('<g data-r="dyn"></g>');
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  const KEYS = ["t","fwd","rev","unlock"];
  function paint(s){
    r.dyn.innerHTML = integScene(clamp01(s.t)) +
                      reaction(clamp01(s.fwd), clamp01(s.rev), clamp01(s.unlock), clamp01(s.t));
  }

  const S = [
    { s:{t:0,fwd:0,rev:0,unlock:0},
      cap:"attB in the genome, attP on the plasmid",
      sub:"a serine integrase — BxbI, phiC31 — and two sites of about forty bases",
      note:"Serine integrases are the version of this that matters most for building things. A phage integrase recombines a site in the bacterial chromosome, attB, with a site on the phage, attP. Here that is a landing pad already sitting in the genome, and a donor plasmid carrying your payload. The sites are short — for BxbI, attB is thirty-eight bases and attP forty-eight — and the enzyme is one protein: no host factors, no homology arms, no ATP. And unlike Cre, a serine integrase really does cut all four strands at once, rotates half of the synapse a hundred and eighty degrees, and religates.",
      desc:"A horizontal chromosome line carrying a blue bar split into two halves lettered B and B prime, labelled attB. Below it, separated by a clear gap, a circular donor plasmid carrying an outlined payload arrow and a red bar lettered P and P prime, labelled attP." },

    { s:{t:1,fwd:1,rev:0,unlock:0},
      cap:"one reaction, and the whole plasmid is in the chromosome",
      sub:"each junction is half of one parent site and half of the other",
      note:"One enzyme, one step, and the entire donor is in the chromosome. Now look at what the junctions are actually made of. attB was B and B prime; attP was P and P prime. The crossover happens in the middle of each, so the left junction is B joined to P prime — that is attL — and the right junction is P joined to B prime — that is attR. Neither product is attB and neither is attP. They are hybrids, and that is not a naming detail, it is the mechanism of the next point.",
      desc:"The circle has opened at attP and unrolled into the chromosome. The payload now sits in the line, flanked on the left by a bar reading B then P prime, labelled attL, and on the right by a bar reading P then B prime, labelled attR. Below, a reaction summary reads attB plus attP, arrow down, attL plus attR." },

    { s:{t:1,fwd:1,rev:1,unlock:0},
      cap:"the products are not substrates",
      sub:"the integrase alone cannot pair attL with attR, so the reaction has nowhere to go",
      note:"And this is the whole point. The integrase recognises an attB and an attP, and it can only assemble a productive synapse out of one of each. Hand it an attL and an attR and the complex does not form, so the reaction simply stops. Compare Cre: loxP times loxP gives you loxP and loxP, the product is still a substrate, and it never stops. Consuming the sites is what makes a landing pad stable — you integrate once and it stays integrated, even with the integrase still being expressed. That is why this, and not Cre, is what you build a genomic landing pad out of.",
      desc:"A red upward arrow has appeared beside the blue downward one in the reaction summary, struck through with a red cross and labelled: integrase alone, no reaction." },

    /* Adding Xis gets its own click. It was folded into the reverse
       reaction on the grounds that a rename is not an event -- but the
       summary has to clear before the re-formed plasmid lands on it, so
       the name went up and started fading in the same breath and was on
       screen for a moment. It is not a rename anyway: the reverse goes
       from forbidden to allowed, which is the point of the whole slide. */
    { s:{t:1,fwd:1,rev:1,unlock:1},
      cap:"add Xis, and the reverse is allowed",
      sub:"a recombination directionality factor \u2014 Xis in \u03bb, gp47 in BxbI",
      note:"The reverse is not impossible, it is just off by default, and what turns it on is a second small protein. In lambda it is Xis. In BxbI the same job is done by gp47. The general name is a recombination directionality factor, and what it does is remodel the complex so that attL and attR become the productive pair instead of a dead end. Nothing has moved yet — all that has changed is that the reaction which had nowhere to go now has somewhere to go.",
      desc:"The red cross over the reverse arrow clears. The arrow turns blue and is labelled integrase plus Xis. Nothing else on the slide has moved." },

    { s:{t:0,fwd:1,rev:1,unlock:1},
      cap:"and it comes back out",
      sub:"attL \u00d7 attR \u2192 attB + attP, and the plasmid is a circle again",
      note:"So run it. The integrase plus Xis pairs attL with attR, cuts, rotates and religates, and the donor leaves as a circle. Watch the labels come back on their own: the chromosome has attB again and the circle has attP again, because those genuinely are the products of attL times attR. Nothing here is a second mechanism — it is the same reaction I ran a few clicks ago, driven the other way. And this is Gateway exactly: BP clonase runs attB times attP forward to give the Entry clone, LR clonase is the same integrase plus its directionality factor and runs attL times attR back to give the Expression clone. The reaction names are the site names. So what you have is a switch you can throw deliberately — integrate now, excise later, on command — which is the basis of the recombinase memory and logic circuits.",
      desc:"The reaction summary clears as the payload rolls back out of the chromosome into a circle below it, the chromosome closing up carrying attB again and the circle carrying attP again." }
  ];
  return driver(r, KEYS, paint, S);
});


/* ================================================================== *
 * 3.  flox — what Cre is actually FOR, shown on a phenotype.
 *
 * The slide this replaces made the case for conditional knockouts in
 * three bullets. The case is not hard, it is just invisible in prose:
 * the same genome behaves differently depending on whether one protein
 * was made. So the cell carries a floxed resistance gene and is
 * resistant; Cre arrives; the gene leaves; the cell is not resistant.
 *
 * The excision loops out rather than sliding apart, for the same reason
 * the inversion does: the two sites have to meet first, and everything
 * afterwards follows from that.
 * ================================================================== */
/* Sized so the excised circle is legible rather than a bead: a 560-unit
   piece closes to a 178-unit circle, and it is parked at a spot that
   clears both the shortened chromosome and the wall of the cell. */
const FCY = 500, FX0 = 310, FL = 980;
const F_CUT = 300, F_END = 860, FEXL = F_END - F_CUT;
const F_PARK = [360, 24];
const FLOXW = 17, FGENEW = 21;

function floxScene(s){
  let g = "";
  const b    = Math.max(s.loop, 0.0006);
  const R    = FEXL/(b*2*Math.PI);
  const half = R*Math.sin(Math.PI*b);
  const rise = R*(1 - Math.cos(Math.PI*b));
  const jx   = FX0 + F_CUT;                       /* where the sites meet */

  g += '<ellipse cx="800" cy="'+FCY+'" rx="486" ry="196" fill="none" stroke="'+MUTED+
       '" stroke-width="2.6"/>';

  const pL = curve(F_CUT, 0, 1, FX0 + F_CUT/2, FCY);
  g += strand(pL, 0, F_CUT) + arrowFill(pL, 160, F_CUT, FLOXW, 1, BLUE);

  const rAnc = jx + 2*half + (FL - F_END)/2;
  const pR = curve(FL - F_END, 0, 1, rAnc, FCY);
  g += strand(pR, 0, FL - F_END);

  const pM = curve(FEXL, b, 1, jx + half, FCY - rise);
  let mid = strand(pM, 0, FEXL) +
            arrowOpen(pM, 60, 340, FGENEW, 1, INK) +
            arrowFill(pM, 420, FEXL, FLOXW, 1, BLUE);
  const gl = pM(180, 80);
  mid += label(gl[0], gl[1], "ampR", 26, INK);
  if (s.off > 0.004)
    mid = '<g transform="translate('+n2(F_PARK[0]*s.off)+' '+n2(F_PARK[1]*s.off)+')">'+mid+'</g>';
  g += fade(1 - s.gone, mid);

  const la = pL(230, 0);
  g += fade(1 - s.off, label(la[0], FCY + 58, "loxP", 24, BLUE));
  g += fade(s.off, label(la[0], FCY + 58, "one loxP left", 24, MUTED));
  g += fade((1 - s.loop) * (1 - s.off),
            label(jx + 2*half - 50, FCY + 58, "loxP", 24, BLUE));

  /* The phenotype, which is the only thing the room can actually see --
     and it does not flip when the gene leaves the chromosome. The
     excised circle is still in the cell and still carrying ampR, so the
     cell is still resistant. It turns sensitive when the circle is
     LOST, which is a different event with a different cause: the circle
     has no origin, so it cannot replicate, so it is diluted out over
     the next few divisions. Tying the label to `gone` rather than `off`
     is the whole reason excision-as-deletion takes time. */
  g += fade(1 - smooth(s.gone, 0.15, 0.6),
            label(800, 764, "resistant", 34, INK, "middle", 700));
  g += fade(smooth(s.gone, 0.45, 1),
            label(800, 764, "not resistant", 34, VERM, "middle", 700));
  g += fade(smooth(s.loop, 0.15, 0.6) * (1 - s.off),
            label(800, 268, "+ Cre", 30, VERM, "middle", 700));
  g += fade(s.names,
       label(800, 812, "Flp/FRT \u00b7 Dre/rox \u00b7 VCre/vloxP \u2014 same trick, different 34 bp site",
             26, MUTED));
  return g;
}

window.Deck.sequence("flox", function(slide){
  const svg = makeSvg('<g data-r="dyn"></g>');
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  const KEYS = ["loop","off","gone","names"];
  function paint(s){
    r.dyn.innerHTML = floxScene({
      loop:clamp01(s.loop), off:clamp01(s.off),
      gone:clamp01(s.gone), names:clamp01(s.names) });
  }
  const S = [
    { s:{loop:0,off:0,gone:0,names:0},
      cap:"a floxed resistance gene", sub:"",
      note:"This is what Cre is for. Here is a cell whose genome carries a resistance gene with a loxP site on either side, both pointing the same way. That is what floxed means. The cell grows on the antibiotic, because the gene is there and is being expressed. Nothing has happened yet.",
      desc:"A cell drawn as an ellipse containing a chromosome. On the chromosome, a gene labelled ampR sits between two blue loxP arrows both pointing right. Below the cell, the word resistant." },
    { s:{loop:1,off:0,gone:0,names:0},
      cap:"supply Cre", sub:"",
      note:"Now supply Cre, in one tissue or at one moment, however you choose to control it. The two sites are brought face to face, which means the DNA between them has to loop out, and that is the committed step.",
      desc:"Cre appears. The DNA between the two loxP sites bows upward into a loop until the two sites touch, and the chromosome on the right slides in behind it." },
    { s:{loop:1,off:1,gone:0,names:0},
      cap:"the gene leaves as a circle", sub:"out of the chromosome \u2014 but still in the cell, and still expressed",
      note:"The strands are exchanged and the gene leaves as a covalently closed circle carrying one of the two sites. The chromosome closes over the other one. Now check the phenotype, and be careful here, because this is where people get the timing wrong. The cell is still resistant. The gene is out of the chromosome but it is still in the cell, it is still intact, and it is still being transcribed. Nothing about cutting it out of the genome stops it working.",
      desc:"The loop pinches off and drifts up and to the right as a free circle carrying the ampR gene and one loxP arrow. The chromosome has closed with a single loxP at the junction. The cell is still labelled resistant." },
    { s:{loop:1,off:1,gone:1,names:0},
      cap:"the circle has no origin, so it is diluted away", sub:"and only now is the cell sensitive",
      note:"Here is what actually makes it a knockout. That circle has no origin of replication. It cannot be copied, so every time the cell divides, one daughter gets it and the other does not, and within a few generations it is gone from the population. Only now is the cell sensitive. So excision is not an off switch you throw, it is a deletion that takes a few divisions to show up, and if you assay too early you will see a cell that has already recombined and still grows. The same fact is why excision is effectively one-way: putting the circle back is a reaction between two molecules, and it gets slower as the circle gets rarer, so it loses the race against dilution.",
      desc:"The excised circle fades away as it is diluted out of the population, and only then does the label below the cell change from resistant to not resistant." },
    { s:{loop:1,off:1,gone:1,names:1},
      cap:"and it is not just Cre", sub:"",
      note:"Cre is not the only one of these. Flp with its FRT sites from the yeast two-micron plasmid, Dre with rox, VCre with vlox — all the same trick on a different thirty-four base pair site, which matters because you can run two of them in one cell without them touching each other's sites. One warning to finish on, and it is on the screen: there is still a loxP in that chromosome. Express Cre again later for some other purpose and it is a perfectly good site. It will be used.",
      desc:"A line names the other systems: Flp with FRT, Dre with rox, VCre with vloxP, all the same trick on a different 34 base pair site." }
  ];
  return driver(r, KEYS, paint, S);
});


/* ================================================================== *
 * 4.  homrec — homologous recombination, which has no site to draw.
 *
 * Every other slide in this section has a sequence the enzyme reads.
 * This one has nothing: what decides where the DNA lands is that two
 * stretches MATCH, and a match is a relationship between two molecules
 * rather than a feature of one. A static figure cannot show a
 * relationship -- it can only put two rows near each other and hope --
 * so the arms are drawn in the required-red of every operator in this
 * deck, they are the same red on both molecules, and the donor is
 * brought up until they register. Then the middles trade.
 * ================================================================== */
/* The cell is sized to what is in it. At its first height it left its
   lower half empty, and the aligned donor sat close enough to the
   chromosome that the two crossovers had 30 units to be drawn in. */
const HCELL = {x:276, y:296, w:1048, h:400, r:60};
const HCY = 380, HD0 = 600, HD1 = 500;      /* locus, donor, donor up  */
const HB = 56;                              /* box height              */
const HA = [548, 688], HM = [700, 900], HBB = [912, 1052];

function hbox(x, y, w, fill, stroke, text, tcol, italic){
  return '<rect x="'+n2(x)+'" y="'+n2(y-HB/2)+'" width="'+n2(w)+'" height="'+HB+
         '" rx="7" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3.2"/>' +
         '<text x="'+n2(x+w/2)+'" y="'+n2(y+10)+'" text-anchor="middle" font-size="28" '+
         'font-weight="700"'+(italic?' font-style="italic"':'')+' fill="'+tcol+'">'+text+'</text>';
}
/* the crossover itself: one X per arm, between the two molecules */
function cross(cx, y0, y1, o){
  const w = 26;
  return fade(o, '<g stroke="'+VERM+'" stroke-width="4" stroke-linecap="round">' +
    '<path d="M'+n2(cx-w)+' '+n2(y0)+'L'+n2(cx+w)+' '+n2(y1)+'"/>' +
    '<path d="M'+n2(cx+w)+' '+n2(y0)+'L'+n2(cx-w)+' '+n2(y1)+'"/></g>');
}

function homScene(s){
  let g = "";
  const dy = HD0 + (HD1 - HD0)*s.up;

  /* All of this happens inside a cell, and that is not decoration: the
     donor has to get in, and whether the cell will then do anything with
     it is the last beat of the slide. */
  g += '<rect x="'+HCELL.x+'" y="'+HCELL.y+'" width="'+HCELL.w+'" height="'+HCELL.h+
       '" rx="'+HCELL.r+'" fill="none" stroke="'+MUTED+'" stroke-width="3" '+
       'stroke-dasharray="3 9"/>';

  /* the chromosome, and the locus sitting in it */
  g += '<path d="M320 '+HCY+'H1280" fill="none" stroke="'+INK+'" stroke-width="4.4"/>';
  g += hbox(HA[0], HCY, HA[1]-HA[0], VERM, VERM, "A", "#fff");
  g += hbox(HBB[0], HCY, HBB[1]-HBB[0], VERM, VERM, "B", "#fff");
  /* the middle trades: the resident gene out, the cassette in */
  g += fade(1 - s.swap, hbox(HM[0], HCY, HM[1]-HM[0], "#fff", INK, "gene", INK, true));
  g += fade(s.swap,     hbox(HM[0], HCY, HM[1]-HM[0], BLUE, BLUE, "cassette", "#fff"));
  g += label(HCELL.x + 26, HCY - 54, "chromosome", 24, MUTED, "start");

  /* the donor, which differs from the locus in the middle and nowhere else */
  g += fade(1 - s.swap,
        '<path d="M528 '+n2(dy)+'H1072" fill="none" stroke="'+INK+'" stroke-width="4.4"/>' +
        hbox(HA[0], dy, HA[1]-HA[0], VERM, VERM, "A", "#fff") +
        hbox(HBB[0], dy, HBB[1]-HBB[0], VERM, VERM, "B", "#fff") +
        hbox(HM[0], dy, HM[1]-HM[0], BLUE, BLUE, "cassette", "#fff") +
        label(508, dy + 10, "donor", 24, MUTED, "end"));

  /* Nothing is drawn leaving. The displaced gene used to drift down and
     fade, which read as a third object with a journey of its own -- it
     is not, it is just gone, and the cassette sitting where it was is
     the entire event. */

  /* the two crossovers, at the arms and only at the arms */
  const xo = smooth(s.up, 0.62, 1) * (1 - smooth(s.swap, 0, 0.4));
  g += cross((HA[0]+HA[1])/2,  HCY + HB/2 + 8, dy - HB/2 - 8, xo);
  g += cross((HBB[0]+HBB[1])/2, HCY + HB/2 + 8, dy - HB/2 - 8, xo);

  g += fade(s.named,
        label(800, 818, "\u03bb Red in E. coli \u00b7 nothing needed in yeast or B. subtilis",
              27, INK, "middle", 700));
  return g;
}

window.Deck.sequence("homrec", function(slide){
  const svg = makeSvg('<g data-r="dyn"></g>');
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  const KEYS = ["up","swap","named"];
  function paint(s){
    r.dyn.innerHTML = homScene({up:clamp01(s.up), swap:clamp01(s.swap), named:clamp01(s.named)});
  }
  const S = [
    { s:{up:0,swap:0,named:0},
      cap:"a donor arrives, with the same flanks", sub:"identical either side, different in the middle",
      note:"Last one, and it is the odd one out, because there is no site to show you. Every other enzyme in this section reads a sequence: loxP, attB, attP. Homologous recombination reads nothing. Here is a locus in the genome — a gene with some stretch of sequence on either side of it — and here is a linear piece of DNA you made, carrying whatever you want in the middle, flanked by those same two stretches. The red is the same red on both molecules and that is the entire design: those flanks are identical, and nothing else about the donor matters.",
      desc:"A chromosome carrying three boxes: a red box A, an italic gene box, and a red box B. Below it, separate, a linear donor carrying the same red A and B boxes with a blue cassette between them." },
    { s:{up:1,swap:0,named:0},
      cap:"both arms pair, and both are cut", sub:"a double crossover — nothing here is reading a sequence",
      note:"The donor finds the locus by base pairing, arm to arm, and the crossovers happen inside the regions of identity. Notice what is choosing the target: not a recognition site, not a protein that reads letters, just the fact that two stretches of DNA are the same. That is why you can aim this anywhere in a genome — you are not looking for a site, you are supplying one half of a match. Make the arms long enough and you can hit any locus you like.",
      desc:"The donor rises until its A and B boxes register with the A and B boxes in the chromosome, and a red cross is drawn between the two molecules inside each arm." },
    { s:{up:1,swap:1,named:0},
      cap:"the middles trade", sub:"the arms are unchanged, so there is no scar to find afterwards",
      note:"And the middles trade. What was in the genome comes out, what you built goes in, and the arms are unchanged because they were identical to begin with — you cannot tell afterwards which copy of A survived. That is how a gene gets knocked out, how a tag gets added to the end of a coding sequence, how a promoter gets swapped. One reaction, and it leaves no scar, because there is no site to leave behind.",
      desc:"The gene box in the chromosome is replaced by the blue cassette. The donor is gone, and so is the gene that was there." },
    { s:{up:1,swap:1,named:1},
      cap:"who can do this", sub:"",
      note:"The catch is which organism will do it for you. Yeast and Bacillus subtilis take up a linear fragment with homology arms and recombine it in without being asked — it is one of the main reasons yeast is such a convenient host to build in. E. coli will not. Transform a linear cassette into ordinary E. coli and it is degraded, not integrated. The host protein that does strand exchange is RecA, and E. coli has it, but not in a configuration that will take a linear donor. What you do instead is supply the lambda Red genes — Exo, Beta and Gam — which substitute for what E. coli lacks, and the technique built on that is called recombineering. That is how gene knockouts are made in E. coli, and it is worth knowing that the whole Keio collection, every single-gene knockout in the organism, was made this way.",
      desc:"A line names the requirement: lambda Red in E. coli, nothing needed in yeast or B. subtilis." }
  ];
  return driver(r, KEYS, paint, S);
});


/* ================================================================== *
 * 5.  holliday — the mechanism under the double crossover.
 *
 * The previous slide shows the OUTCOME: a middle gets replaced. This
 * one shows how a single crossover is actually made, because the answer
 * is the one piece of DNA geometry in the lecture that cannot be got
 * from a cartoon of two boxes swapping.
 *
 * Drawn at STRAND level, four lines, and the two molecules keep their
 * colours the whole way through. That is the entire reason the diagram
 * works: after the exchange you can see which strand came from which
 * parent, so heteroduplex is visible as a duplex with one line of each
 * colour, and a crossover is visible as an arm that changed colour.
 *
 * The lower duplex is drawn flipped, so that the two strands which
 * exchange -- the two of LIKE polarity, one from each molecule -- are
 * the adjacent pair. That is the standard convention and it is not
 * cosmetic: strands of opposite polarity cannot swap.
 * ================================================================== */
const JXL = 300, JXR = 1300, JXN = 690, JXM = 950;
const JY0 = 388, JY1 = 440, JY2 = 556, JY3 = 608;
const JW = 5, JBARB = 22;

/* one strand segment; barb marks a 3' end at the given tip */
function jseg(x0, x1, y, col, barb, out){
  if (Math.abs(x1-x0) < 1) return "";
  let g = '<path d="M'+n2(x0)+' '+n2(y)+'H'+n2(x1)+'" fill="none" stroke="'+col+
          '" stroke-width="'+JW+'" stroke-linecap="round"/>';
  if (barb){
    const tip = barb > 0 ? x1 : x0;
    g += '<path d="M'+n2(tip - barb*JBARB)+' '+n2(y + out*13)+'L'+n2(tip)+' '+n2(y)+
         '" fill="none" stroke="'+col+'" stroke-width="'+JW+'" stroke-linecap="round"/>';
  }
  return g;
}
/* The crossing has to be wide enough to read AS a crossing. At +-20 over
   a 116-unit drop the two strands met in a pinch you could mistake for a
   kink, which loses the one thing the frame exists to show. */
const JDX = 52;
function jdiag(x, y0, y1, col){
  return '<path d="M'+n2(x-JDX)+' '+n2(y0)+'C'+n2(x-JDX*0.35)+' '+n2(y0)+' '+
         n2(x+JDX*0.35)+' '+n2(y1)+' '+n2(x+JDX)+' '+n2(y1)+
         '" fill="none" stroke="'+col+'" stroke-width="'+JW+'" stroke-linecap="round"/>';
}
function jcut(x, y, col){
  return '<g stroke="'+col+'" stroke-width="4" stroke-linecap="round">' +
         '<path d="M'+n2(x-15)+' '+n2(y-17)+'L'+n2(x+15)+' '+n2(y+17)+'"/>' +
         '<path d="M'+n2(x+15)+' '+n2(y-17)+'L'+n2(x-15)+' '+n2(y+17)+'"/></g>';
}

/* the junction itself, at whatever stage the state says */
function jJunction(s){
  const g0 = 13*s.nick;                       /* the two nicks opening   */
  const xc = JXN + (JXM - JXN)*s.mig;         /* where the branch is now */
  const c  = s.cross;
  let g = "";
  /* the two outer strands are untouched all the way through */
  g += jseg(JXL, JXR, JY0, INK,  +1, -1);
  g += jseg(JXL, JXR, JY3, BLUE, +1, +1);

  if (c < 0.02){
    /* before the exchange: two straight inner strands, nicked in place */
    g += jseg(JXL, JXN - g0, JY1, INK,  -1, +1) + jseg(JXN + g0, JXR, JY1, INK,  0, 0);
    g += jseg(JXL, JXN - g0, JY2, BLUE, -1, -1) + jseg(JXN + g0, JXR, JY2, BLUE, 0, 0);
  } else {
    /* after it: each inner strand keeps its colour and changes level */
    g += jseg(JXL, xc - JDX, JY1, INK,  -1, +1) + jdiag(xc, JY1, JY2, INK)  +
         jseg(xc + JDX, JXR, JY2, INK, 0, 0);
    g += jseg(JXL, xc - JDX, JY2, BLUE, -1, -1) + jdiag(xc, JY2, JY1, BLUE) +
         jseg(xc + JDX, JXR, JY1, BLUE, 0, 0);
  }
  return g;
}

/* the two ways it can be cut, and what each leaves behind */
function jProduct(splice, s){
  const xc = JXN + (JXM - JXN)*s.mig;
  let g = "";
  if (!splice){
    /* the crossed strands were cut: each molecule keeps its own outer
       strands, so the flanks are parental and all that is left is a
       stretch of heteroduplex past the branch point */
    g += jseg(JXL, JXR, JY0, INK, +1, -1);
    g += jseg(JXL, xc, JY1, INK, -1, +1) + jseg(xc, JXR, JY1, BLUE, 0, 0);
    g += jseg(JXL, xc, JY2, BLUE, -1, -1) + jseg(xc, JXR, JY2, INK, 0, 0);
    g += jseg(JXL, JXR, JY3, BLUE, +1, +1);
  } else {
    /* the uncrossed strands were cut: the arms trade, so each molecule
       is one parent to the left of the branch and the other to the right */
    g += jseg(JXL, xc, JY0, INK, 0, 0)  + jseg(xc, JXR, JY0, BLUE, +1, -1);
    g += jseg(JXL, xc, JY1, INK, -1, +1) + jseg(xc, JXR, JY1, BLUE, 0, 0);
    g += jseg(JXL, xc, JY2, BLUE, -1, -1) + jseg(xc, JXR, JY2, INK, 0, 0);
    g += jseg(JXL, xc, JY3, BLUE, 0, 0) + jseg(xc, JXR, JY3, INK, +1, +1);
  }
  return g;
}

function hollScene(s){
  const res = Math.max(s.resA, s.resB);
  const xc  = JXN + (JXM - JXN)*s.mig;
  let g = "";

  g += fade(1 - smooth(res, 0.42, 0.78), jJunction(s));
  g += fade(smooth(s.resA, 0.55, 1), jProduct(false, s));
  g += fade(smooth(s.resB, 0.55, 1), jProduct(true,  s));

  /* the cut marks, on whichever pair this resolution takes */
  const flash = smooth(res, 0.04, 0.22) * (1 - smooth(res, 0.34, 0.56));
  if (flash > 0.004){
    const onCrossed = s.resB < 0.02;
    g += fade(flash, onCrossed
      ? jcut(xc - 66, JY1, VERM) + jcut(xc + 66, JY2, VERM)
      : jcut(xc - 66, JY0, VERM) + jcut(xc + 66, JY3, VERM));
  }

  g += label(JXL - 16, JY0 + 34, "chromosome", 23, MUTED, "end");
  g += label(JXL - 16, JY3 - 22, "donor", 23, MUTED, "end");
  /* the nicks are the one thing worth pointing at while they are the news */
  g += fade(smooth(s.nick, 0.4, 1) * (1 - s.cross),
            label(JXN, JY1 - 26, "nick", 23, VERM, "middle", 700) +
            label(JXN, JY2 + 40, "nick", 23, VERM, "middle", 700));
  g += fade(s.cross * (1 - res),
            label(xc, JY0 - 34, "Holliday junction", 25, VERM, "middle", 700));
  return g;
}

window.Deck.sequence("holliday", function(slide){
  const svg = makeSvg('<g data-r="dyn"></g>');
  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  const KEYS = ["nick","cross","mig","resA","resB"];
  function paint(s){
    r.dyn.innerHTML = hollScene({
      nick:clamp01(s.nick), cross:clamp01(s.cross), mig:clamp01(s.mig),
      resA:clamp01(s.resA), resB:clamp01(s.resB) });
  }
  const S = [
    { s:{nick:0,cross:0,mig:0,resA:0,resB:0},
      cap:"two homologous duplexes, side by side", sub:"four strands, and the colours say which molecule each came from",
      note:"Now go one level down, because the box swapping on the last slide is the outcome and not the mechanism. Here are the two molecules at strand level: the chromosome in black, the donor in blue, four strands in total. Keep the colours in mind, because they are what makes the rest of this readable — at the end you will be able to see which strand came from which parent. One drawing convention before we start: the lower duplex is drawn flipped, so that the two strands nearest each other are the two of the same polarity. That is not cosmetic. Strands of opposite polarity cannot be swapped, so the pair that exchanges has to be that pair.",
      desc:"Four horizontal strands: an upper duplex in black, a lower duplex in blue, each strand carrying a half barb at its 3-prime end. The lower duplex is drawn inverted so the two inner strands run in the same direction." },
    { s:{nick:1,cross:0,mig:0,resA:0,resB:0},
      cap:"one nick in each, at the same position", sub:"the two inner strands — the pair of like polarity",
      note:"It starts with a nick in each molecule, in the two strands of like polarity, at the same position. In a real cell this is not two tidy nicks placed for you — it starts from a double-strand break, or a stalled fork, and a resected end goes looking for a partner — but the geometry that follows is the same, and this is the version that shows it.",
      desc:"A small gap opens in each of the two inner strands at the same x position, each labelled nick in red." },
    { s:{nick:1,cross:1,mig:0,resA:0,resB:0},
      cap:"the nicked strands change places", sub:"each one crosses over and pairs with the other molecule",
      note:"Each nicked strand leaves its own partner and pairs with the other duplex instead, and the ends are sealed. Look at what has been built: a single point where all four strands meet, with two of them crossing. That is the Holliday junction. Nothing has been exchanged yet in any way you could detect by sequencing — the two molecules are simply joined.",
      desc:"Each inner strand now crosses to the other duplex at the nick position and continues along it, keeping its own colour. The crossing point is labelled Holliday junction." },
    { s:{nick:1,cross:1,mig:1,resA:0,resB:0},
      cap:"the branch migrates", sub:"past it, every duplex has one strand of each colour — that is heteroduplex",
      note:"And the junction is not fixed. It slides, because unzipping one base pair on one side and forming the equivalent one on the other side costs nothing — that is branch migration. Watch what it leaves behind it. To the right of the branch point, each duplex now has one black strand and one blue one. That is heteroduplex: a duplex whose two strands came from different molecules. If the parents differ anywhere in that stretch, the cell is now holding mismatches, and how it repairs them decides what the sequence ends up being. That is where gene conversion comes from.",
      desc:"The crossing point slides to the right. Everywhere to the right of it, each duplex is drawn with one black strand and one blue strand." },
    { s:{nick:1,cross:1,mig:1,resA:1,resB:0},
      cap:"resolve it by cutting the two crossed strands", sub:"the flanks stay with their own molecule — no crossover",
      note:"Now it has to be taken apart, and there are exactly two ways to cut it. Cut the two strands that cross — the ones that made the junction — and you undo what you did. The molecules come apart with their own flanking arms still attached, so nothing outside the junction has been exchanged. All that is left of the whole event is that patch of heteroduplex. This is the non-crossover outcome, and it is the more common one.",
      desc:"Red cut marks appear on the two crossed strands, and the molecules separate. Each keeps its own outer strands, so the flanks are the parental colours, with a stretch of heteroduplex to the right of the branch point." },
    { s:{nick:1,cross:1,mig:1,resA:0,resB:1},
      cap:"or cut the other two — and the arms trade", sub:"black on the left, blue on the right: this is a crossover",
      note:"Or cut the other pair, the two strands that did not cross. Same junction, same enzyme, one plane of cutting rotated ninety degrees, and now look at the products: each molecule is black on one side of the branch point and blue on the other. The arms have been exchanged. That is a crossover, and it is the outcome the last slide was drawing as boxes trading places. One junction gives you one crossover. Put a homology arm on each side of your cassette and you get two of them, one in each arm, and everything between them is replaced. That is the whole of gene targeting, recombineering and yeast assembly, and it is all this picture, twice.",
      desc:"The cut marks move to the two uncrossed outer strands. The products are each black to the left of the branch point and blue to the right, and the reverse: the flanking arms have been exchanged." }
  ];
  return driver(r, KEYS, paint, S);
});

})();
