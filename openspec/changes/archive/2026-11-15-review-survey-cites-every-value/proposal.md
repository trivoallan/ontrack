## Why

Desk test run 6 (`research/desk-test-first-proposal/results.md`) measured the survey after `review-survey-visible-values`. The two kinds of failure its examples named were gone: scope lists read from history, and settings the forge holds. But 5 of 65 first-group rows still held a value the clone can't show, 4 of them unstated: secret storage, a Dependabot setting, a people policy, an agent's identity. None of these was among the examples. The examples steer what the agent checks, so adding more would chase the next kind.

## What Changes

- The survey's first group is defined by a citation rule instead of examples. An ADR goes there only when the agent can cite, for every value it asks for, the file, the configuration or the command output in the repository that shows it.
- Every other ADR goes to the second group, including one where a single value is held outside the repository, inferred, or drawn from history alone. The agent names that value and where it lives, or says it doesn't know.
- The first group is presented with the citation for every value.
- Nothing else in the prompts changes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `review`: the survey's first group requires a citation for every value; the examples are removed.

## Impact

- `src/review.ts` (`formatSequence`), `test/review.test.ts`, `docs/commands.md` (quoted sequence prompt).
- No change to exit codes, file formats or other prompts.
