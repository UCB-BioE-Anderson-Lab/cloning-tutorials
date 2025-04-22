
<script>
  window.addEventListener('DOMContentLoaded', () => {
    const out = [];

    function log(label, result) {
      out.push(`<strong>${label}:</strong> ${result}`);
    }

    try {
      // Cleanup
      log('cleanup', window.C6.cleanup("1 ATGGAGAACTAG GGTCTC"));

      // revcomp
      log('revcomp', window.C6.revcomp("ATGC"));

      // gccontent
      log('gccontent', window.C6.gccontent("ACAACCCCAAGGACCGCGCC").toFixed(2));

      // basebalance
      log('basebalance', window.C6.basebalance("ACAACCCCAAGGACCGCGCC").toFixed(2));

      // maxrepeat
      log('maxrepeat', window.C6.maxrepeat("AATTCCGGGGGAATTT"));

      // isPalindromic
      log('isPalindromic(AATT)', window.C6.isPalindromic("AATT"));
      try {
        window.C6.isPalindromic("CGAN");
      } catch (e) {
        log('isPalindromic(CGAN)', `Error thrown as expected`);
      }

      // Polynucleotide constructors
      log('plasmid', window.C6.plasmid("ACAACCCCAAGGACCGGATCC"));
      log('oligo', window.C6.oligo("ACAACCCCAAGGACCGGATCC"));
      log('dsDNA', window.C6.dsDNA("ACAACCCCAAGGACCGGATCC"));
      log('polynucleotide', window.C6.polynucleotide("ACAACCCCAAGGACCGGATCC", "AATT", "GATC", true, false, false, "", ""));

      // Translate
      log('translate', window.C6.translate("ATGTTCGGTCTCAACGGAGACCAGCAGGAATCTTAA"));

      // oneAAoneCodon
      log('oneAAoneCodon', window.C6.oneAAoneCodon("MFGLNGDQQES"));

      // removeSites
      log('removeSites', window.C6.removeSites("ATGTTCGGTCTCAACGGAGACCAGCAGGAATCTTAA"));

    } catch (err) {
      out.push(`<strong>ERROR:</strong> ${err.message}`);
    }

    document.body.innerHTML = "<h2>C6 Web Tests</h2>" + out.map(line => `<div>${line}</div>`).join("");
  });
</script>