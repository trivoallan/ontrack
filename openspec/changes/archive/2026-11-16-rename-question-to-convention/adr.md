# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-16
- Reviewer: Claude Code, for the maintainer
- Change: rename-question-to-convention

## In-Force ADR Context Reviewed

- docs/adr/engineering/ADR-0001-record-architecture-decisions.md - format of the new ADR; a ruled ADR is not edited, a change of decision is a new ADR that supersedes.
- docs/adr/engineering/ADR-0002-localization.md - the terms and the documentation are in English.
- docs/adr/engineering/ADR-0006-commits.md - the scope list holds `instructions` and no scope named after the terms that change: nothing to rule again.
- docs/adr/engineering/ADR-0008-documentation.md - the renamed pages live in `docs/` and are served by Starlight.
- docs/adr/engineering/ADR-0010-architecture-documentation.md - the arc42 pages and the glossary name the terms.
- docs/adr/engineering/ADR-0016-changes.md - this change follows the OpenSpec workflow.
- docs/adr/local/ADR-0022-a-package-of-questions-is-called-a-track.md - named the track and kept "question"; superseded by ADR-0027, left as written.
- docs/adr/local/ADR-0025-a-ruled-adr-follows-the-files-it-references.md - the pages a ruled ADR links to are renamed in this change: see the note below.
- The other in-force ADRs of docs/adr/engineering/ and docs/adr/local/ were listed; none bears on a change of vocabulary.

## Repository-Level ADRs Created

- docs/adr/local/ADR-0027-a-track-ships-conventions.md - one word per level: a track ships conventions, a repository rules on them, its own ADRs are decisions, agents read instructions; supersedes ADR-0022 and restates the track.

## Notes

Every imported ADR opens with "A question governance asks your
repository": the track's text, left as it is until its next release.

Two pages are renamed. A ruled ADR that links to one of them is handled as
ADR-0025 says, in the task that renames the pages.
