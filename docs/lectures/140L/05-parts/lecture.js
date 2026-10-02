/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   The order is NOT the source PowerPoint's.  2025_10_01-Parts.pptx is
   59 slides, and OUTLINE.txt records the two structural edits and why:

   Four of its topics are already whole sections of decks the students
   have seen — the assembly Formats and TPcon in DNA Fabrication,
   recombination sites and terminal repeats in Genome Editing, alkaline
   phosphatase and induction in Chassis.  Each is one callback slide
   here, not a re-teach, which frees about ten slides of budget.

   And its eight Central Dogma slides are one figure built one arrow at a
   time, so they are one animated slide.  That is what makes room for the
   dogma to be its own short section rather than a preamble: the
   three-level split it establishes is the spine of the four sections
   after it, and the Chassis trace exercise already closes by promising
   it — "a part is a thing that lives on one of them".

   Source slides 54 to 59 are the weekly all-hands and are not here, the
   same precedent as Chassis and Genome Editing.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "Parts",
  course: "140L",
  sections: [
    { file: "00-front-matter.html", title: "Introduction",       kind: "lecture" },
    { file: "01-dogma.html",        title: "The Central Dogma",  kind: "section" },
    { file: "02-cds-parts.html",    title: "CDS-Based Parts",    kind: "section" },
    { file: "03-rna-parts.html",    title: "RNA-Based Parts",    kind: "section" },
    { file: "04-dna-parts.html",    title: "DNA-Based Parts",    kind: "section" },
    { file: "05-part-families.html",title: "Part Families",      kind: "section" }
  ]
};
