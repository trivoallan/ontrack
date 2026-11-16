---
adr: ADR-0027
slug: a-track-ships-conventions
title: A track ships conventions
status: accepted
date: 2026-11-16
authors: [Tristan Rivoallan]
supersedes: [ADR-0022-a-package-of-questions-is-called-a-track]
---

# A track ships conventions

## Status

Accepted

## Context

[ADR-0022](ADR-0022-a-package-of-questions-is-called-a-track.md) named the
package a repository installs a track, and kept every other term: "a
question stays a question, a ruling a ruling".

Since then the vocabulary has been read end to end, and it holds three sets
of words for one cycle. A track ships a "question" that a repository
"answers". A person "rules" on it, and the result is a "ruling" or a
"verdict". The file says `proposed`, `accepted` or `rejected`, and holds a
"decision". The sets do not fit: a question is not accepted, and the
sentence "`rejected` is a full answer" exists only to join two of them.

Two more things were found. A reader arrives with the word of the home
page, "conventions", and must trade it for "question" on the next page.
And "rule", the verb, sits next to "rules", the noun for what coding agents
read, in the same sentences.

ontrack has one user. The words can change in what the commands print with
nothing to migrate, which will not be true for long.

## Decision

There is one word per level.

- The package of ADRs a repository installs is a **track**, as ADR-0022
  decided. A repository installs one or several, each under an alias, and
  one that has ruled on everything its tracks ship, at their current
  revision, is on track. A published track carries the npm keyword
  `ontrack-tracks`. The railway image stops at this word.
- What a track ships is a **convention**: an ADR with a recommendation,
  `proposed` until the repository rules. Its traits are the parameters it
  leaves to the repository. "Question" is no longer a term.
- What a repository does with a convention is a **ruling**: it rules on
  it, and holds its ruling. "Answer" and "verdict" are no longer terms.
  The value of `status:` is called the status.
- An ADR a repository writes for itself, in `docs/adr/local/`, is a
  **decision**. It is never called a convention.
- What coding agents read is **instructions**: the instructions block of
  `AGENTS.md`, under the heading `## Project instructions (ontrack)`,
  printed by `ontrack instructions`. "Rules" is no longer a term.

That a convention is proposed and not imposed is said in one section of
the documentation, which may compare it to a question put to the
repository. The words keep their everyday senses elsewhere: a question
asked of a user, Conventional Commits, the rules an ADR prescribes.

ADRs ruled before this one, in `docs/adr/local/` and in the imported
directories, keep their words: their text is not edited.

## Consequences

### Positive

- The words of the documentation are the words of the file: a convention
  is proposed, accepted or rejected.
- A reader keeps the word of the home page through every page.
- The verb "rule" no longer meets a noun of the same spelling.
- The command `ontrack instructions` and what it prints share a name.

### Negative

- "Question" said in one word that the repository decides. A sentence has
  to say it now, and the home page has to be read again for it.
- "Convention" is an everyday word, and "Conventional Commits" is a
  convention a track may recommend.
- The heading of the block and three printed lines change, so a script
  that matches them breaks once, and `plan` reports every block out of
  date until `apply` runs.
- Imported ADRs, earlier ADRs, the changelog and what was written before
  say "question"; a reader has to be told once that it is the same thing.

### Neutral

- No command, file format key or category of `plan` is renamed.
- A track's own ADRs say "question" until their track is released again.

## Alternatives Considered

- **Keep "question".** It carries the idea, and costs a second metaphor
  next to the statuses of the file.
- **"Proposal".** Exact for the status `proposed`. OpenSpec already calls
  a proposal the first file of a change, in this repository and in the
  ones that use the shared workflows.
- **"Recommendation".** Names one part of the ADR. A repository does not
  rule on a recommendation: it follows it or not.
- **Keep "rules" and change the verb.** "Rule" and "ruling" are in every
  prompt, and "decide" is taken by the repository's own decisions.
- **Keep "answer" beside "ruling".** Two words for one thing was the
  problem.

## References

- OpenSpec change `rename-question-to-convention`.
- [A package of questions is called a track](ADR-0022-a-package-of-questions-is-called-a-track.md),
  superseded, which says "question" and is left as written.
