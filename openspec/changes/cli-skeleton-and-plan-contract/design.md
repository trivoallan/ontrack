# Design

## Context

The repository only contains a README. See proposal.md (Why) for the
motivation. Target downstream repositories use Node, and sources are fetched
through npm. ontrack itself is installed from git, without npm publication.

## Goals / Non-Goals

**Goals:**
- An entry point small enough that issues #2, #3 and #4 can move in parallel without touching the same file, apart from registering a subcommand.
- An output contract for `plan` written **before** the command.

**Non-Goals:**
- Any `plan` behavior beyond the "not available yet" message.
- Colors, a `--json` output (v2).

## Decisions

**Node 24 LTS, ES modules (`.mjs`), yargs for argument parsing.**
yargs 18 (ESM, Node ≥ 20.19) provides help, version, rejection of an unknown
command (`.strict()`) and subcommand declaration (`.command()`), which would
otherwise be rewritten by hand. Tests stay on `node:test`, with no dev
dependency. *Alternatives:* parsing `process.argv` by hand, which means fewer
dependencies but rewriting help and errors; `commander`, equivalent, but
yargs was chosen.

**One subcommand = one yargs command module.**
Each subcommand lives in `src/commands/<name>.mjs` and exports a yargs module
(`command`, `describe`, `builder`, `handler`). Its `handler` returns the
contract code 0/2/1 to `main`, which passes it up. `src/cli.mjs` registers
them with `.command()`. Adding `plan` (#4) only touches its own file.
*Alternative:* declaring everything in `cli.mjs`. Every new command would go
through the same file, with more merge conflicts.

**yargs behaviors to set explicitly.**
- No argument: print help and exit with `0`. By default, `.demandCommand()` would exit with `1`.
- `-v` aliases `--version`, `-h` aliases `--help`.
- Unknown command: `.strict()` plus a `.fail()` that writes the message to standard error, points to `ontrack --help` and exits with `1`. yargs already exits with `1`, but its default message does not mention `--help`.
- English locale set explicitly (`.locale('en')`), so output does not depend on the user's environment.

**Coverage ≥ 95%, measured by Node itself.**
`npm test` runs `node --test --experimental-test-coverage` with
`--test-coverage-lines=95 --test-coverage-branches=95 --test-coverage-functions=95`
and `--test-coverage-exclude='test/**'`. Node fails the command below the
threshold, with no extra dependency. *Alternative:* `c8`, which adds a dev
dependency for the same measurement.

**The CLI is tested in-process, not in a subprocess.**
Testing in-process lets tests inject the output streams and the command list,
and so also cover the error path of a subcommand. (Observed during
implementation: Node's coverage does follow the `bin` test's subprocess.)
`src/cli.mjs` therefore exports `main(argv, { stdout, stderr }) → code`, and
`bin/ontrack.mjs` (the package `bin`) only calls it and sets
`process.exitCode`. yargs is configured with `.exitProcess(false)`, so
`--help`, `--version` and errors return control instead of exiting the
process. A single integration test runs the real `bin` in a subprocess, to
check the wiring and the real exit code.
*Alternative:* testing everything in a subprocess. More faithful, but a test
command can no longer be injected and streams cannot be captured without
going through the console.

**Exit codes 0, 2, 1 follow `terraform plan -detailed-exitcode`.**
The audience already knows this model. A CI job branches on `2` ("out of
date") without parsing output. *Alternative:* `0` or `1` only. CI could no
longer tell "out of date" from an error.

**The `plan` output contract lives in the README.**
It is the document the downstream developer reads, and the one the method
will cite when it copies the output. Content:

```
platform: 2 revised, 1 new, 11 unchanged
  revised  SDR-0006  revision 1 → 2
  revised  SDR-0010  revision 3 → 4
  new      SDR-0015
migration: 14 files docs/adr/SDR-*.md → docs/adr/platform/
```

- Line 1, per source: `<alias>: <count per category>`. Zero counts are omitted, except "unchanged".
- Then, indented, only the ADRs that are not unchanged. Categories: `new`, `revised`, `undetermined`, `removed`.
- A flat-layout migration is always shown, on its own line, when there is one.
- When there is nothing to do, one line per source, and the exit code is `0`.

*Alternative:* showing everything, unchanged included. Rejected: the
downstream developer must see the answer on the first line.

## Risks / Trade-offs

- [The output format moves during #4] → Any change goes through the README first, and through a #4 test that compares the output with a README example.
- [`plan` exists but returns an error until #4] → The message says so explicitly, and code `1` stays within the contract. It is not a false success.
- [An async handler rejection escapes yargs] → `main` awaits the handler's promise itself and turns a rejection into code `1` (found by the error-path test).
