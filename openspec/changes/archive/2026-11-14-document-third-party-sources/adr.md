# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-14
- Reviewer: Tristan Rivoallan
- Change: document-third-party-sources

## In-Force ADR Context Reviewed

- docs/adr/ADR-0001-propose-changes-from-labelled-issues.md - not affected
- docs/adr/trivoallan/ADR-0002-localization.md - the pages are written in English
- docs/adr/trivoallan/ADR-0008-documentation.md - the new page lives under `docs/` and is built by Starlight
- docs/adr/trivoallan/ADR-0016-changes.md - the change follows the OpenSpec workflow
- docs/adr/trivoallan/ADR-0020-adding-dependencies.md - a person approves each dependency: the documentation links to a search and endorses no source
- The other accepted ADRs under docs/adr/trivoallan/ (0001, 0003 to 0007, 0009 to 0012, 0014, 0015, 0017 to 0019, 0021) were read and do not bear on a documentation change. ADR-0013 is `rejected` and decides nothing.

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change.

## Notes

The keyword `ontrack-source` is a convention stated in the documentation. No code reads it. A later change that makes ontrack depend on it records that decision then.
