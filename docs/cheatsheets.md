# Bench Cheatsheets

A one-page card for each wetlab protocol. **Copies are at the bench** — these are the same
cards, here so you can look at one before lab, or from anywhere.

They are quick-start cards, not tutorials. They assume you have read the tutorial and want the
volumes, the order, and the things that go wrong quietly.

## The whole set

**[⬇ All eight in one file](cheatsheets/all-cheatsheets.pdf)** — 8 pages, in experiment order.
Useful if a bench copy has gone missing and needs reprinting.

## Individual sheets

| Cheatsheet | What it covers | Tutorial |
|---|---|---|
| **[PrimeSTAR PCR](cheatsheets/pcr.pdf)** | 50 µL reaction, master mix for 5+ | [Polymerase Chain Reaction](wetlab/pcr.md) |
| **[Analytical Gel](cheatsheets/gel.pdf)** | Sample prep, loading, running, imaging | [Gel Electrophoresis](wetlab/gel.md) |
| **[Zymo Cleanup](cheatsheets/zymo.pdf)** | Column cleanup of a PCR or digest | [Zymo Cleanup](wetlab/cleanup.md) |
| **[Golden Gate Assembly](cheatsheets/goldengate.pdf)** | 10 µL reaction, GG1 program | [Assembly](wetlab/assembly.md) |
| **[KCM Heat-Shock Transformation](cheatsheets/transformation.pdf)** | Block timings, rescue, plating | [Transformation](wetlab/transformation.md) |
| **[Picking Colonies](cheatsheets/picking.pdf)** | Tubes or a block, which colonies | [Colony Picking](wetlab/pick.md) |
| **[Qiagen Miniprep](cheatsheets/miniprep.pdf)** | Alkaline lysis and column | [Miniprep](wetlab/miniprep.md) |
| **[Cycle Sequencing](cheatsheets/sequencing.pdf)** | 13 µL submission, dGTP protocol | [Cycle Sequencing](wetlab/sequencing.md) |

## If a sheet looks wrong

Each card is generated from the same protocol module the
[Protocol Builder](protocols/protocols.md) uses, so a card and the protocol it comes from
cannot disagree — fixing one fixes both.

So do not edit the PDF, and do not edit the HTML beside it; both are generated output. The
content lives in `docs/protocols/modules/*.js` and `docs/cheatsheets/src/*.mjs`. Change the
module, then:

```
node docs/cheatsheets/build.mjs
```

`node docs/cheatsheets/build.mjs --check` reports whether any sheet has drifted from its
protocol without rebuilding, which is worth running before a deploy. See
`docs/cheatsheets/AUTHORING.txt`.
