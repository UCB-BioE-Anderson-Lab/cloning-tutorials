"""Draw chemical structures as SVG, with RDKit, in the deck's own style.

  chemdraw.py reaction  out.svg SUB PROD [--enzyme X] [--cofactor-in A --cofactor-out B]
  chemdraw.py molecule  out.svg SMILES [--caption X] [--note i:text] [--isotope i:n]
  chemdraw.py grid      out.svg spec.json
  chemdraw.py scheme    out.svg spec.json

Why a tool and not a one-off: the source decks carry their structures as
low-resolution bitmaps lifted from papers and vendor pages, with type set
for a printed page.  Redrawing them makes the structures vector, the type
the deck's own, and — for a reaction — lets the substrate be laid out on
the PRODUCT's coordinates through their maximum common substructure, so
both sit in the same orientation and the only thing that moves is the
group the enzyme put there.  That alignment is the point of such a
picture; two independent depictions lose it.

Everything is drawn in ink rather than RDKit's element colours, to sit
with the rest of the deck's line art.

EVERY STRUCTURE IS CHECKED BY FORMULA.  The SMILES come from PubChem by
name, and each one's molecular formula is compared against the published
formula before it ships.  A grid spec may carry a "formula" per item and
this tool refuses to draw if one does not match.
"""
import argparse, json, os, re, sys
from rdkit import Chem
from rdkit.Chem import rdFMCS, rdDepictor, rdCoordGen
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem.rdMolDescriptors import CalcMolFormula
from rdkit.Geometry import Point2D

INK = "#111111"
FONT = "Helvetica Neue, Helvetica, Arial, sans-serif"

# ---------------------------------------------------------------- drawing

def parse(smiles, formula=None, what="structure", contains=()):
    """Parse, then refuse to draw anything that fails its own checks.

    A formula check alone is NOT enough.  A SMILES that reuses a ring
    closure digit already open — writing a sugar as [C@@H]1... inside a
    scaffold that opened 1 for a lactone — joins the two rings into one
    macrocycle while leaving every atom and bond count untouched, so the
    formula still matches and the picture is quietly wrong.  Hence
    --contains, which asserts the fragments that must actually be there."""
    m = Chem.MolFromSmiles(smiles)
    if m is None:
        sys.exit(f"could not parse the {what}: {smiles}")
    if formula:
        got = CalcMolFormula(m).replace("+", "").replace("-", "")
        if got != formula:
            sys.exit(f"{what}: formula is {got}, expected {formula}")
    for frag in contains or ():
        q = Chem.MolFromSmiles(frag) or Chem.MolFromSmarts(frag)
        if q is None:
            sys.exit(f"{what}: could not parse the --contains pattern {frag}")
        if not m.HasSubstructMatch(q):
            sys.exit(f"{what}: does not contain {frag}")
    return m

def render(mol, w, h, isotopes=None, locate=()):
    """One structure as SVG: the inner markup only, no frame, no background.

    Returns (markup, coords), coords being the drawing position of each
    atom index in `locate`.  Labels like alpha/beta/gamma are placed from
    those coordinates by the caller rather than through RDKit's atomNote,
    because RDKit draws its text as glyph paths from a font that has no
    Greek letters: the note lands in the SVG as an empty <path> and
    nothing shows.  Drawing them ourselves also puts them in the deck's
    own typeface, like every other label on the slide."""
    mol = Chem.Mol(mol)
    for i, n in (isotopes or {}).items():
        mol.GetAtomWithIdx(int(i)).SetIsotope(int(n))
    d = rdMolDraw2D.MolDraw2DSVG(w, h)
    o = d.drawOptions()
    o.clearBackground = False
    o.useBWAtomPalette()
    o.bondLineWidth = 2.2
    o.minFontSize = 15
    o.maxFontSize = 24
    o.annotationFontScale = 0.9
    o.additionalAtomLabelPadding = 0.07
    # RDKit's default 5% frame makes a structure paint noticeably smaller
    # than the tight crop it replaces; the slide supplies its own margin
    o.padding = 0.02
    d.DrawMolecule(rdMolDraw2D.PrepareMolForDrawing(mol))
    d.FinishDrawing()
    coords = {i: (d.GetDrawCoords(Point2D(0, 0)) if False else None) for i in ()}
    coords = {}
    for i in locate:
        pt = d.GetDrawCoords(int(i))
        coords[int(i)] = (round(pt.x, 1), round(pt.y, 1))
    svg = d.GetDrawingText()
    return re.sub(r"</svg>\s*$", "", svg[svg.index(">", svg.index("<svg")) + 1:]), coords

