<script src="https://unpkg.com/seqviz"></script>
# pP6 Intro: Finding Strong Promoters in *E. coli*

## Goal of the Experiment

The goal of this experiment is to build new DNA control sequences called promoters that drive very strong gene expression. You will create a collection of bacteria, each with a different promoter, and then pick the brightest green colonies. Finally, you will measure how strong those promoter parts are and compare them to other sequences we already know.

## Background: Transcription in *E. coli*

![Diagram of transcription in E. coli, showing promoter, -35 and -10 boxes, +1 transcription start site, CDS, terminator, and resulting mRNA with RBS.](../images/pp6_transcription.png)
*Figure: Transcription in E. coli. RNA polymerase binds the promoter at the -35 and -10 sites, initiates at +1, and transcribes a coding sequence (CDS) into mRNA with an RBS. The transcript ends at a terminator sequence.*

When RNA polymerase binds to a promoter in *E. coli*, it begins transcription at the +1 position, synthesizing an mRNA strand. This mRNA includes a ribosome binding site (RBS) and a coding sequence (CDS). The -10 and -35 sequences upstream of the +1 site strongly influence transcription strength.

## The J23100 Promoter Family

Years ago, a standard set of synthetic promoters was developed by mutating a parent sequence called J23119. This set, known as the J23100 promoter family, provides a spectrum of expression strengths and has proven very useful for fine-tuning gene expression.

These promoters are ideal when you want to scan through different expression levels of the same gene using well-characterized sequences. Each member of the family was created by introducing mutations into the -35 and -10 boxes of J23119, while keeping the flanking sequence constant.

![J23100 promoter variants showing fluorescence output, promoter sequences, and measured RFP levels for each variant.](../images/j23100_library.png)
*Figure: The J23100 promoter family. Variants were created by mutating the -35 and -10 regions while keeping flanking sequences constant. Fluorescence and sequence alignment show relative expression strengths.*

## Why Build New Promoter Libraries?

Although the J23100 family is widely used, it has some limitations:

- All promoters share a nearly identical sequence backbone, making them prone to homologous recombination when used together in a single plasmid.
- Repeating these sequences interferes with PCR-based edits and makes cloning less reliable.

To overcome these issues, we aim to build multiple promoter families with similar activity ranges—but based on entirely distinct sequences. These new libraries can be used together safely in the same construct and facilitate more advanced synthetic biology designs.

## The pP6 Library Design

The pP6 experiment is designed to generate a sixth-generation promoter library following this strategy.

We retain only the minimal motifs required for strong σ⁷⁰ recognition and randomize all other surrounding bases. This allows us to create new promoters that are strong, functional, and non-redundant.

- Fix the -35 and -10 consensus motifs.
- Randomize all other positions.

![Diagram showing core RNA polymerase and sigma factor binding a consensus promoter, highlighting the -35 and -10 regions.](../images/consensus_promoter.png)
*Figure: σ⁷⁰ consensus promoter. The sigma factor of RNA polymerase recognizes the -35 (TTGACA) and -10 (TATAAT) boxes and initiates transcription at the +1 site. This image shows the promoter region unwound and engaged by polymerase.*

We also add 4 random bases upstream and downstream, yielding 31 degenerate positions in total.


<div id="viewer_fwd"></div>
<script>
  function waitForSeqViz(callback) {
    if (typeof seqviz !== "undefined" && seqviz.Viewer) {
      callback();
    } else {
      setTimeout(() => waitForSeqViz(callback), 50);
    }
  }

  waitForSeqViz(() => {
    seqviz
      .Viewer("viewer_fwd", {
        "name": "Consensus Promoter Pattern",
        "seq": "NNNNttgacaNNNNNNNNNNNNNNNNNtataatNNNNNNaNNNN",
        "annotations": [
          { "name": "-35", "start": 4, "end": 10, "color": "turquoise", "direction": 1 },
          { "name": "-10", "start": 27, "end": 33, "color": "turquoise", "direction": 1 },
          { "name": "+1", "start": 39, "end": 40, "color": "turquoise", "direction": 1 }
        ],
        "translations": [],
        "viewer": "linear",
        "showComplement": true,
        "showIndex": true,
        "style": { "height": "120px", "width": "100%" }
      })
      .render();
  });
</script>

## Construction File

We use a "construction file" to formally describe how DNA parts are assembled. Each line represents a biochemical reaction step using standardized syntax.

The pP6 promoter library is built using a two-step process involving PCR and Golden Gate assembly.

