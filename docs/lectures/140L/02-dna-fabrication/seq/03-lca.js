/* ------------------------------------------------------------------ *
 * 03-lca.js : ligase chain assembly.
 *
 * Registers:  gs-lca   input sequence -> oligos -> kinase and anneal
 *                      -> Taq ligase seals every nick      (4 steps)
 *
 * This is the nickseal drawing from the enzymes lecture, at the scale
 * a synthon is built at, and it is meant to be recognised as such:
 * same barbed lines, same 30px break for a nick, same red tick where a
 * bond was made, same claim underneath it. There the point was that
 * annealing, not the ligase, puts a junction in register. Here that is
 * the whole method: both strands are ordered as oligos, they anneal
 * into the full-length duplex on their own, and all Taq ligase has to
 * do is close the breaks that are left.
 *
 * Level of iconography: SHAPES. Which base is where does not matter at
 * this scale; what matters is that the two strands are cut in
 * DIFFERENT places, so that every junction has the other strand
 * running through it.
 *
 * Top strand runs 5' to 3' left to right, so a top oligo's 3' tip is
 * its right end; the bottom strand is antiparallel and its tips are at
 * the left. Half barbs, never arrowheads.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", BLUE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

const XA = 320, XB = 1380;
const OT = 440, OB = 500;                /* the two strands             */
const NH = 15;                           /* half a nick's width         */

/* the forward oligos are cut in thirds, the reverse ones in sixths, so
   no two breaks are ever opposite one another */
const TOP = [XA, 673, 1027, XB];
const BOT = [XA, 497, 850, 1203, XB];

/* each oligo drifts in from its own place: seven oligos in a tube are
   seven molecules, not a row */
const FT = [[-30,-118],[8,-160],[44,-126]];
const FB = [[-40,116],[-4,150],[30,122],[62,110]];

const BARB = 24, BW = 0.49;
function strand(x1, y1, x2, y2){
  if (Math.abs(x2-x1) < 1) return "";
  const th = Math.atan2(y1-y2, x1-x2);
  const bx = x2 + BARB*Math.cos(th + BW), by = y2 + BARB*Math.sin(th + BW);
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2)+
         "M"+n2(bx)+" "+n2(by)+"L"+n2(x2)+" "+n2(y2);
}
function plain(x1, y1, x2, y2){
  if (Math.abs(x2-x1) < 1) return "";
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2);
}

/* the span of oligo i in a row, pulled back from its neighbours by the
   width of a nick while seal is 0 */
function span(cuts, i, seal){
  const g = NH*(1-seal);
  return [ i === 0 ? cuts[0] : cuts[i] + g,
           i === cuts.length-2 ? cuts[cuts.length-1] : cuts[i+1] - g ];
}

const STEPS = [
{ s:{an:1, seal:1, phos:0},
  label:"the sequence you want, as a synthon",
  sub:"nothing about it says how to build it",
  note:"Once oligonucleotides are obtained, they must be assembled into synthons.  The simplest of these methodologies is ligase chain assembly.",
  desc:"A single double-stranded DNA running the width of the slide, labelled input sequence. It is the synthon to be built." },

{ s:{an:0, seal:0, phos:0},
  label:"Synthesize both strands as overlapping 50 mers",
  sub:"seven separate molecules, ordered from a supplier",
  note:"Here, both strands of the input sequence are synthesized completely in such a way that they can all anneal to one another into the full length target sequence.  Typically these sequences will be 50 bp in length, but could be as low as 30 bp, and in some variations are as long as 200 bp.",
  desc:"The sequence is broken into oligos which float apart: three forward oligos above and four reverse oligos below, each with a half barb at its 3-prime end. The forward strand is cut in thirds and the reverse strand in sixths, so no two breaks fall opposite one another." },

{ s:{an:1, seal:0, phos:1},
  label:"kinase, then anneal: every junction is a nick",
  call:"the base pairing holds them, not the enzyme",
  note:"Procedurally, the oligos are first treated with polynucleotide kinase to add 5’ phosphates, and then subjected to a ligase chain reaction with Taq ligase.",
  desc:"Polynucleotide kinase puts a 5-prime phosphate on every oligo, drawn as a red dot at each 5-prime end. The oligos then anneal into the full-length duplex, and because the two strands are cut in different places every junction now has the other strand running through it: five nicks, no gaps. Brackets underneath mark the hybridization units." },

{ s:{an:1, seal:1, phos:0},
  label:"Thermal cycling of a Taq Ligase reaction containing oligos",
  call:"five nicks, five bonds, one molecule",
  note:"Through cycling of the reaction through iterations of denaturation, annealing, and ligation at elevated temperatures, the individual nicks between the junctions of the oligos are sealed resulting in the full-length synthon as a contiguous double-stranded product.",
  desc:"Thermal cycling with Taq ligase seals every nick, marked with a short red tick at each junction. Both strands now run continuously and the seven oligos are one contiguous double-stranded DNA molecule." }
];

