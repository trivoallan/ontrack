---
title: Try ontrack on one repository
description: Import a public track of ADRs into a repository, answer one question with a coding agent, and read the rule in AGENTS.md.
sidebar:
  order: 1
---

In this tutorial you import a public track of architecture decision records
(ADRs) into one repository, let a coding agent propose an answer to one of
them, and read the resulting rule in `AGENTS.md`.

**Time.** On a fresh repository, steps 1 to 3 ran in 14 seconds. In step 4,
the agent took about a minute to propose an answer.

## Before you start

- Node 22.18 or later.
- A git repository with a `package.json`. Use an existing one: the agent
  draws its proposal from what the repository contains, and has little to
  say about an empty one.
- A coding agent on the command line. The examples use `claude`.

Work on a branch. ontrack never commits, so `git status` shows everything it
did, and you can discard it.

## 1. Install ontrack and a track

```bash
npm i -D @trivoallan/ontrack
```

The package is scoped; the command it installs is `ontrack`.

A **track** is an npm dependency that ships ADRs. Its npm alias is its
namespace. [trivoallan/governance](https://github.com/trivoallan/governance)
is a public one, published as `@trivoallan/ontrack-governance`:

```bash
npm i -D trivoallan@npm:@trivoallan/ontrack-governance
```

`trivoallan@npm:` is npm's alias syntax: the package is installed under the
name `trivoallan`, which becomes its namespace.

## 2. See what importing would change

```bash
npx ontrack plan
```

```
trivoallan: 25 new, 0 unchanged
  new           ADR-0001-record-architecture-decisions
  new           ADR-0002-localization
  new           ADR-0003-architecture
  …
  new           ADR-0025-tools
```

`plan` wrote nothing. It exited with `2`, which means changes are pending.
The catalogue of the track grows over time, so your count may differ.

## 3. Import the ADRs

```bash
npx ontrack apply
```

```
trivoallan: 25 imported
  imported      ADR-0001-record-architecture-decisions
  imported      ADR-0002-localization
  …
  imported      ADR-0025-tools
AGENTS.md: rules block created
next: 24 proposed ADRs to rule
  from a shell:  claude "$(npx ontrack review)"
  as a prompt:   Run `npx ontrack review` and follow its output.
```

The last three lines name the next step. Step 4 takes it for one question.

The ADRs are now in `docs/adr/trivoallan/`, and `AGENTS.md` has a block that
belongs to ontrack:

````markdown
<!-- ontrack:begin -->
## Project rules (ontrack)

### Record architecture decisions (trivoallan/ADR-0001-record-architecture-decisions)

```yaml
record-architecture-decisions:
  format: nygard
```

### Not yet decided

- Localization (trivoallan/ADR-0002-localization)
- Software architecture (trivoallan/ADR-0003-architecture)
- …
- Tools outside the package manager (trivoallan/ADR-0025-tools)

<!-- ontrack:end -->
````

One ADR came already decided by its track. The others are questions your
repository has not answered yet.

## 4. Answer one question

Open `docs/adr/trivoallan/ADR-0006-commits.md`. It asks which commit scopes
this repository uses and which tool enforces them, and it leaves two keys
empty:

```yaml
status: proposed
traits:
  commits:
    scopes:
    tool:
```

Ask a coding agent to propose the answer:

```bash
claude "$(npx ontrack review ADR-0006)"
```

`ontrack review` prints a prompt and the agent follows it: it reads the ADR,
looks in your repository for evidence, proposes a status and a value for each
key, then stops and asks for your agreement.

In the empty repository this tutorial was tested on, there was nothing to
draw from, and the agent proposed `accepted` with `scopes: []` and
`tool: none`. In a repository with a history, expect the scopes you already
use.

Agree, or change a value. The agent then fills the keys, sets the status and
runs `npx ontrack apply`, which moves the ADR from "Not yet decided" to a rule
of its own in `AGENTS.md`. In the repository of ontrack itself, that rule
reads:

````markdown
### Commits (trivoallan/ADR-0006-commits)

```yaml
commits:
  scopes: [apply, check, cli, governance, instructions, openspec, plan, review, revision, tracks]
  tool: commitlint
```
````

Your repository now holds a decision it took for itself, in a file coding
agents read.

## Where to go next

- Answer the remaining questions, one at a time, with
  `claude "$(npx ontrack review)"`.
- [Run ontrack in CI](run-ontrack-in-ci.md). `plan` exits with `2` when the
  track asks a new question or changes one you answered.
- [Write your own track](write-your-own-track.md): a `package.json` with
  an `ontrack` key that points to a directory of ADRs.
  [File formats](file-formats.md) lists what ontrack reads in both.
- Read [how ontrack works](how-it-works.md): the pieces, the life of a
  question, and the cycle.
- Look up every command, its options and its exit codes in the
  [commands reference](commands.md).
