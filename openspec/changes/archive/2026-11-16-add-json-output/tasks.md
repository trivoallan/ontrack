## 1. Documents

- [x] 1.1 Add `src/json.ts`: the two shapes of an ADR, and the documents of `plan`, `apply` (an action), `check`, `instructions` and an error, built from the data the text formatters read
- [x] 1.2 In `src/cli.ts`, declare `--json` as a global option; print the error document on standard error for a failure and for a refused command line
- [x] 1.3 In `src/commands/plan.ts`, `check.ts` and `instructions.ts`, print the document under `--json`; `plan` then writes no hint on standard error
- [x] 1.4 In `src/commands/apply.ts`, print one document whether or not there are actions, with `remaining` and `next`; no next step on standard error
- [x] 1.5 In `src/commands/review.ts`, find the prompt (its kind, its ADRs) before printing it; under `--json`, print the document, `none` included

## 2. Tests

- [x] 2.1 `test/json.test.ts`: every scenario of the `json-output` capability
- [x] 2.2 The existing tests pass unchanged: no text output moved

## 3. Documentation

- [x] 3.1 In `docs/commands.md`, a section *JSON output*: the rules, the two shapes of an ADR, the keys of each document, the error document
- [x] 3.2 In `docs/error-messages.md`, say where the JSON form of an error is specified; in the README, name the option

## 4. Verification

- [x] 4.1 `npm test` passes and coverage stays at or above 95%; `npm run typecheck` passes
- [x] 4.2 In a scratch repository with the engineering track, each of the five commands prints a document that parses, and two failures print the error document
- [x] 4.3 `openspec validate add-json-output --strict` passes
- [x] 4.4 The site builds, and every internal link resolves
