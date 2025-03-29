# Experimental Design Principles in Synthetic Biology

Construction Files, Genbank sequences, and LabSheets are a general-purpose toolkit for documenting synthetic biology experiments. They do not tell you *what* to build—only *how to record it*. So the fundamental question at the start of every project is: **What should you build and test?**

## Types of Experiments

Most synthetic biology experiments fall into two broad categories:

### 1. Prototyping

In the prototyping stage, you are exploring new designs that haven't been tested in your system. You might have:
- A gene from a database or literature
- A new combination of parts
- A hypothesis about how something will work in a cell

But no direct experience with the function in your hands.

#### Questions to Ask:
- What proteins/RNAs need to be expressed?
- What regulatory elements do I need?
- What assay tells me if it works?
- What controls are required for interpreting results?
- How many variants can I build/test given assay throughput?

### 2. Optimization

Once a prototype is functional, optimization improves performance: yield, growth, stability, etc.

#### Strategies:

- **Promoter Swap**: Replace a promoter with variants

- **RBS Library**: Tune translation rate

- **Ortholog Scan**: Swap homologous coding sequences

- **Terminator Scan**: Adjust transcript stability

- **Part Combination Screens**: Combine multiple part variants

In our example, **Lycopene33** is an optimization: a promoter scan on AtIPI to tune expression and reduce toxicity.

The relationship between prototyping and optimization can be thought of as a progression: prototyping produces a first working construct, and optimization refines it for better performance.

![Prototyping vs. Optimization decision tree](../images/prototyping_vs_optimization.png)
*Figure: A decision tree illustrating the progression from untested design to prototype, and from prototype to systematic part tuning and performance analysis.*  
Optimization is also a cyclical process—top-performing variants from each round become the new prototypes for subsequent design cycles.

## The TP.RC System

To simplify modular cloning, we group parts into two classes: Traditionally, gene expression units are built using four modular parts: Promoter, RBS, CDS, and Terminator. Each of these must be mixed and matched individually during optimization, resulting in long repetitive assemblies. The TP.RC system simplifies this by collapsing the four parts into two composite modules: TP (Terminator-Promoter) and RC (RBS-CDS). This reduces the number of interchangeable parts, standardizes junctions, and enables efficient assembly of expression units using fewer, more functional blocks.

![Schematic showing TP.RC modular part layout](../images/tprc_modularity.png)
*Figure: The TP.RC model replaces traditional 4-part gene units with streamlined 2-part modules, reducing complexity and enabling modular optimization.*

## Planning an Optimization Experiment

In practice, optimization is often performed without a specific hypothesis about what part is limiting. Instead, it is a form of sensitivity analysis—each position in a construct is systematically tested for influence on performance. Rather than identifying a bottleneck beforehand, you vary elements (e.g., promoters, RC units) at selected sites and measure the resulting impact. This allows you to discover which parts are rate-limiting or overly active and informs future engineering steps.

The typical optimization workflow involves:

1. Selecting a position in the construct to diversify
2. Choosing a part type to vary (e.g., promoter, RC unit)
3. Designing a panel of alternative sequences
4. Building variants using Construction Files
5. Running assays and interpreting results
6. Updating designs based on measured trends

These small focused scans yield interpretable results and inform future designs.

## Ortholog Scans and RC Replacement

An ortholog scan is a type of RC swap. The goal is to replace an existing RBS-CDS module with alternative homologs of the same protein from other organisms. Each ortholog is paired with a designed RBS to form a new RC unit.

In practice:

- You identify target orthologs using BLAST

- Design or adapt RBSs

- Clone them into the backbone using Golden Gate

We’ll walk through this in the next section, **Sequence Retrieval and Analysis**.

![Ortholog Scan to Boost Yield](../images/ortholog_scan_cartoon.png)
*Figure: A biosynthetic pathway made of multiple TP.RC units is shown. In this ortholog scan, a single RC unit is replaced with variants sourced from gorilla, orca, and alligator. Expression output (product titer) is quantified at right. The alligator ortholog significantly outperforms the others, demonstrating how targeted RC swaps can boost pathway productivity.*

## Anatomy of TP and RC Parts

The TP.RC system follows a standardized layout compatible with the MoClo Golden Gate standard. Each part includes flanking type IIS restriction sites and 5 bp overhangs that define junctions and ensure consistent assembly order.

### TP (Terminator-Promoter) Parts
These combine a terminator from the previous gene with a promoter for the next one. The TP unit terminates transcription upstream and initiates transcription downstream. Spacers are included before the promoter to allow selective amplification and sequencing from standardized positions.

