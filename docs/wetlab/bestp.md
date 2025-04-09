# BestP: Measuring Fluorescence

---

## Video Tutorial

🎥 Watch the fluorescence tutorial video before lab.  
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>

---

## Overview

The **BestP** experiment marks a shift from building DNA to **measuring its activity**. The goal is to assign a quantitative value—**Relative Promoter Units (RPU)**—to each promoter you identified in pP6. This allows us to compare their strengths under consistent conditions.

### Why RPU?

Different experiments can yield different fluorescence values due to instrument settings, media conditions, or cell growth. To standardize promoter activity, we compare each sample’s fluorescence to a **reference promoter**: **J23101**, a commonly used medium-strength promoter from the Anderson library. Its activity is defined as **1 RPU**.

### Reference Plasmids

We use three plasmids from the Anderson promoter library:

- **pJ12** – Contains **J23112**, a very weak promoter
- **pJ01** – Contains **J23101**, the **standard reference**
- **pJ19** – Contains **J23119**, a very strong promoter

Each has the same vector backbone and reporter gene (amilGFP) as your pP6 clones, ensuring fair comparison.

---

## Experimental Workflow

You'll choose **4 pP6 clones** to characterize—either your own from sequencing or others from the TPcon6B box. You'll also measure the reference plasmids above. Here’s the full procedure:

### Step 1: Transformation

Transform all 7 plasmids (4 pP6 clones + pJ12, pJ01, pJ19) using a **single aliquot of 100 μL competent cells**. Use 16 μL of cells + KCM + 0.5 μL of plasmid DNA per transformation.

- Plate the transformations and label clearly with your assigned number
- Use carbencillin selection
- No rescue step is needed

### Step 2: Picking

Pick **4 colonies per plasmid** into a 24-well block:

- Add 4 mL of 2YT + carb to each well
- Pick in a **left-to-right order** to match data entry format
- Label with an airpore sheet
- Grow overnight in the multitron shaker
- Refrigerate plates and upload a photo (name it `BestP-XX`)

### Step 3: Measurement

Measure both **fluorescence** and **OD₆₀₀** for all samples using a plate reader:

- Transfer 100 μL from each culture into a black-walled Tecan plate (2 technical replicates per sample)
- Use **fluorescein settings** to read amilGFP
- Save data to the USB stick

### Step 4: Data Entry

Paste your raw OD and fluorescence readings into the provided spreadsheet. The sheet will:

- Calculate **normalized fluorescence** (per OD unit)
- Average technical and biological replicates
- Compute final **RPU values** with error bars

You’ll report these results to the main **BestP Results** sheet to help build a complete picture of the promoter library.

---

### Example Results

| Promoter | RPU | Error |
|----------|-----|-------|
| pJ01-C (J23101) | 1.00 | ±0.02 |
| 45C | 0.037 | ±0.003 |
| 7C | 0.679 | ±0.012 |
| 8A | 1.045 | ±0.019 |

Some pP6 clones rival or outperform the strongest Anderson parts—these are the hits you're trying to find.

---
