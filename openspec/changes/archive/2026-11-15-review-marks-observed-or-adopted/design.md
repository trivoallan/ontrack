## Context

The `STEPS` constant in `src/review.ts` holds the seven steps of the review
prompt, in both its forms. `docs/commands.md` copies both forms verbatim,
and a test keeps the copies in sync. The prompt to rule a revised ADR again
already marks each value "kept or changed".

## Goals / Non-Goals

**Goals:**
- The user sees, before agreeing, which proposed values describe the
  repository and which would change it.

**Non-Goals:**
- Writing the mark into the ADR's frontmatter or into `AGENTS.md`. That
  would be a schema change for every track, and the values marked
  `adopted` are already the rulings the tracking-items paragraph lists as
  "not followed yet".
- Re-running the desk test. The mark changes what the proposal shows, not
  which value the agent finds.

## Decisions

**Two marks, named for the user, not the track.** `observed` and `adopted`
describe the repository's side: does it do this today or not? A value equal
to the recommendation can be either. "Kept" or "recommended" would describe
the track's side and miss the case the desk test found: a value that
departs from the recommendation is not necessarily observed.

**The mark goes in steps 4 and 6.** Step 4 is where the value is chosen,
step 6 is where the user reads it. Step 7 (writing the ADR) is unchanged.
