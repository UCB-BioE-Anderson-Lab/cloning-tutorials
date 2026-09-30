/* ------------------------------------------------------------------ *
 * 02-amplify.js — the slide that was all prose about a visual fact.
 *
 * Source slide 17 lists five fluorescent proteins and the colour names
 * are the content.  Drawing those colours is not an option here: the
 * house palette is ink, blue, vermillion, amber and muted, with no
 * green, and a GFP rendered in amber teaches nothing true.
 *
 * But the colours were never the useful thing on that slide anyway.
 * The useful thing is the consequence of the split the slide before it
 * sets up -- the protein IS the signal, or the protein MAKES the signal
 * -- and that consequence is amplification, which is drawable and is
 * the reason BestP uses a fluorescent protein rather than an enzyme.
 *
 *   fluorescent protein   N molecules -> N units of signal.  Linear in
 *                         the thing you want, and constant in time.
 *   enzyme reporter       N molecules -> N x turnover x time.  Huge
 *                         gain, and the number depends on how long you
 *                         left it, which is a different number every
 *                         time unless somebody fixed the incubation.
 *
 * So one is for measuring and the other is for detecting, and choosing
 * wrongly is how a plate of beautiful blue colonies turns into a data
 * set that cannot be compared across two days.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const LX = 440, RX = 1080, TOP = 300, R = 17;

/* a column of reporter molecules, and what each one yields */
function panel(cx, n, per, col, u, title, sub){
  const g = K.grp(u);
  g.appendChild(K.text(cx, TOP - 56, title, 27, col, 700));
  if (sub) g.appendChild(K.text(cx, TOP - 26, sub, 21, C.muted, 400));
  for (let i = 0; i < n; i++){
    const y = TOP + 22 + i*74;
    g.appendChild(K.el("circle", {cx:cx - 150, cy:y, r:R, fill:col,
      "fill-opacity":".22", stroke:col, "stroke-width":2.6}));
    /* what that one molecule produces */
    for (let j = 0; j < per; j++){
      const k = j % 8, row = Math.floor(j/8);
      g.appendChild(K.el("circle", {cx:cx - 88 + k*26, cy:y - 9 + row*20, r:7,
        fill:col, "fill-opacity":".8", stroke:"none"}));
    }
  }
  return g;
}

const FR = [
{ s:{fp:1},
  cap:"a fluorescent protein <b>is</b> the signal",
  call:"one molecule, one molecule&rsquo;s worth &#183; forever",
  note:"Take the split from the last slide seriously and see what follows from it. A fluorescent protein is the signal. Its chromophore is made out of three of its own residues, folding inside the barrel, so there is no substrate to add and nothing is consumed. Three molecules of GFP give you three molecules' worth of fluorescence. Leave the plate on the bench for an hour and you still have three molecules' worth. The number you read is the number of molecules, which is the cleanest possible thing for a number to be.",
  desc:"Three fluorescent protein molecules, each producing one unit of signal, with the output proportional to the number of molecules." },

{ s:{fp:1, enz:1},
  cap:"an enzyme reporter <b>makes</b> the signal",
  call:"one molecule, and it keeps going",
  note:"An enzyme reporter does not work that way. Three molecules of beta-galactosidase sitting in a colony full of X-gal will keep turning it over, and each one produces product after product after product. The gain is enormous — a single enzyme molecule can turn over thousands of substrate molecules a second — which is why an enzyme reporter will show you a gene that a fluorescent protein cannot detect at all.",
  desc:"Three enzyme molecules, each producing many units of product, with far more output than the fluorescent protein for the same number of molecules." },

{ s:{fp:1, enz:1, t:1},
  cap:"but the enzyme&rsquo;s number also depends on <b>how long</b>",
  call:"and the fluorescent protein&rsquo;s does not",
  note:"And here is the cost of that gain. The enzyme's signal is molecules times turnover times time, so it depends on how long you left it, and nobody times a plate. Two colonies with the same amount of enzyme, read an hour apart, give two different answers. The fluorescent protein has no time term in it at all. That is the trade, and it is not about brightness.",
  desc:"The enzyme's output shown growing with incubation time while the fluorescent protein's stays constant." },

{ s:{fp:1, enz:1, t:1}, on:["rule"],
  cap:"so: enzyme to <b>detect</b>, fluorescent protein to <b>measure</b>",
  call:"which is why BestP uses amilGFP and not Lac<em>Z</em>",
  note:"Which gives you the rule for choosing. If the question is whether anything is happening at all — is this promoter on, did the insert go in — use an enzyme, because the amplification will find it. If the question is how much, and you intend to compare one number with another, use a fluorescent protein, because it has no time term and no substrate to run out. That is exactly why BestP measures amilGFP rather than putting X-gal on everything: you are comparing promoters across a plate and across a week, and a readout that drifts with incubation time would make the comparison meaningless. And it is why blue-white screening, where the only question is did it work, uses LacZ.",
  desc:"The rule: enzyme reporters for detection because they amplify, fluorescent proteins for measurement because their signal has no time dependence." }
];

window.Deck.sequence("amplify", function(slide){
  const s = K.scene(slide, 800, 846);

  const r = K.el("g", {});
  r.appendChild(K.path("M330 668H1270", C.muted, 2));
  r.appendChild(K.text(800, 712, "amplification buys sensitivity and costs comparability",
    27, C.blue, 700));
  s.part("rule", r);
  s.finish();

  function paint(v){
    const g = K.el("g", {});
    const per = 1 + Math.round(15*K.cl(v.enz, 0, 1)*(0.55 + 0.45*K.cl(v.t, 0, 1)));

    g.appendChild(panel(LX, 3, 1, C.blue, v.fp,
      "fluorescent protein", "the protein is the signal"));
    if (v.enz > 0.02)
      g.appendChild(panel(RX, 3, per, C.verm, v.enz,
        "enzyme reporter", "the protein makes the signal"));

    /* the two arithmetics, said once each */
    if (v.fp > 0.02){
      g.appendChild(K.text(LX, TOP + 268, "signal = molecules", 25, C.blue, 700));
      /* The set is named here because this slide replaced the one that
         listed them, and the colours themselves cannot be drawn -- the
         house palette has no green, and a GFP rendered in amber would
         be a worse lie than a word. */
      g.appendChild(K.text(LX, TOP + 336, "BFP · GFP · YFP · RFP", 23, C.muted, 400));
    }
    if (v.enz > 0.02)
      g.appendChild(K.text(RX, TOP + 268,
        v.t > 0.5 ? "signal = molecules × turnover × time"
                  : "signal = molecules × turnover", 25, C.verm, 700));
    if (v.t > 0.02){
      const a = K.grp(v.t);
      a.appendChild(K.text(LX, TOP + 302, "no time term", 22, C.muted, 400));
      a.appendChild(K.text(RX, TOP + 302, "and nobody times a plate", 22, C.verm, 700));
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
