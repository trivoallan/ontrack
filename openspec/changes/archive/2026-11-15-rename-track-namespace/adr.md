# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-15
- Reviewer: Tristan Rivoallan
- Change: rename-track-namespace

## In-Force ADR Context Reviewed

- docs/adr/local/ADR-0005-own-adrs-live-in-docs-adr-local.md - `local` is a namespace like any other and cannot be a track alias; the orphan-folder rule excludes it.
- docs/adr/local/ADR-0022-a-package-of-questions-is-called-a-track.md - vocabulary: track, namespace, alias.
- docs/adr/local/ADR-0024-the-engineering-track-skips-the-cooldown.md - its `supersedes:` names `trivoallan/` ADRs: the case the new listing covers.
- docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md - imported ADRs are copies of the track's files; nothing may be written into them to record the package.
- docs/adr/trivoallan/ADR-0004-languages.md - TypeScript, unchanged.
- docs/adr/trivoallan/ADR-0007-tests.md - the 95% coverage target applies to the new code.

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change. Inferring the rename from file names, moving the folder first and listing broken references are behaviors of `plan` and `apply`, specified in their delta specs; listing rather than rewriting references follows the existing *Links to moved files* requirement.

## Notes

- The alias the documentation recommends, and the rename of `trivoallan` in this repository, are left to a change of their own.
