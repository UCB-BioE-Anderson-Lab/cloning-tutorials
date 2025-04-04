# Simulation Tools: CFS & C6

This page explains how to simulate DNA construction workflows using two tools:
- **CFS (Construction File Simulator)** — a Java-based simulation engine.
- **C6 Tools** — a spreadsheet-based interface using Google Sheets.

## 🧪 CFS (Construction File Simulator)

CFS is a Java tool that simulates a Construction File (CF) to verify correctness of molecular biology protocols like PCR, digestion, ligation, assembly, and transformation. It detects common design issues before you build.

### Getting Started

1. **Install Java** (JRE 8+).
2. **Download the `.jar` file** from the [Releases section](https://github.com/UCB-BioE-Genetic-Design-Automation/ConstructionFileSimulator/releases).
3. **Extract `dist.zip`**, if applicable.

### Usage Options

- **Double-click** `ConstructionFileSimulator.jar` to launch the GUI.
- **Drag-and-drop** an experiment folder onto the GUI.
- **Command line (GUI launch):**
  ```bash
  java -jar ConstructionFileSimulator.jar
  ```
- **Command line (direct simulation):**
  ```bash
  java -jar ConstructionFileSimulator.jar /path/to/experiment/folder
  ```

### File Requirements

A valid experiment folder must include:
- A text-based Construction File
- GenBank files for sequence definitions
- A TSV file with part definitions (if needed)

### Output

The simulator will display:
- Each intermediate step (e.g., PCR product, digested fragment)
- Final output sequences
- Errors or misassemblies if present

## 📊 C6 Tools (Spreadsheet-based)

C6 Tools is a Google Sheets-based simulation interface using built-in scripts.

### Example Layout

You define steps as a grid:

| A         | B       | C       | D     | E    | F   |
|-----------|---------|---------|-------|------|-----|
| `PCR`     | `P6libF`| `P6libR`| `pTP1`| 3583 | `P6` |
| `Assemble`| `P6`    | `BsaI`  | `pP6` |      |     |
| `Transform` | `pP6` | `Mach1` | `Carb`|      |     |

Supporting rows include definitions of primers and templates below.

### How to Use

1. Fill in your construction steps as a grid (A6:F12 in this example).
2. Run this in a new cell to parse:
   ```
   =parseCF(A7:F12)
   ```
3. Simulate the build using:
   ```
   =simCF(H8)
   ```

### Output

The simulation will populate:
- Intermediate products
- Final product
- Sequence output or errors

---
Use these tools to validate and troubleshoot your designs before going to the bench. They are critical for catching errors early and speeding up the design-build-test cycle.
