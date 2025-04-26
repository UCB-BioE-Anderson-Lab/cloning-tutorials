try {

    // C6-Annotator.js - Improved DNA Autoannotation and Transcription Inference Library for Web
    
    console.log("🚀 C6-Annotator initializing...");
    
    // Utility function to clean sequences
    function cleanSequence(seq) {
      return seq.toUpperCase().replace(/[^ACGT]/g, '');
    }
    
    // Utility function to reverse complement a DNA sequence
    function reverseComplement(seq) {
      const complement = { A: 'T', T: 'A', C: 'G', G: 'C' };
      return seq.split('').reverse().map(base => complement[base] || base).join('');
    }
    
    // Pre-index features by k-mers for fast lookup
    function buildFeatureIndex(features, k = 10) {
      console.log("🔧 Building feature index...");
      const index = new Map();
    
      features.forEach(feature => {
        const pattern = cleanSequence(feature.Sequence || '');
        if (pattern.length >= k) {
          for (let i = 0; i <= pattern.length - k; i++) {
            const kmer = pattern.slice(i, i + k);
            if (!index.has(kmer)) {
              index.set(kmer, []);
            }
            index.get(kmer).push(feature);
          }
        }
      });
    
      console.log(`✅ Feature index built with ${index.size} unique ${k}-mers.`);
      return index;
    }
    
    // Smart matching using feature index
    function annotateSequenceSmart(sequence, featureDb = null) {
      console.log("🔍 Starting annotation...");
      sequence = cleanSequence(sequence);
      const detectedFeatures = [];
    
      const db = featureDb || featureDbGlobal;
      if (!db) throw new Error("No feature database loaded yet.");
    
      const k = 10;
      const index = buildFeatureIndex(db, k);
    
      const seqVariants = [sequence, reverseComplement(sequence)];
      console.log("🧬 Scanning sequence and reverse complement...");
    
      seqVariants.forEach((seq, strandIndex) => {
        for (let i = 0; i <= seq.length - k; i++) {
          const kmer = seq.slice(i, i + k);
          if (index.has(kmer)) {
            const candidates = index.get(kmer);
            candidates.forEach(feature => {
              const pattern = cleanSequence(feature.Sequence || '');
              if (seq.slice(i, i + pattern.length) === pattern) {
                detectedFeatures.push({
                  start: i,
                  end: i + pattern.length,
                  strand: strandIndex === 0 ? +1 : -1,
                  label: feature.Name,
                  type: feature.Type,
                  color: feature.Color
                });
              }
            });
          }
        }
      });
    
      console.log(`🔎 Found ${detectedFeatures.length} matching features.`);
      return detectedFeatures.sort((a, b) => a.start - b.start);
    }
    
    function inferTranscriptionalUnits(features) {
        const tus = [];
        let currentTU = null;
        let lastPromoter = null;
      
        features.forEach(feature => {
          const type = feature.type.toLowerCase();
      
          if (type === 'promoter') {
            if (currentTU) tus.push(currentTU);
            currentTU = { promoter: feature, features: [] };
            lastPromoter = feature;
          } else if (type === 'terminator') {
            if (currentTU) {
              currentTU.features.push(feature);
              tus.push(currentTU);
              currentTU = null;
            }
          } else if (type === 'cds' || type === 'misc_feature' || type === 'primer_bind' || type === 'rep_origin') {
            if (!currentTU && lastPromoter) {
              // If no active TU but we have a promoter previously seen, start a new TU
              currentTU = { promoter: lastPromoter, features: [] };
            }
            if (currentTU) {
              currentTU.features.push(feature);
            }
          } else {
            // For any other feature types, include if inside a TU
            if (currentTU) {
              currentTU.features.push(feature);
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
        'TGC':'C', 'TGT':'C', 'TGA':'*', 'TGG':'W'
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
    
    // Infer expressed proteins from TUs
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
    
    // Find non-expressed CDS
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
    let featureDbGlobal = [];
    
    // Load feature database automatically
    (function initializeFeatureDatabase() {
      const defaultFeatureUrl = "https://raw.githubusercontent.com/UCB-BioE-Anderson-Lab/cloning-tutorials/main/sequences/Default_Features.txt";
    
      console.log("🌐 Fetching default features...");
      fetch(defaultFeatureUrl)
        .then(response => {
          console.log("📥 Feature file fetched, parsing...");
          return response.text();
        })
        .then(text => {
          const lines = text.split("\n").filter(line => line.trim().length > 0);
          featureDbGlobal = lines.map(line => {
            const [Name, Sequence, Type, Color, LabelColor, Forward, Reverse] = line.split(/\s+/);
            return { Name, Sequence, Type, Color };
          });
          console.log(`✅ C6-Annotator: Loaded ${featureDbGlobal.length} features.`);
          // After loading, expose the namespace
          window.C6 = window.C6 || {};
          Object.assign(window.C6, {
            annotateSequenceSmart,
            inferTranscriptionalUnits,
            inferExpressedProteins,
            findNonExpressedCDS
          });
          console.log("✅ window.C6 is now available.");
        })
        .catch(err => {
          console.error("❌ Failed to load default features:", err);
        });
    })();
    
    } catch (err) {
      console.error("❌ C6-Annotator crashed:", err);
    }
    