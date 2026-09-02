/* ------------------------------------------------------------------ *
 * phosphate.js — the 5' phosphate as a licence to be ligated.
 *
 * Registers:  vecphos   why you treat a vector with phosphatase  (6 steps)
 *             pcrphos   why a PCR product will not ligate        (3 steps)
 *
 * Both drawings are at level 3 (a barbed line): only topology and which
 * END carries what matters here, never a sequence position. The single
 * chemical detail that is the point of the section — a phosphate on a
 * 5' end — is carried by one glyph, a disc reading P or OH, so colour is
 * never the sole channel.
 *
 * Conventions, from the deck:
 *   - every 3' end carries a HALF BARB, laid back on the OUTER face of
 *     the duplex; a bond that forms takes the barb away with it, because
 *     a sealed junction has no ends
 *   - a nick, and any two separate molecules, show a visible GAP
 *
 * THE GEOMETRY OF THE CIRCLE (vecphos)
 *
 * The vector is two concentric arcs. The OUTER strand runs clockwise
 * 5'->3', the INNER strand counterclockwise 5'->3', which is what makes
 * them antiparallel. The gap sits at the top, its two edges at
 * -90-G and -90+G degrees. That fixes every terminus:
 *
 *   junction L (-90-G)   vector outer 3'-OH  |  insert outer 5'-P
 *                        vector inner 5'     |  insert inner 3'-OH
 *   junction R (-90+G)   insert outer 3'-OH  |  vector outer 5'
 *                        insert inner 5'-P   |  vector inner 3'-OH
 *
 * So the vector's two 5' phosphates sit on one diagonal and the insert's
 * on the other. Strip the vector's pair and exactly the insert's diagonal
 * can still be sealed: two bonds, two nicks, one per junction, on
 * opposite strands. That asymmetry is the whole slide.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", SLATE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const RAD = Math.PI/180;
const n2 = v => Math.round(v*10)/10;

const SW   = 4.2;          /* strand stroke                                */
const BARB = 26, BW = 0.49;/* 3' half barb — same as seq/linear.js         */
const DR   = 21;           /* radius of a 5' terminal mark                 */

/* ------------------------------------------------------- primitives */
function pt(cx, cy, r, a){ return [cx + r*Math.cos(a*RAD), cy + r*Math.sin(a*RAD)]; }

/* An arc from a1 to a2 (degrees), swept in the direction of their
   difference. Split in half so the large-arc flag is never needed and a
   full 360 degrees still draws — which it must, once the circle closes. */
function arc(cx, cy, r, a1, a2){
  const d = a2 - a1;
  if (Math.abs(d) < 0.4) return "";
  const p1 = pt(cx,cy,r,a1), pm = pt(cx,cy,r,a1+d/2), p2 = pt(cx,cy,r,a2);
  const s = d > 0 ? 1 : 0;
  return "M"+n2(p1[0])+" "+n2(p1[1])+
         "A"+r+" "+r+" 0 0 "+s+" "+n2(pm[0])+" "+n2(pm[1])+
         "A"+r+" "+r+" 0 0 "+s+" "+n2(p2[0])+" "+n2(p2[1]);
}

/* Half barb at the 3' tip of an arc. dir +1 clockwise, -1 counter.
   side +1 lays it away from the ring centre, -1 towards it; either way
   it lands on the outer face of the duplex. */
function arcBarb(cx, cy, r, a, dir, side){
  const T = pt(cx,cy,r,a);
  const ph = Math.atan2(-dir*Math.cos(a*RAD), dir*Math.sin(a*RAD));
  const c = [ph+BW, ph-BW].map(t => [T[0]+BARB*Math.cos(t), T[1]+BARB*Math.sin(t)]);
  const d0 = Math.hypot(c[0][0]-cx, c[0][1]-cy), d1 = Math.hypot(c[1][0]-cx, c[1][1]-cy);
  const b = ((side > 0) === (d0 > d1)) ? c[0] : c[1];
  return "M"+n2(b[0])+" "+n2(b[1])+"L"+n2(T[0])+" "+n2(T[1]);
}

