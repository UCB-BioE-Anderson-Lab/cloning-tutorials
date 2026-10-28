"""Render one slide of the deck with a given set of shapes removed.

LibreOffice draws every shape of a slide, animated or not, so a slide whose
clicks bring shapes in or take them out has no still for any state but the
union.  Removing the shapes by their cNvPr id and re-rendering gives the
state that was actually on screen.

Parsed with ElementTree, not a regex: a group holds groups, and a non-greedy
<p:grpSp>...</p:grpSp> closes on the first inner tag and takes the rest of
the slide's shape tree with it.

    python3 render.py <raw-dir> <slide-no> <out.png> [id ...]
"""
import os, shutil, subprocess, sys, tempfile
import xml.etree.ElementTree as ET

P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
for pre, uri in (("p", P[1:-1]),
                 ("a", "http://schemas.openxmlformats.org/drawingml/2006/main"),
                 ("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships"),
                 ("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006")):
    ET.register_namespace(pre, uri)

raw, n, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
drop = set(sys.argv[4:])
work = tempfile.mkdtemp()
tree = os.path.join(work, "t")
shutil.copytree(raw, tree)
p = os.path.join(tree, "ppt", "slides", "slide%d.xml" % n)
doc = ET.parse(p)
hit = 0
for parent in doc.iter():
    for kid in list(parent):
        if kid.tag not in (P+"sp", P+"pic", P+"grpSp", P+"graphicFrame", P+"cxnSp"):
            continue
        nv = kid.find(".//" + P + "cNvPr")
        if nv is not None and nv.get("id") in drop:
            parent.remove(kid); hit += 1
if hit != len(drop):
    sys.exit("removed %d of %d shapes" % (hit, len(drop)))
doc.write(p, xml_declaration=True, encoding="UTF-8", default_namespace=None)
pptx = os.path.join(work, "v.pptx")
subprocess.run(["zip", "-q", "-r", "-X", pptx, "."], cwd=tree, check=True)
subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", work, pptx],
               check=True, capture_output=True)
subprocess.run(["pdftoppm", "-r", "200", "-f", str(n), "-l", str(n), "-png",
                os.path.join(work, "v.pdf"), os.path.join(work, "x")], check=True)
got = [f for f in os.listdir(work) if f.startswith("x-") and f.endswith(".png")]
shutil.move(os.path.join(work, got[0]), out)
print(out)
