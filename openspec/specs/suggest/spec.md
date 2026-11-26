# suggest Specification

## Purpose
`ontrack suggest` prints a prompt that asks a coding agent to audit the repository once, when it adopts ontrack, for the decisions it holds and never recorded: propose at most five, each with its evidence, and record as ADRs only those the user agrees to.

## Requirements

### Requirement: Read-only and offline
`ontrack suggest` MUST NOT create, modify or delete any file, and MUST NOT make any network call. It reads `docs/adr/` and, to find the ADRs its tracks would import, the tracks `plan` reads. It needs no `package.json` and no `node_modules`: when the tracks cannot be read, it lists no ADR to import and reports no error. It SHALL always print a prompt and exit with `2`.

#### Scenario: Tree unchanged
- **WHEN** `ontrack suggest` runs on a project with ADRs under `docs/adr/`
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed, and the exit code is `2`

#### Scenario: No package.json
- **WHEN** `ontrack suggest` runs in a directory with no `package.json` and no `docs/adr/`
- **THEN** it prints the prompt, standard error is empty, and the exit code is `2`

### Requirement: ADRs already here
The prompt SHALL list every ADR the repository holds, as the `instructions` capability reads them, in reference order: its path, its title and its status. It SHALL then list the ADRs the `plan` capability reports as `new`, at the path `apply` would write them, with their titles. A list with no entry SHALL be replaced by one line saying there is none.

#### Scenario: Held and new ADRs
- **WHEN** the repository holds `docs/adr/local/ADR-0001-a.md`, `accepted`, and the track installed as `platform` ships `ADR-0002-b.md`, of which the repository holds no copy
- **THEN** the prompt lists `docs/adr/local/ADR-0001-a.md` with its title and `accepted`, and lists `docs/adr/platform/ADR-0002-b.md` among the ADRs to import

#### Scenario: Nothing held
- **WHEN** there is no `docs/adr/` and the tracks cannot be read
- **THEN** the prompt says that the repository holds no ADR and that no ADR is to import

### Requirement: Audit prompt
The prompt SHALL ask a coding agent to audit the repository once, for the decisions it holds and has not recorded, and SHALL state, in order:

1. Read the rules of this repository on recording decisions, in AGENTS.md and in the ADR they come from.
2. Look for decisions in the repository, in this order of weight: review comments a maintainer repeats on pull requests, reversals in the git history (a dependency, tool or pattern replaced by another), rules written by hand in AGENTS.md or CLAUDE.md that no ADR backs, design notes and change proposals, archived ones included, where a choice was argued, then configuration and dependencies. When the forge cannot be read, or holds no review comment, say so in one line and go on with the other sources.
3. Keep a candidate only when a credible alternative exists, one that an agent or a newcomer could take instead. A fact with no alternative is not a decision.
4. Drop a candidate that an `accepted` ADR in force already covers. When the ADR that covers it is `proposed`, or among the ADRs to import, drop it and say that `npx ontrack review` rules it. An ADR that only mentions a fact in passing does not cover it.
5. Merge into one the candidates a single decision explains. Propose at most five candidates, the weightiest first. For each: a title, the decision in one sentence, the alternative it rules out, and its evidence, each piece cited as a file and line, a commit, or a review comment. When none is left, say so and stop.
6. Present the candidates, with the file name each new ADR would take, in `docs/adr/local/` and numbered after the highest number ever used in that directory, by a file there or one the git history shows deleted, and after the repository's own ADRs still placed directly in `docs/adr/`, from 0001 when there is none. Then stop and ask the user which ones to record, with a question tool such as `AskUserQuestion` when you have one. Write nothing until the user agrees.
7. For each candidate the user agrees to: write the new ADR in `docs/adr/local/`, in the format the repository's rules prescribe, with `status: accepted` and `supersedes: []`, its context drawn from the evidence. Then run `npx ontrack apply` to update AGENTS.md.

The prompt MUST NOT name a convention, a tool or a value specific to a repository: it is fixed text plus paths, titles and statuses.

#### Scenario: Agreement before writing
- **WHEN** a coding agent follows the prompt
- **THEN** the prompt tells it to write nothing until the user agrees

#### Scenario: Question tool
- **WHEN** `ontrack suggest` prints its prompt
- **THEN** the prompt names `AskUserQuestion` as an example of a question tool

#### Scenario: At most five
- **WHEN** `ontrack suggest` prints its prompt
- **THEN** the prompt limits the candidates to five, each with its evidence and the alternative it rules out

#### Scenario: Covered by a track
- **WHEN** `ontrack suggest` prints its prompt
- **THEN** the prompt tells the agent to drop a candidate an ADR already covers, and to point to `npx ontrack review` when that ADR is `proposed` or to import

#### Scenario: Deleted numbers are not reused
- **WHEN** `ontrack suggest` prints its prompt
- **THEN** the prompt numbers a new ADR after the highest number ever used in `docs/adr/local/`, deleted files included

#### Scenario: Apply after writing
- **WHEN** `ontrack suggest` prints its prompt
- **THEN** the prompt ends the writing step with `npx ontrack apply`

### Requirement: Contract documented
`docs/commands.md` SHALL have a section `ontrack suggest` that states what the command prints, its exit code, and the steps of its prompt.

#### Scenario: Section present
- **WHEN** the documentation is built
- **THEN** `docs/commands.md` has a heading `ontrack suggest`
