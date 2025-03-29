
// C6-Seq.js - DNA Sequence Manipulation Library for Web
// Adapted from C6-Seq.gs for browser-based applications

// Polynucleotide class to represent DNA/RNA sequences
class Polynucleotide {
    constructor(sequence, ext5 = "", ext3 = "", isDoubleStranded = true, isRNA = false, isCircular = false, mod_ext5 = "", mod_ext3 = "") {
        this.sequence = sequence.toUpperCase();
        this.ext5 = ext5.toUpperCase();
        this.ext3 = ext3.toUpperCase();
        this.isDoubleStranded = isDoubleStranded;
        this.isRNA = isRNA;
        this.isCircular = isCircular;
        this.mod_ext3 = mod_ext3;
        this.mod_ext5 = mod_ext5;
    }
}

// Reverse Complement Function
function revcomp(seq) {
    const complements = {
        'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C',
        'a': 't', 't': 'a', 'c': 'g', 'g': 'c'
    };
    return seq.split('').reverse().map(nuc => complements[nuc] || nuc).join('');
}

// Calculate GC Content
function gccontent(seq) {
    seq = seq.toUpperCase();
    const gcCount = (seq.match(/[GC]/g) || []).length;
    return gcCount / seq.length;
}

// Check if sequence is palindromic
function isPalindromic(seq) {
    return seq === revcomp(seq);
}

// Polynucleotide creators
function dsDNA(sequence) {
    return new Polynucleotide(sequence, "", "", true, false, false, "hydroxyl", "hydroxyl");
}
function oligo(sequence) {
    return new Polynucleotide(sequence, "", "", false, false, false, "hydroxyl", "");
}
function plasmid(sequence) {
    return new Polynucleotide(sequence, "", "", true, false, true, "", "");
}

// Expose functions and class to the global window object for browser compatibility
window.Polynucleotide = Polynucleotide;
window.revcomp = revcomp;
window.gccontent = gccontent;
window.isPalindromic = isPalindromic;
window.dsDNA = dsDNA;
window.oligo = oligo;
window.plasmid = plasmid;
