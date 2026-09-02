/* ------------------------------------------------------------------ *
 * endonuclease.js — the two ideas that carry the restriction section.
 *
 * Registers:  ecori    why a Type II site is a palindrome, and what the
 *                      cut position relative to the symmetry axis buys
 *                      you: sticky vs blunt, and an overhang that can
 *                      find a partner.                        (4 steps)
 *             typeIIs  a Type IIS enzyme cutting OUTSIDE its site, and
 *                      the consequence: the overhang sequence is not
 *                      part of the site, so the designer picks it.
 *                                                             (3 steps)
 *
 * Both are drawn at the LETTERS level, because in both cases the point
 * is a POSITION — where the cut lands relative to the site.  Neither
 * needs atoms (the scissile bond has its own slide) and neither can be
 * done with a line (a line has no columns to count).
 *
 * Coordinates checked against the enzymes' real cut positions:
 *   EcoRI  G^AATTC          symmetric, 2 bases either side of the axis
 *   EcoRV  GAT^ATC          on the axis -> blunt
 *   BsaI   GGTCTC(1/5)      1 nt past the site on the top strand,
 *                           5 nt past on the bottom -> 4 nt 5' overhang
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
const n2 = v => Math.round(v*10)/10;

/* ---------------------------------------------------------- helpers */

function stage(slide, markup){
  const s = document.createElementNS(SVGNS, "svg");
  s.setAttribute("viewBox", "0 0 1600 900");
  s.setAttribute("aria-hidden", "true");
  s.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  s.innerHTML = markup;
  slide.appendChild(s);
  const r = {};
  s.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  return r;
}

/* letters of `str`, its first character sitting in column `c0` */
function row(str, c0, x0, step, y, colOf){
  let s = "";
  for (let i = 0; i < str.length; i++)
    s += '<text x="' + n2(x0 + (c0 + i)*step) + '" y="' + y + '" fill="' +
         colOf(c0 + i) + '">' + str[i] + '</text>';
  return s;
}
/* a group carrying the monospace run of a sequence */
function mono(id, size, inner, extra){
  return '<g' + (id ? ' data-r="' + id + '"' : '') + ' font-family="' + MONO +
         '" font-size="' + size + '" font-weight="600" text-anchor="middle"' +
         (extra || "") + '>' + inner + '</g>';
}
function label(x, y, size, fill, txt, weight){
  return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="inherit" ' +
         'font-size="' + size + '" font-weight="' + (weight || 400) + '" fill="' + fill +
         '">' + txt + '</text>';
}
function tick(x, y1, y2, col, w){
  return '<path d="M' + x + ' ' + y1 + 'V' + y2 + '" stroke="' + col +
         '" stroke-width="' + (w || 3.4) + '" stroke-linecap="round" fill="none"/>';
}
function dash(x, y1, y2){
  return '<path d="M' + x + ' ' + y1 + 'V' + y2 + '" stroke="' + MUTED +
         '" stroke-width="2.6" stroke-dasharray="9 10" fill="none"/>';
}
/* |----| with a bold count above the middle — an engineering measure */
function measure(x1, x2, y, txt){
  return '<g fill="none" stroke="' + RED + '" stroke-width="2.8" stroke-linecap="round">' +
           '<path d="M' + x1 + ' ' + (y-12) + 'V' + (y+12) + '"/>' +
           '<path d="M' + x2 + ' ' + (y-12) + 'V' + (y+12) + '"/>' +
           '<path d="M' + x1 + ' ' + y + 'H' + x2 + '"/></g>' +
         label(n2((x1+x2)/2), y - 22, 28, RED, txt, 700);
}

/* one tween runner per sequence: cubic in/out over a bag of numbers */
function tweener(keys, paint){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, raf = null;
  return function(to, animated){
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    if (!cur || animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 780;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0)/dur), e = ease(t), s = {};
      keys.forEach(k => s[k] = from[k] + (to[k] - from[k])*e);
      paint(s); cur = s;
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  };
}

