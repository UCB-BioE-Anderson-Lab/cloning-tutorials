/* ------------------------------------------------------------------ *
 * 02-markers.js — source slide 23, reframed.
 *
 * The source is three bulleted lists side by side: seven antibiotic
 * resistances, two toxic genes, three conditional lethals.  Twelve names
 * and no idea.  That is the catalogue frame, and it is what made the
 * Chassis pathogenicity section fall flat.
 *
 * There are only THREE mechanisms here, and the difference between them
 * is what the marker does to a cell that HAS it:
 *
 *   resistance          having it lets you live through something
 *   toxic gene          having it kills you, always
 *   conditional lethal  having it kills you, but only when you say so
 *
 * Which means the first selects FOR the marker and the other two select
 * AGAINST it, and the third is the only one you can switch.  Drawn as
 * one grid: three mechanisms down, two conditions across, and what the
 * cell does in each cell of it.  The names go in as examples of a
 * mechanism rather than as the content.
 *
 * The closing beat is the design question, which is the thing the
 * source's three lists cannot answer: you need the first kind to KEEP
 * something and the third kind to GET RID of it, and that pairing is
 * why a knockout plasmid carries two markers.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

/* NX 420, not 250: end-anchored at 250 the words "conditional lethal"
   began at x 7 and the content box starts at 110.  The verdict column
   is short for the same reason at the other end -- "selects against it,
   when you choose" ran past 1490. */
/* FOUR rows for three mechanisms, and the two columns are the marker,
   not the condition.
 *
 * The first attempt had the columns as "without the condition" and
 * "with the condition" and each row as a cell carrying the marker,
 * which is wrong in a way that renders perfectly: a cell carrying a
 * resistance marker grows whether or not the antibiotic is there, so
 * the informative comparison -- against a cell that does NOT carry it
 * -- was not on the slide at all, and the resistance row showed a dead
 * cell in a column where nothing kills it.
 *
 * With the marker as the columns, each row states the plate it is on
 * and the contrast is the one that matters.  The conditional lethal
 * takes two rows, on two different plates, which is not padding: being
 * the same marker with two outcomes IS the mechanism, and the other two
 * cannot produce a second row.
 */
const RY = [316, 430, 556, 648], CX = [846, 1120], NX = 470, VX = 1210;
const R = 42;

const ROWS = [
{ m:0, name:"resistance",         eg:"bla · kan · cam",
  plate:"on ampicillin",          live:[0, 1] },
{ m:1, name:"a toxic gene",       eg:"ccdB · barnase",
  plate:"on anything at all",     live:[1, 0] },
{ m:2, name:"conditional lethal", eg:"sacB · upp · nfsA",
  plate:"on plain LB",            live:[1, 1] },
{ m:2, name:null,                 eg:null,
  plate:"on LB + sucrose",        live:[1, 0], tie:true }
];
const SEL = [
{ at:0, col:C.blue, t:"selects <b>for</b> it" },
{ at:1, col:C.verm, t:"selects <b>against</b> it" },
/* short, all three: at full length these ran past x 1490 and the
   auditor caught them clipped at the slide edge */
{ at:2, col:C.verm, t:"against it, <b>on demand</b>", span:true }
];

/* A cell: filled and upright if it lives, broken open if it does not. */
function fate(cx, cy, alive, u){
  const g = K.grp(u), col = alive ? C.blue : C.verm;
  if (alive){
    g.appendChild(K.el("circle", {cx:cx, cy:cy, r:R, fill:col,
      "fill-opacity":".15", stroke:col, "stroke-width":3}));
    g.appendChild(K.text(cx, cy + 8, "grows", 21, col, 700));
  } else {
    g.appendChild(K.el("circle", {cx:cx, cy:cy, r:R, fill:"none",
      stroke:col, "stroke-width":3, "stroke-dasharray":"5 9"}));
    g.appendChild(K.path("M"+n1(cx - 21)+" "+n1(cy - 21)+"l42 42"+
      "M"+n1(cx + 21)+" "+n1(cy - 21)+"l-42 42", col, 3.4));
  }
  return g;
}

