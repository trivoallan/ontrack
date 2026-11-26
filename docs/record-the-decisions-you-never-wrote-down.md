---
title: Record the decisions you never wrote down
description: Have a coding agent find the decisions your repository took without a track, and record the ones you agree to as ADRs that reach AGENTS.md.
---

This guide shows how to record the decisions a repository already follows
but never wrote down, such as a test runner chosen over another, or a rule
a maintainer repeats in every review. No track ships them, so `review`
never asks about them, and a coding agent can break them without knowing.

You do this once, when the repository adopts ontrack. From then on, a
decision is recorded by the change that takes it.

It needs a version of ontrack later than 0.6.0, and a coding agent that
takes a prompt. The examples use Claude Code.

## 1. Rule the track's conventions first

```bash
claude "$(npx ontrack review)"
```

Rule what your tracks ship before you look for your own decisions. A
decision that a track's ADR covers belongs to the track: the audit drops it,
or sends it back to `review` while that ADR is still `proposed`. The fewer
open conventions there are, the less it has to set aside.

You do not have to rule every convention first. The audit lists those still
open and does not propose them again.

## 2. Run the audit

```bash
claude "$(npx ontrack suggest)"
```

`suggest` prints the prompt and exits with `2`: there is always a prompt to
follow. It writes nothing itself. It gives the agent what only ontrack
knows, namely the ADRs the repository holds and those its tracks would
import. The agent then reads the repository, the weightiest evidence first:

1. review comments a maintainer repeats on pull requests;
2. reversals in the git history, where a dependency, a tool or a pattern was replaced by another;
3. rules written by hand in `AGENTS.md` or `CLAUDE.md` that no ADR backs;
4. design notes and change proposals, archived ones included;
5. configuration and dependencies.

## 3. Read the candidates

The agent proposes at most five candidates, the weightiest first. For
example:

```
Tests run on Node's built-in runner
  → docs/adr/local/ADR-0030-tests-run-on-nodes-built-in-runner.md
  Decision: tests run with `node --test`, with Node's own coverage
    thresholds, and no test framework as a dependency.
  Rules out: Vitest or Jest, with c8 or istanbul for coverage.
  Traits:
    testing:
      runner: node-test
  Check: npm pkg get scripts.test | grep -q 'node --test'
  Evidence: package.json:40, the design of migrate-to-typescript (lines 18-20)
```

For each one, ask yourself three questions before you agree:

- **Was it chosen?** The evidence shows a choice, such as a reversal, a
  review that corrects it, or a design that argues it. Configuration alone
  shows what is, not what was decided. A file left over from a template is
  not a decision.
- **Could someone take the alternative?** If no agent or newcomer would ever
  do otherwise, the ADR protects nothing.
- **Do the traits say it?** Only the traits reach `AGENTS.md`. They sit
  under a top-level key that no ADR in force uses, so that two ADRs never
  decide the same key.

The agent has already dropped what an ADR covers. When it finds nothing
worth recording, it says so and stops: that is a valid outcome.

## 4. Agree, or not

The agent asks which candidates to record and writes nothing until you
answer. You can take all of them, some of them, or none, and you can ask
for a change first, to a trait, to the check, or to the title.

For each one you agree to, the agent writes an ADR in `docs/adr/local/`:

- its status is `accepted` and its `supersedes:` is empty;
- its context comes from the evidence;
- its number follows the highest number ever used in that directory, deleted
  ADRs included, so a number is never reused.

It writes them in the format your repository's own rules on recording
decisions prescribe. Then it runs `npx ontrack apply`, which adds their
traits to `AGENTS.md`.

## 5. Check, then commit

```bash
npx ontrack check
```

`check` runs the check command of each decided ADR, including those you
just recorded. Read the new section of `AGENTS.md`, then commit the ADRs
and `AGENTS.md` together.

## Run it again

The audit keeps five candidates at most. Run `suggest` again for the next
ones: the ADRs you just recorded now cover the first.

## Related

- [`ontrack suggest`](commands.md#ontrack-suggest) gives the full prompt and
  its contract.
- [How it works](how-it-works.md#the-decisions-no-track-ships) says where
  these decisions fit in the life of a repository.
- To change one of these decisions later, supersede it with
  `npx ontrack review <its reference>`.
