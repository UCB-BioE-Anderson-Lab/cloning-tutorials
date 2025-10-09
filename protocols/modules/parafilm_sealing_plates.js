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
   - Ensure the seal is smooth and continuous around the plate. This prevents the plate from drying out, helps the lid stay in place if dropped, and keeps condensation and contents contained.

6. **Storage.**
   - Store the sealed plates **inverted in the refrigerator**. They remain stable for about **1–2 weeks**.
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
