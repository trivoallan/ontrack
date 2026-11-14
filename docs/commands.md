---
title: Commands
description: Every ontrack command, with its options, what it reads and writes, and its exit codes.
---

ontrack has five commands. Only `apply` writes to the repository.

| Command | What it does | Writes |
| --- | --- | --- |
| [`plan`](#ontrack-plan) | Shows what importing the sources would change | Nothing |
| [`apply`](#ontrack-apply) | Imports the ADRs and updates `AGENTS.md`, as `plan` reports | `docs/adr/`, `AGENTS.md` |
| [`instructions`](#ontrack-instructions) | Prints the decided traits as the rules block of `AGENTS.md` | Nothing |
| [`review`](#ontrack-review-adr) | Prints a prompt asking a coding agent to rule on ADRs | Nothing |
| [`check`](#ontrack-check) | Runs the check command of each decided ADR | Nothing itself |

Every command accepts `-h`, `--help` and `-v`, `--version`.

This page says what each command does. The exact format of each output is a
contract, and it is specified in the
[README](https://github.com/trivoallan/ontrack#readme): each section below
links to its part.

## Exit codes

Every command shares the same exit codes.

| Code | Meaning |
| --- | --- |
| `0` | Nothing to do |
| `2` | Changes pending, or a check failed |
| `1` | Error (unknown command, unreadable source…) |

A CI job can detect an out-of-date repository on `2` without parsing the
output.

## `ontrack plan`

Shows what importing the sources would change in the repository. It never
modifies a file and makes no network call.

```bash
npx ontrack plan
```

```
trivoallan: 20 new, 0 unchanged
  new           ADR-0001-record-architecture-decisions
  new           ADR-0002-localization
  …
```

Each ADR that is not up to date falls in one category:

| Category | Meaning |
| --- | --- |
| `new` | Not imported yet |
| `revised` | The question moved upstream; the line ends with `(revision <local> → <upstream>)` |
| `removed` | No longer shipped by the source |
| `undetermined` | No usable `revision:` to compare |
| `unreadable` | No recognizable frontmatter |
| `check` | Up to date, but the source's `check:` line differs from yours |

`plan` also reports files to move from a flat `docs/adr/` layout to
`docs/adr/<alias>/`, and the state of the rules block in `AGENTS.md`
(`missing` or `out of date`).

**Exit code.** `0` when every ADR is unchanged, or when there is no source at
all. `2` for any other category, a migration, or a rules block to write.

Format: [`ontrack plan` output contract](https://github.com/trivoallan/ontrack#ontrack-plan-output-contract).

## `ontrack apply`

Brings the repository in line with what `plan` reports. It is the only
command that writes. It never commits, and it never touches an ADR you
already decided on, except for its `check:` line.

```bash
npx ontrack apply
```

| Option | Effect |
| --- | --- |
| `--dry-run` | Print what `apply` would do, write nothing |
| `--prune` | Also delete ADRs the source no longer ships |
| `--confirm <name>` | Declare that an `undetermined` verdict still holds; `--confirm all` for every one |

What it does, per source:

| Action | When | Effect |
| --- | --- | --- |
| `imported` | A `new` ADR | Copied, byte for byte, into `docs/adr/<alias>/` |
| `moved` | A flat-layout file | Moved from `docs/adr/` to `docs/adr/<alias>/` |
| `pruned` | A `removed` ADR, with `--prune` | Deleted |
| `confirmed` | An `undetermined` ADR, with `--confirm` | Gets the upstream `revision:`; nothing else changes |
| `synced` | A `check` ADR | Gets the source's `check:` line; nothing else changes |

A `revised` or `unreadable` ADR is never written to or deleted: a person must
rule again.

`apply` also writes the [rules block](#the-rules-block-in-agentsmd) of
`AGENTS.md`. Every check runs before the first write, so an error never
leaves a half-applied repository.

**Exit code.** Computed on what remains after the run: `0` nothing left, `2`
something still needs a person, `1` error.

Format: [`ontrack apply`](https://github.com/trivoallan/ontrack#ontrack-apply).

## `ontrack instructions`

Prints the traits decided in the repository's ADRs as the rules block of
`AGENTS.md`. It is a preview: you do not paste it, `apply` writes it. It
never writes a file and makes no network call.

```bash
npx ontrack instructions
```

- It reads the repository's own ADRs, under `docs/adr/` and
  `docs/adr/<namespace>/`. It does not read the sources in `node_modules`: a
  shipped ADR holds a question, not an answer.
- An ADR carries decided traits when it is `accepted`, is not superseded, and
  has a `traits:` block.
- `proposed` ADRs are listed under "Not yet decided".
- Two decided ADRs that share a top-level trait key are an error that names
  both.

**Exit code.** `0`, or `1` on an error. It never returns `2`.

Format: [`ontrack instructions` output contract](https://github.com/trivoallan/ontrack#ontrack-instructions-output-contract).

## `ontrack review [adr]`

Prints a prompt that asks a coding agent to rule on ADRs with you: the agent
proposes, you agree, and only then does it write. It never writes a file and
makes no network call.

```bash
claude "$(npx ontrack review)"           # every proposed ADR, in sequence
claude "$(npx ontrack review ADR-0006)"  # this one alone
claude "$(npx ontrack review ADR-0001)"  # an accepted one: supersede it
```

| Argument | Prompt |
| --- | --- |
| None | Rule every `proposed` ADR, one at a time |
| A `proposed` ADR | Rule that ADR alone |
| An `accepted` ADR | Write a new ADR that supersedes it |

The argument is a reference (`trivoallan/ADR-0006-commits`), a file name
without `.md` (`ADR-0006-commits`) or an `adr:` identifier (`ADR-0006`). It
must name exactly one ADR.

**Exit code.** `2` when it prints a prompt, because a ruling is pending. `0`
when no ADR is `proposed`: it then says so on standard error and prints
nothing. `1` for an unknown or ambiguous name, a `rejected` ADR, or one
already superseded.

Format: [`ontrack review` prompt contract](https://github.com/trivoallan/ontrack#ontrack-review-prompt-contract).

## `ontrack check`

Runs the check command of each decided ADR and reports one line per ADR.
ontrack judges nothing itself: an ADR names the command that does, in the
`check:` key of its frontmatter.

```bash
npx ontrack check
```

| Status | Meaning |
| --- | --- |
| `pass` | The command exited with `0` |
| `fail` | The command exited with anything else, including a program that is not installed |
| `unchecked` | The ADR has decided traits and no `check:`, or its command exited with `78` |

- An ADR carries a check when it is `accepted`, is not superseded, and has a
  non-empty `check:` value.
- Commands run through the shell, from the project root, with your
  environment, one at a time. A failure does not stop the run.
- Each command gets `ONTRACK_ADR`: the path of its ADR's file, relative to
  the project root.
- Only ADRs committed under `docs/adr/` are read, never `node_modules`. A
  source's command runs only once `apply` has written it into your copy and
  your repository holds the ADR as `accepted`.

**Exit code.** `2` when at least one check failed, `0` otherwise, `1` on an
error. `unchecked` ADRs do not change it.

Format: [`ontrack check` output contract](https://github.com/trivoallan/ontrack#ontrack-check-output-contract).

## The rules block in `AGENTS.md`

`apply` keeps the block printed by `instructions` current in the `AGENTS.md`
at the root of the repository, and `plan` reports its state. The text between
`<!-- ontrack:begin -->` and `<!-- ontrack:end -->` belongs to ontrack and is
overwritten. Everything outside the markers is yours and is never touched.

- `apply` replaces the block when the file holds one marker pair, appends it
  when the file has no marker, and creates `AGENTS.md` when there is none.
- When the block cannot be written, only this step is skipped: the ADRs are
  still handled, and both commands print `AGENTS.md: skipped, <reason>` and
  exit with `2`.
- Claude Code reads `AGENTS.md` on its own only when the repository has no
  `CLAUDE.md` and no `CLAUDE.local.md`. When one exists and `CLAUDE.md` holds
  no line `@AGENTS.md`, both commands print a warning. ontrack never writes
  `CLAUDE.md`.

Detail: [The rules block in `AGENTS.md`](https://github.com/trivoallan/ontrack#the-rules-block-in-agentsmd).
