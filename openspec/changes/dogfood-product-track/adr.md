# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-21
- Reviewer: Tristan Rivoallan (drafted by an agent; ADR-0028 confirmed by the maintainer on 2026-11-21)
- Change: dogfood-product-track

## In-Force ADR Context Reviewed

- docs/adr/local/ADR-0005-own-adrs-live-in-docs-adr-local.md - the product track's rulings go to `docs/adr/product/`, own ADRs stay in `local/`
- docs/adr/local/ADR-0022-a-package-of-questions-is-called-a-track.md and ADR-0027-a-track-ships-conventions.md - vocabulary of the new pages and spec text
- docs/adr/local/ADR-0025-a-ruled-adr-follows-the-files-it-references.md - ruled ADRs citing `research/desk-test-first-proposal/` would follow the move; archived changes are not ADRs
- docs/adr/local/ADR-0026-the-engineering-track-skips-the-cooldown-under-its-new-alias.md - "no other dependency is exempted": revisited, superseded by ADR-0028
- docs/adr/engineering/ADR-0018-dependencies.md, ADR-0020-adding-dependencies.md - cooldown (rule 2) and admission by a person; via ADR-0026
- docs/adr/engineering/ADR-0008-documentation.md - docs in English under `docs/`, Starlight
- docs/adr/engineering/ADR-0014-work-tracking.md - `Issue served` line of the proposal
- docs/adr/engineering/ADR-0016-changes.md - OpenSpec with `spec-driven-with-adr`, which the product track's ADR-0005 assumes

## Repository-Level ADRs Created

- docs/adr/local/ADR-0028-the-tracks-of-this-owner-skip-the-cooldown.md - the engineering and product tracks are both exempt from the three-day cooldown; supersedes ADR-0026, and carries its traits and `check:` so that `AGENTS.md` keeps the dependency rules

## Notes

- The site reading its tracks from track discovery, and a track's site name being its package name without scope, are recorded in the `track-catalogue` spec, not as ADRs: they describe the site's behaviour, which the spec owns.
- The product track's own five ADRs are ruled with `ontrack review` during apply; this step does not rule them.
