/* ------------------------------------------------------------------ *
 * 05-soeing.js — SOEing, splicing by overlap extension.  Source slide 29.
 *
 * The original is four stacked panels of coloured PowerPoint arrows —
 * two duplexes, then the same DNA denatured, then annealed, then
 * polymerised — with the stage named beside a white arrow between each
 * pair.  The speaker notes walk those stages in order, so here it is one
 * band that goes through them instead of four bands that sit there: the
 * strands separate, all four of them find partners, and the polymerase
 * runs on the one pairing that gives it somewhere to run.  That frees the
 * whole width for a single set of molecules.
 *
 * The frame is within a few pixels of the one seq/05-gibson.js uses,
 * and the shared block sits in the same place on the slide:
 *
 *   fragment A     280 .......... 880     shared homology = 720..880
 *   fragment B            720 .......... 1320
 *
 * That is on purpose.  A SOEing junction and a Gibson junction are the
 * same design — "put the same 20 to 40 bases on the end of both
 * fragments" — and only the enzymes differ.  Two slides later the room
 * sees the red land in the same spot, which is the cheapest way to say
 * so.  The two are not pixel-identical because they are separated by
 * different amounts: SOEing has to hold four loose strands apart, and
 * Gibson only two molecules.
 *
 * Colour, one meaning each:
 *   ink         DNA that was in the tube at the start: every strand of
 *               both input fragments, whatever it later pairs with
 *   blue        DNA the polymerase made
 *   vermillion  the shared terminal homology, on whichever strand still
 *               carries it — the same red seq/05-gibson.js uses
 *   amber       the two supplied outer oligos.  Amber is stroke here and
 *               never text; it measures 3.1:1 on white, which passes for
 *               a 5px line and fails for a label.
 *
 * Every 3' end takes a half barb laid back along its own strand; every
 * 5' end is labelled.  That is the only way the annealing step reads.
 *
 * Denaturation leaves four strands, and four strands make exactly two
 * duplexes, so both are drawn and both are drawn ANNEALED:
 *
 *   A-top + B-bottom   top 280..880 over bottom 720..1320
 *   A-bottom + B-top   top 720..1320 over bottom 280..880
 *
 * which is one shape and the same shape turned through 180 degrees.
 * Both pair through the same red.  The discrimination is not there; it
 * is in what each 3' end finds when it arrives — inward and recessed on
 * a template in the first, outward over open air in the second.  An
 * earlier pass drew the second pairing adrift, as two dimmed strands
 * that never met, which quietly moved the discrimination back to the
 * annealing step.  That is the one thing this slide argues it is not.
 *
 * The parental reanneals, A with A and B with B, are the other two
 * outcomes and are not drawn.  They would need a second copy of all four
 * strands to sit alongside the two cross-pairs; they are pixel for pixel
 * the opening frame, so all they say is "nothing happened"; and they
 * pull in a linear-versus-exponential sub-story that the speaker note
 * does not tell and the slide has no room to tell properly.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const NS = "http://www.w3.org/2000/svg";
const INK = "#111111", BLUE = "#004373", VERM = "#ba3a13",
      AMBER = "#a99011", MUTED = "#767676";

const n2 = v => Math.round(v*10)/10;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const lerp = (a, b, t) => a + (b-a)*t;

/* ---- the frame ------------------------------------------------------ */
const AL = 280, AR = 880;            /* fragment A */
const BL = 720, BR = 1320;           /* fragment B */
const OVL = 720, OVR = 880;          /* the shared homology */
const SEP = 140;                     /* half the separation, un-annealed.
   2*SEP - W = 120 px of clear air between the two molecules, which is
   what makes them read as two molecules and not one dashed line. */

const YT = 528, YB = 578;            /* the duplex, before it melts */
const Y1 = 452, Y2 = 654;            /* where the strands go when melted */
const PT = 428, PB = 478;            /* the productive cross-pair, annealed */
const DT = 628, DB = 678;            /* the other cross-pair, annealed.
   A's two strands sit 24 px from where melting left them and B's two swap
   rows across the 150 px between the duplexes, so the animation of the
   annealing step is literally B changing partners, and the two rows of
   red end up stacked one above the other. */
const SW = 5, BARB = 28, BW = 0.49;

/* ---- primitives ----------------------------------------------------- */
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
function barbAt(xFrom, xTip, y, up){
  if (Math.abs(xTip-xFrom) < 1) return "";
  const back = xFrom > xTip ? 1 : -1;
  return "M"+n2(xTip + BARB*Math.cos(BW)*back)+" "+
             n2(y + BARB*Math.sin(BW)*(up ? -1 : 1))+"L"+n2(xTip)+" "+n2(y);
}
function clipSeg(a, b, lo, hi, y){
  const x1 = Math.max(lo, Math.min(a,b)), x2 = Math.min(hi, Math.max(a,b));
  return x2 - x1 < 1 ? "" : seg(x1, x2, y);
}
function bracket(lo, hi, y){
  return stroke("M"+n2(lo)+" "+n2(y-16)+"V"+n2(y)+"H"+n2(hi)+"V"+n2(y-16), VERM, 3);
}

