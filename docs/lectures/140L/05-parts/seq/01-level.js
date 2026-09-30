/* ------------------------------------------------------------------ *
 * 01-level.js — the exercise that makes the three-way split do work.
 *
 * The split is easy to nod along to and hard to apply, because two of
 * the five rows here are ones almost everybody puts in the wrong column
 * on the first try, and for opposite reasons:
 *
 *   lacI       is a protein-level part whose entire job happens at the
 *              DNA level.  Sorting by where the effect shows up puts it
 *              under DNA, and then the word "protein" has no members.
 *   terminator is an RNA-level part that looks like a DNA element,
 *              because you draw it on a plasmid map and order it as
 *              DNA.  What actually stops the polymerase is a hairpin in
 *              the transcript, so it is RNA, and the source deck files
 *              it under RNA-based parts for exactly that reason.
 *
 * So the rule the last beat states is the point of the whole exercise:
 * ask which molecule does the work, not where the consequence lands.
 *
 * Drawn as a grid because the Chassis trace exercise was a grid with
 * these same three columns, and coming back to a layout they have
 * already read is worth more here than a new picture.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

/* The three columns sit close together and to the LEFT, because the
   reason for each answer is printed beside its row and needs the whole
   right-hand half of the box.  Spread across the slide the way a table
   wants to be, the columns and the reasons overlapped. */
const LX = 430;                          /* right edge of the row names */
const COL = [{x:570, t:"DNA"}, {x:716, t:"RNA"}, {x:872, t:"protein"}];
const WX = 976;                          /* where the reasons start     */
const HY = 286, R0 = 356, RH = 74;

/* runs for mixed(): [text, italic] — gene names are italic, and a
   promoter is written P with the gene it belongs to italic after it */
const ROW = [
{ n:[["P", false], ["lac", true]],                 a:0,
  why:"a sequence the polymerase binds" },
{ n:[["the colE1 origin", false]],                 a:0,
  why:"a site the replication machinery binds" },
{ n:[["lac", true], ["I", true]],                  a:2,
  why:"the protein does the binding" },
{ n:[["a terminator", false]],                     a:1,
  why:"a hairpin in the transcript" },
{ n:[["a riboswitch in the 5′ UTR", false]],       a:1,
  why:"the messenger folds around the metabolite itself" }
];

function fr(n){
  const o = {};
  for (let i = 0; i < ROW.length; i++) o["r"+i] = i < n ? 1 : 0;
  return o;
}

const FR = [
{ s:fr(0),
  cap:"which of the three does the work?",
  call:"two of these five are in a column most people do not expect",
  note:"Before we go section by section, sort these. Each row is a part you have already met or will meet this week. For each one, say which of the three levels it acts on — is the thing that actually does the job a piece of DNA, a piece of RNA, or a protein? Take a minute on it in pairs. I will tell you now that two of the five land somewhere most people do not expect, and they are wrong in opposite directions.",
  desc:"A grid with five parts down the left and three empty columns headed DNA, RNA and protein. Nothing is marked yet." },

{ s:fr(1),
  cap:"DNA",
  call:"a promoter is a sequence, and it is read where it sits",
  note:"The lac promoter is DNA. It is a stretch of sequence that RNA polymerase and its sigma factor recognise, and it does its job as DNA, sitting in the chromosome or the plasmid. Nothing has to be transcribed for a promoter to work. This is the straightforward case.",
  desc:"The lac promoter row is marked in the DNA column." },

{ s:fr(2),
  cap:"DNA",
  call:"same reasoning · a site that machinery binds",
  note:"The colE1 origin, same answer and the same reasoning. It is a stretch of sequence that the replication machinery recognises. Both of these are parts whose function is the sequence itself.",
  desc:"The colE1 origin row is marked in the DNA column." },

{ s:fr(3),
  cap:"<b>protein</b> — and this is the first trap",
  call:"its job is at the DNA level · the thing doing the job is not DNA",
  note:"Now the first one people get wrong. Everything lacI does happens at the DNA level — it sits on an operator and blocks transcription. So it is very tempting to file it under DNA. But lacI is a gene, it gets transcribed and translated, and the molecule that does the binding is a protein. If you sort by where the effect shows up, this goes in the DNA column, and then you have a protein column with nothing in it, which should tell you the sorting rule is wrong.",
  desc:"The lacI row is marked in the protein column, with a note that its effect is at the DNA level." },

{ s:fr(4),
  cap:"<b>RNA</b> — and this is the second one",
  call:"you order it as DNA · what stops the polymerase is a hairpin",
  note:"And the second. A terminator looks like a DNA element in every way you normally meet it: you draw it on a plasmid map, you order it as DNA, it has a fixed position. But what actually stops transcription is a hairpin that forms in the RNA as it comes out of the polymerase. No transcript, no hairpin, no termination. That is why the source deck files terminators under RNA parts, and it is why the same sequence in the wrong context terminates less well — which is a point we come back to in the RNA section.",
  desc:"The terminator row is marked in the RNA column, with a note that the hairpin forms in the transcript." },

{ s:fr(5),
  cap:"RNA",
  call:"and this is the arrow we drew from metabolites a moment ago",
  note:"The riboswitch is RNA, and this one most people get, because we drew the arrow for it two slides ago. The messenger folds around the small molecule directly. No protein anywhere in the sensing.",
  desc:"The riboswitch row is marked in the RNA column, completing the grid." },

{ s:fr(5), on:["rule"],
  cap:"ask which molecule does the work",
  call:"not where the consequence shows up",
  note:"So here is the rule, and it is the only thing you need to carry out of this section. Ask which molecule does the work. Not where the consequence shows up, and not what you ordered from the synthesis company, because everything is DNA when you order it. The three sections after this one are the three answers, and they are in that order: protein, then RNA, then DNA.",
  desc:"The sorting rule is stated under the completed grid: ask which molecule does the work, not where the consequence shows up." }
];

window.Deck.sequence("level", function(slide){
  const s = K.scene(slide, 800, 846);

  /* This line used to restate the rule, which the caption and the call
     under it were already both saying — three stacked paraphrases of one
     sentence.  It names the two traps instead, which is the thing the
     grid can show and the captions cannot. */
  const r = K.el("g", {});
  r.appendChild(K.text(800, 740,
    "the two that catch people: one sorted by its effect, one by what you ordered",
    25, C.blue, 700));
  s.part("rule", r);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    /* headers, and a rule under them */
    COL.forEach(function(c){
      g.appendChild(K.text(c.x, HY, c.t, 28, C.blue, 700));
    });
    g.appendChild(K.path("M"+(LX + 34)+" "+(HY + 16)+"H"+(COL[2].x + 60), C.muted, 2));

    ROW.forEach(function(row, i){
      const y = R0 + i*RH, u = v["r"+i];
      g.appendChild(K.mixed(LX, y + 9, row.n, 26, C.ink, 400, "end"));
      /* the empty cells, so the grid reads as a grid before anything
         is in it — three faint ticks per row */
      COL.forEach(function(c){
        g.appendChild(K.path("M"+(c.x - 22)+" "+(y + 20)+"h44", C.muted, 2));
      });
      if (u > 0.02){
        const c = COL[row.a], a = K.grp(u);
        a.appendChild(K.el("circle", {cx:c.x, cy:y, r:15, fill:C.verm,
          "fill-opacity":".18", stroke:C.verm, "stroke-width":3}));
        a.appendChild(K.text(WX, y + 8, row.why, 21, C.muted, 400, "start"));
        g.appendChild(a);
      }
    });
    return g;
  }
  return K.run(s, FR, paint);
});
})();
