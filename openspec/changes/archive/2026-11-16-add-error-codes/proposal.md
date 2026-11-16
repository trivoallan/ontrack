## Why

An error of ontrack is a sentence, and nothing in it is stable: a script, a CI job or a coding agent that wants to tell one failure from another has to match the wording, which a later version may improve. The Error messages page (`docs/error-messages.md`) indexes the errors by that same wording, so a reader who holds a line cannot be sent to its row. A live audit of the first run found the errors readable and without a handle: every one of them lacked a code.

## What Changes

- **BREAKING** An error line starts with `ontrack[E<nnn>]:` where it started with `ontrack:`. The sentence after the colon and the exit code `1` do not change.
- Each failure ontrack reports has one code, three digits after `E`: `E001` for a command line it refuses, `E1nn` for the project's `package.json` and its tracks, `E2nn` for the ADRs under `docs/adr/`, `E3nn` for what `review` is asked.
- A code is stable. The sentence may be reworded; the code names the same failure for as long as ontrack can fail that way, and is never given to another failure.
- A failure ontrack did not foresee keeps the form `ontrack: <message>`, without a code.
- The Error messages page gives each code a row and an address (`#e105`).
- Lines that are not errors do not change: `ontrack: no ADR is proposed or revised, nothing to review` (exit `0`), the `next:` lines, and the `AGENTS.md:` lines, which quote the sentence of an error without its code.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cli`: four new requirements (*Error codes*, *A code is stable*, *Lines without a code*, *Every code is documented*); *Unknown command* says the line carries `E001`.

## Impact

- **Code**: a new `src/errors.ts` (the error class and the usage code); every `throw` of `src/` names its code; `src/cli.ts` prints it.
- **Tests**: `test/errors.test.ts` holds the contract: no failure without a code, no code written twice, and the codes of the source are those of the page.
- **Documentation**: `docs/error-messages.md` (a Code column, the form of the line, three rows that were missing), `docs/commands.md` (exit code `1`).
- **Compatibility**: a script that matched `^ontrack: ` on standard error to detect an error no longer matches. The exit code was, and stays, the way to detect one.
- **Outside this change**: a `--json` form of the errors, and a link to the page in the line itself.
