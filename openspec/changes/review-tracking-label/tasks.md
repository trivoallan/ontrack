## 1. Tests first

- [x] 1.1 In `test/review.test.ts`, assert that every prompt form (review, sequence, supersession, revised) holds the label `ontrack`, the identifier example `ADR-0015 secrets.guard`, the instruction to list items labelled `ontrack` open and closed, the closed-item report, and the fallback when the tracker cannot be listed
- [x] 1.2 Assert that the instruction to list existing items comes before the instruction to propose a tracking item, and that the paragraph still ends with "give the list in your reply and create nothing."
- [x] 1.3 Run the tests and see the new assertions fail

## 2. Prompt

- [x] 2.1 Rewrite the `TRACKING` constant in `src/review.ts` to the wording of the review delta spec, with the new sentences before the closing `none` sentence
- [x] 2.2 Run the tests and get them green, including the existing tracking and supersession assertions

## 3. Documentation

- [x] 3.1 Replace the five verbatim copies of the paragraph in `README.md` with the new text
- [x] 3.2 Update the summary line on tracking items in `README.md` to mention the `ontrack` label and the duplicate check
- [x] 3.3 Check that nothing under `docs/` quotes the old paragraph, and update it if something does

## 4. Verification

- [x] 4.1 Run the full test suite, coverage and lint
- [x] 4.2 Run `openspec validate review-tracking-label --strict`
