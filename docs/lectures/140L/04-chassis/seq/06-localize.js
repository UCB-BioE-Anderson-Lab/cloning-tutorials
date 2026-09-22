/* ------------------------------------------------------------------ *
 * 06-localize.js — the five compartments, and how a protein reaches
 * each of them.
 *
 * The source has three borrowed figures for this: a labelled
 * cross-section, the same cross-section again with the difficulty of
 * each destination written beside it, and a sec translocon diagram.
 * They are three pictures of one thing, and the one thing is a journey,
 * so it is drawn once and walked.
 *
 * The order is the source's own and it is the right one, because it is
 * the order of increasing difficulty: cytoplasm is free, the periplasm
 * costs you a signal sequence, the outer membrane costs you a fold that
 * will insert, and secretion costs you a whole apparatus.
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

/* ------------------------------------------------------------------ *
 * The envelope, in section.  Bands rather than a drawn cell, because
 * what matters is that there are five of them in a fixed order.
 * ------------------------------------------------------------------ */
const X0 = 300, X1 = 1400;
/* Sized to the content box, not to the drawing: the caption sits at 800,
   so the cytoplasm has to stop above it.  The first pass ran to 816 and
   the last band went under the words. */
const OM = 252, IM = 424, MH = 44;        /* membrane tops, and thickness */
const OUT = 168, PERI = OM + MH, CYT = IM + MH;
const CYTH = 232;                         /* how deep the cytoplasm is drawn */

function bilayer(yTop){
  const g = G.el("g", {}), r = 8, step = 21;
  g.appendChild(G.el("rect", {x:X0, y:n1(yTop), width:X1 - X0, height:MH,
    fill:C.amber, "fill-opacity":".13", stroke:"none"}));
  for (let x = X0 + r + 2; x < X1 - r; x += step){
    [yTop + r + 1, yTop + MH - r - 1].forEach(function(y){
      g.appendChild(G.el("circle", {cx:n1(x), cy:n1(y), r:r,
        fill:C.amber, "fill-opacity":".55", stroke:C.amber, "stroke-width":1.4}));
    });
  }
  return g;
}
function band(label, y, sub){
  const g = G.el("g", {});
  g.appendChild(G.text(X0 - 26, y, label, 25, C.muted, 700, "end"));
  if (sub) g.appendChild(G.text(X0 - 26, y + 27, sub, 21, C.muted, 400, "end"));
  return g;
}
/* a ribosome, as the two lobes everyone draws */
function ribosome(cx, cy){
  const g = G.el("g", {});
  g.appendChild(G.el("ellipse", {cx:n1(cx), cy:n1(cy + 13), rx:46, ry:27,
    fill:C.ink, "fill-opacity":".10", stroke:C.ink, "stroke-width":2.6}));
  g.appendChild(G.el("ellipse", {cx:n1(cx), cy:n1(cy - 16), rx:37, ry:21,
    fill:C.ink, "fill-opacity":".10", stroke:C.ink, "stroke-width":2.6}));
  return g;
}
/* a folded protein */
function folded(cx, cy, k, col){
  const g = G.el("g", {}), z = k || 1;
  g.appendChild(G.el("path", {d:
    "M"+n1(cx-30*z)+" "+n1(cy)+
    "C"+n1(cx-34*z)+" "+n1(cy-26*z)+" "+n1(cx-6*z)+" "+n1(cy-32*z)+" "+n1(cx+10*z)+" "+n1(cy-20*z)+
    "C"+n1(cx+32*z)+" "+n1(cy-4*z)+" "+n1(cx+28*z)+" "+n1(cy+24*z)+" "+n1(cx+4*z)+" "+n1(cy+26*z)+
    "C"+n1(cx-18*z)+" "+n1(cy+28*z)+" "+n1(cx-27*z)+" "+n1(cy+16*z)+" "+n1(cx-30*z)+" "+n1(cy)+"Z",
    fill:col || C.blue, "fill-opacity":".18", stroke:col || C.blue,
    "stroke-width":2.8}));
  return g;
}
/* the signal peptide: the bit on the front that decides everything */
function signal(x, y, o){
  const g = grp(o == null ? 1 : o);
  g.appendChild(G.el("rect", {x:n1(x), y:n1(y - 11), width:62, height:22, rx:6,
    fill:C.verm, "fill-opacity":".30", stroke:C.verm, "stroke-width":2.4}));
  return g;
}
/* the sec translocon: a channel with a protein going through it */
function translocon(cx, yTop, o){
  const g = grp(o == null ? 1 : o), w = 74;
  g.appendChild(G.el("path", {d:
    "M"+n1(cx-w/2)+" "+n1(yTop-8)+"L"+n1(cx-20)+" "+n1(yTop+MH/2)+
    "L"+n1(cx-w/2)+" "+n1(yTop+MH+8)+"H"+n1(cx-w/2-22)+"V"+n1(yTop-8)+"Z",
    fill:C.ink, "fill-opacity":".12", stroke:C.ink, "stroke-width":2.6,
    "stroke-linejoin":"round"}));
  g.appendChild(G.el("path", {d:
    "M"+n1(cx+w/2)+" "+n1(yTop-8)+"L"+n1(cx+20)+" "+n1(yTop+MH/2)+
    "L"+n1(cx+w/2)+" "+n1(yTop+MH+8)+"H"+n1(cx+w/2+22)+"V"+n1(yTop-8)+"Z",
    fill:C.ink, "fill-opacity":".12", stroke:C.ink, "stroke-width":2.6,
    "stroke-linejoin":"round"}));
  return g;
}

