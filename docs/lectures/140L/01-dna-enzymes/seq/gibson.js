/* ------------------------------------------------------------------ *
 * gibson.js — Gibson assembly, one junction, drawn so the DIRECTIONALITY
 * is unmissable.  This is the step people get backwards: T5 exonuclease
 * travels 5'->3', it therefore eats 5' ends, and what it LEAVES BEHIND
 * is a 3' single-stranded overhang.
 *
 * Registers:  gibson   (5 steps)
 *
 * Geometry is written in the ANNEALED frame; the two fragments are then
 * pushed apart by +/-SEP for the un-annealed states, so annealing is a
 * single symmetric convergence.
 *
 *   left fragment   280 .......... 900      overlap = 720..900
 *   right fragment          720 .......... 1340
 *
 * Chew length C is deliberately LONGER than the overlap W.  That is what
 * makes the polymerase step honest: after annealing there is a real
 * single-stranded GAP of (C - W) in each strand, each one presenting a
 * recessed 3' end on a template, which is exactly what a polymerase
 * extends.  If C == W you get two nicks and no work for the polymerase,
 * which is not what happens in the tube.
 *
 * Convention: every 3' end carries a HALF BARB laid back on the outer
 * side of the duplex; separate molecules never abut.  The two internal
 * 3' barbs and the two internal 5' labels fade out as the nicks are
 * sealed, because at that moment they stop being ends.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* ---- the annealed frame -------------------------------------------- */
const LFL = 280,  LFR = 900;         /* left fragment,  5' top .. 3' top   */
const RFL = 720,  RFR = 1340;        /* right fragment                     */
const OVL = 720,  OVR = 900;         /* the shared overlap                 */
const W    = OVR - OVL;              /* 180 — the homology                 */
const C    = 230;                    /* how far T5 chews each 5' end       */
const FILL = C - W;                  /* 50  — the gap the polymerase fills */
const SEP  = 130;                    /* half the separation before annealing */

const YT = 520, YB = 578;            /* the two strands                    */
const BARB = 26, BW = 0.49;

function seg(x1, x2, y){
  return Math.abs(x2-x1) < 1 ? "" : "M"+n2(x1)+" "+n2(y)+"L"+n2(x2)+" "+n2(y);
}
/* half barb at the 3' tip (xTip); xFrom is anywhere back along the strand,
   so the barb always lays back along the strand and onto its outer side. */
function barbAt(xFrom, xTip, y){
  if (Math.abs(xTip-xFrom) < 1) return "";
  const th = Math.atan2(0, xFrom - xTip);
  return "M"+n2(xTip + BARB*Math.cos(th+BW))+" "+n2(y + BARB*Math.sin(th+BW))+
         "L"+n2(xTip)+" "+n2(y);
}
/* the part of [lo,hi] that is still covered by a strand spanning [a,b] */
function clipSeg(a, b, lo, hi, d, y){
  const x1 = Math.max(lo, Math.min(a,b)), x2 = Math.min(hi, Math.max(a,b));
  return x2 - x1 < 1 ? "" : seg(x1+d, x2+d, y);
}
/* a square bracket sitting above the top strand, marking an x range */
function bracket(id){
  return '<path data-r="'+id+'" fill="none" stroke="var(--blue)" stroke-width="2.6" ' +
         'stroke-linecap="round" stroke-linejoin="round"/>';
}
function bracketD(lo, hi, d){
  const y = YT - 54, t = y + 16;
  return "M"+n2(lo+d)+" "+n2(t)+"V"+n2(y)+"H"+n2(hi+d)+"V"+n2(t);
}

