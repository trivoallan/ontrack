# track-catalogue Specification

## Purpose
Presents every track this repository depends on, on the documentation site: pages for each track, and its blank conventions as the installed release ships them.

## Requirements

### Requirement: Each catalogued track has its pages
The catalogued tracks SHALL be the tracks of the repository, as track
discovery returns them from its `package.json`: every dependency whose
installed `package.json` carries an `ontrack` key, under its alias, in
discovery's order. A track's site name is its package name without its scope
(`ontrack-engineering` for `@trivoallan/ontrack-engineering`).

For each catalogued track, the site SHALL have a page "The <site name> track"
that says what the track is and what a repository gets from it, and links to
the pages "Use it" and "Conventions". When the track's README has a table of
domains, rows of the form `| **<Domain>** (<numbers>) | … |`, the track page
SHALL show one card per domain linking to that domain's conventions.

A page "Use it" SHALL say, as steps, how to install the track under its
alias and check its signatures, how to take a new release, and how to reject
a convention. It SHALL install the track under the alias the repository
gives it, and give the rule that alias follows: the package name without its
scope and without the prefix `ontrack-`, prefixed with the author when two
installed tracks would get the same alias.

A page "Conventions" SHALL name the release, X.Y.Z, the `version` of the
track's installed `package.json` at build time, and list every convention as
a link card to its catalogue page. When the README has a table of domains,
the cards are grouped by its domains, in its order, and a convention the
table does not place is under "Other". When it has none, the cards are one
list in number order, under no domain heading.

The build SHALL fail, naming the track and the missing file, when a
catalogued track has no page "The <site name> track", "Use it" or
"Conventions" under `docs/`.

#### Scenario: Version shown
- **WHEN** the site is built with `@trivoallan/ontrack-engineering` 0.6.0 installed under the alias `engineering`
- **THEN** the page "Conventions" of `ontrack-engineering` names "ontrack-engineering 0.6.0"
- **AND** it links to one catalogue page per file of `node_modules/engineering/adr/`

#### Scenario: Two tracks
- **WHEN** the repository depends on `engineering` (`@trivoallan/ontrack-engineering`) and `security` (`@example/ontrack-security` 1.0.0)
- **THEN** the site has the pages `ontrack-engineering/`, `ontrack-engineering/use-it/`, `ontrack-engineering/conventions/`, `ontrack-security/`, `ontrack-security/use-it/` and `ontrack-security/conventions/`
- **AND** the page "Conventions" of `ontrack-security` names "ontrack-security 1.0.0"

#### Scenario: Grouped by domain
- **WHEN** the README of `ontrack-engineering` places 0017, 0022 and 0026 under **Agents**
- **THEN** its page "Conventions" shows ADR-0017, ADR-0022 and ADR-0026 under "Agents"
- **AND** the card "Agents" of its track page links to them

#### Scenario: A track with no domain table
- **WHEN** the README of `ontrack-security` has no row of the form `| **<Domain>** (<numbers>) | … |`
- **THEN** its page "Conventions" lists its conventions in number order, under no heading
- **AND** no heading "Other" is shown

#### Scenario: Install steps
- **WHEN** the site is built
- **THEN** each catalogued track's page "Use it" is served at `<site name>/use-it/`
- **AND** its track page links to it and holds no install steps

#### Scenario: Alias rule
- **WHEN** a reader follows the page "Use it" of `ontrack-security`
- **THEN** the install command is `npm i -D security@npm:@example/ontrack-security`
- **AND** the page says the alias is the package name without `@example/` and without `ontrack-`

#### Scenario: A track without its pages
- **WHEN** the repository depends on a track whose site name is `ontrack-security` and `docs/ontrack-security.mdx` does not exist
- **THEN** the build fails and names `ontrack-security` and `docs/ontrack-security.mdx`

### Requirement: The catalogue is the installed releases
The site SHALL build one catalogue page per Markdown file of each catalogued
track's ADR directory, as track discovery resolves it from the track's
`ontrack.adr` key, read in place, and from no other copy of the track. A
catalogue page is served under the track's site name, at the lower-case file
name without its extension; a `slug:` key MUST NOT change its URL.

#### Scenario: Catalogue page URL
- **WHEN** `node_modules/engineering/adr/ADR-0006-commits.md` declares `slug: commits`
- **THEN** its catalogue page is served at `ontrack-engineering/adr-0006-commits/`
- **AND** no page is served at `commits/`

#### Scenario: A second track's catalogue
- **WHEN** `node_modules/security/adr/ADR-0004-secrets.md` exists
- **THEN** its catalogue page is served at `ontrack-security/adr-0004-secrets/`

#### Scenario: The track is bumped
- **WHEN** an installed track moves to a release that adds a convention
- **THEN** the next build has a catalogue page for it, without editing any file of the repository

### Requirement: A catalogue page shows the blank convention
A catalogue page SHALL show the convention as a repository receives it: its
status as a badge, a "checked" badge when the convention has a `check:`, a
line "A convention of <site name> X.Y.Z", its `traits:` block with the keys
left empty, and the body of the file. It MUST NOT show ontrack's ruling on
that convention; it SHALL link to the page of ontrack's ruling, under
`adr/<alias>/`, when ontrack has imported that convention.

#### Scenario: A convention ontrack accepted
- **WHEN** the catalogue page of ADR-0006 is built while ontrack's `docs/adr/engineering/ADR-0006-commits.md` is `accepted` with `commits.tool: commitlint`
- **THEN** the catalogue page shows a "proposed" badge, a "checked" badge and an empty `tool:` key
- **AND** it does not show `commitlint` in its traits block
- **AND** it links to `adr/engineering/adr-0006-commits/`

#### Scenario: A convention of the second track
- **WHEN** the catalogue page of `ontrack-security`'s ADR-0004 is built while the repository's `docs/adr/security/ADR-0004-secrets.md` exists
- **THEN** the page reads "A convention of ontrack-security 1.0.0"
- **AND** it links to `adr/security/adr-0004-secrets/`

### Requirement: The catalogue is in the navigation
The navigation SHALL hold a top-level group "Tracks catalogue", right after
"Start here" and not collapsed. It SHALL hold one entry per catalogued track,
in discovery's order, labelled with the track's site name, listing the track
page, as "Overview", the page "Use it", then the page "Conventions", as
"Conventions (X.Y.Z)". The catalogue pages are reached from the page
"Conventions", not listed in the navigation. No page or label of the site
SHALL call a catalogued track "the reference track".

#### Scenario: Navigation
- **WHEN** the site is built with `engineering` (0.6.0) and `security` (1.0.0) installed
- **THEN** the second group of the navigation is "Tracks catalogue", holding "ontrack-engineering" then "ontrack-security"
- **AND** "ontrack-security" holds "Overview", "Use it" and "Conventions (1.0.0)"
- **AND** no catalogue page is listed in the navigation

### Requirement: ontrack's decisions are labelled as an example
The navigation group holding ontrack's own ADRs and its rulings on the
catalogued tracks SHALL be labelled "Example: how ontrack ruled", and stay
collapsed. Its pages keep their URLs, except that the rulings on each track
are served under `adr/<alias>/`.

#### Scenario: Example group
- **WHEN** the site is built with ontrack's rulings in `docs/adr/local/` and `docs/adr/engineering/`
- **THEN** the navigation holds a collapsed group "Example: how ontrack ruled" listing `local` and `engineering`
- **AND** `adr/engineering/adr-0006-commits/` is served
