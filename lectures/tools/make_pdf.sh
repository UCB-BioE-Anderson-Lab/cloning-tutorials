#!/bin/sh
# Build the two PDFs of one lecture deck: slides, and slides with narration.
#   ./make_pdf.sh <deck-dir> [outdir]      outdir default: ~/Downloads
#   ./make_pdf.sh 01-dna-enzymes
#   ./make_pdf.sh 02-dna-fabrication
# The deck dir is a directory under docs/lectures/140L/.  The section list,
# the title and the output filenames all come from that deck's lecture.js,
# so there is no list to keep in step here.
# Needs a running `mkdocs serve` on 127.0.0.1:8000, Google Chrome, and
# puppeteer-core (installed into a scratch dir here if missing).
set -e
DIR=$(cd "$(dirname "$0")" && pwd)
DECK=${1:?usage: make_pdf.sh <deck-dir> [outdir]}
OUT=${2:-$HOME/Downloads}
WORK=$(mktemp -d)
cd "$WORK"
npm install --silent --no-fund --no-audit puppeteer-core >/dev/null
node "$DIR/pdf_capture.js" "$WORK/frames" "$DECK"
python3 "$DIR/pdf_assemble.py" "$WORK/frames" "$OUT"
echo "PDFs written to $OUT"
