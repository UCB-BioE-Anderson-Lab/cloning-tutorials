/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   REORGANISED 2026-11-17.  No longer the source's section order: RNA-seq
   moved into Tools, the old "RNAs and DNAs" split into functional
   nucleic acids and regulatory DNA, and CRE-Seq moved across into the
   latter.  Sources 35 and 42 are gone and four slides were added, so
   and sources 40 and 41 were removed too, so the deck no longer
   has an All-Hands section.  See PLAN.txt.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "Multiplex Characterization",
  course: "BioE 140L",
  sections: [
    { file: "00-front-matter.html", title: "Introduction", kind: "lecture" },
    { file: "01-libraries.html", title: "Types of Libraries", kind: "section" },
    { file: "02-tools.html", title: "Tools of the Trade", kind: "section" },
    { file: "03-nucleic-acids.html", title: "Functional Nucleic Acids", kind: "section" },
    { file: "04-regulatory-dna.html", title: "Regulatory DNA", kind: "section" },
    { file: "05-protein.html", title: "Protein Function", kind: "section" },
    { file: "06-properties.html", title: "Biological Properties", kind: "section" },
    { file: "07-questions.html", title: "Questions to Ponder", kind: "section" }
  ]
};
