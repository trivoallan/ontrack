## Why

The package of questions a repository installs is called a "source". The word says where the questions come from and nothing else, and it reads as "source code" or "data source" in a tool that lives in repositories. The product is named ontrack, yet nothing in its vocabulary says what a repository is on.

Calling that package a **track** gives the product name a literal meaning: a repository that has answered every question of its tracks is on track, and one that has fallen behind is not.

## What Changes

- The domain term "source" becomes "track" everywhere ontrack speaks: the documentation, the CLI output, the error messages, the prompts `review` prints, the published JSON Schema's title and description, the architecture pages and model.
- Only this term changes. "Question", "ruling", "revision", "trait", "alias" and "namespace" stay.
- **BREAKING** `ontrack plan` prints `no track found` where it printed `no ontrack source found`. A script that matches the old text stops matching.
- **BREAKING** Errors of discovery say `track "<alias>" …` where they said `source "<alias>" …`.
- **BREAKING** The npm keyword that marks a published package becomes `ontrack-tracks`. `ontrack-source` is no longer documented; ontrack never read the keyword, so an installed package keeps working without it.
- The pages `find-a-source` and `write-your-own-source` become `find-a-track` and `write-your-own-track`. The old URLs redirect.
- In the code: `src/sources.ts` becomes `src/tracks.ts`, and the identifiers follow (`Source`, `discoverSources`, `sourceManifest`, `SourcePlan`).
- The workflow `source-updates.yml` becomes `track-updates.yml`.
- The commit scope `sources` becomes `tracks`.
- Nothing a repository holds changes: the `ontrack` key (`adr`, `namespace`), the ADR frontmatter, the layout of `docs/adr/` and the rules block of `AGENTS.md` are as before. No repository has anything to migrate.

Not changed, on purpose:

- The files of `docs/adr/trivoallan/`: imported copies, which keep the wording their publisher gave them.
- The ADRs of `docs/adr/local/` ruled before this change: the text of a ruled ADR is frozen.
- `CHANGELOG.md` and `openspec/changes/archive/`: history.
- "source" in its other senses: source code, open source, the `source` keys of `marketplace.json`, the lockfiles, the licence.

## Capabilities

### New Capabilities

- `tracks`: lists the tracks a project uses, by reading its npm dependencies. It takes over every requirement of `sources`, reworded.

### Modified Capabilities

- `sources`: every requirement is removed; the capability is replaced by `tracks`.
- `plan`: the output format names tracks, and the line printed when there is none becomes `no track found`.
- `docs-site`: the URLs of the two renamed pages redirect to the new ones.

The other specs that say "source" in their prose (`apply`, `review`, `agents-file`, `shared-change-workflows`, and the rest of `plan`) get the new word in place, with no change of requirement.

## Impact

- **Code**: `src/sources.ts`, `src/schemas.ts`, `src/plan.ts`, `src/apply.ts`, `src/review.ts`, `schema/ontrack.schema.json` (regenerated), and their tests.
- **Documentation**: every page of `docs/` except the imported ADRs; `README.md`; `docs/architecture/` (arc42 pages, glossary, LikeC4 model); `site/astro.config.mjs` (sidebar slugs, redirects).
- **Repository tooling**: `commitlint.config.mjs`, the ruling of `trivoallan/ADR-0006-commits` (the `scopes` trait) and `AGENTS.md` after it, `.github/workflows/source-updates.yml`, comments of `.npmrc` and `.github/dependabot.yml`, `openspec/schemas/spec-driven-with-adr/schema.yaml`, `package.json` (description).
- **Outside this repository**: published packages carry the keyword `ontrack-source`. Their authors add `ontrack-tracks`; this change can only tell them so.
- **Order**: the change `local-adr-namespace-folder` is implemented and not archived. It adds a requirement to `sources` and modifies `plan`. It must be archived before this one is applied.
