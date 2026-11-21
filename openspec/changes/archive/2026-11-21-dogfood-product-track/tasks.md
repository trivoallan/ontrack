## 1. Move the desk-test data out of research/ (no dependency on the product track)

- [x] 1.1 `git mv research/desk-test-first-proposal experiments/desk-test-first-proposal`; check that `research/` holds only the five pm-skills artifacts, each with `artifact:` and `evidence:` in its frontmatter
- [x] 1.2 Run the moved scripts' path assumptions (`run-one.sh`, `run-one-v2.sh`, `run10/run-survey.sh`, `run11/*.py`) and fix any path that pointed into `research/`; leave archived changes under `openspec/changes/archive/` as they are
- [x] 1.3 Check that no ruled ADR under `docs/adr/` cites the old path (ADR-0025); update any that does

## 2. Admit the product track (needs `@trivoallan/ontrack-product` 0.1.0 on npm)

- [x] 2.1 Per ADR-0028 (confirmed), add `min-release-age-exclude[]=@trivoallan/ontrack-product` to `.npmrc` and `product` to `cooldown.exclude` of the root npm entry of `.github/dependabot.yml`, keeping it out of `ignore`, with comments citing local/ADR-0028 instead of ADR-0026
- [x] 2.2 A person admits the dependency: `npm i -D product@npm:@trivoallan/ontrack-product@^0.1.0`, then `npm audit signatures` passes
- [x] 2.3 `npx ontrack plan` lists `product: 5 new`; `npx ontrack apply` writes `docs/adr/product/ADR-0001..0005` and the `AGENTS.md` block

## 3. Rule on the product track

- [x] 3.1 Rule on ADR-0002 to ADR-0005 with `ontrack review`, one at a time, with the maintainer deciding each value
- [x] 3.2 `npx ontrack check` passes, including `ontrack-product-check` for each accepted ADR, and the engineering track's checks still pass with ADR-0028 in force
- [x] 3.3 CI runs the product track's checks (the existing `ontrack check` step picks them up; confirm on the pull request)

## 4. Serve every track in the site

- [x] 4.1 `site/src/track.mjs`: export the list of tracks from `discoverTracks` (`src/tracks.ts`), each with its alias, site name (package name without scope), version, repository URL, ADR directory, conventions and domains; a README with no domain row yields one unnamed domain
- [x] 4.2 `site/src/content.config.ts`: one catalogue glob per track, ids prefixed with its site name; catalogue entries told from pages by `<site name>/adr-` for every track
- [x] 4.3 `site/astro.config.mjs` remark plugin: recognise a catalogue file under any track's ADR directory; render "A convention of <site name> X.Y.Z" and link to `adr/<alias>/<id>/` when ontrack has ruled on it
- [x] 4.4 `site/src/pages/llms.txt.ts`: build each catalogue link from the track's `repository` URL and `v<version>`
- [x] 4.5 Sidebar: replace "The reference track" with "Tracks catalogue", one entry per track labelled with its site name, holding "Overview", "Use it", "Conventions (X.Y.Z)"; fail the build, naming the track and file, when one of the three pages is missing
- [x] 4.6 Make `docs/ontrack-engineering/conventions.mdx` render one unnamed domain without a heading, and take the track by name, so the same body serves both tracks

## 5. Pages for the product track and wording

- [x] 5.1 Add `docs/ontrack-product.mdx` (what the track is, what a repository gets, no domain cards), `docs/ontrack-product/use-it.md` (install under `product`, `npm audit signatures`, take a release, reject a convention, alias rule) and `docs/ontrack-product/conventions.mdx`
- [x] 5.2 `docs/find-a-track.md`: name the product track next to the engineering track
- [x] 5.3 Remove "the reference track" from `docs/ontrack-engineering.mdx`, `docs/why-ontrack.md` and any other page or label; the tutorial still installs the engineering track
- [x] 5.4 Keep the engineering track's URLs: `ontrack-engineering/`, `use-it/`, `conventions/`, `adr-*/` and the existing redirects all still resolve

## 6. Verify

- [x] 6.1 `npm run build` in `site/` passes, `check-links.mjs` included; the built site has every page named in the `track-catalogue` and `docs-site` scenarios
- [x] 6.2 `llms.txt` links engineering ADR-0006 and product ADR-0004 to their raw URLs at `v0.6.0` and `v0.1.0`
- [x] 6.3 `npm test` passes at the coverage target, `npm run typecheck` passes, and `openspec validate dogfood-product-track --strict` passes
