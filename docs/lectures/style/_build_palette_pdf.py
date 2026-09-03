"""Regenerate palette.pdf — the demonstration sheet for the lecture palette."""
import itertools
import numpy as np
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

# ---------------------------------------------------------------- colour math
def lin(c):
    c = np.asarray(c, float) / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def rgb(h): return np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], float)
def hexs(v): return "#%02x%02x%02x" % tuple(np.clip(np.round(v), 0, 255).astype(int))
def lum(h):
    R, G, B = lin(rgb(h)); return 0.2126*R + 0.7152*G + 0.0722*B
def cr(a, b):
    L1, L2 = sorted([lum(a), lum(b)], reverse=True); return (L1+0.05)/(L2+0.05)

M  = np.array([[17.8824,43.5161,4.11935],[3.45565,27.1554,3.86714],
               [0.0299566,0.184309,1.46709]])
Mi = np.linalg.inv(M)
SIM = {"deuteranopia": np.array([[1,0,0],[0.494207,0,1.24827],[0,0,1]]),
       "protanopia":   np.array([[0,2.02344,-2.52581],[0,1,0],[0,0,1]]),
       "tritanopia":   np.array([[1,0,0],[0,1,0],[-0.395913,0.801109,0]])}
def sim(h, kind):
    if kind == "normal":    return h
    if kind == "greyscale":
        g = lum(h)
        v = (g*12.92 if g <= 0.0031308 else 1.055*g**(1/2.4)-0.055)*255
        return hexs(np.array([v, v, v]))
    o = Mi @ (SIM[kind] @ (M @ (lin(rgb(h))*255)))
    o = np.clip(o/255, 0, 1)
    e = np.where(o <= 0.0031308, o*12.92, 1.055*o**(1/2.4)-0.055)
    return hexs(e*255)

PAL = [("ink","#111111","body text, titles, template DNA"),
       ("blue","#004373","newly synthesised strand"),
       ("vermillion","#ba3a13","callouts, errors, the thing to look at"),
       ("amber","#a99011","fourth channel: RNA, displaced strand")]
W, H = letter
c = canvas.Canvas("palette.pdf", pagesize=letter)
c.setTitle("140L Lecture Palette")

def text(x, y, s, size=9.5, font="Helvetica", col="#111111"):
    c.setFont(font, size); c.setFillColor(HexColor(col)); c.drawString(x, y, s)
def rule(y, x0=0.75*inch, x1=W-0.75*inch, col="#cccccc"):
    c.setStrokeColor(HexColor(col)); c.setLineWidth(0.5); c.line(x0, y, x1, y)
def para(x, y, s, width=6.6*inch, size=9.5, lead=13, col="#333333"):
    c.setFont("Helvetica", size); c.setFillColor(HexColor(col))
    words, line = s.split(), ""
    for w in words:
        t = (line + " " + w).strip()
        if c.stringWidth(t, "Helvetica", size) > width:
            c.drawString(x, y, line); y -= lead; line = w
        else: line = t
    if line: c.drawString(x, y, line); y -= lead
    return y

# ============================================================ page 1
text(0.75*inch, H-0.95*inch, "140L Lecture Palette", 22, "Helvetica-Bold")
text(0.75*inch, H-1.2*inch,
     "Four content colours that survive colour-vision deficiency and greyscale rendering",
     10.5, "Helvetica", "#666666")
rule(H-1.35*inch)

y = H - 1.75*inch
text(0.75*inch, y, "THE FOUR", 8.5, "Helvetica-Bold", "#888888")
y -= 0.28*inch
sw, gap = 1.52*inch, 0.15*inch
for i, (name, hx, use) in enumerate(PAL):
    x = 0.75*inch + i*(sw+gap)
    c.setFillColor(HexColor(hx)); c.rect(x, y-1.05*inch, sw, 1.05*inch, stroke=0, fill=1)
    text(x, y-1.28*inch, name, 10.5, "Helvetica-Bold")
    text(x, y-1.45*inch, hx.upper(), 9, "Courier", "#555555")
    text(x, y-1.62*inch, f"{cr(hx,'#ffffff'):.1f}:1 on white", 8.5, "Helvetica", "#555555")
    text(x, y-1.76*inch, f"luminance {lum(hx):.3f}", 8.5, "Helvetica", "#555555")
    c.setFont("Helvetica", 7.5); c.setFillColor(HexColor("#777777"))
    ww, ln = sw, ""
    yy = y-1.95*inch
    for w in use.split():
        t = (ln+" "+w).strip()
        if c.stringWidth(t,"Helvetica",7.5) > ww: c.drawString(x,yy,ln); yy -= 9.5; ln = w
        else: ln = t
    if ln: c.drawString(x, yy, ln)

y -= 2.5*inch
rule(y+0.15*inch)
text(0.75*inch, y-0.08*inch, "WHY THESE, AND NOT SOME OTHER FOUR", 8.5, "Helvetica-Bold", "#888888")
y -= 0.38*inch
y = para(0.75*inch, y,
  "WCAG does not recommend colours. It specifies contrast RATIOS and is entirely "
  "hue-agnostic: 4.5:1 for body text, 3:1 for large text and for graphical objects such "
  "as diagram strokes. Which hues to pick is a separate question, governed by colour-vision "
  "deficiency, which affects roughly 8% of men.")
y -= 6
y = para(0.75*inch, y,
  "Under dichromacy you effectively have ONE hue axis, blue against yellow, plus lightness. "
  "Red, orange, yellow and green all collapse onto the yellow pole. So hue alone cannot "
  "separate four colours — lightness has to do the work. That is fortunate, because "
  "lightness is also exactly what greyscale printing preserves. Solving for one solves the other.")
