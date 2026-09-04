/* The endonuclease operator. See operator.js for what the picture means. */
(function(){
"use strict";
window.Operator("op-endo", {
  /* six required bases with an unconstrained base on either side, cut in
     the middle: the flanks are grey because no endonuclease cares what is
     outside its site, and the backbone is red all the way across because
     every one of them needs the DNA itself */
  top:"TGAATTC",
  keep:i=>(i>=1&&i<=5),
  cut:3,
  cap:"Endonuclease",
  /* tspan, not em: SVG text drops an unknown element AND its contents */
  sub:"cuts a phosphodiester bond <tspan font-style=\"italic\">inside</tspan> the molecule",
  foot:"red is required &mdash; grey could be anything",
  note:"This is the operator for the whole class, and every enzyme section from here starts with one of these. Read it like this. Red is what the enzyme requires; grey is what it does not care about. The entire backbone is red, every sugar and every phosphate, because an endonuclease needs DNA that is actually there and actually continuous — that is true of all of them. What varies is the bases. Here six of them are red and the two flanks are grey, meaning this enzyme reads a six base site and does not care what surrounds it. Some endonucleases have no red bases at all; DNase I is coming later and will cut anywhere. And then watch what it does: it breaks a phosphodiester bond in the middle of the molecule, not at an end, which is what endo means. Look at the ends it leaves, because that is the part you will care about at the bench — a five prime phosphate on one side and a three prime hydroxyl on the other, every time.",
  desc:"A DNA duplex drawn in full chemical structure with its whole backbone in red and six of its eight base pairs in red, the outer two in grey. On a loop, the molecule breaks in the middle: both strands are cut and the two halves separate, leaving a 5-prime phosphate on one new end and a 3-prime hydroxyl on the other."
});
})();
