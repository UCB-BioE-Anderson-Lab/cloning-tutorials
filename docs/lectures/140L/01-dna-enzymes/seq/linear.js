/* ------------------------------------------------------------------ *
 * linear.js — the horizontal duplex diagrams and their animations.
 *
 * Registers:   exo53         5'->3' exonuclease activity   (3 steps)
 *              displacement  strand displacement            (2 steps)
 *              exo35         3'->5' proofreading            (1 step)
 *
 * Convention: every 3' end carries a HALF BARB, laid back from the tip
 * on the outer side of the duplex.  Pre-existing DNA is black; newly
 * synthesised strand (or RNA) is blue.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const XL = 190, XR = 1420, YT = 560, YB = 615, YF = 450;
const BARB = 26, BW = 0.49;
const GAP = 30;             // nick: never let two molecules touch end to end
const INK = "#111111", SLATE = "#004373", RED = "#ba3a13";
const SVGNS = "http://www.w3.org/2000/svg";
const n2 = v => Math.round(v*10)/10;

/* A strand from (x1,y1) to (x2,y2); the 3' tip is (x2,y2). */
function strand(x1,y1,x2,y2){
  if (Math.abs(x2-x1) < 1 && Math.abs(y2-y1) < 1) return "";
  const th = Math.atan2(y1-y2, x1-x2);            // angle of -travel
  const bx = x2 + BARB*Math.cos(th + BW), by = y2 + BARB*Math.sin(th + BW);
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2)+
         "M"+n2(bx)+" "+n2(by)+"L"+n2(x2)+" "+n2(y2);
}
function plain(x1,y1,x2,y2){
  if (Math.abs(x2-x1) < 1) return "";
  return "M"+n2(x1)+" "+n2(y1)+"L"+n2(x2)+" "+n2(y2);
}

function svg(slide, extra){
  const s = document.createElementNS(SVGNS,"svg");
  s.setAttribute("viewBox","0 0 1600 900");
  s.setAttribute("aria-hidden","true");
  s.setAttribute("style","position:absolute;inset:0;pointer-events:none");
  s.innerHTML =
    '<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3">' +
      '<path data-r="tmplt" stroke="'+INK+'"/>' +
      '<path data-r="grow"  stroke="'+SLATE+'"/>' +
      '<path data-r="block" stroke="'+INK+'"/>' +
      '<path data-r="flap"  stroke="'+INK+'"/>' +
      '<path data-r="extra" stroke="'+SLATE+'"/>' +  /* rung 1: what to follow */
      (extra || "") +
    '</g>' +
    /* Caption band: one bold line naming what happened, one quieter line
       under it. The quiet line is either the muted annotation (`sub`) or,
       on a step that poses a question, the red call-out (`call`) in its
       place: never both, so the block is always exactly two lines. */
    '<text data-r="label" x="800" y="706" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="30" fill="'+INK+'"></text>' +
    '<text data-r="sub" x="800" y="752" text-anchor="middle" font-family="inherit" ' +
      'font-size="26" fill="#767676"></text>' +
    '<text data-r="call" x="800" y="752" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="30" fill="'+RED+'" opacity="0"></text>';
  slide.appendChild(s);
  const r = {};
  s.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);
  return r;
}

