# Proposal

Issue served: none

## Why

Three gaps remain in the review prompt after the desk test
(`research/desk-test-first-proposal/results.md`):

- The marks have no case for evidence the agent cannot see. In both runs,
  10 of 10 agents said they could not read the branch ruleset and still
  proposed `forge.gate: blocking`. With only `observed` and `absent`, such a
  value gets a mark it has not earned.
- Step 6 says what the proposal holds but not its shape, so each agent
  lays it out its own way.
- The tracking-items text is one paragraph of about 200 words with five
  separate instructions, and it says "Once every ADR is ruled" in a prompt
  that may name a single ADR.

## What Changes

- Step 4: when the agent cannot tell from what it can read, for example a
  setting held outside the repository, it marks the value neither way, says
  what it could not see and where it lives, and asks the user.
- Step 6: one line per trait key, in the form
  `trait.key: value (observed|absent): evidence`.
- The tracking-items text opens with "Once every ADR in this review is
  ruled" and gives its instructions as a list, one per line, in the order
  the agent carries them out. Every instruction and prohibition is kept. The
  list uses `-` bullets so it does not read as steps 8 onwards.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `review`: steps 4 and 6 of the review prompt, and the tracking-items
  text shared by the review, supersession and revised prompts.

## Impact

- `src/review.ts`: the `STEPS` and `TRACKING` constants.
- `test/review.test.ts`: assertions on steps 4 and 6 and on the tracking
  text.
- `docs/commands.md`: the two copies of the steps and the five copies of
  the tracking text.
