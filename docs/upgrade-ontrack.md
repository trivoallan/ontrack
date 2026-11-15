---
title: Upgrade ontrack
description: Read what a new version of ontrack changes, install it, and check that your repository and your CI jobs still agree with it.
---

This guide shows how to move a repository to a newer version of ontrack: the
changelog to read, the command to run, and what to check afterwards.

It is about ontrack itself. To follow a track whose questions changed, see
[Revise a question](revise-a-question.md#in-each-repository).

## 1. Read what changed

Each version has its notes on the
[releases page](https://github.com/trivoallan/ontrack/releases): the
highlights first, then the improvements and the fixes. The
[changelog](https://github.com/trivoallan/ontrack/blob/main/CHANGELOG.md)
lists every change, with its pull request.

Look for the heading **⚠ BREAKING CHANGES** in the changelog. ontrack is
below version 1.0: until then a change that breaks arrives in a minor version
(`0.4` to `0.5`), never in a patch (`0.4.0` to `0.4.1`).

See which version you have:

```bash
npx ontrack --version
```

## 2. Install the new version

```bash
npm i -D @trivoallan/ontrack@latest
```

To stop at a given version, name it instead of `latest`:
`@trivoallan/ontrack@0.4.0`.

Installing ontrack changes `package.json` and the lockfile, and nothing
else: no ADR, no track, and not `AGENTS.md`.

## 3. See what the new version reports

```bash
npx ontrack plan
```

`plan` writes nothing. If it reports what it reported before, you are done.

If it reports something new, the new version found work the old one did not
look for. See what `apply` would write before it writes it:

```bash
npx ontrack apply --dry-run
```

## 4. Check what reads ontrack's output

The format of what each command prints, and its exit codes, are contracts:
the [commands reference](commands.md) specifies them. If a script or a CI job
of yours reads them, look under **⚠ BREAKING CHANGES** for the command it
reads, and run the job once on the branch that upgrades.

## Related

- [Run ontrack in CI](run-ontrack-in-ci.md): the jobs that read the exit
  codes.
- [Commands](commands.md): what each command prints.
