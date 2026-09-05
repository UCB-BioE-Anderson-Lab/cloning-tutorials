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
 * 4.  trna — the practical vignette: transcribing a tRNA in vitro.
 *
 * A tRNA rather than a guide RNA, because CRISPR has not happened yet
 * in this course and "the 20 nt spacer" would be a term nobody owns.
 * Everyone has met a cloverleaf.
 *
 * It also makes a point the guide could not: the product is not a
 * sequence, it is a SHAPE. The polymerase makes a line and the line
 * folds itself, which is the last thing to say about RNA before the
 * section on the enzymes that join it.
 *
 * The fold is a cross-fade, not a morph. Tweening a wave into a
 * cloverleaf would draw a lot of shapes that are not either one.
 * ================================================================== */
const TX0 = 300, TP1 = 560, TX1 = 1330;     /* promoter | +1 | end of gene */
const TYT = 356, TYB = 408;                 /* the template duplex         */
const TRY = 560;                            /* the linear transcript       */

/* two parallel backbones with rungs between them: a base-paired stem */
function stem(x1, y1, x2, y2, n){
  const dx = x2-x1, dy = y2-y1, L = Math.hypot(dx,dy) || 1;
  const ux = dx/L, uy = dy/L, px = -uy*9, py = ux*9;
  let g = '<path d="M'+n2(x1+px)+' '+n2(y1+py)+'L'+n2(x2+px)+' '+n2(y2+py) +
          'M'+n2(x1-px)+' '+n2(y1-py)+'L'+n2(x2-px)+' '+n2(y2-py)+
          '" fill="none" stroke="'+SLATE+'" stroke-width="3" stroke-linecap="round"/>';
  for (let k = 0; k < n; k++){
    const t = (k+0.5)/n, cx = x1+dx*t, cy = y1+dy*t;
    g += '<path d="M'+n2(cx+px)+' '+n2(cy+py)+'L'+n2(cx-px)+' '+n2(cy-py)+
         '" fill="none" stroke="'+MUTED+'" stroke-width="1.8"/>';
  }
  return g;
}
const loop = (cx, cy, r) => '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+
  SLATE+'" stroke-width="3"/>';
const tlab = (x, y, t, c, a) => '<text x="'+x+'" y="'+y+'" text-anchor="'+(a||"middle")+
  '" font-family="inherit" font-size="20" font-weight="700" fill="'+(c||MUTED)+'">'+t+'</text>';

/* the cloverleaf: acceptor stem up top, D and T arms out to the sides,
   anticodon hanging below — the layout everyone has already seen */
function clover(){
  const CX = 800, JY = 496;
  let g = '<g data-r="fold" opacity="0">';
  g += stem(CX, 396, CX, 470, 7);                       /* acceptor stem   */
  g += '<path d="M'+(CX-9)+' 396L'+(CX-34)+' 356M'+(CX+9)+' 396L'+(CX+34)+' 356" '+
       'fill="none" stroke="'+SLATE+'" stroke-width="3" stroke-linecap="round"/>';
  g += tlab(CX-52, 344, "5&#8242;", SLATE, "end") + tlab(CX+52, 344, "3&#8242; CCA", RED, "start");
  g += tlab(CX+128, 436, "acceptor stem");
  /* junction */
  g += '<path d="M'+CX+' 470V'+JY+'M'+CX+' '+JY+'H'+(CX-92)+'M'+CX+' '+JY+'H'+(CX+92)+
       'M'+CX+' '+JY+'V520" fill="none" stroke="'+SLATE+'" stroke-width="3" '+
       'stroke-linecap="round"/>';
  g += stem(CX-92, JY, CX-208, JY, 4) + loop(CX-244, JY, 30) + tlab(CX-244, JY+62, "D arm");
  g += stem(CX+92, JY, CX+208, JY, 5) + loop(CX+244, JY, 30) + tlab(CX+244, JY+62, "T arm");
  g += stem(CX, 520, CX, 630, 5) + loop(CX, 664, 32);
  g += tlab(CX, 726, "anticodon", RED);
  return g + '</g>';
}

