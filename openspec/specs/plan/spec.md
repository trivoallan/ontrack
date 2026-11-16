# plan Specification

## Purpose

`ontrack plan` tells a downstream repository, per track, which inherited ADRs need a human (new, revised, removed, undetermined, unreadable, or waiting to move out of a flat layout), without modifying anything.

## Requirements

### Requirement: Read-only and offline
`ontrack plan` MUST NOT create, modify or delete any file, and MUST NOT make any network call. It reads the project's `package.json`, `node_modules`, `docs/adr/`, and the root `AGENTS.md`, `CLAUDE.md` and `CLAUDE.local.md` only.

#### Scenario: Tree unchanged
- **WHEN** `ontrack plan` runs on a project with revised, new and flat-layout ADRs
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed

### Requirement: Track ADRs and their local copy
For each track, the track's ADRs SHALL be the `*.md` files placed directly in its ADR directory. An ADR is identified by its file name. Its local copy SHALL be `docs/adr/<alias>/<file>` when it exists, otherwise `docs/adr/<file>` (historical flat layout) when that exists, otherwise there is none.

#### Scenario: Namespaced copy wins over a flat one
- **WHEN** both `docs/adr/platform/SDR-0006.md` and `docs/adr/SDR-0006.md` exist for track `platform`
- **THEN** the namespaced copy is compared, and `SDR-0006.md` is not part of a migration

#### Scenario: Subdirectories are ignored
- **WHEN** the track's ADR directory holds `templates/example.md`
- **THEN** `example` is not a track ADR

### Requirement: Classification
Each track ADR SHALL be classified as:
- `new` when it has no local copy;
- `revised` when its local copy is `stale` against it (see `adr-revision`);
- `undetermined` or `unreadable` when the comparison says so;
- `check` when the local copy is `up-to-date` and its check line differs from the track's;
- `unchanged` when the local copy is `up-to-date` and both check lines are the same.

An ADR's check line SHALL be the first line of its recognized frontmatter (see `adr-revision`) that starts with `check:` at column zero, without its trailing whitespace. An ADR without such a line has no check line. Two check lines are the same when both are absent or both are present and equal.

Each `*.md` file in `docs/adr/<alias>/` that the track no longer ships SHALL be classified as `removed`. The `*.md` files of `docs/adr/local/` are the project's own ADRs and SHALL be ignored. Files directly under `docs/adr/` that match no track ADR are own ADRs in a historical layout: they SHALL NOT be classified, and are reported as a migration (see Own ADRs migration).

#### Scenario: Revised upstream
- **WHEN** the local copy has `revision: 1` and the track ships `revision: 2`
- **THEN** the ADR is `revised`

#### Scenario: Shipped no more
- **WHEN** `docs/adr/platform/SDR-0012.md` exists and track `platform` no longer ships it
- **THEN** `SDR-0012` is `removed`

#### Scenario: Project's own ADR
- **WHEN** `docs/adr/local/0001-use-postgres.md` exists
- **THEN** it appears nowhere in the output

#### Scenario: Own ADR in the historical layout
- **WHEN** `docs/adr/0001-use-postgres.md` exists and no track ships that file
- **THEN** it carries no category and appears only in the migration to `docs/adr/local/`

#### Scenario: Check added upstream
- **WHEN** both copies have `revision: 1`, the local copy is `accepted` with filled-in traits and no `check:` line, and the track ships `check: npx commitlint --last`
- **THEN** the ADR is `check`

#### Scenario: Check changed upstream
- **WHEN** both copies have `revision: 1`, the local copy holds `check: exit 0` and the track ships `check: exit 1`
- **THEN** the ADR is `check`

#### Scenario: Check removed upstream
- **WHEN** both copies have `revision: 1`, the local copy holds `check: exit 0` and the track ships no `check:` line
- **THEN** the ADR is `check`

#### Scenario: Same check, different ruling
- **WHEN** both copies have `revision: 1` and `check: exit 0`, and the local copy has `status: accepted` where the track has `status: proposed`
- **THEN** the ADR is `unchanged`

#### Scenario: Revised wins over check
- **WHEN** the local copy has `revision: 1` and no `check:` line, and the track ships `revision: 2` and `check: exit 0`
- **THEN** the ADR is `revised`, not `check`

#### Scenario: A check line in the body is not one
- **WHEN** both copies have `revision: 1`, neither frontmatter has a `check:` line, and the track's body shows `check: exit 0` in an example
- **THEN** the ADR is `unchanged`

