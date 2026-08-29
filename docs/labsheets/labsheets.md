# LabSheet Builder

Enter your experiment number and pick your clones. The sheets below are yours to print, sign
and take to the bench.

The procedures are not written here — they are rendered from the same unit-op protocols the
[Protocol Builder](../../protocols/protocols/) serves, so a labsheet and a protocol can never
tell you different things.

<style>
  #ls-form { display: grid; gap: 1rem; margin: 1rem 0 1.5rem; }
  .ls-row { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); align-items: end; }
  .ls-row label { display: flex; flex-direction: column; font-weight: 600; font-size: .9rem; }
  .ls-row input, .ls-row select { margin-top: .35rem; width: 100%; box-sizing: border-box; }
  fieldset { border: 1px solid #ddd; border-radius: 6px; padding: .8rem 1rem; }
  legend { font-weight: 600; font-size: .9rem; padding: 0 .4rem; }
  .ls-check { display: flex; gap: .5rem; align-items: flex-start; font-weight: 400; margin: .25rem 0; }
  .ls-check small { color: #666; display: block; font-size: .78rem; }
  #ls-clones { max-height: 230px; overflow-y: auto; display: grid;
               grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .1rem .8rem;
               border: 1px solid #eee; padding: .5rem; border-radius: 4px; }
  #ls-tally { font-size: .9rem; color: #444; }
  #ls-warn { background: #fff6e5; border-left: 3px solid #d08a00; padding: .6rem .8rem;
             border-radius: 3px; font-size: .9rem; }
  #ls-error { background: #fdecea; border-left: 3px solid #c0392b; padding: .6rem .8rem;
              border-radius: 3px; font-size: .9rem; }
  .ls-err { color: #c0392b; }
  button { cursor: pointer; }
  button:disabled { cursor: not-allowed; opacity: .5; }

  .labsheet { border: 1px solid #ddd; border-radius: 6px; padding: 1.2rem 1.4rem;
              margin: 1.5rem 0; background: #fff; }
  .ls-head { display: flex; justify-content: space-between; align-items: flex-start;
             gap: 1rem; border-bottom: 2px solid #222; padding-bottom: .5rem; margin-bottom: .9rem; }
  .ls-exp { font-size: .8rem; letter-spacing: .06em; text-transform: uppercase; color: #666; }
  .ls-head h2 { margin: .15rem 0 0; font-size: 1.5rem; }
  .ls-num { color: #777; font-weight: 400; }
  .ls-head-r { text-align: right; font-size: .85rem; }
  .ls-sign { color: #777; margin-top: .3rem; white-space: nowrap; }
  .ls-table { border-collapse: collapse; width: 100%; margin: .8rem 0; font-size: .88rem; }
  .ls-table caption { text-align: left; font-weight: 600; font-size: .8rem;
                      text-transform: uppercase; letter-spacing: .05em; color: #666;
                      padding-bottom: .3rem; }
  .ls-table th, .ls-table td { border: 1px solid #ddd; padding: .3rem .5rem; text-align: left; }
  .ls-table th { background: #f5f5f5; font-size: .78rem; text-transform: uppercase;
                 letter-spacing: .04em; }
  .ls-notes { margin-top: .8rem; border-top: 1px solid #eee; padding-top: .6rem; }
  .ls-notes h4 { margin: 0 0 .3rem; font-size: .8rem; text-transform: uppercase;
                 letter-spacing: .05em; color: #666; }
  .ls-notes ul { margin: 0; padding-left: 1.2rem; font-size: .88rem; }

  @media print {
    @page { size: letter portrait; margin: 14mm; }
    html, body { background: #fff !important; }
    .md-header, .md-sidebar, .md-footer, .md-tabs, #ls-form, #ls-tools,
    h1, .ls-intro { display: none !important; }
    .md-main__inner, .md-content { margin: 0 !important; }
    .labsheet { border: 0; padding: 0; margin: 0; page-break-after: always;
                break-after: page; font-size: 11pt; }
    .labsheet:last-child { page-break-after: auto; }
    .ls-table { page-break-inside: avoid; break-inside: avoid; }
    .ls-proto li, .ls-notes li { page-break-inside: avoid; break-inside: avoid; }
    h2, h3, h4 { page-break-after: avoid; break-after: avoid; }
  }
</style>

<div id="ls-error" hidden></div>

<div id="ls-form">
  <div class="ls-row">
    <label>Experiment
      <select id="ls-experiment"></select>
    </label>
    <label>Your experiment number
      <input id="ls-id" type="text" placeholder="79" inputmode="numeric">
    </label>
    <label>Your name
      <input id="ls-name" type="text" placeholder="Sally Ride">
    </label>
  </div>

  <p id="ls-subtitle" class="ls-intro"></p>

  <fieldset>
    <legend>Reference plasmids</legend>
    <div id="ls-refs"></div>
  </fieldset>

  <fieldset>
    <legend>Your clones</legend>
    <input id="ls-clone-search" type="text" placeholder="Filter by clone or date…">
    <p id="ls-clone-count" style="font-size:.8rem;color:#666;margin:.4rem 0"></p>
    <div id="ls-clones"></div>
  </fieldset>

  <div id="ls-tally"></div>
  <div id="ls-warn" hidden></div>

  <div>
    <button id="ls-build">Build my labsheets</button>
  </div>
</div>

<div id="ls-tools" hidden style="display:flex;gap:.5rem;margin:.5rem 0;">
  <button id="ls-print">Print</button>
  <button id="ls-copy">Copy link</button>
</div>

<div id="ls-output"></div>

<script type="module" src="../../protocols/renderer.js"></script>
<script src="../labsheets.js"></script>
