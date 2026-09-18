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
const CX = 940, LOBE = 380;          /* where the guide sits inside it */
const LOOP = 130, GAPW = 44;
/* the repair template, and the regions it is homologous to.  The arms
   are placed so that at the moment the two are being compared -- ends
   apart by GAPW -- the genome's copies sit directly under the template's,
   because that correspondence is the whole point of the picture. */
const MY = 320, ARM = 240, GENE = 200;
const TL0 = 700, TL1 = TL0 + ARM;            /* template: left arm   */
const TG0 = TL1, TG1 = TG0 + GENE;           /*           the gene   */
const TR0 = TG1, TR1 = TR0 + ARM;            /*           right arm  */
const HL0 = TL0 + GAPW, HR0 = TR0 - GAPW;    /* the genome's copies  */

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

/* Cas9, as JCA's line art: one filled silhouette with a slot punched
   through it (seq/art-cas9.js), rotated a little past a quarter turn so
   the deep bite in what was its right-hand edge opens downward.  That
   bite is the cleft, and the duplex sits in it.

   Two ellipses used to do this job and had to open like a clamshell,
   because a pair of lobes lifted far enough to clear the DNA put the top
   one through the slide title.  One shape with a notch has no such
   problem: it just comes down, and the molecule ends up in the groove.

   Translucent, per the house rule for an enzyme sitting on a substrate,
   so the DNA and the R-loop read straight through it. */
/* Placement is solved rather than eyeballed.  The shape was rasterised
   at each candidate rotation and its bottom edge profiled; at 110 the
   deepest notch is 200 units and sits 146 left of and 89 below the
   shape's centre.  ART_T is then just the arithmetic that puts that
   notch where the duplex wants it: apex a little ABOVE the top strand,
   so the molecule passes under the roof of the cleft and the two arms of
   the protein come down either side of it. */
const ART_W = 558.6, ART_H = 525.3, ART_ROT = 110;
const ART_KX = 1.08, ART_KY = 0.80;  /* see below for why these differ */
const ART_NX = -146, ART_NY = 89;    /* the notch, from the shape centre */
const SEATX = 819, SEATY = 536;      /* where that notch is to sit       */
const ART_TX = SEATX - ART_KX*ART_NX, ART_TY = SEATY - ART_KY*ART_NY;

/* The scale is not uniform, and the squash is applied OUTSIDE the
   rotation so it happens along the slide's axes rather than the shape's.
   The source is very nearly square, and the protein has to be wide
   enough to contain the whole R-loop while leaving the slide title
   alone; scaled evenly it can do one or the other.  A blob squashed by a
   fifth is still a blob.  The stroke is told not to scale with it, or
   the outline would come out heavier across than down. */
function cas9(dy, o){
  const g = G.el("g", {opacity:n2(o), fill:C.blue, "fill-opacity":".13",
    stroke:C.blue, "stroke-width":2.6, "stroke-opacity":".62",
    "vector-effect":"non-scaling-stroke",
    transform:"translate("+n2(ART_TX)+" "+n2(ART_TY + dy)+") scale("+ART_KX+" "+ART_KY+
              ") rotate("+ART_ROT+") translate("+n2(-ART_W/2)+" "+n2(-ART_H/2)+")"});
  g.innerHTML = window.ART.cas9;
  return g;
}

/* THE GUIDE IS ONE MOLECULE.  The first version drew the twenty bases
   inside Cas9 and a hairpin outside it, which reads as two things and
   raises exactly the question JCA asked: is there processing between
   them?  In nature, yes -- a type II CRISPR array is transcribed as one
   long pre-crRNA, a separate tracrRNA pairs with its repeats, RNase III
   cuts it up, and what loads into Cas9 is a crRNA:tracrRNA pair.  But
   nothing you will use works that way.  Jinek and Charpentier's 2012
   result was that the two could be fused into one chimeric RNA, and that
   single guide is what every plasmid in this lecture encodes: twenty
   bases you choose at the 5' end, running straight on into a scaffold
   that is the same in every guide ever made.

   Which end is which matters and is easy to get backwards: the spacer
   carries the protospacer's sequence 5'-to-3' toward the PAM, so its 3'
   end -- the end the scaffold continues from -- is the PAM-proximal one.
   The scaffold therefore sits on the PAM side, and it stays up in the
   protein while the spacer reaches down to pair. */
const SCX = 1124, SCY = 452;         /* where the scaffold sits in Cas9 */

