/* ------------------------------------------------------------------ *
 * 21b-impedance.js : source 21, second of three -- impedance matching.
 *
 * Registers:  impedance
 *
 * WHY THIS SLIDE EXISTS.  JCA's own note on source 21 contains the
 * whole argument in two sentences -- "you will get a constitutive on
 * or off device because the rates don't match up", and "you can tune
 * the amount of protein made per transcript up or down and make them
 * match" -- and the source slide had no picture of it at all.  He
 * asked for one on 2026-11-10.  Those two sentences are this slide's
 * verbatim note; nothing is paraphrased.
 *
 * WHAT IT DRAWS.  Three transfer functions in a row, each one's output
 * axis being the next one's input:
 *
 *     arabinose  ->  [mRNA]      the promoter.  Has a floor: even
 *                                uninduced, it makes some message.
 *     [mRNA]     ->  [protein]   the RBS.  A straight line whose
 *                                SLOPE is the thing you can change.
 *     [protein]  ->  invasion    the phenotype.  Saturating, and it
 *                                saturates early -- a little invasin
 *                                already gives you most of the
 *                                invasion you are ever going to get.
 *
 * Then it traces the OFF and ON states through all three, which is the
 * only way to show the failure: with a strong RBS the middle line is
 * steep, so BOTH states clear the phenotype's knee and land on the
 * plateau together.  The device is on all the time, and no amount of
 * work on the promoter fixes it, because the promoter was never the
 * problem.  Drop the slope -- a weaker RBS -- and OFF falls below the
 * knee while ON stays above it.  Same promoter, same phenotype curve,
 * working device.
 *
 * That is why it is called impedance matching, and it is why the
 * answer is an RBS LIBRARY: you cannot calculate the slope you need,
 * so you make a few hundred of them and find it.
 *
 * COLOUR.  Vermillion is the ON state and blue is the OFF state, the
 * same two all the way across all three panels, because the whole
 * point is following two particular levels through a chain. The curves
 * themselves are ink; the strong-RBS line that fails is drawn muted
 * once it has been replaced, so you can still see what moved.
 *
 * Authored at 1420x660.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const INK = "#111111", VERM = "#ba3a13", BLUE = "#004373",
      MUTED = "#9a9a9a", RULE = "#e2e2e2";
const n2 = v => Math.round(v * 10) / 10;

/* ---- three panels, laid out left to right -------------------------- */
/* taller panels than the first pass: the drawing is width-limited in
   its box, so height was the free dimension and it was going spare */
const PW = 352, PH = 360, PY = 96, GAP = 74;
const PX = [96, 96 + PW + GAP, 96 + 2*(PW + GAP)];

/* the two states, as a fraction of the promoter's input range */
const OFF = 0.10, ON = 0.86;

/* 1. promoter: a floor plus a rising hill.  The floor is the point --
      an uninduced promoter is not a silent one. */
function fProm(x){ return 0.12 + 0.76 * (x*x*(3 - 2*x)); }
/* 2. RBS: a straight line through the origin.  k is what you tune. */
function fRbs(x, k){ return Math.min(1, k * x); }
/* 3. phenotype: saturates early, around a tenth of full protein. */
function fPhen(x){ return 1 - Math.exp(-x / 0.12); }

function px(p, x){ return PX[p] + x * PW; }
function py(y){ return PY + PH - y * PH; }

