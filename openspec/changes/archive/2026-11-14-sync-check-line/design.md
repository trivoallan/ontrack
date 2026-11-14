# Design

## Context

See proposal.md for the motivation. `planSource()` in `src/plan.ts` reads both
copies of each shipped ADR and maps `compareRevision()`'s result to a category.
`planActions()` in `src/apply.ts` turns categories into actions that are all
checked before the first write, `runActions()` executes them in `KINDS` order,
and `planAfter()` predicts the remaining plan for `--dry-run`.
`src/revision.ts` already holds `frontmatter()` and `setRevision()`, which
edits one column-zero line and keeps the file's line endings.

## Goals / Non-Goals

**Goals:**
- A source's check reaches a repository that already ruled, without a new
  verdict.
- The command that will run is printed by `plan` before `apply` writes it.

**Non-Goals:**
- Synchronizing anything else of a ruled ADR (title, body, trait keys). That is
  what `revision:` and a new verdict are for.
- A flag to refuse or pin a check. Superseding the ADR locally does it.
- Changing `adr-revision`: the classification still compares `revision:` only.
  The check comparison is a second, independent look done by `plan`.

## Decisions

**A category of `plan`, not a field next to it.** `check` slots between
`unreadable` and `unchanged`, so `hasPendingChanges()`, the counts line and
`planAfter()` work unchanged. It only applies to an `up-to-date` ADR.
Alternative: also synchronize `revised` and `undetermined` ADRs (rejected: a
revised question may come with a check written for the new question; running it
against the old verdict fails for the wrong reason. Once the repository rules
again, the ADR is up to date and the check follows).

**Compare the `check:` line as text, not the command read from it.** Trailing
whitespace aside, the line is copied as the source wrote it, comment and quotes
included. One rule covers added, changed and removed, and what `plan` prints is
exactly what `apply` writes. Alternative: compare the command `ontrack check`
would read (rejected: a comment-only change upstream would never arrive, and
two code paths would have to agree on quoting).

**The line belongs to the source, in both directions.** A local-only `check:`
in an imported ADR is removed when the source has none. Alternative: only
propagate when the source has a line (rejected: a check removed upstream would
run forever downstream, and "who owns this line" would depend on history). The
override stays what it already is for traits: a local ADR with `supersedes:`.

**No flag.** `--prune` and `--confirm` exist because they delete a file or
assert a verdict. A check line is neither, `plan` shows it, `--dry-run` shows
it, and `apply` never commits. A flag would mean checks do not flow by
default, which is the problem this change solves.

**`readCheckLine(text)` and `setCheckLine(text, line)` in `src/revision.ts`**,
next to `setRevision()` and built the same way: find the column-zero line among
the frontmatter lines, replace it, insert it after `revision:` (an up-to-date
ADR always has one), or splice it out when `line` is null. `planSource()`
stores `adr.check = { from, to }` on a `check` ADR; `planActions()` emits a
`synced` action carrying it; `runActions()` writes after `moved` and
`confirmed`, before `pruned`.

## Risks / Trade-offs

- [A source update changes what runs in CI at the next `apply`] → `plan` and
  `apply` print the `-`/`+` lines, and the write shows in the diff of the pull
  request that carries it. The README trust note says so.
- [A repository's own `check:` in an imported ADR disappears] → Marked BREAKING
  in the proposal. No repository has one today: no ADR of ontrack carries a
  `check:`, and governance ships none yet.
- [The `plan` format gains lines indented by four spaces] → A consumer that
  reads only the two-space ADR lines keeps working; the README contract is
  updated first.
- [An indented block under `check:` is left behind when the line is replaced]
  → `ontrack check` already ignores such lines; the README says a check is one
  line.

## Migration Plan

Archive `add-check-command` first. No data migration: the first `plan` after
upgrading reports `check` for any up-to-date ADR whose source gained a check.
