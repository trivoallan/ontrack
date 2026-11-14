## ADDED Requirements

### Requirement: Full listing
`ontrack plan` SHALL accept an `--all` option. Without it, the output SHALL be exactly what the `Output format` requirement describes. With it, the output SHALL differ in two ways only:

1. each `unchanged` ADR gets a line too, so that every ADR of a source has one, sorted by name whatever its category;
2. every ADR line carries a verdict column between the category and the file name: two spaces, the category left-aligned in a 12-character column, two spaces, the verdict left-aligned in a 10-character column, two spaces, then the file name and what follows it as in `Output format`.

The summary line, the `- ` and `+ ` lines under a `check` ADR, the migration lines and the `AGENTS.md` lines SHALL be the same with and without `--all`. A line SHALL NOT end with spaces.

#### Scenario: Unchanged ADRs are listed
- **WHEN** source `platform` ships `SDR-0001.md` and `SDR-0002.md`, both unchanged and `accepted` in the repository, and `ontrack plan --all` runs
- **THEN** the output is `platform: 2 unchanged`, then `  unchanged     accepted    SDR-0001` and `  unchanged     accepted    SDR-0002`, each followed by the ADR's title when it has one

#### Scenario: Categories are interleaved by name
- **WHEN** `SDR-0001` is unchanged, `SDR-0002` is revised from 1 to 2 and `SDR-0003` is unchanged, all three `accepted`, and `ontrack plan --all` runs
- **THEN** the ADR lines come in the order `SDR-0001`, `SDR-0002`, `SDR-0003`
- **AND** the `SDR-0002` line starts with `  revised       accepted    SDR-0002` and ends with `(revision 1 → 2)`

#### Scenario: Output without the option is untouched
- **WHEN** `ontrack plan` runs without `--all` on a source with revised, new and unchanged ADRs
- **THEN** the output has no line for an unchanged ADR and no verdict column

#### Scenario: Check lines keep their place
- **WHEN** `ADR-0006-commits` is `check` and `accepted`, and `ontrack plan --all` runs
- **THEN** its line is `  check         accepted    ADR-0006-commits`, followed by the same `- ` and `+ ` lines as without `--all`

### Requirement: Verdict of an ADR
The verdict of an ADR SHALL be the value of the first column-zero `status:` line in the recognized frontmatter (see `adr-revision`) of the repository's copy, without surrounding whitespace and without a trailing ` # comment`. The source's copy SHALL NOT be read for it. The verdict SHALL be `-` when the ADR has no local copy, when the copy's frontmatter is not recognized, or when it has no `status:` line or an empty one.

#### Scenario: Rejected ADR
- **WHEN** `docs/adr/trivoallan/ADR-0013-frontend.md` has `status: rejected` and is unchanged, and `ontrack plan --all` runs
- **THEN** its line is `  unchanged     rejected    ADR-0013-frontend`

#### Scenario: Local verdict, not the source's
- **WHEN** the local copy has `status: accepted` and the source ships the same ADR with `status: proposed`
- **THEN** the verdict is `accepted`

#### Scenario: Trailing comment
- **WHEN** the local copy holds `status: accepted     # proposed as shipped; accepted or rejected once ruled`
- **THEN** the verdict is `accepted`

#### Scenario: New ADR has no verdict
- **WHEN** a source ships an ADR the repository has no copy of, and `ontrack plan --all` runs
- **THEN** its line starts with `  new           -           `

#### Scenario: Unreadable copy has no verdict
- **WHEN** the local copy has no recognizable frontmatter
- **THEN** the ADR is `unreadable` and its verdict is `-`

#### Scenario: Removed ADR keeps its verdict
- **WHEN** `docs/adr/platform/SDR-0012.md` has `status: accepted` and source `platform` no longer ships it
- **THEN** its line starts with `  removed       accepted    SDR-0012`

### Requirement: Exit code is independent of the listing
The exit code of `ontrack plan --all` SHALL be the one `ontrack plan` returns on the same repository.

#### Scenario: Nothing to do
- **WHEN** every ADR is unchanged, nothing needs to move, the `AGENTS.md` rules block is current, and `ontrack plan --all` runs
- **THEN** the exit code is `0`

#### Scenario: Rejected ADR does not change the code
- **WHEN** the only ADR that is not `accepted` is an unchanged `rejected` one
- **THEN** the exit code is `0`

#### Scenario: Pending change
- **WHEN** one ADR is revised and `ontrack plan --all` runs
- **THEN** the exit code is `2`
