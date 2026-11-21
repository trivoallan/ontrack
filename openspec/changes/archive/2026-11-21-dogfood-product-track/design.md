## Context

The site's catalogue is written for one track. `site/src/track.mjs` reads
`node_modules/engineering/`, `site/src/content.config.ts` globs
`../node_modules/engineering/adr` into the `ontrack-engineering/` directory,
the remark plugin in `site/astro.config.mjs` recognises catalogue pages by the
path `/node_modules/engineering/adr/`, `site/src/pages/llms.txt.ts` builds the
raw URL of `trivoallan/ontrack-engineering`, and the sidebar group "The
reference track" lists three fixed slugs. The specs `track-catalogue` and
`docs-site` say the same in prose.

`@trivoallan/ontrack-product` 0.1.0 ships five ADRs under `adr/`: ADR-0001
ships `accepted`, the other four are `proposed`. Its README has a table of
conventions, not a table of domains. Its check reads frontmatter under
`product.artifacts.root`, and the `PRD:` and `Probe:` lines of open changes,
not of `openspec/changes/archive/`.

In force here and relevant:

- engineering/ADR-0018 and ADR-0020, rule 2: a three-day cooldown on every
  dependency, applied by `.npmrc` (`min-release-age=3`) and Dependabot
  (`cooldown.default-days: 3`); ADR-0020: a person admits a new dependency,
  install scripts ignored.
- local/ADR-0026: only the engineering track is exempt from the cooldown,
  "No other dependency is exempted".
- local/ADR-0005: own ADRs in `docs/adr/local/`; a track's in
  `docs/adr/<alias>/`.
- local/ADR-0025: a ruled ADR follows the files it references.
- engineering/ADR-0008: docs in English under `docs/`, Starlight.

## Goals / Non-Goals

**Goals:**

- ontrack rules on the product track and `ontrack check` runs its checks.
- `research/` holds product artifacts only.
- The site serves any number of tracks with no track-specific code: adding a
  third one takes a dependency and three pages under `docs/`.
- The engineering track's URLs do not move.

**Non-Goals:**

- Generating the "Overview" and "Use it" pages from the track: they stay
  hand-written prose.
- Listing tracks ontrack does not depend on. `find-a-track.md` stays the place
  for the ecosystem.
- Changing the product track itself. What ruling it here reveals goes to its
  own repository.
- Rewriting archived changes that cite `research/desk-test-first-proposal/`.

## Decisions

### The site's tracks come from track discovery

The site calls `discoverTracks(repository)` from `src/tracks.ts`, as
`astro.config.mjs` already imports `readAdrs` from `src/instructions.ts`. Each
track gives its alias, its installed package (name, version, `repository`,
README) and its resolved ADR directory. `track.mjs` becomes a function of a
track instead of a module about `engineering`, and exports the list.

