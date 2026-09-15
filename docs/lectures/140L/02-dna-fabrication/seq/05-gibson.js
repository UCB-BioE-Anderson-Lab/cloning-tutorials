/* ------------------------------------------------------------------ *
 * 05-gibson.js — the Gibson reaction, one click per enzyme.
 *
 * Source slides 31 to 38, and it WAS eight slides: the first pass kept
 * the source's count so nothing went missing in translation.  JCA, on
 * seeing it run: "rethink the clicks on this gibson sequence.  It is an
 * excessive number of clicks."  He is right — three of the eight were
 * T5 chewing 35, 70 and 100 percent, and two more were the fragments
 * converging.  Those are not beats, they are frames of one beat, and
 * the tween already draws them.
 *
 * So five slides, each carrying data-seq="gib1" .. "gib5", all driven
 * from the single state table below.  Each registration renders exactly
 * one frame and, on the way in, tweens from the frame before it, which
 * means the chew and the annealing are now animations rather than
 * stills.  The beats are the reaction: the design, then T5, then
 * annealing, then Phusion, then Taq ligase.  Nothing was cut except
 * clicks; every caption from the eight survives on one of the five.
 *
 * The drawing deliberately matches seq/gibson.js in the DNA Modification
 * Enzymes lecture, which drew this same reaction once already: the same
 * annealed-frame construction, the same half barb laid back on every 3'
 * end, red for the shared sequence and nothing else, and 5' labels that
 * ride their own terminus inward as T5 works.  The enzymes deck taught
 * T5, Phusion and Taq ligase; this is the payoff, and it is only a
 * payoff if the room recognises the picture.  Stroke weights and type
 * sizes follow THIS lecture (seq/pcr-cut-ligate.js), which is heavier.
 *
 * Geometry is written in the ANNEALED frame; the fragments are pushed
 * apart by -/+SEP for the un-annealed frames, so annealing is one
 * symmetric convergence.
 *
 *   left fragment    225 .......... 885     shared 20 bp = 725..885
 *   right fragment          725 .......... 1385
 *
 * The three lengths are not free.  Writing L for a fragment, W for the
 * shared sequence and C for the chew:
 *   C > W          or the overlap never goes single-stranded
 *   C < L/2        or the fragment has no double-stranded middle left
 *   2SEP >= W + 40 or the un-annealed fragments have no air between
 *   2L - W + 2SEP <= 1380, the content box
 * L=660, W=160, C=250, SEP=100 meets all four (the third exactly, at
 * 40 px of air) and still leaves the gap Phusion fills, C-W = 90, wide
 * enough to read from the back of the room.
 *
 * Two things the source slides run together and this does not: filling
 * the gaps and sealing the nicks are separate states here (close, then
 * seal), because slide 37 says "nicked, but no gap" and slide 38 says
 * "no gaps, no nicks", and that distinction is the whole reason there
 * are three enzymes in the tube instead of two.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13", MUTED = "#767676";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

/* ---- the annealed frame -------------------------------------------- */
const LFL = 225, LFR = 885;          /* left fragment,  5' top .. 3' top   */
const RFL = 725, RFR = 1385;         /* right fragment                     */
const OVL = 725, OVR = 885;          /* the shared 20 bp                   */
const W    = OVR - OVL;              /* 160                                */
const C    = 250;                    /* how far T5 chews each 5' end       */
const FILL = C - W;                  /* 90, the gap Phusion fills          */
const SEP  = 100;                    /* half the separation, un-annealed   */

const YT = 556, YB = 614;            /* the two strands                    */
const SW = 5;                        /* this lecture's backbone weight     */
const BARB = 28, BW = 0.49;

/* ---- primitives ---------------------------------------------------- */
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
/* Half barb at a 3' tip.  xFrom is anywhere back along the strand, so
   the barb always lays back along it and onto the duplex's outer side.
   A 3' end takes a half barb, never a full arrowhead. */
function barbAt(xFrom, xTip, y, up){
  if (Math.abs(xTip-xFrom) < 1) return "";
  const back = xFrom > xTip ? 1 : -1;
  return "M"+n2(xTip + BARB*Math.cos(BW)*back)+" "+
             n2(y + BARB*Math.sin(BW)*(up ? -1 : 1))+"L"+n2(xTip)+" "+n2(y);
}
/* the part of [lo,hi] still covered by a strand spanning [a,b] */
function clipSeg(a, b, lo, hi, d, y){
  const x1 = Math.max(lo, Math.min(a,b)), x2 = Math.min(hi, Math.max(a,b));
  return x2 - x1 < 1 ? "" : seg(x1+d, x2+d, y);
}
/* a square bracket under the bottom strand, marking an x range */
function bracket(lo, hi, d){
  const y = YB + 46, t = y - 16;
  return stroke("M"+n2(lo+d)+" "+n2(t)+"V"+n2(y)+"H"+n2(hi+d)+"V"+n2(t), VERM, 3);
}
function downArrow(x, y0, y1){
  return stroke("M"+n2(x)+" "+n2(y0)+"L"+n2(x)+" "+n2(y1), INK, SW) +
         '<path d="M'+n2(x)+' '+n2(y1)+'L'+n2(x-13)+' '+n2(y1-25)+'L'+n2(x+13)+
         ' '+n2(y1-25)+'Z" fill="'+INK+'"/>';
}

