## ADDED Requirements

### Requirement: The ontrack:propose label starts a proposal
The repository SHALL start one proposal run when the `ontrack:propose` label is added to an issue, and MUST NOT start one for any other label or any other issue event.

#### Scenario: The ontrack:propose label is added
- **WHEN** a maintainer adds the `ontrack:propose` label to issue 103
- **THEN** one proposal run starts for issue 103

#### Scenario: Another label is added
- **WHEN** the `bug` label is added to issue 103
- **THEN** no proposal run starts

#### Scenario: The issue is edited after the run
- **WHEN** the body of issue 103 is edited while it no longer carries the `ontrack:propose` label
- **THEN** no proposal run starts

### Requirement: One proposal per issue
A proposal run SHALL open at most one pull request for its issue. Runs for the same issue MUST NOT execute at the same time, and a run MUST stop before the agent starts when a branch for that issue already exists.

#### Scenario: A branch already exists for the issue
- **WHEN** a proposal run starts for issue 103 while a remote branch named `feat/103-…` exists
- **THEN** the agent is not started
- **AND** no pull request is opened

#### Scenario: The label is added twice in a row
- **WHEN** the `ontrack:propose` label is added to issue 103 while a run for issue 103 is in progress
- **THEN** the second run waits for the first to end

### Requirement: The issue is read as data
The run SHALL give the agent the title and the body of the issue, and nothing else from the tracker. The agent's instructions MUST come from the workflow file only. No text of the issue is interpolated into a shell script, and neither the title nor an excerpt of the issue is copied into the repository by the workflow.

#### Scenario: Comments are ignored
- **WHEN** issue 103 has comments
- **THEN** the agent receives none of them

#### Scenario: A body that contains shell syntax
- **WHEN** the body of the issue contains `$(…)` or a backtick expression
- **THEN** no step of the run executes it

#### Scenario: A body that addresses the agent
- **WHEN** the body of the issue asks the agent to do something other than describe a change
- **THEN** the agent's instructions still come from the workflow file only

### Requirement: The agent only writes files
The agent SHALL run in a job whose token can write nothing, and without tracker access. It writes files in the checkout and runs the change framework's command line; every act on GitHub (branch, commit, pull request, label, comment) MUST be performed in a separate job that runs no agent, by steps whose text is fixed in the workflow file.

#### Scenario: The agent tries to reach GitHub
- **WHEN** the agent runs
- **THEN** the permissions of its job are read-only and its allowed tools include neither `git` nor `gh`

#### Scenario: The job that writes
- **WHEN** the workflow is read
- **THEN** the job that holds write permissions has no step that runs the agent
- **AND** it receives from the agent's job only a patch and a change name it checks again

#### Scenario: The secret the agent needs
- **WHEN** the workflow is read
- **THEN** `ANTHROPIC_API_KEY` is the only secret it names, and only the agent step receives it

### Requirement: The change follows the repository's trait
The agent SHALL produce the change that the `changes` trait of `AGENTS.md` calls for. The workflow file MUST NOT name a change framework or its paths.

#### Scenario: The trait says openspec
- **WHEN** `AGENTS.md` carries `changes.framework: openspec` and the issue moves an expected behaviour
- **THEN** the run adds a change that the framework's own validation accepts
- **AND** its first artefact carries `Issue served: trivoallan/ontrack#103` for issue 103

### Requirement: A draft pull request carries the proposal
When the agent produced a change, the run SHALL commit it on a new branch named `feat/<issue>-<change-name>` and open a draft pull request whose description references the issue with `Refs`, never with a closing keyword. The change name MUST be made of lower-case letters, digits and hyphens; any other name fails the run.

#### Scenario: A change was produced
- **WHEN** the agent produced the change `scan-dependencies` for issue 103
- **THEN** a draft pull request is opened from `feat/103-scan-dependencies`
- **AND** its description contains `Refs #103`
- **AND** its commit message passes the repository's commit check

#### Scenario: Merging the pull request
- **WHEN** the pull request is merged
- **THEN** issue 103 is not closed by the proposal run's description alone

#### Scenario: An invalid change name
- **WHEN** the agent reports a change name that contains a space or a slash
- **THEN** the run fails and opens no pull request

### Requirement: An issue that opens no change says so
When the agent finds that the issue moves no expected behaviour, the run SHALL open no pull request and post one comment on the issue, whose text is fixed in the workflow file and links to the run.

#### Scenario: A continuous-integration issue
- **WHEN** the agent produces no file for an issue that only concerns continuous integration
- **THEN** no branch and no pull request are created
- **AND** the issue receives the fixed comment

### Requirement: The label is consumed
The run SHALL remove the `ontrack:propose` label from the issue when it ends, whatever its outcome, so that adding the label again is the only way to start another run. A run that fails SHALL post a fixed comment that links to the run.

#### Scenario: The run succeeds
- **WHEN** the draft pull request has been opened
- **THEN** the issue no longer carries the `ontrack:propose` label

#### Scenario: The run fails
- **WHEN** a step of the run fails
- **THEN** the issue no longer carries the `ontrack:propose` label
- **AND** the issue receives a comment that links to the failed run

### Requirement: The workflow follows the forge rules
The workflow SHALL pin every action by commit SHA and declare its permissions, with none granted at the top level.

#### Scenario: Reading the workflow file
- **WHEN** `.github/workflows/propose.yml` is read
- **THEN** every `uses:` names a 40-character commit SHA
- **AND** the top-level `permissions:` is empty
