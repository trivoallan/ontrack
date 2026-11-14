# Spec Delta

## MODIFIED Requirements

### Requirement: Read-only and offline
`ontrack plan` MUST NOT create, modify or delete any file, and MUST NOT make any network call. It reads the project's `package.json`, `node_modules`, `docs/adr/`, and the root `AGENTS.md`, `CLAUDE.md` and `CLAUDE.local.md` only.

#### Scenario: Tree unchanged
- **WHEN** `ontrack plan` runs on a project with revised, new and flat-layout ADRs
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed

### Requirement: Exit code
`plan` SHALL exit with `2` when any source has a `new`, `revised`, `removed`, `undetermined` or `unreadable` ADR, or a migration, or when the `AGENTS.md` rules block is `missing`, `out of date` or `skipped` (see `agents-file`); with `0` otherwise; and with `1` when sources cannot be discovered or a source's ADR directory cannot be read.

#### Scenario: Undetermined only
- **WHEN** the only finding is an imported ADR with `revision: 0`
- **THEN** the exit code is `2`

#### Scenario: Missing source ADR directory
- **WHEN** a source declares `"adr": "docs/adr"` but that directory does not exist in the installed package
- **THEN** standard error names the source and the directory
- **AND** the exit code is `1`

#### Scenario: Only the rules block is stale
- **WHEN** every ADR is unchanged and the `AGENTS.md` block is out of date
- **THEN** the exit code is `2`

### Requirement: Output format
The output SHALL follow the contract in the README, per source, sources sorted by alias:
1. `<alias>: <counts>`, with counts in the order revised, new, removed, undetermined, unreadable, unchanged, zero counts omitted except `unchanged`;
2. one line per ADR that is not `unchanged`, sorted by name: two spaces, the category left-aligned in a 12-character column, two spaces, the file name without `.md`, then two spaces and the ADR's title when it has one (see `adr-revision`); for `revised`, followed by ` (revision <local> → <upstream>)`. The title SHALL be read from the source's copy, or from the local copy for a `removed` ADR;
3. the migration lines, when there are any: `migration: <n> file(s) docs/adr/ → docs/adr/<alias>/`, then one line per file laid out like an ADR line, with `move` as the category and the full file name.

When the project has no source, `plan` SHALL print `no ontrack source found`. After the source lines, `plan` SHALL print the `AGENTS.md` lines described in `agents-file`, when there are any.

#### Scenario: Nothing to do
- **WHEN** every ADR of source `platform` is up to date, nothing needs to move, and the `AGENTS.md` rules block is current
- **THEN** the output is exactly `platform: 14 unchanged`
- **AND** the exit code is `0`

#### Scenario: Mixed source
- **WHEN** source `platform` has 2 revised ADRs, 1 new one and 11 unchanged
- **THEN** the first line is `platform: 2 revised, 1 new, 11 unchanged`, followed by the three indented ADR lines

#### Scenario: No source
- **WHEN** the project has no dependency carrying an `ontrack` key
- **THEN** the output starts with `no ontrack source found`
- **AND** the exit code is `0` when the project has no ADR of its own

#### Scenario: New ADR with its title
- **WHEN** source `trivoallan` ships `ADR-0001.md` whose first heading is `# ADR-0001: Record significant decisions as ADRs`, and the project has no copy
- **THEN** the ADR line is `  new           ADR-0001  Record significant decisions as ADRs`

#### Scenario: Revised ADR with its title
- **WHEN** source `platform` ships `SDR-0006.md` with `title: Commits` and `revision: 2`, and the local copy has `revision: 1`
- **THEN** the ADR line is `  revised       SDR-0006  Commits (revision 1 → 2)`

#### Scenario: Removed ADR keeps a title
- **WHEN** `docs/adr/platform/SDR-0012.md` has `title: Hosting` and source `platform` no longer ships it
- **THEN** the ADR line is `  removed       SDR-0012  Hosting`

#### Scenario: ADR without a title
- **WHEN** a new ADR has neither a `title:` key nor a `# ` heading
- **THEN** its line ends with its name, with no trailing spaces
