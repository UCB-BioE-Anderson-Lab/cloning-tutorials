/* ------------------------------------------------------------------ *
 * 04-promoter.js — source slides 34 and 35, on a real promoter.
 *
 * The source draws a generic promoter with -35 and -10 marked and then
 * the lac promoter.  Both are fine and neither is the one in their
 * hands, so this is built on J23101, which is the promoter BestP
 * defines as 1 RPU and the one pP6 randomises.  Its 35 bases decompose
 * exactly:
 *
 *   TTTACA              -35 box      consensus TTGACA, one mismatch
 *   GCTAGCTCAGTCCTAGG   17 bp        the canonical spacer length
 *   TATTAT              -10 box      consensus TATAAT, one mismatch
 *   GCTAGC              to the start
 *
 * Which means the slide that explains what a promoter is also explains
 * what their library varies, and hands section 5 the promoter library
 * without a second setup.  A generic figure could not do that.
 *
 * The consensus is written underneath each box with the mismatching
 * base called out, because "how close to consensus" is the whole
 * definition of promoter strength and it is a thing you can see.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

const SIZE = 30, SY = 386;
const SEG = [
{ s:"TTTACA",            col:C.verm,  k:"m35" },
{ s:"GCTAGCTCAGTCCTAGG", col:C.muted, k:"sp"  },
{ s:"TATTAT",            col:C.blue,  k:"m10" },
{ s:"GCTAGC",            col:C.muted, k:"end" }
];
const W  = K.seqWidth(SEG, SIZE), X0 = n1((1600 - W)/2), CW = SIZE*K.CH;
const AT = (function(){
  const a = {}; let x = X0;
  SEG.forEach(function(g){ a[g.k] = [x, x + g.s.length*CW]; x += g.s.length*CW; });
  return a;
})();
const mid = k => (AT[k][0] + AT[k][1])/2;

/* consensus under a box, with the one base that differs marked */
function consensus(k, real, cons, col, u){
  const g = K.grp(u), x = AT[k][0];
  const spans = [];
  for (let i = 0; i < cons.length; i++){
    spans.push({s:cons[i], col:cons[i] === real[i] ? C.muted : C.verm});
  }
  g.appendChild(K.seqStrip(x, SY + 96, spans, SIZE));
  g.appendChild(K.text(mid(k), SY + 132, "consensus", 20, C.muted, 400));
  return g;
}

const FR = [
{ s:{seq:1},
  cap:"J23101 &#8212; thirty-five bases you have been pipetting all semester",
  call:"BestP calls this one 1 RPU &#183; so what makes it a promoter at all?",
  note:"Rather than a generic promoter, here is the one in your freezer box. J23101, thirty-five bases, the reference promoter that BestP defines as one RPU. Everything you measure this week is measured against this sequence. So: what about it is a promoter? Nothing in it binds a small molecule, nothing in it is transcribed. It is a site, and the question is what reads it.",
  desc:"The 35 bases of the J23101 promoter written across the slide." },

{ s:{seq:1, b35:1},
  cap:"the &#8722;35 box",
  call:"consensus is TTGACA &#183; this is one base off",
  note:"The first six bases are the minus thirty-five box, named for sitting about thirty-five bases before the start of transcription. The consensus — the sequence sigma factor likes best — is TTGACA. J23101 has TTTACA. One base different, at position three. Hold that thought.",
  desc:"The first six bases marked as the minus 35 box, with the consensus TTGACA written underneath and the single mismatching base highlighted." },

{ s:{seq:1, b35:1, sp:1},
  cap:"seventeen bases of spacer",
  call:"the <b>length</b> matters &#183; the sequence mostly does not",
  note:"Then seventeen bases of spacer. This is the part people find surprising: the sequence here barely matters, but the length matters a great deal, because the two boxes have to land on the same face of the helix for one protein to touch both. Seventeen is canonical. Sixteen or eighteen and you lose activity; fifteen or twenty and you have effectively no promoter. Nothing is being read here — it is a ruler.",
  desc:"The seventeen bases between the two boxes marked as the spacer, with a note that its length rather than its sequence is what matters." },

{ s:{seq:1, b35:1, sp:1, b10:1},
  cap:"the &#8722;10 box",
  call:"consensus is TATAAT &#183; also one base off &#183; and it is AT-rich for a reason",
  note:"Then the minus ten box. Consensus TATAAT, and J23101 has TATTAT — again one base off. And notice that the consensus is entirely A's and T's. That is not a coincidence. A-T pairs have two hydrogen bonds and G-C pairs have three, so an AT-rich stretch is the cheapest place in the DNA to pull the strands apart, and pulling the strands apart is the next thing that has to happen.",
  desc:"The minus 10 box marked with its consensus TATAAT underneath, the mismatching base highlighted, and the note that it is AT-rich." },

{ s:{seq:1, b35:1, sp:1, b10:1, sig:1},
  cap:"&sigma; reads <b>both</b> boxes at once, and opens the &#8722;10",
  call:"one protein, two contacts, seventeen bases apart",
  note:"Sigma factor is the subunit of RNA polymerase that does the reading, and it reads both boxes at the same time — one protein making two contacts seventeen bases apart, which is why the spacer length is not negotiable. Having bound, the polymerase melts the DNA at the minus ten, where it is cheapest, opens about thirteen bases, and starts transcribing. That is the whole event, and every promoter in this lecture is a variation on it.",
  desc:"Sigma factor drawn contacting both boxes, with the DNA melted open at the minus 10 and transcription starting downstream." },

{ s:{seq:1, b35:1, sp:1, b10:1, sig:1}, on:["str"],
  cap:"so &ldquo;promoter strength&rdquo; is <b>how close the two boxes are to consensus</b>",
  call:"and pP6 is those twelve bases randomised &#8212; that is the whole experiment",
  note:"Which gives you a definition of promoter strength that is a real mechanism and not a number in a table. How well does sigma bind and how readily does the DNA open — and both of those come down to how close the two boxes are to consensus, given a spacer of the right length. Perfect consensus in both boxes gives you about the strongest sigma seventy promoter there is, and that is roughly J23119, the strong reference. J23101 is two bases off consensus and sits in the middle. Now look at what pP6 actually is. It is these twelve bases — six and six — randomised, everything else held constant. You built a library across exactly the variable this slide describes, and BestP measures where each member landed. That is the last section of this lecture, and you have been doing it for two weeks.",
  desc:"The closing point: promoter strength is how closely the two boxes match consensus given a correct spacer, and pP6 randomises exactly those twelve bases." }
];

