/* ------------------------------------------------------------------ *
 * rna.js — the RNA polymerase section.
 *
 * Registers:  denovo    extension vs. de novo initiation      (2 steps)
 *             t7prom    the T7 promoter and the +1 site       (3 steps)
 *             elong     the transcription bubble moving       (2 steps)
 *             runoff    run-off transcription                 (3 steps)
 *
 * t7prom is a copy of the "t7rnap" sequence in linear.js, kept here so
 * this section can be edited without touching a file the DNA-polymerase
 * section also loads.  The sequence, the strand assignment and the +1
 * position are reproduced EXACTLY; only the step list changed (the
 * release step moved onto the run-off slide, where it is the point).
 *
 * Level of iconography, deliberately, one per slide:
 *     denovo   line     only topology matters — an end exists, or it doesn't
 *     t7prom   letters  a POSITION matters: -17..-1, then +1
 *     elong    line     motion and topology
 *     runoff   line     whole-molecule topology: a circle, or a line
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
  const openN = Math.max(1, Math.round(s.open));
  const hi = P1 + openN - 1;
  const xL = sx(P1) - HC, xR = Math.max(xL + SSTEP, sx(P1) + (s.open - 0.5)*SSTEP);
  const yTop = BBT - LIFT*s.bub, yBot = BBB + DROP*s.bub;

  r.bbt.setAttribute("d", bbPath(BBT, yTop, xL, xR));
  r.bbb.setAttribute("d", bbPath(BBB, yBot, xL, xR));

  for (let i = 0; i < T7_TOP.length; i++){
    const open = (i >= P1 && i <= hi);
    r["t"+i].setAttribute("y", n2((YT + 9) - (open ? LIFT*s.bub : 0)));
    r["b"+i].setAttribute("y", n2((YB + 9) + (open ? DROP*s.bub : 0)));
  }

  r.prom  .setAttribute("opacity", n2(s.prom));
  r.plus1 .setAttribute("opacity", (s.prom > 0.02 || s.bub > 0.02) ? "1" : "0");
  r.p1tick.setAttribute("d", "M" + sx(P1) + " " + n2(yTop-16) + "V" + n2(yTop-36));
  r.p1lab .setAttribute("y", n2(yTop - 44));

  /* the RNA row: letters appear one at a time, 5' anchored at +1 */
  const nInt = Math.max(1, Math.ceil(s.nrna));
  r.rnag.setAttribute("opacity", n2(clamp01(s.nrna)));
  for (let i = 0; i < T7_RNA.length; i++)
    r["r"+i].setAttribute("opacity", n2(clamp01(s.nrna - i)));
  const tail = sx(P1 + nInt - 1);
  r.rbarb.setAttribute("d", s.nrna > 0.5 ? strand(tail+16, RNAY-9, tail+44, RNAY-9) : "");
  r.rbrk .setAttribute("d", "M" + n2(sx(P1)-HC) + " " + (RNAY-32) +
                            "v-12H" + n2(tail+HC) + "v12");
  r.rlab .setAttribute("x", n2((sx(P1) - HC + tail + HC)/2));
}

window.Deck.sequence("t7prom", function(slide){
  const S = [
    { s:{prom:1,bub:0,open:1,nrna:0}, label:"The address, spelled out",
      note:"Here is that address. The T7 promoter is seventeen bases, TAATACGACTCACTATA, and it is quoted on the non-template strand, the top one, because that is the strand the RNA will match. The polymerase does not start inside the promoter. It starts at the very next base, the G marked plus one. So the promoter is not the start of the transcript. It is the sign that tells you where the start is.",
      desc:"A double-stranded DNA written out as forty paired bases between two backbone lines. The first seventeen, TAATACGACTCACTATA, are bracketed on the top strand and labelled the recognition element, which stays duplex. A red marker labels the very next base, the G at plus one." },
    { s:{prom:1,bub:1,open:4,nrna:0}, label:"Initiation — the bubble opens",
      note:"The polymerase clamps onto that seventeen-base element and melts the DNA just downstream of it. Notice which part opens. The recognition element itself stays double stranded. It has to, because it is what the enzyme is gripping. Only the region from plus one onward comes apart, and that opening is the transcription bubble. Nothing has been cut here. The two backbones are intact all the way across; they have simply come apart from one another.",
      desc:"The two strands separate over four base pairs just downstream of the promoter. The top strand and its bases arch upward and the bottom strand and its bases arch downward, opening a bubble, and both backbone lines run unbroken through it. The bracketed recognition element, ending at the A at minus one, stays paired." },
    { s:{prom:0,bub:1,open:8,nrna:6}, label:"The first bases",
      call:"built on the bottom strand — so it comes out matching the top", callFill:SLATE,
      note:"It puts a nucleotide on that G and extends. There is no primer here and none was needed. The enzyme brought the first two nucleotides together itself, and from then on it is ordinary five prime to three prime extension. Be clear about which strand it is copying. The new chain is being built along the BOTTOM strand, the template, which is why it sits down there against it. And because it is complementary to the bottom strand it comes out reading the same as the top strand, which is exactly why we quote a promoter on the top strand in the first place. The one substitution is U wherever the top strand says T.",
      desc:"Inside the open bubble a new chain of six letters, G G G A G A, sits in a row of its own against the bottom strand, bracketed and labelled new RNA running five prime to three prime, with a half barb on its three prime end. It reads the same as the lifted top-strand bases above it. The bubble is now eight base pairs wide, so two melted template bases lie ahead of the growing end." }
  ];
  return driver(mount(slide, t7Markup()), ["prom","bub","open","nrna"], S, t7Paint);
});

