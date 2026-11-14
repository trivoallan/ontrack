## 1. Read the verdict

- [x] 1.1 Add `status` to the `adrFrontmatter` model in `src/schemas.ts`: trimmed, trailing ` # comment` removed, non-empty
- [x] 1.2 Add `readStatus(text)` to `src/revision.ts`: the first column-zero `status:` value of a recognized frontmatter, null otherwise
- [x] 1.3 Test `readStatus` in `test/revision.test.ts`: plain value, trailing comment, no `status:` line, empty value, unreadable frontmatter, `status:` in the body only

## 2. Carry it in the plan

- [x] 2.1 Add an optional `status: string | null` to `PlannedAdr` in `src/plan.ts`, left out when there is no local copy
- [x] 2.2 Fill it in `planSource` from the local copy for every category that has one (`removed` included); absent for `new`
- [x] 2.3 Test in `test/plan.test.ts` that the verdict is the local copy's when the source ships another status

## 3. Print the full listing

- [x] 3.1 Give `formatPlan` an `{ all }` option: no skipping of `unchanged`, and the 10-character verdict column (`-` when null) on every ADR line, without trailing spaces
- [x] 3.2 Declare `--all` (boolean, default false) in the builder of `src/commands/plan.ts` and pass it to `formatPlan`
- [x] 3.3 Test the scenarios of the `Full listing` and `Verdict of an ADR` requirements, one test each
- [x] 3.4 Test that the output without `--all` is unchanged, and that the exit code is the same with and without it (0 and 2)

## 4. Document and verify

- [x] 4.1 Document `--all` in `docs/commands.md`: the option under `ontrack plan`, the line format and the `-` verdict in the output contract
- [x] 4.2 Run the test suite with coverage, the type check and the linter; coverage stays at or above 95 %
- [x] 4.3 Run `ontrack plan --all` in this repository: 21 lines, `ADR-0013-frontend` shown as `rejected`
