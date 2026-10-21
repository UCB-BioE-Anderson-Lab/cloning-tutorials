"""Draw a one-substrate, one-product reaction as an SVG, with RDKit.

  python3 draw_reaction.py out.svg <substrate-SMILES> <product-SMILES> \
          [--enzyme "caffeine synthase"] [--in AdoMet --out AdoHcy] \
          [--label-left theobromine --label-right caffeine]

Why a tool and not a one-off: the source decks carry these reactions as
low-resolution bitmaps lifted from papers, with type set for a printed
page.  Redrawing them means the structures are vector, the type is the
deck's own, and the two structures are drawn in the SAME orientation, so
the only thing that moves between substrate and product is the group the
enzyme put there.  That alignment is the whole point of the picture and a
pair of independently-laid-out depictions loses it.

The structures are drawn in ink, not RDKit's element colours, to sit with
the rest of the deck's line art.
"""
import re, sys, argparse
from rdkit import Chem
from rdkit.Chem import AllChem, rdFMCS, rdDepictor
from rdkit.Geometry import Point2D
from rdkit.Chem.Draw import rdMolDraw2D

INK = "#111111"

def aligned(sub_smiles, prod_smiles):
    """2D coords for both, with the common core laid out identically."""
    a = Chem.MolFromSmiles(sub_smiles)
    b = Chem.MolFromSmiles(prod_smiles)
    if a is None or b is None:
        sys.exit("could not parse a SMILES")
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

def render(mol, w, h):
    """One structure as SVG, in ink, with no background: inner markup + size."""
    d = rdMolDraw2D.MolDraw2DSVG(w, h)
    o = d.drawOptions()
    o.clearBackground = False
    o.useBWAtomPalette()
    o.bondLineWidth = 2.2
    o.minFontSize = 17
    o.maxFontSize = 24
    o.additionalAtomLabelPadding = 0.07
    rdMolDraw2D.PrepareAndDrawMolecule(d, mol)
    d.FinishDrawing()
    svg = d.GetDrawingText()
    return re.sub(r"</svg>\s*$", "", svg[svg.index(">", svg.index("<svg")) + 1:])

def main():
    p = argparse.ArgumentParser()
    p.add_argument("out"); p.add_argument("substrate"); p.add_argument("product")
    p.add_argument("--enzyme", default="")
    p.add_argument("--cofactor-in", dest="cin", default="")
    p.add_argument("--cofactor-out", dest="cout", default="")
    p.add_argument("--mol-width", type=int, default=380)
    p.add_argument("--mol-height", type=int, default=330)
    p.add_argument("--arrow", type=int, default=300)
    a = p.parse_args()

    sub, prod = aligned(a.substrate, a.product)
    MW, MH, AW = a.mol_width, a.mol_height, a.arrow
    W = MW * 2 + AW
    ay = MH / 2                                   # the arrow sits on the ring centres
    # no dead band under the structures: the cofactor labels usually fit
    # inside the molecule box, and the frame only grows if they do not
    H = max(MH, ay + (118 if (a.cin or a.cout) else 30)) + 8
    x0, x1 = MW + 24, MW + AW - 24

    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
           f'width="{W}" height="{H}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif">',
           f'<g transform="translate(0,0)">{render(sub, MW, MH)}</g>',
           f'<g transform="translate({MW + AW},0)">{render(prod, MW, MH)}</g>',
           f'<path d="M{x0} {ay}H{x1 - 16}" stroke="{INK}" stroke-width="3.2"/>',
           f'<path d="M{x1 - 20} {ay - 11}l22 11l-22 11z" fill="{INK}"/>']
    if a.enzyme:
        out.append(f'<text x="{(x0 + x1) / 2}" y="{ay - 16}" text-anchor="middle" '
                   f'font-size="25" fill="{INK}">{a.enzyme}</text>')
    if a.cin or a.cout:
        # the cofactor curve: up out of the substrate side, down into the product side
        cx0, cx1, dip = x0 + 34, x1 - 78, ay + 58
        out.append(f'<path d="M{cx0} {ay + 6}C{cx0 + 6} {dip} {cx1 - 6} {dip} {cx1} {ay + 18}" '
                   f'fill="none" stroke="{INK}" stroke-width="2.6"/>')
        out.append(f'<path d="M{cx1 - 11} {ay + 12}l13 16l3 -20z" fill="{INK}"/>')
        if a.cin:
            out.append(f'<text x="{cx0 - 4}" y="{dip + 44}" text-anchor="middle" '
                       f'font-size="25" fill="{INK}">{a.cin}</text>')
        if a.cout:
            out.append(f'<text x="{cx1 + 4}" y="{dip + 44}" text-anchor="middle" '
                       f'font-size="25" fill="{INK}">{a.cout}</text>')
    out.append("</svg>")
    open(a.out, "w", encoding="utf-8").write("\n".join(out))
    print(f"{a.out}  {W}x{H}")

if __name__ == "__main__":
    main()
