---
adr: ADR-0026
slug: the-engineering-track-skips-the-cooldown-under-its-new-alias
title: The engineering track skips the cooldown under its new alias
status: accepted
date: 2026-11-15
authors: [Tristan Rivoallan]
supersedes: [ADR-0024, engineering/ADR-0018, engineering/ADR-0020]
check: npx --no-install ontrack-engineering-check ADR-0018
traits:
  dependencies:
    updater: dependabot
    automerge: patch
  admission:
    approver: person
    install_scripts: ignored
---

# The engineering track skips the cooldown under its new alias

## Status

Accepted

## Context

[ADR-0024](ADR-0024-the-engineering-track-skips-the-cooldown.md) exempts the
engineering track from the three-day cooldown of
[ADR-0018](../engineering/ADR-0018-dependencies.md) rule 2 and
[ADR-0020](../engineering/ADR-0020-adding-dependencies.md) rule 2. Read it,
and ADR-0023 before it, for the reasons, which stand.

Its decision names the alias `trivoallan` in `.github/dependabot.yml`, and
it says that a renamed alias needs a new ADR. This repository now installs
the track under the alias `engineering`, the package name without its scope
and without `ontrack-`.

## Decision

Rule 2 of ADR-0018 and rule 2 of ADR-0020 apply to every dependency except
the engineering track, which is neither delayed when proposed nor when
installed:

- `.github/dependabot.yml`: the root npm entry lists `engineering` under
  `cooldown.exclude`;
- `.npmrc`: `min-release-age-exclude[]=@trivoallan/ontrack-engineering`.

No other dependency is exempted. Every other rule and trait of ADR-0018 and
ADR-0020 stands unchanged: `dependencies.updater: dependabot`,
`dependencies.automerge: patch`, `admission.approver: person`,
`admission.install_scripts: ignored`.

`ontrack check` runs the track's check for ADR-0018. The track ships none
for ADR-0020.

## Consequences

### Positive

- The record names the alias the repository uses.

### Negative

- As in ADR-0024: a compromised release of the track is installed without
  the three days in which someone else might notice it.

### Neutral

- `.npmrc` names the package, not the alias, and does not change.
- A renamed alias still needs `.github/dependabot.yml` updated, and a new
  ADR.

## Alternatives Considered

- **Keep ADR-0024 and change only the configuration.** Its decision would
  name an alias the repository no longer installs.

## References

- [ADR-0024](ADR-0024-the-engineering-track-skips-the-cooldown.md), which
  this record supersedes, with ADR-0018 and ADR-0020.
- [ADR-0025](ADR-0025-a-ruled-adr-follows-the-files-it-references.md), under
  which the references of ADR-0024 follow the rename.
