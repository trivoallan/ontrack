# cli Specification

## Purpose

Provides a single entry point, `ontrack`, that dispatches subcommands and shares stable exit codes that CI and the method can rely on.

## Requirements

### Requirement: Command help
The `ontrack` command SHALL print to standard output a help text listing its subcommands, including `plan`, `instructions`, `review` and `check`, and exit with code `0`, when run with `--help`, `-h`, or no argument.

#### Scenario: Help requested explicitly
- **WHEN** the user runs `ontrack --help`
- **THEN** standard output lists the `plan`, `instructions`, `review` and `check` subcommands
- **AND** the exit code is `0`

#### Scenario: No argument
- **WHEN** the user runs `ontrack` with no argument
- **THEN** the same help is printed
- **AND** the exit code is `0`

### Requirement: Command version
The `ontrack` command SHALL print the version declared in its `package.json` and exit with code `0`, when run with `--version` or `-v`.

#### Scenario: Version requested
- **WHEN** the user runs `ontrack --version`
- **THEN** standard output contains exactly the `package.json` version
- **AND** the exit code is `0`

### Requirement: Unknown command
The `ontrack` command MUST reject a subcommand it does not know. It writes to standard error a message that carries the code `E001` (see *Error codes*), names the received command and points to `--help`, and it exits with code `1`.

#### Scenario: Typo
- **WHEN** the user runs `ontrack plann`
- **THEN** standard error names `plann` and mentions `ontrack --help`
- **AND** the exit code is `1`

### Requirement: Exit codes shared by subcommands
Every `ontrack` subcommand SHALL exit with one of three codes: `0` when there is nothing to do, `2` when changes are pending or a check failed, `1` on error. No other code is emitted on purpose.

#### Scenario: Pending changes
- **WHEN** the user runs `ontrack plan` in a project where a track revised an imported ADR
- **THEN** the exit code is `2`

#### Scenario: Failed check
- **WHEN** the user runs `ontrack check` in a project where a decided ADR's check command exits with a non-zero code
- **THEN** the exit code is `2`

#### Scenario: Error
- **WHEN** the user runs `ontrack plan` in a directory without a `package.json`
- **THEN** standard error explains the problem
- **AND** the exit code is `1`

### Requirement: Error codes
Every failure an `ontrack` subcommand reports with exit code `1` SHALL be written to standard error as one line of the form `ontrack[<code>]: <message>`, where `<code>` is `E` followed by three digits. A command line the command refuses SHALL carry the code `E001`, and the line SHALL be followed by the line pointing to `--help`.

#### Scenario: A known failure
- **WHEN** `ontrack plan` runs in a directory without a `package.json`
- **THEN** standard error is `ontrack[E101]: cannot read <directory>/package.json; run ontrack from the root of an npm project`
- **AND** the exit code is `1`

#### Scenario: A refused command line
- **WHEN** the user runs `ontrack plann`
- **THEN** the first line of standard error starts with `ontrack[E001]: ` and names `plann`
- **AND** the second line mentions `ontrack --help`

### Requirement: A code is stable
A code SHALL name one failure. It MUST NOT be given to another failure, in the same version or a later one, and the message of a failure MAY change without its code changing. The hundreds group the codes: `E1nn` for the project's `package.json` and its tracks, `E2nn` for the ADRs under `docs/adr/`, `E3nn` for what `review` is asked.

#### Scenario: One code, one failure
- **WHEN** the source gives the code `E105` to two failures
- **THEN** the test suite fails

### Requirement: Lines without a code
A failure the command did not foresee SHALL be written as `ontrack: <message>`, without a code. A line that is not an error (the `nothing to review` line, the `next:` lines, the `AGENTS.md:` lines) SHALL carry no code.

#### Scenario: A line that quotes an error
- **WHEN** two `accepted` ADRs decide the same trait key and `ontrack plan` runs
- **THEN** the line `AGENTS.md: skipped, trait "<key>" is decided by both …` carries no code

#### Scenario: Nothing to review
- **WHEN** `ontrack review` runs where every ADR is ruled and the tracks are read
- **THEN** standard error is `ontrack: no ADR is proposed or revised, nothing to review`, without a code, and the exit code is `0`

### Requirement: Every code is documented
The documentation's page on error messages SHALL hold, for every code the command can print, a row with an address made of the code in lower case. A code missing from the page, or a code the page holds and the command cannot print, SHALL make the test suite fail.

#### Scenario: A code the page does not hold
- **WHEN** a failure is added to the source with the code `E114` and the page on error messages has no row for it
- **THEN** the test suite fails
