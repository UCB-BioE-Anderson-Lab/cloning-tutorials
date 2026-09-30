/* ------------------------------------------------------------------ *
 * 04-lac.js — source slides 25 and 35, which belong together.
 *
 * Slide 25 is a borrowed lac-repressor figure with no text; slide 35 is
 * the lac promoter with a paragraph of notes about its boxes and its
 * operators.  Separately neither is a slide.  Together they are the
 * worked example of the sentence the section is built on -- the boxes
 * set the ceiling, the sites around them set where you sit under it --
 * and they are also the mechanism behind the IPTG the students have
 * been adding since the Chassis lecture without being shown why.
 *
 * The architecture, from the source's own notes: -35 is TTTACA here and
 * -10 is TATGTT, both poor matches to TTGACA and TATAAT.  O1 overlaps
 * the transcription start, O3 sits about eighty bases upstream, and the
 * CAP site is centred near -61.  A LacI tetramer is two dimers, so one
 * molecule reaches O1 and O3 at once and the DNA between them loops --
 * the same trick as AraC on the slide before, which is worth seeing
 * twice because it is how most bacterial repression actually works.
 *
 * AND THE POOR BOXES ARE THE POINT, not a defect.  A promoter already
 * at consensus has nowhere to go up, so a regulated promoter is built
 * weak on purpose and the regulators supply the rest.  That is the
 * cleanest statement of ceiling-versus-operating-point in the deck.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const Y = 452, X0 = 180, X1 = 1420;
const O3 = 380, CAP = 660, M35 = 840, M10 = 1000, O1 = 1130;

function site(x, w, label, col, sub){
  const g = K.el("g", {});
  g.appendChild(K.el("rect", {x:n1(x - w/2), y:Y - 18, width:w, height:36, rx:4,
    fill:C.paper, stroke:"none"}));
  g.appendChild(K.el("rect", {x:n1(x - w/2), y:Y - 18, width:w, height:36, rx:4,
    fill:col, "fill-opacity":".14", stroke:col, "stroke-width":2.4}));
  g.appendChild(K.text(x, Y + 9, label, 22, col, 700));
  if (sub) g.appendChild(K.text(x, Y + 46, sub, 20, C.muted, 400));
  return g;
}
/* The tetramer: two dimers on a hinge.  Drawn as two lobes because what
   matters is that ONE molecule reaches two operators. */
function laci(ax, bx, lift, u){
  const g = K.grp(u), ay = Y - 40 - lift, by = Y - 40 - lift;
  g.appendChild(K.path("M"+n1(ax)+" "+n1(ay)+"L"+n1(bx)+" "+n1(by), C.blue, 10));
  [ax, bx].forEach(function(x){
    g.appendChild(K.el("circle", {cx:n1(x), cy:n1(ay), r:26, fill:C.blue,
      "fill-opacity":".22", stroke:C.blue, "stroke-width":3}));
  });
  g.appendChild(K.mixed((ax + bx)/2, ay - 40, [["Lac", false], ["I", true]],
    25, C.blue, 700));
  g.appendChild(K.text((ax + bx)/2, ay - 16, "one tetramer, two operators",
    19, C.muted, 400));
  return g;
}

