/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   This deck is a straight conversion of 2025_10_23-In vitro assays.pptx:
   the same slides in the same order, the same words, the same speaker notes,
   and the same figures.  What changed is the presentation — the grounds, the
   type and the content colors come from the house palette instead of the
   source deck's grey/blue scheme.  Nothing has been rewritten or re-argued.

   The source deck is JCA's own 2026 rebuild and he judged it solid, so this
   is a conversion, not a rebuild.  The work beyond the conversion is
   REDRAWING: about a dozen borrowed textbook and vendor figures are raster
   with type too small to read from the back of a lecture hall.  His own
   drawn figures — the cell-compartment diagrams and the tRNA drawings —
   convert cleanly and are kept.

   The sections are the source deck's own dividers.

   kind: lecture | section — only used to color the jump menu key. */
window.LECTURE = {
  title: "In vitro Assays",
  course: "140L",
  sections: [
    { file: "00-front-matter.html", title: "Introduction",  kind: "lecture" },
    { file: "01-extraction.html",   title: "Extraction",    kind: "section" },
    { file: "02-purification.html", title: "Purification",  kind: "section" },
    { file: "03-detection.html",    title: "Detection",     kind: "section" },
    { file: "04-enzymatic.html",    title: "Enzymatic Assays", kind: "section" },
    { file: "05-binding.html",      title: "Binding Assays", kind: "section" },
    { file: "06-questions.html",    title: "Questions to Ponder", kind: "section" }
  ]
};
