/* ------------------------------------------------------------------ *
 * rna.js — the RNA polymerase section.
 *
 * Registers:  denovo    extension vs. de novo initiation      (2 steps)
 *             t7prom    promoter, +1, and the whole transcript (5 steps)
 *             guide     making a CRISPR guide RNA in vitro    (3 steps)
 *
 * t7prom is a copy of the "t7rnap" sequence in linear.js, kept here so
 * this section can be edited without touching a file the DNA-polymerase
 * section also loads.  The sequence, the strand assignment and the +1
 * position are reproduced EXACTLY; only the step list differs.
 *
 * t7prom now runs the transcript all the way out and releases it, which
 * absorbed a separate elongation slide.  Its two new beats carry that
 * slide's one real lesson — the bubble is a constant width, so it
 * TRAVELS rather than grows — by moving the bubble instead of saying so.
 *
 * Level of iconography, deliberately, one per slide:
 *     denovo   line     only topology matters — an end exists, or it doesn't
 *     t7prom   letters  a POSITION matters: -17..-1, then +1
 *     guide    line     regions of a molecule, and what you change
 *
 * Conventions: every 3' end carries a HALF BARB.  DNA is drawn straight,
 * RNA is drawn as a wave — so the two are told apart by SHAPE and by
 * label, not by colour alone.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", SLATE = "#004373", RED = "#ba3a13", MUTED = "#767676";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;
const BARB = 26, BW = 0.49;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;

/* A half barb laid back from the tip (tx,ty), given the point before it. */
function barb(px, py, tx, ty){
  const th = Math.atan2(py-ty, px-tx);
  const bx = tx + BARB*Math.cos(th + BW), by = ty + BARB*Math.sin(th + BW);
  return "M"+n2(bx)+" "+n2(by)+"L"+n2(tx)+" "+n2(ty);
}
/* A straight strand; the 3' tip is (x2,y2). */
function strand(x1,y1,x2,y2){
  if (Math.abs(x2-x1) < 1 && Math.abs(y2-y1) < 1) return "";
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2) + barb(x1,y1,x2,y2);
}

/* ---- RNA is drawn as a wave -------------------------------------- *
 * Shape, not just colour, separates the RNA from the DNA: a viewer with
 * a colour-vision deficiency, or a greyscale printout, still sees which
 * molecule is which (WCAG 1.4.1).                                     */
const AMP = 7, LAM = 26;
function wave(x1, x2, y){
  if (x2 - x1 < 6) return { d:"", px:x1, py:y, tx:x1, ty:y };
  let d = "", px = x1, py = y, x = x1;
  for (; x < x2; x += 4){
    const yy = y + AMP*Math.sin(2*Math.PI*(x-x1)/LAM);
    d += (x === x1 ? "M" : "L") + n2(x) + " " + n2(yy);
    px = x; py = yy;
  }
  const ty = y + AMP*Math.sin(2*Math.PI*(x2-x1)/LAM);
  d += "L" + n2(x2) + " " + n2(ty);
  return { d:d, px:px, py:py, tx:x2, ty:ty };
}
/* wave with a 3' half barb on its right-hand tip.
   The wave settles onto its axis over the last 20px so the barb can be
   laid back from a HORIZONTAL reference, exactly as on a DNA strand.
   Taking the direction from the local crest instead put the barb across
   the wave, where it read as a tangle rather than as a 3' end. */
function rna(x1, x2, y){
  if (x2 - x1 < 26) return "";
  const w = wave(x1, x2 - 20, y);
  if (!w.d) return "";
  return w.d + "L" + n2(x2) + " " + n2(y) + barb(x2 - 20, y, x2, y);
}

/* ------------------------------------------------------------------ *
 * Shared scaffolding
 * ------------------------------------------------------------------ */
function mount(slide, markup){
  const s = document.createElementNS(SVGNS,"svg");
  s.setAttribute("viewBox","0 0 1600 900");
  s.setAttribute("aria-hidden","true");
  s.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  s.innerHTML = markup;
  slide.appendChild(s);
  const r = {};
  s.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  return r;
}

/* label — a heading for the state; call — the sentence under the drawing. */
function chrome(labelY, callY){
  return '<text data-r="label" x="800" y="'+labelY+'" text-anchor="middle" ' +
           'font-family="inherit" font-weight="700" font-size="31" fill="'+INK+'"></text>' +
         '<text data-r="call" x="800" y="'+callY+'" text-anchor="middle" ' +
           'font-family="inherit" font-weight="700" font-size="29" fill="'+RED+'"></text>';
}

