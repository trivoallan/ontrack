## MODIFIED Requirements

### Requirement: Prompt
The prompt SHALL be printed to standard output and follow the contract in the commands reference, `docs/commands.md`. It names each selected ADR by its path relative to the project root, with `/` separators, and by its title when it has one. For a named ADR, it names that ADR alone. Without an argument, it lists the selected ADRs in order, one per line, and SHALL tell the agent:
- that none of them has to be ruled now: the repository works with them open, and `npx ontrack check` runs only the decided ADRs; the user rules as many as they choose;
- first, when the list holds more than one ADR, to survey them, writing nothing, and why: the conventions the repository already answers, which the user can check, come before those that need a discussion; for every value an ADR asks for (every key under `traits:`), to look for a citation in the repository (a file, a configuration entry or a command output), to give a count only when it comes from a command it ran and name that command, and to label each citation with exactly one of two labels, word for word: `shows the value` when it states the value itself, or `next to it` when the value would be inferred from it, with one example of each; that a citation drawn from history alone is `next to it`; that a value read from the file tree, such as the main language counted from the source files, shows the value; that an absence counts only when the thing, if it existed, would have to leave a file or a configuration in the repository and none is there, and does not count for a thing that could exist without leaving a trace there (a dependency-update app, the provenance a registry records, a convention like the language of the documentation, which agents contributors use), an ADR resting on such an absence going to the second group; to put an ADR in the first group only when every value has a citation labelled `shows the value`, and every other ADR in the second group, including one where a single value is held outside the repository or is inferred; never to put an ADR in the first group on a `next to it` citation, and never to leave a value it could not show without saying where it lives or that it is unknown; to present the survey with a heading per group giving its number of ADRs, one row per value in the first group (ADR, key, value, citation) and one row per value it could not show in the second, none for the values it could (ADR, key, where the value lives or "unknown", any citation with its label); then to ask the user to agree to that order or give another, with a question tool such as `AskUserQuestion` when the agent has one;
- then to rule them one at a time, in the agreed order, and not to start an ADR before the previous one is ruled or skipped;
- that at step 6 the user can skip the ADR, which leaves its file untouched, or stop the review, after which the agent writes nothing more for the open ADR;
- when the list is done or the user stops, to give a summary: the ADRs ruled in the session, the ADRs still `proposed` with the group each belongs to, and a sentence saying the repository works with them open. In both forms of the review prompt it SHALL tell the agent, for an ADR and in this order, to:
1. read its file in full, and edit no other ADR;
2. start from what the repository does today on the convention (its files, configuration, CI and history), say so where it does nothing, describe the repository as it is and not as the other `proposed` ADRs would make it, then compare with the recommendation the ADR makes and name every difference;
3. check the condition of every conditional recommendation, and cite the evidence that settles it;
4. propose, with its evidence, a value for every trait key the ADR leaves to the repository, and mark it `observed` when the repository does it today, or `absent` when it does not and the ruling would make it do so;
5. propose `rejected` only on evidence that the convention does not apply, and say what stands in for it;
6. present the proposed ruling, each trait value with its mark, then stop, ask for the user's agreement with a question tool such as `AskUserQuestion` when the agent has one, and write nothing until the user agrees;
7. once the user agrees, fill the traits or remove the block when rejected, set the status, write in the ADR the reason for every departure from the recommendation, and run `npx ontrack apply`.

After the seven steps, and in the sequence form after the instruction to take the next ADR, the prompt SHALL tell the agent, once the review ends, whether every ADR is ruled or the user stops, to list the rulings the repository does not follow yet, and to create in the tracker named by the decided `tracking` trait (`tracking.tool`, in `tracking.project`) only the items the user agrees to; when no `tracking` trait is decided or `tracking.tool` is `none`, to list them in its reply and create nothing. It SHALL identify a ruling by its ADR's reference without the slug, in brackets, and its trait key, as in `[trivoallan/ADR-0015] secrets.guard`, and tell the agent, before proposing:
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
- **THEN** standard output lists both paths, tells the agent to survey them, then to rule them one at a time in the agreed order, and holds the seven steps once

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
- **THEN** the tracking-items text gives `[trivoallan/ADR-0015] secrets.guard` as the form of a ruling's identifier, and tells the agent to start each proposed item's title with it

