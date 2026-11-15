## MODIFIED Requirements

### Requirement: A proposal only adds planning files
The publishing job SHALL treat the patch and the change name as untrusted, and MUST refuse the whole patch unless every entry adds a regular, non-executable file that is either a Markdown or YAML file under `openspec/changes/<change-name>/` or a new `docs/adr/local/ADR-NNNN-slug.md` that declares no `check:` command. A refused patch fails the run before anything is committed.

#### Scenario: A proposal and its ADR
- **WHEN** the patch adds `openspec/changes/scan-dependencies/proposal.md` and `docs/adr/local/ADR-0002-scan-dependencies.md`
- **THEN** the patch is accepted

#### Scenario: A modified file
- **WHEN** the patch modifies `package.json`, `AGENTS.md`, an existing ADR or a file under `.githooks/`
- **THEN** the run fails and nothing is pushed

#### Scenario: A file outside the change
- **WHEN** the patch adds a file under `test/`, `.claude/` or another change's directory
- **THEN** the run fails and nothing is pushed

#### Scenario: A file that is not plain text to read
- **WHEN** the patch adds a symbolic link, an executable file or a `.sh` file under the change
- **THEN** the run fails and nothing is pushed

#### Scenario: An ADR that carries a command
- **WHEN** the patch adds an ADR whose frontmatter declares `check:`
- **THEN** the run fails and nothing is pushed
