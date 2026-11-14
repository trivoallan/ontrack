---
adr: ADR-0004
slug: languages
title: Languages
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  languages:
    main:
      name:
---

# Languages

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

While this key is empty, an agent adding code to this repository does not
know which language to write it in. It infers from what it sees, and gets it
wrong as soon as the repository holds more than one. Once the value is
written, it reads it and sticks to it.

The main language is not the only language in the repository: it is the one
code is written in by default, and the one whose tooling is the reference.
A repository can hold others without changing the answer.

## Decision

**governance does not choose for you, but it narrows the field.** It
recommends two languages:

| Key | Recommended value | Reason |
| --- | --- | --- |
| `languages.main.name` | `Python` or `TypeScript` | both have mature test, typing and coverage tooling, both have a schema-first validation library that ADR-0005 can recommend (`pydantic`, `zod`), and coding agents write and review both reliably |

Between the two: **TypeScript** when the repository runs in a browser or
shares code between browser and server; **Python** for scripts, data work
and services that do neither. Neither is better in the abstract.

**Another language remains possible, and is justified here**, not
elsewhere. Write what the two recommended languages did not give you: a
single static binary, a runtime constraint, an ecosystem the repository
depends on. That justification is the only thing governance asks in return.

**None of this is checked by a tool.** The schema checks that a value is
written, never that it is in the list: refusing a language mechanically
would make impossible the very case this section allows. Review reads your
justification, not a command.

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
adr: ADR-0004
slug: languages
title: Languages
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  languages:
    main:
      name: TypeScript
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- An agent writes new code in the right language without inferring it.
- Validation (ADR-0005) and coverage (ADR-0007) recommendations apply
  directly to both recommended languages.

### Negative

- A repository with a good reason to use Go, Rust or another language has to
  write that reason down instead of just using it.
- Two recommended languages still leave a choice to make, and the reasons
  above only partly settle it.

### Neutral

- Secondary languages (shell scripts, SQL, configuration) are not declared
  here and do not change the answer.

## Alternatives Considered

### `Python`

Mature test and typing tooling, `pydantic` for validation, a large
ecosystem for scripts and data work.

### `TypeScript`

One language from browser to server, gradual typing, `zod` for validation.

### `Go`

One binary to deploy, fast compilation, simple concurrency. surdesrails
recommends it; governance does not, because its repositories rarely need a
static binary and one fewer language keeps the other recommendations
shorter. It remains a valid answer when justified.

### Another language

Possible, and justified in this file: what the recommended languages did not
give you.

### No main language

For a documentation, configuration or infrastructure repository. Rule
`rejected` then, and say what the repository holds instead.

## References

- Adapted from surdesrails [SDR-0004](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0004-languages.md), revision 1.
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.
- [ADR-0005](ADR-0005-validation.md) and [ADR-0007](ADR-0007-tests.md): validation and coverage, which depend on this answer.

**The key.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `languages.main.name` | the main language, as a person writes it | `Python`, `TypeScript`, or another one justified above |

**What this key does not cover:** no test runner, test command, coverage
threshold, lint command or tool. The coverage threshold is ADR-0007's;
commands are not carried by governance, which does not know what your
repository runs.

**An empty key is not an answer**: this one is required. The value is
written in this file and nowhere else; whoever needs it links here. See
ADR-0001 for the check command.
