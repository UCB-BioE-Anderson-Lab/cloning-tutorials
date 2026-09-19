/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   The source is 2026_01_19-Introduction.pptx, restructured.  The argument
   is unchanged: other engineering disciplines design in software, biology
   mostly does not, and the gap is now worth closing because a language
   model can carry the interface if real code carries the correctness.

   Two things are deliberately gone.  The course mechanics — meeting times,
   office hours, the grading split, the accommodation form, the waitlist —
   are semester facts, and this deck is meant to outlive any one semester;
   they belong on bCourses.  And the data-representation run at the end of
   the source deck (variables, arrays, objects, the plastic egg) is now its
   own lecture, Schemas and Models, where it has room to be the argument
   rather than an appendix.

   What is new is the closing section.  The old deck listed eight course
   objectives, three of which were "learn some X"; a course with eight
   objectives has none.  Four remain, and they are the four things the rest
   of the term actually assesses.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "Introduction",
  course: "134/234",
  sections: [
    { file: "00-intro.html",                 title: "Introduction",            kind: "lecture" },
    { file: "01-engineering-is-software.html", title: "Engineering Is Now Software", kind: "section" },
    { file: "02-what-we-have-now.html",      title: "What We Have Now",        kind: "section" },
    { file: "03-three-domains.html",         title: "Three Domains",           kind: "section" },
    { file: "04-course-arc.html",            title: "The Course Arc",          kind: "section" },
    { file: "05-final-project.html",         title: "The Final Project",       kind: "section" },
    { file: "06-objectives.html",            title: "What You Should Leave With", kind: "section" }
  ]
};
