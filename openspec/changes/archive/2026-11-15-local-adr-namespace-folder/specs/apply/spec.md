## ADDED Requirements

### Requirement: Own ADRs migration
For each file of the own ADRs migration `plan` reports, `apply` SHALL move `docs/adr/<file>` to `docs/adr/local/<file>`, creating the directory when needed, in the way and with the output of a source's flat-layout migration: `git mv` inside a git work tree, content unchanged, one `moved` line per file, and the links the move breaks listed as for any migration. It SHALL do so when the project has no source too. When `docs/adr/local/<file>` already exists, `apply` SHALL fail before writing anything, naming both paths. `--dry-run` SHALL list these moves without making them.

#### Scenario: Own ADRs moved with git
- **WHEN** the project is a git repository and `docs/adr/ADR-0001-cache.md` matches no source ADR
- **THEN** after `apply`, `git status` reports a rename to `docs/adr/local/ADR-0001-cache.md`, with identical content
- **AND** a following `plan` reports no migration

#### Scenario: Link to a moved own ADR
- **WHEN** `docs/index.md` line 4 holds `[cache](adr/ADR-0001-cache.md)` and that ADR moves
- **THEN** the output lists `docs/index.md:4  adr/ADR-0001-cache.md → adr/local/ADR-0001-cache.md`

#### Scenario: Link from an own ADR to an imported one
- **WHEN** `docs/adr/ADR-0001-cache.md` holds `[commits](trivoallan/ADR-0006-commits.md)` and moves
- **THEN** the output lists `docs/adr/local/ADR-0001-cache.md:<line>  trivoallan/ADR-0006-commits.md → ../trivoallan/ADR-0006-commits.md`

#### Scenario: Destination taken
- **WHEN** `docs/adr/ADR-0001-cache.md` and `docs/adr/local/ADR-0001-cache.md` both exist
- **THEN** `apply` fails, names both paths, and no file has changed
