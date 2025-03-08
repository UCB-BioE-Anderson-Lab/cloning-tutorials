# DNA Basics and Molecular Biology Refresher

## DNA Structure and the Reverse Complement Function

DNA is a double-stranded molecule arranged in an **antiparallel** fashion, meaning one strand runs in the 5' to 3' direction while its complementary strand runs in the 3' to 5' direction. The two strands are held together by **base pairing**: Adenine (A) pairs with Thymine (T), and Cytosine (C) pairs with Guanine (G). These fundamental properties allow for key sequence operations like reversing and complementing strands. To understand this structure visually, watch the video below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/gKHO0HHPsXg" frameborder="0" allowfullscreen></iframe>

### **Reverse**
To reverse a DNA sequence, simply write it backward. For example:
- **Original**: `5'- ATGCAG -3'`
- **Reversed**: `5'- GACGTA -3'`

### **Complement**
To complement a DNA sequence, replace each base with its pairing base:
- **A (Adenine) ↔ T (Thymine)**
- **C (Cytosine) ↔ G (Guanine)**

Example:
- **Original**: `5'- ATGCAG -3'`
- **Complement**: `5'- TACGTC -3'`

### **Reverse Complement**
The **reverse complement** is simply applying the complement rule **after reversing** the sequence:
1. Reverse the sequence.
2. Replace each base with its complementary base.

Example:
- **Original**: `5'- ATGCAG -3'`
- **Step 1 (Reverse)**: `5'- GACGTA -3'`
- **Step 2 (Complement)**: `5'- CTGCAT -3'`

Since DNA is double-stranded, the reverse complement operation essentially determines what the **partner strand** would look like. When we take the reverse complement of a sequence, we are simulating the process of reading the opposite strand in the correct 5' to 3' direction, just as it would naturally exist in a DNA molecule.

## Try it Yourself

Try calculating the **Reverse**, **Complement**, and **Reverse Complement** of these sequences:

### **1️⃣ Reverse**
What is the **reverse** of **5'- AGCTTG -3'?**
<input type="text" id="reverseInput" placeholder="Enter answer here">
<button type="button" id="reverseBtn">Check Answer</button>
<p id="reverseResult"></p>

### **2️⃣ Complement**
What is the **complement** of **5'- AGCTTG -3'?**
<input type="text" id="complementInput" placeholder="Enter answer here">
<button type="button" id="complementBtn">Check Answer</button>
<p id="complementResult"></p>

### **3️⃣ Reverse Complement**
What is the **reverse complement** of **5'- CAGGTAG -3'?**
<input type="text" id="reverseCompInput" placeholder="Enter answer here">
<button type="button" id="reverseCompBtn">Check Answer</button>
<p id="reverseCompResult"></p>

## The Central Dogma

The Central Dogma of molecular biology describes 3 biochemical processes happening to biomolecules in most cells. During **Replication**, an exact copy of DNA is produced. During **Transcription**, a region of DNA is read into RNA. During **Translation**, a region of RNA (an mRNA or messenger RNA) is read into protein. Though these processes are very complex and involve numerous biomolecules, the sequences of RNA and protein are readily predictable from the DNA sequence.

### Transcription

A **gene** refers to a region of DNA that encodes a protein. You can think of it like a song on a vinyl record—there is a physical region to the gene, with clear starts and ends. A gene can be on either strand of DNA, but it is always flanked by a **promoter** and a **terminator** sequence. The promoter determines which strand will be the "coding strand," as the **RNA polymerase** binds to the promoter and proceeds until it reaches the terminator. 

During transcription, an **RNA molecule** is created that is identical to the coding strand but with **Uracil (U) replacing Thymine (T)**.

Example:
- **DNA Coding Strand**: `5'- ATGCAGTAC -3'`
- **RNA Transcript**: `5'- AUGCAGUAC -3'`

### **Quiz: Predict the RNA Sequence**
What is the **RNA sequence** transcribed from this DNA coding strand?  
**5'- TCTGACTA -3'**

<form id="transcriptionForm">
  <input type="text" id="transcriptionInput" placeholder="Enter answer here">
  <button type="button" id="transcriptionBtn">Check Answer</button>
  <p id="transcriptionResult"></p>
</form>

### Translation

An **mRNA** transcript consists of a **5' UTR (Untranslated Region)** followed by the **CDS (Coding DNA Sequence)**. The **CDS** is an **ORF (Open Reading Frame)**, meaning a sequence that, when read in groups of three bases (codons), begins with a **start codon** (**ATG, GTG, or TTG**) and ends with a **stop codon** (**TAA, TAG, TGA**).

The **ribosome** recognizes the **Shine-Dalgarno sequence** and the **start codon**, then reads the RNA three bases at a time, translating each codon into an **amino acid** based on the genetic code.

### **Genetic Code Table**

> **Note:** While translation occurs from an RNA sequence, for convenience, we often refer to codons in their DNA format. Codons are three-letter sequences that specify amino acids during protein synthesis. Each codon in DNA corresponds to an RNA codon by replacing Thymine (T) with Uracil (U).

