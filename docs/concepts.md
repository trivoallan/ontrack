---
title: Concepts
description: The few notions ontrack is built on - an ADR, a convention, a track, a ruling, the instructions block - and the names this site borrows from elsewhere, such as arc42 and C4.
---

This page explains the notions the rest of the documentation takes for
granted, one at a time. It needs no prior knowledge of ontrack or of
architecture decision records.

To see them at work in one repository, follow the [tutorial](tutorial.mdx).
For what happens to them over time, read
[how ontrack works](how-it-works.md). The [glossary](architecture/arc42/12-glossary.md)
gives each term in one line.

## An ADR

An **architecture decision record** (ADR) is a short document that records
one decision: what was decided, in which context, and what follows from it.
One file, one decision. A team keeps its ADRs in the repository, next to the
code they are about, so that a decision is reviewed and kept like code.

The name says architecture. ontrack, like many teams, uses the format for
any decision a team wants on record: how to commit, which license to ship
under, where secrets live.

The practice predates ontrack, and ontrack does not own it. A common layout,
described by Michael Nygard, has four sections: the status, the context, the
decision and its consequences. ontrack reads only the frontmatter of the
file: the sections below it are yours, or your track's.

An ADR has a **status**. ontrack knows three:

| Status | It means |
| --- | --- |
| `proposed` | The convention is open: nobody has decided yet |
| `accepted` | The decision is taken, and it is in force |
| `rejected` | The convention does not apply here, and the ADR says what stands in for it |

A decision that is taken is not edited afterwards. When it stops fitting, a
new ADR **supersedes** it, and the old one stays as the record of what was
decided before.

## A convention

In most uses an ADR records a decision one team already took. ontrack turns
it around: a shared ADR is a **convention**, proposed to every repository
that imports it, with the values it recommends.

"Name the commit scopes, and the tool that enforces them" is such a
convention. The ADR gives the context, recommends values and says why. It
does not decide: each repository does.

The parameters a convention leaves to the repository are its **traits**: a
few keys in the frontmatter of the ADR, shipped empty, which a tool can
read.

```yaml
status: proposed
traits:
  commits:
    scopes:
    tool:
```

A convention also carries a **revision**, an integer. Its author raises it when
the convention changes, so that a repository that ruled on the earlier
convention is told to rule again.

## A track

A **track** is a set of conventions kept in one place: a repository of ADRs,
published as an npm package. A platform team, a security team or an open
source project owns it.

A repository that wants those conventions installs the track as a dependency,
the way it installs a library. The name it is installed under is its
**namespace**: the ADRs of a track installed as `platform` live in
`docs/adr/platform/`. A repository can install several tracks, and they do
not collide. The ADRs a repository writes for itself live in
`docs/adr/local/`: those are its own **decisions**, which no track
proposed, and they are not conventions.

[Find a track](find-a-track.md) shows where to look for one, and
[Write your own track](write-your-own-track.md) how to make one.

## A ruling

A **ruling** is what a repository decides on a convention. It is written in
the repository's own copy of the ADR: the status becomes `accepted` or
`rejected`, the traits are filled, and the text says why wherever the ruling
departs from the recommendation.

```yaml
status: accepted
traits:
  commits:
    scopes: [api, web]
    tool: commitlint
```

A person rules. A coding agent can prepare the ruling, from what it finds in
the repository, and it writes nothing until the person agrees. Two
repositories may rule differently on the same convention: that is the point,
and both rulings are on record.

## The instructions block

A coding agent does not read ADRs before it works. It reads `AGENTS.md`, a
file at the root of the repository that holds its instructions.

So ontrack copies the traits of every accepted ADR into a marked section of
that file, the **instructions block**, and lists the conventions not yet ruled on.
The block is rewritten from the ADRs each time: the instructions an agent
follows and the rulings on record cannot disagree.

## A check

A decision can name the command that verifies it: a linter, a test, a
script. That command is its **check**. `ontrack check` runs the check of
every accepted ADR, and says which decision a failure breaks. ontrack judges
nothing itself.

## Names you will meet on this site

The reference section of this site also documents how ontrack itself is
built. It uses two notions that are not part of ontrack: you need neither to
use it.

- **[arc42](https://arc42.org/)** is a template for documenting the
  architecture of a piece of software, in twelve sections that go from its
  goals to its glossary. The
  [Architecture](architecture/arc42/01-introduction-and-goals.md) pages of
  this site follow it.
- **[C4](https://c4model.com/)** is a way to draw an architecture at four
  levels of zoom: the system in its context, its containers, their components,
  and the code. The diagrams of the Architecture pages are views of one such
  model.

ontrack documents itself this way because the track it imports proposes a
convention on documenting the architecture, and
[this is how it ruled](adr/engineering/ADR-0010-architecture-documentation.md).
Another repository, given the same convention, may rule otherwise.
