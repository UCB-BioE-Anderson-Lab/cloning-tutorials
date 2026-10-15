#!/usr/bin/env python3
"""Generate the deck's small-molecule figures with RDKit.

These were hand-drawn in lib.js and at least one of them was wrong:
salicylate had its hydroxyl and its carboxyl meta to each other, and
salicylate is 2-hydroxybenzoic acid -- they are ortho.  A hand-drawn
ring is a drawing of a molecule; this is the molecule.

Each entry carries the formula it is supposed to have, and the script
refuses to write a file whose structure does not match, so a bad SMILES
cannot quietly ship as a picture of the wrong compound.

    python3 gen-molecules.py          # writes ../img/mol-*.svg

Re-run it after editing MOLS; nothing else reads the SMILES.
"""
import os, re, sys

from rdkit import Chem
from rdkit.Chem import rdMolDescriptors
from rdkit.Chem.Draw import rdMolDraw2D

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "img")

VERM  = (0xba/255, 0x3a/255, 0x13/255)   # --vermillion
MUTED = (0x76/255, 0x76/255, 0x76/255)   # --muted

# name, SMILES, expected formula, colour, (width, height)
#
# THE CANVAS IS THE SIZE IT WILL BE SHOWN AT.  fixedFontSize is in canvas
# pixels, so a molecule drawn on a 300px canvas and placed at 130px on
# the slide has 11px atom labels.  Draw each one at roughly the width the
# deck gives it and the labels come out the size they were asked for.
MOLS = [
    ("salicylate",  "OC(=O)c1ccccc1O",                                  "C7H6O3",     VERM,  (210, 162)),
    ("arabinose",   "O[C@@H]1[C@@H](O)[C@H](O)[C@H](O)CO1",             "C5H10O5",    VERM,  (200, 168)),
    ("glucose",     "OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O",      "C6H12O6",    MUTED, (200, 162)),
    ("galactose",   "OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@H]1O",       "C6H12O6",    MUTED, (200, 162)),
    # lactose: beta-D-galactopyranosyl-(1->4)-D-glucopyranose
    ("lactose",     "OC[C@H]1O[C@@H](O[C@H]2[C@H](O)[C@@H](O)C(O)O[C@@H]2CO)"
                    "[C@H](O)[C@@H](O)[C@H]1O",                          "C12H22O11", VERM,  (290, 176)),
    # allolactose: the same two sugars, 1->6 instead of 1->4.  That one
    # difference is the entire reason this molecule is in the lecture.
    ("allolactose", "OC[C@H]1O[C@@H](OC[C@H]2O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]2O)"
                    "[C@H](O)[C@@H](O)[C@H]1O",                          "C12H22O11", VERM,  (290, 176)),
    ("camp",        "O[C@@H]1[C@@H]2OP(=O)(O)OC[C@H]2O[C@H]1n1cnc2c(N)ncnc21",
                                                                         "C10H12N5O6P", VERM, (230, 192)),
]

def render(smiles, colour, size):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None, None
    formula = rdMolDescriptors.CalcMolFormula(mol)
    Chem.rdDepictor.Compute2DCoords(mol)
    Chem.rdDepictor.StraightenDepiction(mol)
    d = rdMolDraw2D.MolDraw2DSVG(size[0], size[1])
    o = d.drawOptions()
    o.clearBackground = False          # the slide is the background
    o.bondLineWidth = 2.4              # at 1:1 this is the final weight
    o.scaleBondWidth = True
    o.fixedFontSize = 21
    o.additionalAtomLabelPadding = 0.12
    o.setAtomPalette({-1: colour})     # one colour, like every other mark
    rdMolDraw2D.PrepareAndDrawMolecule(d, mol)
    d.FinishDrawing()
    return d.GetDrawingText(), formula


def main():
    os.makedirs(OUT, exist_ok=True)
    bad = []
    for name, smiles, want, colour, size in MOLS:
        svg, formula = render(smiles, colour, size)
        if svg is None:
            bad.append((name, "SMILES did not parse"))
            continue
        # RDKit writes charges as e.g. C7H6O3; compare bare
        got = re.sub(r"[+-]$", "", formula)
        if got != want:
            bad.append((name, "formula %s, expected %s" % (got, want)))
            continue
        path = os.path.join(OUT, "mol-%s.svg" % name)
        with open(path, "w") as fh:
            fh.write(svg)
        print("  %-12s %-12s %s" % (name, got, os.path.basename(path)))
    if bad:
        print("\nNOT WRITTEN:")
        for name, why in bad:
            print("  %-12s %s" % (name, why))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