function frame(p, xlab, ylab, title){
  let s = '<rect x="' + PX[p] + '" y="' + PY + '" width="' + PW + '" height="' +
          PH + '" fill="none" stroke="' + RULE + '" stroke-width="2"/>';
  s += '<line x1="' + PX[p] + '" y1="' + (PY+PH) + '" x2="' + (PX[p]+PW) +
       '" y2="' + (PY+PH) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += '<line x1="' + PX[p] + '" y1="' + PY + '" x2="' + PX[p] + '" y2="' +
       (PY+PH) + '" stroke="' + INK + '" stroke-width="2.5"/>';
  s += '<text x="' + (PX[p] + PW/2) + '" y="' + (PY + PH + 44) +
       '" text-anchor="middle" font-family="inherit" font-size="25" fill="' +
       INK + '">' + xlab + '</text>';
  s += '<text transform="translate(' + (PX[p] - 22) + ',' + (PY + PH/2) +
       ') rotate(-90)" text-anchor="middle" font-family="inherit" ' +
       'font-size="25" fill="' + INK + '">' + ylab + '</text>';
  s += '<text x="' + (PX[p] + PW/2) + '" y="' + (PY - 26) + '" text-anchor="middle" ' +
       'font-family="inherit" font-size="24" font-weight="700" fill="' + MUTED +
       '">' + title + '</text>';
  return s;
}
function curve(p, f, colour, w, dash){
  let d = "";
  for (let i = 0; i <= 80; i++){
    const x = i/80;
    d += (i ? " L " : "M ") + n2(px(p, x)) + " " + n2(py(f(x)));
  }
  return '<path d="' + d + '" fill="none" stroke="' + colour + '" stroke-width="' +
         (w||4) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
}
/* the dotted read-off: up from x to the curve, then across to y */
function trace(p, x, y, colour){
  return '<path d="M ' + n2(px(p,x)) + ' ' + n2(py(0)) + ' L ' + n2(px(p,x)) +
         ' ' + n2(py(y)) + ' L ' + n2(PX[p]) + ' ' + n2(py(y)) +
         '" fill="none" stroke="' + colour + '" stroke-width="2.5" ' +
         'stroke-dasharray="5 5"/>' +
         '<circle cx="' + n2(px(p,x)) + '" cy="' + n2(py(y)) + '" r="7" fill="' +
         colour + '"/>';
}
/* the level handed on to the next panel */
function carry(p, y, colour){
  return '<path d="M ' + n2(PX[p]+PW) + ' ' + n2(py(y)) + ' L ' +
         n2(PX[p+1]) + ' ' + n2(py(0)) + '" fill="none" stroke="' + colour +
         '" stroke-width="2" stroke-dasharray="3 6" opacity="0.55"/>';
}

const STRONG = 9.0, WEAK = 0.30;

function chain(k, colourise){
  /* run both states through the three panels at RBS slope k */
  let s = "";
  [[OFF, BLUE], [ON, VERM]].forEach(function(q){
    const x0 = q[0], c = colourise ? q[1] : MUTED;
    const m = fProm(x0);        /* mRNA   */
    const pr = fRbs(m, k);      /* protein */
    const ph = fPhen(pr);       /* invasion */
    s += trace(0, x0, m, c);
    s += trace(1, m, pr, c);
    s += trace(2, pr, ph, c);
  });
  return s;
}

function impedance(){
  let s = "";
  s += frame(0, "arabinose", "[mRNA]", "the promoter");
  s += frame(1, "[mRNA]", "[protein]", "the RBS");
  s += frame(2, "[protein]", "invasion", "the phenotype");

  s += '<g data-r="curves">';
  s += curve(0, fProm, INK);
  s += curve(2, fPhen, INK);
  s += '</g>';

  /* the RBS line, in its two versions */
  s += '<g data-r="strong">' + curve(1, x => fRbs(x, STRONG), INK) + '</g>';
  s += '<g data-r="strongGhost" opacity="0">' +
       curve(1, x => fRbs(x, STRONG), MUTED, 3, "6 6") + '</g>';
  s += '<g data-r="weak" opacity="0">' + curve(1, x => fRbs(x, WEAK), INK) + '</g>';

  s += '<g data-r="bad" opacity="0">' + chain(STRONG, true) + '</g>';
  s += '<g data-r="good" opacity="0">' + chain(WEAK, true) + '</g>';

  /* the verdicts */
  s += '<text data-r="badsay" opacity="0" x="710" y="' +
       (PY + PH + 92) + '" text-anchor="middle" font-family="inherit" ' +
       'font-size="27" font-weight="700" fill="' + VERM +
       '">both states land on the plateau — always on</text>';
  s += '<text data-r="goodsay" opacity="0" x="710" y="' +
       (PY + PH + 150) + '" text-anchor="middle" font-family="inherit" ' +
       'font-size="28" font-weight="700" fill="' + INK +
       '">the two states now sit either side of the knee</text>';
  s += '<text data-r="slope" opacity="0" x="' + (PX[1] + PW/2) + '" y="' +
       (PY + PH + 92) + '" text-anchor="middle" font-family="inherit" ' +
       'font-size="25" fill="' + MUTED + '">weaker RBS, shallower slope</text>';

  /* the key */
  s += '<g data-r="key" opacity="0">';
  [[BLUE, "uninduced", 0], [VERM, "induced", 1]].forEach(function(q, i){
    const x = PX[0] + i * 190;
    s += '<circle cx="' + x + '" cy="' + (PY + PH + 92) + '" r="7" fill="' + q[0] + '"/>';
    s += '<text x="' + (x + 18) + '" y="' + (PY + PH + 100) + '" ' +
         'font-family="inherit" font-size="24" fill="' + INK + '">' + q[1] + '</text>';
  });
  s += '</g>';

  return '<svg viewBox="0 0 1420 660" xmlns="http://www.w3.org/2000/svg" ' +
    'role="img" aria-label="Three transfer functions in a row. The promoter ' +
    'turns arabinose into mRNA and has a floor, so even uninduced it makes ' +
    'some message. The RBS turns mRNA into protein along a straight line whose ' +
    'slope you can change. The phenotype turns protein into invasion and ' +
    'saturates early. With a strong RBS the middle line is steep and both the ' +
    'uninduced and induced states land on the phenotype plateau, so the device ' +
    'is on all the time. With a weaker RBS the uninduced state falls below the ' +
    'knee and the induced state stays above it, and the device works.">' +
    s + '</svg>';
}

