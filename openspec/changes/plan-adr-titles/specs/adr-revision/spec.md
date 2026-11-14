# Spec Delta

## ADDED Requirements

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
