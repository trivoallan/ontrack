## 1. Contract

- [x] 1.1 Describe the `unresolved` lines, the exit code and the `unresolved` key in `docs/commands.md`

## 2. Code

- [x] 2.1 Add `unresolvedSupersedes` to `src/instructions.ts`, matching entries as `supersededBy` does
- [x] 2.2 Print the lines and count them in the exit code of `plan`
- [x] 2.3 Add `unresolved` to the plan document and regenerate `schema/plan.schema.json`

## 3. Verification

- [x] 3.1 Tests: an entry that designates no ADR is reported with exit code `2`, text and JSON; entries that all resolve add nothing; unreadable ADRs add no line
- [x] 3.2 `npm test` passes with coverage above the target, and `plan` on this repository reports nothing
