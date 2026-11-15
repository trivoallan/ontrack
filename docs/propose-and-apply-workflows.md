---
title: Propose and apply workflows
description: The inputs, secrets and permissions of ontrack's propose and apply workflows, what a calling repository holds, and its files in full.
---

ontrack's `propose` and `apply` workflows are reusable: a repository calls
them with `uses:`, pinned to a commit SHA of ontrack. This page lists what
they take and what a calling repository holds.
[Draft a change from a labelled issue](draft-a-change-from-an-issue.md) sets
them up step by step;
[Why you call ontrack's workflows](why-you-call-ontracks-workflows.md) says
why they are called instead of copied.

## `propose`

`trivoallan/ontrack/.github/workflows/propose.yml`

| | |
| --- | --- |
| Called on | `issues`, `types: [labeled]` |
| Permissions to grant | `contents: write`, `pull-requests: write`, `issues: write`, `id-token: write` |
| Secrets | None |

A called workflow can only lower the permissions it is given, so the calling
job grants what both of ontrack's jobs need. ontrack narrows them: the job
that runs the agent keeps `contents: read` and the identity token, and the
job that writes runs no agent.

| Input | Type | Default | What it is |
| --- | --- | --- | --- |
| `label` | string | `ontrack:propose` | The label that asks for a proposal |
| `frameworks` | string | `openspec,adr` | The catalog entries the agent may write for, separated by commas |

### The catalog

| Entry | The agent may add |
| --- | --- |
| `openspec` | A change under `openspec/changes/` |
| `adr` | A new ADR in `docs/adr/local` |

An ADR that declares a `check:` command is always refused: a person writes
that command. A framework that is not in the catalog cannot be enabled; to
add one, open a pull request to ontrack that adds its entry.

A caller pinned to a version of the workflow that wrote new ADRs directly in
`docs/adr` keeps doing so until it is updated: ontrack still reads them, and
`ontrack plan` reports them as files to move to `docs/adr/local`.

## `apply`

`trivoallan/ontrack/.github/workflows/apply.yml`

| | |
| --- | --- |
| Called on | `pull_request_target`, `types: [labeled]` |
| Permissions to grant | `pull-requests: write` |

`pull_request_target` is safe here because the workflow checks out nothing
and runs nothing from the pull request.

| Input | Type | Default | What it is |
| --- | --- | --- | --- |
| `label` | string | `ontrack:apply` | The label that asks for an apply session |
| `routine_id` | string | Required | The Claude Code routine that runs the apply session for the repository |

| Secret | What it is |
| --- | --- |
| `fire_token` | Required. The token that fires the routine. Pass it by name, never with `secrets: inherit` |

## What the calling repository holds

| What | Name | Used by |
| --- | --- | --- |
| Workflow | `.github/workflows/propose.yml` | `propose` |
| Workflow | `.github/workflows/apply.yml` | `apply` |
| File | `.github/apply-session.md`, the instructions of the apply session, read on the default branch. [ontrack's own](https://github.com/trivoallan/ontrack/blob/main/.github/apply-session.md) is an example | `apply` |
| File | `.github/dependabot.yml`, to keep the SHA pins current | both |
| Label | `ontrack:propose`, or the name passed as `label` | `propose` |
| Label | `ontrack:apply`, or the name passed as `label` | `apply` |
| Variable | `ANTHROPIC_FEDERATION_RULE_ID`, `ANTHROPIC_ORGANIZATION_ID`, `ANTHROPIC_SERVICE_ACCOUNT_ID`, `ANTHROPIC_WORKSPACE_ID` | `propose` |
| Variable | `APPLY_ROUTINE_ID` | `apply` |
| Secret | `APPLY_FIRE_TOKEN` | `apply` |
| Setting | Actions may create pull requests | `propose` |

## The files in full

Replace `<commit sha>` with a commit of ontrack and `vX.Y.Z` with its tag.

```yaml
# .github/workflows/propose.yml
name: propose

on:
  issues:
    types: [labeled]

permissions: {}

jobs:
  propose:
    # A called workflow can only lower the permissions it is given, so this
    # job grants what both of ontrack's jobs need. ontrack narrows them: the
    # job that runs the agent keeps `contents: read` and the identity token,
    # and the job that writes runs no agent.
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
    uses: trivoallan/ontrack/.github/workflows/propose.yml@<commit sha> # vX.Y.Z
    with:
      # Catalog entries, by name: `openspec`, `adr`, or both (the default).
      frameworks: openspec
      # label: ontrack:propose
```

```yaml
# .github/workflows/apply.yml
name: apply

on:
  pull_request_target:
    types: [labeled]

permissions: {}

jobs:
  apply:
    permissions:
      pull-requests: write
    uses: trivoallan/ontrack/.github/workflows/apply.yml@<commit sha> # vX.Y.Z
    with:
      routine_id: ${{ vars.APPLY_ROUTINE_ID }}
      # label: ontrack:apply
    secrets:
      # Name the secret: never `secrets: inherit`.
      fire_token: ${{ secrets.APPLY_FIRE_TOKEN }}
```

```yaml
# .github/dependabot.yml
version: 2
updates:
  # Proposes a new SHA, with its tag in the comment, at each release of ontrack.
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

## Versions

A security fix in ontrack reaches a caller as a Dependabot pull request. A
change to the catalog or to the inputs that breaks callers comes with a
major version of ontrack.

Refusing a second apply session on the same commit needs `apply` at commit
`4eb88cf` or later. With an older pin, two labels on the same commit start
two sessions.
