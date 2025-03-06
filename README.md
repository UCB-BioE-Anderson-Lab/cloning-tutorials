# Cloning Tutorials - MkDocs Setup

## Introduction
This repository hosts interactive cloning tutorials using MkDocs and GitHub Pages.

## Installation

### 1. Set Up a Virtual Environment  
Run the following commands in your terminal:

```sh
# Create and activate virtual environment (macOS/Linux)
python -m venv mkdocs-env
source mkdocs-env/bin/activate

# For Windows (Command Prompt)
mkdocs-env\Scripts\activate

# For Windows (PowerShell)
.\mkdocs-env\Scripts\Activate
```

### 2. Install Dependencies  
```sh
pip install mkdocs mkdocs-material
```

## Usage

### 1. Run Local Server (Live Preview)
```sh
python main.py serve
```
- Opens `http://127.0.0.1:8000/` in your browser.
- Live updates as you edit `.md` files.

### 2. Build Static Site (Convert Markdown to HTML)
```sh
python main.py build
```
- Generates the site in the `site/` folder.

### 3. Deploy to GitHub Pages
```sh
python main.py deploy
```
- Pushes the site to the `gh-pages` branch.
- Your site will be live at: `https://your-username.github.io/cloning-tutorials/`

## Project Structure

```
cloning-tutorials/
  ├── docs/              # Markdown files (your tutorials)
  │   ├── index.md       # Home page
  │   ├── tutorial1.md   # Example tutorial page
  ├── mkdocs.yml         # MkDocs configuration
  ├── main.py            # Script to run MkDocs commands
  ├── site/              # Auto-generated static site (DO NOT EDIT)
```

## Useful Links
- [MkDocs Documentation](https://www.mkdocs.org/)
- [MkDocs Material Theme](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Pages Guide](https://pages.github.com/)

## Notes
- Never edit the `site/` folder — it is auto-generated.
- Ensure you are inside the virtual environment when running commands.
