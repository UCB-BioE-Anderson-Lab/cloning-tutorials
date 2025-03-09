
// C6-Oligos.js - Oligonucleotide Design and Manipulation Library for Web
// Adapted from C6-Oligos.gs for browser-based applications

// Function to check if an oligonucleotide sequence is valid
function isValidOligo(seq) {
    return /^[ATCGNatcgn]+$/.test(seq);
}

// Function to calculate the melting temperature (Tm) of an oligonucleotide
function calculateTm(seq) {
    seq = seq.toUpperCase();
    let gcCount = (seq.match(/[GC]/g) || []).length;
    let atCount = seq.length - gcCount;

    // Basic Wallace rule: Tm = 2(A+T) + 4(G+C)
    return 2 * atCount + 4 * gcCount;
}

// Function to check for self-complementarity (potential secondary structure issues)
function hasSelfComplementarity(seq) {
    let revComp = revcomp(seq); // Using function from C6-Seq.js
    return seq.includes(revComp.substring(0, Math.floor(seq.length / 2)));
}

// Function to design an oligo with restriction sites
function designOligo(annealingRegion, restrictionSite = "") {
    return restrictionSite.toUpperCase() + annealingRegion.toUpperCase();
}

// Export functions for use in other modules
window.isValidOligo = isValidOligo;
window.calculateTm = calculateTm;
window.hasSelfComplementarity = hasSelfComplementarity;
window.designOligo = designOligo;
