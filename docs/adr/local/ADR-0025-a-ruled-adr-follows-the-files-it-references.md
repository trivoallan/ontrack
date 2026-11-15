---
adr: ADR-0025
slug: a-ruled-adr-follows-the-files-it-references
title: A ruled ADR follows the files it references
status: accepted
date: 2026-11-15
authors: [Tristan Rivoallan]
supersedes: [engineering/ADR-0001]
check: npx --no-install ontrack-engineering-check ADR-0001
traits:
  record-architecture-decisions:
    format: nygard
---

# A ruled ADR follows the files it references

## Status

Accepted

## Context

[ADR-0001](../engineering/ADR-0001-record-architecture-decisions.md) rule 4
freezes the body of a ruled ADR: the only things still written in it are its
`status` and its `check:` line.

This repository renames the namespace of the track it imports, from
`trivoallan` to `engineering`. `ontrack apply` moves `docs/adr/trivoallan/`
to `docs/adr/engineering/` and lists what still points at the old folder:
32 links held by 7 ruled local ADRs, and 4 `supersedes:` entries. Under rule
4, none of them may change. The links would then lead nowhere, and the
`supersedes:` entries would match no ADR, so the ADRs they replaced would be
in force again.

A link target or a `supersedes:` entry says where a decision is, not what it
is.

## Decision

Every rule of ADR-0001 holds, with one addition to rule 4: when a file a
ruled ADR references moves, the reference is rewritten to its new path. A
reference is a link target or a `supersedes:` entry. No other character of
the ADR changes, its text included where it names the old path.

The trait `record-architecture-decisions.format: nygard` and the check of
ADR-0001 carry over unchanged.

## Consequences

### Positive

- A namespace rename, or a file moved under `docs/adr/`, leaves no dead link
  and no supersession that stops resolving.
- What `ontrack apply` lists after a move can be fixed in place.

### Negative

- A ruled ADR's file is no longer byte-stable: comparing two versions takes
  reading the diff, not comparing hashes.
- This repository departs from the track's ADR-0001; when the track revises
  it, this ADR is ruled again against the revision.

### Neutral

- The prose of a ruled ADR may name a path that no longer exists. It says
  what was true when the decision was made.

## Alternatives Considered

- **A superseding ADR for every ADR whose references moved.** Seven ADRs
  restated for a path change, and as many more at the next move.
- **Leave the references as they are.** Dead links on the site, and
  `supersedes:` entries that put superseded ADRs back in force.
- **Wait for the track to revise rule 4.** The better place for the rule,
  and it is asked of the track; the rename does not wait for it.

## References

- [ADR-0001](../engineering/ADR-0001-record-architecture-decisions.md), which
  this record supersedes.
- [ADR-0005](ADR-0005-own-adrs-live-in-docs-adr-local.md), the folders under
  `docs/adr/`.