window.Deck.sequence("promoter", function(slide){
  const s = K.scene(slide, 800, 846);

  const st = K.el("g", {});
  st.appendChild(K.path("M"+n1(AT.m35[0])+" 690H"+n1(AT.m10[1]), C.verm, 3));
  st.appendChild(K.text(800, 728, "pP6 randomises these twelve bases", 27, C.verm, 700));
  st.appendChild(K.text(800, 758, "everything else held constant", 22, C.muted, 400));
  s.part("str", st);
  s.finish();

  function paint(v){
    const g = K.el("g", {});
    if (v.seq > 0.02) g.appendChild(K.seqStrip(X0, SY, SEG, SIZE));

    if (v.b35 > 0.02){
      const a = K.grp(v.b35);
      a.appendChild(K.brace(AT.m35[0], AT.m35[1], SY + 16, "−35", C.verm, 16, 26));
      g.appendChild(a);
      g.appendChild(consensus("m35", "TTTACA", "TTGACA", C.verm, v.b35));
    }
    if (v.sp > 0.02){
      const a = K.grp(v.sp);
      a.appendChild(K.brace(AT.sp[0], AT.sp[1], SY + 16, "17 bp", C.muted, 16, 24));
      a.appendChild(K.text(mid("sp"), SY + 100, "a ruler, not a message",
        22, C.muted, 400));
      g.appendChild(a);
    }
    if (v.b10 > 0.02){
      const a = K.grp(v.b10);
      a.appendChild(K.brace(AT.m10[0], AT.m10[1], SY + 16, "−10", C.blue, 16, 26));
      g.appendChild(a);
      g.appendChild(consensus("m10", "TATTAT", "TATAAT", C.blue, v.b10));
    }

    if (v.sig > 0.02){
      const a = K.grp(v.sig);
      /* one protein, two feet, drawn as a span that reaches both boxes */
      const x0 = mid("m35"), x1 = mid("m10");
      a.appendChild(K.path("M"+n1(x0)+" "+(SY - 44)+
        "C"+n1(x0)+" "+(SY - 130)+" "+n1(x1)+" "+(SY - 130)+" "+n1(x1)+" "+(SY - 44),
        C.blue, 11));
      a.appendChild(K.text((x0 + x1)/2, SY - 116, "σ", 34, C.blue, 700));
      /* No melting bubble over the -10.  Drawn on the strand it covered
         four bases of the box the slide is about, and there is no second
         strand here for it to open -- the sequence is written once. */
      a.appendChild(K.text((x0 + x1)/2, SY - 84,
        "reads both boxes · opens the −10", 21, C.muted, 400));
      a.appendChild(K.arrow([AT.end[1] + 20, SY - 8], [AT.end[1] + 200, SY - 8],
        C.verm, 3, 0, 0));
      a.appendChild(K.text(AT.end[1] + 110, SY - 26, "+1", 22, C.verm, 700));
      g.appendChild(a);
    }
    return g;
  }
  return K.run(s, FR, paint);
});
})();
