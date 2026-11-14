## Why

Nothing shows the state of every inherited ADR at once. `plan` lists only the ADRs that need a human and folds the others into a count, and no command prints an ADR's verdict (`status:`): to learn that `ADR-0013-frontend` was rejected, one opens the file.

## What Changes

- `ontrack plan` accepts an `--all` option.
- With `--all`, `plan` prints one line per ADR, the `unchanged` ones included.
- With `--all`, each ADR line carries the verdict of the repository's copy, read from its frontmatter `status:`.
- Without `--all`, the output is byte-identical to today's.
- The exit code is the same with and without `--all`.

Out of scope: a `list` command, the repository's own ADRs (files directly under `docs/adr/`), and showing which ADR supersedes which.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plan`: adds the `--all` option, its output lines and the verdict column.

## Impact

- `src/commands/plan.ts`: declares the option and passes it on.
- `src/plan.ts`: reads the verdict of each local copy; `formatPlan` prints the full listing on request.
- `src/revision.ts`, `src/schemas.ts`: read `status:` from a frontmatter.
- `test/plan.test.ts`, `test/revision.test.ts`: new cases.
- `docs/commands.md`: documents the option and its output contract.
- `apply`, which prints the plan format, is unchanged: it never asks for the full listing.
