

# Consumables Ontology

## Purpose
`consumables.tsv` defines a structured inventory of lab materials and consumables, mapping each item to a physical location in the lab.

## File Structure
- **One item per row** — each line describes a single consumable or reagent.
- **Three-level location hierarchy:**
  - `loc1` — the primary location, e.g. `bay1-left-1`, `minus_20`, `no_cells_fridge`.
  - `loc2` — the substructure within that location, such as `left`, `s3`, `rack1`.
  - `loc3` — a finer division, like `d2`, `bin3`, or may be blank.
  Together these define a unique physical place in the lab.

## Columns
- `loc1`, `loc2`, `loc3` — spatial hierarchy (as above)
- `items` — the single consumable at that location
- `target` — desired stock quantity
- `threshold` — low-stock alert quantity
- `protocol_path` — relative path to a lab tutorial describing how to make the item (if applicable)
- `vendor_url` — external purchase link (if applicable); `special_order` may also be used
- `campus_url` — link to an on-campus store or core facility (if applicable)
- `campus_source` — short name of the on-campus provider, e.g. `UCB-ChemStore`
- `preferred_acquire` — one of `protocol`, `campus`, or `vendor` to indicate the primary way to obtain the item

## Notes
- The file supports both legacy headers (`bench`, `stack`, `drawer`) and the new general form (`loc1`, `loc2`, `loc3`).
- Blank values are allowed when a sublocation does not exist.
- This structure allows items in benches, cabinets, fridges, or freezers to be indexed uniformly.

## Example Row
```
loc1	loc2	loc3	items	target	threshold	protocol_path	vendor_url	campus_source	campus_url	preferred_acquire
minus_20	s3	blue_rack	BsaI	4	1		https://neb.com/products/R0535			vendor
```

## Compatibility
Older files with `bench`, `stack`, and `drawer` columns remain valid — the parser will treat them as `loc1`, `loc2`, `loc3` automatically.