/* ------------------------------------------------------------------ *
 * 03-tokens.js — the DH10B genotype, in two passes.
 *
 * Two source slides, each reprinting the whole genotype and then
 * listing three tokens under it in prose.  Same fix as the Mach1 walk
 * two sections later, and deliberately the same drawings: the Mach1
 * slide is supposed to land as "you have seen these three", and it
 * only does if it is the same picture.
 *
 * Two sequences rather than one, because the media slides belong
 * between them.  You cannot judge what a metabolic token costs you
 * until you know what the medium was going to hand over.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C, T = window.TOKART;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);
const MONO = "ui-monospace,SFMono-Regular,Menlo,monospace";
const grp = T.grp, path = T.path;

/* ---- DH10B, in string order --------------------------------------- */
const CW = 14, FS = 23;
const STR = ["F\u2212", "endA1", "recA1", "galE15", "galK16", "nupG", "rpsL",
             "\u0394lacX74", "\u03a680lacZ\u0394M15", "araD139",
             "\u0394(ara,leu)7697", "mcrA",
             "\u0394(mrr-hsdRMS-mcrBC)", "\u03bb\u2212"];
/* 125 characters on one line runs off both edges of the slide, so it
   wraps -- and the break falls between the DNA-handling half and the
   metabolic half, which is the same split the two passes make. */
const ROWS = [[0, 7], [7, 14]], RY = [226, 272];
/* which token each beat lights, by its index in the string */
const OWN = {end:[1], rec:[2], mcr:[11, 12], gal:[3, 4], ara:[9], leu:[10]};

const TOK = STR.map(function(s){ return {s:s}; });
ROWS.forEach(function(r, ri){
  let n = 0;
  for (let i = r[0]; i < r[1]; i++){
    TOK[i].n = n; n += TOK[i].s.length + (i < r[1] - 1 ? 2 : 0);
  }
  const x0 = 800 - n*CW/2;
  for (let i = r[0]; i < r[1]; i++){
    TOK[i].x = x0 + TOK[i].n*CW; TOK[i].w = TOK[i].s.length*CW; TOK[i].y = RY[ri];
  }
});

function strip(v, lit){
  const g = grp(v);
  TOK.forEach(function(t, i){
    const on = lit && lit.indexOf(i) >= 0;
    if (on) g.appendChild(G.el("rect", {x:n1(t.x - 8), y:n1(t.y - 28),
      width:n1(t.w + 16), height:40, rx:6, fill:C.verm, "fill-opacity":".14",
      stroke:C.verm, "stroke-width":2.2}));
    g.appendChild(G.el("text", {x:n1(t.x), y:n1(t.y), "font-size":FS,
      "font-family":MONO, fill:on ? C.verm : (lit ? C.muted : C.ink),
      "font-weight":700}, t.s));
  });
  g.appendChild(G.text(TOK[0].x, RY[0] - 42, "DH10B", 22, C.muted, 400, "start"));
  return g;
}
function panel(v, k, head, lines){
  const g = grp(v);
  g.appendChild(T.draw(k));
  g.appendChild(G.text(1010, 424, head, 30, C.verm, 700, "start"));
  lines.forEach(function(line, i){
    g.appendChild(G.text(1010, 486 + i*44, line, 22, C.ink, 400, "start"));
  });
  return g;
}
function build(name, FR, panels){
  window.Deck.sequence(name, function(slide){
    const s = G.scene(slide, 792, 838);
    s.finish();
    return G.run(s, FR, function(v, f){
      const g = G.el("g", {}), st = f.s || {};
      const k = Object.keys(panels).filter(x => (st[x] || 0) > 0.5)[0];
      g.appendChild(strip(v.str, k ? OWN[k] : null));
      Object.keys(panels).forEach(function(x){
        const o = cl((v[x] || 0)*2 - 1, 0, 1);
        if (o > 0.02) g.appendChild(panel(o, x, panels[x][0], panels[x][1]));
      });
      return g;
    });
  });
}

/* ================================================================== *
 * Pass one: the tokens that are about handling DNA.
 * ================================================================== */
