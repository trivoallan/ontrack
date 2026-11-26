## MODIFIED Requirements

### Requirement: Supersession prompt
For a named `accepted` ADR that is not superseded, the prompt SHALL be the supersession prompt, printed to standard output and following the contract in the commands reference, `docs/commands.md`. It names the ADR by its path relative to the project root, with `/` separators, by its title when it has one, and by its reference. It names no other ADR. It SHALL say that the ADR is `accepted`, that its text is frozen, and that changing the decision takes a new ADR that supersedes it. It SHALL say that the repository's own rules on recording decisions prevail over the prompt. It SHALL tell the agent, in this order, to:
1. read the ADR's file in full, and the repository's rules on recording decisions;
2. establish what changes in the decision, asking the user when they have not said, and cite the evidence that supports the change, whether the repository moved since the decision was taken or the decision never matched it, or say in one line that there is none;
3. list every key under the ADR's `traits:` and propose, for each, the value it keeps or the value it takes, with the evidence for every change, leaving no key out, because a key the new ADR omits is no longer decided;
4. when the ADR has a `check:` command, propose to keep it, change it or drop it, with the reason;
5. present the proposal: the new ADR's file name, in `docs/adr/local/` and numbered after the highest number ever used in that directory, by a file there or one the git history shows deleted, and after the own ADRs still placed directly in `docs/adr/`, from 0001 when there is none, its title, one line per trait key, the check, and the reason for the change; then stop, ask for the user's agreement with a question tool such as `AskUserQuestion` when the agent has one, and write nothing until the user agrees;
6. once the user agrees, write the new ADR in `docs/adr/local/` with `status: accepted`, the superseded ADR's reference in `supersedes:`, and the traits, in the format the repository's rules prescribe, referring to the superseded ADR for context instead of restating it; mark the superseded ADR only as the repository's rules spell out, and leave its file untouched when they do not say what to write in it; then run `npx ontrack apply`.

After the six steps the prompt SHALL hold the tracking-items text of the review prompt, unchanged. Apart from the ADR's path, title and reference, the supersession prompt SHALL be the same text for every ADR. It MUST NOT name a status value for the superseded ADR.

#### Scenario: Names the ADR and its reference
- **WHEN** `ontrack review ADR-0006` selects the `accepted` ADR `trivoallan/ADR-0006-commits`, titled `Commits`
- **THEN** standard output contains `docs/adr/trivoallan/ADR-0006-commits.md`, `Commits` and `supersedes: [trivoallan/ADR-0006-commits]`
- **AND** it contains the path of no other ADR

#### Scenario: Own ADR
- **WHEN** `ontrack review ADR-0020-release` selects the `accepted` ADR `local/ADR-0020-release`
- **THEN** standard output contains `docs/adr/local/ADR-0020-release.md` and `supersedes: [local/ADR-0020-release]`

#### Scenario: Where the new ADR is written
- **WHEN** `ontrack review` prints a supersession prompt
- **THEN** it names `docs/adr/local/` as the directory of the new ADR

#### Scenario: Deleted numbers are not reused
- **WHEN** `ontrack review` prints a supersession prompt
- **THEN** it numbers the new ADR after the highest number ever used in `docs/adr/local/`, deleted files included

#### Scenario: Every trait key carried over
- **WHEN** `ontrack review` prints a supersession prompt
- **THEN** it tells the agent to leave no trait key out, and says that an omitted key is no longer decided

#### Scenario: Agreement before writing
- **WHEN** `ontrack review` prints a supersession prompt
- **THEN** the instruction to write nothing until the user agrees comes before the instruction to write the new ADR
- **AND** it names `AskUserQuestion` as an example of a question tool
- **AND** the instruction to run `npx ontrack apply` comes after the instruction to write the new ADR

#### Scenario: Marking is left to the repository's rules
- **WHEN** `ontrack review` prints a supersession prompt
- **THEN** it tells the agent to mark the superseded ADR only as the repository's rules spell out, and to leave its file untouched when they do not say what to write in it
- **AND** it does not contain `status: superseded`

#### Scenario: Tracking items
- **WHEN** the supersession prompt and the review prompt for a named ADR are compared
- **THEN** both end with the same tracking-items text

#### Scenario: Same text for every ADR
- **WHEN** the supersession prompts for two `accepted` ADRs are compared, with each ADR's path, title and reference removed
- **THEN** they are identical

#### Scenario: Tree unchanged
- **WHEN** `ontrack review ADR-0001` prints a supersession prompt
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed
