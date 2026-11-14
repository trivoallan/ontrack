# plan Specification

## Purpose

`ontrack plan` tells a downstream repository, per source, which inherited ADRs need a human (new, revised, removed, undetermined, unreadable, or waiting to move out of a flat layout), without modifying anything.

## Requirements

### Requirement: Read-only and offline
`ontrack plan` MUST NOT create, modify or delete any file, and MUST NOT make any network call. It reads the project's `package.json`, `node_modules` and `docs/adr/` only.

#### Scenario: Tree unchanged
- **WHEN** `ontrack plan` runs on a project with revised, new and flat-layout ADRs
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed

### Requirement: Source ADRs and their local copy
For each source, the source's ADRs SHALL be the `*.md` files placed directly in its ADR directory. An ADR is identified by its file name. Its local copy SHALL be `docs/adr/<alias>/<file>` when it exists, otherwise `docs/adr/<file>` (historical flat layout) when that exists, otherwise there is none.

#### Scenario: Namespaced copy wins over a flat one
- **WHEN** both `docs/adr/platform/SDR-0006.md` and `docs/adr/SDR-0006.md` exist for source `platform`
- **THEN** the namespaced copy is compared, and `SDR-0006.md` is not part of a migration

#### Scenario: Subdirectories are ignored
- **WHEN** the source's ADR directory holds `templates/example.md`
- **THEN** `example` is not a source ADR

### Requirement: Classification
Each source ADR SHALL be classified as:
- `new` when it has no local copy;
- `revised` when its local copy is `stale` against it (see `adr-revision`);
- `undetermined` or `unreadable` when the comparison says so;
- `unchanged` when the local copy is `up-to-date`.

Each `*.md` file in `docs/adr/<alias>/` that the source no longer ships SHALL be classified as `removed`. Files directly under `docs/adr/` that match no source ADR are the project's own ADRs and SHALL be ignored.

#### Scenario: Revised upstream
- **WHEN** the local copy has `revision: 1` and the source ships `revision: 2`
- **THEN** the ADR is `revised`

#### Scenario: Shipped no more
- **WHEN** `docs/adr/platform/SDR-0012.md` exists and source `platform` no longer ships it
- **THEN** `SDR-0012` is `removed`

#### Scenario: Project's own ADR
- **WHEN** `docs/adr/0001-use-postgres.md` exists and no source ships that file
- **THEN** it appears nowhere in the output

### Requirement: Flat-layout migration
When at least one source ADR's local copy is a flat-layout file, `plan` SHALL report a migration for that source: one summary line, then one indented line per file, sorted by name.

#### Scenario: Historical downstream repository
- **WHEN** `docs/adr/SDR-0006.md` and `docs/adr/SDR-0010.md` match ADRs shipped by source `platform`, and `docs/adr/platform/` does not exist
- **THEN** the output holds `migration: 2 files docs/adr/ → docs/adr/platform/`, then `  move          SDR-0006.md` and `  move          SDR-0010.md`

### Requirement: Output format
The output SHALL follow the contract in the README, per source, sources sorted by alias:
1. `<alias>: <counts>`, with counts in the order revised, new, removed, undetermined, unreadable, unchanged, zero counts omitted except `unchanged`;
2. one line per ADR that is not `unchanged`, sorted by name: two spaces, the category left-aligned in a 12-character column, two spaces, the file name without `.md`; for `revised`, followed by two spaces and `revision <local> → <upstream>`;
3. the migration lines, when there are any: `migration: <n> file(s) docs/adr/ → docs/adr/<alias>/`, then one line per file laid out like an ADR line, with `move` as the category and the full file name.

When the project has no source, `plan` SHALL print `no ontrack source found` and exit with `0`.

#### Scenario: Nothing to do
- **WHEN** every ADR of source `platform` is up to date and nothing needs to move
- **THEN** the output is exactly `platform: 14 unchanged`
- **AND** the exit code is `0`

#### Scenario: Mixed source
- **WHEN** source `platform` has 2 revised ADRs, 1 new one and 11 unchanged
- **THEN** the first line is `platform: 2 revised, 1 new, 11 unchanged`, followed by the three indented ADR lines

#### Scenario: No source
- **WHEN** the project has no dependency carrying an `ontrack` key
- **THEN** the output is `no ontrack source found` and the exit code is `0`

### Requirement: Exit code
`plan` SHALL exit with `2` when any source has a `new`, `revised`, `removed`, `undetermined` or `unreadable` ADR, or a migration; with `0` otherwise; and with `1` when sources cannot be discovered or a source's ADR directory cannot be read.

#### Scenario: Undetermined only
- **WHEN** the only finding is an imported ADR with `revision: 0`
- **THEN** the exit code is `2`

#### Scenario: Missing source ADR directory
- **WHEN** a source declares `"adr": "docs/adr"` but that directory does not exist in the installed package
- **THEN** standard error names the source and the directory
- **AND** the exit code is `1`
