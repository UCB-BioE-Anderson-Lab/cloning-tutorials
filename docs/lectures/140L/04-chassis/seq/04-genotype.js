/* ------------------------------------------------------------------ *
 * 04-genotype.js — the Mach1 genotype, one token at a time.
 *
 * The source spends seven slides on this, and every one of them
 * reprints the whole genotype string and then adds two or three bullets
 * under it.  Four hundred words, no figure, and the bottom half of
 * every slide empty.  It is not seven slides, it is one walk: the
 * string stays where it is, a token lights, and you see what that token
 * costs or buys.
 *
 * Walk order is not string order.  The three cloning mutations go
 * together because they are one idea, fhuA is insurance and stands
 * alone, and the two lac tokens are deliberately last and in that
 * order, because Delta(lac)X74 raises the question that Phi80 answers
 * -- and the answer runs straight into the complementation slide.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);
const MONO = "ui-monospace,SFMono-Regular,Menlo,monospace";

function grp(o){ return G.el("g", {opacity:n1(cl(o == null ? 1 : o, 0, 1))}); }
function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function box(x, y, w, h, col, r, o){
  return G.el("rect", {x:n1(x), y:n1(y), width:n1(w), height:n1(h), rx:r == null ? 6 : r,
    fill:col, "fill-opacity":o == null ? ".14" : o, stroke:col, "stroke-width":2.6});
}
function cross(cx, cy, r){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(cx-r)+" "+n1(cy-r)+"L"+n1(cx+r)+" "+n1(cy+r), C.verm, 5));
  g.appendChild(path("M"+n1(cx+r)+" "+n1(cy-r)+"L"+n1(cx-r)+" "+n1(cy+r), C.verm, 5));
  return g;
}
function arrow(x0, x1, y, col){
  const g = G.el("g", {});
  g.appendChild(path("M"+n1(x0)+" "+n1(y)+"H"+n1(x1-10), col, 2.8));
  g.appendChild(path("M"+n1(x1-17)+" "+n1(y-8)+"L"+n1(x1)+" "+n1(y)+
    "L"+n1(x1-17)+" "+n1(y+8), col, 2.8));
  return g;
}
/* a stretch of chromosome with named stuff on it */
function chrom(y, x0, x1, feats){
  const g = G.el("g", {});
  let x = x0;
  feats.forEach(function(f){
    if (f[0] > x) g.appendChild(path("M"+n1(x)+" "+n1(y)+"H"+n1(f[0]), C.ink, 3));
    x = f[1];
  });
  g.appendChild(path("M"+n1(x)+" "+n1(y)+"H"+n1(x1), C.ink, 3));
  return g;
}
/* a membrane, as two rows of heads */
function membrane(y, x0, x1, col, gapAt){
  const g = G.el("g", {});
  for (let x = x0; x <= x1 - 14; x += 19){
    if (gapAt && x > gapAt[0] && x < gapAt[1]) continue;
    [y - 9, y + 9].forEach(function(yy){
      g.appendChild(G.el("circle", {cx:n1(x + 7), cy:n1(yy), r:7, fill:col,
        "fill-opacity":".30", stroke:col, "stroke-width":1.6}));
    });
  }
  return g;
}

/* ---- the genotype, in string order -------------------------------- */
const CW = 15, FS = 25, SY = 246;
const TOK = [
  {s:"str. W",                k:"par"},
  {s:"ΔrecA1398",        k:"rec"},
  {s:"endA1",                 k:"end"},
  {s:"fhuA",                  k:"fhu"},
  {s:"Φ80Δ(lac)M15", k:"phi"},
  {s:"Δ(lac)X74",        k:"lac"},
  {s:"hsdR(rK– mK+)",    k:"hsd"}
];
(function(){                       /* lay the string out, centred      */
  let n = 0;
  TOK.forEach(function(t, i){ t.n = n; n += t.s.length + (i < TOK.length - 1 ? 2 : 0); });
  const x0 = 800 - n*CW/2;
  TOK.forEach(function(t){ t.x = x0 + t.n*CW; t.w = t.s.length*CW; });
})();

