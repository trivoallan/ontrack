---
adr: ADR-0005
slug: handoff
title: Handoff
status: accepted
revision: 1
date: 2026-11-21
authors: [Tristan Rivoallan]
supersedes: []
check: npx --no-install ontrack-product-check ADR-0005
traits:
  product:
    handoff: openspec
---

# Handoff

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

The moment a PRD turns into engineering work is the moment its claims stop
being cheap. Before it, a wrong hypothesis costs a paragraph; after it, it
costs a feature. [ADR-0004](ADR-0004-evidence.md) says how well each
artifact is supported. Nothing yet says what happens when engineering
starts on one that is not supported enough.

Blocking the PRD itself would be wrong: a hypothesis has to be written down
to be tested. What should be stopped is building on it as if it were known.
Sometimes building is the test, and then the change should say so.

## Decision

**What ontrack-product recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `product.handoff` | `openspec` | engineering work is planned as [OpenSpec](https://github.com/Fission-AI/OpenSpec) changes, written in the repository before the code, so the handoff from product to engineering is a file a check can read: the change's `proposal.md` |

**With `openspec`, this convention assumes engineering work is planned as
OpenSpec changes under `openspec/changes/`.** A change that builds on a
product artifact says so in its `proposal.md`, on a line of its own:

```markdown
PRD: research/prd-search.md
```

**The gate blocks the change, not the PRD.** A PRD below the level
`product.evidence.required` names may exist, be shared and be worked on. A
change whose proposal cites it with a `PRD:` line is refused, unless the
proposal also carries a `Probe:` line that names the hypothesis the change
tests and what will be observed:

```markdown
PRD: research/prd-search.md
Probe: users who search twice abandon less; read in the funnel for two weeks after release.
```

A probe is a change built to learn, not to deliver: it is how a hypothesis
becomes `observed`. **The check only sees that the `Probe:` line is there;
review judges whether the probe is real**: that the hypothesis is the PRD's,
and that what will be observed could prove it wrong.

A proposal with no `PRD:` line passes: it claims no product basis, and
review sees that.

**Ruled for this repository: `openspec`, as recommended.** Changes are
planned as OpenSpec changes ([engineering/ADR-0016](../engineering/ADR-0016-changes.md)).
The `PRD:` and `Probe:` lines are new here: archived changes cite their PRD
in prose, and are not read; no open change cites one. The next change that
builds on a PRD declares it on a `PRD:` line.

## Consequences

### Positive

- A change that builds on `research/prd-backlog-reveal.md`, still at
  `hypothesis`, has to say it is a probe, and what it will observe.

### Negative

- A `Probe:` line is easy to write. Only review tells a real probe from a
  line added to get past the check.
- A change that leaves the `PRD:` line out passes: declaring it is a habit
  this repository has to keep.

### Neutral

- Archived changes are not read: they record what was decided at the time.

## Alternatives Considered

### `openspec`, gate on the change

Recommended, as above.

### Gate on the PRD

Refuse any PRD below the required level. It would keep hypotheses out of the
repository, which is where they should be written and tested.

### Read the links in the proposal

Find PRDs from any link in the proposal's prose instead of a declared line.
It would make the check read prose, and a passing mention would count as a
basis.

### `none`

Engineering work is not planned as files the check can read, or the gate is
not wanted. Say how the repository keeps unsupported PRDs from being built
as if they were known.

## References

- [OpenSpec](https://github.com/Fission-AI/OpenSpec): the change framework this convention assumes.
- [ADR-0003](ADR-0003-location.md): where cited artifacts must live.
- [ADR-0004](ADR-0004-evidence.md): the levels and the required one.

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `product.handoff` | how engineering work that builds on product artifacts is declared | `openspec`, `none` |

**The key is required**: an empty key is not a value.
