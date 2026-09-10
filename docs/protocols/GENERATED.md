# `modules/`, `index.json` and `TIMING.txt` are generated — do not edit them here

**The protocol library lives in `C6-Multiplatform/src/labplanner/protocols/`.** JCA, 2026-09-10:
*"C6 is just straight up synbiol tools with no interface stuff, and no experiment-specific
detail."* What a Zymo cleanup is, and how long a gel runs, is domain knowledge any lab would
want. `renderer.js` and `protocols.md` — the page that draws it — are interface and belong here.

    bash docs/protocols/sync-from-c6.sh            copy the library in
    bash docs/protocols/sync-from-c6.sh --check    report drift, change nothing

**Why a vendored copy rather than importing from a CDN.** jsDelivr will serve these straight
from GitHub and that was the first plan. It was dropped: this is live teaching material with a
class running against it, and replacing a same-origin relative import with a third-party
dependency means students lose their protocols if the CDN is slow, blocked on a campus network,
or serving a cached commit. The copy keeps this page behaving exactly as it does today.

**The cost of that choice is drift, so `--check` exists.** Run it before a deploy. A vendored
copy nobody verifies is two libraries that agree only by luck.
