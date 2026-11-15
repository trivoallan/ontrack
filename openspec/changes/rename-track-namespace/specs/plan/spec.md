## ADDED Requirements

### Requirement: Namespace rename
`plan` SHALL report a rename for a track when `docs/adr/<alias>/` does not exist and exactly one folder directly under `docs/adr/` is an orphan holding at least one `*.md` file the track ships under the same name. An orphan is a folder that is neither `local` nor the alias of an installed track. `plan` SHALL then classify the track's ADRs against the copies in the orphan folder, as it would if that folder were `docs/adr/<alias>/`: an ADR of the orphan folder that the track no longer ships is `removed`. A flat-layout migration SHALL NOT be reported for a file the orphan folder holds. A rename SHALL count as a pending change for the exit code.

`plan` SHALL fail, with exit code `1` and a message naming the folders and the track, when two orphan folders qualify for the same track; and, naming the folder and the tracks, when one orphan folder qualifies for two tracks.

#### Scenario: Alias changed
- **WHEN** the package once installed as `trivoallan` is now installed as `engineering`, `docs/adr/trivoallan/` holds its 26 ADRs, all up to date, and `docs/adr/engineering/` does not exist
- **THEN** the output is `engineering: 26 unchanged`, then `rename: docs/adr/trivoallan/ → docs/adr/engineering/`
- **AND** the exit code is `2`

#### Scenario: Rename with a revised ADR
- **WHEN** the same rename is pending and the track ships `ADR-0009-branching.md` at `revision: 2` while `docs/adr/trivoallan/` holds it at `revision: 1`
- **THEN** `ADR-0009-branching` is `revised (revision 1 → 2)`, and the rename line follows the ADR lines

#### Scenario: Folder of a track still installed
- **WHEN** `docs/adr/platform/` exists and `platform` is still an installed track
- **THEN** `docs/adr/platform/` is not a rename candidate for any other track

#### Scenario: No shared file
- **WHEN** `docs/adr/archive/` is an orphan folder that holds no file the track ships
- **THEN** no rename is reported, and the track's ADRs are `new`

#### Scenario: Two candidate folders
- **WHEN** `docs/adr/old/` and `docs/adr/older/` are orphan folders that both hold `ADR-0001-record-architecture-decisions.md`, shipped by track `engineering`, which has no folder
- **THEN** `plan` fails with a message naming `docs/adr/old/`, `docs/adr/older/` and `engineering`
- **AND** the exit code is `1`

## MODIFIED Requirements

### Requirement: Output format
The output SHALL follow the contract in the commands reference, `docs/commands.md`, per track, tracks sorted by alias:
1. `<alias>: <counts>`, with counts in the order revised, new, removed, undetermined, unreadable, check, unchanged, zero counts omitted except `unchanged`;
2. one line per ADR that is not `unchanged`, sorted by name: two spaces, the category left-aligned in a 12-character column, two spaces, the file name without `.md`, then two spaces and the ADR's title when it has one (see `adr-revision`); for `revised`, followed by ` (revision <local> → <upstream>)`. The title SHALL be read from the track's copy, or from the local copy for a `removed` ADR;
3. after a `check` ADR's line: when the local copy has a check line, four spaces, `- ` and that line; then, when the track has a check line, four spaces, `+ ` and that line;
4. the rename line, when there is one: `rename: docs/adr/<old>/ → docs/adr/<alias>/`;
5. the migration lines, when there are any: `migration: <n> file(s) docs/adr/ → docs/adr/<alias>/`, then one line per file laid out like an ADR line, with `move` as the category and the full file name.

When the project has no track, `plan` SHALL print `no track found`. After the track lines, `plan` SHALL print the `AGENTS.md` lines described in `agents-file`, when there are any.

#### Scenario: Nothing to do
- **WHEN** every ADR of track `platform` is up to date, nothing needs to move, and the `AGENTS.md` rules block is current
- **THEN** the output is exactly `platform: 14 unchanged`
- **AND** the exit code is `0`

#### Scenario: Mixed track
- **WHEN** track `platform` has 2 revised ADRs, 1 new one and 11 unchanged
- **THEN** the first line is `platform: 2 revised, 1 new, 11 unchanged`, followed by the three indented ADR lines

#### Scenario: No track
- **WHEN** the project has no dependency carrying an `ontrack` key
- **THEN** the output starts with `no track found`
- **AND** the exit code is `0` when the project has no ADR of its own

#### Scenario: New ADR with its title
- **WHEN** track `trivoallan` ships `ADR-0001.md` whose first heading is `# ADR-0001: Record significant decisions as ADRs`, and the project has no copy
- **THEN** the ADR line is `  new           ADR-0001  Record significant decisions as ADRs`

#### Scenario: Revised ADR with its title
- **WHEN** track `platform` ships `SDR-0006.md` with `title: Commits` and `revision: 2`, and the local copy has `revision: 1`
- **THEN** the ADR line is `  revised       SDR-0006  Commits (revision 1 → 2)`

#### Scenario: Removed ADR keeps a title
- **WHEN** `docs/adr/platform/SDR-0012.md` has `title: Hosting` and track `platform` no longer ships it
- **THEN** the ADR line is `  removed       SDR-0012  Hosting`

#### Scenario: ADR without a title
- **WHEN** a new ADR has neither a `title:` key nor a `# ` heading
- **THEN** its line ends with its name, with no trailing spaces

#### Scenario: Check changed upstream
- **WHEN** track `trivoallan` ships 14 ADRs, 13 unchanged, and `ADR-0006-commits` is `check` with a local line `check: exit 0` and a track line `check: npx commitlint --last`
- **THEN** the output is `trivoallan: 1 check, 13 unchanged`, then `  check         ADR-0006-commits`, then `    - check: exit 0`, then `    + check: npx commitlint --last`

#### Scenario: Check added upstream
- **WHEN** a `check` ADR's local copy has no check line and the track ships `check: exit 0`
- **THEN** its ADR line is followed by `    + check: exit 0` only

#### Scenario: Check removed upstream
- **WHEN** a `check` ADR's local copy holds `check: exit 0` and the track has no check line
- **THEN** its ADR line is followed by `    - check: exit 0` only

#### Scenario: Rename line
- **WHEN** a rename of `docs/adr/trivoallan/` is pending for track `engineering`, with one `new` ADR
- **THEN** the output is `engineering: 1 new, 26 unchanged`, the `new` line, then `rename: docs/adr/trivoallan/ → docs/adr/engineering/`
