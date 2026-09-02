/* ------------------------------------------------------------------ *
 * linear.js — the horizontal duplex diagrams and their animations.
 *
 * Registers:   exo53         5'->3' exonuclease activity   (7 steps)
 *              displacement  strand displacement            (7 steps)
 *              t7rnap        T7 RNA polymerase              (5 steps)
 *              exo35         3'->5' proofreading            (1 step)
 *              nick          a nicked duplex for ligase      (1 step)
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
    '<text data-r="label" x="800" y="470" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="30" fill="'+INK+'"></text>' +
    '<text data-r="call" x="1180" y="760" text-anchor="middle" font-family="inherit" ' +
      'font-weight="700" font-size="32" fill="'+RED+'" opacity="0"></text>';
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
    r.call.textContent  = steps[i].call  || "";
    r.call.setAttribute("opacity", steps[i].call ? "1" : "0");
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
window.Deck.sequence("exo53", function(slide){
  const B0 = 900;
  const S = [
    { s:{a:520,b:B0},
      note:"Suppose we have this DNA: three polynucleotides annealed together, leaving a single recessed 3' end. Any DNA polymerase will extend that recessed end.",
      desc:"A template strand runs the width of the slide. Above it sit two shorter strands with a gap between them: on the left the primer to be extended, on the right a downstream blocking strand." },
    { s:{a:B0,b:B0}, call:"Now what?",
      note:"It runs forward until it collides with the downstream strand. So what happens then?",
      desc:"The new strand has been extended right up to the downstream blocking strand, leaving only a nick between them. A red caption asks: Now what?" },
    { s:{a:XR,b:XR},
      note:"If the polymerase has 5' to 3' exonuclease activity it simply chews the blocking strand up as it goes, and that strand is entirely replaced by new synthesis.",
      desc:"The downstream strand has been degraded away entirely. One continuous new strand now spans the whole template." }
  ];
  return driver(svg(slide), EXO_KEYS, S, exoPaint);
});

/* ------------------------------------------------ displacement ----- */
const DISP_KEYS = ["a","released"];
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
    r.flap .setAttribute("d", strand(B0, YF, XR, YF));
    r.flap .setAttribute("stroke", RED);      // rung 2: now the point
  } else {
    r.flap .setAttribute("stroke", INK);      // rung 0: merely present
    r.block.setAttribute("d", fork < XR - 2 ? strand(fork, YT, XR, YT) : "");
    r.flap .setAttribute("d", peeled > 4
      ? plain(fork, YT, fork - peeled*0.92, YT - 22 - 88*Math.min(1, peeled/420)) : "");
  }
  r.extra.setAttribute("d", "");
}
window.Deck.sequence("displacement", function(slide){
  const S = [
    { s:{a:520,released:0},
      note:"The more common scenario is strand displacement. Same starting arrangement: a recessed 3' end with a blocking strand downstream.",
      desc:"The same arrangement as before: a full-width template, a growing new strand on the left and a downstream blocking strand on the right." },
    { s:{a:900,released:0}, call:"Now what?",
      note:"Again the polymerase runs up against the blocking strand.",
      desc:"The new strand has been extended up to the downstream strand, separated only by a nick. A red caption asks: Now what?" },
    { s:{a:XR,released:1},
      note:"This time it does not degrade it — it peels the blocking strand off the template and keeps going, until ultimately that DNA is released as a separate complex.",
      desc:"The polymerase has lifted the downstream strand off the template and run to the end. The displaced strand now floats free above as a separate molecule." }
  ];
  return driver(svg(slide), DISP_KEYS, S, dispPaint);
});

/* ---------------------------------------------------- T7 RNAP ------ *
 * Written out as sequence end to end — no plain strands — because the
 * point of the slide is WHERE transcription starts, and a line cannot
 * show a position. Consensus runs -17 to -1, then +1 onward:
 *
 *     TAATACGACTCACTATA GGGAGACCACAACGGTTTCCCTC
 *     -17            -1 +1
 *
 * Only bases from +1 ON lift into the bubble. Lifting -1 as well made the
 * raised row read "A GGGAGA", so the A looked like the start site.
 * -------------------------------------------------------------------- */
