# How Cloning Goes Wrong and How to Resolve It

Cloning looks simple on paper, but in reality many things can go wrong. This document catalogs the decision logic for navigating a cloning experiment, and how to plan an experiment such that controls are included to account for likely issues.

One overarching consideration is that there are information checkpoints within a cloning project, and there are other steps that are blind. The first of these checkpoints is the Gel. Running a gel on a PCR product (or restriction digest, or other reactions) tells you not only whether the DNA is present, but how much is present as well as the size dispersity of the DNAs present. If everything looks good on the gel, there is no reason to question any of the things that happened during PCR — to get a nice band, the template and oligos and reagents and program all had to be in adequate condition, so there is no reason to question them. After a PCR, there are typically digests/ligations/assembly reactions prior to transformation and plating. This takes us to our next checkpoint — the Petri dish. Again, there is a lot that can go wrong between gels and plates, but many of those steps are not trivially tested, but if you get good colony yield of the right phenotype, all that must have worked. Finally you pick colonies, miniprep, and sequence them and get your third checkpoint — the sequencing read. If the sequence satisfies your needs (you made what you tried to make, you found a mutation you are trying to identify, you are decoding a barcode or library member) then there is no reason to question the quality of any of the equipment or materials used at previous steps.

Having these clear checkpoints in the project allows you to break up the cloning process into 3 distinct phases that can be considered in isolation:

- **PCR** → checkpoint: Gel
- **Recombinant DNA** → checkpoint: Petri dish
- **Isolation** → checkpoint: Sequencing read

---

## Phase 1: PCR

### The Gel Checkpoint

Before diagnosing the PCR itself, you must first confirm the gel worked. The diagnostic logic is:

- **Any bands visible** (even wrong-size bands) → the gel worked; the problem is in the PCR
- **No bands at all** → the gel itself must be questioned first

### Decision Tree: Gel Checkpoint

```
Evaluate gel
├── No bands anywhere
│   ├── No marker lane included → redo gel with marker
│   └── Marker included, still no bands → check for dye bands by eye (no UV needed)
│       ├── Dye bands absent
│       │   ├── No LOAD added → was sample blue when loaded? If not, redo with LOAD
│       │   ├── Hole in gel bottom → inspect visually; test by adding LOAD to well
│       │   └── Over-ran gel → redo, stop at 1/2–3/4 down gel; photograph at intermediate points
│       └── Dye bands present, no DNA bands
│           ├── Intercalation dye degraded (most common)
│           │   ├── LOAD not fresh → remake (1 µL 10% dye + 100 µL Blue Juice), redo gel
│           │   └── New LOAD still fails on multiple gels with known-good DNA
│           │       → dump gels and TAE buffer, remake both
│           └── Visualization setup problem
│               ├── Blue light not on → turn on (obvious by eye)
│               ├── Orange filter not in use → place between gel and eye/camera
│               └── Camera fogging → place phone on orange tray, hold ~1 ft above transilluminator
│
├── Marker visible, one or more PCR lanes empty
│   └── Check for dye band in empty lane
│       ├── No dye band → lane-level loading problem (no LOAD, hole in well) → same fixes as above
│       └── Dye band present → PCR gave no product → ENTER PCR DEBUGGING
│
├── PCR lanes have bands, but wrong size / multiple bands / smeary
│   └── Gel is not the problem → ENTER PCR DEBUGGING
│
└── Marker visible, PCR band correct size, clean → GEL CHECKPOINT PASSED ✓
```

### Prose: No Bands on Gel

**Control requirement:** Every gel must include a marker lane using DNA with a known visualization history. In B144, batch aliquots of ladder are provided for this purpose — because they come from the same source tube and are used regularly, there is high confidence both in their content and that they will produce bands. If you omitted the marker, you cannot distinguish a gel failure from a PCR failure; redo the gel with the marker included.

**Checking the gel itself:** If the marker was included and no bands appear anywhere, look for the dye bands from the loading buffer. These are visible by eye without UV or blue light. Your loading buffer contains two dyes that migrate at different rates; you should see at least one band, likely two. If neither is visible:

- **No loading buffer (LOAD) added.** Think back — was your sample visibly blue when you pipetted it into the well? If not, the LOAD was omitted. Redo the gel and include LOAD.
- **Hole in the gel bottom.** Examine the underside of the gel. Holes can result from stabbing through while loading, or from tearing during fabrication. You can also place the gel back in the rig, add a small amount of LOAD to a well, and watch whether it sits stably or leaks out.
- **Over-ran the gel.** If the gel ran too long, the dye front has migrated off the end entirely. To avoid this, stop the gel when the leading dye band is between halfway and three-quarters of the way down the gel. It is good practice to check the gel and take a photo at this intermediate point even if you plan to run it further — the optimal stopping point depends on the sizes you are trying to resolve, and experienced users will pause and look several times during a run.

**Dye bands visible, no DNA bands:** If the dye bands are present but no DNA is visible — including the marker — the gel mechanics worked but something prevented the DNA from being visualized. There are two categories to consider.

**Intercalation dye degraded.** The DNA visualization dyes (SybrSafe, GelGreen, etc.) have a short benchtop half-life and are best used within 24–48 hours of preparation. The dye is a component of LOAD (loading buffer), so stale LOAD is the most common cause of this problem. Remake LOAD fresh from 1 µL of 10% dye and 100 µL of Blue Juice, then redo the gel. If fresh LOAD still fails to produce bands on multiple gels loaded with samples you are confident are good quality, the problem may be with the agarose gels or TAE buffer themselves — though this is rare. In that case, dump the gels and the TAE and remake both.

**Visualization setup.** Before concluding there is a reagent problem, confirm the basics of the imaging setup. The blue transilluminator light should be visibly on — it is obvious by eye when it is running. You must also use the orange filter screen between the gel and your eye or camera; without it, the excitation light drowns out the emission signal. When taking photos, fog on the camera lens is a common problem. The best technique is to place your phone flat on the orange tray, then hold that assembly approximately one foot above the transilluminator to capture the image.

---

**Marker visible but a PCR lane is empty:** The same loading problems that can affect a whole gel can affect a single lane — no LOAD added, a hole in the well bottom. Check for the dye band in that specific lane. If you see a dye band alongside the marker, the lane loaded correctly and the PCR itself produced no product. At that point, proceed to PCR debugging.

**Bands visible but wrong:** If your PCR lanes show DNA — even if the bands are smeary, the wrong size, or there are multiple bands when you expected one — the gel worked. The problem is in the sample. Proceed to PCR debugging.

**Gel checkpoint passed:** Marker visible, PCR band at the correct size, clean and single. Nothing about the gel or its reagents needs to be questioned. Proceed to the next phase.

---

**[NEXT: PCR debugging — no product / wrong size / multiple bands / smeary]**

---

*Working notes — content in progress*
