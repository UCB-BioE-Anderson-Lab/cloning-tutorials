#!/usr/bin/env python3
"""Rebuild the WHITE-GROUND render tree that this deck's figures are cropped
from.  Three things happen to a copy of the recoloured tree:

  1. every slide gets a white <p:bg>, so a figure cropped off a grey master
     does not carry the grey with it;
  2. lumMod/lumOff TINTS are stripped from slide shapes -- but only where the
     base colour is a TEXT or ACCENT slot.  A tint of a background slot is how
     this deck draws its GREY furniture (source 37's promoter arrow), and
     stripping that turns the shape white and it silently disappears;
  3. white line art is painted into ink, per figure, at a fuzz that does not
     also eat a pale fill -- AFTER the alpha channel is thresholded.  That
     order is the whole trick.  `-opaque white` compares RGB and ignores
     alpha, so a pixel that is white at alpha 0.08 -- and 80 to 96 PERCENT of
     every one of these rasters is halo like that, they are JPEGs wearing a
     PNG -- becomes INK at alpha 0.08, which flattens to a grey smudge.  The
     figures came out visibly splotchy and it only showed at slide size,
     where a 500 px scan is blown up three times.  Thresholding alpha first
     throws the halo away before anything is painted;
  4. a few text shapes are DROPPED, because they are set as HTML on the slide
     instead.  Source 30's "Yeast Display:" label sits inside the bounding box
     of the figure beside it, so any crop that takes the whole figure takes
     half the label with it, and it would then appear twice.  Source 3's RFP,
     GFP and phoA labels sit ON the photograph: baked into the crop they are
     a pale tint of blue over a grey landscape, and re-set as HTML they are
     white, which is what the Directed Evolution deck does with this same
     photograph.  The shape is removed by
     cNvPr id before rendering.  Removal is done with ElementTree, never a
     regex: a group holds groups, and a non-greedy <p:grpSp>...</p:grpSp>
     closes on the first INNER tag and swallows the rest of the shape tree.

Usage:  python3 build_white.py <scratchdir>
"""
import os, re, shutil, subprocess, sys, glob
import xml.etree.ElementTree as ET

W = sys.argv[1]
SRC, DST = os.path.join(W, "rc/unpacked"), os.path.join(W, "wh")
BG = ('<p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>'
      '<a:effectLst/></p:bgPr></p:bg>')
# tints on these slots draw grey furniture; leave them alone
KEEP = {"bg1", "bg2", "lt1", "lt2", "dk1", "tx1"}
# image28 is deliberately absent from INK: its white bars are DATA, so the
# figure goes on a grey panel in the section file instead (AUTHORING.txt,
# "white marks that ARE data next to black data").

# (slide number, cNvPr id) of shapes to remove before rendering
DROP = [(30, "13"),              # "Yeast Display:" sits inside the figure's box
        (3, "133"), (3, "134"), (3, "135")]   # RFP / GFP / phoA, re-set as HTML
# image22 (source 18) is NOT in this list, and must not be put back.  It
# is white type on transparency, drawn for a dark slide: inking it paints
# every antialiased glyph edge into grey speckle, which is the "blotchy"
# JCA reported on 2026-11-04 and again on 2026-11-10.  It is served from
# the untouched media file on a charcoal panel instead -- see 02-construction.html.
INK = [("image18", 35), ("image19", 35), ("image23", 35),
       ("image30", 35), ("image31", 35), ("image32", 35),
       ("image34", 35), ("image35", 35), ("image37", 35), ("image39", 35),
       ("image43", 35), ("image36", 20), ("image17", 40),
       # The M13 particle wants only its labels and leader lines, never its
       # coat: a wide fuzz paints the white highlights on every pVIII subunit
       # and the whole phage goes dark.
       ("image33", 12)]

if os.path.isdir(DST):
    shutil.rmtree(DST)
shutil.copytree(SRC, DST)

TINT = re.compile(r'<a:lum(?:Mod|Off)\s+val="\d+"\s*/>')
ELEM = re.compile(r'<a:(schemeClr|srgbClr)\s+val="([^"]+)"\s*>(.*?)</a:\1>', re.S)

def detint(m):
    if m.group(1) == "schemeClr" and m.group(2) in KEEP:
        return m.group(0)
    inner = TINT.sub("", m.group(3))
    if not inner.strip():
        return '<a:%s val="%s"/>' % (m.group(1), m.group(2))
    return '<a:%s val="%s">%s</a:%s>' % (m.group(1), m.group(2), inner, m.group(1))

n = 0
for f in sorted(glob.glob(DST + "/ppt/slides/slide*.xml")):
    s = open(f).read()
    s = re.sub(r"<p:bg>.*?</p:bg>", "", s, flags=re.S)
    s = s.replace("<p:cSld>", "<p:cSld>" + BG, 1)
    s = ELEM.sub(detint, s)
    open(f, "w").write(s)
    n += 1
print("slides rebuilt:", n)

P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
for ET_NS in ("a", "p", "r"):
    pass
ET.register_namespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
ET.register_namespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")
ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
for slide, sid in DROP:
    f = "%s/ppt/slides/slide%d.xml" % (DST, slide)
    t = ET.parse(f)
    tree = t.getroot().find("./" + P + "cSld/" + P + "spTree")
    gone = 0
    for sp in list(tree):
        c = sp.find(".//" + P + "cNvPr")
        if c is not None and c.get("id") == sid:
            tree.remove(sp)
            gone += 1
    if not gone:
        raise SystemExit("slide %d has no shape with id %s" % (slide, sid))
    t.write(f, xml_declaration=True, encoding="UTF-8")
print("shapes dropped:", len(DROP))

for name, fuzz in INK:
    p = "%s/ppt/media/%s.png" % (DST, name)
    subprocess.run(["magick", p,
                    "-channel", "A", "-threshold", "60%", "+channel",
                    "-channel", "RGB", "-fuzz", "%d%%" % fuzz,
                    "-fill", "#111111", "-opaque", "white", "+channel",
                    "-background", "white", "-flatten", p], check=True)
print("figures inked:", len(INK))
