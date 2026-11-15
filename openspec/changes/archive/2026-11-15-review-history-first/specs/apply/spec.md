## MODIFIED Requirements

### Requirement: Output and exit code
`apply` SHALL print, per track, one line per action (`imported`, `moved`, `confirmed`, `synced`, `pruned`, laid out like `plan` lines), then the links to update, then the `AGENTS.md` lines (see `agents-file`), then the `plan` output of what still needs a human, if anything. A `synced` line SHALL be followed by the same `- ` and `+ ` lines `plan` prints for that ADR. With `--dry-run`, the first line SHALL be `dry run: nothing written`. It SHALL exit with `2` when the plan after the run (or, in a dry run, the plan the run would leave) still has pending changes or the `AGENTS.md` block is `skipped` (or, in a dry run, still to create or update), with `0` otherwise, and with `1` on error. Every check on ADR actions SHALL run before the first write, so that an error never leaves a partly applied repository. When at least one ADR under `docs/adr/` is `proposed` after the run, `apply` SHALL write the next step to stderr: the count, that the ADRs are ruled when the user chooses and the repository works as it is, then that `check` runs only the decided ADRs and to start with a few, then `ontrack review` as a shell command and as a prompt for a coding agent; standard output and the exit code SHALL NOT depend on it. When no ADR is `proposed` and at least one is revised (see the `review` capability), it SHALL write the count of the revised ADRs to rule again, then the same two `ontrack review` lines.

#### Scenario: Next step after an import
- **WHEN** `apply` imports three `proposed` ADRs
- **THEN** stderr reads `next: 3 proposed ADRs, ruled when you choose: the repository works as it is`, then `  check runs only the decided ADRs. Start with a few:`, then `  from a shell:  claude "$(npx ontrack review)"`, then ``  as a prompt:   Run `npx ontrack review` and follow its output.``, and standard output and the exit code are what they are without it

#### Scenario: Next step for revised ADRs
- **WHEN** no ADR is `proposed` after the run and one `accepted` ADR is `revised`
- **THEN** stderr starts with `next: 1 revised ADR to rule again`, followed by the two `ontrack review` lines, and contains no `check runs` line

#### Scenario: No next step
- **WHEN** no ADR under `docs/adr/` is `proposed` or revised after the run
- **THEN** `apply` writes nothing to stderr

#### Scenario: Partly pending
- **WHEN** a track has one `new` and one `revised` ADR
- **THEN** `apply` imports the new one, prints it as `imported`, prints the `revised` line under what remains, and exits with `2`

#### Scenario: Only the rules block to write
- **WHEN** every ADR is unchanged and the `AGENTS.md` block is out of date
- **THEN** `apply` prints `AGENTS.md: rules block updated` and exits with `0`

#### Scenario: Only a check to synchronize
- **WHEN** track `trivoallan` has one `check` ADR, `ADR-0006-commits`, with a local line `check: exit 0` and a track line `check: exit 1`, and everything else is current
- **THEN** `apply` prints `trivoallan: 1 synced`, then `  synced        ADR-0006-commits`, then `    - check: exit 0`, then `    + check: exit 1`, and exits with `0`

#### Scenario: Dry run of a synchronization
- **WHEN** `apply --dry-run` runs on the same project
- **THEN** the output starts with `dry run: nothing written`, names the ADR as `synced` with its `-` and `+` lines, every file is byte-identical afterwards, and the exit code is `0`

#### Scenario: Next step for a single proposed ADR
- **WHEN** `apply` imports one `proposed` ADR
- **THEN** stderr starts with `next: 1 proposed ADR, ruled when you choose: the repository works as it is`
