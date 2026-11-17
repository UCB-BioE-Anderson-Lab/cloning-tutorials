# Redrawing a source figure as a house figure

How to replace a PowerPoint-drawn figure with an SVG that follows the deck's
style guide. Written 2026-11-17, when JCA pointed out that the figures carried
over from the pptx still look like PowerPoint: Calibri, theme blue, theme
yellow, pure #FF0000.

## 1. Look at the original first. Always.

Do not reconstruct a figure from the slide XML. The shape tree does not tell
you what the slide LOOKS like, and a reconstruction from it will be wrong in
ways you cannot detect. The first attempt at sources 3-6 was built that way and
had to be thrown out: it used white arrows where the source fills them solid,
invented a parts palette that duplicated the figure beside it, invented labels
that are nowhere in the source, and missed that one construct is flipped.

Renders of every slide of lecture 12 are at:

    <scratchpad>/render/s-NN.png        (1-up, 100 dpi, NN zero-padded)

To make them for another deck:

    soffice --headless --convert-to pdf --outdir OUT src.pptx
    pdftoppm -r 100 -png OUT/src.pdf OUT/s

Read the PNG. Then read the slide XML only to recover EXACT values the render
cannot give you to the pixel — tick positions, counts, sequence runs.

Watch for the group-coordinate trap: a shape inside `<p:grpSp>` is in its
parent's child coordinate space, so its absolute x means nothing. Normalise it
against its own parent's offset and extent before using it. Watch also that
`a:ext` is the extension-list element as well as the extent element — anchor
geometry reads on `a:xfrm`, never on `.//a:ext`.

## 2. The palette is an attention ladder, not an identity map.

Read `palette.css`. It is the specification, not a suggestion. The four content
colours are:

    ink         #111111   background, context, the unremarkable
    blue        #004373   attention: what to look at
    vermillion  #ba3a13   more attention, when blue is already used
    amber       #a99011   most attention. Reserved; rarely needed.

plus `muted #767676` for secondary text and `rule #e2e2e2` for hairlines.

**Start at ink.** Promote to blue the one thing the viewer should follow. Reach
vermillion only when blue is already carrying something. Amber almost never.

**Do not assign a colour to a class of object.** "Blue means promoter" or
"amber means variant B" is exactly the mistake the guide names. The same
molecule may change colour between slides as the focus moves to it; that is
correct. If you find yourself building a legend that maps hue to object type,
stop — you are drawing an identity map and the guide forbids it.

Where a source figure genuinely needs more categories than the ladder has,
reduce the number of categories or carry the distinction with position, shape,
label or line style instead. Never invent a fifth hue, and never invent a pale
tint of a palette colour to get another level — those are not in the palette.
A fill that must be lighter than its stroke uses `--rule` or white.

Vermillion and amber differ only in lightness to a red-green dichromat. Never
let those two alone carry a distinction that matters.

## 3. Fonts come from the slide, not from the SVG.

Every `<text>` carries `font-family="inherit"`. The slide supplies `--sans`
(Helvetica Neue / Arial). Never name a font in an SVG. Never use the slab
(`--slab`, Rockwell) inside a figure — it is for `h1` only.

Sizes inside a 1480-wide figure: 26px for a caption, 21-23px for a label,
19px for small print. Below 18px is unreadable from the back of the room.

## 4. The canvas.

A `.slide` is 1600x900 with padding `86px 110px 70px`, so the content box is
about 1380 wide. Under a one-line `h1` the free box is roughly 1380x620.

Author at **viewBox "0 0 1480 640"**. Check the slide's own furniture first: a
`p.sub` under the h1 costs about 34px of height, and a `ul` about 40px a line.

Host element and CSS, in the section's `<style>`:

```css
.slide .fg{flex:1 1 auto;min-height:0;display:flex;align-items:center;
  justify-content:center;margin-top:4px}
.slide .fg svg{width:100%;height:100%;display:block}
```

```html
<div class="fg" data-fig="7"></div>
```

SVG `patterns`, `gradients` and `markers` need page-global ids and several
figures share a page — so do not use them. Draw an arrowhead as a `<path>`.

## 5. The module.

One file per figure group, in `seq/`, named `NN-slug.js`. It is a
fill-on-load IIFE, **not** a `Deck.sequence`: no source slide in this deck has
builds, because the pptx carries no `p:timing` anywhere, and adding one would
change the deck's step count.

```js
(function(){
function fill(){
  const el = document.querySelector('[data-fig="7"]');
  if (!el) return;
  el.innerHTML = '<svg viewBox="0 0 1480 640" '
    + 'xmlns="http://www.w3.org/2000/svg" role="img">' + draw() + '</svg>';
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", fill);
else fill();
})();
```

## 6. Draw what is there. Nothing else.

- No label the source does not have. No footer line, no takeaway, no
  "the gene you start with", no colour key for a figure that had none.
