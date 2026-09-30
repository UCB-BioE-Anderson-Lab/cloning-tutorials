/* ------------------------------------------------------------------ *
 * 03-kudla.js — source slide 52, with its cause corrected.
 *
 * The source titles it "Codon variants" and says a 250-fold range of
 * expression comes from different encodings of the same protein.  The
 * number is right and the title points at the wrong cause.  It is
 * Kudla, Murray, Tollervey and Plotkin, Science 2009, 324:255,
 * PMID 19359587, and the finding of that paper is that codon bias did
 * NOT correlate with expression -- the stability of mRNA folding near
 * the ribosome binding site explained more than half the variance.
 *
 * Which makes it the same fact as the exercise that opened this
 * section, and the source has the two four slides apart in different
 * sections with nothing connecting them.  Here the exercise poses it as
 * a failure, this slide measures it, and section 5 cashes it as the
 * reason rbs.CDS is one part rather than two.
 *
 * NOTHING IS PLOTTED THAT WAS NOT PUBLISHED.  The paper gives the size
 * of the library, the range, and which hypothesis survived; it does not
 * give a per-variant table here, so no per-variant bars are drawn.  The
 * span is a span, the two hypotheses get verdicts, and the picture
 * claims exactly what the abstract claims.
 * ------------------------------------------------------------------ */
