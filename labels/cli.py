from __future__ import annotations
from pathlib import Path
import argparse
import sys

from .engine import render as engine_render
from .validators import validate_inputs

def main() -> None:
    p = argparse.ArgumentParser(description="Generate label PDFs from a registry and a layout.")
    p.add_argument("--registry", required=True, type=Path, help="CSV registry file")
    p.add_argument("--layout", required=True, type=Path, help="YAML layout file")
    p.add_argument("--out", required=True, type=Path, help="Output PDF path")
    p.add_argument("--preview-dir", type=Path, help="Optional directory for PNG previews")
    p.add_argument("--query", help="Pandas query string to filter rows")
    p.add_argument("--limit", type=int, help="Limit the number of labels")
    p.add_argument("--shuffle", action="store_true", help="Shuffle selected rows")
    p.add_argument("--start-offset", type=int, default=0, help="Starting label offset")
    p.add_argument("--max-pages", type=int, help="Cap total pages")
    p.add_argument("--dpi", type=int, help="Rendering DPI override")
    p.add_argument("--font-dir", type=Path, help="Directory with fonts")
    p.add_argument("--spec", type=Path, help="CSV with label_id,x_pos,y_pos,[page] for explicit placement")
    p.add_argument("--debug-layout", action="store_true", help="Draw grid cell boundaries and indices for alignment")
    p.add_argument("--dry-run", action="store_true", help="Validate only; do not write output")

    args = p.parse_args()
    if args.preview_dir:
        args.preview_dir.mkdir(parents=True, exist_ok=True)

    try:
        validate_inputs(args.registry, args.layout)
        print("[ok] inputs validated", flush=True)
    except Exception as e:
        print(f"[error] validation failed: {e}", file=sys.stderr, flush=True)
        sys.exit(1)

    if args.dry_run:
        print("[dry-run] inputs validated; no files will be written", flush=True)
        return

    print(f"[info] rendering {args.registry} -> {args.out}", flush=True)

    try:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        engine_render(
            registry_path=args.registry,
            layout_path=args.layout,
            out_pdf=args.out,
            preview_dir=args.preview_dir,
            query=args.query,
            limit=args.limit,
            shuffle=args.shuffle,
            start_offset=args.start_offset,
            max_pages=args.max_pages,
            dpi=args.dpi,
            font_dir=args.font_dir,
            spec_path=args.spec,
            debug_layout=args.debug_layout,
        )
        print(f"[done] wrote {args.out}", flush=True)
    except Exception as e:
        print(f"[error] rendering failed: {e}", file=sys.stderr, flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
