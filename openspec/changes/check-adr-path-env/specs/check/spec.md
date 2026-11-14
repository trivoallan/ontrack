# Spec Delta

## MODIFIED Requirements

### Requirement: Running the commands
`ontrack check` SHALL run each command through the system shell, with the project root as working directory, one at a time, in the order of the ADR references. The command's environment SHALL be the caller's, with `ONTRACK_ADR` set to the path of the ADR's file relative to the project root, with forward slashes: the value of the `rule:` line of a `fail`. It SHALL run every command even after one has failed. A command passes when it exits with code `0`, and is unchecked when it exits with code `78`. Any other outcome fails: another non-zero exit code, a termination by signal, or a command that cannot be started. `ontrack check` itself MUST NOT create, modify or delete any file, and MUST NOT make any network call; what the commands do is theirs.

#### Scenario: Passing command
- **WHEN** an ADR carries the check `true`
- **THEN** it is reported as `pass`

#### Scenario: Failing command
- **WHEN** an ADR carries the check `exit 3`
- **THEN** it is reported as `fail`

#### Scenario: Unknown program
- **WHEN** an ADR carries the check `no-such-program-xyz`
- **THEN** it is reported as `fail`, and the shell's message appears in its output lines

#### Scenario: Working directory
- **WHEN** an ADR carries the check `test -d docs/adr` and `ontrack check` runs at the project root
- **THEN** it is reported as `pass`

#### Scenario: A failure does not stop the run
- **WHEN** `local/ADR-0001-a` carries the check `exit 1` and `local/ADR-0002-b` carries the check `true`
- **THEN** `local/ADR-0001-a` is reported as `fail` and `local/ADR-0002-b` as `pass`

#### Scenario: The command knows its ADR
- **WHEN** `docs/adr/trivoallan/ADR-0006-commits.md` carries the check `test "$ONTRACK_ADR" = docs/adr/trivoallan/ADR-0006-commits.md`
- **THEN** it is reported as `pass`

#### Scenario: One path per command
- **WHEN** `docs/adr/ADR-0001-a.md` and `docs/adr/trivoallan/ADR-0006-commits.md` both carry the check `echo "$ONTRACK_ADR"; exit 1`
- **THEN** the output lines of each `fail` hold that ADR's own path, equal to its `rule:` line

#### Scenario: The caller's environment is kept
- **WHEN** the caller's environment holds `ONTRACK_TEST_MARK=kept` and an ADR carries the check `test "$ONTRACK_TEST_MARK" = kept`
- **THEN** it is reported as `pass`
