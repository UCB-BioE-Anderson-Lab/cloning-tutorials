// C6-Annotator.js - DNA Autoannotation and Transcription Inference Library for Web

// Utility function to clean sequences
function cleanSequence(seq) {
  return seq.toUpperCase().replace(/[^ACGT]/g, '');
}

// Match features in a sequence
function annotateSequence(sequence, featureDb = null) {
  sequence = cleanSequence(sequence);
  const detectedFeatures = [];

  const db = featureDb || featureDbGlobal;
  if (!db) throw new Error("No feature database loaded yet.");

  db.forEach(feature => {
    const pattern = cleanSequence(feature.Sequence || '');
    if (pattern.length > 3) {
      let pos = sequence.indexOf(pattern);
      while (pos !== -1) {
        detectedFeatures.push({
          start: pos,
          end: pos + pattern.length,
          strand: +1,
          label: feature.Name,
          type: feature.Type,
          color: feature.Color
        });
        pos = sequence.indexOf(pattern, pos + 1);
      }
    }
  });

  return detectedFeatures.sort((a, b) => a.start - b.start);
}

// Infer transcriptional units from features
function inferTranscriptionUnits(features) {
  const tus = [];
  let currentTU = null;

  features.forEach(feature => {
    if (feature.type.toLowerCase() === 'promoter') {
      if (currentTU) tus.push(currentTU);
      currentTU = { promoter: feature, features: [] };
    } else if (currentTU) {
      currentTU.features.push(feature);
      if (feature.type.toLowerCase() === 'terminator') {
        tus.push(currentTU);
        currentTU = null;
      }
    }
  });

  if (currentTU) tus.push(currentTU);
  return tus;
}

// Translate CDS sequences
function translateCDS(seq) {
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

  let protein = '';
  seq = cleanSequence(seq);
  for (let i = 0; i < seq.length; i += 3) {
    const codon = seq.substring(i, i + 3);
    if (codon.length < 3) break;
    const aa = geneticCode[codon] || '?';
    if (aa === '*') break;
    protein += aa;
  }
  return protein;
}

// Infer expressed proteins from TUs (only return names)
function inferExpressedProteins(sequence, tus) {
  const proteins = [];

  tus.forEach((tu, index) => {
    tu.features.forEach(feature => {
      if (feature.type.toLowerCase() === 'cds') {
        proteins.push({
          tuIndex: index + 1,
          label: feature.label
        });
      }
    });
  });

  return proteins;
}

// Find non-expressed CDS (only return names)
function findNonExpressedCDS(allFeatures, expressedProteins) {
  const expressedLabels = new Set(expressedProteins.map(p => p.label));
  const nonExpressed = [];

  allFeatures.forEach(feature => {
    if (feature.type.toLowerCase() === 'cds' && !expressedLabels.has(feature.label)) {
      nonExpressed.push({ label: feature.label });
    }
  });

  return nonExpressed;
}

// Internal feature database
let featureDbGlobal = null;

// Load feature database automatically
(function initializeFeatureDatabase() {
  const defaultFeatureUrl = "https://raw.githubusercontent.com/UCB-BioE-Anderson-Lab/cloning-tutorials/main/sequences/Default_Features.txt";

  fetch(defaultFeatureUrl)
    .then(response => response.text())
    .then(text => {
      const lines = text.split("\n").filter(line => line.trim().length > 0);
      featureDbGlobal = lines.map(line => {
        const [Name, Sequence, Type, Color, LabelColor, Forward, Reverse] = line.split(/\s+/);
        return { Name, Sequence, Type, Color };
      });
      console.log(`✅ C6-Annotator: Loaded ${featureDbGlobal.length} features.`);
    })
    .catch(err => {
      console.error("❌ Failed to load default features:", err);
    });
})();

// Add functions to the C6 namespace
window.C6 = window.C6 || {};
Object.assign(window.C6, {
  annotateSequence,
  inferTranscriptionUnits,
  inferExpressedProteins,
  findNonExpressedCDS
});