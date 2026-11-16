# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-16
- Reviewer: the maintainer, on the pull request of this change
- Change: publish-json-output-schemas

## In-Force ADR Context Reviewed

- docs/adr/engineering/ADR-0005-validation.md - zod is the validation library, and a published schema is derived from its model: the documents follow the way of `schema/ontrack.schema.json`.
- docs/adr/engineering/ADR-0004-languages.md - TypeScript: the types of the documents are inferred from the models.
- docs/adr/engineering/ADR-0007-tests.md - the 95% coverage target applies to the new code.
- docs/adr/engineering/ADR-0012-delivery.md - the package ships `schema/`, already in `files`.
- docs/adr/engineering/ADR-0016-changes.md - a change to a capability goes through an OpenSpec change.

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change. It applies ADR-0005 to what ontrack writes.

## Notes

- None.
