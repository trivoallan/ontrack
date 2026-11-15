# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-15
- Reviewer: Claude Code, for the maintainer
- Change: track-catalogue

## In-Force ADR Context Reviewed

- docs/adr/trivoallan/ADR-0008-documentation.md - Starlight under `docs/`, public audience, release and main channels: the catalogue is one more set of pages of that site
- docs/adr/trivoallan/ADR-0018-dependencies.md - Dependabot bumps the track, so the catalogue follows the installed release
- docs/adr/trivoallan/ADR-0020-adding-dependencies.md - install scripts stay ignored in `docs.yml`; no dependency is added
- docs/adr/local/ADR-0023-the-governance-track-skips-the-cooldown.md - the track's bumps land without delay
- docs/adr/local/ADR-0005-own-adrs-live-in-docs-adr-local.md - the catalogue lives outside `docs/adr/`, so `readAdrs` never reads it
- docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md - imported copies are not edited; the catalogue reads the package's files unchanged

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change.

## Notes

The site reading a dependency's files is a choice of the docs-site spec, recorded there.