const FR = [
{ s:{env:1},
  cap:"a gram-negative cell has <b>five</b> places to be",
  call:"no organelles, but not one compartment either",
  note:"Bacteria have no organelles, which people sometimes take to mean they have no compartments. They have five. The largest is the cytoplasm, where all the central dogma processes happen. Around it is the inner membrane, and a protein can sit peripherally on either face of that or be fully integrated into it. Beyond it is the periplasm, a gelatinous space between the two membranes. Then the outer membrane, which also has proteins in it. And then outside the cell. Which of those five your protein ends up in is something you choose, and the rest of this is how.",
  desc:"A cross-section of a gram-negative envelope drawn as five bands: the cytoplasm at the bottom, the inner membrane, the periplasm, the outer membrane, and the extracellular space at the top." },

{ s:{env:1, rib:1},
  cap:"the <b>cytoplasm</b> is free",
  call:"translation happens there, so that is where a protein is unless you say otherwise",
  note:"Start with the one that costs nothing. Translation happens in the cytoplasm, so a newly made protein is already in the cytoplasm. That is the default, and for most of what you will express it is also the answer: if you want your protein in the cytoplasm, you do nothing at all.",
  desc:"A ribosome in the cytoplasm with a folded protein beside it: the default destination, reached by doing nothing." },

{ s:{env:1, rib:1, sig:1, tl:1},
  cap:"put a <b>signal sequence</b> on the front and it goes through the membrane",
  call:"18&ndash;30 residues &#183; basic near the N-terminus, hydrophobic core in the middle",
  note:"To get out of the cytoplasm you put a short sequence on the N-terminus, called a pre sequence, or a signal sequence, or a leader sequence, all three names for the same thing. It is eighteen to thirty amino acids, with one or more basic residues near the N-terminus and a hydrophobic core of about seven in the middle. A set of proteins called sec recognise it, associate with the ribosome, and thread the protein through the inner membrane as it is being made. Note when this happens: during translation, not after. The protein goes through the membrane before it has folded, which is why the ones that fold too fast need the alternate tat pathway instead.",
  desc:"A signal sequence on the N-terminus of the emerging protein, and the sec translocon in the inner membrane threading it through as it is translated." },

{ s:{env:1, rib:1, tl:1, peri:1},
  cap:"a <b>leader peptidase</b> cuts the signal off, and it is in the periplasm",
  call:"LepB for most things, LspA for prolipoproteins",
  note:"On the far side, a periplasmic enzyme cuts the signal sequence off and the protein is released into the periplasm. LepB does most of them, LspA does the prolipoproteins that become major outer membrane components. That is the whole of periplasmic targeting: one short N-terminal tag, and an enzyme that removes it on arrival. Rather than design one, take a signal sequence from a protein that is already well expressed in the periplasm — pelB, ompA and ompT are the ones people use. There are three good reasons to go there. Some proteins are toxic in the cytoplasm and harmless in the periplasm. Some, antibodies being the standard example, will only fold in the oxidative environment there. And anything headed further out goes through the periplasm on the way.",
  desc:"The signal peptide cleaved off by a leader peptidase, leaving the folded protein free in the periplasm." },

{ s:{env:1, tl:1, peri:1, omp:1},
  cap:"a <b>beta barrel</b> will insert itself into the outer membrane",
  call:"OmpA, OmpT, OmpG, LamB &#183; easy if it belongs there, difficult if it does not",
  note:"Outer membrane proteins are mostly beta barrels, and a beta barrel that arrives in the periplasm will insert itself into the outer membrane without any further help. So the route is the same as before, sec to the periplasm, and then the fold does the rest. The catch is in the word belongs: this works beautifully for proteins that are outer membrane proteins in their native context and is difficult, though not impossible, for anything else. You are relying on a fold, and you cannot bolt a fold onto something the way you bolt on a signal sequence.",
  desc:"A beta barrel protein that has reached the periplasm inserting itself into the outer membrane." },

{ s:{env:1, tl:1, omp:1, out:1},
  cap:"and <b>getting out</b> takes a whole apparatus",
  call:"type I, II and III &#183; all of them iffy in <em>E. coli</em>",
  note:"Secretion is the expensive one. An autotransporter does it cheaply for a single protein: one domain is a beta barrel that inserts into the outer membrane, and then the passenger domain is pulled through the pore it just made and displayed on the surface, often then cleaved off. Beyond that there are the type one, two and three systems, and each of those is a set of genes that assembles a channel spanning both membranes to move a defined set of substrates through. All of them are awkward in E. coli. Which is worth knowing as a practical matter, because gram positives like Bacillus subtilis have no outer membrane at all, so the same prepro targeting that lands a protein in the periplasm here secretes it there. If your project needs a secreted protein, that is usually why people reach for a Bacillus or a Pichia instead of this organism.",
  desc:"A secretion apparatus spanning both membranes, moving the protein out of the cell entirely." }
];

