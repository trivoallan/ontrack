---
adr: ADR-0004
slug: other-repositories-call-the-propose-and-apply-workflows
title: Other repositories call the propose and apply workflows
status: accepted
date: 2026-11-15
authors: [Tristan Rivoallan]
supersedes: []
---

# Other repositories call the propose and apply workflows

## Status

Accepted

## Context

[ADR-0002](ADR-0002-a-label-asks-for-a-change.md) and
[ADR-0003](ADR-0003-a-label-on-an-approved-pull-request-starts-its-apply.md)
gave this repository two labels: one gets a change proposal drafted from an
issue, the other starts an apply session on an approved pull request. The
experiment worked. Other repositories of the same maintainer want the same
path: the governance source, the pilot repositories and several open source
projects. They do not all use the same change framework.

Most of the two workflows is security posture: the agent never holds a
write token, the command line it runs belongs to root, and the job that
writes accepts only new planning files. Copied into each repository, that
posture drifts copy by copy.

## Decision

1. `propose.yml` and `apply.yml` stay in this repository and gain a
   `workflow_call` trigger. Other repositories call them by commit SHA.
   This repository keeps running them on its own issues and pull requests.
2. The frameworks the agent may write for form a closed catalog written in
   `propose.yml`. A caller enables entries by name. It never passes a path,
   a pattern or a tool rule. Each entry fixes the agent's tool rules, the
   command line installed and what the job that writes accepts. A new
   framework joins the catalog through a pull request to this repository.
3. A run fails before the agent starts when the caller's `changes` trait
   names a framework the caller did not enable.
4. The labels are inputs, with `ontrack:propose` and `ontrack:apply` as
   defaults. The apply routine and the token that fires it are passed
   explicitly, never with `secrets: inherit`.
5. ADRs are added in `docs/adr`, the directory ADR-0001 of the governance
   source names. A caller cannot choose another one.

## Consequences

### Positive

- The security posture is maintained once. A fix reaches every caller as a
  Dependabot pull request.
- No caller can widen what the agent may write.
- No new repository and no new dependency: every caller already uses
  ontrack, whose `AGENTS.md` the workflows read.

### Negative

- Callers bump the workflows with each release of ontrack, including
  releases that only change the command line.
- A change to the catalog or to the inputs that breaks callers is a major
  version of ontrack.
- A caller grants the union of the jobs' permissions. The separation that
  makes this safe is only visible in this repository.
- Each caller needs its own federation rule with the model provider.

### Neutral

- Spec Kit and home-grown frameworks are not in the first catalog. Each
  one joins when a calling repository needs it.

## Alternatives Considered

- **A dedicated repository.** Independent versions, but a second dependency
  for every caller and the history split in two. It becomes worth it the
  day a caller wants the workflows without ontrack.
- **The governance source.** It keeps rules and their implementation
  together, but the workflows depend on ontrack's `AGENTS.md` and on
  `ontrack check`, not on the rules.
- **A composite action.** A composite action runs inside one job, and the
  separation between the job that runs the agent and the job that writes
  needs two.
- **Paths or patterns passed by the caller.** Rejected: the filter is the
  only barrier between an issue written by anyone and the branch. A filter
  supplied by each caller is reviewed by nobody.

## References

- [ADR-0002](ADR-0002-a-label-asks-for-a-change.md)
- [ADR-0003](ADR-0003-a-label-on-an-approved-pull-request-starts-its-apply.md)
- [Forge and continuous integration](../engineering/ADR-0011-forge-and-ci.md)
- [Changes](../engineering/ADR-0016-changes.md)
- `openspec/changes/reusable-propose-apply-workflows/`
- trivoallan/ontrack#152
