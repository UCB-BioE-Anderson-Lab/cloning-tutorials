// secondary_miniprep.js
// Miniprep the best clones from an assay and record the result.

export const inputs = [
  { name: "max_hits", type: "number", label: "Maximum clones to prep", default: 4, step: 1 },
  { name: "storage_box", type: "text", label: "Storage box", default: "pP6_hits_1" }
];

export function factory(values = {}) {
  const max = Math.max(1, Number(values?.max_hits ?? 4));
  const box = String(values?.storage_box ?? "pP6_hits_1");

  return {
    name: "Secondary Miniprep of Assay Hits",
    description: `Prep up to ${max} best clones and record their activity.`,
    includes: { required: ["qiagen_miniprep"], optional: [] },
    derived: { max_hits: max, storage_box: box },
    template: `
**Choosing what to prep**
1. From the analysis, identify **one culture per clone worth keeping** — the best-performing
   replicate. Prep **at most ${max}**.

**The prep**
{qiagen_miniprep}

**Labelling and storage**
2. Label **and side-label** the elution tube with the clone and the secondary-prep mark, e.g.
   \`pP6-79A 2°\` on both the top and the side. The degree mark is what distinguishes this from
   the original prep of the same clone.
3. Store in box **${box}** and record the well.

**Recording the result**
4. Submit the relative activity for each clone. The number is only useful next to the clone ID
   and the date it was measured.

**Clean up**
5. Dispose of the petri dishes. Bleach and rinse the culture block.
`
  };
}
