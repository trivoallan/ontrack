# Proposal

## Why

ontrack has no code yet. The next three tasks of the breakdown
(trivoallan/ontrack#2, #3, #4) need a shared entry point, and an output
contract for `ontrack plan` fixed before the command is written. Without that
contract, the command and what consumes it (CI, and the method's cycle that
will copy its output) would be built on two different assumptions.
Source: trivoallan/ontrack#1.

## What Changes

- A Node package `ontrack` exposing an `ontrack` command, built on yargs (its only runtime dependency).
- An entry point that dispatches subcommands, prints help and version, and cleanly rejects an unknown command.
- The `plan` subcommand is declared but not implemented yet: it says so, with the contract's error code. trivoallan/ontrack#4 replaces it.
- The `ontrack plan` output contract is written in the README: one line per source first, then the details; a flat-layout migration always shown; exit codes `0`, `2` and `1`.
- Tests run on Node's built-in runner, with at least **95%** coverage (lines, branches, functions): `npm test` fails below that.

## Capabilities

### New Capabilities
- `cli`: the `ontrack` entry point, with help, version, subcommand dispatch and shared exit codes.

### Modified Capabilities
<!-- none: first change in the repository -->

## Impact

- New files: `package.json`, `.nvmrc`, `bin/ontrack.mjs`, `src/cli.mjs`, `src/commands/plan.mjs`, `test/cli.test.mjs`, `test/bin.test.mjs`, and the completed README.
- One runtime dependency: `yargs` (^18). Node 24 LTS.
- Nothing is published to npm: downstream repositories install ontrack from git.