### Requirement: Flat-layout migration
When at least one track ADR's local copy is a flat-layout file, `plan` SHALL report a migration for that track: one summary line, then one indented line per file, sorted by name.

#### Scenario: Historical downstream repository
- **WHEN** `docs/adr/SDR-0006.md` and `docs/adr/SDR-0010.md` match ADRs shipped by track `platform`, and `docs/adr/platform/` does not exist
- **THEN** the output holds `migration: 2 files docs/adr/ → docs/adr/platform/`, then `  move          SDR-0006.md` and `  move          SDR-0010.md`

### Requirement: Output format
The output SHALL follow the contract in the commands reference, `docs/commands.md`, per track, tracks sorted by alias:
1. `<alias>: <counts>`, with counts in the order revised, new, removed, undetermined, unreadable, check, unchanged, zero counts omitted except `unchanged`;
2. one line per ADR that is not `unchanged`, sorted by name: two spaces, the category left-aligned in a 12-character column, two spaces, the file name without `.md`, then two spaces and the ADR's title when it has one (see `adr-revision`); for `revised`, followed by ` (revision <local> → <upstream>)`. The title SHALL be read from the track's copy, or from the local copy for a `removed` ADR;
3. after a `check` ADR's line: when the local copy has a check line, four spaces, `- ` and that line; then, when the track has a check line, four spaces, `+ ` and that line;
4. the rename line, when there is one: `rename: docs/adr/<old>/ → docs/adr/<alias>/`;
5. the migration lines, when there are any: `migration: <n> file(s) docs/adr/ → docs/adr/<alias>/`, then one line per file laid out like an ADR line, with `move` as the category and the full file name.

When the project has no track, `plan` SHALL print `no track found`, and SHALL write to stderr `next: install a track`, then `  npm i -D <alias>@npm:<track-package>`; standard output and the exit code are what they are without it. After the track lines, `plan` SHALL print the `AGENTS.md` lines described in `agents-file`, when there are any.

#### Scenario: Nothing to do
- **WHEN** every ADR of track `platform` is up to date, nothing needs to move, and the `AGENTS.md` instructions block is current
- **THEN** the output is exactly `platform: 14 unchanged`
- **AND** the exit code is `0`

#### Scenario: Mixed track
- **WHEN** track `platform` has 2 revised ADRs, 1 new one and 11 unchanged
- **THEN** the first line is `platform: 2 revised, 1 new, 11 unchanged`, followed by the three indented ADR lines

#### Scenario: No track
- **WHEN** the project has no dependency carrying an `ontrack` key
- **THEN** the output starts with `no track found`
- **AND** stderr reads `next: install a track`, then `  npm i -D <alias>@npm:<track-package>`
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

### Requirement: Exit code
`plan` SHALL exit with `2` when any track has a `new`, `revised`, `removed`, `undetermined`, `unreadable` or `check` ADR, or a migration, or when the `AGENTS.md` instructions block is `missing`, `out of date` or `skipped` (see `agents-file`); with `0` otherwise; and with `1` when tracks cannot be discovered or a track's ADR directory cannot be read.

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

### Requirement: Full listing
`ontrack plan` SHALL accept an `--all` option. Without it, the output SHALL be exactly what the `Output format` requirement describes. With it, the output SHALL differ in two ways only:

1. each `unchanged` ADR gets a line too, so that every ADR of a track has one, sorted by name whatever its category;
2. every ADR line carries a status column between the category and the file name: two spaces, the category left-aligned in a 12-character column, two spaces, the status left-aligned in a 10-character column, two spaces, then the file name and what follows it as in `Output format`.

The summary line, the `- ` and `+ ` lines under a `check` ADR, the migration lines and the `AGENTS.md` lines SHALL be the same with and without `--all`. A line SHALL NOT end with spaces.

#### Scenario: Unchanged ADRs are listed
- **WHEN** track `platform` ships `SDR-0001.md` and `SDR-0002.md`, both unchanged and `accepted` in the repository, and `ontrack plan --all` runs
- **THEN** the output is `platform: 2 unchanged`, then `  unchanged     accepted    SDR-0001` and `  unchanged     accepted    SDR-0002`, each followed by the ADR's title when it has one

