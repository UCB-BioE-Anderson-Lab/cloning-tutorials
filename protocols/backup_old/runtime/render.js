// render.js - stub transclusion
window.ProtocolRender = {
  mountEl: null,
  init(sel){ this.mountEl = document.querySelector(sel); },
  async include(mdPath, { quick=false } = {}) {
    const url = new URL(mdPath, location.origin).toString().replace(/\.md$/, "/");
    const html = await fetch(url).then(r=>r.text());
    const tmp = document.createElement("div"); tmp.innerHTML = html;
    const main = tmp.querySelector("main, article, .md-content") || tmp;
    const section = this.pickSection(main, quick ? "Quick" : "Full");
    const block = document.createElement("section"); block.className="protocol-block";
    block.appendChild((section || main).cloneNode(true));
    this.mountEl.appendChild(block);
  },
  pickSection(root, heading){
    const hs=[...root.querySelectorAll("h2,h3")];
    const start=hs.find(h=>h.textContent.trim().toLowerCase()===heading.toLowerCase());
    if(!start) return null;
    const out=document.createElement("div"); let n=start.nextElementSibling;
    while(n && !/^H[23]$/.test(n.tagName)){ out.appendChild(n.cloneNode(true)); n=n.nextElementSibling; }
    return out;
  }
};
