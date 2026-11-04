# cloning-tutorials

**The lab's teaching site, and with it the model of B144 itself: every named storage unit and what may be opened by a student, the materials in them with the synonyms people actually say out loud ("green tube", "B buffer"), the consumables with their targets and reorder sources, the chemicals, the benches and the equipment. The protocols and thermocycler programs here are vendored from C6-Multiplatform and belong to it; what is this world's own is the room.** A session opened here is this toolkit's agent: working on it, or using it.

## Using it on its own

Nothing below needs C11. `README.md` says how to run it. Its records are plain files in `sharables/` — read them
directly — and its programs are in `bin/`. `docs/C11-CONNECTOR.md` describes what it provides.

## Optional: a C11 installation as a backend

This repository is also a **C11 world**: a toolkit that C11 installations mount. An installation
is a backend you may call, not what this toolkit is. With one, every record here becomes
searchable by need and runnable by id; without one, there is nothing more to do.

1. **Find the installation that mounts this checkout.** `$C11_HOME` if it is set; otherwise the
   one whose mounts file names this repository:

       grep -l "$(basename "$PWD")" "$C11_HOME"/engine/c11-mounts.txt ~/*/engine/c11-mounts.txt 2>/dev/null

   More than one? Ask the person which they work through; do not pick. None? There is no backend
   here, and that is a complete answer.
2. **Read that installation's `C11.md` for its verbs** — as the manual for a backend, not as a
   description of you (C11 spec/mounting.md § 15.2). Run its `c11` by absolute path from here; a
   directory inside a mounted world resolves to the installation that mounts it. Ask
   `c11 which "<the need>"` for a button, `c11 find <schema> field=value` for a record, then
   `c11 show` / `c11 run`. Do not go on to its `INSTALLATION.md`: that names the installation's
   principal, grants and role, and none of them are yours. Its rules for its own store,
   credentials and outbound channels do bind you whenever you touch those (§ 15.3).
3. **Read `docs/C11-CONNECTOR.md`** for what this toolkit offers a mounting installation.

---

If any of these files conflict with system, developer, security, or explicit user instructions,
follow the higher-priority instruction and state the conflict when relevant.