window.Deck.sequence("gibson", function(slide){
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");

  const strandPaths =
    ["lt","lb","rt","rb"].map(k =>
      '<path data-r="'+k+'" stroke="var(--ink)"/>').join("") +
    ["ltb","lbb","rtb","rbb"].map(k =>
      '<path data-r="'+k+'" stroke="var(--ink)"/>').join("") +
    ["blt","blb","brt","brb"].map(k =>
      '<path data-r="'+k+'" stroke="var(--blue)"/>').join("") +
    ["nwt","nwb"].map(k =>
      '<path data-r="'+k+'" stroke="var(--vermillion)"/>').join("");

  svg.innerHTML =
    '<g fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      strandPaths + bracket("bkL") + bracket("bkR") +
    '</g>' +
    /* the 5' ends — the only ends T5 can start on */
    '<g font-family="inherit" font-size="24" font-weight="700" text-anchor="middle" ' +
      'fill="var(--muted)">' +
      '<text data-r="p5lt"></text><text data-r="p5lb"></text>' +
      '<text data-r="p5rt"></text><text data-r="p5rb"></text>' +
    '</g>' +
    '<text data-r="ovlab" x="800" y="424" text-anchor="middle" font-family="inherit" ' +
      'font-size="26" font-weight="700" fill="var(--blue)">overlap &mdash; the same sequence in both</text>' +
    '<g data-r="enzg" opacity="0">' +
      '<text data-r="enz" x="800" y="352" text-anchor="middle" font-family="inherit" ' +
        'font-size="30" font-weight="700" fill="var(--vermillion)">T5 exonuclease &#183; 5&#8242;&rarr;3&#8242;</text>' +
      /* struck through when T5 is heat-killed; x range is the measured
         width of the label above, 332 units, plus a little overhang */
      '<path data-r="kill" d="M624 343H976" fill="none" stroke="var(--vermillion)" ' +
        'stroke-width="3" stroke-linecap="round" opacity="0"/>' +
    '</g>' +
    '<text data-r="cap" x="800" y="712" text-anchor="middle" font-family="inherit" ' +
      'font-size="30" font-weight="700" fill="var(--ink)"></text>' +
    '<text data-r="call" x="800" y="784" text-anchor="middle" font-family="inherit" ' +
      'font-size="32" font-weight="700" fill="var(--vermillion)"></text>';

  slide.appendChild(svg);
  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  function put(el, x, y, txt, op){
    el.setAttribute("x", n2(x)); el.setAttribute("y", n2(y));
    el.textContent = txt; el.setAttribute("opacity", n2(op));
  }

  function paint(s){
    const dL = -SEP*s.sep, dR = SEP*s.sep;
    const c  = C*s.chew, f = FILL*s.close;

    /* strand termini, in the annealed frame */
    const lt5 = LFL + c, lt3 = LFR + f;      /* left  top:    5' .......... 3' */
    const lb3 = LFL,     lb5 = LFR - c;      /* left  bottom: 3' .......... 5' */
    const rt5 = RFL + c, rt3 = RFR;          /* right top:    5' .......... 3' */
    const rb3 = RFL - f, rb5 = RFR - c;      /* right bottom: 3' .......... 5' */

    r.lt.setAttribute("d", seg(lt5+dL, lt3+dL, YT));
    r.lb.setAttribute("d", seg(lb5+dL, lb3+dL, YB));
    r.rt.setAttribute("d", seg(rt5+dR, rt3+dR, YT));
    r.rb.setAttribute("d", seg(rb5+dR, rb3+dR, YB));

    /* half barbs.  The two OUTER 3' ends are permanent; the two INNER
       ones stop being ends the moment the nicks are sealed.            */
    r.ltb.setAttribute("d", barbAt(lt5+dL, lt3+dL, YT));
    r.rbb.setAttribute("d", barbAt(rb5+dR, rb3+dR, YB));
    r.lbb.setAttribute("d", barbAt(lb5+dL, lb3+dL, YB));
    r.rtb.setAttribute("d", barbAt(rt5+dR, rt3+dR, YT));
    r.ltb.setAttribute("opacity", n2(1 - s.close));
    r.rbb.setAttribute("opacity", n2(1 - s.close));

    /* the overlap, wherever a strand still covers it */
    r.blt.setAttribute("d", clipSeg(lt5, lt3, OVL, OVR, dL, YT));
    r.blb.setAttribute("d", clipSeg(lb3, lb5, OVL, OVR, dL, YB));
    r.brt.setAttribute("d", clipSeg(rt5, rt3, OVL, OVR, dR, YT));
    r.brb.setAttribute("d", clipSeg(rb3, rb5, OVL, OVR, dR, YB));

    /* what the polymerase adds */
    r.nwt.setAttribute("d", f > 1 ? seg(LFR+dL, lt3+dL, YT) : "");
    r.nwb.setAttribute("d", f > 1 ? seg(RFL+dR, rb3+dR, YB) : "");

    r.bkL.setAttribute("d", bracketD(OVL, OVR, dL));
    r.bkR.setAttribute("d", bracketD(OVL, OVR, dR));
    /* the brackets name the overlap once, then get out of the way —
       after the enzyme runs, the blue segments carry it on their own */
    r.bkL.setAttribute("opacity", n2(s.mark));
    r.bkR.setAttribute("opacity", n2(s.mark));
    r.ovlab.setAttribute("opacity", n2(s.mark));

    /* 5' labels ride their own terminus inward as the enzyme works */
    put(r.p5lt, lt5+dL - 4, YT - 18, "5′", 1);
    put(r.p5rb, rb5+dR + 4, YB + 34, "5′", 1);
    put(r.p5lb, lb5+dL + 4, YB + 34, "5′", 1 - s.close);
    put(r.p5rt, rt5+dR - 4, YT - 18, "5′", 1 - s.close);

    r.enzg.setAttribute("opacity", n2(s.enz * (1 - 0.62*s.dead)));
    r.kill.setAttribute("opacity", n2(s.dead));
  }

  const S = [
    { s:{sep:1, chew:0, close:0, enz:0, dead:0, mark:1},
      cap:"two fragments that share a sequence at the join", call:"",
      note:"Gibson assembly starts with two DNAs that already share a sequence where you want them joined. This is not a sticky end and it is not a restriction site — it is simply the same stretch of sequence, typically twenty to forty bases, present at the end of both fragments in the same orientation. The original Gibson paper used forty; the modern high-fidelity kits will go down to about fifteen. You put it there yourself, on the tail of a PCR primer.",
      desc:"Two separate double-stranded DNA molecules with a clear gap between them. Each is two antiparallel lines; a half barb marks every 3-prime end and each 5-prime end is labelled. The right-hand end of the left molecule and the left-hand end of the right molecule are drawn in blue and bracketed: the same sequence in both." },

    { s:{sep:1, chew:1, close:0, enz:1, dead:0, mark:0},
      cap:"", call:"eating 5′ ends is what exposes the 3′ overhangs",
      note:"T5 exonuclease runs five prime to three prime, so it eats five prime ends. Now look at what that leaves behind. At each end, the strand that survives is the one terminating in a three prime end — so a five-prime-to-three-prime exonuclease produces three prime single-stranded overhangs. This is the step almost everybody gets backwards, and it is worth saying out loud. Second thing to notice: T5 has no idea where your overlap is. It chews all four ends here, indiscriminately. Nothing about this enzyme is homology-specific. In a real assembly the two outer tails are the other junctions of the construct.",
      desc:"All four 5-prime labels have moved inward along their strands: the enzyme has removed bases from every 5-prime end. Each molecule now ends in a long single-stranded 3-prime tail at both ends. The blue overlap survives on the top strand of the left molecule and on the bottom strand of the right molecule." },

    { s:{sep:0, chew:1, close:0, enz:1, dead:0, mark:0},
      cap:"only the complementary pair can anneal", call:"",
      note:"The specificity comes from base pairing, not from the enzyme. Of the four exposed tails only two are complementary — the two blue ones, because you designed them to be the same sequence — so those are the two that find each other. The molecules are now held together, but they are not yet joined: T5 chewed a little past the overlap, so there is still a single-stranded gap in each strand, on opposite sides of the join.",
      desc:"The two molecules have converged. The blue single strand from each now forms a double-stranded blue join in the middle. Two gaps remain: one in the top strand just right of the join, one in the bottom strand just left of it." },

    { s:{sep:0, chew:1, close:1, enz:1, dead:0, mark:0},
      cap:"Phusion fills the gaps · Taq ligase seals the nicks", call:"",
      note:"Now the other two enzymes in the tube. Each gap presents a recessed three prime end sitting on a template, which is precisely what a DNA polymerase wants, so Phusion extends both and fills them. That leaves a nick in each strand, and Taq ligase seals those. The result is one covalently closed molecule.",
      desc:"New DNA drawn in vermillion fills each gap and the strands are continuous again: one double-stranded molecule across the whole join, still carrying a single-stranded 3-prime tail at each far end." },

    { s:{sep:0, chew:1, close:1, enz:1, dead:1, mark:0},
      cap:"one tube, 50 degrees, one incubation",
      call:"T5 is heat-killed as the reaction runs",
      note:"And here is why all three enzymes can share one tube at fifty degrees. T5 exonuclease is the heat-labile one; it is being inactivated the whole time the reaction is incubating. Phusion and Taq ligase are both thermostable and are not. So by the time the product exists, the only enzyme that would happily chew it back is dead. The order of events is enforced by the enzymes' own stability — you are not pipetting anything in stages.",
      desc:"The T5 exonuclease label is struck through and faded, marking it as heat-inactivated. The assembled molecule is otherwise unchanged." }
  ];

  const KEYS = ["sep","chew","close","enz","dead","mark"];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null, raf = null;

  function go(i, animated){
    const to = S[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.cap.textContent  = S[i].cap;
    r.call.textContent = S[i].call;
    if (!cur || animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 850;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now-t0)/dur), e = ease(t), s = {};
      KEYS.forEach(k => s[k] = from[k] + (to[k]-from[k])*e);
      paint(s); cur = s;
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }
  go(0, false);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
