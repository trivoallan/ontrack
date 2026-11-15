## 1. Before starting

- [x] 1.1 Archive the change `local-adr-namespace-folder`, so that `openspec/specs/sources/spec.md` holds "The alias local is reserved" and `plan` is current
- [x] 1.2 Ask the user how to change the `scopes` trait of `docs/adr/trivoallan/ADR-0006-commits.md` (design.md, Open Questions)

## 2. Code and tests

- [x] 2.1 Rename `src/sources.ts` to `src/tracks.ts` and `test/sources.test.ts` to `test/tracks.test.ts` with `git mv`; rename `Source` to `Track`, `discoverSources` to `discoverTracks`, `sourceManifest` to `trackManifest`, `SourcePlan` to `TrackPlan`, and the variables and comments that follow
- [x] 2.2 Change the error messages of discovery from `source "<alias>" …` to `track "<alias>" …`, and their tests
- [x] 2.3 Make `plan` print `no track found`, and update `test/plan.test.ts`
- [x] 2.4 Replace "source" by "track" in the prompts of `src/review.ts` and in `test/review.test.ts`; check no sentence uses "track" as a verb
- [x] 2.5 Update the title and description of the `ontrack` key in `src/schemas.ts`, regenerate `schema/ontrack.schema.json`, and add the test for the scenario "The schema names a track"
- [x] 2.6 Update the remaining comments and test helpers (`src/apply.ts`, `src/plan.ts`, `test/helpers/project.ts`, the other tests)
- [x] 2.7 Run the test suite and the type check; coverage stays at or above 95 %

## 3. Documentation

- [x] 3.1 Rename `docs/find-a-source.md` to `docs/find-a-track.md` and `docs/write-your-own-source.md` to `docs/write-your-own-track.md` with `git mv`, and fix every link to them
- [x] 3.2 Replace the term in every page of `docs/*.md` and in `README.md`, reading each occurrence; replace the keyword `ontrack-source` by `ontrack-tracks`, and say once in `find-a-track` that earlier packages may carry `ontrack-source`
- [x] 3.3 Say once in `how-it-works` and in the glossary (`docs/architecture/arc42/12-glossary.md`) that a track was called a source before this release
- [x] 3.4 Replace the term in `docs/architecture/arc42/` and in `docs/architecture/model/model.c4`
- [x] 3.5 In `site/astro.config.mjs`: update the sidebar slugs and labels ("Use a track", "Maintain a track"), the comments, and add `redirects` from `/find-a-source` and `/write-your-own-source` to the new pages
- [x] 3.6 Build the site: the build and `check-links` pass, and both former URLs redirect

## 4. Specs and repository tooling

- [x] 4.1 Replace the term in the prose of `openspec/specs/apply`, `review`, `agents-file`, `shared-change-workflows` and the requirements of `plan` this change does not restate; no requirement changes
- [x] 4.2 Replace the term in `openspec/schemas/spec-driven-with-adr/schema.yaml`
- [x] 4.3 Change the commit scope `sources` to `tracks` in `commitlint.config.mjs` and, as decided in 1.2, in the ruling of `trivoallan/ADR-0006-commits`; run `npx ontrack apply` so that `AGENTS.md` follows
- [x] 4.4 Rename `.github/workflows/source-updates.yml` to `track-updates.yml`, with its `name:` and comments; update the comments of `.npmrc`, `.github/dependabot.yml`, `.github/workflows/test.yml` and the description in `package.json`

## 5. Verification

- [x] 5.1 Search the repository for "source", case-insensitive. What remains is only: `docs/adr/trivoallan/`, the ADRs of `docs/adr/local/` ruled before ADR-0022, `CHANGELOG.md`, `openspec/changes/archive/`, this change's own files, lockfiles, `LICENSE`, `marketplace/`, and "source code", "open source" or the redirects where they are meant
- [x] 5.2 Run `npx ontrack plan` and `npx ontrack check` on this repository: same result as before the change, with the new word
- [x] 5.3 `openspec validate rename-source-to-track` passes

## 6. After the merge

- [x] 6.1 Commit as `feat!`, with a `BREAKING CHANGE:` footer naming the `plan` line, the error text and the keyword
- [ ] 6.2 After the archive, delete the empty `openspec/specs/sources/`, and rename the scenarios "Mixed source" and "No source" of `openspec/specs/plan/spec.md` to "Mixed track" and "No track" (a delta cannot rename a scenario)
- [ ] 6.3 Tell the publisher of the governance package installed as `trivoallan` to add the keyword `ontrack-tracks` and to reword its ADRs at their next revision
