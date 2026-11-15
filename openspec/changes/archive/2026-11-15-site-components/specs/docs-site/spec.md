## ADDED Requirements

### Requirement: GitHub alerts render as asides
A blockquote of a Markdown page that opens with a GitHub alert marker SHALL
render as a Starlight aside: `[!NOTE]` and `[!IMPORTANT]` as a note,
`[!TIP]` as a tip, `[!WARNING]` as a caution and `[!CAUTION]` as a danger.
The marker is not shown.

#### Scenario: A warning
- **WHEN** `docs/find-a-track.md` holds a blockquote opening with `[!WARNING]`
- **THEN** its page shows a caution aside with the rest of the blockquote, and no `[!WARNING]` text

### Requirement: MDX pages use Starlight's components
A page under `docs/` written in MDX SHALL be able to import Starlight's
components from `@astrojs/starlight/components`, although the file is
outside `site/`. Its URL is that of a Markdown page with the same name.

#### Scenario: The tutorial
- **WHEN** `docs/tutorial.mdx` imports `Steps` and `FileTree` from `@astrojs/starlight/components`
- **THEN** the site builds, and its page is served at `tutorial/`

### Requirement: llms.txt links the catalogue to the track
`llms.txt` SHALL link each catalogue question to its file in the track's
repository, at the tag of the installed release, not to a path of
ontrack's repository.

#### Scenario: Catalogue entry
- **WHEN** the site is built with ontrack-engineering 0.6.0 installed
- **THEN** `llms.txt` links ADR-0006 to `https://raw.githubusercontent.com/trivoallan/ontrack-engineering/v0.6.0/adr/ADR-0006-commits.md`
