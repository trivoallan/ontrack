---
adr: ADR-0003
slug: location
title: Location
status: accepted
revision: 1
date: 2026-11-21
authors: [Tristan Rivoallan]
supersedes: []
check: npx --no-install ontrack-product-check ADR-0003
traits:
  product:
    artifacts:
      root: research/
---

# Location

## Status

Accepted

> **What is this file?** A convention ontrack-product proposes to your
> repository, with the values it recommends. While it says
> `status: proposed`, you may edit it freely. `revision:` dates the
> convention, not the file: you do not fill it. `rejected` is a full ruling:
> when the convention does not apply here, rule `rejected`, remove the whole
> `traits:` block, and say what stands in for it.
> [ADR-0001](ADR-0001-record-product-decisions.md) explains the mechanics.

## Context

An agent asked for a PRD writes it where the conversation suggests: the
repository root, `docs/`, a feature folder, a scratch directory. Six months
later nobody can say which PRDs exist, and a tool that should check them
has nowhere to look.

pm-skills, the toolkit [ADR-0002](ADR-0002-toolkit.md) recommends, fixes no
output path: it writes where it is told. Something has to tell it.

## Decision

**What ontrack-product recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `product.artifacts.root` | `research/` | one directory, at the top of the repository, named for what it holds before anything is built. It sits apart from `docs/`, which describes what exists, and from `openspec/`, which plans what will be built. Any depth below it is yours: `research/search/prd.md` is as valid as `research/prd-search.md` |

**Every product artifact lives under the root.** A product artifact is a
Markdown file tracked by git that says, in an `artifact:` frontmatter key,
what kind of product artifact it is. Anything under the root counts as a
product artifact for the checks of ADR-0002 and ADR-0004; anything with an
`artifact:` key outside it is in the wrong place.

The value is a directory relative to the repository root. It may not be
absolute, nor leave the repository.

**Ruled for this repository: `research/`, as recommended.** The
directory already holds the five product artifacts, and no file tracked
outside it carries an `artifact:` key. The desk-test data that used to sit
under it, generated proposals and scripts with no frontmatter, moved to
`experiments/desk-test-first-proposal/` before this ruling, so that
`research/` holds product artifacts only. The desk test's results, an
experiment-results artifact, stay in `research/desk-test-first-proposal/`
and link to that data.

## Consequences

### Positive

- Every product artifact of this repository is in `research/`, for people,
  agents and checks.
- An artifact written elsewhere fails before review.

### Negative

- Experiment data, which is not a product artifact, needs another home:
  `experiments/`.

### Neutral

- `research/` is not part of the documentation site, which is built from
  `docs/`: hypotheses are not published next to reference pages.

## Alternatives Considered

### `research/`

Recommended, as above.

### `docs/product/`

Keeps every document under `docs/`. It mixes what is described with what
is still a claim, and a documentation site built from `docs/` publishes
hypotheses next to reference pages.

### `.nanopm/wiki/`

The directory nanopm writes to, when [ADR-0002](ADR-0002-toolkit.md) rules
`nanopm`. Hidden, and owned by the tool rather than the team.

### No fixed place

Each artifact goes where it is needed. Nothing can find them all, and the
evidence convention of ADR-0004 has nothing to check.

## References

- [ADR-0002](ADR-0002-toolkit.md): the toolkit that writes the artifacts.
- [ADR-0004](ADR-0004-evidence.md): what every artifact under the root
  declares.

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `product.artifacts.root` | the directory every product artifact lives under | a directory relative to the repository root |

**The key is required**: an empty key is not a value. ADR-0002, ADR-0004 and
ADR-0005 read it from this file, and fail until this ADR is accepted.
