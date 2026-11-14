---
title: Draft a change from a labelled issue
description: Copy the workflow that turns a label on an issue into a draft pull request carrying a change proposal, written by a coding agent in CI.
---

This guide shows how to set up, in your own repository, the workflow ontrack
uses on itself: a maintainer adds the `ontrack:propose` label to an issue,
and a draft pull request carrying the change proposal appears.

**This is an experiment.** It is not part of the `ontrack` package: it is one
workflow file that you copy and then own. It may change or be removed here,
and your copy will not follow. It covers the proposal only; implementing the
proposed change is still done by a person or a session they start.

You need:

- a repository on GitHub that has ruled the `changes` trait with
  `framework: openspec`, with `openspec` in its `devDependencies` and its
  lockfile committed. The workflow's prompt names no framework, but its
  permission rules and its path filter do;
- the framework's skill for proposing a change, committed under `.claude/`;
- a `.nvmrc` file;
- an account with the model provider that supports workload identity
  federation, and the right to create a service account in it;
- admin rights on the repository.

## 1. Let the workflow reach the model provider

The agent step stores no key. It exchanges the job's OIDC token for a
short-lived provider token, and the provider decides which workflow may do
so.

In the provider's console, register GitHub Actions as an issuer, create a
service account, and create a federation rule limited to your repository.
The rule must match the subject GitHub sends, which carries the numeric
identifiers of the owner and of the repository:

```text
repo:<owner>@<owner id>/<repo>@<repo id>:ref:refs/heads/main
```

A rule written as `repo:<owner>/<repo>:…` matches nothing, and the first run
fails on its first call.

Then set four repository variables (Settings, Secrets and variables,
Actions, Variables). They are identifiers, not credentials:

| Variable | Value |
| --- | --- |
| `ANTHROPIC_FEDERATION_RULE_ID` | The federation rule |
| `ANTHROPIC_ORGANIZATION_ID` | The organization |
| `ANTHROPIC_SERVICE_ACCOUNT_ID` | The service account |
| `ANTHROPIC_WORKSPACE_ID` | The workspace. Required as soon as the service account belongs to several: the exchange is refused without it |

## 2. Let GitHub Actions open pull requests

In Settings, Actions, General, Workflow permissions, tick "Allow GitHub
Actions to create and approve pull requests". Without it the proposal is
drafted, the branch is pushed, and the run fails when it opens the pull
request.

## 3. Create the label

```sh
gh label create ontrack:propose --description "Draft a change proposal for this issue"
```

Whoever can add a label can start a run, and each run costs one agent
session. On GitHub that means people with triage rights or more.

## 4. Copy the workflow

Copy
[`.github/workflows/propose.yml`](https://github.com/trivoallan/ontrack/blob/main/.github/workflows/propose.yml)
to the same path in your repository, and write down the commit you took it
from: the file was hardened after a security review, and comparing against
that commit later is how you pick up a fix.

Change these, and nothing else until a first run has passed:

| In the file | Why |
| --- | --- |
| The header comment | It cites ADRs of the ontrack repository. Cite your own decision to run an agent in CI |
| `--model` | The model your account may use |
| `docs(openspec): propose …`, the commit message | Its scope must be one your `commits` trait allows |
| `feat/<issue>-<name>` and `feat: <name>`, the branch and the title | They must fit your `branching` trait |

Leave the two-job layout, the permission rules of `draft` and the filter of
`publish` as they are. The issue is text anyone can write and it steers the
agent: `draft` runs the agent with a token that can write nothing, and
`publish`, which runs no agent, accepts only new Markdown and YAML files
under one change and new ADRs without a `check:` command.
[ADR-0001 of the ontrack repository](adr/ADR-0001-propose-changes-from-labelled-issues.md)
gives the reasons.

## 5. Label an issue

Pick an open issue that says what it asks for, and add the label. The label
is removed when the run ends, whatever the outcome: adding it again is how
you start another run.

| What you see | It means | Do |
| --- | --- | --- |
| A draft pull request on `feat/<issue>-<name>` | The proposal was written | Read every file, the task list included, before running an agent or a command on the branch |
| "No change was opened" on the issue | The work is already done, or the issue does not say what it asks for | Read the agent's reasons in the run summary; rewrite the issue and label it again |
| "A proposal branch already exists" | A branch `feat/<issue>-*` is on the remote | Delete the branch to start over |
| "This issue is closed" | A proposal is only drafted for an open issue | Reopen it first |
| "The proposal run failed" | See below | |

The pull request is opened with the job's token, so no workflow starts on its
first commit. Your required checks run on the first push a person makes.

The text the agent reads is the title and body the issue had when the label
was added, without its HTML comments. An edit made afterwards is not read.

## When a run fails

Open the run linked in the comment.

| Where | What it shows | Likely cause |
| --- | --- | --- |
| The agent step fails at once, and the next step prints a provider error | The token exchange was refused | The subject of the federation rule (step 1), or a missing `ANTHROPIC_WORKSPACE_ID` |
| The step after the agent lists `denied:` lines | A tool call the permission rules refused | The agent needed a command or a path outside the rules; the run summary says what stopped it |
| `refused: <status> <mode> <path>` in `publish` | The agent wrote something other than a new file of the change | Nothing to fix in the workflow: the filter did its job. Label again, or write the proposal by hand |
| `publish` fails on `gh pr create` | Actions may not open pull requests | Step 2 |

## Related

- [How ontrack works](how-it-works.md) explains the traits the workflow reads
  from `AGENTS.md`.
- [Run ontrack in CI](run-ontrack-in-ci.md) sets up the checks that run on
  the pull request once a person pushes to it.
