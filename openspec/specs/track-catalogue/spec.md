# track-catalogue Specification

## Purpose
Presents the reference track on the documentation site: a page for the track, and its blank questions as the installed release ships them.

## Requirements

### Requirement: The reference track has a page
The site SHALL have a page "The ontrack-engineering track" that says what the
track is, what a repository gets from it, and how to install it. The page
SHALL list the questions of the track under the heading "Questions from
ontrack-engineering X.Y.Z", where X.Y.Z is the `version` of
`node_modules/trivoallan/package.json` at build time, each linking to its
catalogue page.

#### Scenario: Version shown
- **WHEN** the site is built with `@trivoallan/ontrack-engineering` 0.6.0 installed under the alias `trivoallan`
- **THEN** the track page holds the heading "Questions from ontrack-engineering 0.6.0"
- **AND** it links to one catalogue page per file of `node_modules/trivoallan/adr/`

### Requirement: The catalogue is the installed release
The site SHALL build one catalogue page per Markdown file of
`node_modules/trivoallan/adr/`, read in place, and from no other copy of the
track. A catalogue page is served under `ontrack-engineering/`, at the
lower-case file name without its extension; a `slug:` key MUST NOT change
its URL.

#### Scenario: Catalogue page URL
- **WHEN** `node_modules/trivoallan/adr/ADR-0006-commits.md` declares `slug: commits`
- **THEN** its catalogue page is served at `ontrack-engineering/adr-0006-commits/`
- **AND** no page is served at `commits/`

#### Scenario: The track is bumped
- **WHEN** the installed track moves to a release that adds a question
- **THEN** the next build has a catalogue page for it, without editing any file of the repository

### Requirement: A catalogue page shows the blank question
A catalogue page SHALL show the question as a repository receives it: its
status `proposed` as a badge, its `traits:` block with the keys left empty,
and the body of the file. It MUST NOT show ontrack's ruling on that
question; it SHALL link to the page of ontrack's answer when ontrack has
imported that question.

#### Scenario: A question ontrack accepted
- **WHEN** the catalogue page of ADR-0006 is built while ontrack's `docs/adr/trivoallan/ADR-0006-commits.md` is `accepted` with `commits.tool: commitlint`
- **THEN** the catalogue page shows a "proposed" badge and an empty `tool:` key
- **AND** it does not show `commitlint` in its traits block
- **AND** it links to `adr/trivoallan/adr-0006-commits/`

### Requirement: The catalogue is in the navigation
The navigation SHALL hold a collapsed group "The ontrack-engineering track"
listing the track page, as "Overview", then a collapsed subgroup
"Questions (X.Y.Z)" of the catalogue pages, in number order. A group nested
in another is labelled at the size of the entries around it.

#### Scenario: Navigation
- **WHEN** the site is built with 26 questions in the installed track
- **THEN** the group "The ontrack-engineering track" holds "Overview" and a subgroup "Questions (0.6.0)" of 26 catalogue pages

### Requirement: ontrack's decisions are labelled as an example
The navigation group holding ontrack's own ADRs and its answers to the
track SHALL be labelled "Example: how ontrack answered", and stay
collapsed. Its pages keep their URLs.

#### Scenario: Example group
- **WHEN** the site is built
- **THEN** the navigation holds a collapsed group "Example: how ontrack answered" listing `local` and `trivoallan`
- **AND** `adr/trivoallan/adr-0006-commits/` is still served
