---
adr: ADR-0010
slug: architecture-documentation
title: Architecture documentation
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  architecture:
    document:
    model:
    diagrams:
---

# Architecture documentation

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

While this key is empty, an agent that needs to understand the system as a
whole (its context, its building blocks, how it is deployed) has nowhere to
look, so it rebuilds that picture from the code each time, and rebuilds it
differently. An agent that changes the architecture does not know whether a
document or a diagram should change with it. Once these values are written,
it knows where the document is, whether the diagrams are code it can edit,
or that there is neither.

This question is asked separately from the code's pattern
([ADR-0003](ADR-0003-architecture.md)) because the two are ruled at
different times. A pattern is chosen before the first module; a document
is worth writing once there is something to describe, and a repository can
answer one without the other.

## Decision

**What governance recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `architecture.document` | `arc42` | its twelve sections give every architecture fact one fixed place, so an agent and a reader know where to look and where to write, and a missing section is visible as a missing file |
| `architecture.diagrams` | `mermaid` | GitHub renders it from a fenced code block, and the recommended site (ADR-0008) renders it in the browser, so a diagram is text in the page that needs no build step and no image file |
| `architecture.model` | `likec4` | the diagrams become code: one model in text files, several views generated from it, reviewed in a diff like the rest of the repository. An agent can read and change it, which it cannot do with an image |

**The document is a directory, `docs/architecture/arc42/`, with one file
per section.** One file per section keeps each change small, lets a pull
request touch only the section it changes, and gives an agent a precise
file to open. It lives under the documentation root of
[ADR-0008](ADR-0008-documentation.md); if `docs.root` is not `docs/`, the
path moves with it.

**governance ships no template for now.** Create the twelve files below.
Fill only those you have something to say in; a section with nothing to say
yet keeps its file with one line saying so, rather than disappearing:

| File | arc42 section |
| --- | --- |
| `01-introduction-and-goals.md` | Introduction and Goals |
| `02-constraints.md` | Constraints |
| `03-context-and-scope.md` | Context and Scope |
| `04-solution-strategy.md` | Solution Strategy |
| `05-building-block-view.md` | Building Block View |
| `06-runtime-view.md` | Runtime View |
| `07-deployment-view.md` | Deployment View |
| `08-cross-cutting-concepts.md` | Cross-cutting Concepts |
| `09-architecture-decisions.md` | Architecture Decisions |
| `10-quality-requirements.md` | Quality Requirements |
| `11-risks-and-technical-debt.md` | Risks and Technical Debt |
| `12-glossary.md` | Glossary |

**Section 9 does not repeat the ADRs.** It links to `docs/adr/`, where the
decisions live; copying them would give two places to keep in step.

**The model lives in `docs/architecture/model/`**, as LikeC4 `.c4` files:
one model of the system's elements and relationships, from which the views
are generated. The sections that show structure use views of that model
rather than hand-drawn diagrams: Context and Scope (3), Building Block View
(5) and Deployment View (7). A diagram drawn by hand next to the model would
be a second source, and it would drift.

**What the model does not show is drawn in `mermaid`.** Sequences, state
machines and flows (mostly in the Runtime View, section 6, and in
Cross-cutting Concepts, section 8) are not structure, so they do not belong
in the model. They are written as Mermaid code blocks in the section file
itself. Never redraw in Mermaid an element the model already holds: that is
the second source the model exists to avoid.

**This recommendation does not bind your repository.** If your architecture
already lives in a mature document elsewhere, say `elsewhere` and name the
path in this ADR's body. If you keep no architecture document, say `none`:
that is an honest answer for a small repository. For `architecture.model`,
another architecture-as-code tool is a valid answer when named, and `none`
means the diagrams, if any, are drawn by hand. For
`architecture.diagrams`, `plantuml` is the other text format, and `none`
means the section files hold no diagram outside the model's views.

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
adr: ADR-0010
slug: architecture-documentation
title: Architecture documentation
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  architecture:
    document: arc42
    model: likec4
    diagrams: mermaid
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- An agent finds the system's context, building blocks and deployment in
  one known file instead of rebuilding them from the code.
- Fixed section files make a gap visible: an empty Deployment View is a
  question someone has to answer.
- With LikeC4, a change to the architecture and to its diagrams lands in the
  same diff, and the views cannot disagree with each other.
- Every diagram is text, so an agent can read and change all of them.

### Negative

- The document has to be kept up to date by hand; nothing flags it when the
  code moves away from it.
- Without a shipped template, each repository creates the twelve files by
  hand from the table above.
- LikeC4 is one more tool and one more language to learn, and its views need
  a build step to be seen as images.
- Two diagram languages, LikeC4 for structure and Mermaid for behaviour, and
  a rule to keep them from overlapping that only review enforces.

### Neutral

- The pattern itself is asked by ADR-0003; this ADR only says where it is
  described.

## Alternatives Considered

### `arc42` in one directory, one file per section

`docs/architecture/arc42/`, twelve files. Recommended.

### `arc42` in a single file

One `arc42.md`, as surdesrails does. Simpler to start, but every change
touches the same file, and the file grows long enough that an agent reads
far more than it needs.

### `elsewhere`

The architecture already lives in another document. Keep it there and name
its path in this ADR.

### `none`

No architecture document. Honest for a small repository whose structure is
read from the code and ADR-0003.

### Diagrams drawn by hand

Images or drawing-tool files next to the document. No tool to learn, but an
agent cannot change them, review cannot diff them, and each view drifts from
the others on its own.

### PlantUML for diagrams outside the model

Richer sequence and state notation than Mermaid, but it needs a renderer:
GitHub does not display it from a code block, and a documentation site
needs a plugin or a rendering server.

### Another architecture-as-code tool

Structurizr DSL or diagrams as code in Mermaid or PlantUML. Valid answers
when named; governance recommends LikeC4 because one model feeds every view,
where diagram-by-diagram tools repeat each element in each picture.

## References

- Split out of surdesrails [SDR-0003](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0003-architecture.md), revision 1 (its `architecture.document` key). surdesrails ships an arc42 template; governance does not yet.
- [arc42](https://arc42.org/overview): the twelve sections.
- [LikeC4](https://likec4.dev/): architecture as code, one model and generated views.
- [Mermaid](https://mermaid.js.org/): diagrams as text, rendered by GitHub and in the browser by the documentation site.
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `architecture.document` | where this repository's architecture document lives | `arc42` (`docs/architecture/arc42/`, one file per section), `elsewhere`, `none` |
| `architecture.model` | what the architecture diagrams are made from | `likec4` (`docs/architecture/model/`), another named tool, or `none` |
| `architecture.diagrams` | the text format of diagrams the model does not cover | `mermaid`, `plantuml`, `none` |

**`architecture.model` is not checked against a list**: architecture-as-code
tools are not a closed set. The schema checks that you answered, never that
the answer is right.

**All three keys are required**: an empty key is not an answer. The value is
written in this file and nowhere else; whoever needs it links here. See
ADR-0001 for the check command.