function trnaMarkup(){
  const seg = (id,x0,x1,col,txt) =>
    '<g data-r="'+id+'">' +
      '<path d="M'+x0+' '+TYT+'H'+x1+'" stroke="'+col+'" stroke-width="9" ' +
        'stroke-linecap="round" fill="none" opacity="0.28"/>' +
      '<text x="'+((x0+x1)/2)+'" y="'+(TYT-30)+'" text-anchor="middle" font-family="inherit" ' +
        'font-size="23" font-weight="700" fill="'+col+'">'+txt+'</text></g>';
  return '<g data-r="dna">' +
      '<g fill="none" stroke="'+INK+'" stroke-width="3" stroke-linecap="round">' +
        '<path d="M'+TX0+' '+TYT+'H'+TX1+'"/><path d="M'+TX0+' '+TYB+'H'+TX1+'"/></g>' +
      seg("tprom", TX0, TP1, SLATE, "T7 promoter") +
      seg("tgene", TP1, TX1, INK, "tRNA gene, 76 bp") +
      '<path d="M'+TP1+' '+(TYB+16)+'V'+(TYB+40)+'" stroke="'+RED+'" stroke-width="3" '+
        'fill="none"/>' +
      '<text x="'+TP1+'" y="'+(TYB+66)+'" text-anchor="middle" font-family="inherit" '+
        'font-size="22" font-weight="700" fill="'+RED+'">+1 &#8212; must be G</text>' +
    '</g>' +
    /* the run-off note belongs to the transcript, not the template: above
       the duplex it crowded the gene label AND claimed something before
       anything had been made */
    '<text data-r="tend" opacity="0" x="'+(TX1+16)+'" y="'+(TYB+46)+'" text-anchor="end" '+
      'font-family="inherit" font-size="22" font-weight="700" fill="'+MUTED+
      '">the DNA stops here, so the RNA does too</text>' +
    '<path data-r="lin" fill="none" stroke="'+SLATE+'" stroke-width="3.4" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
    clover() + chrome(272, 848);
}

function trnaPaint(r, s){
  r.dna.setAttribute("opacity", n2(1 - s.fold));
  r.lin.setAttribute("d", rna(TP1, TP1 + (TX1-TP1)*clamp01(s.run), TRY));
  r.lin.setAttribute("opacity", n2(1 - s.fold));
  r.tend.setAttribute("opacity", n2(clamp01(s.run*2 - 0.7) * (1 - s.fold)));
  r.fold.setAttribute("opacity", n2(s.fold));
}

window.Deck.sequence("trna", function(slide){
  const S = [
    { s:{run:0,fold:0}, label:"A template you can order",
      note:"Here is what in vitro transcription is actually for. Say you want a transfer RNA — to feed an in vitro translation reaction, or to test an anticodon change, or because you are building a system that needs one. A tRNA is about seventy-six bases. That is short enough that you do not clone anything: the template is a T7 promoter followed by the gene, and you can build it from two ordered oligos annealed and filled in, or from a PCR. Two things carry over from the last slide. The base at plus one has to be a G, and tRNA genes very often start with one anyway, which is convenient. And the transcript ends where the DNA ends, so you make the template stop exactly at the last base of the tRNA — including the C C A on the three prime end, which is the part that gets charged with the amino acid.",
      desc:"A short double-stranded DNA template drawn as two parallel lines, divided into a T7 promoter on the left and a 76 base pair tRNA gene on the right, with a red marker at the junction reading plus one, must be G." },
    { s:{run:1,fold:0}, label:"Transcribe it",
      note:"Put it in a tube with T7 RNA polymerase and the four NTPs. It starts at plus one, runs the length of the gene, falls off the end, and goes back and does it again. What comes off is a single strand of about seventy-six bases, and one template will give you an enormous number of copies of it. Notice that at this point you have a line. The polymerase has no idea it has made anything in particular.",
      desc:"A blue wavy line, the RNA, grows from the plus one position rightwards until it reaches the end of the template, where a note reads: the DNA stops here, so the RNA does too." },
    { s:{run:1,fold:1}, label:"And then it folds itself",
      call:"the enzyme made a line — the sequence made the shape", callFill:SLATE,
      note:"And then it does the thing that makes RNA different from the DNA we have spent all lecture on. It folds. Bases pair back on themselves, and this molecule finds the cloverleaf: an acceptor stem at the top ending in C C A, where the amino acid goes; a D arm and a T arm out to the sides; and the anticodon hanging off the bottom, which is the end that reads the message. Nothing added that. No chaperone, no enzyme, no instruction beyond the sequence itself, which is why you can make a working tRNA in a tube from a piece of DNA and four nucleotides. And it is worth pausing on the difference: DNA is a duplex because it is paired with a partner strand, and its shape is essentially the same whatever the sequence says. RNA comes out single stranded, so its sequence is free to pair with itself, and what you get is a specific three-dimensional object. That is why RNA can be a catalyst, a guide, a switch — and why the enzymes in the next section have to deal with a molecule that has a shape.",
      desc:"The template and the linear RNA fade away and the transcript is redrawn folded into the classic tRNA cloverleaf: a base-paired acceptor stem at the top with a free 3-prime C C A end marked in red, a D arm to the left and a T arm to the right, each ending in a loop, and an anticodon stem hanging below ending in the anticodon loop, labelled in red." }
  ];
  return driver(mount(slide, trnaMarkup()), ["run","fold"], S, trnaPaint);
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
