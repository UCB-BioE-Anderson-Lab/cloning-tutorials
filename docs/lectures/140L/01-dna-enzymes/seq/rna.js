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
      call:"nothing to extend, so where does it start?", callFill:RED,
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
      'recognition element; stays duplex</text>' +
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
      call:"built on the bottom strand, so it comes out matching the top", callFill:SLATE,
      note:"The polymerase clamps onto that seventeen-base element and melts the DNA just downstream of it. Notice which part opens: the recognition element itself stays double stranded, because that is what the enzyme is gripping. Only from plus one onward does it come apart, and that opening is the transcription bubble. Nothing has been cut: both backbones run unbroken all the way across, they have simply come apart from one another. Then it puts a nucleotide on that G and extends, with no primer, because it brought the first two nucleotides together itself. Be clear about which strand it is copying. The new chain is built along the BOTTOM strand, the template, which is why it sits down there against it, and because it is complementary to the bottom strand it comes out reading the same as the top strand, which is exactly why we quote a promoter on the top strand in the first place. The one substitution is U wherever the top strand says T.",
      desc:"The two strands separate from plus one onward, the top strand and its bases arching upward and the bottom strand and its bases downward, with both backbone lines running unbroken through the opening. The bracketed recognition element stays paired. Inside the bubble a new chain of six letters, G G G A G A, sits in a row of its own against the bottom strand, bracketed and labelled new RNA running five prime to three prime." },
    { s:{prom:0,bub:0,open:8,nrna:T7_RNA.length,bstart:31,rlow:1}, label:"It runs off the end",
      call:"the bubble never grew, it travelled", callFill:SLATE,
      note:"Now let it run, and watch the bubble rather than the transcript. It is the same size the whole way: about eight base pairs, melting at its leading edge and snapping shut behind. It travels rather than grows, and it has to, because unwinding a whole gene would cost far more than the enzyme has. What accumulates is the transcript, peeled off the template as the duplex closes behind, which is why it ends up lying free underneath rather than paired to anything. Then the polymerase reaches the end of the DNA and simply falls off it. The duplex closes completely, so the DNA is exactly as it was (nothing consumed, nothing cut), and the enzyme goes back and does it again. One template, many transcripts, which is why in vitro transcription gives you so much material.",
      desc:"The bubble has travelled to the far end of the DNA at the same width and then closed, leaving a complete unbroken duplex. The full transcript lies free below it, running from plus one to the last base, its five prime end at plus one and a half barb on its three prime end." }
  ];
  return driver(mount(slide, t7Markup()), ["prom","bub","open","nrna","bstart","rlow"], S, t7Paint);
});

/* ================================================================== *
 * 4.  ivt — what in vitro transcription is, at the bench.
 *
 * A person and a list. The molecular story is already told by the
 * promoter slide, so drawing a template and a transcript again here
 * would be the same picture twice; what this slide adds is that it is a
 * REACTION somebody sets up, and that the whole system fits on eight
 * lines.
 *
 * Two of those eight lines are worth pausing on. The template has to be
 * LINEAR, because the enzyme has no terminator and stops by falling off
 * the end. And pyrophosphatase is in the tube for a reason the deck has
 * already earned: every nucleotide added throws off pyrophosphate, and
 * hydrolysing it is what pulls the reaction forward -- the same argument
 * made at the polymerase mechanism. Left alone it also precipitates the
 * magnesium out of the buffer.
 *
 * ART.bench is the traced line art; ART.benchTube is the tube the
 * pipette is loading, in the art's own coordinates, so the arrow can
 * aim at it rather than at a hardcoded guess. If the art is missing the
 * slide still lays out -- the figure is simply absent.
 * ================================================================== */
const BENCH = {x:180, y:236, h:556};        /* where the figure sits       */
const IVL = 966, IVL0 = 330, IVLD = 40;     /* the list: x, first y, step  */
const IVITEMS = ["ATP", "GTP", "CTP", "UTP", "template DNA",
                 "T7 RNA polymerase", "pyrophosphatase", "buffer"];

/* the art, scaled to BENCH.h and pinned at BENCH.x/.y; returns the
   markup plus wherever the loaded tube ended up in slide coordinates */
