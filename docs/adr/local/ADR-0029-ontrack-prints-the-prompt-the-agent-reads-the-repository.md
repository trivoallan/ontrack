---
adr: ADR-0029
slug: ontrack-prints-the-prompt-the-agent-reads-the-repository
title: ontrack prints the prompt, the agent reads the repository
status: accepted
date: 2026-11-26
authors: [Tristan Rivoallan]
supersedes: []
---

# ontrack prints the prompt, the agent reads the repository

## Status

Accepted

## Context

`ontrack review` hands work to a coding agent: rule a convention, rule it
again, supersede it. Its prompt is fixed text plus paths, titles and
references. Everything specific to a convention is in the ADR, and
everything specific to the repository is in the repository, which the agent
reads. This was never recorded as a decision, so nothing settled it.

`ontrack suggest` (change `add-suggest-command`) asks for more: an audit of
the decisions a repository holds and never recorded. ontrack could scan the
configuration and dependencies itself, or it could leave the reading to the
agent. Other commands that hand work to an agent will face the same choice.

## Decision

A command that hands judgement to a coding agent prints a prompt. It does
not inspect the repository's code, configuration, history or forge on the
agent's behalf. The prompt holds fixed text, plus the facts ontrack alone
holds cheaply: the ADRs under `docs/adr/`, their statuses and titles, and
what the tracks would import, as `plan` computes it. The command is
read-only and offline. The agent reads the repository, proposes, and writes
only once the user agrees.

## Consequences

### Positive

- ontrack stays independent of any ecosystem: it parses no build file,
  lockfile or forge API.
- A prompt is tested by its contract (steps, lists, exit code), not by
  heuristics on fixtures.
- The judgement stays where the evidence is read, and the user rules on it.

### Negative

- The quality of a prompt's result depends on the agent, and no test of
  ontrack measures it.
- An agent that cannot reach the forge gets less evidence. The prompt must
  say what to do then.

### Neutral

- A command that needs a fact ontrack alone holds cheaply adds it to the
  prompt, as `suggest` adds the ADRs to import.

## Alternatives Considered

- **Scan the repository in ontrack and print findings.** It is noisy,
  since configuration shows what is and not what was chosen. It ties
  ontrack to every ecosystem, and it duplicates what the agent reads better.
- **Call a model from ontrack.** That would need a network and a key, and it
  would break the offline contract of every command.

## References

- `src/review.ts`: the prompts this decision describes.
- [ADR-0005](ADR-0005-own-adrs-live-in-docs-adr-local.md): where the ADRs
  the prompts write go.
