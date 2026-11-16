---
title: Concepts
description: The few notions ontrack is built on - an ADR, a question, a track, a ruling, the rules block - and the names this site borrows from elsewhere, such as arc42 and C4.
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

The practice predates ontrack, and ontrack does not own it. A common layout,
described by Michael Nygard, has four sections: the status, the context, the
decision and its consequences. ontrack reads only the frontmatter of the
file: the sections below it are yours, or your track's.

An ADR has a **status**. ontrack knows three:

| Status | It means |
| --- | --- |
| `proposed` | The question is open: nobody has decided yet |
| `accepted` | The decision is taken, and it is in force |
| `rejected` | The question does not apply here, and the ADR says what stands in for it |

A decision that is taken is not edited afterwards. When it stops fitting, a
new ADR **supersedes** it, and the old one stays as the record of what was
decided before.

## A question

In most uses an ADR records a decision one team already took. ontrack turns
it around: a shared ADR is a **question**, with a recommended answer, put to
every repository that imports it.

"How do we name commit scopes, and which tool enforces them?" is such a
question. The ADR gives the context, recommends an answer and says why. It
does not decide: each repository does.

The parts of the question a tool can read are its **traits**: a few keys in
the frontmatter of the ADR, shipped empty.

```yaml
status: proposed
traits:
  commits:
    scopes:
    tool:
```

A question also carries a **revision**, an integer. Its author raises it when
the question changes, so that a repository that answered the earlier
question is told to answer again.

## A track

A **track** is a set of questions kept in one place: a repository of ADRs,
published as an npm package. A platform team, a security team or an open
source project owns it.

A repository that wants those questions installs the track as a dependency,
the way it installs a library. The name it is installed under is its
**namespace**: the ADRs of a track installed as `platform` live in
`docs/adr/platform/`. A repository can install several tracks, and they do
not collide. The ADRs a repository writes for itself live in
`docs/adr/local/`.

[Find a track](find-a-track.md) shows where to look for one, and
[Write your own track](write-your-own-track.md) how to make one.

## A ruling

A **ruling** is the answer a repository gives to a question. It is written in
the repository's own copy of the ADR: the status becomes `accepted` or
`rejected`, the traits are filled, and the text says why wherever the answer
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
repositories may rule differently on the same question: that is the point,
and both answers are on record.

## The rules block

A coding agent does not read ADRs before it works. It reads `AGENTS.md`, a
file at the root of the repository that holds its instructions.

So ontrack copies the traits of every accepted ADR into a marked section of
that file, the **rules block**, and lists the questions that are still open.
The block is rewritten from the ADRs each time: the rules an agent follows
and the decisions on record cannot disagree.

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

ontrack documents itself this way because the track it imports asks every
repository how it documents its architecture, and
[this is what it answered](adr/engineering/ADR-0010-architecture-documentation.md).
Another repository, asked the same question, may answer otherwise.
