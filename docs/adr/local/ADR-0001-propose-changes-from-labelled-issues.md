---
adr: ADR-0001
slug: propose-changes-from-labelled-issues
title: Propose changes from labelled issues
status: accepted
date: 2026-11-14
authors: [Tristan Rivoallan]
supersedes: []
---

# Propose changes from labelled issues

## Status

Accepted

## Context

Work is tracked in GitHub issues
([ADR-0014](../engineering/ADR-0014-work-tracking.md)) and changes are described
before they are implemented
([ADR-0016](../engineering/ADR-0016-changes.md)). Going from one to the other is
done by hand, in a local agent session, one issue at a time.

Running that step in continuous integration means a coding agent runs on a
runner, reads text that anyone can write in an issue, and produces a pull
request. Three in-force decisions bear on that:

- [ADR-0011](../engineering/ADR-0011-forge-and-ci.md) lists the jobs a pipeline
  has. A job outside that list is a departure, declared in an ADR of the
  repository. It also forbids giving a secret to an untrusted contribution.
- ADR-0014 says tracker text is data, and that an agent with tracker access
  writes nothing there without an explicit request for that act.
- ADR-0016 says a change opens only when the expected behaviour moves.

This is an experiment: it is kept, moved to the governance source or
removed according to what the first labelled issues show.

## Decision

A workflow runs a coding agent when a maintainer adds the `ontrack:propose` label to
an issue. This job is added to those ADR-0011 lists, within these
boundaries:

1. **The label is the request.** Adding it says the maintainer read the
   issue and asks for a proposal, which is what lets a job that can reach the model provider
   read that issue. The text the agent receives is the one the issue had at
   that moment. The label is removed when the run ends.
2. **The agent cannot write to GitHub, nor rewrite what it runs.** It runs
   in a job of its own whose token is read-only. It reaches the model provider with a
   short-lived token obtained by workload identity federation: no key is
   stored. It has neither `git` nor `gh`. The
   command line it may run, and the files that steer an agent or a
   workflow, are not writable by it.
3. **A second job acts on GitHub, with fixed text.** It runs no agent.
   Branch, commit, draft pull request, label removal and comments are steps
   whose content does not come from the agent or from the issue, except the
   change name, which is checked before it is used. These tracker writes
   are the maintainer's request carried out by a script: ADR-0014 rule 2,
   which binds an agent with tracker access, is not departed from.
4. **What the agent's job hands over is untrusted.** The second job accepts
   only new planning files: Markdown and YAML under the change, and new
   ADRs that declare no command. A file that can run, on a runner or on a
   contributor's machine, is refused.
5. **The prompt names the trait, not the framework.** The agent is asked
   for the change the `changes` trait calls for, and applies ADR-0016's test
   first: an issue that moves no expected behaviour gets no pull request.
   The permission rules and the path filter name the framework, because a
   filter that knows no path filters nothing.
6. **One issue, one draft pull request.** The proposal and, later, its
   implementation share one branch and are squashed
   ([ADR-0009](../engineering/ADR-0009-branching.md)). The pull request
   references the issue without closing it.

## Consequences

### Positive

- The decision to work on an issue is a visible act on the issue, and it
  can be taken away from a workstation and for several issues at once.
- An injected instruction in an issue can at worst produce Markdown and YAML
  files in a draft pull request that a person reviews.
- Removing the experiment is deleting one workflow file and one federation
  rule.

### Negative

- Each run is paid for, and the agent's job may ask GitHub for an identity
  token: the federation rule must stay limited to this workflow.
- The required checks do not run on the proposal commit, because GitHub
  starts no workflow for an event caused by the job token. They run on the
  first push a person makes.
- A proposal nobody reviews is still a pull request to close.
- The proposal is prose that a local agent later follows. No filter reads
  prose: a person reads the proposal before running anything on the branch.

### Neutral

- Review remains the only control on what the agent wrote, as it is for the
  `Issue served` line of ADR-0014.
- The governance source is not changed. If the experiment holds, the place
  for this decision is a governance ADR, and this one is superseded.

## Alternatives Considered

- **Let the agent open the pull request itself.** A shorter workflow, and a
  token within reach of a prompt injection.
- **A command in the `ontrack` CLI that prints the prompt**, as `review`
  does. It fits the CLI, but it adds a surface to a package before knowing
  whether the proposals are worth implementing from.
- **A recommendation in the governance source.** Premature: it would ship an
  untested practice to every repository that imports the source.
- **Keep the manual step.** Costs seconds per issue; it leaves no trace of
  the decision and needs a session.

## References

- [ADR-0011](../engineering/ADR-0011-forge-and-ci.md), forge and continuous
  integration.
- [ADR-0014](../engineering/ADR-0014-work-tracking.md), work tracking.
- [ADR-0016](../engineering/ADR-0016-changes.md), changes.
- `openspec/specs/issue-proposal/spec.md`, once the change that introduces
  this ADR is archived.
