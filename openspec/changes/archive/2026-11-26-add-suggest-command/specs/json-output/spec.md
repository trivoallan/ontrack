## ADDED Requirements

### Requirement: The suggest document
`suggest --json` SHALL print the keys `adrs`, `new` and `prompt`. `adrs` SHALL hold the ADRs the repository holds, as the other documents describe an ADR. `new` SHALL hold the ADRs to import, each as `{ path, title }`. `prompt` SHALL be the text the text form prints. The exit code SHALL be `2`.

#### Scenario: A repository with one ADR
- **WHEN** `ontrack suggest --json` runs where the repository holds one `accepted` ADR and the tracks cannot be read
- **THEN** `adrs` holds that ADR, `new` is `[]`, `prompt` is what `ontrack suggest` prints, and the exit code is `2`

## MODIFIED Requirements

### Requirement: Published schemas
The project SHALL publish a JSON Schema for each document of `--json`, at `schema/<name>.schema.json` of the repository and of the installed package, where `<name>` is `plan`, `apply`, `check`, `instructions`, `review`, `suggest` or `error`. A schema SHALL require every key of its document, and SHALL accept a key it does not name. Each published file MUST be the one derived from the model the command's document is typed by; a published file that differs from the derived one SHALL make the test suite fail.

#### Scenario: A document of this version
- **WHEN** the output of `ontrack plan --json` is validated against `schema/plan.schema.json`
- **THEN** it is valid

#### Scenario: A missing key
- **WHEN** a document `{ "tracks": [], "agents": [] }` is validated against `schema/plan.schema.json`
- **THEN** it is invalid: `pending` is required

#### Scenario: A key of a later version
- **WHEN** a document of `plan` carries a key the schema does not name
- **THEN** it is valid

#### Scenario: A file out of date
- **WHEN** a key is added to the model of a document and `schema/` is not regenerated
- **THEN** the test suite fails, and says to run `npm run schema`
