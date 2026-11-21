---
adr: ADR-0031
slug: product-artifacts-live-in-the-nanopm-wiki
title: Product artifacts live in the nanopm wiki
status: accepted
date: 2026-11-21
authors: [Tristan Rivoallan]
supersedes: [product/ADR-0003]
traits:
  product:
    artifacts:
      root: .nanopm/wiki/
---

# Product artifacts live in the nanopm wiki

## Status

Accepted

## Context

[product/ADR-0003](../product/ADR-0003-location.md) made `research/` the
root of product artifacts. [ADR-0030](ADR-0030-the-product-toolkit-is-nanopm.md)
then made nanopm the product toolkit, and nanopm writes to `.nanopm/wiki/`,
which git ignored. Product planning was about to happen outside the root,
in a directory nobody else could read, so the evidence and handoff gates
would never see it.

## Decision

We will keep every product artifact under `.nanopm/wiki/`, and track it.

| Key | Value | Reason |
| --- | --- | --- |
| `product.artifacts.root` | `.nanopm/wiki/` | the directory the toolkit writes to, so planning and the artifacts it produces sit in one place |

- `.gitignore` ignores `.nanopm/*` except `.nanopm/wiki/`; the wiki's
  `.lock` and `.last-lint` stay ignored. The rest of `.nanopm/` (raw inputs,
  the search index) stays private.
- The twelve artifacts written with pm-skills move, with their names, from
  `research/` to `.nanopm/wiki/research/`. Their links and the paths they
  name are rewritten; links to them from local ADRs are rewritten as
  [ADR-0025](ADR-0025-a-ruled-adr-follows-the-files-it-references.md)
  allows.

The decision carries no `check:`. The track's checks read the root from
`product/ADR-0003`, which still says `research/`, so they would check the
decision this one replaces.

## Consequences

### Positive

- nanopm's pages are committed and reviewed like the rest of the
  repository.
- One root again: planning and the artifacts built from it are in the same
  directory.

### Negative

- **Until the product check follows superseding ADRs, the evidence and
  handoff gates cover nothing.** `product/ADR-0004` and `product/ADR-0005`
  read the root from `product/ADR-0003`, find no artifact under the now
  empty `research/`, and pass.
- nanopm pages carry no `artifact:` or `evidence:` key. Once the checks read
  this root, every such page fails `product/ADR-0004` until it declares a
  level.
- A hidden directory owned by a tool is the root:
  [product/ADR-0003](../product/ADR-0003-location.md) named that drawback
  when it set this option aside.
- nanopm may reorganise its own wiki; `research/` below it is a directory
  nanopm does not know.

### Neutral

- The data of the desk test stays in `experiments/`.
- Archived OpenSpec changes and the scorer prompts under `experiments/`
  keep the paths they were written with.

## Alternatives Considered

- **Keep `research/`.** The gates keep working; nanopm's wiki stays a
  private workspace, and any page engineering builds on is copied into
  `research/` with its keys.
- **`.nanopm/wiki/`, still ignored.** No move, but nothing in the wiki is
  committed and the gates cover nothing for good.

## References

- [product/ADR-0003](../product/ADR-0003-location.md): the decision this one
  supersedes.
- [ADR-0030](ADR-0030-the-product-toolkit-is-nanopm.md): the toolkit that
  writes to this root.
