## MODIFIED Requirements

### Requirement: Pages come from docs/
The documentation site SHALL build one page for every Markdown file under `docs/`, read in place, and one catalogue page for every Markdown file of the ADR directory of each catalogued track, read in place where npm installed it. A file is never copied or moved to become a page, and building the site MUST NOT modify any file under `docs/`.

#### Scenario: An ADR becomes a page
- **WHEN** the site is built while `docs/adr/engineering/ADR-0008-documentation.md` exists
- **THEN** the built site holds a page with the title "Documentation" and the content of that file

#### Scenario: The build leaves docs/ untouched
- **WHEN** the site is built
- **THEN** `git status` reports no change under `docs/`

#### Scenario: A page without a title
- **WHEN** a Markdown file under `docs/` has no `title:` in its frontmatter
- **THEN** the build fails and names that file

#### Scenario: A convention of the installed track becomes a page
- **WHEN** the site is built while `node_modules/engineering/adr/ADR-0008-documentation.md` exists
- **THEN** the built site holds a catalogue page with the title "Documentation" and the content of that file

#### Scenario: A convention of a second installed track becomes a page
- **WHEN** the site is built while `node_modules/security/adr/ADR-0004-secrets.md` exists
- **THEN** the built site holds a catalogue page with the title of that file and its content

### Requirement: llms.txt links the catalogue to the track
`llms.txt` SHALL link each catalogue convention to its file in its track's
repository, as the `repository` key of the track's installed `package.json`
names it, at the tag `v<version>` of the installed release, not to a path of
ontrack's repository.

#### Scenario: Catalogue entry
- **WHEN** the site is built with ontrack-engineering 0.6.0 installed
- **THEN** `llms.txt` links ADR-0006 to `https://raw.githubusercontent.com/trivoallan/ontrack-engineering/v0.6.0/adr/ADR-0006-commits.md`

#### Scenario: Catalogue entry of a second track
- **WHEN** the site is built with ontrack-security 1.0.0 installed, whose `repository` is `git+https://github.com/example/ontrack-security.git`
- **THEN** `llms.txt` links its ADR-0004 to `https://raw.githubusercontent.com/example/ontrack-security/v1.0.0/adr/ADR-0004-secrets.md`
