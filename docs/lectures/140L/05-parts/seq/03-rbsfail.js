/* ------------------------------------------------------------------ *
 * 03-rbsfail.js — the question this section opens on.
 *
 * Not in the source.  Source slide 28's speaker notes say the quiet part
 * -- "how best to describe RBS sequences as Parts remains a topic of
 * discussion" -- and then slide 48, twenty slides later, gives the
 * reason.  Those two belong together and neither is a slide, so the
 * problem is posed as a failure instead.
 *
 * It is the deck's shape again: the wrong conclusion is not an error,
 * it is a plausible result.  Everything checks out.  The sequence is
 * right, the clone is verified, the promoter is the one that worked
 * last week, and the messenger is being made.  The construct is dead,
 * and nothing you can see by reading the sequence of the RBS will tell
 * you why -- because the cause is a hundred bases downstream of it.
 *
 * THE HAIRPIN IS DRAWN.  Saying "secondary structure sequesters the
 * Shine-Dalgarno" is a sentence people nod at; a loop closing over the
 * site while the ribosome sits there unable to load is the thing they
 * remember, and it is the same excision-style move the Chassis kit uses
 * for Flp.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const MX0 = 210, MX1 = 1390;
const YA = 330, YB = 560;            /* the two messengers              */
const SD = 470, ATG = 640;           /* where the sites sit on them     */
/* The stem's right foot lands just INSIDE the coding sequence, because
   that is what the mechanism is: the RBS pairs with the first stretch
   of the new gene.  So the coding sequence is drawn first and the
   molecule over it, and the right leg visibly crosses the front of the
   box rather than stopping politely before it. */

/* ------------------------------------------------------------------ *
 * THE HAIRPIN IS A STEM-LOOP, NOT AN ARCH.
 *
 * The first version drew the folded region as a single bowed line with
 * base-pair ticks under it.  A bowed line has nothing to pair WITH, so
 * the ticks floated in the middle of the arch joining nothing, and the
 * Shine-Dalgarno sat beside the bulge rather than inside it -- which is
 * the one thing the slide has to show.
 *
 * So the folded region is two legs rising to a small cap: the molecule
 * doubles back on itself, the rungs run between the two legs, and the
 * RBS rides up the left leg into the middle of the stem, where it is
 * double-stranded and a ribosome cannot touch it.  At f = 0 the legs
 * lie flat on the line and the whole thing is the unfolded messenger,
 * so one function draws both states and the beats tween between them.
 * ------------------------------------------------------------------ */
const A = 430, B = 720, MID = (A + B)/2, HMAX = 150, SEPMAX = 24;

function legs(y, f){
  const H = HMAX*f, sep = SEPMAX*f, apex = y - H;
  return { apex:apex, sep:sep,
           L:[[A, y], [MID - sep, apex]],
           R:[[MID + sep, apex], [B, y]] };
}
/* a point a fraction t up a leg */
function along(p, t){
  return [p[0][0] + (p[1][0] - p[0][0])*t, p[0][1] + (p[1][1] - p[0][1])*t];
}

/* Split in two, and drawn on either side of the features.  Drawn as one
   path AFTER them, the molecule ran straight through the middle of the
   words GFP and "your gene"; drawn entirely before them, the stem's
   right leg disappeared behind the coding sequence it is supposed to be
   pairing with.  So: the flat molecule, then the features on their
   paper, then the stem over the top of them. */
function backbone(y, u, lab, labCol){
  const g = K.grp(u);
  g.appendChild(K.path("M"+MX0+" "+y+"H"+MX1, C.ink, 3.5));
  g.appendChild(K.text(MX0 - 16, y + 9, lab, 25, labCol || C.ink, 700, "end"));
  return g;
}
function stem(y, fold, u){
  const f = K.cl(fold, 0, 1);
  if (f < 0.04) return null;
  const g = K.grp(u), k = legs(y, f);
  g.appendChild(K.path("M"+n1(A)+" "+n1(y)+
    "L"+n1(k.L[1][0])+" "+n1(k.L[1][1])+
    "A"+n1(k.sep + 1)+" "+n1(k.sep + 1)+" 0 0 1 "+
      n1(k.R[0][0])+" "+n1(k.R[0][1])+
    "L"+n1(B)+" "+n1(y), C.ink, 3.5));
  if (f > 0.35){
    const p = K.grp((f - 0.35)/0.65);
    [0.34, 0.52, 0.7, 0.86].forEach(function(t){
      const l = along(k.L, t), r = along(k.R, 1 - t);
      p.appendChild(K.path("M"+n1(l[0])+" "+n1(l[1])+"L"+n1(r[0])+" "+n1(r[1]),
        C.blue, 2.4));
    });
    g.appendChild(p);
  }
  return g;
}
/* The Shine-Dalgarno rides UP THE LEFT LEG as the stem closes, which is
   the whole mechanism: at the end it is in the middle of a duplex. */
function sdMark(y, fold, u){
  const g = K.grp(u), f = K.cl(fold, 0, 1);
  const p = along(legs(y, f).L, 0.58*f);
  const x = SD + (p[0] - SD)*f, yy = y + (p[1] - y);
  g.appendChild(K.feat(x - 62, yy, 124, "B0034", C.amber, 30, 22));
  return g;
}
/* A ribosome, either loaded on the site or sitting off it. */
function ribo(x, y, ok, u){
  const g = K.grp(u), col = ok ? C.blue : C.muted;
  g.appendChild(K.el("ellipse", {cx:x, cy:y - 46, rx:56, ry:34,
    fill:col, "fill-opacity":".16", stroke:col, "stroke-width":3}));
  g.appendChild(K.el("ellipse", {cx:x, cy:y - 82, rx:38, ry:22,
    fill:col, "fill-opacity":".16", stroke:col, "stroke-width":3}));
  g.appendChild(K.text(x, y - 38, "30S", 20, col, 700));
  return g;
}

