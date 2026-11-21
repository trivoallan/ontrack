---
adr: ADR-0002
slug: toolkit
title: Product toolkit
status: accepted
revision: 1
date: 2026-11-21
authors: [Tristan Rivoallan]
supersedes: []
check: npx --no-install ontrack-product-check ADR-0002
traits:
  product:
    toolkit: pm-skills
---

# Product toolkit

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

Coding agents write product artifacts when asked: a PRD, a problem
statement, a hypothesis, a launch checklist. Without a shared toolkit, each
session improvises the structure, and two PRDs in the same repository share
nothing a person or a script can rely on.

A product toolkit is a set of skills an agent runs to produce those
artifacts from templates. What matters to this track is not the prose the
templates suggest but what they write in a form a tool can read: the rest
of ontrack-product's conventions (ADR-0003 to ADR-0005) check frontmatter,
never prose.

## Decision

**What ontrack-product recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `product.toolkit` | `pm-skills` | the [pm-skills](https://github.com/product-on-purpose/pm-skills) Claude Code plugin, by product-on-purpose. Its templates open every artifact with YAML frontmatter (`artifact:`, `version:`, `created:`, `status:`), so the kind of an artifact is a key, not a guess from its title. It covers discovery to delivery (problem statements, hypotheses, PRDs, experiment designs) and leaves the output path to you, which ADR-0003 fixes |

With `pm-skills`, every product artifact carries a non-empty `artifact:`
key in its frontmatter. An artifact written by hand follows the same rule:
it says what kind of artifact it is.

**Ruled for this repository: `pm-skills`, as recommended.** The five
product artifacts under `research/` were written with pm-skills, and each
already opens with its `artifact:` key (journey-map, problem-statement,
hypothesis, solution-brief, prd). nanopm was tried here and left nothing to
carry over: its `.nanopm/` directory, ignored by git, holds an empty wiki.

## Consequences

### Positive

- The artifacts in `research/` keep the structure they already have, and
  the check confirms each one says what kind it is.
- ADR-0003 to ADR-0005 of this track have a key to read.

### Negative

- This repository depends on a third-party plugin and its template choices.
  If pm-skills changes its frontmatter, the check fails until it is updated.
- pm-skills is not pinned in this repository's agent configuration yet:
  each contributor installs it themselves.

### Neutral

- nanopm is not used: `.nanopm/` stays ignored by git.

## Alternatives Considered

### `pm-skills`

Recommended, as above.

### `nanopm`

A PM pipeline for coding agents (feedback, personas, objectives, strategy,
roadmap, PRD) that keeps its output in a wiki under `.nanopm/wiki/`, each
step reading the previous one. Strong at chaining a planning cycle; its
pages are not typed by an `artifact:` key, so the check has nothing to read
and passes. Choose it when the planning cycle matters more than checked
artifacts; ADR-0003 then names `.nanopm/wiki/` or another root.

### `none`

No toolkit: artifacts are written by hand or by an agent without
templates. The check passes. Say why the repository can do without.

## References

- [pm-skills](https://github.com/product-on-purpose/pm-skills): the recommended toolkit.
- [nanopm](https://github.com/nmrtn/nanopm): the alternative.
- [ADR-0003](ADR-0003-location.md): where the artifacts live, which this check reads.

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `product.toolkit` | the toolkit agents use to write product artifacts here | `pm-skills`, `nanopm`, `none` |

**The key is required**: an empty key is not a value. The check needs
ADR-0003 accepted when the value is `pm-skills`.
