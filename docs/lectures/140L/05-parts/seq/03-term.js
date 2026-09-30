/* ------------------------------------------------------------------ *
 * 03-term.js — source slide 32, which is four bullets and no picture.
 *
 * This section's whole thesis is that RNA parts work by folding and
 * that folding is not local.  The terminator slide asserted exactly
 * that and drew nothing, in the one section where a hairpin is the
 * argument rather than an illustration.  So it gets the hairpin.
 *
 * The mechanism, and the reason the two halves of an intrinsic
 * terminator are BOTH necessary: the GC-rich stem forms in the emerging
 * transcript and stalls the polymerase, and the run of U's behind it
 * leaves the RNA held to the template by rU:dA pairs, which are the
 * weakest base pairs there are.  Stall plus weak grip equals release.
 * Either half alone does nothing much, which is the thing a bulleted
 * list cannot show and a drawing can.
 *
 * And the last beat is the one that costs people constructs: a
 * terminator is a probability, not a full stop, so a weak one leaks and
 * the gene behind it is on when nobody asked for it.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

/* THE POLYMERASE HOLDS THE HYBRID, so it is drawn big enough to span
   from the transcript down to the template and the U:A pairs sit INSIDE
   it.  The first version put a small ellipse beside the pairing, which
   left the transcript, the template and the enzyme as three unrelated
   objects and the rU:dA pairs as dashes crossing open space. */
const DY = 604, X0 = 200, X1 = 1400;   /* the template                  */
const RY = 418;                        /* the transcript                */
const A = 520, B = 790;                /* the stem, in the transcript   */
const UX = 800, UW = 128;              /* the U run, and the A run      */
const PX = 864, PY = 511;              /* the polymerase, over both     */
const HMAX = 132, SEPMAX = 22;

function legs(f){
  const H = HMAX*f, sep = SEPMAX*f, apex = RY - H, mid = (A + B)/2;
  return { apex:apex, sep:sep, L:[[A, RY], [mid - sep, apex]],
           R:[[mid + sep, apex], [B, RY]] };
}
const along = (p, t) => [p[0][0] + (p[1][0] - p[0][0])*t,
                         p[0][1] + (p[1][1] - p[0][1])*t];

/* the polymerase: one body reaching from the transcript to the template */
function pol(dx, u){
  const g = K.grp(u);
  g.appendChild(K.el("ellipse", {cx:PX + dx, cy:PY, rx:128, ry:106,
    fill:C.blue, "fill-opacity":".10", stroke:C.blue, "stroke-width":3}));
  g.appendChild(K.text(PX + dx, DY + 76, "RNAP", 23, C.blue, 700));
  return g;
}

const FR = [
{ s:{rna:1},
  cap:"a polymerase does not stop on its own",
  call:"something has to make it let go",
  note:"Transcription elongation is processive — a polymerase that has started will keep going for thousands of bases, and nothing about running off the end of a gene makes it stop. Something has to actively make it let go, and the sequence that does that is a terminator. Here is the polymerase, the template it is copying, and the transcript coming out of it.",
  desc:"RNA polymerase on a DNA template with a transcript emerging, with nothing yet to stop it." },

{ s:{rna:1, seq:1},
  cap:"the terminator is transcribed like anything else",
  call:"a GC-rich inverted repeat, then a run of A&rsquo;s on the template",
  note:"The terminator is just sequence, and the polymerase copies it like everything else. Two things are in it. First an inverted repeat that is unusually rich in G and C — a stretch, then the same stretch backwards. Then, right after it, a run of A's on the template strand, which the polymerase copies into a run of U's in the transcript. Neither of those does anything at the DNA level. They only matter once they are RNA.",
  desc:"The terminator sequence marked in the emerging transcript: a GC-rich inverted repeat followed by a run of uracils." },

{ s:{rna:1, seq:1, fold:1},
  cap:"the repeat folds back on itself the moment it is out",
  call:"GC-rich, so the stem is <b>strong</b> &#183; and the polymerase stalls",
  note:"The inverted repeat pairs with itself as soon as it clears the polymerase, and because it is GC-rich — three hydrogen bonds a pair rather than two — the stem is strong and it forms fast. A hairpin forming right at the polymerase's exit channel jams it, and the polymerase stalls. That is the first half.",
  desc:"The inverted repeat folds into a GC-rich hairpin at the polymerase's exit, stalling it." },

{ s:{rna:1, seq:1, fold:1, us:1},
  cap:"and what is left holding the transcript on is a run of rU:dA",
  call:"the <b>weakest</b> base pairs there are",
  note:"And the second half is what is holding the transcript to the template at that moment. It is the run of U's, paired with the A's on the template, and rU to dA is the weakest base pairing in the cell — weaker than a DNA A-T pair. So you have a stalled polymerase whose transcript is attached by the flimsiest grip available. Both halves are necessary. A hairpin with no U run stalls the polymerase and it recovers and carries on; a U run with no hairpin never stalls it in the first place.",
  desc:"The run of uracils in the transcript paired to the template's adenines, marked as the weakest base pairs available." },

{ s:{rna:1, seq:1, fold:1, us:1, rel:1},
  cap:"so it lets go",
  call:"stall + weak grip = release &#183; no protein needed anywhere",
  note:"So it lets go. The transcript comes off, the polymerase comes off, and the whole thing happened with no protein involved other than the polymerase itself, which is why this is called intrinsic termination. There is a second mechanism, Rho-dependent, where a protein called Rho loads onto the transcript and chases the polymerase down, and you meet that one mostly as a thing that terminates transcription you did not want terminated.",
  desc:"The transcript and the polymerase both released from the template." },

{ s:{rna:1, seq:1, fold:1, us:1, rel:1}, on:["prob"],
  cap:"and it is a <b>probability</b>, not a full stop",
  call:"read-through past a weak terminator is why a downstream gene is on",
  note:"Last thing, and it is the one that will cost you a construct. A terminator is not a full stop. It is a probability, and a good one might be ninety-eight per cent efficient and a mediocre one sixty. Whatever gets past keeps transcribing, into whatever you put next. So a gene downstream of a weak terminator is expressed, at a low level, that you did not ask for and did not design. And because the stem has to fold, the efficiency you looked up was measured in some other context — change what is around it and the number moves. Same lesson as the ribosome binding site, and for the same reason. Everything on this level has it.",
  desc:"The closing point: termination is a probability, so read-through past a weak terminator expresses the gene behind it, and the efficiency is context dependent." }
];

