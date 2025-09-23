# Labels Module

This folder contains code and resources for generating printable QR code labels from a registry CSV file, with customizable layouts and debug tools for precise alignment.

## Structure

```
labels/
├── README.md          # This file
├── cli.py             # Command-line interface for generating labels
├── engine.py          # Core rendering engine
├── validators.py      # CSV and layout validation logic
├── layouts/           # YAML files with sheet geometry and layout configs
│   └── s001.yaml
├── fonts/             # Optional custom fonts
├── examples/          # Example CSVs or layout files
│   └── spec_example.csv
├── S001_SI-LABEL-LS-0101.ai.pdf # Reference template file
└── out/               # Generated outputs
    ├── pdf/           # Ready-to-print sheets
    └── previews/      # PNG previews for inspection
```

## Setup

1. **Create and activate a virtual environment (recommended):**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   - If `requirements.txt` exists:
     ```bash
     pip install -r requirements.txt
     ```
   - Otherwise, install required packages directly:
     ```bash
     pip install reportlab pyyaml qrcode pillow
     ```

## Usage

Run the CLI to generate labels. Example with all main options:

```bash
python -m labels.cli \
  --registry docs/assets/qr_registry.csv \
  --layout labels/layouts/s001.yaml \
  --out labels/out/pdf/labels_s001.pdf \
  --spec labels/examples/spec_example.csv \
  --debug-layout
```

- `--registry`: Path to your registry CSV file.
- `--layout`: Path to your YAML layout configuration.
- `--out`: Output PDF file path.
- `--spec`: (Optional) CSV with explicit label placement (`label_id,x_pos,y_pos,page`).
- `--debug-layout`: (Optional) Draws light bounding boxes for alignment debugging.

Other optional flags allow preview generation, row filtering, and dry-run validation.

## Workflow

1. **Edit the registry CSV**  
   Update `docs/assets/qr_registry.csv` to add or modify label entries.

2. **(Optional) Create a spec file**  
   For explicit placement, create a spec CSV file like `labels/examples/spec_example.csv` with columns: `label_id,x_pos,y_pos,page`.

3. **Tune the layout YAML**  
   Adjust `labels/layouts/s001.yaml` to match your label sheet's geometry, margins, and spacing.

4. **Run the CLI with debug mode**  
   Use the `--debug-layout` flag to generate a PDF with visible bounding boxes, helping you verify alignment against a reference template (e.g., `S001_SI-LABEL-LS-0101.ai.pdf`).

5. **Check alignment**  
   Print the debug output on plain paper, overlay it on your actual label sheet or reference template to confirm correct positioning.

6. **Print at 100% scale**  
   Once alignment is confirmed, run the CLI without `--debug-layout` and print the final PDF at 100% scale (no page scaling).

## Notes

- The `--debug-layout` option draws light bounding boxes and guides to help debug alignment; these will **not** appear in the final prints if you omit the flag.
- Always confirm alignment with a test print on plain paper before using actual label sheets.
- Update the `fonts/` directory if you need specific fonts for text rendering.
- Extend `engine.py` if you add new content types beyond QR + text.

