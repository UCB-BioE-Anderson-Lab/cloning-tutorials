from __future__ import annotations

from pathlib import Path
from typing import Optional, Set
import csv
import yaml
import string


def _fail_if_missing(path: Path, what: str) -> None:
    if not path.exists():
        raise FileNotFoundError(f"{what} not found: {path}")


def _require_keys(obj: dict, keys: Set[str], ctx: str) -> None:
    missing = [k for k in keys if k not in obj]
    if missing:
        raise ValueError(f"Layout YAML missing keys in {ctx}: {missing}")


def _extract_template_fields(lines) -> Set[str]:
    fields: Set[str] = set()
    for s in (lines or []):
        for lit_text, field_name, fmt_spec, conv in string.Formatter().parse(str(s)):
            if field_name:
                fields.add(field_name)
    return fields


def validate_inputs(
    registry_path: Path,
    layout_path: Path,
    font_dir: Optional[Path] = None,
    spec_path: Optional[Path] = None,
) -> None:
    """Fast, opinionated checks for the registry CSV, layout YAML, and optional spec CSV.

    Raises on hard failures; prints concise warnings for soft issues.
    """
    # Paths
    _fail_if_missing(registry_path, "Registry file")
    _fail_if_missing(layout_path, "Layout file")
    if font_dir is not None:
        _fail_if_missing(font_dir, "Font directory")

    # ---- YAML sanity ----
    with open(layout_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}

    # Required top-level sections
    for section in ("page", "grid", "content"):
        if section not in data:
            raise ValueError(f"Layout YAML missing '{section}' section")

    page = data["page"]
    grid = data["grid"]
    content = data["content"]

    _require_keys(page, {"width_in", "height_in"}, "page")
    _require_keys(grid, {"columns", "rows", "label_width_in", "label_height_in"}, "grid")

    # content.qr minimal
    if "qr" not in content:
        raise ValueError("Layout YAML missing 'content.qr' section")
    _require_keys(content["qr"], {"size_in", "position"}, "content.qr")
    _require_keys(content["qr"]["position"], {"x_in", "y_in"}, "content.qr.position")

    # content.text minimal (optional but recommended)
    if "text" in content:
        _require_keys(content["text"], {"position"}, "content.text")
        _require_keys(content["text"]["position"], {"x_in", "y_in"}, "content.text.position")

    # Basic numeric sanity
    if float(grid["columns"]) <= 0 or float(grid["rows"]) <= 0:
        raise ValueError("grid.columns and grid.rows must be > 0")

    # ---- CSV sanity ----
    with open(registry_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames or []
        headers_set = {h.strip() for h in headers}
        required = {"label_id", "display_name", "qr_payload"}
        if not required.issubset(headers_set):
            raise ValueError(
                f"Registry missing required columns: {sorted(required)}; got {headers}"
            )
        # read first two rows to ensure there is at least one item
        first_two = [next(reader, None), next(reader, None)]
        if all(r is None for r in first_two):
            raise ValueError("Registry appears to be empty (no data rows)")

    # ---- Optional spec CSV sanity ----
    if spec_path is not None:
        _fail_if_missing(spec_path, "Spec file")
        with open(spec_path, newline="", encoding="utf-8") as f:
            spec_reader = csv.DictReader(f)
            spec_headers = [h.strip().lower() for h in (spec_reader.fieldnames or [])]
            if not spec_headers:
                raise ValueError("Spec CSV has no header row")

            def _has_any(names: tuple[str, ...]) -> bool:
                return any(n in spec_headers for n in names)

            if "label_id" not in spec_headers:
                raise ValueError("Spec CSV must include 'label_id'")
            if not _has_any(("col", "column", "x_pos")):
                raise ValueError("Spec CSV must include a column index: one of col|column|x_pos")
            if not _has_any(("row", "y_pos")):
                raise ValueError("Spec CSV must include a row index: one of row|y_pos")
            # page is optional

    # ---- Soft check: template fields vs headers ----
    text_fields: Set[str] = set()
    try:
        if "text" in content:
            text_fields = _extract_template_fields(content["text"].get("lines", []))
    except Exception:
        # Non-fatal: if lines is not a list of strings, skip this advisory
        text_fields = set()

    unknown = sorted([f for f in text_fields if f not in headers_set])
    if unknown:
        print(
            f"[warn] Layout text templates reference fields not in registry: {unknown}",
            flush=True,
        )