We will use a technique called EIPCR (Enzymatic Inverse PCR), which involves amplifying the entire plasmid by PCR. Each PCR primer includes a constant 3′ annealing region and a 5′ overhang containing degenerate bases (the N's).  The 'N' effectively means "pick a random base from A, T, C, or G for this position". This introduces variability into the unconserved promoter regions:

**Primers:**
```
>P6libF2
CAGTAggtctcgATAATNNNNNNANNNNGTTAGTATTTCTCCTCGTCTAC

>P6libR2
CCAAAggtctcgTTATANNNNNNNNNNNNNNNNNTGTCAANNNNGAACCCAGGACTCCTCGAAGTC
```

**Construction of pP6**

```
# PCR reaction
# step      primer1     primer2     template     product
PCR         P6libF2     P6libR2     pJ12         P6

# Golden Gate assembly
# step          dna         enzyme     product
GoldenGate      P6          BsaI       pP6
```

## Expected Outcome

The product of the reaction is a circular plasmid with a unique randomized promoter upstream of an amilGFP reporter.

During transformation, typically only 1 plasmid molecule enters a cell, confers resistance, and results in a colony on your petri dish. Thus, each colony on your transformation plate represents a unique promoter. When exposed to blue light, colonies fluoresce with varying intensity depending on promoter strength.

![Fluorescent E. coli colonies on a pP6 transformation plate. Colonies show a range of green intensities under blue light, indicating different promoter strengths. A zoomed-in view shows a bright green colony surrounded by weaker, possibly satellite colonies.](../images/pp6_colony_plate.png)  
*Figure: A pP6 transformation plate under blue light, showing colonies that express varying levels of GFP due to differences in promoter strength. The highlighted region is zoomed in to reveal diverse green intensities among clones, even though all share the core consensus motif. This illustrates the wide range of activities produced by flanking sequence variation—J23119 is unusually strong for this pattern.*

## Picking Colonies and Sequencing

You’ll select the brightest colonies (most green) for follow-up:

1. Grow in liquid culture
2. Miniprep DNA
3. Submit for sequencing
4. Analyze the sequence to identify the promoter

Note: Smaller, slow-growing colonies might encode the strongest promoters. Don’t skip them!

## Getting Started

1. Download the pP6 lab sheets and sequences:  
   [Google Drive - pP6 Materials](https://drive.google.com/drive/folders/16-0ek2biyB-hI1RY2xgW6p4fe32FbAJh)

2. Make a copy of this spreadsheet:  
   [pP6 LabSheet Workbook](https://docs.google.com/spreadsheets/d/1updHzk3CJ2_L7eO-Abg0cpHQleU7c8b0lbF9QmNzFWA/edit?usp=sharing)

3. Fill in your name and ID, and print the lab worksheets.  You may also use your phone, tablet, or notebook.  You could also write out your own notes instead.

4. Read the tutorial, take the quiz, and watch the demo videos before each lab activity.

## All Demo Videos

All the videos are available in Media Gallery on Bcourses:

- pP6-2022-1-PCR  
- pP6-2022-2-Gel  
- pP6-2022-3-Zymo  
- pP6-2022-4-Assembly  
- pP6-2022-5-Transformation  
- pP6-2022-6-Pick  
- pP6-2022-7-Miniprep  
- pP6-2022-8-Sequencing  
- pP6-2022-9-Sequence Analysis

## 🧪 Quiz: Promoter Engineering Concepts

<p><em>Answer all questions correctly to pass. If you miss any, the quiz resets with a new randomized set.</em></p>

<div id="intro_quiz_container"></div>

<div style="margin-top:1rem;">
  <button type="button" id="intro_check_btn">Check Answers</button>
  <button type="button" id="intro_reset_btn">Reset</button>
  <span id="intro_quiz_status" style="margin-left:0.75rem;"></span>
</div>

<script>
(function () {
  const bank = [
    {
      topic: 'Fixed Motifs',
      variants: [
        { text: "The -35 and -10 boxes and the +1 site are fixed in each synthetic promoter.", answer: true },
        { text: "Only the -35 and -10 motifs are conserved, while surrounding bases are randomized.", answer: true },
        { text: "The promoter retains canonical σ70 recognition elements (-35 and -10).", answer: true },
        { text: "The +1 transcription start site is preserved across all library variants.", answer: true },
        { text: "All positions within the promoter are randomized in pP6.", answer: false },
        { text: "The RBS is randomized to create sequence diversity.", answer: false },
        { text: "The -35 and -10 motifs are randomized to create sequence diversity.", answer: false },
        { text: "The only fixed elements in the library are the Shine–Dalgarno and ORF", answer: false }
      ]
    },
    {
      topic: 'Randomized Regions',
      variants: [
        { text: "All non-consensus regions around the -35, -10, and +1 sites are randomized.", answer: true },
        { text: "Degenerate N bases introduce variability at non-conserved positions.", answer: true },
        { text: "Randomization increases promoter diversity while keeping function intact.", answer: true },
        { text: "Flanking sequences upstream and downstream of consensus motifs are randomized.", answer: true },
        { text: "The entire GFP coding sequence is randomized to generate diversity.", answer: false },
        { text: "The ribosome binding site is the only region randomized.", answer: false },
        { text: "Only the antibiotic resistance gene sequence is diversified.", answer: false },
        { text: "Randomization occurs within the fixed -10 and -35 boxes.", answer: false }
      ]
    },
    {
      topic: 'Why Not J23100?',
      variants: [
        { text: "J23100-family promoters are highly similar, causing recombination when used together.", answer: true },
        { text: "Repeating J23100 promoters interferes with PCR-based editing and cloning.", answer: true },
        { text: "Sequence redundancy among J23100 variants leads to instability in plasmids.", answer: true },
        { text: "Distinct promoter libraries prevent homologous recombination issues.", answer: true },
        { text: "J23100 promoters fail to function in E. coli.", answer: false },
        { text: "The J23100 family includes weak σ70 promoters unsuitable for GFP expression.", answer: false },
        { text: "The main limitation of J23100 promoters is lack of transcription start sites.", answer: false },
        { text: "We avoid J23100-family promoters because they lack ribosome binding sites.", answer: false }
      ]
    }
  ];

  const container = document.getElementById('intro_quiz_container');
  const statusEl = document.getElementById('intro_quiz_status');
  const checkBtn = document.getElementById('intro_check_btn');
  const resetBtn = document.getElementById('intro_reset_btn');

  let currentSet = [];

  function pickOnePerTopic() {
    return bank.map(topic => {
      const v = topic.variants[Math.floor(Math.random() * topic.variants.length)];
      return { topic: topic.topic, text: v.text, answer: v.answer };
    });
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function renderQuiz() {
    container.innerHTML = '';
    statusEl.textContent = '';
    checkBtn.disabled = false;
    resetBtn.textContent = 'Reset';

    currentSet = shuffle(pickOnePerTopic());

    currentSet.forEach((q, idx) => {
      const qId = `intro_q${idx + 1}`;
      const block = document.createElement('div');
      block.className = 'intro-quiz-item';
      block.style.margin = '0.75rem 0';

      const h = document.createElement('h4');
      h.textContent = `${idx + 1}. ${q.text}`;
      h.style.margin = '0 0 0.35rem 0';
      block.appendChild(h);

      const trueId = `${qId}_true`;
      const falseId = `${qId}_false`;

      const trueLbl = document.createElement('label');
      trueLbl.style.marginRight = '1rem';
      trueLbl.innerHTML = `<input type="radio" name="${qId}" id="${trueId}" value="true"> True`;
      block.appendChild(trueLbl);

      const falseLbl = document.createElement('label');
      falseLbl.innerHTML = `<input type="radio" name="${qId}" id="${falseId}" value="false"> False`;
      block.appendChild(falseLbl);

      const feedback = document.createElement('p');
      feedback.id = `${qId}_res`;
      feedback.style.margin = '0.35rem 0 0 0';
      block.appendChild(feedback);

      container.appendChild(block);
    });
  }

  function checkAnswers() {
    let allAnswered = true;
    let allCorrect = true;

    currentSet.forEach((q, idx) => {
      const qId = `intro_q${idx + 1}`;
      const chosen = container.querySelector(`input[name="${qId}"]:checked`);
      const feedback = document.getElementById(`${qId}_res`);
      if (!chosen) {
        allAnswered = false;
        feedback.textContent = 'Please choose True or False.';
        return;
      }
      const val = chosen.value === 'true';
      const correct = (val === q.answer);
      allCorrect = allCorrect && correct;
      feedback.textContent = correct ? '✅ Correct' : '❌ Incorrect';
    });

    if (!allAnswered) {
      statusEl.textContent = 'Answer all questions before submitting.';
      return;
    }

    if (allCorrect) {
      statusEl.textContent = '✅ Passed';
      if (typeof progressManager !== 'undefined') {
        progressManager.addCompletion('intro_quiz', 'correct');
      }
    } else {
      statusEl.textContent = '❌ One or more answers were incorrect. Review the feedback below, then click "New set" to try again.';
      container.querySelectorAll('input[type="radio"]').forEach(el => { el.disabled = true; });
      checkBtn.disabled = true;
      resetBtn.textContent = 'New set';
      resetBtn.focus();
    }
  }

  statusEl.setAttribute('aria-live', 'polite');
  document.getElementById('intro_check_btn').addEventListener('click', checkAnswers);
  document.getElementById('intro_reset_btn').addEventListener('click', renderQuiz);
  renderQuiz();
})();
</script>

## Next

When you're ready, proceed to the [Pipetting tutorial](pipetting.md) to learn how to use a micropipette correctly before starting wetlab work.