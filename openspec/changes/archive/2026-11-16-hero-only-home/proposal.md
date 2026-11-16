Issue served: none

## Why

The home page now says what ontrack does on its first screen: a title, a
line, three actions and six capabilities that lead to the features page.
Below it, nine sections repeat what the features page, the tutorial and
"How it works" hold, in an order nobody chose to read. Two things in them
exist nowhere else: the problem ontrack is for, and the table that sets it
next to what a team already uses. A reader who clicks one of the six
capabilities never meets either.

## What Changes

- The home page keeps its hero and the six capabilities, and nothing else.
- A new page, `docs/why-ontrack.md`, titled "Why ontrack" and listed first
  in "Start here", holds what was unique to the home page: "Conventions are
  copied, then they drift", a short "Proposed, not imposed" that links to
  the section of that name in "How it works", the comparison table "Next to
  what you already have" with its note on linters, and "It governs itself".
- The second action of the hero, "Browse docs", becomes "Why ontrack" and
  leads to that page. The six capabilities already list the documentation.
- The sections the other pages cover are removed from the home page: "A
  convention, a ruling, an instruction the agent reads", "When a convention
  changes", "Your teams keep their rulings", "Nothing to migrate away
  from", "Common questions" and the closing link cards.
- "Where the project stands" is removed. The version is shown in the
  header of every page (`show-version-in-header`), so `docs/index.mdx`
  leaves the `extra-files` of `release-please-config.json`. The minimum
  Node version and the npm package are in the tutorial already.
- The one answer of "Common questions" that no other page gives, that any
  agent which reads `AGENTS.md` works, goes to the features page.
- The two pages that send the reader to the home page for "what ontrack is
  for" send them to the new page.

Not in this change:

- The header and the version it shows: `show-version-in-header`, which is
  applied first.
- Any change to the features page beyond the line above.

## Capabilities

### New Capabilities
<!-- none: documentation only, `skip_specs: true` -->

### Modified Capabilities
<!-- none: no requirement names the content of the home page or the
     entries of "Start here" -->

## Impact

- `docs/index.mdx` (shortened), `docs/why-ontrack.md` (new),
  `docs/features.md` (one line), `docs/how-it-works.md` and
  `docs/architecture/arc42/01-introduction-and-goals.md` (one link each),
  `site/astro.config.mjs` (one entry in the navigation),
  `release-please-config.json` (one file removed from `extra-files`).
- The anchors of the removed sections disappear. No page links to them.
- No code, dependency or CI change.
