---
adr: ADR-0002
slug: localization
title: Localization
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  localization:
    language:
      default:
      documentation:
      commits:
      code:
      comments:
---

# Localization

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

While these keys are empty, an agent writing in this repository does not
know which language to name a function in, which language to comment in,
or how to write a commit message. It guesses, and guesses differently each
time. Once the values are written, it reads and applies them without asking
you again.

The question exists because each medium has different readers.
Documentation is read by the people who use and maintain the repository; a
symbol by anyone who reads the code, including tools; a comment by whoever
rereads a function in six months; a commit message by whoever walks the
history in two years. "The same language everywhere" is an answer, but it
is one you choose, and `default` is where you say it.

## Decision

**What governance recommends, and why.** One default language, no
overrides:

| Key | Recommended value | Reason |
| --- | --- | --- |
| `default` | `english` | the repository may be read by anyone, and by agents and tools whose default language is English; one language means no rule to remember |

`documentation`, `commits`, `code` and `comments` are left empty: they take
`default`. **Only fill one of those four to depart from the default.**
Otherwise leave it empty, which keeps the decision readable at a glance.
Removing the key says the same thing, and both forms pass the check.

**This recommendation does not bind your repository.** It exists so there
is something to react to instead of a blank page: keep it, amend it or set
it aside. A team that works in French and writes for itself has good
reasons to answer `default: french` with `code: english`, which is what
surdesrails recommends.

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
adr: ADR-0002
slug: localization
title: Localization
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  localization:
    language:
      default: english
      documentation:
      commits:
      code:
      comments:
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- An agent never has to guess the language of a name, a comment, a commit
  or a page.
- Contributors who do not read French can read and contribute to
  everything.

### Negative

- A French-speaking maintainer writes their own notes and commit messages
  in a second language, which is slower and loses nuance.
- Domain terms that only exist in French (legal, administrative) need a
  translation or stay as untranslated words in English text.

### Neutral

- Changing the answer later means rewriting documentation, not code: the
  history keeps the old commit language either way.

## Alternatives Considered

### Everything in French

Documentation, commits, symbols and comments in French. Natural for a
French-speaking team writing for itself, but symbols in French read oddly
next to every library and API, and the repository closes itself to
non-French readers.

### French prose, English symbols

surdesrails' recommendation: `default: french`, `code: english`. A good fit
for a French-speaking team; governance does not recommend it because its
repositories are written for a wider audience, and two languages means one
more rule to apply.

### Another split

The four overrides are independent: nothing forces them to line up, for
example English code and comments with French documentation. Each extra
override is one more thing to remember.

## References

- Adapted from surdesrails [SDR-0002](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0002-localization.md), revision 1.
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `default` | the language of everything not overridden below | `french`, `english` |
| `documentation` | documentation, if it differs from the default | `french`, `english` |
| `commits` | commit messages, if they differ | `french`, `english` |
| `code` | symbols (functions, classes, variables), if they differ | `french`, `english` |
| `comments` | code comments, if they differ | `french`, `english` |

**Only `default` is required.** The other four are overrides: an empty or
removed key means "same as `default`", and that is an answer, not an
oversight. The value is written in this file and nowhere else; whoever needs
it links here.

**Checking.** The schema refuses an empty `default` and names it, and lets
an empty override pass. It does not see a removed `default`: an absent key
passes, and only review catches it. See ADR-0001 for the command.
