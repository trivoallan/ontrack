# Proposal

## Why

trivoallan/governance is about to ship `check:` commands with its ADRs. A
repository that already ruled an ADR would never receive them: `plan` compares
`revision:` only, and `apply` never writes to an ADR the repository holds. The
only way through today is to raise `revision:` upstream, which asks every
repository to rule again on a decision that did not change. A check is tooling,
not part of the verdict: it should follow the source while the decision stays
the repository's.

## What Changes

- `plan` reports a new category, `check`: an imported ADR that is up to date
  with its source and whose `check:` line differs from the source's (added,
  changed or removed upstream). The ADR line is followed by the line that
  would go (`- check: …`) and the line that would come (`+ check: …`), so the
  command that will run is visible before it lands. A `check` ADR is a pending
  change: exit code `2`.
- `apply` synchronizes those ADRs, with no flag: it sets, replaces or removes
  the `check:` line of the local copy to match the source, and changes nothing
  else in the file. The action is reported as `synced`, with the same `-`/`+`
  lines.
- **BREAKING** for a repository that wrote its own `check:` into an imported
  ADR: the line belongs to the source, and `apply` replaces or removes it. A
  repository that wants a different check supersedes the ADR with a local one,
  as it does for traits.
- "Verdicts are never overwritten" gains this one exception. `revised`,
  `undetermined` and `unreadable` ADRs are still never written to by the
  synchronization: their check arrives once they are up to date again.
- README: the `plan` and `apply` contracts, and the trust note of the `check`
  contract.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `plan`: "Classification" adds the `check` category; "Output format" adds its
  count and its `-`/`+` lines; "Exit code" counts it as pending.
- `apply`: new requirement "Synchronizing checks"; "Verdicts are never
  overwritten" names the exception; "Output and exit code" adds `synced`.

## Impact

- `src/revision.mjs`: read and set the `check:` line of a frontmatter.
  `src/plan.mjs`: the `check` category and its lines. `src/apply.mjs`: the
  `synced` action.
- `README.md`: `plan` output contract, `ontrack apply`, and one sentence of
  the `ontrack check` output contract.
- `test/revision.test.mjs`, `test/plan.test.mjs`, `test/apply.test.mjs`.
- No new dependency.
- Builds on `add-check-command`, which gives the `check:` key its meaning.
  That change should be archived first.
- After this change, an update of a source can change what `ontrack check`
  runs in CI at the next `apply`. The diff `apply` leaves shows it, and `plan`
  prints it beforehand.
