# check Specification

## Purpose
`ontrack check` runs the check command each decided ADR declares and reports which decisions the working tree departs from, in a form a coding agent can act on.

## Requirements

### Requirement: ADRs carrying a check
The ADRs read, their status and their supersession SHALL be those of `instructions`. An ADR SHALL carry a check when it is `accepted`, is not superseded, and its frontmatter has a `check:` line at column zero with a non-empty value. The command SHALL be that value, with a trailing `# comment` removed and one pair of matching surrounding quotes removed. Lines that follow the `check:` line are never part of the command. `ontrack check` reads `docs/adr/` only, and needs no `package.json` and no `node_modules`.

#### Scenario: Accepted ADR with a check
- **WHEN** `docs/adr/trivoallan/ADR-0006-commits.md` is `accepted` with `check: npx commitlint --from origin/main`
- **THEN** it carries the check `npx commitlint --from origin/main`

#### Scenario: Proposed ADR
- **WHEN** an ADR is `proposed` with `check: exit 1`
- **THEN** its command does not run and the ADR does not appear in the output

#### Scenario: Superseded ADR
- **WHEN** `local/ADR-0012-commits` is `accepted` with `supersedes: [trivoallan/ADR-0006]` and no `check:`, and `trivoallan/ADR-0006-commits` is `accepted` with `check: exit 1`
- **THEN** the command of `trivoallan/ADR-0006-commits` does not run

#### Scenario: Shipped ADRs are not read
- **WHEN** source `trivoallan` ships an `accepted` ADR with `check: exit 1` in `node_modules` and the project has no copy of it
- **THEN** no command runs

#### Scenario: Empty value
- **WHEN** an `accepted` ADR's frontmatter holds `check:` with nothing after the colon
- **THEN** it carries no check

### Requirement: Unchecked decisions
An ADR that carries decided traits (see `instructions`) and no check SHALL be reported as `unchecked`. An `accepted` ADR with neither decided traits nor a check SHALL NOT appear in the output.

#### Scenario: Traits without a check
- **WHEN** `trivoallan/ADR-0001-record-architecture-decisions` is `accepted` with a traits block and no `check:`
- **THEN** it is reported as `unchecked`

### Requirement: Running the commands
`ontrack check` SHALL run each command through the system shell, with the project root as working directory and the caller's environment, one at a time, in the order of the ADR references. It SHALL run every command even after one has failed. A command passes when it exits with code `0`. Any other outcome fails: a non-zero exit code, a termination by signal, or a command that cannot be started. `ontrack check` itself MUST NOT create, modify or delete any file, and MUST NOT make any network call; what the commands do is theirs.

#### Scenario: Passing command
- **WHEN** an ADR carries the check `true`
- **THEN** it is reported as `pass`

#### Scenario: Failing command
- **WHEN** an ADR carries the check `exit 3`
- **THEN** it is reported as `fail`

#### Scenario: Unknown program
- **WHEN** an ADR carries the check `no-such-program-xyz`
- **THEN** it is reported as `fail`, and the shell's message appears in its output lines

#### Scenario: Working directory
- **WHEN** an ADR carries the check `test -d docs/adr` and `ontrack check` runs at the project root
- **THEN** it is reported as `pass`

#### Scenario: A failure does not stop the run
- **WHEN** `local/ADR-0001-a` carries the check `exit 1` and `local/ADR-0002-b` carries the check `true`
- **THEN** `local/ADR-0001-a` is reported as `fail` and `local/ADR-0002-b` as `pass`

### Requirement: Conflicting traits stop the run
When `instructions` would fail on a trait conflict or on an inline `traits:` value, `ontrack check` MUST fail the same way, with exit code `1` and an empty standard output, without running any command.

#### Scenario: Two decided ADRs, one key
- **WHEN** `trivoallan/ADR-0006-commits` and `local/ADR-0012-commits` are both `accepted`, not superseded, both declare `commits:`, and one carries a check that would create a file
- **THEN** the exit code is `1`, standard output is empty, and the file is not created

### Requirement: Output format
The output SHALL follow the contract in the README, as lines on standard output:
1. one line per reported ADR, sorted by reference: the status (`pass`, `fail` or `unchecked`) padded with spaces to 11 characters, then `<title> (<reference>)`. The title is read as in `adr-revision`; without one, the reference stands alone, without parentheses;
2. after each `fail` line: `  rule: <path of the ADR's file relative to the project root, with forward slashes>`, then `  check: <command>`, then each line of the command's standard output followed by each line of its standard error, prefixed with `  | `, with trailing blank lines removed;
3. a last line `<f> failed, <p> passed, <u> unchecked`.

The output of a passing command SHALL NOT be printed. With no ADR to report, the output SHALL be the last line alone, with three zeros.

#### Scenario: One of each
- **WHEN** `trivoallan/ADR-0006-commits` (title `Commits`) carries a check `echo "scope may not be empty"; exit 1`, `trivoallan/ADR-0009-branching` (title `Branching`) carries the check `true`, and `trivoallan/ADR-0001-record-architecture-decisions` (title `Record architecture decisions`) has decided traits and no check
- **THEN** the output is the README example, byte for byte: an `unchecked` line for ADR-0001, a `fail` line for ADR-0006 followed by `  rule: docs/adr/trivoallan/ADR-0006-commits.md`, its `  check:` line and `  | scope may not be empty`, a `pass` line for ADR-0009, then `1 failed, 1 passed, 1 unchecked`

#### Scenario: Nothing to report
- **WHEN** the project has no `docs/adr/` directory
- **THEN** the output is exactly `0 failed, 0 passed, 0 unchecked`

### Requirement: Exit code
`ontrack check` SHALL exit with code `2` when at least one check failed, and with code `0` otherwise. `unchecked` ADRs do not change the exit code.

#### Scenario: A failed check
- **WHEN** one ADR's check fails and another's passes
- **THEN** the exit code is `2`

#### Scenario: Only passes and unchecked
- **WHEN** one ADR's check passes and another ADR is `unchecked`
- **THEN** the exit code is `0`
