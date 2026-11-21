# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-22
- Reviewer: Tristan Rivoallan
- Change: remove-product-track

## In-Force ADR Context Reviewed

- docs/adr/local/ADR-0025-a-ruled-adr-follows-the-files-it-references.md - rule 4: a ruled ADR's body freezes and the directory is a log; this change deletes ruled ADRs instead of superseding them (see Notes)
- docs/adr/local/ADR-0028-the-tracks-of-this-owner-skip-the-cooldown.md - deleted by this change; it differed from ADR-0026 only by the product track
- docs/adr/local/ADR-0026-the-engineering-track-skips-the-cooldown-under-its-new-alias.md - in force again once ADR-0028 is gone, unchanged
- docs/adr/product/ADR-0001-record-product-decisions.md to ADR-0005-handoff.md - deleted with the track
- docs/adr/local/ADR-0005-own-adrs-live-in-docs-adr-local.md - no change: no own ADR is written
- docs/adr/engineering/ADR-0016-changes.md - this work is planned as an OpenSpec change
- docs/adr/engineering/ADR-0008-documentation.md - the site keeps its pages and its catalogue

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change.

## Notes

The product ADRs and local/ADR-0028 are deleted, not superseded, on the
maintainer's decision. That departs once from rule 4 of local/ADR-0025, which
is not revisited here. design.md records why, and the git history holds the
deleted files.
