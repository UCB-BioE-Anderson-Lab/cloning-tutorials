
// C6-Gene.js - Gene Analysis and Manipulation Library for Web
// Adapted from C6-Gene.gs for browser-based applications

// Function to identify Open Reading Frames (ORFs) in a DNA sequence
function findORFs(seq) {
    seq = seq.toUpperCase();
    const startCodon = "ATG";
    const stopCodons = ["TAA", "TAG", "TGA"];
    let orfs = [];

    for (let frame = 0; frame < 3; frame++) {
        let startIndex = -1;
        for (let i = frame; i < seq.length - 2; i += 3) {
            let codon = seq.substring(i, i + 3);
            if (codon === startCodon) {
                startIndex = i;
            } else if (stopCodons.includes(codon) && startIndex !== -1) {
                orfs.push({ start: startIndex, stop: i + 3, length: i + 3 - startIndex });
                startIndex = -1;
            }
        }
    }

    return orfs;
}

// Function to translate a DNA sequence into a protein sequence
function translateDNA(seq) {
    seq = seq.toUpperCase();
    const codonTable = {
        "TTT": "F", "TTC": "F", "TTA": "L", "TTG": "L",
        "TCT": "S", "TCC": "S", "TCA": "S", "TCG": "S",
        "TAT": "Y", "TAC": "Y", "TAA": "*", "TAG": "*",
        "TGT": "C", "TGC": "C", "TGA": "*", "TGG": "W",
        "CTT": "L", "CTC": "L", "CTA": "L", "CTG": "L",
        "CCT": "P", "CCC": "P", "CCA": "P", "CCG": "P",
        "CAT": "H", "CAC": "H", "CAA": "Q", "CAG": "Q",
        "CGT": "R", "CGC": "R", "CGA": "R", "CGG": "R",
        "ATT": "I", "ATC": "I", "ATA": "I", "ATG": "M",
        "ACT": "T", "ACC": "T", "ACA": "T", "ACG": "T",
        "AAT": "N", "AAC": "N", "AAA": "K", "AAG": "K",
        "AGT": "S", "AGC": "S", "AGA": "R", "AGG": "R",
        "GTT": "V", "GTC": "V", "GTA": "V", "GTG": "V",
        "GCT": "A", "GCC": "A", "GCA": "A", "GCG": "A",
        "GAT": "D", "GAC": "D", "GAA": "E", "GAG": "E",
        "GGT": "G", "GGC": "G", "GGA": "G", "GGG": "G"
    };

    let protein = "";
    for (let i = 0; i < seq.length - 2; i += 3) {
        let codon = seq.substring(i, i + 3);
        protein += codonTable[codon] || "X";
    }

    return protein;
}

// Export functions for use in other modules (for browser compatibility)
window.findORFs = findORFs;
window.translateDNA = translateDNA;
