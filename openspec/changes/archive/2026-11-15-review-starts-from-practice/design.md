## Context

`ontrack review` prints a fixed prompt; the `STEPS` constant in
`src/review.ts` holds the seven steps shared by the named and the sequence
forms. `docs/commands.md` copies both forms verbatim, and a test checks the
copies match.

## Goals / Non-Goals

**Goals:**
- A proposal describes the repository's practice, including where it has
  none, before it compares with the track.

**Non-Goals:**
- Marking each proposed value as observed or absent. The second desk-test
  run shows the agent now sees the absence and sometimes proposes adopting
  the recommendation anyway (`forge.audit`). Marking that is a separate
  change.
- The prompt to rule a revised ADR again.

## Decisions

**Change one step, keep the others.** Steps 3 to 7 already ask for evidence
per key and for every departure with its reason. Only the starting point was
wrong. The new step 2 keeps the comparison with the recommendation, after the
description, so departures are still named.

**Name the cross-ADR leak in the same step.** "Not as the other `proposed`
ADRs would make it" addresses the agent counting tools that undecided ADRs
recommend. The tested wording carried both clauses, so it ships as tested.
