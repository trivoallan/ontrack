# Spec Delta

## MODIFIED Requirements

### Requirement: Unchecked decisions
An ADR that carries decided traits (see `instructions`) and no check SHALL be reported as `unchecked`. An ADR whose command exits with code `78` SHALL be reported as `unchecked` too: the code is reserved for a command that has nothing to verify. An `accepted` ADR with neither decided traits nor a check SHALL NOT appear in the output.

#### Scenario: Traits without a check
- **WHEN** `trivoallan/ADR-0001-record-architecture-decisions` is `accepted` with a traits block and no `check:`
- **THEN** it is reported as `unchecked`

#### Scenario: Nothing to verify
- **WHEN** an ADR carries the check `echo "commits.tool is none, nothing to check"; exit 78`
- **THEN** it is reported as `unchecked`, its output is not printed, and it counts as unchecked in the last line

### Requirement: Running the commands
`ontrack check` SHALL run each command through the system shell, with the project root as working directory and the caller's environment, one at a time, in the order of the ADR references. It SHALL run every command even after one has failed. A command passes when it exits with code `0`, and is unchecked when it exits with code `78`. Any other outcome fails: another non-zero exit code, a termination by signal, or a command that cannot be started. `ontrack check` itself MUST NOT create, modify or delete any file, and MUST NOT make any network call; what the commands do is theirs.

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

### Requirement: Exit code
`ontrack check` SHALL exit with code `2` when at least one check failed, and with code `0` otherwise. `unchecked` ADRs do not change the exit code, whether they carry no check or their command exited with `78`.

#### Scenario: A failed check
- **WHEN** one ADR's check fails and another's passes
- **THEN** the exit code is `2`

#### Scenario: Only passes and unchecked
- **WHEN** one ADR's check passes and another ADR is `unchecked`
- **THEN** the exit code is `0`

#### Scenario: A command with nothing to verify
- **WHEN** the only ADR carrying a check has the command `exit 78`
- **THEN** the exit code is `0`