#### Scenario: Existing items checked first
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** the instruction to list the items labelled `ontrack`, open and closed, comes before the instruction to propose a tracking item
- **AND** it tells the agent to propose nothing for a ruling whose identifier starts an existing item's title, and to report in one line the closed items whose ruling is still not followed

#### Scenario: Tracker that cannot be listed
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** the tracking-items text tells the agent, when it cannot list the tracker's items, to propose every ruling and say that duplicates were not checked

#### Scenario: Practice before recommendation
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** step 2 tells the agent to start from what the repository does today, and says that an absence is evidence too
- **AND** it tells the agent not to describe the repository as the other `proposed` ADRs would make it
- **AND** the comparison with the recommendation comes after the description

#### Scenario: Observed or absent
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** step 4 tells the agent to mark every proposed value `observed` or `absent`, and says what each means
- **AND** step 6 tells it to present each trait line with its mark

#### Scenario: Own ADR
- **WHEN** `ontrack review ADR-0020-release` selects `local/ADR-0020-release`
- **THEN** standard output contains `docs/adr/ADR-0020-release.md`

#### Scenario: Same text for every ADR
- **WHEN** the prompts for two named pending ADRs are compared, with each ADR's path and title removed
- **THEN** they are identical

#### Scenario: Survey before the first ruling
- **WHEN** `ontrack review` prints the sequence prompt for two pending ADRs
- **THEN** the survey instruction comes before the seven steps, names the two groups, tells the agent to write nothing during the survey, and to ask the user to agree to the order

#### Scenario: No survey for a single ADR
- **WHEN** `ontrack review` prints the sequence prompt for one pending ADR
- **THEN** the survey instruction says it applies only when the list holds more than one ADR

#### Scenario: Rulings are optional
- **WHEN** `ontrack review` prints the sequence prompt
- **THEN** it says that the repository works with the listed ADRs open and that `npx ontrack check` runs only the decided ADRs

#### Scenario: Skip and stop
- **WHEN** `ontrack review` prints the sequence prompt
- **THEN** it tells the agent that the user can skip an ADR, which leaves its file untouched, or stop the review, after which it writes nothing more for the open ADR
- **AND** it tells the agent not to start an ADR before the previous one is ruled or skipped

#### Scenario: Summary at the end
- **WHEN** `ontrack review` prints the sequence prompt
- **THEN** it tells the agent, when the list is done or the user stops, to list the ADRs ruled in the session and the ADRs still `proposed` with their group, and to say the repository works with them open

#### Scenario: Tracking items when the user stops
- **WHEN** `ontrack review` prints a prompt, in either form
- **THEN** the tracking-items text applies once the review ends, whether every ADR is ruled or the user stops

#### Scenario: Named ADR has no survey
- **WHEN** `ontrack review ADR-0006` prints the prompt for one pending ADR
- **THEN** it contains no survey instruction and no summary instruction

#### Scenario: Values held outside the repository
- **WHEN** `ontrack review` prints the sequence prompt for two pending ADRs
- **THEN** the survey instruction sends to the second group an ADR with a single value held outside the repository or inferred, and tells the agent never to leave a value it could not show without saying where it lives or that it is unknown
#### Scenario: Citations that show the value itself
- **WHEN** `ontrack review` prints the sequence prompt for two pending ADRs
- **THEN** the survey instruction has the agent label every citation with exactly one of the words `shows the value` or `next to it`, with one example of each, say that a citation drawn from history alone is `next to it`, give a count only when it comes from a command it ran and name that command, and admit an ADR to the first group only when every value has a citation labelled `shows the value`
- **AND** it says that a value read from the file tree, such as the main language counted from the source files, also shows the value
- **AND** it says that an absence counts only when the thing, if it existed, would have to leave a file or a configuration in the repository and none is there, that it does not count for a thing that could exist without leaving a trace there, and that an ADR resting on such an absence goes to the second group
- **AND** it tells the agent never to put an ADR in the first group on a `next to it` citation

#### Scenario: Survey layout
- **WHEN** `ontrack review` prints the sequence prompt for two pending ADRs
- **THEN** the survey instruction asks for a heading per group with its number of ADRs, one row per value in the first group (ADR, key, value, citation), and one row per value not shown in the second, none for the values shown (ADR, key, where the value lives or "unknown", any citation with its label)