const FR = [
{ s:{dna:1, boxes:1},
  cap:"the <em>lac</em> promoter has the same two boxes &#8212; and they are <b>poor</b>",
  call:"TTTACA and TATGTT &#183; both a long way off consensus",
  note:"Here is the lac promoter, and underneath it has exactly the architecture from the last slide: a minus thirty-five, a spacer, a minus ten. What is different is how good they are. The minus thirty-five reads TTTACA and the minus ten reads TATGTT, and both of those are a long way from TTGACA and TATAAT. So on its own this is a weak promoter, and I want you to hold on to that as a feature rather than a fault, because in about four clicks it turns out to be the whole design.",
  desc:"The lac promoter drawn along a DNA line with its minus 35 and minus 10 boxes marked, both noted as poor matches to consensus." },

{ s:{dna:1, boxes:1, ops:1},
  cap:"and three more sites arranged around them",
  call:"O<em>1</em> over the start &#183; O<em>3</em> eighty bases upstream &#183; a CAP site at &#8722;61",
  note:"Now the things built around it. There is an operator, O1, sitting right over the transcription start. There is a second one, O3, about eighty bases upstream. And there is a site for CAP, the catabolite activator protein, centred around minus sixty-one, just before the minus thirty-five. None of these is part of the promoter in the sense of the last slide — nothing here binds sigma factor. They are places for other proteins to stand.",
  desc:"Three further sites added: operator O1 over the transcription start, operator O3 upstream, and a CAP site before the minus 35." },

{ s:{dna:1, boxes:1, ops:1, rep:1, loop:1},
  cap:"no lactose: one Lac<em>I</em> holds <b>both</b> operators",
  call:"and the DNA between them loops &#8212; the same trick AraC just used",
  note:"With no lactose around, LacI binds. And LacI is a tetramer, which is two dimers stuck together, so a single molecule has two DNA-binding faces and it can hold O1 and O3 at the same time. The eighty bases between them loop out. You have seen this exact geometry one slide ago with AraC, and that is not a coincidence — looping is how a great deal of bacterial repression actually works, because it is the cheapest way to make one protein occlude a stretch of DNA much larger than itself. The promoter is inside the loop. It is not weakly on. It is off.",
  desc:"A LacI tetramer bound to both O1 and O3 simultaneously, looping the intervening DNA and leaving the promoter inaccessible." },

{ s:{dna:1, boxes:1, ops:1, iptg:1},
  cap:"add IPTG and it lets go",
  call:"the loop opens &#183; and now the promoter is on &#8212; <b>weakly</b>",
  note:"Add IPTG. It binds LacI, the protein changes shape, its grip on the operators drops, and it comes off. The loop opens and the promoter is now accessible. And here is the thing people are surprised by: it is on, and it is feeble. Those two boxes are still poor matches to consensus, so sigma binds indifferently and you get a trickle. A note on the chemistry — the natural inducer is allolactose, which the cell makes from lactose. IPTG is a synthetic analogue that does the same job and that the cell cannot metabolise, which is why we use it: the concentration stays where you set it.",
  desc:"IPTG binds LacI, which releases both operators so the loop opens, leaving the promoter accessible but weakly active." },

{ s:{dna:1, boxes:1, ops:1, iptg:1, cap:1},
  cap:"CAP is what makes it strong",
  call:"only when glucose is <b>low</b> &#183; so the promoter is an AND gate",
  note:"What makes it strong is CAP. When glucose is scarce the cell's cyclic AMP goes up, CAP binds cyclic AMP, and CAP binds that site at minus sixty-one, where it bends the DNA and makes direct contact with RNA polymerase. Now the polymerase is being actively recruited rather than finding a mediocre pair of boxes on its own, and transcription goes up by a large factor. So read the whole thing: this promoter fires when lactose is present AND glucose is absent. It is an AND gate, built out of two proteins standing near a weak promoter.",
  desc:"CAP bound at its site bends the DNA and recruits RNA polymerase, and the promoter fires strongly, making it an AND gate on lactose and glucose." },

{ s:{dna:1, boxes:1, ops:1, iptg:1, cap:1}, on:["why"],
  cap:"so the weak boxes are the <b>design</b>, not a defect",
  call:"a promoter already at consensus has nowhere to go up",
  note:"And now the sentence from the last slide has a worked example under it. The boxes set the ceiling and the sites around them set where you sit. If you built this promoter with consensus boxes, it would be near its ceiling already and CAP would have almost nothing to add — you would have a strong promoter with a repressor on it and a dynamic range of maybe fivefold. Because the boxes are poor, the gap between fully off and fully on is enormous, and that gap is what regulation is. A regulated promoter is built weak on purpose. That is the trade you are making every time you choose between a constitutive part and an inducible one, and it is why the strongest promoter in a collection is almost never an inducible one.",
  desc:"The closing point: the poor boxes create the dynamic range that regulation needs, so a regulated promoter is deliberately weak." }
];

