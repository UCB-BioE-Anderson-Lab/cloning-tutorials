# Sequencing Analysis

Once you've received sequencing data for your plasmid, the first step is a quick visual check of the read quality.

## 1. Initial Inspection: Raw Read Quality

Start by opening your sequencing read (e.g., .ab1 or .fastq file) in a suitable viewer (e.g., SnapGene, Benchling, or ApE). You're primarily looking for:

- **‘N’ bases**: These indicate low-confidence calls. If the read is full of N's, something went wrong—likely a poor miniprep, degraded sample, or an ineffective primer.
- **Beginning/End Noise**: It's normal to see stretches of N's or ambiguous calls at the 5’ and 3’ ends. These regions are inherently low-quality from the sequencing process and typically uninformative.
- **Clean A/T/C/G reads**: The middle portion should show well-defined peaks or clear base calls, which you'll use for downstream comparison.

## 2. Comparing to the Expected Sequence

Once you identify the high-quality portion of your read, align it to your expected plasmid sequence.

- Use tools like Benchling, ApE, or online alignment tools.
- Check for mismatches, insertions, deletions (indels), and any structural anomalies.

If you're working with full plasmid sequencing data, you should see a continuous read covering your entire plasmid. In that case, align the full read to your reference and analyze any discrepancies.

## 3. Defining the Critical Region

One major challenge in non-standardized constructs is determining *what* region you actually need to confirm. Unlike Biobricks (which had clear prefix/suffix boundaries), here you need to define the “insert” based on:

- Your cloning strategy (e.g., Gibson assembly junctions, PCR primers).
- The portion of the plasmid that you modified or introduced.
- Any region where mutations could compromise function.

A good practice: identify the expected start and end coordinates of the insert (or modified region) on your plasmid map. This defines your “critical verification region.”

## 4. Classification of Sequencing Outcomes

Once you’ve done your alignment, classify your result into one of the following categories:

- **Perfect**: The entire region of interest matches the expected sequence exactly.
- **Perfect Partial**: A clear match for only part of the region (e.g., only one read direction or incomplete coverage).
- **Point Mutation(s)**:
  - *Silent*: No change in amino acid sequence.
  - *Missense*: Amino acid change that may affect function.
  - *Nonsense*: Introduction of a premature stop codon.
- **Indel(s)**: Insertions or deletions that shift the reading frame or remove/add residues.

## 5. Reporting & Next Steps

Once classified, decide on your next steps:

- **Perfect**: Move forward with cloning.
- **Perfect Partial**: Consider re-sequencing with different primers.
- **Mutations**: Depending on their type and location, decide whether the clone is usable or needs to be re-made.

---

This guide aims to help you make informed, reproducible judgments about sequencing success and clone integrity. Consider logging results in a shared lab notebook or tracking system to make downstream troubleshooting easier.