const T7_TOP = "TAATACGACTCACTATA" + "GGGAGACCACAACGGTTTCCCTC";
const T7_BOT = T7_TOP.split("").map(c => ({A:"T",T:"A",G:"C",C:"G"})[c]).join("");
const P1 = 17;                        /* index of +1 */
const SX = 150, SSTEP = 34;
const sx = i => SX + i*SSTEP;
const LIFT = 54;
const T7_KEYS = ["prom","bub","front","out"];

function t7Markup(){
  let g = '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" ' +
          'font-size="25" font-weight="600" text-anchor="middle">';
  for (let i = 0; i < T7_TOP.length; i++)
    g += '<text data-r="t'+i+'" x="'+sx(i)+'" y="'+(YT+9)+'" fill="'+INK+'">'+T7_TOP[i]+'</text>';
  for (let i = 0; i < T7_BOT.length; i++)
    g += '<text x="'+sx(i)+'" y="'+(YB+9)+'" fill="'+INK+'">'+T7_BOT[i]+'</text>';
  g += '</g>';
  /* Antiparallel: top strand 5'->3' left to right, template 3'->5'. With the
     plain strands gone there is nothing else carrying polarity. */
  g += '<g font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="23" ' +
         'fill="' + INK + '">' +
    '<text x="' + (sx(0)-46) + '" y="' + (YT+9) + '">5&#8242;</text>' +
    '<text x="' + (sx(T7_TOP.length-1)+26) + '" y="' + (YT+9) + '">3&#8242;</text>' +
    '<text x="' + (sx(0)-46) + '" y="' + (YB+9) + '">3&#8242;</text>' +
    '<text x="' + (sx(T7_BOT.length-1)+26) + '" y="' + (YB+9) + '">5&#8242;</text>' +
  '</g>';
  g += '<g data-r="prom" opacity="0">' +
    '<path fill="none" stroke="' + SLATE + '" stroke-width="2.5" stroke-linecap="round" ' +
      'd="M' + (sx(0)-15) + ' ' + (YT-40) + 'v-14H' + (sx(P1-1)+15) + 'v14"/>' +
    '<text x="' + ((sx(0)+sx(P1-1))/2) + '" y="' + (YT-66) + '" text-anchor="middle" ' +
      'font-family="inherit" font-weight="700" font-size="25" fill="' + SLATE + '">' +
      'recognition element &#8212; stays duplex</text>' +
  '</g>';
  /* the +1 marker tracks its base, so it never collides with it */
  g += '<g data-r="plus1" opacity="0">' +
    '<path data-r="p1tick" fill="none" stroke="' + RED + '" stroke-width="3"/>' +
    '<text data-r="p1lab" x="' + sx(P1) + '" text-anchor="middle" ' +
      'font-family="inherit" font-weight="700" font-size="25" fill="' + RED + '">+1</text>' +
  '</g>';
  return g;
}

function t7Paint(r, s){
  r.tmplt.setAttribute("d", "");        /* sequence all the way across */
  r.block.setAttribute("d", "");
  r.grow .setAttribute("d", "");
  r.flap .setAttribute("d", "");
  r.prom .setAttribute("opacity", n2(s.prom));

  /* bubble covers +1 onward only — never -1 */
  const hi = P1 + Math.max(0, Math.ceil(s.front));
  for (let i = 0; i < T7_TOP.length; i++)
    r["t"+i].setAttribute("y", (YT + 9) -
      ((s.out < 0.5 && i >= P1 && i <= hi) ? LIFT*s.bub : 0));

  const baseY = (YT + 9) - (s.out < 0.5 ? LIFT*s.bub : 0);
  r.plus1.setAttribute("opacity", (s.prom > 0.02 || s.bub > 0.02) ? "1" : "0");
  r.p1tick.setAttribute("d", "M" + sx(P1) + " " + n2(baseY-46) + "V" + n2(baseY-26));
  r.p1lab .setAttribute("y", n2(baseY - 54));
  r.label .setAttribute("y", 430);      /* clear of the raised bases */

  if (s.out > 0.5){
    // 5' end stays aligned with +1, so the product visibly corresponds to
    // the template from that base on. Sits below the caption, not through it.
    r.extra.setAttribute("d", strand(sx(P1), YT-88, sx(T7_TOP.length-1), YT-88));
    return;
  }
  /* RNA begins at +1 */
  r.extra.setAttribute("d", s.front > 0.15
    ? strand(sx(P1)-SSTEP/2, YT+4, sx(P1) + (s.front-0.5)*SSTEP, YT+4) : "");
}

