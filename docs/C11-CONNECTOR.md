# cloning-tutorials as a C11 world

**This repository publishes one thing: the room.** `docs/assets/data/` is a model of B144 —
where materials live, what each storage unit holds and who may open it, what the consumables
are and where they are bought. `bin/room` answers three questions from it.

Everything else here is a teaching site, and the protocol modules and thermocycler programs
under `docs/protocols/` and `docs/data/` are **vendored from C6-Multiplatform** and belong to
that world. They are not published here; asking C6 about a protocol is asking the right world.

## What it answers

    bin/room where <thing>     where a material lives, by name or by what people call it
    bin/room unit [<slug>]     what is in a storage unit, and who may open it
    bin/room restock           what has a target — and that nothing has ever been counted

All three are read-only and take `--json`.

## It reuses the site's own loader

`bin/room` imports `docs/tools/lab/js/data.js`, the browser lab map's loader, rather than
parsing the TSVs again. That module knows the quoting rule, the column aliases (`loc1`/`zone`),
how synonyms split and how chemicals and locations merge. A second parser would be a second set
of answers to one question, which this repository has been bitten by before —
`docs/cheatsheets/AUTHORING.txt` records one thermocycler program described three ways, two of
them wrong. The only thing that loader cannot do outside a browser is `fetch`, so that is the
only thing `bin/room` supplies.

## What it will not tell you

**No stock levels.** `consumables.tsv` carries `target` and `threshold` — what should be on the
shelf — and has no column for what is. Those numbers would come from the steward count sheets,
and as of 2026-10-15 not one has ever been submitted: eight steward folders in Drive, every
`submitted/` empty.

So `restock` reports that **nobody has looked**, for every item, rather than a short list of
things to reorder. An item with a target and no count is unmeasured, not adequately stocked, and
the two must never print alike.

**No people.** This repository is public. The room model names stations, equipment and materials
and no students; steward assignments, who owes a count and training status live in the private
personnel world. `lab-assignments.json` holds that line today and nothing here should cross it.

## Why `refresh` says `generated: false`

Somebody walks the room and edits the TSVs. Nothing derives the model from anything, so there is
no build to run — and no check that could distinguish a current model from a stale one, which is
a real limitation rather than a tidy answer. The thing that would detect drift is a steward
count.
