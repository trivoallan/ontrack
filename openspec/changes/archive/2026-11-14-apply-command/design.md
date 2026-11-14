# Design

## Context

See proposal.md (Why). `buildPlan(root)` returns, per source, the ADRs with
their category and title and the list of flat-layout files; `formatPlan`
renders the contract. Commands are yargs modules whose `handler` returns the
exit code. Decisions taken in the PRD: never touch `revised`, list links
without rewriting, `--prune` and `--confirm all` in v1, `--dry-run` as the
guard.

## Goals / Non-Goals

**Goals:**
- One command, safe by default, every write announced and checked before it happens.

**Non-Goals:**
- Rewriting links, touching `revised` ADRs, committing, schemas and traits.
- An interactive mode.

## Decisions

**Plan, then actions, then a fresh plan.**
`apply` builds the plan, turns it into a list of actions (`import`, `move`,
`prune`, `confirm`), validates them all, executes them (or prints them on
`--dry-run`), then builds the plan again to print what remains and compute
the exit code. Recomputing instead of predicting keeps `plan` and `apply`
from ever disagreeing. In a dry run, the remaining plan is derived by
removing the planned actions from the first plan.

**`buildPlan` entries gain `adrDir`.** `apply` needs the source path to copy
from and to read upstream revisions; `formatPlan` ignores the field.

**Order: import, move, confirm, prune.** Confirm runs after moves, so a flat
`undetermined` file is edited at its new path.

**`git mv` when inside a work tree, rename otherwise.**
`git rev-parse --is-inside-work-tree` decides. A failing `git mv` (untracked
file) falls back to `fs.renameSync`, so the result on disk is the same.

**Links: a small line scanner, in `src/links.mjs`.**
Three patterns (inline `](target)`, image `![..](target)`, reference
`[label]: target`), fenced blocks skipped (lines toggled by ```` ``` ```` or
`~~~`), schemes (`scheme:`) and absolute paths skipped, `#anchor` and
`"title"` stripped. Targets are resolved against the holding file and
compared with the old paths of moved files. *Alternative:* a Markdown parser,
a dependency for a list nobody rewrites yet.

**`--confirm` edits one line.** It replaces the column-zero `revision:` line
in the bounded frontmatter, or inserts one after `status:` (first line
otherwise). The frontmatter bounding from `revision.mjs` is reused, so a
`revision:` in a body example is never touched.

**Errors before writes.** Unknown or non-confirmable `--confirm` names, and
targets that unexpectedly exist, are checked on the action list before the
first write. A failure mid-run (disk error) is reported with what was done so
far; it is not rolled back.

## Risks / Trade-offs

- [`--confirm all` asserts many verdicts at once] → `--dry-run` shows the list first, and `git diff` shows every change before a commit.
- [Partial run after an I/O error] → Rare; the output names the completed actions, and `git checkout -- docs/adr` restores tracked files.
- [Link forms the scanner misses] → Not rewritten anyway; v1 only lists. Measured on the dev's repository before v2 rewrites anything.
