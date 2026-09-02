#!/usr/bin/env python3
"""
trace_lineart.py — vectorise line art into SVG cubic Beziers for the decks.

    python3 trace_lineart.py art.png --width 1180 --x 210 --y 470 > frag.svg

The tracer itself used to live in this file. It is now its own project, so
this is a thin front end over it that only supplies the slide defaults:

    https://github.com/UCB-BioE-Anderson-Lab/lineart-trace
    pip install git+https://github.com/UCB-BioE-Anderson-Lab/lineart-trace

Every flag of the `lineart-trace` command works here unchanged; run
`python3 trace_lineart.py --help` for the full list. The only thing this
wrapper adds is --width defaulting to 1180, the slide coordinate width, so
the emitted <g> drops straight into a slide at the deck's scale.

Output is the bare <g>...</g> to stdout (paste it into a slide) and a
one-line summary to stderr. Add --svg for a standalone document instead.
"""
import os
import sys


def _load():
    """Import the package, or explain exactly how to get it."""
    try:
        from lineart_trace.cli import main
        return main
    except ImportError:
        pass
    # Convenience for working from a checkout sitting beside this repo, which
    # is how the package is usually developed. Installing it is the norm.
    here = os.path.dirname(os.path.abspath(__file__))
    sibling = os.path.normpath(
        os.path.join(here, "..", "..", "..", "..", "lineart-trace"))
    if os.path.isdir(os.path.join(sibling, "lineart_trace")):
        sys.path.insert(0, sibling)
        try:
            from lineart_trace.cli import main
            return main
        except ImportError:
            pass
    sys.exit(
        "trace_lineart: the lineart-trace package is not installed.\n"
        "  pip install git+https://github.com/UCB-BioE-Anderson-Lab/"
        "lineart-trace")


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if not any(a == "--width" or a.startswith("--width=") for a in argv):
        argv += ["--width", "1180"]        # slide coordinate width
    return _load()(argv)


if __name__ == "__main__":
    sys.exit(main())
