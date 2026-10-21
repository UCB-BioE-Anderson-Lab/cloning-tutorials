"""For every slide in a section file, concatenate its spoken note pieces
(the <template class="notes"> plus each data-note, in document order) and
diff against the source slide's note.  The source slide number is taken
from the HTML comment that precedes each <article>."""
import html, re, sys, os, difflib
import xml.etree.ElementTree as ET
A="{http://schemas.openxmlformats.org/drawingml/2006/main}"
P="{http://schemas.openxmlformats.org/presentationml/2006/main}"
root=sys.argv[1]
def srcnote(n):
    rel=f"{root}/ppt/slides/_rels/slide{n}.xml.rels"
    t=ET.parse(rel).getroot()
    p=None
    for r in t:
        if r.get("Type").endswith("notesSlide"):
            p=os.path.normpath(os.path.join(root,"ppt/slides",r.get("Target")))
    if not p: return ""
    nt=ET.parse(p).getroot(); out=[]
    for sp in nt.iter(P+"sp"):
        ph=sp.find("."+"//"+P+"ph")
        if ph is None or ph.get("type")!="body": continue
        for para in sp.iter(A+"p"):
            out.append("".join(t.text or "" for t in para.iter(A+"t")))
    return "\n".join(out)
def norm(s):
    s=html.unescape(s)
    for a,b in [("’","'"),("‘","'"),("“",'"'),("”",'"'),
                ("–","-"),("—","-"),("µ","u"),(" "," "),("°","deg"),
                ("→","->")]:
        s=s.replace(a,b)
    s=re.sub(r"<click>","",s)
    s=re.sub(r"<[^>]+>","",s)
    return re.sub(r"\s+"," ",s).strip()
bad=0
for f in sys.argv[2:]:
    h=open(f).read()
    print("=== "+os.path.basename(f))
    for m in re.finditer(r"<!--[-\s]*(\d+)\s*-->([\s\S]*?)(?=<!--[-\s]*\d+\s*-->|<script )", h):
        n=int(m.group(1)); body=m.group(2)
        tpl=re.search(r'<template class="notes">([\s\S]*?)</template>', body)
        pieces=[tpl.group(1) if tpl else ""]
        pieces+= re.findall(r'data-note="([^"]*)"', body)
        want=norm(srcnote(n))
        # the two documented departures
        want=re.sub(r"^Image from \S+\s*","",want)
        want=re.sub(r"^Images: \S+ \S+\s*","",want)
        want=re.sub(r"^From https\S+\s*","",want)
        want=re.sub(r"^https\S+\s*","",want)
        want=want.replace("\\","").strip()
        got=norm(" ".join(pieces))
        if want==got: print(f"  slide {n}: ok")
        else:
            bad+=1
            print(f"  slide {n}: MISMATCH")
            for d in difflib.unified_diff(want.split(" "),got.split(" "),lineterm="",n=3):
                if d.startswith(("+","-")) and not d.startswith(("+++","---")): print("    "+d)
sys.exit(1 if bad else 0)
