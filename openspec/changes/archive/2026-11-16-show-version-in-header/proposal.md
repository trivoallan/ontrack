Issue served: none

## Why

The site publishes two channels: the latest release at its root, and `main`
under `next/`. A reader cannot tell from a page which version of ontrack it
documents. The only place that says so is a line of the home page, "ontrack
is at version X", which the home page is about to lose
(`hero-only-home`), and which was never visible from any other page.

## What Changes

- The header of every page shows the version it documents, next to the
  site title.
- On the release channel it reads `vX.Y.Z`, the `version` of the
  `package.json` the channel is built from, and links to the release notes
  of that version.
- On the `next` channel it reads `next`, and links to the documentation of
  the latest release. The version of `package.json` is not shown there: on
  `main` it names the last release, not what the pages describe.
- A build with no channel set, as a pull request or a local build runs,
  shows `vX.Y.Z` like the release channel.

Not in this change:

- A menu to switch between versions. The site keeps two channels, not one
  per release.
- The banner of the `next` channel, which stays as it is.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `docs-site`: a requirement is added on what the header shows.

## Impact

- `site/src/components/`: a component that overrides Starlight's site
  title, registered in `site/astro.config.mjs`.
- `site/src/theme.css`: the style of the version mark.
- No change to `docs/`, to the workflows or to release-please: the number
  comes from `package.json`, which release-please already updates.
- The release channel is built from the release's own checkout: the mark
  appears at the root of the site with the first release that contains
  this change, and on `next/` as soon as it is merged.
