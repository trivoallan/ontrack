---
title: Shared conventions that don't drift
description: ontrack turns your engineering conventions into questions each repository answers, and tells you when an answer is out of date.
template: splash
sidebar:
  label: Home
  order: 0
hero:
  tagline: Write your engineering conventions once, as questions. Each repository answers them for itself, coding agents follow the answers, and CI tells you when an answer is out of date.
  image:
    file: ./assets/logo.png
    alt: ""
  actions:
    - text: Try it on one repository
      link: tutorial/
      icon: right-arrow
      variant: primary
    - text: View on GitHub
      link: https://github.com/trivoallan/ontrack
      icon: external
      variant: minimal
---

## Conventions are copied, then they drift

You agreed on how to commit, branch, test and deliver. Then the agreement was
copied: into a template, a wiki page, thirty repositories.

- Each copy changes on its own, and nothing tells you which ones did.
- When the convention itself changes, nothing tells the repositories.
- A coding agent that finds no rule invents one: `fix(api)`, then
  `fix(backend)`, then `fix(server)` for the same place.

## A question, an answer, a rule the agent reads

With ontrack, a convention is an architecture decision record (ADR) that asks
a question and recommends an answer. You keep these ADRs in one repository,
the **source**. Every other repository imports them and answers.

A coding agent does the legwork. It reads the question, looks in the
repository for evidence, proposes an answer, and writes nothing until you
agree:

```bash
claude "$(npx ontrack review ADR-0006)"
```

This is what the repository of ontrack itself answered to the question on
commits. The answer lives in its copy of the ADR:

```yaml
status: accepted
traits:
  commits:
    scopes: [apply, check, cli, governance, instructions, openspec, plan, review, revision, sources]
    tool: commitlint
```

And ontrack wrote it to `AGENTS.md`, where coding agents look for rules:

````markdown
### Commits (trivoallan/ADR-0006-commits)

```yaml
commits:
  scopes: [apply, check, cli, governance, instructions, openspec, plan, review, revision, sources]
  tool: commitlint
```
````

You can read [the whole decision](adr/trivoallan/ADR-0006-commits.md), and
the others, on this site.

## When a question changes, every repository is told

Each ADR carries a revision number. When you change a question in the source,
`ontrack plan` reports it in every repository that answered the earlier
revision. This is the format it follows:

```
platform: 2 revised, 1 new, 3 unchanged
  revised       SDR-0006  Commits (revision 1 → 2)
  revised       SDR-0010  Forge and CI (revision 3 → 4)
  new           SDR-0015  Observability
```

`plan` then exits with `2`. A CI job fails on that code without parsing the
output, and the repository knows which answers to take again. `plan` changes
no file and makes no network call.

`plan` reads the source as the repository has installed it. A weekly job
that updates the source is what tells a repository the question moved:
[Run ontrack in CI](run-ontrack-in-ci.md) gives it to copy.

## Next to what you already have

| You have | What it does | What it leaves open |
| --- | --- | --- |
| A template repository or a project generator | Copies the conventions when the repository is created | Nothing links the copy to the original afterwards |
| A shared configuration (lint rules, presets) | Applies the same values everywhere | A repository that differs has to override or opt out |
| A rules sync tool, such as Ruler or rulesync | Writes one set of agent rules to the file each coding agent reads | Where the rules come from, and whether they still match what was agreed |
| A tool that runs ADRs as checks, such as Archgate | Fails CI when the code departs from a decision | A shared ADR carries the decision, not a question: a repository that differs keeps an edited copy |
| A standards platform, such as Packmind | Sends one playbook from a server to every repository and agent | A repository can pin a version or leave a package out, but has no place to record why it differs |
| ontrack | Asks each repository a question and records its answer | The answer itself: that is the repository's call |

ontrack does not replace your linters. An ADR can name the command that
checks its decision, and `ontrack check` runs it.

## Your teams keep their answers

The platform team owns the questions. Each repository owns its answers.

- An ADR arrives as `proposed`, with a recommendation. The repository may
  follow it or depart from it, and writes down why.
- `rejected` is a full answer: the question does not apply here, and the ADR
  says what stands in for it.
- ontrack never rewrites an ADR a repository has decided on. When the
  question changes, a person rules again.

## Nothing to migrate away from

An ADR is a Markdown file in `docs/adr/`. A source is an npm dependency. The
rules are a block in `AGENTS.md`. If you stop using ontrack, all three remain
and read the same.

## It governs itself

ontrack is built under its own rules. This repository imports
[trivoallan/governance](https://github.com/trivoallan/governance), and every
ruling it made is published here, starting with
[how decisions are recorded](adr/trivoallan/ADR-0001-record-architecture-decisions.md).
Its [architecture](architecture/arc42/01-introduction-and-goals.md) is
documented the way those decisions prescribe.

## Where the project stands

ontrack is at version 0.2.0. It is young, and it changes.

- It is published to the npm registry as `@trivoallan/ontrack`, and can
  also be installed from GitHub, by git URL.
- It needs Node 22.18 or later.
- Its command outputs are specified in the
  [commands reference](commands.md).

## Questions

### Does it need a server, an account or a network call?

No. A source is an npm dependency, and decisions are Markdown files under
`docs/adr/`. `plan`, `instructions` and `review` make no network call.

### What does it change in my repository?

Only `ontrack apply` writes: the ADRs under `docs/adr/` and one marked block
in `AGENTS.md`. It never commits, and it never rewrites an ADR you have
decided on.

### Which coding agents does it work with?

Any agent that reads `AGENTS.md`. ontrack warns when Claude Code would not
read it because a `CLAUDE.md` exists without importing it.

### How do I write my own source?

A `package.json` with an `ontrack` key and a directory of ADRs.
[Write your own source](write-your-own-source.md) takes four steps.
[trivoallan/governance](https://github.com/trivoallan/governance) is a
working example to start from.

### Where do I find a source someone else wrote?

Published sources carry the keyword `ontrack-source` on the npm registry.
[Find a source](find-a-source.md) gives the search, and what to read before
you install one.

## Try it on one repository

The [tutorial](tutorial.md) takes four commands. On a fresh repository, the
first three ran in 14 seconds and left an `AGENTS.md` with its first rule. The
agent then took about a minute to propose its first answer.

To understand the model first, read [how ontrack works](how-it-works.md). To
see what each command does, read the [commands reference](commands.md).
