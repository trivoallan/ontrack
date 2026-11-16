## Why

The survey's first group should hold only the conventions the repository answers by what it holds. Desk test runs 11 to 14 (`research/desk-test-first-proposal/results.md`) showed two defects of the current wording, each reproduced across runs:
- an absence was accepted as proof even for things that leave no trace in the repository (a dependency-update app, the provenance a registry records), which put doubtful conventions first;
- the main language was left to a discussion in 9 of 15 surveys, although the file tree shows it, because the rule asked a citation to state the value itself.

## What Changes

- An absence counts as a citation only when the thing, if it existed, would have to leave a file or a configuration in the repository, and none is there. It does not count for a thing that could exist without leaving a trace there; an ADR resting on such an absence goes to the second group.
- A value read from the file tree also shows the value: the main language, counted from the source files listed by `git ls-files`.
- Nothing else in the prompts changes. A paragraph asking to look in the history before writing `none` was tried (run 14) and is not part of this change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `review`: the survey's absence rule and what shows a value.

## Impact

- `src/review.ts` (`formatSequence`), `test/review.test.ts`, `docs/commands.md` (quoted sequence prompt).
- No change to exit codes, file formats or other prompts.
