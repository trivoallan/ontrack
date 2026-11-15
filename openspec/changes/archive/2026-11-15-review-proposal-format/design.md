## Context

`STEPS` in `src/review.ts` holds the seven steps of the review prompt.
`TRACKING` closes the review, supersession and revised prompts with the same
text. `docs/commands.md` copies every prompt form verbatim and a test keeps
the copies in sync.

## Goals / Non-Goals

**Goals:**
- A value the agent cannot see reaches the user as a question, not as a
  marked value.
- Every proposal has the same shape.
- The tracking instructions read in the order they are carried out.

**Non-Goals:**
- A third mark word. "Do not mark it" says the same thing without adding
  vocabulary.
- Re-running the desk test. These changes affect the shape of the proposal
  and one case the desk test did not score (`forge.gate`).

## Decisions

**No mark for unseen evidence.** The agent says what it could not see and
where it lives, and asks for the value. The user can then supply it, or
agree to the recommendation knowingly.

**A fixed line, mark in parentheses.** `trait.key: value (observed|absent):
evidence` is short enough to scan and puts the mark next to the value it
qualifies.

**Bullets, not numbers, for the tracking list.** The prompt already has
steps 1 to 7, and the tests count them. A second numbered list would read as
steps 8 onwards.

**"in this review".** The same text closes the single and the sequence
forms, and the supersession and revised prompts. "Every ADR in this review"
holds for all of them.
