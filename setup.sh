#!/bin/bash

# Create virtual environment if it doesn't exist
if [ ! -d "mkdocs-env" ]; then
    python3 -m venv mkdocs-env
fi

# Inject env vars into the venv's activate script
ACTIVATE="mkdocs-env/bin/activate"
if ! grep -q "DYLD_LIBRARY_PATH" "$ACTIVATE"; then
    echo 'export DYLD_LIBRARY_PATH="/opt/homebrew/lib:$DYLD_LIBRARY_PATH"' >> "$ACTIVATE"
    echo 'export PKG_CONFIG_PATH="/opt/homebrew/lib/pkgconfig:$PKG_CONFIG_PATH"' >> "$ACTIVATE"
fi

# Activate and install dependencies
source "$ACTIVATE"
pip install -r requirements.txt