window.Deck.sequence("lac", function(slide){
  const s = K.scene(slide, 800, 846);

  const w = K.el("g", {});
  w.appendChild(K.path("M330 700H1270", C.muted, 2));
  w.appendChild(K.text(800, 742,
    "the boxes set the ceiling · the sites around them set the range",
    27, C.blue, 700));
  s.part("why", w);
  s.finish();

  function paint(v){
    const g = K.el("g", {});
    const f = K.cl(v.loop, 0, 1);

    /* the molecule, bowing between O3 and O1 as the loop closes */
    const H = 150*f;
    const d = "M"+X0+" "+Y+"H"+n1(O3)+
              "C"+n1(O3 + (O1 - O3)*0.16)+" "+n1(Y - H)+" "+
                  n1(O1 - (O1 - O3)*0.16)+" "+n1(Y - H)+" "+n1(O1)+" "+Y+
              "H"+X1;
    g.appendChild(K.path(d, C.ink, 3.5));

    if (v.boxes > 0.02){
      const a = K.grp(v.boxes);
      a.appendChild(site(M35, 126, "TTTACA", C.verm, "−35"));
      a.appendChild(site(M10, 126, "TATGTT", C.blue, "−10"));
      /* below the boxes, not above them -- the polymerase arrives at
         Y-74 and printed straight over it there */
      a.appendChild(K.text((M35 + M10)/2, Y + 78, "both poor", 21, C.muted, 400));
      g.appendChild(a);
    }
    if (v.ops > 0.02){
      const a = K.grp(v.ops);
      a.appendChild(site(O3, 96, "O3", C.muted, null));
      a.appendChild(site(O1, 96, "O1", C.muted, null));
      /* "CAP site", not "CAP": the protein that binds it is also
         drawn, also labelled, and two things called CAP is one thing. */
      a.appendChild(site(CAP, 138, "CAP site", C.amber, "−61"));
      g.appendChild(a);
    }

    /* LacI: on both operators while looped, gone once IPTG is in */
    if (v.rep > 0.02) g.appendChild(laci(O3, O1, H*0.78, v.rep));

    if (v.iptg > 0.02){
      const a = K.grp(v.iptg);
      /* the released tetramer, off the molecule and carrying IPTG */
      const lx = 420, ly = 250;
      a.appendChild(K.path("M"+lx+" "+ly+"h84", C.blue, 10));
      [lx, lx + 84].forEach(function(x){
        a.appendChild(K.el("circle", {cx:x, cy:ly, r:26, fill:C.blue,
          "fill-opacity":".22", stroke:C.blue, "stroke-width":3}));
      });
      [[lx, -6], [lx + 84, 4]].forEach(function(q){
        a.appendChild(K.el("circle", {cx:q[0] + q[1], cy:ly + 4, r:8,
          fill:C.amber, stroke:"none"}));
      });
      a.appendChild(K.mixed(lx + 42, ly - 44, [["Lac", false], ["I", true]],
        24, C.blue, 700));
      a.appendChild(K.text(lx + 42, ly + 52, "+ IPTG — released", 22, C.amber, 700));
      g.appendChild(a);
    }

    /* the polymerase, and how hard it is working */
    if (v.iptg > 0.02){
      const on = v.cap > 0.5;
      const a = K.grp(v.iptg);
      a.appendChild(K.el("ellipse", {cx:(M35 + M10)/2, cy:Y - 74, rx:96, ry:34,
        fill:on ? C.verm : C.muted, "fill-opacity":on ? ".18" : ".10",
        stroke:on ? C.verm : C.muted, "stroke-width":3}));
      a.appendChild(K.text((M35 + M10)/2, Y - 66, "RNAP", 22,
        on ? C.verm : C.muted, 700));
      a.appendChild(K.arrow([O1 + 60, Y - 42], [O1 + (on ? 250 : 130), Y - 42],
        on ? C.verm : C.muted, on ? 4 : 2.4, 0, 0));
      a.appendChild(K.text(O1 + 150, Y - 62, on ? "strongly on" : "weakly on",
        22, on ? C.verm : C.muted, 700, "start"));
      g.appendChild(a);
    }
    if (v.cap > 0.02){
      const a = K.grp(v.cap);
      a.appendChild(K.el("ellipse", {cx:CAP, cy:Y - 54, rx:56, ry:30,
        fill:C.amber, "fill-opacity":".22", stroke:C.amber, "stroke-width":3}));
      a.appendChild(K.text(CAP, Y - 46, "CAP", 22, C.amber, 700));
      a.appendChild(K.text(CAP, Y - 98, "only when glucose is low", 20, C.muted, 400));
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
