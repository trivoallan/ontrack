# instructions Specification

## Purpose

`ontrack instructions` gathers the traits a repository has decided in its ADRs into a single block for coding agents, ready to paste into `AGENTS.md`, and lists the ADRs still waiting for a ruling.

## Requirements

### Requirement: Read-only and offline
`ontrack instructions` MUST NOT create, modify or delete any file, and MUST NOT make any network call. It reads `docs/adr/` only. It needs no `package.json` and no `node_modules`.

#### Scenario: Tree unchanged
- **WHEN** `ontrack instructions` runs on a project with decided and pending ADRs
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed

### Requirement: ADRs read
The ADRs SHALL be the `*.md` files placed directly in `docs/adr/`, referred to as `local/<file name without .md>`, and the `*.md` files placed directly in each subdirectory `docs/adr/<namespace>/`, referred to as `<namespace>/<file name without .md>`. Deeper files are ignored. Without a `docs/adr/` directory, there is no ADR. An ADR whose frontmatter is unreadable (see `adr-revision`) is ignored.

#### Scenario: Imported and own ADRs
- **WHEN** `docs/adr/trivoallan/ADR-0006-commits.md` and `docs/adr/ADR-0010-release.md` exist
- **THEN** they are referred to as `trivoallan/ADR-0006-commits` and `local/ADR-0010-release`

#### Scenario: Shipped ADRs are not read
- **WHEN** source `trivoallan` ships `ADR-0006-commits.md` in `node_modules` and the project has no copy of it
- **THEN** that ADR appears nowhere in the output

### Requirement: Status and supersession
An ADR's status SHALL be the value of its frontmatter `status:` key, with a trailing `# comment` removed. An ADR's identifier SHALL be its frontmatter `adr:` value, or its file name without `.md` when it has none. An `accepted` ADR supersedes every ADR named in its `supersedes:` key, written as a flow list (`[A, B]`) or as indented `- A` lines. A plain name matches ADRs in the superseding ADR's own directory by identifier; `<namespace>/<name>` matches in `docs/adr/<namespace>/`, and `local/<name>` in `docs/adr/`. A superseded ADR carries no decision.

#### Scenario: Superseded across namespaces
- **WHEN** `local/ADR-0012-commits` is `accepted` with `supersedes: [trivoallan/ADR-0006]`, and `docs/adr/trivoallan/ADR-0006-commits.md` has `adr: ADR-0006` and is `accepted`
- **THEN** only `local/ADR-0012-commits` contributes its traits

#### Scenario: A proposed ADR supersedes nothing
- **WHEN** `local/ADR-0012-commits` is `proposed` with `supersedes: [trivoallan/ADR-0006]`
- **THEN** `trivoallan/ADR-0006-commits` still contributes its traits

### Requirement: Decided traits
An ADR SHALL carry decided traits when it is `accepted`, is not superseded, and its frontmatter has a `traits:` line at column zero followed by at least one indented, non-blank line. The traits block SHALL be those indented lines, up to the first non-blank line that is not indented, with trailing blank lines removed and the first line's indentation removed from every line. The values are copied as written and never interpreted. `traits: {}` declares no trait. Any other value on the `traits:` line itself MUST be an error, with exit code `1`, that names the ADR's file.

#### Scenario: Ruled governance ADR
- **WHEN** `docs/adr/trivoallan/ADR-0006-commits.md` is `accepted` with `traits:`, `  commits:`, `    scopes: [api, cli, docs]`, `    tool: commitlint`
- **THEN** its traits block is `commits:`, `  scopes: [api, cli, docs]`, `  tool: commitlint`

#### Scenario: Accepted without traits
- **WHEN** an `accepted` ADR has no `traits:` line
- **THEN** it does not appear in the output

#### Scenario: Rejected ADR
- **WHEN** an ADR is `rejected`
- **THEN** it does not appear in the output, whatever its frontmatter holds

#### Scenario: Inline traits
- **WHEN** an `accepted` ADR's frontmatter holds `traits: {commits: {tool: commitlint}}`
- **THEN** the command fails with exit code `1` and an error that names the ADR's file

### Requirement: Pending decisions
An ADR whose status is `proposed` SHALL be listed as not yet decided, whatever its `traits:` block holds. ADRs with any other status SHALL be ignored.

#### Scenario: Shipped and not ruled yet
- **WHEN** `docs/adr/trivoallan/ADR-0002-localization.md` is `proposed` with empty trait keys
- **THEN** it is listed under "Not yet decided", and its traits are not printed

### Requirement: Conflicting traits
A trait key is identified by its path: the `<key>:` lines of the dedented traits block, each joined with `.` to the keys it is indented under (for example `architecture.pattern`); list items are not keys. A leaf is a path with no key indented under it. Two ADRs carrying decided traits conflict when a leaf of one is a path of the other: both decide the same key, or one gives a value to a key under which the other nests keys. Sharing a parent key alone is not a conflict. On a conflict, `ontrack instructions` MUST fail with exit code `1`. Standard error names the conflicting path and both ADRs, and says that superseding one of them settles the conflict. Standard output stays empty.

#### Scenario: Two decided ADRs, one key
- **WHEN** `trivoallan/ADR-0006-commits` and `local/ADR-0012-commits` are both `accepted`, not superseded, and both declare `commits.tool`
- **THEN** standard error names `commits.tool`, `local/ADR-0012-commits`, `trivoallan/ADR-0006-commits` and `supersedes`
- **AND** standard output is empty and the exit code is `1`

#### Scenario: One parent key, different subkeys
- **WHEN** one decided ADR declares `architecture.pattern` and another declares `architecture.document`
- **THEN** there is no conflict, and both ADRs are printed

#### Scenario: A value where the other nests keys
- **WHEN** one decided ADR declares `architecture: hexagonal` and another declares `architecture.document`
- **THEN** the command fails with exit code `1`, and standard error names `architecture`

### Requirement: Output format
The output SHALL follow the contract in the README, as lines:
1. `<!-- ontrack:begin -->`, then `## Project rules (ontrack)`, then an empty line;
2. for each ADR carrying decided traits, sorted by reference: `### <title> (<reference>)`, an empty line, a line holding three backticks followed by `yaml`, the traits block, a line holding three backticks, then an empty line. The title is read as in `adr-revision`; without one, the heading is the reference alone;
3. when at least one ADR is pending: `### Not yet decided`, an empty line, one line `- <title> (<reference>)` per pending ADR sorted by reference, then an empty line;
4. `<!-- ontrack:end -->`.

The output SHALL be the same for the same files, whatever the order the file system lists them in. With no decided and no pending ADR, the block SHALL still be printed, reduced to items 1 and 4. On success the exit code SHALL be `0`.

#### Scenario: One decided, one pending
- **WHEN** `trivoallan/ADR-0006-commits` (title `Commits`) is `accepted` with the traits block `commits:`, `  scopes: [api, cli, docs]`, `  tool: commitlint`, and `trivoallan/ADR-0002-localization` (title `Localization`) is `proposed`
- **THEN** the output is the README example, byte for byte
- **AND** the exit code is `0`

#### Scenario: Nothing decided, nothing pending
- **WHEN** the project has no `docs/adr/` directory
- **THEN** the output is exactly `<!-- ontrack:begin -->`, `## Project rules (ontrack)`, an empty line and `<!-- ontrack:end -->`
- **AND** the exit code is `0`