/* One strand.  x5 and x3 are its own 5' and 3' termini, already carrying
   whatever x offset its fragment has, and ovL/ovR are the shared region
   in the same offset coordinates — so the barb, the red and the 5' label
   all land the right way round however the strand is drawn. */
function strand(x5, x3, y, col, up, ovL, ovR){
  let g = stroke(seg(x5, x3, y), col);
  g += stroke(clipSeg(x5, x3, ovL, ovR, y), VERM);
  g += stroke(barbAt(x5, x3, y, up), (x3 >= ovL && x3 <= ovR) ? VERM : col);
  g += txt(x5 + (x5 < x3 ? -8 : 8), up ? y - 24 : y + 42,
           "5&#8242;", 26, MUTED, 700);
  return g;
}

/* ---- the scene ------------------------------------------------------- *
 * melt   0 duplexes,      1 four separate strands
 * pair   0                1 both cross-pairs are annealed, and the two
 *                           fragments have converged horizontally
 * ext    0                1 the polymerase has run both ways, on the one
 *                           pairing that gave it a 3' end to start from
 * olig   0                1 the two external oligos are on
 * mark   the homology brackets, step 1 only                            */
function scene(s){
  const dA = -SEP*(1 - s.pair), dB = SEP*(1 - s.pair);

  /* Each strand comes off its duplex line, then travels to the row its
     new partner is on.  One expression each, so no strand can arrive
     late or drift out of step with the one it is pairing with. */
  const yAt = lerp(lerp(YT, Y1, s.melt), PT, s.pair);   /* A top    */
  const yBb = lerp(lerp(YB, Y2, s.melt), PB, s.pair);   /* B bottom */
  const yBt = lerp(lerp(YT, Y1, s.melt), DT, s.pair);   /* B top    */
  const yAb = lerp(lerp(YB, Y2, s.melt), DB, s.pair);   /* A bottom */

  /* how far the polymerase has run */
  const at3 = lerp(AR, BR, s.ext);           /* A-top   3' runs right */
  const bt3 = lerp(BL, AL, s.ext);           /* B-bottom 3' runs left  */

  let g = "";

  /* The other cross-pair, A's bottom strand on B's top.  It anneals
     through the same red and is drawn annealed; what it does not have is
     anywhere to go, because both of its 3' ends finish at the outside
     corners with no template under them.  It keeps its weight through
     polymerisation on purpose: the argument is that it is still sitting
     there, exactly the length it was, while the other one grows.  Only
     when the oligos arrive does it step further back. */
  const other = lerp(1, 0.55, s.pair) * lerp(1, 0.55, s.olig);
  g += fade(other,
        strand(AR + dA, AL + dA, yAb, INK, false, OVL + dA, OVR + dA));

  /* B's top strand crosses B's bottom strand on its way down, and the two
     of them occupy exactly the same x, so for about a third of a second
     mid-tween they sit one on the other and read as a B duplex that is
     not being claimed.  No vertical routing avoids this: one strand has
     to pass the other.  So the travelling strand ducks instead, back to
     0.55 as it lands.  Settled frames, and reduced motion, are unaffected
     because sin(pi) and sin(0) are both zero. */
  g += fade(other * (1 - 0.82*Math.sin(Math.PI*s.pair)),
        strand(BL + dB, BR + dB, yBt, INK, true, OVL + dB, OVR + dB));

  /* the productive pair: A's top strand and B's bottom strand */
  g += stroke(seg(AL + dA, at3 + dA, yAt), INK);
  g += stroke(seg(BR + dB, bt3 + dB, yBb), INK);
  if (s.ext > 0.004){
    g += stroke(seg(AR + dA, at3 + dA, yAt), BLUE);
    g += stroke(seg(BL + dB, bt3 + dB, yBb), BLUE);
  }
  g += stroke(clipSeg(AL + dA, at3 + dA, OVL + dA, OVR + dA, yAt), VERM);
  g += stroke(clipSeg(BR + dB, bt3 + dB, OVL + dB, OVR + dB, yBb), VERM);
  g += stroke(barbAt(AL + dA, at3 + dA, yAt, true),  s.ext > 0.02 ? BLUE : VERM);
  g += stroke(barbAt(BR + dB, bt3 + dB, yBb, false), s.ext > 0.02 ? BLUE : VERM);
  g += txt(AL + dA - 8, yAt - 24, "5&#8242;", 26, MUTED, 700);
  g += txt(BR + dB + 8, yBb + 42, "5&#8242;", 26, MUTED, 700);

  /* The two external oligos, which is all the second PCR needs.  They
     clear the outer 5' labels rather than crossing them, and they sit the
     same 64 px off their own strand on both sides.  That symmetry is
     load-bearing now that there is a second duplex below: at 64 the lower
     oligo is 22 px clear of the 5' label above it and 86 px clear of the
     duplex below it, so it can only belong to the product.  The other
     duplex dims here as well, for the same reason. */
  if (s.olig > 0.004){
    g += fade(s.olig,
      stroke(seg(AL, AL + 180, yAt - 64), AMBER, 4.6) +
      stroke(barbAt(AL, AL + 180, yAt - 64, true), AMBER, 4.6) +
      stroke(seg(BR, BR - 180, yBb + 64), AMBER, 4.6) +
      stroke(barbAt(BR, BR - 180, yBb + 64, false), AMBER, 4.6));
  }

  if (s.mark > 0.004){
    g += fade(s.mark,
      bracket(OVL - SEP, OVR - SEP, YB + 58) +
      bracket(OVL + SEP, OVR + SEP, YB + 58) +
      txt(800, YB + 104, "20 to 40 bp of exact homology, on both", 30, VERM, 700));
  }
  if (s.stage) g += txt(130, 300, s.stage, 40, VERM, 700, "start");
  if (s.cap)   g += txt(800, 786, s.cap, 32, INK, 700);
  return g;
}

