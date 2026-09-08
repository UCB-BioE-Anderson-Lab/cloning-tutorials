#!/bin/sh
# Build the two PDFs of the DNA Manipulation Enzymes deck.
#   ./make_pdf.sh [outdir]      default: ~/Downloads
# Needs a running `mkdocs serve` on 127.0.0.1:8000, Google Chrome, and
# puppeteer-core (installed into a scratch dir here if missing).
set -e
DIR=$(cd "$(dirname "$0")" && pwd)
OUT=${1:-$HOME/Downloads}
WORK=$(mktemp -d)
cd "$WORK"
npm install --silent --no-fund --no-audit puppeteer-core >/dev/null
node "$DIR/pdf_capture.js" "$WORK/frames"
python3 "$DIR/pdf_assemble.py" "$WORK/frames" "$OUT"
echo "PDFs written to $OUT"