(function(){
"use strict";
const K = window.PK, C = K.C, n1 = K.n1;

/* Real synonymous codons for the first six residues of GFP.  Three
   encodings, one protein -- which is the entire premise of the library
   and is worth seeing rather than asserting. */
const AA  = ["M", "S", "K", "G", "E", "E"];
const VAR = [["ATG","AGC","AAA","GGC","GAA","GAA"],
             ["ATG","TCT","AAG","GGT","GAG","GAA"],
             ["ATG","TCC","AAA","GGA","GAA","GAG"]];
const CX0 = 470, CW = 106, VY = [326, 372, 418];

/* the axis: log, one decade per 190px, 1x to 250x */
const AX0 = 300, AX1 = 1280, AY = 560;
const lg = v => Math.log(v)/Math.LN10;
const px = v => n1(AX0 + (AX1 - AX0)*lg(v)/lg(250));

const HYP = [
{ y:678, t:"codon bias", v:"did not correlate", ok:false },
{ y:726, t:"mRNA folding near the RBS", v:"explained over half the variance", ok:true }
];

const FR = [
{ s:{seq:1},
  cap:"154 genes, one protein, different codons",
  call:"every one of them encodes the same GFP, residue for residue",
  note:"This is the experiment that measures what the last slide described. Kudla and colleagues built a library of a hundred and fifty-four genes that differ only at synonymous sites. Every one of them encodes the same green fluorescent protein — identical protein, to the residue. Here are three of them at the first six codons, and you can see that the only thing that changes is the third base of a codon, which the genetic code does not read.",
  desc:"Three synonymous encodings of the first six residues of GFP, with the amino acid sequence above them identical in all three." },

{ s:{seq:1, ax:1},
  cap:"expression across the library spanned <b>250-fold</b>",
  call:"same protein &#183; same promoter &#183; same ribosome binding site",
  note:"Expressed in E. coli, protein levels across that library varied two hundred and fifty fold. Same protein, same promoter, same ribosome binding site — the only difference anywhere is synonymous codon choice, and the top of the library makes two hundred and fifty times as much protein as the bottom. If you had taken one of those genes, characterised it, and written the number in a registry, you would have been off by up to two orders of magnitude for the next person who used a different encoding.",
  desc:"A logarithmic axis from one-fold to 250-fold with the full span of the library bracketed across it." },

{ s:{seq:1, ax:1, h0:1},
  cap:"the obvious explanation is codon bias",
  call:"rare codons, slow ribosomes &#8212; and it <b>did not correlate</b>",
  note:"The obvious explanation, and the one the source deck's title implies, is codon usage. E. coli has preferred codons with abundant tRNAs, and the story goes that rare codons slow the ribosome down and you get less protein. It is a good hypothesis. They tested it, and codon bias did not correlate with expression. Which you should find slightly alarming, because it is what most people still say when you ask them why this happens.",
  desc:"The first hypothesis, codon bias, marked as not correlating with expression." },

{ s:{seq:1, ax:1, h0:1, h1:1},
  cap:"what did explain it: how the messenger <b>folds</b> near the RBS",
  call:"over half the variance &#183; which is the slide you just did",
  note:"What did explain it was the stability of mRNA folding near the ribosome binding site — more than half the variance in protein level, from one number describing how tightly the messenger folds around the place the ribosome has to sit. That is the same mechanism as the failed construct three slides ago, measured across a hundred and fifty-four genes. Changing a codon two hundred bases into a gene changes how the five-prime end folds, and that changes how often a ribosome can load.",
  desc:"The second hypothesis, the stability of mRNA folding near the ribosome binding site, marked as explaining over half the variance." },

{ s:{seq:1, ax:1, h0:1, h1:1}, on:["so"],
  cap:"so &ldquo;codon variants&rdquo; is the wrong name for it",
  call:"the codons are what you changed &#183; the folding is what did it",
  note:"So I want to be careful about the name, because it is the kind of thing that sticks. This is usually called a codon variant library, and that is an accurate description of what was built and a misleading description of why it works. The codons are what was changed. The folding is what did it. And the consequence for us is the thing section five is built on: if the strength of a ribosome binding site depends on the first stretch of the gene behind it, then the ribosome binding site and the gene are not two independent parts, and pretending they are will cost you constructs. The fix is to stop treating them as two, which is a design move and not a discovery, and we will get to it.",
  desc:"The closing point: the library varies in codons but the mechanism is folding, and therefore the ribosome binding site and the coding sequence are not independent parts." }
];

window.Deck.sequence("kudla", function(slide){
  const s = K.scene(slide, 800, 846);

  const so = K.el("g", {});
  so.appendChild(K.path("M330 772H1270", C.muted, 2));
  s.part("so", so);

  /* The citation is drawn IN the figure, not set with .src.  .src is
     pinned to bottom:34px, which is exactly where this sequence's call
     line sits, and the two printed on top of one another. */
  const cite = K.el("text", {x:1290, y:628, "font-size":19, fill:C.muted,
    "text-anchor":"end"});
  cite.innerHTML = 'Kudla, Murray, Tollervey &amp; Plotkin, ' +
    '<tspan font-style="italic">Science</tspan> ' +
    '<tspan font-weight="700">324</tspan>:255 (2009)';
  s.add(cite);
  s.finish();

  function paint(v){
    const g = K.el("g", {});

    if (v.seq > 0.02){
      const q = K.grp(v.seq);
      /* the protein, once, over the three encodings that all give it */
      AA.forEach(function(a, i){
        q.appendChild(K.text(CX0 + i*CW + CW/2, 272, a, 30, C.ink, 700));
      });
      q.appendChild(K.text(CX0 - 30, 272, "one protein", 23, C.ink, 700, "end"));
      VAR.forEach(function(row, r){
        q.appendChild(K.text(CX0 - 30, VY[r] + 8, "variant " + (r + 1), 22,
          C.muted, 400, "end"));
        row.forEach(function(cod, i){
          /* Coloured only where the base actually DIFFERS from variant
             1.  Colouring every third base marked ATG as changed, and
             ATG is the only codon for methionine -- the slide would
             have been pointing at a difference that cannot exist. */
          const chg = r > 0 && cod[2] !== VAR[0][i][2];
          q.appendChild(K.seqStrip(CX0 + i*CW, VY[r] + 8,
            [{s:cod.slice(0, 2), col:C.muted},
             {s:cod.slice(2),    col:chg ? C.verm : C.muted}], 28));
        });
      });
      g.appendChild(q);
    }

    if (v.ax > 0.02){
      const a = K.grp(v.ax);
      a.appendChild(K.path("M"+AX0+" "+AY+"H"+AX1, C.ink, 3));
      [1, 10, 100, 250].forEach(function(t){
        a.appendChild(K.path("M"+px(t)+" "+AY+"v12", C.muted, 2.4));
        a.appendChild(K.text(px(t), AY + 38, t + "×", 22, C.muted, 400));
      });
      a.appendChild(K.path("M"+AX0+" "+(AY - 34)+"v-16H"+AX1+"v16", C.verm, 3));
      a.appendChild(K.text((AX0 + AX1)/2, AY - 64,
        "the whole library, top to bottom", 25, C.verm, 700));
      a.appendChild(K.text(AX1 + 24, AY + 8, "protein", 22, C.muted, 400, "start"));
      g.appendChild(a);
    }

    HYP.forEach(function(h, i){
      const u = v["h" + i];
      if (u <= 0.02) return;
      const a = K.grp(u), col = h.ok ? C.blue : C.muted;
      a.appendChild(K.text(760, h.y, h.t, 26, col, 700, "end"));
      a.appendChild(K.text(790, h.y, h.v, 26, h.ok ? C.blue : C.verm,
        h.ok ? 700 : 400, "start"));
      /* the strike runs the width of the words, not from an arbitrary
         x -- at a fixed left edge it started 150px before the text */
      if (!h.ok)
        a.appendChild(K.path("M"+n1(760 - h.t.length*13.4)+" "+n1(h.y - 9)+
          "H762", C.verm, 2.6));
      g.appendChild(a);
    });
    return g;
  }
  return K.run(s, FR, paint);
});
})();