/* ================================================================== *
 * ecori — the palindrome, the stagger, and the partner
 * ================================================================== */
/*
 *  col:   0 1 2   3 4 5 6 7 8   9 10 11
 *  top:   c t g   G A A T T C   g  c  a
 *  bot:   g a c   C T T A A G   c  g  t
 *
 *  EcoRI G^AATTC: top strand cuts between col 3 and col 4, bottom
 *  strand (read 5'->3' right to left) cuts between col 7 and col 8.
 *  The axis lies between col 5 and col 6; both cuts are two columns
 *  from it, which is precisely why the ends stagger by four.
 */
(function(){

const LX = 404, ST = 72, TY = 406, BY = 496, FS = 50;
const AX = LX + 5.5*ST;                 /* 800 — dead centre of the box */
const CT = LX + 3.5*ST;                 /* 656 — top-strand scissile bond   */
const CB = LX + 7.5*ST;                 /* 944 — bottom-strand scissile bond */
const SEP = 150;                        /* half the gap once cut */
const XL = LX - ST, XR = LX + 12*ST;    /* where the 5'/3' labels sit */

const site = c => c >= 3 && c <= 8;
const colA = c => site(c) ? BLUE : INK;

/* the four unpaired columns get a blue copy and a red copy,
   cross-faded, so "these four are now the point" is a colour change
   on top of a change in shape (they stick out) — never colour alone. */
function overhang(idBlue, idRed, str, y){
  return mono(idBlue, FS, row(str, 4, LX, ST, y, () => BLUE)) +
         mono(idRed,  FS, row(str, 4, LX, ST, y, () => RED), ' opacity="0"');
}
function ends(gid, which){
  /* 5'/3' markers travel with their fragment */
  return which === "L"
    ? label(XL, TY, 26, MUTED, "5&#8242;") + label(XL, BY, 26, MUTED, "3&#8242;")
    : label(XR, TY, 26, MUTED, "3&#8242;") + label(XR, BY, 26, MUTED, "5&#8242;");
}

/* ---- band B: EcoRV, the on-axis cut.  Only the product state. ---- */
const LB = 503, SB = 54, TYB = 750, BYB = 808, FSB = 38, XB = 54;
const colB = c => site(c) ? BLUE : INK;

function bandB(){
  return '<g data-r="blunt" opacity="0">' +
    label(AX, 690, 26, INK,
      "EcoRV &nbsp;GAT/ATC &mdash; the cut lands on the axis", 700) +
    dash(AX, 718, 830) +
    '<g transform="translate(' + (-XB) + ' 0)">' +
      mono("", FSB, row("ctgGAT", 0, LB, SB, TYB, colB) +
                    row("gacCTA", 0, LB, SB, BYB, colB)) +
      label(LB - SB, TYB, 22, MUTED, "5&#8242;") +
      label(LB - SB, BYB, 22, MUTED, "3&#8242;") +
    '</g>' +
    '<g transform="translate(' + XB + ' 0)">' +
      mono("", FSB, row("ATCgca", 6, LB, SB, TYB, colB) +
                    row("TAGcgt", 6, LB, SB, BYB, colB)) +
      label(LB + 12*SB, TYB, 22, MUTED, "3&#8242;") +
      label(LB + 12*SB, BYB, 22, MUTED, "5&#8242;") +
    '</g></g>';
}

const MARKUP =
  /* the enzyme: one envelope, split by its own two-fold axis, with a
     mark on each half at the bond that half of it breaks */
  '<g data-r="env">' +
    '<rect x="568" y="348" width="464" height="184" rx="24" fill="' + BLUE +
      '" fill-opacity=".07" stroke="' + BLUE + '" stroke-width="2.6"/>' +
    label(AX, 322, 26, BLUE, "EcoRI &mdash; two identical subunits", 700) +
    tick(CT, 366, 424, RED) + tick(CB, 456, 514, RED) +
  '</g>' +
  '<g data-r="axis">' + dash(AX, 328, 554) +
    label(AX, 580, 24, MUTED, "two-fold axis") + '</g>' +

  /* left fragment: top cols 0-3, bottom cols 0-7 */
  '<g data-r="gL">' +
    mono("", FS, row("ctgG", 0, LX, ST, TY, colA) +
                 row("gacC", 0, LX, ST, BY, colA)) +
    overhang("ohLb", "ohLr", "TTAA", BY) + ends("gL", "L") +
  '</g>' +

  /* the partner: a different molecule, also cut with EcoRI.  Its
     flanking sequence differs, and it says so, or the arrival reads as
     the cut simply running backwards. */
  '<g data-r="gP" opacity="0">' +
    mono("", FS, row("aagG", 0, LX, ST, TY, colA) +
                 row("ttcC", 0, LX, ST, BY, colA)) +
    overhang("ohPb", "ohPr", "TTAA", BY) + ends("gP", "L") +
    label(590, 344, 25, BLUE, "a different molecule, cut with the same enzyme", 700) +
  '</g>' +

  /* right fragment: top cols 4-11, bottom cols 8-11 */
  '<g data-r="gR">' +
    mono("", FS, row("Cgca", 8, LX, ST, TY, colA) +
                 row("Gcgt", 8, LX, ST, BY, colA)) +
    overhang("ohRb", "ohRr", "AATT", TY) + ends("gR", "R") +
  '</g>' +

  /* the two breaks that survive annealing */
  '<g data-r="nick" opacity="0">' +
    tick(CT, 368, 412, RED, 4.4) + tick(CB, 458, 502, RED, 4.4) + '</g>' +

  bandB() +
  label(AX, 258, 32, INK, "", 700).replace("<text", '<text data-r="cap"') +
  '<text data-r="ann" x="' + AX + '" y="632" text-anchor="middle" ' +
    'font-family="inherit" font-size="28" fill="' + MUTED + '"></text>';

const S = [
{ st:{sep:0, env:1, axis:1, oh:0, p:0, nick:0, blunt:0},
  cap:"the enzyme is a dimer",
  ann:'both strands, read 5&#8242;&#8594;3&#8242;: <tspan font-family="' + MONO +
      '" font-weight="700" fill="' + BLUE + '">GAATTC</tspan>',
  note:"Read the top strand: G A A T T C. Now read the bottom strand five prime to three prime, which is right to left here: G A A T T C again. That is what palindrome means in this business — not a word that reads the same backwards, but a sequence that is its own reverse complement. And there is a reason the sites look like this. EcoRI is a homodimer, two identical subunits related by a two-fold axis, and each subunit reads and cuts one strand. If the two subunits are identical then the two strands have to present them the same sequence. So the site has no choice but to be a palindrome. That one sentence explains the form of essentially every Type Two site in the catalogue.",
  desc:"A twelve base pair duplex written as letters, the six base site GAATTC picked out in blue on both strands. A tinted envelope sits over the site with a dashed vertical line down its centre marking the two-fold axis, and a short red tick marks the bond each half of the enzyme breaks: one on the top strand left of centre, one on the bottom strand right of centre. A line below reads: both strands, read five prime to three prime, GAATTC." },

{ st:{sep:1, env:0, axis:1, oh:1, p:0, nick:0, blunt:0},
  cap:"an off-axis cut leaves an overhang",
  ann:"four unpaired bases on each end &mdash; a 5&#8242; AATT overhang",
  note:"Each subunit cuts between the G and the A of the strand it is holding. Because the two subunits sit on opposite sides of the axis, the two cuts land two bases either side of it, and the ends come out staggered rather than flush. Four bases at each end are left with no partner. Those four are a five prime overhang — five prime because on each fragment the strand that sticks out is the one whose five prime end is at the cut. Get the polarity right in your head now, because it is what decides whether two ends can be joined.",
  desc:"The duplex has separated into two fragments with a clear gap between them, the dashed axis sitting in the middle of that gap. Each cut end is staggered: four bases stand unpaired in red, on the bottom strand of the left fragment and on the top strand of the right fragment." },

{ st:{sep:1, env:0, axis:1, oh:1, p:0, nick:0, blunt:1},
  cap:"an on-axis cut leaves a blunt end",
  ann:"four unpaired bases on each end &mdash; a 5&#8242; AATT overhang",
  note:"Same logic, different enzyme. EcoRV recognises GATATC and cuts between the T and the A — right on the axis. Same dimer, same symmetry, but with the cut sitting on the axis instead of beside it there is no stagger and not one unpaired base. That is a blunt end. So sticky versus blunt is not some separate property you have to memorise per enzyme: it is only ever a question of where the cut sits relative to the axis of symmetry.",
  desc:"A second, smaller duplex appears below, labelled EcoRV GAT slash ATC. It has also been cut in two, but both strands break in the same column, on its own dashed axis, so the two ends are flush with nothing protruding." },

{ st:{sep:0, env:0, axis:0, oh:1, p:1, nick:1, blunt:0},
  cap:"the overhang finds a partner",
  ann:"joined by four base pairs &mdash; the backbone is still nicked",
  note:"And here is why anyone cares. AATT is its own complement, so an EcoRI end will base pair with any other EcoRI end — from this plasmid, from a PCR product, from an organism that has never met this one. That is the whole trick of cloning, and it is the reason this course exists. Notice exactly what you have after annealing: four base pairs holding two molecules together, and two breaks in the backbone that are still open. Those are nicks, and sealing them is the ligase's job. A blunt end can also be ligated, but nothing holds the two pieces together while the ligase finds them, which is why blunt ligations are so much less efficient.",
  desc:"The lower duplex is gone. A different left hand fragment has arrived and its four unpaired bases have paired with the four on the right hand fragment, closing the gap into a continuous run of letters. Two short red ticks, one on each strand at opposite ends of those four base pairs, mark the two remaining breaks in the backbone." }
];

window.Deck.sequence("ecori", function(slide){
  const r = stage(slide, MARKUP);
  const keys = ["sep","env","axis","oh","p","nick","blunt"];

  const run = tweener(keys, function(s){
    r.gL.setAttribute("transform", "translate(" + n2(-SEP*s.sep) + " 0)");
    r.gR.setAttribute("transform", "translate(" + n2( SEP*s.sep) + " 0)");
    /* the partner slides in from off-stage as the original left piece goes */
    r.gP.setAttribute("transform",
      "translate(" + n2(-SEP*s.sep - 300*(1 - s.p)) + " 0)");
    r.gL.setAttribute("opacity", n2(1 - s.p));
    r.gP.setAttribute("opacity", n2(s.p));
    r.env  .setAttribute("opacity", n2(s.env));
    r.axis .setAttribute("opacity", n2(s.axis));
    r.nick .setAttribute("opacity", n2(s.nick));
    r.blunt.setAttribute("opacity", n2(s.blunt));
    ["ohLb","ohPb","ohRb"].forEach(k => r[k].setAttribute("opacity", n2(1 - s.oh)));
    ["ohLr","ohPr","ohRr"].forEach(k => r[k].setAttribute("opacity", n2(s.oh)));
  });

  function go(i, animated){
    r.cap.textContent = S[i].cap;
    r.ann.innerHTML   = S[i].ann;
    run(S[i].st, animated);
  }
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});

})();