window.Deck.sequence("localize", function(slide){
  const s = G.scene(slide, 800, 846);
  s.finish();

  function paint(v){
    const g = G.el("g", {});
    const half = x => cl(x*2 - 1, 0, 1);

    /* ---- the envelope ------------------------------------------ */
    const e = grp(half(v.env));
    e.appendChild(G.el("rect", {x:X0, y:CYT, width:X1 - X0, height:CYTH,
      fill:C.blue, "fill-opacity":".05", stroke:"none"}));
    e.appendChild(G.el("rect", {x:X0, y:PERI, width:X1 - X0, height:IM - PERI,
      fill:C.blue, "fill-opacity":".09", stroke:"none"}));
    e.appendChild(bilayer(OM));
    e.appendChild(bilayer(IM));
    e.appendChild(band("outside", OUT + 44));
    e.appendChild(band("outer membrane", OM + 30));
    e.appendChild(band("periplasm", PERI + 40));
    e.appendChild(band("inner membrane", IM + 30));
    e.appendChild(band("cytoplasm", CYT + 58));
    g.appendChild(e);

    /* ---- the ribosome, and the protein it is making ------------- */
    if (v.rib > 0.02){
      const r = grp(half(v.rib));
      r.appendChild(ribosome(620, CYT + 96));
      r.appendChild(G.text(620, CYT + 160, "ribosome", 21, C.muted, 400));
      /* the default: it just stays here */
      if (v.sig < 0.5 && v.peri < 0.5){
        r.appendChild(folded(800, CYT + 90));
        r.appendChild(G.text(800, CYT + 148, "stays put", 21, C.blue, 700));
      }
      g.appendChild(r);
    }

    /* ---- sec: the signal, and the channel ----------------------- */
    if (v.tl > 0.02) g.appendChild(translocon(880, IM, half(v.tl)));
    if (v.sig > 0.02 && v.peri < 0.5){
      const q = grp(half(v.sig));
      /* the chain, coming out of the ribosome and into the channel */
      q.appendChild(path("M666 "+n1(CYT + 84)+"C742 "+n1(CYT + 64)+" 824 "+
        n1(CYT + 36)+" 880 "+n1(CYT + 14), C.blue, 6));
      q.appendChild(signal(849, CYT + 34));
      /* beside the tag, not across the chain it is attached to */
      q.appendChild(path("M900 "+n1(CYT + 34)+"h30", C.verm, 2.2));
      q.appendChild(G.text(940, CYT + 41, "signal sequence", 22, C.verm, 700, "start"));
      g.appendChild(q);
    }

    /* ---- and out the other side, into the periplasm ------------- */
    if (v.peri > 0.02){
      const q = grp(half(v.peri));
      q.appendChild(folded(880, PERI + 34));
      q.appendChild(signal(1010, PERI + 34, 0.45));
      q.appendChild(path("M960 "+n1(PERI + 34)+"h36", C.verm, 2.6, "6 5"));
      q.appendChild(G.text(1052, PERI + 40, "signal cut off", 21, C.verm, 400, "start"));
      g.appendChild(q);
    }

    /* ---- a barrel, which puts itself in the outer membrane ------ */
    if (v.omp > 0.02){
      const q = grp(half(v.omp));
      q.appendChild(G.el("rect", {x:1150, y:n1(OM - 10), width:88,
        height:MH + 20, rx:14, fill:C.blue, "fill-opacity":".20",
        stroke:C.blue, "stroke-width":2.8}));
      [1172, 1194, 1216].forEach(x => q.appendChild(
        path("M"+x+" "+n1(OM - 4)+"V"+n1(OM + MH + 4), C.blue, 2.2)));
      q.appendChild(G.text(1194, OM - 30, "β barrel", 21, C.blue, 700));
      g.appendChild(q);
    }

    /* ---- or all the way out ------------------------------------ */
    if (v.out > 0.02){
      const q = grp(half(v.out));
      /* a channel spanning both membranes, and the protein clear of it */
      q.appendChild(G.el("path", {d:
        "M566 "+n1(CYT + 8)+"L600 "+n1(OM - 12)+"H676L710 "+n1(CYT + 8)+
        "H684L658 "+n1(OM + 12)+"H618L592 "+n1(CYT + 8)+"Z",
        fill:C.ink, "fill-opacity":".12", stroke:C.ink, "stroke-width":2.6,
        "stroke-linejoin":"round"}));
      q.appendChild(path("M638 "+n1(OM - 22)+"V"+n1(OUT + 52)+
        "m-10 13l10 -13l10 13", C.ink, 3));
      q.appendChild(folded(638, OUT + 22, 0.85));
      q.appendChild(G.text(740, OUT + 16, "type I, II, III", 22, C.muted, 700, "start"));
      q.appendChild(G.text(740, OUT + 42, "or an autotransporter", 21, C.muted, 400, "start"));
      g.appendChild(q);
    }
    return g;
  }
  return G.run(s, FR, paint);
});
})();