| Codon  | Single Letter | Full Name  | Codon  | Single Letter | Full Name  |
|--------|--------------|------------|--------|--------------|------------|
| TTT    | F            | Phe        | TTC    | F            | Phe        |
| TTA    | L            | Leu        | TTG    | L            | Leu        |
| TCT    | S            | Ser        | TCC    | S            | Ser        |
| TCA    | S            | Ser        | TCG    | S            | Ser        |
| TAT    | Y            | Tyr        | TAC    | Y            | Tyr        |
| TAA    | stop         | Ter        | TAG    | stop         | Ter        |
| TGT    | C            | Cys        | TGC    | C            | Cys        |
| TGA    | stop         | Ter        | TGG    | W            | Trp        |
| CTT    | L            | Leu        | CTC    | L            | Leu        |
| CTA    | L            | Leu        | CTG    | L            | Leu        |
| CCT    | P            | Pro        | CCC    | P            | Pro        |
| CCA    | P            | Pro        | CCG    | P            | Pro        |
| CAT    | H            | His        | CAC    | H            | His        |
| CAA    | Q            | Gln        | CAG    | Q            | Gln        |
| CGT    | R            | Arg        | CGC    | R            | Arg        |
| CGA    | R            | Arg        | CGG    | R            | Arg        |
| ATT    | I            | Ile        | ATC    | I            | Ile        |
| ATA    | I            | Ile        | ATG    | M            | Met        |
| ACT    | T            | Thr        | ACC    | T            | Thr        |
| ACA    | T            | Thr        | ACG    | T            | Thr        |
| AAT    | N            | Asn        | AAC    | N            | Asn        |
| AAA    | K            | Lys        | AAG    | K            | Lys        |
| AGT    | S            | Ser        | AGC    | S            | Ser        |
| AGA    | R            | Arg        | AGG    | R            | Arg        |
| GTT    | V            | Val        | GTC    | V            | Val        |
| GTA    | V            | Val        | GTG    | V            | Val        |
| GCT    | A            | Ala        | GCC    | A            | Ala        |
| GCA    | A            | Ala        | GCG    | A            | Ala        |
| GAT    | D            | Asp        | GAC    | D            | Asp        |
| GAA    | E            | Glu        | GAG    | E            | Glu        |
| GGT    | G            | Gly        | GGC    | G            | Gly        |
| GGA    | G            | Gly        | GGG    | G            | Gly        |

### **Quiz: Translate the DNA Sequence**
What is the **amino acid sequence** for the following DNA sequence?  
**5'- ATG CAG GTA GAA TAA -3'**

<form id="translateForm">
  <input type="text" id="translateInput" placeholder="Enter answer here">
  <button type="button" id="translateBtn">Check Answer</button>
  <p id="translateResult"></p>
</form>


## Summary of Terms

### **Fundamental DNA Concepts**
- **DNA (Deoxyribonucleic Acid)**: A double-stranded molecule that stores genetic information in all living organisms.
- **Base Pairing**: The specific hydrogen bonding between **Adenine (A) & Thymine (T)** and **Cytosine (C) & Guanine (G)** in DNA.
- **Antiparallel**: The orientation of DNA strands where one runs **5' to 3'** and the complementary strand runs **3' to 5'**.

### **Transcription & RNA Concepts**
- **RNA (Ribonucleic Acid)**: A single-stranded nucleic acid transcribed from DNA, involved in protein synthesis.
- **Transcription**: The process where **RNA polymerase** synthesizes RNA from a DNA template.
- **RNA Polymerase**: The enzyme that transcribes DNA into RNA.
- **mRNA (Messenger RNA)**: The RNA transcript that carries genetic information from DNA to ribosomes.
- **5' UTR (Untranslated Region)**: The non-coding region at the start of an mRNA that regulates translation.
- **3' UTR (Untranslated Region)**: The non-coding region at the end of an mRNA that influences stability and translation efficiency.
- **Promoter**: A DNA sequence where RNA polymerase binds to start transcription.
- **Terminator**: A DNA sequence signaling the end of transcription.

### **Translation & Protein Synthesis**
- **Translation**: The process where ribosomes synthesize proteins by reading mRNA codons.
- **Ribosome**: The molecular machine that assembles proteins by reading mRNA codons.
- **tRNA (Transfer RNA)**: An RNA molecule that brings amino acids to the ribosome during translation.
- **Codon**: A three-nucleotide sequence in DNA or RNA that specifies an amino acid or stop signal.
- **Anticodon**: A complementary three-base sequence on tRNA that pairs with an mRNA codon.
- **Start Codon**: The first codon in an mRNA sequence that signals the beginning of translation (**ATG** coding for Methionine).
- **Stop Codon**: A codon (**TAA, TAG, TGA**) that signals the termination of translation.

### **Gene Structure & Regulation**
 - **Gene**: A specific region of DNA that encodes a functional product, usually a protein.
 - **CDS (Coding DNA Sequence)**: The protein-coding portion of a gene within an mRNA.
 - **Open Reading Frame (ORF)**: A sequence of codons beginning with a start codon and ending with a stop codon.
 - **Ribosome Binding Site (RBS)**: A region on mRNA where the ribosome binds to initiate translation. In prokaryotes, this includes the Shine-Dalgarno sequence, while in eukaryotes, it is often the **Kozak sequence**.
 - **Shine-Dalgarno Sequence (SD)**: A ribosomal binding site in bacterial mRNA, located upstream of the start codon, which aligns the ribosome for efficient translation initiation.
 - **Kozak Sequence**: A sequence surrounding the start codon in eukaryotic mRNA that enhances ribosome recognition and translation efficiency.

<button id="resetProgressBtn">Reset Progress</button>
<script src="js/quiz_progress.js"></script>