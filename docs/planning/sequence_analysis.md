# Sequence Retrieval and Analysis

In this tutorial, you will learn how to retrieve the sequence of a gene from another organism and prepare it for cloning. Our goal is to perform an **ortholog scan** of the *dxs* gene as part of the **Lycopene33** optimization experiment. We will search for alternative versions of *dxs* from different species, extract their RBS.CDS sequences, and prepare those sequences to build RC parts that match the TP.RC part architecture.

The process includes:

- Identifying orthologs via BLAST

- Extracting upstream and downstream flanking sequences

- Verifying gene boundaries

- Preparing the sequence for cloning

---

## Step-by-Step Workflow

### 1. Identify Your Starting Sequence

Begin with a known working version of the *dxs* gene from *E. coli* MG1655. You’ll need the CDS (coding DNA sequence), and ideally the 200 bp upstream (pre) and downstream (post) flanking sequences. These will help identify the ribosome binding site and define PCR primers if you’re cloning from genomic DNA.

### 2. Translate the CDS to Protein

Using a sequence editor such as ApE, paste in the *dxs* CDS and use the "Translate" function to convert it to its corresponding amino acid sequence.

### 3. Run a BLASTP Search

BLASTP is a search tool that compares your protein sequence to a vast database of known protein sequences maintained by NCBI. Nearly all public genomic and protein data are included in this database, and BLASTP has indexed these sequences in a way that allows it to quickly find similar entries.

Go to [BLASTP](https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins) and:

- Paste in your protein sequence (e.g., the translated *dxs* from *E. coli*).
- Decide how broadly to search. You have several options:
  - **Option 1:** Leave the organism box blank to search across all known species. This is useful for broad ortholog discovery.
  - **Option 2:** Enter a species, genus, or higher-level taxon (e.g., *Arthrobacter*, *Firmicutes*) to limit your search.
  - **Option 3:** If you're cloning from a specific DNA source (e.g., genomic DNA in your freezer), constrain your search to that species.
  - **Option 4:** If you're synthesizing all sequences, a broad search is fine—you don’t need to limit to organisms with accessible DNA.
- Click **BLAST** to begin the search.

When results appear, look for hits with the correct annotation (e.g., “1-deoxy-D-xylulose-5-phosphate synthase”). If the organism name seems unfamiliar, check whether it’s a renamed or synonymous species—taxonomy often evolves over time.

### 4. Select a Divergent Protein Sequence

Sequence identity is a percentage score indicating how similar two proteins are based on their aligned amino acid sequences.

Review the BLASTP results and avoid picking a 100% identity hit — those are usually redundant and uninformative. Instead, choose a result with high but not identical similarity (typically in the 70–95% identity range). Historically, a sequence identity of 95% or higher has been considered "substantially identical" in legal and patent contexts, potentially affecting novelty. Meanwhile, sequences around 70% identity are often functionally similar, though they may differ in properties like substrate specificity.

In choosing which hits to pursue:

- Avoid very high identity hits unless you're testing subtle variations.

- Prefer hits that retain the correct annotation (e.g., “1-deoxy-D-xylulose-5-phosphate synthase”), even at lower identities. These may be identified by more sophisticated gene prediction tools than BLAST alone.

- Consider building a phylogenetic tree to select hits from distinct clades. This helps you sample evolutionary space broadly and then refine with follow-up experiments.

- Consider using newer bioinformatics or AI tools.  This is a rapidly developing research topic.

Ultimately, the performance of orthologs in a heterologous host (like *E. coli*) is influenced by many factors — expression level, folding, temperature, pH, codon usage, RNA structure, and unknown interactions. Empirically testing a diverse panel is often the best approach.

### 5. Use TBLASTN to Find the DNA

To proceed with cloning or part design, you’ll need the actual DNA sequence of the ortholog — including the untranslated upstream region if you're capturing the native ribosome binding site. While one option is to reverse-translate the protein sequence and design an RBS using a prediction algorithm, a more reliable strategy — especially when transferring genes from one prokaryote to another — is to use the native DNA sequence. This native sequence has already been shaped by evolutionary selection to function in its original context and is more likely to express successfully in *E. coli* than a synthetic design. Additionally, if you plan to amplify the sequence from genomic DNA or an existing plasmid, you must use the actual sequence so that your primers anneal correctly. 

In some cases, the protein’s NCBI entry may include a direct link to the gene or CDS that encodes it. If not, you can find the encoding DNA using a second BLAST search — specifically, TBLASTN — that takes your protein query and returns matching DNA hits.

Go to [TBLASTN](https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE_TYPE=BlastSearch&PROGRAM=tblastn) and:

- Paste in the protein sequence from the previous step.

- Run the search.

Look for a match with near 100% identity — this ensures you’re retrieving the exact DNA sequence that encodes your selected protein, not just a similar ortholog. Unlike the initial BLASTP search, where sequence variation was valuable, here we want the specific nucleotide sequence that produced the protein you selected, since this is the actual DNA you’ll need for synthesis or PCR. Click the link for the matching hit, then follow the GenBank link to access the full nucleotide record.

### 6. Extend the Genomic Region

