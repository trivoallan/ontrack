## Context

`review` prints prompts for the ADRs that tracks ship (`src/review.ts`). Its
supersession prompt already tells an agent how to write a new ADR in
`docs/adr/local/`: the numbering, the format the repository's rules
prescribe, the user's agreement first, then `apply`. Nothing covers a
decision that the repository made without a track and without an OpenSpec
change. That happens most often in a repository adopting ontrack, which
holds years of such decisions.

The ADRs in force that bear on this design:
- `engineering/ADR-0003-architecture`: a monolith. The command is one more
  module in the same package.
- `engineering/ADR-0005-validation`: the document is a zod model, and its
  JSON schema is derived from it.
- `engineering/ADR-0007-tests`: 95 % coverage.
- `engineering/ADR-0016-changes`: the `spec-driven-with-adr` schema, which
  covers decisions made from now on. This is why `suggest` covers only
  decisions already made.
- `local/ADR-0005-own-adrs-live-in-docs-adr-local`: where the new ADRs go.

## Goals / Non-Goals

**Goals:**
- One prompt, printed by a read-only command, that has an agent find the
  repository's decisions it never recorded, and record the ones the user
  agrees to.

**Non-Goals:**
- Detecting anything in ontrack itself: no file scanning, no heuristics, no
  forge API.
- Running on each diff or pull request.
- Writing an ADR the user already has in mind, without an audit.

## Decisions

**A command of its own, not a mode of `review`.** `review` has one subject:
the ADRs that await a ruling. It chooses the prompt from the state of
`docs/adr/` and exits `0` when nothing is left. An audit has no such state:
it always has something to do. Merging the two would give `review` a flag
that changes what it is about. *Alternative:* `review --audit`. Rejected,
because `kind: none` and exit `0` would no longer mean "nothing to rule".

**The agent reads the repository; ontrack prints fixed text.** This is the
principle `review` follows: everything specific to a repository is in the
repository, which the agent reads. ontrack adds only what an agent cannot
cheaply know, namely the ADRs the repository holds and the ADRs its tracks
would import, so that the agent drops candidates already covered.
*Alternative:* scanning the configuration in ontrack. Rejected. It is noisy,
it duplicates what the agent does better, and it ties ontrack to every
ecosystem.

**Sources ranked by weight, and a filter on alternatives.** The order
(repeated review comments, reversals in the history, rules written by hand
without an ADR, then configuration) puts evidence of a choice first.
Configuration shows what is, not what was chosen. The filter "a credible
alternative exists" and the limit of five keep ADRs from multiplying. A
user can run the command again for the next five.

**ADRs to import count as covered.** A decision that a track's ADR would
cover belongs to the track. The prompt sends it to `review` rather than to a
local ADR, which would duplicate the track.

**Exit `2`, always.** The exit codes say `2` means "changes pending". The
command always prints a prompt to follow, like `review` when it has one. A
CI job has no reason to run it.

**The new ADR is `accepted`, with `supersedes: []`.** It records what the
repository already does, and the user agreed to each one. Its format comes
from the repository's rules, as in the supersession prompt. The wording on
numbering is shared with that prompt rather than restated, so the two
cannot drift apart.

## Risks / Trade-offs

- [An agent invents a decision from an accident, such as a leftover config
  file] → The prompt requires evidence of a choice and a credible
  alternative, and it writes nothing without the user's agreement.
- [The forge is not reachable, so there are no review comments] → The
  prompt says so in one line and goes on with the other sources.
- [The prompt cannot be tested for what the agent finds] → The tests check
  the text's contract (steps, lists, exit code, read-only). The audit's
  quality is judged by running it on this repository.

## Open Questions

- None that revisits an ADR in force.
