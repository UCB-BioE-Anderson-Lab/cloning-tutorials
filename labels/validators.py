from pathlib import Path
from typing import Optional
import csv
import yaml


def validate_inputs(
    registry_path: Path,
    layout_path: Path,
    font_dir: Optional[Path] = None,
) -> None:
    if not registry_path.exists():
        raise FileNotFoundError(f"Registry file not found: {registry_path}")
    if not layout_path.exists():
        raise FileNotFoundError(f"Layout file not found: {layout_path}")
    if font_dir is not None and not font_dir.exists():
        raise FileNotFoundError(f"Font directory not found: {font_dir}")

    # YAML sanity check
    with open(layout_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    for required in ["page", "grid", "content"]:
        if required not in data:
            raise ValueError(f"Layout YAML missing '{required}' section")

    # CSV sanity + required headers
    with open(registry_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames or []
        required_cols = {"label_id", "display_name", "qr_payload"}
        if not required_cols.issubset({h.strip() for h in headers}):
            raise ValueError(
                f"Registry missing required columns: {sorted(required_cols)}; got {headers}"
            )