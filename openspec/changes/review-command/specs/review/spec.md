# Spec Delta

## Purpose

`ontrack review` prints a prompt that asks a coding agent to review one `proposed` ADR of the repository: propose a ruling from the ADR's recommendation and the repository's evidence, and write it only once the user agrees.

## ADDED Requirements

### Requirement: Read-only and offline
`ontrack review` MUST NOT create, modify or delete any file, and MUST NOT make any network call. It reads `docs/adr/` only. It needs no `package.json` and no `node_modules`.

#### Scenario: Tree unchanged
- **WHEN** `ontrack review` runs on a project with pending ADRs
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed

### Requirement: Pending ADRs
The ADRs read, their references, identifiers, statuses and titles SHALL be those of the `instructions` capability. A pending ADR is one whose status is `proposed`. A conflict between the traits of decided ADRs MUST NOT prevent `ontrack review` from printing a prompt.

#### Scenario: Conflict elsewhere
- **WHEN** two `accepted` ADRs share the top-level trait key `commits`, and `trivoallan/ADR-0002-localization` is `proposed`
- **THEN** `ontrack review` prints the prompt for `trivoallan/ADR-0002-localization`

### Requirement: Next pending ADR
Without an argument, `ontrack review` SHALL select the first pending ADR in reference order, the order `instructions` lists them in.

#### Scenario: First in reference order
- **WHEN** `local/ADR-0020-release`, `trivoallan/ADR-0002-localization` and `trivoallan/ADR-0006-commits` are `proposed`
- **THEN** the prompt is for `local/ADR-0020-release`

#### Scenario: Decided ADRs are skipped
- **WHEN** `trivoallan/ADR-0001-record-architecture-decisions` is `accepted` and `trivoallan/ADR-0002-localization` is `proposed`
- **THEN** the prompt is for `trivoallan/ADR-0002-localization`

### Requirement: Named ADR
With an argument, `ontrack review` SHALL select the ADR it names. An argument holding a `/` names an ADR by its reference. Any other argument names every ADR, in any directory, whose file name without `.md` or whose identifier equals it. The argument MUST name exactly one ADR, and that ADR MUST be pending; otherwise the command fails with exit code `1`, standard output stays empty, and standard error names the argument and says why: no such ADR, several ADRs (listing their references), or the ADR's status.

#### Scenario: By reference
- **WHEN** the user runs `ontrack review trivoallan/ADR-0006-commits` and that ADR is `proposed`
- **THEN** the prompt is for `trivoallan/ADR-0006-commits`

#### Scenario: By identifier
- **WHEN** the user runs `ontrack review ADR-0006`, and `docs/adr/trivoallan/ADR-0006-commits.md` has `adr: ADR-0006` and is `proposed`
- **THEN** the prompt is for `trivoallan/ADR-0006-commits`

#### Scenario: By file name
- **WHEN** the user runs `ontrack review ADR-0006-commits` and `docs/adr/trivoallan/ADR-0006-commits.md` is `proposed`
- **THEN** the prompt is for `trivoallan/ADR-0006-commits`

#### Scenario: Unknown
- **WHEN** the user runs `ontrack review ADR-0099` and no ADR has that file name or identifier
- **THEN** standard error names `ADR-0099`, standard output is empty and the exit code is `1`

#### Scenario: Ambiguous
- **WHEN** the user runs `ontrack review ADR-0006`, and both `local/ADR-0006-release` and `trivoallan/ADR-0006-commits` have that identifier
- **THEN** standard error names both references, standard output is empty and the exit code is `1`

#### Scenario: Already ruled
- **WHEN** the user runs `ontrack review ADR-0001` and that ADR is `accepted`
- **THEN** standard error names `trivoallan/ADR-0001-record-architecture-decisions` and `accepted`, standard output is empty and the exit code is `1`

### Requirement: Prompt
The prompt SHALL be printed to standard output and follow the contract in the README. It names exactly one ADR, by its path relative to the project root, with `/` separators, and by its title when it has one. It SHALL tell the agent, in this order, to:
1. read that file in full, and edit no other ADR;
2. start from the recommendation the ADR makes, look in the repository for evidence that it does not apply, and say so in one line when there is none;
3. check the condition of every conditional recommendation, and cite the evidence that settles it;
4. propose, with its evidence, a value for every trait key the ADR leaves to the repository;
5. propose `rejected` only on evidence that the question does not apply, and say what stands in for it;
6. present the proposed ruling, then stop and write nothing until the user agrees;
7. once the user agrees, fill the traits or remove the block when rejected, set the status, write in the ADR the reason for every departure from the recommendation, and run `npx ontrack apply`.

The prompt SHALL also say that the ADR's own instructions on how to rule prevail over the prompt. Apart from the ADR's path and title, the prompt SHALL be the same text for every ADR, and the same for the same files whatever the order the file system lists them in.

#### Scenario: One ADR named
- **WHEN** `ontrack review` selects `trivoallan/ADR-0006-commits`, titled `Commits`
- **THEN** standard output contains `docs/adr/trivoallan/ADR-0006-commits.md` and `Commits`
- **AND** it contains the path of no other ADR

#### Scenario: Agreement before writing
- **WHEN** `ontrack review` prints a prompt
- **THEN** the instruction to write nothing until the user agrees comes before the instruction to set the status
- **AND** the prompt contains `npx ontrack apply`

#### Scenario: Own ADR
- **WHEN** `ontrack review` selects `local/ADR-0020-release`
- **THEN** standard output contains `docs/adr/ADR-0020-release.md`

#### Scenario: Same text for every ADR
- **WHEN** the prompts for two pending ADRs are compared, with each ADR's path and title removed
- **THEN** they are identical

### Requirement: Exit codes
`ontrack review` SHALL exit with `2` when it prints a prompt, because a ruling is pending. When no ADR is pending and no argument is given, it SHALL exit with `0`, leave standard output empty, and say on standard error that no ADR is `proposed`. Errors exit with `1`.

#### Scenario: Prompt printed
- **WHEN** `ontrack review` runs on a project with one `proposed` ADR
- **THEN** the exit code is `2`

#### Scenario: Nothing to review
- **WHEN** `ontrack review` runs on a project whose ADRs are all `accepted` or `rejected`
- **THEN** standard output is empty, standard error says no ADR is `proposed`, and the exit code is `0`

#### Scenario: No ADR directory
- **WHEN** `ontrack review` runs in a directory without `docs/adr/`
- **THEN** standard output is empty and the exit code is `0`
