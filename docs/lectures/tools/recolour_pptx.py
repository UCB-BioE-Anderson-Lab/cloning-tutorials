#!/usr/bin/env python3
"""
Recolour a source PowerPoint into the 140L lecture palette, in place in a
scratch directory, so the deck can be re-rendered and its figures re-cropped
with clean antialiasing.

WHY THIS EXISTS.  AUTHORING.txt, "WHERE THE FIGURE IS STILL VECTOR IN THE
SOURCE .pptx": do not recolour the pixels of a figure that is still vector.
Rewrite the theme's colour scheme, re-render, and re-crop instead.  Recolouring
rasterised output leaves haloes, and white line art on a transparent ground
disappears entirely the moment it lands on this deck's white slides.

WHAT IT REWRITES
  1. the clrScheme slots in EVERY ppt/theme/*.xml -- a deck of any age carries
     a dozen themes and several themeOverrides, and editing only theme1 misses
     most of the slides.
  2. the literal hexes that shapes carry directly, across slides, layouts,
     masters and notes.  Drawn figures often bypass the theme entirely: the
     Whole-Cell deck drew its cells with a literal FF0000.

dk2 and accent1 both map to BLUE rather than to ink, deliberately.  Shapes
reference theme colours through lumMod/lumOff tints, so whatever you map a
slot to will also appear as a lightened version of itself somewhere; a tint of
blue is a legible pale blue, a tint of ink is a muddy grey.

USAGE
    python3 recolour_pptx.py "/path/to/Source.pptx" /path/to/scratchdir

leaves  scratchdir/unpacked/   the unzipped, recoloured tree
        scratchdir/recoloured.pptx   a copy of the original with the XML
                                     replaced, ready for soffice

Then:
    soffice --headless --convert-to pdf recoloured.pptx --outdir .
    pdftoppm -png -r 80 recoloured.pdf pages/p

ImageMagick's PDF delegate needs ghostscript, which may not be installed;
pdftoppm comes with poppler and does the same job here.
"""
import os, re, shutil, subprocess, sys, zipfile
from glob import glob

# ---- the palette, from docs/lectures/style/palette.css ---------------------
INK, BLUE, VERM, AMBER = "111111", "004373", "BA3A13", "A99011"
MUTED, RULE = "767676", "E2E2E2"

# theme clrScheme slot -> palette
SLOT = {
    "dk2": BLUE, "accent1": BLUE, "accent2": VERM, "accent3": MUTED,
    "accent4": AMBER, "accent5": BLUE, "accent6": AMBER,
    "hlink": BLUE, "folHlink": MUTED,
}

# literal hexes shapes carry directly.  Extend per deck -- print the most
# common srgbClr values first and decide what each one is actually doing.
LITERAL = {
    "1F497D": BLUE, "4F81BD": BLUE, "002060": BLUE, "4BACC6": BLUE,
    "C0504D": VERM, "FF0000": VERM,
    "FF8989": "E6A896",          # a pale tint of vermillion: keeps a
                                 # bright/dim pair readable as one hue
    "F79646": AMBER, "8064A2": AMBER, "FF40FF": AMBER,
    "9BBB59": MUTED, "008000": MUTED, "00B050": MUTED,
    "DCE6F2": "EDEDED", "C7D9F0": RULE,
}

PARTS = ("slides", "slideLayouts", "slideMasters", "notesSlides", "notesMasters")


def unpack(src, work):
    out = os.path.join(work, "unpacked")
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out, exist_ok=True)
    with zipfile.ZipFile(src) as z:
        z.extractall(out)
    return out


def recolour(root):
    slots = files = 0
    for f in glob(os.path.join(root, "ppt", "theme", "*.xml")):
        s = o = open(f, encoding="utf8").read()

        def fix(m):
            nonlocal slots
            slot, body = m.group(1), m.group(2)
            if slot not in SLOT:
                return m.group(0)
            nb = re.sub(r'val="[0-9A-Fa-f]{6}"', 'val="%s"' % SLOT[slot], body, count=1)
            if nb != body:
                slots += 1
            return "<a:%s>%s</a:%s>" % (slot, nb, slot)

        s = re.sub(r"<a:(dk2|accent[1-6]|hlink|folHlink)>(.*?)</a:\1>", fix, s, flags=re.S)
        if s != o:
            open(f, "w", encoding="utf8").write(s)

    for sub in PARTS:
        for f in glob(os.path.join(root, "ppt", sub, "*.xml")):
            s = o = open(f, encoding="utf8").read()
            for a, b in LITERAL.items():
                s = s.replace('val="%s"' % a, 'val="%s"' % b)
                s = s.replace('val="%s"' % a.lower(), 'val="%s"' % b)
            if s != o:
                files += 1
                open(f, "w", encoding="utf8").write(s)
    return slots, files


def repack(src, root, dest):
    """Copy the original and update only the XML we touched.

    Rebuilding the archive from scratch produces a file LibreOffice refuses to
    open -- [Content_Types].xml has to come first and some parts must be
    stored rather than deflated.  `zip` updating a copy sidesteps all of it.
    """
    shutil.copy(src, dest)
    names = []
    for sub in ("theme",) + PARTS:
        for f in glob(os.path.join(root, "ppt", sub, "*.xml")):
            names.append(os.path.relpath(f, root))
    subprocess.run(["zip", "-q", dest] + names, cwd=root, check=True)
    return len(names)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, work = sys.argv[1], sys.argv[2]
    os.makedirs(work, exist_ok=True)
    root = unpack(src, work)
    slots, files = recolour(root)
    dest = os.path.join(work, "recoloured.pptx")
    n = repack(src, root, dest)
    print("theme slots rewritten : %d" % slots)
    print("files with literals   : %d" % files)
    print("xml parts replaced    : %d" % n)
    print("wrote                 : %s" % dest)


if __name__ == "__main__":
    main()
