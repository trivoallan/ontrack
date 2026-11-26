## ADDED Requirements

### Requirement: Unresolved supersedes entries
`plan` SHALL report every `supersedes:` entry of an `accepted` ADR under `docs/adr/` that designates no ADR. An entry designates the ADRs whose `adr:` identifier, or else file name without `.md`, equals it, in the folder of the ADR that holds it, or in the namespace it names before a `/`. After the last track, `plan` SHALL print `supersedes: <n> reference(s) to no ADR`, then one line per entry, sorted by reference: two spaces, `unresolved` in a 12-character column, two spaces, the reference of the ADR that holds it, ` supersedes `, and the entry as written. When the ADRs cannot be read, `plan` SHALL print no such line.

#### Scenario: An entry with a slug
- **WHEN** `docs/adr/local/ADR-0002-new.md` is accepted with `supersedes: [ADR-0001-old]` and `docs/adr/local/ADR-0001-old.md` holds `adr: ADR-0001`
- **THEN** `plan` prints `supersedes: 1 reference to no ADR` and `  unresolved    local/ADR-0002-new supersedes ADR-0001-old`
- **AND** the exit code is `2`

#### Scenario: Every entry resolves
- **WHEN** every `supersedes:` entry designates an ADR
- **THEN** `plan` prints no `supersedes:` line

## MODIFIED Requirements

### Requirement: Exit code
`plan` SHALL exit with `2` when any track has a `new`, `revised`, `removed`, `undetermined`, `unreadable` or `check` ADR, or a migration, or when a `supersedes:` entry designates no ADR, or when the `AGENTS.md` instructions block is `missing`, `out of date` or `skipped` (see `agents-file`); with `0` otherwise; and with `1` when tracks cannot be discovered or a track's ADR directory cannot be read.

#### Scenario: Undetermined only
- **WHEN** the only finding is an imported ADR with `revision: 0`
- **THEN** the exit code is `2`

#### Scenario: Missing track ADR directory
- **WHEN** a track declares `"adr": "docs/adr"` but that directory does not exist in the installed package
- **THEN** standard error names the track and the directory
- **AND** the exit code is `1`

#### Scenario: Only the instructions block is stale
- **WHEN** every ADR is unchanged and the `AGENTS.md` block is out of date
- **THEN** the exit code is `2`

#### Scenario: Check only
- **WHEN** the only finding is a `check` ADR
- **THEN** the exit code is `2`

#### Scenario: Unresolved supersedes only
- **WHEN** the only finding is a `supersedes:` entry that designates no ADR
- **THEN** the exit code is `2`
