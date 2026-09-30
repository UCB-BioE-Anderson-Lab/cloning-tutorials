/* ------------------------------------------------------------------ *
 * 01-dogma.js — source slides 7 to 14, which are one figure.
 *
 * The source builds this over eight slides: slide 7 puts up DNA, RNA,
 * protein and metabolites, and each of 8 through 14 adds one kind of
 * interaction with a paragraph of narration.  Nothing else on any of
 * them changes.  So it is one slide with eight clicks, and the whole
 * eight-slide budget comes back.
 *
 * WHY A RECTANGLE.  Four nodes have exactly six pairs, and a rectangle
 * draws all six as straight lines — four sides and two diagonals — with
 * a self-interaction hung off one corner.  Seven relations, seven beats,
 * no arcs to nest and no labels to rotate.  Laid out so the dogma runs
 * clockwise from the top left: transcription along the top, translation
 * down the right, catalysis back along the bottom.  The fourth side
 * would close that cycle, and it is the one the source calls rare, so
 * the cycle deliberately does not close.
 *
 * The two feedback relations that would sit on top of a side already in
 * use bulge OUTSIDE the rectangle instead of running parallel to it.
 * Parallel pairs need their labels stacked above and below one line, and
 * at this scale that put them through the diagonals.
 *
 * THE COLOUR IS THE ARGUMENT.  DNA, RNA and protein are blue because
 * you can encode them.  Metabolites are muted because you cannot: there
 * is no part whose product is a metabolite, only parts for the enzymes
 * that make one, and the last beat says so.  That is the distinction the
 * rest of the lecture is organised by.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

/* Node centres.  Room enough between the rows that the two diagonals
   cross well clear of every label, and narrow enough that the outward
   bulges still land inside the content box (x 110 to 1490). */
const NW = 250, NH = 92;
const DNA = [450, 292], RNA = [1150, 292], PRO = [1150, 622], MET = [450, 622];
const N = {
  dna: {p:DNA, t:"DNA",         col:C.blue,  sub:null},
  rna: {p:RNA, t:"RNA",         col:C.blue,  sub:null},
  pro: {p:PRO, t:"protein",     col:C.blue,  sub:null},
  met: {p:MET, t:"metabolites", col:C.muted, sub:"not encoded"}
};
function E(a, b){ return K.edge(N[a].p[0], N[a].p[1], NW, NH, N[b].p[0], N[b].p[1]); }

/* ------------------------------------------------------------------ *
 * The nine arrows, in the order the source adds them.  0 and 1 are the
 * dogma itself and are up from the first beat; 2 to 8 are one per click.
 *
 *   k  "line"  straight between two node edges
 *      "bulge" a quadratic bowing out of the rectangle, for a relation
 *              whose side is already taken
 *      "self"  the loop under protein
 *   lab  where the words go, and how they anchor.  Every one is
 *        horizontal: a rotated label along a line is unreadable from
 *        the back of the room, which is a note from the Chassis deck.
 * ------------------------------------------------------------------ */
const A = [
{ k:"line",  a:"dna", b:"rna", col:C.blue,
  lab:[800, 340, "transcription", "middle"] },
{ k:"line",  a:"rna", b:"pro", col:C.blue,
  lab:[1058, 466, "translation", "end"] },

{ k:"line",  a:"pro", b:"met", col:C.verm,
  lab:[800, 586, "enzymes make them and break them", "middle"] },
/* The two diagonals cross in the middle of the box, so their labels go
   at the same distance ALONG each line rather than at the midpoints:
   one third of the way down the DNA-protein diagonal and one third of
   the way up the metabolite-RNA one puts them at the same x and 130px
   apart in y, which is the only arrangement tried that clears both
   diagonals, both edge labels and all four boxes.  Each sits on its own
   paper, so the line it names runs behind it rather than through it. */
{ k:"line",  a:"met", b:"rna", col:C.verm,
  lab:[660, 523, "riboswitches", "middle"], pad:1 },
{ k:"line",  a:"met", b:"dna", col:C.muted, dash:"3 9",
  lab:[496, 466, "rare", "start"] },
{ k:"self",  a:"pro", b:"pro", col:C.verm,
  lab:[1150, 768, "complexes", "middle"] },
{ k:"bulge", a:"pro", b:"rna", col:C.verm, bow:150,
  lab:[1330, 466, "binds an mRNA", "middle"] },
{ k:"line",  a:"pro", b:"dna", col:C.verm,
  lab:[660, 391, "repressors — and the polymerase itself", "middle"], pad:1 },
{ k:"bulge", a:"rna", b:"dna", col:C.muted, bow:66, dash:"3 9",
  lab:[800, 244, "rare", "middle"] }
];

/* A quadratic bowing out of the rectangle, plus its head on the real
   tangent at the end rather than on the chord — at this curvature the
   chord is off by about fifteen degrees, which reads as a bent arrow. */
