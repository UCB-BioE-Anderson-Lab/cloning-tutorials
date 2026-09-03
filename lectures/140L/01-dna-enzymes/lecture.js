/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   The order is the ARGUMENT, not a filing convention.  Sections are
   grouped by reaction mechanism, because that is the lecture's spine:

     hydrolysis            water attacks, the bond is destroyed
     transphosphorylation  an alcohol attacks, the bond is moved
     (neither)             methyl transfer — attack at carbon

   Kinases and phosphatases are deliberately SPLIT across the first two
   groups.  Same phosphate, same position, opposite directions, and two
   different mechanisms — which is the clearest demonstration in the
   lecture that adding and removing are not mirror images.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "DNA Manipulation Enzymes",
  course: "140L",
  sections: [
    { file: "00-intro.html",              title: "Introduction",        kind: "lecture" },

    /* --- hydrolysis ------------------------------------------------ */
    { file: "01-endonucleases.html",      title: "Endonucleases",       kind: "section" },
    { file: "02-exonucleases.html",       title: "Exonucleases",        kind: "section" },
    { file: "03-phosphatases.html",       title: "Phosphatases",        kind: "section" },

    /* --- transphosphorylation -------------------------------------- */
    { file: "04-kinases.html",            title: "Kinases",             kind: "section" },
    { file: "05-dna-polymerases.html",    title: "DNA Polymerases",     kind: "section" },
    { file: "06-rna-polymerases.html",    title: "RNA Polymerases",     kind: "section" },
    { file: "07-ligases.html",            title: "Ligases",             kind: "section" },
    { file: "08-recombinases.html",       title: "Recombinases",        kind: "section" },

    /* --- different chemistry --------------------------------------- */
    { file: "09-methyltransferases.html", title: "Methyltransferases",  kind: "section" },

    { file: "10-questions.html",          title: "Questions",           kind: "section" }
  ]
};
