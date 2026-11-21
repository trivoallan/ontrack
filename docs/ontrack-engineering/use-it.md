---
title: Use the ontrack-engineering track
description: Install the ontrack-engineering track, check where it was built, take its new releases, and reject a convention that does not fit.
---

This guide shows how to install `@trivoallan/ontrack-engineering` in a
repository, how to take its new releases, and how to reject one of its
conventions. It assumes ontrack is installed: see the
[tutorial](../tutorial.mdx), step 1.

## Install it

### 1. Install the track under its alias

```bash
npm i -D engineering@npm:@trivoallan/ontrack-engineering
```

The alias, `engineering`, is the track's namespace: its conventions land in
`docs/adr/engineering/`, and `AGENTS.md` names them `engineering/ADR-…`.
It is the package name without its scope and without `ontrack-`. If another
track you install would get the same alias, prefix it with the author:
`acme-engineering`.

### 2. Check where it was built

```bash
npm audit signatures
```

The track is published by its release workflow, with provenance. This
command checks that the package you installed is the one that workflow
built.

### 3. Import and rule on its conventions

```bash
npx ontrack plan
npx ontrack apply
claude "$(npx ontrack review)"
```

The [tutorial](../tutorial.mdx) takes these steps one at a time, from
step 2.

## Take a new release

A release of the track can add a convention, revise one, or change how one is
checked. Update it, then see what moved:

```bash
npm update engineering
npx ontrack plan
```

`plan` says, for each convention, what changed and what to do: rule a `new`
or `revised` convention with `npx ontrack review`, then run
`npx ontrack apply`. [Revise a convention](../revise-a-convention.md#in-each-repository)
walks through a revised convention, from step 4.

To be told when the track moves, rather than remember to update it, see
[Run ontrack in CI](../run-ontrack-in-ci.md#3-notice-when-the-track-has-moved).

> [!NOTE]
> If you accept the track's
> [ADR-0018](https://github.com/trivoallan/ontrack-engineering/blob/main/adr/ADR-0018-dependencies.md), its cooldown also delays the track's
> own releases. ontrack exempts the track from it in
> [local/ADR-0028](../adr/local/ADR-0028-the-tracks-of-this-owner-skip-the-cooldown.md).

## Change the alias

The alias names the folder and every reference to the track's ADRs. To
install the track under another one, `eng` for example, reinstall it and let
ontrack move the folder:

```bash
npm uninstall engineering
npm i -D eng@npm:@trivoallan/ontrack-engineering
npx ontrack plan
npx ontrack apply
```

`plan` reads the old folder as the track's and ends with
`rename: docs/adr/engineering/ → docs/adr/eng/`. `apply` moves it as a
whole, so your rulings stay. It then lists the links and the `supersedes:`
entries that still name `engineering`: edit them, and run
`npx ontrack apply` again to write `AGENTS.md`.

## Reject a convention

A convention that does not fit your repository is ruled on by rejecting it: a
rejection is a full ruling. Ask the agent to rule on it:

```bash
claude "$(npx ontrack review ADR-0013)"
```

It proposes `rejected` only on evidence that the convention does not apply.
Once you agree, it sets the status, removes the `traits:` block, writes in
the ADR what stands in for the convention, and runs `npx ontrack apply`.
`AGENTS.md` then carries no instruction for it, and `plan` no longer lists it as
pending.

## Related

- [Conventions](conventions.mdx): the conventions of the installed release, by
  domain.
- [Concepts](../concepts.md#a-ruling): what a ruling is.
