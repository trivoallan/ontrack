---
title: Find a track
description: Find a track someone else published, judge it before you install it, and install it under an alias.
---

This guide shows how to find a track that someone else wrote, and what to
look at before you install it. Use it to adopt a track, or to read one
before you [write your own](write-your-own-track.md).

## Search the npm registry

Authors mark a published track with the keyword `ontrack-tracks`:

[Search npm for `keywords:ontrack-tracks`](https://www.npmjs.com/search?q=keywords%3Aontrack-tracks)

The search shows the tracks published to the registry with that keyword. A
track published by git URL only does not appear in it.

A track was called a source before ontrack 0.5. A package published then
may still carry the earlier keyword:
[search npm for `keywords:ontrack-source`](https://www.npmjs.com/search?q=keywords%3Aontrack-source).

[`@trivoallan/ontrack-governance`](https://www.npmjs.com/package/@trivoallan/ontrack-governance)
is the track ontrack uses on itself. Its ADRs are in
[trivoallan/governance](https://github.com/trivoallan/governance).

ontrack does not review the tracks the search returns. A track is a
dependency: decide on it as you decide on any other.

## Read it before you install it

A repository installs a whole track. Each of its questions then waits for
an answer. Before you install, read in the README and in the ADRs of the
track:

- how many questions it asks, and on which subjects;
- which questions carry a `check` key. The command it names runs in your
  repository, with [`ontrack check`](commands.md#ontrack-check), once you
  accept the ADR;
- how often its questions are revised.

## Install it

Install the package under an alias. The alias is the namespace: the ADRs
land in `docs/adr/<alias>/`. It must be unscoped, and cannot be `local`,
the namespace of your own ADRs.

```bash
npm i -D <alias>@npm:<package>
npx ontrack plan
```

`plan` lists the questions and changes no file. `npx ontrack apply` then
imports them. The [tutorial](tutorial.md) goes through these steps with a
track.

## Keep what applies, reject the rest

You cannot install part of a track. You answer each question instead:

- Every question arrives as `proposed`, and is listed in `AGENTS.md` under
  "Not yet decided" until you rule.
- `rejected` is a full answer: the question does not apply here, and the ADR
  says what stands in for it.
- When the author revises a question, it comes back for a ruling, even when
  you rejected it.

[How ontrack works](how-it-works.md#the-life-of-one-question) follows a
question from its arrival to its revision. A repository may install
[several tracks](how-it-works.md#several-tracks), each under its own
alias.
