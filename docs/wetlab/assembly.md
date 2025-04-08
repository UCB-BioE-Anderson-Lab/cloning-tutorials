# Assembly

In molecular cloning, “assembly” refers to joining two or more DNA molecules together into one. Two of the most common methods are **Golden Gate Assembly** and **Gibson Assembly**—together they cover nearly all modern cloning needs.

---

### Assembly Methods Overview

**Golden Gate Assembly** uses a **type IIS restriction enzyme** (e.g., *BsaI*, *BsmBI*, *BbsI*) to cut DNA at defined locations and generate sticky ends. These are then joined by **T4 DNA Ligase**.

**Gibson Assembly** uses an exonuclease to chew back DNA ends, allowing single-stranded overlaps to anneal. A polymerase fills in gaps and a ligase seals the nicks.

Both methods:

- Are performed in a single tube (one-pot)
- Run in a thermocycler
- Require specific enzyme buffers and careful setup

---

### What We're Doing Here

In the **pP6 experiment**, we only have one DNA fragment: the linear PCR product from earlier. Our goal is to **re-circularize it** by joining its ends together using **Golden Gate**.

This works because the PCR primers added **BsaI recognition sites**, which generate **complementary sticky ends** at each end of the linear product.

---

### Golden Gate Diagram

![Circular plasmid with BsaI-flanked ends being cut and ligated into a new circular product](../images/pP6_GG_scheme.png)

*Figure: The linear PCR product includes BsaI sites at both ends. The enzyme cuts to expose sticky ends, which are ligated back together by T4 DNA Ligase to form a circular plasmid.*

---

### Reaction Setup

Setting up a Golden Gate reaction is similar to setting up PCR. You pipette reagents in order from top to bottom, **adding enzymes last** to avoid denaturing them in pure water or incomplete mixtures.

| Volume | Reagent                     | Tube Label |
|--------|-----------------------------|------------|
| 6 µL   | ddH₂O (white rack)          | W____      |
| 1 µL   | 10× T4 Ligase Buffer (red)  | L____      |
| 2 µL   | z79 (your cleaned PCR DNA)  |            |
| 0.5 µL | T4 DNA Ligase               |            |
| 0.5 µL | BsaI                        |            |

- Label your reaction tube with your assigned code (e.g., `a79`).
- Place all reactions from your section together in a single thermocycler block.

---

### Thermocycler Program

We use the program **GG1**, which alternates between:

- **37°C** (cutting by BsaI)
- **16°C** (ligation by T4 Ligase)

The final steps:

- Extended 37°C incubation
- 65°C heat inactivation

---

### Lab Sheet Overview

| Label | Fragment | Product |
|-------|----------|---------|
| a79   | P6       | pP6     |

The **Label** is what you write on your PCR tube. **P6** refers to the PCR product you're assembling. Once the reaction is complete, the product is a **circularized plasmid** called **pP6**, ready for transformation.

---

### Scaling the Reaction

You can scale this up or down depending on your needs, but:

- Final buffer concentration must be 1×
- Avoid excessive DNA concentrations that may inhibit ligation

Typical scale is **10 µL**, matching what’s needed for competent cell transformation.

---

### 🎥 Watch Before Lab

Watch the assembly tutorial video before coming to lab.
<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>
