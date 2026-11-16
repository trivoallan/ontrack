# agents-file Specification

## Purpose

Keeps the instructions a repository decided in its ADRs present and current in the root `AGENTS.md`, inside a block ontrack owns, so coding agents read them without anyone pasting anything.

## Requirements

### Requirement: The instructions block
The instructions block SHALL be the exact output of `ontrack instructions` for the project (see `instructions`), from the line `<!-- ontrack:begin -->` to the line `<!-- ontrack:end -->`. It lives in `AGENTS.md` at the project root. Everything between the two markers belongs to ontrack; everything outside them belongs to the repository. The block is needed when at least one ADR is decided or pending, or when `AGENTS.md` already holds a marker.

#### Scenario: Nothing to keep
- **WHEN** the project has no decided and no pending ADR and no `AGENTS.md`
- **THEN** `plan` prints nothing about `AGENTS.md` and `apply` does not create it

### Requirement: Block state
The block state SHALL be one of: `current` (the text between and including the markers equals the instructions block), `out of date` (one marker pair, different text), `missing` (the block is needed and `AGENTS.md` does not exist or holds no marker), or `skipped` (the block cannot be determined or placed). The state is `skipped` when `AGENTS.md` holds a `begin` marker without an `end` after it, an `end` without a `begin` before it, or more than one pair, and when `ontrack instructions` would fail (two decided ADRs sharing a trait key). Line endings SHALL be ignored when comparing.

#### Scenario: Stale block
- **WHEN** `AGENTS.md` holds one marker pair around instructions that no longer match the ADRs
- **THEN** the state is `out of date`

#### Scenario: Two marker pairs
- **WHEN** `AGENTS.md` holds two `<!-- ontrack:begin -->` lines
- **THEN** the state is `skipped`, with a reason naming the markers

#### Scenario: Trait conflict
- **WHEN** two decided ADRs both carry the trait key `commits`
- **THEN** the state is `skipped`, with the same message `ontrack instructions` prints

### Requirement: plan reports the block
After its track lines, `plan` SHALL print one line when the state is not `current`: `AGENTS.md: instructions block missing`, `AGENTS.md: instructions block out of date`, or `AGENTS.md: skipped, <reason>`. It SHALL print nothing about the block when it is `current` or not needed. `plan` MUST NOT write `AGENTS.md`.

#### Scenario: Missing block reported
- **WHEN** an ADR is decided and the project has no `AGENTS.md`
- **THEN** `plan` prints `AGENTS.md: instructions block missing` and exits with `2`

### Requirement: apply writes the block
After its ADR actions, `apply` SHALL compute the instructions block on the resulting tree and, when the state is `out of date` or `missing`, write it: replacing the marker pair and everything between when one pair exists, changing no other byte; appending an empty line and the block to the end of the file when it has no marker; creating `AGENTS.md` with the block alone when the file does not exist. It SHALL keep the line endings of an existing file. It SHALL then print `AGENTS.md: instructions block updated` or `AGENTS.md: instructions block created` (created when the file had no block before). When the state is `skipped`, `apply` SHALL leave `AGENTS.md` untouched, print `AGENTS.md: skipped, <reason>`, and still perform its ADR actions. Running `apply` again SHALL leave `AGENTS.md` byte-identical.

#### Scenario: Block replaced, the rest untouched
- **WHEN** `AGENTS.md` holds text, then a stale block, then more text, and `apply` runs
- **THEN** the block equals the output of `ontrack instructions`, and the text before and after is byte-identical

#### Scenario: Block appended
- **WHEN** `AGENTS.md` exists without markers and an ADR is decided
- **THEN** after `apply` the file is its previous content, an empty line, then the block, and `apply` prints `AGENTS.md: instructions block created`

#### Scenario: File created after an import
- **WHEN** the project has no `AGENTS.md` and `apply` imports a `proposed` ADR
- **THEN** `AGENTS.md` exists and lists that ADR under `Not yet decided`

#### Scenario: Skipped does not stop the ADR actions
- **WHEN** `AGENTS.md` holds two marker pairs and a track ships a new ADR
- **THEN** `apply` imports the ADR, leaves `AGENTS.md` byte-identical, prints `AGENTS.md: skipped, ` followed by the reason, and exits with `2`

#### Scenario: CRLF kept
- **WHEN** `AGENTS.md` uses CRLF line endings and holds a stale block
- **THEN** after `apply` every line of the file, block included, ends with CRLF

### Requirement: Dry run
With `--dry-run`, `apply` MUST NOT write `AGENTS.md`. It SHALL print `AGENTS.md: instructions block to create` or `AGENTS.md: instructions block to update` when the block is `missing` or `out of date` on the current tree, or when the run holds at least one import, move or prune action (which change what the block lists).

#### Scenario: Dry run with an import
- **WHEN** `apply --dry-run` runs on a project with a current block and one new ADR to import
- **THEN** the output holds `AGENTS.md: instructions block to update` and `AGENTS.md` is byte-identical

### Requirement: Warning when Claude Code would not read the block
When the block is needed, and `CLAUDE.md` or `CLAUDE.local.md` exists at the project root, and no line of `CLAUDE.md` is exactly `@AGENTS.md`, `plan` and `apply` SHALL print `AGENTS.md: not read by Claude Code while CLAUDE.md exists; add a line "@AGENTS.md" to CLAUDE.md`. The warning SHALL NOT change the exit code. ontrack MUST NOT write `CLAUDE.md` or `CLAUDE.local.md`.

#### Scenario: CLAUDE.md without the import
- **WHEN** the block is current, `CLAUDE.md` exists and holds no `@AGENTS.md` line
- **THEN** `plan` prints the warning and exits with `0`

#### Scenario: CLAUDE.md with the import
- **WHEN** `CLAUDE.md` holds a line `@AGENTS.md`
- **THEN** no warning is printed
