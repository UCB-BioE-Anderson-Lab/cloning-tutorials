"""Check that a converted deck's speaker notes are still the source's.

  python3 verify_notes.py <unpacked-pptx> [--keep-urls] <section.html> ...
  python3 verify_notes.py <unpacked-pptx> [--keep-urls] --seq <seq.js> <NAME>=<slide> ...

A slide's note pieces are its <template class="notes"> plus each data-note,
in document order; they are concatenated and diffed against the source
slide's note, normalised for whitespace, curly quotes and the three
click markers the decks use (<click>, (click) and a bare asterisk).  The source slide number is
read from the HTML comment before each <article>.

A slide driven by a sequence keeps its notes in the sequence file, so
--seq reads the note: strings out of a named STEPS array instead.

One source slide may be presented as several slides -- source 21 is three --
and then its note splits across them in document order.  Pieces are collected
per source number and compared once, so the concatenation still has to equal
the pptx note exactly.

The only differences that should ever show up are the ones PLAN.txt
lists: an image credit moved out of a spoken note onto its slide as a
.src line, and one period moved across a click boundary on source 9.
"""
import difflib, html, os, re, sys
import xml.etree.ElementTree as ET

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
root = sys.argv[1]

def srcnote(n):
    t = ET.parse(f"{root}/ppt/slides/_rels/slide{n}.xml.rels").getroot()
    p = None
    for r in t:
        if r.get("Type").endswith("notesSlide"):
            p = os.path.normpath(os.path.join(root, "ppt/slides", r.get("Target")))
    if not p:
        return ""
    out = []
    for sp in ET.parse(p).getroot().iter(P + "sp"):
        ph = sp.find(".//" + P + "ph")
        if ph is None or ph.get("type") != "body":
            continue
        for para in sp.iter(A + "p"):
            out.append("".join(t.text or "" for t in para.iter(A + "t")))
    return "\n".join(out)

SUBS = [("’", "'"), ("‘", "'"), ("“", '"'), ("”", '"'),
        ("–", "-"), ("—", "-"), ("µ", "u"), (" ", " "),
        ("°", "deg"), ("→", "->")]

def norm(s):
    s = html.unescape(s)
    for a, b in SUBS:
        s = s.replace(a, b)
    # Three spellings of the same marker across decks: <click> (In vitro),
    # a bare asterisk (Whole-Cell, Directed Evolution) and (click)
    # (Combinatorial Libraries).  They are the author's own note to himself
    # about where he advances, never narration, so all three come out.
    s = s.replace("<click>", "").replace("(click)", "")
    # The deck's other click marker.  A RUN of them, because an author who
    # wants a second marker on the same slide writes ** for it, as source 10
    # of the Directed Evolution deck does.
    s = re.sub(r"(?<=\s)\*+(?=\s)", "", s)
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", s).strip()

def strip_credit(s):
    """An image credit at the head of a note lives on the slide instead.

    --keep-urls turns this off.  The In vitro deck moved its credits onto
    the slides as .src lines, so a bare leading URL there is a credit and
    is stripped.  The Directed Evolution deck does not move anything, and
    some of its notes ARE just URLs — the links for an optional tutorial —
    so stripping them would report a difference that is not there."""
    if KEEP_URLS:
        return s.replace("\\", "").strip()
    s = re.sub(r"^Images?:?\s*(from\s+)?(https?://\S+\s*)+", "", s)
    s = re.sub(r"^From https?://\S+\s*", "", s)
    s = re.sub(r"^https?://\S+\s*", "", s)
    return s.replace("\\", "").strip()

def report(label, want, got):
    if want == got:
        print(f"  {label}: ok")
        return 0
    print(f"  {label}: MISMATCH")
    for d in difflib.unified_diff(want.split(" "), got.split(" "), lineterm="", n=3):
        if d.startswith(("+", "-")) and not d.startswith(("+++", "---")):
            print("    " + d)
    return 1

args = sys.argv[2:]
KEEP_URLS = "--keep-urls" in args
args = [a for a in args if a != "--keep-urls"]

