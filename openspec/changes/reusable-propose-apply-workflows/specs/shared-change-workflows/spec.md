## ADDED Requirements

### Requirement: Another repository can call the workflows
The `propose` and `apply` workflows of ontrack SHALL be callable from another repository through `workflow_call`, and SHALL keep running on ontrack's own issues and pull requests through their current triggers. A call from another repository MUST behave as a run in ontrack does: same jobs, same separation between the job that runs the agent and the job that writes, same fixed comments.

#### Scenario: A repository calls propose
- **WHEN** a repository's workflow, triggered by `issues: labeled`, calls `trivoallan/ontrack/.github/workflows/propose.yml` at a commit SHA
- **THEN** the `draft` job runs the agent with a read-only token in that repository
- **AND** the `publish` job, which runs no agent, opens the draft pull request in that repository

#### Scenario: ontrack labels its own issue
- **WHEN** a maintainer adds the `ontrack:propose` label to an open issue of ontrack
- **THEN** the proposal run starts as it does before this change, without a calling workflow

### Requirement: The frameworks come from a closed catalog
The frameworks the agent may write for SHALL come from a catalog kept in ontrack. The catalog SHALL contain the entries `openspec` and `adr`. A caller MUST choose entries by name and MUST NOT be able to pass a path, a pattern or a tool rule. Each entry SHALL fix the agent's allowed tools, the command line installed for it and the paths the `publish` job accepts. A run with a name that is not in the catalog MUST fail before the agent starts.

#### Scenario: A caller enables OpenSpec only
- **WHEN** a repository calls `propose` with the `openspec` entry only
- **THEN** the agent may write under `openspec/changes/` and nowhere under the ADR directory
- **AND** `publish` refuses a patch that adds an ADR

#### Scenario: A caller names an unknown framework
- **WHEN** a repository calls `propose` with the entry `speckit`
- **THEN** the run fails before the agent starts and posts the fixed failure comment

### Requirement: The run agrees with the repository's change trait
Before the agent starts, the run SHALL read the `changes` trait of the caller's `AGENTS.md`. When the trait names a framework that the caller did not enable, the run MUST fail before the agent starts and before any cost.

#### Scenario: The trait names a framework that is not enabled
- **WHEN** the `AGENTS.md` of the caller declares `changes.framework: openspec` and the caller enabled the `adr` entry only
- **THEN** the run fails before the agent starts
- **AND** the issue receives the fixed failure comment and no longer carries the label

### Requirement: The labels are inputs
The label that starts a proposal and the label that starts an apply SHALL be inputs of the workflows, with `ontrack:propose` and `ontrack:apply` as defaults. A run SHALL start only for the configured label and SHALL remove that label whatever the outcome. The label's value MUST reach the scripts through environment variables, never through an expression inside a script.

#### Scenario: A caller renames the label
- **WHEN** a repository calls `propose` with the label `change:propose` and a maintainer adds `change:propose` to an open issue
- **THEN** one proposal run starts and the label `change:propose` is removed at the end

#### Scenario: The default label in another label's place
- **WHEN** that same repository's issue receives the label `ontrack:propose`
- **THEN** no proposal run starts

### Requirement: The ADR directory comes from a trait
The directory where the agent may add an ADR SHALL be read from the ADR directory trait of ADR-0001 in the caller's `AGENTS.md`, and SHALL be `docs/adr` when the trait is absent. The value MUST be a relative path inside the repository, without `..`, and outside `.github`, `.claude`, `.githooks` and `node_modules`; any other value MUST fail the run before the agent starts. The file name pattern, the rule that a proposal only adds files and the refusal of an ADR that declares a `check:` command SHALL stay as they are.

#### Scenario: No trait
- **WHEN** the caller's `AGENTS.md` has no ADR directory trait and the agent adds `docs/adr/ADR-0004-cache-results.md`
- **THEN** `publish` accepts the file

#### Scenario: A trait that points outside the repository
- **WHEN** the trait's value is `../elsewhere` or `.github/adr`
- **THEN** the run fails before the agent starts

### Requirement: The apply credentials are passed explicitly
A caller of `apply` SHALL pass the routine identifier as an input and the token that fires the routine as a named secret. The workflow MUST NOT require `secrets: inherit` and MUST read no other secret of the caller.

#### Scenario: A caller passes its routine
- **WHEN** a repository calls `apply` with its routine identifier and its fire token, and the pull request is approved at its head commit
- **THEN** one session is started through that routine

#### Scenario: The token is missing
- **WHEN** a repository calls `apply` without the fire token and the pull request is approved at its head commit
- **THEN** no session starts and the pull request receives the fixed comment that the session could not be started
