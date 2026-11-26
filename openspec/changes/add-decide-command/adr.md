# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-26
- Reviewer: Claude Code, for the maintainer
- Change: add-decide-command

## In-Force ADR Context Reviewed

- docs/adr/local/ADR-0029-ontrack-prints-the-prompt-the-agent-reads-the-repository.md - `decide` prints fixed text plus the ADRs and what the tracks would import; the agent reads the history and counts the number
- docs/adr/local/ADR-0027-a-track-ships-conventions.md - an ADR a repository writes for itself is a decision: the command is named `decide`
- docs/adr/local/ADR-0025-a-ruled-adr-follows-the-files-it-references.md - the rules on recording decisions (Nygard format) the prompt defers to
- docs/adr/local/ADR-0005-own-adrs-live-in-docs-adr-local.md - new decisions go to `docs/adr/local/`, numbered in one sequence with the own files left in `docs/adr/`
- docs/adr/local/ADR-0004-other-repositories-call-the-propose-and-apply-workflows.md - `propose` already names a workflow, so it is not the command's name
- docs/adr/engineering/ADR-0003-architecture.md - monolithic: one more command module in `src/`, no new package
- docs/adr/engineering/ADR-0005-validation.md - the `decide` document is a zod model, its JSON schema generated from it
- docs/adr/engineering/ADR-0007-tests.md - the new module is covered within the 95 % target
- docs/adr/engineering/ADR-0016-changes.md - the change goes through OpenSpec, and is archived in its pull request
- docs/adr/engineering/ADR-0017-agent-tooling.md - Claude Code is the agent host: the prompt names `AskUserQuestion` as an example only

## Repository-Level ADRs Created

- None: no major durable architectural decisions were introduced by this change.

## Notes

The command and its contract are recorded in the `decide` spec and in
`docs/commands.md`. Computing the number in ontrack was considered and
rejected, to stay within `local/ADR-0029` rather than refine it.
