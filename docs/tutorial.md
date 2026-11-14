---
title: Try ontrack on one repository
description: Import a public source of ADRs into a repository, answer one question with a coding agent, and read the rule in AGENTS.md.
sidebar:
  order: 1
---

In this tutorial you import a public source of architecture decision records
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

## 1. Install ontrack and a source

```bash
npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git#v0.2.0
```

Installing compiles ontrack once, which npm does on its own.

A **source** is an npm dependency that ships ADRs. Its npm alias is its
namespace. [trivoallan/governance](https://github.com/trivoallan/governance)
is a public one:

```bash
npm i -D trivoallan@git+https://github.com/trivoallan/governance.git
```

## 2. See what importing would change

```bash
npx ontrack plan
```

```
trivoallan: 20 new, 0 unchanged
  new           ADR-0001-record-architecture-decisions
  new           ADR-0002-localization
  new           ADR-0003-architecture
  …
  new           ADR-0020-adding-dependencies
```

`plan` wrote nothing. It exited with `2`, which means changes are pending.
The catalogue of the source grows over time, so your count may differ.

## 3. Import the ADRs

```bash
npx ontrack apply
```

```
trivoallan: 20 imported
  imported      ADR-0001-record-architecture-decisions
  imported      ADR-0002-localization
  …
  imported      ADR-0020-adding-dependencies
AGENTS.md: rules block created
```

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
- Adding a dependency (trivoallan/ADR-0020-adding-dependencies)

<!-- ontrack:end -->
````

One ADR came already decided by its source. The others are questions your
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
  scopes: [apply, check, cli, governance, instructions, openspec, plan, review, revision, sources]
  tool: commitlint
```
````

Your repository now holds a decision it took for itself, in a file coding
agents read.

## Where to go next

- Answer the remaining questions, one at a time, with
  `claude "$(npx ontrack review)"`.
- Run `npx ontrack plan` in CI. It exits with `2` when the source asks a new
  question or changes one you answered.
- Write your own source: a `package.json` with an `ontrack` key that points
  to a directory of ADRs.
- Read [how ontrack works](how-it-works.md): the pieces, the life of a
  question, and the cycle.
- Look up every command, its options and its exit codes in the
  [commands reference](commands.md).