const FR = [
{ s:{},
  cap:"a selectable marker is a gene whose presence decides whether a cell lives",
  call:"there are twelve of them in common use &#183; and three mechanisms",
  note:"Selectable markers are the class of protein you have used most and thought about least. A selectable marker is a gene whose presence decides whether a cell survives some treatment, so that a plate does your screening for you. There are a dozen in common use and the source deck lists all twelve. That is not the useful thing to know about them. There are three mechanisms, and the difference is what the marker does to a cell that has it.",
  desc:"The definition of a selectable marker, with an empty grid of three mechanisms against two conditions." },

{ s:{r0:1},
  cap:"resistance &#8212; having it lets you live through something",
  call:"this is every plasmid you have ever plated",
  note:"The first kind is resistance, and it is the one you have used every week. Beta-lactamase chews up ampicillin. The kanamycin and chloramphenicol markers modify their antibiotics so the ribosome stops caring. Without the antibiotic, nothing happens either way. With it, only the cells carrying the marker live. This selects for the marker, which is what you want when the job is to keep a plasmid in a population that would rather drop it.",
  desc:"The first row: resistance markers, where cells die without the marker only when the antibiotic is present." },

{ s:{r0:1, r1:1},
  cap:"a toxic gene &#8212; having it kills you",
  call:"so it selects <b>against</b> itself, and there is nothing to add",
  note:"The second kind is the opposite. CcdB poisons gyrase; barnase is a ribonuclease that shreds RNA. A cell carrying either one dies, and there is no condition to impose — it is lethal as soon as it is expressed. So this selects against the marker, always. That sounds useless until you see what it is for: put ccdB in the piece of a vector your insert is going to replace, and the only colonies that come up are the ones where the replacement actually happened. You are selecting for the loss of something.",
  desc:"The second row: toxic genes, where cells carrying the marker die under both conditions." },

{ s:{r0:1, r1:1, r2:1, r3:1},
  cap:"conditional lethal &#8212; having it kills you <b>when you say so</b>",
  call:"two plates, one marker &#183; the only one of the three with a switch",
  note:"And the third kind is a toxic gene with a switch. SacB is harmless until you add sucrose, and then it makes a polymer that kills E. coli. Upp turns 5-fluorouracil into something lethal. NfsA does the same with nitrofurazone. In every case the gene sits there doing nothing until you supply the substrate, and then it kills. This is the only one of the three whose timing you control, and that is what it is for.",
  desc:"The third row: conditional lethals, where cells carrying the marker live until the substrate is supplied." },

{ s:{r0:1, r1:1, r2:1, r3:1}, on:["why"],
  cap:"you need one of the first kind to <b>keep</b> something",
  call:"and one of the third to <b>get rid</b> of it",
  note:"So here is why there are three and not one, and it is the design question the source's three lists cannot answer. You need a resistance marker to keep something in the cell. You need a conditional lethal to get it back out on demand. Which is exactly why the CRISPR plasmids in the Genome Editing lecture carried a resistance marker and a way of being cured — you selected for them while you needed them, and then you removed them, and those are two different jobs that need two different kinds of gene. Any time you see a plasmid with two markers on it, ask which of these three each one is, and the design will usually explain itself.",
  desc:"The closing point: resistance keeps something in the cell, a conditional lethal removes it on demand, which is why a curable plasmid carries both." }
];

window.Deck.sequence("markers", function(slide){
  const s = K.scene(slide, 800, 846);

  const w = K.el("g", {});
  /* NOT a restatement of the caption and the call below it, which is
     what this line was and which made three paraphrases of one sentence
     stacked in the bottom of the slide.  It carries the consequence
     instead: the thing you have already built has one of each. */
  w.appendChild(K.text(800, 742,
    "which is why a curable plasmid carries one of each",
    27, C.blue, 700));
  s.part("why", w);
  s.finish();

  function paint(v){
    const g = K.el("g", {});
    g.appendChild(K.text(CX[0], 246, "no marker", 25, C.muted, 400));
    g.appendChild(K.text(CX[1], 246, "carries the marker", 25, C.ink, 700));
    g.appendChild(K.path("M"+(NX - 300)+" 266H"+(VX + 280), C.muted, 2));

    ROWS.forEach(function(r, i){
      const u = v["r" + i];
      if (u <= 0.02) return;
      const row = K.grp(u), y = RY[i];
      if (r.name){
        row.appendChild(K.text(NX, y - 6, r.name, 26, C.ink, 700, "end"));
        row.appendChild(K.text(NX, y + 24, r.eg, 21, C.muted, 400, "end"));
      }
      /* the plate is a property of the ROW, so it sits on the row */
      row.appendChild(K.text(NX + 40, y + 8, r.plate, 22,
        r.tie ? C.verm : C.muted, r.tie ? 700 : 400, "start"));
      [0, 1].forEach(function(j){ row.appendChild(fate(CX[j], y, r.live[j], 1)); });
      g.appendChild(row);
    });

    /* the verdicts, which for the conditional lethal brackets both of
       its rows rather than labelling either one */
    SEL.forEach(function(q){
      const rows = [];
      ROWS.forEach(function(r, i){ if (r.m === q.at && v["r" + i] > 0.02) rows.push(i); });
      if (!rows.length) return;
      const y0 = RY[rows[0]], y1 = RY[rows[rows.length - 1]];
      const a = K.grp(v["r" + rows[0]]);
      if (q.span && rows.length > 1)
        a.appendChild(K.path("M"+(VX - 22)+" "+n1(y0 - 18)+"v"+n1(y1 - y0 + 36),
          q.col, 2.6));
      const t = K.el("text", {x:VX, y:(y0 + y1)/2 + 9, "font-size":23,
        fill:q.col, "font-weight":700, "text-anchor":"start"});
      t.innerHTML = K.rich(q.t);
      a.appendChild(t);
      g.appendChild(a);
    });
    return g;
  }
  return K.run(s, FR, paint);
});
})();
