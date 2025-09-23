"""Label rendering engine.

This module implements two main entry points used by the CLI:

- plan_pagination(...): parse inputs and compute how many pages/labels will be produced
- render(...): render labels to a paginated PDF, with optional per-label PNG previews

Dependencies (install via pip if needed):
    pandas, pyyaml, reportlab, pillow, segno (or qrcode as a fallback)
"""
from __future__ import annotations

import io
import math
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

# Third-party imports are optional until render-time
try:
    import yaml  # type: ignore
except Exception as e:  # pragma: no cover
    yaml = None

try:
    import pandas as pd  # type: ignore
except Exception as e:  # pragma: no cover
    pd = None

# ReportLab / PIL are used for PDF rendering
try:
    from reportlab.pdfgen import canvas as rl_canvas  # type: ignore
    from reportlab.lib.pagesizes import letter  # type: ignore
    from reportlab.pdfbase import pdfmetrics  # type: ignore
    from reportlab.pdfbase.ttfonts import TTFont  # type: ignore
    from reportlab.lib.utils import ImageReader  # type: ignore
except Exception as e:  # pragma: no cover
    rl_canvas = None
    letter = None
    pdfmetrics = None
    TTFont = None
    ImageReader = None

# Try segno for QR; fall back to qrcode
try:
    import segno  # type: ignore
except Exception:  # pragma: no cover
    segno = None

try:
    from PIL import Image  # type: ignore
except Exception:  # pragma: no cover
    Image = None


# -------------------------
# Layout and geometry types
# -------------------------
@dataclass
class SizeIn:
    width_in: float
    height_in: float

@dataclass
class PointIn:
    x_in: float
    y_in: float

@dataclass
class Grid:
    columns: int
    rows: int
    label_width_in: float
    label_height_in: float
    column_gap_in: float
    row_gap_in: float

@dataclass
class MarginsIn:
    top: float
    left: float

@dataclass
class QRSpec:
    size_in: float
    error_correction: str  # L, M, Q, H
    border_modules: int
    position: PointIn

@dataclass
class TextSpec:
    font: Optional[str]
    size_pt: float
    leading_pt: float
    wrap_width_in: float
    position: PointIn
    lines: List[str]

@dataclass
class ContentSpec:
    qr: QRSpec
    text: TextSpec

@dataclass
class PageSpec:
    width_in: float
    height_in: float
    dpi: int

@dataclass
class Layout:
    sheet_name: str
    page: PageSpec
    margins: MarginsIn
    grid: Grid
    safe_area: PointIn
    content: ContentSpec


# -------------------------
# Helpers
# -------------------------

def _in_to_px(value_in: float, dpi: int) -> int:
    return int(round(value_in * dpi))


def _read_yaml(path: Path) -> dict:
    if yaml is None:
        raise RuntimeError("pyyaml is not installed; cannot parse layout YAML")
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def _parse_layout(path: Path) -> Layout:
    data = _read_yaml(path)

    page = PageSpec(
        width_in=float(data["page"]["width_in"]),
        height_in=float(data["page"]["height_in"]),
        dpi=int(data["page"].get("dpi", 300)),
    )

    margins = MarginsIn(
        top=float(data.get("margins_in", {}).get("top", 0.0)),
        left=float(data.get("margins_in", {}).get("left", 0.0)),
    )

    grid = Grid(
        columns=int(data["grid"]["columns"]),
        rows=int(data["grid"]["rows"]),
        label_width_in=float(data["grid"]["label_width_in"]),
        label_height_in=float(data["grid"]["label_height_in"]),
        column_gap_in=float(data["grid"].get("column_gap_in", 0.0)),
        row_gap_in=float(data["grid"].get("row_gap_in", 0.0)),
    )

    safe_area = PointIn(
        x_in=float(data.get("safe_area_in", {}).get("x", 0.0)),
        y_in=float(data.get("safe_area_in", {}).get("y", 0.0)),
    )

    qr = data["content"]["qr"]
    qr_spec = QRSpec(
        size_in=float(qr.get("size_in", 0.7)),
        error_correction=str(qr.get("error_correction", "M")),
        border_modules=int(qr.get("border_modules", 2)),
        position=PointIn(
            x_in=float(qr["position"]["x_in"]),
            y_in=float(qr["position"]["y_in"]),
        ),
    )

    text = data["content"]["text"]
    text_spec = TextSpec(
        font=text.get("font"),
        size_pt=float(text.get("size_pt", 7)),
        leading_pt=float(text.get("leading_pt", 8.4)),
        wrap_width_in=float(text.get("wrap_width_in", 1.0)),
        position=PointIn(
            x_in=float(text["position"]["x_in"]),
            y_in=float(text["position"]["y_in"]),
        ),
        lines=list(text.get("lines", ["{display_name}", "{label_id}"])),
    )

    content = ContentSpec(qr=qr_spec, text=text_spec)

    return Layout(
        sheet_name=str(data.get("sheet_name", path.stem)),
        page=page,
        margins=margins,
        grid=grid,
        safe_area=safe_area,
        content=content,
    )