- Every number is the source's or the cited paper's. Never invent one.
- A caption text box in the source stays, at the source's position if it fits.
- If the source's own colouring is faulty (two labels for one thing in two
  colours, a region drawn white on white), you may fix it — but say so in the
  file header, because it is a change to JCA's slide.
- Where a curve is drawn to a described shape rather than traced from data,
  the figure says so in small print and the header says not to read values
  off it.

## 7. The header comment is part of the job.

Every module opens with a block comment giving: which sources it fills, why it
exists, what is drawn, where each exact value came from, and **every change to
JCA's slide, listed and justified**. Read `seq/15-illumina.js` for the form.

## 8. Verify by looking.

mkdocs serves at `http://127.0.0.1:8000/cloning-tutorials/...` — the
`/cloning-tutorials/` prefix is required, a bare path 404s. Load the section,
arrow to the slide, screenshot it. Check: nothing overlaps, nothing runs off
the viewBox, the figure fills the box rather than sitting in a band, and it
reads in greyscale (add `.greyscale-preview` to the root).

Then run the note check and confirm `note-corrections.txt` is unchanged.

---

# Auditing a converted slide

Added 2026-11-17, when JCA asked for every slide of lecture 12 to be
audited for style and reproduction. Two different questions, asked of every
slide:

**Reproduction** — is this slide what the source slide was?
**Style** — does it follow the house guide?

A slide can pass one and fail the other. The four figure-less slides at the
start of lecture 12 were perfect reproductions of their *text* and total
failures of reproduction overall, because their figures were never drawn.

## The reproduction checklist

Open the render `s-NN.png` next to the live slide and compare.

1. **Is everything on the source slide present?** Figures, labels, captions,
   arrows, callouts. The rough-cut pass cropped figures by picture bounding
   box, so anything the source *drew* rather than *pasted* was dropped
   silently. Count the objects in the render.
2. **Is anything present that the source did not have?** An invented label,
   footer, takeaway or colour key is a reproduction fault as much as a
   missing one.
3. **Are the numbers the source's?** Every count, length, concentration and
   price. Never invent one; if a figure is drawn to a described shape rather
   than traced, it says so in small print.
4. **Does a crop cut something off?** Check the edges against the render.
5. **Is text that the source had as text still text?** A sentence trapped
   inside a bitmap cannot be read by a screen reader, searched or restyled.

## The style checklist

6. **Palette.** Every colour a value from `palette.css`, used as an
   attention ladder — never a hue per class of object, never an invented
   fifth hue or a pale tint. This applies to CSS and to SVG alike.
7. **Fonts.** No font named inside an SVG; `font-family="inherit"`. The slab
   is for `h1` only.
8. **Contrast against the actual ground.** The amber section ground takes
   BLACK text, not `--muted` and not white. The blue lecture ground takes
   white.
9. **Nothing overlaps and nothing runs off.** Check absolutely positioned
   things especially — two `.src` credits on one slide used to print on top
   of each other.
10. **The slide fills its box** rather than sitting in a band with slack
    down both sides.

## The settled conventions

- **A PMID goes in `<p class="src">PMID: nnnnnnnn</p>`**, after the figure.
  Several on one slide go on one line, comma separated. Not a bullet, not
  appended to a `p.sub`.
- **A credit describes something on the slide.** If a redraw removes the
  image, its `<p class="src">` URL goes with it.
- **A figure does not repeat what the slide already says.** If the caption
  is the slide's `<ul>` or `p.sub`, the figure does not print it again.
- **Alt text and the `desc` channel are real text**, not the title echoed
  back. A provisional one built from the title is a known debt, not a pass.

## What to do with what you find

Fix, in your own files only:
- anything on the style checklist (6-10) — these have right answers
- a missing `.src`, a stale `.src`, a PMID in the wrong slot
- a figure that is drawn and merely needs to follow the guide

Report, do not fix:
- a figure that must be **redrawn** from a bitmap — that is its own job
- anything where the source itself looks wrong, or where the fix is a
  judgment call about what the slide should say
- anything needing a change to `deck.css` or to another section's file

**Published figures stay as they are.** Most of the cropped bitmaps in this
deck are other people's figures with a PMID on the slide. They cannot be
restyled, only cropped, and redrawing a published figure would be inventing
data. Note them and move on.

## Credits: two more rules, settled 2026-11-17

- **A URL the source printed on the slide is the source's text. Keep it
  verbatim**, however long and ugly.
- **A credit WE add** — because a figure is uncredited and the speaker note
  names where it came from — uses the shortest adequate form, the domain:
  `<p class="src">twistbioscience.com</p>`. Do not transcribe a
  300-character tracking URL out of a note onto a slide.

So a deck can carry both forms, and that is correct: one is reproduction,
the other is attribution we are supplying.

## Never write a number you did not read

