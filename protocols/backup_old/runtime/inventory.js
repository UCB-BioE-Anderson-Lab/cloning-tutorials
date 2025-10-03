// inventory.js - tiny stub
window.ProtocolInventory = {
  async hasSterileFlask(scale_mL){
    const minVol = Math.max(250, scale_mL * 2);
    return confirm(`Do you have a sterile flask >= ${minVol} mL available?`);
  }
};
