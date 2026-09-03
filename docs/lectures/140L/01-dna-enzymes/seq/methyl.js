/* ------------------------------------------------------------------ *
 * methyl.js — the three drawn figures of the methyltransferase section.
 *
 *   rmself  restriction–modification as self versus non-self.  Two
 *           molecules with the SAME sites; only one carries marks; the
 *           endonuclease cuts the other.  Level 3 (a line): the point is
 *           topology and fate, not position.
 *
 *   marks   what a methyltransferase actually writes.  Level 1 (atoms),
 *           because the whole claim is "one carbon, at one numbered
 *           position".  Skeletal rings, carbons implicit, EVERY ring
 *           position numbered — the slide asserts N6, C5 and N4 and the
 *           reader has to be able to check those against the drawing.
 *           Three separate structures: m6A, m5C and m4C are three
 *           molecules, and no cytosine carries two methyls.
 *
 *   dpni    the inversion.  DpnI cuts ONLY methylated GATC, so it can
 *           tell an old plasmid from a new one.  Level 3 again.
 *
 * Colour, per the attention ladder: the METHYL MARK is red on
 * every one of these (it is what the section is about); blue is the
 * molecule whose fate the viewer is following; everything else is ink.
 * Every colour distinction is also carried by a word, per WCAG 1.4.1.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;
const rad = d => d*Math.PI/180;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

/* ---------------------------------------------------------- helpers */

function mount(slide, inner){
  const s = document.createElementNS(SVGNS, "svg");
  s.setAttribute("viewBox", "0 0 1600 900");
  s.setAttribute("aria-hidden", "true");
  s.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  s.innerHTML = inner;
  slide.appendChild(s);
  const r = {};
  s.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  return r;
}

function seg(a, b, col, w){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+'" fill="none" stroke="' +
         (col || INK) + '" stroke-width="' + (w || 2.8) + '" stroke-linecap="round"/>';
}

/* nothing in this deck may be set below 30px in the 1600x900 box */
function txt(x, y, s, o){
  o = o || {};
  return '<text x="'+n2(x)+'" y="'+n2(y)+'"' +
         ' text-anchor="'+(o.anchor || "middle")+'"' +
         ' font-family="'+(o.mono ? "ui-monospace,SFMono-Regular,Menlo,monospace" : "inherit")+'"' +
         ' font-size="'+(o.size || 30)+'"' +
         ' font-weight="'+(o.weight || 400)+'"' +
         ' fill="'+(o.fill || INK)+'"' +
         (o.r ? ' data-r="'+o.r+'"' : '') +
         (o.op != null ? ' opacity="'+o.op+'"' : '') + '>' + s + '</text>';
}

function arcPath(cx, cy, r, a0, a1){
  const p0 = [cx + r*Math.cos(rad(a0)), cy + r*Math.sin(rad(a0))];
  const p1 = [cx + r*Math.cos(rad(a1)), cy + r*Math.sin(rad(a1))];
  const large = ((a1 - a0 + 3600) % 360) > 180 ? 1 : 0;
  return "M"+n2(p0[0])+" "+n2(p0[1])+"A"+n2(r)+" "+n2(r)+" 0 "+large+" 1 "+n2(p1[0])+" "+n2(p1[1]);
}

/* a methyl group, drawn as a point mark on a stalk */
function methyl(x, y, dx, dy){
  const L = 27, R = 9.5;
  return seg([x, y], [x + dx*L, y + dy*L], RED, 3.2) +
         '<circle cx="'+n2(x + dx*(L+11))+'" cy="'+n2(y + dy*(L+11))+'" r="'+R+'" fill="'+RED+'"/>';
}

/* ================================================================== *
 * 1. rmself — self versus non-self
 * ================================================================== */
