---
title: Shared conventions that don't drift
description: ontrack turns your engineering conventions into questions each repository answers, and tells you when an answer is out of date.
template: splash
sidebar:
  label: Home
  order: 0
hero:
  tagline: Write your engineering conventions once, as questions. Each repository answers them for itself, coding agents follow the answers, and CI tells you when an answer is out of date.
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

## Next to what you already have

| You have | What it does | What it leaves open |
| --- | --- | --- |
| A template repository or a project generator | Copies the conventions when the repository is created | Nothing links the copy to the original afterwards |
| A shared configuration (lint rules, presets) | Applies the same values everywhere | A repository that differs has to override or opt out |
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

## Where the project stands

ontrack is at version 0.2.0. It is young, and it changes.

- It is installed from GitHub, by git URL. It is not published to the npm
  registry.
- It needs Node 22.18 or later.
- Its own decisions and architecture are on this site, and its command
  outputs are specified in the
  [README](https://github.com/trivoallan/ontrack#readme).

## Try it on one repository

The [tutorial](tutorial.md) takes four commands. On a fresh repository, the
first three ran in 14 seconds and left an `AGENTS.md` with its first rule. The
agent then took about a minute to propose its first answer.

To see what ontrack does command by command first, read the
[features](features.md).
