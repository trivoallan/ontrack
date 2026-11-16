# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-16
- Reviewer: the maintainer, on the pull request of this change
- Change: add-error-codes

## In-Force ADR Context Reviewed

- docs/adr/engineering/ADR-0004-languages.md - TypeScript, run by Node without a build: the error class declares its field, with no parameter property.
- docs/adr/engineering/ADR-0005-validation.md - zod at the boundary: the code of an invalid `package.json` is chosen from the zod error.
- docs/adr/engineering/ADR-0007-tests.md - the 95% coverage target applies to the new code.
- docs/adr/engineering/ADR-0008-documentation.md - the Error messages page is public documentation and changes with the code.
- docs/adr/engineering/ADR-0012-delivery.md - release notes come from the commits: the breaking change is said in the commit.
- docs/adr/engineering/ADR-0016-changes.md - a change in what a command prints goes through an OpenSpec change.

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change. That a code is stable and never reused is a requirement of the `cli` capability, specified in its delta spec.

## Notes

- The maintainer may prefer to record the stability of the codes as an ADR under `docs/adr/local/`: it binds every later change to an error. It is left to the review of this change.
