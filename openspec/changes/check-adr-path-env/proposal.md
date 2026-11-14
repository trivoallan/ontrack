# Proposal

## Why

`ontrack check` runs a `check:` command from the project root and tells it
nothing about the ADR it came from. A script that reads the ruled traits has
to find its own file again: `governance-check ADR-0006` searches
`docs/adr/*/ADR-0006-*.md` and fails when two namespaces match.
Source: trivoallan/ontrack#62.

## What Changes

- Each command runs with `ONTRACK_ADR` set in its environment to the path of
  its ADR's file, relative to the project root, with forward slashes: the
  value of the `rule:` line of a `fail`.
- The rest of the caller's environment is passed on unchanged.
- The README contract documents the variable.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `check`: the environment a command runs with.

## Impact

- `src/check.ts`, `test/check.test.ts`, `README.md`.
- A caller that already exports `ONTRACK_ADR` sees it replaced for the
  duration of each command.
- governance then reads the variable, keeping its search as a fallback for a
  script run by hand, in its own repository.
- Builds on `check-unchecked-exit-code`, whose delta modifies the same
  requirement; this delta carries both changes.
