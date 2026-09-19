WHERE THE NUMBERS ON THE CALIBRATION SLIDE COME FROM
====================================================

The curve is a real computation over a real genome, and both of its inputs have
caveats a student may reasonably ask about in the room.

THE GENOME is E. coli K-12 MG1655, NCBI RefSeq GCF_000005845.2 (ASM584v2),
cds_from_genomic.fna.  4,318 coding sequences, of which 4,310 survive the filter
(length >= 40, no ambiguity codes).  The FASTA is ~4 MB and is NOT in this repo --
everything under docs/ ships to the public site on every deploy, and this file is
one wget away:

  https://ftp.ncbi.nlm.nih.gov/genomes/all/GCF/000/005/845/
    GCF_000005845.2_ASM584v2/GCF_000005845.2_ASM584v2_cds_from_genomic.fna.gz

sigma70_sweep.json is the derived result and IS here, because it is small and
because the slide reads from it.

THE PWM IS A TEACHING SIMPLIFICATION, and this matters if anyone asks.  It uses
approximate per-position conservation for the -35 (TTGACA) and -10 (TATAAT)
hexamers with a 15-19 bp spacer.  The shape is right -- -35 position 2 and -10
positions 1 and 6 carry the most information -- but the values are not counts
from an aligned promoter set.  For a published number, substitute RegulonDB
counts and re-run; the curve will move, the argument will not, because the
argument is about the SHAPE: the cliff between 8 and 12, and the fact that an
intuitive cutoff of half the maximum throws out three quarters of a working
genome.

Say this out loud when you present it.  A lecture whose thesis is that you must
be able to defend your numbers should not quietly ship an undefended one.

TO REGENERATE
-------------
    python3 threshold_sweep.py <path to cds_from_genomic.fna>

Writes sigma70_sweep.json beside the script (~12 s for the full genome).  The
chart SVG is inline in 04-calibration.html; the generator that produced it lives
with the course plan, not here.

WHAT THE SLIDE DELIBERATELY DOES NOT SHOW
-----------------------------------------
False positives only.  This genome has no true positives in it to miss, so it
cannot tell you that a cutoff of 16 -- which flags nothing and catches nothing --
is useless.  The last slide of the section says so explicitly and hands the other
half of the problem to Checkers II, where the J23100 family is the positive set.
