## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Unknown command
The `ontrack` command MUST reject a subcommand it does not know. It writes to standard error a message that carries the code `E001` (see *Error codes*), names the received command and points to `--help`, and it exits with code `1`.

#### Scenario: Typo
- **WHEN** the user runs `ontrack plann`
- **THEN** standard error names `plann` and mentions `ontrack --help`
- **AND** the exit code is `1`
