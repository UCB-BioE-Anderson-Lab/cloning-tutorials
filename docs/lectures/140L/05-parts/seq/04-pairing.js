/* ------------------------------------------------------------------ *
 * 04-pairing.js — one recognition step, three things that follow it.
 *
 * This slide and the section around it were muddled, and the muddle was
 * structural rather than cosmetic.  The source sorted RNA parts by what
 * they are called -- "Active RNA Molecules" held riboregulators next to
 * suppressor tRNAs, which have nothing in common -- and then this slide
 * ran RyhB's two consequences together, so occluding a ribosome binding
 * site and recruiting a nuclease arrived as one undifferentiated event.
 * JCA: it's all mixed up.
 *
 * Sorted by mechanism instead.  The folded RNAs (tRNA, aptamer,
 * riboswitch) are now one slide of their own, because what they share
 * is that a SHAPE does the work.  Everything on THIS slide shares a
 * different thing: one RNA finds another by complementary sequence.
 *
 * So the drawing is a branch.  The trunk is the pairing event, drawn
 * once, with the actual bases on it.  Three fates hang off it:
 *
 *   hide the site          the duplex covers the ribosome binding site
 *                          and nothing can land.  Riboregulators, and
 *                          any antisense part you would build.
 *   mark it for a nuclease the duplex is a substrate.  RNase E eats
 *                          both strands, so the small RNA is consumed
 *                          one for one with its target.  RyhB does
 *                          both of these, which is exactly why they
 *                          have to be drawn as two separate branches.
 *   carry the knife        the guide strand arrives already holding a
 *                          nuclease.  Argonaute cuts at a fixed place
 *                          along the guide, lets go, repeats.
 *
 * One slide, one picture, and it accumulates: an earlier draft of this
 * and of the terminator slide ended by wiping the stage and replacing
 * it with a panel of text, which is a second slide wearing the first
 * one's title.  Nothing here is ever removed.
 *
 * Notation, shared with the terminator slide: a wave is single-stranded
 * RNA, a ladder is a duplex, vermillion is the message, blue is the
 * short RNA that finds it, amber is the ribosome binding site.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GP, C = G.C;
const n2 = v => Math.round(v*10)/10;

const TY = 278;                          /* the trunk                  */
const TA = 430, TB = 1170, PW = 72;      /* its span, half the duplex  */
const BUS = 390, COL = [400, 800, 1200]; /* the branch bus, the fates  */
const HY = 448, DY = 588, CY = 716;      /* heading, drawing, caption  */

function ladder(xa, xb, y, top, bot){
  const g = G.el("g", {});
  g.appendChild(G.path("M" + n2(xa) + " " + (y - 9) + "H" + n2(xb), top, 3.4));
  g.appendChild(G.path("M" + n2(xa) + " " + (y + 9) + "H" + n2(xb), bot, 3.4));
  for (let x = xa + 9; x < xb - 4; x += 15)
    g.appendChild(G.path("M" + n2(x) + " " + (y - 7) + "V" + (y + 7), C.muted, 1.6));
  return g;
}
/* the actual bases, because "complementary" IS the mechanism and a
   caption saying so is a claim rather than a demonstration */
function bases(cx, y, s, col){
  const g = G.el("g", {}), n = s.length;
  for (let i = 0; i < n; i++)
    g.appendChild(G.text(n2(cx + (i - (n - 1)/2)*24), y, s[i], 19, col, 700));
  return g;
}
/* no bare proper nouns on this slide: a protein says what it does */
function role(cx, cy, name, what, col){
  const g = G.el("g", {});
  g.appendChild(G.text(cx, cy, name, 21, col || C.ink, 700));
  g.appendChild(G.text(cx, cy + 24, what, 18, C.muted, 400));
  return g;
}
function head(cx, s, col){ return G.text(cx, HY, s, 28, col, 700); }
function line(cx, y, s, col, w){ return G.text(cx, y, s, 20, col || C.muted, w || 400); }
function leg(cx){
  const g = G.el("g", {});
  g.appendChild(G.path("M800 " + (TY + 94) + "V" + BUS +
    "H" + cx + "V" + (HY - 28) + "m-9 -11l9 11l9 -11", C.rule, 3));
  return g;
}

