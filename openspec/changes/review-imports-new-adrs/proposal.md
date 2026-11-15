## Why

`ontrack apply` is run at two moments of the cycle: by a person, to import the questions a track ships, and by the coding agent, to update `AGENTS.md` once a question is ruled. The two paths a reader follows therefore differ. For a new question the documented sequence is `plan`, `apply`, `review`. For a revised one it is `plan`, `review`. A reader of the second looks for the missing `apply`.

Today `ontrack review` ignores the ADRs `plan` reports as `new`: with questions waiting to be imported and nothing `proposed`, it prints nothing, says that no ADR is proposed or revised, and exits with `0`.

## What Changes

- Without an argument, when `plan` reports at least one ADR as `new`, `ontrack review` prints an import prompt. It tells the agent to run `npx ontrack apply`, names the ADRs that command imports, then to run `npx ontrack review` and follow the prompt it prints.
- `ontrack review` exits with `2` in that case, where it exits with `0` today when nothing else is pending. A CI job that runs `review` and reads its exit code sees `2` sooner: `plan` already returns `2` for the same repository.
- The import prompt takes precedence over the sequence prompt and over the prompt to rule again. `ontrack review` still writes nothing itself: `apply` stays the only command that writes.
- With an argument, nothing changes: naming an ADR that is not imported yet still fails as an unknown ADR.
- The prompts for `proposed`, revised and `accepted` ADRs keep their text.
- The documentation presents `plan` then `review` as the sequence a person runs, for new and revised questions alike, and keeps `apply` as the command to run alone in CI or without an agent.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `review`: a new requirement for ADRs not imported yet and the import prompt; the selection without an argument and the exit codes take those ADRs into account.

## Impact

- Code: `src/review.ts` (the new ADRs read from the plan, the import prompt), `src/commands/review.ts` (selection order, command description).
- Tests: `test/review.test.ts`.
- Documentation: `docs/commands.md` (the `review` section is a contract and changes first), `docs/how-it-works.md`, `docs/revise-a-question.md`, `docs/run-ontrack-in-ci.md`, `README.md`.
- No new dependency, no change to `plan`, `apply`, `instructions` or `check`.
