---
adr: ADR-0023
slug: the-governance-track-skips-the-cooldown
title: The governance track skips the cooldown
status: accepted
date: 2026-11-15
authors: [Tristan Rivoallan]
supersedes: [engineering/ADR-0018, engineering/ADR-0020]
traits:
  dependencies:
    updater: dependabot
    automerge: patch
  admission:
    approver: person
    install_scripts: ignored
---

# The governance track skips the cooldown

## Status

Accepted

## Context

[ADR-0018](../engineering/ADR-0018-dependencies.md) rule 2 and
[ADR-0020](../engineering/ADR-0020-adding-dependencies.md) rule 2 hold every
update and every addition back until its release is three days old. That
delay guards against a compromised release of a package someone else
publishes.

The governance track, installed under the alias `trivoallan` from
`@trivoallan/ontrack-governance`, is published by the owner of this
repository. Its releases carry the questions this repository rules on: a
revised question must reach it as soon as it is released, which the
cooldown delays by three days. The repository already exempted the track,
in `.github/dependabot.yml` and in `.npmrc`, without an ADR to say so.

Both ADRs are otherwise followed as ruled. Read them for the rest of the
context.

## Decision

Rule 2 of ADR-0018 and rule 2 of ADR-0020 apply to every dependency except
the governance track, which is neither delayed when proposed nor when
installed:

- `.github/dependabot.yml`: the root npm entry lists `trivoallan` under
  `cooldown.exclude`;
- `.npmrc`: `min-release-age-exclude[]=@trivoallan/ontrack-governance`.

No other dependency is exempted. Every other rule and trait of ADR-0018 and
ADR-0020 stands unchanged: `dependencies.updater: dependabot`,
`dependencies.automerge: patch`, `admission.approver: person`,
`admission.install_scripts: ignored`.

No `check:` line: `governance-check` ships no check for ADR-0018 or
ADR-0020, so the line ADR-0018 carried could only fail.

## Consequences

### Positive

- A revised question reaches this repository the day it is released.
- The exception is written down, so an agent that reads the configuration
  does not "fix" it.

### Negative

- A compromised release of the governance track is installed without the
  three days in which someone else might notice it. The track's publisher
  account is the only guard.

### Neutral

- The exception covers one package by name; a renamed track or alias needs
  both files updated.

## Alternatives Considered

- **Keep the cooldown for the track.** Nothing to exempt, but every
  revised question waits three days before it can be ruled.
- **Record a departure without superseding** (ADR-0001 rule 9). Leaves the
  ADRs in force with an exception written elsewhere; superseding keeps the
  decision in force in one place.

## References

- [ADR-0018](../engineering/ADR-0018-dependencies.md) and
  [ADR-0020](../engineering/ADR-0020-adding-dependencies.md), the decisions
  this one supersedes.
- Pull request #144, which let Dependabot propose governance track updates.
