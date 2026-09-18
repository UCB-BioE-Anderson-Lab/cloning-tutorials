/* ------------------------------------------------------------------ *
 * 03-cas9.js — what Cas9 actually does, drawn.
 *
 * Replaces a borrowed infographic (livemint.com) that showed the cut and
 * the repair but not the two things that make CRISPR both programmable
 * and constrained: Cas9 reads the PAM BEFORE it reads your sequence, and
 * what it makes when it matches is an R-loop -- the guide paired with one
 * strand and the other strand pushed out of the way.  Those two facts are
 * the whole reason you cannot target wherever you like, which is exactly
 * the problem the "find a GG" slides later in this section are solving.
 *
 * The strand bookkeeping, since it is easy to draw backwards: the
 * protospacer and the PAM are on the SAME strand, and the guide's twenty
 * bases are that strand's sequence.  So the guide pairs with the OTHER
 * strand, and the PAM-bearing strand is the one displaced into the loop.
 * Here the PAM is on top, so the top strand is the one that bulges.
 *
 * Geometry tweens, so this uses G.run and the dyn group rather than the
 * build-once-and-fade that the rest of the deck's scenes use.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const G = window.GE, C = G.C;

/* COLOUR HAS ONE JOB HERE.  Ink is the chromosome.  Amber is the PAM,
   because that is a feature of the chromosome and not something you
   chose.  Vermillion is the guide RNA -- the one part you design -- and
   so it is never used on the DNA.  Blue is Cas9.  The first version put
   the twenty bases in red on the genome while the caption said they were
   the part you design, which had the colour saying the opposite of the
   words. */
const YT = 560, YB = 600;            /* the two strands            */
const X0 = 190, X1 = 1410;           /* how far the genome runs    */
const PS0 = 700, PS1 = 1100;         /* protospacer, 20 bp at 20px */
const PAM0 = 1100, PAM1 = 1160;      /* the three bases after it   */
const CUT = 1040;                    /* three bases in from the PAM */
const CX = 940, LOBE = 380;          /* Cas9: centre, and its big lobe */
const LOOP = 130, GAPW = 44;

const n2 = v => Math.round(v*10)/10;
const S = 3.5;

function path(d, col, w, dash, op){
  const a = {d:d, stroke:col || C.ink, "stroke-width":w || S, fill:"none",
    "stroke-linecap":"round", "stroke-linejoin":"round"};
  if (dash) a["stroke-dasharray"] = dash;
  if (op != null) a.opacity = op;
  return G.el("path", a);
}
function band(x0, x1, y, col, h){
  return G.el("rect", {x:n2(x0), y:n2(y - (h||9)/2), width:n2(x1-x0), height:h||9,
    rx:3, fill:col});
}
/* a bubble: both feet stay where they are, the middle lifts */
function bulge(x0, x1, y, h){
  const w = (x1 - x0)*0.28;
  return "M"+n2(x0)+" "+n2(y)+"C"+n2(x0+w)+" "+n2(y-h)+" "+n2(x1-w)+" "+n2(y-h)+
         " "+n2(x1)+" "+n2(y);
}
const mix = (a, b, t) => a + (b - a)*t;

/* Cas9: two lobes with the DNA running through the cleft between them,
   which is the one feature of the protein that has to be drawn -- a
   closed lump would say nothing.  Translucent, so the molecule it is
   holding reads straight through it, and kept clear of the two labels
   that live just above and just below the DNA. */
