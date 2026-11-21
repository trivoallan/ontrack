---
adr: ADR-0030
slug: the-product-toolkit-is-nanopm
title: The product toolkit is nanopm
status: accepted
date: 2026-11-21
authors: [Tristan Rivoallan]
supersedes: [product/ADR-0002]
traits:
  product:
    toolkit: nanopm
---

# The product toolkit is nanopm

## Status

Accepted

## Context

[product/ADR-0002](../product/ADR-0002-toolkit.md) ruled `pm-skills` the
same day: its templates give every artifact an `artifact:` key that a check
can read. Every artifact under `research/` was written that way. None of
them comes from a step that read the one before it. The strategy for a
first outside adopter
([solution brief](../../../.nanopm/wiki/research/solution-brief-first-adopter.md)) was
assembled by hand from five separate skills, and each one had to be fed
the previous artifact's path.

What this repository now needs from a toolkit is the planning cycle itself:
feedback, personas, objectives, strategy and roadmap, each step reading the
previous one. nanopm is built for that chain. pm-skills is built for
single, typed artifacts.

Nothing in the repository forced the change: `.nanopm/` holds an index and
empty folders. The reason is the maintainer's: the chained cycle matters
more here than artifacts a check can read.

## Decision

We will use nanopm to write this repository's product planning.

| Key | Value | Reason |
| --- | --- | --- |
| `product.toolkit` | `nanopm` | the planning cycle, each step reading the previous one, matters more here than typed, checked artifacts |

The decision carries no `check:`. The track's check reads `product/ADR-0002`,
which still says `pm-skills`, so it would go on checking the decision this
one replaces. With `nanopm`, it has nothing to check anyway.

## Consequences

### Positive

- Strategy, roadmap and PRD are written in one chain, so a later step
  cannot ignore an earlier one.
- The pm-skills plugin is no longer a dependency of this repository's
  product work.

### Negative

- nanopm writes to `.nanopm/wiki/`, which git ignores, so its pages are not
  committed and nobody else can read them.
- [product/ADR-0003](../product/ADR-0003-location.md) still makes `research/`
  the root of product artifacts, so nanopm's pages sit outside it, and
  [product/ADR-0004](../product/ADR-0004-evidence.md) and
  [product/ADR-0005](../product/ADR-0005-handoff.md) never see them. Until
  ADR-0003 is superseded, the evidence gate covers only what is in
  `research/`.
- nanopm pages carry no `artifact:` key: nothing checks what kind of
  artifact a page is.

### Neutral

- The 12 artifacts in `research/`, written with pm-skills, stay as they
  are, and keep their frontmatter.
- product/ADR-0002's file is left untouched: it is superseded because this
  ADR lists it.

## Alternatives Considered

- **Keep `pm-skills`.** Typed artifacts and a working check, but no chain:
  each step is fed its inputs by hand.
- **`none`.** Nothing in the twelve artifacts written so far argues for
  writing them without templates.

## References

- [product/ADR-0002](../product/ADR-0002-toolkit.md): the decision this
  one supersedes, and the comparison of the three toolkits.
- [nanopm](https://github.com/nmrtn/nanopm).
