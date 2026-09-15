/* ------------------------------------------------------------------ *
 * 06-gg-junction.js — "Design of a Golden Gate junction", source 49.
 *
 * The five bullets on this slide are a recipe, and the sequence block
 * underneath is the worked example.  Before this file existed the block
 * was static: the finished design sat on screen from the first frame
 * while the recipe ticked past above it, so the room was told how to
 * design a junction while already looking at the answer.
 *
 * data-build can only toggle a class, and three of the five beats change
 * the TEXT — the sites and the tails are not there at the start — so the
 * block is rewritten per beat from here instead.  The five beats are
 * exactly JCA's five bullets, and this file reveals the bullets itself,
 * in step, the way seq/t5cut.js does in lecture 01.
 *
 *   1  the two fragment ends, plain.  No junction marked, no site, no
 *      tail.  This is the starting material.
 *   2  the 4 bp junction lights vermillion — TTAG / AATC.  It is not
 *      added: it is four bases that were already there, which is the
 *      middle of the three options the bullet offers.
 *   3  the BsaI sites and the 5' tails ARRIVE.  New characters, faded
 *      in, not a recolour: this is the one beat where the molecule
 *      gains something it did not have.
 *   4  the ~20 bp that has to anneal to the fragment end goes to ink,
 *      on both strands of each duplex — at this point in the recipe
 *      you do not yet know which strand you will order.
 *   5  that resolves: the two strands you order stay ink and take the
 *      tails and the spacer bases with them, and the two strands you
 *      already have drop to muted.  "Your oligos are in black."
 *
 * THE COLUMNS ARE THE CONTRACT.  Every beat pads to put the junction in
 * column 30, so no base ever moves sideways; what moves is the 5'/3'
 * end label, because the end is what moved.  The widest line is 68
 * characters at every beat, so .cascade's max-content width — and with
 * it the centring of the whole block — never shifts either.
 *
 * BEAT 5 IS THE BLOCK THAT IS IN THE MARKUP.  The <pre class="dna"> in
 * 06-golden-gate-assembly.html still carries the finished design: it is
 * the no-JS fallback and it is the checked reference.  Adjacent runs
 * sharing a class are merged here precisely so that the beat-5 render
 * comes out byte-identical to it.  If you change one, change both.
 *
 * COLOUR is the section's, unchanged:  .site blue, .mut vermillion,
 * .pt ink + rule, .tpl muted, .oli ink + weight.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

const F = "’";                 /* the prime mark — a literal, never an entity */
const E = "…";                 /* the elision                                 */
const JCOL = 30;               /* the column the 4 bp junction sits in        */

/* A segment of one strand, with the class it carries at each of the five
   beats.  null means the segment is not on the molecule yet. */
function seg(t, c1, c2, c3, c4, c5){ return { t:t, c:[c1, c2, c3, c4, c5] }; }
function jct(t, c1, c2, c3, c4, c5){ const s = seg(t, c1, c2, c3, c4, c5); s.j = true; return s; }

const T = "tpl", O = "oli", M = "mut", S = "site", P = "pt", _ = "";

