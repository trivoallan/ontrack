# Spec Delta

## MODIFIED Requirements

### Requirement: Same plan as plan
`ontrack apply` SHALL act only on the plan `ontrack plan` would print for the same project at the same moment. It MUST NOT make any network call, and every file it writes, moves or deletes SHALL be under the project's `docs/adr/`, except the root `AGENTS.md`, which it writes as described in `agents-file`.

#### Scenario: Nothing to apply
- **WHEN** `plan` reports every ADR unchanged, no migration, and nothing about `AGENTS.md`
- **THEN** `apply` writes nothing, prints the same output as `plan`, and exits with `0`

### Requirement: Output and exit code
`apply` SHALL print, per source, one line per action (`imported`, `moved`, `pruned`, `confirmed`, laid out like `plan` lines), then the links to update, then the `AGENTS.md` lines (see `agents-file`), then the `plan` output of what still needs a human, if anything. With `--dry-run`, the first line SHALL be `dry run: nothing written`. It SHALL exit with `2` when the plan after the run (or, in a dry run, the plan the run would leave) still has pending changes or the `AGENTS.md` block is `skipped` (or, in a dry run, still to create or update), with `0` otherwise, and with `1` on error. Every check on ADR actions SHALL run before the first write, so that an error never leaves a partly applied repository.

#### Scenario: Partly pending
- **WHEN** a source has one `new` and one `revised` ADR
- **THEN** `apply` imports the new one, prints it as `imported`, prints the `revised` line under what remains, and exits with `2`

#### Scenario: Only the rules block to write
- **WHEN** every ADR is unchanged and the `AGENTS.md` block is out of date
- **THEN** `apply` prints `AGENTS.md: rules block updated` and exits with `0`
