## MODIFIED Requirements

### Requirement: Prompt
The prompt SHALL be printed to standard output and follow the contract in the commands reference, `docs/commands.md`. It names each selected ADR by its path relative to the project root, with `/` separators, and by its title when it has one. For a named ADR, it names that ADR alone. Without an argument, it lists the selected ADRs in order, one per line, and tells the agent to rule them one at a time, in that order, and not to start an ADR before the previous one is ruled. In both forms of the review prompt it SHALL tell the agent, for an ADR and in this order, to:
1. read its file in full, and edit no other ADR;
2. start from the recommendation the ADR makes, look in the repository for evidence that it does not apply, and say so in one line when there is none;
3. check the condition of every conditional recommendation, and cite the evidence that settles it;
4. propose, with its evidence, a value for every trait key the ADR leaves to the repository;
5. propose `rejected` only on evidence that the question does not apply, and say what stands in for it;
6. present the proposed ruling, then stop, ask for the user's agreement with a question tool such as `AskUserQuestion` when the agent has one, and write nothing until the user agrees;
7. once the user agrees, fill the traits or remove the block when rejected, set the status, write in the ADR the reason for every departure from the recommendation, and run `npx ontrack apply`.

After the seven steps, and in the sequence form after the instruction to take the next ADR, the prompt SHALL tell the agent, once every ADR is ruled, to list the rulings the repository does not follow yet, to propose a tracking item for each with its title and the ADR it serves, and to create in the tracker named by the decided `tracking` trait (`tracking.tool`, in `tracking.project`) only the items the user agrees to; when no `tracking` trait is decided or `tracking.tool` is `none`, to list them in its reply and create nothing. This text SHALL be the same in both forms.

The review prompt SHALL also say that an ADR's own instructions on how to rule prevail over the prompt. The seven steps SHALL be the same text in both forms. Apart from the ADR's path and title, the prompt for a named pending ADR SHALL be the same text for every ADR. The output SHALL be the same for the same files, whatever the order the file system lists them in.

#### Scenario: One ADR named
- **WHEN** `ontrack review ADR-0006` selects `trivoallan/ADR-0006-commits`, titled `Commits`
- **THEN** standard output contains `docs/adr/trivoallan/ADR-0006-commits.md` and `Commits`
- **AND** it contains the path of no other ADR

#### Scenario: Agreement before writing
- **WHEN** `ontrack review` prints a prompt
- **THEN** the instruction to write nothing until the user agrees comes before the instruction to set the status
- **AND** the prompt contains `npx ontrack apply`

#### Scenario: Question tool
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** it tells the agent to ask for the user's agreement with a question tool when it has one, and names `AskUserQuestion` as an example

#### Scenario: Sequence
- **WHEN** `ontrack review` runs with two pending ADRs
- **THEN** standard output lists both paths, tells the agent to rule them one at a time in that order, and holds the seven steps once

#### Scenario: Agreement after each ADR
- **WHEN** `ontrack review` prints the sequence prompt
- **THEN** the instruction to take the next ADR comes after the instruction to run `npx ontrack apply`

#### Scenario: Tracking items for rulings ahead of the repository
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** after the instruction to run `npx ontrack apply`, and after the instruction to take the next ADR in the sequence form, it tells the agent to propose a tracking item for every ruling the repository does not follow yet
- **AND** it names `tracking.tool` and `tracking.project`, asks for the user's agreement before creating an item, and says to create nothing when `tracking.tool` is `none`

#### Scenario: Own ADR
- **WHEN** `ontrack review ADR-0020-release` selects `local/ADR-0020-release`
- **THEN** standard output contains `docs/adr/ADR-0020-release.md`

#### Scenario: Same text for every ADR
- **WHEN** the prompts for two named pending ADRs are compared, with each ADR's path and title removed
- **THEN** they are identical