def frame(body, w, h):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}" font-family="{FONT}">\n'
            + "\n".join(body) + "\n</svg>\n")

def text(x, y, s, size=25, anchor="middle", fill=INK, weight=400):
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}">{s}</text>')

# -------------------------------------------------------------- reaction

def aligned(sub_smiles, prod_smiles, sub_formula=None, prod_formula=None):
    """2D coords for both, with the common core laid out identically."""
    a = parse(sub_smiles, sub_formula, "substrate")
    b = parse(prod_smiles, prod_formula, "product")
    rdDepictor.Compute2DCoords(b)
    rdDepictor.StraightenDepiction(b)
    mcs = rdFMCS.FindMCS([a, b], ringMatchesRingOnly=True, completeRingsOnly=True)
    patt = Chem.MolFromSmarts(mcs.smartsString)
    ma, mb = a.GetSubstructMatch(patt), b.GetSubstructMatch(patt)
    if ma and mb:
        conf = b.GetConformer()
        rdDepictor.Compute2DCoords(a, coordMap={
            ia: Point2D(conf.GetAtomPosition(ib).x, conf.GetAtomPosition(ib).y)
            for ia, ib in zip(ma, mb)})
    else:
        rdDepictor.Compute2DCoords(a)
    return a, b

def do_reaction(a):
    sub, prod = aligned(a.substrate, a.product)
    MW, MH, AW = a.mol_width, a.mol_height, a.arrow
    W = MW * 2 + AW
    ay = MH / 2                                   # the arrow sits on the ring centres
    # no dead band under the structures: the cofactor labels usually fit
    # inside the molecule box, and the frame only grows if they do not
    H = max(MH, ay + (118 if (a.cin or a.cout) else 30)) + 8
    x0, x1 = MW + 24, MW + AW - 24
    body = [f'<g>{render(sub, MW, MH)[0]}</g>',
            f'<g transform="translate({MW + AW},0)">{render(prod, MW, MH)[0]}</g>',
            f'<path d="M{x0} {ay}H{x1 - 16}" stroke="{INK}" stroke-width="3.2"/>',
            f'<path d="M{x1 - 20} {ay - 11}l22 11l-22 11z" fill="{INK}"/>']
    if a.enzyme:
        body.append(text((x0 + x1) / 2, ay - 16, a.enzyme))
    if a.cin or a.cout:
        cx0, cx1, dip = x0 + 34, x1 - 78, ay + 58
        body.append(f'<path d="M{cx0} {ay + 6}C{cx0 + 6} {dip} {cx1 - 6} {dip} {cx1} {ay + 18}" '
                    f'fill="none" stroke="{INK}" stroke-width="2.6"/>')
        body.append(f'<path d="M{cx1 - 11} {ay + 12}l13 16l3 -20z" fill="{INK}"/>')
        if a.cin:
            body.append(text(cx0 - 4, dip + 44, a.cin))
        if a.cout:
            body.append(text(cx1 + 4, dip + 44, a.cout))
    return frame(body, W, H)

# -------------------------------------------------------------- molecule

def pairs(items):
    return dict(p.split(":", 1) for p in (items or []))

