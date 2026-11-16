## 1. Codes

- [x] 1.1 Add `src/errors.ts`: `OntrackError`, an `Error` with a `code`, and the usage code `E001`
- [x] 1.2 Give every `throw` of `src/` its code: `E101` to `E113` in `src/tracks.ts` and `src/plan.ts`, `E201` to `E207` in `src/instructions.ts`, `src/apply.ts` and `src/revision.ts`, `E301` to `E304` in `src/review.ts`; split the unreadable `package.json` into its four causes
- [x] 1.3 In `src/cli.ts`, print `ontrack[<code>]: <message>` for an `OntrackError` and for a usage error, and `ontrack: <message>` for any other error

## 2. Tests

- [x] 2.1 `test/errors.test.ts`: no `new Error(` in `src/`, no code written twice, the codes of `src/` are those the page gives an address to, the form of a known failure and of a refused command line
- [x] 2.2 Update the two tests that compared a whole error line

## 3. Documentation

- [x] 3.1 In `docs/error-messages.md`, say the form of the line and what a code promises; add the Code column with an address per code; add the rows of `E104`, `E206` and `E207`
- [x] 3.2 In `docs/commands.md`, say under the exit codes that `1` comes with a coded line

## 4. Verification

- [x] 4.1 `npm test` passes and coverage stays at or above 95%; `npm run typecheck` passes
- [x] 4.2 In a scratch repository, the lines of a missing `package.json`, an invalid one, a dependency not installed, an unknown ADR and an unknown command start with their code
- [x] 4.3 `openspec validate add-error-codes --strict` passes
- [x] 4.4 The site builds, and every internal link resolves
