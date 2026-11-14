# Tasks

## 1. Contract first

- [x] 1.1 In the README, add the `check` category to the "`ontrack plan` output contract" section (counts order, the `-`/`+` lines, an example), add `synced` to "`ontrack apply`" (what it does, that it needs no flag, the one exception to "never touches an ADR you already decided on"), and reword the trust note of the "`ontrack check` output contract" to say a source update can change the command at the next `apply`. Check that the examples match the "Check changed upstream" and "Only a check to synchronize" scenarios.

## 2. Reading and writing the line

- [x] 2.1 In `src/revision.mjs`, add `readCheckLine(text)` (first column-zero `check:` line of the recognized frontmatter, trailing whitespace removed, or null) and `setCheckLine(text, line)` (replace, insert after `revision:`, or remove when `line` is null, keeping the file's line endings); check in `test/revision.test.mjs` the replaced, inserted, removed, CRLF and body-example cases, and that every other line is byte-identical.

## 3. plan

- [x] 3.1 In `src/plan.mjs`, classify an up-to-date ADR as `check` when its check line differs from the source's, storing both lines, and add `check` to the counts order; check every scenario of the "Classification" requirement in `test/plan.test.mjs`.
- [x] 3.2 Print the `-`/`+` lines after a `check` ADR's line in `formatPlan()`; check the three new "Output format" scenarios and the "Check only" exit code scenario, and that existing plan tests still pass.

## 4. apply

- [x] 4.1 In `src/apply.mjs`, emit a `synced` action for each `check` ADR, run it after `moved` and `confirmed`, and print it with its `-`/`+` lines; check every scenario of "Synchronizing checks" in `test/apply.test.mjs`, including the flat-layout copy.
- [x] 4.2 Check the "Revised ADR does not get the new check", "Only a check to synchronize" and "Dry run of a synchronization" scenarios, and that a second `apply` after a synchronization writes nothing and exits `0`.

## 5. Verification

- [x] 5.1 In a temporary project with a fake source, rule an ADR (`accepted`, traits filled), add a `check:` line to the source's copy, run `npx ontrack plan` (expect `check`, exit `2`), `npx ontrack apply` (expect `synced`, exit `0`), `git diff` (expect one added line), then `npx ontrack check` (expect the command to run).
- [x] 5.2 Run `npm test` and check that coverage stays at or above 95% on lines, branches and functions, then run `openspec validate sync-check-line --strict`.
