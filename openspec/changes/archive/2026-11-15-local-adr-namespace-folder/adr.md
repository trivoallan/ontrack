# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-15
- Reviewer: Claude, for Tristan Rivoallan
- Change: local-adr-namespace-folder

## In-Force ADR Context Reviewed

- docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md - format of an ADR; says own ADRs live in `docs/adr/`, outside the source's directory: `docs/adr/local/` complies
- docs/adr/trivoallan/ADR-0008-documentation.md - the site is Starlight, built from `docs/`
- docs/adr/trivoallan/ADR-0016-changes.md - this change follows `spec-driven-with-adr`
- docs/adr/trivoallan/ADR-0007-tests.md - 95 % coverage applies to the new code paths
- docs/adr/ADR-0002-a-label-asks-for-a-change.md, ADR-0003, ADR-0004 - the propose and apply workflows, whose ADR path check changes
- Other accepted `trivoallan` ADRs (0002 to 0006, 0009 to 0012, 0014, 0015, 0017 to 0021) - read, not affected. ADR-0013 is rejected; local ADR-0001 is superseded by ADR-0002.

## Repository-Level ADRs Created

- docs/adr/ADR-0005-own-adrs-live-in-docs-adr-local.md - own ADRs live in `docs/adr/local/`; the root is a historical layout that `apply` migrates; `local` is not a source alias

## Notes

- ADR-0005 is written at the root because the propose workflow in force accepts only that path; applying the change moves it with ADR-0001 to ADR-0004.
- No in-force ADR is superseded.
