Issue served: none

## Why

ontrack now has a second public track, `@trivoallan/ontrack-product`
(product-management conventions: toolkit, where product artifacts live, the
evidence a change needs). ontrack is its natural first adopter: `research/`
already holds pm-skills artifacts with an `evidence:` line, and a PRD that
waits on observation. But the site is built for one track only:
`node_modules/engineering` is written into the catalogue, the sidebar and the
specs, and the sidebar itself says a second track's place is undecided.

ontrack should rule on the product track the way it rules on the engineering
track, and the site should show both, so that a reader sees two tracks in use,
and how ontrack ruled on each.

## What Changes

- ontrack installs the product track as a dev dependency, under the alias
  `product` (`product@npm:@trivoallan/ontrack-product`), imports its
  conventions with `ontrack apply`, and rules on them in `docs/adr/product/`.
  `ontrack check` runs their checks in CI.
- The desk-test data in `research/desk-test-first-proposal/` (221 tracked
  Markdown files with no frontmatter, plus scripts) moves to
  `experiments/desk-test-first-proposal/`, so that `research/` holds only
  product artifacts and the product track's checks pass on it. Archived
  changes that cite the old path are left as they are.
- The site's catalogue serves every track ontrack depends on instead of
  `engineering` alone: a track page, a "Use it" page and a "Conventions
  (X.Y.Z)" page per track, catalogue pages read from each track's installed
  release, and the "How ontrack ruled on it" link per track. A track whose
  README has no table of domains lists its conventions in one group.
- The sidebar group "The reference track" becomes **"Tracks catalogue"**,
  holding one entry per track. The engineering track is no longer called
  "the reference track"; the tutorial still installs it.
- `find-a-track.md` names the product track next to the engineering track.
- The URLs of the engineering track's pages do not change.

This change depends on `@trivoallan/ontrack-product` 0.1.0 being published on
npm. Moving the desk-test data does not, and can land first.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `track-catalogue`: from one "reference track" to every track ontrack
  depends on; the navigation group is renamed "Tracks catalogue" and lists
  each track's Overview, Use it and Conventions pages; a track with no
  domain table lists its conventions in one group.
- `docs-site`: catalogue pages are built from each installed track's ADR
  directory, not only `node_modules/engineering/adr/`, including the links
  `llms.txt` gives them.

## Impact

- `package.json`: a new dev dependency, `product`.
- `docs/adr/product/`: five new ADRs, ruled; `AGENTS.md`: their instructions
  block.
- `research/desk-test-first-proposal/` → `experiments/desk-test-first-proposal/`.
- Site: `site/src/track.mjs`, `site/src/content.config.ts`,
  `site/astro.config.mjs` (remark plugin, sidebar, redirects), the track pages
  under `docs/ontrack-engineering*`, new pages under `docs/ontrack-product*`,
  `docs/find-a-track.md`, and the pages that call the engineering track "the
  reference track" (`docs/why-ontrack.md`).
- CI: `ontrack check` also runs `ontrack-product-check`.
