---
adr: ADR-0028
slug: the-tracks-of-this-owner-skip-the-cooldown
title: The tracks of this owner skip the cooldown
status: accepted
date: 2026-11-21
authors: [Tristan Rivoallan]
supersedes: [ADR-0026, engineering/ADR-0018, engineering/ADR-0020]
check: npx --no-install ontrack-engineering-check ADR-0018
traits:
  dependencies:
    updater: dependabot
    automerge: patch
  admission:
    approver: person
    install_scripts: ignored
---

# The tracks of this owner skip the cooldown

## Status

Accepted

## Context

[ADR-0026](ADR-0026-the-engineering-track-skips-the-cooldown-under-its-new-alias.md)
exempts the engineering track from the three-day cooldown of
[ADR-0018](../engineering/ADR-0018-dependencies.md) rule 2 and
[ADR-0020](../engineering/ADR-0020-adding-dependencies.md) rule 2, and says
that no other dependency is exempted. Read it, and ADR-0023 and ADR-0024
before it, for the reasons.

This repository now also installs the product track,
`@trivoallan/ontrack-product`, under the alias `product`, and rules on its
conventions in `docs/adr/product/`. The reasons that exempt the engineering
track hold for it word for word: it is published by the same owner, from
its release workflow, with provenance; and a convention it revises must
reach this repository as soon as it is released, which a three-day delay on
each release defeats. Without an exemption, its first release could not be
installed here for three days after it is published.

## Decision

Rule 2 of ADR-0018 and rule 2 of ADR-0020 apply to every dependency except
the tracks this repository installs from the same owner, the engineering
track and the product track, which are neither delayed when proposed nor
when installed:

- `.github/dependabot.yml`: the root npm entry lists `engineering` and
  `product` under `cooldown.exclude`, and neither under `ignore`, so that
  each of their releases comes as a pull request;
- `.npmrc`: `min-release-age-exclude[]=@trivoallan/ontrack-engineering` and
  `min-release-age-exclude[]=@trivoallan/ontrack-product`.

No other dependency is exempted. A further track of the same owner needs a
new ADR. Every other rule and trait of ADR-0018 and ADR-0020 stands
unchanged: `dependencies.updater: dependabot`, `dependencies.automerge:
patch`, `admission.approver: person`, `admission.install_scripts: ignored`.
A person still admits the product track when it is first installed.

`ontrack check` runs the engineering track's check for ADR-0018.

## Consequences

### Positive

- A convention the product track revises reaches this repository the day it
  is released, as one of the engineering track does.
- Both exemptions are in one record, with one reason.

### Negative

- As in ADR-0024: a compromised release of either track is installed
  without the three days in which someone else might notice it. The
  exposure now covers two packages.

### Neutral

- `.npmrc` names packages, `.github/dependabot.yml` names aliases: a renamed
  alias still needs the latter updated, and a new ADR.

## Alternatives Considered

- **Keep the cooldown for the product track.** Its first release waits
  three days, and so does each revision; the asymmetry with the engineering
  track would have no reason.
- **Exempt every package of the owner's scope.** Neither `.npmrc` nor
  Dependabot takes a scope here, and the record would cover packages not
  yet written.

## References

- [ADR-0026](ADR-0026-the-engineering-track-skips-the-cooldown-under-its-new-alias.md),
  which this record supersedes.
- [ADR-0018](../engineering/ADR-0018-dependencies.md) and
  [ADR-0020](../engineering/ADR-0020-adding-dependencies.md), whose rule 2 it
  makes the exception to.
