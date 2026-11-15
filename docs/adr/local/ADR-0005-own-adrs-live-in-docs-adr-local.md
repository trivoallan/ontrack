---
adr: ADR-0005
slug: own-adrs-live-in-docs-adr-local
title: Own ADRs live in docs/adr/local
status: accepted
date: 2026-11-15
authors: [Tristan Rivoallan]
supersedes: []
---

# Own ADRs live in docs/adr/local

## Status

Accepted

## Context

ontrack imports the ADRs of each source into `docs/adr/<alias>/` and refers
to an ADR as `<alias>/<name>`. The ADRs a repository writes for itself sat
directly in `docs/adr/` and were referred to as `local/<name>`: a namespace
that existed in every reference and nowhere on disk.

Two numbering sequences shared one visual level. This repository has a
`local/ADR-0001` and a `trivoallan/ADR-0001`, and nothing in the path of the
first said which it was. Tools that list `docs/adr/` by directory, the
documentation site among them, showed the imported ADRs and left the
repository's own out.

## Decision

A repository's own ADRs live in `docs/adr/local/`. `local` is a namespace
like any other: one directory, one numbering sequence, and the reference
`local/<name>` is the path under `docs/adr/`.

Files directly in `docs/adr/` are a historical layout. ontrack still reads
them, `plan` reports them as a migration, and `apply` moves them. Nothing
new is written there.

`local` cannot be the alias of a source.

## Consequences

### Positive

- A reference is a path: `local/ADR-0002-…` is found without knowing a rule.
- Every tool that walks `docs/adr/` by directory sees the repository's own
  ADRs with no special case.
- The next number is read from one directory.

### Negative

- Adopting repositories move their own ADRs once, and fix the links
  `apply` lists.
- The URLs of own ADR pages on a documentation site change.
- A workflow pinned to an earlier version keeps writing at the root until
  it is updated; `plan` reports the file again.

### Neutral

- `supersedes:` is unchanged: a bare name resolves in the ADR's namespace.
- This ADR was written at the root, under the layout it replaces, and moves
  with the others.

## Alternatives Considered

- **Keep the root and show `local` in the documentation only.** No file
  moves, but the namespace stays implicit for every other tool and reader.
- **Read both layouts forever.** No migration, but two places to write and
  to number, and no reason for a repository ever to converge.
- **Name the directory after the repository.** Reads well in one
  repository, but the reference of an own ADR would differ in each, and
  `local/…` is already written in `supersedes:` lists.

## References

- OpenSpec change `local-adr-namespace-folder`.
- [Record architecture decisions](../engineering/ADR-0001-record-architecture-decisions.md),
  which says own ADRs live in `docs/adr/`, outside the source's directory.
