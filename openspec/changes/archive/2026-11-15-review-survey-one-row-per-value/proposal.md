## Why

Desk test run 9 (`research/desk-test-first-proposal/results.md`) met the restated AB-1 with no exception: no unseen value and no mislabel in the first group. What remained was form, in the second group and in the labels:
- two surveys gave several rows per ADR (25 rows for 16 and 15 ADRs), because the format asked for one row per ADR while an ADR can have several values not shown;
- 13 of 102 second-group rows listed a value that was shown (`none`) with no place for it to live;
- 3 citations had no label, and 2 used other words;
- one count was wrong (20 files given, 19 in the clone).

## What Changes

- The second group lists one row per value not shown, and none for the values that were shown. The group heading still counts ADRs.
- Each citation takes exactly one of the two labels, word for word. A citation drawn from history alone is `next to it`.
- A count appears only when a command the agent ran produced it, and the agent names the command.
- Nothing else in the prompts changes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `review`: the survey's second-group layout, the label wording, and the source of counts.

## Impact

- `src/review.ts` (`formatSequence`), `test/review.test.ts`, `docs/commands.md` (quoted sequence prompt).
- No change to exit codes, file formats or other prompts.