def notes(items):
    """IDX:TEXT[:DX:DY] -> [(idx, text, dx, dy)], the offset defaulting below."""
    out = []
    for it in items or []:
        f = it.split(":")
        out.append((int(f[0]), f[1],
                    float(f[2]) if len(f) > 2 else 0.0,
                    float(f[3]) if len(f) > 3 else 38.0))
    return out

def do_molecule(a):
    m = parse(a.smiles, a.formula, "molecule", a.contains)
    # RDKit's own generator is the better default — it lays a sugar out as a
    # clean ring and keeps a long chain readable — but it tangles some fused
    # ring systems into what looks like a macrocycle.  CoordGen sorts those
    # out, and folds long chains, so it is opt-in per structure.
    (rdCoordGen.AddCoords if a.coordgen else rdDepictor.Compute2DCoords)(m)
    rdDepictor.StraightenDepiction(m)
    W, H = a.mol_width, a.mol_height
    ns = notes(a.note)
    cap = 44 if a.caption else 0
    markup, at = render(m, W, H, pairs(a.isotope), [n[0] for n in ns])
    body = [f'<g>{markup}</g>']
    for idx, label, dx, dy in ns:
        x, y = at[idx]
        body.append(text(x + dx, y + dy, label, size=a.note_size))
    if a.caption:
        body.append(text(W / 2, H + 30, a.caption, size=27, weight=700))
    return frame(body, W, H + cap)

# ------------------------------------------------------------------ grid