### RC (RBS-CDS) Parts
These include a ribosome binding site and a coding sequence. The spacer sits between the 5' MoClo overhang and the start codon and allows for amplification and verification.

Each spacer is a unique 20 bp sequence, often derived from qPCR primer sets that have been experimentally validated for high-quality priming. These allow:
- Assembly and simulation of the part junctions
- Selective amplification of backbone junctions
- Reliable sequencing from fixed positions across designs

![TP and RC standardization with Golden Gate](../images/tprc_spacers_and_junctions.png)
*Figure: Layout of TP and RC parts showing the role of unique spacers and MoClo overhangs. Each part includes type IIS flanking sites and 5' overhangs for ordered assembly.*

## Quiz: Building an RC Part

Given the following design inputs, construct a valid RC part sequence for Golden Gate assembly. Use the following conventions:

- 5' BsaI site: `GGTCTC`

- MoClo overhangs: `tact` (5') and `gctt` (3')

- 5' Spacer: `CAAATGTACGGCCAGCAACG`

- 3' Spacer: `GCACACCGTGGAAACGGATG`

- RBS: `gagaaagaggagaaatactag`

- CDS (start to stop): `ATGGCGTCTGACAGGAGCGTAA`

### ✍️ Enter your RC part sequence here:
<textarea id="rcInput" rows="5" style="width: 100%;"></textarea><br>
<button id="rcQuizBtn">Check Answer</button>
<p id="rcResult"></p>

<script>
document.addEventListener("DOMContentLoaded", function () {
    function setupQuiz(quizId, inputId, resultId, quizName) {
        let button = document.getElementById(quizId);
        let inputField = document.getElementById(inputId);
        let resultField = document.getElementById(resultId);

        if (button && inputField && resultField) {
            button.addEventListener("click", function () {
                let seq = inputField.value.toUpperCase().trim();
                let feedback = [];

                // Check forward BsaI site
                const fwdSite = "GGTCTC";
                const revSite = "GAGACC";
                const fwdIndex = seq.indexOf(fwdSite);
                const revIndex = seq.indexOf(revSite);
                const fwdCount = (seq.match(/GGTCTC/g) || []).length;
                const revCount = (seq.match(/GAGACC/g) || []).length;

                if (fwdCount === 0) feedback.push("Missing forward BsaI site (GGTCTC).");
                else if (fwdCount > 1) feedback.push("Too many forward BsaI sites (GGTCTC).");
                else if (fwdIndex < 5) feedback.push("Not enough 5' tail before forward BsaI site.");

                if (revCount === 0) feedback.push("Missing reverse BsaI site (GAGACC).");
                else if (revCount > 1) feedback.push("Too many reverse BsaI sites (GAGACC).");
                else if (seq.length - revIndex < 11) feedback.push("Not enough 3' tail after reverse BsaI site.");

                if (fwdCount === 1 && revCount === 1) {
                    // Check sticky ends
                    const sticky5 = seq.substring(fwdIndex + 7, fwdIndex + 11);
                    if (sticky5 !== "TACT") feedback.push("Incorrect 5' sticky end (should be TACT).");

                    const sticky3 = seq.substring(revIndex - 5, revIndex - 1);
                    if (sticky3 !== "GCTT") feedback.push("Incorrect 3' sticky end (should be GCTT).");

                    // Define expected sequences and positions
                    const expectedSeqs = {
                        "5' Spacer": ["CAAATGTACGGCCAGCAACG", fwdIndex + 11],
                        "RBS": ["GAGAAAGAGGAGAAATACTAG", fwdIndex + 31],
                        "CDS": ["ATGGCGTCTGACAGGAGCGTAA", fwdIndex + 52],
                        "3' Spacer": ["GCACACCGTGGAAACGGATG", fwdIndex + 74]
                    };

                    for (let [label, [expected, expectedPos]] of Object.entries(expectedSeqs)) {
                        const foundIndex = seq.indexOf(expected);
                        if (foundIndex === -1) {
                            feedback.push(`${label} is missing.`);
                        } else if (foundIndex !== expectedPos) {
                            feedback.push(`${label} is at index ${foundIndex}, but expected at ${expectedPos}.`);
                        }
                    }
                }

                if (feedback.length === 0) {
                    resultField.innerHTML = "✅ Correct!";
                    progressManager.addCompletion(quizName, "correct");
                } else {
                    resultField.innerHTML = "❌ " + feedback.join(" ");
                }
            });
        }
    }

    // Set up RC part quiz
    setupQuiz("rcQuizBtn", "rcInput", "rcResult", "RC_Part_Quiz");
});
</script>
