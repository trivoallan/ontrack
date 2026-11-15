## MODIFIED Requirements

### Requirement: The reference track has a page
The site SHALL have a page "The ontrack-engineering track" that says what the
track is, what a repository gets from it, and how to install it, as steps.
Its section "Questions" SHALL name the release, X.Y.Z, the `version` of
`node_modules/trivoallan/package.json` at build time, and list every
question as a link card to its catalogue page, grouped by the domains of the
track's README table, in its order; a question the table does not place is
under "Other". A card says when its question comes with a check.

#### Scenario: Version shown
- **WHEN** the site is built with `@trivoallan/ontrack-engineering` 0.6.0 installed under the alias `trivoallan`
- **THEN** the track page names "ontrack-engineering 0.6.0" in its section "Questions"
- **AND** it links to one catalogue page per file of `node_modules/trivoallan/adr/`

#### Scenario: Grouped by domain
- **WHEN** the README places 0017, 0022 and 0026 under **Agents**
- **THEN** the track page shows ADR-0017, ADR-0022 and ADR-0026 under "Agents"
- **AND** the cards of ADR-0017 and ADR-0022 say "Checked by ontrack-engineering-check"

### Requirement: A catalogue page shows the blank question
A catalogue page SHALL show the question as a repository receives it: its
status as a badge, a "checked" badge when the question has a `check:`, its
`traits:` block with the keys left empty, and the body of the file. It MUST
NOT show ontrack's ruling on that question; it SHALL link to the page of
ontrack's answer when ontrack has imported that question.

#### Scenario: A question ontrack accepted
- **WHEN** the catalogue page of ADR-0006 is built while ontrack's `docs/adr/trivoallan/ADR-0006-commits.md` is `accepted` with `commits.tool: commitlint`
- **THEN** the catalogue page shows a "proposed" badge, a "checked" badge and an empty `tool:` key
- **AND** it does not show `commitlint` in its traits block
- **AND** it links to `adr/trivoallan/adr-0006-commits/`
