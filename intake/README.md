# Intake Folder

Drop files here to be processed into the site.

## Workflow

1. Drop image files (`.jpg`, `.png`) into this folder
2. Ask Claude to process the intake folder
3. Claude will move images to `docs/assets/images/lab/` and report what was moved
4. Update `docs/assets/data/lab_items.tsv` with the image filenames in the appropriate `img_room`, `img_container`, or `img_contents` columns
5. This folder will be emptied after processing

## Image naming conventions

Use descriptive, lowercase, underscore-separated filenames:

| Level | What it shows | Example filename |
|-------|--------------|-----------------|
| `img_room` | Annotated overview of the wall/area | `right_wall.jpg`, `back_wall.jpg`, `bay2_left.jpg` |
| `img_container` | Interior of a freezer, fridge, cabinet, or box | `enzyme_freezer_interior.jpg`, `culture_fridge_interior.jpg` |
| `img_contents` | Inside of a specific terminal container (box, drawer, bag) | `pink_training_box_inside.jpg`, `BsaI_box_inside.jpg` |

## Image guidelines

- Annotate images with labels/arrows before uploading (e.g., in Preview, PowerPoint, or Google Slides)
- Keep images under 2MB for fast page loads
- Landscape orientation preferred for container/room shots