window.Deck.sequence("t7rnap", function(slide){
  const S = [
    { s:{prom:0,bub:0,front:0,out:0}, label:"Double stranded DNA",
      note:"T7 RNAP is used for both in vivo and in vitro transcription. When people speak of T7 expression systems, the pET vectors, BL21 or DE3 strains, they are talking about systems employing the T7 RNA polymerase to control the transcription of an engineered gene.",
      desc:"A double-stranded DNA written out as forty paired bases, TAATACGACTCACTATA followed by GGGAGACCACAACGGTTTCCCTC, over its complement." },
    { s:{prom:1,bub:0,front:0,out:0}, label:"",
      note:"The substrate is a double-stranded DNA carrying the T7 promoter. The sequence is quoted for the non-template strand \u2014 the top one \u2014 because that is the strand the RNA will match. Transcription starts at the G marked plus one.",
      desc:"The first seventeen bases, TAATACGACTCACTATA, are bracketed as the recognition element, which stays duplex during initiation. A red marker labels the very next base, the G at plus one, as the transcription start." },
    { s:{prom:1,bub:1,front:0,out:0}, label:"Initiation",
      note:"The polymerase binds the promoter and unwinds a short stretch at the start site. The recognition element itself stays double stranded.",
      desc:"A small bubble opens: the G at plus one lifts away from the template while the bracketed recognition element, ending at the A at minus one, stays paired." },
    { s:{prom:0,bub:1,front:6,out:0}, label:"New RNA extension",
      note:"It initiates on that G and extends. The first few bases of RNA are made inside the bubble.",
      desc:"A blue RNA strand begins exactly at the plus one G and extends to the right along the template, inside the open bubble." },
    { s:{prom:0,bub:0,front:0,out:1}, label:"New ssRNA product",
      note:"When the polymerase reaches the end of the DNA, which is called runoff transcription, or hits a terminator, the new single-stranded RNA is released and polymerisation can begin again.",
      desc:"The RNA has been released and floats free above the DNA, which has closed back into a full duplex." }
  ];
  return driver(svg(slide, t7Markup()), T7_KEYS, S, t7Paint);
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
const POL_K = 0.47;   /* Portrait art, so scale is capped by how far the top
                         lobe can rise before it reaches the bullets — the
                         cleft has to sit on the 5' strand. The tail of the
                         body runs off the bottom and is clipped by the
                         slide, which is fine: the cleft carries the meaning. */

function polymeraseMarkup(){
  const A = window.ART;
  if (!A || !A.polymerase) return '<g data-r="pol"></g>';
  return '<g data-r="pol">' +
    '<path d="' + A.polymerase + '" fill="' + SLATE + '" fill-opacity="0.12" ' +
      'stroke="' + SLATE + '" stroke-opacity="0.6" stroke-width="11" ' +
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
  let html = '<g ' + F + ' font-weight="600">';
  // template row, always fully drawn
  for (let i = 0; i < TMPL.length; i++)
    html += '<text x="' + (X0 + i*STEP) + '" y="' + Y_TMP + '" fill="' + INK + '">' + TMPL[i] + '</text>';
  // new strand row, revealed base by base
  for (let i = 0; i < NEW.length; i++)
    html += '<text data-r="n' + i + '" x="' + (X0 + i*STEP) + '" y="' + Y_NEW + '" fill="' +
            SLATE + '" opacity="0">' + NEW[i] + '</text>';
  html += '<text data-r="bad" x="' + (X0 + WIDX*STEP) + '" y="' + Y_NEW + '" fill="' + RED +
          '" opacity="0">' + WRONGBASE + '</text></g>';
  // polarity labels and the backbone lines the bases hang off
  html += '<g ' + F + ' font-size="30" fill="' + INK + '">' +
            '<text x="' + (X0 - 62) + '" y="' + Y_NEW + '">5&#8242;</text>' +
            '<text x="' + (X0 - 62) + '" y="' + Y_TMP + '">3&#8242;</text>' +
            '<text x="' + (X0 + TMPL.length*STEP + 10) + '" y="' + Y_TMP + '">5&#8242;</text>' +
          '</g>' +
          '<path data-r="bar" fill="none" stroke="' + SLATE + '" stroke-width="3" ' +
            'stroke-linecap="round"/>' + polymeraseMarkup() +
          '<text data-r="cap" x="800" y="500" text-anchor="middle" font-family="inherit" ' +
            'font-weight="700" font-size="30" fill="' + INK + '"></text>';
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
    const x = X0 + (tipN - 0.5)*STEP, y = Y_NEW - 12;
    r.bar.setAttribute("d", "");
    // the enzyme rides the duplex, its active site over the growing end
    r.pol.setAttribute("transform", polymeraseTransform(x + 26, Y_NEW));
  }

  const S = [
    { s:{n:5, wrong:0}, cap:"",
      note:"A primer is annealed and the polymerase starts extending it along the template.",
      desc:"A template strand written out as letters, 3-prime to 5-prime, with a short primer paired above it at its 5-prime end." },
    { s:{n:11, wrong:0}, cap:"polymerizing 5\u2032\u21923\u2032",
      note:"It runs forward, adding one base at a time complementary to the template.",
      desc:"The polymerase runs forward, filling in bases one by one so the new strand now pairs with eleven bases of the template." },
    { s:{n:11, wrong:1}, cap:"a wrong base goes in",
      note:"Every so often it puts in the wrong base — here a G opposite an A, which cannot pair.",
      desc:"A red G has been incorporated where a T belongs, opposite the template A. It is mispaired." },
    { s:{n:10, wrong:0}, cap:"3\u2032\u21925\u2032 exonuclease backs up and excises it",
      note:"The 3' to 5' exonuclease notices the mismatch, backs the polymerase up, and clips the bad base back off. That is proofreading.",
      desc:"The red base is gone. The polymerase has backed up, removing the mismatched base from the 3-prime end of the new strand." },
    { s:{n:NEW.length, wrong:0}, cap:"and carries on",
      note:"Then it carries on. Taq has no proofreading domain, which is why its error rate is so much higher than Pfu's.",
      desc:"Synthesis resumes and runs to the end of the template, the new strand now correctly paired along its whole length." }
  ];

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cur = Object.assign({}, S[0].s), raf = null;
  function go(i, animated){
    const to = S[i].s;
    if (raf){ cancelAnimationFrame(raf); raf = null; }
    r.cap.textContent = S[i].cap;
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

window.Deck.sequence("nick", function(slide){
  const r = svg(slide);
  function paint(){
    r.tmplt.setAttribute("d", strand(XR, YB, XL, YB));
    r.grow .setAttribute("d", "");
    r.block.setAttribute("d", strand(XL, YT, 790, YT));
    r.flap .setAttribute("d", strand(830, YT, XR, YT));
    r.block.setAttribute("stroke", SLATE);    // rung 1: ligase acts here
    r.flap .setAttribute("stroke", SLATE);
    r.extra.setAttribute("d", "");
  }
  paint();
  return { steps:[{ note:"The E. coli DNA ligase is rarely used in vitro, but it is a ubiquitous housekeeping function in cells used during DNA repair and replication. It forms bonds by repairing nicks only. It requires a 5’ phosphate be present, and it can’t be used to join non-annealed DNA. So, it can’t be used to ligate together DNAs cleaved by restriction enzymes.",
                   desc:"A double-stranded DNA whose top strand carries a single nick — a gap between two abutting strands — which is the only substrate this ligase will act on." }],
           go: function(){ paint(); } };
});
})();
