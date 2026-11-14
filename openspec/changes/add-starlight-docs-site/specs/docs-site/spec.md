# Spec Delta

## Purpose

Publishes the Markdown pages kept under `docs/` as a documentation site, so that readers browse, search and follow links between pages without reading them on the forge.

## ADDED Requirements

### Requirement: Pages come from docs/
The documentation site SHALL build one page for every Markdown file under `docs/`, read in place. A file is never copied or moved to become a page, and building the site MUST NOT modify any file under `docs/`.

#### Scenario: An ADR becomes a page
- **WHEN** the site is built while `docs/adr/trivoallan/ADR-0008-documentation.md` exists
- **THEN** the built site holds a page with the title "Documentation" and the content of that file

#### Scenario: The build leaves docs/ untouched
- **WHEN** the site is built
- **THEN** `git status` reports no change under `docs/`

#### Scenario: A page without a title
- **WHEN** a Markdown file under `docs/` has no `title:` in its frontmatter
- **THEN** the build fails and names that file

### Requirement: Page URLs mirror file paths
Each page SHALL be served at the path of its file relative to `docs/`, in lower case and without its extension. An `index.md` file is served at the URL of its directory. A `slug:` key in a page's frontmatter MUST NOT change its URL.

#### Scenario: An ADR that declares a slug
- **WHEN** `docs/adr/trivoallan/ADR-0008-documentation.md` declares `slug: documentation`
- **THEN** its page is served at `adr/trivoallan/adr-0008-documentation/`
- **AND** no page is served at `documentation/`

#### Scenario: Home page
- **WHEN** `docs/index.md` exists
- **THEN** it is served at the root of the site

### Requirement: Navigation follows the directory tree
The site SHALL generate its navigation from the directory tree under `docs/`. Adding a page MUST NOT require editing a navigation file.

#### Scenario: A page is added
- **WHEN** a Markdown file with a `title:` is added under `docs/` and the site is rebuilt
- **THEN** the navigation lists that page under its directory
- **AND** no other file was edited

### Requirement: One title per page
A page SHALL show its title once. When the body of a file opens with a level-one heading, that heading is not rendered in addition to the title taken from the frontmatter.

#### Scenario: An ADR with a heading that repeats its title
- **WHEN** a file has `title: Documentation` and its body opens with `# Documentation`
- **THEN** its page holds exactly one level-one heading

### Requirement: Links between pages
A relative link from one page to another Markdown file under `docs/` SHALL lead to that file's page, with its fragment kept. Links to anything else are left as written.

#### Scenario: Link between two ADRs
- **WHEN** `ADR-0008-documentation.md` links to `ADR-0001-record-architecture-decisions.md` in the same directory
- **THEN** the link on the built page leads to the page of ADR-0001

#### Scenario: Link from the home page
- **WHEN** `docs/index.md` links to `adr/trivoallan/ADR-0008-documentation.md`
- **THEN** the link on the home page leads to the page of ADR-0008

#### Scenario: External link
- **WHEN** a page links to `https://diataxis.fr/`
- **THEN** the link is unchanged

### Requirement: Mermaid diagrams
A fenced code block marked `mermaid` SHALL be rendered as a diagram in the reader's browser.

#### Scenario: A page with a diagram
- **WHEN** a page holds a `mermaid` code block and is opened in a browser
- **THEN** the diagram is drawn in place of the code

### Requirement: Internal links are checked
The site build MUST fail when a built page holds an internal link that leads to no built page or file, and name the page and the link.

#### Scenario: Broken link
- **WHEN** a page links to `ADR-9999-missing.md`, which does not exist
- **THEN** the build exits with a non-zero code
- **AND** its output names the page and the link

#### Scenario: Every link resolves
- **WHEN** every internal link leads to a built page
- **THEN** the build exits with code `0`

### Requirement: The site is isolated from the CLI package
The site SHALL be a separate Node.js project. Installing, testing and publishing the `ontrack` package MUST NOT install the site's dependencies, and the package MUST NOT ship any file of the site.

#### Scenario: CLI installed on Node 20.19
- **WHEN** `npm ci` and `node --test` run at the root of the repository on Node 20.19
- **THEN** no dependency of the site is installed
- **AND** the tests pass

#### Scenario: Package content
- **WHEN** `npm pack --dry-run` runs at the root of the repository
- **THEN** it lists no file of the site

### Requirement: Continuous integration builds the site
Continuous integration SHALL build the site, with its link check, on every pull request and on every push to `main`. A failed build is a failed check.

#### Scenario: Pull request that breaks a link
- **WHEN** a pull request adds a page with a broken internal link
- **THEN** the site check of that pull request fails

### Requirement: The site is published from main
A push to `main` SHALL publish the built site to GitHub Pages. A pull request MUST NOT publish anything.

#### Scenario: Merge to main
- **WHEN** a commit is pushed to `main` and the site builds
- **THEN** the site served by GitHub Pages reflects that commit

#### Scenario: Pull request
- **WHEN** a pull request is opened
- **THEN** the site is built and nothing is published
