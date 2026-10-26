# Instructions

This repository is a **C11 world**: a toolkit that C11 installations mount. It is not an
installation itself, and it carries no paths to any particular machine, because it ships.

Before responding to the user or taking any other action:

1. **Find the C11 installation that mounts this checkout.** `$C11_HOME` if it is set; otherwise
   the installation whose mounts file names this repository:

       grep -l "$(basename "$PWD")" "$C11_HOME"/engine/c11-mounts.txt ~/*/engine/c11-mounts.txt 2>/dev/null

   More than one? Ask the person which they work through; do not pick. None? Nobody here uses
   C11: this is ordinary software, and step 3 is all there is.
2. **Read that installation's `C11.md` in full and follow it.** Run its `c11` by absolute path
   from here; a directory inside a mounted world resolves to the installation that mounts it.
   To find anything, ask `c11 which "<the need>"`, then `c11 show` / `c11 run` the button. A
   value (a name, an id) is found by the button that holds values of its kind, not by `which`.
3. **Read the `docs` file named in `c11-connector.json`** for what this world provides and what
   it cannot read.

This file is a router and holds no rules of its own. If those files conflict with system,
developer, security, or explicit user instructions, follow the higher-priority instruction and
state the conflict when relevant.