function paint(v, f){
  const g = G.el("g", {});
  const add = n => { g.appendChild(n); return n; };

  /* ---- the trunk: the step every one of them shares --------------- */
  if (v.pair > 0.02){
    const h = G.grp(v.pair);
    h.appendChild(G.rna(TA, 800 - PW, TY - 9, 1, C.verm));
    h.appendChild(G.rna(TA, 800 - PW, TY + 9, 1, C.blue));
    h.appendChild(ladder(800 - PW, 800 + PW, TY, C.verm, C.blue));
    h.appendChild(G.rna(800 + PW, TB, TY - 9, 1, C.verm));
    h.appendChild(bases(800, TY - 26, "AGGAGG", C.amber));
    h.appendChild(bases(800, TY + 38, "UCCUCC", C.blue));
    h.appendChild(G.text(TB + 16, TY - 2, "the message", 20, C.verm, 700, "start"));
    h.appendChild(G.text(TA - 16, TY + 16, "a short RNA carrying", 20, C.blue, 700, "end"));
    h.appendChild(G.text(TA - 16, TY + 42, "the complement", 20, C.blue, 700, "end"));
    h.appendChild(G.text(800, TY + 86,
      "that is the whole recognition step — and then one of three things happens",
      23, C.ink, 700));
    g.appendChild(h);
  }

  /* ---- fate 1: the site is simply covered ------------------------- */
  if (v.hide > 0.02){
    const h = G.grp(v.hide), x = COL[0];
    h.appendChild(leg(x));
    h.appendChild(head(x, "hide the site", C.verm));
    h.appendChild(ladder(x - 96, x + 96, DY, C.verm, C.blue));
    h.appendChild(G.path("M" + (x - 96) + " " + (DY + 26) + "H" + (x + 96), C.amber, 8));
    h.appendChild(G.text(x, DY + 54, "ribosome binding site", 18, C.amber, 700));
    h.appendChild(G.grp(0.5)).appendChild(G.ribosome(x, DY - 70, C.ink));
    h.appendChild(G.el("circle", {cx:x, cy:DY - 64, r:40, fill:"none",
      stroke:C.verm, "stroke-width":3.6}));
    h.appendChild(G.path("M" + (x - 28) + " " + (DY - 36) + "l56 -56", C.verm, 3.6));
    h.appendChild(line(x, CY, "a ribosome only lands on bare RNA", C.ink, 700));
    h.appendChild(line(x, CY + 30, "riboregulators, and any antisense"));
    h.appendChild(line(x, CY + 56, "part you would build yourself"));
    g.appendChild(h);
  }

  /* ---- fate 2: the duplex is food --------------------------------- */
  if (v.cut > 0.02){
    const h = G.grp(v.cut), x = COL[1];
    h.appendChild(leg(x));
    h.appendChild(head(x, "mark it for a nuclease", C.ink));
    h.appendChild(G.enzyme(x - 112, DY - 48, C.ink));
    h.appendChild(role(x + 36, DY - 62, "RNase E", "an enzyme that cuts RNA"));
    for (let i = 0; i < 4; i++){
      const xa = x - 150 + i*78;
      h.appendChild(G.rna(xa, xa + 50, DY + (i % 2 ? 48 : 20), 1, i % 2 ? C.blue : C.verm));
    }
    h.appendChild(line(x, CY, "both strands are destroyed", C.ink, 700));
    h.appendChild(line(x, CY + 30, "RyhB works this way, and is spent"));
    h.appendChild(line(x, CY + 56, "one for one with its target"));
    g.appendChild(h);
  }

  /* ---- fate 3: the guide brings its own ---------------------------- */
  if (v.knife > 0.02){
    const h = G.grp(v.knife), x = COL[2];
    h.appendChild(leg(x));
    h.appendChild(head(x, "carry the knife", C.blue));
    h.appendChild(G.el("rect", {x:x - 88, y:DY - 36, width:176, height:92, rx:30,
      fill:C.paper, stroke:C.blue, "stroke-width":3}));
    h.appendChild(G.rna(x - 152, x - 86, DY + 1, 1, C.verm));
    h.appendChild(ladder(x - 86, x - 26, DY + 10, C.verm, C.blue));
    h.appendChild(ladder(x - 14, x + 84, DY + 10, C.verm, C.blue));
    h.appendChild(G.rna(x + 84, x + 152, DY + 1, 1, C.verm));
    h.appendChild(G.path("M" + (x - 20) + " " + (DY - 16) + "v16", C.verm, 3.4));
    h.appendChild(role(x, DY - 76, "Argonaute", "cuts, but only where its guide says"));
    h.appendChild(line(x, CY, "cut at a fixed place, then let go", C.ink, 700));
    h.appendChild(line(x, CY + 30, "so one guide silences message"));
    h.appendChild(line(x, CY + 56, "after message — eukaryotes only", C.verm, 700));
    g.appendChild(h);
  }

  if (v.close > 0.02)
    add(G.text(800, 812,
      "same recognition every time; what differs is what the pairing is for",
      25, C.ink, 700)).setAttribute("opacity", n2(v.close));
  return g;
}