*Alternatives:* a list in the site's config (a second list to keep in step
with `package.json`, and one the spec cannot check); reading `package.json`
again in the site (a copy of discovery's rules, which would drift).

### A track's site name is its package name without its scope

`@trivoallan/ontrack-engineering` → `ontrack-engineering`. It keeps every URL
under `ontrack-engineering/`, and gives `ontrack-product/` the same shape. The
alias is not used for URLs: two repositories may alias a track differently,
and the site documents the track, not this repository's alias. The rulings
stay under `adr/<alias>/`, which is where `ontrack apply` writes them.

### One content loader per track

`content.config.ts` keeps its "docs-and-catalogue" loader and generalises the
second glob to one per track, each with its base set to the track's ADR
directory and its ids prefixed with the site name. A catalogue entry is told
from a page by its id prefix, `<site name>/adr-`, for every catalogued track.
The remark plugin recognises a catalogue file by its path being under one of
the tracks' ADR directories, and takes the track's name and version from it.

### Domains are optional

`track.mjs` keeps its README regex. A track whose README yields no domain row
returns one unnamed domain; the "Conventions" page renders it with no heading,
and the track page shows no domain cards. Nothing in the product track is
changed to suit the site.

### The track pages stay in `docs/`, and the build checks they exist

`docs/ontrack-engineering.mdx`, `docs/ontrack-engineering/use-it.md` and
`conventions.mdx` stay; `docs/ontrack-product.mdx`,
`docs/ontrack-product/use-it.md` and `conventions.mdx` are added, in the same
shape. The "Conventions" page body is the same for every track and imports
the track by name. The sidebar is built from the list of tracks; the build
fails when one of the three pages is missing, so that a new dependency cannot
ship a sidebar entry that leads nowhere.

### The product track is exempt from the cooldown, by a new ADR

The cooldown would keep 0.1.0 out of this repository for three days after its
release, and delay every revision after that, which is what local/ADR-0023
and ADR-0024 judged wrong for the engineering track. The reasons are the same:
same owner, released with provenance, revisions that must reach the
repository at once. ADR-0026 says no other dependency is exempted, so a new
local ADR supersedes it and names both tracks: `.npmrc` gets a second
`min-release-age-exclude[]`, and the root npm entry of `.github/dependabot.yml`
lists `product` under `cooldown.exclude` and keeps it out of `ignore`, so its
releases come as pull requests.

*Alternative:* wait three days and keep the cooldown for this track. It costs
only time for 0.1.0, but each later revision would wait too, and the
asymmetry with the engineering track would have no reason.

### The desk-test data moves first, alone

`git mv research/desk-test-first-proposal experiments/desk-test-first-proposal`,
in its own commit, before the dependency. It does not need the track, keeps
history, and leaves `research/` with its five pm-skills artifacts. The scripts
move with their data; none is referenced from outside the directory except by
archived changes, which keep their old paths.

### Rulings follow `ontrack review`

The product track's ADRs are ruled with `ontrack review`, as every imported
ADR is, not decided in this design. The values the exploration leaned to are
inputs to that review, not commitments: `product.toolkit: pm-skills`,
`product.artifacts.root: research/`, levels `[hypothesis, observed,
validated]` with `observed` required, `product.handoff: openspec`.

## Risks / Trade-offs

- [The product check fails on files nobody expected under `research/`] → run
  it before ruling ADR-0002 and ADR-0003 `accepted`, after the move.
- [Importing `src/tracks.ts` couples the site to the CLI's discovery] → that
  is the intent: the spec says the catalogued tracks are discovery's tracks.
  The site already imports `src/instructions.ts`.
- [A compromised release of either track is installed without delay] →
  as in ADR-0024: provenance, `npm audit signatures`, a person reviews the
  release pull request.
- [Ruling `product.evidence.required: observed` makes an open change that
  cites a `hypothesis` PRD fail CI] → no open change cites one today;
  archived changes are not checked. A future one adds a `Probe:` line.
- [The sidebar loses the words "reference track" that `why-ontrack.md` and
  the tutorial lean on] → reword those pages in this change.

## Migration Plan

1. Move the desk-test data (independent; can merge before 0.1.0 is out).
2. Once `@trivoallan/ontrack-product` 0.1.0 is on npm: record the cooldown
   ADR and change `.npmrc` and `.github/dependabot.yml`; a person admits the
   dependency (`npm i -D product@npm:@trivoallan/ontrack-product`,
   `npm audit signatures`).
3. `ontrack apply`, `ontrack review`, `ontrack check` green.
4. Generalise the site and its specs; add the product pages; reword
   "reference track".

Rollback: removing the dependency and `docs/adr/product/` restores the
previous state; the site falls back to listing the remaining tracks.

## Open Questions

- local/ADR-0026 is superseded (see the cooldown decision); the adr step
  records it.
- Whether the tutorial keeps installing only the engineering track, or shows
  that a repository may install several. This design keeps it to one.
