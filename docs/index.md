---
title: Shared conventions that stay in step
description: ontrack imports shared architecture decision records (ADRs) into every repository, flags the ones that are out of date, and writes the decisions to AGENTS.md.
template: splash
hero:
  tagline: Write each engineering convention once, as a shared architecture decision record. Every repository answers it for itself, CI says when an answer is out of date, and coding agents follow what you decided.
  image:
    file: ./assets/logo.png
    alt: ""
  actions:
    - text: Get started
      link: https://github.com/trivoallan/ontrack#installation
      icon: right-arrow
    - text: See the features
      link: /ontrack/features/
      variant: minimal
---

## Copied conventions drift

How to commit, branch, test and deliver: teams that share these conventions
copy them from repository to repository. Six months later no two copies agree,
nobody knows which one is current, and a coding agent follows whichever file
it happens to find.

ontrack imports shared architecture decision records (ADRs) from a **source**,
an ordinary npm dependency. Each ADR asks one question and recommends an
answer.

## What you get

### One copy of every question

Conventions live in a source repository, written once. Repositories depend on
it with npm: you pin it, update it and review the change like any other
dependency. There is no server to run.

### Every repository decides for itself

ontrack imports questions, not answers. A repository takes the
recommendation, adapts it or rejects it, and records why. Governance without
a mandate nobody follows.

### Drift you can see

When a question changes upstream, `ontrack plan` names the repositories that
must rule again, and exits with `2`. One line in a CI job is enough to keep
every repository honest.

### Agents that follow the rules

The decisions are written to `AGENTS.md`, and `ontrack check` runs the
command each decision names. An agent knows what the repository decided, and
when its work departs from it.

## Three commands

```bash
npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git
npm i -D trivoallan@git+https://github.com/trivoallan/governance.git
npx ontrack plan
```

`plan` writes nothing: it shows what importing the example source would
change. The [README](https://github.com/trivoallan/ontrack#readme) takes it
from there.

## It governs itself

ontrack is built under its own rules. This repository imports
[trivoallan/governance](https://github.com/trivoallan/governance), and every
ruling it made is published here, starting with
[how decisions are recorded](adr/trivoallan/ADR-0001-record-architecture-decisions.md).
Its [architecture](architecture/arc42/01-introduction-and-goals.md) is
documented the way those decisions prescribe.

## Questions

### Do I have to accept the source's answers?

No. A source recommends; the repository rules. You can accept, adapt or
reject each ADR, and supersede an imported one with your own later.

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
[trivoallan/governance](https://github.com/trivoallan/governance) is a
working example to start from.

## Start with one repository

Install ontrack, add a source, run `plan`. Nothing is written until you say
so.

[Get started](https://github.com/trivoallan/ontrack#installation) ·
[See the features](features.md)
