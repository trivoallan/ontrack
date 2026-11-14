---
title: Introduction and Goals
---

# Introduction and Goals

ontrack is a command-line tool that imports shared architecture decision
records (ADRs) into a repository. The ADRs come from *sources*: npm
dependencies whose `package.json` carries an `ontrack` key. Each ADR asks a
question and recommends an answer; the repository answers it in its own
copy, and ontrack writes the answers to `AGENTS.md` so that coding agents
follow them. The
[README](https://github.com/trivoallan/ontrack#readme) is the user's guide;
this document describes how the tool is built.

## Requirements overview

Behaviour is specified per capability under
[`openspec/specs/`](https://github.com/trivoallan/ontrack/tree/main/openspec/specs),
one directory per capability. This document links to those specifications
and does not repeat them.

| Command | What it is for | Specification |
| --- | --- | --- |
| `ontrack plan` | say what importing the sources would change, without writing | [plan](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/plan/spec.md), [sources](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/sources/spec.md), [adr-revision](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/adr-revision/spec.md) |
| `ontrack apply` | do what `plan` reports, and keep the rules block of `AGENTS.md` current | [apply](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md), [agents-file](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/agents-file/spec.md) |
| `ontrack instructions` | print the decided traits as the rules block | [instructions](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/instructions/spec.md) |
| `ontrack review` | print a prompt asking a coding agent to rule proposed ADRs, or to supersede an accepted one | [review](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/review/spec.md) |
| `ontrack check` | run the check command each decided ADR declares | [README contract](https://github.com/trivoallan/ontrack#ontrack-check-output-contract) |

The entry point and the exit codes every command shares are specified in
[cli](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/cli/spec.md).

## Quality goals

| Priority | Goal | Statement |
| --- | --- | --- |
| 1 | No silent overwrite of a ruled ADR | No ontrack command changes the content of an ADR the repository already holds, except the `revision:` line of an ADR named by `apply --confirm`. |
| 2 | Repeatable imports | Running `ontrack apply` a second time on an unchanged repository writes no file and prints what `ontrack plan` prints. |
| 3 | Few dependencies | The installed package has two runtime dependencies, `yargs` and `zod`, and no command makes a network call. |

[Quality Requirements](10-quality-requirements.md) turns each goal into
scenarios.

## Stakeholders

| Who | What they expect from ontrack |
| --- | --- |
| Repository maintainer | to see which shared ADRs are new or need a ruling again, to import them in one command, and to rely on an exit code in CI |
| Source author | that a source is a plain npm package with an `ontrack` key, and that raising an ADR's `revision:` reaches every repository that depends on it |
| Coding agent | to read the repository's decided rules in `AGENTS.md`, and to receive a prompt that says how to propose a ruling |
