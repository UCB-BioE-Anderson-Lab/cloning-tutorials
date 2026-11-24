#!/bin/bash
# sync-engine.sh -- refresh the vendored lecture-deck engine in this directory.
#
#     bash docs/lectures/sync-engine.sh            # copy
#     bash docs/lectures/sync-engine.sh --check    # report drift, change nothing (exit 1 if any)
#
# deck.js, deck.css, anim.js, style/guide.html and the generic tools/ are
# GENERATED from https://github.com/UCB-BioE-Anderson-Lab/lecture-deck and
# lecture-deck.txt beside this script names the commit.  Edit them there and
# re-run this.  Same reasoning as c6/sync-from-c6.sh: a vendored copy, same
# origin, so a class is never at the mercy of a CDN, and --check before a
# deploy.  style/palette.css and tools/deck-root.txt are this site's own.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LD="${LECTURE_DECK_HOME:-$HOME/Documents/GitHub/lecture-deck}"
if [ ! -x "$LD/bin/vendor" ]; then
  echo "  sync-engine: no lecture-deck at $LD" >&2
  echo "  set LECTURE_DECK_HOME, or clone lecture-deck beside this repo" >&2
  exit 2
fi
exec "$LD/bin/vendor" "$HERE" "$@"
