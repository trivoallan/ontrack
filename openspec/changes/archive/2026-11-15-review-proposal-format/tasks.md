## 1. Tests first

- [x] 1.1 In `test/review.test.ts`, assert that step 4 tells the agent not to mark a value it cannot tell from what it can read, to say what it could not see and where it lives, and to ask the user
- [x] 1.2 Assert that step 6 gives the line form `trait.key: value (observed|absent): evidence`
- [x] 1.3 Assert that the tracking text opens with "Once every ADR in this review is ruled", lists its instructions as `-` bullets in order (tracker, existing items, duplicates, proposal, creation), and keeps every prohibition
- [x] 1.4 Update the existing tracking assertions to the new text, keeping what each one checks
- [x] 1.5 Run the tests and see the new assertions fail

## 2. Prompt

- [x] 2.1 Rewrite steps 4 and 6 in `STEPS` and the `TRACKING` constant in `src/review.ts` to the wording of the review delta spec
- [x] 2.2 Run the tests and see them pass, except the commands reference contract test

## 3. Documentation

- [x] 3.1 Replace the two copies of the steps and the five copies of the tracking text in `docs/commands.md`
- [x] 3.2 Check that nothing else under `docs/` or in `README.md` quotes the old text

## 4. Verification

- [x] 4.1 Run the full test suite, coverage and typecheck
- [x] 4.2 Run `openspec validate review-proposal-format --strict`
