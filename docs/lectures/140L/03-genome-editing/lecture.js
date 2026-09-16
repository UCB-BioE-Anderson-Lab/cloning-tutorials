/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   The order is the source PowerPoint's, unchanged.  This deck is a visual
   translation of 2025_09_18-Genome Editing.pptx: same slides, same words,
   same order, rebuilt in the house format.  The section breaks fall on the
   divider slides of the source deck.

   Source slides 1 to 57 are the lecture.  58 onward is the weekly
   all-hands, which the source carries in the same file, and most of it is
   not in this deck.  JCA: "we don't need to repeat gel/zymo/digestion.  We
   start that part from transformation.  We don't need the slides with
   assignment due dates and such.  No 2026 logistics.  It's just the bio
   content."  So the all-hands, the assignments and the TPcon6/BestP
   project plan are gone (source 58 to 67), and so are Run a Gel, Zymo
   Cleanup and Digestion/Ligation/Assembly (source 68 to 82), which are
   already sections of the DNA Fabrication deck.  The bench half picks up
   at Transformation, source 83.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "Genome Editing",
  course: "140L",
  /* Sections are added here as they are built.  deck.js walks this list
     for prev/next, so a file named before it exists is a 404 off the end
     of the slide before it.  The full plan is in the comment above. */
  sections: [
    { file: "00-front-matter.html",     title: "Introduction",             kind: "lecture" }
  ]
};
