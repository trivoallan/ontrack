# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-14
- Reviewer: Claude, for Tristan Rivoallan
- Change: plan-all

## In-Force ADR Context Reviewed

The repository has no ADR of its own (no file directly in `docs/adr/`). The 20 accepted governance ADRs under `docs/adr/trivoallan/` are in force; none supersedes another. `ADR-0013-frontend` is rejected and decides nothing. Those that bear on this change:

- docs/adr/trivoallan/ADR-0002-localization.md - artifacts, code and documentation in English.
- docs/adr/trivoallan/ADR-0003-architecture.md - monolith: the option lives in the existing `plan` module.
- docs/adr/trivoallan/ADR-0004-languages.md - TypeScript.
- docs/adr/trivoallan/ADR-0005-validation.md - `status:` is read through the zod model of the frontmatter.
- docs/adr/trivoallan/ADR-0006-commits.md - commit scope `plan`.
- docs/adr/trivoallan/ADR-0007-tests.md - 95 % coverage target holds for the new code.
- docs/adr/trivoallan/ADR-0008-documentation.md - the output contract is documented in `docs/commands.md`.
- docs/adr/trivoallan/ADR-0016-changes.md - this change follows the `spec-driven-with-adr` schema.

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change.

## Notes

The choice of an option over a `list` command is a product decision recorded in `design.md`; it commits no architecture.
