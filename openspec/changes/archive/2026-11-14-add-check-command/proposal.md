# Proposal

## Why

`ontrack instructions` tells a coding agent what the repository decided, but
nothing tells it when its work departs from those decisions: in ontrack's own
history, only 6 of 10 commits carry a scope. An agent corrects itself on a
failing check with a readable log, not on one more advisory line, and a check
that blocks must be deterministic. The tools that judge already exist
(commitlint, linters, test runners); what is missing is the link from a failed
tool back to the decision it enforces.

## What Changes

- New command `ontrack check`. An ADR may carry a top-level frontmatter key
  `check:` holding one shell command. `ontrack check` runs the command of every
  ADR that is `accepted` and not superseded, from the project root, in
  reference order.
- A command that exits `0` passes. Any other outcome fails.
- The output names each ADR as `pass`, `fail` or `unchecked`. A failed ADR is
  followed by the path of its file, the command, and the command's output, so
  the agent knows which decision it broke and where to read it. `unchecked`
  lists the ADRs that carry decided traits and no `check:`.
- Exit code `2` when at least one check failed, `0` otherwise, `1` on error.
  A trait conflict (see `instructions`) is an error, and no command runs.
- ontrack judges nothing itself: it has no rule engine and calls no model.
- Only the ADRs committed under `docs/adr/` are read. A command shipped by a
  source in `node_modules` never runs until `apply` has copied its ADR and the
  repository holds it as `accepted`.
- `ontrack --help` lists `check`. The README documents the output contract.

Out of scope: a GitHub Action wrapping the command, a line in the `AGENTS.md`
block asking agents to run it, timeouts, and parallel runs.

## Capabilities

### New Capabilities
- `check`: which ADRs carry a check, how their commands run, and the
  `ontrack check` output contract.

### Modified Capabilities
- `cli`: "Command help" lists `check`; "Exit codes shared by subcommands"
  gives `2` a second meaning, a failed check.

## Impact

- New `src/check.mjs` and `src/commands/check.mjs`. `src/cli.mjs` registers
  the command. `src/instructions.mjs` reads the `check:` key next to the
  others.
- `README.md`: a new "`ontrack check` output contract" section, the Usage
  list, and the exit code table.
- New `test/check.test.mjs`; `test/cli.test.mjs` checks the help text.
- No new dependency. `ontrack check` spawns a shell, which no command did
  until now.
- trivoallan/governance is not changed here: adding `check:` to its ADRs is
  that repository's work.
