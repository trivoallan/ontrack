## ADDED Requirements

### Requirement: The header shows the documented version
The header of every page SHALL show, next to the site title, which version
of ontrack the page documents. When the site is built with
`SITE_CHANNEL=next`, the mark SHALL read `next` and link to the
documentation of the latest release, at the root of the site. Otherwise it
SHALL read `v` followed by the `version` of the repository's `package.json`
at build time, and link to the release notes of that version on GitHub. The
mark SHALL be present at every width the header is shown at, and its link
SHALL have an accessible name that says where it leads.

#### Scenario: Release channel
- **WHEN** the site is built from a checkout whose `package.json` says `0.6.0`, without `SITE_CHANNEL`
- **THEN** the header of every page shows `v0.6.0`
- **AND** the mark links to `https://github.com/trivoallan/ontrack/releases/tag/v0.6.0`

#### Scenario: Next channel
- **WHEN** the site is built with `SITE_CHANNEL=next` from a checkout whose `package.json` says `0.6.0`
- **THEN** the header of every page shows `next` and no version number
- **AND** the mark links to `https://trivoallan.github.io/ontrack/`

#### Scenario: Narrow screen
- **WHEN** a page is shown at a width of 375 pixels
- **THEN** the mark is visible in the header and the header does not scroll sideways

#### Scenario: Home page
- **WHEN** `docs/index.mdx` is built
- **THEN** its header shows the mark like any other page