/* ---- the reagent list, identical on all eight frames ---------------- *
 * It is the one thing on these slides that never moves, so it is drawn
 * here rather than repeated in eight <article> bodies.  The enzyme
 * actually doing something is lit in red; on a flip-book that one
 * change is the whole navigation aid.                                  */
const RX = ["T5 Exonuclease", "Phusion Polymerase", "Taq Ligase"];
function reagents(act){
  let g = "";
  RX.forEach(function(name, i){
    const on = i === act;
    g += txt(880, 252 + i*46, name, 34, on ? VERM : INK, on ? 700 : 400, "start");
  });
  g += txt(880, 420, "(NAD+, dNTPs, Buffer)", 34, MUTED, 400, "start");
  g += txt(880, 466, "One pot, 50&#176;C", 34, MUTED, 400, "start");
  return g;
}

/* ---- frame 1: the design view --------------------------------------- *
 * Not the reaction, the plan: two fragments that already share 20 bp,
 * and the molecule they are meant to become.  Same colour key as the
 * rest, so the red reads as the same thing all eight frames.           */
function duplex(x0, x1, y, ovL, ovR){
  const t = y - 20, b = y + 20;
  let g = stroke(seg(x0, x1, t), INK) + stroke(seg(x0, x1, b), INK);
  g += stroke(clipSeg(x0, x1, ovL, ovR, 0, t), VERM);
  g += stroke(clipSeg(x0, x1, ovL, ovR, 0, b), VERM);
  /* top strand runs left to right, bottom strand right to left */
  g += stroke(barbAt(x0, x1, t, true),  x1 >= ovL && x1 <= ovR ? VERM : INK);
  g += stroke(barbAt(x1, x0, b, false), x0 >= ovL && x0 <= ovR ? VERM : INK);
  return g;
}
/* The design frame is drawn on the reaction's own coordinates: the two
   inputs sit exactly where frames 2 to 4 will put them, and the product
   exactly where frame 8 leaves it.  Advancing off this slide therefore
   lands the molecules on the spot they already occupied, and the whole
   run reads as one continuous picture rather than a schematic followed
   by a different drawing.  It also gets the design out of the left
   third, which is all the room a stacked composition had once the
   reagent list took the upper right. */
function designFrame(){
  let g = duplex(LFL - SEP, LFR - SEP, 524, OVL - SEP, OVR - SEP);
  g += duplex(RFL + SEP, RFR + SEP, 524, OVL + SEP, OVR + SEP);
  g += txt(OVL - SEP + W/2, 588, "20 bp", 30, VERM, 700);
  g += txt(OVL + SEP + W/2, 588, "20 bp", 30, VERM, 700);
  g += downArrow(800, 610, 670);
  g += duplex(LFL, RFR, 730, OVL, OVR);
  g += txt(800, 802, "one 20 bp overlap per junction, and that is the whole design",
           32, INK, 700);
  return g;
}

/* ---- frames 2 to 8: the reaction ------------------------------------ */
function reaction(s){
  const dL = -SEP*s.sep, dR = SEP*s.sep;
  const c = C*s.chew, f = FILL*s.close;

  /* strand termini, in the annealed frame */
  const lt5 = LFL + c, lt3 = LFR + f;      /* left  top:    5' ....... 3' */
  const lb3 = LFL,     lb5 = LFR - c;      /* left  bottom: 3' ....... 5' */
  const rt5 = RFL + c, rt3 = RFR;          /* right top:    5' ....... 3' */
  const rb3 = RFL - f, rb5 = RFR - c;      /* right bottom: 3' ....... 5' */

  /* backbones */
  let g = stroke(seg(lt5+dL, lt3+dL, YT), INK) +
          stroke(seg(lb5+dL, lb3+dL, YB), INK) +
          stroke(seg(rt5+dR, rt3+dR, YT), INK) +
          stroke(seg(rb5+dR, rb3+dR, YB), INK);

  /* the shared 20 bp, wherever a strand still covers it */
  g += stroke(clipSeg(lt5, lt3, OVL, OVR, dL, YT), VERM) +
       stroke(clipSeg(lb3, lb5, OVL, OVR, dL, YB), VERM) +
       stroke(clipSeg(rt5, rt3, OVL, OVR, dR, YT), VERM) +
       stroke(clipSeg(rb3, rb5, OVL, OVR, dR, YB), VERM);

  /* what Phusion adds, in the colour this lecture uses for new DNA */
  if (f > 1){
    g += stroke(seg(LFR+dL, lt3+dL, YT), BLUE) +
         stroke(seg(RFL+dR, rb3+dR, YB), BLUE);
  }

  /* The two OUTER 3' ends are permanent.  The two INNER ones survive
     the polymerase — a nick still has an end on each side of it — and
     stop being ends only when Taq ligase seals them. */
  g += stroke(barbAt(lb5+dL, lb3+dL, YB, false), INK) +
       stroke(barbAt(rt5+dR, rt3+dR, YT, true),  INK);
  g += fade(1 - s.seal,
        stroke(barbAt(lt5+dL, lt3+dL, YT, true),  f > 1 ? BLUE : VERM) +
        stroke(barbAt(rb5+dR, rb3+dR, YB, false), f > 1 ? BLUE : VERM));

  /* 5' labels ride their own terminus inward as T5 works.  The two that
     end up flanking a nick go when the nick does. */
  g += txt(lt5+dL - 8, YT - 24, "5&#8242;", 26, MUTED, 700) +
       txt(rb5+dR + 8, YB + 42, "5&#8242;", 26, MUTED, 700);
  g += fade(1 - s.seal,
        txt(lb5+dL + 8, YB + 42, "5&#8242;", 26, MUTED, 700) +
        txt(rt5+dR - 8, YT - 24, "5&#8242;", 26, MUTED, 700));
  return g;
}