# A deck may correct spelling and grammar in the speaker notes -- and only
# that.  The corrections are listed in a file, applied to the PPTX side here,
# so the comparison still proves nothing ELSE diverged.  Without this the
# choice is a deck full of the source's typos or a check that has been
# switched off, and the second one rots quietly.
CORRECTIONS = []
if "--corrections" in args:
    i = args.index("--corrections")
    for line in open(args[i + 1], encoding="utf-8"):
        line = line.rstrip("\n")
        if not line.strip() or line.lstrip().startswith("#") or "|" not in line:
            continue
        a, b = line.split("|", 1)
        CORRECTIONS.append((a, b))
    del args[i:i + 2]

def correct(t):
    """Applied to the NORMALISED source text, so a correction can be written
    as one sentence even where the pptx broke it across paragraphs."""
    for a, b in CORRECTIONS:
        t = t.replace(norm(a), norm(b))
    return t
bad = 0
if args and args[0] == "--seq":
    # Arguments after --seq are a stream: a token with "=" in it is a
    # <NAME>=<slide> spec belonging to the js file most recently named, and
    # anything else is the next js file.  That lets ONE source slide's note
    # live in SEVERAL sequence files -- source 21 is split across
    # 21a-invasion.js and 21b-impedance.js -- with the pieces concatenated
    # in the order given and compared to the pptx note once.
    group, order, where = {}, [], {}
    js = None
    for tok in args[1:]:
        if "=" not in tok:
            js = open(tok, encoding="utf-8").read()
            print("=== " + os.path.basename(tok))
            where["_file"] = os.path.basename(tok)
            continue
        if js is None:
            sys.exit("--seq: a NAME=slide spec came before any .js file")
        name, n = tok.split("=")
        n = int(n)
        i = js.index("const " + name + " = [")
        j = js.index("\n];", i)
        pieces = [m.group(1) for m in
                  re.finditer(r'\n    note:"((?:[^"\\]|\\.)*)"', js[i:j])]
        pieces = [p.replace('\\"', '"').replace("\\\\", "\\") for p in pieces]
        if n not in group:
            group[n], where[n] = [], []
            order.append(n)
        group[n] += pieces
        where[n].append(f"{name} in {where['_file']}")
    for n in order:
        bad += report(f"source {n} ({len(group[n])} pieces: " +
                      ", ".join(where[n]) + ")",
                      correct(norm(strip_credit(srcnote(n)))),
                      norm(" ".join(group[n])))
    sys.exit(1 if bad else 0)

for f in args:
    h = open(f, encoding="utf-8").read()
    print("=== " + os.path.basename(f))
    # A slide marked <!-- NEW --> has no counterpart in the pptx: it was added
    # on the author's instruction, so its notes are his or mine rather than the
    # source's and there is nothing to compare them against.  It still has to
    # be recognised as a slide boundary, or its notes would be swept into the
    # previous slide's and fail that slide instead.
    #
    # ONE SOURCE SLIDE MAY BE PRESENTED AS SEVERAL.  JCA split source 21 into
    # three on 2026-11-10 -- what invasin does, impedance matching, then the
    # library data -- and his single note splits across them in order.  So the
    # pieces are collected PER SOURCE NUMBER across every article carrying it
    # and compared once.  That keeps the guarantee exactly as strong: the
    # concatenation still has to equal the pptx note, word for word.
    group, order, seqof, count = {}, [], {}, {}
    for m in re.finditer(r"<!--[-\s]*(\d+|NEW)\s*-->([\s\S]*?)"
                         r"(?=<!--[-\s]*(?:\d+|NEW)\s*-->|<script )", h):
        if m.group(1) == "NEW":
            print("  added slide: not in the source, nothing to check")
            continue
        n = int(m.group(1))
        body = m.group(2)
        if n not in group:
            group[n], count[n] = [], 0
            order.append(n)
        count[n] += 1
        seq = re.search(r'<article class="slide[^"]*" data-seq="([^"]+)"', body)
        if seq:
            seqof[n] = seq.group(1)
            continue
        tpl = re.search(r'<template class="notes">([\s\S]*?)</template>', body)
        group[n].append(tpl.group(1) if tpl else "")
        group[n] += re.findall(r'data-note="([^"]*)"', body)
    for n in order:
        if n in seqof and not any(p.strip() for p in group[n]):
            print(f"  source {n}: notes live in sequence {seqof[n]} (check with --seq)")
            continue
        label = f"source {n}"
        if count[n] > 1:
            label += f" (split across {count[n]} slides)"
        bad += report(label, correct(norm(strip_credit(srcnote(n)))),
                      norm(" ".join(group[n])))
sys.exit(1 if bad else 0)