/* ================================================================== *
 * 3.  elong — the bubble travels.
 *
 * Back to a line, because now only motion and topology matter.  The
 * bubble is a constant size: it melts at the leading edge and closes at
 * the trailing edge, and the RNA leaves single-stranded out of the back.
 * ================================================================== */
const EXL = 170, EXR = 1440, EY1 = 600, EY2 = 672;
const EW = 105, EH = 30;                /* bubble half-width, lens height  */
const ERY = 470, EANCHOR = 300;         /* the RNA and where its 5' end is */

function elongMarkup(){
  return '<g data-r="env"><ellipse data-r="envq" cx="640" cy="636" rx="178" ry="132" ' +
      'fill="'+SLATE+'" fill-opacity="0.10" stroke="'+SLATE+'" stroke-opacity="0.55" ' +
      'stroke-width="3"/></g>' +
    '<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.2">' +
      '<path data-r="top" stroke="'+INK+'"/>' +
      '<path data-r="bot" stroke="'+INK+'"/>' +
      '<path data-r="orna" stroke="'+SLATE+'"/>' +
      '<path data-r="lead" stroke="'+SLATE+'" stroke-width="2.8"/>' +
      '<path data-r="trail" stroke="'+SLATE+'" stroke-width="2.8"/>' +
    '</g>' +
    '<g font-family="inherit" font-weight="700" font-size="27">' +
      '<text data-r="melt" y="822" text-anchor="start" fill="'+SLATE+'">melts ahead</text>' +
      '<text data-r="close" y="822" text-anchor="end" fill="'+SLATE+'">closes behind</text>' +
      '<text x="'+EANCHOR+'" y="422" fill="'+SLATE+'">RNA</text>' +
      '<text x="'+(EANCHOR-34)+'" y="'+(ERY+9)+'" text-anchor="end" font-family="ui-monospace,' +
        'SFMono-Regular,Menlo,monospace" font-size="24" fill="'+INK+'">5&#8242;</text>' +
    '</g>' +
    '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="24" fill="'+INK+'">' +
      '<text x="'+(EXL-38)+'" y="'+(EY1+9)+'">5&#8242;</text>' +
      '<text x="'+(EXR+16)+'" y="'+(EY1+9)+'">3&#8242;</text>' +
      '<text x="'+(EXL-38)+'" y="'+(EY2+9)+'">3&#8242;</text>' +
      '<text x="'+(EXR+16)+'" y="'+(EY2+9)+'">5&#8242;</text>' +
    '</g>' +
    chrome(318, 872);
}