function scaffold(x, y){
  const g = G.el("g", {});
  for (let i = 0; i < 3; i++){
    const hx = x + i*40;
    g.appendChild(path("M"+hx+" "+y+"V"+(y-40)+"a15 15 0 1 1 30 0V"+y, C.verm, 3.2));
  }
  g.appendChild(path("M"+x+" "+y+"H"+(x + 110), C.verm, 3.2));
  return g;
}

const FR = [
  { s:{land:0, open:0, cut:0, gap:0, off:0, join:0, arms:0, ins:0}, on:["prog"],
    cap:"the guide is <b>one</b> RNA: twenty bases you choose, then a scaffold that never changes",
    call:"in nature it is two RNAs that have to be processed and paired &#183; fusing them into one is what made this usable",
    note:"Start with what makes this different from everything else in the lecture. Cas9 is one protein and it is always the same protein. What you change is the first twenty bases of a single RNA it carries, and those twenty bases decide where in a genome it cuts. That is the whole of the programming: no new enzyme, no new site engineered into the chromosome, just an oligo. And it is worth being clear that it really is one molecule, because in nature it is not. A type II CRISPR array is transcribed as one long pre-crRNA, a separate tracrRNA base-pairs with its repeats, RNase III cuts the thing up, and what loads into Cas9 is a crRNA paired to a tracrRNA. Jinek and Charpentier showed in 2012 that the two could be fused into one chimeric RNA, and that single guide is what every plasmid in this lecture encodes. So there is processing, and the engineering was getting rid of it.",
    desc:"A double-stranded genome drawn as two lines, with Cas9 above it as a two-lobed shape holding a single guide RNA: a straight stretch of twenty bases running on into three stem-loops of scaffold, all one molecule and all in red." },

  { s:{land:1, open:0, cut:0, gap:0, off:0, join:0, arms:0, ins:0}, on:["prog","pam"],
    cap:"but it reads a <b>PAM</b> first, not your sequence",
    call:"NGG &#183; three bases, and nothing happens anywhere that does not have one",
    note:"And here is the constraint that everything later in this section is working around. Cas9 does not scan for your twenty bases. It scans for a PAM, which for the Streptococcus pyogenes enzyme is NGG: any base, then two Gs. It collides with the DNA, checks for a PAM, and lets go again if there is not one. Only where it finds one does it even look at the sequence next door. So you cannot cut wherever you like. You can cut next to a GG.",
    desc:"Cas9 has come down onto the genome. A short segment of the top strand is marked PAM, and Cas9's lower lobe is sitting against it." },

  { s:{land:1, open:1, cut:0, gap:0, off:0, join:0, arms:0, ins:0}, on:["prog","pam","ps"],
    cap:"then it opens the duplex beside the PAM and checks the twenty bases there",
    call:"the guide pairs with one strand &#183; the other is pushed out of the way",
    note:"Having found a PAM, Cas9 prises the two strands apart just next to it and offers its guide to one of them. If the twenty bases match, the guide base-pairs with them and stays. Watch which strand is which, because it is easy to get backwards: the protospacer and the PAM are on the same strand, the guide carries that strand's sequence, so the guide pairs with the opposite strand and the PAM-bearing strand is the one with nothing left to pair with. It gets pushed out into a loop. That structure is called an R-loop, and it is the thing that holds Cas9 on target.",
    desc:"The duplex has opened over the twenty bases next to the PAM. The guide RNA lies paired against the lower strand, and the upper strand has been displaced into a loop above it." },

  { s:{land:1, open:1, cut:1, gap:0, off:0, join:0, arms:0, ins:0}, on:["prog","pam","ps","cuts"],
    cap:"held on target, it cuts both strands three bases in from the PAM",
    call:"two nuclease domains, one per strand, and the ends come out blunt",
    note:"Only once the R-loop is complete do the nuclease domains fire. There are two of them and they take one strand each, both of them cutting between the third and fourth base counting back from the PAM. Because both cuts are at the same position, the ends come out blunt. That predictability is worth noticing, and you will use it in a minute: you can write down exactly where the break is going to be from the sequence alone.",
    desc:"Two cut marks appear across the strands, at the same position three bases in from the PAM." },

  { s:{land:1, open:0, cut:0, gap:1, off:1, join:0, arms:0, ins:0}, on:["prog","broke"],
    cap:"and then it lets go, leaving a blunt double-strand break",
    call:"a chromosome in two pieces &#183; this is all Cas9 does",
    note:"Cas9 releases, the loop collapses, and what is left behind is a chromosome in two pieces. That is the entire contribution of the protein. It does not insert anything, it does not repair anything, it does not edit anything. It makes one break in one place. Everything that happens next is the cell's own machinery, and which machinery the cell has is what decides what you get.",
    desc:"Cas9 and the guide have gone. The genome is in two pieces with blunt ends, separated by a gap." },

  { s:{land:1, open:0, cut:0, gap:1, off:1, join:1, arms:0, ins:0}, on:["prog","nhej"],
    cap:"in a plant or an animal cell, the ends get stuck back together badly",
    call:"non-homologous end joining &#183; a few bases lost, the reading frame wrecked, the gene dead",
    note:"In most eukaryotic cells there is a pathway called non-homologous end joining that grabs two free ends and ligates them, and it is not careful: it usually chews or adds a few bases first. That sloppiness is the point. A small insertion or deletion in a coding sequence throws the reading frame out and the gene stops working. So in a mammalian or plant cell, cutting is enough to knock a gene out, and most of what you read about CRISPR knockouts is this.",
    desc:"The two ends have been joined back together, with a small red mark at the junction showing the few bases lost or gained in the process." },

  { s:{land:1, open:0, cut:0, gap:1, off:1, join:0, arms:1, ins:0}, on:["prog","tmpl","hdr"],
    cap:"or hand the cell a template, and it will copy the change in instead",
    call:"two arms of genome sequence, and whatever you want between them",
    note:"The other thing a eukaryotic cell can do with a broken chromosome is repair it properly, off a homologous template, and that is the route you take when you want to put something in rather than just break something. The template is a piece of DNA carrying two arms that match the genome either side of the cut, with your gene between them. Look at the two pictures: the grey stretches are the same sequence top and bottom, and that is the only thing holding the reaction together. In a mammalian cell those arms are usually several hundred bases to a kilobase each. This is a much less efficient route than end joining, which is why getting a knock-IN is harder than getting a knockout.",
    desc:"Above the broken genome, a repair template appears: a length of double-stranded DNA carrying a homology arm, a gene, and a second homology arm. The two arms sit directly above the matching stretches of genome either side of the break, which are marked in the same grey." },

  { s:{land:1, open:0, cut:0, gap:1, off:1, join:0, arms:1, ins:1}, on:["prog","done"],
    cap:"homologous recombination copies it in, and the chromosome is whole",
    call:"the arms pair, the middle comes across, and the break is gone",
    note:"The cell's own recombination machinery pairs the arms with their copies in the chromosome and resolves the whole thing, and what comes across in the middle is your gene. The break is repaired and the edit is made in the same act, which is the thing that makes this worth the trouble. Notice what decided where the gene went: not Cas9, which has been gone for three clicks. The arms did. Cas9 only chose where the break was.",
    desc:"The template has gone and the genome is continuous again, now carrying the gene between the two homology regions." },

  { s:{land:1, open:0, cut:0, gap:1, off:1, join:0, arms:1, ins:1}, on:["prog","done","noneh"],
    cap:"and in <em>E. coli</em> this is the only route, which makes it Datsenko/Wanner",
    call:"no end joining, so an unrepaired break is fatal &#183; repair off the template or die",
    note:"Now put that beside the section we just did. E. coli has essentially no end joining, so the first route does not exist here: hand it a break and it does not repair badly, it dies. Which sounds like a problem and is the trick. It turns the cut into a very strong selection, because the only survivors are the ones that repaired, and the only way to repair is off a template. So this is Datsenko and Wanner with one substitution. There, you made the linear DNA yourself and lambda Red recombined it. Here, Cas9 makes the break and the template rides in on a plasmid, and lambda Red still does the recombining, because the plasmid you buy carries it. The difference is not the chemistry, it is that the cut kills everything that did not take the edit. That is the two plasmid system on the next slide.",
    desc:"The same edited genome, with a note that E. coli has no end-joining pathway, so repair off the template is the only outcome that leaves a living cell." }
];

