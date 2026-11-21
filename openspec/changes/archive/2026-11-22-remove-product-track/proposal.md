Issue served: none

## Why

ontrack adopted the product track, `@trivoallan/ontrack-product`, on
2026-11-21 (pull request #230). The track turned out not to be mature
enough. Within a day, its toolkit and its root were superseded, and its
check was found to ignore supersession (#234). The maintainer is
withdrawing it, along with the product-management work built around it,
and will not keep any of it in force.

## What Changes

- **Remove the track.** Uninstall the `product` dev dependency, delete its
  five ruled ADRs in `docs/adr/product/`, and regenerate `AGENTS.md` without
  their instructions. The ADRs are deleted, not superseded: the decision
  is that this repository keeps no record of them in `docs/adr/`, and the git
  history holds them.
- **Restore the cooldown decision for one track.** Delete
  `local/ADR-0028` ("The tracks of this owner skip the cooldown"). Its only
  difference from `local/ADR-0026`, which it superseded, was the product
  track. ADR-0026 is in force again, with the same traits.
  `.npmrc` and `.github/dependabot.yml` go back to excluding the engineering
  track only, and the link in `docs/ontrack-engineering/use-it.md` points to
  ADR-0026.
- **Remove the product-management artifacts.** Delete `research/`
  (journey map, problem statement, hypothesis, solution brief, PRD, desk-test
  results) and `experiments/` (the desk-test data that only `research/`
  explained).
- **Remove the track from the site.** Delete `docs/ontrack-product.mdx` and
  `docs/ontrack-product/`. `docs/find-a-track.md` and `docs/why-ontrack.md`
  name the engineering track alone again. The catalogue stays generic: it
  serves every track ontrack depends on, which is now one.
- **Delete the archived change** `2026-11-21-dogfood-product-track`.
- **Rewrite the spec scenarios that use the product track as their example**
  with a fictitious second track, so that the specs stay true without
  describing a dependency ontrack no longer has.

Archived changes that cite `research/` or `experiments/` keep their text,
and their links stop resolving.

Outside this change: pull request #235 (product strategy, ADR-0029 to
ADR-0032) and trivoallan/ontrack-product#6 are closed unmerged, and issue
#234 is closed. The package `@trivoallan/ontrack-product` and its repository
stay as they are.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `track-catalogue`: the scenarios "Two tracks", "A track with no domain
  table", and those that build a second track's "Use it" page, catalogue
  page and ruling link, name a fictitious track instead of
  `ontrack-product`. No requirement changes.
- `docs-site`: the scenarios "A convention of a second installed track
  becomes a page" and the `llms.txt` link of a second track name the same
  fictitious track. No requirement changes.

## Impact

- `package.json`, `package-lock.json`: the `product` dev dependency is gone.
- `docs/adr/product/` (5 files), `docs/adr/local/ADR-0028-…`: deleted.
- `AGENTS.md`: the five product blocks and ADR-0028's block are gone;
  ADR-0026's block is back.
- `.npmrc`, `.github/dependabot.yml`: the `product` exclusion is gone.
- `research/` (6 files), `experiments/` (276 files): deleted.
- Site: `docs/ontrack-product.mdx`, `docs/ontrack-product/` deleted;
  `docs/find-a-track.md`, `docs/why-ontrack.md`,
  `docs/ontrack-engineering/use-it.md` edited. No site code changes.
- `openspec/changes/archive/2026-11-21-dogfood-product-track/`: deleted.
- CI: `ontrack check` no longer runs `ontrack-product-check`.
