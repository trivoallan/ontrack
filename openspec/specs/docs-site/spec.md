# docs-site Specification

## Purpose
Publishes the Markdown pages kept under `docs/` as a documentation site, so that readers browse, search and follow links between pages without reading them on the forge.

## Requirements

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

#### Scenario: A convention of the installed track becomes a page
- **WHEN** the site is built while `node_modules/engineering/adr/ADR-0008-documentation.md` exists
- **THEN** the built site holds a catalogue page with the title "Documentation" and the content of that file

### Requirement: Page URLs mirror file paths
Each page SHALL be served at the path of its file relative to `docs/`, in lower case and without its extension. An `index.md` file is served at the URL of its directory. A `slug:` key in a page's frontmatter MUST NOT change its URL.

#### Scenario: An ADR that declares a slug
- **WHEN** `docs/adr/trivoallan/ADR-0008-documentation.md` declares `slug: documentation`
- **THEN** its page is served at `adr/trivoallan/adr-0008-documentation/`
- **AND** no page is served at `documentation/`

#### Scenario: Home page
- **WHEN** `docs/index.mdx` exists
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

### Requirement: An ADR page opens with its ruling
The page of an architecture decision record SHALL show, before its body, the status the record declares, as a badge, and, when the record is `accepted` and declares traits, its `traits:` block as written. The status and traits shown MUST be those the `ontrack instructions` command reads. Other pages are unchanged.

#### Scenario: Accepted ADR with traits
- **WHEN** `ADR-0006-commits.md` is `accepted` and declares `commits.tool: commitlint`
- **THEN** its page shows an "accepted" badge and a block holding `tool: commitlint` above the body

#### Scenario: Rejected ADR
- **WHEN** `ADR-0013-frontend.md` is `rejected` and declares no traits
- **THEN** its page shows a "rejected" badge and no traits block

#### Scenario: A page that is not an ADR
- **WHEN** `docs/index.mdx` is built
- **THEN** its page shows no status

### Requirement: Status marks in the navigation
A page whose frontmatter declares a `status:` SHALL carry a coloured dot before its title in the navigation, in the colour of the badge in its page. `accepted` is shown in green and `proposed` in orange. Every other status, `rejected` included, is shown in a neutral colour: it MUST NOT be shown as an error. The status MUST also be present as text next to the dot for assistive technologies, because colour alone does not say it. A page without a `status:` has no dot.

#### Scenario: Navigation of the decision records
- **WHEN** the site is built with 14 `accepted` ADRs and one `rejected`
- **THEN** the navigation shows 14 green dots and one neutral dot, and no status word is visible in it

#### Scenario: Screen reader
- **WHEN** a screen reader reads the navigation link of an `accepted` ADR
- **THEN** it finds the text "accepted" in the link

#### Scenario: Proposed ADR
- **WHEN** an ADR is `proposed`
- **THEN** its dot is orange in the navigation, and its page shows an orange "proposed" badge

#### Scenario: Home page
- **WHEN** `docs/index.mdx` declares no `status:`
- **THEN** its navigation link has no dot

### Requirement: Links between pages
A relative link from one page to another Markdown file under `docs/` SHALL lead to that file's page, with its fragment kept. Links to anything else are left as written.

#### Scenario: Link between two ADRs
- **WHEN** `ADR-0008-documentation.md` links to `ADR-0001-record-architecture-decisions.md` in the same directory
- **THEN** the link on the built page leads to the page of ADR-0001

#### Scenario: Link from the home page
- **WHEN** `docs/index.mdx` links to `adr/trivoallan/ADR-0008-documentation.md`
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

### Requirement: An ADR page shows its reference
The page of an architecture decision record SHALL show, on the line of its status badge, the record's reference as `ontrack instructions` reads it (`<namespace>/<file name without .md>`), as text the site search indexes. Other pages are unchanged.

#### Scenario: Imported ADR
- **WHEN** the page of `docs/adr/trivoallan/ADR-0011-forge-and-ci.md` is built
- **THEN** it shows `trivoallan/ADR-0011-forge-and-ci` next to its badge

