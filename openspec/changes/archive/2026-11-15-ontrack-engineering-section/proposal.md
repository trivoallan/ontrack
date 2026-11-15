## Why

The reference track is the most concrete thing the site shows, and the
tutorial installs it, yet it sits in a collapsed group inside "Use a
track". Its page does two jobs: it tells someone evaluating ontrack what a
repository gets, and it tells someone who adopted the track how to install
it. How to take its new releases and how to reject one of its questions are
spread over other guides.

## What Changes

- The navigation gets a top-level group "ontrack-engineering", right after
  "Start here", expanded: "Overview", "Use it", "Questions (X.Y.Z)".
- The track page keeps what the track is and what a repository gets, and
  ends with two link cards: "Use it" and "Questions". Its install steps move.
- A new page "Use it" (`ontrack-engineering/use-it/`): install under the
  alias, check signatures, import and rule; take a new release; reject a
  question.
- "Find a track" and the tutorial link to "Use it".

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `track-catalogue`: the track page no longer holds the install steps; a page "Use it" does; the navigation group is top-level.

## Impact

`docs/ontrack-engineering.mdx`, `docs/ontrack-engineering/use-it.md` (new),
`docs/find-a-track.md`, `docs/tutorial.mdx`, `site/astro.config.mjs`. No URL
changes.