### Requirement: Supersession prompt
For a named `accepted` ADR that is not superseded, the prompt SHALL be the supersession prompt, printed to standard output and following the contract in the commands reference, `docs/commands.md`. It names the ADR by its path relative to the project root, with `/` separators, by its title when it has one, and by its reference. It names no other ADR. It SHALL say that the ADR is `accepted`, that its text is frozen, and that changing the decision takes a new ADR that supersedes it. It SHALL say that the repository's own rules on recording decisions prevail over the prompt. It SHALL tell the agent, in this order, to:
1. read the ADR's file in full, and the repository's rules on recording decisions;
2. establish what changes in the decision, asking the user when they have not said, and cite the evidence that supports the change, whether the repository moved since the decision was taken or the decision never matched it, or say in one line that there is none;
3. list every key under the ADR's `traits:` and propose, for each, the value it keeps or the value it takes, with the evidence for every change, leaving no key out, because a key the new ADR omits is no longer decided;
4. when the ADR has a `check:` command, propose to keep it, change it or drop it, with the reason;
5. present the proposal: the new ADR's file name, in `docs/adr/` and numbered after the ADRs that sit directly in that directory, from 0001 when there is none, its title, one line per trait key, the check, and the reason for the change; then stop, ask for the user's agreement with a question tool such as `AskUserQuestion` when the agent has one, and write nothing until the user agrees;
6. once the user agrees, write the new ADR in `docs/adr/` with `status: accepted`, the superseded ADR's reference in `supersedes:`, and the traits, in the format the repository's rules prescribe, referring to the superseded ADR for context instead of restating it; mark the superseded ADR only as the repository's rules spell out, and leave its file untouched when they do not say what to write in it; then run `npx ontrack apply`.

After the six steps the prompt SHALL hold the tracking-items text of the review prompt, unchanged. Apart from the ADR's path, title and reference, the supersession prompt SHALL be the same text for every ADR. It MUST NOT name a status value for the superseded ADR.

#### Scenario: Names the ADR and its reference
- **WHEN** `ontrack review ADR-0006` selects the `accepted` ADR `trivoallan/ADR-0006-commits`, titled `Commits`
- **THEN** standard output contains `docs/adr/trivoallan/ADR-0006-commits.md`, `Commits` and `supersedes: [trivoallan/ADR-0006-commits]`
- **AND** it contains the path of no other ADR

#### Scenario: Own ADR
- **WHEN** `ontrack review ADR-0020-release` selects the `accepted` ADR `local/ADR-0020-release`
- **THEN** standard output contains `docs/adr/ADR-0020-release.md` and `supersedes: [local/ADR-0020-release]`

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

### Requirement: Prompt to rule again
For revised ADRs, the prompt SHALL follow the contract in the commands reference, `docs/commands.md`. It names each ADR by its path relative to the project root, with `/` separators, and by its title when it has one; next to it, the path of the source's copy, relative to the project root, the revision the repository ruled on and the revision the source asks. It SHALL say that the ruling stands until it is taken again, and that the source's copy prevails over the prompt where it says how to rule. It SHALL tell the agent, in this order, to:
1. read both copies in full, and edit neither the source's copy nor any other ADR;
2. list what moved in the question: trait keys added, removed or renamed, allowed values changed, recommendations changed;
3. keep the ruled value of every trait key that did not move, with the reason written for a departure;
4. for every trait key that moved, start from the recommendation of the source's copy and propose a value drawn from the repository, with its evidence;
5. keep the status unless what moved settles whether the question applies, and propose `rejected` only on evidence;
6. present the proposed ruling, each trait value marked kept or changed, then stop and ask for the user's agreement, writing nothing before it;
7. once the user agrees, replace the repository's copy with the source's copy, write the ruling in it, and run `npx ontrack apply`.

It SHALL end with the tracking paragraph of the review prompt. For a named ADR, the prompt names that ADR alone. Without an argument, it lists every revised ADR and gives the steps once.

#### Scenario: One revised ADR
- **WHEN** `ontrack review ADR-0012-delivery` selects the revised ADR `trivoallan/ADR-0012-delivery`, titled `Delivery`, ruled on revision `1`, whose source asks revision `2` in `node_modules/trivoallan/adr/ADR-0012-delivery.md`
- **THEN** the prompt names `docs/adr/trivoallan/ADR-0012-delivery.md` (Delivery), that source path and both revisions, gives seven steps, and names no other ADR
