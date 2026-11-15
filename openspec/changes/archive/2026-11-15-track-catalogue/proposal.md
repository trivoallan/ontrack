## Why

ontrack is built with the reference track, `@trivoallan/ontrack-engineering`,
but its site only shows that track through ontrack's own answers: a reader
cannot see the questions as a new repository receives them. The track has
no documentation site of its own, by choice, so ontrack's site is where a
reader evaluates it.

## What Changes

- A page, "The ontrack-engineering track": what the track is, what a
  repository gets from it (the "What you get" table of the track's README,
  adapted), how to install it, and the list of its questions under
  "Questions from ontrack-engineering X.Y.Z", the version read at build
  time from `node_modules/trivoallan/package.json`.
- A catalogue: one page per blank question of the track, read in place from
  `node_modules/trivoallan/adr/*.md`, the release ontrack depends on (so the
  site follows each Dependabot bump), never the track's `main`. A catalogue
  page shows the question as a repository receives it: `proposed`, the
  traits left to answer, the recommended values in the body. It carries no
  ruling of ontrack's.
- The sidebar group "Decisions", where ontrack's own ADRs and its answers to
  the track sit, is relabelled as an example ("Example: how ontrack
  answered"), still collapsed. No URL of an existing page changes.
- The documentation workflow installs the root's development dependencies,
  where the track is, before it builds the site.

## Capabilities

### New Capabilities

- `track-catalogue`: the page of the reference track and the catalogue of
  its blank questions, built from the installed release.

### Modified Capabilities

- `docs-site`: pages also come from the installed reference track, not only
  from `docs/`.

## Impact

- `site/src/content.config.ts`: the docs collection reads a second source.
- `site/astro.config.mjs`: the catalogue pages and the track page in the
  sidebar and in the `pages` remark plugin; the "Decisions" label.
- `docs/ontrack-engineering.md`: new page.
- `.github/workflows/docs.yml`: `npm ci` at the root without `--omit=dev`.
- Search: every question is found twice, in the catalogue and in ontrack's
  answer. Accepted for now.