window.Deck.sequence("gs-lca", function(slide){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;inset:0;pointer-events:none");

  let h = '<g font-family="Helvetica Neue,Arial,Helvetica,sans-serif">';
  h += '<g fill="none" stroke="'+INK+'" stroke-width="3.4" stroke-linecap="round">';
  for (let i = 0; i < 3; i++) h += '<path data-r="t'+i+'"/>';
  for (let i = 0; i < 4; i++) h += '<path data-r="b'+i+'"/>';
  h += '</g>';

  h += '<g data-r="phos" fill="'+RED+'" opacity="0">';
  for (let i = 0; i < 3; i++) h += '<circle data-r="pt'+i+'" r="7"/>';
  for (let i = 0; i < 4; i++) h += '<circle data-r="pb'+i+'" r="7"/>';
  h += '</g>';

  let seals = "";
  for (let i = 1; i < TOP.length-1; i++)
    seals += '<path d="M'+TOP[i]+' '+(OT-13)+'V'+(OT+13)+'"/>';
  for (let i = 1; i < BOT.length-1; i++)
    seals += '<path d="M'+BOT[i]+' '+(OB-13)+'V'+(OB+13)+'"/>';
  h += '<g data-r="seals" fill="none" stroke="'+RED+'" stroke-width="4.6" ' +
         'stroke-linecap="round" opacity="0">'+seals+'</g>';

  /* the hybridization units: every stretch between one break and the
     next, which is the piece of duplex that has to hold on its own */
  const cuts = [XA, BOT[1], TOP[1], BOT[2], TOP[2], BOT[3], XB];
  let br = "";
  for (let i = 0; i < cuts.length-1; i++)
    br += '<path d="M'+(cuts[i]+6)+' '+(OB+34)+'v14h'+(cuts[i+1]-cuts[i]-12)+'v-14"/>';
  h += '<g data-r="units" opacity="0">' +
       '<g fill="none" stroke="'+MUTED+'" stroke-width="2.4">'+br+'</g>' +
       '<text x="850" y="'+(OB+82)+'" text-anchor="middle" font-size="22" fill="'+MUTED+
         '">hybridization units</text></g>';

  h += '<text data-r="mol" x="'+XA+'" y="'+(OT-40)+'" font-size="24" fill="'+MUTED+
         '">Input sequence</text>' +
       '<text data-r="fwd" x="'+(XA-22)+'" y="'+(OT+8)+'" text-anchor="end" ' +
         'font-size="24" fill="'+MUTED+'" opacity="0">Forward</text>' +
       '<text data-r="rev" x="'+(XA-22)+'" y="'+(OB+8)+'" text-anchor="end" ' +
         'font-size="24" fill="'+MUTED+'" opacity="0">Reverse</text>';

  h += '<text data-r="label" x="800" y="690" text-anchor="middle" font-size="30" ' +
         'font-weight="700" fill="'+INK+'"></text>' +
       '<text data-r="sub" x="800" y="740" text-anchor="middle" font-size="26" ' +
         'fill="'+MUTED+'"></text>' +
       '<text data-r="call" x="800" y="740" text-anchor="middle" font-size="29" ' +
         'font-weight="700" fill="'+RED+'" opacity="0"></text>';

  h += '</g>';
  svg.innerHTML = h;
  slide.appendChild(svg);

  const r = {};
  svg.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  let sealed = false, cur = { an:1, seal:1, phos:0 }, raf = null;

  function paint(s){
    for (let i = 0; i < 3; i++){
      const q = span(TOP, i, s.seal);
      const dx = FT[i][0]*(1-s.an), dy = FT[i][1]*(1-s.an);
      /* a barb inside a continuous strand would be a lie, so the two
         internal 3' ends lose theirs once the strand is one molecule */
      const f = (sealed && i < 2) ? plain : strand;
      r["t"+i].setAttribute("d", f(q[0]+dx, OT+dy, q[1]+dx, OT+dy));
      r["pt"+i].setAttribute("cx", n2(q[0]+dx+9));
      r["pt"+i].setAttribute("cy", n2(OT+dy-16));
    }
    for (let i = 0; i < 4; i++){
      const q = span(BOT, i, s.seal);
      const dx = FB[i][0]*(1-s.an), dy = FB[i][1]*(1-s.an);
      const f = (sealed && i > 0) ? plain : strand;
      /* the bottom strand is antiparallel: its 3' tip is the LEFT end */
      r["b"+i].setAttribute("d", f(q[1]+dx, OB+dy, q[0]+dx, OB+dy));
      r["pb"+i].setAttribute("cx", n2(q[1]+dx-9));
      r["pb"+i].setAttribute("cy", n2(OB+dy+16));
    }
    r.phos.setAttribute("opacity", n2(s.phos));
    r.seals.setAttribute("opacity", n2(Math.max(0, s.seal*1.6 - 0.6)));
  }

  function go(i, animated){
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    sealed = (i === 0 || i === 3);
    const st = STEPS[i];
    r.label.textContent = st.label;
    r.sub.textContent   = st.call ? "" : (st.sub || "");
    r.call.textContent  = st.call || "";
    r.call.setAttribute("opacity", st.call ? "1" : "0");
    r.mol.textContent   = i === 3 ? "DNA molecule" : "Input sequence";
    r.mol.setAttribute("opacity", (i === 0 || i === 3) ? "1" : "0");
    r.fwd.setAttribute("opacity", i >= 2 ? "1" : "0");
    r.rev.setAttribute("opacity", i >= 2 ? "1" : "0");
    r.units.setAttribute("opacity", i === 2 ? "1" : "0");

    const to = st.s;
    if (animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 780;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1, (now - t0)/dur), e = ease(t);
      cur = { an:   from.an   + (to.an   - from.an)*e,
              seal: from.seal + (to.seal - from.seal)*e,
              phos: from.phos + (to.phos - from.phos)*e };
      paint(cur);
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }

  go(0, false);
  return { steps: STEPS.map(x => ({ note:x.note, desc:x.desc })), go: go };
});

})();
