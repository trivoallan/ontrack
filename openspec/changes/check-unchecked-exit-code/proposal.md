# Proposal

## Why

A `check:` command can have nothing to verify for the verdict it reads:
governance's `governance-check ADR-0006` has nothing to run when
`commits.tool` is `hook` or `none`. It can only exit `0`, so `ontrack check`
reports `pass` and the pass count includes checks that tested nothing.
Source: trivoallan/ontrack#61.

## What Changes

- Exit code `78` (`EX_CONFIG` in sysexits) is reserved: a command that exits
  with it is reported as `unchecked`, like an ADR with decided traits and no
  check. Its output is not printed.
- It counts as unchecked in the last line and does not change the exit code
  of `ontrack check`.
- The README contract documents the code.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `check`: a third outcome for a command, next to pass and fail.

## Impact

- `src/check.ts`, `test/check.test.ts`, `README.md`.
- A command that exits `78` today is reported `fail`; it becomes `unchecked`
  and no longer makes `ontrack check` exit `2`. No command of this
  repository or of trivoallan/governance does.
- governance then switches its `hook` and `none` cases to the code, in its
  own repository.
