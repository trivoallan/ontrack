---
title: Run ontrack in CI
description: Fail a build when a repository is behind its track or breaks a decision, and get told when the track itself has moved.
---

This guide shows how to run ontrack in a repository's CI. It sets up three
things: a build that fails when the repository is behind the track it has
installed, a build that fails when the work breaks a decision, and a weekly
job that notices when the track has moved.

The examples are GitHub Actions workflows. The commands are the same on any
CI. ontrack exits with `2` when something is pending, which fails a job
without any parsing of its output.

You need ontrack and a track in the repository's `devDependencies`.

## 1. Fail when the repository is behind its track

Add `plan` to the workflow that runs on pull requests:

```yaml
      - run: npm ci
      - run: npx ontrack plan
```

`plan` fails the job when the installed track ships a convention the
repository has not imported, or has revised one it ruled on. It fails on the
pull request that updates the track, and keeps failing until the conventions
are imported and ruled.

## 2. Fail when the work breaks a decision

Add `check` after it:

```yaml
      - run: npx ontrack check
```

`check` runs the command each accepted ADR names, and fails the job when one
of them does. These commands are yours or your track's: give the job what
they need. A check that reads the commit history, for instance, needs a full
checkout:

```yaml
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
```

## 3. Notice when the track has moved

`plan` reads the track as it is installed. It cannot see a convention revised
upstream until the dependency is updated. Add a second workflow that updates
it in a throwaway checkout, once a week:

```yaml
name: track-updates

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
      # The alias of each track the repository imports.
      - run: npm update platform
      - run: npx ontrack plan
```

The job fails when the updated track has something new for the repository.
It changes nothing: the checkout is discarded. The failed run is the notice.

## When a job fails

| Job | It means | Do |
| --- | --- | --- |
| `plan`, on a pull request | The installed track is ahead of the repository | Rule with `review`: its prompt has the agent run `npx ontrack apply` first when the track ships new conventions |
| `check` | The work breaks a decision | Fix the work, or supersede the decision |
| The weekly job | The track has moved upstream | Follow [Revise a convention](revise-a-convention.md#in-each-repository), from step 4 |

## Related

- [Commands](commands.md) lists the exit codes of each command.
- [Error messages](error-messages.md) says what to do about an error, when a
  job exits with `1`.
