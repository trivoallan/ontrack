---
adr: ADR-0006
slug: commits
title: Commits
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  commits:
    scopes:
    tool:
---

# Commits

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

While these keys are empty, an agent writing a commit message **invents a
scope**: `fix(api)`, then `fix(backend)`, then `fix(server)` for the same
place. The history can no longer be filtered, and a release generated from
the messages sorts changes into the wrong places. Once the list is written,
the agent picks from it.

**The format itself is not decided here.** governance requires
[Conventional Commits](https://www.conventionalcommits.org/) and its eleven
types. What is yours to decide is the **scope vocabulary** of this
repository, and the **tool** that enforces it, or the absence of one.

**What `rejected` means in this ADR**, then: that you name neither scopes
nor a tool. Not that you refuse the format, which does not depend on you. A
single-area repository with no pipeline is the typical case.

## Decision

**What governance fixes, and is not up for ruling:** the Conventional
Commits format, its **eleven types** (`feat`, `fix`, `docs`, `style`,
`refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`) and its
breaking-change syntax. It is the one thing that makes histories comparable
from one repository to the next.

**What governance recommends for the tool, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `commits.tool` | `commitlint` | **if this repository generates its versions from commit messages**: an off-format message then produces a wrong version, and review does not catch it reliably |

**Check that premise first.** If you set versions by hand, the
recommendation falls, and `none` is just as good an answer. The reason rests
on that premise and only holds for repositories it describes.

**For `commits.scopes`, governance has no answer to recommend**, and that is
information: scopes name **your** areas, and governance does not know them.
A default list would be a guess dressed as a recommendation. Write one word
per area you want to be able to filter on, and not one more. **`[]` is a
full answer**: a single-area repository has nothing to name, and a list
invented on adoption ages worse than no list.

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
adr: ADR-0006
slug: commits
title: Commits
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  commits:
    scopes: [api, cli, docs]
    tool: commitlint
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- An agent picks a scope from a closed list instead of inventing one, so
  the history can be filtered by area.
- With `commitlint` in CI, an off-format message is refused before it can
  produce a wrong version.

### Negative

- `commitlint` is one more dependency and one more CI job to keep working.
- A closed scope list has to be updated when the repository grows a new
  area; until then, the new area has no scope.

### Neutral

- The eleven types and the breaking-change syntax apply whatever you rule
  here.

## Alternatives Considered

### A closed list of scopes

One word per area of the repository, decided once. Filterable history; the
list needs updating when areas change.

### No scopes

`feat:` with no parentheses. A sound answer for a single-area repository;
write `[]`, not nothing.

### `commitlint`

The reference tool, run in CI: it refuses the pull request, so it also
protects what arrives through the forge.

### `hook`

A local check before each commit. It warns earlier, but it does not see what
is pushed from a machine that does not have it installed.

### No tool

Review keeps the convention. Enough when versions are set by hand.

## References

- Adapted from surdesrails [SDR-0006](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0006-commits.md), revision 1.
- [Conventional Commits](https://www.conventionalcommits.org/).
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.
- [ADR-0009](ADR-0009-branching.md): with `squash`, the merge message is the one that carries the type.

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `commits.scopes` | the scopes allowed in this repository | a list of words, or `[]` |
| `commits.tool` | what enforces the convention, and **where** | `commitlint` in CI, `hook` locally, or `none` |

**What these keys do not cover:** the eleven types and the breaking-change
syntax. They come from governance and are not declared here.

**An empty key is not an answer**: both are required. `[]` and `none` are
answers; empty is not. The value is written in this file and nowhere else;
whoever needs it links here. See ADR-0001 for the check command.
