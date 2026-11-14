# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-14
- Reviewer: Claude, for Tristan Rivoallan
- Change: move-output-contracts-to-site

## In-Force ADR Context Reviewed

- docs/adr/trivoallan/ADR-0008-documentation.md - the documentation is a Starlight site rooted at `docs/`, for a public audience; the contracts move into it.
- docs/adr/trivoallan/ADR-0010-architecture-documentation.md - the architecture is documented with arc42; three of its sections name the README and are updated.
- docs/adr/trivoallan/ADR-0016-changes.md - changes go through OpenSpec; this is why the move is a change with spec deltas.
- docs/adr/trivoallan/ADR-0007-tests.md - coverage target of 95; the tests that read the documented examples are kept.
- docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md - format of an ADR, read to decide whether one is needed here.
- The other in-force governance ADRs (0002 to 0006, 0009, 0011, 0012, 0014, 0015, 0017, 0018) were read and do not bear on this change. ADR-0013 is `rejected`.

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change.

## Notes

- The durable commitment at stake, that an output format is a contract documented before it changes, is stated in arc42 section 2 and is unchanged. This change moves the file that holds the contracts; it does not alter the commitment.
- The repository has no ADR of its own under `docs/adr/` yet.