function bulge(p0, p1, bow, col, dash){
  const g = K.el("g", {});
  const mx = (p0[0] + p1[0])/2, my = (p0[1] + p1[1])/2;
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
  const m = Math.sqrt(dx*dx + dy*dy) || 1;
  const cx = mx - dy/m*bow, cy = my + dx/m*bow;   /* control point      */
  /* stop short of the node, along the curve's own tangent at t=1 */
  const tx = p1[0] - cx, ty = p1[1] - cy;
  const tm = Math.sqrt(tx*tx + ty*ty) || 1;
  const ex = p1[0] - tx/tm*13, ey = p1[1] - ty/tm*13;
  g.appendChild(K.path("M"+n1(p0[0])+" "+n1(p0[1])+"Q"+n1(cx)+" "+n1(cy)+
    " "+n1(ex)+" "+n1(ey), col, 3, dash));
  g.appendChild(K.head(p1[0], p1[1], Math.atan2(ty, tx)*180/Math.PI, col));
  return g;
}
/* The self loop: out of the bottom of protein, round, and back in.  Hung
   below rather than beside, because beside is where the bulge goes. */
function selfLoop(col){
  const x = PRO[0], y = PRO[1] + NH/2, w = 96, h = 88;
  const g = K.el("g", {});
  g.appendChild(K.path("M"+n1(x - 46)+" "+n1(y + 4)+
    "C"+n1(x - w)+" "+n1(y + h)+" "+n1(x + w)+" "+n1(y + h)+" "+
    n1(x + 46)+" "+n1(y + 16), col, 3));
  g.appendChild(K.head(x + 46, y + 6, -72, col));
  return g;
}

function drawArrow(i, u){
  const s = A[i], g = K.grp(u);
  const col = s.col;
  if (s.k === "self")       g.appendChild(selfLoop(col));
  else if (s.k === "bulge") g.appendChild(bulge(E(s.a, s.b), E(s.b, s.a), s.bow, col, s.dash));
  else                      g.appendChild(K.arrow(E(s.a, s.b), E(s.b, s.a), col, 3, 0, 0, s.dash));
  const L = s.lab;
  /* A 23px label over a 3px line: the line is not hidden by the glyphs,
     so anything sitting ON its own diagonal lays paper down first.  The
     width is estimated from the character count because measuring a text
     node means it has to be in the document already, and this one is not
     yet.  0.5em per character is generous for this face at this size. */
  if (s.pad){
    const w = L[2].length*23*0.5 + 20;
    g.appendChild(K.el("rect", {x:n1(L[0] - w/2), y:n1(L[1] - 21),
      width:n1(w), height:28, fill:C.paper, stroke:"none"}));
  }
  g.appendChild(K.text(L[0], L[1], L[2], 23, col, s.col === C.muted ? 400 : 700, L[3]));
  return g;
}

/* Every beat carries the whole set of opacities, so a jump backward
   through the deck settles to the right picture rather than to whatever
   the forward pass left behind.  a0 and a1 never leave. */
function fr(n){ const o = {}; for (let i = 0; i < A.length; i++) o["a"+i] = i <= n ? 1 : 0; return o; }

