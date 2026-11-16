Issue served: none

## Why

Nothing on the site answers "what can ontrack do?" in one place. The home
page tells one story, problem then mechanism, and the commands reference is
ordered by command. A reader has to infer the capabilities, and some of
them appear nowhere a reader would look: that a review ends by proposing an
issue for each ruling the repository does not follow yet is said only
inside the `ontrack review` prompt.

The home page also puts nothing but its tagline before the first scroll.

## What Changes

- A new page, `docs/features.md`, titled "Features" and listed first in the
  navigation group "Start here". It is ordered by what the reader wants to
  do, not by command. Each line names a capability and links to the page
  that specifies it; the page specifies nothing itself.
- Its section on gap issues says what the agent does once a review is
  ruled, and shows trivoallan/ontrack#193 as the example: its title and its
  body, without the first line of the body, which cites the ADR under the
  namespace the track had before it was renamed.
- Its last section says what ontrack leaves alone.
- On the home page, six capabilities in one line each sit right under the
  hero, each linked to its section of the new page.
- The hero is made shorter (less padding, a smaller logo), so that the six
  lines show without scrolling on a 1280 by 720 window.

Not in this change:

- The page of ADR-0014 in the ontrack-engineering track does not say that
  its answer tells the agent where to open gap issues. That is a revision
  of the track's question, made in the track's repository.
- Anything that keeps the new page in step with the code. It is written by
  hand, and a capability added later has to be added to it.
- Any change to what a command prints.

## Capabilities

### New Capabilities
<!-- none: documentation only, `skip_specs: true` -->

### Modified Capabilities
<!-- none: no requirement names the entries of "Start here" or the content
     of the home page -->

## Impact

- `docs/features.md` (new), `docs/index.mdx`, `site/astro.config.mjs` (one
  entry in the navigation), `site/src/theme.css` (the hero, the list).
- No code, dependency or CI change. Not shipped in the package.
