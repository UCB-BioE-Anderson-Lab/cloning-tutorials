#!/usr/bin/env python3
"""The sequence-space landscape for sources 21 and 22 of the Directed
Evolution deck, as a contour map computed from a real function.

The source slides use a photograph of a rendered 3D terrain, borrowed and
uncredited.  A contour map is better anyway: the note calls it "a
topological landscape ... the height of each hill is functionality", and a
contour map is exactly that, readable on white, and ours to use.

The surface is a sum of Gaussians -- one per hill, with the three named
ones placed where the slide needs them.  Marching squares draws the
contours, so the lines are the actual level sets of the function and the
"hills" are real maxima, not drawing.
"""
import math

W, H = 1180, 560            # drawing box
NX, NY = 236, 112           # sample grid
HILLS = [   # x, y, height, width   (x,y in 0..1 of the box)
    (0.735, 0.235, 1.00, 0.085),   # RFP
    (0.605, 0.330, 0.93, 0.080),   # GFP
    (0.195, 0.420, 0.88, 0.090),   # phoA
    (0.345, 0.690, 0.72, 0.085),
    (0.520, 0.610, 0.62, 0.070),
    (0.830, 0.640, 0.80, 0.080),
    (0.105, 0.760, 0.55, 0.075),
    (0.455, 0.140, 0.58, 0.065),
    (0.900, 0.400, 0.50, 0.060),
    (0.255, 0.180, 0.46, 0.060),
    (0.660, 0.830, 0.52, 0.070),
    (0.955, 0.830, 0.44, 0.065),
    (0.400, 0.430, 0.38, 0.055),
    (0.760, 0.480, 0.34, 0.050),
]
NAMED = {"RFP": 0, "GFP": 1, "phoA": 2}

def f(u, v):
    return sum(h * math.exp(-(((u - cx) ** 2 + (v - cy) ** 2) / (2 * s * s)))
               for cx, cy, h, s in HILLS)

def grid():
    return [[f(i / (NX - 1), j / (NY - 1)) for i in range(NX)] for j in range(NY)]

def contours(g, level):
    """marching squares -> list of (x1,y1,x2,y2) in box coordinates"""
    segs = []
    def ip(a, b, va, vb):
        t = 0.5 if vb == va else (level - va) / (vb - va)
        return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
    for j in range(NY - 1):
        for i in range(NX - 1):
            p = [(i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)]
            v = [g[j][i], g[j][i + 1], g[j + 1][i + 1], g[j + 1][j and i or i]]
            v[3] = g[j + 1][i]
            idx = sum((1 << k) for k in range(4) if v[k] > level)
            if idx in (0, 15):
                continue
            e = []
            for k in range(4):
                a, b = k, (k + 1) % 4
                if (v[a] > level) != (v[b] > level):
                    e.append(ip(p[a], p[b], v[a], v[b]))
            for k in range(0, len(e) - 1, 2):
                (x1, y1), (x2, y2) = e[k], e[k + 1]
                segs.append((x1 / (NX - 1) * W, y1 / (NY - 1) * H,
                             x2 / (NX - 1) * W, y2 / (NY - 1) * H))
    return segs

def chain(segs):
    """Marching squares emits loose segments; stitching them into polylines
    cuts the path data by about four fifths, which matters when the result
    has to live in a slide deck."""
    ends = {}
    for s in segs:
        ends.setdefault((round(s[0], 1), round(s[1], 1)), []).append(s)
        ends.setdefault((round(s[2], 1), round(s[3], 1)), []).append(s)
    used, out = set(), []
    for i, s in enumerate(segs):
        if i in used:
            continue
        used.add(i)
        line = [(s[0], s[1]), (s[2], s[3])]
        for _ in range(2):                      # grow each end
            while True:
                k = (round(line[-1][0], 1), round(line[-1][1], 1))
                nxt = None
                for t in ends.get(k, []):
                    j = segs.index(t)
                    if j in used:
                        continue
                    nxt = (j, t); break
                if not nxt:
                    break
                j, t = nxt
                used.add(j)
                a, b = (t[0], t[1]), (t[2], t[3])
                line.append(b if (round(a[0], 1), round(a[1], 1)) == k else a)
            line.reverse()
        out.append(line)
    return out

def paths(levels=11):
    g = grid()
    hi = max(max(r) for r in g)
    out = []
    for k in range(1, levels + 1):
        lv = hi * k / (levels + 1)
        segs = contours(g, lv)
        if not segs:
            continue
        d = "".join("M" + " L".join(f"{x:.0f} {y:.0f}" for x, y in ln)
                    for ln in chain(segs) if len(ln) > 2)
        out.append((k / levels, d))          # 0..1 = how high this line is
    return out

def at(name):
    cx, cy, _, _ = HILLS[NAMED[name]]
    return cx * W, cy * H

def point(u, v):
    return u * W, v * H
