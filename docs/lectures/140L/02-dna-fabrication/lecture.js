/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   The order is the original PowerPoint's, unchanged.  This deck is a
   visual translation of 2025_09_11-DNA Fabrication.pptx: same slides,
   same words, same order, rebuilt in the house format.  The section
   breaks fall on the divider slides of the source deck.

   Slides 1 to 50 are the lecture; 51 onward is the weekly all-hands,
   which the source deck carries in the same file.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "DNA Fabrication",
  course: "140L",
  sections: [
    { file: "00-front-matter.html",               title: "Introduction",              kind: "lecture" },

    /* --- the fabrication methods, smallest scale first ------------- */
    { file: "01-basic-cloning.html",              title: "Basic Cloning",             kind: "section" },
    { file: "02-ad-hoc-assembly.html",            title: "Ad hoc Assembly",           kind: "section" },
    { file: "03-gene-synthesis.html",             title: "Gene Synthesis",            kind: "section" },
    { file: "04-biobrick-assembly.html",          title: "BioBrick Assembly",         kind: "section" },
    { file: "05-homology-based-assembly.html",    title: "Homology-based Assembly",   kind: "section" },
    { file: "06-golden-gate-assembly.html",       title: "Golden Gate Assembly",      kind: "section" },

    /* --- the all-hands --------------------------------------------- */
    { file: "07-all-hands.html",                  title: "All-Hands",                 kind: "lecture" },
    { file: "08-tpcon6-and-moclo.html",           title: "TPcon6 and MoClo",          kind: "section" },
    { file: "09-setting-up-pcr.html",             title: "Setting up PCR",            kind: "section" },
    { file: "10-run-a-gel.html",                  title: "Run a Gel",                 kind: "section" },
    { file: "11-zymo-cleanup.html",               title: "Zymo Cleanup",              kind: "section" },
    { file: "12-digestion-ligation-assembly.html", title: "Digestion, Ligation, Assembly", kind: "section" }
  ]
};
