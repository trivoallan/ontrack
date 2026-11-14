# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Verdicts are never overwritten
`apply` MUST NOT write to, move or delete a `revised` or `unreadable` ADR, except moving it as part of a migration. It MUST NOT delete a `removed` ADR unless `--prune` is given, and MUST NOT write to an `undetermined` ADR unless `--confirm` names it. In an ADR the repository already holds, `apply` MUST NOT change any line other than `revision:` (see "Confirming undetermined ADRs") and the check line (see "Synchronizing checks"). It MUST NOT commit.

#### Scenario: Revised ADR left alone
- **WHEN** `docs/adr/platform/SDR-0006.md` is `revised`
- **THEN** after `apply` its bytes are unchanged and `apply` exits with `2`

#### Scenario: Revised ADR does not get the new check
- **WHEN** `docs/adr/platform/SDR-0006.md` has `revision: 1` and no check line, and the source ships `revision: 2` and `check: exit 0`
- **THEN** after `apply` its bytes are unchanged

### Requirement: Output and exit code
`apply` SHALL print, per source, one line per action (`imported`, `moved`, `confirmed`, `synced`, `pruned`, laid out like `plan` lines), then the links to update, then the `AGENTS.md` lines (see `agents-file`), then the `plan` output of what still needs a human, if anything. A `synced` line SHALL be followed by the same `- ` and `+ ` lines `plan` prints for that ADR. With `--dry-run`, the first line SHALL be `dry run: nothing written`. It SHALL exit with `2` when the plan after the run (or, in a dry run, the plan the run would leave) still has pending changes or the `AGENTS.md` block is `skipped` (or, in a dry run, still to create or update), with `0` otherwise, and with `1` on error. Every check on ADR actions SHALL run before the first write, so that an error never leaves a partly applied repository.

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
