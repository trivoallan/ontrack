## Why

What ontrack prints is text laid out for a reader: columns padded to twelve characters, counts in a sentence, a prompt. A CI job reads the exit code and no more; a coding agent or a script that wants to know which ADRs are revised, what `apply` did, or which check failed has to parse those columns. A live audit of the command line found no command with a structured form. The errors now carry a code (`add-error-codes`), and nothing gives it to a program without a pattern.

## What Changes

- Every command takes `--json`: `plan`, `apply`, `check`, `instructions` and `review` then print one JSON document on standard output, in place of the text, with the same facts.
- With `--json`, a failure is one JSON document on standard error: its code, its message, and the address of its row on the Error messages page.
- With `--json`, nothing else is written: what the text form says on standard error (the next step of `apply` and of `plan`, the `nothing to review` line) is in the document.
- The exit codes do not change. Without `--json`, no output changes.
- A document is a contract like the text: every key is always present, a path is relative to the repository, a key may be added, and none is removed or redefined without a breaking change.

## Capabilities

### New Capabilities

- `json-output`: the `--json` option, the document of each command, and the document of an error.

### Modified Capabilities

None: the text outputs, and the requirements that specify them, are unchanged.

## Impact

- **Code**: a new `src/json.ts`, which builds each document from the data the text formatters read; `src/cli.ts` (the global option, the error document); one branch in each handler of `src/commands/`. The handler of `review` now finds the prompt before it prints it.
- **Tests**: `test/json.test.ts`, one document per command and per kind of error.
- **Documentation**: `docs/commands.md` (a section *JSON output*, with the keys of each document), `docs/error-messages.md`, the README.
- **Compatibility**: none of what exists changes. `--json` was refused as an unknown option until now.
- **Outside this change**: a published JSON Schema of the documents; traits as parsed YAML rather than text.
