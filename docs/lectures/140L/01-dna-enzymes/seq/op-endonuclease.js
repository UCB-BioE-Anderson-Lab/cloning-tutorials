/* EcoRI, as the operator for the endonuclease class. See operator.js. */
(function(){
"use strict";
window.Operator("op-endo", {
  /* GAATTC with one unconstrained base after it: the site is required, what
     surrounds it is not. G^AATTC on both strands, which is four columns
     apart in this frame and is why the ends come out staggered. */
  /* a flanking pair on each side, so neither fragment comes away as a lone
     nucleotide — that reads as the enzyme releasing a base, which it does not */
  top:"AGAATTCA",
  keep:i=>(i>=1&&i<=6),
  breaks:{top:1, bot:5},
  cap:"Endonuclease",
  sub:"EcoRI &mdash; cuts a phosphodiester bond <tspan font-style=\"italic\">inside</tspan> the molecule",
  foot:"red is required &mdash; grey could be anything",
  note:"This is the operator for the whole class, and every enzyme section from here starts with one of these. Read it like this. Red is what the enzyme requires; grey is what it does not care about. The whole backbone is red, every sugar and every phosphate, because an endonuclease needs DNA that is actually there and actually continuous — that is true of all of them. The six bases are red too, because this one is EcoRI and it genuinely requires G-A-A-T-T-C; the base after the site is grey because it does not care what surrounds it. Not every endonuclease has red bases at all — DNase I is coming later in this section and cuts anywhere. Now watch the reaction. One strand is cut. Then the other. It does not happen in one instant, and the two cuts are not opposite each other: they are four base pairs apart, so when the halves come away each one keeps a short stretch of unpaired single strand. Those are sticky ends, and the fact that they are single stranded and complementary is the whole reason this enzyme is useful. And look at the chemistry left behind, because it never varies: a five prime phosphate on one side, a three prime hydroxyl on the other.",
  desc:"A GAATTC duplex drawn in full chemical structure, its backbone and its six site bases in red, with one grey base pair beyond the site. On a loop: the upper strand is cut between G and A, then the lower strand is cut four base pairs away, and the two halves draw apart leaving four-base single-stranded overhangs, a 5-prime phosphate on one new end and a 3-prime hydroxyl on the other."
});
})();
