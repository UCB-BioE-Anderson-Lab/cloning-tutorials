/* ------------------------------------------------------------------ *
 * 04-breadth.js — two ways to hold a genus, and the thing UC had was
 * neither.
 *
 * Was 109 words.  The wrong lesson — "one example never supports a
 * genus, so never claim broadly" — is the one a room takes from prose,
 * and it is not the law.  Drawn as three versions of the same circle,
 * the room sees that two of them are FINE, which is what stops the
 * wrong lesson forming.  The third is the one that failed, and it
 * failed for a reason you can point at.
 *
 * SAME CIRCLE AS seq/04-doctrines.js, deliberately: same radius, same
 * member scatter, so the room recognises the shape it was taught the
 * doctrines on and this reads as that picture answered three ways.
 *
 * EVERY QUOTED FRAGMENT in the note channel is verbatim from the
 * opinion, which was read directly.  No pin cites — the available full
 * text has no star pagination.  The later Federal Circuit case that
 * adopted the two-route sentence en banc is named in the note with a
 * VERIFY, and nothing here depends on it.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.PR, C = G.C;

const CY = 430, R = 148;
const CX = [330, 800, 1270];

const MEMBER = [
  [-110,-80],[-30,-120],[60,-100],[130,-40],[-140,10],[-60,-30],[20,-40],
  [110,20],[-100,80],[-20,60],[70,80],[140,70],[-50,130],[40,130]
];
const K = 0.72;                         /* same scatter, smaller circles */
const mx = (i, m) => CX[i] + m[0]*K;
const my = m => CY + m[1]*K;

function ring(i, title){
  const g = G.el("g", {});
  g.appendChild(G.el("circle", {cx:CX[i], cy:CY, r:R, fill:"none",
    stroke:C.ink, "stroke-width":2.6, "stroke-dasharray":"10 8"}));
  g.appendChild(G.text(CX[i], CY - R - 30, title, 27, C.ink, 700));
  return g;
}
function verdict(i, t, col, sub){
  const g = G.el("g", {});
  g.appendChild(G.text(CX[i], CY + R + 50, t, 28, col, 700));
  g.appendChild(G.lines(CX[i], CY + R + 82, sub, 20, C.muted, 400, "middle", 25));
  return g;
}

function paint(v, f){
  const g = G.grp();

  /* ---- route one: a representative number ------------------------ */
  if (v.rep > 0.02){
    const h = G.grp(v.rep);
    h.appendChild(ring(0, "a representative number"));
    MEMBER.forEach(function(m, k){
      const some = [1, 4, 7, 10, 13].indexOf(k) >= 0;
      h.appendChild(G.el("circle", {cx:mx(0, m), cy:my(m), r:some ? 12 : 9,
        fill:some ? C.blue : C.muted, "fill-opacity":some ? 1 : 0.4}));
    });
    h.appendChild(verdict(0, "enough", C.blue, ["given by sequence"]));
    g.appendChild(h);
  }

  /* ---- route two: a structure they share ------------------------- */
  if (v.struct > 0.02){
    const h = G.grp(v.struct);
    h.appendChild(ring(1, "a structure they share"));
    MEMBER.forEach(function(m){
      h.appendChild(G.el("rect", {x:mx(1, m) - 9, y:my(m) - 9,
        width:18, height:18, rx:3, fill:C.blue, "fill-opacity":0.9}));
    });
    h.appendChild(verdict(1, "also enough", C.blue,
      ["the court gives the two", "in the alternative"]));
    g.appendChild(h);
  }

  /* ---- what was actually there ----------------------------------- */
  if (v.uc > 0.02){
    const h = G.grp(v.uc);
    h.appendChild(ring(2, "what UC had"));
    MEMBER.forEach(function(m, k){
      if (k === 13) return;
      h.appendChild(G.el("circle", {cx:mx(2, m), cy:my(m), r:9,
        fill:"none", stroke:C.muted, "stroke-width":1.6}));
    });
    h.appendChild(G.el("circle", {cx:mx(2, MEMBER[13]), cy:my(MEMBER[13]),
      r:14, fill:C.verm}));
    h.appendChild(verdict(2, "neither", C.verm,
      ["one rat sequence, behind", "“vertebrate insulin cDNA”"]));
    g.appendChild(h);
  }

  return g;
}

const FR = [];
const beat = o => FR.push(o);

beat({ on:[], s:{rep:1},
  cap:"Breadth is normal. Every species in a genus need not be described.",
  call:"",
  note:"THE WRONG LESSON is: one example never supports a genus, so never claim broadly. That is not what the court said and it is not the law, and I want to kill it before it forms. The opinion is explicit that these cases 'only establish that every species in a genus need not be described in order that a genus meet the written description requirement'. Every species need not be described. And in the same passage the court says that in claims involving chemical materials, generic formulae usually indicate with specificity what the generic claims encompass, and that such a formula is 'normally an adequate description of the claimed genus'. Generic claiming is the normal state of affairs in chemistry. Nothing about wanting the genus is improper. So here is the first way you are allowed to hold one: recite a representative number of members, defined by nucleotide sequence. Not all of them. A representative number.",
  desc:"The same genus circle, with a representative number of its members filled in and given by sequence: enough."});

beat({ on:[], s:{rep:1, struct:1}, dur:1500,
  cap:"Either one. The court gives them in the alternative.",
  call:"",
  note:"And the second way, which matters more for most of you because it is cheaper. A genus of cDNAs may be described by reciting a representative number of them defined by nucleotide sequence, OR by reciting structural features common to the members of the genus, where those features constitute a substantial portion of the genus. EITHER ONE — the court gives them in the alternative, and that word is doing real work. So you do not need every member, and you do not even need many members, if you can point to the structure they share. That is why both of these circles are blue. Two different, legitimate ways of actually possessing a class.",
  desc:"A second circle in which every member carries the same shape: structural features common to the members. Also enough, because the court gives the two routes in the alternative."});

beat({ on:[], s:{rep:1, struct:1, uc:1},
  cap:"",
  call:"A definition by function is not a description of an invention.",
  note:"And this is why UC lost. 'Vertebrate insulin cDNA' does neither of those things. It is not a representative set — it is one rat sequence, which is the single red dot. And it is not a structural feature — it is a statement about what the gene DOES. In the court's words, a generic statement like that does not distinguish the claimed genus from others except by function, and a definition by function 'is only an indication of what the gene does, rather than what it is'. Then the sentence that is the whole doctrine in one line: the requirement is for 'a description of an invention, not an indication of a result that one might achieve if one made that invention'. PUT THE LINE UP AND LEAVE IT UP. A definition by function is not a description of an invention. That is the transferable lesson and it is the one that is about to be aimed at them personally, on the next slide, with their own promoter. [VERIFY before adding: the two-route sentence was later adopted by the full Federal Circuit in a case called Ariad. Nothing here depends on it and I would not say it from the podium without checking.]",
  desc:"The third circle: what UC had, one rat sequence filled in and the rest empty outlines. Neither route — vertebrate insulin cDNA names a result. A definition by function is not a description of an invention."});

window.Deck.sequence("breadth", function(slide){
  const s = G.scene(slide, 792, 840);
  s.finish();
  return G.run(s, FR, paint);
});
})();
