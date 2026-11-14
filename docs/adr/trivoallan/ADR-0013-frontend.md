---
adr: ADR-0013
slug: frontend
title: Frontend
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  frontend:
    framework:
---

# Frontend

## Status

Proposed

> **What is this file?** A question governance asks your repository, with
> the answer it recommends. While it says `status: proposed`, you may edit
> it freely. `revision:` dates the question, not the file: you do not fill
> it, and it only moves when the question changes. `rejected` is a full
> answer: when the question does not apply here, rule `rejected`, remove
> the whole `traits:` block, and say what stands in for it.
> [ADR-0001](ADR-0001-record-architecture-decisions.md) explains the
> mechanics.

## Context

While this key is empty, an agent writing a user interface picks its own
framework, and picks a different one on the next repository. Once it is
written, the agent sets up that framework without deliberating, and follows
the rules below.

**What this ADR does not decide:** the test runner and its command, which
are read from the repository's own files, and the coverage threshold, which
is [ADR-0007](ADR-0007-tests.md)'s. A repository with no user interface (a
service, a library, a command-line tool) rules this ADR `rejected`.

## Decision

**What governance recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `frontend.framework` | `astro` | the same Vite toolchain as the documentation site ([ADR-0008](ADR-0008-documentation.md)), static HTML by default so a page ships no JavaScript it does not need, and islands in React, Vue or Svelte where a page needs interactivity |

**The value is the name the framework is installed under** (`astro`,
`react`, `vue`, `svelte`, `@angular/core`…), with no version: the version
lives in the dependency file. Any framework is a valid answer; another one
than `astro` says why in this ADR's body.

**What governance fixes, whatever the framework.**

1. **Pin the scaffolder and the major version.** Create the project with an
   exact version of its generator (`npm create astro@<version>`), never
   `@latest`, never a globally installed command line. No version range in
   the dependency file crosses a major version.
2. **One package manager, one lockfile.** A second package manager adds a
   second lockfile, and the two drift.
3. **Pin coupled packages exactly.** Packages that must move together (a
   component library and its framework bindings) use the same exact
   version, without `^` or `~`.
4. **Commit no unpinned tool configuration a generator leaves behind.** An
   `.mcp.json` that runs `npx -y <package>` resolves a different server on
   every run: delete it before the first commit, or pin it.
5. **Style through design tokens.** No hard-coded colour, font weight or
   spacing in components: they come from the design system's tokens or
   theme, so a change of theme is one change.
6. **Self-host fonts.** A font loaded from a third-party host leaks visits,
   needs a `font-src` entry in the Content Security Policy, and cannot be
   pinned, since `@font-face` takes no integrity attribute. Fetch font and
   icon files at a tag, never a branch, and check them against their
   published hashes.
7. **Test end to end with Playwright.** Wait for the state you assert
   instead of reading it immediately, and check which element actually
   scrolls before scrolling.
8. **Write down silent failures.** A setup step whose omission renders a
   blank page with no error (an unregistered component, a missing theme
   class) is listed in the repository's own documentation.

**Departing from a rule** is declared in your own ADR, with its reason.

Everything below disappears when you rule, from this sentence up to the
Consequences heading, which stays.

**How to rule: five steps, all in this file.** Read all of them before
doing any, because the last one deletes the other four, and do them in one
commit.

1. **Write the value of each key** under `traits:` in the frontmatter, or,
   if you rule `rejected`, **remove the whole `traits:` block**.
2. **Change `status:`** from `proposed` to `accepted` or `rejected`.
3. **Fill `date:` and `authors:`**: `date:` as `YYYY-MM-DD`, the day you
   rule; `authors:`, the names of the people who decided, without email
   addresses.
4. **Rewrite the Positive, Negative and Neutral lists under Consequences**
   for your verdict: what it makes easier, and what it costs.
5. **Last, delete this block**, from its first sentence up to the
   Consequences heading, which stays. In its place, write the reason for
   your decision wherever you depart from the recommendation, or, if you
   adopt it as is, one line that says so.

The first step is the one people forget: a decision written only in prose
leaves an agent guessing. This is what the frontmatter looks like once
filled, and it is the one part of the file an agent reads without
interpreting it:

```yaml
---
adr: ADR-0013
slug: frontend
title: Frontend
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  frontend:
    framework: astro
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- An agent sets up the same framework the same way every time, from a
  pinned generator.
- Pages ship static HTML unless they need interactivity, which keeps them
  fast and readable without JavaScript.
- The documentation site and the application share one toolchain.

### Negative

- A highly interactive application (a dashboard, an editor) gains little
  from Astro's static default and is often better served by a
  single-page framework.
- Islands in another framework mean two component models in one
  repository.

### Neutral

- The design system itself is not a trait: name it in this ADR's body if
  the repository uses one.

## Alternatives Considered

### `astro`

Static by default, islands for interactivity, Vite underneath. Recommended.

### `react`

The most widely used, and the one coding agents write most reliably. A
better fit than Astro for an application that is interactive throughout.

### `vue` or `svelte`

Single-file components and a smaller runtime than React; less common, so
fewer ready-made libraries.

### `@angular/core`

A complete framework with strong conventions, and a major version to track
twice a year. surdesrails admits only Angular, for reasons tied to an
enterprise design system.

## References

- Adapted from surdesrails [SDR-0013](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0013-frontend.md), revision 1 (framework opened to any value; its design-system theme trait and every rule tied to that design system dropped; only the framework-agnostic rules kept).
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.
- [Astro](https://astro.build/) and [Playwright](https://playwright.dev/).

**The key.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `frontend.framework` | the frontend framework, as installed | a package name such as `astro`, `react`, `vue`, `svelte` or `@angular/core` |

**Not checked against a list**: frameworks are not a closed set. The schema
checks that you answered, never that the answer is right.

**An empty key is not an answer**: this one is required. The value is
written in this file and nowhere else; whoever needs it links here. See
ADR-0001 for the check command.
