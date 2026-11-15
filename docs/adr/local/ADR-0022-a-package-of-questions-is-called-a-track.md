---
adr: ADR-0022
slug: a-package-of-questions-is-called-a-track
title: A package of questions is called a track
status: accepted
date: 2026-11-15
authors: [Tristan Rivoallan]
supersedes: []
---

# A package of questions is called a track

## Status

Accepted

## Context

ontrack imports ADRs from npm packages. Each such package ships a set of
questions with a recommended answer, is installed under an alias, and is
revised over time. Until now ontrack called it a "source".

"Source" says where the questions come from and nothing more. In a tool
that lives in repositories it also reads as "source code" or "data source".
And the product's own name, ontrack, had no counterpart in its vocabulary:
nothing said what a repository is on.

The word is the one a newcomer meets first: in the tutorial, in the first
line `plan` prints, in the keyword authors publish under. It is written in
about three hundred places, so its choice is made once.

## Decision

The package of questions a repository installs is called a **track**.

- A repository installs one or several tracks, each under an alias: "the
  `platform` track".
- A repository that has ruled on every question of its tracks, at their
  current revision, is on track.
- A published track carries the npm keyword `ontrack-tracks`.

The railway image stops at this word. A question stays a question, a ruling
a ruling, a revision a revision. No other term is drawn from the metaphor.

ADRs ruled before this one, in `docs/adr/local/` and in the imported
directories, keep the word "source": their text is not edited.

## Consequences

### Positive

- The product name means something literal: on track, behind a track.
- The word no longer reads as source code.
- "track" was unused as a noun in the code and the documentation, so the
  rename introduces no ambiguity there.

### Negative

- Output and error text change, so a script that matches them breaks once.
- Authors of published packages add a keyword.
- Earlier ADRs, the changelog and articles written before this decision
  say "source"; a reader has to be told once that it is the same thing.
- "Track" is also a verb. The documentation must not say that ontrack
  "tracks" something.

### Neutral

- No file a repository holds changes: the `ontrack` key, the ADR
  frontmatter and the rules block never carried the word.
- A track does not constrain as a rail does: a repository may reject a
  recommendation, and that is a full answer. The word is kept for what it
  says about drift, not about obligation.

## Alternatives Considered

- **Keep "source".** Accurate and free to keep, but generic, and silent on
  what the product name means.
- **"question set".** The most literal name. Two words, a clumsy keyword,
  and sentences such as "the question set revises the question".
- **"upstream".** Exact for the relationship, familiar from git. As
  generic as "source", and it suggests that changes flow back.
- **"rails".** Stays in the metaphor, but `ontrack-rails` reads as an
  integration for Ruby on Rails, the word has no natural singular, and
  rails cannot be left.
- **"line".** Reads well with an alias, but `line` and `lines` already
  mean lines of text throughout the code.
- **Extend the metaphor to every term** (switches for questions, signals
  for checks). A vocabulary a newcomer must translate before reading.

## References

- OpenSpec change `rename-source-to-track`.
- [Own ADRs live in docs/adr/local](ADR-0005-own-adrs-live-in-docs-adr-local.md),
  which says "source" and is left as written.
