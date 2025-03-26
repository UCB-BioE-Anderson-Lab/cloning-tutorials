
// C6-Align.js - Sequence Alignment Library for Web
// Adapted from C6-Align.gs for browser-based applications

// Function to compute the Hamming distance between two sequences (for equal-length sequences)
function hammingDistance(seq1, seq2) {
    if (seq1.length !== seq2.length) {
        throw new Error("Sequences must be of equal length for Hamming distance calculation.");
    }
    let distance = 0;
    for (let i = 0; i < seq1.length; i++) {
        if (seq1[i] !== seq2[i]) {
            distance++;
        }
    }
    return distance;
}

// Function to perform a simple global alignment (Needleman-Wunsch algorithm)
function globalAlignment(seq1, seq2, match = 1, mismatch = -1, gap = -2) {
    const m = seq1.length + 1;
    const n = seq2.length + 1;
    let matrix = Array.from({ length: m }, () => Array(n).fill(0));

    // Initialize the matrix
    for (let i = 0; i < m; i++) matrix[i][0] = i * gap;
    for (let j = 0; j < n; j++) matrix[0][j] = j * gap;

    // Fill the matrix
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            const matchScore = seq1[i - 1] === seq2[j - 1] ? match : mismatch;
            matrix[i][j] = Math.max(
                matrix[i - 1][j - 1] + matchScore,
                matrix[i - 1][j] + gap,
                matrix[i][j - 1] + gap
            );
        }
    }

    return matrix[m - 1][n - 1]; // Return alignment score
}

// Make functions globally accessible in a browser environment
window.hammingDistance = hammingDistance;
window.globalAlignment = globalAlignment;
