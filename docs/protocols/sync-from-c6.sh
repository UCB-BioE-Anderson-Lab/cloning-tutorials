#!/bin/bash
# sync-from-c6.sh — copy the protocol library from C6-Multiplatform into this site.
#
#     bash docs/protocols/sync-from-c6.sh            # copy
#     bash docs/protocols/sync-from-c6.sh --check    # report drift, change nothing (exit 1 if any)
#
# WHY THE PROTOCOLS LIVE IN C6 AND NOT HERE. JCA, 2026-09-10: *"C6 is just straight up synbiol
# tools with no interface stuff, and no experiment-specific detail. Ideally, everything is in
# C6-Multiplatform such that a clotho given C6-Multiplatform knows how to write labsheets,
# manage a project folder."* A protocol module — what a Zymo cleanup is, how long a gel runs —
# is domain knowledge any lab would want. The renderer that draws it on a page is interface, and
# interface stays here.
#
# WHY A COPY RATHER THAN A CDN IMPORT. jsDelivr can serve these straight from GitHub, and that
# was the first plan. It was dropped: this is live teaching material with a class running against
# it, and swapping a same-origin relative import for a third-party CDN trades a guarantee for a
# dependency. Students lose their protocols if the CDN is slow, blocked on a campus network, or
# caching an old commit. The copy keeps the page byte-identical to what it does today.
#
# SO `modules/`, `index.json` and `TIMING.txt` HERE ARE GENERATED. Edit them in C6 and re-run
# this. `--check` in CI (or before a deploy) catches the drift that a vendored copy otherwise
# accumulates silently.

set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
C6="${C6_HOME:-$HOME/Documents/GitHub/C6-Multiplatform}"
SRC="$C6/src/labplanner/protocols"

if [ ! -d "$SRC" ]; then
  # Not a warning. A missing source means this copy cannot be verified against anything, and a
  # silent success would leave a stale vendored library looking freshly synced.
  echo "  sync-from-c6: no protocol library at $SRC" >&2
  echo "  set C6_HOME, or clone C6-Multiplatform beside this repo" >&2
  exit 2
fi

check_only=0
[ "${1:-}" = "--check" ] && check_only=1

drift=0
for rel in index.json TIMING.txt; do
  if ! diff -q "$SRC/$rel" "$HERE/$rel" >/dev/null 2>&1; then
    drift=1
    [ "$check_only" = "1" ] && echo "  DRIFT  $rel"
    [ "$check_only" = "0" ] && cp "$SRC/$rel" "$HERE/$rel"
  fi
done

if ! diff -rq "$SRC/modules" "$HERE/modules" >/dev/null 2>&1; then
  drift=1
  if [ "$check_only" = "1" ]; then
    diff -rq "$SRC/modules" "$HERE/modules" 2>&1 | sed 's/^/  DRIFT  /'
  else
    rm -rf "$HERE/modules"
    cp -R "$SRC/modules" "$HERE/modules"
  fi
fi

n=$(ls "$HERE/modules"/*.js 2>/dev/null | wc -l | tr -d ' ')
if [ "$check_only" = "1" ]; then
  if [ "$drift" = "1" ]; then
    echo "  the vendored protocol library differs from C6. Run without --check to update."
    exit 1
  fi
  echo "  in sync with $SRC ($n modules)"
  exit 0
fi

echo "  synced $n protocol module(s) from $SRC"