function elongPaint(r, s){
  const c = s.cx, l = c - EW, rr = c + EW;
  r.top.setAttribute("d",
    "M"+n2(EXL)+" "+EY1+"H"+n2(l) +
    "C"+n2(l+34)+" "+(EY1-EH)+" "+n2(rr-34)+" "+(EY1-EH)+" "+n2(rr)+" "+EY1 +
    "H"+EXR + barb(rr, EY1, EXR, EY1));
  r.bot.setAttribute("d",
    "M"+EXR+" "+EY2+"H"+n2(rr) +
    "C"+n2(rr-34)+" "+(EY2+EH)+" "+n2(l+34)+" "+(EY2+EH)+" "+n2(l)+" "+EY2 +
    "H"+n2(EXL) + barb(l, EY2, EXL, EY2));

  /* The RNA: 5' end pinned where transcription began; the 3' end dives
     through the enzyme to the LOWER arc, because the bottom strand is the
     template.  Ending it on the upper arc said the opposite.             */
  const tipx = c - 104, w = wave(EANCHOR, tipx, ERY);
  const tx = c - 16, ty = EY2 + 8;              /* against the template arc */
  r.orna.setAttribute("d", w.d
    ? w.d + "C" + n2(tipx+58) + " " + n2(w.ty) + " " + n2(c-52) + " " + (EY1-4) +
            " " + n2(tx) + " " + n2(ty) +
            barb(c-34, EY1+34, tx, ty) : "");

  r.envq.setAttribute("cx", n2(c));
  r.lead .setAttribute("d", "M"+n2(rr)+" "+(EY2+EH+8)+"V794");
  r.trail.setAttribute("d", "M"+n2(l)+" "+(EY2+EH+8)+"V794");
  r.melt .setAttribute("x", n2(rr + 14));
  r.close.setAttribute("x", n2(l - 14));
}

window.Deck.sequence("elong", function(slide){
  const S = [
    { s:{cx:620}, label:"Elongation",
      note:"Once it is past the promoter the enzyme settles into a steady state, and this is the picture worth carrying away. It holds open a bubble of about eight base pairs. Ahead of it the duplex is melted; behind it the two strands snap back together. The bubble does not grow. It travels.",
      desc:"A double-stranded DNA drawn as two lines with a lens-shaped bubble opened in the middle and an enzyme drawn as a pale oval around the bubble. A wavy line labelled RNA runs back to the left out of the enzyme, its five prime end free; inside the bubble its three prime end curves down to lie against the lower strand, the template." },
    { s:{cx:1120}, label:"Elongation",
      note:"Watch what stays behind. The DNA closes back into a full duplex, completely undamaged, which is why one template can be transcribed over and over. What comes out is the RNA, and it comes out single stranded. It does not stay paired to the template. That is the product you are actually making.",
      desc:"The bubble and the enzyme have travelled a long way to the right. The DNA behind them has closed back into an unbroken duplex, and the wavy RNA line is now much longer, still anchored at the same five prime end on the left, its growing three prime end still down against the lower template strand." }
  ];
  return driver(mount(slide, elongMarkup()), ["cx"], S, elongPaint);
});

/* ================================================================== *
 * 4.  runoff — the practical vignette.
 *
 * Two scenes cross-faded, because the topology cannot be tweened: an
 * uncut circular plasmid, and the same plasmid linearised.  The point is
 * that T7 RNAP stops when it falls off the end of the DNA, so the end of
 * the DNA is what gives the transcript a defined 3' end.
 * ================================================================== */
const CX = 420, CY = 566, CR = 150;     /* the plasmid */
const LXL = 170, LXR = 800, LY1 = 546, LY2 = 604, LRY = 498;
const PROM_A = 190, PROM_B = 320;       /* the promoter bracket ... */
const TSS = PROM_B;                     /* ... whose right edge is +1 */
const PANX = 940;                       /* the product panel */

/* The enzyme is an ENVELOPE around the DNA, as on the elongation slide —
   large enough that both strands run through it and stay readable, rather
   than a disc sitting on top of them. */
function polyMark(id){
  return '<ellipse data-r="'+id+'" rx="46" ry="52" fill="'+SLATE+'" fill-opacity="0.10" ' +
         'stroke="'+SLATE+'" stroke-opacity="0.55" stroke-width="3"/>';
}

