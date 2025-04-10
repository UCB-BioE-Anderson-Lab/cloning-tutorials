# SynBio Project Tutorials - MkDocs Setup

## Introduction
This repository hosts the SynBio Project Tutorials: a modular series of interactive guides covering synthetic biology, cloning workflows, and project planning. The site is built using MkDocs and hosted via GitHub Pages.

## Installation

### 1. Clone and Set Up
Clone this repository and run the setup script:

```sh
git clone https://github.com/your-username/cloning-tutorials.git
cd cloning-tutorials
./setup.sh
```

This script creates a virtual environment and installs all dependencies.

### 2. Run Local Server
Start the live preview server:

```sh
mkdocs serve
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser.

## Usage

### Build Static Site
Convert markdown to HTML and output to the `site/` folder:

```sh
mkdocs build
```

### Deploy to GitHub Pages
Publish the static site:

```sh
mkdocs gh-deploy
```

Your site will be live at: `https://ucb-bioe-anderson-lab.github.io/cloning-tutorials/`  
(Note: despite the URL, this site hosts the SynBio Project Tutorials.)

## Project Structure

```
cloning-tutorials/
  ├── docs/              # Markdown files (your tutorials)
  │   ├── index.md       # Home page
  │   ├── tutorial1.md   # Example tutorial page (part of SynBio Project Tutorials)
  ├── mkdocs.yml         # MkDocs configuration
  ├── main.py            # Script to run MkDocs commands
  ├── requirements.txt   # List of dependencies
  ├── site/              # Auto-generated static site (DO NOT EDIT)
```

## Useful Links
- [MkDocs Documentation](https://www.mkdocs.org/)
- [MkDocs Material Theme](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Pages Guide](https://pages.github.com/)

## Notes
- Never edit the `site/` folder — it is auto-generated.
- Ensure you are inside the virtual environment when running commands.
