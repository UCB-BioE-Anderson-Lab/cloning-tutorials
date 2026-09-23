/* ------------------------------------------------------------------ *
 * 00-polar.js — why a clean knockout can silence a gene you never
 * touched.
 *
 * The source slide is a Wikipedia definition beside a static two-row
 * figure, and the definition is the part a room will not read.  The
 * figure is the argument, so it is drawn and run: transcribe the operon,
 * then knock the middle gene out properly, with a marker that carries
 * its own promoter and its own terminator, and watch the third gene go
 * dark without anything having happened to it.
 *
 * The click order is the source's own, taken from the asterisks in its
 * speaker notes.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;
const n1 = v => Math.round(v*10)/10;
const cl = (v, a, b) => v < a ? a : (v > b ? b : v);

function path(d, col, w, dash){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || 3,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  return G.el("path", a);
}
function grp(o){ return G.el("g", {opacity:n1(cl(o, 0, 1))}); }

/* a gene, as a block arrow pointing the way it is read */
function gene(x0, x1, y, label, col, o){
  const g = grp(o == null ? 1 : o), h = 30, tip = 26;
  g.appendChild(G.el("path", {d:"M"+n1(x0)+" "+n1(y-h/2)+"H"+n1(x1-tip)+
    "L"+n1(x1)+" "+n1(y)+"L"+n1(x1-tip)+" "+n1(y+h/2)+"H"+n1(x0)+"Z",
    fill:col, "fill-opacity":".16", stroke:col, "stroke-width":2.6,
    "stroke-linejoin":"round"}));
  g.appendChild(G.text((x0 + x1 - tip)/2, y + 9, label, 25, col, 700));
  return g;
}
/* the DNA itself, drawn as segments so it never runs under a gene's
 * label.  The genes are only faintly filled, so a continuous line
 * shows straight through the lettering. */
function backbone(y, gaps){
  const g = G.el("g", {});
  let x = X0;
  gaps.forEach(function(gp){
    if (gp[0] > x) g.appendChild(path("M"+n1(x)+" "+n1(y)+"H"+n1(gp[0]), C.ink, 3));
    x = gp[1];
  });
  g.appendChild(path("M"+n1(x)+" "+n1(y)+"H"+n1(X1), C.ink, 3));
  return g;
}
/* a promoter: the bent arrow every genetics figure uses */
function promoter(x, y, col, o){
  const g = grp(o == null ? 1 : o);
  g.appendChild(path("M"+n1(x)+" "+n1(y+16)+"V"+n1(y-30)+"H"+n1(x+42), col, 3.2));
  g.appendChild(path("M"+n1(x+30)+" "+n1(y-40)+"L"+n1(x+44)+" "+n1(y-30)+
    "L"+n1(x+30)+" "+n1(y-20), col, 3.2));
  return g;
}
/* a terminator: stem and loop */
function terminator(x, y, col, o){
  const g = grp(o == null ? 1 : o);
  g.appendChild(path("M"+n1(x)+" "+n1(y+16)+"V"+n1(y-22), col, 3.2));
  g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y-32), r:11, fill:"none",
    stroke:col, "stroke-width":3.2}));
  return g;
}
/* a transcript, with the arrow on the end that says which way it ran */
function mrna(x0, x1, y, o, label){
  const g = grp(o == null ? 1 : o);
  g.appendChild(path("M"+n1(x0)+" "+n1(y)+"H"+n1(x1-12), C.amber, 4.4));
  g.appendChild(path("M"+n1(x1-16)+" "+n1(y-9)+"L"+n1(x1)+" "+n1(y)+
    "L"+n1(x1-16)+" "+n1(y+9), C.amber, 4.4));
  if (label) g.appendChild(G.text((x0+x1)/2, y - 18, label, 22, C.amber, 700));
  return g;
}

/* ------------------------------------------------------------------ *
 * Two rows: the operon as it was, and the operon after the knockout.
 * ------------------------------------------------------------------ */
const AY = 300, BY = 618;                 /* the two DNA lines */
const X0 = 210, X1 = 1330;
const A = {P:250, a:[320, 500], b:[520, 700], c:[720, 900], T:940};
const B = {P:250, a:[320, 500], kP:530, k:[580, 770], kT:806,
           c:[852, 1032], T:1072};

