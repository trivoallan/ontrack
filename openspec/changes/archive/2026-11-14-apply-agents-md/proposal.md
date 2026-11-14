# Proposal

## Why

`ontrack instructions` prints the rules a repository decided in its ADRs as a
block for `AGENTS.md`, but someone has to paste it, and paste it again each
time an ADR is ruled, superseded or imported. A pasted block goes stale
silently, and the coding agent then follows rules the repository no longer
holds. The `instructions-command` design already assigned the writing to
`apply` and the drift report to `plan`; this change does it.

## What Changes

- `apply` keeps the rules block of the root `AGENTS.md` current: it replaces what sits between `<!-- ontrack:begin -->` and `<!-- ontrack:end -->`, appends the block when the file has no markers, and creates the file when there is none and at least one ADR is decided or pending.
- `plan` reports a missing or out-of-date block as a pending change (exit `2`).
- A problem that prevents the block from being written (malformed markers, two decided ADRs sharing a trait key) only skips the `AGENTS.md` step: ADRs are still handled, the file is left untouched, the reason is printed, and the run counts as pending.
- `plan` and `apply` warn when `CLAUDE.md` or `CLAUDE.local.md` exists at the root without importing `AGENTS.md`: Claude Code then ignores `AGENTS.md`. ontrack never writes those files.
- `apply` no longer writes under `docs/adr/` only: it also writes the root `AGENTS.md`.
- `instructions` is unchanged.

## Capabilities

### New Capabilities
- `agents-file`: keeping the ontrack rules block of `AGENTS.md` current: what the block is, how `apply` writes it, how `plan` reports its state, and the `CLAUDE.md` warning.

### Modified Capabilities
- `apply`: "Same plan as plan" allows writing the root `AGENTS.md`; "Output and exit code" adds the `AGENTS.md` line and counts its state as pending.
- `plan`: "Read-only and offline" also reads `AGENTS.md`, `CLAUDE.md` and `CLAUDE.local.md`; "Exit code" returns `2` when the rules block needs attention. "Output format" adds the `AGENTS.md` lines after the source lines, and its "Nothing to do" scenario now requires a current block.

## Impact

- New: `src/agents.mjs`, `test/agents.test.mjs`.
- Changed: `src/commands/plan.mjs`, `src/commands/apply.mjs`, `test/plan.test.mjs`, `test/apply.test.mjs`, README (`plan`, `apply`, `instructions` sections).
- Reuses `buildInstructions` / `formatInstructions` unchanged. No new dependency.