/* ================================================================== *
 * typeIIs — the cut is not in the site, so the overhang is yours
 * ================================================================== */
/*
 *  col:   0 1 2   3 4 5 6 7 8   9   10 11 12 13   14 15 16
 *  top:   c t g   G G T C T C   g   g  a  t  c    c  t  g
 *  bot:   g a c   C C A G A G   c   c  t  a  g    g  a  c
 *
 *  BsaI GGTCTC(1/5): top strand cuts one base past the site, between
 *  col 9 and col 10; bottom strand cuts five bases past, between col
 *  13 and col 14.  Difference of four -> a 4 nt 5' overhang, whose
 *  sequence is columns 10-13 and is no part of the recognition site.
 */
(function(){

const LX = 336, ST = 58, TY = 424, BY = 512, FS = 46;
const CT = LX + 9.5*ST;                  /*  887 — top-strand cut     */
const CB = LX + 13.5*ST;                 /* 1119 — bottom-strand cut  */
const EDGE = LX + 8*ST + ST/2;           /*  829 — right edge of the site */
const SEP = 118;
const XL = LX - ST, XR = LX + 17*ST;

const site = c => c >= 3 && c <= 8;
const colS = c => site(c) ? BLUE : INK;

/* columns 10-13 exist three times over: as plain sequence, as the
   red overhang, and as a DIFFERENT red overhang — the
   third is the whole argument of the slide. */
function oh(ids, str, alt, y){
  return mono(ids[0], FS, row(str, 10, LX, ST, y, () => INK)) +
         mono(ids[1], FS, row(str, 10, LX, ST, y, () => RED), ' opacity="0"') +
         mono(ids[2], FS, row(alt, 10, LX, ST, y, () => RED), ' opacity="0"');
}

const MARKUP =
  /* left fragment: top cols 0-9, bottom cols 0-13.  The site rides
     with it, which is the point of step 2. */
  '<g data-r="gL">' +
    mono("", FS, row("ctgGGTCTCg", 0, LX, ST, TY, colS) +
                 row("gacCCAGAGc", 0, LX, ST, BY, colS)) +
    oh(["oLp","oLr","oLa"], "ctag", "tcca", BY) +
    label(XL, TY, 24, MUTED, "5&#8242;") + label(XL, BY, 24, MUTED, "3&#8242;") +
    '<path d="M' + (LX + 3*ST - ST/2) + ' 372H' + EDGE + '" stroke="' + BLUE +
      '" stroke-width="3.2" fill="none"/>' +
    label(LX + 5.5*ST, 352, 25, BLUE, "recognition site", 700) +
  '</g>' +

  /* right fragment: top cols 10-16, bottom cols 14-16 */
  '<g data-r="gR">' +
    mono("", FS, row("ctg", 14, LX, ST, TY, colS) +
                 row("gac", 14, LX, ST, BY, colS)) +
    oh(["oRp","oRr","oRa"], "gatc", "aggt", TY) +
    label(XR, TY, 24, MUTED, "3&#8242;") + label(XR, BY, 24, MUTED, "5&#8242;") +
    '<g data-r="brace" opacity="0">' +
      '<path d="M' + (LX + 10*ST - ST/2) + ' 378H' + (LX + 13*ST + ST/2) +
        '" stroke="' + RED + '" stroke-width="3.2" fill="none"/>' +
      label(LX + 11.5*ST, 356, 25, RED, "yours to choose", 700) +
    '</g>' +
  '</g>' +

  /* where the cut actually lands, and how far out it is */
  '<g data-r="cut">' +
    tick(CT, 384, 442, RED) + tick(CB, 472, 530, RED) +
    dash(EDGE, 386, 646) + dash(CT, 448, 578) + dash(CB, 536, 646) +
    measure(EDGE, CT, 578, "1") + measure(EDGE, CB, 646, "5") +
  '</g>' +

  label(800, 258, 32, INK, "", 700).replace("<text", '<text data-r="cap"') +
  '<text data-r="ann" x="800" y="736" text-anchor="middle" font-family="inherit" ' +
    'font-size="28" fill="' + MUTED + '"></text>';

const S = [
{ st:{sep:0, cut:1, red:0, alt:0, brace:0},
  cap:"the site is here; the cut is over there",
  ann:"BsaI &nbsp;GGTCTC (1/5) &mdash; one base out on top, five on the bottom",
  note:"BsaI is a Type Two S enzyme, and the S is the entire story. Its site is GGTCTC, and notice straight away that it is not a palindrome: the bottom strand reads GAGACC. An asymmetric site has a direction, and BsaI uses that direction — it binds here and cuts over there, downstream, on sequence it does not read at all. In these enzymes the piece of protein that recognises the site and the piece that does the chemistry are separate domains, which is how they can be in two different places. The catalogue writes it GGTCTC one slash five: one base past the site on the top strand, five bases past on the bottom.",
  desc:"A seventeen base pair duplex written as letters. The six letters GGTCTC are blue and underlined, labelled recognition site. Two red ticks mark where the enzyme cuts, one on the top strand one base past the site and one on the bottom strand five bases past. Below the duplex, two measured lines run from the edge of the site out to each cut, labelled 1 and 5." },

{ st:{sep:1, cut:0, red:1, alt:0, brace:0},
  cap:"the site leaves with the piece you throw away",
  ann:"a 4-base 5&#8242; overhang &mdash; and no GGTCTC left in the product",
  note:"It cuts, and two things happen that do not happen with EcoRI. First, you still get a four base five prime overhang, because one and five differ by four; so far, nothing new. Second, and this is the part people miss the first time: the recognition site went with the left hand fragment. The piece you are keeping has no GGTCTC anywhere in it. Put a site at each end of your part, pointing inward, and both sites are cut off. There is nothing left behind to make a scar.",
  desc:"The duplex has separated into two fragments with a clear gap. The blue recognition site and its label have travelled with the left fragment. Four bases stand unpaired in red at each cut end: g a t c on the top strand of the right fragment, c t a g on the bottom strand of the left." },

{ st:{sep:1, cut:0, red:1, alt:1, brace:1},
  cap:"so the overhang sequence is yours",
  ann:"same enzyme, same 1/5 &mdash; any 4-base 5&#8242; overhang you like",
  note:"And here is the punchline. Those four overhang bases are not part of the recognition site. BsaI does not read them — it only counts. So put whatever you like there: change the four bases and the same enzyme hands you a different overhang. That is what makes Golden Gate work. You give every junction in a multi-part assembly its own four base overhang, so the parts can only assemble one way, and you do the whole thing with one enzyme in one tube. And it works outward as well as inward. The end BsaI leaves is a four base five prime overhang, which is the same shape of end that BamHI, XbaI, HindIII and XhoI leave — so choose the sequence to match one of them and your Golden Gate part drops straight into a conventionally cut vector. Make it GATC and it ligates into a BamHI site; make it CTAG and it goes into an XbaI site. Be clear about why that works: not because those overhangs are interchangeable — GATC will not ligate to CTAG — but because you deliberately picked one to match. Two things will bite you. Two junctions that share an overhang, or an overhang that is its own complement, will cross-ligate and scramble the order. And if any of your parts contains an internal BsaI site, the enzyme will cut the part in half — so check for that before you order.",
  desc:"The four unpaired bases have changed: g a t c becomes a g g t on the top strand of the right fragment, and correspondingly c t a g becomes t c c a on the bottom strand of the left. A red rule above the changed bases is labelled yours to choose." }
];

window.Deck.sequence("typeIIs", function(slide){
  const r = stage(slide, MARKUP);
  const keys = ["sep","cut","red","alt","brace"];

  const run = tweener(keys, function(s){
    r.gL.setAttribute("transform", "translate(" + n2(-SEP*s.sep) + " 0)");
    r.gR.setAttribute("transform", "translate(" + n2( SEP*s.sep) + " 0)");
    r.cut  .setAttribute("opacity", n2(s.cut));
    r.brace.setAttribute("opacity", n2(s.brace));
    ["oLp","oRp"].forEach(k => r[k].setAttribute("opacity", n2(1 - s.red)));
    ["oLr","oRr"].forEach(k => r[k].setAttribute("opacity", n2(s.red*(1 - s.alt))));
    ["oLa","oRa"].forEach(k => r[k].setAttribute("opacity", n2(s.red*s.alt)));
  });

  function go(i, animated){
    r.cap.textContent = S[i].cap;
    r.ann.innerHTML   = S[i].ann;
    run(S[i].st, animated);
  }
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});

})();

})();