function cas9(dy, land, o){
  const g = G.el("g", {opacity:n2(o), transform:"translate(0 "+n2(dy)+")"});
  const sk = {fill:C.blue, "fill-opacity":".09", stroke:C.blue,
              "stroke-width":2.6, "stroke-opacity":".6"};
  /* The clamshell opens as it lands.  Lifting the whole protein clear of
     the DNA is not possible -- the two lobes are three hundred apart and
     raising them far enough to clear the molecule puts the top one
     through the slide title -- so the lower lobe swings down into place
     instead, which is closer to what the protein does anyway. */
  const ly = mix(496, 688, land);
  g.appendChild(G.el("ellipse", Object.assign({cx:CX, cy:LOBE, rx:300, ry:104}, sk)));
  g.appendChild(G.el("ellipse", Object.assign({cx:1184, cy:n2(ly), rx:150, ry:62}, sk)));
  g.appendChild(path("M"+(CX+286)+" "+(LOBE+56)+"Q1290 "+n2(ly-110)+" 1284 "+n2(ly-56),
    C.blue, 2.6, null, 0.5));
  g.appendChild(G.text(CX - 150, LOBE - 22, "Cas9", 30, C.blue, 700));
  g.appendChild(G.text(1184, n2(ly + 8), "PAM-reading lobe", 21, C.blue, 700));
  return g;
}

/* the guide: a scaffold hairpin, and the twenty bases you choose */
function hairpin(dy, o){
  const g = G.el("g", {opacity:n2(o), transform:"translate(0 "+n2(dy)+")"});
  const x = CX + 246, y = 206;
  g.appendChild(path("M"+x+" "+(y+70)+"V"+(y+22)+"a28 28 0 1 1 56 0V"+(y+70), C.verm, 3.2));
  g.appendChild(G.text(x + 96, y + 40, "guide RNA", 24, C.verm, 700, "start"));
  return g;
}

const FR = [
  { s:{land:0, open:0, cut:0, gap:0, off:0, join:0}, on:["prog"],
    cap:"the only part you design is twenty bases of RNA",
    call:"everything else about Cas9 is the same whatever you are cutting",
    note:"Start with what makes this different from everything else in the lecture. Cas9 is one protein and it is always the same protein. What you change is a twenty base stretch of an RNA it carries, and those twenty bases are what decide where in a genome it cuts. That is the whole of the programming. No new enzyme, no new binding site engineered into the chromosome, just an oligo.",
    desc:"A double-stranded genome drawn as two lines, with Cas9 above it as a two-lobed shape carrying a guide RNA hairpin, the guide's twenty variable bases picked out in red." },

  { s:{land:1, open:0, cut:0, gap:0, off:0, join:0}, on:["prog","pam"],
    cap:"but it reads a <b>PAM</b> first, not your sequence",
    call:"NGG &#183; three bases, and nothing happens anywhere that does not have one",
    note:"And here is the constraint that everything later in this section is working around. Cas9 does not scan for your twenty bases. It scans for a PAM, which for the Streptococcus pyogenes enzyme is NGG: any base, then two Gs. It collides with the DNA, checks for a PAM, and lets go again if there is not one. Only where it finds one does it even look at the sequence next door. So you cannot cut wherever you like. You can cut next to a GG.",
    desc:"Cas9 has come down onto the genome. A short segment of the top strand is marked PAM, and Cas9's lower lobe is sitting against it." },

  { s:{land:1, open:1, cut:0, gap:0, off:0, join:0}, on:["prog","pam","ps"],
    cap:"then it opens the duplex beside the PAM and checks the twenty bases there",
    call:"the guide pairs with one strand &#183; the other is pushed out of the way",
    note:"Having found a PAM, Cas9 prises the two strands apart just next to it and offers its guide to one of them. If the twenty bases match, the guide base-pairs with them and stays. Watch which strand is which, because it is easy to get backwards: the protospacer and the PAM are on the same strand, the guide carries that strand's sequence, so the guide pairs with the opposite strand and the PAM-bearing strand is the one with nothing left to pair with. It gets pushed out into a loop. That structure is called an R-loop, and it is the thing that holds Cas9 on target.",
    desc:"The duplex has opened over the twenty bases next to the PAM. The guide RNA lies paired against the lower strand, and the upper strand has been displaced into a loop above it." },

  { s:{land:1, open:1, cut:1, gap:0, off:0, join:0}, on:["prog","pam","ps","cuts"],
    cap:"held on target, it cuts both strands three bases in from the PAM",
    call:"two nuclease domains, one per strand, and the ends come out blunt",
    note:"Only once the R-loop is complete do the nuclease domains fire. There are two of them and they take one strand each, both of them cutting between the third and fourth base counting back from the PAM. Because both cuts are at the same position, the ends come out blunt. That predictability is worth noticing, and you will use it in a minute: you can write down exactly where the break is going to be from the sequence alone.",
    desc:"Two cut marks appear across the strands, at the same position three bases in from the PAM." },

  { s:{land:1, open:0, cut:0, gap:1, off:1, join:0}, on:["prog","broke"],
    cap:"and then it lets go, leaving a blunt double-strand break",
    call:"a chromosome in two pieces &#183; this is all Cas9 does",
    note:"Cas9 releases, the loop collapses, and what is left behind is a chromosome in two pieces. That is the entire contribution of the protein. It does not insert anything, it does not repair anything, it does not edit anything. It makes one break in one place. Everything that happens next is the cell's own machinery, and which machinery the cell has is what decides what you get.",
    desc:"Cas9 and the guide have gone. The genome is in two pieces with blunt ends, separated by a gap." },

  { s:{land:1, open:0, cut:0, gap:1, off:1, join:1}, on:["prog","nhej"],
    cap:"in a plant or an animal cell, the ends get stuck back together badly",
    call:"non-homologous end joining &#183; a few bases lost, the reading frame wrecked, the gene dead",
    note:"In most eukaryotic cells there is a pathway called non-homologous end joining that grabs two free ends and ligates them, and it is not careful: it usually chews or adds a few bases first. That sloppiness is the point. A small insertion or deletion in a coding sequence throws the reading frame out and the gene stops working. So in a mammalian or plant cell, cutting is enough to knock a gene out, and most of what you read about CRISPR knockouts is this.",
    desc:"The two ends have been joined back together, with a small red mark at the junction showing the few bases lost or gained in the process." },

  { s:{land:1, open:0, cut:0, gap:1, off:1, join:0}, on:["prog","noneh"],
    cap:"<em>E. coli</em> has essentially none of that pathway",
    call:"so the break is not an edit, it is a death sentence &#8212; unless you hand the cell a template",
    note:"And here is why this section is built the way it is. E. coli has essentially no non-homologous end joining. Hand it a double-strand break in its only chromosome and it does not repair it badly, it does not repair it at all, and the cell dies. Which sounds like a problem and is actually the trick. It means a cut is a very strong selection: the only cells that live are the ones that repaired, and the only way to repair is homologous recombination off a template. So you supply the template, and every survivor is an edit. That is the two plasmid system on the next slide.",
    desc:"The broken genome again, with a separate short piece of double-stranded DNA above it labelled repair template, and a note that E. coli has no end-joining pathway." }
];

