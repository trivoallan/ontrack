---
title: Draft changes from issues
description: Call ontrack's propose and apply workflows from your repository, so that a label on an issue drafts a change proposal and a label on an approved pull request starts its implementation.
---

This guide sets up two labels in a repository that uses ontrack:

- `ontrack:propose` on an issue: a coding agent drafts a change proposal from
  the issue and opens it as a draft pull request.
- `ontrack:apply` on that pull request, once a person with write access has
  approved its last commit: a Claude Code session starts and implements the
  change with you.

Both are reusable workflows that live in ontrack. Your repository calls them
by commit SHA. The security posture stays in ontrack: the agent never holds a
token that can write, and the job that writes accepts only new planning
files. [ADR-0004](adr/ADR-0004-other-repositories-call-the-propose-and-apply-workflows.md)
records why.

## Before you start

You need, in your repository:

1. An `AGENTS.md` written by `ontrack apply`, with a `changes` trait. The run
   checks that this trait names a framework you enabled.
2. The labels `ontrack:propose` and `ontrack:apply`, or the names you pass
   as `label`.
3. **Settings → Actions → General → Workflow permissions:** allow GitHub
   Actions to create pull requests. Without it, the proposal branch is
   pushed but no pull request opens.
4. A federation rule in the Claude Console (**Settings → Workload identity
   federation → Rules**) for the GitHub Actions issuer. Use pattern matching,
   with your repository's exact subject:

   ```text
   repo:<owner>@<owner id>/<repo>@<repo id>:ref:refs/heads/main
   ```

   `gh api repos/<owner>/<repo> -q '"\(.owner.id) \(.id)"'` prints both
   identifiers. In a called workflow the subject names your repository, not
   ontrack. Do not add a `job_workflow_ref` condition: extra conditions are
   exact matches, and the SHA in that claim changes at every update.
5. The repository variables `ANTHROPIC_FEDERATION_RULE_ID`,
   `ANTHROPIC_ORGANIZATION_ID`, `ANTHROPIC_SERVICE_ACCOUNT_ID` and
   `ANTHROPIC_WORKSPACE_ID`. They are identifiers, not credentials.
6. For `apply` only: a Claude Code routine for your repository, its
   identifier in a variable, the token that fires it in a secret, and a
   `.github/apply-session.md` that tells the session how to work.

## Call `propose`

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

The agent may only write for the entries you enable. `openspec` lets it add
a change under `openspec/changes/`. `adr` lets it add a new ADR in the
directory named by the `record-architecture-decisions.directory` trait, or
`docs/adr` without it. An ADR that declares a `check:` command is always
refused: a person writes that command.

A framework that is not in the catalog cannot be enabled. To add one, open a
pull request to ontrack that adds its entry.

## Call `apply`

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

`pull_request_target` is safe here because ontrack's workflow checks out
nothing and runs nothing from the pull request. It reads the reviews, and
starts the session only when a person with write access approved the head
commit.

## Keep it up to date

Pin both calls to a commit SHA, with the tag in a comment, and let
Dependabot propose the updates (`package-ecosystem: github-actions`). A
security fix in ontrack then reaches you as a pull request. A change that
breaks callers comes with a major version of ontrack.
