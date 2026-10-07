/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   NOT a conversion.  The source deck (2026_10_13-Practices.pptx) spent
   roughly two thirds of its running time on biosafety and closed with
   course admin; this one keeps the material that was good, drops the
   admin, and gives the other halves of "practices" the room they never
   had — money above all, which the field keeps declining to do the
   arithmetic on.

   Every section teaches a method and then hands the room a hard case to
   run it on, so the anchor question is the exercise rather than a
   conversation starter.  The discussion slides sit on the section
   ground, so the deck visibly stops.

   All seven sections are built and in the order below.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "Practices",
  course: "140L",
  sections: [
    { file: "00-practices.html", title: "Practices",    kind: "lecture" },
    { file: "01-risk.html",      title: "Risk",         kind: "section" },
    { file: "02-safety.html",    title: "Is It Safe?",  kind: "section" },
    { file: "03-security.html",  title: "Security",     kind: "section" },
    { file: "04-ownership.html", title: "Who Owns It",  kind: "section" },
    { file: "05-economics.html", title: "Does It Pay?", kind: "section" },
    { file: "06-society.html",   title: "Who Else",     kind: "section" }
  ]
};
