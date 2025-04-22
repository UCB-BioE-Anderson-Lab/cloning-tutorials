// C6-Oligos.js - Oligonucleotide Design and Manipulation Library for Web
// Ported from C6-Oligos.gs for browser-based applications
// Assumes dependencies like resolveToSeq, revcomp, gccontent, basebalance, maxrepeat from C6-Seq.js

// Check if an oligonucleotide sequence is valid (only A,T,C,G,N allowed)
function isValidOligo(seq) {
  return /^[ATCGNatcgn]+$/.test(seq);
}

// Calculate melting temperature (Tm) of an oligonucleotide sequence
function calculateTm(seq) {
  seq = seq.toUpperCase();
  let gcCount = (seq.match(/[GC]/g) || []).length;
  let atCount = seq.length - gcCount;
  // Basic Wallace rule: Tm = 2(A+T) + 4(G+C)
  return 2 * atCount + 4 * gcCount;
}

// Check for self-complementarity (potential secondary structure issues)
function hasSelfComplementarity(seq) {
  let revComp = revcomp(seq); // from C6-Seq.js
  return seq.includes(revComp.substring(0, Math.floor(seq.length / 2)));
}

// Design an oligo by concatenating restriction site and annealing region
function designOligo(annealingRegion, restrictionSite = "") {
  return restrictionSite.toUpperCase() + annealingRegion.toUpperCase();
}

// Score annealing between two sequences with optional parameters
function scoreanneal(seq1, seq2, options = {}) {
  // Options: minOverlap, maxMismatch, allowMismatchAtEnds
  const minOverlap = options.minOverlap || 5;
  const maxMismatch = options.maxMismatch || 0;
  const allowMismatchAtEnds = options.allowMismatchAtEnds || false;

  seq1 = resolveToSeq(seq1).toUpperCase();
  seq2 = resolveToSeq(seq2).toUpperCase();

  let bestScore = -Infinity;
  let bestOverlap = 0;

  // Try all overlaps from minOverlap to length of shorter seq
  let maxOverlap = Math.min(seq1.length, seq2.length);
  for (let overlap = maxOverlap; overlap >= minOverlap; overlap--) {
    let mismatches = 0;
    let score = 0;
    for (let i = 0; i < overlap; i++) {
      let base1 = seq1[seq1.length - overlap + i];
      let base2 = seq2[i];
      if (base1 !== base2) {
        if (!allowMismatchAtEnds || (i !== 0 && i !== overlap - 1)) {
          mismatches++;
          if (mismatches > maxMismatch) break;
        }
      } else {
        score += 1;
      }
    }
    if (mismatches <= maxMismatch && score > bestScore) {
      bestScore = score;
      bestOverlap = overlap;
    }
  }

  return {score: bestScore, overlap: bestOverlap};
}

// Find annealing position of seq2 on seq1 with scoring
function findanneal(seq1, seq2, options = {}) {
  seq1 = resolveToSeq(seq1).toUpperCase();
  seq2 = resolveToSeq(seq2).toUpperCase();

  let bestPos = -1;
  let bestScore = -Infinity;

  for (let pos = 0; pos <= seq1.length - seq2.length; pos++) {
    let subSeq = seq1.substring(pos, pos + seq2.length);
    let {score} = scoreanneal(subSeq, seq2, options);
    if (score > bestScore) {
      bestScore = score;
      bestPos = pos;
    }
  }

  return {position: bestPos, score: bestScore};
}

// Partial complement annealing (pca) - find partial annealing between two sequences
function pca(seq1, seq2) {
  seq1 = resolveToSeq(seq1).toUpperCase();
  seq2 = resolveToSeq(seq2).toUpperCase();

  let maxOverlap = Math.min(seq1.length, seq2.length);
  for (let overlap = maxOverlap; overlap > 0; overlap--) {
    let subSeq1 = seq1.slice(seq1.length - overlap);
    let subSeq2 = seq2.slice(0, overlap);
    if (subSeq1 === revcomp(subSeq2)) return overlap;
  }
  return 0;
}

// Longest common annealing (lca) - find longest common subsequence annealing between two sequences
function lca(seq1, seq2) {
  seq1 = resolveToSeq(seq1).toUpperCase();
  seq2 = resolveToSeq(seq2).toUpperCase();

  let longest = 0;
  for (let i = 0; i < seq1.length; i++) {
    for (let j = 0; j < seq2.length; j++) {
      let length = 0;
      while (i + length < seq1.length && j + length < seq2.length &&
             seq1[i + length] === revcomp(seq2[j + length])) {
        length++;
      }
      if (length > longest) longest = length;
    }
  }
  return longest;
}

// BglBrick standard oligo design
function bglbrick(annealingRegion) {
  // BglBrick prefix and suffix
  const prefix = "AGATCT"; // BglII site
  const suffix = "GGTCTC"; // BsaI site
  return prefix + annealingRegion.toUpperCase() + suffix;
}

// BioBrick standard oligo design
function biobrick(annealingRegion) {
  // BioBrick prefix and suffix
  const prefix = "GAATTCGCGGCCGCTTCTAGAG"; // EcoRI, NotI, XbaI sites
  const suffix = "TACTAGTAGCGGCCGCTGCAG"; // SpeI, NotI, PstI sites
  return prefix + annealingRegion.toUpperCase() + suffix;
}

// MoClo standard oligo design
function moclo(annealingRegion) {
  // MoClo prefix and suffix
  const prefix = "GAAGAC"; // BsaI site partial
  const suffix = "GCTCTTC"; // BsaI site partial
  return prefix + annealingRegion.toUpperCase() + suffix;
}

// GeneJoin standard oligo design
function genejoin(annealingRegion) {
  // GeneJoin prefix and suffix
  const prefix = "GGTCTC"; // BsaI site
  const suffix = "AGAGACC"; // BsaI site complement
  return prefix + annealingRegion.toUpperCase() + suffix;
}

// RBSLib standard oligo design
function rbslib(annealingRegion) {
  // RBSLib prefix and suffix
  const prefix = "AAGGAG"; // Shine-Dalgarno sequence
  const suffix = "ATG"; // Start codon
  return prefix + annealingRegion.toUpperCase() + suffix;
}

// Add oligo-related functions to the C6 namespace
window.C6 = window.C6 || {};

Object.assign(window.C6, {
  isValidOligo,
  calculateTm,
  hasSelfComplementarity,
  designOligo,
  scoreanneal,
  findanneal,
  pca,
  lca,
  bglbrick,
  biobrick,
  moclo,
  genejoin,
  rbslib
});