/* ---- what each token is for --------------------------------------- */
const PANEL = {
  par: ["the parent",
        ["a genotype lists differences from a reference",
         "the reference is MG1655 unless told otherwise",
         "here you are told otherwise — and BL-1 cares"]],
  rec: ["plasmid stability",
        ["RecA recombines between repeats",
         "your construct is full of repeats",
         "take RecA away and it stays as you built it"]],
  end: ["plasmid purity",
        ["EndA is a nuclease that survives lysis",
         "it chews the plasmid during the miniprep",
         "endA1 is why your prep is not a smear"]],
  hsd: ["transformation efficiency",
        ["rK– : it will not cut what you put in",
         "mK+ : it still methylates what it keeps",
         "which matters when you move that DNA on"]],
  fhu: ["insurance",
        ["T1, T5 and Φ80 all enter through FhuA",
         "no FhuA, no door",
         "T1 is tough and can clear a whole bench"]],
  lac: ["the whole lac operon, gone",
        ["Δ cod–mhpF, and flanking DNA with it",
         "but the strain is sold for blue-white screening",
         "and blue-white screening needs lacZ…"]],
  phi: ["…and here is the answer",
        ["a defective Φ80 prophage puts part of it back",
         "carrying lacZ with the M15 deletion in it",
         "which is the big piece, two slides from now"]]
};