y -= 6
y = para(0.75*inch, y,
  "Black sits at 18.9:1 against white, and the 3:1 floor for graphical objects caps the "
  "lightest usable colour. Four values spaced evenly in LOG luminance across that span give "
  "the largest achievable minimum separation — a ratio of about 1.81 between each "
  "neighbour. Hue was then chosen per step to reinforce the lightness difference, and the "
  "brightness solved numerically to land on each target luminance.")

y -= 0.3*inch
text(0.75*inch, y, "PAIRWISE GREYSCALE CONTRAST", 8.5, "Helvetica-Bold", "#888888")
y -= 0.26*inch
names = [p[0] for p in PAL]; hexes = [p[1] for p in PAL]
cw = 1.25*inch
c.setFont("Helvetica", 8.5)
for j, n in enumerate(names):
    text(0.75*inch + 1.05*inch + j*cw, y, n[:10], 8, "Helvetica-Bold", "#666666")
y -= 0.16*inch
for i, n in enumerate(names):
    text(0.75*inch, y, n, 8, "Helvetica-Bold", "#666666")
    for j in range(len(names)):
        if j <= i:
            text(0.75*inch + 1.05*inch + j*cw, y, "—", 8.5, "Helvetica", "#cccccc")
        else:
            v = cr(hexes[i], hexes[j])
            text(0.75*inch + 1.05*inch + j*cw, y, f"{v:.2f}:1", 8.5,
                 "Helvetica-Bold" if v < 1.9 else "Helvetica", "#111111")
    y -= 0.19*inch
y -= 0.05*inch
para(0.75*inch, y, "Every pair, not merely adjacent ones, clears 1.81:1 in greyscale.",
     size=8.5, col="#666666")
c.showPage()

# ============================================================ page 2
text(0.75*inch, H-0.95*inch, "Proof", 20, "Helvetica-Bold")
text(0.75*inch, H-1.18*inch,
     "The same four colours, as five different viewers see them", 10.5, "Helvetica", "#666666")
rule(H-1.33*inch)

CONDS = ["normal","deuteranopia","protanopia","tritanopia","greyscale"]
y = H - 1.7*inch
sw2 = 1.25*inch
for cond in CONDS:
    text(0.75*inch, y, cond, 9, "Helvetica-Bold", "#444444")
    if cond != "normal":
        pct = {"deuteranopia":"~6% of men","protanopia":"~2% of men",
               "tritanopia":"very rare","greyscale":"print / projector"}[cond]
        text(0.75*inch, y-11, pct, 7.5, "Helvetica", "#999999")
    for i, (_, hx, _) in enumerate(PAL):
        x = 0.75*inch + 1.35*inch + i*(sw2+0.1*inch)
        c.setFillColor(HexColor(sim(hx, cond)))
        c.rect(x, y-14, sw2, 0.42*inch, stroke=0, fill=1)
    y -= 0.62*inch

y -= 0.05*inch
rule(y+0.2*inch)
text(0.75*inch, y-0.05*inch, "THE SAME DIAGRAM, IN EACH CONDITION", 8.5, "Helvetica-Bold", "#888888")
y -= 0.3*inch

def diagram(ox, oy, cond, w=2.05*inch):
    """A miniature of the deck's own strand diagram."""
    ink, blue, verm, amber = (sim(p[1], cond) for p in PAL)
    c.setLineWidth(1.6); c.setLineCap(1)
    c.setStrokeColor(HexColor(ink))                      # template
    c.line(ox, oy, ox+w, oy)
    c.line(ox+8, oy-5, ox, oy)                           # 3' barb
    c.setStrokeColor(HexColor(blue))                     # new strand
    c.line(ox, oy+11, ox+w*0.6, oy+11)
    c.line(ox+w*0.6-8, oy+16, ox+w*0.6, oy+11)
    c.setStrokeColor(HexColor(amber))                    # RNA
    c.line(ox+w*0.18, oy+24, ox+w*0.72, oy+24)
    c.setFillColor(HexColor(verm))                       # callout
    c.circle(ox+w*0.62, oy+11, 2.4, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 7); c.drawString(ox+w*0.66, oy+8, "5'")
    c.setFont("Helvetica", 7); c.setFillColor(HexColor("#888888"))
    c.drawString(ox, oy-20, cond)

for i, cond in enumerate(CONDS[:3]):
    diagram(0.75*inch + i*2.3*inch, y-0.35*inch, cond)
for i, cond in enumerate(CONDS[3:]):
    diagram(0.75*inch + i*2.3*inch, y-1.1*inch, cond)
y -= 1.55*inch

rule(y)
y -= 0.28*inch
text(0.75*inch, y, "KNOWN LIMITATION", 8.5, "Helvetica-Bold", "#ba3a13")
y -= 0.24*inch
y = para(0.75*inch, y,
  "Vermillion and amber both sit on the yellow pole. To a viewer with red-green colour-vision "
  "deficiency they differ ONLY in lightness — 1.81:1, which is perceptible, but it is not "
  "a hue difference. Never let those two alone carry a distinction that matters. This is not a "
  "defect of the palette; it is a property of dichromacy, and it is why WCAG 1.4.1 requires that "
  "colour never be the sole means of conveying information. Reinforce with position, label, "
  "line style, or the written description channel the deck already carries.")
y -= 10
para(0.75*inch, y,
  "Specified and implemented in style/palette.css. Regenerate this sheet with "
  "python _build_palette_pdf.py", size=8, col="#999999")
c.save()
print("wrote palette.pdf")
