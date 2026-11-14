# Spec Delta

## REMOVED Requirements

### Requirement: Shared exit codes
**Reason**: Its only scenario described `plan` as not implemented yet, which this change makes false.
**Migration**: Replaced by "Exit codes shared by subcommands", same rule, with scenarios on the real `plan`.

## ADDED Requirements

### Requirement: Exit codes shared by subcommands
Every `ontrack` subcommand SHALL exit with one of three codes: `0` when there is nothing to do, `2` when changes are pending, `1` on error. No other code is emitted on purpose.

#### Scenario: Pending changes
- **WHEN** the user runs `ontrack plan` in a project where a source revised an imported ADR
- **THEN** the exit code is `2`

#### Scenario: Error
- **WHEN** the user runs `ontrack plan` in a directory without a `package.json`
- **THEN** standard error explains the problem
- **AND** the exit code is `1`