/* ---- and what each one looks like ---------------------------------- */
function draw(k){
  const g = G.el("g", {}), CX = 560;
  if (k === "par"){
    g.appendChild(box(300, 380, 210, 56, C.muted));
    g.appendChild(G.text(405, 416, "MG1655", 25, C.muted, 700));
    g.appendChild(G.text(405, 460, "the default reference", 19, C.muted, 400));
    g.appendChild(box(300, 546, 210, 56, C.verm));
    g.appendChild(G.text(405, 582, "E. coli W", 25, C.verm, 700));
    g.appendChild(arrow(520, 596, 574, C.verm));
    g.appendChild(box(606, 546, 190, 56, C.verm));
    g.appendChild(G.text(701, 582, "Mach1", 25, C.verm, 700));
    g.appendChild(G.text(405, 626, "ATCC 9637 · sequenced", 19, C.muted, 400));
    g.appendChild(G.text(701, 626, "never published", 19, C.muted, 400));
  } else if (k === "rec"){
    g.appendChild(G.el("circle", {cx:440, cy:510, r:96, fill:"none",
      stroke:C.ink, "stroke-width":3}));
    [[-130, -50], [-50, 30]].forEach(function(a, i){
      const p0 = G.pt(440, 510, 96, a[0]), p1 = G.pt(440, 510, 96, a[1]);
      g.appendChild(G.el("path", {d:"M"+p0[0]+" "+p0[1]+"A96 96 0 0 1 "+p1[0]+" "+p1[1],
        fill:"none", stroke:C.blue, "stroke-width":12, "stroke-linecap":"round"}));
    });
    g.appendChild(G.text(440, 386, "two repeats", 20, C.blue, 700));
    g.appendChild(arrow(560, 636, 510, C.muted));
    g.appendChild(G.el("circle", {cx:750, cy:510, r:64, fill:"none",
      stroke:C.muted, "stroke-width":3}));
    g.appendChild(G.text(750, 606, "one repeat left", 20, C.muted, 400));
    g.appendChild(cross(750, 510, 40));
  } else if (k === "end"){
    g.appendChild(G.el("circle", {cx:420, cy:500, r:86, fill:"none",
      stroke:C.blue, "stroke-width":3}));
    g.appendChild(G.text(420, 616, "your plasmid", 20, C.blue, 700));
    g.appendChild(arrow(530, 606, 500, C.muted));
    [[690,470],[740,512],[688,540],[752,462],[726,560]].forEach(function(d){
      g.appendChild(path("M"+d[0]+" "+d[1]+"l26 12", C.muted, 5));
    });
    g.appendChild(G.text(722, 616, "a smear", 20, C.muted, 400));
    g.appendChild(box(556, 400, 118, 52, C.verm, 26));
    g.appendChild(G.text(615, 434, "EndA", 22, C.verm, 700));
    g.appendChild(cross(615, 426, 40));
  } else if (k === "hsd"){
    /* left to right, because the order is the argument: it goes in, it
       is not cut, and it comes back out carrying marks */
    g.appendChild(G.el("circle", {cx:352, cy:520, r:62, fill:"none",
      stroke:C.blue, "stroke-width":3}));
    g.appendChild(G.text(352, 428, "incoming DNA", 20, C.blue, 700));
    g.appendChild(arrow(428, 500, 520, C.muted));
    g.appendChild(box(520, 492, 160, 56, C.verm, 28));
    g.appendChild(G.text(600, 528, "restrict", 22, C.verm, 700));
    g.appendChild(cross(600, 520, 42));
    g.appendChild(G.text(600, 600, "rK\u2013", 21, C.muted, 400));
    g.appendChild(arrow(700, 772, 520, C.muted));
    g.appendChild(G.el("circle", {cx:862, cy:520, r:62, fill:"none",
      stroke:C.blue, "stroke-width":3}));
    [[-62,-14],[-22,-58],[40,-48],[60,24],[-8,62]].forEach(function(d){
      g.appendChild(G.el("circle", {cx:862+d[0], cy:520+d[1], r:8, fill:C.blue}));
    });
    g.appendChild(G.text(862, 428, "kept, and methylated", 20, C.blue, 700));
    g.appendChild(G.text(862, 616, "mK+", 21, C.muted, 400));
  } else if (k === "fhu"){
    g.appendChild(membrane(600, 280, 880, C.amber, [520, 604]));
    g.appendChild(G.el("rect", {x:520, y:574, width:84, height:52, rx:8,
      fill:"none", stroke:C.muted, "stroke-width":2.6, "stroke-dasharray":"7 5"}));
    g.appendChild(G.text(562, 680, "no FhuA", 20, C.muted, 400));
    g.appendChild(G.text(280, 680, "outer membrane", 19, C.muted, 400, "start"));
    const ph = G.el("g", {transform:"translate(562 420)"});
    ph.appendChild(G.el("path", {d:"M0 -42L38 -20V22L0 44L-38 22V-20Z",
      fill:C.verm, "fill-opacity":".18", stroke:C.verm, "stroke-width":3,
      "stroke-linejoin":"round"}));
    ph.appendChild(path("M0 44V82", C.verm, 4));
    ph.appendChild(path("M-16 82H16", C.verm, 4));
    g.appendChild(ph);
    g.appendChild(G.text(562, 348, "T1 · T5 · Φ80", 21, C.verm, 700));
    g.appendChild(cross(562, 548, 24));
  } else if (k === "lac"){
    g.appendChild(chrom(520, 260, 900, [[470, 690]]));
    g.appendChild(path("M470 500V540", C.verm, 3));
    g.appendChild(path("M690 500V540", C.verm, 3));
    g.appendChild(path("M470 520H690", C.verm, 3, "8 7"));
    g.appendChild(G.text(580, 478, "Δ(lac)X74", 23, C.verm, 700));
    g.appendChild(G.text(580, 576, "lacI lacZ lacY lacA · and neighbours",
      20, C.muted, 400));
    g.appendChild(G.text(260, 566, "chromosome", 19, C.muted, 400, "start"));
  } else {
    g.appendChild(chrom(560, 260, 900, [[430, 760]]));
    g.appendChild(box(430, 528, 330, 64, C.muted, 6, ".06"));
    g.appendChild(G.el("rect", {x:430, y:528, width:330, height:64, rx:6,
      fill:"none", stroke:C.muted, "stroke-width":2.2, "stroke-dasharray":"7 5"}));
    g.appendChild(G.text(595, 508, "Φ80 prophage · next to tonB",
      20, C.muted, 400));
    g.appendChild(box(456, 540, 278, 40, C.blue));
    g.appendChild(G.text(595, 568, "lacZΔM15", 23, C.blue, 700));
    g.appendChild(G.text(595, 632, "the piece that gets complemented",
      20, C.blue, 400));
    g.appendChild(G.text(260, 606, "chromosome", 19, C.muted, 400, "start"));
  }
  return g;
}

