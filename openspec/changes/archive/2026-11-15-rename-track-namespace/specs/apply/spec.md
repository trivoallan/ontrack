## ADDED Requirements

### Requirement: Namespace rename
For a track whose plan reports a rename (see `plan`), `apply` SHALL move the old folder to `docs/adr/<alias>/` as a whole, before any other action on that track, so that every later action runs on the moved copies. Inside a git work tree it SHALL use `git mv`, falling back to a plain rename when git refuses; outside a git work tree it SHALL rename. No file's content SHALL change, and files the track no longer ships SHALL move with the others. `apply` SHALL print the action as `renamed` in the track's counts and as a line `  renamed       docs/adr/<old>/ → docs/adr/<alias>/`, before the other action lines. With `--dry-run`, nothing SHALL move.

#### Scenario: Rulings kept
- **WHEN** the package once installed as `trivoallan` is now installed as `engineering`, and `docs/adr/trivoallan/ADR-0009-branching.md` is `accepted` with `model: github-flow`
- **THEN** after `apply`, `docs/adr/engineering/ADR-0009-branching.md` is byte-identical to the old file, `docs/adr/trivoallan/` no longer exists, and `plan` prints `engineering: 26 unchanged`

#### Scenario: Rename with git
- **WHEN** the project is a git repository
- **THEN** `git status` reports each file of the folder as renamed to `docs/adr/engineering/`

#### Scenario: Rename then import
- **WHEN** a rename is pending and the track ships one ADR the old folder lacks
- **THEN** the output reads `engineering: 1 renamed, 1 imported`, then the `renamed` line, then the `imported` line, and the new ADR is written in `docs/adr/engineering/`

#### Scenario: Dry run of a rename
- **WHEN** `apply --dry-run` runs with a rename pending
- **THEN** the output starts with `dry run: nothing written`, holds the `renamed` line, and `docs/adr/trivoallan/` is unchanged

### Requirement: Superseding entries naming the old namespace
After a rename, `apply` SHALL list every `supersedes:` entry of an ADR under `docs/adr/` that reads `<old>/<adr>`, under a line `supersedes to update:`, one per entry: `  <file>:<line>  <old>/<adr> → <alias>/<adr>`, the file being reported at its path after the run. `apply` MUST NOT rewrite any entry.

#### Scenario: Local ADR superseding a renamed one
- **WHEN** `docs/adr/local/ADR-0024-the-engineering-track-skips-the-cooldown.md` line 8 reads `supersedes: [local/ADR-0023, trivoallan/ADR-0018, trivoallan/ADR-0020]` and `trivoallan` is renamed to `engineering`
- **THEN** the output lists `  docs/adr/local/ADR-0024-the-engineering-track-skips-the-cooldown.md:8  trivoallan/ADR-0018 → engineering/ADR-0018` and the same for `ADR-0020`, and nothing for `local/ADR-0023`
- **AND** the file is unchanged

#### Scenario: Bare name not listed
- **WHEN** an ADR inside the renamed folder supersedes `ADR-0003`, a bare name
- **THEN** no entry is listed for it

## MODIFIED Requirements

### Requirement: Links to moved files
After a migration or a rename, `apply` SHALL list every link a move breaks in the project's `*.md` files (outside `node_modules/` and `.git/`): a link whose target, resolved from the file that holds it, is a moved file; and a link held by a moved file whose target is an existing file left in place. A file of a renamed folder SHALL count as moved, from its old path to its path under `docs/adr/<alias>/`. A link that stays valid after the move (both ends moved together) SHALL NOT be listed, and a link held by a moved file SHALL be reported at the file's new path. Inline links, images and reference-style definitions SHALL be recognized; anchors and link titles SHALL be ignored when resolving; links inside fenced code blocks and links with a URL scheme SHALL be skipped. Each entry SHALL read `<file>:<line>  <old target> → <new target>`, the new target being relative to the same file. `apply` MUST NOT rewrite any link.

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

#### Scenario: Link into a renamed folder
- **WHEN** `docs/adr/local/ADR-0001-propose-changes-from-labelled-issues.md` line 20 holds `[ADR-0014](../trivoallan/ADR-0014-work-tracking.md)` and `trivoallan` is renamed to `engineering`
- **THEN** the output lists `docs/adr/local/ADR-0001-propose-changes-from-labelled-issues.md:20  ../trivoallan/ADR-0014-work-tracking.md → ../engineering/ADR-0014-work-tracking.md`

#### Scenario: Links inside the renamed folder
- **WHEN** `docs/adr/trivoallan/ADR-0002-localization.md` links to `ADR-0001-record-architecture-decisions.md` in the same folder
- **THEN** no link is listed for it
