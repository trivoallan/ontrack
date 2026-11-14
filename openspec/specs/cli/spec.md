# cli Specification

## Purpose

Provides a single entry point, `ontrack`, that dispatches subcommands and shares stable exit codes that CI and the method can rely on.

## Requirements

### Requirement: Command help
The `ontrack` command SHALL print to standard output a help text listing its subcommands, including `plan`, and exit with code `0`, when run with `--help`, `-h`, or no argument.

#### Scenario: Help requested explicitly
- **WHEN** the user runs `ontrack --help`
- **THEN** standard output lists the `plan` subcommand
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
The `ontrack` command MUST reject a subcommand it does not know. It writes to standard error a message that names the received command and points to `--help`, and it exits with code `1`.

#### Scenario: Typo
- **WHEN** the user runs `ontrack plann`
- **THEN** standard error names `plann` and mentions `ontrack --help`
- **AND** the exit code is `1`

### Requirement: Shared exit codes
Every `ontrack` subcommand SHALL exit with one of three codes: `0` when there is nothing to do, `2` when changes are pending, `1` on error. No other code is emitted on purpose.

#### Scenario: Subcommand declared but not implemented yet
- **WHEN** the user runs `ontrack plan` before the command is implemented
- **THEN** standard error says that `plan` is not available yet
- **AND** the exit code is `1`
