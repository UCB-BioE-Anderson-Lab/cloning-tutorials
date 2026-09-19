#!/usr/bin/env python3
"""
How many real E. coli genes does an internal-promoter checker reject, as a
function of where you put the cutoff?

The point of the demo is NOT the promoter model.  It is that a threshold you
cannot see the consequences of is a threshold you cannot defend: every gene in
this file is a real, transcribed, translated E. coli gene, so every one the
checker flags is a false positive by construction.

The PWM uses approximate per-position conservation for the sigma70 -35 and -10
hexamers.  It is a teaching simplification and it is labelled as one; for the
real build, substitute counts from RegulonDB and re-run.
"""
import sys, os, math, json

# Approximate per-position conservation of the consensus base.  The shape is
# what matters: -35 position 2 and -10 positions 1 and 6 are the conserved ones.
M35 = list(zip("TTGACA", [0.69, 0.79, 0.61, 0.56, 0.54, 0.54]))
M10 = list(zip("TATAAT", [0.77, 0.76, 0.60, 0.61, 0.56, 0.82]))
SPACER = range(15, 20)          # 15-19 bp between the hexamers
BG = 0.25

def logodds(motif):
    """Per-position {base: log2(p/bg)} for one hexamer."""
    cols = []
    for base, p in motif:
        other = (1.0 - p) / 3.0
        col = {b: math.log2(other / BG) for b in "ACGT"}
        col[base] = math.log2(p / BG)
        cols.append(col)
    return cols

PWM35, PWM10 = logodds(M35), logodds(M10)
MAXSCORE = sum(max(c.values()) for c in PWM35 + PWM10)

def hexscore(seq, i, pwm):
    s = 0.0
    for k, col in enumerate(pwm):
        b = seq[i + k]
        if b not in col:
            return None
        s += col[b]
    return s

def best_promoter_score(seq):
    """Highest-scoring -35/-10 pair anywhere in the sequence, either strand."""
    best = -1e9
    for strand in (seq, revcomp(seq)):
        n = len(strand)
        s35 = [hexscore(strand, i, PWM35) for i in range(n - 5)]
        s10 = [hexscore(strand, i, PWM10) for i in range(n - 5)]
        for i, a in enumerate(s35):
            if a is None:
                continue
            for gap in SPACER:
                j = i + 6 + gap
                if j < len(s10) and s10[j] is not None:
                    t = a + s10[j]
                    if t > best:
                        best = t
    return best

COMP = str.maketrans("ACGTacgt", "TGCAtgca")
def revcomp(s):
    return s.translate(COMP)[::-1]

def read_fasta(path, limit=None):
    name, buf = None, []
    for line in open(path):
        if line.startswith(">"):
            if name and buf:
                yield name, "".join(buf).upper()
                if limit and limit <= 0:
                    return
            name, buf = line[1:].split()[0], []
            if limit is not None:
                limit -= 1
                if limit < 0:
                    return
        else:
            buf.append(line.strip())
    if name and buf:
        yield name, "".join(buf).upper()

def main():
    path = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else None
    scores = []
    for i, (name, seq) in enumerate(read_fasta(path, limit)):
        if len(seq) < 40 or set(seq) - set("ACGT"):
            continue
        scores.append(best_promoter_score(seq))
        if i % 400 == 0:
            print(f"  scored {i}...", file=sys.stderr)
    scores.sort()
    n = len(scores)
    print(f"\ngenes scored: {n}   max possible PWM score: {MAXSCORE:.1f}\n")
    print(f"{'cutoff':>8}  {'genes flagged':>14}  {'false-positive rate':>20}")
    print("  " + "-" * 46)
    rows = []
    lo, hi = math.floor(min(scores)), math.ceil(MAXSCORE)
    t = lo
    while t <= hi:
        flagged = sum(1 for s in scores if s >= t)
        rate = flagged / n
        rows.append({"cutoff": round(t, 1), "flagged": flagged, "rate": rate})
        print(f"{t:8.1f}  {flagged:14,}  {rate:19.1%}")
        t += 1.0
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sweep.json")
    json.dump({"n": n, "max_score": MAXSCORE, "rows": rows,
               "scores": [round(x, 3) for x in scores]}, open(out, "w"))
    print(f"\nwrote {out}")

if __name__ == "__main__":
    main()
