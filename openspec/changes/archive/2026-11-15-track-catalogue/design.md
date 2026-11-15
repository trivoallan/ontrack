## Context

The site's single content collection globs `site/src/content/docs`, a
symbolic link to `docs/`. The `pages` remark plugin rewrites `.md` links,
drops the repeated H1 and, for a file `readAdrs` knows, injects ontrack's
ruling. `generateId` keeps `slug:` from moving pages to the root. The track
is a root devDependency installed under the alias `trivoallan`;
`docs.yml` installs the root with `--omit=dev`, so the track is absent
there today. In force: trivoallan/ADR-0008 (Starlight, `docs/`, public,
channels release and main), trivoallan/ADR-0018 (Dependabot bumps the
track), local/ADR-0023 (the track skips the cooldown).

## Goals / Non-Goals

**Goals:** show the track's blank questions, exactly as the installed
release ships them; a page that presents the track; label ontrack's own
answers as an example.

**Non-Goals:** merging a catalogue page with ontrack's answer to the same
question (each question appears twice in search, accepted for now);
showing the track's `main`; changing the URL of any existing page.

## Decisions

- **Read the track in place, through the existing collection.** The docs
  collection's loader runs the glob over `docs/` and a second glob over
  `../node_modules/trivoallan/adr`, ids prefixed `ontrack-engineering/`.
  Astro's glob loader deletes the entries it did not see, so each glob gets
  a view of the store whose `keys()` holds only its own ids. Rejected: a
  build step copying the files into `docs/` (the docs-site spec forbids
  copying and writing under `docs/`); a second Starlight collection
  (Starlight routes one).
- **One source of truth for the version.** `astro.config.mjs` reads
  `node_modules/trivoallan/package.json` once, for the sidebar label and
  for the heading the `pages` plugin appends to the track page.
- **The list on the track page is generated.** The plugin appends "Questions
  from ontrack-engineering X.Y.Z" and one link per catalogue page to
  `docs/ontrack-engineering.md`. On GitHub the page reads without the list
  and points to the track's repository.
- **No ruling on catalogue pages.** The plugin matches ontrack's ADRs by
  their path under `docs/adr/`; a catalogue page is under
  `node_modules/trivoallan/adr/` and gets a different block: the
  `proposed` badge, the blank `traits:` text as the file holds it, and a
  link to ontrack's answer when `docs/adr/trivoallan/` holds the same file.
- **Placement.** The track page goes in "Use a track", after "Find a
  track"; the catalogue is a collapsed group right after it. The
  "Decisions" group of the reference is relabelled "Example: how ontrack
  answered".
- **CI installs dev dependencies.** `docs.yml` runs the root `npm ci
  --ignore-scripts` without `--omit=dev`. Install scripts stay off.

## Risks / Trade-offs

- [Duplicate search results] → accepted; a later change may merge them.
- [The store view relies on Astro's glob loader calling only `keys`,
  `get`, `set`, `delete` and `has`] → a Proxy forwards everything but
  `keys`; an Astro upgrade that breaks it fails the build, not silently.
- [The release channel builds an old tag, without the catalogue] → the
  catalogue appears in the release channel with the next release.

## Open Questions

None.
