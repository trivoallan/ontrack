## 1. Contract first

- [ ] 1.1 In `docs/commands.md`, section `ontrack review [adr]`: add the import prompt, verbatim, with an example of two new ADRs, and state the order without an argument: new ADRs, then `proposed`, then revised
- [ ] 1.2 In the same section, state that `review` exits with `2` when it prints the import prompt, and that naming an ADR that is not imported fails as an unknown ADR
- [ ] 1.3 Update the description of `review` in the summary table at the top of `docs/commands.md`

## 2. Selection and prompt

- [ ] 2.1 In `src/review.ts`, add `newAdrs(root, plan?)`: the ADRs `plan` reports as `new`, each with its namespace, file name and title, sorted by reference; none when the tracks cannot be read, as `revisedAdrs` does
- [ ] 2.2 In `src/review.ts`, add `formatImport(adrs)`: the import prompt of `docs/commands.md`, listing `docs/adr/<namespace>/<file name>` and the title of each new ADR
- [ ] 2.3 In `src/commands/review.ts`, without an argument: build the plan once, print the import prompt and return `2` when an ADR is new, before the `proposed` and revised cases; leave the branch with an argument untouched
- [ ] 2.4 Update `describe` and the description of the `adr` positional in `src/commands/review.ts`

## 3. Tests

- [ ] 3.1 In `test/review.test.ts`, cover the scenarios of the requirement "New ADRs": new ADRs alone, before pending ones, before revised ones, tracks not installed, a named ADR that is not imported
- [ ] 3.2 Cover the scenarios of the requirement "Import prompt": the ADRs listed in reference order with paths and titles, `apply` before `review`, no step that sets a status, the tree unchanged
- [ ] 3.3 Cover the exit code `2` for the import prompt, and check that the existing "Nothing to review" and "No ADR directory" tests still pass unchanged
- [ ] 3.4 Run `npm test` and keep lines, branches and functions at 95 % or above

## 4. Documentation

- [ ] 4.1 In `docs/how-it-works.md`, sections "The life of one question" and "The cycle": say that `review` has the agent import new questions first, so that a person runs `plan` then `review`; keep `apply` as the only command that writes
- [ ] 4.2 In `docs/revise-a-question.md`: at the end of step 5, say why no `apply` step follows; in the table "Other changes to a track", replace the action for an added question with `review`
- [ ] 4.3 In `docs/run-ontrack-in-ci.md`, update the row that says to run `npx ontrack apply`, then rule with `review`
- [ ] 4.4 In `README.md`, update the comment on the `npx ontrack review` line
- [ ] 4.5 Leave `docs/tutorial.md` as it is: it keeps `apply` as its own step
- [ ] 4.6 Run `npm run build --prefix site` and check that every internal link resolves

## 5. Verification

- [ ] 5.1 On a scratch repository with one track installed and no `docs/adr/`, run `claude "$(npx ontrack review)"` and check that the agent runs `apply`, then `review`, then asks for agreement on the first ADR
- [ ] 5.2 Run `openspec validate review-imports-new-adrs`
