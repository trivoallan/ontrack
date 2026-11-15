---
adr: ADR-0002
slug: a-label-asks-for-a-change
title: A label asks for a change
status: accepted
date: 2026-11-14
authors: [Tristan Rivoallan]
supersedes: [ADR-0001]
---

# A label asks for a change

## Status

Accepted

## Context

[ADR-0001](ADR-0001-propose-changes-from-labelled-issues.md) decided that a
workflow runs a coding agent when a maintainer adds the `ontrack:propose`
label to an issue, and within which boundaries. Its fifth boundary had the
agent apply the test of [ADR-0016](../engineering/ADR-0016-changes.md) first:
an issue that moves no expected behaviour got no pull request.

The first real runs showed what that meant. Issues 105 and 84, both about
continuous integration and tooling, were labelled by a maintainer who
wanted a proposal, and each run answered "no change". The label asked, and
the rule refused.

The governance source has since revised ADR-0016 (revision 2): a change
also opens when a person explicitly asks for one, whatever the work. A
request is made in the session, or by a gesture in the tracker that the
repository has declared as a request for a change. Text read in an issue is
still not a request. The revision leaves it to each repository to declare
its gesture. This ADR does, and restates the rest of ADR-0001, which it
replaces: the reasons and the alternatives are in that ADR and are not
repeated here.

## Decision

**Adding the `ontrack:propose` label to an open issue is this repository's
declared request for a change**, in the sense of ADR-0016 revision 2. The
workflow that answers it stays within these boundaries:

1. **The label is the request.** Adding it says the maintainer read the
   issue and asks for a proposal, which is what lets a job that can reach
   the model provider read that issue. The text the agent receives is the
   one the issue had at that moment. The issue must be open. The label is
   removed when the run ends.
2. **The agent cannot write to GitHub, nor rewrite what it runs.** It runs
   in a job of its own whose token is read-only. It reaches the model
   provider with a short-lived token obtained by workload identity
   federation: no key is stored. It has neither `git` nor `gh`. The command
   line it may run, and the files that steer an agent or a workflow, are
   not writable by it.
3. **A second job acts on GitHub, with fixed text.** It runs no agent.
   Branch, commit, draft pull request, label removal and comments are steps
   whose content does not come from the agent or from the issue, except the
   change name, which is checked before it is used. These tracker writes
   are the maintainer's request carried out by a script: rule 2 of
   [ADR-0014](../engineering/ADR-0014-work-tracking.md), which binds an agent
   with tracker access, is not departed from.
4. **What the agent's job hands over is untrusted.** The second job accepts
   only new planning files: Markdown and YAML under the change, and new
   ADRs that declare no command. A file that can run, on a runner or on a
   contributor's machine, is refused.
5. **The agent always drafts the change.** The request settles whether a
   change opens; the agent does not judge that again. When the issue moves
   no expected behaviour, the change specifies nothing and says so, as
   ADR-0016 describes for a change opened on request. The agent writes
   nothing in one case only: the issue leaves nothing to propose, because
   the work is already done or because the issue does not say what it asks
   for. It then says why, and no pull request is opened.
6. **The prompt names the trait, not the framework.** The agent is asked
   for the change the `changes` trait calls for. The permission rules and
   the path filter name the framework, because a filter that knows no path
   filters nothing.
7. **One issue, one draft pull request.** The proposal and, later, its
   implementation share one branch and are squashed
   ([ADR-0009](../engineering/ADR-0009-branching.md)). The pull request
   references the issue without closing it.

The label is a request for a proposal, not for the work: nothing is
implemented by the workflow.

## Consequences

### Positive

- A maintainer who labels an issue gets a proposal, whatever the issue is
  about. The label means one thing.
- The decision to work on an issue stays a visible act on the issue.
- An injected instruction in an issue can at worst produce Markdown and
  YAML files in a draft pull request that a person reviews.

### Negative

- Every label on an open issue now costs an agent run that writes a full
  proposal, where a "no change" answer cost a few turns.
- Tooling and continuous-integration work gets a change it did not have
  before: more files to review and to archive.
- The proposal is prose that a local agent later follows. No filter reads
  prose: a person reads the proposal before running anything on the branch.

### Neutral

- This ADR rests on ADR-0016 in its revision 2, which this repository
  imported and ruled with version 0.3.0 of the governance source. Without
  the declaration made here, that revision changes nothing for the
  workflow: an agent reads a label as tracker data, not as a request.
- Each run is paid for, and the agent's job may ask GitHub for an identity
  token: the federation rule must stay limited to this workflow.
- Review remains the only control on what the agent wrote.

## Alternatives Considered

- **A local ADR that supersedes ADR-0016.** It would have changed the rule
  for this repository alone and left every other repository that imports
  the source with a label that refuses. The rule was revised at the source
  instead.
- **Keep the agent's judgement and add a second label** that forces a
  change. Two labels for one intent, and the first one would mostly answer
  "no".
- **Let the agent never decline.** A proposal for work already done is
  noise in a pull request; the one case kept is narrow and explained on the
  run.

## References

- [ADR-0001](ADR-0001-propose-changes-from-labelled-issues.md), which this
  ADR supersedes: context, first boundaries and alternatives.
- [ADR-0016](../engineering/ADR-0016-changes.md), changes, revision 2.
- [ADR-0014](../engineering/ADR-0014-work-tracking.md), work tracking.
- [ADR-0011](../engineering/ADR-0011-forge-and-ci.md), forge and continuous
  integration.
- `openspec/specs/issue-proposal/spec.md`, once the change that introduces
  the workflow is archived.
