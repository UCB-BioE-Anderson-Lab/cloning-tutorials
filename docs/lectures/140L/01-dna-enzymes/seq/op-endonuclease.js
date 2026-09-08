/* EcoRI, as the operator for the endonuclease class, drawn twice: once with
   every atom and once as barbed lines. See operator.js. */
(function(){
"use strict";

const ECORI = {
  /* a flanking pair on each side, so neither fragment comes away as a lone
     nucleotide; that reads as the enzyme releasing a base, which it does not */
  top:"AGAATTCA",
  keep:i=>(i>=1&&i<=6),
  breaks:{top:1, bot:5},
  cap:"Endonuclease",
  sub:"EcoRI. Cuts a phosphodiester bond <tspan font-style=\"italic\">inside</tspan> the molecule",
  foot:"red is required; grey could be anything",
  note:"This is the operator for the whole class, and every enzyme section from here starts with one of these. Read it like this. Red is what the enzyme requires; grey is what it does not care about. The whole backbone is red, every sugar and every phosphate, because an endonuclease needs DNA that is actually there and actually continuous. That is true of all of them. The six bases are red too, because this one is EcoRI and it genuinely requires G-A-A-T-T-C. The pairs on either side are grey, and be exact about what grey means here: their identity is free, not their existence. The backbone runs red straight through them, because the DNA does have to be there. Most restriction enzymes cut badly right at the end of a fragment, which is why you put a few extra bases beyond the site when you design a PCR primer. Not every endonuclease has red bases at all. DNase I is coming later in this section and cuts anywhere. Now watch the reaction. One strand is cut. Then the other. It does not happen in one instant, and the two cuts are not opposite each other: they are four base pairs apart. And look at the chemistry left behind, because it never varies: a five prime phosphate on one side, a three prime hydroxyl on the other.",
  desc:"An AGAATTCA duplex drawn in full chemical structure, its backbone and its six site bases in red, with one grey base pair at each end. On a loop: the upper strand is cut between G and A, then the lower strand is cut four base pairs away, and the two halves draw apart leaving four-base single-stranded overhangs, a 5-prime phosphate on one new end and a 3-prime hydroxyl on the other."
};

window.Operator("op-endo", ECORI);

/* the same operator one level up: barbed lines, where there is finally room
   to pull the fragments far enough apart for the overhangs to clear */
window.Operator("op-endo-stick", Object.assign({}, ECORI, {
  view:"stick",
  sub:"the same cut, as a line with a half barb at each 3&#8242; end",
  note:"Same reaction, drawn the way you will actually draw it, and the way it appears in every catalogue and every protocol. A line for each strand, a half barb at each three prime end so you can tell which way each one runs, red across the part the enzyme requires. Watch the same three beats: one strand cut, then the other, then the pieces come apart. And now there is room to pull them properly apart, so you can see the thing that would not fit on the atomic slide: each fragment keeps four unpaired bases, those four are complementary to the four on the other fragment, and that is what a sticky end is and why these two pieces can find each other again. Get used to reading this version, because for the rest of the course this is the notation.",
  desc:"The same EcoRI cut drawn as barbed lines: each strand a horizontal bar with a half barb at its 3-prime end, red across the recognition site and grey outside it. On a loop the upper strand breaks, then the lower strand four positions away, and the two fragments separate far enough that the single-stranded overhangs stand clear of each other."
}));
})();
