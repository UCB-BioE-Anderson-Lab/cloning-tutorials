// runtime.js - minimal engine stub
window.__modules = new Map();
window.registerModule = (def) => window.__modules.set(def.id, def);
function makeCtx(inputs){const s=new Map(Object.entries(inputs||{}));
  return {
    get:(k)=>s.get(k), set:(k,v)=>s.set(k,v),
    include:(p,o)=>window.ProtocolRender.include(p,o),
    inventory: window.ProtocolInventory
  };
}
window.runWorkflow = async ({ root, inputs }) => {
  const mod = window.__modules.get(root);
  if (!mod) throw new Error("Module not found: " + root);
  const ctx = makeCtx(inputs);
  await mod.run(ctx);
};
