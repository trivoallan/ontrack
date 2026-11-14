# Proposal

## Why

`ontrack plan` says what importing a source would change, but nothing applies
it. After `npm update <alias>`, a downstream developer copies each new ADR by
hand, moves each flat-layout file, and hunts the links that pointed to them:
one command per file, on every revision. `ontrack apply` makes it one command,
without ever touching a verdict the developer already wrote.

## What Changes

- New command `ontrack apply`, the only one that writes. It acts on the same plan as `plan`:
  - copies every `new` ADR into `docs/adr/<alias>/`, byte for byte;
  - moves every flat-layout file into `docs/adr/<alias>/` (`git mv` in a git repository);
  - lists, without rewriting, each Markdown link that points to a moved file.
- `--prune` deletes `removed` ADRs; without it they stay.
- `--confirm <name>` (repeatable) or `--confirm all` sets the upstream `revision:` on `undetermined` ADRs, declaring their verdict still holds.
- `--dry-run` prints everything `apply` would do and writes nothing.
- `revised` and `unreadable` ADRs are never written to, moved or deleted. `apply` never commits.
- Exit `2` when something still needs a human after the run, `0` otherwise, `1` on error, with every check done before the first write.

## Capabilities

### New Capabilities
- `apply`: the `ontrack apply` command: importing new ADRs, the flat-layout migration, listing links to moved files, and the explicit `--prune`, `--confirm` and `--dry-run` options.

### Modified Capabilities
<!-- none: `plan`'s behavior and the shared exit codes are unchanged -->

## Impact

- New: `src/apply.mjs`, `src/links.mjs`, `src/commands/apply.mjs`, `test/apply.test.mjs`, `test/links.test.mjs`; an `apply` section in the README.
- `src/plan.mjs`: each source entry also carries its `adrDir` (not printed).
- `src/cli.mjs`: registers `apply`.
- Uses `git` when present (for `git mv`), a plain rename otherwise. No new npm dependency.
