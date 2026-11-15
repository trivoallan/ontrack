---
title: Use the ontrack-engineering track
description: Install the ontrack-engineering track, check where it was built, take its new releases, and reject a question that does not fit.
---

This guide shows how to install `@trivoallan/ontrack-engineering` in a
repository, how to take its new releases, and how to reject one of its
questions. It assumes ontrack is installed: see the
[tutorial](../tutorial.mdx), step 1.

## Install it

### 1. Install the track under its alias

```bash
npm i -D trivoallan@npm:@trivoallan/ontrack-engineering
```

The alias, `trivoallan`, is the track's namespace: its questions land in
`docs/adr/trivoallan/`, and `AGENTS.md` names them `trivoallan/ADR-…`.

### 2. Check where it was built

```bash
npm audit signatures
```

The track is published by its release workflow, with provenance. This
command checks that the package you installed is the one that workflow
built.

### 3. Import and rule on its questions

```bash
npx ontrack plan
npx ontrack apply
claude "$(npx ontrack review)"
```

The [tutorial](../tutorial.mdx) takes these steps one at a time, from
step 2.

## Take a new release

A release of the track can add a question, revise one, or change how one is
checked. Update it, then see what moved:

```bash
npm update trivoallan
npx ontrack plan
```

`plan` says, for each question, what changed and what to do: rule a `new`
or `revised` question with `npx ontrack review`, then run
`npx ontrack apply`. [Revise a question](../revise-a-question.md#in-each-repository)
walks through a revised question, from step 4.

To be told when the track moves, rather than remember to update it, see
[Run ontrack in CI](../run-ontrack-in-ci.md#3-notice-when-the-track-has-moved).

> [!NOTE]
> If you accept the track's
> [ADR-0018](https://github.com/trivoallan/ontrack-engineering/blob/main/adr/ADR-0018-dependencies.md), its cooldown also delays the track's
> own releases. ontrack exempts the track from it in
> [local/ADR-0024](../adr/local/ADR-0024-the-engineering-track-skips-the-cooldown.md).

## Reject a question

A question that does not fit your repository is answered by rejecting it: a
rejection is a full answer. Ask the agent to rule on it:

```bash
claude "$(npx ontrack review ADR-0013)"
```

It proposes `rejected` only on evidence that the question does not apply.
Once you agree, it sets the status, removes the `traits:` block, writes in
the ADR what stands in for the question, and runs `npx ontrack apply`.
`AGENTS.md` then carries no rule for it, and `plan` no longer lists it as
pending.

## Related

- [Questions](questions.mdx): the questions of the installed release, by
  domain.
- [Concepts](../concepts.md#a-ruling): what a ruling is.