Every count, length, price and duration on a figure is quoted from the
source slide or the cited paper, and **the quote goes in the module
header next to the number**. A number whose provenance is not recorded
in the header is not trustworthy, whatever the code comment says.

This is not hypothetical. `35b-expfit.js` printed "24 genes" and "26
genes" under a comment reading "per the paper" for a day. The paper
(PMC7704046) says 25 and 36. The two pairs either side of it had their
sentences recorded in the header; that pair did not, and that is exactly
how the audit found it. Record the sentence, not just the number.

## When hue may carry a two-way distinction after all

The rule above stands: do not assign a colour to a class of object. But it
exists to make figures legible, not to win arguments, and on 2026-11-17 it
produced an illegible figure.

Source 6 of lecture 12 shows two variants each of three parts. Carrying the
variant by FILL — solid versus open — is palette-clean and survives
greyscale, and it failed: an open shape has to be drawn as a white core
over a coloured stroke, so every open shape ended up with two or three
stacked edges and read as a drawing mistake.

Blue and vermillion, one solid shape each, fixed it. So the exception is:

**Two coordinated variants may take blue and vermillion when all of these
hold** — the distinction is the slide's whole content; nothing else on the
slide competes for either rung; there are exactly two, so the ladder's
order (blue first, vermillion second) still means something; and the
non-hue alternative has actually been tried and is worse.

Record it in the module header, including what you tried first and why it
failed. Three or more variants is not this exception — go back and reduce
the categories.

**And the general lesson:** a rule that makes a figure harder to read has
been applied wrongly, or has met its edge. Look at the rendered figure
before deciding which.

## Make sure a check is actually checking

`verify_notes.py` takes the unpacked pptx as its first argument and the HTML
files after it:

```
python3 ../../tools/verify_notes.py <unpacked-pptx> --keep-urls \
    --corrections note-corrections.txt *.html
```

Run as `verify_notes.py .` it exits 0 and prints nothing, because it is
given a pptx root with no slides and zero files to check. It reports
success at checking nothing. That form was used for an entire session
before anyone noticed.

**A silent check is not a passing check.** Know what the tool prints when it
is working — this one prints one `source N: ok` per slide — and treat
silence as a failure to run, not as a pass. When a check matters, break
something on purpose once and confirm it complains.

---

# Writing in JCA's voice

Derived 2026-11-17 by reading the source notes of lecture 12, when JCA asked
that added narration match "the voice of the original notes". These are his
habits, not house style invented for him.

**Person.** "You" for what the experimenter does — "you use tools like
PSI-BLAST", "you just vortex together mineral oil, surfactant and your
aqueous sample". "We" for the lecture's own movement — "before we jump into
the fun part", "finally, we have in vitro translation".

**Open by placing the slide in the arc.** Almost every note starts with a
connective that says where we are: "Before we get into examples…",
"Next-gen synthesis allows you to make all sorts of libraries, but one of
the more pertinent ones is…", "Finally, we have…", "Here is an example from
Tom Soh in which…". This is where transitions live. A note that opens by
naming its own slide's title has no transition.

**Name real people and labs.** Tom Soh, the Fletcher lab, Jewett and
Swartz, Richard Murray, Ryan Gill, Julius Lucks, the Arkin lab. He credits
people by name and it is part of how the lecture sounds.

**Be concrete and hedge honestly.** "typically 1 DNA molecule", "usually you
would want to", "pretty much any aqueous liquid", "it is very common to".
Specific products where they matter: PURExpress, NEB, an S30 extract.

**Explain the mechanism in ordinary words.** No metaphor, no rhetorical
questions, no exclamation marks, no "imagine that…". The register is a
knowledgeable person talking plainly to a room.

**End on the point, or on the hand-off.** "From this, they can identify the
most promising sequences for further analysis." / "But there is a third
thing you can do, which is sequence the populations, and this is termed
Multiplex Characterization."

**American spelling.** characterization, normalizing, specialized,
synthesize, color, center, gray. British forms had crept into the deck's
own text and were normalized out; they are still correct inside a verbatim
source note if he wrote one, which he did not.

**Mechanics.** Moderate sentences. No bullet lists inside a note. No
headings. Two spaces after a period is his tic in the source; do not
reproduce it in new text, but do not "fix" it in his.

## The two channels

`<template class="notes">` is HIS, verbatim, and is checked against the
pptx. Never edit it except through `note-corrections.txt`, under the
deliberate-revision heading, with a date and a reason.

`<template class="notes-add">` is ours. It is where added narration goes,
and the presenter view prints it under the same "Narration" heading
immediately after the source note. Use it when a source note is empty or is
only a URL, and when a transition is missing.

## The desc channel is not narration

`<template class="desc">` is the visual description — what is ON the slide,
for someone who cannot see it. It is not a second place to teach. Describe
the figure's content and structure, in order, plainly. No argument, no
takeaway, no "this shows that…". If the slide's figure is schematic rather
than real data, the desc says so.
