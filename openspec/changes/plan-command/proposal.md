# Proposal

## Why

A downstream repository cannot tell today whether an inherited ADR was
revised upstream since it was imported. `ontrack plan` answers that question
per source, without touching the repository, and gives CI an exit code to
branch on. The two building blocks exist (`adr-revision`, `sources`); this
change wires them into the command the output contract describes.
Source: trivoallan/ontrack#4.

## What Changes

- `ontrack plan` replaces the "not available yet" stub. For each source, it compares the ADRs the source ships with those imported in `docs/adr/<alias>/`, and prints the contract output.
- It detects a historical flat layout (`docs/adr/<file>` with no `docs/adr/<alias>/<file>`) and lists the files that would move.
- Exit code `2` whenever anything needs a human: a new, revised, removed, undetermined or unreadable ADR, or a migration. `0` otherwise, `1` on error.
- The output contract in the README gains an `unreadable` category and a generic migration format (summary line, then one indented line per file).
- `plan` never writes a file and makes no network call.

## Capabilities

### New Capabilities
- `plan`: the `ontrack plan` command: comparing imported ADRs with each source, detecting the flat layout, and reporting per the output contract.

### Modified Capabilities
- `cli`: the "Shared exit codes" requirement is replaced by "Exit codes shared by subcommands" (same rule): its only scenario described `plan` as not implemented yet.

## Impact

- `src/commands/plan.mjs` (stub replaced), new `src/plan.mjs`, `README.md` (contract), `test/plan.test.mjs`, `test/cli.test.mjs` (the stub test goes).
- Reuses `src/revision.mjs` and `src/sources.mjs` unchanged. No new dependency.