function runoffMarkup(){
  let g = '<g data-r="circ" opacity="1">' +
    '<circle cx="'+CX+'" cy="'+CY+'" r="'+CR+'" fill="none" stroke="'+INK+'" stroke-width="3.2"/>' +
    '<path d="M'+CX+' '+(CY-CR+62)+'V'+(CY-CR+12)+'" fill="none" stroke="'+SLATE+'" stroke-width="3"/>' +
    '<text x="'+CX+'" y="'+(CY-CR+84)+'" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="27" fill="'+SLATE+'">T7 promoter</text>' +
    '<path data-r="spiral" fill="none" stroke="'+SLATE+'" stroke-width="3.2" ' +
      'stroke-linecap="round"/>' +
    polyMark("cpol") +
  '</g>';

  g += '<g data-r="lin" opacity="0">' +
    '<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.2">' +
      '<path d="'+strand(LXL, LY1, LXR, LY1)+'" stroke="'+INK+'"/>' +
      '<path d="'+strand(LXR, LY2, LXL, LY2)+'" stroke="'+INK+'"/>' +
      /* a bracket, not a tick: the promoter is a stretch of sequence, and
         its right-hand edge is where transcription actually starts */
      '<path d="M'+PROM_A+' '+(LY2+40)+'V'+(LY2+52)+'H'+PROM_B+'V'+(LY2+40)+'" ' +
        'stroke="'+SLATE+'" stroke-width="2.8"/>' +
      '<path data-r="lrna" stroke="'+SLATE+'"/>' +
    '</g>' +
    '<text x="'+((PROM_A+PROM_B)/2)+'" y="'+(LY2+88)+'" text-anchor="middle" ' +
      'font-family="inherit" font-weight="700" font-size="27" fill="'+SLATE+'">T7 promoter</text>' +
    '<path d="M'+LXR+' '+(LY2+30)+'V'+(LY2+52)+'" fill="none" stroke="'+RED+'" stroke-width="3"/>' +
    '<text x="'+LXR+'" y="'+(LY2+88)+'" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="27" fill="'+RED+'">cut end</text>' +
    '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="24" fill="'+INK+'">' +
      '<text x="'+(LXL-38)+'" y="'+(LY1+9)+'">5&#8242;</text>' +
      '<text x="'+(LXR+18)+'" y="'+(LY1+9)+'">3&#8242;</text>' +
      '<text x="'+(LXL-38)+'" y="'+(LY2+9)+'">3&#8242;</text>' +
      '<text x="'+(LXR+18)+'" y="'+(LY2+9)+'">5&#8242;</text>' +
      '<text data-r="l5" x="'+(TSS-22)+'" y="'+(LRY+9)+'" text-anchor="end" ' +
        'opacity="0">5&#8242;</text>' +
    '</g>' +
    polyMark("lpol") +
  '</g>';

  /* the product: three molecules, ragged or identical */
  g += '<g data-r="het" opacity="0">' +
    '<g fill="none" stroke="'+SLATE+'" stroke-width="3.2" stroke-linecap="round">' +
      '<path d="'+rna(PANX, PANX+470, 430)+'"/>' +
      '<path d="'+rna(PANX, PANX+250, 512)+'"/>' +
      '<path d="'+rna(PANX, PANX+366, 594)+'"/>' +
    '</g>' +
    /* Verdict in WORDS, not in colour: both panels use the same ink, and
       "no" against "a" is what tells them apart (WCAG 1.4.1). */
    '<text x="'+PANX+'" y="676" font-family="inherit" font-weight="700" font-size="28" ' +
      'fill="'+INK+'">no defined 3&#8242; end &#8212; a smear on a gel</text>' +
  '</g>';
  g += '<g data-r="def" opacity="0">' +
    '<g fill="none" stroke="'+SLATE+'" stroke-width="3.2" stroke-linecap="round">' +
      '<path d="'+rna(PANX, PANX+366, 430)+'"/>' +
      '<path d="'+rna(PANX, PANX+366, 512)+'"/>' +
      '<path d="'+rna(PANX, PANX+366, 594)+'"/>' +
    '</g>' +
    '<text x="'+PANX+'" y="676" font-family="inherit" font-weight="700" font-size="28" ' +
      'fill="'+INK+'">a defined 3&#8242; end &#8212; a single band</text>' +
  '</g>';
  return g + chrome(318, 856);
}

