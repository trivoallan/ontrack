## ADDED Requirements

### Requirement: New ADRs
A new ADR is one the `plan` capability reports as `new`: its track ships it and the repository holds no copy of it. Without an argument, when at least one ADR is new, `ontrack review` SHALL print the import prompt, whether or not other ADRs are pending or revised, and SHALL name no pending and no revised ADR. The new ADRs are found by reading the tracks, as `plan` does: when the tracks cannot be read, `ontrack review` finds no new ADR and reports no error. With an argument, new ADRs are not considered.

#### Scenario: New ADRs and nothing else
- **WHEN** the track installed as `platform` ships `SDR-0015-observability.md`, the repository holds no copy of it, and no ADR is `proposed` or revised
- **THEN** `ontrack review` prints the import prompt, and exits with `2`

#### Scenario: New ADRs before pending ones
- **WHEN** one ADR is new and another is `proposed`
- **THEN** `ontrack review` prints the import prompt, and standard output does not contain the path of the `proposed` ADR

#### Scenario: New ADRs before revised ones
- **WHEN** one ADR is new, another is `accepted` and revised, and no ADR is `proposed`
- **THEN** `ontrack review` prints the import prompt, and not the prompt to rule again

#### Scenario: Tracks not installed
- **WHEN** `ontrack review` runs on a project without `package.json`, with one `proposed` ADR
- **THEN** it prints the sequence prompt for that ADR

#### Scenario: A named ADR that is not imported
- **WHEN** the user runs `ontrack review SDR-0015`, and the only ADR with that identifier is new
- **THEN** standard error names `SDR-0015`, standard output is empty and the exit code is `1`

### Requirement: Import prompt
The import prompt SHALL be printed to standard output and follow the contract in the commands reference, `docs/commands.md`. It SHALL tell the agent, in this order, to:
1. run `npx ontrack apply`, which imports the new ADRs as `proposed`;
2. run `npx ontrack review` and follow the prompt it prints.

Under the first step it SHALL list every new ADR, one per line, in reference order: the path its copy will have, `docs/adr/<namespace>/<file name>`, relative to the project root, with `/` separators, and its title when it has one. It SHALL say that `apply` writes nothing to an ADR the repository has ruled, that `review` exits with `2` when it prints a prompt and that this is not an error, and that the agent stops and reports the error when `apply` fails. It SHALL contain none of the seven steps of the review prompt. The output SHALL be the same for the same files, whatever the order the file system lists them in.

#### Scenario: The ADRs to import are listed
- **WHEN** the track installed as `platform` ships the new ADRs `SDR-0015-observability.md`, titled `Observability`, and `SDR-0002-localization.md`, titled `Localization`
- **THEN** standard output lists `docs/adr/platform/SDR-0002-localization.md` (Localization), then `docs/adr/platform/SDR-0015-observability.md` (Observability)

#### Scenario: Apply, then review
- **WHEN** `ontrack review` prints the import prompt
- **THEN** the instruction to run `npx ontrack apply` comes before the instruction to run `npx ontrack review`
- **AND** the prompt does not tell the agent to set a status

#### Scenario: Nothing written
- **WHEN** `ontrack review` prints the import prompt
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed

## MODIFIED Requirements

### Requirement: Every pending ADR
Without an argument, when no ADR is new (see New ADRs), `ontrack review` SHALL select every pending ADR, in reference order, the order `instructions` lists them in.

#### Scenario: Reference order
- **WHEN** `local/ADR-0020-release`, `trivoallan/ADR-0002-localization` and `trivoallan/ADR-0006-commits` are `proposed`
- **THEN** the prompt lists `docs/adr/ADR-0020-release.md`, `docs/adr/trivoallan/ADR-0002-localization.md` and `docs/adr/trivoallan/ADR-0006-commits.md`, in that order

#### Scenario: Decided ADRs are skipped
- **WHEN** `trivoallan/ADR-0001-record-architecture-decisions` is `accepted` and `trivoallan/ADR-0002-localization` is `proposed`
- **THEN** the prompt lists `docs/adr/trivoallan/ADR-0002-localization.md` and not `docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md`

#### Scenario: A single pending ADR
- **WHEN** only `trivoallan/ADR-0002-localization` is `proposed`
- **THEN** the prompt is the sequence prompt, with a list of one ADR

### Requirement: Revised ADRs
A revised ADR is one the `plan` capability reports as `revised` and whose copy under `docs/adr/` has a status other than `proposed`. Without an argument, when no ADR is new and none is pending, `ontrack review` SHALL select every revised ADR, in reference order. While an ADR is pending, it SHALL select the pending ADRs only. A `proposed` ADR that `plan` reports as `revised` is pending, not revised.

#### Scenario: Revised ADRs once nothing is pending
- **WHEN** `trivoallan/ADR-0001-record-architecture-decisions` is `accepted` at revision `1` and its track ships revision `3`, `trivoallan/ADR-0012-delivery` is `rejected` at revision `1` and its track ships revision `2`, and no ADR is `proposed`
- **THEN** `ontrack review` prints the prompt to rule again, listing both ADRs in that order, and exits with `2`

#### Scenario: Pending ADRs first
- **WHEN** one ADR is revised and another is `proposed`
- **THEN** `ontrack review` prints the sequence prompt for the `proposed` ADR, and does not name the revised one

#### Scenario: A named revised ADR
- **WHEN** the user runs `ontrack review ADR-0012-delivery`, and that ADR is `rejected` and revised
- **THEN** the prompt to rule again is printed for it, and the exit code is `2`

#### Scenario: Tracks not installed
- **WHEN** `ontrack review` runs on a project without `package.json`, whose ADRs are all `accepted`
- **THEN** standard output is empty and the exit code is `0`

### Requirement: Exit codes
`ontrack review` SHALL exit with `2` when it prints a prompt, because a ruling is pending. When no ADR is new, none is pending, none is revised and no argument is given, it SHALL exit with `0`, leave standard output empty, and say on standard error that no ADR is `proposed` or revised. Errors exit with `1`.

#### Scenario: Prompt printed
- **WHEN** `ontrack review` runs on a project with one `proposed` ADR
- **THEN** the exit code is `2`

#### Scenario: Import prompt printed
- **WHEN** `ontrack review` runs on a project whose only pending work is one new ADR
- **THEN** the exit code is `2`

#### Scenario: Nothing to review
- **WHEN** `ontrack review` runs on a project whose ADRs are all `accepted` or `rejected`, none is revised and none is new
- **THEN** standard output is empty, standard error says no ADR is `proposed` or revised, and the exit code is `0`

#### Scenario: No ADR directory
- **WHEN** `ontrack review` runs in a directory without `docs/adr/`
- **THEN** standard output is empty and the exit code is `0`
