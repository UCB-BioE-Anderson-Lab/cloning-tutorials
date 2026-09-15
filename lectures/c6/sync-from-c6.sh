#!/bin/bash
# sync-from-c6.sh — copy the oligo-design library from C6-Multiplatform into the decks.
#
#     bash docs/lectures/c6/sync-from-c6.sh            # copy
#     bash docs/lectures/c6/sync-from-c6.sh --check    # report drift, change nothing (exit 1 if any)
#
# WHY THESE TWO FILES AND NOT A REIMPLEMENTATION.  The gene synthesis lecture has a PCA
# calculator on the slide, and the oligos it hands out have to be the oligos the students
# will get from the tool they are told to use.  A second implementation in the deck would
# be a second answer key, drifting quietly away from the first.  So the deck calls C6's own
# pca() -- the same function, byte for byte.
#
# WHY A COPY RATHER THAN A CDN IMPORT.  The same reasoning as docs/protocols/sync-from-c6.sh:
# this is live teaching material with a class running against it, and a third-party CDN that
# is slow, blocked on a campus network, or caching an old commit takes the lecture down.
# Same origin, vendored, no network beyond the page itself.
#
# SO THE .js FILES HERE ARE GENERATED.  Edit them in C6 and re-run this.  --check before a
# deploy: a vendored copy nobody verifies is two libraries that agree only by luck.
#
# C6-Oligos.js imports only from C6-Seq.js, and C6-Seq.js imports nothing, so the two files
# are the whole dependency.  If that ever stops being true this script will still copy two
# files and the page will fail on a missing import -- check the import lines when it breaks.

set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
C6="${C6_HOME:-$HOME/Documents/GitHub/C6-Multiplatform}"
SRC="$C6/src"
FILES="C6-Oligos.js C6-Seq.js"

if [ ! -d "$SRC" ]; then
  echo "  sync-from-c6: no C6 source at $SRC" >&2
  echo "  set C6_HOME, or clone C6-Multiplatform beside this repo" >&2
  exit 2
fi

check_only=0
[ "${1:-}" = "--check" ] && check_only=1

drift=0
for rel in $FILES; do
  if ! diff -q "$SRC/$rel" "$HERE/$rel" >/dev/null 2>&1; then
    drift=1
    if [ "$check_only" = "1" ]; then echo "  DRIFT  $rel"; else cp "$SRC/$rel" "$HERE/$rel"; fi
  fi
done

if [ "$check_only" = "1" ]; then
  if [ "$drift" = "1" ]; then
    echo "  the vendored oligo library differs from C6. Run without --check to update."
    exit 1
  fi
  echo "  in sync with $SRC"
  exit 0
fi
echo "  synced $(echo $FILES | wc -w | tr -d ' ') file(s) from $SRC"
