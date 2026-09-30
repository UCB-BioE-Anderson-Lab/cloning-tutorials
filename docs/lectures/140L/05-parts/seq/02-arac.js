/* ------------------------------------------------------------------ *
 * 02-arac.js — source slide 26, "Example: Pbad Promoter".
 *
 * The source's three bullets are the whole idea and it draws none of it:
 * some transcription factors only activate, some only repress, and AraC
 * does both.  AraC doing both is not a quirk to note in passing -- it is
 * a mechanism, and it is the one the students have already used without
 * being told how it works, because the Chassis deck's trace exercise has
 * lambda Red gated on arabinose.
 *
 * The mechanism is Schleif's light-switch model.  Without arabinose an
 * AraC dimer bridges araO2 and araI1, which are about 210 bases apart,
 * and the DNA between them loops out; the promoter is occluded and off.
 * Arabinose binding changes the dimer's preferred geometry so it lets go
 * of araO2 and sits on araI1 and araI2, which are adjacent; the loop
 * opens and the dimer now contacts polymerase and recruits it.
 *
 * So the same protein is the repressor and the activator, and which one
 * it is depends on a small molecule.  That is a better answer to "what
 * is a transcription factor for" than any list of them.
 *
 * THE LOOP IS DRAWN AS A LOOP.  A bent line with a protein on it is the
 * figure every textbook uses and it is the reason nobody remembers that
 * repression here is steric rather than chemical.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const Y = 408, X0 = 200, X1 = 1400;
/* site positions along the molecule, left to right: araO2 is far
   upstream, then araI1 and araI2 adjacent, then the promoter */
const O2 = 360, I1 = 900, I2 = 1010, PB = 1130;

function site(x, label, col, u){
  const g = K.grp(u);
  g.appendChild(K.el("rect", {x:n1(x - 46), y:Y - 17, width:92, height:34, rx:4,
    fill:C.paper, stroke:"none"}));
  g.appendChild(K.el("rect", {x:n1(x - 46), y:Y - 17, width:92, height:34, rx:4,
    fill:col, "fill-opacity":".14", stroke:col, "stroke-width":2.4}));
  g.appendChild(K.mixed(x, Y + 8, [["ara", true], [label, false]], 21, col, 700));
  return g;
}
/* The AraC dimer: two lobes on a short hinge.  Its shape does not change
   between the two states -- what changes is which pair of sites the two
   lobes are sitting on, which is the actual mechanism. */
function dimer(ax, ay, bx, by, u){
  const g = K.grp(u);
  g.appendChild(K.path("M"+n1(ax)+" "+n1(ay)+"L"+n1(bx)+" "+n1(by), C.blue, 9));
  [[ax, ay], [bx, by]].forEach(function(p){
    g.appendChild(K.el("circle", {cx:n1(p[0]), cy:n1(p[1]), r:27,
      fill:C.blue, "fill-opacity":".22", stroke:C.blue, "stroke-width":3}));
  });
  g.appendChild(K.text((ax + bx)/2, Math.min(ay, by) - 40, "AraC", 25, C.blue, 700));
  return g;
}

const FR = [
{ s:{dna:1},
  cap:"the arabinose promoter, and the three places a protein sits on it",
  call:"ara<em>I1</em> and ara<em>I2</em> are next to each other &#183; ara<em>O2</em> is 210 bases upstream",
  note:"This is the region in front of the arabinose operon. Three binding sites and a promoter. Two of the sites, araI1 and araI2, sit right next to each other just upstream of where transcription starts. The third, araO2, is about two hundred and ten bases further upstream, which is a long way in this picture and a long way in the cell. Hold on to that distance, because it is the mechanism.",
  desc:"The arabinose promoter region drawn along a DNA line, with araO2 far upstream and araI1, araI2 and the promoter grouped downstream." },

{ s:{dna:1, loop:1, arac:1},
  cap:"with no arabinose, one AraC dimer holds <b>both</b> distant sites",
  call:"and the DNA between them loops out &#183; the promoter is off",
  note:"With no arabinose around, a single AraC dimer grabs araO2 with one half and araI1 with the other. The only way one protein can touch two sites two hundred bases apart is for the DNA between them to bend round into a loop, and that is exactly what happens. The promoter is inside that loop, and it is off. Notice what is doing the repressing: not a chemical modification, not a competition for the polymerase. Geometry. The promoter is off because the DNA has been folded.",
  desc:"With no arabinose, an AraC dimer bridges araO2 and araI1, looping the intervening DNA and leaving the promoter inaccessible." },

/* arac has to be in EVERY frame from here on.  It was dropped from the
   next two, so on the beat where arabinose binds the protein it binds
   to was not drawn at all -- three amber dots floating over bare DNA --
   and the caption said the dimer had let go of araO2 while no dimer was
   on the slide.  A missing key in run() counts as zero, which is how a
   frame can be internally wrong and still settle correctly. */
{ s:{dna:1, arac:1, ara:1, both:1},
  cap:"arabinose binds, and the dimer moves to ara<em>I1</em> and ara<em>I2</em>",
  call:"the loop opens &#183; and it is now <b>beside</b> the promoter, not across it",
  note:"Now add arabinose. It binds AraC, and the bound protein prefers a different arrangement: it lets go of araO2 and puts both halves on the two adjacent sites instead. The loop opens — that is the whole conformational story, and it is why Schleif called it the light switch model. And look where the protein has ended up. It has not left. It is sitting on araI1 and araI2, immediately beside the promoter.",
  desc:"Arabinose binds AraC, which releases araO2 so the loop opens, and the dimer moves onto the adjacent araI1 and araI2 sites beside the promoter." },

{ s:{dna:1, arac:1, ara:1, both:1, pol:1},
  cap:"and from there it <b>recruits</b> the polymerase",
  call:"no longer in the way &#8212; now doing the pulling",
  note:"From there it contacts RNA polymerase and helps it bind. It is no longer in the way; it is doing the recruiting. The promoter fires, and in the Genome Editing procedure you ran, that is the moment lambda Red switches on.",
  desc:"The AraC dimer beside the promoter recruits RNA polymerase and transcription begins." },

{ s:{dna:1, arac:1, ara:1, both:1, pol:1}, on:["three"],
  cap:"the same protein was the repressor and the activator",
  call:"nothing about it was replaced &#8212; a sugar changed which two sites it prefers",
  note:"And that is the point of the slide. The same protein was the repressor a moment ago and is the activator now, and nothing about it was replaced — a small molecule changed which pair of sites it prefers. So when you meet a transcription factor, do not ask whether it is a repressor or an activator as though that were a property of the protein. LacI only represses. CAP only activates. AraC does both, depending on what is in the medium. What a transcription factor does is bind DNA at particular places, and whether that helps or hinders depends entirely on where those places are relative to the promoter.",
  desc:"The closing comparison: LacI only represses, CAP only activates, and AraC does both depending on arabinose." }
];

