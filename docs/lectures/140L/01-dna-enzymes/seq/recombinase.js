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
  g += label(800, 302, "two 13 bp arms &#8212; inverted repeats of each other, one Cre monomer on each", 24, MUTED);

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
  g += '<g fill="none" stroke="'+MUTED+'" stroke-width="2.2" stroke-linejoin="round">' +
         '<path d="M'+n2(armL0)+' 366v12H'+n2(armL1)+'v-12"/>' +
         '<path d="M'+n2(armR0)+' 366v12H'+n2(armR1)+'v-12"/>' +
       '</g>';
  g += label((armL0+armL1)/2, 352, "13 bp arm &#8594;", 21, MUTED) +
       label((armR0+armR1)/2, 352, "&#8592; 13 bp arm", 21, MUTED);

  /* the sequence */
  g += '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="34" ' +
         'font-weight="600" text-anchor="middle">';
  for (let i = 0; i < 34; i++){
    const col = (i >= 13 && i < 21) ? VERM : INK;
    g += '<text x="'+n2(CH(i))+'" y="444" fill="'+col+'">'+LOX_T[i]+'</text>' +
         '<text x="'+n2(CH(i))+'" y="492" fill="'+col+'">'+LOX_B[i]+'</text>';
  }
  g += '</g>';
  g += label(X0-30, 444, "5&#8242;", 24, MUTED, "end") + label(X0+34*PITCH+30, 444, "3&#8242;", 24, MUTED, "start") +
       label(X0-30, 492, "3&#8242;", 24, MUTED, "end") + label(X0+34*PITCH+30, 492, "5&#8242;", 24, MUTED, "start");

  /* the spacer, bracketed */
  const sx0 = X0 + 13*PITCH, sx1 = X0 + 21*PITCH;
  g += '<path d="M'+n2(sx0)+' 522V542H'+n2(sx1)+'V522" fill="none" stroke="'+VERM+
         '" stroke-width="3.2" stroke-linejoin="round"/>';
  g += label(800, 590, "8 bp spacer: ATGTATGC one way, GCATACAT the other", 27, VERM);
  g += label(800, 626, "not a palindrome &#8212; this is where the site&#8217;s direction comes from", 24, MUTED);

  /* and the level-3 icon it collapses to */
  const pt = curve(34*PITCH, 0, 1, 800, 712);
  g += arrowFill(pt, 0, 34*PITCH, 17, 1, BLUE);
  g += label(800, 776, "from here on, just this arrow \u2014 it marks the site, not a strand end", 26, MUTED);
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
  const sx = Math.cos(Math.PI*t), lift = 130*Math.sin(Math.PI*t);

  const pL = curve(390, 0, 1, 345, Y0);
  g += strand(pL, 0, 390) + arrowFill(pL, 250, 390, LOXW, 1, BLUE);

  /* right flank keeps loxP B, which points the OTHER way */
  const pR = curve(450, 0, 1, 1225, Y0);
  g += strand(pR, 0, 450) + arrowFill(pR, 0, 140, LOXW, -1, BLUE);

  /* the segment between the sites is flipped end for end */
  const pM = curve(460, 0, 1, 770, Y0);
  g += '<g transform="translate(0 '+n2(-lift)+') translate(770 '+Y0+') scale('+n2(sx)+' 1) translate(-770 '+(-Y0)+')">' +
         strand(pM, 0, 460) + arrowOpen(pM, 40, 420, GENEW, 1, INK) +
       '</g>';

  g += label(470, Y0 + 60, "loxP", 26, BLUE) + label(1070, Y0 + 60, "loxP", 26, BLUE);
  g += fade(Math.abs(sx), label(770, Y0 + 60, "gene", 26, INK));
  g += fade(smooth(t, 0.7, 1), label(800, Y0 - 92, "both sites survive &#8212; so Cre can do it again", 26, MUTED));
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
      sub:"two 13 bp arms that Cre binds, and an 8 bp spacer that gives the site its direction",
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
      note:"Same orientation gives excision. The segment between the sites comes out as a covalently closed circle. Notice the bookkeeping: each product keeps one complete loxP, because each new site is built from one arm of each parent site and the arms are identical. In practice this is a one-way trip, and not because the chemistry is one way. The circle usually carries no origin of replication, so it is diluted out as the cells divide, and putting it back is a two-molecule reaction that gets slower as the circle gets rarer. That is exactly why floxing works as a deletion.",
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

function reaction(fwd, rev, unlock){
  const o = smooth(fwd, 0.5, 1);
  if (o <= 0.004) return "";
  let g = label(800, 528, "attB &#160;+&#160; attP", 38, INK, "middle", 700) +
          label(800, 666, "attL &#160;+&#160; attR", 38, INK, "middle", 700) +
          downArrow(726, 552, 634, BLUE) +
          label(704, 600, "integrase", 24, BLUE, "end") +
          label(800, 736, "attL = B&#183;P&#8242; and attR = P&#183;B&#8242; &#8212; neither one is attB, neither one is attP", 26, MUTED);

  const ro = smooth(rev, 0.25, 1);
  g += fade(ro * (1 - unlock),
        upArrow(874, 634, 552, VERM) +
        '<g stroke="'+VERM+'" stroke-width="4.2" stroke-linecap="round">' +
          '<path d="M860 580L888 608"/><path d="M888 580L860 608"/></g>' +
        label(902, 600, "integrase alone: no reaction", 24, VERM, "start"));
  g += fade(ro * unlock,
        upArrow(874, 634, 552, BLUE) +
        label(902, 600, "+ directionality factor", 24, BLUE, "start"));
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
                      reaction(clamp01(s.fwd), clamp01(s.rev), clamp01(s.unlock));
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

    { s:{t:1,fwd:1,rev:1,unlock:1},
      cap:"one way — unless you supply the key",
      sub:"a directionality factor (gp47 in BxbI, Xis in lambda) turns the reverse reaction on",
      note:"The reverse is not impossible, it is just off by default. Each system has a small accessory protein, a recombination directionality factor, that remodels the complex so that attL and attR become the productive pair: gp47 for BxbI, and in lambda the same job is done by Xis. So you get a switch you can throw deliberately — integrate now, excise later, on command. That is the basis of the recombinase memory and logic circuits, and commercially it is Gateway: BP clonase runs attB times attP forward, and LR clonase, which is the same integrase plus Xis, runs attL times attR back.",
      desc:"The strike-through is gone. The upward reverse arrow is now blue and labelled: plus directionality factor." }
  ];
  return driver(r, KEYS, paint, S);
});

})();
