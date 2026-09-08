"""pdf_assemble.py -- stitch the per-step frames into two PDFs.

  dna-enzymes-slides.pdf   the deck, one page per click, section bookmarks
  dna-enzymes-notes.pdf    the same pages with the spoken narration beneath

The narration strip is type-set at the largest size that fits, measured
rather than guessed: reportlab drops overflow from a Frame in silence.

  python3 pdf_assemble.py <framedir> [outdir]
"""
import json, os, sys
from pypdf import PdfReader, PdfWriter, Transformation
from pypdf.generic import RectangleObject
from reportlab.lib.pagesizes import landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import Paragraph, Frame
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

D    = sys.argv[1]
OUTDIR = sys.argv[2] if len(sys.argv) > 2 else os.path.join(D, "..")
MAN  = json.load(open(os.path.join(D, "manifest.json")))
W, H = 1600, 900
NOTE_H = 420                       # strip under the slide in the notes build

INK   = HexColor("#111111")
MUTED = HexColor("#767676")
RULE  = HexColor("#d8d8d8")

# ---------------------------------------------------------------- slides only
w = PdfWriter()
sec_first = {}
for m in MAN:
    r = PdfReader(m["file_pdf"])
    w.add_page(r.pages[0])
    sec_first.setdefault(m["section"], len(w.pages) - 1)
for title, pg in sec_first.items():
    w.add_outline_item(title, pg)
w.compress_identical_objects()
w.add_metadata({"/Title": "DNA Manipulation Enzymes - BioE 140L",
                "/Author": "J. Christopher Anderson",
                "/Subject": "Full lecture deck, one page per animation step"})
with open(os.path.join(OUTDIR, "dna-enzymes-slides.pdf"), "wb") as f:
    w.write(f)
print("slides:", len(MAN), "pages")

# ---------------------------------------------------------------- with notes
overlay = os.path.join(D, "_notes-overlay.pdf")
c = canvas.Canvas(overlay, pagesize=(W, H + NOTE_H))
AVAIL_W, AVAIL_H = W - 180, NOTE_H - 150

def fitted(txt):
    """Largest size at which the whole note fits the strip. reportlab drops
    anything that overflows a Frame silently, so this is measured, not guessed."""
    for size in range(21, 10, -1):
        st = ParagraphStyle("b%d" % size, fontName="Helvetica", fontSize=size,
                            leading=round(size * 1.38, 1), textColor=INK, alignment=TA_LEFT)
        if Paragraph(txt, st).wrap(AVAIL_W, AVAIL_H)[1] <= AVAIL_H:
            return st, True
    return st, False
overflow = []
for m in MAN:
    c.setStrokeColor(RULE); c.setLineWidth(1)
    c.line(90, NOTE_H - 34, W - 90, NOTE_H - 34)
    f = Frame(90, 96, AVAIL_W, AVAIL_H, showBoundary=0,
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    txt = m["note"].strip() or "(no narration on this step)"
    body, ok = fitted(txt)
    if not ok:
        overflow.append(m["i"] + 1)
    f.addFromList([Paragraph(txt, body)], c)
    c.setFillColor(MUTED); c.setFont("Helvetica", 16)
    c.drawString(90, 52, "%s  ·  step %d of %d" % (m["section"], m["step"], m["of"]))
    c.drawRightString(W - 90, 52, str(m["i"] + 1))
    c.showPage()
c.save()
print("overflowing notes:", overflow or "none")

ov = PdfReader(overlay)
w2 = PdfWriter()
sec_first = {}
for i, m in enumerate(MAN):
    page = w2.add_blank_page(width=W, height=H + NOTE_H)
    page.merge_transformed_page(ov.pages[i], Transformation())
    slide = PdfReader(m["file_pdf"]).pages[0]
    page.merge_transformed_page(slide, Transformation().translate(0, NOTE_H))
    sec_first.setdefault(m["section"], i)
for title, pg in sec_first.items():
    w2.add_outline_item(title, pg)
w2.compress_identical_objects()
w2.add_metadata({"/Title": "DNA Manipulation Enzymes - BioE 140L (with narration)",
                 "/Author": "J. Christopher Anderson"})
with open(os.path.join(OUTDIR, "dna-enzymes-notes.pdf"), "wb") as f:
    w2.write(f)
print("notes:", len(MAN), "pages")
