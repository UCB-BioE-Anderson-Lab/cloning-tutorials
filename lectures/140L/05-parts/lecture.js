/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   This deck is a straight conversion of 2025_10_01-Parts.pptx: the same
   slides in the same order, the same words, the same speaker notes, and
   the same figures.  What changed is the presentation — the grounds, the
   type and the four content colours come from the house palette instead
   of the source deck's blue/green/grey scheme.  Nothing was rewritten,
   re-argued, split or merged.

   The section breaks fall on the source deck's own divider slides: the
   five green title cards at source slides 6, 15, 27, 33 and 42.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "Parts",
  course: "140L",
  sections: [
    { file: "00-front-matter.html",  title: "Introduction",     kind: "lecture" },
    { file: "01-features.html",      title: "Features",         kind: "section" },
    { file: "02-cds-parts.html",     title: "CDS-Based Parts",  kind: "section" },
    { file: "03-rna-parts.html",     title: "RNA-Based Parts",  kind: "section" },
    { file: "04-dna-parts.html",     title: "DNA-Based Parts",  kind: "section" },
    { file: "05-part-families.html", title: "Part Families",    kind: "section" }
  ]
};
