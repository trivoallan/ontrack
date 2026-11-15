# Proposal

Issue served: none

## Why

Since step 2 starts from what the repository does today, the agent sees
where a repository does nothing on a question. It still sometimes proposes
the recommendation as the decision to take: in the second desk-test run
(`research/desk-test-first-proposal/results.md`), it said nothing audits
the workflows and proposed `forge.audit: zizmor` in 8 of 8 such
repositories. That can be the right ruling. But the proposal does not say
which values describe the repository and which would change it, so the
user cannot tell their practice from the track's answer, and agrees to
both the same way.

## What Changes

- Step 4 of the review prompt tells the agent to mark every proposed value
  `observed`, when the repository does it today, or `absent`, when it does
  not and the ruling would make it do so.
- Step 6 presents each trait line with its value, its mark and its
  evidence.
- The wording follows the prompt to rule a revised ADR again, which already
  marks each value "kept or changed".

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `review`: steps 4 and 6 of the review prompt, in both forms.

## Impact

- `src/review.ts`: the `STEPS` constant.
- `test/review.test.ts`: an assertion on steps 4 and 6.
- `docs/commands.md`: the two verbatim copies of the steps.
- Not changed: the ADR file and `AGENTS.md`. The mark lives in the
  proposal the user agrees to, not in the ruling.