#### Scenario: Search by number
- **WHEN** a reader searches the built site for `ADR-0011`
- **THEN** the results hold the page of `trivoallan/ADR-0011-forge-and-ci`

#### Scenario: A page that is not an ADR
- **WHEN** `docs/index.mdx` is built
- **THEN** its page shows no reference

### Requirement: Search ranks the guides and the reference first
For a word they share, the site search SHALL rank the tutorial, the guides and the reference pages before the pages of architecture decision records and of the architecture document. A search for the subject of a record, or for its identifier, SHALL still rank that record first.

#### Scenario: A word of the product
- **WHEN** a reader searches the built site for `exit code`, `install` or `track`
- **THEN** the first result is a guide or a reference page, not the page of a record

#### Scenario: The subject of a record
- **WHEN** a reader searches the built site for `commits`
- **THEN** the first results are the pages of `ADR-0006-commits`

### Requirement: ADR numbers in the navigation
The navigation entry of a page whose frontmatter declares an `adr:` identifier SHALL be that identifier followed by the page's title. The page's own title is unchanged. The source files MUST NOT be edited to obtain it.

#### Scenario: Entry of an ADR
- **WHEN** a file declares `adr: ADR-0011` and `title: Forge and continuous integration`
- **THEN** its navigation entry reads `ADR-0011 Forge and continuous integration` and its page title reads `Forge and continuous integration`

#### Scenario: Entry of another page
- **WHEN** `docs/tutorial.mdx` declares no `adr:`
- **THEN** its navigation entry is its title

### Requirement: Every ADR namespace is in the navigation
The navigation SHALL list the ADRs of every subdirectory of `docs/adr/`, one group per subdirectory, named after it. Adding a namespace MUST NOT require editing a navigation file.

#### Scenario: Own and imported ADRs
- **WHEN** the site is built with ADRs in `docs/adr/local/` and `docs/adr/trivoallan/`
- **THEN** the navigation holds a group `local` and a group `trivoallan`, each listing its ADRs in number order

### Requirement: Renamed pages redirect
When a page of `docs/` is renamed, the site SHALL serve a redirect from its former URL to the new one, so that a link published before the rename still arrives. The pages `find-a-source` and `write-your-own-source` SHALL redirect to `find-a-track` and `write-your-own-track`. The pages `revise-a-question` and `ontrack-engineering/questions` SHALL redirect to `revise-a-convention` and `ontrack-engineering/conventions`. Each page once served under `adr/trivoallan/` SHALL redirect to the page of the same name under `adr/engineering/`.

#### Scenario: A link to the former guide
- **WHEN** a reader opens `/ontrack/write-your-own-source/`
- **THEN** the reader arrives at `/ontrack/write-your-own-track/`

#### Scenario: A link to the former search guide
- **WHEN** a reader opens `/ontrack/find-a-source/`
- **THEN** the reader arrives at `/ontrack/find-a-track/`

#### Scenario: A link to an ADR under its former namespace
- **WHEN** a reader opens `/ontrack/adr/trivoallan/adr-0006-commits/`
- **THEN** the reader arrives at `/ontrack/adr/engineering/adr-0006-commits/`

#### Scenario: A link to the former guide on revising
- **WHEN** a reader opens `/ontrack/revise-a-question/`
- **THEN** the reader arrives at `/ontrack/revise-a-convention/`

#### Scenario: A link to the former list of the track
- **WHEN** a reader opens `/ontrack/ontrack-engineering/questions/`
- **THEN** the reader arrives at `/ontrack/ontrack-engineering/conventions/`

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
`llms.txt` SHALL link each catalogue convention to its file in the track's
repository, at the tag of the installed release, not to a path of
ontrack's repository.

#### Scenario: Catalogue entry
- **WHEN** the site is built with ontrack-engineering 0.6.0 installed
- **THEN** `llms.txt` links ADR-0006 to `https://raw.githubusercontent.com/trivoallan/ontrack-engineering/v0.6.0/adr/ADR-0006-commits.md`
