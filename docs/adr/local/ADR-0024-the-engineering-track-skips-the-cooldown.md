---
adr: ADR-0024
slug: the-engineering-track-skips-the-cooldown
title: The engineering track skips the cooldown
status: accepted
date: 2026-11-15
authors: [Tristan Rivoallan]
supersedes: [local/ADR-0023, trivoallan/ADR-0018, trivoallan/ADR-0020]
check: npx --no-install ontrack-engineering-check ADR-0018
traits:
  dependencies:
    updater: dependabot
    automerge: patch
  admission:
    approver: person
    install_scripts: ignored
---

# The engineering track skips the cooldown

## Status

Accepted

## Context

[ADR-0023](ADR-0023-the-governance-track-skips-the-cooldown.md) exempted the
track this repository imports from the three-day cooldown of
[ADR-0018](../trivoallan/ADR-0018-dependencies.md) rule 2 and
[ADR-0020](../trivoallan/ADR-0020-adding-dependencies.md) rule 2. Read it for
the reasons, which stand.

Three things it names have since moved:

- the track is published as `@trivoallan/ontrack-engineering`, no longer
  `@trivoallan/ontrack-governance`; `.npmrc` already excludes the new name;
- it is the engineering track, no longer the governance track;
- its check command is `ontrack-engineering-check`, and it now ships a check
  for ADR-0018: run here, it finds `dependencies.updater` and
  `dependencies.automerge` as ruled. ADR-0023 carried no `check:` line
  because there was none to run.

## Decision

Rule 2 of ADR-0018 and rule 2 of ADR-0020 apply to every dependency except
the engineering track, which is neither delayed when proposed nor when
installed:

- `.github/dependabot.yml`: the root npm entry lists `trivoallan` under
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

- The record names the package and the command as they are today.
- `ontrack check` verifies the Dependabot configuration again.

### Negative

- As in ADR-0023: a compromised release of the track is installed without
  the three days in which someone else might notice it.

### Neutral

- A renamed track or alias still needs both files updated, and a new ADR.

## Alternatives Considered

- **Keep ADR-0023.** Its decision is right, but it names a package and a
  command that no longer exist, and runs no check.

## References

- [ADR-0023](ADR-0023-the-governance-track-skips-the-cooldown.md), which this
  record supersedes, with ADR-0018 and ADR-0020.
