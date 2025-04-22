# Sequencing Analysis

Earlier when working on pP6, you did Cycle Sequencing to identify the promoter sequence you have identified. However, this analysis was a specific case where we were looking for a specific pattern in the read.  Now let's look at it more generally in a construction context, where our motivation is to determine whether we successfully created the plasmid. We need to compare our sequencing data to our model and determine whether it is correct.

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

One major challenge in non-standardized constructs is determining *what* region you actually need to confirm. When building 'parts' like BioBricks or MoClo parts, there is a specific region of the plasmid bounded by restriction sites, and it is the only region of the plasmid that will be carried forward, and thus it is the only region we must examine in detail. But we aren't always working with 'parts' and this can be more ambiguous. Usually errors happen at the junctions created in vitro, regardless of using restriciton enzymes, gibson, or other assembly methods.  Whereever you annealed oligos is a likely site for errors.  Additionally, any regions of the plasmid that were amplified by PCR are high risk.  Sometimes you already know some components of a plasmid are correct -- you got colonies, so the origin and antibiotic marker must have been functional.  It is those elements you have introduced into the plasmid, and the junctions between them and other fragments in the assembly reaction that most likely need to be examined.

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