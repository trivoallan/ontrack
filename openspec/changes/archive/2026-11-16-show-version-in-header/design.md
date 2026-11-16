## Context

`site/astro.config.mjs` already overrides two Starlight components
(`PageTitle`, `MarkdownContent`). `site/src/route-data.ts` reads
`SITE_CHANNEL` to add a banner on the `next` channel. `docs.yml` builds the
release channel from the checkout of the release tag, with that tag's own
site configuration, and `main` under `next/` with `SITE_CHANNEL=next`.

release-please writes the version to `package.json`, and to the files
listed in `extra-files`: `README.md` and `docs/index.mdx`.

ADRs in force that bear on this: engineering/ADR-0008 (Starlight, two
channels, rule 5 on `next/`), engineering/ADR-0012 (release-please).

## Goals / Non-Goals

**Goals:**

- A reader knows, on any page, which version it documents.
- The number is never written by hand.

**Non-Goals:**

- One site per release, or a version switcher.
- Change how the channels are built.

## Decisions

**Override Starlight's `SiteTitle`.** The mark sits next to the title, in
the one place every page shares. The override renders Starlight's own
title, then the mark. Alternative: put the number in the `title` option of
Starlight; rejected, the title is also the text of the browser tab and of
search results, and it could not be a link.

**Read `package.json` at build time.** It is the file release-please
updates, and the release channel is built from the tag's checkout, so the
number is the release's. Alternative: an environment variable set by
`docs.yml`; rejected, a local build would show nothing.

**`next`, not a number, on the `next` channel.** On `main`,
`package.json` holds the version of the last release until the next one is
cut. Showing it on pages that describe unreleased work would be wrong in
the direction that matters. The banner already says what `next` is; the
mark gives the way back.

**Each mark links where its reader wants to go.** From a release: what
that version changed. From `next`: the documentation of what they have
installed.

**A full URL to the release channel.** It is outside this build's base, as
the banner's link is, so the link checker does not follow it.

## Risks / Trade-offs

- [The root of the site shows no mark until a release contains this
  change] → Expected: the release channel is built with the release's own
  configuration. `next/` shows it at once.
- [The header is crowded on a phone] → The mark is short (`v0.6.0`, `next`)
  and is checked at 375 pixels; it wraps under nothing, the search field
  is an icon at that width.
- [A link to a release that does not exist, on a local build of an
  unreleased version] → Only the release channel is published with a
  number, and it is built from a tag.

## Open Questions

- `docs-site` says "A push to `main` SHALL publish the built site", which
  predates the two channels. The requirement is stale; this change adds
  its own and leaves that one to a change of its own.