window.Deck.sequence("term", function(slide){
  const s = K.scene(slide, 800, 846);

  const p = K.el("g", {});
  p.appendChild(K.path("M330 690H1270", C.muted, 2));
  p.appendChild(K.text(800, 732,
    "and it folds, so the efficiency you looked up was measured somewhere else",
    25, C.verm, 700));
  s.part("prob", p);
  s.finish();

  function paint(v){
    const g = K.el("g", {});
    const f = K.cl(v.fold, 0, 1), gone = K.cl(v.rel, 0, 1);

    /* the template, always */
    g.appendChild(K.dna(X0, X1, DY, C.ink, 3.5));
    g.appendChild(K.text(X0 - 16, DY + 9, "template", 23, C.muted, 400, "end"));

    /* the polymerase UNDER everything, so the hybrid reads as being
       held inside it rather than drawn over it */
    g.appendChild(pol(gone*150, 1 - gone*0.72));

    /* the run of A's it is copying */
    if (v.seq > 0.02){
      const a = K.grp(v.seq);
      a.appendChild(K.feat(UX, DY, UW, "AAAAAA", C.amber, 30, 21));
      g.appendChild(a);
    }

    /* the transcript: flat, then folded, then lifting away */
    const tr = K.grp(v.rna * (1 - gone*0.15));
    if (gone > 0.02) tr.setAttribute("transform",
      "translate(" + n1(-120*gone) + " " + n1(-96*gone) + ")");
    const k = legs(f);
    tr.appendChild(K.path("M"+n1(X0 + 60)+" "+RY+"H"+n1(A)+
      "L"+n1(k.L[1][0])+" "+n1(k.L[1][1])+
      "A"+n1(k.sep + 1)+" "+n1(k.sep + 1)+" 0 0 1 "+
        n1(k.R[0][0])+" "+n1(k.R[0][1])+
      "L"+n1(B)+" "+n1(RY)+"H"+n1(UX + UW), C.blue, 3.5));
    tr.appendChild(K.text(X0 + 44, RY + 9, "transcript", 23, C.blue, 700, "end"));
    if (f > 0.35){
      const q = K.grp((f - 0.35)/0.65);
      [0.34, 0.52, 0.7, 0.86].forEach(function(t){
        const l = along(k.L, t), r = along(k.R, 1 - t);
        q.appendChild(K.path("M"+n1(l[0])+" "+n1(l[1])+"L"+n1(r[0])+" "+n1(r[1]),
          C.verm, 2.4));
      });
      q.appendChild(K.text((A + B)/2, k.apex - 26, "GC-rich stem", 22, C.verm, 700));
      tr.appendChild(q);
    }
    if (v.seq > 0.02 && f < 0.35)
      tr.appendChild(K.brace(A, B, RY + 14, "inverted repeat", C.verm, 14, 21));
    if (v.us > 0.02){
      const a = K.grp(v.us);
      a.appendChild(K.feat(UX, RY, UW, "UUUUUU", C.amber, 30, 21));
      tr.appendChild(a);
    }
    g.appendChild(tr);

    /* The pairs to the template.  NOT inside the transcript group: when
       the transcript lifts away there is nothing left to pair with, so
       these fade out rather than travelling with it and dangling. */
    if (v.us > 0.02 && gone < 0.98){
      const q = K.grp(v.us * (1 - gone));
      for (let i = 0; i < 5; i++){
        const x = UX + 18 + i*24;
        q.appendChild(K.path("M"+n1(x)+" "+(RY + 18)+"V"+(DY - 18), C.amber, 2, "3 7"));
      }
      q.appendChild(K.text(UX + UW + 150, (RY + DY)/2 + 8,
        "rU:dA — the weakest pairing there is", 22, C.amber, 700, "start"));
      g.appendChild(q);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
