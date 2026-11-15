## MODIFIED Requirements

### Requirement: The reference track has a page
The site SHALL have a page "The ontrack-engineering track" that says what the
track is and what a repository gets from it, with one card per domain of the
track's README table linking to that domain's questions, and links to the
pages "Use it" and "Questions". A page "Use it" SHALL say, as steps, how to
install the track under its alias and check its signatures, how to take a
new release, and how to reject a question. It SHALL install the track under
the alias `engineering`, and give the rule that alias follows: the package
name without its scope and without the prefix `ontrack-`, prefixed with the
author when two installed tracks would get the same alias. A page
"Questions" SHALL name the release, X.Y.Z, the `version` of
`node_modules/engineering/package.json` at build time, and list every
question as a link card to its catalogue page, grouped by the domains of
the README table, in its order; a question the table does not place is
under "Other".

#### Scenario: Version shown
- **WHEN** the site is built with `@trivoallan/ontrack-engineering` 0.6.0 installed under the alias `engineering`
- **THEN** the page "Questions" names "ontrack-engineering 0.6.0"
- **AND** it links to one catalogue page per file of `node_modules/engineering/adr/`

#### Scenario: Grouped by domain
- **WHEN** the README places 0017, 0022 and 0026 under **Agents**
- **THEN** the page "Questions" shows ADR-0017, ADR-0022 and ADR-0026 under "Agents"
- **AND** the card "Agents" of the track page links to them

#### Scenario: Install steps
- **WHEN** the site is built
- **THEN** the page "Use it" is served at `ontrack-engineering/use-it/`
- **AND** the track page links to it and holds no install steps

#### Scenario: Alias rule
- **WHEN** a reader follows the page "Use it"
- **THEN** the install command is `npm i -D engineering@npm:@trivoallan/ontrack-engineering`
- **AND** the page says the alias is the package name without `@trivoallan/` and without `ontrack-`

### Requirement: The catalogue is the installed release
The site SHALL build one catalogue page per Markdown file of
`node_modules/engineering/adr/`, read in place, and from no other copy of the
track. A catalogue page is served under `ontrack-engineering/`, at the
lower-case file name without its extension; a `slug:` key MUST NOT change
its URL.

#### Scenario: Catalogue page URL
- **WHEN** `node_modules/engineering/adr/ADR-0006-commits.md` declares `slug: commits`
- **THEN** its catalogue page is served at `ontrack-engineering/adr-0006-commits/`
- **AND** no page is served at `commits/`

#### Scenario: The track is bumped
- **WHEN** the installed track moves to a release that adds a question
- **THEN** the next build has a catalogue page for it, without editing any file of the repository

### Requirement: ontrack's decisions are labelled as an example
The navigation group holding ontrack's own ADRs and its answers to the
track SHALL be labelled "Example: how ontrack answered", and stay
collapsed. Its pages keep their URLs, except that the answers to the track
are served under `adr/engineering/`.

#### Scenario: Example group
- **WHEN** the site is built
- **THEN** the navigation holds a collapsed group "Example: how ontrack answered" listing `local` and `engineering`
- **AND** `adr/engineering/adr-0006-commits/` is served
