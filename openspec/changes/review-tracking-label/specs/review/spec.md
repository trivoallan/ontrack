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

After the seven steps, and in the sequence form after the instruction to take the next ADR, the prompt SHALL tell the agent, once every ADR is ruled, to list the rulings the repository does not follow yet, and to create in the tracker named by the decided `tracking` trait (`tracking.tool`, in `tracking.project`) only the items the user agrees to; when no `tracking` trait is decided or `tracking.tool` is `none`, to list them in its reply and create nothing. It SHALL identify a ruling by its ADR number and trait key, as in `ADR-0015 secrets.guard`, and tell the agent, before proposing:
- to list the tracker's items that carry the label `ontrack`, open and closed;
- to propose nothing for a ruling whose identifier starts the title of one of those items;
- to say in one line which closed items name a ruling the repository still does not follow;
- when it cannot list the tracker's items, to propose every ruling and say that duplicates were not checked.

Each proposed item SHALL have a title that starts with the ruling's identifier, followed by `: ` and a short description, and name the ADR it serves. Each created item SHALL carry the label `ontrack`, and the prompt SHALL tell the agent to create that label first when the tracker requires it. This text SHALL be the same in both forms.

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

#### Scenario: Label on created items
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** the tracking-items text tells the agent to put the label `ontrack` on every item it creates, and to create the label first when the tracker requires it

#### Scenario: Ruling identifier in the title
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** the tracking-items text gives `ADR-0015 secrets.guard` as the form of a ruling's identifier, and tells the agent to start each proposed item's title with it

#### Scenario: Existing items checked first
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** the instruction to list the items labelled `ontrack`, open and closed, comes before the instruction to propose a tracking item
- **AND** it tells the agent to propose nothing for a ruling whose identifier starts an existing item's title, and to report in one line the closed items whose ruling is still not followed

#### Scenario: Tracker that cannot be listed
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** the tracking-items text tells the agent, when it cannot list the tracker's items, to propose every ruling and say that duplicates were not checked

#### Scenario: Own ADR
- **WHEN** `ontrack review ADR-0020-release` selects `local/ADR-0020-release`
- **THEN** standard output contains `docs/adr/ADR-0020-release.md`

#### Scenario: Same text for every ADR
- **WHEN** the prompts for two named pending ADRs are compared, with each ADR's path and title removed
- **THEN** they are identical