function benchArt(){
  const A = window.ART;
  if (!A || !A.bench) return { g:"", tube:[470, 660] };
  const b = A.benchBox, k = BENCH.h / (b[3] - b[1]);
  const X = x => BENCH.x + (x - b[0])*k, Y = y => BENCH.y + (y - b[1])*k;
  const t = A.benchTube || [(b[0]+b[2])/2, b[1] + (b[3]-b[1])*0.72];
  return {
    g: '<g transform="translate('+n2(BENCH.x - b[0]*k)+' '+n2(BENCH.y - b[1]*k)+') scale('+
       n2(k)+')" fill="none" stroke="'+INK+'" stroke-width="'+n2(3/k)+'" '+
       'stroke-linecap="round" stroke-linejoin="round">' + A.bench + '</g>',
    tube: [X(t[0]), Y(t[1])]
  };
}

function ivtMarkup(){
  const art = benchArt();
  let g = art.g;

  /* the list, and a bracket gathering it into one thing */
  IVITEMS.forEach(function(t, i){
    const y = IVL0 + i*IVLD;
    g += '<text x="'+IVL+'" y="'+y+'" font-family="inherit" font-size="27" '+
         'font-weight="700" fill="'+INK+'">'+t+'</text>';
  });
  const yTop = IVL0 - 28, yBot = IVL0 + (IVITEMS.length-1)*IVLD + 12;
  g += '<path d="M'+(IVL-30)+' '+yTop+'h-14v'+(yBot-yTop)+'h14" fill="none" stroke="'+MUTED+
       '" stroke-width="2.6"/>';
  /* one arrow, from the bracket to the tube being loaded */
  const ax = IVL-52, ay = (yTop+yBot)/2, tx = art.tube[0]+34, ty = art.tube[1];
  g += '<path d="M'+n2(ax)+' '+n2(ay)+'Q'+n2((ax+tx)/2)+' '+n2(ay+52)+' '+n2(tx)+' '+n2(ty)+
       '" fill="none" stroke="'+MUTED+'" stroke-width="3" marker-end="url(#ivtHead)"/>';
  g += '<defs><marker id="ivtHead" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" '+
       'markerHeight="7" orient="auto"><path d="M0 0L12 6L0 12z" fill="'+MUTED+
       '"/></marker></defs>';
  /* one closing line, and no chrome: with nothing to build there is no
     step to caption */
  g += '<text x="800" y="838" text-anchor="middle" font-family="inherit" font-size="27" '+
       'font-weight="700" fill="'+SLATE+
       '">eight lines, and one of them is only there to pull the reaction forward</text>';
  return g;
}

