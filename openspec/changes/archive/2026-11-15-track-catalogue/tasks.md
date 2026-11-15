## 1. Catalogue source

- [x] 1.1 In `site/src/content.config.ts`, add a second glob over `../node_modules/trivoallan/adr` with ids `ontrack-engineering/<file>` and give each glob a store view limited to its own ids
- [x] 1.2 In `.github/workflows/docs.yml`, install the root with dev dependencies (`npm ci --ignore-scripts`)

## 2. Pages

- [x] 2.1 Write `docs/ontrack-engineering.md`: what the track is, what you get (adapted table), how to install it
- [x] 2.2 In the `pages` plugin, append "Questions from ontrack-engineering X.Y.Z" and the list of catalogue links to the track page
- [x] 2.3 In the `pages` plugin, open each catalogue page with the `proposed` badge, the blank `traits:` block and a link to ontrack's answer, and no ruling

## 3. Navigation

- [x] 3.1 Add the track page and the collapsed "Questions from ontrack-engineering X.Y.Z" group to "Use a track"
- [x] 3.2 Relabel "Decisions" as "Example: how ontrack answered", still collapsed

## 4. Verification

- [x] 4.1 `npm run build` in `site/` passes, link check included, and `git status` shows no change under `docs/`
- [x] 4.2 Spot-check the ADR-0006 catalogue page: proposed badge, empty `tool:`, link to ontrack's answer
- [x] 4.3 `npm test` at the root still passes