/* Shared tween ---------------------------------------------------- */
function driver(r, keys, steps, paint){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = Object.assign({}, steps[0].s), raf = null;
  function go(i, animated){
    const to = steps[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.label.textContent = steps[i].label || "";
    r.sub  .textContent = steps[i].call ? "" : (steps[i].sub || "");
    r.call .textContent = steps[i].call  || "";
    r.call .setAttribute("opacity", steps[i].call ? "1" : "0");
    if (animated === false || reduce.matches){
      cur = Object.assign({}, to); paint(r, cur); return;
    }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 700;
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

/* ---------------------------------------------------- 5'->3' exo --- */
const EXO_KEYS = ["a","b"];
function exoPaint(r, s){
  r.tmplt.setAttribute("d", strand(XR, YB, XL, YB));       // template, 3' at left
  r.grow .setAttribute("d", strand(XL, YT, s.a, YT));      // new strand, 3' at right
  // the downstream strand starts a nick's width ahead of the polymerase,
  // so the two never read as one contiguous molecule
  const b = s.b + GAP;
  r.block.setAttribute("d", b < XR - 2 ? strand(b, YT, XR, YT) : "");
  r.flap .setAttribute("d", "");
  r.extra.setAttribute("d", "");
}
/* This slide, and only this slide, opens on the bare substrate and spends
   a click getting to the collision -- because it is the first time the
   audience meets this three-strand arrangement, and watching the oligo run
   forward is what makes the collision feel inevitable rather than staged.
   Every later slide reuses the arrangement and starts at the collision. */
window.Deck.sequence("exo53", function(slide){
  const B0 = 900, P0 = 400;
  const S = [
    { s:{a:P0,b:B0},
      label:"a short oligo annealed, and a strand already downstream",
      /* r.sub is set with textContent, which does not decode entities */
      sub:"one recessed 3′ end; any polymerase will extend it",
      note:"Suppose we have this DNA: three polynucleotides annealed together, leaving a single recessed three prime end. That is the substrate we just drew atom by atom, now at the level of abstraction we will use for the rest of the lecture. There is a short oligo on the left with a free three prime end, there is template underneath it running the whole way, and there is another strand already sitting downstream. Any DNA polymerase will extend that recessed end.",
      desc:"A template strand runs the width of the slide. Above it on the left sits a short annealed oligo with a half barb marking its free 3-prime end, and further right a separate downstream strand occupies the rest of the template. A caption reads: a short oligo annealed, and a strand already downstream." },
    { s:{a:B0,b:B0},
      label:"the polymerase runs into the downstream strand",
      call:"Now what?",
      note:"And it runs forward until it collides with the strand already sitting downstream. Nothing so far distinguishes one polymerase from another: every one of them does this. What happens at that collision is what does.",
      desc:"The oligo has been extended to the right until it reaches the downstream blocking strand, leaving only a nick between them. A bold caption reads: the polymerase runs into the downstream strand. A red line asks: Now what?" },
    { s:{a:XR,b:XR},
      label:"it degrades the strand in front of it",
      sub:"the downstream strand is replaced, base for base, by new synthesis",
      note:"If the polymerase has 5' to 3' exonuclease activity it simply chews the blocking strand up as it goes, and that strand is entirely replaced by new synthesis. Nothing is displaced and nothing is left over: you end with one strand where there were two. This is what nick translation is, and it is why Taq will destroy a probe sitting in its path.",
      desc:"The downstream strand has been degraded away entirely. One continuous new strand now spans the whole template. The caption reads: it degrades the strand in front of it." }
  ];
  return driver(svg(slide), EXO_KEYS, S, exoPaint);
});

/* ------------------------------------------------ displacement ----- */
const DISP_KEYS = ["a","released"];
/* Where the released strand parks. It is a whole molecule on its own now,
   so it is drawn its own full length and deliberately offset from BOTH
   ends of the duplex — a free strand whose left end lined up with the
   middle of the duplex read as a strand branching out of mid-air. Its 5'
   end is labelled and its 3' end carries the half barb, so both ends are
   visibly ends. */
const FREE_L = 560, FREE_R = 1080;
const DISP_EXTRA = '<text data-r="fpr" x="' + (FREE_L - 26) + '" y="' + (YF + 9) +
  '" text-anchor="end" font-family="inherit" font-size="26" font-weight="700" ' +
  'stroke="none" fill="' + RED + '" opacity="0">5&#8242;</text>';

function dispPaint(r, s){
  const B0 = 900;                       // the downstream strand's own 5' end
  r.tmplt.setAttribute("d", strand(XR, YB, XL, YB));
  r.grow .setAttribute("d", strand(XL, YT, s.a, YT));
  // The downstream strand is NOT degraded here — it stays put until the
  // polymerase actually reaches it, then gets peeled off from its 5' end.
  // (Tying its start to s.a would shrink it as the enzyme approached,
  // which is exonuclease behaviour, not displacement.)
  const peeled = Math.max(0, s.a - B0);
  const fork = B0 + GAP + peeled;       // still-annealed part starts here
  // The blocking strand's 3' end is at XR and carries its barb the whole
  // way through — bound, peeling, or free. The lifted portion runs toward
  // its 5' end, so that end gets NO barb.
  if (s.released > 0.92){
    r.block.setAttribute("d", "");
    r.flap .setAttribute("d", strand(FREE_L, YF, FREE_R, YF));
    r.flap .setAttribute("stroke", RED);      // rung 2: now the point
    if (r.fpr) r.fpr.setAttribute("opacity", "1");
  } else {
    r.flap .setAttribute("stroke", INK);      // rung 0: merely present
    r.block.setAttribute("d", fork < XR - 2 ? strand(fork, YT, XR, YT) : "");
    r.flap .setAttribute("d", peeled > 4
      ? plain(fork, YT, fork - peeled*0.92, YT - 22 - 88*Math.min(1, peeled/420)) : "");
    if (r.fpr) r.fpr.setAttribute("opacity", "0");
  }
  r.extra.setAttribute("d", "");
}
window.Deck.sequence("displacement", function(slide){
  const S = [
    { s:{a:900,released:0},
      label:"the same collision, a different enzyme",
      call:"Now what?",
      note:"The more common scenario is strand displacement. Same starting arrangement, same collision: a recessed 3' end extended until it runs up against the strand already sitting downstream. Only the enzyme is different.",
      desc:"The same arrangement as on the previous slide: a full-width template, a new strand extended from the left, and a downstream blocking strand beginning after a nick. A red line asks: Now what?" },
    { s:{a:XR,released:1},
      label:"it peels the strand off and keeps going",
      sub:"the displaced strand comes away whole: a separate molecule, 5′ to 3′",
      note:"This time it does not degrade anything. It lifts the downstream strand off the template from that strand's 5' end and keeps polymerising underneath it, and the displaced DNA eventually comes away intact as a separate molecule. Nothing was destroyed: you end with two molecules where the exonuclease left you one. Hold on to that difference. It is the whole of the next two slides.",
      desc:"The polymerase has run to the far end of the template. The displaced strand now sits alone above the duplex, drawn in red at its own full length and offset from both ends of the duplex, its 5-prime end labelled on the left and a half barb marking its 3-prime end on the right." }
  ];
  return driver(svg(slide, DISP_EXTRA), DISP_KEYS, S, dispPaint);
});

/* ---------------------------------------------- 3'->5' proofreading --- */
/* A real sequence, letter by letter: the polymerase runs forward, puts in
   a wrong base, backs up and excises it, then carries on. */
const TMPL = "TACGGATCCGTAGCTAAGCT";          // template, 3'->5' left to right
const COMP = { A:"T", T:"A", G:"C", C:"G" };
const NEW  = TMPL.split("").map(c => COMP[c]).join("");   // new strand, 5'->3'
const WIDX = 11, WRONGBASE = "G";             // where it slips, and what it puts in
const X0 = 250, STEP = 52, Y_NEW = 636, Y_TMP = 716;

/* Polymerase silhouette traced from a crystal structure (art-polymerase.js).
   The concave notch on its right-hand edge is the DNA-binding cleft, found
   by scanning the outline for the deepest inward dip; the duplex is seated
   there. Drawn semi-transparent so the bases read straight through. */
/* Portrait art: the cleft sits 45% of the way down a 1126-unit-tall
   silhouette, so seating the cleft on the duplex puts more than half the
   body BELOW it. At the old 0.47 the body ran off the bottom of the slide
   on every frame and off the right edge on the last one. 0.31 is the
   largest scale that closes inside the 1600x900 box with the cleft on the
   duplex: 676 - 508.5k = 518 at the top, 676 + 617.2k = 867 at the
   bottom. It is also drawn BEHIND the sequence, and the bases carry a
   white halo, so the outline can cross a letter without eating it. */
const POL_K = 0.31;
const POL_CLEFT_Y = 676;      /* between the two rows of bases */

function polymeraseMarkup(){
  const A = window.ART;
  if (!A || !A.polymerase) return '<g data-r="pol"></g>';
  return '<g data-r="pol">' +
    '<path d="' + A.polymerase + '" fill="' + SLATE + '" fill-opacity="0.10" ' +
      'stroke="' + SLATE + '" stroke-opacity="0.55" stroke-width="9" ' +
      'stroke-linejoin="round" stroke-linecap="round"/>' +
    '</g>';
}

/* Synthesis runs left to right, so the downstream template arrives from the
   right and feeds straight into the groove. */
function polymeraseTransform(px, py){
  const A = window.ART;
  if (!A || !A.polCleft) return "";
  const c = A.polCleft, k = POL_K;
  return "translate(" + n2(px - c[0]*k) + " " + n2(py - c[1]*k) +
         ") scale(" + k + ")";
}

window.Deck.sequence("proofread", function(slide){
  const svgEl = document.createElementNS(SVGNS, "svg");
  svgEl.setAttribute("viewBox", "0 0 1600 900");
  svgEl.setAttribute("aria-hidden", "true");
  svgEl.setAttribute("style", "position:absolute;inset:0;pointer-events:none");
  const F = 'font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="40" ' +
            'text-anchor="middle"';
  /* Halo: the enzyme envelope is drawn UNDER this row, so every base keeps a
     white surround and stays readable wherever the outline crosses it. */
  const HALO = 'stroke="#ffffff" stroke-width="7" paint-order="stroke" ' +
               'stroke-linejoin="round"';
  // the enzyme first, so the sequence sits on top of it
  let html = polymeraseMarkup() +
             '<path data-r="bar" fill="none" stroke="' + SLATE + '" stroke-width="3" ' +
               'stroke-linecap="round"/>';
  html += '<g ' + F + ' ' + HALO + ' font-weight="600">';
  // template row, always fully drawn
  for (let i = 0; i < TMPL.length; i++)
    html += '<text x="' + (X0 + i*STEP) + '" y="' + Y_TMP + '" fill="' + INK + '">' + TMPL[i] + '</text>';
  // new strand row, revealed base by base
  for (let i = 0; i < NEW.length; i++)
    html += '<text data-r="n' + i + '" x="' + (X0 + i*STEP) + '" y="' + Y_NEW + '" fill="' +
            SLATE + '" opacity="0">' + NEW[i] + '</text>';
  html += '<text data-r="bad" x="' + (X0 + WIDX*STEP) + '" y="' + Y_NEW + '" fill="' + RED +
          '" opacity="0">' + WRONGBASE + '</text></g>';
  // polarity labels
  html += '<g ' + F + ' ' + HALO + ' font-size="30" fill="' + INK + '">' +
            '<text x="' + (X0 - 62) + '" y="' + Y_NEW + '">5&#8242;</text>' +
            '<text x="' + (X0 - 62) + '" y="' + Y_TMP + '">3&#8242;</text>' +
            '<text x="' + (X0 + TMPL.length*STEP + 10) + '" y="' + Y_TMP + '">5&#8242;</text>' +
          '</g>' +
          '<text data-r="cap" x="800" y="456" text-anchor="middle" font-family="inherit" ' +
            'font-weight="700" font-size="30" fill="' + INK + '"></text>' +
          '<text data-r="sub" x="800" y="500" text-anchor="middle" font-family="inherit" ' +
            'font-size="26" fill="#767676"></text>';
  svgEl.innerHTML = html;
  slide.appendChild(svgEl);
  const r = {};
  svgEl.querySelectorAll("[data-r]").forEach(el => r[el.getAttribute("data-r")] = el);

  function paint(s){
    const placed = Math.floor(s.n + 1e-6), frac = s.n - placed;
    for (let i = 0; i < NEW.length; i++)
      r["n"+i].setAttribute("opacity", i < placed ? "1" : (i === placed ? n2(frac) : "0"));
    r.bad.setAttribute("opacity", n2(s.wrong));
    // No 3' barb here: it would sit inside the enzyme and read as a stray
    // line. The cleft marks the growth point.
    const tipN = s.n + s.wrong;
    const x = X0 + (tipN - 0.5)*STEP;
    r.bar.setAttribute("d", "");
    // the enzyme rides the duplex, its cleft on the growing end and
    // straddling both rows rather than sitting on the top one
    r.pol.setAttribute("transform", polymeraseTransform(x + 26, POL_CLEFT_Y));
  }

  const S = [
    { s:{n:5, wrong:0}, cap:"the enzyme sits on the growing 3′ end",
      sub:"the notch is the cleft: bases go in there, and come back out there",
      note:"A primer is annealed and the polymerase starts extending it along the template. The notch in the enzyme is the cleft that holds the duplex, and the growing 3-prime end sits in it. Everything on this slide happens at that one point.",
      desc:"A template strand written out as letters, 3-prime to 5-prime, with a short primer paired above it at its 5-prime end. A pale blue enzyme silhouette straddles the duplex with its notch on the growing end of the primer." },
    { s:{n:11, wrong:0}, cap:"polymerizing 5\u2032\u21923\u2032",
      sub:"one base per step, each one chosen by the template",
      note:"It runs forward, adding one base at a time complementary to the template.",
      desc:"The polymerase runs forward, filling in bases one by one so the new strand now pairs with eleven bases of the template." },
    { s:{n:11, wrong:1}, cap:"a wrong base goes in",
      sub:"a G opposite an A: it cannot pair",
      note:"Every so often it puts in the wrong base: here a G opposite an A, which cannot pair.",
      desc:"A red G has been incorporated where a T belongs, opposite the template A. It is mispaired." },
    /* Excises IT, singular: back to ELEVEN correct bases, not ten. The old
       value removed the mismatch AND one correctly paired base with it,
       which is not what the note says happens. */
    { s:{n:11, wrong:0}, cap:"3\u2032\u21925\u2032 exonuclease backs up and excises it",
      sub:"one base removed \u2014 the mismatched one, and nothing else",
      note:"The 3' to 5' exonuclease notices the mismatch, backs the polymerase up, and clips that one bad base back off. That is proofreading, and it buys you another couple of orders of magnitude of fidelity.",
      desc:"The red mismatched base is gone and the eleven correctly paired bases before it remain. The polymerase has backed up to the 3-prime end of the new strand." },
    { s:{n:NEW.length, wrong:0}, cap:"and carries on",
      sub:"Pfu-like enzymes do this; Taq-like enzymes do not",
      note:"Then it carries on. Taq has no proofreading domain, which is why its error rate is so much higher than Pfu's.",
      desc:"Synthesis resumes and runs to the end of the template, the new strand now correctly paired along its whole length." }
  ];

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = Object.assign({}, S[0].s), raf = null;
  function go(i, animated){
    const to = S[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.cap.textContent = S[i].cap;
    r.sub.textContent = S[i].sub || "";
    if (animated === false || reduce.matches){ cur = Object.assign({}, to); paint(cur); return; }
    const from = Object.assign({}, cur), t0 = performance.now(), dur = 900;
    const ez = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    raf = requestAnimationFrame(function f(now){
      const t = Math.min(1,(now-t0)/dur), e = ez(t);
      cur = { n: from.n + (to.n-from.n)*e, wrong: from.wrong + (to.wrong-from.wrong)*e };
      paint(cur);
      if (t < 1) raf = requestAnimationFrame(f); else raf = null;
    });
  }
  paint(cur);
  return { steps: S.map(x => ({ note:x.note, desc:x.desc })), go: go };
});
})();
