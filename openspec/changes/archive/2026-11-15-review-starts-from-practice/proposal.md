# Proposal

Issue served: none

## Why

Step 2 of the review prompt tells the agent to start from the track's
recommendation and look for evidence that it does not apply. A missing tool
is not that kind of evidence, so where a repository does nothing on a
question, the agent proposes the track's answer as if it were the
repository's. In a desk test on 10 public repositories
(`research/desk-test-first-proposal/results.md`), 11 of 42 values that
depart from the recommendation were kept "for lack of evidence", all wrong,
and the agent proposed tools that other, still-`proposed` ADRs would add.

## What Changes

- Step 2 of the review prompt now tells the agent to start from what the
  repository does today (files, configuration, CI, history), to say so where
  it does nothing because an absence is evidence too, to describe the
  repository as it is and not as other `proposed` ADRs would make it, and
  only then to compare with the recommendation and name every difference.
- The same desk test with this wording: departing values found went from 19
  to 25 of 42, values kept for lack of evidence from 11 to 1, with no loss on
  values that equal the recommendation.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `review`: step 2 of the review prompt, in both forms.

## Impact

- `src/review.ts`: the `STEPS` constant.
- `test/review.test.ts`: an assertion on step 2.
- `docs/commands.md`: the two verbatim copies of the steps.
- Not changed: step 4 of the prompt to rule a revised ADR again, which has
  the same anchoring. It was not tested, so it stays as it is.
