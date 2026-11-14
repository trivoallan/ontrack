---
adr: ADR-0007
slug: tests
title: Tests
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  tests:
    coverage_target:
---

# Tests

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
know what coverage to hold. So it aims for none, and ships code tested
according to whatever seemed useful at the time. Once the value is written,
it knows what it must reach before opening its pull request.

governance already requires **test-driven development** and **three fixed
bounds** on what "coverage" means. What is left to you is the **number**,
because it depends on what this repository does and on what you are willing
to defend in review.

## Decision

**What governance recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `tests.coverage_target` | `90` | high enough that untested code stands out, and the three bounds below make it reachable without gaming it |

**The three bounds are not up for ruling**, and they are what makes the
number comparable from one repository to the next:

1. **unit tests only**: an integration harness does not count;
2. **hand-written code**: excluding tests, generated output and templates;
3. **line coverage**.

**This recommendation does not bind your repository.** A repository that
aims higher says so; a repository that aims lower says so too, and writes
why. What is not an answer is a number nobody holds.

**The threshold applies to the main language**, the one
[ADR-0004](ADR-0004-languages.md) declares. A repository with several
languages declares the others in this ADR's body, with their tool. The key
carries only one, because an agent only needs that one to know where it
stands.

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
adr: ADR-0007
slug: tests
title: Tests
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  tests:
    coverage_target: 90
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- An agent has a number to reach before it proposes a change, instead of
  testing at random.
- The bounds make the number mean the same thing in every repository that
  rules on this ADR.

### Negative

- Reaching 90 % on hand-written code takes real test-writing time,
  especially on code that touches I/O.
- A coverage number says nothing about the quality of the assertions;
  review still has to read the tests.

### Neutral

- The runner, the test command and the coverage tool are not declared here:
  they belong to the repository.

## Alternatives Considered

### A numeric threshold

The one you hold and can defend. Recommended, at `90`.

### `none`

For a language with no coverage tool, or a repository where the measure
would teach nothing. **It is an answer**, and it is justified in this file
like any other.

## References

- Adapted from surdesrails [SDR-0007](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0007-tests.md), revision 1.
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.
- [ADR-0004](ADR-0004-languages.md): the main language the threshold applies to.

**The key.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `tests.coverage_target` | the coverage threshold of the main language, as a percentage | a number, or `none` |

**What this key does not cover:** no runner, test command, expected output
or coverage tool. governance does not carry them: it does not know what your
repository runs.

**An empty key is not an answer**: this one is required, and `none` is an
answer where empty is not. **On this point the check does not protect
you.** It can refuse a value outside a closed set, but here the value is a
number or the word `none`, and no type covers both, so **an empty key
passes**. Review catches it, and it is better to know that than to find out.
The value is written in this file and nowhere else; whoever needs it links
here. See ADR-0001 for the check command.
