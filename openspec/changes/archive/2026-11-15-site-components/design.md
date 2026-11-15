## Context

Pages under `docs/` are written to be read on GitHub and on the site. The
arc42 pages already use MDX for LikeC4 views. Starlight's components only
work in MDX. Starlight adds its own remark steps after the site's for
Markdown pages, and before them for MDX pages.

## Goals / Non-Goals

**Goals:** use Starlight's components where they make a page easier to
scan; keep `.md` pages readable on GitHub.

**Non-Goals:** converting every page; components in imported ADRs (copies,
never edited).

## Decisions

- **GitHub alerts are the aside syntax of `.md` pages.** The `pages` plugin
  turns them into the directive Starlight renders, so GitHub and the site
  both show a callout. Rejected: Starlight's `:::note`, raw text on GitHub.
- **MDX only where components carry the page**: the track page (generated
  list), the tutorial (steps) and the home page (a `splash` page, little read
  on GitHub). In MDX, asides are the `<Aside>` component: the bridge does not
  run before Starlight's step there.
- **One module reads the track**, `site/src/track.mjs`: version, questions,
  domains from the README table. The config, the sidebar and the track page
  import it. It resolves the track from the working directory, since the
  build moves it when bundling the page. Ceiling: the build runs in `site/`.
- **Starlight's components resolve from `site/node_modules`** through a Vite
  alias, since `docs/` is outside `site/`.
- **release-please** reads the version marker as `{/* … */}`, the comment
  MDX allows.

## Risks / Trade-offs

- [Three pages are no longer readable on GitHub] → accepted; links point to
  their `.mdx`, which GitHub shows as source.
- [The README table is the domain source] → a question it does not place
  goes under "Other"; nothing breaks.
- [Imitation-free] the catalogue page's "checked" badge reuses the existing
  status badge style, not a component.

## Open Questions

None.