/* ------------------------------------------------------------------ *
 * note: is the SOURCE's, verbatim -- the last two sentences of source
 * 21's note, which are exactly this argument in his own words.
 * ------------------------------------------------------------------ */
const impedanceSteps = [
  {
    note:"",
    add:"Here is why that is harder than it sounds. There are three transfer functions in a row. The promoter turns arabinose into message, and notice that it has a floor: an uninduced promoter is not a silent promoter, it still makes some. The RBS turns message into protein, and that is a straight line whose slope is the one thing you get to choose. And the phenotype turns protein into invasion, and that one saturates early, because a little invasin on the surface already gives you most of the invasion you are ever going to get.",
    desc:"Three charts in a row: arabinose to mRNA with a floor, mRNA to protein as a straight line, and protein to invasion saturating early." },
  {
    note:"When you simply put a promoter in front of gene, very often you will get a constitutive on or off device because the rates don’t match up.",
    add:"Follow the two states through. Blue is uninduced, red is induced. With a strong ribosome binding site that middle slope is steep, so the promoter's floor is already enough protein to saturate the phenotype. Both states come out on the plateau. The device invades whether you induce it or not, and no amount of work on the promoter will fix that, because the promoter was never the problem.",
    desc:"The uninduced and induced levels are traced through all three panels with a strong RBS; both end on the phenotype plateau." },
  {
    note:"By adjusting the RBS, you can tune the amount of protein made per transcript up or down and make them match.",
    add:"Drop the slope and watch it come apart. Same promoter, same phenotype curve, weaker RBS. Now the uninduced state falls below the knee and the induced state stays above it, and you have a device. That is what impedance matching means here. And it is why the answer is a library: you cannot calculate the slope you need, so you build a few hundred of them and find it.",
    desc:"The RBS line becomes shallower and the two states separate: uninduced below the knee, induced above it." }
];

window.Deck.sequence("impedance", function(slide){
  const host = slide.querySelector("[data-imp]");
  if (!host) return { steps: impedanceSteps.map(x => ({note:x.note, desc:x.desc})),
                      go: function(){} };
  host.innerHTML = impedance();
  const svg = host.querySelector("svg"), r = {};
  svg.querySelectorAll("[data-r]").forEach(e => r[e.getAttribute("data-r")] = e);

  function go(i){
    const set = (k, on) => r[k] && r[k].setAttribute("opacity", on ? "1" : "0");
    set("strongGhost", i >= 2);
    set("weak", i >= 2);
    r.strong.setAttribute("opacity", i >= 2 ? "0" : "1");
    set("bad", i === 1);
    set("badsay", i === 1);
    set("good", i >= 2);
    set("goodsay", i >= 2);
    set("slope", i >= 2);
    set("key", i >= 1);
  }
  go(0);

  return {
    steps: impedanceSteps.map(function(x){
      const spoken = x.note && x.add ? x.note + "  " + x.add : (x.note || x.add || "");
      return { note: spoken, desc: x.desc };
    }),
    go: go
  };
});

})();
