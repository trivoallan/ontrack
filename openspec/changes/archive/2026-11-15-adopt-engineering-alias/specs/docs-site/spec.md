## MODIFIED Requirements

### Requirement: Pages come from docs/
The documentation site SHALL build one page for every Markdown file under `docs/`, read in place, and one catalogue page for every Markdown file of `node_modules/engineering/adr/`, read in place. A file is never copied or moved to become a page, and building the site MUST NOT modify any file under `docs/`.

#### Scenario: An ADR becomes a page
- **WHEN** the site is built while `docs/adr/engineering/ADR-0008-documentation.md` exists
- **THEN** the built site holds a page with the title "Documentation" and the content of that file

#### Scenario: The build leaves docs/ untouched
- **WHEN** the site is built
- **THEN** `git status` reports no change under `docs/`

#### Scenario: A page without a title
- **WHEN** a Markdown file under `docs/` has no `title:` in its frontmatter
- **THEN** the build fails and names that file

#### Scenario: A question of the installed track becomes a page
- **WHEN** the site is built while `node_modules/engineering/adr/ADR-0008-documentation.md` exists
- **THEN** the built site holds a catalogue page with the title "Documentation" and the content of that file

### Requirement: Renamed pages redirect
When a page of `docs/` is renamed, the site SHALL serve a redirect from its former URL to the new one, so that a link published before the rename still arrives. The pages `find-a-source` and `write-your-own-source` SHALL redirect to `find-a-track` and `write-your-own-track`. Each page once served under `adr/trivoallan/` SHALL redirect to the page of the same name under `adr/engineering/`.

#### Scenario: A link to the former guide
- **WHEN** a reader opens `/ontrack/write-your-own-source/`
- **THEN** the reader arrives at `/ontrack/write-your-own-track/`

#### Scenario: A link to the former search guide
- **WHEN** a reader opens `/ontrack/find-a-source/`
- **THEN** the reader arrives at `/ontrack/find-a-track/`

#### Scenario: A link to an ADR under its former namespace
- **WHEN** a reader opens `/ontrack/adr/trivoallan/adr-0006-commits/`
- **THEN** the reader arrives at `/ontrack/adr/engineering/adr-0006-commits/`
