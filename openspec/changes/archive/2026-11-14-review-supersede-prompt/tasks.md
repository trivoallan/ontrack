# Tasks

## 1. Supersession lookup

- [x] 1.1 In `src/instructions.mjs`, extract from `resolve` an exported function that maps each superseded ADR to the `accepted` ADR superseding it, and use it in `resolve`; verify `npm test` passes unchanged
- [x] 1.2 Add tests in `test/instructions.test.mjs` for that function: plain name in the same directory, `<namespace>/<name>`, `local/<name>`, a `proposed` ADR's `supersedes:` ignored; verify they pass

## 2. Selection

- [x] 2.1 In `test/review.test.mjs`, replace the "already ruled" assertions with the spec scenarios: accepted and in force is selected, already superseded throws naming both references, superseded by a `proposed` ADR is selected, `rejected` throws naming its status, a trait conflict elsewhere does not throw; verify the new tests fail
- [x] 2.2 Update `selectAdr` in `src/review.mjs` to accept an `accepted` ADR that is not superseded; verify the tests of 2.1 pass

## 3. Supersession prompt

- [x] 3.1 Add tests for `formatSupersession`: path, title and `supersedes: [<reference>]` present, no other ADR path, agreement before writing, `npx ontrack apply` after writing, no key left out, marking left to the repository's rules with no status value named, tracking text identical to `formatReview`'s, same text for two ADRs once path, title and reference are removed; verify they fail
- [x] 3.2 Add `formatSupersession` to `src/review.mjs` with the six steps of the spec, reusing the tracking constant; verify the tests of 3.1 pass
- [x] 3.3 In `src/commands/review.mjs`, print `formatSupersession` when the selected ADR is `accepted`, and reword `describe`; add command tests for exit code `2`, standard output equal to `formatSupersession`, and an unchanged tree; verify they pass
- [x] 3.4 Update the `review` section and the command list of `README.md`: when the supersession prompt is printed, its text between `~~~` fences, the already-superseded error; add the test that the README holds the exact `formatSupersession` output; verify it passes

## 4. Verification

- [x] 4.1 Run `claude "$(npx ontrack review ADR-0004)"` on this repository up to the agent's proposal, without agreeing; verify the proposal lists every trait key of ADR-0004 and leaves ADR-0004 untouched, and fix the prompt wording where the agent went wrong
- [x] 4.2 Run `npm test` with coverage and verify it stays at or above 95 %, then `openspec validate review-supersede-prompt` and verify it passes