const FR = [
{ s:fr(1),
  cap:"four kinds of molecule, and the two arrows you already have",
  call:"everything a cell does is somewhere on this picture",
  note:"Start with what you already know. DNA is transcribed into RNA, and messenger RNA is translated into protein. Those are the two arrows of the central dogma and they run along the top and down the right. The fourth box is metabolites, the small molecules the cell makes and consumes, and it is a different colour for a reason we will get to at the end. What the next few clicks do is fill in the rest of the pairs, because the dogma's two arrows are nowhere near all the ways these four things act on each other.",
  desc:"DNA, RNA and protein in blue at three corners of a rectangle, metabolites in grey at the fourth, with transcription drawn along the top edge and translation down the right." },

{ s:fr(2),
  cap:"protein acts on metabolites",
  call:"this is most of what an enzyme is for",
  note:"A protein might convert one biochemical into another, which is what an enzyme does, or bind one without changing it, which is what a receptor does. This arrow closes the loop back along the bottom: DNA to RNA to protein to chemistry. Almost every metabolic engineering project you will ever see is an argument about this one arrow.",
  desc:"An arrow added along the bottom edge from protein to metabolites, labelled as enzymes making and breaking them." },

{ s:fr(3),
  cap:"metabolites act on RNA",
  call:"a riboswitch is a sensor with no protein in it",
  note:"A small molecule can bind an RNA directly and change what that RNA does. Riboswitches are exactly this: a stretch of the messenger folds around a metabolite, and depending on the switch that either stops transcription from finishing or stops the ribosome from starting. Notice what that means as a design object. You get a sensor for a chemical with no protein involved anywhere.",
  desc:"A diagonal arrow added from metabolites up to RNA, labelled riboswitches." },

{ s:fr(4),
  cap:"metabolites act on DNA — rarely",
  call:"drawn dashed because you will almost never build with it",
  note:"Small molecules interacting with DNA directly is rare, but it is not nothing. Several natural products do it, including the antitumour agent calicheamicin, which binds DNA and cuts it. It is dashed here because it is real chemistry that you will essentially never reach for as a part, and that distinction is worth keeping visible on the diagram rather than flattening every arrow to look equally useful.",
  desc:"A dashed grey arrow added up the left edge from metabolites to DNA, labelled rare." },

{ s:fr(5),
  cap:"protein acts on protein",
  call:"complexes · and one subunit inhibiting another",
  note:"Two proteins may bind one another to form a complex. That interaction might inhibit one of the partners, or it might be the only way either of them works at all — plenty of enzymes are obligate dimers. This is also where scaffolds and two-hybrid systems live, and it is the one relation on the diagram that starts and ends in the same box.",
  desc:"A loop added below the protein box, returning to it, labelled as complexes and one subunit inhibiting another." },

{ s:fr(6),
  cap:"protein acts on RNA",
  call:"and one of the enzymes that does it is itself part RNA",
  note:"Proteins act on RNAs too. Some bind a specific sequence in a messenger and block the ribosome, which is translational repression. Others cut RNA: RNase P is the nice example, because the enzyme that does the cutting is a complex of a protein and an RNA, so it sits on two boxes of this diagram at once.",
  desc:"An arrow added bowing out to the right of the rectangle, from protein back up to RNA, labelled as binding an mRNA." },

{ s:fr(7),
  cap:"protein acts on DNA",
  call:"including every polymerase and every repressor you will use",
  note:"Proteins bind DNA near a promoter and repress transcription, or bind and activate it. And transcription itself is done by a protein that binds DNA and catalyses RNA synthesis, so this arrow is not an exotic special case — it is the machinery the top edge of this diagram runs on. Every transcription factor in the next section is this arrow.",
  desc:"A diagonal arrow added from protein up to DNA, labelled repressors and the polymerase itself." },

{ s:fr(8),
  cap:"RNA acts on DNA — rarely",
  call:"all six pairs, and one of them twice",
  note:"And finally RNA acting on DNA, which like the metabolite case is rare but not absent — there are RNA enzymes that will cleave DNA. That is all six pairs among four molecules, plus protein on itself. Every behaviour of a cell you will try to engineer is somewhere on this picture.",
  desc:"A dashed grey arrow added bowing above the top edge from RNA back to DNA, labelled rare, completing all six pairs." },

{ s:fr(8), on:["split"],
  cap:"three of these four you can write down",
  call:"so a part is DNA — and which box it works in is how we sort them",
  note:"Here is the payoff, and it is the reason this section exists. Every part is a stretch of DNA, because DNA is what you order and clone and put in a cell. But what a part does, it does as one of three things: as DNA itself, as the RNA transcribed from it, or as the protein translated from that. Those are the three blue boxes. The grey box is grey because you cannot encode a metabolite — there is no part whose product is a small molecule, only parts for the enzymes that make one. So the rest of this lecture has three sections, one per blue box, and the first question to ask about any part you meet is which of them it acts in.",
  desc:"The three blue boxes are marked as the three levels a part can act on, with metabolites set aside as the one thing you cannot encode." }
];

window.Deck.sequence("dogma", function(slide){
  const s = K.scene(slide, 800, 846);

  /* The closing beat's annotation is scene rather than dyn: it fades in
     over a picture that is finished and no longer moving.
     NOT a dashed box round the figure, which was the first attempt: the
     three blue nodes sit at three corners of a rectangle, so every box
     that contains them contains metabolites too, and the caption under
     it says "the three levels", which the drawing then contradicts.  A
     badge on each of the three, and a tag on the one that is excluded,
     says it without the geometry arguing back. */
  const sp = K.el("g", {});
  /* OUTSIDE each node, not inside its corner.  This group is scene and
     paint() draws the boxes into dyn, which is appended after it, so a
     badge placed on a box is painted over by the box's own paper and
     simply never appears. */
  [["dna", 1, -1], ["rna", 2, 1], ["pro", 3, 1]].forEach(function(b){
    const q = N[b[0]].p, bx = q[0] + b[2]*(NW/2 + 30);
    sp.appendChild(K.el("circle", {cx:n1(bx), cy:n1(q[1]),
      r:21, fill:C.blue, stroke:"none"}));
    sp.appendChild(K.text(bx, q[1] + 9, String(b[1]), 25, C.paper, 700));
  });
  /* Under the box, not beside it.  End-anchored to its left, the second
     line started at x 34 and the content box starts at 110. */
  sp.appendChild(K.text(MET[0], MET[1] + NH/2 + 40,
    "no part makes one — only the enzyme that does", 22, C.verm, 700));
  s.part("split", sp);
  s.finish();

  function paint(v){
    const g = K.el("g", {});
    /* arrows under the boxes, so a head that overshoots is hidden by the
       node it points at rather than drawn across its label */
    for (let i = 0; i < A.length; i++){
      const u = v["a"+i];
      if (u > 0.02) g.appendChild(drawArrow(i, u));
    }
    for (const k in N){
      const d = N[k];
      g.appendChild(K.node(d.p[0], d.p[1], NW, NH, d.t, d.col, d.sub));
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