const FR = [
{ s:{a:1},
  cap:"B0034 in front of GFP gave you a bright strain last week",
  call:"same promoter, same RBS, new coding sequence &#8212; and nothing",
  note:"Here is a thing that will happen to you. You have a construct that works: a promoter, the ribosome binding site B0034, and GFP, and it is bright. This week you keep the promoter and keep the RBS and swap in a different coding sequence, because that is what parts are for. And you get nothing. No protein at all.",
  desc:"Two messenger RNAs drawn as lines, the first carrying B0034 in front of GFP and working." },

{ s:{a:1, b:1},
  cap:"and everything checks out",
  call:"sequence verified &#183; right plasmid &#183; the mRNA is there",
  note:"So you check. The clone sequence-verifies — the RBS is base for base what it should be, the promoter is intact, the junctions are clean. It is the right plasmid in the right strain. And if you go and measure the messenger, the messenger is there, at about the level you would expect. Transcription happened. Translation did not. Two minutes: what is left?",
  desc:"The second messenger, with the same promoter and the same ribosome binding site but a different coding sequence, verified correct and producing no protein." },

{ s:{a:1, b:1, rib:1},
  cap:"the ribosome cannot load",
  call:"and the RBS is the sequence it is supposed to load <b>on</b>",
  note:"What is left is the ribosome, and the ribosome cannot load. Which sounds impossible, because the thing a ribosome loads onto is the ribosome binding site, and the ribosome binding site is exactly, letter for letter, the one that worked.",
  desc:"A ribosome drawn beside the second messenger, unable to load." },

{ s:{a:1, b:1, rib:1, fold:1},
  cap:"because the site is <b>inside a hairpin</b>",
  call:"and the other half of that hairpin is in the new coding sequence",
  note:"Here is the answer. The messenger folds. Part of the new coding sequence is complementary to the region around the ribosome binding site, so the two pair up and the site is buried in a stem. A ribosome cannot load onto double-stranded RNA. Nothing is wrong with the RBS. Nothing is wrong with the CDS either — it is a perfectly good gene. What is wrong is the combination, and neither sequence contains the fault.",
  desc:"The second messenger folds into a hairpin that sequesters the Shine-Dalgarno sequence inside a double-stranded stem." },

{ s:{a:1, b:1, rib:1, fold:1}, on:["rule"],
  cap:"so the strength of an RBS is <b>not a property of the RBS</b>",
  call:"it is a property of the RBS and the hundred bases after it, together",
  note:"And that is the rule, and it is the most important thing in this section. The strength of a ribosome binding site is not a property of the ribosome binding site. It is a property of that sequence together with whatever follows it, because what matters is how the messenger folds, and folding is not local. Which is a problem for the entire idea of a part, because a part is supposed to be a thing whose behaviour you can look up. Look up B0034 in a registry and you get a number, and that number was measured in front of some other gene. Hold that, because in about three slides there is a published experiment that measures exactly how bad this is, and it is worse than you would guess.",
  desc:"The rule: the strength of a ribosome binding site is a property of the site together with the sequence downstream of it, not of the site alone." }
];

window.Deck.sequence("rbsfail", function(slide){
  const s = K.scene(slide, 800, 846);

  const r = K.el("g", {});
  r.appendChild(K.path("M300 684H1300", C.muted, 2));
  r.appendChild(K.text(800, 730, "a part whose behaviour you cannot look up", 28, C.verm, 700));
  s.part("rule", r);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    if (v.a > 0.02){
      g.appendChild(backbone(YA, v.a, "works", C.blue));
      g.appendChild(K.featArrow(ATG, YA, 320, "GFP", C.blue, 30, 22));
      g.appendChild(sdMark(YA, 0, v.a));
      g.appendChild(K.text(MX1, YA - 34, "bright", 23, C.blue, 700, "end"));
    }
    if (v.b > 0.02){
      g.appendChild(backbone(YB, v.b, "dead", C.verm));
      g.appendChild(K.featArrow(ATG, YB, 320, "your gene", C.verm, 30, 22));
      const st = stem(YB, v.fold, v.b);
      if (st) g.appendChild(st);
      g.appendChild(sdMark(YB, v.fold, v.b));
      g.appendChild(K.text(MX1, YB - 34, "nothing", 23, C.verm, 700, "end"));
    }
    if (v.rib > 0.02){
      /* on the working messenger it is loaded on the site; on the dead
         one it is beside the site and stays there */
      g.appendChild(ribo(SD, YA, true, v.rib));
      g.appendChild(ribo(SD - 170, YB, false, v.rib));
    }
    if (v.fold > 0.4){
      const a = K.grp((v.fold - 0.4)/0.6);
      a.appendChild(K.text(1000, YB - 132,
        "the stem is the RBS paired with the new CDS",
        22, C.blue, 700, "start"));
      a.appendChild(K.text(1000, YB - 104,
        "and a ribosome cannot load on a duplex", 21, C.muted, 400, "start"));
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