const FR = [
{ s:{str:1},
  cap:"a genotype is a <b>list of differences</b> from a parent",
  call:"seven tokens &#183; not one of them makes the cell better at living",
  note:"These are the cells you are using, and this line is the whole specification. Read it as a list of differences from a parent strain, because that is all a genotype ever is. Seven tokens. Every one was put there on purpose, by somebody, to make the organism better at a job, and not one of them makes it better at being alive. We will take them in the order that makes sense rather than the order they are written, and the last two are deliberately last.",
  desc:"The Mach1 genotype written out as seven tokens, none highlighted yet." },

{ s:{str:1, par:1},
  cap:"<b>str. W</b> &#183; the parent",
  call:"stated because it is <b>not</b> the default &#183; the default is MG1655",
  note:"The first token is the parent, and the fact that it is there at all is the information. A genotype is a list of differences from a reference, and the reference is MG1655 unless somebody tells you otherwise. Here somebody has told you otherwise. Mach1 descends from E. coli W, a natural isolate that is not K-12. W has been sequenced, CP002185.1, and you can go and read it. Mach1 itself has never been published, so everything after this token is a claim about differences from a genome you can read, applied to a strain you cannot. And it is not academic: being non-K-12 has implications for BL-1 status at some facilities.",
  desc:"The parent token highlighted, with MG1655 shown as the default reference and E. coli W giving rise to Mach1 instead." },

{ s:{str:1, rec:1},
  cap:"<b>&Delta;recA1398</b> &#183; plasmid stability",
  call:"RecA recombines between repeats, and your construct is full of repeats",
  note:"The first of the three standard cloning mutations, and you met all three on DH10B. RecA is the recombinase. Give it two copies of the same sequence on one plasmid, which is exactly what you have any time you use the same promoter or terminator twice, and it will recombine between them and delete whatever is in the middle. You would not necessarily notice until you sequenced. Take RecA away and the plasmid stays as you built it.",
  desc:"The recA token highlighted, with a plasmid carrying two repeats recombining down to one, crossed out." },

{ s:{str:1, end:1},
  cap:"<b>endA1</b> &#183; plasmid purity",
  call:"a nuclease that survives lysis and chews the prep",
  note:"EndA is a non-specific endonuclease, and the problem with it is that it survives the alkaline lysis step. So it is still active in the tube while you are purifying, and it degrades the plasmid you are trying to recover. A miniprep from an endA positive strain comes off the column looking like a smear instead of a band. This mutation is the reason your prep works.",
  desc:"The endA token highlighted, with a plasmid being degraded to a smear by EndA, crossed out." },

{ s:{str:1, hsd:1},
  cap:"<b>hsdR(rK&ndash; mK+)</b> &#183; transformation efficiency",
  call:"restriction off, methylation still on &#8212; and the second half matters",
  note:"The host restriction and modification system. Read the parentheses, because they are two separate statements. r minus means restriction is off, so the strain will not chop up DNA you transform into it, which is what makes it transform well. But m plus means methylation is still on, so everything the strain keeps comes back out carrying that strain's methylation pattern. That is invisible to you until you move that DNA into something that does restrict, and then it is not invisible at all.",
  desc:"The hsdR token highlighted: incoming DNA passes a crossed-out restriction step, and comes back out carrying methyl marks." },

{ s:{str:1, fhu:1},
  cap:"<b>fhuA</b> &#183; insurance",
  call:"T1, T5 and &Phi;80 all come in through this one door",
  note:"FhuA is an outer membrane transporter for ferrichrome, and for a couple of antibiotics, and for colicin M. None of that is why it is on this list. It is on this list because it is also the receptor that phages T1, T5 and phi80 use to get into the cell. Knock it out and they cannot get in. T1 is the one anybody actually worries about: it is tough, it spreads through a lab fast, and a T1 contamination can take out every culture on the bench in a week. So this mutation is not about iron. It is insurance.",
  desc:"The fhuA token highlighted: the outer membrane with the FhuA pore missing, and a phage unable to get in." },

{ s:{str:1, lac:1},
  cap:"<b>&Delta;(lac)X74</b> &#183; the whole operon, gone",
  call:"so how is this strain sold as ready for <b>blue-white screening</b>?",
  note:"This one takes out the entire lac operon and some of what is around it. The full extent is delta cod to mhpF, so lacI, lacZ, lacY, lacA and several neighbours. Now stop on that, because it should bother them. The strain is sold as ready for blue-white screening. Blue-white screening is an assay for beta-galactosidase. Beta-galactosidase is lacZ. And lacZ is not in this cell. Let them sit with it before you click.",
  desc:"The lac operon token highlighted, showing the deletion of lacI, lacZ, lacY and lacA from the chromosome." },

{ s:{str:1, phi:1},
  cap:"<b>&Phi;80&Delta;(lac)M15</b> &#183; and here is the answer",
  call:"deleted from the chromosome, then <b>part of it put back</b> on a prophage",
  note:"Taken out with one hand and a piece put back with the other. The cell carries a defective lambdoid prophage, phi80, integrated next to tonB, and on that prophage is a lacZ gene carrying the M15 deletion, along with wild-type lacI and lacYA. That gene makes a beta-galactosidase that does not work on its own and can be rescued by a small fragment supplied from somewhere else. Which is the next slide but one, and it is also why the genotype and the product blurb are not contradicting each other.",
  desc:"The phi80 token highlighted: a defective prophage next to tonB carrying lacZ with the M15 deletion." }
];

