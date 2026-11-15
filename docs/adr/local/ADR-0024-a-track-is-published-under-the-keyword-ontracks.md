---
adr: ADR-0024
slug: a-track-is-published-under-the-keyword-ontracks
title: A track is published under the keyword ontracks
status: accepted
date: 2026-11-15
authors: [Tristan Rivoallan]
supersedes: [local/ADR-0022]
---

# A track is published under the keyword ontracks

## Status

Accepted

## Context

[ADR-0022](ADR-0022-a-package-of-questions-is-called-a-track.md) named the
package of questions a repository installs a **track**, and gave published
tracks the npm keyword `ontrack-tracks`.

The keyword is now `ontracks`: one word, the product's name with the
plural of the thing it installs. No package carries either keyword on the
registry yet (an npm search for each returns nothing on 2026-11-15, and
`@trivoallan/ontrack-engineering` 0.6.0 has neither), so no author has to
move.

Everything else ADR-0022 decided stands, and is restated below so that this
record is the one in force.

## Decision

The package of questions a repository installs is called a **track**.

- A repository installs one or several tracks, each under an alias: "the
  `platform` track".
- A repository that has ruled on every question of its tracks, at their
  current revision, is on track.
- A published track carries the npm keyword `ontracks`.

The railway image stops at this word, as ADR-0022 says. ADRs ruled before
ADR-0022 keep the word "source".

## Consequences

### Positive

- A shorter keyword, that reads as the product's name.

### Negative

- Pages and articles that gave `ontrack-tracks` are wrong until updated.

### Neutral

- The consequences of naming the package a track are those of ADR-0022.

## Alternatives Considered

- **Keep `ontrack-tracks`.** Already written in the documentation, but
  longer, and it repeats "track".

## References

- [ADR-0022](ADR-0022-a-package-of-questions-is-called-a-track.md), which
  this record supersedes.
