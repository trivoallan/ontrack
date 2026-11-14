---
adr: ADR-0003
slug: a-label-on-an-approved-pull-request-starts-its-apply
title: A label on an approved pull request starts its apply
status: accepted
date: 2026-11-14
authors: [Tristan Rivoallan]
supersedes: []
---

# A label on an approved pull request starts its apply

## Status

Accepted

## Context

[ADR-0002](ADR-0002-a-label-asks-for-a-change.md) lets a maintainer get a
change proposal by labelling an issue: a coding agent drafts it alone, in
continuous integration, because what it writes is prose that a person reads.
The next step, applying the proposal, is done by hand: a local session on
the proposal's branch.

Applying is not drafting. The agent writes code, runs the tests, and
follows a task list that was itself derived from the text of an issue. The
filter that keeps a proposal harmless, new Markdown and YAML files only,
cannot exist for an implementation. And an agent that implements without
anyone to ask decides alone, or stops.

Running that agent on a runner was considered and set aside. It has to
check out the pull request and execute it in a job that can reach the model
provider, which is what rule 5 of
[ADR-0011](trivoallan/ADR-0011-forge-and-ci.md) forbids; the job token
cannot push a change to a workflow; and no check runs on what a bot pushes.

## Decision

Adding the `ontrack:apply` label to a pull request asks for a **remote
session that the maintainer steers**, on that pull request's branch. The
session runs with the maintainer's own rights, outside continuous
integration. The repository holds the gate in front of it:

1. **No apply without an approval by a person.** A workflow answers the
   label. It starts the session only when a person with write access has
   approved the pull request, and no reviewer is asking for changes. A
   bot's approval does not count.
2. **The approval covers one commit.** It must have been given on the head
   commit the label was added on. A push after the approval makes it stale:
   the maintainer approves what exists, then labels again. Each pass of
   apply therefore needs its own approval.
3. **The gate is the only way in.** The session is started by one call that
   carries a token stored in the repository's secrets; the token can do
   nothing else. The call carries the repository, the pull request number
   and the head commit, taken from the event.
4. **The gate executes nothing of the pull request.** The workflow runs on
   `pull_request_target`, so that it and its secret come from the default
   branch. It checks out no file and runs no agent: it reads the state of
   the pull request and makes one call. Rule 5 of ADR-0011 is not departed
   from.
5. **The session takes its instructions from the default branch**, in
   `.github/apply-session.md`, not from the pull request. It checks the
   approval again, works on the pull request's branch only, and stops to ask
   whenever a task is unclear, cannot be done from a session, or would touch
   the files that steer a workflow or an agent.
6. **The label is consumed** whatever the outcome, and the pull request is
   told what happened in fixed words.

## Consequences

### Positive

- An implementation can be started from anywhere, and it still has a person
  in it: the session asks, and its pushes are the maintainer's, so the
  required checks run on them.
- The rule "a person approved this commit" is enforced by fixed commands in
  the repository, tested, and reviewed like code.
- GitHub does not let an author approve their own pull request. A proposal
  opened by the propose workflow can be approved by the maintainer; in a
  repository with one maintainer, only those proposals pass the gate.

### Negative

- A stored secret returns: the token that starts the session.
- The session and its trigger live in the maintainer's account, not in the
  repository. Only the gate and the session's instructions are versioned.
- A maintainer who writes a proposal by hand, alone in the repository,
  cannot apply it this way.
- The remote sessions the gate relies on are a research preview, and each
  one counts against the maintainer's plan.

### Neutral

- Reading the proposal before approving it is the control that matters: the
  task list is prose that an agent then follows with the maintainer's
  rights. The gate proves that an approval exists, not that the proposal
  was read.
- A review's author is trusted as having write access when GitHub reports
  them as owner, member or collaborator of the repository.

## Alternatives Considered

- **Apply in continuous integration**, like propose. See Context.
- **Let the session's own trigger listen for the label.** Its filters know
  labels and branches, not reviews: the approval could only be checked by
  the agent, after the session had started.
- **Start the session on approval, without a label.** One gesture would
  mean both "this is right" and "build it now".
- **Have the agent check the approval, and nothing else.** A rule an agent
  applies to itself is not a gate. The session still checks, as a second
  line.

## References

- [ADR-0002](ADR-0002-a-label-asks-for-a-change.md), the proposal this
  decision applies.
- [ADR-0011](trivoallan/ADR-0011-forge-and-ci.md), forge and continuous
  integration, rule 5.
- [ADR-0014](trivoallan/ADR-0014-work-tracking.md), work tracking: tracker
  text is data.
- `.github/workflows/apply.yml` and `.github/apply-session.md`.
