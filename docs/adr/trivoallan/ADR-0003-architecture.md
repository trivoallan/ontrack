---
adr: ADR-0003
slug: architecture
title: Software architecture
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  architecture:
    pattern:
---

# Software architecture

## Status

Proposed

> **What is this file?** A question governance asks your repository, with
> the answer it recommends. While it says `status: proposed`, you may edit
> it freely. `revision:` dates the question, not the file: you do not fill
> it, and it only moves when the question changes. `rejected` is a full
> answer: when the question does not apply here, rule `rejected`, remove
> the whole `traits:` block, and say what stands in for it.
> [ADR-0001](ADR-0001-record-architecture-decisions.md) explains the
> mechanics.

## Context

While this key is empty, an agent adding a module to this repository
invents a structure, and invents a different one each time, because it
infers from whichever file it has open. Once the value is written, it knows
where code goes and what may depend on what.

The question comes early because it is expensive to undo: a directory
layout and dependency boundaries change one module at a time, long after
anyone stopped thinking about them.

Where the architecture is *documented* is a separate question, asked by
[ADR-0010](ADR-0010-architecture-documentation.md).

## Decision

**What governance recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `architecture.pattern` | `hexagonal` | **it suits agentic work**: the domain depends on no I/O, so an agent writes and tests it without a running environment, and changes an adapter without touching the domain |

The reason deserves unpacking, because it is not the usual one. A hexagonal
pattern bounds what an agent has to hold in mind to change a rule: the
domain alone, with no database, no network, no framework. It is also what
makes a change checkable without standing up an environment, so an agent
knows whether it broke something instead of assuming it did not.

**This recommendation does not bind your repository.** It holds for an
application service of moderate size. Under about 500 lines, or for a
repository that is not a service, `monolithic` is often the honest answer;
and if the question has no object here, rule `rejected`.

Everything below disappears when you rule, from this sentence up to the
Consequences heading, which stays.

**How to rule: five steps, all in this file.** Read all of them before
doing any, because the last one deletes the other four, and do them in one
commit.

1. **Write the value of each key** under `traits:` in the frontmatter, or,
   if you rule `rejected`, **remove the whole `traits:` block**.
2. **Change `status:`** from `proposed` to `accepted` or `rejected`.
3. **Fill `date:` and `authors:`**: `date:` as `YYYY-MM-DD`, the day you
   rule; `authors:`, the names of the people who decided, without email
   addresses.
4. **Rewrite the Positive, Negative and Neutral lists under Consequences**
   for your verdict: what it makes easier, and what it costs.
5. **Last, delete this block**, from its first sentence up to the
   Consequences heading, which stays. In its place, write the reason for
   your decision wherever you depart from the recommendation, or, if you
   adopt it as is, one line that says so.

The first step is the one people forget: a decision written only in prose
leaves an agent guessing. This is what the frontmatter looks like once
filled, and it is the one part of the file an agent reads without
interpreting it:

```yaml
---
adr: ADR-0003
slug: architecture
title: Software architecture
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  architecture:
    pattern: hexagonal
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- An agent knows where new code goes and which way dependencies point.
- Domain rules are tested without a database, a network or a framework.

### Negative

- Ports and adapters add indirection that a small repository does not need.
- Every external dependency needs an adapter, which is more files to write
  up front.

### Neutral

- The pattern names the structure; the directory layout, package names and
  dependency rules are still decided in this repository and described in
  this ADR's body or in the architecture document.

## Alternatives Considered

### `hexagonal`

Ports and adapters: the domain depends on no I/O.

### `layered`

Classic layers, each knowing only the next one down.

### `microservices`

Services deployed separately.

### `monolithic`

One deployable, without strong internal boundaries.

### `event-driven`

Components communicate through events.

### `soa`

Shared services, coupled through contracts.

## References

- Adapted from surdesrails [SDR-0003](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0003-architecture.md), revision 1 (its `architecture.pattern` key; `architecture.document` is asked by ADR-0010).
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.

**The key.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `architecture.pattern` | the pattern that structures this repository's code | `event-driven`, `hexagonal`, `layered`, `microservices`, `monolithic`, `soa` |

**One key, on purpose.** governance does not carry your directory layout,
package names or dependency rules: they are decided in your repository and
written in this ADR's body. The trait carries only what an agent must read
without interpreting.

**An empty key is not an answer**: this one is required. The value is
written in this file and nowhere else; whoever needs it links here. See
ADR-0001 for the check command.
