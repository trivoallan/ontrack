## 1. Tests first

- [x] 1.1 In `test/review.test.ts`, assert that both forms of the review prompt hold the new step 2: it starts from what the repository does today, says that an absence is evidence, excludes what other `proposed` ADRs would make it, and compares with the recommendation after that
- [x] 1.2 Run the tests and see the new assertion fail

## 2. Prompt

- [x] 2.1 Replace step 2 in the `STEPS` constant of `src/review.ts` with the wording of the review delta spec
- [x] 2.2 Run the tests and see the new assertion pass, and the commands reference contract test fail

## 3. Documentation

- [x] 3.1 Replace step 2 in the two verbatim copies of the steps in `docs/commands.md`
- [x] 3.2 Check that nothing else under `docs/` or in `README.md` quotes the old step

## 4. Verification

- [x] 4.1 Run the full test suite, coverage and lint
- [x] 4.2 Run `openspec validate review-starts-from-practice --strict`
