# Spec Delta

## MODIFIED Requirements

### Requirement: Command help
The `ontrack` command SHALL print to standard output a help text listing its subcommands, including `plan` and `instructions`, and exit with code `0`, when run with `--help`, `-h`, or no argument.

#### Scenario: Help requested explicitly
- **WHEN** the user runs `ontrack --help`
- **THEN** standard output lists the `plan` and `instructions` subcommands
- **AND** the exit code is `0`

#### Scenario: No argument
- **WHEN** the user runs `ontrack` with no argument
- **THEN** the same help is printed
- **AND** the exit code is `0`
