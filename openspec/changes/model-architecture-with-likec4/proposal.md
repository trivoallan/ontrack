# Proposal

## Why

ADR-0010 rules `architecture.model: likec4`, but
`docs/architecture/model/` does not exist. Sections 3, 5 and 7 of the arc42
document are meant to show views generated from one model, so that the
diagrams are text reviewed in a diff and cannot disagree with each other.
Without the model those sections have no diagram, or would get hand-drawn
ones that drift. Source: trivoallan/ontrack#36.

## What Changes

- A LikeC4 model in `docs/architecture/model/` (`.c4` files): ontrack, the
  people and systems around it, its modules, and where it runs.
- Three views generated from it: system context, building blocks,
  deployment.
- The arc42 sections 3, 5 and 7 embed those views on the documentation
  site.
- A CI step validates the model, so a broken reference fails a pull request.

## Capabilities

### New Capabilities
<!-- none: documentation only, `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- New `docs/architecture/model/*.c4`.
- `site/`: the `likec4` package and its Vite plugin (dev dependencies of the
  site project only).
- `docs/architecture/arc42/03-…`, `05-…` and `07-…` become `.mdx` to embed a
  view.
- Depends on the Starlight site of trivoallan/ontrack#34 (the site and its `docs` job) and
  `write-arc42-document` (the sections that embed the views).
- The ontrack package and its dependencies are untouched.