function driver(r, keys, steps, paint){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = Object.assign({}, steps[0].s), raf = null;
  function go(i, animated){
    const to = steps[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    if (r.label) r.label.textContent = steps[i].label || "";
    if (r.call){
      r.call.textContent = steps[i].call || "";
      r.call.setAttribute("fill", steps[i].callFill || RED);
    }
    if (animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(r, cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 780;
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1,(now-t0)/dur), e = ease(t);
      keys.forEach(k => cur[k] = from[k] + (to[k]-from[k])*e);
      paint(r, cur);
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }
  paint(r, cur);
  return { steps: steps.map(s => ({ note:s.note, desc:s.desc })), go: go };
}

/* ================================================================== *
 * 1.  denovo — the conceptual jump: no primer.
 *
 * Every polymerase so far in this lecture could only EXTEND: it needed a
 * 3' hydroxyl that already existed.  An RNA polymerase does not.  That is
 * exactly why a promoter has to exist — with no primer to point at the
 * start, the start has to be written into the sequence itself.
 * ================================================================== */
const DXL = 250, DXR = 1330;
const A_NEW = 372, A_TMP = 430, PRIMER_END = 700;     /* lane A: DNA pol   */
const B_TOP = 720, B_BOT = 778;                       /* lane B: RNA pol   */
const B_RNA = 618, PROM_L = 520, PROM_R = 740, PLUS1 = 790;

function denovoMarkup(){
  return '<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.2">' +
      '<path d="'+strand(DXR, A_TMP, DXL, A_TMP)+'" stroke="'+INK+'"/>' +
      '<path d="'+strand(DXL, A_NEW, PRIMER_END, A_NEW)+'" stroke="'+INK+'"/>' +
      '<path d="M'+PRIMER_END+' 344V364" stroke="'+SLATE+'" stroke-width="2.8"/>' +
      '<path d="'+strand(DXL, B_TOP, DXR, B_TOP)+'" stroke="'+INK+'"/>' +
      '<path d="'+strand(DXR, B_BOT, DXL, B_BOT)+'" stroke="'+INK+'"/>' +
      /* the promoter bracket and the +1 tick arrive together, on click 2 */
      '<g data-r="ans" opacity="0">' +
        '<path d="M'+PROM_L+' 700V690H'+PROM_R+'v10" stroke="'+SLATE+'" stroke-width="2.8"/>' +
        '<path d="M'+PLUS1+' 700V684" stroke="'+RED+'" stroke-width="3"/>' +
        '<path data-r="brna" d="" stroke="'+SLATE+'" stroke-width="3.2"/>' +
      '</g>' +
    '</g>' +
    '<g font-family="inherit" font-weight="700" font-size="27">' +
      '<text x="150" y="300" fill="'+INK+'">DNA polymerase</text>' +
      '<text x="150" y="600" fill="'+INK+'">RNA polymerase</text>' +
      '<text x="'+PRIMER_END+'" y="342" text-anchor="middle" fill="'+SLATE+'">a 3&#8242; end that already exists</text>' +
      '<g data-r="ans2" opacity="0">' +
        '<text x="'+((PROM_L+PROM_R)/2)+'" y="668" text-anchor="middle" fill="'+SLATE+'">promoter</text>' +
        '<text x="'+PLUS1+'" y="668" text-anchor="middle" fill="'+RED+'">+1</text>' +
        '<text data-r="rnalab" x="1000" y="586" text-anchor="middle" fill="'+SLATE+'">new RNA</text>' +
      '</g>' +
      '<text data-r="q" x="'+PLUS1+'" y="676" text-anchor="middle" font-size="46" fill="'+RED+'">?</text>' +
    '</g>' +
    chrome(258, 856);
}

function denovoPaint(r, s){
  r.q  .setAttribute("opacity", n2(s.q));
  r.ans .setAttribute("opacity", n2(s.ans));
  r.ans2.setAttribute("opacity", n2(s.ans));
  r.brna.setAttribute("d", rna(PLUS1, PLUS1 + 400*s.ans, B_RNA));
}

window.Deck.sequence("denovo", function(slide){
  const S = [
    { s:{q:1, ans:0}, label:"",
      call:"nothing to extend — so where does it start?", callFill:RED,
      note:"Hold on to what every enzyme in the last section had in common. A DNA polymerase can only extend. It needs a three prime hydroxyl that already exists, sitting on a template, and all it ever does is add to that end. It cannot start a chain. That is why PCR needs primers, why Kunkel needs an annealed oligo, why nick translation needs a nick. An RNA polymerase does none of that. Give it a bare duplex and it will start a chain from nothing.",
      desc:"Two lanes. On top, labelled DNA polymerase, a template strand with a shorter strand annealed to it, its three prime end marked as an end that already exists. Below, labelled RNA polymerase, a bare double-stranded DNA with no primer on it and a red question mark under it." },
    { s:{q:0, ans:1}, label:"",
      call:"so the start site is written into the DNA", callFill:SLATE,
      note:"And that is the whole reason a promoter has to exist. If there is no primer marking where to begin, then the beginning has to be spelled out in the sequence itself. The promoter is an address. The polymerase reads it, counts off a fixed distance, and starts there. Everything else about transcription follows from that one requirement.",
      desc:"The question mark is replaced by an answer: a stretch of the lower duplex is bracketed and labelled promoter, the next position is marked plus one, and a wavy line labelled new RNA grows to the right from that position with a half barb on its three prime end." }
  ];
  return driver(mount(slide, denovoMarkup()), ["q","ans"], S, denovoPaint);
});

/* ================================================================== *
 * 2.  t7prom — the promoter, at the level of letters.
 *
 * COPIED VERBATIM FROM linear.js ("t7rnap") — do not "fix" any of this:
 *
 *   The T7 consensus is quoted on the NON-TEMPLATE (top) strand, because
 *   that is the strand the RNA matches.  It runs -17 to -1, and the very
 *   next base, a G, is +1:
 *
 *       TAATACGACTCACTATA GGGAGACCACAACGGTTTCCCTC
 *       -17            -1 +1
 *
 *   Only bases from +1 ON lift into the bubble.  Lifting -1 as well made
 *   the raised row read "A GGGAGA", so the A looked like the start site.
 * ------------------------------------------------------------------ */
const T7_TOP = "TAATACGACTCACTATA" + "GGGAGACCACAACGGTTTCCCTC";
const T7_BOT = T7_TOP.split("").map(c => ({A:"T",T:"A",G:"C",C:"G"})[c]).join("");
const P1 = 17;                        /* index of +1 */
const SX = 150, SSTEP = 34, HC = SSTEP/2;
const sx = i => SX + i*SSTEP;
const YT = 480, YB = 535;             /* the two base rows, closed          */
const BBT = 452, BBB = 562;           /* the two backbones, closed          */
const LIFT = 96, DROP = 96;           /* how far each strand pulls open     */
const RNAY = 600;                     /* the RNA's own row, inside the bubble */
const AXL = 118, AXR = sx(T7_TOP.length-1) + 30;
/* The transcript, as letters. U for T, because it is RNA. */
const T7_RNA = T7_TOP.slice(P1).replace(/T/g, "U");

/* ---- the bubble ---------------------------------------------------- *
 * A backbone that ARCHES rather than a hole where letters used to be.
 * Each strand's backbone runs the whole width of the drawing and lifts
 * (or drops) over the open region, carrying its own bases with it, so
 * nothing anywhere on this slide reads as a break in the DNA.           */
function bbPath(y0, yo, xL, xR){
  if (Math.abs(yo - y0) < 0.4 || xR - xL < SSTEP)
    return "M" + AXL + " " + n2(y0) + "H" + AXR;
  const a = xL - HC, b = xL + HC, c = xR - HC, d = xR + HC;
  return "M" + AXL + " " + n2(y0) + "H" + n2(a) +
    "C" + n2(a+13) + " " + n2(y0) + " " + n2(b-13) + " " + n2(yo) + " " + n2(b) + " " + n2(yo) +
    "H" + n2(c) +
    "C" + n2(c+13) + " " + n2(yo) + " " + n2(d-13) + " " + n2(y0) + " " + n2(d) + " " + n2(y0) +
    "H" + AXR;
}

function t7Markup(){
  let g = '<g fill="none" stroke="' + INK + '" stroke-width="3" ' +
          'stroke-linecap="round" stroke-linejoin="round">' +
          '<path data-r="bbt"/><path data-r="bbb"/></g>';

  g += '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ' +
       'font-size="25" font-weight="600" text-anchor="middle">';
  for (let i = 0; i < T7_TOP.length; i++)
    g += '<text data-r="t'+i+'" x="'+sx(i)+'" y="'+(YT+9)+'" fill="'+INK+'">'+T7_TOP[i]+'</text>';
  for (let i = 0; i < T7_BOT.length; i++)
    g += '<text data-r="b'+i+'" x="'+sx(i)+'" y="'+(YB+9)+'" fill="'+INK+'">'+T7_BOT[i]+'</text>';
  g += '</g>';
  /* Antiparallel: top strand 5'->3' left to right, template 3'->5'. */
  g += '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="23" ' +
         'fill="' + INK + '">' +
    '<text x="' + (sx(0)-46) + '" y="' + (YT+9) + '">5&#8242;</text>' +
    '<text x="' + (sx(T7_TOP.length-1)+26) + '" y="' + (YT+9) + '">3&#8242;</text>' +
    '<text x="' + (sx(0)-46) + '" y="' + (YB+9) + '">3&#8242;</text>' +
    '<text x="' + (sx(T7_BOT.length-1)+26) + '" y="' + (YB+9) + '">5&#8242;</text>' +
  '</g>';
  g += '<g data-r="prom" opacity="0">' +
    '<path fill="none" stroke="' + SLATE + '" stroke-width="2.8" stroke-linecap="round" ' +
      'd="M' + (sx(0)-15) + ' ' + (BBT-12) + 'v-14H' + (sx(P1-1)+15) + 'v14"/>' +
    '<text x="' + ((sx(0)+sx(P1-1))/2) + '" y="' + (BBT-42) + '" text-anchor="middle" ' +
      'font-family="inherit" font-weight="700" font-size="26" fill="' + SLATE + '">' +
      'recognition element &#8212; stays duplex</text>' +
  '</g>';
  /* the +1 marker rides the top backbone, so it never collides with it */
  g += '<g data-r="plus1" opacity="0">' +
    '<path data-r="p1tick" fill="none" stroke="' + RED + '" stroke-width="3"/>' +
    '<text data-r="p1lab" x="' + sx(P1) + '" text-anchor="middle" ' +
      'font-family="inherit" font-weight="700" font-size="26" fill="' + RED + '">+1</text>' +
  '</g>';

  /* ---- the transcript, as LETTERS ---------------------------------- *
   * A letter cannot be drawn wavy, so the wave convention cannot carry
   * RNA here.  Two other cues do it instead: the letters are SLATE where
   * every DNA base on the slide is ink, and they are bracketed and named
   * "new RNA" in the same idiom this slide already uses for the
   * recognition element.  Position does the rest — the row sits against
   * the template strand, not the top one.                               */
  g += '<g data-r="rnag" opacity="0">' +
    '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="25" ' +
      'font-weight="600" text-anchor="middle" fill="' + SLATE + '">';
  for (let i = 0; i < T7_RNA.length; i++)
    g += '<text data-r="r'+i+'" x="'+sx(P1+i)+'" y="'+RNAY+'" opacity="0">'+T7_RNA[i]+'</text>';
  g += '</g>' +
    '<path data-r="rbarb" fill="none" stroke="' + SLATE + '" stroke-width="3.2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path data-r="rbrk" fill="none" stroke="' + SLATE + '" stroke-width="2.8" ' +
      'stroke-linecap="round"/>' +
    '<text data-r="rlab" y="' + (RNAY-70) + '" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="26" fill="' + SLATE + '">' +
      'new RNA, 5&#8242;&#8594;3&#8242;</text>' +
  '</g>';
  return g + chrome(250, 856);
}

function t7Paint(r, s){
  /* bstart is where the bubble's LEFT edge sits. It starts at +1 and later
     travels right at a CONSTANT width, which is the one thing about a
     transcription bubble worth carrying away: it does not grow, it moves. */
  const lo = Math.round(s.bstart == null ? P1 : s.bstart);
  const openN = Math.max(1, Math.round(s.open));
  const hi = lo + openN - 1;
  const xL = sx(lo) - HC, xR = Math.max(xL + SSTEP, sx(lo) + (s.open - 0.5)*SSTEP);
  const yTop = BBT - LIFT*s.bub, yBot = BBB + DROP*s.bub;
  /* once the transcript is long enough to run under the closed duplex it
     drops to a row of its own, or its bracket and label sit on the DNA */
  const ry = RNAY + 112*(s.rlow || 0);

  r.bbt.setAttribute("d", bbPath(BBT, yTop, xL, xR));
  r.bbb.setAttribute("d", bbPath(BBB, yBot, xL, xR));

  for (let i = 0; i < T7_TOP.length; i++){
    const open = (i >= lo && i <= hi);
    r["t"+i].setAttribute("y", n2((YT + 9) - (open ? LIFT*s.bub : 0)));
    r["b"+i].setAttribute("y", n2((YB + 9) + (open ? DROP*s.bub : 0)));
  }

  r.prom  .setAttribute("opacity", n2(s.prom));
  /* the +1 marker rides whichever backbone height its own base is at, so
     it does not float when the bubble has travelled away from it */
  const p1y = (P1 >= lo && P1 <= hi) ? yTop : BBT;
  r.plus1 .setAttribute("opacity", (s.prom > 0.02 || s.bub > 0.02) ? "1" : "0");
  r.p1tick.setAttribute("d", "M" + sx(P1) + " " + n2(p1y-16) + "V" + n2(p1y-36));
  r.p1lab .setAttribute("y", n2(p1y - 44));

  /* the RNA row: letters appear one at a time, 5' anchored at +1 */
  const nInt = Math.max(1, Math.ceil(s.nrna));
  r.rnag.setAttribute("opacity", n2(clamp01(s.nrna)));
  for (let i = 0; i < T7_RNA.length; i++)
    r["r"+i].setAttribute("opacity", n2(clamp01(s.nrna - i)));
  const tail = sx(P1 + nInt - 1);
  for (let i = 0; i < T7_RNA.length; i++) r["r"+i].setAttribute("y", n2(ry));
  /* a short barb at full extension: the transcript already reaches the
     last base, and a long one would run off the edge of the slide */
  const bl = tail + 44 > AXR ? 30 : 44;
  r.rbarb.setAttribute("d", s.nrna > 0.5
    ? strand(tail+bl-28, ry-9, tail+bl, ry-9) : "");
  r.rbrk .setAttribute("d", "M" + n2(sx(P1)-HC) + " " + n2(ry-32) +
                            "v-12H" + n2(tail+HC) + "v12");
  /* Centred, the label lands in the middle of the transcript -- which is
     fine while it is short, and lands on the bubble's dropped bases once
     it is long. Past a dozen letters it goes to the left end instead. */
  const wide = nInt > 12;
  r.rlab .setAttribute("text-anchor", wide ? "start" : "middle");
  r.rlab .setAttribute("x", n2(wide ? sx(P1) - HC : (sx(P1) - HC + tail + HC)/2));
  r.rlab .setAttribute("y", n2(ry-70));
}

window.Deck.sequence("t7prom", function(slide){
  /* Three clicks, not five. The two that went were beats without content:
     opening the bubble with no RNA in it, and closing it again after the
     transcript was already finished. Each of the three left says
     something the previous picture did not. */
  const S = [
    { s:{prom:1,bub:0,open:1,nrna:0,bstart:P1,rlow:0}, label:"The address, spelled out",
      note:"Here is that address. The T7 promoter is seventeen bases, TAATACGACTCACTATA, and it is quoted on the non-template strand, the top one, because that is the strand the RNA will match. The polymerase does not start inside the promoter. It starts at the very next base, the G marked plus one. So the promoter is not the start of the transcript. It is the sign that tells you where the start is.",
      desc:"A double-stranded DNA written out as forty paired bases between two backbone lines. The first seventeen, TAATACGACTCACTATA, are bracketed on the top strand and labelled the recognition element, which stays duplex. A red marker labels the very next base, the G at plus one." },
    { s:{prom:1,bub:1,open:8,nrna:6,bstart:P1,rlow:0}, label:"It opens, and it starts",
      call:"built on the bottom strand — so it comes out matching the top", callFill:SLATE,
      note:"The polymerase clamps onto that seventeen-base element and melts the DNA just downstream of it. Notice which part opens: the recognition element itself stays double stranded, because that is what the enzyme is gripping. Only from plus one onward does it come apart, and that opening is the transcription bubble. Nothing has been cut — both backbones run unbroken all the way across, they have simply come apart from one another. Then it puts a nucleotide on that G and extends, with no primer, because it brought the first two nucleotides together itself. Be clear about which strand it is copying. The new chain is built along the BOTTOM strand, the template, which is why it sits down there against it — and because it is complementary to the bottom strand it comes out reading the same as the top strand, which is exactly why we quote a promoter on the top strand in the first place. The one substitution is U wherever the top strand says T.",
      desc:"The two strands separate from plus one onward, the top strand and its bases arching upward and the bottom strand and its bases downward, with both backbone lines running unbroken through the opening. The bracketed recognition element stays paired. Inside the bubble a new chain of six letters, G G G A G A, sits in a row of its own against the bottom strand, bracketed and labelled new RNA running five prime to three prime." },
    { s:{prom:0,bub:0,open:8,nrna:T7_RNA.length,bstart:31,rlow:1}, label:"It runs off the end",
      call:"the bubble never grew — it travelled", callFill:SLATE,
      note:"Now let it run, and watch the bubble rather than the transcript. It is the same size the whole way: about eight base pairs, melting at its leading edge and snapping shut behind. It travels rather than grows, and it has to, because unwinding a whole gene would cost far more than the enzyme has. What accumulates is the transcript, peeled off the template as the duplex closes behind, which is why it ends up lying free underneath rather than paired to anything. Then the polymerase reaches the end of the DNA and simply falls off it. The duplex closes completely, so the DNA is exactly as it was — nothing consumed, nothing cut — and the enzyme goes back and does it again. One template, many transcripts, which is why in vitro transcription gives you so much material.",
      desc:"The bubble has travelled to the far end of the DNA at the same width and then closed, leaving a complete unbroken duplex. The full transcript lies free below it, running from plus one to the last base, its five prime end at plus one and a half barb on its three prime end." }
  ];
  return driver(mount(slide, t7Markup()), ["prom","bub","open","nrna","bstart","rlow"], S, t7Paint);
});

/* ================================================================== *
 * 4.  ivt — what in vitro transcription actually is, at the bench.
 *
 * The molecular story is already told: the promoter slide runs a
 * transcript off the end and releases it. Drawing that again with a
 * different gene in it says nothing new, which is what was wrong with
 * the two versions of this slide before it.
 *
 * So this one is a TUBE, not a molecule. Three things only it can say:
 *   - what "in vitro" means here: no cell, you supply everything
 *   - what run-off costs you: the template's end IS the RNA's end, so
 *     the template must be linear and must stop where the RNA should
 *   - why anyone buys the enzyme: the output is absurd, and the
 *     products are ones they have heard of
 *
 * Deliberately cartoon-like. Every other picture in this section is a
 * molecule at some level of abstraction; this one is a bench, and it
 * should not be mistakable for the slide before it.
 * ================================================================== */
const TUX0 = 150, TUX1 = 690, TUY0 = 268, TUY1 = 636;   /* the tube        */
const IVR = [352, 432, 512, 580];                        /* ingredient rows */
const OUTX = 900, OUTX1 = 1430;                          /* the product fan */

function tube(){
  const capH = 40, r = 26;
  return '<g fill="none" stroke="'+INK+'" stroke-width="3.4" stroke-linejoin="round">' +
    '<rect x="'+TUX0+'" y="'+TUY0+'" width="'+(TUX1-TUX0)+'" height="'+capH+'" rx="9"/>' +
    '<path d="M'+(TUX0+14)+' '+(TUY0+capH)+'V'+(TUY1-r)+'Q'+(TUX0+14)+' '+TUY1+' '+
      (TUX0+14+r)+' '+TUY1+'H'+(TUX1-14-r)+'Q'+(TUX1-14)+' '+TUY1+' '+(TUX1-14)+' '+
      (TUY1-r)+'V'+(TUY0+capH)+'"/></g>';
}

function ivtMarkup(){
  const ix = TUX0 + 66, lx = TUX0 + 168;
  let g = tube();
  g += '<text x="'+((TUX0+TUX1)/2)+'" y="'+(TUY0-26)+'" text-anchor="middle" '+
       'font-family="inherit" font-size="24" font-weight="700" fill="'+MUTED+
       '">one 20 &#181;L reaction</text>';

  /* 1 — the template. Its right-hand end is the whole of run-off, so it
     is drawn with a hard stop and said out loud. */
  g += '<g data-r="i0" opacity="0">' +
    '<path d="M'+(ix-44)+' '+(IVR[0]-7)+'H'+(ix+44)+'M'+(ix-44)+' '+(IVR[0]+7)+'H'+(ix+44)+
      '" fill="none" stroke="'+INK+'" stroke-width="3"/>' +
    '<path d="M'+(ix-44)+' '+IVR[0]+'H'+(ix-10)+'" stroke="'+SLATE+'" stroke-width="9" '+
      'opacity="0.35" fill="none"/>' +
    '<path d="M'+(ix+44)+' '+(IVR[0]-16)+'V'+(IVR[0]+16)+'" stroke="'+RED+
      '" stroke-width="3" fill="none"/>' +
    '<text x="'+lx+'" y="'+(IVR[0]-2)+'" font-family="inherit" font-size="23" '+
      'font-weight="700" fill="'+INK+'">a <tspan fill="'+RED+'">linear</tspan> template</text>' +
    '<text x="'+lx+'" y="'+(IVR[0]+28)+'" font-family="inherit" font-size="20" fill="'+MUTED+
      '">T7 promoter, then your sequence</text></g>';

  /* 2 — the enzyme */
  g += '<g data-r="i1" opacity="0">' +
    '<ellipse cx="'+ix+'" cy="'+IVR[1]+'" rx="40" ry="27" fill="'+SLATE+'" fill-opacity="0.16" '+
      'stroke="'+SLATE+'" stroke-width="3"/>' +
    '<text x="'+lx+'" y="'+(IVR[1]+8)+'" font-family="inherit" font-size="23" '+
      'font-weight="700" fill="'+INK+'">T7 RNA polymerase</text></g>';

  /* 3 — the nucleotides */
  g += '<g data-r="i2" opacity="0">';
  ["A","U","G","C"].forEach(function(b,k){
    const cx = ix - 48 + k*32;
    g += '<circle cx="'+cx+'" cy="'+IVR[2]+'" r="14" fill="none" stroke="'+INK+
         '" stroke-width="2.6"/>' +
         '<text x="'+cx+'" y="'+(IVR[2]+7)+'" text-anchor="middle" font-family="inherit" '+
         'font-size="17" font-weight="700" fill="'+INK+'">'+b+'</text>';
  });
  g += '<text x="'+lx+'" y="'+(IVR[2]-2)+'" font-family="inherit" font-size="23" '+
      'font-weight="700" fill="'+INK+'">the four NTPs</text>' +
    '<text x="'+lx+'" y="'+(IVR[2]+28)+'" font-family="inherit" font-size="20" fill="'+MUTED+
      '">ribo, not deoxy &#8212; and U for T</text></g>';

  /* 4 — the buffer */
  g += '<g data-r="i3" opacity="0">' +
    '<text x="'+ix+'" y="'+(IVR[3]+9)+'" text-anchor="middle" font-family="inherit" '+
      'font-size="25" font-weight="700" fill="'+INK+'">Mg<tspan font-size="17" dy="-8">2+</tspan></text>' +
    '<text x="'+lx+'" y="'+(IVR[3]+8)+'" font-family="inherit" font-size="23" '+
      'font-weight="700" fill="'+INK+'">buffer &#8212; and nothing else</text></g>';

  /* the incubation, and what comes out of it */
  g += '<g data-r="out" opacity="0">' +
    '<path d="M740 452H846" fill="none" stroke="'+INK+'" stroke-width="3.4"/>' +
    '<path d="M824 438L846 452L824 466" fill="none" stroke="'+INK+'" stroke-width="3.4" '+
      'stroke-linejoin="round" stroke-linecap="round"/>' +
    '<text x="793" y="424" text-anchor="middle" font-family="inherit" font-size="21" '+
      'font-weight="700" fill="'+MUTED+'">37&#176;C</text>' +
    '<text x="793" y="492" text-anchor="middle" font-family="inherit" font-size="21" '+
      'fill="'+MUTED+'">2 h</text>';
  for (let k = 0; k < 9; k++)
    g += '<path d="'+rna(OUTX, OUTX1, 292 + k*40)+'" fill="none" stroke="'+SLATE+
         '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
  g += '<text x="'+((OUTX+OUTX1)/2)+'" y="700" text-anchor="middle" font-family="inherit" '+
      'font-size="24" font-weight="700" fill="'+SLATE+'">tens of micrograms of one RNA</text>' +
    '<text x="'+((OUTX+OUTX1)/2)+'" y="736" text-anchor="middle" font-family="inherit" '+
      'font-size="21" fill="'+MUTED+'">every copy ending at the same base</text></g>';
  return g + chrome(226, 812);
}

function ivtPaint(r, s){
  for (let k = 0; k < 4; k++) r["i"+k].setAttribute("opacity", n2(clamp01(s.mix - k*0.001)));
  r.out.setAttribute("opacity", n2(clamp01(s.out)));
}

window.Deck.sequence("ivt", function(slide){
  const S = [
    { s:{mix:1,out:0}, label:"In vitro means exactly what it says",
      note:"Everything so far in this section has been a molecule. This slide is a tube, because in vitro transcription is a reaction you set up, and it is worth being concrete about what that means. There is no cell here. No transcription factors, no chromatin, no nucleus, nothing regulating anything. You supply the whole system, and it is a short list. A template — and note the word linear, because this is the one place run-off costs you something. The polymerase stops when it falls off the end of the DNA, so whatever base is last on your template is the last base of your RNA. If your template is a plasmid, you cut it first, and you cut it exactly where you want the RNA to end. T7 RNA polymerase, which is one polypeptide and needs no accessory factors at all — that is why this works in a tube and the E. coli enzyme would be a nightmare. The four NTPs, ribonucleotides this time, with U where you would have put T. And magnesium, because every phosphoryl transfer in this lecture has needed it. That is the entire reaction.",
      desc:"A cartoon reaction tube labelled one 20 microlitre reaction, containing four ingredients drawn and named: a linear double-stranded template with a T7 promoter at its left end and a hard red stop at its right, T7 RNA polymerase drawn as a single blue blob, the four NTPs drawn as circles marked A, U, G and C, and magnesium buffer." },
    { s:{mix:1,out:1}, label:"Two hours later",
      call:"guide RNAs, probes, ribozymes \u2014 and every mRNA vaccine ever made"  /* call is textContent */, callFill:SLATE,
      note:"Two hours at thirty-seven degrees and you have tens of micrograms of RNA from a few hundred nanograms of DNA. That is the thing to take away, and it is why anyone buys this enzyme. One template gets read over and over — the DNA is not consumed, remember, the duplex closes behind the bubble every time — so a small amount of template turns into an enormous number of transcripts. And because every one of them ran off the same end of the same linear template, they are all the same length, ending at the same base. That is what run-off buys you: not just a lot of RNA, but a lot of one defined RNA. Afterwards you usually add DNase to destroy the template, since it is the only DNA left in the tube and it is easy to remove. What is this actually for? Guide RNAs for CRISPR, which we will come to. Probes. Ribozymes. RNA for structural work. And every messenger RNA vaccine that has ever been made, which is this reaction, run in a very large tube.",
      desc:"An arrow labelled 37 degrees and 2 hours leads from the tube to the product: nine identical wavy RNA strands, all the same length, labelled tens of micrograms of one RNA, every copy ending at the same base. A line reads: guide RNAs, probes, ribozymes, and every mRNA vaccine ever made." }
  ];
  return driver(mount(slide, ivtMarkup()), ["mix","out"], S, ivtPaint);
});

/* ================================================================== *
 * 5.  vaccine — the application vignette, like the forensics one.
 *
 * Worth its own slide because the answer is counter-intuitive: an mRNA
 * vaccine is not chemically synthesised. BNT162b2 is about 4300 bases
 * and solid-phase RNA synthesis runs out somewhere around a hundred, so
 * a molecule that size can only be made enzymatically. It is this
 * reaction, run large, from a plasmid cut once with a restriction
 * enzyme -- which makes it a vignette that uses half of this lecture.
 *
 * The chemistry IS there, and it is worth being precise about where:
 * in the nucleotides, not in the backbone. Every uridine is replaced
 * with N1-methylpseudouridine, fed in as a modified NTP the polymerase
 * incorporates without complaint.
 *
 * Panel 2 deliberately does NOT re-list template, polymerase, NTPs and
 * magnesium -- the previous slide just did that. It shows only what is
 * DIFFERENT about this reaction.
 * ================================================================== */
const VY = 430;                                     /* the flow's axis     */
const VA = 300, VB = 800, VC = 1270;                /* three station centres */

const vlab = (x, y, t, c, sz, w) => '<text x="'+x+'" y="'+y+'" text-anchor="middle" '+
  'font-family="inherit" font-size="'+(sz||21)+'" font-weight="'+(w||700)+'" fill="'+
  (c||INK)+'">'+t+'</text>';
const vstep = (x, t) => vlab(x, 258, t, MUTED, 22, 700);
function varrow(x0, x1, y){
  return '<path d="M'+x0+' '+y+'H'+x1+'M'+(x1-18)+' '+(y-12)+'L'+x1+' '+y+'L'+(x1-18)+' '+
    (y+12)+'" fill="none" stroke="'+MUTED+'" stroke-width="3" stroke-linecap="round" '+
    'stroke-linejoin="round"/>';
}

function vacMarkup(){
  let g = "";

  /* --- 1. the template: a plasmid, cut once ------------------- */
  g += '<g data-r="v0" opacity="0">' + vstep(VA, "1 &#183; the template") +
    '<circle cx="'+VA+'" cy="352" r="56" fill="none" stroke="'+INK+'" stroke-width="3"/>' +
    '<path d="M'+(VA-26)+' 300A56 56 0 0 1 '+(VA+30)+' 299" fill="none" stroke="'+SLATE+
      '" stroke-width="9" stroke-linecap="round" opacity="0.45"/>' +
    vlab(VA, 282, "T7", SLATE, 19) +
    /* the second line does not fit inside the circle, so it goes under it */
    vlab(VA, 360, "plasmid", MUTED, 19, 600) +
    vlab(VA, 440, "from <tspan font-style="+'"italic"'+">E. coli</tspan>", MUTED, 19, 600) +
    /* cut once, and the cut is the end of every dose */
    '<path d="M'+(VA+56)+' 400L'+(VA+86)+' 430" fill="none" stroke="'+RED+'" stroke-width="3"/>' +
    vlab(VA+128, 412, "cut once", RED, 20) +
    '<g fill="none" stroke="'+INK+'" stroke-width="3">' +
      '<path d="M'+(VA-120)+' 494H'+(VA+120)+'"/><path d="M'+(VA-120)+' 516H'+(VA+120)+'"/></g>' +
    '<path d="M'+(VA-120)+' 505H'+(VA-64)+'" stroke="'+SLATE+'" stroke-width="9" '+
      'stroke-linecap="round" fill="none" opacity="0.35"/>' +
    '<path d="M'+(VA+120)+' 486V524" stroke="'+RED+'" stroke-width="3" fill="none"/>' +
    vlab(VA, 566, "linear &#8212; and the cut end is the end", RED, 19) +
    vlab(VA, 590, "of every mRNA in the batch", RED, 19) + '</g>';

  /* --- 2. the reaction: someone sets it up ------------------- */
  g += '<g data-r="v1" opacity="0">' + varrow(VA+206, VA+286, VY) +
    vstep(VB, "2 &#183; someone sets it up") +
    /* a person at a bench, in line art: this is a reaction, not a
       phenomenon, and somebody pipettes it */
    '<g fill="none" stroke="'+INK+'" stroke-width="3" stroke-linecap="round" '+
      'stroke-linejoin="round">' +
      '<circle cx="666" cy="322" r="21"/>' +
      '<path d="M666 343V430"/>' +
      '<path d="M666 366L722 350L778 322"/>' +
      '<path d="M666 366L628 412"/>' +
      '<path d="M666 430L640 502M666 430L692 502"/>' +
      /* the pipette, tip over the open tube */
      '<path d="M770 306L800 288L830 336L806 352Z" stroke-width="3"/>' +
      '<path d="M818 352L836 380" stroke-width="3"/>' +
    '</g>' +
    /* the tube */
    '<g fill="none" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round">' +
      '<rect x="812" y="392" width="86" height="26" rx="6"/>' +
      '<path d="M822 418V492Q822 520 855 520Q888 520 888 492V418"/></g>' +
    vlab(855, 560, "one tube, 37&#176;C", MUTED, 20) +
    vlab(800, 596, "&#8212; and one changed base", RED, 21) + '</g>';

  /* --- 3. the product ---------------------------------------- */
  g += '<g data-r="v2" opacity="0">' + varrow(VB+206, VB+286, VY) +
    vstep(VC, "3 &#183; the product") +
    '<path d="'+rna(VC-170, VC+118, 336)+'" fill="none" stroke="'+SLATE+'" stroke-width="3" '+
      'stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="'+(VC-186)+'" cy="336" r="11" fill="none" stroke="'+SLATE+'" stroke-width="2.6"/>' +
    '<path d="M'+(VC+120)+' 336H'+(VC+164)+'" stroke="'+SLATE+'" stroke-width="2.6" '+
      'stroke-dasharray="5 6" fill="none"/>' +
    vlab(VC, 300, "~4300 bases, capped and tailed", MUTED, 19, 600) +
    /* the lipid nanoparticle */
    '<circle cx="'+VC+'" cy="470" r="66" fill="'+SLATE+'" fill-opacity="0.10" stroke="'+SLATE+
      '" stroke-width="3" stroke-dasharray="7 7"/>' +
    '<path d="'+rna(VC-40, VC+40, 470)+'" fill="none" stroke="'+SLATE+'" stroke-width="2.6" '+
      'stroke-linecap="round"/>' +
    vlab(VC, 566, "wrapped in a lipid nanoparticle", MUTED, 19, 600) +
    vlab(VC, 604, "&#8212; and that is the dose", INK, 21) + '</g>';

  return g + chrome(214, 838);
}

function vacPaint(r, s){
  for (let k = 0; k < 3; k++)
    r["v"+k].setAttribute("opacity", n2(clamp01(s.on - k)));
}

window.Deck.sequence("vaccine", function(slide){
  const S = [
    { s:{on:1}, label:"You cannot chemically synthesise four thousand bases",
      note:"An application, and it is one where the answer surprises people. An mRNA vaccine is about four thousand three hundred bases of RNA. Ask how that gets made and the instinct is chemical synthesis, because that is how you buy an oligo — and it is the wrong answer. Solid-phase RNA synthesis runs out somewhere around a hundred bases; the yield falls off a cliff and the failure products pile up. Four thousand is not reachable that way, and it never will be. So it is made enzymatically, by the reaction on the last slide, run large. Start here. The sequence lives on a plasmid, grown in E. coli, with a T7 promoter in front of it. And before it goes anywhere near the polymerase you cut that plasmid once, with a restriction enzyme, downstream of the sequence. You know exactly why: run-off. The polymerase has no terminator, so it stops where the DNA stops, and that means the position of that cut is the three prime end of every single molecule in the batch. A restriction enzyme from the first section of this lecture is defining the end of a pharmaceutical.",
      desc:"Station one of a three-station flow: a circular plasmid grown in E. coli carrying a T7 promoter, cut once with a restriction enzyme to give a linear template whose right-hand end is marked in red, labelled: linear, and the cut end is the end of every mRNA in the batch." },
    { s:{on:2}, label:"Someone sets it up",
      note:"Then it is the reaction you just saw — template, T7 RNA polymerase, nucleotides, magnesium — and I am not going to list it again. Somebody pipettes it into a tube and puts the tube at thirty-seven degrees. That is genuinely all this step is, and it is worth saying plainly, because the manufacturing scale of this is a very large version of exactly that. Two things about the tube are different from an ordinary transcription. A cap goes on the five prime end, either as an analogue the polymerase starts on or added afterwards with an enzyme, because a eukaryotic ribosome will not touch an uncapped message. And one of the four nucleotides is not the one you would expect. That second one is worth its own slide, and it is the next one.",
      desc:"Station two, drawn as line art: a person at a bench pipetting into an open tube, labelled one tube at 37 degrees, and a red line reading: and one changed base." },
    { s:{on:3}, label:"And that is the dose",
      call:"a restriction enzyme, a phage polymerase, and one modified base", callFill:SLATE,
      note:"Out comes about four thousand three hundred bases of capped, tailed, modified messenger RNA, every copy ending at the same base because every copy ran off the same cut. Then it gets wrapped in a lipid nanoparticle, because naked RNA in a bloodstream lasts seconds and cannot cross a membrane anyway, and that is the dose. Stand back and look at what that took. A restriction enzyme to define one end. A phage RNA polymerase that needs no accessory factors and will work in a tube. One modified nucleotide. Everything in that list is in this lecture, and most of it is in the NEB catalogue. The scale is industrial and the chemistry is not.",
      desc:"Station three: the finished messenger RNA drawn as a long wave with a cap at its five prime end and a poly-A tail at its three prime end, about 4300 bases, then the same RNA drawn coiled inside a dashed circle representing a lipid nanoparticle, labelled: and that is the dose." }
  ];
  return driver(mount(slide, vacMarkup()), ["on"], S, vacPaint);
});

/* ================================================================== *
 * 5b. modbase — the one changed base, drawn properly.
 *
 * Uracil attached to the sugar through N1 is uridine. The SAME uracil
 * attached through C5 is pseudouridine -- a carbon-carbon bond where
 * there was a carbon-nitrogen one -- which leaves N1 free, and m1-psi
 * is that with a methyl on it. So the ring is identical in both panels
 * and only two things differ: which atom the sugar hangs off, and what
 * is on N1. Drawing them on the same hexagon, in the same orientation,
 * with the attachment atom in the same place, is what makes that
 * legible; anything else and it reads as two different molecules.
 *
 * Ring order is N1-C2-N3-C4-C5-C6. Vertices are named clockwise from
 * the attachment vertex at the bottom, which is why the labels differ
 * between panels while the geometry does not.
 * ================================================================== */
const MB_R = 52, MB_YR = 376, MB_YS = 550;   /* ring radius, ring y, sugar y */
const MB_L = 430, MB_RX = 1010;              /* the two panel centres        */

/* Hexagon vertices, clockwise ON SCREEN from the bottom -- which is the
   attachment vertex in both panels. SVG y grows downward, so 90 degrees
   is the bottom and the list runs 6, 8, 10, 12, 2, 4 o'clock. */
function hexv(cx, cy){
  return [90, 150, 210, 270, 330, 30].map(function(d){
    const a = d*Math.PI/180;
    return [cx + MB_R*Math.cos(a), cy + MB_R*Math.sin(a)];
  });
}
function mbBond(a, b, c, w){
  return '<path d="M'+n2(a[0])+' '+n2(a[1])+'L'+n2(b[0])+' '+n2(b[1])+'" fill="none" stroke="'+
         (c||INK)+'" stroke-width="'+(w||2.8)+'" stroke-linecap="round"/>';
}
function mbDouble(a, b, c){
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1, px=-dy/L*4, py=dx/L*4;
  return mbBond([a[0]+px,a[1]+py],[b[0]+px,b[1]+py],c) +
         mbBond([a[0]-px,a[1]-py],[b[0]-px,b[1]-py],c);
}
function mbLab(p, t, c, sz){
  const z = sz || 21;
  return '<circle cx="'+n2(p[0])+'" cy="'+n2(p[1])+'" r="'+n2(z*0.72)+'" fill="#fff"/>' +
    '<text x="'+n2(p[0])+'" y="'+n2(p[1]+z*0.35)+'" text-anchor="middle" font-family="inherit" '+
    'font-size="'+z+'" font-weight="700" fill="'+(c||INK)+'">'+t+'</text>';
}
const mbOut = (from, to, d) => [from[0]+(from[0]-to[0])*d, from[1]+(from[1]-to[1])*d];

/* names[i] is the atom at vertex i, clockwise from the attachment vertex.
   SKELETAL, like every other structure in this deck: carbons are implicit
   and unlabelled. Only the nitrogens are named, plus the attachment atom,
   which is the whole comparison -- in UTP the sugar hangs off a labelled
   N, in m1-psi it hangs off a bare carbon vertex and the N has moved. */
function base(cx, names, methyl){
  const v = hexv(cx, MB_YR), C = [cx, MB_YR];
  let g = "";
  for (let i = 0; i < 6; i++) g += mbBond(v[i], v[(i+1)%6]);
  for (let i = 0; i < 6; i++){
    const a = names[i], b = names[(i+1)%6];
    if ((a==="C5"&&b==="C6") || (a==="C6"&&b==="C5")) g += mbDouble(v[i], v[(i+1)%6]);
  }
  ["C2","C4"].forEach(function(nm){
    const i = names.indexOf(nm), o = mbOut(v[i], C, 0.60);
    g += mbDouble(v[i], o) + mbLab(o, "O");
  });
  const i3 = names.indexOf("N3"), o3 = mbOut(v[i3], C, 0.58);
  g += mbBond(v[i3], o3) + mbLab(o3, "NH");

  const i1 = names.indexOf("N1");
  if (methyl){
    /* N1 is free now, and carries the methyl: both drawn in red */
    const o1 = mbOut(v[i1], C, 0.58);
    g += mbLab(v[i1], "N", RED, 20) + mbBond(v[i1], o1, RED, 3.4) +
         mbLab(mbOut(v[i1], C, 0.98), "CH&#8323;", RED, 20);
    /* and the sugar is on a carbon, which has to be said out loud
       because a bare vertex says nothing by itself */
    g += mbLab([v[0][0]-30, v[0][1]+2], "C5", RED, 19);
  } else {
    g += mbLab(v[i1], "N", INK, 20) + mbLab([v[0][0]-30, v[0][1]+2], "N1", RED, 19);
  }
  return g;
}

/* Ribose: O4' at the top, C1' at the right. It sits so that C1' is
   directly under the base's attachment vertex, which keeps the
   glycosidic bond vertical and short in BOTH panels -- the bond is the
   thing being compared, so it must not be a different shape on each
   side for reasons of layout. */
function sugar(cx, attach){
  const sx = cx - 52, y = MB_YS, w = 50;
  const O4 = [sx, y-34], C1 = [sx+w, y-2], C2 = [sx+w*0.62, y+46],
        C3 = [sx-w*0.62, y+46], C4 = [sx-w, y-2];
  let g = '<path d="M'+[O4,C1,C2,C3,C4].map(q=>n2(q[0])+" "+n2(q[1])).join("L")+
          'Z" fill="#f4f4f4" stroke="'+INK+'" stroke-width="2.8" stroke-linejoin="round"/>' +
          mbLab(O4, "O", INK, 18);
  g += mbBond(C4, [sx-w-38, y-30]) + mbLab([sx-w-70, y-40], "PPP", MUTED, 19);
  g += mbLab([C2[0], C2[1]+22], "OH", MUTED, 17) + mbLab([C3[0], C3[1]+22], "OH", MUTED, 17);
  g += mbBond(C1, attach, RED, 3.6);
  return g;
}

function mbPanel(cx, names, methyl, title, sub){
  const v = hexv(cx, MB_YR);
  return '<g>' + sugar(cx, v[0]) + base(cx, names, methyl) +
    '<text x="'+cx+'" y="232" text-anchor="middle" font-family="inherit" font-size="27" '+
      'font-weight="700" fill="'+INK+'">'+title+'</text>' +
    '<text x="'+cx+'" y="266" text-anchor="middle" font-family="inherit" font-size="21" '+
      'fill="'+MUTED+'">'+sub+'</text></g>';
}

function mbMarkup(){
  /* Ring order is N1-C2-N3-C4-C5-C6 in both; the arrays start at the
     vertex the sugar hangs off and walk that order clockwise. */
  let g = mbPanel(MB_L, ["N1","C2","N3","C4","C5","C6"], false,
                  "UTP", "sugar on N1 &#8212; a C&#8211;N bond");
  g += mbPanel(MB_RX, ["C5","C4","N3","C2","N1","C6"], true,
               "m&#185;&#936;TP", "sugar on C5 &#8212; a C&#8211;C bond, and N1 is free");
  g += '<text x="720" y="464" text-anchor="middle" font-family="inherit" font-size="34" '+
       'font-weight="700" fill="'+MUTED+'">vs</text>';

  /* the consequence, along the bottom */
  g += '<g data-r="cell" opacity="0">' +
    '<path d="M150 700H1450" fill="none" stroke="'+INK+'" stroke-width="1.6" '+
      'stroke-dasharray="8 9" opacity="0.4"/>' +
    '<circle cx="290" cy="782" r="34" fill="'+SLATE+'" fill-opacity="0.10" stroke="'+SLATE+
      '" stroke-width="2.6" stroke-dasharray="7 7"/>' +
    '<text x="290" y="838" text-anchor="middle" font-family="inherit" font-size="19" '+
      'fill="'+MUTED+'">the particle fuses</text>' +
    '<path d="M340 782H414M396 772L414 782L396 792" fill="none" stroke="'+MUTED+
      '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="'+rna(444, 640, 782)+'" fill="none" stroke="'+SLATE+'" stroke-width="2.8" '+
      'stroke-linecap="round"/>' +
    '<ellipse cx="600" cy="770" rx="34" ry="27" fill="'+INK+'" fill-opacity="0.10" stroke="'+
      INK+'" stroke-width="2.6"/>' +
    '<text x="546" y="838" text-anchor="middle" font-family="inherit" font-size="19" '+
      'fill="'+MUTED+'">a ribosome reads it</text>' +
    '<path d="M680 782H754M736 772L754 782L736 792" fill="none" stroke="'+MUTED+
      '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M790 796q18-34 40 0t40 0" fill="none" stroke="'+SLATE+'" stroke-width="3.4" '+
      'stroke-linecap="round"/>' +
    '<text x="830" y="838" text-anchor="middle" font-family="inherit" font-size="19" '+
      'fill="'+MUTED+'">antigen</text>' +
    '<text x="1180" y="762" text-anchor="middle" font-family="inherit" font-size="22" '+
      'font-weight="700" fill="'+RED+'">with plain U, none of this happens:</text>' +
    '<text x="1180" y="794" text-anchor="middle" font-family="inherit" font-size="22" '+
      'fill="'+MUTED+'">the cell reads the RNA as an infection</text>' +
    '<text x="1180" y="826" text-anchor="middle" font-family="inherit" font-size="22" '+
      'fill="'+MUTED+'">and destroys it before it is translated</text></g>';
  return g + chrome(190, 664);
}

function mbPaint(r, s){ r.cell.setAttribute("opacity", n2(clamp01(s.why))); }

window.Deck.sequence("modbase", function(slide){
  const S = [
    { s:{why:0}, label:"Same ring, different bond",
      note:"This is worth drawing properly, because the change is smaller than anyone expects. On the left, uridine: the uracil ring hanging off the sugar through nitrogen one. On the right, N1-methylpseudouridine. Look at the ring. It is the same ring — same atoms, same two carbonyls, same everything. Two things differ. First, the sugar is attached through carbon five instead of nitrogen one, so the bond holding the base on is a carbon-carbon bond rather than a carbon-nitrogen one. That is what pseudo means here: it is uracil, put on backwards. Second, because nitrogen one is no longer doing the attaching, it is free, and it carries a methyl group. That is the whole modification. The polymerase does not notice — you buy m1-psi-TP, you put it in the tube instead of UTP, and T7 incorporates it at every U position without being asked twice.",
      desc:"Two nucleotide structures side by side, drawn on identical hexagons. On the left, UTP: the uracil ring with its two carbonyl oxygens and an N-H, attached to a ribose through nitrogen one, with the triphosphate tagged off the 5-prime carbon. On the right, m1-psi-TP: the same ring in the same orientation, but attached to the ribose through carbon five in red, with nitrogen one now free and carrying a red methyl group." },
    { s:{why:1}, label:"And it is the reason the vaccine works",
      call:"the polymerase cannot tell \u2014 your immune system can"   /* textContent */, callFill:RED,
      note:"So why go to the trouble. Because your cells have sensors whose whole job is to notice foreign RNA, and they are good at it. Put ordinary unmodified messenger RNA into a cell and it reads as an infection: the innate immune system fires, you get inflammation, and the message is destroyed before the ribosome gets near it. Swap the uridines for this, and the sensors do not trigger. The particle fuses, the RNA is released, a ribosome translates it, and you make the antigen — which is the only thing you actually wanted. Katalin Kariko and Drew Weissman worked that out in two thousand and five, spent years being told it was not interesting, and took the Nobel Prize for it in twenty twenty-three. One base, drawn on this slide, is the difference between a technology that works and one that does not.",
      desc:"Along the bottom, the consequence in three steps: the lipid particle fuses, the RNA is released, a ribosome reads it, and an antigen is made. Beside it, a note in red: with plain uridine none of this happens, because the cell reads the RNA as an infection and destroys it before it is translated." }
  ];
  return driver(mount(slide, mbMarkup()), ["why"], S, mbPaint);
});

/* ================================================================== *
 * 5.  eukgene — the human gene, its message, and the piece you clone.
 *
 * Three lanes, one scale, read downward: the gene, the mRNA the cell
 * makes of it, and the E. coli construct that carries only the coding
 * part. Same box idiom throughout, so the CDS is visibly a sub-piece of
 * a sub-piece -- introns gone at the first step, UTRs gone at the
 * second. That is the whole reason the design tutorial starts from cDNA
 * and PCRs out the CDS rather than taking the gene.
 *
 * Approximate INS structure (3 exons, 2 introns), used for the widths:
 *   exon1 ~42 | intron1 ~179 | exon2 ~204 | intron2 ~786 | exon3 ~219
 * Exon 1 is 5' UTR; the CDS opens in exon 2 and closes in exon 3.
 * ================================================================== */
const EG_X = 344, EG_BP = 0.63;              /* px per base pair        */
const bp = n => n*EG_BP;
const EG_INS = [[42,1],[179,0],[204,1],[786,0],[219,1]];   /* [len, isExon] */
const EG_LEN = 1430, EG_MRNA = 465;          /* gene, and spliced message */
const EG_UTR5 = 60, EG_CDS = 333;            /* where the CDS sits in it  */
const EG_YG = 300, EG_YM = 468, EG_YE = 664; /* gene | mRNA | E. coli     */

function egBox(x, w, y, col, h){
  const H = h || 34;
  return '<rect x="'+n2(x)+'" y="'+n2(y-H/2)+'" width="'+n2(w)+'" height="'+H+'" rx="4" '+
         'fill="'+col+'" fill-opacity="0.18" stroke="'+col+'" stroke-width="2.6"/>';
}
function egLane(x, y, txt){
  return '<text x="'+n2(x)+'" y="'+n2(y+7)+'" text-anchor="end" font-family="inherit" '+
         'font-size="22" font-weight="700" fill="'+INK+'">'+txt+'</text>';
}
function egProm(x0, x1, y, txt){
  return '<path d="M'+n2(x0)+' '+n2(y)+'H'+n2(x1)+'" fill="none" stroke="'+SLATE+
         '" stroke-width="9" stroke-linecap="round" opacity="0.3"/>' +
         '<text x="'+n2((x0+x1)/2)+'" y="'+n2(y-26)+'" text-anchor="middle" '+
         'font-family="inherit" font-size="19" font-weight="700" fill="'+SLATE+'">'+txt+'</text>';
}

function eukMarkup(){
  const CDSx = EG_X + bp(EG_UTR5), CDSw = bp(EG_CDS);
  let g = "";

  /* --- lane 1: the human gene ---------------------------------- */
  g += egProm(EG_X-100, EG_X, EG_YG, "promoter, TATA");
  g += egLane(EG_X-114, EG_YG, 'human <tspan font-style="italic">INS</tspan>');
  g += '<path d="M'+EG_X+' '+EG_YG+'H'+n2(EG_X+bp(EG_LEN))+'" fill="none" stroke="'+MUTED+
       '" stroke-width="2.6"/>';
  let x = EG_X;
  EG_INS.forEach(function(seg){
    if (seg[1]) g += egBox(x, bp(seg[0]), EG_YG, SLATE);
    x += bp(seg[0]);
  });
  g += '<text x="'+n2(EG_X+bp(EG_LEN)+18)+'" y="'+(EG_YG+7)+'" font-family="inherit" '+
       'font-size="20" fill="'+MUTED+'">1430 bp &#8212; mostly intron</text>';
  g += '<text x="'+n2(EG_X+bp(42+179/2))+'" y="'+(EG_YG+46)+'" text-anchor="middle" '+
       'font-family="inherit" font-size="19" fill="'+MUTED+'">intron</text>';
  g += '<text x="'+n2(EG_X+bp(42+179+204/2))+'" y="'+(EG_YG-28)+'" text-anchor="middle" '+
       'font-family="inherit" font-size="19" font-weight="700" fill="'+SLATE+'">exon</text>';

  /* --- lane 2: the message the cell makes ---------------------- */
  g += egLane(EG_X-114, EG_YM, "mRNA");
  let mx = EG_X;
  EG_INS.forEach(function(seg){ if (seg[1]){ g += egBox(mx, bp(seg[0]), EG_YM, SLATE); mx += bp(seg[0]); } });
  g += '<path d="M'+n2(EG_X-58)+' '+EG_YM+'H'+EG_X+'" fill="none" stroke="'+RED+
       '" stroke-width="2.6"/><circle cx="'+n2(EG_X-70)+'" cy="'+EG_YM+'" r="11" fill="none" '+
       'stroke="'+RED+'" stroke-width="2.6"/>' +
       '<text x="'+n2(EG_X-70)+'" y="'+(EG_YM-28)+'" text-anchor="middle" font-family="inherit" '+
       'font-size="19" font-weight="700" fill="'+RED+'">cap</text>';
  g += '<path d="M'+n2(mx)+' '+EG_YM+'H'+n2(mx+84)+'" fill="none" stroke="'+RED+
       '" stroke-width="2.6" stroke-dasharray="5 6"/>' +
       '<text x="'+n2(mx+94)+'" y="'+(EG_YM+7)+'" font-family="inherit" font-size="19" '+
       'font-weight="700" fill="'+RED+'">AAAA&#8230;</text>';
  /* where each intron went */
  let sx2 = EG_X, ex = EG_X;
  EG_INS.forEach(function(seg){
    if (seg[1]){ ex += bp(seg[0]); sx2 += bp(seg[0]); return; }
    g += '<path d="M'+n2(sx2)+' '+(EG_YG+17)+'L'+n2(ex)+' '+(EG_YM-17)+'" fill="none" '+
         'stroke="'+MUTED+'" stroke-width="1.8" stroke-dasharray="6 7"/>';
    sx2 += bp(seg[0]);
  });
  /* the CDS, marked inside the message: the UTRs are not coding */
  g += '<g data-r="cds" opacity="0">' + egBox(CDSx, CDSw, EG_YM, RED, 40) +
       '<text x="'+n2(CDSx+CDSw/2)+'" y="'+(EG_YM+7)+'" text-anchor="middle" '+
       'font-family="inherit" font-size="19" font-weight="700" fill="'+RED+'">CDS, 333 bp</text>' +
       '<text x="'+n2(EG_X+bp(EG_UTR5)/2)+'" y="'+(EG_YM+50)+'" text-anchor="middle" '+
       'font-family="inherit" font-size="18" fill="'+MUTED+'">UTR</text>' +
       '<text x="'+n2((CDSx+CDSw+mx)/2)+'" y="'+(EG_YM+50)+'" text-anchor="middle" '+
       'font-family="inherit" font-size="18" fill="'+MUTED+'">UTR</text></g>';

  /* --- lane 3: what actually goes into E. coli ----------------- */
  g += '<g data-r="ecoli" opacity="0">';
  g += egLane(EG_X-114, EG_YE, '<tspan font-style="italic">E. coli</tspan>');
  g += egProm(CDSx-176, CDSx, EG_YE, "T7 promoter + RBS &#8212; from the vector");
  g += egBox(CDSx, CDSw, EG_YE, RED, 40);
  g += '<text x="'+n2(CDSx+CDSw/2)+'" y="'+(EG_YE+7)+'" text-anchor="middle" '+
       'font-family="inherit" font-size="19" font-weight="700" fill="'+RED+'">CDS</text>';
  g += '<path d="M'+n2(CDSx+CDSw)+' '+EG_YE+'H'+n2(CDSx+CDSw+130)+'" fill="none" stroke="'+MUTED+
       '" stroke-width="2.6"/>' +
       '<text x="'+n2(CDSx+CDSw+140)+'" y="'+(EG_YE+7)+'" font-family="inherit" font-size="20" '+
       'fill="'+MUTED+'">pET&#8211;INS</text>';
  /* straight down: the piece is the same piece */
  [CDSx, CDSx+CDSw].forEach(function(px){
    g += '<path d="M'+n2(px)+' '+(EG_YM+20)+'V'+(EG_YE-20)+'" fill="none" stroke="'+RED+
         '" stroke-width="1.8" stroke-dasharray="6 7"/>';
  });
  g += '</g>';
  return g + chrome(244, 830);
}

function eukPaint(r, s){
  r.cds  .setAttribute("opacity", n2(clamp01(s.take)));
  r.ecoli.setAttribute("opacity", n2(clamp01(s.take)));
}

window.Deck.sequence("eukgene", function(slide){
  const S = [
    { s:{take:0}, label:"The cell finishes the transcript for you",
      note:"Last thing, and it is a warning rather than a technique. Transcription is one of the most divergent things in biology and you cannot assume a promoter travels. Even between E. coli and Bacillus subtilis, both bacteria, the sigma factor repertoires differ enough that an E. coli promoter is often read badly or not at all in Bacillus. Eukaryotes are not a variation on the theme, they are a different machine. Here is the human insulin gene: about fourteen hundred base pairs, three exons, two introns, and most of its length is intron. What comes out of the polymerase is not usable. It gets capped at the five prime end, the introns are spliced out, and a poly-A tail is added at the three prime end. None of that machinery exists in E. coli. So the human gene, promoter and all, put into a bacterium gives you nothing: the promoter would not be read, and even if it were, the introns would still be sitting in the message.",
      desc:"The human insulin gene drawn as three exon boxes joined by intron lines, about 1430 base pairs, with a promoter to its left. Below it, the messenger the cell makes of it: the three exons butted together with dashed lines showing where each intron was removed, a cap at the five prime end and a poly-A tail at the three prime end." },
    { s:{take:1}, label:"So you take the message, not the gene",
      call:"introns gone at the first step, UTRs gone at the second", callFill:RED,
      note:"So you let the cell do the hard part and you start from its message. Reverse transcribe the mature mRNA and you have cDNA, with the introns already gone, because the human cell spliced them out before you ever touched it. Then take less than that again. The message still carries untranslated regions at both ends that E. coli has no use for, so what you actually PCR out is the coding sequence: three hundred and thirty-three base pairs, a hundred and ten residues of preproinsulin. And it goes behind a promoter the cell can read — a T7 promoter, with the ribosome binding site supplied by the vector, because a eukaryotic message does not carry one E. coli would recognise. That is pET-INS, and it is the first design tutorial you will do. It is also, in outline, what Genentech did in nineteen seventy-eight: human insulin made in E. coli, the first recombinant drug, on the market as Humulin by nineteen eighty-two. They did it the hard way, chemically synthesising the A and B chain genes and expressing them as fusions, because none of the tools in this lecture existed yet. You get to do it with a PCR and two restriction sites.",
      desc:"The coding sequence is picked out in red inside the messenger, with the untranslated regions at either end labelled UTR and left outside it. Below, a third lane shows the E. coli construct: the same red CDS box, aligned directly under the one above it by dashed vertical lines, now behind a T7 promoter and ribosome binding site supplied by the vector, labelled pET-INS." }
  ];
  return driver(mount(slide, eukMarkup()), ["take"], S, eukPaint);
});

})();
