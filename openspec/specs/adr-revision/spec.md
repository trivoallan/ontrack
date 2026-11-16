# adr-revision Specification

## Purpose

Reads the `revision:` of an inherited ADR from files ontrack did not write, and classifies an imported ADR against its upstream copy so that `plan` can say whether a ruling must be taken again.

## Requirements

### Requirement: Bounded frontmatter
The system SHALL recognize an ADR's frontmatter only when the file's first line is a `---` fence and a closing `---` fence follows before any line that cannot belong to a frontmatter. A line can belong to a frontmatter when it is blank, a `#` comment, a top-level `key:` entry, a `- ` block-sequence item, or an indented continuation. Any other line ends the search, and the frontmatter is then unreadable.

#### Scenario: Well-formed frontmatter
- **WHEN** a file starts with `---`, holds `status: proposed` and `revision: 2`, then a `---` line
- **THEN** its frontmatter is recognized

#### Scenario: Truncated frontmatter followed by an example block
- **WHEN** a file starts with `---`, has no closing fence before a prose line, and later shows a fenced YAML example with its own `---` lines
- **THEN** the frontmatter is unreadable, and the example's fences are never taken for its end

#### Scenario: Block sequence at column zero
- **WHEN** the frontmatter holds `authors:` followed by `- Jane` at column zero
- **THEN** the frontmatter is recognized

### Requirement: Reading the revision
The system SHALL read `revision:` only from the recognized frontmatter, from a top-level line whose value is a non-negative integer. It SHALL return no revision when the frontmatter is unreadable, when the key is absent, or when its value is not an integer.

#### Scenario: Revision present
- **WHEN** the frontmatter holds `revision: 3`
- **THEN** the revision read is `3`

#### Scenario: Revision only in the body
- **WHEN** the frontmatter has no `revision:` and the body shows an example frontmatter holding `revision: 5`
- **THEN** no revision is read

#### Scenario: Non-integer value
- **WHEN** the frontmatter holds `revision: two`
- **THEN** no revision is read

### Requirement: Classifying an imported ADR
The system SHALL classify an imported ADR against its upstream copy, in this order:
1. `unreadable` when the imported ADR's frontmatter is unreadable;
2. `undetermined` when the imported ADR has no revision or a revision of `0`, or when the upstream copy has no revision;
3. `stale` when the imported revision is lower than the upstream revision;
4. `up-to-date` otherwise.

Only `revision:` SHALL be compared. The files' bytes, the ADR's status, its filled-in fields and its local ruling MUST NOT influence the result.

#### Scenario: Upstream moved the convention
- **WHEN** the imported ADR has `revision: 1` and the upstream copy has `revision: 2`
- **THEN** the ADR is `stale`

#### Scenario: Only the local ruling changed
- **WHEN** both copies have `revision: 2`, and the imported one has `status: accepted` and filled-in fields that the upstream copy lacks
- **THEN** the ADR is `up-to-date`

#### Scenario: Revision zero is a flag, not a number
- **WHEN** the imported ADR has `revision: 0` and the upstream copy has `revision: 0`
- **THEN** the ADR is `undetermined`

#### Scenario: No imported revision
- **WHEN** the imported ADR's frontmatter has no `revision:`
- **THEN** the ADR is `undetermined`

#### Scenario: Upstream without revision
- **WHEN** the imported ADR has `revision: 1` and the upstream copy has no `revision:`
- **THEN** the ADR is `undetermined`

#### Scenario: Imported revision ahead of upstream
- **WHEN** the imported ADR has `revision: 3` and the upstream copy has `revision: 2`
- **THEN** the ADR is `up-to-date`

#### Scenario: Unreadable imported ADR
- **WHEN** the imported ADR has no recognizable frontmatter
- **THEN** the ADR is `unreadable`, whatever the upstream copy holds

### Requirement: Reading the title
The system SHALL read an ADR's title from a top-level `title:` key of the recognized frontmatter, with surrounding quotes and whitespace removed. When there is none, it SHALL use the first line of the body that starts with `# `, without the `# ` marker. When that heading starts with the ADR's name followed by `:` (for `ADR-0001.md`, `ADR-0001:`), that prefix and the following whitespace SHALL be removed. It SHALL return no title when neither exists or the result is empty.

#### Scenario: Frontmatter title
- **WHEN** the frontmatter holds `title: Commits`
- **THEN** the title is `Commits`

#### Scenario: Quoted frontmatter title
- **WHEN** the frontmatter holds `title: "Forge and CI"`
- **THEN** the title is `Forge and CI`

#### Scenario: Heading repeating the name
- **WHEN** `ADR-0001.md` has no `title:` and its body starts with `# ADR-0001: Record significant decisions as ADRs`
- **THEN** the title is `Record significant decisions as ADRs`

#### Scenario: Plain heading
- **WHEN** the frontmatter has no `title:` and the body's first heading is `# Software Architecture`
- **THEN** the title is `Software Architecture`

#### Scenario: No title
- **WHEN** the frontmatter has no `title:` and the body has no `# ` heading
- **THEN** no title is read

#### Scenario: Unreadable frontmatter
- **WHEN** the file has no recognizable frontmatter and starts with `# Rules`
- **THEN** the title is `Rules`