window.Deck.sequence("genotype", function(slide){
  const s = G.scene(slide, 792, 838);
  s.finish();

  function paint(v, f){
    const g = G.el("g", {}), st = f.s || {};
    const lit = TOK.filter(t => (st[t.k] || 0) > 0.5)[0];

    /* ---- the genotype, which never moves -------------------------- */
    const strip = grp(v.str);
    TOK.forEach(function(t){
      const on = lit && lit.k === t.k;
      if (on) strip.appendChild(G.el("rect", {x:n1(t.x - 10), y:SY - 30,
        width:n1(t.w + 20), height:44, rx:7, fill:C.verm, "fill-opacity":".14",
        stroke:C.verm, "stroke-width":2.4}));
      strip.appendChild(G.el("text", {x:n1(t.x), y:SY, "font-size":FS,
        "font-family":MONO, fill:on ? C.verm : (lit ? C.muted : C.ink),
        "font-weight":700}, t.s));
    });
    strip.appendChild(G.text(TOK[0].x, SY - 44, "Mach1", 22, C.muted, 400, "start"));
    g.appendChild(strip);

    /* ---- what the lit token does ---------------------------------- */
    TOK.forEach(function(t){
      const o = cl((v[t.k] || 0)*2 - 1, 0, 1);
      if (o < 0.02) return;
      const p = grp(o);
      p.appendChild(draw(t.k));
      const txt = PANEL[t.k];
      p.appendChild(G.text(1010, 424, txt[0], 30, C.verm, 700, "start"));
      txt[1].forEach(function(line, i){
        p.appendChild(G.text(1010, 486 + i*44, line, 22, C.ink, 400, "start"));
      });
      g.appendChild(p);
    });

    /* ---- and before any of them ------------------------------------ */
    if (!lit){
      const q = grp(v.str);
      ["one token, one deliberate change",
       "none of them is there for the cell’s benefit",
       "read it as a diff, not as a description"]
        .forEach(function(line, i){
          q.appendChild(path("M480 "+n1(432 + i*90)+"V"+n1(472 + i*90), C.verm, 4));
          q.appendChild(G.text(510, n1(464 + i*90), line, 28, C.ink, 400, "start"));
        });
      g.appendChild(q);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
