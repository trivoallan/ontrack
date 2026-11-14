Issue served: none

## Why

Going from an issue to a change is a manual step today: a person opens a
session and runs the propose command for one issue at a time. The decision
that matters, "we do this one now", has no trace of its own, and nothing can
be started away from a workstation or for several issues at once.

This change is an experiment, local to this repository, that makes a label
on an issue that decision: a maintainer adds it, and a draft pull request
carrying the change proposal appears. Whether the generated proposals are
good enough to implement from is what the experiment measures.

## What Changes

- A new GitHub Actions workflow, `.github/workflows/propose.yml`, runs when
  the `ontrack:propose` label is added to an issue.
- The workflow hands the issue's title and body, as data, to a coding agent
  that produces the change the `changes` trait of `AGENTS.md` calls for. The
  workflow holds no knowledge of the change framework.
- The agent only writes files in the checkout, in a job whose token can
  write nothing. Every act on GitHub (branch, commit, draft pull request,
  label, comment) is a fixed step of a second job that runs no agent.
- One draft pull request per issue, on `feat/<issue>-<change-name>`, with
  `Refs <issue>`. Implementation continues on the same branch and the whole
  is squashed (ADR-0009).
- When the agent finds that the issue moves no expected behaviour (ADR-0016),
  no pull request is opened and the issue receives a fixed comment.
- A repository ADR records the decision to run a coding agent in CI and the
  boundaries it runs within.
- One new secret, named `ANTHROPIC_API_KEY`; a person sets its value.

Out of scope: any change to the `ontrack` CLI or to the governance source,
any abstraction over change frameworks, the case of an issue edited after it
was labelled, and the implementation of the proposed change by the workflow.

## Capabilities

### New Capabilities
- `issue-proposal`: what happens when the `ontrack:propose` label is added to an
  issue, from the trigger to the draft pull request, and the boundaries the
  coding agent runs within.

### Modified Capabilities

None.

## Impact

- `.github/workflows/propose.yml` (new), kept current by Dependabot like the
  other pinned actions.
- `docs/adr/ADR-0001-propose-changes-from-labelled-issues.md` (new), the
  first ADR this repository writes for itself.
- Repository settings, set by a person: the `ANTHROPIC_API_KEY` secret, the
  `ontrack:propose` label, and the permission for GitHub Actions to create pull
  requests.
- No change to `src/`, to the published package or to its tests.
- Running cost: one agent run per label added.
