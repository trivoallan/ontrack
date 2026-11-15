## MODIFIED Requirements

### Requirement: The reference track has a page
The site SHALL have a page "The ontrack-engineering track" that says what the
track is and what a repository gets from it, with one card per domain of the
track's README table linking to that domain's questions, and links to the
pages "Use it" and "Questions". A page "Use it" SHALL say, as steps, how to
install the track under its alias and check its signatures, how to take a
new release, and how to reject a question. A page "Questions" SHALL name the
release, X.Y.Z, the `version` of `node_modules/trivoallan/package.json` at
build time, and list every question as a link card to its catalogue page,
grouped by the domains of the README table, in its order; a question the
table does not place is under "Other".

#### Scenario: Version shown
- **WHEN** the site is built with `@trivoallan/ontrack-engineering` 0.6.0 installed under the alias `trivoallan`
- **THEN** the page "Questions" names "ontrack-engineering 0.6.0"
- **AND** it links to one catalogue page per file of `node_modules/trivoallan/adr/`

#### Scenario: Grouped by domain
- **WHEN** the README places 0017, 0022 and 0026 under **Agents**
- **THEN** the page "Questions" shows ADR-0017, ADR-0022 and ADR-0026 under "Agents"
- **AND** the card "Agents" of the track page links to them

#### Scenario: Install steps
- **WHEN** the site is built
- **THEN** the page "Use it" is served at `ontrack-engineering/use-it/`
- **AND** the track page links to it and holds no install steps

### Requirement: The catalogue is in the navigation
The navigation SHALL hold a top-level group "ontrack-engineering", right
after "Start here" and not collapsed, listing the track page, as "Overview",
the page "Use it", then the page "Questions", as "Questions (X.Y.Z)". The
catalogue pages are reached from that page, not listed in the navigation.

#### Scenario: Navigation
- **WHEN** the site is built with 26 questions in the installed track
- **THEN** the second group of the navigation is "ontrack-engineering", holding "Overview", "Use it" and "Questions (0.6.0)"
- **AND** no catalogue page is listed in the navigation