const FR = [];
let acc = {};
function beat(o){
  acc = Object.assign({}, acc, o.s || {});
  FR.push(Object.assign({}, o, {s:Object.assign({}, acc)}));
}

beat({ on:[], s:{pair:1},
  cap:"", call:"",
  note:"The other family of RNA parts does not work by folding. It works by finding another RNA. And the recognition step is the same every time, so it is worth drawing once. A short RNA carries the complement of some stretch of a message, finds it, and zips onto it. Here the stretch is the ribosome binding site, reading A-G-G-A-G-G, and the short RNA carries U-C-C-U-C-C. That is all the specificity there is, and it is enough: twenty bases of complementary sequence is unique in any genome, which is why this mechanism is so cheap for a cell to use and so easy for us to design. What is not the same every time is what happens next, and there are three possibilities.",
  desc:"The trunk of the slide: a short RNA carrying UCCUCC pairs with the AGGAGG ribosome binding site of a message, drawn as a ladder of base pairs between a vermillion strand and a blue one. This recognition step is shared by everything on the slide."});

beat({ on:[], s:{hide:1},
  cap:"", call:"",
  note:"The first and simplest is that nothing else happens at all. The site is now double-stranded, and a ribosome can only land on bare RNA, so translation does not start. Nothing was cut, nothing was recruited; the sequence is still there, it is just covered. That is a riboregulator, and it is also what you are building whenever you design an antisense part yourself. It is worth noticing that the riboswitch on the previous slide ends up in exactly this state, just by folding back on itself rather than by meeting a second molecule.",
  desc:"First branch, hide the site: the duplex sits over the ribosome binding site and a ribosome is drawn crossed out above it, unable to land. This is what a riboregulator or an engineered antisense part does."});

beat({ on:[], s:{cut:1},
  cap:"", call:"",
  note:"The second is that the cell treats the pair as rubbish. Double-stranded RNA is a substrate for RNase E, an enzyme whose job is cutting RNA, and it cuts both strands: the message and the small RNA together. RyhB, the one E. coli makes when iron runs short, does this. And it is worth separating this from the first branch rather than running them together, because they are different events with different consequences. Occlusion is reversible and costs the cell one pairing. Degradation is not reversible, and it costs the cell the small RNA as well, so RyhB is spent one for one with the message it silenced. To keep a gene off, the cell has to keep making it.",
  desc:"Second branch, mark it for a nuclease: RNase E, an enzyme that cuts RNA, degrades the duplex into fragments of both strands. The small RNA is consumed one for one with its target."});

beat({ on:[], s:{knife:1, close:1},
  cap:"", call:"",
  note:"And the third is the eukaryotic one, where the short RNA turns up already holding an enzyme. Long double-stranded RNA gets chopped into twenty-one base pieces by Dicer, one of those pieces is loaded into a protein called Argonaute, and Argonaute throws one strand away and keeps the other as a guide. Argonaute also cuts RNA, but it will not cut anything unless its guide is paired to it, and then it cuts at a fixed position along that guide. So here the pairing is not hiding anything. It is aiming an enzyme. And because the enzyme lets go afterwards with the guide still loaded, one guide silences message after message, which is why siRNA works at concentrations an antisense RNA could never match, and why it became a laboratory tool and then a class of drug. But none of that machinery exists in E. coli. There is no Dicer and no Argonaute, so in a bacterium you are building the first or second kind, and you should expect to express a great deal of it.",
  desc:"Third branch, carry the knife: Argonaute holds a guide strand, and cuts a matching message at a fixed place along that guide before letting go and repeating. One guide silences many messages, and this route exists only in eukaryotes. Closing line: the recognition step is the same every time; what differs is what the pairing is for."});

window.Deck.sequence("pairing", function(slide){
  const s = G.scene(slide, 858, 886);
  s.finish();
  return G.run(s, FR, paint);
});
})();
