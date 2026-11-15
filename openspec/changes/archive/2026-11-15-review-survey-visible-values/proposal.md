## Why

Desk test run 5 (`research/desk-test-first-proposal/results.md`) ran the history-first survey on five repositories it had never seen. 7 of 56 first-group rows held a value the clone can't show, two of them unstated. axios had 2 and undici 3, so the restated AB-1 (at most one per repository, `research/prd-backlog-reveal.md`) failed. Every failure was one of two kinds:
- a scope list read from past commits, with no file closing it (4);
- a value the forge holds, such as the merge gate, required approvals or trusted publishing (3).

## What Changes

- The survey step of the sequence prompt defines the first group precisely: every value the ADR asks for is written in a file of the repository or set in its configuration.
- An ADR goes to the second group when any of its values is held outside the repository (a branch ruleset, a forge or registry setting, an external preset), or would be drawn from history alone (a scope list read from past commits). The agent names that value and where it lives.
- Nothing else in the prompts changes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `review`: the survey's first group excludes ADRs with a value held outside the repository or drawn from history alone.

## Impact

- `src/review.ts` (`formatSequence`), `test/review.test.ts`, `docs/commands.md` (quoted sequence prompt).
- No change to exit codes, file formats or other prompts.
