# apply Specification

## Purpose

`ontrack apply` brings a downstream repository in line with what `ontrack plan` reports, in one command, without ever overwriting a verdict the repository already holds.

## Requirements

### Requirement: Same plan as plan
`ontrack apply` SHALL act only on the plan `ontrack plan` would print for the same project at the same moment. It MUST NOT make any network call, and every file it writes, moves or deletes SHALL be under the project's `docs/adr/`, except the root `AGENTS.md`, which it writes as described in `agents-file`.

#### Scenario: Nothing to apply
- **WHEN** `plan` reports every ADR unchanged, no migration, and nothing about `AGENTS.md`
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
`apply` MUST NOT write to, move or delete a `revised` or `unreadable` ADR, except moving it as part of a migration. It MUST NOT delete a `removed` ADR unless `--prune` is given, and MUST NOT write to an `undetermined` ADR unless `--confirm` names it. In an ADR the repository already holds, `apply` MUST NOT change any line other than `revision:` (see "Confirming undetermined ADRs") and the check line (see "Synchronizing checks"). It MUST NOT commit.

#### Scenario: Revised ADR left alone
- **WHEN** `docs/adr/platform/SDR-0006.md` is `revised`
- **THEN** after `apply` its bytes are unchanged and `apply` exits with `2`

#### Scenario: Revised ADR does not get the new check
- **WHEN** `docs/adr/platform/SDR-0006.md` has `revision: 1` and no check line, and the source ships `revision: 2` and `check: exit 0`
- **THEN** after `apply` its bytes are unchanged

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
`apply` SHALL print, per source, one line per action (`imported`, `moved`, `confirmed`, `synced`, `pruned`, laid out like `plan` lines), then the links to update, then the `AGENTS.md` lines (see `agents-file`), then the `plan` output of what still needs a human, if anything. A `synced` line SHALL be followed by the same `- ` and `+ ` lines `plan` prints for that ADR. With `--dry-run`, the first line SHALL be `dry run: nothing written`. It SHALL exit with `2` when the plan after the run (or, in a dry run, the plan the run would leave) still has pending changes or the `AGENTS.md` block is `skipped` (or, in a dry run, still to create or update), with `0` otherwise, and with `1` on error. Every check on ADR actions SHALL run before the first write, so that an error never leaves a partly applied repository. When at least one ADR under `docs/adr/` is `proposed` after the run, `apply` SHALL write the next step to stderr: the count, then `ontrack review` as a shell command and as a prompt for a coding agent; standard output and the exit code SHALL NOT depend on it. When no ADR is `proposed` and at least one is revised (see the `review` capability), it SHALL write the same lines, counting the revised ADRs to rule again.

#### Scenario: Next step after an import
- **WHEN** `apply` imports three `proposed` ADRs
- **THEN** stderr reads `next: 3 proposed ADRs to rule`, then `  from a shell:  claude "$(npx ontrack review)"`, then ``  as a prompt:   Run `npx ontrack review` and follow its output.``, and standard output and the exit code are what they are without it

#### Scenario: Next step for revised ADRs
- **WHEN** no ADR is `proposed` after the run and one `accepted` ADR is `revised`
- **THEN** stderr starts with `next: 1 revised ADR to rule again`, followed by the same two lines

#### Scenario: No next step
- **WHEN** no ADR under `docs/adr/` is `proposed` or revised after the run
- **THEN** `apply` writes nothing to stderr

#### Scenario: Partly pending
- **WHEN** a source has one `new` and one `revised` ADR
- **THEN** `apply` imports the new one, prints it as `imported`, prints the `revised` line under what remains, and exits with `2`

#### Scenario: Only the rules block to write
- **WHEN** every ADR is unchanged and the `AGENTS.md` block is out of date
- **THEN** `apply` prints `AGENTS.md: rules block updated` and exits with `0`

#### Scenario: Only a check to synchronize
- **WHEN** source `trivoallan` has one `check` ADR, `ADR-0006-commits`, with a local line `check: exit 0` and a source line `check: exit 1`, and everything else is current
- **THEN** `apply` prints `trivoallan: 1 synced`, then `  synced        ADR-0006-commits`, then `    - check: exit 0`, then `    + check: exit 1`, and exits with `0`

#### Scenario: Dry run of a synchronization
- **WHEN** `apply --dry-run` runs on the same project
- **THEN** the output starts with `dry run: nothing written`, names the ADR as `synced` with its `-` and `+` lines, every file is byte-identical afterwards, and the exit code is `0`

### Requirement: Synchronizing checks
For each `check` ADR (see `plan`), `apply` SHALL make the check line of the local copy the same as the source's, with no option needed. When the source has a check line, `apply` SHALL replace the local check line with it, or, when the local copy has none, insert it right after the column-zero `revision:` line of the frontmatter. When the source has none, `apply` SHALL delete the local check line. The written line SHALL end like the other lines of the local file. Nothing else in the file SHALL change: status, traits, date, authors and body stay as the repository wrote them. When the local copy is a flat-layout file, the line SHALL be written after the file has moved. After the run, the ADR is `unchanged`.

#### Scenario: Check added to a ruled ADR
- **WHEN** `docs/adr/trivoallan/ADR-0006-commits.md` is `accepted` with filled-in traits, `revision: 1` and no check line, the source ships `revision: 1` and `check: npx commitlint --last`, and `apply` runs
- **THEN** the file holds `check: npx commitlint --last` on the line after `revision: 1`, and every other line is unchanged
- **AND** a second `plan` reports the ADR as `unchanged`

#### Scenario: Check replaced
- **WHEN** the local copy holds `check: exit 0` and the source ships `check: exit 1  # stricter`
- **THEN** after `apply` the local line is `check: exit 1  # stricter`, at the same place, and every other line is unchanged

#### Scenario: Check removed
- **WHEN** the local copy holds `check: exit 0` and the source has no check line
- **THEN** after `apply` the local copy has no check line and every other line is unchanged

#### Scenario: Windows line endings kept
- **WHEN** the local copy uses CRLF line endings and the source, with LF endings, ships a check line the local copy lacks
- **THEN** the inserted line ends with CRLF and no other line changes

#### Scenario: Flat-layout copy
- **WHEN** `docs/adr/SDR-0006.md` belongs to source `platform`, is up to date, and lacks the check line the source ships
- **THEN** after `apply`, `docs/adr/platform/SDR-0006.md` holds the check line and `docs/adr/SDR-0006.md` no longer exists

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
