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
 *   4  the ~20 bp that has to anneal goes to ink.  Twenty bases of exact
 *      match to the template, not the whole end, and on ONE strand of
 *      each duplex: the strand you will order, which is the bottom of
 *      the left duplex and the top of the right one.
 *
 *      Twenty PAST the junction, and past anything else that is not in
 *      the template.  Measured off JCA's own answer to the EIPCR
 *      question two slides on, which is the authority here:
 *
 *        o1  CCAAA ggtctc G atgg cTagtagcgaagacgttatc   20 past atgg
 *        o2  CAGTA ggtctc A ccat AGATCCTTTCTCCTCTTTC    19 past ccat
 *
 *      Both of those junctions ARE template -- atgg is the first four
 *      bases of the ORF -- and he still puts a full twenty after them.
 *      A junction that happens to be template buys margin, not a
 *      shorter oligo.  An earlier pass here cut the left end to sixteen
 *      on the reasoning that the junction could be counted toward the
 *      twenty; JCA: "the annealing region doesn't match the next slide.
 *      The next slide is right, this one is too short."
 *
 *      On the right the count also has to clear the point mutation,
 *      because ctt is not in the template either, which strands the TAC
 *      between them: template, but on the wrong side of a mismatch.  An earlier version lit both strands whole, on
 *      the reasoning that you do not yet know which one you will order.
 *      JCA: "don\'t make all the ends black, just the chosen annealing
 *      region, which is only a substring of it (20 bp), and it is only
 *      on the appropriate strand."  The count runs from the junction
 *      outward; on the right duplex the point mutation falls inside it.
 *   5  the two template strands and the elisions fade out, and what is
 *      left turns over: the lower-left oligo was drawn 3' to 5' because
 *      that is how it sits on the duplex, and it flips to read the way
 *      you would type it into an order form.  The beat used to say
 *      "Your oligos are in black", which stopped being true the moment
 *      beat 4 started using black for the annealing region.
 *
 * THE FLIPPED STRAND IS DERIVED, NEVER TYPED.  finalLine() walks the
 * same segment table, drops what is template at beat 5, reverses the
 * order and reverses each segment's characters.  Type it out by hand
 * and it is a second copy of the design, wrong the first time either
 * one is edited.
 *
 * THE COLUMNS ARE THE CONTRACT.  Every beat pads to put the junction in
 * column 30, so no base ever moves sideways; what moves is the 5'/3'
 * end label, because the end is what moved.  The widest line is 68
 * characters at every beat, so .cascade's max-content width — and with
 * it the centring of the whole block — never shifts either.
 *
 * THE MARKUP IS THE FRAME BEAT 5 STARTS FROM.  The <pre class="dna"> in
 * 06-golden-gate-assembly.html carries the finished design: it is the
 * no-JS fallback, and it is what beat 5 puts on screen for a moment
 * before the templates fade.  Adjacent runs sharing a class are merged
 * here so that frame still matches it character for character inside
 * the line wrappers.  If you change one, change both.
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

/* X is the point mutation while it is OUTSIDE the annealing region: still
   underlined, because it is still the mutation, but not bold, because at
   beat 4 bold means "this anneals" and the mutation is the one thing on
   the oligo that cannot.  It goes back to P once the whole oligo is ink. */
const T = "tpl", O = "oli", M = "mut", S = "site", P = "pt", X = "ptx", _ = "";

