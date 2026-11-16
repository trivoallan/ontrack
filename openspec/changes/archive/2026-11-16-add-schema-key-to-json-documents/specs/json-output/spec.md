## ADDED Requirements

### Requirement: A document names its schema
Every document of `--json`, the error document included, SHALL start with the key `$schema`, whose value is the address of its own published schema: `https://raw.githubusercontent.com/trivoallan/ontrack/main/schema/<name>.schema.json`. That address SHALL be the `$id` of the schema. Each published schema SHALL require the key and fix its value to its own address.

#### Scenario: The plan document
- **WHEN** `ontrack plan --json` runs
- **THEN** the first key of the document is `$schema`, and its value ends with `schema/plan.schema.json`

#### Scenario: The error document
- **WHEN** `ontrack plann --json` runs
- **THEN** the document on standard error carries `$schema`, and its value ends with `schema/error.schema.json`

#### Scenario: The wrong schema
- **WHEN** the output of `ontrack plan --json` is validated against `schema/check.schema.json`
- **THEN** it is invalid on `$schema`

## MODIFIED Requirements

### Requirement: The --json option
Every `ontrack` subcommand SHALL accept `--json`. With it, the subcommand SHALL print one JSON document on standard output, in place of its text, and SHALL write nothing on standard error unless it fails. The exit code SHALL be the one the text form gives. Without `--json`, no output changes.

#### Scenario: Same exit code
- **WHEN** `ontrack plan --json` runs where one ADR is `revised`
- **THEN** standard output parses as one JSON document, standard error is empty, and the exit code is `2`

#### Scenario: No hint on standard error
- **WHEN** `ontrack plan --json` runs on a project with no track
- **THEN** the document holds, after `$schema`, `"tracks": []`, `"agents": []` and `"pending": false`, and standard error is empty

### Requirement: The review document
`review --json` SHALL print the keys `kind`, `adrs` and `prompt`. `kind` SHALL name the prompt: `import`, `sequence`, `review`, `revision`, `revisions` or `supersession`. `prompt` SHALL be the text the text form prints. When there is nothing to review, the document SHALL hold `"kind": "none"`, `"adrs": []` and `"prompt": null`, with exit code `0`.

#### Scenario: A named proposed ADR
- **WHEN** `ontrack review ADR-0002-b --json` names a `proposed` ADR
- **THEN** `kind` is `review`, `adrs` holds that ADR, `prompt` is what `ontrack review ADR-0002-b` prints, and the exit code is `2`

#### Scenario: Revised ADRs
- **WHEN** no ADR is new or proposed and one accepted ADR is revised from 1 to 2
- **THEN** `kind` is `revisions` and the ADR carries `"revision": { "from": 1, "to": 2 }`

#### Scenario: Nothing to review
- **WHEN** every ADR is ruled and the tracks are read
- **THEN** the document has `"kind": "none"`, standard error is empty, and the exit code is `0`
