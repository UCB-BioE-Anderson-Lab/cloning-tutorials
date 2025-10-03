// reporter_comp_cells.js
registerModule({
  id: "reporter_comp_cells",
  inputs: ["strain", "plasmid", "scale_mL", "view"],
  async run(ctx){
    // Ask for flask if needed (always asks in stub)
    const ok = await ctx.inventory.hasSterileFlask(ctx.get("scale_mL") || 100);
    if(!ok){
      await ctx.include("modules/preparation_of_culture_flask.md", { quick: ctx.get("view")==="quick" });
    }
    await ctx.include("modules/start_prep_dilution.md", { quick: ctx.get("view")==="quick" });
    await ctx.include("modules/make_comp_cells.md", { quick: ctx.get("view")==="quick" });
  }
});
