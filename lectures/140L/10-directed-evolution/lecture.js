/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   This deck is a STRAIGHT conversion of 2025_10_30-Directed Evolution.pptx
   and nothing about its flow is up for revision: same slides, same order,
   same words, same speaker notes, same figures.  What changes is the
   formatting — the grounds, the type and the deck's own chrome come from
   the house palette instead of the source's green and grey masters.

   JCA, 27 Oct 2026: "Don't get creative there -- don't modify the flow.
   Not content, just formatting."  PLAN.txt says why that ruling exists.

   The sections are the source deck's own dividers.

   Two slides in section 03 are NOT in the source: a transition out of the
   classical cycle and into computation before the ProSAR pair, and a
   transition out of ProSAR's math and into a protein model after it.  JCA
   asked for both on 28 Oct 2026.  They are marked <!-- NEW --> in the HTML
   and verify_notes.py skips them, since there is nothing to compare their
   notes against.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "Directed Evolution",
  course: "140L",
  sections: [
    { file: "00-front-matter.html", title: "Introduction", kind: "lecture" },
    { file: "01-library-approaches.html", title: "Library Approaches", kind: "section" },
    { file: "02-directed-evolution.html", title: "Directed Evolution", kind: "section" },
    { file: "03-diversity-screening.html", title: "Diversity Generation and Screening", kind: "section" },
    { file: "04-vector-editing.html", title: "Vector Editing", kind: "section" },
    { file: "05-questions.html", title: "Questions to Ponder", kind: "section" }
  ]
};