const KEYS = ["melt", "pair", "ext", "olig", "mark"];
const S = [
  { s:{melt:0, pair:0, ext:0, olig:0, mark:1},
    stage:"", cap:"two PCR products, made separately",
    note:"The most basic of these techniques is SOEing. In SOEing, there are two rounds of PCR. The first step is a conventional PCR to generate double-stranded linear products. For the second step to work, the linear products generated in the first step must share homology to one another on their termini. In the example shown, we have two such fragments. Typically the fragments share 20 to 40 bp of exact homology to one another on their ends.",
    desc:"Two separate double-stranded DNA molecules in black, each drawn as a pair of antiparallel lines with a half barb at each 3-prime end and each 5-prime end labelled. The right-hand end of the left molecule and the left-hand end of the right one are drawn in red and bracketed underneath: the same twenty to forty bases are present in both." },

  { s:{melt:1, pair:0, ext:0, olig:0, mark:0},
    stage:"Denaturation", cap:"four single strands in one tube",
    note:"In the second step, several of these linear products are combined with two external oligonucleotides, and the fragments assemble into a full length product through PCR. During the assembly reaction, first the DNAs are denatured resulting in single stranded products.",
    desc:"Both duplexes have come apart. The four strands are now single, the two former top strands on an upper line and the two former bottom strands on a lower one, each still carrying its own 3-prime barb and 5-prime label, and the red shared sequence still marking one end of each." },

  { s:{melt:1, pair:1, ext:0, olig:0, mark:0},
    stage:"Annealing", cap:"only this pairing leaves a recessed 3&#8242; end on a template",
    note:"Though there are multiple ways these strands can reanneal to one another, only a few of these configurations results in a duplex with a recessed 3 prime end. One of these duplexes results from annealing of strands of the two template PCR products.",
    desc:"All four strands have found partners, and four strands make exactly two duplexes, so both are drawn. In the upper one the top strand of the left fragment lies across the bottom strand of the right one, overlapping through the red shared sequence in the middle, and each strand stops short there: both barbed 3-prime ends point inward and sit recessed, with the other strand running on ahead of each as template. The lower duplex, drawn fainter, is the same shape turned upside down. Those two strands anneal through exactly the same red, but their 3-prime ends finish at the far outside corners of the molecule with nothing underneath them. Both pairings happen; only the upper one has anywhere to go." },

  { s:{melt:1, pair:1, ext:1, olig:0, mark:0},
    stage:"Polymerization", cap:"one full-length product, both strands complete",
    note:"The polymerase can extend that duplex to the full length double-stranded product.",
    desc:"New DNA in blue runs out from each recessed 3-prime end of the upper duplex to the far end of its template. Both of its strands are now continuous and it is one full-length molecule spanning the whole of both original fragments, with the red shared sequence buried in the middle of it. The lower duplex is untouched and exactly the length it was, because neither of its 3-prime ends had any template ahead of it to copy." },

  { s:{melt:1, pair:1, ext:1, olig:1, mark:0},
    stage:"Amplification", cap:"and now two outer oligos amplify it, exponentially",
    note:"This full-length product can then undergo exponential amplification with the two supplied oligos. In this example, there are only two template fragments being joined together.",
    desc:"Two short amber oligos appear, one above the left end of the full-length product and one below its right end, each with a half barb at its 3-prime end pointing inward. These are the only two primers the second PCR needs, and the full-length molecule is the only thing in the tube carrying both of their sites, so from here it amplifies exponentially like any other template. The other duplex fades further back, having neither extended nor amplified." }
];

window.Deck.sequence("soeing", function(slide){
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
    const t = {};
    KEYS.forEach(k => t[k] = clamp01(v[k]));
    dyn.innerHTML = scene(Object.assign({ stage:S[i].stage, cap:S[i].cap }, t));
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
