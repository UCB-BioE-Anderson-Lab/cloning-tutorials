/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   This deck is a straight conversion of 2025_10_16-Whole-Cell Analysis.pptx:
   the same slides in the same order, the same words, the same speaker notes,
   and the same figures.  What changed is the presentation — the grounds, the
   type and the content colors come from the house palette instead of the
   source deck's blue/red/grey scheme.  Nothing has been rewritten, re-argued,
   split or merged.

   HOW THE FIGURES WERE RECOLOURED.  Most of this deck's art is still vector
   inside the .pptx, so the pixels were never touched.  The theme color
   scheme was rewritten to the palette across all 13 themes and 10 theme
   overrides, together with the literal hexes the shapes carry directly, and
   the deck was then re-rendered and re-cropped.  See AUTHORING.txt, "WHERE
   THE FIGURE IS STILL VECTOR IN THE SOURCE .pptx".

   Source slides 12-40 sit on a dark grey ground, so their drawn figures
   were cropped from a second render with a white ground, and raster
   figures carrying white labels were either recoloured to ink or, where
   the white marks are data beside black data, kept on the source's own
   grey as a panel.  PLAN.txt has the per-figure list.

   The source deck's course-admin tail — the all-hands, final project,
   grading, project ideas and wetlab result slides, source slides 41 to 68 —
   is NOT converted and stays in PowerPoint.

   SOURCE 39 AND 40 ARE GONE from the section list.  They were a divider
   and one slide holding four questions, at the very end.  JCA, 18 Oct
   2026: go through them individually, and reinforce at the end of each
   section rather than dumping them at the end.  Each question now closes
   the section whose tools answer it, verbatim, in the pattern section 00
   already used.  Source 39's cartoon is deleted.

   kind: lecture | section — only used to color the jump menu key. */
window.LECTURE = {
  title: "Whole-Cell Analysis",
  course: "140L",
  sections: [
    { file: "00-front-matter.html", title: "Introduction", kind: "lecture" },
    { file: "01-fluorescent.html", title: "Fluorescent Reporter Assays", kind: "section" },
    { file: "02-biochemical.html", title: "Biochemical Assays", kind: "section" },
    { file: "03-microbiological.html", title: "Microbiological Assays", kind: "section" },
    { file: "04-experimental.html", title: "Experimental Design", kind: "section" }
  ]
};
