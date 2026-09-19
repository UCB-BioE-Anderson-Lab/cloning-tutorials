/* Section order for this lecture.  This is the single place the order
   lives — deck.js reads it for prev/next and for the jump menu (G).

   The keystone lecture of the course.  HW2 is built on it, HW3 uses what
   HW2 produces, and the final project inherits the requirement that a
   capability can say whether its own output is valid.

   The source is old deck 10 slides 7-20 plus old deck 8 slides 42-46,
   with two changes.

   The divider's speaker note in the source is 1400 words of taxonomy —
   validation, constraint, heuristic, evaluation, fitness, invariant —
   labelled in the note itself as coming from ChatGPT.  It is gone.  Six
   neighbouring categories blur the one idea, and a lecture whose thesis is
   that you must be able to defend what a tool tells you is the wrong place
   to narrate unverified model output.

   The second half is new.  The source teaches the checker as a code
   pattern and stops.  It never asks where the threshold comes from, which
   is the only part a language model cannot do for you: it writes the
   predicate in seconds and cannot defend the number.  So the pattern is
   compressed and the sweep against 4,310 real E. coli genes is the place
   the lecture actually lands.

   kind: lecture | section — only used to colour the jump menu key. */
window.LECTURE = {
  title: "Checkers I — Biology as a Predicate",
  course: "134/234",
  sections: [
    { file: "00-duplication.html",  title: "The Duplication Problem",  kind: "lecture" },
    { file: "01-the-pattern.html",  title: "The Pattern",              kind: "section" },
    { file: "02-where-it-lives.html", title: "Where It Lives",         kind: "section" },
    { file: "03-threshold.html",    title: "Where the Threshold Comes From", kind: "section" },
    { file: "04-calibration.html",  title: "Calibration",              kind: "section" },
    { file: "05-activity.html",     title: "Activity: Pick a Threshold", kind: "section" }
  ]
};
