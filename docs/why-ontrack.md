---
title: Why ontrack
description: The problem ontrack is for, how it differs from what you already use, and how it is built under its own conventions.
---

## Conventions are copied, then they drift

You agreed on how to commit, branch, test and deliver. Then the agreement was
copied: into a template, a wiki page, thirty repositories.

- Each copy changes on its own, and nothing tells you which ones did.
- When the convention itself changes, nothing tells the repositories.
- A coding agent that finds no instruction invents one: `fix(api)`, then
  `fix(backend)`, then `fix(server)` for the same place.

## Proposed, not imposed

ontrack keeps each convention in one place, a track, and proposes it to
every repository. A repository rules on it: it follows the recommendation,
departs from it, or rejects it, and writes down why. Its rulings become the
instructions coding agents read. When a convention changes, every repository
that ruled on it is told.

[How it works](how-it-works.md#proposed-not-imposed) says what this costs,
and when a shared configuration does better.

## Next to what you already have

| You have | What it does | What it leaves open |
| --- | --- | --- |
| A template repository or a project generator | Copies the conventions when the repository is created | Nothing links the copy to the original afterwards |
| A shared configuration (lint rules, presets) | Applies the same values everywhere | A repository that differs has to override or opt out |
| A rules sync tool, such as Ruler or rulesync | Writes one set of agent rules to the file each coding agent reads | Where the rules come from, and whether they still match what was agreed |
| A tool that runs ADRs as checks, such as Archgate | Fails CI when the code departs from a decision | A shared ADR carries the decision, not a proposal: a repository that differs keeps an edited copy |
| A standards platform, such as Packmind | Sends one playbook from a server to every repository and agent | A repository can pin a version or leave a package out, but has no place to record why it differs |
| ontrack | Proposes each convention to each repository and records its ruling | The ruling itself: that is the repository's call |

> [!NOTE]
> ontrack does not replace your linters. An ADR can name the command that
> checks its decision, and `ontrack check` runs it.

## It governs itself

ontrack is built under its own conventions. This repository imports
[ontrack-engineering](ontrack-engineering.mdx), the reference track, and every
ruling it made is published here, starting with
[how decisions are recorded](adr/engineering/ADR-0001-record-architecture-decisions.md).
Its [architecture](architecture/arc42/01-introduction-and-goals.md) is
documented the way those decisions prescribe.

## Next

- [Features](features.md): what ontrack does, by need.
- [Get started](tutorial.mdx): four commands on one repository.
