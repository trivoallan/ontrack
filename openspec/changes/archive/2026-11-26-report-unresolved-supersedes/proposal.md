Issue served: none

## Why

An `accepted` ADR supersedes another through its `supersedes:` key, and
ontrack matches each entry on the `adr:` identifier of the ADR it names. An
entry that designates no ADR is silently ignored: the ADR it meant to
supersede stays in force. `local/ADR-0027` named `ADR-0022` with its slug,
and `ADR-0022` stayed in force unnoticed until it was read by hand. When
the superseded ADR has traits, `apply` reports a trait conflict; when it
has none, nothing reports anything.

## What Changes

- `plan` reports every `supersedes:` entry of an `accepted` ADR that
  designates no ADR, after the last track, one `unresolved` line per entry.
- Such an entry counts as a change to make: `plan` exits with `2`.
- `plan --json` adds the key `unresolved`, one `{ ref, name }` per entry.

Not in this change:

- Fixing the entry: the line names it, the user or an agent edits it.
- The same report in `apply`, `check` or `review`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plan`: the output reports unresolved `supersedes:` entries, and the exit code counts them.
- `json-output`: the plan document holds `unresolved`.

## Impact

- `src/instructions.ts`: `unresolvedSupersedes`, sharing the matching of `supersededBy`.
- `src/plan.ts`, `src/commands/plan.ts`: the lines and the exit code.
- `src/documents.ts`, `schema/plan.schema.json`: the `unresolved` key. A consumer that reads the earlier document is not affected: the schemas let added keys through.
- `docs/commands.md`: the contract, changed first.
