# json-output Specification

## Purpose
Gives every command a `--json` form: what it reports, and every error, as one JSON document a script, a CI job or a coding agent reads without parsing text.

## Requirements

### Requirement: The --json option
Every `ontrack` subcommand SHALL accept `--json`. With it, the subcommand SHALL print one JSON document on standard output, in place of its text, and SHALL write nothing on standard error unless it fails. The exit code SHALL be the one the text form gives. Without `--json`, no output changes.

#### Scenario: Same exit code
- **WHEN** `ontrack plan --json` runs where one ADR is `revised`
- **THEN** standard output parses as one JSON document, standard error is empty, and the exit code is `2`

#### Scenario: No hint on standard error
- **WHEN** `ontrack plan --json` runs on a project with no track
- **THEN** the document holds, after `$schema`, `"tracks": []`, `"agents": []` and `"pending": false`, and standard error is empty

### Requirement: Stable documents
Every key of a document SHALL be present whatever the case, with `null` or an empty list where the text prints nothing. A path SHALL be relative to the repository, with forward slashes. A later version MAY add a key; it MUST NOT remove a key or change its meaning without a breaking change.

#### Scenario: A moved file
- **WHEN** `ontrack apply --json` moves `docs/adr/mine.md` to `docs/adr/local/`
- **THEN** its action is `{ "kind": "moved", "track": "local", "adr": null, "from": "docs/adr/mine.md", "to": "docs/adr/local/mine.md" }`

### Requirement: The plan document
`plan --json` SHALL print the keys `tracks`, `unresolved`, `agents` and `pending`. A track SHALL hold `namespace`, `adrs`, `rename` and `migration`; an ADR SHALL hold `name`, `title`, `category`, `status`, `revision` and `check`. `adrs` SHALL hold every ADR of the track, the unchanged ones too, whether or not `--all` is given. `unresolved` SHALL hold one `{ "ref", "name" }` per `supersedes:` entry that designates no ADR (see `plan`). `pending` SHALL be `true` when the exit code is `2`.

#### Scenario: A revised ADR
- **WHEN** the track ships `A.md` at revision 2 and the repository accepted it at revision 1
- **THEN** its entry has `"category": "revised"`, `"status": "accepted"` and `"revision": { "from": 1, "to": 2 }`

#### Scenario: A rename
- **WHEN** a rename from `docs/adr/old/` is pending for track `engineering`
- **THEN** the track has `"rename": { "from": "docs/adr/old/", "to": "docs/adr/engineering/" }`

#### Scenario: An unresolved supersedes entry
- **WHEN** `local/ADR-0002-new` is accepted with `supersedes: [ADR-0001-old]`, which designates no ADR
- **THEN** `unresolved` is `[{ "ref": "local/ADR-0002-new", "name": "ADR-0001-old" }]`

### Requirement: The apply document
`apply --json` SHALL print the keys `dryRun`, `actions`, `links`, `supersedes`, `agents`, `remaining`, `next` and `pending`, whether or not there was anything to apply. An action SHALL hold `kind`, `track`, `adr`, `from` and `to`. `remaining` SHALL be what `plan --json` gives under `tracks` once the actions are done, and `next` the numbers of ADRs left to rule (`proposed`) and to rule again (`revised`).

#### Scenario: An import
- **WHEN** `ontrack apply --json` imports `B.md` of track `platform`
- **THEN** `actions` holds one entry of kind `imported`, from `node_modules/platform/adr/B.md` to `docs/adr/platform/B.md`, and `next.proposed` is `1`

#### Scenario: Dry run
- **WHEN** `ontrack apply --dry-run --json` runs on the same project
- **THEN** `dryRun` is `true`, `actions` holds the same entry, and no file is written

#### Scenario: Nothing to apply
- **WHEN** every ADR is up to date
- **THEN** `actions` is empty and `remaining` holds the tracks

### Requirement: The check document
`check --json` SHALL print the keys `results` and `counts`. A result SHALL hold `ref`, `title`, `status`, `path`, `check`, `result` (`pass`, `fail` or `unchecked`) and `output`, the lines a failed command printed. `counts` SHALL hold `fail`, `pass` and `unchecked`.

#### Scenario: A failed check
- **WHEN** an accepted ADR's check prints `no` and exits with `1`
- **THEN** its result has `"result": "fail"` and `"output": ["no"]`, `counts.fail` is `1`, and the exit code is `2`

### Requirement: The instructions document
`instructions --json` SHALL print the keys `hint`, `decided`, `pending` and `block`. A decided ADR SHALL hold `ref`, `title`, `status`, `path` and `traits`, its YAML as one text. `block` SHALL be the text `ontrack instructions` prints.

#### Scenario: Block unchanged
- **WHEN** `ontrack instructions --json` and `ontrack instructions` run on the same repository
- **THEN** `block` equals the standard output of the second

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

### Requirement: The error document
With `--json`, a failure SHALL leave standard output empty and write to standard error one JSON document `{ "error": { "code", "message", "docs" } }`. `code` SHALL be the code of the error (see `cli`, *Error codes*) and `docs` the address of its row on the documentation's page on error messages. Both SHALL be `null` for a failure the command did not foresee. A refused command line SHALL carry `E001`.

#### Scenario: A known failure
- **WHEN** `ontrack plan --json` runs in a directory without a `package.json`
- **THEN** the error has `"code": "E101"` and a `docs` address ending with `#e101`, and the exit code is `1`

#### Scenario: A refused command line
- **WHEN** the user runs `ontrack plann --json`
- **THEN** the error has `"code": "E001"` and a message naming `plann`

#### Scenario: An unforeseen failure
- **WHEN** a subcommand throws an error that has no code, under `--json`
- **THEN** the error has `"code": null` and `"docs": null`

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

### Requirement: The suggest document
`suggest --json` SHALL print the keys `adrs`, `new` and `prompt`. `adrs` SHALL hold the ADRs the repository holds, as the other documents describe an ADR. `new` SHALL hold the ADRs to import, each as `{ path, title }`. `prompt` SHALL be the text the text form prints. The exit code SHALL be `2`.

#### Scenario: A repository with one ADR
- **WHEN** `ontrack suggest --json` runs where the repository holds one `accepted` ADR and the tracks cannot be read
- **THEN** `adrs` holds that ADR, `new` is `[]`, `prompt` is what `ontrack suggest` prints, and the exit code is `2`
