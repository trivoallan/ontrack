# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-26
- Reviewer: Claude Code, for the maintainer
- Change: add-suggest-command

## In-Force ADR Context Reviewed

- docs/adr/engineering/ADR-0003-architecture.md - the command is one more module of the monolith
- docs/adr/engineering/ADR-0005-validation.md - the `suggest` document is a zod model, its schema derived from it
- docs/adr/engineering/ADR-0007-tests.md - the new code is covered within the 95 % target
- docs/adr/engineering/ADR-0016-changes.md - `spec-driven-with-adr` records decisions as changes make them; `suggest` covers only those made before
- docs/adr/local/ADR-0005-own-adrs-live-in-docs-adr-local.md - where the ADRs the prompt writes go

## Repository-Level ADRs Created

- docs/adr/local/ADR-0029-ontrack-prints-the-prompt-the-agent-reads-the-repository.md - a command that hands judgement to an agent prints a prompt and does not inspect the repository itself

## Notes

- The ADR records the principle `review` already followed, now that a second command relies on it.