(function(){
  const X0 = 210, X1 = 1390;
  const HY1 = 350, HY2 = 418;          /* host chromosome, two strands   */
  const PY1 = 638, PY2 = 706;          /* phage DNA                      */
  const CUT = [X0, 420, 690, 960, 1230, X1];
  const SITES = CUT.slice(1, 5);
  const BARB = 32;
  const HW = 34;                       /* half the width of a site       */
  const LIFT = 150;                    /* the host sits low until the phage needs room */

  /* A recognition site is a SPAN, so it gets the deck's squared bracket
     (gibson.js, phosphate.js), drawn INSIDE the duplex with its ends
     turned toward the strand it names and stopping short of it.  It must
     never be a stroke laid across a backbone: in this deck a stroke
     across a backbone is a cut, and eight of them read as a shredded
     chromosome. */
  function bk(x0, x1, y, dir, col){
    return '<path d="M'+n2(x0)+' '+n2(y+dir*11)+'V'+n2(y)+'H'+n2(x1)+'V'+n2(y+dir*11) +
           '" fill="none" stroke="'+col+'" stroke-width="2.8" stroke-linecap="round" ' +
           'stroke-linejoin="round"/>';
  }
  /* half of one, left behind at a cut end */
  function bkHalf(x, x1, y, dir, col){
    return '<path d="M'+n2(x)+' '+n2(y)+'H'+n2(x1)+'V'+n2(y+dir*11) +
           '" fill="none" stroke="'+col+'" stroke-width="2.8" stroke-linecap="round" ' +
           'stroke-linejoin="round"/>';
  }
  const site = (x, y1, y2, c) =>
    bk(x-HW, x+HW, y1+19, -1, c) + bk(x-HW, x+HW, y2-19, 1, c);

  function host(){
    let g = '<g data-r="hostg">';
    g += seg([X0, HY1], [X1, HY1], INK, 4.2);
    g += seg([X1 - BARB, HY1 - 17], [X1, HY1], INK, 4.2);      /* 3' half barb */
    g += seg([X0, HY2], [X1, HY2], INK, 4.2);
    g += seg([X0 + BARB, HY2 + 17], [X0, HY2], INK, 4.2);      /* 3' half barb */
    SITES.forEach(function(x){
      g += site(x, HY1, HY2, INK);
      /* Dam marks both strands, and the two adenines are not opposite
         one another — hence the small offset */
      g += methyl(x - 8, HY1, 0, -1) + methyl(x + 8, HY2, 0, 1);
    });
    g += txt(X0, HY1 - 78, "host chromosome &mdash; every site methylated",
             {anchor:"start", size:33, weight:700});
    return g + '</g>';
  }

  /* the phage molecule is cut into five pieces, so it is built as five
     groups that translate apart */
  function phage(){
    let g = '<g data-r="ph" opacity="0">';
    for (let i = 0; i < 5; i++){
      const a = CUT[i], b = CUT[i+1];
      g += '<g data-r="f'+i+'">';
      g += seg([a, PY1], [b, PY1], BLUE, 4.2);
      g += seg([a, PY2], [b, PY2], BLUE, 4.2);
      if (i === 4) g += seg([X1 - BARB, PY1 - 17], [X1, PY1], BLUE, 4.2);
      if (i === 0) g += seg([X0 + BARB, PY2 + 17], [X0, PY2], BLUE, 4.2);
      /* each fragment keeps its half of the bracket, so the site is
         visibly what the cut went through */
      if (i > 0) g += bkHalf(a, a+HW, PY1+19, -1, BLUE) + bkHalf(a, a+HW, PY2-19, 1, BLUE);
      if (i < 4) g += bkHalf(b, b-HW, PY1+19, -1, BLUE) + bkHalf(b, b-HW, PY2-19, 1, BLUE);
      g += '</g>';
    }
    return g + '</g>';
  }

  const S = [
    { ph:0, gap:0,
      cap:"the host writes a methyl at every copy of its own recognition site",
      note:"Restriction enzymes did not evolve so that you could clone. They are an immune system. A bacterium carrying a restriction enzyme also carries a methyltransferase with the same specificity, and that methyltransferase marks every copy of the site in the host's own chromosome. Two marks per site, one on each strand, because the site is double stranded.",
      desc:"A long double-stranded DNA drawn as two black lines, the host chromosome. Four recognition sites are each bracketed between the two strands. At every site a red dot on a short stalk stands off each strand: the methyl groups." },
    { ph:1, gap:0,
      cap:"phage DNA arrives carrying the same sites and no marks",
      note:"Then a phage injects its genome. It has the same sequence at those sites — sequence is not what distinguishes it — but it was made inside a different cell, so it carries none of this host's marks. That absence is the only difference between the two molecules on this slide.",
      desc:"The chromosome slides up to make room and a second double-stranded DNA appears below it, drawn in blue: the incoming phage genome. It is bracketed at the same four site positions, but carries no red dots anywhere." },
    { ph:1, gap:1,
      cap:"the endonuclease cuts unmarked sites only: self is spared, non-self is destroyed",
      note:"The restriction endonuclease is loose in the same cytoplasm as both molecules. It cuts the phage DNA to pieces and leaves the chromosome alone, and the thing it is discriminating on is not sequence — it is the annotation. That is self versus non-self, and it is the reason there is a catalogue of restriction enzymes to buy from at all.",
      desc:"The blue phage DNA has broken into five separate fragments with clear gaps between them, cut at each of the four sites. The black host chromosome above is intact and still carries its methyl marks." }
  ];

  window.Deck.sequence("rmself", function(slide){
    const r = mount(slide,
      host() + phage() +
      txt(X0, PY1 - 78, "incoming phage DNA &mdash; no marks",
          {anchor:"start", size:33, weight:700, fill:BLUE, r:"plab", op:0}) +
      txt(800, 806, "", {size:31, fill:MUTED, r:"cap"}));

    let cur = null, raf = null;
    function paint(s){
      r.ph.setAttribute("opacity", n2(s.ph));
      r.plab.setAttribute("opacity", n2(s.ph));
      /* with one molecule on screen the figure sits centred; it moves up
         to make room rather than leaving a hole under itself */
      r.hostg.setAttribute("transform", "translate(0 " + n2(LIFT*(1 - s.ph)) + ")");
      for (let i = 0; i < 5; i++){
        r["f"+i].setAttribute("transform", "translate(" + n2((i-2)*26*s.gap) + " 0)");
      }
    }
    function go(i, animated){
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      r.cap.textContent = S[i].cap;
      const to = { ph:S[i].ph, gap:S[i].gap };
      if (!cur || animated === false || reduce.matches){ cur = to; paint(cur); return; }
      const from = cur, t0 = performance.now(), dur = 720;
      /* clock off performance.now(), not the rAF argument: the two are not
         guaranteed to share an origin, and a negative t would send the
         interpolation past the start state */
      raf = requestAnimationFrame(function f(){
        const t = Math.max(0, Math.min(1, (performance.now() - t0)/dur)), e = ease(t);
        cur = { ph: from.ph + (to.ph - from.ph)*e, gap: from.gap + (to.gap - from.gap)*e };
        paint(cur);
        if (t < 1) raf = requestAnimationFrame(f); else raf = null;
      });
    }
    go(0, false);
    return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
  });
})();

