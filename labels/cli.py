#!/usr/bin/env python3
import argparse
from pathlib import Path

try:
    # Module mode: python -m labels.cli
    from . import validators, engine  # type: ignore
except Exception:
    # Script mode: python labels/cli.py
    import validators  # type: ignore
    import engine  # type: ignore


def _add_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--registry", required=True, help="Path to qr_registry.csv")
    parser.add_argument("--layout", required=True, help="Path to layout YAML")
    parser.add_argument("--out", required=True, help="Output PDF path")
    parser.add_argument("--preview-dir", default=None, help="Optional dir for per-label PNG previews")
    parser.add_argument("--select", default=None, help="pandas-style query filter, e.g., \"type == 'Plasmid'\"")
    parser.add_argument("--limit", type=int, default=None, help="Max labels to render")
    parser.add_argument("--shuffle", action="store_true", help="Shuffle rows before pagination")
    parser.add_argument("--start-offset", type=int, default=0, help="Blank cells to skip at start (first page)")
    parser.add_argument("--max-pages", type=int, default=None, help="Limit pages rendered")
    parser.add_argument("--dpi", type=int, default=None, help="Override render DPI from layout YAML")
    parser.add_argument("--font-dir", default=None, help="Optional font directory")
    parser.add_argument("--dry-run", action="store_true", help="Validate and print pagination plan only")


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        prog="labels.cli",
        description="Generate printable label sheets from a registry CSV and a sheet layout YAML."
    )
    _add_args(parser)
    args = parser.parse_args(argv)

    registry_path = Path(args.registry)
    layout_path = Path(args.layout)
    out_pdf = Path(args.out)
    preview_dir = Path(args.preview_dir) if args.preview_dir else None
    font_dir = Path(args.font_dir) if args.font_dir else None

    try:
        validators.validate_inputs(
            registry_path=registry_path, layout_path=layout_path, font_dir=font_dir
        )
    except Exception as e:
        print(f"[error] Validation failed: {e}")
        return 2

    if args.dry_run:
        try:
            plan = engine.plan_pagination(
                registry_path=registry_path,
                layout_path=layout_path,
                query=args.select,
                limit=args.limit,
                shuffle=args.shuffle,
                start_offset=args.start_offset,
                max_pages=args.max_pages,
            )
            print("[dry-run] Pagination plan:")
            for k, v in plan.items():
                print(f"  {k}: {v}")
            return 0
        except Exception as e:
            print(f"[error] Dry-run planning failed: {e}")
            return 3

    try:
        engine.render(
            registry_path=registry_path,
            layout_path=layout_path,
            out_pdf=out_pdf,
            preview_dir=preview_dir,
            query=args.select,
            limit=args.limit,
            shuffle=args.shuffle,
            start_offset=args.start_offset,
            max_pages=args.max_pages,
            dpi=args.dpi,
            font_dir=font_dir,
        )
        print(f"[ok] Wrote {out_pdf}")
        if preview_dir:
            print(f"[ok] Previews in {preview_dir}")
        return 0
    except Exception as e:
        print(f"[error] Rendering failed: {e}")
        return 4


if __name__ == "__main__":
    raise SystemExit(main())