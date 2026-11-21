---
adr: ADR-0004
slug: evidence
title: Evidence
status: accepted
revision: 1
date: 2026-11-21
authors: [Tristan Rivoallan]
supersedes: []
check: npx --no-install ontrack-product-check ADR-0004
traits:
  product:
    evidence:
      levels: [hypothesis, observed, validated]
      required: observed
---

# Evidence

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

A PRD written by an agent reads the same whether it rests on twenty user
interviews or on one sentence typed in a chat. Its structure is complete,
its tone is confident, and nothing in it says how much of it is known. The
next agent, asked to build it, takes it at its word.

pm-skills' templates record the kind of an artifact, its version, its
creation date and its draft status. None of them records how well the
artifact is supported.

## Decision

**ontrack-product adds one frontmatter field, `evidence:`, to every product
artifact** under the root [ADR-0003](ADR-0003-location.md) fixes. pm-skills
does not write it: add it when the artifact is created, next to `artifact:`.

```yaml
---
artifact: prd
version: "1.0"
created: 2026-11-21
status: draft
evidence: hypothesis
---
```

**What ontrack-product recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `product.evidence.levels` | `[hypothesis, observed, validated]` | three levels, weakest first, each one a different kind of claim. Fewer cannot tell a guess from a seen behaviour; more invites arguing about the level instead of looking at users |
| `product.evidence.required` | `observed` | the level an artifact must reach before engineering builds on it ([ADR-0005](ADR-0005-handoff.md)). A hypothesis is welcome as a starting point, not as a specification |

The recommended levels mean:

- **`hypothesis`**: what the artifact states is believed, not yet seen.
- **`observed`**: what it states has been seen in real use, interviews or
  data, at least once.
- **`validated`**: what it states has been tested on purpose, and the test
  came out as the artifact says.

The levels are ordered: each one ranks above those before it in the list.
`product.evidence.required` must be one of them.

**How a level is raised is not decided in this revision.** What proves an
artifact `observed` or `validated`, and how that proof is written next to
the level, is left to a later revision of this convention. Until then, the
level is declared by whoever writes the artifact, and review judges it.

**Ruled for this repository: three levels, `observed` required, as
recommended.** The five artifacts under `research/` already declare
`evidence: hypothesis`. The PRD among them already waits on observation
before its second phase ships (`research/prd-backlog-reveal.md`,
Timeline): this ruling writes down a gate the repository was keeping in
prose.

## Consequences

### Positive

- How sure each artifact of `research/` is reads in one key.
- The PRD's two phases now have a level to move between: its second phase
  is built once the PRD reads `observed`.

### Negative

- The level is self-declared: an artifact can claim `observed` with
  nothing behind it, until a later revision of the track says what proves
  it.
- pm-skills does not write `evidence:`: it is added by hand, or by the
  agent, when an artifact is created.

### Neutral

- Every artifact here is at `hypothesis` today; `observed` and `validated`
  are not used yet.

## Alternatives Considered

### Three levels, `observed` required

Recommended, as above.

### Two levels, `hypothesis` and `validated`

Simpler, but it forces a choice between a guess and a tested result, and
most product knowledge sits between them.

### Proof required with the level

Each level would come with the source that supports it, and the check would
require one. Deferred: what counts as proof differs between teams, and
deciding it now would freeze a guess.

### No evidence field

Artifacts stay as pm-skills writes them. Nothing tells a supported PRD from
an unsupported one, and ADR-0005 has nothing to gate on.

## References

- [ADR-0003](ADR-0003-location.md): which files are product artifacts.
- [ADR-0005](ADR-0005-handoff.md): where the required level is enforced.

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `product.evidence.levels` | the evidence levels, weakest first | a list of distinct names, at least one |
| `product.evidence.required` | the level an artifact must reach before a change builds on it | one of `product.evidence.levels` |

**Both keys are required**: an empty key is not a value. The check needs
ADR-0003 accepted.