const FR = [
{ s:{op:1},
  cap:"<b>where is the mRNA?</b>",
  call:"one promoter at the front, one terminator at the end, three genes between",
  note:"Ask it before you show them, and take answers. The common one is three: one mRNA per gene, because that is how it works in the organisms most people learned genetics in. In bacteria it usually is not. Many bacterial genes, probably most, sit in operons: one promoter at the front, several open reading frames in a row behind it, one terminator at the end. The genes in an operon are usually doing related jobs, which is why they are wired to be made together.",
  desc:"An operon drawn on a line of DNA: a promoter, three genes labelled a, b and c in a row, and a terminator. The question is where the mRNA is." },

{ s:{op:1, tx:1},
  cap:"one promoter, so <b>one</b> mRNA",
  call:"a, b and c all come off the same transcript",
  note:"One. Transcription starts at that promoter and runs to that terminator, so what comes out is a single messenger RNA spanning the whole operon, and all three genes are translated off it. That is the thing to hold on to for the next thirty seconds, because it means the three genes are not independent: anything that stops the transcript stops everything downstream of where it stopped.",
  desc:"A single mRNA is drawn above the operon, spanning all three genes from the promoter to the terminator." },

{ s:{op:1, tx:1, ko:1},
  cap:"knock <b>b</b> out properly &#183; <b>where is the mRNA now?</b>",
  call:"the marker brought its own promoter and its own terminator",
  note:"Now the same question on a different molecule. We have replaced b with a kanamycin cassette, exactly the way the last lecture taught you, and that cassette is a complete unit: its own promoter so it is expressed wherever it lands, its own terminator so it stops cleanly. Both of those are sensible decisions in isolation. So ask again, and make them be specific: how many mRNAs are on this molecule now, and where does each one start and stop? Nothing here needs new knowledge. It needs them to read what is actually written.",
  desc:"The same operon with gene b replaced by a kanamycin resistance gene that carries its own promoter in front of it and its own terminator behind it. The question is asked again: where is the mRNA now?" },

{ s:{op:1, tx:1, ko:1, tx2:1, tx3:1, dead:1},
  cap:"<b>two</b> mRNAs, and neither one reaches <b>c</b>",
  call:"nothing was done to c, and c is gone",
  note:"Two, and this is the answer that catches people. The operon promoter still fires and still reads through a, so a is made exactly as before. The cassette is expressed from the promoter it brought with it, which is what that promoter was for. But the cassette also brought a terminator, and that terminator now sits between the operon promoter and gene c, so the transcript that used to reach c stops before it gets there. Gene c was not deleted. It was not mutated. Its sequence is exactly what it always was, and it is silent, because the only promoter that ever drove it is now cut off from it. Phenotypically the cell behaves as though you knocked out two genes. That is a polar mutation: the edit affects the expression of genes downstream of it. It is only one of the ways this can happen, but the lesson generalises. When you design an edit, work out the sequence of the finished genome and read it as the cell will read it, rather than checking that the thing you meant to remove is gone.",
  desc:"Two mRNAs appear: one from the operon promoter that stops at the cassette's terminator, and one covering the kanamycin gene from its own promoter. Gene c is covered by neither, and is marked as not expressed." }
];

window.Deck.sequence("polar", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});
    const half = x => cl(x*2 - 1, 0, 1);

    /* ---- row A: the operon as it stands ------------------------- */
    const a = grp(half(v.op));
    a.appendChild(backbone(AY, [A.a, A.b, A.c]));
    a.appendChild(promoter(A.P, AY, C.blue));
    a.appendChild(gene(A.a[0], A.a[1], AY, "a", C.blue));
    a.appendChild(gene(A.b[0], A.b[1], AY, "b", C.blue));
    a.appendChild(gene(A.c[0], A.c[1], AY, "c", C.blue));
    a.appendChild(terminator(A.T, AY, C.blue));
    a.appendChild(G.text(X0 - 12, AY + 9, "5′", 22, C.muted, 400, "end"));
    g.appendChild(a);
    if (v.tx > 0.02)
      g.appendChild(mrna(A.P + 46, A.T - 18, AY - 84, half(v.tx), "one mRNA"));

    /* ---- row B: the same operon, after the knockout ------------- */
    if (half(v.ko) > 0.02){
      const b = grp(half(v.ko));
      b.appendChild(backbone(BY, [B.a, B.k, B.c]));
      b.appendChild(promoter(B.P, BY, C.blue));
      b.appendChild(gene(B.a[0], B.a[1], BY, "a", C.blue));
      b.appendChild(promoter(B.kP, BY, C.verm));
      b.appendChild(gene(B.k[0], B.k[1], BY, "kanR", C.verm));
      b.appendChild(terminator(B.kT, BY, C.verm));
      b.appendChild(gene(B.c[0], B.c[1], BY, "c", C.blue));
      b.appendChild(terminator(B.T, BY, C.blue));
      b.appendChild(G.text(X0 - 12, BY + 9, "5′", 22, C.muted, 400, "end"));
      b.appendChild(G.text((B.k[0] + B.k[1])/2, BY + 74,
        "its own promoter, its own terminator", 22, C.verm, 400));
      g.appendChild(b);
    }
    /* what the operon promoter manages now: gene a, and then it stops */
    if (v.tx2 > 0.02)
      g.appendChild(mrna(B.P + 46, B.kT - 14, BY - 84, half(v.tx2)));
    /* and the cassette, from the promoter it brought with it */
    if (v.tx3 > 0.02)
      g.appendChild(mrna(B.kP + 46, B.kT - 14, BY - 130, half(v.tx3)));
    /* and c, which nobody touched */
    if (v.dead > 0.02){
      const d = grp(half(v.dead));
      const cx = (B.c[0] + B.c[1] - 26)/2;
      d.appendChild(G.el("rect", {x:n1(cx - 118), y:n1(BY - 124), width:236,
        height:44, rx:8, fill:"#ffffff", stroke:C.verm, "stroke-width":2.6}));
      d.appendChild(G.text(cx, BY - 94, "not expressed", 24, C.verm, 700));
      d.appendChild(path("M"+n1(cx)+" "+n1(BY - 78)+"V"+n1(BY - 24), C.verm, 2.6, "7 6"));
      g.appendChild(d);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
