## Why

Desk test run 8 (`research/desk-test-first-proposal/results.md`) met the restated AB-1 threshold for the first time, but the survey was one 200-word paragraph with five chained instructions and no output format. Run 8 showed the cost:
- two citations mislabelled as showing the value (a document describing a manual publish, for the build level);
- labels given in one sentence for a whole table;
- 15 of 85 second-group rows that no longer said where the value lives.

Group headings in runs 6 and 7 also gave wrong counts.

## What Changes

- The survey states its purpose: what the user can check comes first.
- The agent goes value by value (every key under `traits:`).
- Each citation is labelled `shows the value` or `next to it`, with one example of each, taken from runs 7 and 8.
- A rule for absences: an absence counts only when it is the value.
- Two explicit prohibitions: no first-group ADR on a `next to it` citation, and no second-group value without where it lives or "unknown".
- A fixed layout: a heading per group with its count, one row per value in the first group, one row per ADR in the second.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `review`: the survey instruction is restructured, with labelled citations, an absence rule, explicit prohibitions and a fixed layout.

## Impact

- `src/review.ts` (`formatSequence`), `test/review.test.ts`, `docs/commands.md` (quoted sequence prompt).
- No change to exit codes, file formats or other prompts.