/* end: which prime the line finishes on, so the line opens on the other */
const LINES = [

  /* ---- the end of the first fragment ------------------------------ *
     top strand is template here; the oligo is the bottom strand.       */
  { end:"3", segs:[
    seg(E,                              _, _, _,  _, T),
    seg("ATGCCATAGCATTTTTATCCATAAGA",   _, _, _,  _, T),
    jct("TTAG",                         _, M, M,  M, M),
    seg("C",                         null, null, _, _, T),   /* the N spacer */
    seg("GAGACC",                    null, null, S, S, S),   /* BsaI, reading in */
    seg("ccatg",                     null, null, _, _, T)    /* the 5' tail  */
  ]},
  { end:"5", oligo:true, segs:[
    seg(E,                              _, _, _,  _, T),
    seg("TACGGT",                       _, _, _,  _, O),
    seg("ATCGTAAAAATAGGTATTCT",         _, _, _,  O, O),   /* 20 past the junction */
    jct("AATC",                         _, M, M,  M, M),
    seg("G",                         null, null, _, _, O),
    seg("CTCTGG",                    null, null, S, S, S),
    seg("ggtac",                     null, null, _, _, O)
  ]},

  null,                                  /* the gap between the two duplexes */

  /* ---- the start of the second fragment --------------------------- *
     the oligo is the top strand here, so the weights are mirrored.     */
  { end:"3", oligo:true, segs:[
    seg("cactg",                     null, null, _, _, O),
    seg("GGTCTC",                    null, null, S, S, S),
    seg("a",                         null, null, _, _, O),
    jct("TTAG",                         _, M, M,  M, M),
    seg("TAC",                          _, _, _,  _, O),
    seg("ctt",                          _, _, _,  X, P),    /* the point mutation */
    /* The count starts AFTER the mutation: ctt is not in the template
       either, so nothing 5' of it can anneal.  Twenty from here. */
    seg("ACGCTTTTTATCGCAACTCT",         _, _, _,  O, O),   /* the 20 bp */
    seg("CTAC",                         _, _, _,  _, O),
    seg(E,                              _, _, _,  _, T)
  ]},
  { end:"5", segs:[
    seg("gtgac",                     null, null, _, _, T),
    seg("CCAGAG",                    null, null, S, S, S),
    seg("t",                         null, null, _, _, T),
    jct("AATC",                         _, M, M,  M, M),
    seg("ATG",                          _, _, _,  _, T),
    seg("gaa",                          _, _, _,  X, P),
    seg("TGCGAAAAATAGCGTTGAGAGATG",     _, _, _,  _, T),
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

/* One <span class="ln"> per line, so a single line can be faded or turned
   over without the other three moving. */
function wrap(inner, cls){
  return '<span class="ln' + (cls ? " " + cls : "") + '">' + inner + "</span>";
}
function block(b, mark){
  return LINES.map(function(L){
    if (!L) return wrap("");
    const c = mark && !L.oligo ? mark : (mark && L.end === "5" ? "turnme" : "");
    return wrap(line(L, b), c);
  }).join("\n");
}

/* ---- the last frame -----------------------------------------------
   What survives is the two oligos.  Both are written 5' to 3', which
   means the one the duplex drew backwards has to be turned over: the
   segments run the other way and so do the characters inside them.
   Nothing here is a second copy of the sequence -- it is the same
   segment table read in reverse. */
function finalInner(L){
  const runs = [];
  L.segs.forEach(function(s){
    const c = s.c[4];
    if (c === null || c === T) return;      /* the elision is not yours */
    runs.push({ cls:c, text:s.t });
  });
  if (L.end === "5"){
    runs.reverse();
    runs.forEach(function(r){ r.text = r.text.split("").reverse().join(""); });
  }
  let out = "";
  runs.forEach(function(r, i){
    if (i && runs[i-1].cls === r.cls){ out = out.slice(0, -7) + r.text + "</span>"; return; }
    out += r.cls ? '<span class="' + r.cls + '">' + r.text + "</span>" : r.text;
  });
  return "5" + F + "-" + out + "-3" + F;
}
/* the same left pad line() computes, so nothing slides sideways */
function padOf(L, b){
  let pre = 3;
  for (let i = 0; i < L.segs.length; i++){
    const s = L.segs[i];
    if (s.j) break;
    if (s.c[b] !== null) pre += s.t.length;
  }
  return " ".repeat(Math.max(0, JCOL - pre));
}
function finalBlock(){
  return LINES.map(function(L){
    if (!L) return wrap("");
    /* A template line keeps its characters and loses its ink: the block
       has to hold its 68 columns or the whole thing re-centres. */
    if (!L.oligo) return wrap(line(L, 4), "gone");
    return wrap(padOf(L, 4) + finalInner(L), L.end === "5" ? "turnme" : "");
  }).join("\n");
}

window.Deck.sequence("gg-junction", function(slide){
  const pre = slide.querySelector("pre.dna");
  const bullets = Array.from(slide.querySelectorAll("ul [data-build]"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const LAST = LINES[0].segs[0].c.length - 1;
  let timers = [];

  function clear(){ timers.forEach(clearTimeout); timers = []; pre.classList.remove("shedding"); }
  function at(ms, fn){ timers.push(setTimeout(fn, ms)); }

  function go(i, animated){
    const b = Math.max(0, Math.min(LAST, i | 0));
    clear();
    bullets.forEach(function(el){
      const g = parseInt(el.getAttribute("data-build"), 10) || 1;
      el.classList.toggle("in", g <= b);
    });

    /* The last beat is not a recolour, so it does not go through the
       per-beat block at all unless it is being animated into. */
    if (b === LAST){
      if (animated === false || reduce.matches){ pre.innerHTML = finalBlock(); return; }
      pre.innerHTML = block(LAST, "shed");          /* the finished design */
      const turn = pre.querySelector(".turnme");
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        if (pre.isConnected) pre.classList.add("shedding");
      }); });
      at(520, function(){ turn.classList.add("turn"); });
      at(790, function(){
        turn.innerHTML = finalInner(LINES[1]);
        turn.classList.remove("turn");
      });
      return;
    }

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
