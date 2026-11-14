# apply Specification

## Purpose

`ontrack apply` brings a downstream repository in line with what `ontrack plan` reports, in one command, without ever overwriting a verdict the repository already holds.

## Requirements

### Requirement: Same plan as plan
`ontrack apply` SHALL act only on the plan `ontrack plan` would print for the same project at the same moment. It MUST NOT make any network call, and every file it writes, moves or deletes SHALL be under the project's `docs/adr/`.

#### Scenario: Nothing to apply
- **WHEN** `plan` reports every ADR unchanged and no migration
- **THEN** `apply` writes nothing, prints the same output as `plan`, and exits with `0`

### Requirement: Importing new ADRs
For each `new` ADR, `apply` SHALL copy the source file to `docs/adr/<alias>/<file>`, byte for byte, creating the directory when needed.

#### Scenario: New ADR imported
- **WHEN** source `platform` ships `SDR-0015.md` and the project has no copy
- **THEN** `docs/adr/platform/SDR-0015.md` exists and is byte-identical to the source file

### Requirement: Flat-layout migration
For each file in a source's migration, `apply` SHALL move `docs/adr/<file>` to `docs/adr/<alias>/<file>`. Inside a git work tree it SHALL use `git mv`, falling back to a plain rename when git refuses (for example an untracked file); outside a git work tree it SHALL rename. The file's content SHALL NOT change.

#### Scenario: Flat files moved with git
- **WHEN** the project is a git repository and `docs/adr/SDR-0006.md` belongs to source `platform`
- **THEN** after `apply`, `git status` reports a rename to `docs/adr/platform/SDR-0006.md`, with identical content

#### Scenario: Outside git
- **WHEN** the project is not a git repository
- **THEN** the file is renamed, with identical content

### Requirement: Links to moved files
After a migration, `apply` SHALL list every link a migration breaks in the project's `*.md` files (outside `node_modules/` and `.git/`): a link whose target, resolved from the file that holds it, is a moved file; and a link held by a moved file whose target is an existing file left in place. A link that stays valid after the move (both ends moved together) SHALL NOT be listed, and a link held by a moved file SHALL be reported at the file's new path. Inline links, images and reference-style definitions SHALL be recognized; anchors and link titles SHALL be ignored when resolving; links inside fenced code blocks and links with a URL scheme SHALL be skipped. Each entry SHALL read `<file>:<line>  <old target> → <new target>`, the new target being relative to the same file. `apply` MUST NOT rewrite any link.

#### Scenario: Inline link listed
- **WHEN** `docs/arc42.md` line 12 holds `[commits](adr/SDR-0006.md#context)` and `SDR-0006.md` moves to `docs/adr/platform/`
- **THEN** the output lists `docs/arc42.md:12  adr/SDR-0006.md → adr/platform/SDR-0006.md`
- **AND** `docs/arc42.md` is unchanged

#### Scenario: Links held by a moved ADR
- **WHEN** `docs/adr/SDR-0006.md` moves to `docs/adr/platform/` and holds `[ten](SDR-0010.md)` and `[local](0001-local.md)`, `SDR-0010.md` moves too and `0001-local.md` stays
- **THEN** the output lists `docs/adr/platform/SDR-0006.md:1  0001-local.md → ../0001-local.md` and does not list the link to `SDR-0010.md`

#### Scenario: Link in a code block ignored
- **WHEN** the only link to a moved file sits inside a fenced code block
- **THEN** no link is listed

### Requirement: Verdicts are never overwritten
`apply` MUST NOT write to, move or delete a `revised` or `unreadable` ADR, except moving it as part of a migration. It MUST NOT delete a `removed` ADR unless `--prune` is given, and MUST NOT write to an `undetermined` ADR unless `--confirm` names it. It MUST NOT commit.

#### Scenario: Revised ADR left alone
- **WHEN** `docs/adr/platform/SDR-0006.md` is `revised`
- **THEN** after `apply` its bytes are unchanged and `apply` exits with `2`

### Requirement: Pruning removed ADRs
With `--prune`, `apply` SHALL delete each `removed` ADR from `docs/adr/<alias>/`. Without it, `removed` ADRs SHALL stay in place.

#### Scenario: Prune
- **WHEN** `docs/adr/platform/SDR-0012.md` is `removed` and `apply --prune` runs
- **THEN** the file no longer exists

### Requirement: Confirming undetermined ADRs
`--confirm <name>` (repeatable) SHALL set, in the named `undetermined` ADR's frontmatter, a column-zero `revision:` line to the upstream revision, replacing an existing one or inserting it right after the `status:` line (or as the first frontmatter line when there is no `status:`). Nothing else in the file SHALL change. `--confirm all` SHALL do the same for every `undetermined` ADR whose upstream copy has a revision. A name that is not an `undetermined` ADR with an upstream revision SHALL make `apply` fail with code `1` before writing anything.

#### Scenario: Confirm one ADR
- **WHEN** `docs/adr/platform/SDR-0003.md` holds `revision: 0`, the source ships `revision: 2`, and `apply --confirm SDR-0003` runs
- **THEN** the file holds `revision: 2` and every other line is unchanged

#### Scenario: Confirm a name that is not undetermined
- **WHEN** `apply --confirm SDR-0006` runs and `SDR-0006` is `revised`
- **THEN** `apply` exits with `1`, names `SDR-0006`, and no file was written

### Requirement: Dry run
With `--dry-run`, `apply` SHALL print exactly what it would do with the same options, and MUST NOT create, modify, move or delete any file.

#### Scenario: Dry run of confirm all
- **WHEN** `apply --confirm all --dry-run` runs on a project with two undetermined ADRs
- **THEN** the output names both ADRs as to be confirmed, and every file is byte-identical afterwards

### Requirement: Output and exit code
`apply` SHALL print, per source, one line per action (`imported`, `moved`, `pruned`, `confirmed`, laid out like `plan` lines), then the links to update, then the `plan` output of what still needs a human, if anything. With `--dry-run`, the first line SHALL be `dry run: nothing written`. It SHALL exit with `2` when the plan after the run (or, in a dry run, the plan the run would leave) still has pending changes, with `0` otherwise, and with `1` on error. Every check SHALL run before the first write, so that an error never leaves a partly applied repository.

#### Scenario: Partly pending
- **WHEN** a source has one `new` and one `revised` ADR
- **THEN** `apply` imports the new one, prints it as `imported`, prints the `revised` line under what remains, and exits with `2`
