
// C6-Sim.js - DNA Cloning Simulation Library for Web
// Adapted from C6-Sim.gs for browser-based applications

// Function to simulate a restriction enzyme digest
function restrictionDigest(seq, enzymeSite) {
    const cutPositions = [];
    let pos = seq.indexOf(enzymeSite);

    while (pos !== -1) {
        cutPositions.push(pos);
        pos = seq.indexOf(enzymeSite, pos + 1);
    }

    if (cutPositions.length === 0) return [seq];

    const fragments = [];
    let start = 0;
    for (let cut of cutPositions) {
        fragments.push(seq.substring(start, cut));
        start = cut;
    }
    fragments.push(seq.substring(start));

    return fragments;
}

// Function to simulate a ligation reaction (joining two DNA fragments)
function ligate(frag1, frag2) {
    return frag1 + frag2;
}

// Function to simulate a PCR reaction with given primers
function pcrAmplify(template, forwardPrimer, reversePrimer) {
    let forwardIndex = template.indexOf(forwardPrimer);
    let reverseIndex = template.indexOf(reversePrimer);

    if (forwardIndex === -1 || reverseIndex === -1) {
        throw new Error("Primers not found in template.");
    }

    return template.substring(forwardIndex, reverseIndex + reversePrimer.length);
}

// Export functions for use in other modules
window.restrictionDigest = restrictionDigest;
window.ligate = ligate;
window.pcrAmplify = pcrAmplify;
