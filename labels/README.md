# Labels Module

This folder contains code and resources for generating printable QR code labels from the registry CSV.

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
└── out/               # Generated outputs
    ├── pdf/           # Ready-to-print sheets
    └── previews/      # PNG previews for inspection
```

## Usage

Run the CLI to generate labels:

```bash
python -m labels.cli \
  --registry docs/assets/qr_registry.csv \
  --layout labels/layouts/s001.yaml \
  --out labels/out/pdf/labels_s001.pdf
```

Optional flags allow preview generation, row filtering, and dry-run validation.

## Workflow

1. **Edit the registry** (`docs/assets/qr_registry.csv`) to add new items.
2. **Tune the layout YAML** (`labels/layouts/s001.yaml`) to match your printer sheet.
3. **Generate a preview** using the CLI to verify alignment.
4. **Print the PDF** at 100% scale with no page scaling.

## Notes

- Always confirm alignment with a test print on plain paper.
- Update `fonts/` if you need specific fonts for text rendering.
- Extend `engine.py` if you add new content types beyond QR + text.