function runoffPaint(r, s){
  r.circ.setAttribute("opacity", n2(s.circ));
  r.lin .setAttribute("opacity", n2(s.lin));
  r.het .setAttribute("opacity", n2(s.het));
  r.def .setAttribute("opacity", n2(s.def));

  /* the spiral: angle sweeps clockwise from the promoter at 12 o'clock,
     radius grows so successive laps never overlap */
  let d = "";
  for (let t = 0; t <= s.wind; t += 0.07){
    const a = -Math.PI/2 + t, rr = CR + 18 + 6.5*t;
    d += (t === 0 ? "M" : "L") +
         n2(CX + rr*Math.cos(a)) + " " + n2(CY + rr*Math.sin(a));
  }
  const ae = -Math.PI/2 + s.wind, re = CR + 18 + 6.5*s.wind;
  const ex = CX + re*Math.cos(ae), ey = CY + re*Math.sin(ae);
  const ab = ae - 0.1, rb = CR + 18 + 6.5*(s.wind - 0.1);
  d += "L" + n2(ex) + " " + n2(ey);
  r.spiral.setAttribute("d", s.wind > 0.15
    ? d + barb(CX + rb*Math.cos(ab), CY + rb*Math.sin(ab), ex, ey) : "");
  r.cpol.setAttribute("cx", n2(CX + CR*Math.cos(ae)));
  r.cpol.setAttribute("cy", n2(CY + CR*Math.sin(ae)));

  /* the linear scene: the enzyme starts at +1, runs to the cut end, falls off */
  const px2 = TSS + s.run*(LXR + 74 - TSS);
  r.lpol.setAttribute("cx", n2(px2));
  r.lpol.setAttribute("cy", n2((LY1+LY2)/2));
  r.lpol.setAttribute("opacity", n2(1 - clamp01((s.run - 0.86)/0.14)));
  r.lrna.setAttribute("d", rna(TSS, Math.min(LXR, px2), LRY));
  r.l5  .setAttribute("opacity", n2(clamp01(s.run*4)));
}

window.Deck.sequence("runoff", function(slide){
  const S = [
    { s:{circ:1,lin:0,wind:1.2,run:0,het:0,def:0}, label:"An uncut plasmid",
      note:"Here is how this bites people. You want RNA, so you clone your insert behind a T7 promoter and you put the plasmid straight into a transcription reaction. The polymerase finds the promoter and starts. So far so good.",
      desc:"A circular plasmid drawn as a black circle with a tick at the top labelled T7 promoter. A pale enzyme envelope wrapped round the DNA has moved part of the way round the circle, trailing a wavy line outside it." },
    { s:{circ:1,lin:0,wind:14.6,run:0,het:1,def:0}, label:"Nothing tells it to stop",
      call:"a smear, not a band — and a week gone", callFill:RED,
      note:"But nothing tells it to stop. A plasmid is a circle, there is no T7 terminator on it, and so the polymerase comes back round to the promoter and keeps going. Every enzyme in the tube falls off at a different, random point. What you get is RNA of every length, and on a gel that is a smear rather than a band. If your RNA has to be a defined molecule, a guide RNA, an mRNA, a ribozyme, this product is useless.",
      desc:"The polymerase has gone round the circle several times and the wavy RNA has spiralled outward into many turns. Beside it, three wavy RNA molecules of three different lengths, labelled: no defined three prime end, a smear on a gel." },
    { s:{circ:0,lin:1,wind:14.6,run:0,het:0,def:0}, label:"Linearise first",
      note:"The fix is to cut the plasmid before you transcribe it. Pick a single cutter downstream of the insert and digest to completion. Completion matters, because whatever fraction is left uncut goes on producing the smear. Choose the enzyme with some care as well. Leave a blunt end or a five prime overhang. If you leave a three prime overhang, T7 polymerase can initiate at that protruding end and transcribe back along the opposite strand. The antisense RNA it makes then anneals with the transcript you actually wanted, and the double-stranded RNA you end up with is immunogenic and ruins most of what you would want to do downstream.",
      desc:"The circle has been replaced by a linear double-stranded DNA. A bracket near the left end marks the T7 promoter, and a red tick at the right end marks the cut end. The enzyme, drawn as a pale envelope wrapped round both strands, sits at the right-hand edge of that bracket, where transcription starts. No RNA has been made yet." },
    { s:{circ:0,lin:1,wind:14.6,run:1,het:0,def:1}, label:"Run-off transcription",
      call:"the end of the DNA sets the end of the RNA", callFill:SLATE,
      note:"Now the polymerase transcribes to the end of the template and simply runs off, because there is no more DNA to hold on to. That is what run-off transcription means, and it is why the transcript has a defined three prime end even though there is no terminator anywhere in the construct. The end of the DNA is the end of the RNA. Every molecule in the tube is the same length and you get a band.",
      desc:"The enzyme has travelled the length of the DNA and gone off the right-hand end, leaving a wavy RNA that begins at the edge of the promoter bracket and stops exactly at the cut end, with a half barb on its three prime end. Beside it, three wavy RNA molecules all of identical length, labelled: a defined three prime end, a single band." }
  ];
  return driver(mount(slide, runoffMarkup()),
                ["circ","lin","wind","run","het","def"], S, runoffPaint);
});

})();