window.Deck.sequence("ivt", function(slide){
  mount(slide, ivtMarkup());
  return { steps:[{
    note:"Everything so far in this section has been a molecule. This is a tube. In vitro transcription is a reaction somebody sets up at a bench, and it is worth being concrete about that, because the whole point of T7 is that you can: there is no cell here, no transcription factors, no chromatin, no nucleus, nothing regulating anything, and nothing in that tube you did not put there yourself. Here is the entire list. The four nucleoside triphosphates: ribo this time, so UTP where a PCR would have had dTTP. The template, and it has to be linear, because the enzyme has no terminator and stops by falling off the end, so whatever base is last on the DNA is the last base of your RNA. T7 RNA polymerase itself, one polypeptide needing no accessory factors, which is exactly why this works in a tube at all. Buffer, which is mostly magnesium, because every phosphoryl transfer in this lecture has needed it. And then the odd one out: pyrophosphatase. Think about why that is in there. Every single nucleotide the polymerase adds throws off a pyrophosphate, the leaving group we drew at the very start of the polymerase section, and hydrolysing it is what makes the reaction effectively irreversible. In a cell that happens for free. In a tube you add the enzyme that does it, both to pull the reaction forward and because magnesium pyrophosphate is insoluble and will otherwise precipitate the magnesium out of your buffer. Two hours at thirty-seven degrees, and a few hundred nanograms of template gives you tens of micrograms of RNA.",
    desc:"Line art of a scientist at a bench in a lab coat and safety glasses, pipetting into a small open tube held over a tube rack. To the right, a bracketed list (ATP, GTP, CTP, UTP, template DNA, T7 RNA polymerase, pyrophosphatase and buffer) with a single arrow curving from the bracket down to the tube being loaded. A line below reads: eight lines, and one of them is only there to pull the reaction forward."
  }], go:function(){} };
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

/* ================================================================== *
 * 5.  vaccine — how an mRNA vaccine is made.
 *
 * Told as a process with motion rather than a static flow diagram. The
 * plasmid opens the slide big and centred, because it is the subject;
 * then it shrinks into position and the rest of the process lays itself
 * out to its right. Two beats carry real animation rather than a
 * reveal: the polymerase sweeping the template and trailing transcript
 * behind it, and the chemistry shrinking away once it has been read.
 *
 * The earlier version drew the spike gene as an arc on the circle AND
 * as a bar on the linear DNA sitting right beside it, which read as a
 * protein stuck to a plasmid. Here the plasmid keeps the arcs, the
 * linear template is a separate full-width row well below it, and the
 * gene on that row is named by a bracket rather than a second coloured
 * block.
 * ================================================================== */
const PL0 = {x:800, y:452, r:196};           /* the plasmid, opening       */
const PL1 = {x:252, y:250, r:60};            /* the plasmid, parked        */
const LNY = 402, LNX0 = 180, LNX1 = 1420;    /* the linear template        */
/* clear of the template's own gene bracket, which stays on screen once
   transcription starts */
const RNY = 545;                             /* the transcript             */
const NTX2 = [648, 728, 808, 888], NTY2 = 362;   /* nucleotides, from above */
const PKC = [1300, 668], PKR = 95;           /* the particle               */
const LRP = (a, b, t) => a + (b - a)*t;

const vtx = (x, y, t, c, sz, w, a, o) => '<text x="'+n2(x)+'" y="'+n2(y)+'" text-anchor="'+
  (a||"middle")+'" font-family="inherit" font-size="'+n2(sz||21)+'" font-weight="'+(w||700)+
  '" fill="'+(c||INK)+'"'+(o==null?"":' opacity="'+n2(o)+'"')+'>'+t+'</text>';

/* an arc of the plasmid, in degrees with y down: 270 is the top */
function varc(c, r, a0, a1, col, w){
  const P = a => [c[0] + r*Math.cos(a*Math.PI/180), c[1] + r*Math.sin(a*Math.PI/180)];
  const A = P(a0), B = P(a1), big = (a1 - a0) > 180 ? 1 : 0;
  return '<path d="M'+n2(A[0])+' '+n2(A[1])+'A'+n2(r)+' '+n2(r)+' 0 '+big+' 1 '+
    n2(B[0])+' '+n2(B[1])+'" fill="none" stroke="'+col+'" stroke-width="'+n2(w)+
    '" stroke-linecap="round"/>';
}
function vArrowDown(x, y0, y1){
  return '<path d="M'+x+' '+y0+'V'+y1+'M'+(x-10)+' '+(y1-12)+'L'+x+' '+y1+'L'+(x+10)+' '+
    (y1-12)+'" fill="none" stroke="'+MUTED+'" stroke-width="3" stroke-linecap="round" '+
    'stroke-linejoin="round"/>';
}

function vacMarkup(){
  /* everything that moves is drawn per frame; only the static furniture
     and the group shells go in here */
  return '<g data-r="plas"></g><g data-r="lin" opacity="0"></g>' +
    '<g data-r="mix" opacity="0"></g><g data-r="pol" opacity="0"></g>' +
    '<g data-r="chem" opacity="0"></g><g data-r="pak" opacity="0"></g>' +
    chrome(184, 846);
}

function vacPaint(r, s){
  const A = window.ART;

  /* ---- the plasmid: big and central, then parked at station one ---- */
  const c = [LRP(PL0.x, PL1.x, s.pl), LRP(PL0.y, PL1.y, s.pl)];
  const rr = LRP(PL0.r, PL1.r, s.pl), fs = LRP(27, 19, s.pl);
  const aw = LRP(15, 9, s.pl);                    /* arc weight follows size */
  let g = '<circle cx="'+n2(c[0])+'" cy="'+n2(c[1])+'" r="'+n2(rr)+'" fill="none" stroke="'+
          INK+'" stroke-width="'+n2(LRP(4, 3, s.pl))+'"/>' +
    varc(c, rr, 228, 268, SLATE, aw) + varc(c, rr, 276, 372, INK, aw) +
    /* named once, at full size; the colours carry it after that */
    vtx(c[0] - rr*0.62, c[1] - rr - 26, "T7 promoter", SLATE, fs, 700, "middle", 1 - s.pl) +
    vtx(c[0] + rr*0.72, c[1] - rr - 26, "spike gene", INK, fs, 700, "middle", 1 - s.pl) +
    vtx(c[0], c[1] + rr + 34, "plasmid", MUTED, LRP(23, 19, s.pl), 600);
  if (s.lin > 0.02){
    const a = 62*Math.PI/180;
    g += '<path d="M'+n2(c[0]+rr*Math.cos(a)-16)+' '+n2(c[1]+rr*Math.sin(a)+16)+'l34 -34" '+
         'stroke="'+RED+'" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="'+
         n2(s.lin)+'"/>' +
         vtx(c[0]+rr+34, c[1]+rr*0.9, "cut once", RED, 20, 700, "start", s.lin);
  }
  r.plas.innerHTML = g;

  /* ---- the linear template, drawn across ---- */
  const lx = LRP(LNX0, LNX1, clamp01(s.lin));
  r.lin.setAttribute("opacity", n2(clamp01(s.lin*3)));
  r.lin.innerHTML =
    '<g fill="none" stroke="'+INK+'" stroke-width="3">' +
      '<path d="M'+LNX0+' '+(LNY-9)+'H'+n2(lx)+'"/>' +
      '<path d="M'+LNX0+' '+(LNY+9)+'H'+n2(lx)+'"/></g>' +
    '<path d="M'+LNX0+' '+LNY+'H'+(LNX0+92)+'" stroke="'+SLATE+'" stroke-width="10" '+
      'stroke-linecap="round" fill="none" opacity="0.4"/>' +
    (s.lin > 0.96 ? '<path d="M'+LNX1+' '+(LNY-21)+'V'+(LNY+21)+'" stroke="'+RED+
      '" stroke-width="3" fill="none"/>' +
      '<path d="M'+(LNX0+96)+' '+(LNY+34)+'v12H'+(LNX1-12)+'v-12" fill="none" stroke="'+
        MUTED+'" stroke-width="2.4"/>' +
      vtx((LNX0+LNX1)/2, LNY+76, "spike gene, and the cut end is the end of every dose",
          MUTED, 20, 600) : "");

  /* ---- what goes in ---- */
  r.mix.setAttribute("opacity", n2(clamp01(s.mix)));
  r.mix.innerHTML = NTX2.map(x => vArrowDown(x, NTY2-58, NTY2)).join("") +
    vtx(NTX2[0], NTY2-74, "ATP", INK, 21) + vtx(NTX2[1], NTY2-74, "CTP", INK, 21) +
    vtx(NTX2[2], NTY2-74, "GTP", INK, 21) +
    vtx(NTX2[3], NTY2-74, "m&#185;&#936;TP", RED, 21) +
    vtx(NTX2[3]+52, NTY2-34, "replaces UTP", RED, 18, 600, "start");

  /* ---- the chemistry: read at size, then set aside ---- */
  const ck = LRP(0.70, 0.26, s.set);
  const cx = LRP(800, 262, s.set), cy = LRP(660, 706, s.set);
  r.chem.setAttribute("opacity", n2(clamp01(s.mix)));
  r.chem.setAttribute("transform",
    "translate(" + n2(cx - 720*ck) + " " + n2(cy - 425*ck) + ") scale(" + n2(ck) + ")");

  /* ---- transcription: one sweep, and the transcript left behind ---- */
  r.pol.setAttribute("opacity", n2(clamp01(s.run*4)));
  if (s.run > 0.01 && A && A.t7pol){
    const k = 200/(A.t7polBox[2] - A.t7polBox[0]);
    const px = LRP(LNX0 + 120, LNX1 - 90, s.run);
    r.pol.innerHTML =
      '<path d="'+rna(LNX0 + 100, Math.max(LNX0 + 126, px), RNY)+'" fill="none" stroke="'+
        SLATE+'" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      /* fill="none", and it matters: t7pol is traced as OPEN contours, and
         SVG closes an open path implicitly when it fills it. Every long
         meandering outline was therefore filling as a pale wedge lying
         across the protein and out past its edge. Stroke only. */
      '<g transform="translate('+n2(px - A.t7Cleft[0]*k)+' '+n2(LNY - A.t7Cleft[1]*k)+
        ') scale('+n2(k)+')" fill="none" stroke="'+INK+
        '" stroke-opacity="0.62" stroke-width="9" stroke-linecap="round" '+
        'stroke-linejoin="round">' + A.t7pol + '</g>' +
      (s.run > 0.96 ? vtx(LNX0 + 100 + 60, RNY + 40, "mRNA", SLATE, 22, 700, "start") : "");
  } else r.pol.innerHTML = "";

  /* ---- and into the particle ---- */
  r.pak.setAttribute("opacity", n2(clamp01(s.pak)));
  /* the leader from the transcript, then the particle itself */
  const lead = '<path d="M'+(PKC[0]-PKR-120)+' '+(RNY+40)+'Q'+(PKC[0]-PKR-40)+' '+(RNY+70)+' '+
      (PKC[0]-PKR-14)+' '+(PKC[1]-46)+'" fill="none" stroke="'+MUTED+'" stroke-width="3"/>';
  const cap = vtx(PKC[0], PKC[1]+PKR+34, "lipid nanoparticle", MUTED, 19, 600);
  if (A && A.lnp){
    /* seated on its own centre so the particle lands on PKC exactly, and
       drawn at one stroke width because the source strokes are uniform */
    const bw = A.lnpBox[2] - A.lnpBox[0], bh = A.lnpBox[3] - A.lnpBox[1];
    const pk = (2*PKR)/bw;
    const tf = "translate(" + n2(PKC[0] - (A.lnpBox[0]+bw/2)*pk) + " " +
                              n2(PKC[1] - (A.lnpBox[1]+bh/2)*pk) + ") scale(" + n2(pk) + ")";
    r.pak.innerHTML = lead +
      '<g transform="'+tf+'" fill="none" stroke-width="11" stroke-linecap="round" '+
        'stroke-linejoin="round">' +
        '<g stroke="'+INK+'">' + A.lnp + '</g>' +
        /* the cargo is blue because everything else RNA in this deck is */
        '<g stroke="'+SLATE+'">' + A.lnpRna + '</g>' +
      '</g>' + cap;
  } else {
    r.pak.innerHTML = lead +
      '<circle cx="'+PKC[0]+'" cy="'+PKC[1]+'" r="'+PKR+'" fill="'+SLATE+'" fill-opacity="0.08" '+
        'stroke="'+SLATE+'" stroke-width="3" stroke-dasharray="8 8"/>' +
      '<path d="'+rna(PKC[0]-42, PKC[0]+42, PKC[1])+'" fill="none" stroke="'+SLATE+
        '" stroke-width="2.8" stroke-linecap="round"/>' + cap;
  }
}

window.Deck.sequence("vaccine", function(slide){
  const r = mount(slide, vacMarkup());
  /* the chemistry never changes, so it is written once and only moved */
  r.chem.innerHTML =
    mbPanel(MB_L, ["N1","C2","N3","C4","C5","C6"], false,
            "UTP", "sugar on N1, a C&#8211;N bond") +
    mbPanel(MB_RX, ["C5","C4","N3","C2","N1","C6"], true,
            "m&#185;&#936;TP", "sugar on C5: a C&#8211;C bond, and N1 is free");

  const S = [
    { s:{pl:0,lin:0,mix:0,set:0,run:0,pak:0}, label:"It starts as a plasmid",
      note:"An application, and one where the answer surprises people. An mRNA vaccine is about four thousand three hundred bases of RNA, and the instinct is that it must be chemically synthesised, because that is how you buy an oligo. It is not. Solid-phase RNA synthesis runs out around a hundred bases. Four thousand is not reachable that way and never will be. It is made enzymatically, by the reaction on the last slide, run large, and it starts here, with something entirely ordinary. A plasmid, grown in E. coli, carrying the antigen sequence behind a T7 promoter. That is it. That is the whole starting material.",
      desc:"A large circular plasmid centred on the slide, with a blue arc marking the T7 promoter and a longer black arc marking the spike gene." },
    { s:{pl:1,lin:0,mix:0,set:0,run:0,pak:0}, label:"Step one of a process",
      note:"Put it in the corner, because it is only the first step and the rest of this has to fit.",
      desc:"The plasmid shrinks and moves to the upper left of the slide, becoming the first station of a process." },
    { s:{pl:1,lin:1,mix:0,set:0,run:0,pak:0}, label:"Cut it once, and lay it out flat",
      note:"Before it goes anywhere near the polymerase you cut that plasmid once, downstream of the gene, with a restriction enzyme, and what you have is a linear template. You know exactly why it has to be linear: run-off. The polymerase has no terminator; it stops where the DNA stops. So the position of that single cut is the three prime end of every molecule in the batch. An enzyme from the first section of this lecture is defining the end of a pharmaceutical.",
      desc:"A red slash marks a single cut on the plasmid, and a linear double-stranded template draws itself across the full width of the slide, its T7 promoter marked in blue at the left, the spike gene bracketed beneath it, and a red bar stopping its right-hand end." },
    { s:{pl:1,lin:1,mix:1,set:0,run:0,pak:0}, label:"Feed it four nucleotides, but not the four you expect",
      call:"the polymerase cannot tell; your immune system can", callFill:RED,
      note:"Now the reaction. ATP, CTP, GTP, and then not UTP. Every uridine is replaced by N1-methylpseudouridine, and here it is drawn properly, because the change is far smaller than anyone expects. Same ring, same atoms, same two carbonyls. Two things differ: the sugar is attached through carbon five instead of nitrogen one, so the bond holding the base on is carbon-carbon rather than carbon-nitrogen (that is what pseudo means here, uracil put on backwards), and nitrogen one, no longer doing the attaching, carries a methyl. That is the whole modification. The polymerase does not notice; as far as the chemistry of incorporation goes it is a U. Your cells notice. Unmodified message reads as an infection, the innate response fires, and the RNA is destroyed before a ribosome reaches it. Swap the uridines and the sensors stay quiet. Kariko and Weissman, two thousand and five; the Nobel Prize in twenty twenty-three.",
      desc:"Four arrows feed down onto the template, labelled ATP, CTP, GTP and, in red, m1-psi-TP replaces UTP. Below, the two nucleotide structures are drawn side by side on identical hexagons: UTP with its sugar on nitrogen one, and m1-psi-TP with its sugar on carbon five in red and a red methyl on the freed nitrogen." },
    { s:{pl:1,lin:1,mix:1,set:1,run:1,pak:0}, label:"Then it just runs",
      note:"Set the chemistry aside and watch. The polymerase starts at the promoter and runs the length of the template, and the transcript trails out behind it. It falls off the cut end, and goes back and does it again. The template is not consumed, so a few hundred nanograms of DNA becomes tens of micrograms of RNA, and because every copy ran off the same end of the same linear template, every copy is the same length. That is what run-off buys you: not just a lot of RNA, but a lot of one defined RNA.",
      desc:"The nucleotide structures shrink away into the lower left corner. The T7 RNA polymerase, drawn as a semi-transparent traced silhouette of the real enzyme, sweeps along the template from the promoter to the cut end, leaving a blue wavy transcript behind it." },
    { s:{pl:1,lin:1,mix:1,set:1,run:1,pak:1}, label:"And that is the dose",
      call:"a restriction enzyme, a phage polymerase, and one modified base", callFill:SLATE,
      note:"Then it is wrapped in a lipid nanoparticle, because naked RNA in a bloodstream lasts seconds and could not cross a membrane anyway. And that is the dose. Stand back and look at what that took. A restriction enzyme to define one end. A phage RNA polymerase that needs no accessory factors and will work in a tube. One modified nucleotide. Everything in that list is in this lecture and most of it is in the NEB catalogue. The scale is industrial; the chemistry is not.",
      desc:"The transcript curves down into a lipid nanoparticle at the lower right, drawn in cross-section as a ring of lipid molecules, each a circle with two tails pointing inward, with the messenger RNA drawn in blue as a single wave held inside it." }
  ];
  return driver(r, ["pl","lin","mix","set","run","pak"], S, vacPaint);
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
       'font-size="20" fill="'+MUTED+'">1430 bp, mostly intron</text>';
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
  g += egProm(CDSx-176, CDSx, EG_YE, "T7 promoter + RBS, from the vector");
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
      note:"So you let the cell do the hard part and you start from its message. Reverse transcribe the mature mRNA and you have cDNA, with the introns already gone, because the human cell spliced them out before you ever touched it. Then take less than that again. The message still carries untranslated regions at both ends that E. coli has no use for, so what you actually PCR out is the coding sequence: three hundred and thirty-three base pairs, a hundred and ten residues of preproinsulin. And it goes behind a promoter the cell can read: a T7 promoter, with the ribosome binding site supplied by the vector, because a eukaryotic message does not carry one E. coli would recognise. That is pET-INS, and it is the first design tutorial you will do. It is also, in outline, what Genentech did in nineteen seventy-eight: human insulin made in E. coli, the first recombinant drug, on the market as Humulin by nineteen eighty-two. They did it the hard way, chemically synthesising the A and B chain genes and expressing them as fusions, because none of the tools in this lecture existed yet. You get to do it with a PCR and two restriction sites.",
      desc:"The coding sequence is picked out in red inside the messenger, with the untranslated regions at either end labelled UTR and left outside it. Below, a third lane shows the E. coli construct: the same red CDS box, aligned directly under the one above it by dashed vertical lines, now behind a T7 promoter and ribosome binding site supplied by the vector, labelled pET-INS." }
  ];
  return driver(mount(slide, eukMarkup()), ["take"], S, eukPaint);
});

})();
