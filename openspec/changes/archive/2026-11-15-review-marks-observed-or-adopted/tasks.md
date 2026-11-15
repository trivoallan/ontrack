## 1. Tests first

- [x] 1.1 In `test/review.test.ts`, assert that both forms of the review prompt tell the agent, in step 4, to mark every value `observed` or `adopted`, defining both, and, in step 6, to present each trait line with its mark
- [x] 1.2 Run the tests and see the new assertion fail

## 2. Prompt

- [x] 2.1 Rewrite steps 4 and 6 in the `STEPS` constant of `src/review.ts` to the wording of the review delta spec
- [x] 2.2 Run the tests and see the new assertion pass, and the commands reference contract test fail

## 3. Documentation

- [x] 3.1 Replace steps 4 and 6 in the two verbatim copies in `docs/commands.md`
- [x] 3.2 Check that nothing else under `docs/` or in `README.md` quotes the old steps

## 4. Verification

- [x] 4.1 Run the full test suite, coverage and typecheck
- [x] 4.2 Run `openspec validate review-marks-observed-or-adopted --strict`
