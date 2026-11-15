# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-15
- Reviewer: Tristan Rivoallan
- Change: adopt-engineering-alias

## In-Force ADR Context Reviewed

- docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md - rule 4 freezes a ruled ADR's body; superseded by ADR-0025 for references to moved files.
- docs/adr/local/ADR-0005-own-adrs-live-in-docs-adr-local.md - folders and namespaces under `docs/adr/`; unchanged.
- docs/adr/local/ADR-0022-a-package-of-questions-is-called-a-track.md - vocabulary; unchanged.
- docs/adr/local/ADR-0024-the-engineering-track-skips-the-cooldown.md - names the alias in its decision and asks for a new ADR on a renamed alias; superseded by ADR-0026.
- docs/adr/trivoallan/ADR-0008-documentation.md - the site's published channels; the moved pages get redirects.
- docs/adr/trivoallan/ADR-0016-changes.md - the OpenSpec schema whose instructions name `docs/adr/trivoallan/`.

## Repository-Level ADRs Created

- docs/adr/local/ADR-0025-a-ruled-adr-follows-the-files-it-references.md - when a file a ruled ADR references moves, its link targets and `supersedes:` entries are rewritten, and nothing else; supersedes `trivoallan/ADR-0001`, whose other rules hold.
- docs/adr/local/ADR-0026-the-engineering-track-skips-the-cooldown-under-its-new-alias.md - the cooldown exemption of ADR-0024, with `engineering` in `dependabot.yml`; supersedes `local/ADR-0024`.

## Notes

- Both ADRs list their superseded track ADRs under `trivoallan/`, the namespace in force when they were written; the rename lists those entries and ADR-0025 lets them follow.
- The schema's ADR instruction writes a superseded governance ADR as `trivoallan/ADR-0006-commits`, but ontrack matches `supersedes:` entries on the `adr:` value (`trivoallan/ADR-0006`); both new ADRs use the form ontrack reads.
