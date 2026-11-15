# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-15
- Reviewer: Tristan Rivoallan
- Change: rename-source-to-track

## In-Force ADR Context Reviewed

- docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md - format of the new ADR; ruled ADRs are not edited.
- docs/adr/trivoallan/ADR-0002-localization.md - the term and the documentation are in English.
- docs/adr/trivoallan/ADR-0006-commits.md - holds the scope list, where `sources` becomes `tracks`; see the open question in design.md.
- docs/adr/trivoallan/ADR-0008-documentation.md - the pages renamed live in `docs/` and are served by Starlight.
- docs/adr/trivoallan/ADR-0010-architecture-documentation.md - the arc42 pages and the LikeC4 model name the term.
- docs/adr/trivoallan/ADR-0016-changes.md - this change follows the OpenSpec workflow.
- docs/adr/local/ADR-0005-own-adrs-live-in-docs-adr-local.md - says "source" in its body; left as written.
- The other in-force ADRs of docs/adr/trivoallan/ and docs/adr/local/ were listed; none bears on a change of vocabulary.

## Repository-Level ADRs Created

- docs/adr/local/ADR-0022-a-package-of-questions-is-called-a-track.md - the package of questions a repository installs is called a track; the metaphor stops at that word; the keyword is `ontrack-tracks`.

## Notes

- No in-force ADR is superseded. The scope list of trivoallan/ADR-0006-commits is a trait, the repository's answer; changing it is a ruling, left to the user (design.md, Open Questions).
- The new ADR is numbered 0022, not 0006. The check of trivoallan/ADR-0006-commits (`governance-check ADR-0006`) looks for `docs/adr/*/ADR-0006-*.md` and fails when a local ADR carries the same number. 0022 is the first number above those the governance package uses today; the defect itself is the package's to fix.
