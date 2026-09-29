/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   The order is the source PowerPoint's, unchanged.  This deck is a visual
   translation of 2025_09_25-Chassis.pptx: same slides, same words, same
   order, rebuilt in the house format.  The section breaks fall on the
   divider slides of the source deck.

   Source slides 1 to 62 are the lecture.  63 onward is the weekly
   all-hands — assignments, colony picking, miniprepping, sequencing —
   and none of it is in this deck.  The same precedent as Genome Editing,
   where JCA said "we don't need to repeat... no 2026 logistics.  It's
   just the bio content."  Here the case is stronger still: colony
   picking, miniprepping and sequencing are already three worked,
   animated sections of the Genome Editing deck, so repeating them would
   be the same material twice in one course.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "Chassis",
  course: "140L",
  sections: [
    { file: "00-front-matter.html",  title: "Introduction",          kind: "lecture" },
    { file: "01-parent-strains.html", title: "Parent Strains",       kind: "section" },
    { file: "02-ecoli.html",          title: "E. coli",              kind: "section" },
    { file: "03-genotypes.html",      title: "Genotypes",            kind: "section" },
    { file: "04-mach1.html",          title: "Mach1",                kind: "section" },
    { file: "05-pathogenicity.html",  title: "Pathogenicity",        kind: "section" },
    { file: "06-localization.html",   title: "Protein Localization", kind: "section" }
  ]
};
