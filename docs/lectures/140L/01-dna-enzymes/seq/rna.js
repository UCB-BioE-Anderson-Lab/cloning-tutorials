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
  const S = [
    { s:{prom:1,bub:0,open:1,nrna:0,bstart:P1,rlow:0}, label:"The address, spelled out",
      note:"Here is that address. The T7 promoter is seventeen bases, TAATACGACTCACTATA, and it is quoted on the non-template strand, the top one, because that is the strand the RNA will match. The polymerase does not start inside the promoter. It starts at the very next base, the G marked plus one. So the promoter is not the start of the transcript. It is the sign that tells you where the start is.",
      desc:"A double-stranded DNA written out as forty paired bases between two backbone lines. The first seventeen, TAATACGACTCACTATA, are bracketed on the top strand and labelled the recognition element, which stays duplex. A red marker labels the very next base, the G at plus one." },
    { s:{prom:1,bub:1,open:4,nrna:0,bstart:P1,rlow:0}, label:"Initiation — the bubble opens",
      note:"The polymerase clamps onto that seventeen-base element and melts the DNA just downstream of it. Notice which part opens. The recognition element itself stays double stranded. It has to, because it is what the enzyme is gripping. Only the region from plus one onward comes apart, and that opening is the transcription bubble. Nothing has been cut here. The two backbones are intact all the way across; they have simply come apart from one another.",
      desc:"The two strands separate over four base pairs just downstream of the promoter. The top strand and its bases arch upward and the bottom strand and its bases arch downward, opening a bubble, and both backbone lines run unbroken through it. The bracketed recognition element, ending at the A at minus one, stays paired." },
    { s:{prom:0,bub:1,open:8,nrna:6,bstart:P1,rlow:0}, label:"The first bases",
      call:"built on the bottom strand — so it comes out matching the top", callFill:SLATE,
      note:"It puts a nucleotide on that G and extends. There is no primer here and none was needed. The enzyme brought the first two nucleotides together itself, and from then on it is ordinary five prime to three prime extension. Be clear about which strand it is copying. The new chain is being built along the BOTTOM strand, the template, which is why it sits down there against it. And because it is complementary to the bottom strand it comes out reading the same as the top strand, which is exactly why we quote a promoter on the top strand in the first place. The one substitution is U wherever the top strand says T.",
      desc:"Inside the open bubble a new chain of six letters, G G G A G A, sits in a row of its own against the bottom strand, bracketed and labelled new RNA running five prime to three prime, with a half barb on its three prime end. It reads the same as the lifted top-strand bases above it. The bubble is now eight base pairs wide, so two melted template bases lie ahead of the growing end." },
    { s:{prom:0,bub:1,open:8,nrna:T7_RNA.length,bstart:31,rlow:1}, label:"It runs to the end",
      call:"the bubble never grew — it travelled", callFill:SLATE,
      note:"Now let it run. Watch the bubble rather than the transcript, because this is the thing to carry away: it is the same size it was. Eight base pairs, the whole way. It melts the duplex at its leading edge and lets it snap shut behind, so it travels rather than grows — and it has to, because unwinding the whole gene would cost far more than the enzyme has. The transcript is what accumulates. It has been peeled off the template as the duplex closed behind the bubble, which is why it is now lying free underneath rather than sitting against the bottom strand, and it is still anchored where it started, at plus one. Every base of it reads the same as the top strand, with U for T, exactly as promised.",
      desc:"The bubble has travelled to the far right end of the DNA without changing size, still eight base pairs wide, and the duplex behind it has closed completely. The full transcript now runs the whole width in a row of its own below the DNA, from plus one to the last base, still bracketed and labelled new RNA." },
    { s:{prom:0,bub:0,open:8,nrna:T7_RNA.length,bstart:31,rlow:1}, label:"Run-off: the RNA comes free",
      note:"And then the polymerase reaches the end of the DNA and simply falls off it. That is run-off transcription, and it is why linearising your template matters: whatever base is last on the DNA is the last base of your RNA. The duplex closes completely behind it, so the DNA is exactly as it was — nothing was consumed and nothing was cut. What you are left with is a free single-stranded RNA, and the enzyme goes back and does it again. One template, many transcripts, which is the whole reason in vitro transcription gives you so much material.",
      desc:"The bubble has closed and the DNA is a complete unbroken duplex again. The transcript lies below it as a free single-stranded RNA, its five prime end at plus one and a half barb on its three prime end." }
  ];
  return driver(mount(slide, t7Markup()), ["prom","bub","open","nrna","bstart","rlow"], S, t7Paint);
});