#### Scenario: Categories are interleaved by name
- **WHEN** `SDR-0001` is unchanged, `SDR-0002` is revised from 1 to 2 and `SDR-0003` is unchanged, all three `accepted`, and `ontrack plan --all` runs
- **THEN** the ADR lines come in the order `SDR-0001`, `SDR-0002`, `SDR-0003`
- **AND** the `SDR-0002` line starts with `  revised       accepted    SDR-0002` and ends with `(revision 1 → 2)`

#### Scenario: Output without the option is untouched
- **WHEN** `ontrack plan` runs without `--all` on a track with revised, new and unchanged ADRs
- **THEN** the output has no line for an unchanged ADR and no status column

#### Scenario: Check lines keep their place
- **WHEN** `ADR-0006-commits` is `check` and `accepted`, and `ontrack plan --all` runs
- **THEN** its line is `  check         accepted    ADR-0006-commits`, followed by the same `- ` and `+ ` lines as without `--all`

### Requirement: Status of an ADR
The status of an ADR SHALL be the value of the first column-zero `status:` line in the recognized frontmatter (see `adr-revision`) of the repository's copy, without surrounding whitespace and without a trailing ` # comment`. The track's copy SHALL NOT be read for it. The status SHALL be `-` when the ADR has no local copy, when the copy's frontmatter is not recognized, or when it has no `status:` line or an empty one.

#### Scenario: Rejected ADR
- **WHEN** `docs/adr/trivoallan/ADR-0013-frontend.md` has `status: rejected` and is unchanged, and `ontrack plan --all` runs
- **THEN** its line is `  unchanged     rejected    ADR-0013-frontend`

#### Scenario: Local status, not the track's
- **WHEN** the local copy has `status: accepted` and the track ships the same ADR with `status: proposed`
- **THEN** the status is `accepted`

#### Scenario: Trailing comment
- **WHEN** the local copy holds `status: accepted     # proposed as shipped; accepted or rejected once ruled`
- **THEN** the status is `accepted`

#### Scenario: New ADR has no status
- **WHEN** a track ships an ADR the repository has no copy of, and `ontrack plan --all` runs
- **THEN** its line starts with `  new           -           `

#### Scenario: Unreadable copy has no status
- **WHEN** the local copy has no recognizable frontmatter
- **THEN** the ADR is `unreadable` and its status is `-`

#### Scenario: Removed ADR keeps its status
- **WHEN** `docs/adr/platform/SDR-0012.md` has `status: accepted` and track `platform` no longer ships it
- **THEN** its line starts with `  removed       accepted    SDR-0012`

### Requirement: Exit code is independent of the listing
The exit code of `ontrack plan --all` SHALL be the one `ontrack plan` returns on the same repository.

#### Scenario: Nothing to do
- **WHEN** every ADR is unchanged, nothing needs to move, the `AGENTS.md` instructions block is current, and `ontrack plan --all` runs
- **THEN** the exit code is `0`

#### Scenario: Rejected ADR does not change the code
- **WHEN** the only ADR that is not `accepted` is an unchanged `rejected` one
- **THEN** the exit code is `0`

#### Scenario: Pending change
- **WHEN** one ADR is revised and `ontrack plan --all` runs
- **THEN** the exit code is `2`

### Requirement: Own ADRs migration
When at least one `*.md` file directly under `docs/adr/` matches no track ADR, `plan` SHALL report a migration of the project's own ADRs: after the lines of every track, the line `migration: <n> file(s) docs/adr/ → docs/adr/local/`, then one line per file laid out like the lines of a track's migration, sorted by name. This migration SHALL be reported when the project has no track too, after the line that says so. It SHALL count toward the exit code as a track's flat-layout migration does. `plan --all` SHALL report it the same way.

#### Scenario: Own ADRs to move
- **WHEN** `docs/adr/ADR-0001-cache.md` and `docs/adr/ADR-0002-queue.md` match no track ADR
- **THEN** the output ends with `migration: 2 files docs/adr/ → docs/adr/local/`, then `  move          ADR-0001-cache.md` and `  move          ADR-0002-queue.md`

#### Scenario: Own ADRs already in place
- **WHEN** every own ADR is in `docs/adr/local/`
- **THEN** the output holds no migration to `docs/adr/local/`

#### Scenario: No track
- **WHEN** the project has no track and `docs/adr/ADR-0001-cache.md` exists
- **THEN** the output holds `migration: 1 file docs/adr/ → docs/adr/local/` and `  move          ADR-0001-cache.md`

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