/* ================================================================== *
 * 2. marks — the atoms.  What is actually added, and where.
 * ================================================================== */
(function(){
  const R = 70;
  const CY = 545;                      /* every ring centre sits on this line */
  const SUG = CY + 152;                /* and every sugar stub is labelled on this one */
  const AC = { x:360,  y:CY };         /* adenine       */
  const M5 = { x:850,  y:CY };         /* 5-methylcytosine  */
  const M4 = { x:1310, y:CY };         /* N4-methylcytosine */

  const v = (c, a) => [c.x + R*Math.cos(rad(a)), c.y + R*Math.sin(rad(a))];

  /* adenine: six-ring N1 C2 N3 C4 C5 C6, five-ring fused on C4–C5 */
  const A_N1 = v(AC,210), A_C2 = v(AC,150), A_N3 = v(AC,90),
        A_C4 = v(AC,30),  A_C5 = v(AC,-30), A_C6 = v(AC,-90);
  const AP = { x: AC.x + 1.5542*R, y: AC.y };          /* pentagon centre  */
  const R5 = 0.8507*R;
  const p5 = a => [AP.x + R5*Math.cos(rad(a)), AP.y + R5*Math.sin(rad(a))];
  const A_N7 = p5(-72), A_C8 = p5(0), A_N9 = p5(72);
  const A_N6 = [AC.x, AC.y - 128];

  /* cytosine: six-ring N1 C2 N3 C4 C5 C6, drawn twice — once methylated
     on ring carbon 5, once on the exocyclic nitrogen 4.  They are two
     different molecules and no cytosine carries both. */
  const cyt = c => ({
    N3: v(c,210), C2: v(c,150), N1: v(c,90),
    C6: v(c,30),  C5: v(c,-30), C4: v(c,-90),
    N4: [c.x, c.y - 128],
    O2: [c.x + R*Math.cos(rad(150)) - 48.5, c.y + R*Math.sin(rad(150)) + 28]
  });

  /* an inner parallel line, offset toward `t`: the second bond of a
     double bond, drawn short at both ends in the usual way */
  function dbl(a, b, t){
    const mx = (a[0]+b[0])/2, my = (a[1]+b[1])/2;
    let dx = t.x - mx, dy = t.y - my;
    const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
    const p = [a[0] + dx*9.5, a[1] + dy*9.5], q = [b[0] + dx*9.5, b[1] + dy*9.5];
    const ux = (q[0]-p[0])*0.19, uy = (q[1]-p[1])*0.19;
    return seg([p[0]+ux, p[1]+uy], [q[0]-ux, q[1]-uy], INK, 2.8);
  }
  /* The second line of a double bond to an EXOCYCLIC atom.  `dbl` offsets
     toward a target point, which is fine for a ring edge and useless for
     the C2 carbonyl: that bond points straight away from the ring centre,
     so the offset runs ALONG the bond and the two lines land on top of
     one another — the C2=O has been rendering as a single bond.  This one
     offsets perpendicular to the bond itself. */
  function dblOut(a, b, s){
    const dx = b[0]-a[0], dy = b[1]-a[1], L = Math.hypot(dx, dy) || 1;
    const nx = -dy/L*s, ny = dx/L*s;
    const ux = dx*0.19, uy = dy*0.19;
    return seg([a[0]+nx+ux, a[1]+ny+uy], [b[0]+nx-ux, b[1]+ny-uy], INK, 2.8);
  }
  function ring(pts){
    return '<path d="' + pts.map((p,i) => (i?"L":"M") + n2(p[0]) + " " + n2(p[1])).join("") +
           'Z" fill="none" stroke="'+INK+'" stroke-width="2.8" stroke-linejoin="round"/>';
  }
  /* a heteroatom: punch a white hole in the ring, then set the label.
     Ring nitrogens carry their POSITION NUMBER, because every claim this
     slide makes is a claim about a numbered position and the reader has
     to be able to check it against the drawing. */
  function atom(p, s, wide){
    return '<ellipse cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" rx="'+(wide ? 26 : 17) +
           '" ry="17" fill="#fff"/>' + txt(p[0], p[1] + 11, s, {size:32});
  }
  /* the position number of a ring CARBON, set just outside the vertex */
  const num = (c, dx, dy, s) => txt(c.x + dx, c.y + dy + 11, s, {size:30});

  function adenine(){
    let g = '<g>';
    g += ring([A_N1, A_C2, A_N3, A_C4, A_C5, A_C6]);
    g += '<path d="M'+n2(A_C5[0])+' '+n2(A_C5[1])+'L'+n2(A_N7[0])+' '+n2(A_N7[1]) +
         'L'+n2(A_C8[0])+' '+n2(A_C8[1])+'L'+n2(A_N9[0])+' '+n2(A_N9[1]) +
         'L'+n2(A_C4[0])+' '+n2(A_C4[1])+'" fill="none" stroke="'+INK +
         '" stroke-width="2.8" stroke-linejoin="round"/>';
    g += dbl(A_C6, A_N1, AC) + dbl(A_C2, A_N3, AC) + dbl(A_C4, A_C5, AC) + dbl(A_N7, A_C8, AP);
    /* exocyclic N6: the hydrogen that is left goes to the LEFT, on the
       Watson-Crick edge; the methyl goes to the right, into the major
       groove.  N6 carries two hydrogens and the writer takes one. */
    g += seg(A_C6, A_N6);
    g += seg([A_N6[0] - 14, A_N6[1] - 10], [A_N6[0] - 52, A_N6[1] - 34]);
    g += seg(A_N9, [AP.x + 118*Math.cos(rad(72)), AP.y + 118*Math.sin(rad(72))]);
    g += methyl(A_N6[0] + 14, A_N6[1] - 10, 0.82, -0.57);
    g += atom(A_N1, "N1", 1) + atom(A_N3, "N3", 1) + atom(A_N7, "N7", 1) +
         atom(A_N9, "N9", 1) + atom(A_N6, "N6", 1);
    g += num(AC, -104,  58, "2") + num(AC,   58,  92, "4") +
         num(AC,   62, -86, "5") + num(AC,  -44, -90, "6") +
         num(AC,  212,   0, "8");
    g += txt(A_N6[0] - 66, A_N6[1] - 32, "H", {anchor:"end", size:32});
    g += txt(A_N6[0] + 74, A_N6[1] - 46, "CH", {anchor:"start", size:30, fill:RED}) +
         txt(A_N6[0] + 112, A_N6[1] - 36, "3", {anchor:"start", size:22, fill:RED});
    g += txt(AP.x + 40, SUG, "to deoxyribose", {size:30, fill:MUTED});
    return g + '</g>';
  }

  /* `at` is "C5" or "N4" — one methyl, one molecule, never both */
  function cytosine(c, at){
    const a = cyt(c);
    let g = '<g>';
    g += ring([a.N3, a.C2, a.N1, a.C6, a.C5, a.C4]);
    g += dbl(a.C4, a.N3, c) + dbl(a.C5, a.C6, c);
    g += seg(a.C2, a.O2) + dblOut(a.C2, a.O2, 9.5);
    g += seg(a.C4, a.N4);
    /* the N4 hydrogens: one always points left into the Watson-Crick
       edge; on m4C the methyl has taken the other one */
    g += seg([a.N4[0] - 14, a.N4[1] - 10], [a.N4[0] - 52, a.N4[1] - 34]);
    if (at === "C5") g += seg([a.N4[0] + 14, a.N4[1] - 10], [a.N4[0] + 52, a.N4[1] - 34]);
    g += seg(a.N1, [a.N1[0], a.N1[1] + 42]);
    if (at === "N4"){
      g += methyl(a.N4[0] + 14, a.N4[1] - 10, 0.82, -0.57);
      g += txt(a.N4[0] + 74, a.N4[1] - 46, "CH", {anchor:"start", size:30, fill:RED}) +
           txt(a.N4[0] + 112, a.N4[1] - 36, "3", {anchor:"start", size:22, fill:RED});
    } else {
      g += methyl(a.C5[0] + 12, a.C5[1] - 6, 0.906, -0.423);
      g += txt(a.C5[0] + 74, a.C5[1] - 62, "CH", {anchor:"start", size:30, fill:RED}) +
           txt(a.C5[0] + 112, a.C5[1] - 52, "3", {anchor:"start", size:22, fill:RED});
    }
    g += atom(a.N1, "N1", 1) + atom(a.N3, "N3", 1) + atom(a.N4, "N4", 1) + atom(a.O2, "O");
    g += num(c, -112,  14, "2") + num(c,  -44, -90, "4") +
         num(c,   62, -86, "5") + num(c,  104,  58, "6");
    g += txt(a.N4[0] - 66, a.N4[1] - 32, "H", {anchor:"end", size:32});
    if (at === "C5") g += txt(a.N4[0] + 66, a.N4[1] - 32, "H", {anchor:"start", size:32});
    g += txt(a.N1[0], SUG, "to deoxyribose", {size:30, fill:MUTED});
    return g + '</g>';
  }

  /* The Watson-Crick edge of each base, bowed: N1 and an N6 hydrogen on
     adenine; O2, N3 and an N4 hydrogen on cytosine.  On m5C the methyl is
     nowhere near it.  On m6A and m4C it IS on a bracketed atom — but N6
     and N4 each carry two hydrogens, and the writer takes the one facing
     away, so the hydrogen bond is still made.  The step's caption and
     note say exactly that; the bow is named in words, not by colour. */
  function faces(){
    const bow = (c, p) =>
      '<path d="M'+n2(c.x+p[0])+' '+n2(c.y+p[1])+'Q'+n2(c.x+p[2])+' '+n2(c.y+p[3])+' ' +
        n2(c.x+p[4])+' '+n2(c.y+p[5])+'"/>';
    const A = [-95, -151, -170, -79, -94, -8];
    const C = [-92, -151, -159, -48, -127, 83];
    return '<g data-r="face" opacity="0" fill="none" stroke="'+BLUE+'" stroke-width="3.6" ' +
             'stroke-linecap="round">' +
             bow(AC, A) + bow(M5, C) + bow(M4, C) +
             '<g stroke="none">' +
               txt(800, 766, "the bracketed edge is the Watson&ndash;Crick face &mdash; " +
                             "the partner base bonds there", {size:31, weight:700, fill:BLUE}) +
             '</g>' +
           '</g>';
  }

  const S = [
    { face:0,
      cap:"one carbon, on one numbered position &mdash; and never two marks on the same base",
      note:"Down to the atom, this is the entire modification: one methyl group, carried in from S-adenosylmethionine and left on a base. Dam puts it on the exocyclic nitrogen of adenine, position N6, inside GATC. Dcm puts it on ring carbon five of cytosine inside CCWGG. Restriction-modification systems commonly use a third position, N4 of cytosine — the BamHI methyltransferase is one. Note that the two cytosines are two different molecules. A given cytosine gets a methyl at C5 or at N4; nothing writes both.",
      desc:"Three skeletal structures, every ring position numbered. Left, adenine: a six-membered ring numbered one to six fused to a five-membered ring numbered seven to nine, with an exocyclic nitrogen labelled N6 at the top carrying one hydrogen and, in red, a methyl group. Centre, cytosine with a red methyl on ring carbon five. Right, a second cytosine, this one with the red methyl on the exocyclic nitrogen N4. Each base hangs from a stub labelled to deoxyribose, leaving N9 on adenine and N1 on cytosine." },
    { face:1,
      cap:"base pairing survives &mdash; the methyl projects into the major groove, where proteins read",
      note:"Now look at where the methyl sits relative to the edge that does the pairing. On cytosine methylated at C5 the answer is easy: C5 is not part of the Watson-Crick face at all, so nothing about the pair changes. N6 and N4 are subtler, because those nitrogens do hydrogen bond to the partner base — but each of them carries two hydrogens, one pointing at the partner and one pointing out into the major groove, and the methyltransferase takes the one pointing out. So methyladenine still pairs with T and methylcytosine still pairs with G. Sequence the plasmid and you get exactly the same letters back. What changes is the major groove, which is where proteins read DNA — so the only consequence is which enzymes are allowed to act. That is what makes methylation an annotation layer rather than a change of sequence.",
      desc:"A curved bracket is drawn down the left-hand edge of each structure, marking the hydrogen-bonding face used for base pairing, and labelled as the Watson-Crick face. Every red methyl lies on the opposite edge of its ring." }
  ];

  window.Deck.sequence("marks", function(slide){
    const r = mount(slide,
      adenine() + cytosine(M5, "C5") + cytosine(M4, "N4") + faces() +
      txt(AC.x, 250, "N6-methyladenine", {size:33, weight:700}) +
      txt(AC.x, 292, "Dam, at GATC", {size:30, fill:MUTED}) +
      txt(M5.x, 250, "5-methylcytosine", {size:33, weight:700}) +
      txt(M5.x, 292, "Dcm, at CCWGG", {size:30, fill:MUTED}) +
      txt(M4.x, 250, "N4-methylcytosine", {size:33, weight:700}) +
      txt(M4.x, 292, "M.BamHI, at GGATCC", {size:30, fill:MUTED}) +
      txt(800, 812, "", {size:31, fill:MUTED, r:"cap"}));

    function go(i, animated){
      r.face.setAttribute("style",
        (animated === false || reduce.matches) ? "transition:none" : "transition:opacity .34s ease");
      r.face.setAttribute("opacity", S[i].face);
      r.cap.innerHTML = S[i].cap;
    }
    go(0, false);
    return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
  });
})();