/* end: which prime the line finishes on, so the line opens on the other */
const LINES = [

  /* ---- the end of the first fragment ------------------------------ *
     top strand is template here; the oligo is the bottom strand.       */
  { end:"3", segs:[
    seg(E,                              _, _, _,  _, T),
    seg("ATGCCATAGCATTTTTATCCATAAGA",   _, _, _,  O, T),
    jct("TTAG",                         _, M, M,  M, M),
    seg("C",                         null, null, _, _, T),   /* the N spacer */
    seg("GAGACC",                    null, null, S, S, S),   /* BsaI, reading in */
    seg("ccatg",                     null, null, _, _, T)    /* the 5' tail  */
  ]},
  { end:"5", segs:[
    seg(E,                              _, _, _,  _, T),
    seg("TACGGTATCGTAAAAATAGGTATTCT",   _, _, _,  O, O),
    jct("AATC",                         _, M, M,  M, M),
    seg("G",                         null, null, _, _, O),
    seg("CTCTGG",                    null, null, S, S, S),
    seg("ggtac",                     null, null, _, _, O)
  ]},

  null,                                  /* the gap between the two duplexes */

  /* ---- the start of the second fragment --------------------------- *
     the oligo is the top strand here, so the weights are mirrored.     */
  { end:"3", segs:[
    seg("cactg",                     null, null, _, _, O),
    seg("GGTCTC",                    null, null, S, S, S),
    seg("a",                         null, null, _, _, O),
    jct("TTAG",                         _, M, M,  M, M),
    seg("TAC",                          _, _, _,  O, O),
    seg("ctt",                          _, _, _,  P, P),    /* the point mutation */
    seg("ACGCTTTTTATCGCAACTCTCTAC",     _, _, _,  O, O),
    seg(E,                              _, _, _,  _, T)
  ]},
  { end:"5", segs:[
    seg("gtgac",                     null, null, _, _, T),
    seg("CCAGAG",                    null, null, S, S, S),
    seg("t",                         null, null, _, _, T),
    jct("AATC",                         _, M, M,  M, M),
    seg("ATG",                          _, _, _,  O, T),
    seg("gaa",                          _, _, _,  P, P),
    seg("TGCGAAAAATAGCGTTGAGAGATG",     _, _, _,  O, T),
    seg(E,                              _, _, _,  _, T)
  ]}
];

/* ---- rendering ----------------------------------------------------
   Adjacent segments carrying the same class collapse into one span, so
   beat 5 comes out as the markup's own block, character for character.
   A segment that is arriving on beat 3 is kept in its own run and the
   run of them is wrapped, so it can be faded in as an addition. */
function line(L, b){
  if (!L) return "";

  let pre = 3;                                   /* the "5'-" that opens it */
  for (let i = 0; i < L.segs.length; i++){
    const s = L.segs[i];
    if (s.j) break;
    if (s.c[b] !== null) pre += s.t.length;
  }

  const runs = [];
  L.segs.forEach(function(s){
    const c = s.c[b];
    if (c === null) return;
    const fresh = (b === 2 && s.c[1] === null);
    const last = runs[runs.length - 1];
    if (last && last.cls === c && last.fresh === fresh) last.text += s.t;
    else runs.push({ cls:c, text:s.t, fresh:fresh });
  });

  let out = "", open = false;
  runs.forEach(function(r){
    if (r.fresh && !open){ out += '<span class="new">'; open = true; }
    else if (!r.fresh && open){ out += "</span>"; open = false; }
    out += r.cls ? '<span class="' + r.cls + '">' + r.text + "</span>" : r.text;
  });
  if (open) out += "</span>";

  const head = (L.end === "3" ? "5" : "3") + F + "-";
  return " ".repeat(Math.max(0, JCOL - pre)) + head + out + "-" + L.end + F;
}

function block(b){ return LINES.map(function(L){ return line(L, b); }).join("\n"); }

window.Deck.sequence("gg-junction", function(slide){
  const pre = slide.querySelector("pre.dna");
  const bullets = Array.from(slide.querySelectorAll("ul [data-build]"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function go(i, animated){
    const b = Math.max(0, Math.min(LINES[0].segs[0].c.length - 1, i | 0));
    bullets.forEach(function(el){
      const g = parseInt(el.getAttribute("data-build"), 10) || 1;
      el.classList.toggle("in", g <= b);
    });
    pre.innerHTML = block(b);

    const fresh = Array.from(pre.querySelectorAll(".new"));
    if (!fresh.length) return;
    if (animated === false || reduce.matches){
      fresh.forEach(function(el){ el.classList.add("lit"); });
    } else {
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        fresh.forEach(function(el){ if (el.isConnected) el.classList.add("lit"); });
      }); });
    }
  }
  go(0, false);

  /* The two channels stay in the markup.  Beat 1 falls through to the
     slide's own <template>s; beats 2 to 5 are the notes and descriptions
     already written on the <li> each beat belongs to, read from there
     rather than copied, so there is one copy of JCA's words and the
     entity trap in AUTHORING.txt cannot bite: the parser decodes an
     attribute, and would not decode a string in this file. */
  const steps = [{}].concat(bullets.map(function(el){
    return { note: el.getAttribute("data-note"), desc: el.getAttribute("data-desc") };
  }));

  return { steps:steps, go:go };
});
})();
