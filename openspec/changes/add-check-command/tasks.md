# Tasks

## 1. Contract first

- [x] 1.1 Add an "`ontrack check` output contract" section to the README, covering which ADRs carry a check, the `check:` key and how its value is read (comment and quotes), how commands run, the three statuses, the output format with an example, exit codes `0`/`2`/`1`, and the note that a command runs only once committed under `docs/adr/`. List `npx ontrack check` under Usage and reword the `2` row of the exit code table. Check that the example matches the "One of each" scenario.

## 2. Reading the check

- [x] 2.1 In `src/instructions.mjs`, have `readAdr()` return `check` (the `check:` value, or `null`) for `accepted` ADRs; check in `test/instructions.test.mjs` that existing tests still pass and that `ontrack instructions` output is unchanged by a `check:` line.
- [x] 2.2 In new `src/check.mjs`, list the ADRs to report per the "ADRs carrying a check" and "Unchecked decisions" requirements, reusing `buildInstructions()`; check every scenario of those requirements in new `test/check.test.mjs`.

## 3. Running and reporting

- [x] 3.1 Run each command per the "Running the commands" requirement with `spawnSync` and `shell: true`; check its five scenarios with real shell commands.
- [x] 3.2 Format the result per the "Output format" requirement; check both scenarios and compare the first to the README example byte for byte.

## 4. Command

- [x] 4.1 Add `src/commands/check.mjs` returning `2` on a failed check and `0` otherwise, and register it in `src/cli.mjs`; check the "Exit code" scenarios, the "Two decided ADRs, one key" scenario (exit `1`, empty stdout, marker file absent), and in `test/cli.test.mjs` that `--help` lists `check`.

## 5. Verification

- [x] 5.1 In this repository, add `check: "true"` to a scratch copy of an accepted ADR in a temporary project, then `check: exit 1`, run `npx ontrack check` each time, and confirm the `pass` line with exit `0`, then the `fail` block with exit `2`.
- [x] 5.2 Run `npm test` and check that coverage stays at or above 95% on lines, branches and functions, then run `openspec validate add-check-command --strict`.
