# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-15
- Reviewer: Tristan Rivoallan
- Change: reusable-propose-apply-workflows

## In-Force ADR Context Reviewed

- docs/adr/ADR-0002-a-label-asks-for-a-change.md - the propose label, kept and made configurable
- docs/adr/ADR-0003-a-label-on-an-approved-pull-request-starts-its-apply.md - the apply gate, kept and made callable
- docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md - gains the ADR directory trait upstream
- docs/adr/trivoallan/ADR-0011-forge-and-ci.md - pins by SHA, no agent with a write token, `pull_request_target` checks out nothing
- docs/adr/trivoallan/ADR-0014-work-tracking.md - the issue text stays data
- docs/adr/trivoallan/ADR-0016-changes.md - the `changes` trait the run checks
- docs/adr/trivoallan/ADR-0018-dependencies.md - callers' bumps via Dependabot
- docs/adr/trivoallan/ADR-0020-adding-dependencies.md - the OpenSpec version pinned in the catalog

## Repository-Level ADRs Created

- docs/adr/ADR-0004-other-repositories-call-the-propose-and-apply-workflows.md - the workflows stay in ontrack, other repositories call them, with a closed framework catalog

## Notes

ADR-0002 and ADR-0003 stay in force: this change adds callers, it does not revisit what the labels do.