window.Deck.sequence("arac", function(slide){
  const s = K.scene(slide, 800, 846);

  const t = K.el("g", {});
  [["Lac", "I", "represses, and only represses", C.muted],
   ["CAP", "", "activates, and only activates", C.muted],
   ["AraC", "", "both — the medium decides which", C.verm]].forEach(function(r, i){
    const y = 620 + i*42;
    t.appendChild(K.mixed(700, y, [[r[0], false], [r[1], true]], 25, r[3], 700, "end"));
    t.appendChild(K.text(724, y, r[2], 24, r[3], r[3] === C.verm ? 700 : 400, "start"));
  });
  s.part("three", t);
  s.finish();

  function paint(v, f){
    const g = K.el("g", {});
    const bend = K.cl(v.loop, 0, 1);

    /* The molecule.  Between araO2 and araI1 it bows upward as the loop
       closes; everywhere else it is flat.  A cubic whose two controls
       are pushed up by the same amount keeps both feet on the line. */
    const H = 190*bend;
    const d = "M"+X0+" "+Y+"H"+n1(O2)+
              "C"+n1(O2 + (I1 - O2)*0.18)+" "+n1(Y - H)+" "+
                  n1(I1 - (I1 - O2)*0.18)+" "+n1(Y - H)+" "+n1(I1)+" "+Y+
              "H"+X1;
    g.appendChild(K.path(d, C.ink, 3.5));

    g.appendChild(site(O2, "O2", C.muted, v.dna));
    g.appendChild(site(I1, "I1", C.muted, v.dna));
    g.appendChild(site(I2, "I2", C.muted, v.dna));
    /* the promoter reads rightward, so it is the arrow-ended feature */
    if (v.dna > 0.02){
      const p = K.grp(v.dna);
      p.appendChild(K.featArrow(PB - 46, Y, 150, "Pbad", C.blue, 34, 22));
      p.appendChild(K.text(PB + 30, Y + 54, "araB, araA, araD", 21, C.muted, 400));
      g.appendChild(p);
    }

    /* AraC.  Two states, and it is ONE object that moves between them,
       so the lobe that was on araO2 is the lobe that ends up on araI2. */
    if (v.arac > 0.02 || v.both > 0.02){
      const u = Math.max(v.arac, v.both);
      const t = K.cl(v.both, 0, 1);
      const ax = O2 + (I2 - O2)*t, ay = Y - 46 - (H*0.72)*(1 - t);
      const bx = I1, by = Y - 46;
      g.appendChild(dimer(ax, ay, bx, by, u));
    }

    /* arabinose, as three dots on the protein once it is bound */
    if (v.ara > 0.02){
      const a = K.grp(v.ara);
      [[-12, -16], [10, -20], [0, 2]].forEach(function(q){
        a.appendChild(K.el("circle", {cx:n1(I2 + q[0]), cy:n1(Y - 46 + q[1]), r:7,
          fill:C.amber, stroke:"none"}));
      });
      /* To the RIGHT of the dimer and clear of it.  Above the dots it
         printed on top of the AraC label, which sits just under the
         protein and moves with it. */
      a.appendChild(K.text(I2 + 96, Y - 84, "arabinose", 23, C.amber, 700, "start"));
      g.appendChild(a);
    }

    if (v.pol > 0.02){
      const p = K.grp(v.pol);
      p.appendChild(K.el("ellipse", {cx:PB - 40, cy:Y - 54, rx:52, ry:32,
        fill:C.verm, "fill-opacity":".16", stroke:C.verm, "stroke-width":3}));
      p.appendChild(K.text(PB - 40, Y - 46, "RNAP", 21, C.verm, 700));
      p.appendChild(K.arrow([PB + 40, Y - 84], [PB + 250, Y - 84], C.verm, 3, 0, 0));
      p.appendChild(K.text(PB + 145, Y - 96, "transcription", 22, C.verm, 700));
      g.appendChild(p);
    }

    /* the state, said once, where the promoter is */
    if (v.dna > 0.02){
      const on = v.pol > 0.5;
      g.appendChild(K.text(PB + 30, Y + 96, on ? "ON" : "OFF", 30,
        on ? C.verm : C.muted, 700));
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
