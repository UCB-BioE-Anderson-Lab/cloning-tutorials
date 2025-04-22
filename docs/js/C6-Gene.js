
// C6-Gene.js - Gene Analysis and Manipulation Library for Web

// Genetic code mapping
const geneticCode = {
  'ATA':'I', 'ATC':'I', 'ATT':'I', 'ATG':'M',
  'ACA':'T', 'ACC':'T', 'ACG':'T', 'ACT':'T',
  'AAC':'N', 'AAT':'N', 'AAA':'K', 'AAG':'K',
  'AGC':'S', 'AGT':'S', 'AGA':'R', 'AGG':'R',                
  'CTA':'L', 'CTC':'L', 'CTG':'L', 'CTT':'L',
  'CCA':'P', 'CCC':'P', 'CCG':'P', 'CCT':'P',
  'CAC':'H', 'CAT':'H', 'CAA':'Q', 'CAG':'Q',
  'CGA':'R', 'CGC':'R', 'CGG':'R', 'CGT':'R',
  'GTA':'V', 'GTC':'V', 'GTG':'V', 'GTT':'V',
  'GCA':'A', 'GCC':'A', 'GCG':'A', 'GCT':'A',
  'GAC':'D', 'GAT':'D', 'GAA':'E', 'GAG':'E',
  'GGA':'G', 'GGC':'G', 'GGG':'G', 'GGT':'G',
  'TCA':'S', 'TCC':'S', 'TCG':'S', 'TCT':'S',
  'TTC':'F', 'TTT':'F', 'TTA':'L', 'TTG':'L',
  'TAC':'Y', 'TAT':'Y', 'TAA':'*', 'TAG':'*',
  'TGC':'C', 'TGT':'C', 'TGA':'*', 'TGG':'W',
};

// Simplified codon usage table for E. coli
const codonUsageData = {
  F: ["TTT", "TTC"], S: ["TCT", "TCC", "TCA", "TCG", "AGT", "AGC"],
  Y: ["TAT", "TAC"], C: ["TGT", "TGC"], L: ["TTA", "TTG", "CTT", "CTC", "CTA", "CTG"],
  P: ["CCT", "CCC", "CCA", "CCG"], H: ["CAT", "CAC"], R: ["CGT", "CGC", "CGA", "CGG", "AGA", "AGG"],
  Q: ["CAA", "CAG"], I: ["ATT", "ATC"], T: ["ACT", "ACC", "ACA", "ACG"],
  N: ["AAT", "AAC"], K: ["AAA", "AAG"], M: ["ATG"], W: ["TGG"],
  A: ["GCT", "GCC", "GCA", "GCG"], V: ["GTT", "GTC", "GTA", "GTG"],
  D: ["GAT", "GAC"], E: ["GAA", "GAG"], G: ["GGT", "GGC", "GGA", "GGG"],
};

// Dummy restriction enzyme list for demonstration
const geneRestrictionEnzymes = {
  BsaI: { recognitionSequence: "GGTCTC", recognitionRC: "GAGACC" },
  BsmBI: { recognitionSequence: "CGTCTC", recognitionRC: "GAGACG" }
};

function translate(dna) {
  if (typeof dna !== 'string') throw new Error("Translate: " + dna + " is not a string.");
  if (!/^[ACGTacgt]+$/.test(dna)) throw new Error("Input must only contain valid DNA letters (A, C, G, T).");
  dna = dna.toUpperCase();
  let aaSequence = "";
  for (let i = 0; i < dna.length; i += 3) {
    const codon = dna.substring(i, i + 3);
    const aa = geneticCode[codon];
    if (!aa) throw new Error("Invalid codon: " + codon);
    if (aa !== '*') aaSequence += aa;
  }
  return aaSequence;
}

function removeSites(orf) {
  if (orf.length % 3 !== 0) throw new Error("Invalid input sequence. Must be a multiple of 3.");
  orf = orf.toUpperCase();
  if (!/^[ATGC]*$/.test(orf)) throw new Error("Invalid input sequence. Must be composed of only DNA characters.");

  let stopCodon = orf.slice(-3);
  if (!["TAA", "TGA", "TAG"].includes(stopCodon)) {
    stopCodon = "TAA";
  } else {
    orf = orf.slice(0, -3);
  }

  const codonArray = orf.match(/.{1,3}/g);
  const proteinSequence = translate(orf);

  const forbiddenSequences = [];
  for (const enzymeName in geneRestrictionEnzymes) {
    const { recognitionSequence, recognitionRC } = geneRestrictionEnzymes[enzymeName];
    forbiddenSequences.push(recognitionSequence);
    if (recognitionSequence !== recognitionRC) forbiddenSequences.push(recognitionRC);
  }

  outer: while (true) {
    let changeMade = false;
    for (const site of forbiddenSequences) {
      let searchStart = 0;
      while (true) {
        const siteIndex = orf.indexOf(site, searchStart);
        if (siteIndex === -1) break;

        const overlapping = [];
        for (let i = 0; i < Math.floor(site.length / 3); i++) {
          overlapping.push(i + Math.floor(siteIndex / 3));
        }

        const idx = overlapping[Math.floor(Math.random() * overlapping.length)];
        const aa = proteinSequence[idx];
        const options = codonUsageData[aa];
        let newCodon = options[Math.floor(Math.random() * options.length)];
        while (newCodon === codonArray[idx]) {
          newCodon = options[Math.floor(Math.random() * options.length)];
        }

        codonArray[idx] = newCodon;
        orf = codonArray.join("");
        searchStart = siteIndex + 1;
        changeMade = true;
        continue outer;
      }
    }
    if (!changeMade) break;
  }

  return codonArray.join("") + stopCodon;
}

function oneAAoneCodon(peptide) {
  if (!/^[A-Z\*]+$/.test(peptide)) throw new Error("Input must be amino acid letters and asterisks.");
  return peptide.split("").map(aa => aa === '*' ? "TAA" : codonUsageData[aa][0]).join("");
}

// Add functions to the C6 namespace
window.C6 = window.C6 || {};
Object.assign(window.C6, {
  translate,
  removeSites,
  oneAAoneCodon
});