/* A straight strand whose 3' tip is (x2,y2) — the convention in linear.js. */
function seg(x1, y1, x2, y2){
  if (Math.abs(x2-x1) < 1) return "";
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2);
}
function segBarb(x1, y1, x2, y2){
  const th = Math.atan2(y1-y2, x1-x2);
  return "M"+n2(x2+BARB*Math.cos(th+BW))+" "+n2(y2+BARB*Math.sin(th+BW))+
         "L"+n2(x2)+" "+n2(y2);
}

/* A 5' terminal mark: two glyphs at one spot, cross-faded. Filled disc
   reading P, hollow disc reading OH. The letter carries the meaning, so
   the colour is reinforcement and not the channel. */
function mark5(id){
  return '<g data-r="'+id+'">'+
    '<g data-r="'+id+'P"><circle r="'+DR+'" fill="'+RED+'"/>'+
      '<text y="10" text-anchor="middle" font-family="inherit" font-size="28" '+
        'font-weight="700" fill="#fff">P</text></g>'+
    '<g data-r="'+id+'O" opacity="0"><circle r="'+DR+'" fill="#fff" stroke="'+INK+
      '" stroke-width="2.6"/>'+
      '<text y="9" text-anchor="middle" font-family="inherit" font-size="23" '+
        'fill="'+INK+'">OH</text></g></g>';
}
function place(el, p){ el.setAttribute("transform", "translate("+n2(p[0])+" "+n2(p[1])+")"); }
function op(el, v){ el.setAttribute("opacity", n2(Math.max(0, Math.min(1, v)))); }

/* A red call-out: a word and a leader line to what it names. */
function callout(id, tx, ty, lx1, ly1, lx2, ly2, txt){
  return '<g data-r="lab_'+id+'" opacity="0">'+
    '<path d="M'+lx1+' '+ly1+'L'+lx2+' '+ly2+'" fill="none" stroke="'+RED+
      '" stroke-width="2.6"/>'+
    '<text x="'+tx+'" y="'+ty+'" text-anchor="middle" font-family="inherit" '+
      'font-size="30" font-weight="700" fill="'+RED+'">'+txt+'</text></g>';
}
function quiet(x, y, txt, size){
  return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="inherit" '+
    'font-size="'+(size||30)+'" fill="'+MUTED+'">'+txt+'</text>';
}

/* --------------------------------------------------------- scaffold */
function stage(slide, body){
  const s = document.createElementNS(SVGNS, "svg");
  s.setAttribute("viewBox", "0 0 1600 900");
  s.setAttribute("aria-hidden", "true");
  s.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  s.innerHTML =
    '<text data-r="cap" x="800" y="244" text-anchor="middle" font-family="inherit" '+
      'font-weight="700" font-size="32" fill="'+INK+'"></text>'+
    '<text data-r="sub" x="800" y="288" text-anchor="middle" font-family="inherit" '+
      'font-size="27" fill="'+MUTED+'"></text>'+ body;
  slide.appendChild(s);
  const r = {};
  s.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  return r;
}

/* Shared tween. Numeric state interpolates; call-outs switch outright,
   because a fading word is a distraction and not an idea. */