function scene(s){
  if (s.design) return reagents(-1) + designFrame();

  let g = reagents(s.act) + reaction(s);
  if (s.mark > 0.004){
    /* The brackets and a caption both want y=730.  They never collided
       while the chew had three slides to itself; now that it has one,
       the brackets keep the position they mark and the label gives way
       to the caption -- the design frame has already said 20 bp. */
    g += fade(s.mark, bracket(OVL, OVR, -SEP*s.sep) + bracket(OVL, OVR, SEP*s.sep) +
              (s.cap ? "" : txt(800, 730, "20 bp, the same sequence in both", 30, VERM, 700)));
  }
  if (s.stage) g += txt(130, 300, s.stage, 40, VERM, 700, "start");
  if (s.cap)   g += txt(800, 730, s.cap, 32, INK, 700);
  if (s.call)  g += txt(800, 792, s.call, 32, VERM, 700);
  return g;
}

/* ---- the five frames ------------------------------------------------ *
 * KEYS are tweened; stage, cap, call and act are taken from the target
 * frame the moment the slide is entered.  cap is the ink line, what is
 * happening and why; call is the vermillion line under it, what you are
 * holding once it has happened. */
const KEYS = ["sep", "chew", "close", "seal", "mark"];
const FR = [
  /* design */ { design:1, sep:1, chew:0, close:0, seal:0, mark:0, act:-1 },
  /* T5     */ { sep:1, chew:1, close:0, seal:0, mark:1, act:0,
                 stage:"T5 Exonuclease",
                 cap:"it eats 5&#8242; ends, so what it leaves behind is a 3&#8242; overhang",
                 call:"all four of them, indiscriminately &#183; and past the 20 bp, which is why there will be a gap" },
  /* anneal */ { sep:0, chew:1, close:0, seal:0, mark:0, act:0,
                 stage:"Annealing",
                 cap:"of the four exposed tails, only these two are complementary",
                 call:"held together, not joined &#183; a gap in each strand" },
  /* fill   */ { sep:0, chew:1, close:1, seal:0, mark:0, act:1,
                 stage:"Phusion",
                 cap:"each gap was a recessed 3&#8242; end sitting on a template",
                 call:"nicked, but no gap" },
  /* seal   */ { sep:0, chew:1, close:1, seal:1, mark:0, act:2,
                 stage:"Taq Ligase",
                 cap:"the NAD+ in the buffer is there for exactly this step",
                 call:"dsDNA, no gaps, no nicks" }
];
/* What each frame animates FROM.  The T5 frame starts from an unchewed
   duplex with the brackets already placed, so the first click is the
   whole chew rather than the tail of one; the design frame is a
   different picture and is never tweened into or out of. */
const FROM = [
  null,
  { sep:1, chew:0, close:0, seal:0, mark:1 },
  FR[1], FR[2], FR[3]
];

function make(k){
  return function(slide){
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 1600 900");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
    svg.innerHTML = '<g data-r="dyn"></g>';
    slide.appendChild(svg);
    const dyn = svg.querySelector('[data-r="dyn"]');
    let raf = null;

    function paint(s){
      const t = {};
      KEYS.forEach(key => t[key] = clamp01(s[key]));
      dyn.innerHTML = scene(Object.assign({}, FR[k], t));
    }
    function go(i, animated){
      if (raf){ cancelAnimationFrame(raf); raf = null; }
      const to = FR[k], from = FROM[k];
      if (!from || animated === false || reduce.matches){ paint(to); return; }
      const t0 = performance.now(), dur = 850;
      raf = requestAnimationFrame(function f(now){
        const t = Math.min(1, (now - t0)/dur), e = ease(t), s = {};
        KEYS.forEach(key => s[key] = from[key] + (to[key] - from[key])*e);
        paint(s);
        raf = t < 1 ? requestAnimationFrame(f) : null;
      });
    }
    go(0, false);
    /* One step per slide.  Nothing is returned for the two text
       channels, so each <article> keeps its own notes and desc. */
    return { steps: [{}], go: go };
  };
}

for (let k = 0; k < FR.length; k++) window.Deck.sequence("gib" + (k+1), make(k));
})();