/* ================================================================== *
 * 4.  guide — the practical vignette: making a CRISPR guide RNA.
 *
 * This is what in vitro transcription is actually FOR in a class like
 * this one, and it pays off the previous slide directly. The +1 has to
 * be a G, which is why guide RNAs are designed to start with one. The
 * transcript's 3' end is wherever the DNA stops, so the template is
 * made to stop exactly at the end of the scaffold. And the template is
 * short enough to build from two ordered oligos, which is the overlap
 * extension the polymerase section already taught.
 *
 * Drawn to rough scale: the spacer really is about a fifth of a ~100 nt
 * guide, and the picture should not imply otherwise, because the whole
 * practical point is how little of it you design.
 * ================================================================== */
const GX0 = 210, GP1 = 470, GSP = 654, GX1 = 1390;   /* promoter | spacer | scaffold */
const GYT = 372, GYB = 424;                          /* the template duplex          */
const GRY = 604, GRY2 = 690;                         /* the RNA, made and then free  */

function guideMarkup(){
  const seg = (id,x0,x1,col,txt,y) =>
    '<g data-r="'+id+'">' +
      '<path d="M'+x0+' '+y+'H'+x1+'" stroke="'+col+'" stroke-width="9" ' +
        'stroke-linecap="round" fill="none" opacity="0.28"/>' +
      '<text x="'+((x0+x1)/2)+'" y="'+(y-30)+'" text-anchor="middle" font-family="inherit" ' +
        'font-size="23" font-weight="700" fill="'+col+'">'+txt+'</text></g>';
  return '<g fill="none" stroke="'+INK+'" stroke-width="3" stroke-linecap="round">' +
      '<path data-r="dt"/><path data-r="db"/></g>' +
    seg("gprom", GX0, GP1, SLATE, "T7 promoter", GYT) +
    seg("gspac", GP1, GSP, RED,  "your 20 nt", GYT) +
    seg("gscaf", GSP, GX1, INK,  "scaffold &#8212; always the same", GYT) +
    /* +1 has to be a G: that is the previous slide, cashed in */
    '<g data-r="gp1" opacity="0">' +
      '<path d="M'+GP1+' '+(GYB+16)+'V'+(GYB+40)+'" stroke="'+RED+'" stroke-width="3" ' +
        'fill="none"/>' +
      '<text x="'+GP1+'" y="'+(GYB+66)+'" text-anchor="middle" font-family="inherit" ' +
        'font-size="23" font-weight="700" fill="'+RED+'">+1 &#8212; must be G</text></g>' +
    '<g data-r="gend" opacity="0">' +
      '<text x="'+(GX1+16)+'" y="'+(GYT-64)+'" text-anchor="end" font-family="inherit" ' +
        'font-size="23" font-weight="700" fill="'+MUTED+'">the DNA stops here, so the RNA does too</text></g>' +
    '<path data-r="grna" fill="none" stroke="'+SLATE+'" stroke-width="3.4" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
    '<g data-r="gparts" opacity="0" font-family="inherit" font-size="23" font-weight="700">' +
      '<path d="M'+GP1+' '+(GRY2+34)+'v12H'+GSP+'v-12" fill="none" stroke="'+RED+
        '" stroke-width="2.6"/>' +
      '<text x="'+((GP1+GSP)/2)+'" y="'+(GRY2+78)+'" text-anchor="middle" fill="'+RED+
        '">spacer</text>' +
      '<path d="M'+GSP+' '+(GRY2+34)+'v12H'+GX1+'v-12" fill="none" stroke="'+MUTED+
        '" stroke-width="2.6"/>' +
      '<text x="'+((GSP+GX1)/2)+'" y="'+(GRY2+78)+'" text-anchor="middle" fill="'+MUTED+
        '">scaffold</text></g>' +
    chrome(276, 856);
}

