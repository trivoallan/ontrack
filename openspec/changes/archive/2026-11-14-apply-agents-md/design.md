# Design

## Context

See proposal.md (Why). `buildInstructions(root)` reads `docs/adr/` and throws
on a trait conflict; `formatInstructions` renders the block with its markers.
`plan`'s handler prints `formatPlan` and returns `2` on pending changes;
`apply`'s handler runs actions, then prints `formatApply`. The trial
repository this feature targets has a `CLAUDE.md`, so Claude Code ignores
`AGENTS.md` there until `CLAUDE.md` imports it.

## Goals / Non-Goals

**Goals:**
- One writer (`apply`), one reporter (`plan`), one previewer (`instructions`).
- A problem in `AGENTS.md` never blocks the work on ADRs.

**Non-Goals:**
- Writing `CLAUDE.md` or any other agent file; an option to disable the step; keeping manual edits made between the markers.

## Decisions

**One module, `src/agents.mjs`, with two functions.**
`agentsStatus(root)` returns `{ state, reason, block, text, warning }` and
never throws; `writeAgents(root, status)` writes and returns `'created'` or
`'updated'`. Both commands call `agentsStatus`; only `apply` calls
`writeAgents`. *Alternative:* folding it into `buildPlan`, which would make a
source-level structure carry a repository-level file.

**`skipped` instead of an error.**
Malformed markers and trait conflicts are caught inside `agentsStatus` and
become a state with a reason. `plan` and `apply` print it and count it as
pending (exit `2`). An exit `1` would have stopped `apply` before it imported
anything, for a problem in a file unrelated to the import.

**The block is computed after the ADR actions.**
Imports add pending ADRs, a migration changes references (`local/…` becomes
`<alias>/…`), a prune removes entries. `apply` therefore runs its actions,
then calls `agentsStatus` on the resulting tree. In a dry run the resulting
tree does not exist: the line is printed when the current block is not
current or when the run holds an import, move or prune. It may announce an
update that turns out to be a no-op; a dry run that under-reports would be
worse.

**Top-level `AGENTS.md:` lines, not per-source action rows.**
`AGENTS.md` belongs to the repository, not to a source, so its lines sit
after the source blocks in both commands, with the same prefix in `plan`
(`rules block missing`), `apply` (`rules block created`) and for the warning.

**Marker matching is line-based.**
A marker is a line equal to the marker text once trailing whitespace is
removed. Replacement splices lines, so bytes outside the pair are untouched.
The file's line ending (CRLF when its first line ends with `\r`) is applied
to the block.

**The Claude Code warning is a string check.**
`CLAUDE.md` or `CLAUDE.local.md` exists at the root, and no line of
`CLAUDE.md` trims to `@AGENTS.md`. Claude Code reads `AGENTS.md` natively
only when neither file exists (checked against its documentation on
2026-11-14). Imports nested in other files are not followed.

**No-source repositories.**
`plan` prints `no ontrack source found` and still reports the block: a
repository can decide traits in its own ADRs without any source.

## Risks / Trade-offs

- [A dev edits text between the markers] → Overwritten at the next `apply`; the diff shows it before commit. The README says the block belongs to ontrack.
- [An agent other than Claude Code with its own rules about `AGENTS.md`] → Not detected; the warning only covers Claude Code.
- [`@AGENTS.md` imported from a nested file or under `.claude/`] → The warning shows although the block is read. It does not change the exit code.
