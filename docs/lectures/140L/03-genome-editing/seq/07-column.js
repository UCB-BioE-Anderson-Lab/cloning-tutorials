/* ------------------------------------------------------------------ *
 * 07-column.js — the silica column, run rather than listed.
 *
 * The slide was nine bullets.  Nine bullets is the right thing to hand
 * someone at the bench and the wrong thing to explain a mechanism with,
 * because every line reads "spin 15 s, discard" and nothing on the slide
 * says what left the column that time.  Here the liquid is drawn, so
 * what goes through is visible, what stays is visible, and the three
 * washes stop being three identical instructions.
 *
 * JCA: "showing the column and what is happening to it, like exchange of
 * tubes below it, liquids in it with their labels being squirted in."
 * So the collection tube really is swapped, on screen, at the step where
 * you swap it -- which is the one step in the protocol people skip, and
 * the consequence of skipping it is that you elute into the wash you
 * just threw away.
 *
 * Geometry tweens (liquid levels, the tube sliding out from under),
 * so this uses G.run and the dyn group rather than the fade-only scenes.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

const n1 = v => Math.round(v*10)/10;
const S = 3;

/* ---- the column: a barrel with a frit, and a spout under it -------- */
const CX = 720, CW = 200;                 /* barrel left edge, width   */
const CTOP = 184, FRIT = 372;             /* rim, and the silica       */
const SPOUT = 440;                        /* where it drips from       */
/* ---- the collection tube it sits in ------------------------------- */
const TX = 688, TW = 264, TTOP = 322, TBOT = 610;
const TFLOOR = TBOT + TW*0.5;             /* the round bottom's lowest */

