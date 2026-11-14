---
title: Run ontrack in CI
description: Fail a build when a repository is behind its source or breaks a decision, and get told when the source itself has moved.
---

This guide shows how to run ontrack in a repository's CI. It sets up three
things: a build that fails when the repository is behind the source it has
installed, a build that fails when the work breaks a decision, and a weekly
job that notices when the source has moved.

The examples are GitHub Actions workflows. The commands are the same on any
CI. ontrack exits with `2` when something is pending, which fails a job
without any parsing of its output.

You need ontrack and a source in the repository's `devDependencies`.

## 1. Fail when the repository is behind its source

Add `plan` to the workflow that runs on pull requests:

```yaml
      - run: npm ci
      - run: npx ontrack plan
```

`plan` fails the job when the installed source ships a question the
repository has not imported, or has revised one it answered. It fails on the
pull request that updates the source, and keeps failing until the questions
are imported and ruled.

## 2. Fail when the work breaks a decision

Add `check` after it:

```yaml
      - run: npx ontrack check
```

`check` runs the command each accepted ADR names, and fails the job when one
of them does. These commands are yours or your source's: give the job what
they need. A check that reads the commit history, for instance, needs a full
checkout:

```yaml
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
```

## 3. Notice when the source has moved

`plan` reads the source as it is installed. It cannot see a question revised
upstream until the dependency is updated. Add a second workflow that updates
it in a throwaway checkout, once a week:

```yaml
name: source-updates

on:
  schedule:
    - cron: '0 6 * * 1'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      # The alias of each source the repository imports.
      - run: npm update platform
      - run: npx ontrack plan
```

The job fails when the updated source has something new for the repository.
It changes nothing: the checkout is discarded. The failed run is the notice.

## When a job fails

| Job | It means | Do |
| --- | --- | --- |
| `plan`, on a pull request | The installed source is ahead of the repository | Run `npx ontrack apply`, then rule with `review` |
| `check` | The work breaks a decision | Fix the work, or supersede the decision |
| The weekly job | The source has moved upstream | Follow [Revise a question](revise-a-question.md#in-each-repository), from step 4 |

## Related

- [Commands](commands.md) lists the exit codes of each command.
