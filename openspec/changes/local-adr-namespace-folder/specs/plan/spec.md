## MODIFIED Requirements

### Requirement: Classification
Each source ADR SHALL be classified as:
- `new` when it has no local copy;
- `revised` when its local copy is `stale` against it (see `adr-revision`);
- `undetermined` or `unreadable` when the comparison says so;
- `check` when the local copy is `up-to-date` and its check line differs from the source's;
- `unchanged` when the local copy is `up-to-date` and both check lines are the same.

An ADR's check line SHALL be the first line of its recognized frontmatter (see `adr-revision`) that starts with `check:` at column zero, without its trailing whitespace. An ADR without such a line has no check line. Two check lines are the same when both are absent or both are present and equal.

Each `*.md` file in `docs/adr/<alias>/` that the source no longer ships SHALL be classified as `removed`. The `*.md` files of `docs/adr/local/` are the project's own ADRs and SHALL be ignored. Files directly under `docs/adr/` that match no source ADR are own ADRs in a historical layout: they SHALL NOT be classified, and are reported as a migration (see Own ADRs migration).

#### Scenario: Revised upstream
- **WHEN** the local copy has `revision: 1` and the source ships `revision: 2`
- **THEN** the ADR is `revised`

#### Scenario: Shipped no more
- **WHEN** `docs/adr/platform/SDR-0012.md` exists and source `platform` no longer ships it
- **THEN** `SDR-0012` is `removed`

#### Scenario: Project's own ADR
- **WHEN** `docs/adr/local/0001-use-postgres.md` exists
- **THEN** it appears nowhere in the output

#### Scenario: Own ADR in the historical layout
- **WHEN** `docs/adr/0001-use-postgres.md` exists and no source ships that file
- **THEN** it carries no category and appears only in the migration to `docs/adr/local/`

#### Scenario: Check added upstream
- **WHEN** both copies have `revision: 1`, the local copy is `accepted` with filled-in traits and no `check:` line, and the source ships `check: npx commitlint --last`
- **THEN** the ADR is `check`

#### Scenario: Check changed upstream
- **WHEN** both copies have `revision: 1`, the local copy holds `check: exit 0` and the source ships `check: exit 1`
- **THEN** the ADR is `check`

#### Scenario: Check removed upstream
- **WHEN** both copies have `revision: 1`, the local copy holds `check: exit 0` and the source ships no `check:` line
- **THEN** the ADR is `check`

#### Scenario: Same check, different verdict
- **WHEN** both copies have `revision: 1` and `check: exit 0`, and the local copy has `status: accepted` where the source has `status: proposed`
- **THEN** the ADR is `unchanged`

#### Scenario: Revised wins over check
- **WHEN** the local copy has `revision: 1` and no `check:` line, and the source ships `revision: 2` and `check: exit 0`
- **THEN** the ADR is `revised`, not `check`

#### Scenario: A check line in the body is not one
- **WHEN** both copies have `revision: 1`, neither frontmatter has a `check:` line, and the source's body shows `check: exit 0` in an example
- **THEN** the ADR is `unchanged`

## ADDED Requirements

### Requirement: Own ADRs migration
When at least one `*.md` file directly under `docs/adr/` matches no source ADR, `plan` SHALL report a migration of the project's own ADRs: after the lines of every source, the line `migration: <n> file(s) docs/adr/ → docs/adr/local/`, then one line per file laid out like the lines of a source's migration, sorted by name. This migration SHALL be reported when the project has no source too, after the line that says so. It SHALL count toward the exit code as a source's flat-layout migration does. `plan --all` SHALL report it the same way.

#### Scenario: Own ADRs to move
- **WHEN** `docs/adr/ADR-0001-cache.md` and `docs/adr/ADR-0002-queue.md` match no source ADR
- **THEN** the output ends with `migration: 2 files docs/adr/ → docs/adr/local/`, then `  move          ADR-0001-cache.md` and `  move          ADR-0002-queue.md`

#### Scenario: Own ADRs already in place
- **WHEN** every own ADR is in `docs/adr/local/`
- **THEN** the output holds no migration to `docs/adr/local/`

#### Scenario: No source
- **WHEN** the project has no source and `docs/adr/ADR-0001-cache.md` exists
- **THEN** the output holds `migration: 1 file docs/adr/ → docs/adr/local/` and `  move          ADR-0001-cache.md`
