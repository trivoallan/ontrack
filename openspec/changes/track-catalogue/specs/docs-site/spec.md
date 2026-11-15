## MODIFIED Requirements

### Requirement: Pages come from docs/
The documentation site SHALL build one page for every Markdown file under `docs/`, read in place, and one catalogue page for every Markdown file of `node_modules/trivoallan/adr/`, read in place. A file is never copied or moved to become a page, and building the site MUST NOT modify any file under `docs/`.

#### Scenario: An ADR becomes a page
- **WHEN** the site is built while `docs/adr/trivoallan/ADR-0008-documentation.md` exists
- **THEN** the built site holds a page with the title "Documentation" and the content of that file

#### Scenario: The build leaves docs/ untouched
- **WHEN** the site is built
- **THEN** `git status` reports no change under `docs/`

#### Scenario: A page without a title
- **WHEN** a Markdown file under `docs/` has no `title:` in its frontmatter
- **THEN** the build fails and names that file

#### Scenario: A question of the installed track becomes a page
- **WHEN** the site is built while `node_modules/trivoallan/adr/ADR-0008-documentation.md` exists
- **THEN** the built site holds a catalogue page with the title "Documentation" and the content of that file
