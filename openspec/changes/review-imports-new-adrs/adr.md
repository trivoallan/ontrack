# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-15
- Reviewer: Claude Code, for Tristan Rivoallan
- Change: review-imports-new-adrs

## In-Force ADR Context Reviewed

- docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md - format of an ADR, should one be needed
- docs/adr/trivoallan/ADR-0007-tests.md - the new selection and prompt are covered at 95 %
- docs/adr/trivoallan/ADR-0008-documentation.md - the commands reference and the guides change with the code
- docs/adr/trivoallan/ADR-0016-changes.md - the change goes through OpenSpec, with this review
- docs/adr/local/ADR-0022-a-package-of-questions-is-called-a-track.md - vocabulary used in the prompt and the documentation
- The other in-force ADRs of docs/adr/trivoallan/ (0002 to 0006, 0009 to 0012, 0014, 0015, 0017 to 0021) and of docs/adr/local/ (0002 to 0005) were read by their frontmatter and title only: by title, none rules on the commands of the CLI. ADR-0013 is rejected and local ADR-0001 is superseded by local ADR-0002.

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change.

## Notes

`apply` stays the only command that writes and `review` still only prints a prompt: the change adds one prompt and reorders a selection. That is a behaviour of one command, specified in `openspec/specs/review/`, not a commitment that binds later changes.
