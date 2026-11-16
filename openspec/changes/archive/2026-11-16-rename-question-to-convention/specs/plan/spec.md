## MODIFIED Requirements

### Requirement: Exit code
`plan` SHALL exit with `2` when any track has a `new`, `revised`, `removed`, `undetermined`, `unreadable` or `check` ADR, or a migration, or when the `AGENTS.md` instructions block is `missing`, `out of date` or `skipped` (see `agents-file`); with `0` otherwise; and with `1` when tracks cannot be discovered or a track's ADR directory cannot be read.

#### Scenario: Undetermined only
- **WHEN** the only finding is an imported ADR with `revision: 0`
- **THEN** the exit code is `2`

#### Scenario: Missing track ADR directory
- **WHEN** a track declares `"adr": "docs/adr"` but that directory does not exist in the installed package
- **THEN** standard error names the track and the directory
- **AND** the exit code is `1`

#### Scenario: Only the rules block is stale
- **WHEN** every ADR is unchanged and the `AGENTS.md` block is out of date
- **THEN** the exit code is `2`

#### Scenario: Check only
- **WHEN** the only finding is a `check` ADR
- **THEN** the exit code is `2`
