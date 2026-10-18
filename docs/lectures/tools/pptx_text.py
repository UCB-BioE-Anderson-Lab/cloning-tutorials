#!/usr/bin/env python3
"""
Dump the text, the outline level, the colour marks and the speaker notes of a
source PowerPoint, slide by slide, so a deck can be converted VERBATIM.

The point is fidelity.  Reading the words off a rendered image invites quiet
paraphrase, loses the speaker notes entirely, and cannot tell you which runs
the author coloured for emphasis.  This reads them out of the XML.

USAGE
    python3 pptx_text.py <unpacked-pptx-dir> <first> <last>

where <unpacked-pptx-dir> is the tree recolour_pptx.py leaves in
<scratch>/unpacked (or any `unzip`ed .pptx).

WHAT THE OUTPUT MEANS
    [title] / [body] / [ph-type]   the shape's placeholder type
    - text                         one paragraph, indented by outline level
    <<accent1,FFFFFF>>             that paragraph carries coloured runs.  In
                                   the source deck these mark emphasis; the
                                   house conversion renders them as <b>, as
                                   the Parts deck did, rather than importing a
                                   second colour system onto the slide.
    [NOTES]                        the speaker notes, verbatim

A BARE ASTERISK ON ITS OWN LINE inside the notes is the author's own marker
for a click: the notes before it belong to the base step, the next run belongs
to the first build, and so on.  Split on it and hang each part off the
matching data-build element with data-note.  Source slides 8 and 9 of the
Whole-Cell deck are the worked example.

The slide-number placeholder is stripped from the notes; it is furniture, not
narration.
"""
import html
import os
import re
import sys


def paragraphs(xml):
    out = []
    for p in re.findall(r"<a:p>(.*?)</a:p>", xml, re.S):
        lvl = re.search(r'lvl="(\d)"', p)
        runs = []
        for r in re.findall(r"<a:r>(.*?)</a:r>", p, re.S):
            t = re.search(r"<a:t>(.*?)</a:t>", r, re.S)
            if not t:
                continue
            col = re.search(r'<a:solidFill>\s*<a:(?:srgbClr|schemeClr) val="([^"]+)"', r)
            runs.append((html.unescape(t.group(1)), col.group(1) if col else ""))
        if runs:
            out.append((int(lvl.group(1)) if lvl else 0, runs))
    return out


def notes(base, n):
    p = os.path.join(base, "ppt", "notesSlides", "notesSlide%d.xml" % n)
    if not os.path.exists(p):
        return ""
    s = open(p, encoding="utf8").read()
    s = re.sub(r'<p:sp>(?:(?!</p:sp>).)*?type="sldNum"(?:(?!</p:sp>).)*?</p:sp>',
               "", s, flags=re.S)
    lines = []
    for para in re.findall(r"<a:p>(.*?)</a:p>", s, re.S):
        line = "".join(html.unescape(t)
                       for t in re.findall(r"<a:t>(.*?)</a:t>", para, re.S))
        if line.strip():
            lines.append(line.strip())
    return "\n".join(lines)


def main():
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    base, a, b = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    for n in range(a, b + 1):
        f = os.path.join(base, "ppt", "slides", "slide%d.xml" % n)
        if not os.path.exists(f):
            continue
        s = open(f, encoding="utf8").read()
        print("\n" + "=" * 70 + "\nSLIDE %d" % n)
        for sp in re.findall(r"<p:(?:sp|graphicFrame)>.*?</p:(?:sp|graphicFrame)>", s, re.S):
            ps = paragraphs(sp)
            if not ps:
                continue
            ph = re.search(r'type="(\w+)"', sp)
            print("  [%s]" % (ph.group(1) if ph else "body"))
            for lvl, runs in ps:
                txt = "".join(r[0] for r in runs)
                cols = sorted({r[1] for r in runs if r[1]})
                print("    %s- %s%s" % ("  " * lvl, txt,
                                        "   <<%s>>" % ",".join(cols) if cols else ""))
        nt = notes(base, n)
        if nt:
            print("  [NOTES]\n    " + nt.replace("\n", "\n    "))


if __name__ == "__main__":
    main()
