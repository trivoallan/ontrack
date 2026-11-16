## Why

Desk test run 7 (`research/desk-test-first-proposal/results.md`) measured the citation rule. Values not visible in the first group fell to 3 in 59. But all three were unstated, and each rested on a true citation that does not show the value:
- no host settings file, offered for which agents contributors use;
- a `renovate.json` with no automerge key, whose external preset sets it;
- a changelog script, where each release also needs a blog post.

The citations made the wrong placements look grounded.

## What Changes

- A citation counts for the first group only when it shows the value itself. One that shows only something next to the value, from which the agent would infer it, does not count.
- For each citation, in either group, the survey says whether it shows the value itself or only something next to it.
- Nothing else in the prompts changes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `review`: survey citations must show the value itself, and each is labelled as showing the value or something next to it.

## Impact

- `src/review.ts` (`formatSequence`), `test/review.test.ts`, `docs/commands.md` (quoted sequence prompt).
- No change to exit codes, file formats or other prompts.