In the GenBank page, adjust the displayed sequence region to obtain 5' and 3' UTR:

- Extend ~200 bp upstream and ~200 bp downstream from the gene (CDS) hit.

- Use the “Change region shown” box to set the coordinates.

Click **Update View**, then download the GenBank file using **Send to > File > GenBank (full record)**.

### 7. Confirm the Gene Boundaries

- Ensure the CDS starts with ATG, GTG, or TTG.

- Confirm it ends with TAA, TAG, or TGA.

- Check that the orf is in the forward direction and not reverse complemented

- Translate the orf and confirm it matches your expectations.

Extract the pre, CDS, and post regions and paste them into your working spreadsheet.

Also record the GenBank accession number and source organism.

Extract the pre, CDS, and post regions and paste them into your working spreadsheet. Also record the GenBank accession number and source organism.

We recommend organizing this data in a spreadsheet, such as Google Sheets, similar to the format shown in the video. The sheet should include columns for:

- Organism name

- Whether an ortholog is present

- The 200 bp pre (upstream) region

- The CDS

- The 200 bp post (downstream) region

- Accession number

Here is an example of what the spreadsheet might look like:

```
organism	dxs?	pre200	CDS	post200	accession
E. coli MG1655	yes	ttggtcattaag	atgagt	tccctactcc	CP032667.1
```

This spreadsheet can live outside of your GitHub repo (e.g., in Google Drive). While tools like Benchling or C6-tools may be used for sequence design and analysis, the essential outputs — Construction Files, LabSheets, and final sequence files — must be included in the GitHub repository. Any other design or analysis materials may be linked from your GitHub issues or stored separately, but we recommend downloading and archiving them in your `Docs/` folder for long-term preservation.

For **BioE 140L students**: download your final Google Sheet when done and include it in your project folder as a backup.

---

## Video Walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/QZex2r25tUg" title="How to Find Orthologs for Cloning" frameborder="0" allowfullscreen></iframe>

---

## From Ortholog Sequence to RC Part

Once you’ve retrieved the ortholog sequence and its surrounding context (pre200, CDS, and post200), the next step is to construct an **RC part** that conforms to the TP.RC format used throughout this tutorial.

Here’s how to do it:

### 1. Identify the RBS Region

The ribosome binding site (RBS) is generally found within the final 30 bp of the pre200 region. It usually appears 8–15 bp upstream of the start codon (ATG, GTG, or TTG) and resembles a Shine-Dalgarno–like sequence such as `AGGAGG`. You'll want to include this entire RBS and its precise spacing to the start codon in your part.

### 2. Choose a 5′ Linker

The linker is a 20 bp sequence upstream of the RBS that will serve as the forward PCR priming site and provide standard flanking homology. Search within the pre200 region, typically between −100 and −15 relative to the start codon, for a well-behaved primer binding sequence (good GC content, no hairpins, balanced melting temp, etc.). This will become your 5′ linker. The RBS is then defined as the sequence between the 5′ linker and the start codon.

### 3. Choose a 3′ Linker

For the 3′ linker, look for a 20 bp sequence downstream of the CDS within the post200 region. This should lie beyond the stop codon and meet similar criteria for a good primer binding site.

### 4. Build the RC Part

Once you’ve identified:

Once you’ve defined your 5′ linker, RBS, CDS, and 3′ linker, you now have everything needed to construct an RC part compatible with the TP.RC system.

The design and construction process is the same as described in the [Design Principles](design_principles.md) tutorial. There, you practiced building an RC part using known sequences and assembling them into a standard format. In this case, you’ll apply that same process using the ortholog data you’ve just collected.

To recap, your RC part will contain:

- A 5′ BsaI recognition site followed by a sticky end (`TACT`)

- The 5′ linker sequence

- The RBS sequence

- The full CDS (starting with ATG/GTG/TTG, ending in a stop codon)

- The 3′ linker sequence

- A 3′ sticky end (`GCTT`) followed by the reverse BsaI recognition site

Make sure the full sequence has no internal BsaI sites. This is critical for Golden Gate assembly, as internal BsaI sites will cause unwanted cuts. If you're ordering a synthetic fragment (e.g., GBlock or clonal synthesis), you can eliminate all internal BsaI, BsmBI, and other Type IIS or common restriction sites (e.g., BglBrick, BioBrick) via silent mutations. C6-Tools include a `remove_sites` function to automate this cleanup.

If you're cloning from genomic DNA, internal BsaI sites must be removed during cloning. A single site can often be mutated using SOEing or Gibson assembly with an altered primer. But if multiple sites are present, synthesis is usually easier and more reliable. Alternatively, you can choose orthologs that don’t contain problematic sites to avoid complications altogether.

You can create this RC part in multiple ways:

- **Synthetic gene block (GBlock)** ordered with BsaI sites and tails

- **PCR** from genomic or plasmid DNA using primers that extend the linkers and BsaI sites and 5' tails

- **Clonal synthesis** through a gene synthesis vendor

Refer back to the RC part design quiz in the previous tutorial if you need a refresher on format logic. Once built, these RC parts can be mixed and matched in your construct to evaluate ortholog performance.