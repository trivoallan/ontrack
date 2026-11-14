## MODIFIED Requirements

### Requirement: Output format
The output SHALL follow the contract in the commands reference, `docs/commands.md`, as lines on standard output:
1. one line per reported ADR, sorted by reference: the status (`pass`, `fail` or `unchecked`) padded with spaces to 11 characters, then `<title> (<reference>)`. The title is read as in `adr-revision`; without one, the reference stands alone, without parentheses;
2. after each `fail` line: `  rule: <path of the ADR's file relative to the project root, with forward slashes>`, then `  check: <command>`, then each line of the command's standard output followed by each line of its standard error, prefixed with `  | `, with trailing blank lines removed;
3. a last line `<f> failed, <p> passed, <u> unchecked`.

The output of a passing command SHALL NOT be printed. With no ADR to report, the output SHALL be the last line alone, with three zeros.

#### Scenario: One of each
- **WHEN** `trivoallan/ADR-0006-commits` (title `Commits`) carries a check `echo "scope may not be empty"; exit 1`, `trivoallan/ADR-0009-branching` (title `Branching`) carries the check `true`, and `trivoallan/ADR-0001-record-architecture-decisions` (title `Record architecture decisions`) has decided traits and no check
- **THEN** the output is the example of the commands reference, `docs/commands.md`, byte for byte: an `unchecked` line for ADR-0001, a `fail` line for ADR-0006 followed by `  rule: docs/adr/trivoallan/ADR-0006-commits.md`, its `  check:` line and `  | scope may not be empty`, a `pass` line for ADR-0009, then `1 failed, 1 passed, 1 unchecked`

#### Scenario: Nothing to report
- **WHEN** the project has no `docs/adr/` directory
- **THEN** the output is exactly `0 failed, 0 passed, 0 unchecked`