window.Deck.sequence("cas9", function(slide){
  const s = G.scene(slide, 800, 846);

  /* The labels that come and go rather than move.  They live just above
     the top strand and just below the bottom one, which is the band
     Cas9's two lobes are shaped to leave clear. */
  s.part("pam", G.text(PAM1 + 14, YT - 30, "PAM \u00b7 NGG", 25, C.amber, 700, "start"));
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
  /* The repair template: two arms of genome sequence with whatever you
     want between them.  Blue for the gene is safe here even though Cas9
     is blue, because Cas9 has left the picture three beats earlier; the
     arms are muted because they are not yours, they are copies of the
     chromosome either side of the cut. */
  s.part("tmpl", (function(){
    const g = G.el("g", {});
    g.appendChild(path("M"+(TL0-14)+" "+(MY-20)+"H"+(TR1+14), C.ink, S));
    g.appendChild(path("M"+(TL0-14)+" "+(MY+20)+"H"+(TR1+14), C.ink, S));
    g.appendChild(G.feat(TL0, MY, ARM,  "homology",  C.muted, 62));
    g.appendChild(G.feat(TG0, MY, GENE, "your gene", C.blue,  62));
    g.appendChild(G.feat(TR0, MY, ARM,  "homology",  C.muted, 62));
    g.appendChild(G.text((TL0+TR1)/2, MY - 52, "a repair template, which you supply", 25, C.ink, 700));
    return g;
  })());
  s.part("hdr", G.text(CUT, YB + 74, "the same sequence, top and bottom", 24, C.muted));
  s.part("done", G.text(CUT, YB + 74, "whole again, and carrying your gene", 24, C.blue, 700));
  s.part("noneh", (function(){
    const g = G.el("g", {});
    /* G.text writes textContent, so markup here ships as its own source.
       The captions go through rich() and can take it; this cannot. */
    g.appendChild(G.text(CUT, MY, "E. coli has no end joining at all", 30, C.verm, 700));
    g.appendChild(G.text(CUT, MY + 40, "so nothing survives except the cells that did this", 25, C.muted));
    return g;
  })());
  s.part("prog", G.text(X0, YB + 74, "genome", 25, C.muted, 400, "start"));
  s.finish();

  function paint(v){
    const g = G.el("g", {});
    /* Once the gene is in, the two ends are not apart, they are
       exactly one gene apart and joined by it. */
    const sep = GAPW*v.gap*(1 - v.ins) + (GENE/2)*v.ins;
    const dL = -sep, dR = sep, h = v.open*LOOP;

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
    /* the stretch of genome the template's arms match */
    if (v.arms > 0.02){
      const a = G.el("g", {opacity:n2(v.arms)});
      a.appendChild(G.feat(HL0 + dL, (YT+YB)/2, ARM, "homology", C.muted, 62));
      a.appendChild(G.feat(HR0 + dR, (YT+YB)/2, ARM, "homology", C.muted, 62));
      g.appendChild(a);
    }
    /* and what the cell copies in between them */
    if (v.ins > 0.02){
      const b = G.feat(CUT - GENE/2, (YT+YB)/2, GENE, "your gene", C.blue, 62);
      b.setAttribute("opacity", n2(v.ins)); g.appendChild(b);
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
      g.appendChild(cas9(dy, o));
      g.appendChild(G.text(742, 336 + dy, "Cas9", 30, C.blue, 700));
      /* One RNA.  The spacer is the only part that moves: it lies in
         the protein until the duplex opens and then reaches down to the
         strand it pairs with, while the scaffold stays where it is and
         the molecule stretches between them. */
      const gy = mix(LOBE + 46 + dy, YB - 13, v.open);
      const gx0 = mix(CX - 170, PS0 + dL, v.open);
      const gx1 = mix(CX + 130, PS1 + dR, v.open);
      const sy = SCY + dy;
      g.appendChild(path("M"+n2(gx1)+" "+n2(gy)+"V"+n2(sy+26)+
        "Q"+n2(gx1)+" "+n2(sy)+" "+n2(gx1+34)+" "+n2(sy)+"H"+n2(SCX), C.verm, 3.2));
      g.appendChild(path("M"+n2(gx0)+" "+n2(gy)+"H"+n2(gx1), C.verm, 7));
      g.appendChild(scaffold(SCX, sy));
      if (v.open < 0.3){
        g.appendChild(G.text((gx0+gx1)/2, gy + 34, "spacer \u00b7 the 20 you choose", 22, C.verm, 700));
        g.appendChild(G.text(SCX + 55, sy - 58, "scaffold \u00b7 always the same", 22, C.verm, 700));
      }
    }
    return g;
  }

  return G.run(s, FR, ["land","open","cut","gap","off","join"], paint);
});
})();