build("dnatok", [
{ s:{str:1},
  cap:"three of these are about <b>handling DNA</b>",
  call:"and you will meet the same three on every cloning strain there is",
  note:"There are mutations you will see in nearly every popular cloning strain, and they are all about the same thing: making the strain better at receiving DNA, keeping it intact, and giving it back to you clean. Three of them are on this line. Find them before you click if you can.",
  desc:"The DH10B genotype with none of its tokens highlighted yet." },
{ s:{str:1, end:1},
  cap:"<b>endA1</b> &#183; plasmid purity",
  call:"a nuclease that survives lysis and chews the prep",
  note:"EndA is a non-specific endonuclease, and the problem is that it survives the alkaline lysis step, so it is still active in the tube while you are purifying. A miniprep from an endA positive strain comes off the column as a smear rather than a band.",
  desc:"endA1 highlighted, with a plasmid being degraded to a smear by EndA, crossed out." },
{ s:{str:1, rec:1},
  cap:"<b>recA1</b> &#183; plasmid stability",
  call:"RecA recombines between repeats, and your construct is full of repeats",
  note:"RecA is the recombinase. Give it two copies of the same sequence on one plasmid, which is what you have any time you use the same promoter or terminator twice, and it will recombine between them and delete what is in the middle. You would not notice until you sequenced.",
  desc:"recA1 highlighted, with a plasmid carrying two repeats recombining down to one, crossed out." },
{ s:{str:1, mcr:1},
  cap:"<b>mcrA</b> &#183; <b>&Delta;(mrr-hsdRMS-mcrBC)</b> &#183; it stops cutting what you give it",
  call:"these systems attack <b>methylated</b> DNA &#8212; which is most of what you would move in",
  note:"And the third is restriction, but read which way round it goes here. Mcr and Mrr are methylation-dependent systems: they cut DNA because it is methylated, not because it is not. Anything you prepared in another strain, or amplified from a genome, arrives carrying somebody else's methylation pattern, and in a strain that still had these it would be destroyed on the way in. DH10B has the whole cluster deleted, which is a large part of why it transforms as well as it does.",
  desc:"The mcr and mrr-hsd tokens highlighted: methylated incoming DNA passing a crossed-out restriction step and surviving." }
], {
  end:["plasmid purity", ["EndA survives the lysis step",
                          "and chews the plasmid during the prep",
                          "endA1 is why your miniprep is a band"]],
  rec:["plasmid stability", ["RecA recombines between repeats",
                             "your construct is full of repeats",
                             "take it away and it stays as you built it"]],
  mcr:["it stops cutting what you give it",
       ["mcr and mrr cut DNA for being methylated",
        "everything from another strain is methylated",
        "deleted here — which is why it transforms"]]
});

/* ================================================================== *
 * Pass two: the tokens that took metabolism away.  After the media
 * slides, because the whole point is what the medium was going to
 * hand over.
 * ================================================================== */
build("mettok", [
{ s:{str:1},
  cap:"and three of them took <b>metabolism</b> away",
  call:"on LB you would never notice &#183; that is the trap",
  note:"The other kind of token is a metabolic defect, and the name usually describes the phenotype rather than the lesion. Now that we have been through what LB supplies and what M9 does not, these read completely differently. On rich medium every one of these is invisible, because the medium hands the cell what it can no longer make. Move to minimal and they are the whole story.",
  desc:"The DH10B genotype again, with none of the metabolic tokens highlighted yet." },
{ s:{str:1, gal:1},
  cap:"<b>galE15 galK16</b> &#183; no galactose",
  call:"fine on LB &#183; nothing on minimal with galactose as the only carbon source",
  note:"galE and galK are both in the Leloir pathway, so the strain cannot use galactose as a carbon source. On LB that is invisible. Put it on minimal medium with galactose as the only carbon source and it simply does not grow.",
  desc:"The galE and galK tokens highlighted, with growth on LB and none on galactose minimal medium." },
{ s:{str:1, ara:1},
  cap:"<b>araD139</b> &#183; no arabinose",
  call:"same shape, different sugar",
  note:"araD is a defect in arabinose utilisation, and it is the same story. Worth flagging because arabinose is also an inducer: pBAD systems are induced with arabinose, and in a strain that cannot catabolise it the induction behaves differently from a strain that can, which is sometimes a feature and sometimes a surprise.",
  desc:"The araD token highlighted, with growth on LB and none on arabinose minimal medium." },
{ s:{str:1, leu:1},
  cap:"<b>&Delta;(ara,leu)7697</b> &#183; and this one is a <b>deletion</b>",
  call:"it runs from the arabinose genes to leucine biosynthesis &#183; now it is an auxotroph",
  note:"And this one is different in kind. It is not a point mutation in a catabolic gene, it is a large deletion that runs from the arabinose catabolic genes all the way to leucine biosynthesis and takes several other things out along the way. So the strain cannot make leucine. Not cannot eat something, cannot make something, which means it will not grow on minimal medium at all, whatever carbon source you put in it, unless the medium itself hands leucine over. GMML is the one you are most likely to meet doing that: glycerol minimal medium with leucine added and no glucose in it, which is why it is the standard medium for unnatural amino acid work. Swapping the sugar cannot rescue an auxotroph; only supplying the thing it cannot make can.",
  desc:"The ara-leu deletion token highlighted, showing a large chromosomal deletion running from the arabinose genes to leucine biosynthesis. Three flasks: growth on LB, no growth on minimal medium whatever the carbon source, and growth again on GMML, which is glycerol minimal medium with leucine supplied." }
], {
  gal:["no galactose", ["galE and galK, both in the Leloir pathway",
                        "invisible on LB",
                        "nothing on minimal with galactose"]],
  ara:["no arabinose", ["same shape, different sugar",
                        "and arabinose is also the pBAD inducer",
                        "which makes induction behave differently"]],
  leu:["an auxotroph", ["a deletion, not a point mutation",
                        "it took leucine biosynthesis with it",
                        "so minimal needs leucine \u2014 GMML has it"]]
});
})();
