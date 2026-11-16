# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-16
- Reviewer: the maintainer, on the pull request of this change
- Change: add-json-output

## In-Force ADR Context Reviewed

- docs/adr/engineering/ADR-0004-languages.md - TypeScript, run by Node without a build.
- docs/adr/engineering/ADR-0005-validation.md - zod validates what ontrack reads; the documents are what it writes, built from data already validated. `data_files: json-schema` concerns files ontrack reads, and no schema file is published for the documents.
- docs/adr/engineering/ADR-0007-tests.md - the 95% coverage target applies to the new code.
- docs/adr/engineering/ADR-0008-documentation.md - the commands reference is public documentation and specifies the documents.
- docs/adr/engineering/ADR-0016-changes.md - a change in what a command prints goes through an OpenSpec change.
- docs/adr/local/ADR-0022-a-package-of-questions-is-called-a-track.md - vocabulary of the keys: track, namespace.

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change. The stability of the documents is a requirement of the `json-output` capability.

## Notes

- Whether the documents deserve a published JSON Schema, as the `ontrack` key has one, is left to a later change.
