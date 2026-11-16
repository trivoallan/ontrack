# review Specification

## Purpose
`ontrack review` prints a prompt that asks a coding agent to review the `proposed` ADRs of the repository, every one in sequence or a single named one: propose a ruling from the ADR's recommendation and the repository's evidence, and write it only once the user agrees.

## Requirements

### Requirement: Read-only and offline
`ontrack review` MUST NOT create, modify or delete any file, and MUST NOT make any network call. It reads `docs/adr/` and, to find the revised ADRs, the tracks `plan` reads. It needs no `package.json` and no `node_modules` to print a prompt for the ADRs under `docs/adr/`: when the tracks cannot be read, it finds no new and no revised ADR. When it then has no prompt to print, it MUST NOT report that nothing is left to review: it SHALL fail with the error `plan` gives, and exit with `1`.

#### Scenario: Tree unchanged
- **WHEN** `ontrack review` runs on a project with pending ADRs
- **THEN** every file under the project is byte-identical before and after, and no file was added or removed

#### Scenario: Nothing to print, tracks unreadable
- **WHEN** `ontrack review` runs where every ADR is ruled and there is no `package.json`
- **THEN** it prints nothing on standard output, the error on stderr names the expected `package.json`, and the exit code is `1`

### Requirement: Pending ADRs
The ADRs read, their references, identifiers, statuses and titles SHALL be those of the `instructions` capability. A pending ADR is one whose status is `proposed`. A conflict between the traits of decided ADRs MUST NOT prevent `ontrack review` from printing a prompt.

#### Scenario: Conflict elsewhere
- **WHEN** two `accepted` ADRs share the top-level trait key `commits`, and `trivoallan/ADR-0002-localization` is `proposed`
- **THEN** `ontrack review` prints a prompt that lists `trivoallan/ADR-0002-localization`

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

### Requirement: Named ADR
With an argument, `ontrack review` SHALL select the ADR it names. An argument holding a `/` names an ADR by its reference. Any other argument names every ADR, in any directory, whose file name without `.md` or whose identifier equals it. The argument MUST name exactly one ADR. That ADR MUST be either revised (see Revised ADRs), pending, or `accepted` and not superseded; supersession is that of the `instructions` capability: an ADR is superseded when another `accepted` ADR names it in `supersedes:`. Otherwise the command fails with exit code `1`, standard output stays empty, and standard error names the argument and says why: no such ADR, several ADRs (listing their references), the ADR's status, or the reference of the ADR that supersedes it.

A revised ADR yields the prompt to rule again, whatever its status and whether or not it is superseded. A pending ADR yields the review prompt. An `accepted` ADR that is neither revised nor superseded yields the supersession prompt.

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
- **WHEN** the user runs `ontrack review ADR-0001`, that ADR is `accepted`, and no `accepted` ADR names it in `supersedes:`
- **THEN** standard output holds the supersession prompt for `trivoallan/ADR-0001-record-architecture-decisions`, and the exit code is `2`

#### Scenario: Already superseded
- **WHEN** the user runs `ontrack review ADR-0006`, `trivoallan/ADR-0006-commits` is `accepted`, and the `accepted` ADR `local/ADR-0001-commits` has `supersedes: [trivoallan/ADR-0006-commits]`
- **THEN** standard error names `trivoallan/ADR-0006-commits` and `local/ADR-0001-commits`, standard output is empty and the exit code is `1`

#### Scenario: Superseded by a proposed ADR
- **WHEN** the user runs `ontrack review ADR-0006`, `trivoallan/ADR-0006-commits` is `accepted`, and the only ADR naming it in `supersedes:` is `proposed`
- **THEN** standard output holds the supersession prompt for `trivoallan/ADR-0006-commits`

#### Scenario: Rejected
- **WHEN** the user runs `ontrack review ADR-0013` and that ADR is `rejected`
- **THEN** standard error names `trivoallan/ADR-0013-frontend` and `rejected`, standard output is empty and the exit code is `1`

#### Scenario: Conflict elsewhere does not stop a supersession
- **WHEN** two `accepted` ADRs share the trait key `commits.tool`, and the user runs `ontrack review` naming one of them
- **THEN** standard output holds the supersession prompt for the named ADR

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

### Requirement: Supersession prompt
For a named `accepted` ADR that is not superseded, the prompt SHALL be the supersession prompt, printed to standard output and following the contract in the commands reference, `docs/commands.md`. It names the ADR by its path relative to the project root, with `/` separators, by its title when it has one, and by its reference. It names no other ADR. It SHALL say that the ADR is `accepted`, that its text is frozen, and that changing the decision takes a new ADR that supersedes it. It SHALL say that the repository's own rules on recording decisions prevail over the prompt. It SHALL tell the agent, in this order, to:
1. read the ADR's file in full, and the repository's rules on recording decisions;
2. establish what changes in the decision, asking the user when they have not said, and cite the evidence that supports the change, whether the repository moved since the decision was taken or the decision never matched it, or say in one line that there is none;
3. list every key under the ADR's `traits:` and propose, for each, the value it keeps or the value it takes, with the evidence for every change, leaving no key out, because a key the new ADR omits is no longer decided;
4. when the ADR has a `check:` command, propose to keep it, change it or drop it, with the reason;
5. present the proposal: the new ADR's file name, in `docs/adr/local/` and numbered after the ADRs of that directory and the own ADRs still placed directly in `docs/adr/`, from 0001 when there is none, its title, one line per trait key, the check, and the reason for the change; then stop, ask for the user's agreement with a question tool such as `AskUserQuestion` when the agent has one, and write nothing until the user agrees;
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

### Requirement: Prompt to rule again
For revised ADRs, the prompt SHALL follow the contract in the commands reference, `docs/commands.md`. It names each ADR by its path relative to the project root, with `/` separators, and by its title when it has one; next to it, the path of the track's copy, relative to the project root, the revision the repository ruled on and the revision the track asks. It SHALL say that the ruling stands until it is taken again, and that the track's copy prevails over the prompt where it says how to rule. It SHALL tell the agent, in this order, to:
1. read both copies in full, and edit neither the track's copy nor any other ADR;
2. list what moved in the convention: trait keys added, removed or renamed, allowed values changed, recommendations changed;
3. keep the ruled value of every trait key that did not move, with the reason written for a departure;
4. for every trait key that moved, start from the recommendation of the track's copy and propose a value drawn from the repository, with its evidence;
5. keep the status unless what moved settles whether the convention applies, and propose `rejected` only on evidence;
6. present the proposed ruling, each trait value marked kept or changed, then stop and ask for the user's agreement, writing nothing before it;
7. once the user agrees, replace the repository's copy with the track's copy, write the ruling in it, and run `npx ontrack apply`.

It SHALL end with the tracking paragraph of the review prompt. For a named ADR, the prompt names that ADR alone. Without an argument, it lists every revised ADR and gives the steps once.

#### Scenario: One revised ADR
- **WHEN** `ontrack review ADR-0012-delivery` selects the revised ADR `trivoallan/ADR-0012-delivery`, titled `Delivery`, ruled on revision `1`, whose track asks revision `2` in `node_modules/trivoallan/adr/ADR-0012-delivery.md`
- **THEN** the prompt names `docs/adr/trivoallan/ADR-0012-delivery.md` (Delivery), that track path and both revisions, gives seven steps, and names no other ADR

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
