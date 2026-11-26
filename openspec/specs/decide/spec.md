# decide Specification

## Purpose
TBD - created by archiving change add-decide-command. Update Purpose after archive.

## Requirements

### Requirement: Read-only and offline
`ontrack decide` MUST NOT create, modify or delete any file, and MUST NOT make any network call. It reads `docs/adr/` and, to find the ADRs to import, the tracks `plan` reads. It does not read the repository's code, configuration or history (`local/ADR-0029`). It needs no `package.json` and no `node_modules`: when the tracks cannot be read, it finds no ADR to import and reports no error.

#### Scenario: Tree unchanged
- **WHEN** `ontrack decide` runs on a project with ADRs under `docs/adr/`
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed

#### Scenario: No package.json
- **WHEN** `ontrack decide` runs in a directory with no `package.json` and no `docs/adr/`
- **THEN** it prints the prompt, standard error is empty, and the exit code is `2`

### Requirement: ADRs already here
The prompt SHALL list the ADRs the repository holds and the ADRs its tracks would import, as the `suggest` prompt lists them, with the same text: paths, titles and statuses in reference order, and one line saying there is none when a list has no entry.

#### Scenario: Same lists as suggest
- **WHEN** `ontrack decide` and `ontrack suggest` run on the same repository
- **THEN** both prompts hold the same list of ADRs held and the same list of ADRs to import

### Requirement: Decision prompt
The prompt SHALL ask a coding agent to record, with the user, one new decision of the repository: the one the user's request states. It SHALL state, in order:
1. read the rules of this repository on recording decisions, in AGENTS.md and in the ADR they come from, and write nothing yet;
2. establish the decision from the user's request, asking the user what is decided when the request does not say, and name the alternative it rules out; when no credible alternative exists, say that a fact with no alternative is not a decision, and stop;
3. when an `accepted` ADR in force already decides it, stop, name that ADR, and propose `npx ontrack review <its reference>` to supersede it; when the ADR that decides it is `proposed`, or among the ADRs to import, stop and say that `npx ontrack review` rules it;
4. start from what the repository does today on the subject, and cite the evidence as a file and line, a commit, or a review comment; say so where it does nothing;
5. propose the traits that state the decision, under a top-level key that no ADR in force uses, or say that it has none, since an ADR without traits does not reach AGENTS.md; and a check command when one can verify it;
6. present the proposal: a title, the decision in one sentence, the alternative it rules out, the traits, the check, the evidence, and the file name the new ADR would take, with the numbering text the supersession prompt and the `suggest` prompt share; then stop, ask the user for agreement with a question tool such as `AskUserQuestion` when the agent has one, and write nothing until the user agrees;
7. once the user agrees, write the new ADR in `docs/adr/local/`, in the format the repository's rules prescribe, with `status: accepted`, `supersedes: []`, its traits under `traits:` and its check under `check:` when it has one, its context drawn from the evidence; then run `npx ontrack apply`.

The prompt MUST NOT name a convention, a tool or a value specific to a repository: it is fixed text plus paths, titles and statuses.

#### Scenario: Agreement before writing
- **WHEN** `ontrack decide` prints its prompt
- **THEN** the instruction to write nothing until the user agrees comes before the instruction to write the new ADR
- **AND** it names `AskUserQuestion` as an example of a question tool
- **AND** the instruction to run `npx ontrack apply` comes after the instruction to write the new ADR

#### Scenario: An existing decision is superseded, not duplicated
- **WHEN** `ontrack decide` prints its prompt
- **THEN** the instruction to look for an ADR that already decides the same thing comes before the instruction to propose traits
- **AND** it names `npx ontrack review`

#### Scenario: Deleted numbers are not reused
- **WHEN** `ontrack decide` prints its prompt
- **THEN** it holds the numbering text of the supersession prompt, which numbers a new ADR after the highest number ever used in `docs/adr/local/`, deleted files included

#### Scenario: Traits so the decision reaches AGENTS.md
- **WHEN** `ontrack decide` prints its prompt
- **THEN** it asks for traits under a top-level key that no ADR in force uses, and says that an ADR without traits does not reach AGENTS.md

#### Scenario: Nothing superseded
- **WHEN** `ontrack decide` prints its prompt
- **THEN** it contains `supersedes: []`

### Requirement: No argument
`ontrack decide` SHALL take no positional argument: the decision is in the user's request, which the agent holds. An argument SHALL be refused with the code `E001`.

#### Scenario: An argument
- **WHEN** the user runs `ontrack decide "Use pnpm"`
- **THEN** standard error carries `E001` and the exit code is `1`

### Requirement: Exit codes
`ontrack decide` SHALL exit with `2` when it prints its prompt, as `suggest` does: it always prints a prompt to follow. It SHALL exit with `1` when `docs/adr/` cannot be read, with the error `instructions` gives for the same files.

#### Scenario: Prompt printed
- **WHEN** `ontrack decide` runs on any project whose ADRs can be read
- **THEN** the exit code is `2`

#### Scenario: Unreadable ADRs
- **WHEN** `docs/adr/ADR-0001.md` and `docs/adr/local/ADR-0001.md` both exist
- **THEN** standard error carries the code `E201` and the exit code is `1`

### Requirement: Contract documented
`docs/commands.md` SHALL have a section `ontrack decide` that states what the command prints, its exit code, and the steps of its prompt.

#### Scenario: Section present
- **WHEN** `docs/commands.md` is read
- **THEN** it has a section `ontrack decide` with the exit code and the seven steps