window.Deck.sequence("cas9", function(slide){
  const s = G.scene(slide, 800, 846);

  /* The labels that come and go rather than move.  They live just above
     the top strand and just below the bottom one, which is the band
     Cas9's two lobes are shaped to leave clear. */
  s.part("pam", G.text((PAM0+PAM1)/2, YT - 34, "PAM \u00b7 NGG", 25, C.amber, 700));
  s.part("ps", (function(){
    const g = G.el("g", {});
    g.appendChild(path("M"+PS0+" "+(YB+26)+"V"+(YB+40)+"H"+PS1+"V"+(YB+26), C.muted, 2.6));
    g.appendChild(G.text((PS0+PS1)/2, YB + 74, "the 20 bases it matches", 24, C.muted));
    return g;
  })());
  s.part("broke", G.text(CUT, YB + 74, "blunt ends, and a chromosome in two", 24, C.muted));
  s.part("nhej", (function(){
    const g = G.el("g", {});
    g.appendChild(G.el("ellipse", {cx:CUT, cy:478, rx:168, ry:66, fill:C.muted,
      "fill-opacity":".09", stroke:C.muted, "stroke-width":2.6, "stroke-opacity":".6"}));
    g.appendChild(G.text(CUT, 470, "end-joining machinery", 24, C.muted, 700));
    g.appendChild(G.text(CUT, 502, "Ku, ligase IV \u2014 in a eukaryote", 21, C.muted));
    g.appendChild(G.text(CUT, YB + 74, "a few bases lost or gained", 24, C.verm, 700));
    return g;
  })());
  s.part("noneh", (function(){
    const g = G.el("g", {});
    g.appendChild(path("M680 330H1200", C.blue, S));
    g.appendChild(path("M680 366H1200", C.blue, S));
    g.appendChild(G.text(940, 302, "a repair template, which you have to supply", 25, C.blue, 700));
    g.appendChild(G.text(CUT, YB + 74, "nothing here will put these back together", 24, C.verm, 700));
    return g;
  })());
  s.part("prog", G.text(X0, YB + 74, "genome", 25, C.muted, 400, "start"));
  s.finish();

  function paint(v){
    const g = G.el("g", {});
    const dL = -v.gap*GAPW, dR = v.gap*GAPW, h = v.open*LOOP;

    /* bottom strand: the one the guide pairs with, never displaced */
    g.appendChild(path("M"+n2(X0+dL)+" "+YB+"H"+n2(CUT+dL)+
                       "M"+n2(CUT+dR)+" "+YB+"H"+n2(X1+dR), C.ink, S));

    /* top strand: flat, or bulged out over the protospacer.  It is the
       PAM-bearing strand, so it is the one with nothing left to pair
       with once the guide takes its place. */
    if (h < 0.6){
      g.appendChild(path("M"+n2(X0+dL)+" "+YT+"H"+n2(CUT+dL)+
                         "M"+n2(CUT+dR)+" "+YT+"H"+n2(X1+dR), C.ink, S));
    } else {
      g.appendChild(path("M"+n2(X0+dL)+" "+YT+"H"+n2(PS0+dL), C.ink, S));
      g.appendChild(path(bulge(PS0+dL, PS1+dR, YT, h), C.ink, S));
      g.appendChild(path("M"+n2(PS1+dR)+" "+YT+"H"+n2(X1+dR), C.ink, S));
    }
    /* revealed as Cas9 arrives to read it: it is there all along, but
       marking it before anything is looking for it is just a tick on a
       line the room has no reason to care about yet */
    if (v.land > 0.02){
      const b = band(PAM0+dR, PAM1+dR, YT, C.amber, 11);
      b.setAttribute("opacity", n2(v.land)); g.appendChild(b);
    }

    /* the cut marks, while Cas9 is still holding the ends together */
    if (v.cut > 0.02){
      g.appendChild(path("M"+n2(CUT)+" "+(YT-22)+"V"+(YT+22)+
                         "M"+n2(CUT)+" "+(YB-22)+"V"+(YB+22),
                         C.verm, 4.6, null, v.cut));
    }
    /* the scar left by end joining */
    if (v.join > 0.02){
      g.appendChild(G.el("rect", {x:n2(CUT+dL-14), y:YT-16, width:28, height:72,
        rx:4, fill:C.verm, "fill-opacity":n2(0.22*v.join), stroke:C.verm,
        "stroke-width":2.4, opacity:n2(v.join)}));
    }

    /* Cas9 is on screen from the first beat, because the first beat is
       about it; `land` brings it down onto the molecule, `off` takes it
       away again. */
    const o = 1 - v.off, dy = -(1 - v.land)*120;
    if (o > 0.02){
      g.appendChild(cas9(dy, v.land, o));
      g.appendChild(hairpin(dy, o));
      /* the twenty bases: inside the protein until the duplex opens,
         then lying against the strand they have just paired with */
      const gy = mix(LOBE + 40 + dy, YB - 13, v.open);
      const gx0 = mix(CX - 150, PS0 + dL, v.open);
      const gx1 = mix(CX + 150, PS1 + dR, v.open);
      g.appendChild(path("M"+n2(gx0)+" "+n2(gy)+"H"+n2(gx1), C.verm, 7));
      if (v.open < 0.3)
        g.appendChild(G.text((gx0+gx1)/2, gy + 34, "20 bases", 22, C.verm, 700));
    }
    return g;
  }

  return G.run(s, FR, ["land","open","cut","gap","off","join"], paint);
});
})();