function guidePaint(r, s){
  /* the template fades out once the RNA is free -- it was never consumed,
     it is just no longer the subject */
  const dna = 1 - 0.72*s.free;
  r.dt.setAttribute("d", "M"+GX0+" "+GYT+"H"+GX1);
  r.db.setAttribute("d", "M"+GX0+" "+GYB+"H"+GX1);
  ["dt","db","gprom","gspac","gscaf"].forEach(k =>
    r[k].setAttribute("opacity", n2(k==="dt"||k==="db" ? dna : 0.28+0.72*(1-s.free))));
  r.gp1  .setAttribute("opacity", n2(clamp01(s.p1)));
  r.gend .setAttribute("opacity", n2(clamp01(s.run*2 - 0.6) * (1-s.free)));
  const y = GRY + (GRY2-GRY)*s.free;
  r.grna .setAttribute("d", rna(GP1, GP1 + (GX1-GP1)*clamp01(s.run), y));
  r.gparts.setAttribute("opacity", n2(s.free));
}

window.Deck.sequence("guide", function(slide){
  const S = [
    { s:{p1:1,run:0,free:0}, label:"The template: mostly the same every time",
      note:"Here is what in vitro transcription is actually for in a lab like this one. You want a CRISPR guide RNA. A guide is about a hundred bases, and only twenty of them are yours — the spacer, the part that matches your target. Everything after it is the scaffold that Cas9 grips, and it is identical in every guide anyone has ever made. So the template you need is a T7 promoter, then your twenty bases, then the constant scaffold. That is short enough that you do not clone it. You order two oligos that overlap, anneal them, and fill in with a polymerase — the overlap extension we did with Klenow earlier — or you run a PCR. And notice the base at plus one. The previous slide told you T7 starts on a G, and that is not a detail you can ignore here: it is why guide spacers are chosen to begin with a G, or a G is simply added on the front.",
      desc:"A short double-stranded DNA template drawn as two parallel lines, divided into three labelled regions: a T7 promoter in blue on the left, your 20 nucleotides in red in the middle, and the constant scaffold in black on the right. A red marker under the boundary between promoter and spacer reads plus one, must be G." },
    { s:{p1:1,run:1,free:0}, label:"Transcribe it",
      note:"Put that template in a tube with T7 RNA polymerase and the four NTPs and it runs. It starts at plus one, so the promoter itself is not in the product, and it runs to the end of the DNA and falls off. That is the whole reason the template is made to stop exactly where the scaffold stops: run-off means the last base of the DNA is the last base of your RNA, so the end of the molecule is something you built rather than something you hope for. And one template gets read over and over — that is why a twenty microlitre reaction gives you far more guide than a cell ever would.",
      desc:"A blue wavy line, the RNA, grows from the plus one position rightwards along the template until it reaches the far end, where a note reads: the DNA stops here, so the RNA does too." },
    { s:{p1:0,run:1,free:1}, label:"One guide \u2014 and one oligo to change it"   /* label is textContent: no entities */,
      call:"the next guide is the same reaction with twenty different bases", callFill:SLATE,
      note:"And there is your guide RNA, free in the tube: about a hundred bases, spacer at the five prime end, scaffold behind it. Mix it with Cas9 and it loads, and the spacer is what goes looking for your target. Now look at what you would change to target something else. Not the promoter, not the scaffold, not the reaction, not the enzyme. Twenty bases in one ordered oligo. That is why guide RNAs are made this way and not cloned, and it is a fair summary of what T7 is for: you own a promoter the cell cannot read, and you can turn a designed sequence into a lot of defined RNA in an afternoon.",
      desc:"The DNA template has faded back and the finished RNA sits free below it, its two parts bracketed and named: a short spacer in red at the 5-prime end and the long constant scaffold behind it." }
  ];
  return driver(mount(slide, guideMarkup()), ["p1","run","free"], S, guidePaint);
});


})();
