## Why

The site renders every page as plain Markdown: the tutorial's steps, the
list of the track's 26 questions and the home page's summaries are long
runs of headings and bullets. Starlight ships components (steps, cards, link
cards, file trees, asides) that make them easier to scan. They need MDX,
which GitHub does not render, and the pages under `docs/` are written to be
read there too.

## What Changes

- GitHub alerts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`…) in a `.md` page
  render as Starlight asides: one syntax for both readers.
- The track page, the tutorial and the home page become MDX, accepting that
  GitHub shows their component markup as text, as for the arc42 pages
  already:
  - track page: install as steps; questions as link cards grouped by the
    domains of the track's README, each saying whether it is checked;
  - tutorial: steps, a file tree of what `apply` writes, link cards for
    where to go next;
  - home page: cards for what remains without ontrack, link cards to start.
- A catalogue page shows a "checked" badge when its question has a check.
- `llms.txt` links each catalogue question to its file in the track's
  repository, at the installed release's tag.
- `release-please` updates the version in `docs/index.mdx`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `docs-site`: GitHub alerts become asides; MDX pages import Starlight's components.
- `track-catalogue`: the track page lists its questions by domain, as link cards; a catalogue page says when its question is checked.

## Impact

`docs/tutorial.md`, `docs/index.md` and `docs/ontrack-engineering.md` become
`.mdx` (URLs unchanged; links from other pages updated).
`site/astro.config.mjs`, `site/src/track.mjs` (new),
`site/src/pages/llms.txt.ts`, `site/src/adr.css`,
`release-please-config.json`.
