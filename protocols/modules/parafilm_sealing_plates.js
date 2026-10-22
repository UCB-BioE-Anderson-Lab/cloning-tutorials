// parafilm_sealing_plates.js
// Protocol for sealing Petri dishes with Parafilm.

export const inputs = [];

export function factory() {
  const name = "Sealing Petri Dishes with Parafilm";
  const description = "Cut and apply Parafilm correctly to seal Petri dishes.";

  const template = `
**Protocol**

1. **Prepare the Parafilm.**
   - Unroll the Parafilm and cut a **1-inch-wide strip horizontally** from the roll.  
     ⚠️ *Important:* cut **along the long edge of the roll**, so you create a long, narrow strip — not a short square piece.

2. **Position and start the wrap.**
   - Hold one end of the Parafilm strip against the **side of the Petri dish lid**.
   - Stretch the Parafilm gently until it starts to adhere.

3. **Wrap around the plate.**
   - While holding tension, **spin the plate** slowly so that the Parafilm wraps evenly around the seam.
   - Keep a slight stretch so the film seals smoothly without tearing.

4. **Finish and seal.**
   - When the strip overlaps the starting point, **pull it off the roll** and press the end down firmly to seal it to itself.

5. **Inspect.**
   - Ensure the seal is smooth and continuous around the plate. This slows drying (it does not stop it), helps the lid stay in place if dropped, and keeps condensation and contents contained.

6. **Storage.**
   - Store the sealed plates **inverted in the refrigerator**.
   - **Fresh (unused) carbenicillin plates:** use within **4 weeks** of the pour date; ampicillin plates within **2 weeks**.
   - **Plates with grown colonies:** the cells last about **1–2 weeks**. A plate is a record, not storage; restreak or make a glycerol stock to keep a clone.
   - Too dry to use: agar pulling away from the side, shrinking, or turning darker brown.
   - ⚠️ *Do not Parafilm plates that will be incubated* — cells need airflow to grow properly.

`; 

  return {
    name,
    description,
    includes: { required: [], optional: [] },
    derived: {},
    template
  };
}
