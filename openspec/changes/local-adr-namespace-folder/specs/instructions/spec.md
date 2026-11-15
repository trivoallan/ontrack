## MODIFIED Requirements

### Requirement: ADRs read
The ADRs SHALL be the `*.md` files placed directly in each subdirectory `docs/adr/<namespace>/`, referred to as `<namespace>/<file name without .md>`. The repository's own ADRs are those of `docs/adr/local/`. The `*.md` files placed directly in `docs/adr/` are own ADRs in a historical layout: they SHALL still be read, and referred to as `local/<file name without .md>`. When the same file name exists both directly in `docs/adr/` and in `docs/adr/local/`, the command SHALL fail with an error on standard error that names both paths, and exit with code `1`. Deeper files are ignored. Without a `docs/adr/` directory, there is no ADR. An ADR whose frontmatter is unreadable (see `adr-revision`) is ignored.

#### Scenario: Imported and own ADRs
- **WHEN** `docs/adr/trivoallan/ADR-0006-commits.md` and `docs/adr/local/ADR-0010-release.md` exist
- **THEN** they are referred to as `trivoallan/ADR-0006-commits` and `local/ADR-0010-release`

#### Scenario: Own ADR in the historical layout
- **WHEN** `docs/adr/ADR-0010-release.md` exists and `docs/adr/local/` does not
- **THEN** it is referred to as `local/ADR-0010-release`

#### Scenario: Same file name in both places
- **WHEN** `docs/adr/ADR-0010-release.md` and `docs/adr/local/ADR-0010-release.md` both exist
- **THEN** standard error names both paths and the exit code is `1`

#### Scenario: Shipped ADRs are not read
- **WHEN** source `trivoallan` ships `ADR-0006-commits.md` in `node_modules` and the project has no copy of it
- **THEN** that ADR appears nowhere in the output
