---
adr: ADR-0005
slug: validation
title: Validation
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  validation:
    boundary:
    data_files:
---

# Validation

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

While these keys are empty, an agent writing an entry point (an HTTP route,
a command, a configuration reader) does not know **what to describe the
shape of incoming data with**. It writes a hand-made check, different at
every boundary, or none at all, and lets a missing field become a default
nobody wanted.

**A boundary is any point where data enters without the running code
having produced it**: request body, configuration file, queue message,
environment variable, command-line argument. Two less obvious cases count
too: **a row read from a database**, which an older version of the code may
have written, and **a semi-structured column** (`jsonb`, a blob), even inside
an otherwise validated row.

**Why declare rather than check by hand.** Three reasons, in the order they
bite:

1. **A hand-written check is opt-in, and its coverage decays on its own.**
   Adding a field adds an unvalidated field, silently. The argument holds
   fully for `boundary`, where the model *is* the type. It holds only half
   for `data_files`: adding a key to a file without adding it to the schema
   is still possible, but the omission **shows**, because the schema sits
   next to the file.
2. **A schema can be read without running anything.** A check buried in a
   function only says what it accepts to someone who reads and runs it.
3. **A schema is a machine-readable contract.** An agent that must produce
   conforming data reads the schema; without one it guesses from an example,
   and **an example never says what is required**, only what was present
   that day.

**Two moments, two guarantees, and neither replaces the other.** `boundary`
validates **when the program reads** the data: the only protection at run
time, including against a file edited later. `data_files` validates
**statically**, when the file is written: the only one that shows the error
in the editor of whoever makes it, and the only one a reviewer can exercise
without running the program. A repository that holds data files needs both.

**Not concerned:** internal structures that your own code produces and
consumes. They crossed no boundary, and the language already checks them.

## Decision

**What governance fixes:** data is validated at every boundary. What is
yours to decide is the **mechanism**. A repository that cannot use any of
the recommended mechanisms (a performance-critical path, a zero-dependency
constraint) names another and says why: it departs from the means, never
from the requirement.

**What governance recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `validation.boundary` | *depends on your language*: `pydantic` (Python), `zod` (TypeScript) | each validates at run time, derives the type from the schema so there is one source, and exports a JSON Schema |
| `validation.data_files` | `json-schema` | the one format editors already consume, and YAML and TOML map onto it. One schema serves the file, the editor, the review and the agent |

**The grid used to set other options aside**, so you can apply it to a
language not listed here. In order, an option falls if it: **describes
without validating** at run time; validates **by hand**, field by field, so
an added field is an uncovered field; exposes **no exportable schema**; or,
all else equal, has the narrowest ecosystem. For Go, surdesrails retained
`go-playground/validator` on this grid.

**The value's format:** the name the library is installed under (`pydantic`,
`zod`), with no version. The version lives in your dependency file; copied
here, it would go stale with nothing to say so.

**`json-schema` does not contradict `pydantic` or `zod`.** Writing JSON
Schemas *to type code* would give two sources that drift, which is why the
boundary recommendation is a type-first library. A data file read by no type
has no second source to drift from. Where both exist (a file read by a
model), **the model is authoritative**, and the schema is derived from it or
aligned by hand in the same pull request.

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
adr: ADR-0005
slug: validation
title: Validation
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  validation:
    boundary: zod
    data_files: json-schema
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- Every entry point validates with the same mechanism, and an added field is
  validated by adding it to the model.
- A data file's error shows in the editor of whoever makes it, before
  review.

### Negative

- One more runtime dependency for `boundary`.
- A schema attached to nothing guards nothing: each data file has to be
  linked to its schema, which is a step people forget.

### Neutral

- Internal structures stay unvalidated on purpose; the language checks them.

## Alternatives Considered

### A declared schema, validated automatically

The shape is written once, and validation follows from it. Recommended.

### A hand-written check at each boundary

No new dependency, and coverage that depends on everyone's discipline,
boundary by boundary, field by field.

### Nothing

Trust what comes in. Tenable only for a repository with no boundary; rule
`rejected` then, not an empty key.

## References

- Adapted from surdesrails [SDR-0005](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0005-validation.md), revision 1 (adds `zod` for TypeScript, which SDR-0005 left open).
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.
- [ADR-0004](ADR-0004-languages.md): the main language, which picks the `boundary` library.

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `validation.boundary` | what describes and validates data **when the program reads it** | a library name such as `pydantic` or `zod`, or `none` (see below) |
| `validation.data_files` | what validates a data file **statically**, without running the program that reads it | `json-schema`, another named mechanism, or `none` |

**`boundary: none` exists, and does not mean "we do not validate".** It
means this repository **reads no data at run time**: it holds files, and
nothing runs to consume them, as in a configuration, schema or text
repository, which still needs `data_files`. A repository that runs code and
chooses not to validate does not write `none`: it is not compliant, and
review has to say so.

**The schema must be attached to the file, or it guards nothing.** Attach
it with `$schema` in the file when the encoding allows it, or else through
the naming convention of the tool you use.

**The model lives next to the boundary it guards**, not in a shared types
module: the entry point decides what it accepts.

**Neither key is checked against a list.** Validation libraries are not a
closed set, and freezing one would refuse the departure this file allows.
The schema checks that you answered, never that the answer is right.

**`rejected` means this repository has no data boundary at all**, which is
rare but real. It is not the same as "we validate by hand": that is a value,
and it is written.

**Both keys are required**: an empty key is not an answer. The value is
written in this file and nowhere else; whoever needs it links here. See
ADR-0001 for the check command.