function path(d, col, w, dash, op){
  const a = {d:d, fill:"none", stroke:col || C.ink, "stroke-width":w || S,
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  if (op != null) a.opacity = op;
  return G.el("path", a);
}
/* a tube: two walls and a round bottom */
function tubeD(x, w, top, bot){
  return "M"+x+" "+top+"V"+bot+"Q"+(x+w/2)+" "+(bot+w*0.5)+" "+(x+w)+" "+bot+"V"+top;
}
/* what is in it, from a level down.  The meniscus dips in the middle:
   an aqueous solution wets the wall and climbs it. */
function fillD(x, w, lvl, bot){
  return "M"+x+" "+n1(lvl)+"Q"+(x+w/2)+" "+n1(lvl+16)+" "+(x+w)+" "+n1(lvl)+
         "V"+bot+"Q"+(x+w/2)+" "+(bot+w*0.5)+" "+x+" "+bot+"Z";
}
function pool(x, w, lvl, bot, col, op){
  const g = G.el("g", {});
  g.appendChild(G.el("path", {d:fillD(x, w, lvl, bot), fill:col,
    "fill-opacity":op == null ? ".13" : op, stroke:"none"}));
  g.appendChild(path("M"+x+" "+n1(lvl)+"Q"+(x+w/2)+" "+n1(lvl+16)+" "+(x+w)+" "+n1(lvl),
    C.muted, 2));
  return g;
}

/* the barrel, its frit, and the funnel down to the spout */
function barrel(){
  const g = G.el("g", {});
  g.appendChild(path("M"+CX+" "+CTOP+"V"+FRIT+"L"+(CX+CW*0.34)+" "+(FRIT+44)+
    "V"+SPOUT+"H"+(CX+CW*0.66)+"V"+(FRIT+44)+"L"+(CX+CW)+" "+FRIT+"V"+CTOP));
  return g;
}
function frit(bound){
  const g = G.el("g", {});
  g.appendChild(G.el("rect", {x:CX+3, y:FRIT-16, width:CW-6, height:16,
    fill:C.muted, "fill-opacity":".22", stroke:C.muted, "stroke-width":1.8}));
  if (bound > 0.02){
    const b = G.el("rect", {x:CX+3, y:FRIT-16, width:CW-6, height:16,
      fill:C.blue, "fill-opacity":n1(0.5*bound), stroke:C.blue, "stroke-width":2,
      opacity:n1(bound)});
    g.appendChild(b);
  }
  return g;
}

/* a pipette above the column, squirting something in, with its label */
function squirt(label, sub, col, t){
  const g = G.el("g", {opacity:n1(t)});
  const px = CX + CW/2;
  g.appendChild(path("M"+(px-26)+" 92V132L"+(px-7)+" 168V186H"+(px+7)+"V168L"+
    (px+26)+" 132V92Z", C.muted, 2.6));
  for (let i = 0; i < 3; i++){
    const y = 198 + i*26;
    g.appendChild(G.el("ellipse", {cx:px, cy:y, rx:6, ry:9, fill:col,
      "fill-opacity":".5", stroke:col, "stroke-width":1.8}));
  }
  g.appendChild(G.text(px + 70, 132, label, 30, col, 700, "start"));
  if (sub) g.appendChild(G.text(px + 70, 166, sub, 23, C.muted, 400, "start"));
  return g;
}

/* what the spin is doing, beside the assembly */
function spinMark(t, label){
  const g = G.el("g", {opacity:n1(t)});
  const x = 1120, y = 300;
  g.appendChild(path("M"+(x-40)+" "+y+"a40 40 0 1 1 12 29", C.verm, 3.4));
  g.appendChild(path("M"+(x-36)+" "+(y+42)+"l10 -16l17 8", C.verm, 3.4));
  g.appendChild(G.text(x + 40, y + 10, label, 27, C.verm, 700, "start"));
  return g;
}

const FR = [
  { s:{col:1, thru:0, bound:0, swap:0, elu:0}, on:["load"],
    cap:"the cleared lysate goes on the column",
    call:"still full of guanidinium &#183; that is what makes the DNA stick to the silica",
    note:"This is the supernatant from the last slide, and it is still full of the guanidinium salt that came in with N3. That matters: silica only binds DNA in high chaotropic salt. If you washed this with water now you would take the plasmid straight through the column with it.",
    desc:"A spin column seated in a collection tube. The column is full of the cleared lysate, and the collection tube below it is empty." },

  { s:{col:0, thru:1, bound:1, swap:0, elu:0}, on:["spin1"],
    cap:"<b>spin 15 s</b> &#183; the liquid goes through and the DNA does not",
    call:"everything you wanted is now a film on that frit &#183; tip the flow-through away",
    note:"Fifteen seconds is all it takes. The liquid passes through the frit and the DNA stays on it, held there by the salt. Everything you care about is now a film of silica-bound plasmid a few millimetres across, and everything in the tube underneath is waste. Tip it out.",
    desc:"The column has emptied into the collection tube and the frit is now marked in blue: the DNA is bound to it." },

  { s:{col:1, thru:0, bound:1, swap:0, elu:0}, on:["pb"],
    cap:"<b>PB</b>, 500 &micro;L &#183; more chaotrope",
    call:"it keeps the DNA stuck while the protein comes off",
    note:"PB is more of the same chaotropic salt. The point of it is that the DNA stays put while everything that is not DNA is persuaded to let go. Nothing about the plasmid changes on this step.",
    desc:"Five hundred microlitres of PB buffer is squirted into the column from a pipette above it, filling the barrel again." },

  { s:{col:0, thru:1, bound:1, swap:0, elu:0}, on:["spin2"],
    cap:"<b>spin</b> &#183; and that one took the protein",
    call:"",
    note:"Protein gone. Notice that this is the first of three spins that look identical on a protocol sheet and are not: each one is removing a different thing, and if you know which, you know why they are in this order.",
    desc:"The column has emptied again into the collection tube. The DNA is still on the frit." },

  { s:{col:1, thru:0, bound:1, swap:0, elu:0}, on:["pe"],
    cap:"<b>PE</b>, 750 &micro;L &#183; the ethanol wash",
    call:"this is the one that gets the salt out",
    note:"PE is ethanol with a little buffer. DNA is not soluble in it, so the plasmid stays on the silica, and the salt that has been holding it there is soluble, so the salt leaves. That is the whole job of this wash.",
    desc:"Seven hundred and fifty microlitres of PE buffer is squirted into the column, filling the barrel." },

  { s:{col:0, thru:1, bound:1, swap:0, elu:0}, on:["spin3"],
    cap:"<b>spin</b> &#183; and that one took the salt",
    call:"",
    note:"Salt gone. What is left on the frit now is your plasmid and some ethanol.",
    desc:"The column has emptied into the collection tube for the third time." },

  { s:{col:0, thru:0, bound:1, swap:0, elu:0}, on:["dry"],
    cap:"<b>spin 90 s dry</b> &#183; nothing added, and this one is not optional",
    call:"ethanol carries over into the eluate and wrecks a sequencing read",
    note:"Nothing goes in for this one. It is there to drive off the ethanol left in the frit, and it is the step people skip because it looks like it is doing nothing. Ethanol carried over into your eluate will ruin a sequencing read and will inhibit half the enzymes you might want to use next. Ninety seconds, every time.",
    desc:"No liquid is added. The column spins dry over an empty collection tube." },

  { s:{col:0, thru:0, bound:1, swap:1, elu:0}, on:["fresh"],
    cap:"and <b>now</b> change the tube underneath",
    call:"the next thing through the frit is the thing you came for",
    note:"This is the one step in the protocol that everybody has skipped at least once. Up to now the tube underneath has been catching waste, and the next thing through is your plasmid. Swap it for a clean one. Elute into the tube you have been throwing away and you will have done the entire prep to produce fifty microlitres of ethanol wash.",
    desc:"The used collection tube slides out from under the column and a fresh one takes its place." },

  { s:{col:1, thru:0, bound:1, swap:1, elu:0}, on:["water"],
    cap:"water, 50 &micro;L &#183; low salt is what makes it let go",
    call:"the same chemistry, run backwards",
    note:"Water, and no salt. Silica holds DNA in high chaotropic salt and lets go in low salt, so this is just the binding step run backwards. Warm the water first if you are chasing yield, and put it on the middle of the frit rather than down the side.",
    desc:"Fifty microlitres of water is squirted onto the frit." },

  { s:{col:0, thru:0, bound:0, swap:1, elu:1}, on:["spin4"],
    cap:"<b>spin 45 s</b> &#183; and that is your plasmid",
    call:"fifty microlitres, clean, and the column goes in the bin",
    note:"Forty-five seconds and the plasmid comes off the silica and into the fresh tube. Fifty microlitres of clean plasmid DNA. The column has done its job and goes in the bin, and what you are holding is what goes into a digest, a sequencing reaction or a transformation.",
    desc:"The column has emptied into the fresh tube, the frit is clear, and the tube now holds the eluted plasmid." }
];

window.Deck.sequence("column", function(slide){
  const s = G.scene(slide, 800, 846);

  s.part("load",  G.text(TX - 26, CTOP + 70, "the cleared lysate", 25, C.muted, 400, "end"));
  s.part("pb",    squirt("PB", "500 \u00b5L \u00b7 more chaotrope", C.blue, 1));
  s.part("pe",    squirt("PE", "750 \u00b5L \u00b7 ethanol", C.blue, 1));
  s.part("water", squirt("water", "50 \u00b5L \u00b7 no salt", C.blue, 1));
  s.part("spin1", spinMark(1, "15 s"));
  s.part("spin2", spinMark(1, "15 s \u00b7 protein gone"));
  s.part("spin3", spinMark(1, "15 s \u00b7 salt gone"));
  s.part("dry",   spinMark(1, "90 s dry \u00b7 ethanol gone"));
  s.part("spin4", spinMark(1, "45 s"));
  s.part("fresh", (function(){
    const g = G.el("g", {});
    g.appendChild(path("M"+(TX-150)+" "+(TBOT+74)+"h-110m26-14l-26 14l26 14", C.verm, 3.2));
    g.appendChild(G.text(TX-170, TBOT+50, "waste tube out", 23, C.verm, 700, "end"));
    g.appendChild(path("M"+(TX+TW+150)+" "+(TBOT+74)+"h110m-26-14l26 14l-26 14", C.verm, 3.2));
    g.appendChild(G.text(TX+TW+170, TBOT+50, "clean tube in", 23, C.verm, 700, "start"));
    return g;
  })());
  s.finish();

  function paint(v){
    const g = G.el("g", {});

    /* ---- the collection tube, and its replacement sliding in ------- */
    function tube(dx, lvl, col, tag, fade){
      const t = G.el("g", {transform:"translate("+n1(dx)+" 0)"});
      if (fade != null && fade < 0.995) t.setAttribute("opacity", n1(fade));
      t.appendChild(path(tubeD(TX, TW, TTOP, TBOT)));
      if (lvl > 0.02)
        t.appendChild(pool(TX+3, TW-6, TBOT - (TBOT-TTOP-30)*0.55*lvl, TBOT, col, ".15"));
      if (tag) t.appendChild(G.text(TX - 22, TBOT + 30, tag, 23, C.muted, 400, "end"));
      return t;
    }
    g.appendChild(tube(-520*v.swap, v.thru, C.muted, v.swap < 0.5 ? "waste" : "", 1 - v.swap));
    if (v.swap > 0.02)
      g.appendChild(tube(520*(1 - v.swap), v.elu, C.blue, "your plasmid"));

    /* ---- the column itself ---------------------------------------- */
    if (v.col > 0.02)
      g.appendChild(pool(CX+3, CW-6, FRIT - (FRIT-CTOP-26)*v.col, FRIT - 16, C.blue, ".16"));
    g.appendChild(barrel());
    g.appendChild(frit(v.bound));
    g.appendChild(G.text(TX + TW + 26, CTOP + 26, "silica column", 25, C.muted, 400, "start"));
    if (v.bound > 0.5)
      g.appendChild(G.text(TX + TW + 26, FRIT - 4, "DNA, bound", 24, C.blue, 700, "start"));
    return g;
  }

  return G.run(s, FR, paint);
});
})();