function driver(r, steps, paint){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const keys = Object.keys(steps[0].s);
  const labs = Object.keys(r).filter(k => k.indexOf("lab_") === 0);
  let cur = Object.assign({}, steps[0].s), raf = null;

  function go(i, animated){
    const to = steps[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.cap.textContent = steps[i].cap || "";
    r.sub.textContent = steps[i].sub || "";
    const on = steps[i].show || [];
    labs.forEach(k => r[k].setAttribute("opacity", on.indexOf(k.slice(4)) >= 0 ? "1" : "0"));
    if (animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(r, cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 760;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now-t0)/dur), e = ease(t);
      keys.forEach(k => cur[k] = from[k] + (to[k]-from[k])*e);
      paint(r, cur);
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }
  go(0, false);
  return { steps: steps.map(s => ({ note:s.note, desc:s.desc })), go: go };
}

/* ================================================================== *
 * vecphos — phosphatase the vector so it cannot close on itself
 * ================================================================== */
const CX = 800, CY = 592, RO = 236, RI = 174;
const GAP = 38;                 /* half the cut, in degrees                 */
const DG = 7.5;                 /* half the visible gap at an open junction */
const IX = -460, IY = 40;       /* where the insert waits before it goes in */

function ring(){
  return '<g fill="none" stroke-linecap="round" stroke-width="'+SW+'" stroke="'+INK+'">'+
    '<path data-r="vOut"/><path data-r="vOutB"/>'+
    '<path data-r="vIn"/><path data-r="vInB"/></g>'+
  '<g data-r="gIns" opacity="0">'+
    '<g fill="none" stroke-linecap="round" stroke-width="'+SW+'" stroke="'+SLATE+'">'+
      '<path data-r="iOut"/><path data-r="iOutB"/>'+
      '<path data-r="iIn"/><path data-r="iInB"/></g>'+
    '<text x="'+CX+'" y="478" text-anchor="middle" font-family="inherit" '+
      'font-size="30" font-weight="700" fill="'+SLATE+'">insert</text>'+
    mark5("mIL") + mark5("mIR") +
  '</g>'+
  mark5("mVL") + mark5("mVR") +
  quiet(CX, 700, "vector") +
  callout("nickL", 700, 574, 700, 550, 688, 496, "nick") +
  callout("nickR", 1170, 372, 1118, 384, 1010, 414, "nick");
}

function ringPaint(r, s){
  const G = s.G;
  const dLo = DG*(1-s.cLo), dLi = DG*(1-s.cLi),
        dRo = DG*(1-s.cRo), dRi = DG*(1-s.cRi);

  /* vector: outer runs clockwise from its 5' at R to its 3' at L */
  const voA = -90 + G + dRo, voB = 270 - G - dLo;
  const viA = -90 - G - dLi, viB = -450 + G + dRi;
  r.vOut .setAttribute("d", arc(CX,CY,RO,voA,voB));
  r.vOutB.setAttribute("d", arcBarb(CX,CY,RO,voB, 1, 1));
  r.vIn  .setAttribute("d", arc(CX,CY,RI,viA,viB));
  r.vInB .setAttribute("d", arcBarb(CX,CY,RI,viB,-1,-1));
  op(r.vOutB, 1 - s.cLo);            /* a sealed junction has no 3' end */
  op(r.vInB,  1 - s.cRi);

  /* insert: the same two directions, spanning the gap */
  const ioA = -90 - G + dLo, ioB = -90 + G - dRo;
  const iiA = -90 + G - dRi, iiB = -90 - G + dLi;
  r.iOut .setAttribute("d", arc(CX,CY,RO,ioA,ioB));
  r.iOutB.setAttribute("d", arcBarb(CX,CY,RO,ioB, 1, 1));
  r.iIn  .setAttribute("d", arc(CX,CY,RI,iiA,iiB));
  r.iInB .setAttribute("d", arcBarb(CX,CY,RI,iiB,-1,-1));
  op(r.iOutB, 1 - s.cRo);
  op(r.iInB,  1 - s.cLi);
  op(r.gIns, s.ins);
  r.gIns.setAttribute("transform",
    "translate("+n2((1-s.ins)*IX)+" "+n2((1-s.ins)*IY)+")");

  /* the four 5' marks sit on their own termini and leave with the bond */
  place(r.mVR, pt(CX,CY,RO,voA)); place(r.mVL, pt(CX,CY,RI,viA));
  place(r.mIL, pt(CX,CY,RO,ioA)); place(r.mIR, pt(CX,CY,RI,iiA));
  op(r.mVR, 1 - s.cRo); op(r.mVL, 1 - s.cLi);
  op(r.mIL, 1 - s.cLo); op(r.mIR, 1 - s.cRi);
  op(r.mVRP, s.pv); op(r.mVRO, 1 - s.pv);   /* P while phosphorylated */
  op(r.mVLP, s.pv); op(r.mVLO, 1 - s.pv);   /* OH once stripped       */
  op(r.mILP, 1); op(r.mILO, 0);
  op(r.mIRP, 1); op(r.mIRO, 0);
}

window.Deck.sequence("vecphos", function(slide){
  const S = [
  { s:{G:GAP, ins:0, pv:1, cLo:0, cLi:0, cRo:0, cRi:0},
    cap:"A cut vector carries a 5′ phosphate on each end",
    sub:"one on the outer strand, one on the inner — diagonally opposite",
    note:"Start with a vector cut by a single enzyme, so its two ends are compatible with each other. Look at what the cut left behind. A restriction enzyme breaks the bond between a three prime hydroxyl and a five prime phosphate, and the phosphate stays with the end it is attached to. So each of these two ends has a five prime phosphate on one strand and a three prime hydroxyl on the other, and the two phosphates sit diagonally opposite one another. Those two phosphates are this molecule's licence to be sealed shut.",
    desc:"A plasmid drawn as two concentric barbed lines, the outer strand running clockwise and the inner strand counterclockwise, with a gap cut in them at the top. At the right edge of the gap a filled dot marked P sits on the outer strand; at the left edge another sits on the inner strand. The two remaining ends carry half barbs marking three prime." },

  { s:{G:0, ins:0, pv:1, cLo:1, cLi:1, cRo:1, cRi:1},
    cap:"T4 DNA ligase",
    sub:"it simply closes on itself — and that is the lawn of empty vector on your plate",
    note:"Now add ligase and nothing else. Both phosphates are there, both three prime hydroxyls are there, so both strands get sealed and the vector closes right back up. This is the single largest source of background in ordinary cloning: you plate out and every colony is empty vector, because the vector did not need your insert in order to become a circle again. Notice the ends are gone from the drawing. A closed circle has no three prime end and no free five prime phosphate — they went into the bonds. Notice also that it can only do this because both its ends are compatible — this vector was cut with a single enzyme. If you had cut with two different enzymes and left two different sticky ends, the vector could not close on itself at all, and nothing in the rest of this slide would be necessary.",
    desc:"The gap has closed. The two concentric strands are now unbroken circles, and the phosphate dots and half barbs have disappeared into the bonds they formed." },

  { s:{G:GAP, ins:0, pv:0, cLo:0, cLi:0, cRo:0, cRi:0},
    cap:"So take the phosphates away",
    sub:"a phosphatase leaves a bare 5′ hydroxyl at each end",
    note:"So instead, treat the cut vector with a phosphatase before you ligate. It strips both five prime phosphates and leaves bare hydroxyls. Now run the same ligase reaction. At the outer strand the three prime hydroxyl has nothing to attack, and at the inner strand the same. Zero bonds. The vector cannot circularise on its own, so it stays linear, and linear DNA does not give you colonies.",
    desc:"The gap is open again. Both dots have changed from filled P discs to hollow discs reading OH, marking bare five prime hydroxyls where the phosphates used to be." },

  { s:{G:GAP, ins:1, pv:0, cLo:0, cLi:0, cRo:0, cRi:0},
    cap:"The insert brings its own",
    sub:"and they sit on the other diagonal — the one the vector has lost",
    note:"Now add an insert. This one still has its five prime phosphates, either because it came off a restriction digest or because you kinased it. Here is the thing to see. At each junction, the insert's phosphate is on the opposite strand from where the vector's used to be. So at every junction there is now exactly one five prime phosphate, and it is on one strand only.",
    desc:"A short arc, drawn in blue and labelled insert, slides in from the left and fills the gap. Its two ends each carry a filled P dot: one on the outer strand at the left junction, one on the inner strand at the right junction, diagonally opposite the vector's two hollow OH marks." },

  { s:{G:GAP, ins:1, pv:0, cLo:1, cLi:0, cRo:0, cRi:1},
    cap:"Two bonds. Two nicks.",
    sub:"one nick per junction, on opposite strands — and the circle is closed",
    show:["nickL","nickR"],
    note:"Ligase can only work where a phosphate is waiting, so it makes exactly two bonds, one at each junction, using the phosphates the insert brought. The other strand at each junction is left as a nick: a three prime hydroxyl sitting right against a five prime hydroxyl, with no phosphate between them. Count what that gets you. Vector plus insert is a closed circle held together by two covalent bonds and full length base pairing on both strands. Vector alone got zero bonds and is still a stick. That asymmetry is the entire reason your plate is not a lawn.",
    desc:"The gap has closed on the outer strand at the left junction and the inner strand at the right junction. The other strand at each junction is still broken, each break labelled nick in red, with a half barb on one side and a hollow OH mark on the other." },

  { s:{G:GAP, ins:1, pv:0, cLo:1, cLi:1, cRo:1, cRi:1},
    cap:"The nicks are repaired in the cell",
    sub:"transform it and E. coli finishes the molecule for you",
    note:"And then you transform it, and the nicks stop being your problem. E. coli repairs them, and what you recover from the colony is an ordinary closed plasmid. This is the part students find hard to believe: you deliberately handed the cell an incomplete molecule and it worked. The reason it works is that neither strand is ever broken in the same place, so the circle never comes apart.",
    desc:"Both remaining breaks have closed. The drawing is now a plain unbroken plasmid: two concentric circular strands with no ends, no barbs and no marks." }
  ];
  return driver(stage(slide, ring()), S, ringPaint);
});

/* ================================================================== *
 * pcrphos — a PCR product has no 5' phosphate to give
 * ================================================================== */
const YT = 486, YB = 552;       /* the two strands                        */
const JL = 380, JR = 1220;      /* the two junctions                      */
const HG = 34;                  /* half the visible gap when open         */
const XW = 110, XE = 1490;      /* the vector runs off the slide both ways */
const PRM = 210;                /* how much of each 5' end is primer      */

/* A bracket under (or over) the stretch of strand that came from the
   oligo. Position and a word, not colour alone. */
function bracket(id, x1, x2, y, tick, ty){
  return '<g data-r="lab_'+id+'" opacity="0">'+
    '<path d="M'+x1+' '+(y+tick)+'V'+y+'H'+x2+'V'+(y+tick)+'" fill="none" stroke="'+
      SLATE+'" stroke-width="2.6"/>'+
    '<text x="'+((x1+x2)/2)+'" y="'+ty+'" text-anchor="middle" font-family="inherit" '+
      'font-size="28" font-weight="700" fill="'+SLATE+'">primer</text></g>';
}

function rails(){
  return '<g data-r="gVec" opacity="0">'+
    '<g fill="none" stroke-linecap="round" stroke-width="'+SW+'" stroke="'+INK+'">'+
      '<path data-r="vLT"/><path data-r="vLTB"/><path data-r="vLB"/>'+
      '<path data-r="vRT"/><path data-r="vRB"/><path data-r="vRBB"/></g>'+
    quiet(215, 420, "vector") + quiet(1385, 420, "vector") +
    mark5("mVL") + mark5("mVR") +
  '</g>'+
  '<g fill="none" stroke-linecap="round" stroke-width="'+SW+'" stroke="'+SLATE+'">'+
    '<path data-r="pT"/><path data-r="pTB"/><path data-r="pB"/><path data-r="pBB"/></g>'+
  bracket("prmT", JL+HG, JL+HG+PRM, 452, 12, 434) +
  bracket("prmB", JR-HG-PRM, JR-HG, 586, -12, 626) +
  '<text x="800" y="400" text-anchor="middle" font-family="inherit" font-size="30" '+
    'font-weight="700" fill="'+SLATE+'">PCR product</text>'+
  mark5("mPT") + mark5("mPB") +
  callout("zeroL", JL, 668, JL, 636, JL, 582, "no bond") +
  callout("zeroR", JR, 668, JR, 636, JR, 582, "no bond");
}

function railPaint(r, s){
  const hLT = HG*(1-s.cLT), hLB = HG*(1-s.cLB),
        hRT = HG*(1-s.cRT), hRB = HG*(1-s.cRB);

  /* the product: top strand 5'->3' left to right, bottom the other way */
  r.pT .setAttribute("d", seg(JL+hLT, YT, JR-hRT, YT));
  r.pTB.setAttribute("d", segBarb(JL+hLT, YT, JR-hRT, YT));
  r.pB .setAttribute("d", seg(JR-hRB, YB, JL+hLB, YB));
  r.pBB.setAttribute("d", segBarb(JR-hRB, YB, JL+hLB, YB));
  op(r.pTB, 1 - s.cRT);
  op(r.pBB, 1 - s.cLB);

  /* the vector, running off the slide on both sides */
  r.vLT .setAttribute("d", seg(XW, YT, JL-hLT, YT));
  r.vLTB.setAttribute("d", segBarb(XW, YT, JL-hLT, YT));
  r.vLB .setAttribute("d", seg(JL-hLB, YB, XW, YB));
  r.vRT .setAttribute("d", seg(JR+hRT, YT, XE, YT));
  r.vRB .setAttribute("d", seg(XE, YB, JR+hRB, YB));
  r.vRBB.setAttribute("d", segBarb(XE, YB, JR+hRB, YB));
  op(r.vLTB, 1 - s.cLT);
  op(r.vRBB, 1 - s.cRB);
  op(r.gVec, s.vec);

  place(r.mPT, [JL+hLT, YT]); place(r.mPB, [JR-hRB, YB]);
  place(r.mVL, [JL-hLB, YB]); place(r.mVR, [JR+hRT, YT]);
  op(r.mPT, 1 - s.cLT); op(r.mPB, 1 - s.cRB);
  op(r.mVL, 1 - s.cLB); op(r.mVR, 1 - s.cRT);
  op(r.mPTP, s.pp); op(r.mPTO, 1 - s.pp);
  op(r.mPBP, s.pp); op(r.mPBO, 1 - s.pp);
  op(r.mVLP, 0); op(r.mVLO, 1);            /* the vector was phosphatased */
  op(r.mVRP, 0); op(r.mVRO, 1);
}

window.Deck.sequence("pcrphos", function(slide){
  const S = [
  { s:{vec:0, pp:0, cLT:0, cLB:0, cRT:0, cRB:0},
    show:["prmT","prmB"],
    cap:"Both 5′ ends of a PCR product are primers you ordered",
    sub:"and chemical oligo synthesis stops at a 5′ hydroxyl — it never puts a phosphate there",
    note:"Here is a PCR product, and here is a fact about it that almost nobody is told. Each of its two five prime ends is literally one of the primers you ordered, still there at the end of the strand it started. Oligonucleotides are made chemically, three prime to five prime, and the synthesis ends by taking the protecting group off a five prime hydroxyl. Nobody adds a phosphate. So both five prime ends of every PCR product you have ever made are bare hydroxyls.",
    desc:"A blunt duplex drawn as two antiparallel barbed lines, labelled PCR product. A bracket marks the five prime stretch of each strand and labels it primer. Each five prime end carries a hollow disc reading OH." },

  { s:{vec:1, pp:0, cLT:0, cLB:0, cRT:0, cRB:0},
    show:["zeroL","zeroR"],
    cap:"Blunt-ligate that into a vector you phosphatased",
    sub:"four ends, two junctions, and not one 5′ phosphate anywhere",
    note:"Now put the two halves of this section together, because this is the combination that costs people a week. You did the clever thing and phosphatased your vector, so the vector has no five prime phosphates. And your insert is a PCR product, so it has none either. Four ends meet at two junctions and there is not one phosphate among them. Ligase makes nothing at all. You get no colonies, you conclude your ligation is broken, and you do it again.",
    desc:"Cut vector ends have arrived on both sides, each separated from the product by a visible gap. All four five prime ends now show hollow OH discs, and each junction is labelled, in red, no bond." },

  { s:{vec:1, pp:1, cLT:0, cLB:0, cRT:0, cRB:0},
    cap:"T4 PNK — or just order primers with a 5′ phosphate",
    sub:"one 5′ phosphate at each junction, on the product’s strand — the plasmid picture again",
    note:"There are two fixes and they cost about the same. Kinase the product with T4 polynucleotide kinase before you ligate, or pay a little more and have the primers synthesised with a five prime phosphate already on them, which saves you a reaction. Either way, look at what you now have. One phosphate at each junction, on the insert's strand, which is exactly the picture from the vector slide. Ligase makes two bonds, you are left with two nicks, E. coli repairs them, and you get colonies. One more thing worth knowing: if you digest your PCR product with a restriction enzyme, the cut itself creates fresh five prime phosphates on the new ends, and none of this applies. It is blunt ligation, and self-ligation of a whole plasmid amplified by PCR, where this bites.",
    desc:"The two discs on the product have changed from hollow OH to filled P. Each junction now has one filled P disc on the product's strand and one hollow OH disc on the vector's, the same arrangement as the plasmid drawing." }
  ];
  return driver(stage(slide, rails()), S, railPaint);
});

})();