# -------------------------
# Registry ingestion
# -------------------------

def _load_registry(path: Path, query: Optional[str], limit: Optional[int], shuffle: bool) -> List[dict]:
    if pd is None:
        raise RuntimeError("pandas is required to read the registry CSV")
    df = pd.read_csv(path)

    # Basic required fields; more can be added later
    required = ["label_id", "display_name", "qr_payload"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Registry missing required columns: {missing}")

    if query:
        df = df.query(query)
    if shuffle:
        df = df.sample(frac=1, random_state=42)
    if limit is not None:
        df = df.head(int(limit))

    records = df.to_dict(orient="records")
    return records


# -------------------------
# Pagination planning
# -------------------------

def _capacity_per_page(grid: Grid) -> int:
    return grid.columns * grid.rows


def _page_cell_origin_in(layout: Layout, col: int, row: int) -> Tuple[float, float]:
    # Upper-left origin in inches for a given cell
    x = (
        layout.margins.left
        + col * (layout.grid.label_width_in + layout.grid.column_gap_in)
    )
    y = (
        layout.page.height_in
        - layout.margins.top
        - (row + 1) * layout.grid.label_height_in
        - row * layout.grid.row_gap_in
    )
    return x, y


def plan_pagination(
    registry_path: Path,
    layout_path: Path,
    query: Optional[str] = None,
    limit: Optional[int] = None,
    shuffle: bool = False,
    start_offset: int = 0,
    max_pages: Optional[int] = None,
) -> Dict[str, int]:
    """Compute pagination facts without rendering."""
    layout = _parse_layout(layout_path)
    rows = _load_registry(registry_path, query=query, limit=limit, shuffle=shuffle)

    capacity = _capacity_per_page(layout.grid)
    if start_offset < 0:
        start_offset = 0

    total_labels = start_offset + len(rows)
    pages = math.ceil(total_labels / capacity) if capacity else 0

    if max_pages is not None:
        pages = min(pages, max_pages)

    return {
        "items": len(rows),
        "capacity_per_page": capacity,
        "start_offset": start_offset,
        "pages": pages,
    }


# -------------------------
# Rendering
# -------------------------

def _ensure_font(font_dir: Optional[Path], font_name: Optional[str]) -> Optional[str]:
    if not font_name or pdfmetrics is None or TTFont is None:
        return None
    # Resolve absolute path if provided; otherwise look under font_dir
    font_path = Path(font_name)
    candidates: List[Path] = []
    if font_path.is_file():
        candidates.append(font_path)
    if font_dir:
        candidates.append(font_dir / font_name)
    # Try common system locations as a last resort
    if font_path.suffix.lower() != ".ttf":
        # For simplicity only register TTF here
        return None
    for p in candidates:
        if p.is_file():
            try:
                pdfmetrics.registerFont(TTFont(p.stem, str(p)))
                return p.stem
            except Exception:
                continue
    return None


def _make_qr_image(data: str, pixel_size: int, border: int, error: str) -> Image:
    if Image is None:
        raise RuntimeError("Pillow is required for QR image composition")
    # Prefer segno for crisp QR generation
    if segno is not None:
        # Map error correction
        err_map = {"L": "L", "M": "M", "Q": "Q", "H": "H"}
        ec = err_map.get(error.upper(), "M")
        qr = segno.make(data, error=ec, border=border)
        # segno can export to a PIL image via PNG bytes
        buf = io.BytesIO()
        qr.save(buf, kind="png", scale=1, border=border)
        buf.seek(0)
        return Image.open(buf).convert("RGBA")
    # Fallback to qrcode if segno is not available
    try:  # pragma: no cover
        import qrcode  # type: ignore
        from qrcode.constants import ERROR_CORRECT_L, ERROR_CORRECT_M, ERROR_CORRECT_Q, ERROR_CORRECT_H
        ec_map = {
            "L": ERROR_CORRECT_L,
            "M": ERROR_CORRECT_M,
            "Q": ERROR_CORRECT_Q,
            "H": ERROR_CORRECT_H,
        }
        qr = qrcode.QRCode(
            version=None,
            error_correction=ec_map.get(error.upper(), ERROR_CORRECT_M),
            box_size=10,
            border=border,
        )
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
        # Resize to requested pixel_size
        return img.resize((pixel_size, pixel_size))
    except Exception as e:
        raise RuntimeError("Install segno or qrcode to generate QR codes") from e


def _draw_wrapped_text(c, text_spec: TextSpec, layout: Layout, cell_x_in: float, cell_y_in: float):
    if pdfmetrics is None:
        raise RuntimeError("reportlab is required for text rendering")

    wrap_width_px = _in_to_px(text_spec.wrap_width_in, layout.page.dpi)
    x_px = _in_to_px(cell_x_in + text_spec.position.x_in + layout.safe_area.x_in, layout.page.dpi)
    y_top_in = cell_y_in + text_spec.position.y_in + layout.safe_area.y_in
    y_px = _in_to_px(y_top_in, layout.page.dpi)

    # Build the text block
    font_name = _ensure_font(None, text_spec.font) or "Helvetica"
    c.setFont(font_name, text_spec.size_pt)

    def wrap_line(s: str) -> List[str]:
        # naive width-based wrapper using string length approximation; for tighter control use reportlab platypus later
        words = s.split()
        lines: List[str] = []
        cur = ""
        # Approximate: 0.5 * font_size pixels per character as an empirical factor for Helvetica
        # For succinctness we keep it simple here
        max_chars = max(1, int(wrap_width_px / max(text_spec.size_pt * 0.6, 1)))
        for w in words:
            if not cur:
                cur = w
            elif len(cur) + 1 + len(w) <= max_chars:
                cur += " " + w
            else:
                lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        return lines

    lines_to_draw: List[str] = []
    for template in text_spec.lines:
        line = template
        lines_to_draw.extend(wrap_line(line))

    # Draw lines top-down with leading
    cur_y_px = y_px
    for ln in lines_to_draw:
        c.drawString(x_px, cur_y_px, ln)
        cur_y_px -= text_spec.leading_pt


def _draw_one_label(c, layout: Layout, item: dict, col: int, row: int):
    # Upper-left corner of this cell in inches
    cell_x_in, cell_y_in = _page_cell_origin_in(layout, col, row)

    # 1) QR code
    if ImageReader is None:
        raise RuntimeError("reportlab is required to place images")

    qr_px = _in_to_px(layout.content.qr.size_in, layout.page.dpi)
    qr_img = _make_qr_image(
        data=str(item.get("qr_payload", "")),
        pixel_size=qr_px,
        border=layout.content.qr.border_modules,
        error=layout.content.qr.error_correction,
    )
    # Convert to ImageReader for reportlab
    buf = io.BytesIO()
    qr_img.save(buf, format="PNG")
    buf.seek(0)
    rl_img = ImageReader(buf)

    qr_x_in = cell_x_in + layout.content.qr.position.x_in + layout.safe_area.x_in
    qr_y_in = cell_y_in + layout.content.qr.position.y_in + layout.safe_area.y_in

    c.drawImage(
        rl_img,
        _in_to_px(qr_x_in, layout.page.dpi),
        _in_to_px(qr_y_in, layout.page.dpi),
        width=_in_to_px(layout.content.qr.size_in, layout.page.dpi),
        height=_in_to_px(layout.content.qr.size_in, layout.page.dpi),
        mask='auto',
    )

    # 2) Text (formatted templates)
    # Expand the text templates with available keys from the record
    expanded = {k: ("" if v is None else v) for k, v in item.items()}
    layout.content.text.lines = [s.format(**expanded) for s in layout.content.text.lines]
    _draw_wrapped_text(c, layout.content.text, layout, cell_x_in, cell_y_in)



def render(
    registry_path: Path,
    layout_path: Path,
    out_pdf: Path,
    preview_dir: Optional[Path] = None,
    query: Optional[str] = None,
    limit: Optional[int] = None,
    shuffle: bool = False,
    start_offset: int = 0,
    max_pages: Optional[int] = None,
    dpi: Optional[int] = None,
    font_dir: Optional[Path] = None,
) -> None:
    """Render labels to a PDF, optionally emitting per-label PNG previews.

    The coordinate system is defined in *inches* in the layout YAML, converted to pixels via DPI.
    """
    if rl_canvas is None or letter is None:
        raise RuntimeError("reportlab is required for PDF rendering")

    layout = _parse_layout(layout_path)
    if dpi is not None:
        layout.page.dpi = int(dpi)

    rows = _load_registry(registry_path, query=query, limit=limit, shuffle=shuffle)
    capacity = _capacity_per_page(layout.grid)

    # Compose values used in format templates ahead of time
    # Do not mutate original records beyond adding default keys
    for r in rows:
        for k in ("label_id", "display_name", "qr_payload"):
            r.setdefault(k, "")

    out_pdf.parent.mkdir(parents=True, exist_ok=True)
    if preview_dir:
        preview_dir.mkdir(parents=True, exist_ok=True)

    # ReportLab uses points (1/72 in). We'll work in pixels and let drawImage handle pixels via width/height in pixels.
    page_width_px = _in_to_px(layout.page.width_in, layout.page.dpi)
    page_height_px = _in_to_px(layout.page.height_in, layout.page.dpi)
    c = rl_canvas.Canvas(str(out_pdf), pagesize=(page_width_px, page_height_px))

    # Optional font registration for text block
    _ = _ensure_font(font_dir, layout.content.text.font)

    # Start rendering
    idx = 0
    # If start_offset is used, we render blank cells up front
    total = len(rows)
    page_count = 0

    def next_cell_indices(n: int) -> Iterable[Tuple[int, int]]:
        for r in range(layout.grid.rows):
            for col in range(layout.grid.columns):
                yield (col, r)

    i = 0
    rendered = 0
    while i < total or (start_offset % capacity) != 0:
        if max_pages is not None and page_count >= max_pages:
            break

        # Draw cells row-major
        cells_iter = list(next_cell_indices(capacity))

        for cell_idx in range(capacity):
            col, row = cells_iter[cell_idx]
            global_cell_index = page_count * capacity + cell_idx
            if global_cell_index < start_offset:
                # leave it blank
                continue
            if i >= total:
                # out of items; leave blanks
                continue
            _draw_one_label(c, layout, rows[i], col, row)
            if preview_dir is not None and Image is not None:
                # Save a small preview for the single label
                preview = _make_qr_image(
                    data=str(rows[i].get("qr_payload", "")),
                    pixel_size=_in_to_px(layout.content.qr.size_in, layout.page.dpi),
                    border=layout.content.qr.border_modules,
                    error=layout.content.qr.error_correction,
                )
                preview_fp = preview_dir / f"{rows[i].get('label_id', f'label_{i:04d}')}.png"
                preview.save(preview_fp)
            i += 1
            rendered += 1

        c.showPage()
        page_count += 1
        if i >= total and (start_offset % capacity) == 0:
            break

    c.save()

    # Done.
