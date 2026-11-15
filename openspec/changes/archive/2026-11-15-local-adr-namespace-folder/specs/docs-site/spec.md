## ADDED Requirements

### Requirement: An ADR page shows its reference
The page of an architecture decision record SHALL show, on the line of its status badge, the record's reference as `ontrack instructions` reads it (`<namespace>/<file name without .md>`), as text the site search indexes. Other pages are unchanged.

#### Scenario: Imported ADR
- **WHEN** the page of `docs/adr/trivoallan/ADR-0011-forge-and-ci.md` is built
- **THEN** it shows `trivoallan/ADR-0011-forge-and-ci` next to its badge

#### Scenario: Search by number
- **WHEN** a reader searches the built site for `ADR-0011`
- **THEN** the results hold the page of `trivoallan/ADR-0011-forge-and-ci`

#### Scenario: A page that is not an ADR
- **WHEN** `docs/index.md` is built
- **THEN** its page shows no reference

### Requirement: ADR numbers in the navigation
The navigation entry of a page whose frontmatter declares an `adr:` identifier SHALL be that identifier followed by the page's title. The page's own title is unchanged. The source files MUST NOT be edited to obtain it.

#### Scenario: Entry of an ADR
- **WHEN** a file declares `adr: ADR-0011` and `title: Forge and continuous integration`
- **THEN** its navigation entry reads `ADR-0011 Forge and continuous integration` and its page title reads `Forge and continuous integration`

#### Scenario: Entry of another page
- **WHEN** `docs/tutorial.md` declares no `adr:`
- **THEN** its navigation entry is its title

### Requirement: Every ADR namespace is in the navigation
The navigation SHALL list the ADRs of every subdirectory of `docs/adr/`, one group per subdirectory, named after it. Adding a namespace MUST NOT require editing a navigation file.

#### Scenario: Own and imported ADRs
- **WHEN** the site is built with ADRs in `docs/adr/local/` and `docs/adr/trivoallan/`
- **THEN** the navigation holds a group `local` and a group `trivoallan`, each listing its ADRs in number order