def do_grid(a):
    spec = json.load(open(a.spec, encoding="utf-8"))
    cw, ch = spec.get("cell", [430, 150])
    cap = spec.get("caption_height", 34)
    gap = spec.get("gap", 26)
    chip_h, title_h = 40, (54 if spec.get("title") else 0)
    blocks, x = [], 0
    for g in spec["groups"]:
        cols = g.get("cols", 1)
        rows = -(-len(g["items"]) // cols)
        blocks.append({"g": g, "x": x, "w": cols * cw, "cols": cols, "rows": rows})
        x += cols * cw + gap
    W = x - gap
    H = title_h + chip_h + 14 + max(b["rows"] for b in blocks) * (ch + cap) + 10
    body = []
    if spec.get("title"):
        body.append(f'<rect x="{W/2 - 150}" y="4" width="300" height="38" rx="5" '
                    f'fill="#e7e4dc"/>')
        body.append(text(W / 2, 31, spec["title"], size=26, weight=700))
    for b in blocks:
        g, bx = b["g"], b["x"]
        cx = bx + b["w"] / 2
        body.append(f'<rect x="{cx - 130}" y="{title_h + 2}" width="260" height="34" rx="5" '
                    f'fill="#e7e4dc"/>')
        body.append(text(cx, title_h + 26, g["title"], size=23, weight=700))
        for k, item in enumerate(g["items"]):
            m = parse(item["smiles"], item.get("formula"), item["name"],
                      item.get("contains"))
            rdDepictor.Compute2DCoords(m)
            rdDepictor.StraightenDepiction(m)
            ix = bx + (k % b["cols"]) * cw
            iy = title_h + chip_h + 14 + (k // b["cols"]) * (ch + cap)
            body.append(f'<g transform="translate({ix},{iy})">{render(m, cw, ch)[0]}</g>')
            body.append(text(ix + cw / 2, iy + ch + 26, item["name"], size=23))
    return frame(body, W, H)

# ----------------------------------------------------------------- scheme

def do_scheme(a):
    """Rows of substrate -> product + product, each structure captioned.

    `reaction` draws one substrate and one product; a hydrolysis has two
    products, and the source slides caption each structure under itself.
    The spec is a list of rows, each a list of items that are either a
    structure {smiles, formula?, contains?, caption?, scale?} or an
    operator {op: "arrow"|"plus"}.  Captions are a list of lines.

        {"cell": [430, 300], "cap_line": 27,
         "rows": [{"items": [...]}, {"items": [...]}]}
    """
    spec = json.load(open(a.spec, encoding="utf-8"))
    cw, ch = spec.get("cell", [430, 300])
    line = spec.get("cap_line", 27)
    opw = spec.get("op_width", 120)
    rgap = spec.get("row_gap", 40)

    def width(it):
        return opw if "op" in it else int(cw * it.get("scale", 1.0))

    W = max(sum(width(i) for i in r["items"]) for r in spec["rows"])
    caps = [max([len(i.get("caption", [])) for i in r["items"]] + [0])
            for r in spec["rows"]]
    heights = [ch + 14 + c * line for c in caps]
    H = sum(heights) + rgap * (len(spec["rows"]) - 1)

    body, y = [], 0
    for r, cap_n, rh in zip(spec["rows"], caps, heights):
        x = (W - sum(width(i) for i in r["items"])) / 2
        for it in r["items"]:
            w = width(it)
            if it.get("op") == "arrow":
                ay = y + ch / 2
                body.append(f'<path d="M{x + 18} {ay}H{x + w - 40}" stroke="{INK}" '
                            f'stroke-width="3.2"/>')
                body.append(f'<path d="M{x + w - 44} {ay - 11}l22 11l-22 11z" fill="{INK}"/>')
            elif it.get("op") == "plus":
                body.append(text(x + w / 2, y + ch / 2 + 13, "+", size=38))
            else:
                m = parse(it["smiles"], it.get("formula"),
                          it.get("caption", ["structure"])[0], it.get("contains"))
                (rdCoordGen.AddCoords if it.get("coordgen")
                 else rdDepictor.Compute2DCoords)(m)
                rdDepictor.StraightenDepiction(m)
                body.append(f'<g transform="translate({x},{y})">'
                            f'{render(m, w, ch)[0]}</g>')
                for k, ln in enumerate(it.get("caption", [])):
                    body.append(text(x + w / 2, y + ch + 24 + k * line, ln, size=23))
            x += w
        y += rh + rgap
    return frame(body, W, H)

# ------------------------------------------------------------------ main

def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    r = sub.add_parser("reaction"); r.set_defaults(fn=do_reaction)
    r.add_argument("out"); r.add_argument("substrate"); r.add_argument("product")
    r.add_argument("--enzyme", default="")
    r.add_argument("--cofactor-in", dest="cin", default="")
    r.add_argument("--cofactor-out", dest="cout", default="")
    r.add_argument("--arrow", type=int, default=300)

    m = sub.add_parser("molecule"); m.set_defaults(fn=do_molecule)
    m.add_argument("out"); m.add_argument("smiles")
    m.add_argument("--caption", default="")
    m.add_argument("--formula", default="")
    m.add_argument("--note", action="append", metavar="IDX:TEXT[:DX:DY]")
    m.add_argument("--note-size", type=int, default=26)
    m.add_argument("--contains", action="append", metavar="SMILES_OR_SMARTS",
                   help="refuse to draw unless this fragment is present")
    m.add_argument("--coordgen", action="store_true",
                   help="lay out with CoordGen, for tangled fused ring systems")
    m.add_argument("--isotope", action="append", metavar="IDX:MASS")

    g = sub.add_parser("grid"); g.set_defaults(fn=do_grid)
    g.add_argument("out"); g.add_argument("spec")

    c = sub.add_parser("scheme"); c.set_defaults(fn=do_scheme)
    c.add_argument("out"); c.add_argument("spec")

    for q in (r, m):
        q.add_argument("--mol-width", type=int, default=380)
        q.add_argument("--mol-height", type=int, default=330)

    a = p.parse_args()
    svg = a.fn(a)
    open(a.out, "w", encoding="utf-8").write(svg)
    wh = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
    print(f"{a.out}  {wh.group(1)}x{wh.group(2)}")

if __name__ == "__main__":
    main()