/* ================================================================== *
 * 3. dpni — specificity that is an annotation, not a sequence
 * ================================================================== */
(function(){
  const TC = { x:470,  y:570 };        /* template plasmid  */
  const PC = { x:1130, y:570 };        /* PCR product       */
  const R = 132;
  const A0 = -90, N = 5;               /* five GATC sites, evenly spaced */

  function template(){
    let g = '<g>';
    for (let i = 0; i < N; i++){
      g += '<path data-r="t'+i+'" fill="none" stroke="'+INK+'" stroke-width="3.4" ' +
             'stroke-linecap="round" d=""/>';
    }
    /* the marks stay put: DpnI cuts AT them, so the pieces part there */
    for (let i = 0; i < N; i++){
      const a = A0 + i*(360/N);
      g += methyl(TC.x + R*Math.cos(rad(a)), TC.y + R*Math.sin(rad(a)),
                  Math.cos(rad(a)), Math.sin(rad(a)));
    }
    return g + '</g>';
  }

  function product(){
    let g = '<g data-r="prod" opacity="0">';
    /* a nicked circle: the gap at the top is the nick, not a second molecule */
    g += '<path d="'+arcPath(PC.x, PC.y, R, -84, -96)+'" fill="none" stroke="'+BLUE +
         '" stroke-width="3.8" stroke-linecap="round"/>';
    const m = [PC.x + R*Math.cos(rad(40)), PC.y + R*Math.sin(rad(40))];
    g += '<g stroke="'+INK+'" stroke-width="3.6" stroke-linecap="round">' +
           seg([m[0]-13, m[1]-13], [m[0]+13, m[1]+13], INK, 3.6) +
           seg([m[0]-13, m[1]+13], [m[0]+13, m[1]-13], INK, 3.6) + '</g>';
    g += txt(m[0] + 34, m[1] + 46, "the mutation", {anchor:"start", size:30});
    g += txt(PC.x, 412, "nick", {size:30, fill:MUTED});
    return g + '</g>';
  }

  const S = [
    { prod:0, gap:0,
      cap:"the template came out of a dam+ E. coli, so every GATC in it already carries a methyl",
      note:"Site-directed mutagenesis by PCR. You start with the plasmid you already have, and it was grown in an ordinary lab strain, so Dam has methylated the adenine in every GATC in it. You did not ask for that and it is not in your sequence file, but it is there.",
      desc:"A black circle on the left: the template plasmid. Five red dots on short stalks stand off the ring, the methylated GATC sites." },
    { prod:1, gap:0,
      cap:"PCR copies it from dNTPs: the same plasmid, one base changed, and no marks anywhere",
      note:"You amplify the whole plasmid with primers carrying your mutation. The new molecule is built from free nucleotides, so nothing methylates it — there is no methyltransferase in the tube. Now you have a problem. Both molecules are in the same tube, they are the same length, and they differ at one base. You cannot separate them by size, and you cannot separate them by sequence.",
      desc:"A blue circle appears on the right: the PCR product. It is drawn with a small gap at the top labelled nick, and an ink cross on the ring labelled the mutation. It carries no red dots." },
    { prod:1, gap:1,
      cap:"DpnI cuts GA/TC only when that A is methylated: the template is destroyed, the product is not",
      note:"So you separate them on the annotation. DpnI is a restriction enzyme whose site is GATC, but it only cuts when the adenine is methylated — the exact inverse of the enzymes that methylation blocks. Add DpnI and it shreds the template you started with and never touches the product you just made. An enzyme used to tell old DNA from new. This is the step that makes QuikChange-style mutagenesis work, and if you skip it your transformation comes back full of the original plasmid.",
      desc:"The black template circle has broken into five separate arcs with gaps, cut at each red mark, which remain. The blue product circle on the right is untouched." }
  ];

  window.Deck.sequence("dpni", function(slide){
    const r = mount(slide,
      template() + product() +
      txt(TC.x, 300, "template plasmid", {size:33, weight:700}) +
      txt(TC.x, 340, "dam+ prep &mdash; every GATC methylated", {size:30, fill:MUTED}) +
      txt(PC.x, 300, "PCR product", {size:33, weight:700, fill:BLUE, r:"plab", op:0}) +
      txt(PC.x, 340, "made from dNTPs &mdash; no methyl at all", {size:30, fill:MUTED, r:"psub", op:0}) +
      txt(800, 816, "", {size:31, fill:MUTED, r:"cap"}));

    let cur = null, raf = null;
    function paint(s){
      r.prod.setAttribute("opacity", n2(s.prod));
      r.plab.setAttribute("opacity", n2(s.prod));
      r.psub.setAttribute("opacity", n2(s.prod));
      const g = 15*s.gap;                        /* half-gap, in degrees  */
      for (let i = 0; i < N; i++){
        const a = A0 + i*(360/N);
        r["t"+i].setAttribute("d", arcPath(TC.x, TC.y, R + 9*s.gap, a + g, a + 360/N - g));
      }
    }
    function go(i, animated){
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      r.cap.textContent = S[i].cap;
      const to = { prod:S[i].prod, gap:S[i].gap };
      if (!cur || animated === false || reduce.matches){ cur = to; paint(cur); return; }
      const from = cur, t0 = performance.now(), dur = 720;
      /* clock off performance.now(), not the rAF argument: the two are not
         guaranteed to share an origin, and a negative t would send the
         interpolation past the start state */
      raf = requestAnimationFrame(function f(){
        const t = Math.max(0, Math.min(1, (performance.now() - t0)/dur)), e = ease(t);
        cur = { prod: from.prod + (to.prod - from.prod)*e,
                gap:  from.gap  + (to.gap  - from.gap )*e };
        paint(cur);
        if (t < 1) raf = requestAnimationFrame(f); else raf = null;
      });
    }
    go(0, false);
    return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
  });
})();

})();
