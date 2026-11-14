---
adr: ADR-0008
slug: documentation
title: Documentation
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  docs:
    tool:
    root:
    audience:
---

# Documentation

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

While these keys are empty, an agent that has to write a page does not know
**where to put it**, whether **it has to touch a navigation file**, or **what
it may write in it**. It drops the file by guesswork, leaves a stale table
of contents behind, and may publish an internal URL in a page the world
reads. Once these three values are written, it knows.

**The classification is not decided here.** governance requires
[Diátaxis](https://diataxis.fr/) (tutorial, how-to guide, explanation,
reference) and the Google developer documentation style for prose. What is
yours is the **tooling**, the **location** and the **audience**.

## Decision

**What governance recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `docs.tool` | `starlight` | the fastest build measured (see References), navigation **generated from the directory tree** so adding a page touches no table of contents, built-in search, and LikeC4 views (ADR-0010) embedded through its Vite plugin with no generation step |
| `docs.root` | `docs/` | where governance's other paths already live (`docs/adr/`, `docs/architecture/`), and an agent looking for where to put a page has nothing to guess |
| `docs.audience` | `public` | governance's repositories are public on GitHub, so their documentation is read by anyone whether or not that was intended; writing for that audience from the start is the honest default |

**Starlight does not read `docs/` by default**: it expects
`src/content/docs/`. Point its `docs` collection at `docs/` with Astro's
`glob` loader, in `src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './docs' }),
    schema: docsSchema(),
  }),
};
```

Each page then needs a `title:` in its frontmatter. Mermaid diagrams
(ADR-0010) need the `astro-mermaid` integration, which renders them in the
browser and adds nothing to the build.

**`public` is the strict end of the scale, and that is the point.** A page
read more widely than it was written for cannot be unpublished, while a
page written for the public is never wrong for a smaller audience. For a
private repository, `team` or `single-user` is a legitimate answer: it is
taken, not suffered.

**The audience is a scale, not a switch.** Three steps, from narrowest to
widest, and each widens who may read:

| Value | Who reads |
| --- | --- |
| `single-user` | one person, the one who opens the repository |
| `team` | the people who maintain this repository |
| `public` | anyone |

**This is not a vocabulary detail.** Each step decides what an agent may
write in a page: a customer name, an internal URL, an infrastructure detail,
a person's address. What passes at `team` does not pass at `public`, and
nothing catches it afterwards.

**Diátaxis quadrants are not a key of this ADR, on purpose.** The quadrants
a repository holds are **observed** once it has pages, and at adoption it has
none. Asking would force an invented answer or an empty key the schema
refuses. The classification still applies, page by page, when each is
written.

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
adr: ADR-0008
slug: documentation
title: Documentation
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  docs:
    tool: starlight
    root: docs/
    audience: public
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- An agent knows where a page goes and never has to edit a table of
  contents.
- A full build stays in seconds, and search works without an external
  service.
- With `public`, an agent never writes an internal URL, a customer name or
  an infrastructure detail into a page.

### Negative

- `starlight` is a Node.js site to install, build and keep up to date,
  even in a repository that has no other JavaScript.
- Reading `docs/` and rendering Mermaid both take configuration Starlight
  does not ship by default, and Mermaid goes through a third-party
  integration.
- `public` forbids the raw notes and internal details that a private
  repository's documentation could usefully hold.

### Neutral

- The language of the documentation is decided by
  [ADR-0002](ADR-0002-localization.md), not here.

## Alternatives Considered

### Starlight

A generated site on Astro, automatic navigation. Recommended, for the
reasons above.

### Docusaurus

A generated site on React, automatic navigation. It reads `docs/` by
default, renders Mermaid through an official theme (which also needs
`@mermaid-js/layout-elk` installed), and versions documentation, which only
a library shipped in several versions needs. Its default build was the
slowest measured, about seven times Starlight's; with `future.faster` and
`future.v4` turned on it comes within about 25 % of Starlight. LikeC4 views
need `likec4 codegen webcomponent` before every build. A sound answer:
turn `future.faster` on if you choose it.

### MkDocs

A generated site in Python, for a repository with no Node.js at all.

### A generated site, hand-kept navigation

More control over order, and one more file to update with every page.

### No site

Pages are read on the forge. A tenable answer, frequent for a repository
with no outside readers; write `docs.tool: none`.

## References

- Adapted from surdesrails [SDR-0008](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0008-documentation.md), revision 1 (audience scale reduced to three steps; recommends `public` rather than the team step, and `starlight` rather than `docusaurus`).
- Build times measured on 2026-11-14, Apple M1 Pro, Node 22, three cold
  builds each (outputs and caches removed), on 302 Markdown pages of which 30
  hold a Mermaid diagram, plus one page with a LikeC4 view. Medians:
  Docusaurus 3.10.2 default, 57.6 s (including 1.5 s of LikeC4 code
  generation); Docusaurus 3.10.2 with `future.faster`, 10.4 s (including
  1.6 s); Starlight 0.43.1 on Astro 7.4, 7.6 s (including the Pagefind
  index). The development server was not measured.
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.
- [Diátaxis](https://diataxis.fr/) and the [Google developer documentation style guide](https://developers.google.com/style).

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `docs.tool` | what generates the site, if there is one | `starlight`, `docusaurus`, `mkdocs`, `none` |
| `docs.root` | the directory the pages live in | a path, for example `docs/` |
| `docs.audience` | how far this documentation reaches | `single-user`, `team`, `public`, as described above |

**`docs.audience` is not decorative.** `public` commits an agent to never
writing an internal URL, a customer name or an infrastructure detail in a
page. `single-user` says the opposite: nothing leaves the repository, and a
raw note belongs there. **Nothing checks it**: review does, which is why the
value must be written rather than assumed.

**Two of these keys are decided by looking at the repository**, not by
reading this file: does a site already exist, and where do the pages live.
Only `docs.audience` is decided by reading.

**If `docs.root` is not `docs/`**, the ADR directory and the check command
move with it: the ADRs live under the documentation root, whatever it is.

**What these keys do not cover:** the Diátaxis classification, the prose
style, or the language. **And Diátaxis itself is not refused here**:
`rejected` means you keep no documentation, not that you classify it
differently.

**All three keys are required**: an empty key is not an answer. The value is
written in this file and nowhere else; whoever needs it links here. See
ADR-0001 for the check command.
